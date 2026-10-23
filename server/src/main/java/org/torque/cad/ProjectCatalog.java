package org.torque.cad;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static org.torque.cad.CadProject.SpecRow;

/**
 * the five graded projects, easiest first. each one carries its own spec and its own checks, the checks
 * as a lambda right beside the brief -- keeping them in the same place is what stops a brief saying one
 * thing while the marking quietly does another.
 *
 * the dimensions are real ones, not invented. matters because someone might actually print these:
 *   Ø3.4 mm  - ISO 273 medium clearance for an M3 screw
 *   Ø5.5 mm  - same for M5
 *   NEMA 17  - Ø22 mm centering boss, four M3 holes on a 31 mm square. that's the actual standard
 *
 * all of it is scored by measurement except 30 points on the last project, which has no one right answer.
 */
@Component
public class ProjectCatalog {
    // ± in mm. positions get more room than sizes because an error in two axes adds up, and because
    // being 0.1 off on where a hole sits matters less than being 0.1 off on how wide it is
    static final double tol = 0.10;
    static final double posTol = 0.15;

    // built once at startup. nothing here changes at runtime, so there's no reason to rebuild it per request
    private final List<CadProject> projects = List.of(firstBlock(), spacer(), sensorPlate(), nemaMount(), chassisPlate());

    public List<CadProject> all() {
        return projects;
    }

    public Optional<CadProject> find(String id) {
        return projects.stream().filter(p -> p.id().equals(id)).findFirst();
    }

    // ==== Projects ============================================================================================

    static CadProject firstBlock() {
        return new CadProject("first-block", 1, "Your First Part: a Gauge Block", "Beginner",
                "Sketch a rectangle, dimension it, and extrude it into a 40 × 20 × 10 mm block. You'll learn the full Onshape → STL → grade workflow.",
                List.of(new SpecRow("Overall size", "40 × 20 × 10 mm (± 0.1)"),
                        new SpecRow("Holes", "None: a solid block"),
                        new SpecRow("Bodies", "One solid part")),
                0, "", new double[] {40, 20, 10},
                r -> {
                    List<Check> c = new ArrayList<>();
                    c.add(watertight(r, 20));
                    c.add(singleBody(r, 10));
                    c.add(overallSize(r, new double[] {40, 20, 10}, 50));
                    c.add(holeCount(r, 0, 20));
                    return c;
                });
    }

    static CadProject spacer() {
        return new CadProject("m5-spacer", 2, "M5 Bolt Spacer", "Beginner",
                "A round spacer that slides over an M5 bolt to hold two robot plates 10 mm apart. Practice circles, concentric constraints, and a through-hole.",
                List.of(new SpecRow("Outer diameter", "Ø12 mm (± 0.1)"),
                        new SpecRow("Length", "10 mm (± 0.1)"),
                        new SpecRow("Center hole", "Ø5.5 mm (± 0.1): ISO 273 medium clearance for M5"),
                        new SpecRow("Hole position", "Concentric with the outside (within 0.15 mm)")),
                0, "", new double[] {12, 12, 10},
                r -> {
                    List<Check> c = new ArrayList<>();
                    c.add(watertight(r, 10));
                    c.add(singleBody(r, 5));
                    Slice s = r.slice();
                    Loop outer = s == null || s.outlines().isEmpty() ? null : s.outlines().get(0);
                    c.add(outer == null
                            ? cannotMeasure("od", "Outer diameter", 20, "Ø12 ± 0.1 mm")
                            : Check.of("od", "Outer diameter", outer.round() && within(outer.diameter(), 12, tol), 20,
                                    "Ø12 ± 0.1 mm", roundText(outer),
                                    "Set the outer circle's diameter dimension to 12 mm in the sketch."));
                    c.add(s == null
                            ? cannotMeasure("length", "Length", 15, "10 ± 0.1 mm")
                            : Check.of("length", "Length (along the hole)", within(r.size()[s.axis()], 10, tol), 15,
                                    "10 ± 0.1 mm", mm(r.size()[s.axis()]),
                                    "Edit the Extrude feature and set its depth to 10 mm."));
                    c.add(holeCount(r, 1, 15));
                    Loop hole = s == null || s.holes().isEmpty() ? null : s.holes().get(0);
                    c.add(hole == null
                            ? cannotMeasure("hole-d", "Hole diameter", 20, "Ø5.5 ± 0.1 mm")
                            : Check.of("hole-d", "Hole diameter", hole.round() && within(hole.diameter(), 5.5, tol), 20,
                                    "Ø5.5 ± 0.1 mm", roundText(hole),
                                    "Dimension the inner circle to 5.5 mm. 5.0 mm would be too tight for an M5 bolt."));
                    c.add(hole == null || outer == null
                            ? cannotMeasure("concentric", "Hole is centered", 15, "offset ≤ 0.15 mm")
                            : Check.of("concentric", "Hole is centered", dist(hole, outer.cx(), outer.cy()) <= posTol, 15,
                                    "offset ≤ 0.15 mm", mm(dist(hole, outer.cx(), outer.cy())) + " offset",
                                    "Add a Concentric constraint between the two circles."));
                    return c;
                });
    }

