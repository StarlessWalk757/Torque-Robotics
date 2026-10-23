package org.torque.ai;

import java.util.List;

// the written half of a grade. never the measured half -- nothing in here can change a Check
//   principle    one real engineering idea the project was teaching, tied to what they actually made
//   designScore  only used on projects that have design marks, and Grader clamps it before it counts
//   source       "claude" or "offline", so the page can be honest about where the words came from
public record CadReview(
        String summary,
        List<String> strengths,
        List<Fix> fixes,
        String principle,
        int designScore,
        String designRationale,
        String source) {

    // one thing to improve: what's wrong, why that matters, and the actual Onshape steps to put it right
    public record Fix(String issue, String why, String howInOnshape) {}
}
