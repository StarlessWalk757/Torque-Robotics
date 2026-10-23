package org.torque.cad;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

// one closed outline out of a cross-section. either the edge of the material or a hole in it
//   cx, cy     the centroid, in the slice plane's own 2D coordinates
//   diameter   the real circle diameter when it's round, otherwise the circle of equal area
//   roundness  (biggest radius - smallest) / average. 0 is a perfect circle, under 0.08 counts as round
// points is @JsonIgnore'd -- it can be thousands of pairs and the browser has no use for them
public record Loop(
        boolean hole,
        double area,
        double perimeter,
        double cx,
        double cy,
        double diameter,
        boolean round,
        double roundness,
        @JsonIgnore List<double[]> points) {}
