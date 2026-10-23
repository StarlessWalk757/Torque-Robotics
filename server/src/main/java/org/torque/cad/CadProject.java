package org.torque.cad;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.function.Function;

// one graded assignment: the brief, and the code that marks it, held together in one object
//   designPoints  marks the mentor may award for judgement. 0 on every project that's fully measurable
//   nominalSize   intended size, biggest first, only used to spot a wrong-units export
//   checks        a function, mesh in -> scored checks out. @JsonIgnore because a lambda can't be
//                 serialised and the browser doesn't need it anyway -- the marking stays server side
public record CadProject(
        String id,
        int order,
        String title,
        String level,
        String summary,
        List<SpecRow> spec,
        int designPoints,
        String designRubric,
        double[] nominalSize,
        @JsonIgnore Function<MeshReport, List<Check>> checks) {

    public record SpecRow(String label, String value) {}
}
