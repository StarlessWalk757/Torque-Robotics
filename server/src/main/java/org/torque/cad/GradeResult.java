package org.torque.cad;

import org.torque.ai.CadReview;

import java.util.List;

// the whole report that goes back to the browser. deliberately keeps the two kinds of marks apart all
// the way through, so a student can always see which part of the grade was measured and which was judged
//   designScore  null, not 0, when the project has no design marks or the mentor was offline
//   unitsWarning set when the part looks exported in inches / cm / m
//   reviewMode   who wrote the feedback, so the page can say so rather than passing it off as the same thing
public record GradeResult(
        String projectId,
        String projectTitle,
        int measuredScore,
        int measuredMax,
        Integer designScore,
        int designMax,
        int total,
        int totalMax,
        boolean passed,
        List<Check> checks,
        MeshReport mesh,
        String unitsWarning,
        CadReview review,
        String reviewMode) {}
