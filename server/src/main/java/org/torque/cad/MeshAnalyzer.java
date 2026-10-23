package org.torque.cad;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * all the measuring happens here. no model anywhere in this file -- every number a grade is built on is
 * worked out below, so any grade can be argued back to arithmetic.
 *
 * the order isn't arbitrary, each step needs the one before it:
 *   1. bounding box      - the overall size, and a scale for the tolerances below
 *   2. weld the corners  - stl repeats every corner per triangle, so nothing connects until this is done
 *   3. volume + area     - divergence theorem. each triangle + the origin makes a tetrahedron, and the
 *                          signed volumes of all of them add up to the volume of a closed mesh
 *   4. edges             - in a closed solid every edge is used by exactly 2 triangles. 1 = a gap,
 *                          3+ = something non-manifold, both of which mean it won't print
 *   5. through holes     - Euler, V - E + F = 2 - 2g. g (genus) counts handles, and for a part that's
 *                          the number of holes going all the way through. only valid if step 4 passed
 *   6. slice it          - cut with a plane to get flat outlines, then measure hole sizes and positions
 */
public final class MeshAnalyzer {
    private MeshAnalyzer() {}

    public static MeshReport analyze(float[] tri) {
        int triCount = tri.length / 9;

        // ---- 1. bounding box ----------------------------------------------------------------------------------
        // start each min at the largest possible value and each max at the smallest, so the first real
        // point always beats them
        double[] min = {Double.MAX_VALUE, Double.MAX_VALUE, Double.MAX_VALUE};
        double[] max = {-Double.MAX_VALUE, -Double.MAX_VALUE, -Double.MAX_VALUE};
        for (int i = 0; i < tri.length; i += 3) {
            for (int a = 0; a < 3; a++) {
                min[a] = Math.min(min[a], tri[i + a]);
                max[a] = Math.max(max[a], tri[i + a]);
            }
        }
        double[] size = {max[0] - min[0], max[1] - min[1], max[2] - min[2]};
        double diag = Math.sqrt(size[0] * size[0] + size[1] * size[1] + size[2] * size[2]);

        // ---- 2. weld the corners ------------------------------------------------------------------------------
        // stl writes every corner out per triangle, so a cube has 36 corners instead of 8 and nothing
        // knows it's joined to anything. snap them to a grid and anything landing in the same cell is
        // the same point. relative to the diagonal, so this works on a 5 mm part and a 500 mm one
        double eps = Math.max(diag * 1e-6, 1e-9);
        Map<Cell, Integer> ids = new HashMap<>(triCount * 2);
        List<double[]> verts = new ArrayList<>();
        int[] corner = new int[triCount * 3];
        for (int c = 0; c < triCount * 3; c++) {
            double x = tri[c * 3], y = tri[c * 3 + 1], z = tri[c * 3 + 2];
            Cell key = new Cell(Math.round(x / eps), Math.round(y / eps), Math.round(z / eps));
            Integer id = ids.get(key);
            if (id == null) {
                id = verts.size();
                ids.put(key, id);
                verts.add(new double[] {x, y, z});
            }
            corner[c] = id;
        }

        // ---- 3. volume and area -------------------------------------------------------------------------------
        // signed on purpose: a mesh built inside out sums negative, which is how invertedNormals is caught
        double signedVolume = 0, area = 0;
        for (int t = 0; t < triCount; t++) {
            double[] p = verts.get(corner[t * 3]), q = verts.get(corner[t * 3 + 1]), r = verts.get(corner[t * 3 + 2]);
            // shift to the middle of the part first. a part modelled 900 mm from the origin makes huge
            // tetrahedra that nearly cancel, and the small real volume gets lost in the rounding
            double[] a = sub(p, min, size), b = sub(q, min, size), c = sub(r, min, size);
            double[] cr = cross(b, c);
            signedVolume += (a[0] * cr[0] + a[1] * cr[1] + a[2] * cr[2]) / 6.0;
            double[] n = cross(new double[] {b[0] - a[0], b[1] - a[1], b[2] - a[2]}, new double[] {c[0] - a[0], c[1] - a[1], c[2] - a[2]});
            area += Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]) / 2.0;
        }

        // ---- 4. edges, watertightness, orientation -------------------------------------------------------------
        // counted in both directions, because neighbouring triangles should walk a shared edge opposite
        // ways round. same direction twice = one of them is flipped
        Map<Long, int[]> edges = new HashMap<>(triCount * 2); // {forward uses, backward uses, first triangle}
        boolean[] degenerate = new boolean[triCount];
        int faces = 0;
        UnionFind shells = new UnionFind(triCount);
        for (int t = 0; t < triCount; t++) {
            int i0 = corner[t * 3], i1 = corner[t * 3 + 1], i2 = corner[t * 3 + 2];
            // two corners welded together = a triangle with no area. skipped, or it shows up as a fake gap
            if (i0 == i1 || i1 == i2 || i0 == i2) {
                degenerate[t] = true;
                continue;
            }
            faces++;
            int[][] es = {{i0, i1}, {i1, i2}, {i2, i0}};
            for (int[] e : es) {
                long key = edgeKey(e[0], e[1]);
                int[] use = edges.get(key);
                if (use == null) {
                    use = new int[] {0, 0, t};
                    edges.put(key, use);
                } else {
                    shells.union(use[2], t); // shares an edge, so same lump of material
                }
                if (e[0] < e[1]) use[0]++;
                else use[1]++;
            }
        }
        int openEdges = 0, nonManifold = 0, flipped = 0;
        for (int[] use : edges.values()) {
            int total = use[0] + use[1];
            if (total == 1) openEdges++;          // only one triangle on it, so there's a hole in the surface
            else if (total > 2) nonManifold++;    // 3+ faces meeting on one edge, not a real solid
            else if (use[0] != 1) flipped++;      // used twice but the same way round, so one is backwards
        }
        boolean watertight = openEdges == 0 && nonManifold == 0 && faces > 0;

        boolean[] vertexUsed = new boolean[verts.size()];
        Map<Integer, Boolean> roots = new HashMap<>();
        for (int t = 0; t < triCount; t++) {
            if (degenerate[t]) continue;
            roots.put(shells.find(t), true);
            for (int k = 0; k < 3; k++) vertexUsed[corner[t * 3 + k]] = true;
        }
        int usedVerts = 0;
        for (boolean u : vertexUsed) if (u) usedVerts++;
        int shellCount = roots.size();

        // ---- 5. through holes ----------------------------------------------------------------------------------
        // V - E + F = 2 - 2g per closed surface, so across all of them chi = 2*shells - 2*totalGenus
        // rearranged for g. only meaningful on a watertight mesh, hence staying null otherwise
        // the %2 check is a sanity guard: an odd number means the arithmetic didn't come out, don't guess
        Integer throughHoles = null;
        if (watertight) {
            long chi = (long) usedVerts - edges.size() + faces;
            long genus2 = 2L * shellCount - chi;
            if (genus2 >= 0 && genus2 % 2 == 0) throughHoles = (int) (genus2 / 2);
        }

        // ---- 6. slice ------------------------------------------------------------------------------------------
        // which way do the holes run? try all three and keep whichever shows the most. tie goes to the
        // thinnest axis, since that's the way a plate is normally drilled
        Slice best = null;
        if (watertight) {
            for (int axis = 0; axis < 3; axis++) {
                if (size[axis] <= 0) continue;
                // halfway, nudged by an odd 1.37%, so the plane doesn't land exactly on a flat face
                // or a ring of corners, which makes the outlines ambiguous
                Slice s = slice(verts, corner, degenerate, axis, min[axis] + size[axis] * 0.5 + size[axis] * 0.0137);
                if (best == null || s.holes().size() > best.holes().size()
                        || (s.holes().size() == best.holes().size() && size[axis] < size[best.axis()])) {
                    best = s;
                }
            }
        }

        // sorted sizes as well as raw, so a brief can check the shape without caring how it was oriented
        double[] sorted = size.clone();
        Arrays.sort(sorted);
        double[] sortedDesc = {sorted[2], sorted[1], sorted[0]};
        return new MeshReport(triCount, r3(min), r3(max), r3(size), r3(sortedDesc), r3(Math.abs(signedVolume)),
                r3(area), watertight, openEdges, nonManifold, flipped, shellCount, throughHoles,
                signedVolume < 0, best);
    }

    // ==== Slicing ==============================================================================================

    /** cuts with the plane coordinate[axis] == at, returns the closed outlines with holes marked */
    static Slice slice(List<double[]> verts, int[] corner, boolean[] degenerate, int axis, double at) {
        // the other two axes become the flat x/y of the cross-section
        int u = (axis + 1) % 3, v = (axis + 2) % 3;
        Map<Long, double[]> points = new HashMap<>();   // where the plane crosses each cut edge
        Map<Long, long[]> links = new HashMap<>();      // which cut edges are joined, via a shared triangle
        int triCount = corner.length / 3;
        for (int t = 0; t < triCount; t++) {
            if (degenerate[t]) continue;
            int[] c = {corner[t * 3], corner[t * 3 + 1], corner[t * 3 + 2]};
            long[] cut = new long[2];
            int n = 0;
            for (int k = 0; k < 3; k++) {
                int p = c[k], q = c[(k + 1) % 3];
                // one end above the plane and one below means this edge is cut by it
                boolean pAbove = verts.get(p)[axis] >= at, qAbove = verts.get(q)[axis] >= at;
                if (pAbove == qAbove) continue;
                long key = edgeKey(p, q);
                if (!points.containsKey(key)) {
                    double[] a = verts.get(Math.min(p, q)), b = verts.get(Math.max(p, q));
                    double s = (at - a[axis]) / (b[axis] - a[axis]); // 0..1 along the edge, straight line so plain lerp
                    points.put(key, new double[] {a[u] + s * (b[u] - a[u]), a[v] + s * (b[v] - a[v])});
                }
                if (n < 2) cut[n] = key;
                n++;
            }
            // a plane cuts a triangle in exactly 2 places. anything else means it clipped a corner, skip it
            if (n != 2) continue;
            link(links, cut[0], cut[1]); // both ways, so the loop can be walked from either end
            link(links, cut[1], cut[0]);
        }

        // follow the links round until they come back to the start. that's one closed outline
        List<List<double[]>> loops = new ArrayList<>();
        Map<Long, Boolean> seen = new HashMap<>();
        for (Long start : links.keySet()) {
            if (seen.containsKey(start)) continue;
            List<double[]> loop = new ArrayList<>();
            long prev = Long.MIN_VALUE, cur = start;
            boolean closed = false;
            while (true) {
                seen.put(cur, true);
                loop.add(points.get(cur));
                long[] nb = links.get(cur);
                long next = nb[0] != prev ? nb[0] : nb[1];
                if (nb[1] == Long.MIN_VALUE) break; // dead end, surface isn't closed here. drop this one
                if (next == start) {
                    closed = true;
                    break;
                }
                if (seen.containsKey(next)) break;
                prev = cur;
                cur = next;
            }
            if (closed && loop.size() >= 3) loops.add(loop); // only keep real closed loops
        }

        // how many other outlines is this one inside? odd = hole, even = material.
        // works for a hole inside a boss inside a plate, not just the simple case
        List<Loop> outlines = new ArrayList<>(), holes = new ArrayList<>();
        for (int i = 0; i < loops.size(); i++) {
            int depth = 0;
            double[] probe = loops.get(i).get(0);
            for (int j = 0; j < loops.size(); j++) {
                if (i != j && contains(loops.get(j), probe[0], probe[1])) depth++;
            }
            Loop loop = measure(loops.get(i), depth % 2 == 1);
            (loop.hole() ? holes : outlines).add(loop);
        }
        outlines.sort(Comparator.comparingDouble(Loop::area).reversed());
        holes.sort(Comparator.comparingDouble(Loop::diameter).reversed().thenComparingDouble(Loop::cx).thenComparingDouble(Loop::cy));
        return new Slice(axis, r3(at), outlines, holes);
    }

    private static void link(Map<Long, long[]> links, long from, long to) {
        long[] nb = links.computeIfAbsent(from, k -> new long[] {Long.MIN_VALUE, Long.MIN_VALUE});
        if (nb[0] == Long.MIN_VALUE) nb[0] = to;
        else if (nb[1] == Long.MIN_VALUE && nb[0] != to) nb[1] = to;
    }

    // shoelace formula: area and centroid of a polygon straight from its corners
    static Loop measure(List<double[]> pts, boolean hole) {
        int n = pts.size();
        double a2 = 0, cx = 0, cy = 0, perimeter = 0; // a2 is twice the signed area, divided out later
        for (int i = 0; i < n; i++) {
            double[] p = pts.get(i), q = pts.get((i + 1) % n);
            double cr = p[0] * q[1] - q[0] * p[1];
            a2 += cr;
            cx += (p[0] + q[0]) * cr;
            cy += (p[1] + q[1]) * cr;
            perimeter += Math.hypot(q[0] - p[0], q[1] - p[1]);
        }
        double area = Math.abs(a2) / 2;
        if (Math.abs(a2) < 1e-12) { // no area to speak of, centroid would divide by ~0. just average the points
            cx = pts.stream().mapToDouble(p -> p[0]).average().orElse(0);
            cy = pts.stream().mapToDouble(p -> p[1]).average().orElse(0);
        } else {
            cx /= 3 * a2;
            cy /= 3 * a2;
        }
        double minR = Double.MAX_VALUE, maxR = 0, sumR = 0;
        for (double[] p : pts) {
            double r = Math.hypot(p[0] - cx, p[1] - cy);
            minR = Math.min(minR, r);
            maxR = Math.max(maxR, r);
            sumR += r;
        }
        // how much the radius wobbles. a circle barely varies, a square swings a lot
        double meanR = sumR / n;
        double roundness = meanR > 0 ? (maxR - minR) / meanR : 1;
        boolean round = roundness < 0.08;
        // a hole is really a polygon, and its corners sit ON the true circle while the flats cut inside it,
        // so the LARGEST radius is the real one. averaging would under-report every hole by a few hundredths
        // not round: no single diameter exists, so give the circle of the same area instead
        double diameter = round ? 2 * maxR : 2 * Math.sqrt(area / Math.PI);
        List<double[]> copy = new ArrayList<>(pts);
        return new Loop(hole, r3(area), r3(perimeter), r3(cx), r3(cy), r3(diameter), round, r3(roundness), copy);
    }

    // ray casting: fire a ray and count crossings. odd = inside, even = outside
    // the flip is the count, no counter needed
    static boolean contains(List<double[]> poly, double x, double y) {
        boolean inside = false;
        for (int i = 0, j = poly.size() - 1; i < poly.size(); j = i++) {
            double[] a = poly.get(i), b = poly.get(j);
            if ((a[1] > y) != (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
        }
        return inside;
    }

    // nearest distance from a point to the outline. used to check a hole isn't too near the edge,
    // where it would tear out
    public static double distanceToOutline(Loop outline, double x, double y) {
        List<double[]> p = outline.points();
        double best = Double.MAX_VALUE;
        for (int i = 0; i < p.size(); i++) {
            double[] a = p.get(i), b = p.get((i + 1) % p.size());
            double dx = b[0] - a[0], dy = b[1] - a[1];
            double len2 = dx * dx + dy * dy;
            double s = len2 == 0 ? 0 : Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / len2));
            best = Math.min(best, Math.hypot(x - (a[0] + s * dx), y - (a[1] + s * dy)));
        }
        return best;
    }

    // ==== Helpers ==============================================================================================

    // two ints packed into one long, smaller first, so an edge gets the same key whichever way it's
    // walked. means a single HashMap lookup instead of allocating a key object per edge
    private static long edgeKey(int a, int b) {
        int lo = Math.min(a, b), hi = Math.max(a, b);
        return ((long) lo << 32) | (hi & 0xffffffffL);
    }

    private static double[] sub(double[] p, double[] min, double[] size) {
        return new double[] {p[0] - min[0] - size[0] / 2, p[1] - min[1] - size[1] / 2, p[2] - min[2] - size[2] / 2};
    }

    private static double[] cross(double[] a, double[] b) {
        return new double[] {a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]};
    }

    // everything reported gets rounded to 3 decimals. microns of float noise shouldn't reach a student
    static double r3(double x) {
        return Math.round(x * 1000.0) / 1000.0;
    }

    private static double[] r3(double[] xs) {
        double[] out = new double[xs.length];
        for (int i = 0; i < xs.length; i++) out[i] = r3(xs[i]);
        return out;
    }

    // a grid cell for welding. a record so equals and hashCode come free, which is the whole point
    private record Cell(long x, long y, long z) {}

    // union-find, for counting separate lumps. join triangles that share an edge, then the number of
    // distinct roots at the end is the number of shells. 2 shells usually means a stray solid got exported
    private static final class UnionFind {
        private final int[] parent;

        UnionFind(int n) {
            parent = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
        }

        int find(int x) {
            while (parent[x] != x) {
                parent[x] = parent[parent[x]]; // point at the grandparent on the way up, flattens the tree
                x = parent[x];
            }
            return x;
        }

        void union(int a, int b) {
            int ra = find(a), rb = find(b);
            if (ra != rb) parent[ra] = rb;
        }
    }
}
