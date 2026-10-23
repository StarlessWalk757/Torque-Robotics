package org.torque.ai;

import org.torque.cad.Check;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * what runs with no api key, and where ClaudeMentor ends up any time a call doesn't come back.
 *
 * everything in here is built out of checks that were already measured, so it can't be wrong, only
 * duller. isLive() stays false on purpose -- that's what stops Grader handing out design points from
 * here, and design really does need judgement this hasn't got.
 *
 * questions get answered by matching keywords against the lesson text. crude, but the worst it can do
 * is quote the lesson back, and it says up front that it's offline.
 */
public class OfflineMentor implements MentorAi {

    // written ahead of time, one per project. real principles, not filler -- if the ai is down the student
    // should still come away with the idea the project was teaching
    static final Map<String, String> principles = Map.of(
            "first-block", "Design intent: in parametric CAD the dimensions drive the geometry. Because you typed 40, 20 and 10 as dimensions instead of dragging lines, anyone can change one number later and the whole part updates correctly.",
            "m5-spacer", "Clearance fits: a hole for a bolt is made slightly larger than the bolt so it slides through. For an M5 bolt, ISO 273 lists 5.3 mm (fine), 5.5 mm (medium) and 5.8 mm (coarse) clearance holes. Engineers pick the fit on purpose, not by guessing.",
            "sensor-plate", "Datums and symmetry: dimensioning the holes from the plate's center (a datum) keeps the pattern symmetric even if the plate size changes. Mating parts line up because both are measured from the same reference.",
            "nema17-mount", "Standard interfaces: NEMA 17 defines the motor's face (a 22 mm boss and M3 holes on a 31 mm square), so a mount designed to the standard fits motors from any manufacturer. Standards are how parts from different companies work together.",
            "chassis-plate", "Stiffness vs. weight: a plate's bending stiffness grows with the cube of its thickness, so a small increase in thickness makes it much stiffer. Cutouts save weight, but leaving enough material around holes and edges keeps the plate from cracking.");

    @Override
    public boolean isLive() {
        return false;
    }

    @Override
    public CadReview reviewCad(CadContext ctx) {
        List<Check> checks = ctx.checks();
        long passed = checks.stream().filter(Check::passed).count();
        List<String> strengths = checks.stream().filter(Check::passed)
                .map(c -> c.label() + ": " + c.measured() + " (target " + c.expected() + ")").toList();
        List<CadReview.Fix> fixes = new ArrayList<>();
        if (ctx.unitsWarning() != null) {
            fixes.add(new CadReview.Fix("Export units", "The whole part is the wrong size, so every dimension check fails.", ctx.unitsWarning()));
        }
        for (Check c : checks) {
            if (!c.passed()) {
                fixes.add(new CadReview.Fix(c.label() + " (measured " + c.measured() + ")",
                        "The spec asks for " + c.expected() + ".", c.fix()));
            }
        }
        String summary = passed == checks.size()
                ? "Every measured requirement passed. This part matches the spec."
                : passed + " of " + checks.size() + " measured requirements passed. Work through the fixes below, then re-export and upload again.";
        String rationale = ctx.project().designPoints() > 0
                ? "The design review needs the AI mentor, which isn't connected right now, so this grade counts only the measured points."
                : "";
        return new CadReview(summary, strengths, fixes, principles.getOrDefault(ctx.project().id(), ""), 0, rationale, "offline");
    }
}
