package org.torque.cad;

// everything MeshAnalyzer found, in one object. units are whatever the file used -- mm if it was
// exported properly, which is exactly what Grader's units check is for
//
//   size / sortedSize   raw X Y Z, and the same three biggest-first so a check doesn't care how it was rotated
//   openEdges           used by one triangle only, so there's a gap in the surface
//   nonManifoldEdges    shared by 3+, surfaces meeting in a way a real solid can't
//   flippedEdges        two triangles facing opposite ways, normals inconsistent
//   throughHoles        from euler. Integer not int, because null means "couldn't tell", not zero
//   invertedNormals     whole surface inside out, caught by the volume coming out negative
//   slice               whichever cross-section showed the most holes, null if the mesh wasn't closed
public record MeshReport(
        int triangles,
        double[] min,
        double[] max,
        double[] size,
        double[] sortedSize,
        double volume,
        double surfaceArea,
        boolean watertight,
        int openEdges,
        int nonManifoldEdges,
        int flippedEdges,
        int shells,
        Integer throughHoles,
        boolean invertedNormals,
        Slice slice) {}