    static CadProject sensorPlate() {
        return new CadProject("sensor-plate", 3, "Sensor Mounting Plate", "Intermediate",
                "A flat plate that bolts a sensor board onto a robot with two M3 screws. Practice symmetric sketches and hole patterns.",
                List.of(new SpecRow("Plate", "50 × 30 mm (± 0.1), 3 mm thick (± 0.1)"),
                        new SpecRow("Holes", "2 × Ø3.4 mm (± 0.1): ISO 273 medium clearance for M3"),
                        new SpecRow("Hole spacing", "40 mm center-to-center (± 0.15), along the 50 mm side"),
                        new SpecRow("Placement", "Symmetric about the plate center, on the long centerline")),
                0, "", new double[] {50, 30, 3},
                r -> {
                    List<Check> c = new ArrayList<>();
                    c.add(watertight(r, 10));
                    c.add(singleBody(r, 5));
                    c.add(footprint(r, 50, 30, 15));
                    c.add(thickness(r, 3, 10));
                    c.add(holeCount(r, 2, 15));
                    List<Loop> holes = holes(r);
                    c.add(holeDiameters("hole-d", "Both holes Ø3.4 mm", holes, 2, 3.4, 15));
                    if (holes.size() == 2) {
                        double spacing = Math.hypot(holes.get(0).cx() - holes.get(1).cx(), holes.get(0).cy() - holes.get(1).cy());
                        c.add(Check.of("spacing", "Hole spacing", within(spacing, 40, posTol), 15, "40 ± 0.15 mm", mm(spacing),
                                "Dimension the distance between the two hole centers to 40 mm."));
                        double off = centeringError(r, holes);
                        c.add(Check.of("placement", "Holes centered on the plate", off <= posTol, 15,
                                "pattern centered, holes on the long centerline (within 0.15 mm)", mm(off) + " off center",
                                "Draw a construction line through the plate center and add a Symmetric constraint for the two hole centers about the vertical axis."));
                    } else {
                        c.add(cannotMeasure("spacing", "Hole spacing", 15, "40 ± 0.15 mm"));
                        c.add(cannotMeasure("placement", "Holes centered on the plate", 15, "within 0.15 mm"));
                    }
                    return c;
                });
    }

