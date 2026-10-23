package org.torque.cad;

import org.springframework.stereotype.Service;
import org.torque.ai.CadReview;
import org.torque.ai.MentorAi;

import java.util.List;

/**
 * two layers, and the order they run in is the whole point:
 *   1. measuring settles every measurable point first. MeshAnalyzer measures, the brief's checks compare.
 *      the model doesn't see any of it until it's already decided, so there's nothing for it to move
 *   2. then the mentor reads those finished numbers and writes the words, and on the open-design one
 *      scores the rubric as well -- but never past that project's designPoints
 */
@Service
public class Grader {
    public static final int passPercent = 70; // the web app shows this, so it has to come from here not be retyped

    private final MentorAi mentor;

    public Grader(MentorAi mentor) {
        this.mentor = mentor;
    }

    public GradeResult grade(CadProject project, byte[] stl, List<Image> images, String notes) {
        MeshReport mesh = MeshAnalyzer.analyze(StlParser.parse(stl));
        List<Check> checks = project.checks().apply(mesh); // each brief brings its own checks
        int measured = checks.stream().mapToInt(Check::earned).sum();
        int measuredMax = checks.stream().mapToInt(Check::points).sum();
        String units = unitsWarning(mesh, project.nominalSize());

        CadReview review = mentor.reviewCad(new MentorAi.CadContext(project, mesh, checks, units, images, notes));
        // Integer not int, because null means "not scored at all", which is different from scoring 0
        Integer design = null;
        // the review's own source, not mentor.isLive(). isLive() only says a live mentor is CONFIGURED --
        // if the call failed, these words came from the offline one, which doesn't get to score design
        boolean live = "claude".equals(review.source());
        if (project.designPoints() > 0 && live) {
            // clamped. the model could return anything, and it doesn't get to invent extra marks
            design = Math.max(0, Math.min(project.designPoints(), review.designScore()));
        }
        int total = measured + (design == null ? 0 : design);
        // no mentor = drop the design points out of the TOTAL as well, not just the score. otherwise
        // being offline would quietly cost someone 30 marks they never had a chance at
        int totalMax = measuredMax + (design == null ? 0 : project.designPoints());
        // x100 instead of dividing, so this is integer maths with no rounding to argue about
        boolean passed = total * 100 >= passPercent * totalMax;
        return new GradeResult(project.id(), project.title(), measured, measuredMax, design, project.designPoints(),
                total, totalMax, passed, checks, mesh, units, review, live ? "claude" : "offline");
    }

    // by far the most common upload mistake: exported in inches, so everything fails by exactly 25.4x
    // worth naming, since "all your dimensions are wrong" is useless and "you exported in inches" is fixable
    // compares the longest side against the brief's longest, so it doesn't matter how it was oriented
    static String unitsWarning(MeshReport mesh, double[] nominal) {
        double longest = mesh.sortedSize()[0];
        if (longest <= 0 || nominal == null) return null;
        double ratio = nominal[0] / longest;
        if (near(ratio, 25.4)) return "Your part is about 25.4× too small, so it was probably exported in inches. Re-export with Units: Millimeter.";
        if (near(ratio, 10)) return "Your part is about 10× too small, so it was probably exported in centimeters. Re-export with Units: Millimeter.";
        if (near(ratio, 1000)) return "Your part is about 1000× too small, so it was probably exported in meters. Re-export with Units: Millimeter.";
        if (near(ratio, 1 / 25.4)) return "Your part is about 25.4× too big. Did you type inch values into a millimeter sketch?";
        return null;
    }

    // within 6%, loose on purpose -- the part is probably the wrong shape too, this only has to
    // recognise the unit mistake, not confirm the geometry
    private static boolean near(double ratio, double target) {
        return Math.abs(ratio / target - 1) < 0.06;
    }

    /** one screenshot the student attached (png, jpeg, gif or webp) */
    public record Image(String mediaType, byte[] data) {}
}
