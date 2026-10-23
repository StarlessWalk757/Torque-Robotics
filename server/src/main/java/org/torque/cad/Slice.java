package org.torque.cad;

import java.util.List;

// one flat cut through the part. axis 0/1/2 = X/Y/Z, and it's whichever direction turned out to show
// the most holes, so it's normally the way the part was drilled
// both lists come pre-sorted (outlines by area, holes by diameter) so the checks can just take .get(0)
public record Slice(int axis, double at, List<Loop> outlines, List<Loop> holes) {}
