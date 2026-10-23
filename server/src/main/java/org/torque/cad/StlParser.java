package org.torque.cad;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Locale;

/**
 * reads an uploaded STL into one flat float array, and everything downstream works off that array.
 *
 * there are two kinds of STL and a file won't reliably tell you which one it is:
 *   binary - 80 byte header, 4 byte triangle count, then exactly 50 bytes per triangle
 *   ascii  - plain text, "solid ... facet ... vertex x y z ..."
 * tried reading the text first and it guesses wrong -- plenty of exporters write "solid" at the top of
 * binary files too. so the size arithmetic goes first instead, because that part can't be faked.
 */
public final class StlParser {
    // a bad or hostile upload shouldn't be able to make the server allocate gigabytes
    static final int maxTriangles = 2_000_000;

    private StlParser() {}

    // 9 floats a triangle: x0 y0 z0 x1 y1 z1 x2 y2 z2. flat rather than objects, so a big mesh stays cheap
    public static float[] parse(byte[] data) {
        if (data == null || data.length < 15) throw new StlException("That file is empty or too small to be an STL.");
        if (looksBinary(data)) return parseBinary(data);

        // only reached if the size arithmetic failed, so now the text is worth trusting
        String head = new String(data, 0, Math.min(data.length, 512), StandardCharsets.US_ASCII).trim().toLowerCase(Locale.ROOT);
        if (head.startsWith("solid")) return parseAscii(data);
        throw new StlException("That doesn't look like an STL file. In Onshape, right-click the part → Export → Format: STL.");
    }

    // the real test: does the stated triangle count exactly account for the file size?
    // header + count field + 50 bytes each. nothing but a real binary stl lands on that number
    private static boolean looksBinary(byte[] data) {
        if (data.length < 84) return false;
        // unsigned, because a count past 2 billion would come back negative as a signed int
        long count = Integer.toUnsignedLong(ByteBuffer.wrap(data, 80, 4).order(ByteOrder.LITTLE_ENDIAN).getInt());
        return count > 0 && 84 + count * 50 == data.length;
    }

    private static float[] parseBinary(byte[] data) {
        // stl is always little endian, java is big endian by default, so this has to be set
        ByteBuffer buf = ByteBuffer.wrap(data).order(ByteOrder.LITTLE_ENDIAN);
        int count = buf.getInt(80);
        if (count > maxTriangles) throw new StlException("That mesh has more than 2 million triangles. Export with a coarser resolution.");

        float[] out = new float[count * 9];
        int pos = 84;
        for (int t = 0; t < count; t++) {
            pos += 12; // the stored normal. skipped on purpose -- exporters get it wrong, so it's
                       // recomputed from the corner order later, which can't lie
            for (int k = 0; k < 9; k++) {
                out[t * 9 + k] = buf.getFloat(pos);
                pos += 4;
            }
            pos += 2; // 2 byte attribute field, unused by basically everything
        }
        checkFinite(out);
        return out;
    }

    private static float[] parseAscii(byte[] data) {
        String text = new String(data, StandardCharsets.US_ASCII);
        // no triangle count in ascii, so start at a guess and grow. split() on a 40 MB file would
        // build millions of throwaway strings, so this walks the text by hand instead
        float[] out = new float[9 * 1024];
        int n = 0;
        int i = 0;
        int len = text.length();

        while (true) {
            int v = text.indexOf("vertex", i);
            if (v < 0) break; // no more corners, done
            i = v + 6;
            for (int k = 0; k < 3; k++) {
                while (i < len && Character.isWhitespace(text.charAt(i))) i++; // skip to the number
                int start = i;
                while (i < len && !Character.isWhitespace(text.charAt(i))) i++; // to the end of it
                if (start == i) throw new StlException("The STL text is damaged near character " + start + ".");

                if (n == out.length) { // full: double it, so growing costs less the bigger it gets
                    if (out.length / 9 >= maxTriangles) throw new StlException("That mesh has more than 2 million triangles.");
                    out = Arrays.copyOf(out, out.length * 2);
                }
                try {
                    out[n++] = Float.parseFloat(text.substring(start, i));
                } catch (NumberFormatException e) {
                    throw new StlException("The STL text has a number it can't read: \"" + text.substring(start, i) + "\".");
                }
            }
        }

        // 9 floats per triangle, so anything else means the file was cut off mid-triangle
        if (n == 0 || n % 9 != 0) throw new StlException("The STL text doesn't contain complete triangles.");
        float[] result = Arrays.copyOf(out, n); // trim the spare slots off the end
        checkFinite(result);
        return result;
    }

    // NaN and infinity would poison every measurement downstream without ever throwing,
    // so they get caught here rather than showing up as a nonsense volume later
    private static void checkFinite(float[] coords) {
        if (coords.length == 0) throw new StlException("The STL has no triangles in it.");
        for (float c : coords) {
            if (!Float.isFinite(c)) throw new StlException("The STL contains invalid (infinite or NaN) coordinates.");
        }
    }

    // anything wrong with the file comes out as this. the messages are written for the student to read,
    // not for a log
    public static class StlException extends RuntimeException {
        public StlException(String message) {
            super(message);
        }
    }
}
