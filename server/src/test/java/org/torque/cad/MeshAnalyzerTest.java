package org.torque.cad;

import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

// shapes built in code rather than loaded from files, so the right answer is known exactly and any
// failure is the analyser's fault, not a dodgy fixture
class MeshAnalyzerTest {

    // a closed box, 12 triangles, wound outward. the simplest thing that should come out watertight
    // with genus 0 -- if this one breaks, nothing else is worth reading
    static float[] box(float w, float h, float d) {
        float[][] v = {{0, 0, 0}, {w, 0, 0}, {w, h, 0}, {0, h, 0}, {0, 0, d}, {w, 0, d}, {w, h, d}, {0, h, d}};
        int[][] f = {{0, 2, 1}, {0, 3, 2}, {4, 5, 6}, {4, 6, 7}, {0, 1, 5}, {0, 5, 4}, {1, 2, 6}, {1, 6, 5}, {2, 3, 7}, {2, 7, 6}, {3, 0, 4}, {3, 4, 7}};
        return faces(v, f);
    }

    // a tube: the simplest shape with exactly one hole through it, so it's the real test of the euler count
    static float[] tube(int n, double R, double r, double L) {
        List<float[]> tris = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            double a0 = 2 * Math.PI * i / n, a1 = 2 * Math.PI * (i + 1) / n;
            float[] o0b = p(R, a0, 0), o1b = p(R, a1, 0), o0t = p(R, a0, L), o1t = p(R, a1, L);
            float[] i0b = p(r, a0, 0), i1b = p(r, a1, 0), i0t = p(r, a0, L), i1t = p(r, a1, L);
            tris.add(cat(o0b, o1b, o1t)); tris.add(cat(o0b, o1t, o0t));       // outer wall
            tris.add(cat(i0b, i1t, i1b)); tris.add(cat(i0b, i0t, i1t));       // inner wall
            tris.add(cat(o0t, o1t, i1t)); tris.add(cat(o0t, i1t, i0t));       // top ring
            tris.add(cat(o0b, i1b, o1b)); tris.add(cat(o0b, i0b, i1b));       // bottom ring
        }
        float[] out = new float[tris.size() * 9];
        for (int i = 0; i < tris.size(); i++) System.arraycopy(tris.get(i), 0, out, i * 9, 9);
        return out;
    }

    @Test
    void measuresABox() {
        MeshReport r = MeshAnalyzer.analyze(box(40, 20, 10));
        assertArrayEquals(new double[] {40, 20, 10}, r.sortedSize(), 1e-6);
        assertEquals(8000, r.volume(), 1e-3);
        assertEquals(2 * (800 + 400 + 200), r.surfaceArea(), 1e-3);
        assertTrue(r.watertight());
        assertEquals(1, r.shells());
        assertEquals(0, r.throughHoles());
        assertFalse(r.invertedNormals());
        assertEquals(0, r.flippedEdges());
    }

    @Test
    void countsAndMeasuresAThroughHole() {
        MeshReport r = MeshAnalyzer.analyze(tube(64, 6, 2.75, 10));
        assertTrue(r.watertight());
        assertEquals(1, r.throughHoles());
        assertEquals(2, r.slice().axis(), "holes run along Z");
        assertEquals(1, r.slice().holes().size());
        Loop hole = r.slice().holes().get(0);
        assertTrue(hole.round());
        assertEquals(5.5, hole.diameter(), 0.01);
        assertEquals(0, hole.cx(), 1e-3);
        assertEquals(12, r.slice().outlines().get(0).diameter(), 0.01);
    }

    @Test
    void detectsAnOpenSurface() {
        float[] full = box(10, 10, 10);
        float[] missingOne = java.util.Arrays.copyOf(full, full.length - 9);
        MeshReport r = MeshAnalyzer.analyze(missingOne);
        assertFalse(r.watertight());
        assertEquals(3, r.openEdges());
        assertNull(r.throughHoles());
        assertNull(r.slice());
    }

    @Test
    void countsSeparateBodies() {
        float[] a = box(10, 10, 10), b = box(5, 5, 5);
        for (int i = 0; i < b.length; i += 3) b[i] += 50;
        float[] both = new float[a.length + b.length];
        System.arraycopy(a, 0, both, 0, a.length);
        System.arraycopy(b, 0, both, a.length, b.length);
        MeshReport r = MeshAnalyzer.analyze(both);
        assertEquals(2, r.shells());
        assertEquals(0, r.throughHoles());
        assertEquals(1125, r.volume(), 1e-3);
    }

    @Test
    void readsAsciiAndBinaryTheSame() {
        float[] tri = box(3, 4, 5);
        StringBuilder sb = new StringBuilder("solid test\n");
        for (int t = 0; t < tri.length / 9; t++) {
            sb.append(" facet normal 0 0 0\n  outer loop\n");
            for (int k = 0; k < 3; k++) sb.append("   vertex ").append(tri[t * 9 + k * 3]).append(' ').append(tri[t * 9 + k * 3 + 1]).append(' ').append(tri[t * 9 + k * 3 + 2]).append('\n');
            sb.append("  endloop\n endfacet\n");
        }
        sb.append("endsolid test\n");
        assertArrayEquals(tri, StlParser.parse(sb.toString().getBytes(StandardCharsets.US_ASCII)));

        java.nio.ByteBuffer buf = java.nio.ByteBuffer.allocate(84 + 50 * (tri.length / 9)).order(java.nio.ByteOrder.LITTLE_ENDIAN);
        byte[] header = "solid but actually binary".getBytes(StandardCharsets.US_ASCII);
        buf.put(header).position(80).putInt(tri.length / 9);
        for (int t = 0; t < tri.length / 9; t++) {
            buf.putFloat(0).putFloat(0).putFloat(0);
            for (int k = 0; k < 9; k++) buf.putFloat(tri[t * 9 + k]);
            buf.putShort((short) 0);
        }
        assertArrayEquals(tri, StlParser.parse(buf.array()));
    }

    @Test
    void rejectsFilesThatArentStl() {
        assertThrows(StlParser.StlException.class, () -> StlParser.parse("hello world, not a mesh".getBytes()));
        assertThrows(StlParser.StlException.class, () -> StlParser.parse(new byte[0]));
    }

    private static float[] faces(float[][] v, int[][] f) {
        float[] out = new float[f.length * 9];
        for (int i = 0; i < f.length; i++) for (int k = 0; k < 3; k++) System.arraycopy(v[f[i][k]], 0, out, i * 9 + k * 3, 3);
        return out;
    }

    private static float[] p(double rad, double a, double z) {
        return new float[] {(float) (rad * Math.cos(a)), (float) (rad * Math.sin(a)), (float) z};
    }

    private static float[] cat(float[] a, float[] b, float[] c) {
        return new float[] {a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]};
    }
}