    static CadProject nemaMount() {
        return new CadProject("nema17-mount", 4, "NEMA 17 Stepper Motor Mount", "Intermediate",
                "Design the plate that holds a NEMA 17 stepper motor, the motor inside most 3D printers. You'll match a real industry-standard bolt pattern.",
                List.of(new SpecRow("Plate", "50 × 50 mm (± 0.1), 4 mm thick (± 0.1)"),
                        new SpecRow("Center bore", "Ø22.5 mm (± 0.15): clearance for the motor's Ø22 mm boss"),
                        new SpecRow("Mounting holes", "4 × Ø3.4 mm (± 0.1): M3 clearance"),
                        new SpecRow("Bolt pattern", "31 × 31 mm square (± 0.15), centered on the bore, edges parallel to the plate"),
                        new SpecRow("Bore position", "Centered on the plate (within 0.15 mm)")),
                0, "", new double[] {50, 50, 4},
                r -> {
                    List<Check> c = new ArrayList<>();
                    c.add(watertight(r, 10));
                    c.add(singleBody(r, 5));
                    c.add(footprint(r, 50, 50, 10));
                    c.add(thickness(r, 4, 10));
                    c.add(holeCount(r, 5, 10));
                    List<Loop> holes = holes(r);
                    Loop bore = holes.isEmpty() ? null : holes.get(0);
                    c.add(bore == null
                            ? cannotMeasure("bore", "Center bore Ø22.5 mm", 15, "Ø22.5 ± 0.15 mm")
                            : Check.of("bore", "Center bore Ø22.5 mm", bore.round() && within(bore.diameter(), 22.5, 0.15), 15,
                                    "Ø22.5 ± 0.15 mm", roundText(bore),
                                    "Set the center circle to 22.5 mm. The motor boss is 22 mm, and the extra 0.5 mm is clearance so it slides in."));
                    List<Loop> small = holes.size() > 1 ? holes.subList(1, holes.size()) : List.of();
                    c.add(holeDiameters("mount-d", "Four Ø3.4 mm mounting holes", small, 4, 3.4, 15));
                    if (bore != null && small.size() == 4) {
                        double worst = 0;
                        int quadrants = 0;
                        for (Loop h : small) {
                            double dx = h.cx() - bore.cx(), dy = h.cy() - bore.cy();
                            worst = Math.max(worst, Math.max(Math.abs(Math.abs(dx) - 15.5), Math.abs(Math.abs(dy) - 15.5)));
                            quadrants |= 1 << ((dx > 0 ? 1 : 0) + (dy > 0 ? 2 : 0));
                        }
                        boolean ok = worst <= posTol && quadrants == 0b1111;
                        c.add(Check.of("pattern", "31 mm square bolt pattern", ok, 15,
                                "holes at ±15.5 mm from the bore center, one per corner",
                                quadrants == 0b1111 ? "worst hole is " + mm(worst) + " off" : "holes aren't one per corner",
                                "Draw a 31 mm construction square centered on the bore (Midpoint constraints) and put a hole on each corner."));
                        double[] center = partCenter(r);
                        double off = Math.hypot(bore.cx() - center[0], bore.cy() - center[1]);
                        c.add(Check.of("concentric", "Bore centered on the plate", off <= posTol, 10, "offset ≤ 0.15 mm", mm(off) + " offset",
                                "Constrain the bore's center to the plate's center (e.g. Midpoint on a construction diagonal)."));
                    } else {
                        c.add(cannotMeasure("pattern", "31 mm square bolt pattern", 15, "±15.5 mm from center"));
                        c.add(cannotMeasure("concentric", "Bore centered on the plate", 10, "offset ≤ 0.15 mm"));
                    }
                    return c;
                });
    }

