package org.torque.cad;

import org.junit.jupiter.api.Test;
import org.torque.ai.CadReview;
import org.torque.ai.MentorAi;
import org.torque.ai.OfflineMentor;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

// end to end on the real sample STLs, which were made by an actual CAD-ish pipeline rather than written
// here. means the parser, the analyser and the checks all get exercised against files with the quirks a
// real exporter leaves behind
class GraderTest {
    private final ProjectCatalog catalog = new ProjectCatalog();
    private final Grader grader = new Grader(new OfflineMentor());

    private GradeResult grade(String project, String file) throws IOException {
        return grade(grader, project, file);
    }

    private GradeResult grade(Grader g, String project, String file) throws IOException {
        try (InputStream in = getClass().getResourceAsStream("/stl/" + file)) {
            assertNotNull(in, file);
            return g.grade(catalog.find(project).orElseThrow(), in.readAllBytes(), List.of(), "");
        }
    }

    // a configured mentor whose call didn't make it, so the words came from the fallback. that's what
    // a timeout or a refused request actually looks like from Grader's side
    private static final class MentorThatFellBack implements MentorAi {
        private final OfflineMentor fallback = new OfflineMentor();

        @Override
        public boolean isLive() {
            return true;
        }

        @Override
        public CadReview reviewCad(CadContext ctx) {
            return fallback.reviewCad(ctx);
        }
    }

    private static Map<String, Boolean> byId(GradeResult r) {
        return r.checks().stream().collect(Collectors.toMap(Check::id, Check::passed));
    }

    @Test
    void everyProjectsPointsAddUpTo100() {
        for (CadProject p : catalog.all()) {
            MeshReport empty = MeshAnalyzer.analyze(MeshAnalyzerTest.box(1, 1, 1));
            int measured = p.checks().apply(empty).stream().mapToInt(Check::points).sum();
            assertEquals(100, measured + p.designPoints(), p.id());
        }
    }

    @Test
    void correctPartsScoreFullMarks() throws IOException {
        for (String[] c : new String[][] {{"first-block", "first-block.stl"}, {"m5-spacer", "m5-spacer.stl"},
                {"sensor-plate", "sensor-plate.stl"}, {"nema17-mount", "nema17-mount.stl"}}) {
            GradeResult r = grade(c[0], c[1]);
            assertEquals(100, r.measuredScore(), c[0] + " " + r.checks());
            assertTrue(r.passed());
            assertNull(r.unitsWarning());
            assertEquals("offline", r.reviewMode());
            assertTrue(r.review().fixes().isEmpty());
        }
    }

    @Test
    void measuresTheNemaMountPrecisely() throws IOException {
        GradeResult r = grade("nema17-mount", "nema17-mount.stl");
        assertEquals(5, r.mesh().throughHoles());
        List<Loop> holes = ProjectCatalog.holes(r.mesh());
        assertEquals(22.5, holes.get(0).diameter(), 0.02);
        for (Loop h : holes.subList(1, 5)) assertEquals(3.4, h.diameter(), 0.02);
    }

    @Test
    void catchesDeliberateMistakes() throws IOException {
        GradeResult r = grade("sensor-plate", "sensor-plate-mistakes.stl");
        Map<String, Boolean> c = byId(r);
        assertTrue(c.get("watertight"));
        assertTrue(c.get("footprint"));
        assertTrue(c.get("hole-count"));
        assertFalse(c.get("hole-d"), "Ø3.0 holes have no clearance for M3");
        assertFalse(c.get("spacing"), "38 mm is not 40 mm");
        assertFalse(c.get("placement"));
        assertEquals(55, r.measuredScore());
        assertFalse(r.passed());
        assertEquals(3, r.review().fixes().size());
    }

    @Test
    void wrongProjectFails() throws IOException {
        GradeResult r = grade("nema17-mount", "sensor-plate.stl");
        assertFalse(r.passed());
    }

    @Test
    void spotsInchExports() throws IOException {
        GradeResult r = grade("first-block", "first-block-inches.stl");
        assertNotNull(r.unitsWarning());
        assertTrue(r.unitsWarning().contains("inches"));
        assertFalse(byId(r).get("size"));
    }

    @Test
    void openDesignChassisPassesMeasuredRulesAndLeavesDesignToTheMentor() throws IOException {
        GradeResult r = grade("chassis-plate", "chassis-plate.stl");
        assertEquals(70, r.measuredScore(), r.checks().toString());
        assertEquals(12, r.mesh().throughHoles());
        assertNull(r.designScore(), "offline mode never invents a design score");
        assertEquals(70, r.totalMax());
        assertTrue(r.passed());
    }

    // used to score design 0/30 and total 70/100: the old check asked whether a mentor was CONFIGURED,
    // not whether one actually wrote the review, so a failed call quietly cost 30 marks
    @Test
    void aFailedModelCallCostsNoDesignPoints() throws IOException {
        GradeResult r = grade(new Grader(new MentorThatFellBack()), "chassis-plate", "chassis-plate.stl");
        assertEquals("offline", r.reviewMode(), "the page has to say who really wrote it");
        assertNull(r.designScore(), "nothing reviewed the design, so it isn't scored");
        assertEquals(70, r.totalMax(), "the design marks come out of the total too");
        assertTrue(r.passed());
    }

    @Test
    void unitsHeuristic() {
        MeshReport cm = MeshAnalyzer.analyze(MeshAnalyzerTest.box(4, 2, 1));
        assertTrue(Grader.unitsWarning(cm, new double[] {40, 20, 10}).contains("centimeters"));
        MeshReport ok = MeshAnalyzer.analyze(MeshAnalyzerTest.box(40.05f, 20, 10));
        assertNull(Grader.unitsWarning(ok, new double[] {40, 20, 10}));
    }
}
