package org.torque.ai;

import org.torque.cad.CadProject;
import org.torque.cad.Check;
import org.torque.cad.Grader;
import org.torque.cad.MeshReport;

import java.util.List;

// an interface, so the rest of the code never knows whether it's talking to claude or to the offline
// rules. ClaudeMentor and OfflineMentor both implement it, and Grader can't tell the difference
public interface MentorAi {

    // false for the offline one. Grader checks this before awarding any design points, so the offline
    // mentor can't hand out marks it isn't qualified to give
    boolean isLive();

    CadReview reviewCad(CadContext ctx);

    // everything one review needs, in one object, so the signature doesn't grow every time
    record CadContext(CadProject project, MeshReport mesh, List<Check> checks, String unitsWarning,
                      List<Grader.Image> images, String notes) {}
}