    static CadProject chassisPlate() {
        return new CadProject("chassis-plate", 5, "Robot Chassis Base Plate (Open Design)", "Challenge",
                "Design the base plate for a small two-wheel robot. The rules below are measured automatically; the AI mentor reviews your layout and your explanation of your design choices.",
                List.of(new SpecRow("Footprint", "Fits within 160 × 120 mm"),
                        new SpecRow("Thickness", "3 to 5 mm"),
                        new SpecRow("Fastener holes", "At least 6 round holes between Ø3.0 and Ø5.5 mm (M3 to M5 clearance)"),
                        new SpecRow("Edge margin", "Every hole or cutout keeps at least 1.5 mm of material to the outer edge"),
                        new SpecRow("Walls between holes", "At least 1.5 mm of material between any two holes or cutouts"),
                        new SpecRow("Design review", "30 points from the AI mentor: motor/caster/battery layout, balance, weight-saving, explanation")),
                30,
                """
                Award up to 30 points for design judgment, using only what the screenshots, the measurements and the \
                student's explanation actually show:
                - 10: Layout makes sense for a two-wheel differential-drive robot: two motor mounts placed symmetrically \
                  on a common axis, a caster/skid point, and space for a battery and microcontroller.
                - 8: Balance and structure: mass roughly centered between wheels and caster, no long thin unsupported \
                  sections, fillets or chamfers where corners would crack or snag.
                - 6: Weight-saving or wiring cutouts used sensibly without weakening the plate.
                - 6: The written explanation shows design intent (why holes are where they are, which fasteners are used).
                If there are no screenshots and no explanation, award at most 6 points and say what was missing.""",
                new double[] {160, 120, 4},
                r -> {
                    List<Check> c = new ArrayList<>();
                    c.add(watertight(r, 10));
                    c.add(singleBody(r, 5));
                    double[] s = r.sortedSize();
                    boolean fits = s[0] <= 160.05 && s[1] <= 120.05;
                    c.add(Check.of("footprint", "Fits within 160 × 120 mm", fits, 10, "≤ 160 × 120 mm",
                            mm(s[0]) + " × " + mm(s[1]), "Shrink the outline so the longest side is ≤ 160 mm and the other ≤ 120 mm."));
                    c.add(Check.of("thickness", "Thickness 3–5 mm", s[2] >= 2.95 && s[2] <= 5.05, 10, "3 to 5 mm", mm(s[2]),
                            "Set the Extrude depth between 3 and 5 mm. Thinner plates flex; thicker ones waste material."));
                    List<Loop> holes = holes(r);
                    long fastener = holes.stream().filter(h -> h.round() && h.diameter() >= 2.95 && h.diameter() <= 5.6).count();
                    c.add(Check.of("fasteners", "At least 6 fastener holes", fastener >= 6, 15, "≥ 6 round holes Ø3.0–Ø5.5 mm",
                            fastener + " found", "Add clearance holes for your motor brackets, caster and electronics (Ø3.4 for M3 is the most common)."));
                    Slice slice = r.slice();
                    if (slice != null && !slice.outlines().isEmpty()) {
                        Loop outer = slice.outlines().get(0);
                        double edge = holes.stream().mapToDouble(h -> gap(h, outer)).min().orElse(Double.NaN);
                        c.add(Check.of("edge", "Edge margin ≥ 1.5 mm", holes.isEmpty() || edge >= 1.5, 10, "≥ 1.5 mm",
                                holes.isEmpty() ? "no holes" : mm(edge) + " (tightest)",
                                "Move the hole closest to the edge inward. Thin edges crack when the screw is tightened."));
                        double wall = Double.NaN;
                        for (int i = 0; i < holes.size(); i++)
                            for (int j = i + 1; j < holes.size(); j++) {
                                double g = gap(holes.get(i), holes.get(j));
                                wall = Double.isNaN(wall) ? g : Math.min(wall, g);
                            }
                        c.add(Check.of("walls", "Walls between holes ≥ 1.5 mm", Double.isNaN(wall) || wall >= 1.5, 10, "≥ 1.5 mm",
                                Double.isNaN(wall) ? "fewer than 2 holes" : mm(wall) + " (thinnest)",
                                "Spread out the two closest holes or cutouts so at least 1.5 mm of plastic separates them."));
                    } else {
                        c.add(cannotMeasure("edge", "Edge margin ≥ 1.5 mm", 10, "≥ 1.5 mm"));
                        c.add(cannotMeasure("walls", "Walls between holes ≥ 1.5 mm", 10, "≥ 1.5 mm"));
                    }
                    return c;
                });
    }

    // ==== Shared checks ========================================================================================

    // ---- the checks the briefs share. each returns one Check, all or nothing ----

    // first check on every project, because nothing else can be trusted if this one fails
    static Check watertight(MeshReport r, int points) {
        String measured = r.watertight()
                ? "closed solid"
                : r.openEdges() + " open edge(s), " + r.nonManifoldEdges() + " non-manifold edge(s)";
        return Check.of("watertight", "Closed (watertight) solid", r.watertight(), points, "no gaps in the surface", measured,
                "Export a solid Part, not a sketch or surface. In Onshape: right-click the part in the Parts list → Export → STL.");
    }

    static Check singleBody(MeshReport r, int points) {
        return Check.of("single-body", "One single part", r.shells() == 1, points, "1 body", r.shells() + (r.shells() == 1 ? " body" : " bodies"),
                "Your file has separate pieces. Extrude with the \"Add\" option (not \"New\"), or combine parts with Boolean → Union.");
    }

    // sorted sizes on both sides, so a part modelled lying down still passes. the brief cares about the
    // shape, not which way up it was drawn
    static Check overallSize(MeshReport r, double[] expectedDesc, int points) {
        double[] s = r.sortedSize();
        boolean ok = within(s[0], expectedDesc[0], tol) && within(s[1], expectedDesc[1], tol) && within(s[2], expectedDesc[2], tol);
        return Check.of("size", "Overall size", ok, points,
                fmt(expectedDesc[0]) + " × " + fmt(expectedDesc[1]) + " × " + fmt(expectedDesc[2]) + " mm (± 0.1)",
                fmt(s[0]) + " × " + fmt(s[1]) + " × " + fmt(s[2]) + " mm",
                "Check the sketch dimensions and the extrude depth. Every value should be typed in exactly.");
    }

    static Check footprint(MeshReport r, double a, double b, int points) {
        double[] s = r.sortedSize();
        return Check.of("footprint", "Plate outline", within(s[0], a, tol) && within(s[1], b, tol), points,
                fmt(a) + " × " + fmt(b) + " mm (± 0.1)", fmt(s[0]) + " × " + fmt(s[1]) + " mm",
                "Dimension the rectangle in your sketch to exactly " + fmt(a) + " × " + fmt(b) + " mm.");
    }

    static Check thickness(MeshReport r, double t, int points) {
        double s = r.sortedSize()[2];
        return Check.of("thickness", "Thickness", within(s, t, tol), points, fmt(t) + " ± 0.1 mm", mm(s),
                "Edit the Extrude feature and set the depth to " + fmt(t) + " mm.");
    }

    // counted two completely different ways and both have to agree: euler's formula on the whole surface,
    // and the outlines in the slice. a blind hole fools the slice but not euler, and a hole parallel to the
    // cut plane fools euler but not the slice. needing both means neither mistake scores
    static Check holeCount(MeshReport r, int expected, int points) {
        Integer genus = r.throughHoles();
        int seen = r.slice() == null ? -1 : r.slice().holes().size();
        boolean ok = genus != null && genus == expected && (expected == 0 || seen == expected);
        String measured = genus == null ? "can't count (surface not closed)" : genus + " through-hole(s)";
        return Check.of("hole-count", expected == 0 ? "Solid (no holes)" : expected + " through-hole(s)", ok, points,
                String.valueOf(expected), measured,
                expected == 0 ? "Remove any holes or cutouts; this part should be solid."
                        : "Make sure there are exactly " + expected + " holes and each goes all the way through (Extrude → Remove → Through all).");
    }

    static Check holeDiameters(String id, String label, List<Loop> holes, int count, double d, int points) {
        if (holes.size() != count) return cannotMeasure(id, label, points, "Ø" + fmt(d) + " ± 0.1 mm");
        // worst hole decides it, not the average -- one bad hole and the screw doesn't fit
        // a hole that isn't round gets MAX_VALUE, so it can never pass by accident
        double worst = holes.stream().mapToDouble(h -> h.round() ? Math.abs(h.diameter() - d) : Double.MAX_VALUE).max().orElse(0);
        String measured = String.join(", ", holes.stream().map(ProjectCatalog::roundText).toList());
        return Check.of(id, label, worst <= tol, points, "Ø" + fmt(d) + " ± 0.1 mm", measured,
                "Use the Hole tool or dimension each circle to " + fmt(d) + " mm.");
    }

    // used when an earlier failure makes this one unmeasurable. says so plainly instead of reporting a
    // wrong number, and points at the check that actually has to be fixed first
    static Check cannotMeasure(String id, String label, int points, String expected) {
        return Check.of(id, label, false, points, expected, "couldn't be measured",
                "Fix the checks above first (closed solid, correct number of holes). Then this can be measured.");
    }

    // ==== Geometry helpers =====================================================================================

    static List<Loop> holes(MeshReport r) {
        if (r.slice() == null) return List.of();
        List<Loop> h = new ArrayList<>(r.slice().holes());
        h.sort(Comparator.comparingDouble(Loop::diameter).reversed());
        return h;
    }

    // middle of the part in the slice plane's own 2D coordinates
    static double[] partCenter(MeshReport r) {
        int u = (r.slice().axis() + 1) % 3, v = (r.slice().axis() + 2) % 3;
        return new double[] {(r.min()[u] + r.max()[u]) / 2, (r.min()[v] + r.max()[v]) / 2};
    }

    // how far off-centre the hole pattern sits. two things, whichever is worse:
    //   a) the middle of the pattern vs the middle of the plate
    //   b) any hole wandering off the long centreline
    // deliberately says nothing about the SPACING between holes, which is its own check. otherwise one
    // spacing mistake would fail two checks and cost double
    static double centeringError(MeshReport r, List<Loop> holes) {
        int u = (r.slice().axis() + 1) % 3, v = (r.slice().axis() + 2) % 3;
        boolean uLong = r.size()[u] >= r.size()[v];
        double[] c = partCenter(r);
        double mx = 0, my = 0, across = 0;
        for (Loop h : holes) {
            mx += h.cx() / holes.size();
            my += h.cy() / holes.size();
            across = Math.max(across, Math.abs(uLong ? h.cy() - c[1] : h.cx() - c[0]));
        }
        return Math.max(Math.hypot(mx - c[0], my - c[1]), across);
    }

    // closest approach between two outlines. checked both directions, since the nearest point of A to B
    // isn't always the nearest point of B to A
    static double gap(Loop a, Loop b) {
        double best = Double.MAX_VALUE;
        for (double[] p : a.points()) best = Math.min(best, MeshAnalyzer.distanceToOutline(b, p[0], p[1]));
        for (double[] p : b.points()) best = Math.min(best, MeshAnalyzer.distanceToOutline(a, p[0], p[1]));
        return best;
    }

    static double dist(Loop h, double x, double y) {
        return Math.hypot(h.cx() - x, h.cy() - y);
    }

    // the 1e-9 is for float rounding. without it something measuring exactly on the tolerance can fail
    // by a millionth of a millimetre, which would be impossible to explain to anyone
    static boolean within(double measured, double target, double tol) {
        return Math.abs(measured - target) <= tol + 1e-9;
    }

    static String roundText(Loop l) {
        return l.round() ? "Ø" + fmt(l.diameter()) + " mm" : "not round (≈Ø" + fmt(l.diameter()) + ")";
    }

    static String mm(double x) {
        return fmt(x) + " mm";
    }

    // 2 decimals, then strip trailing zeros, so it reads "40" and "3.4" rather than "40.00" and "3.40"
    // Locale.ROOT or this prints "3,4" on a machine set to a comma locale
    static String fmt(double x) {
        String s = String.format(Locale.ROOT, "%.2f", x);
        if (s.contains(".")) s = s.replaceAll("0+$", "").replaceAll("\\.$", "");
        return s;
    }
}
