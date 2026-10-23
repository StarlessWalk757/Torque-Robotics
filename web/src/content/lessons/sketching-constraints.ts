import type { Lesson } from "../types";

export const sketchingConstraints: Lesson = {
  id: "sketching-constraints",
  unit: "cad",
  title: "Sketches, Dimensions & Constraints",
  minutes: 20,
  summary: "Draw 2D sketches on planes, then lock them down with geometric constraints and dimensions until every degree of freedom is gone.",
  objectives: [
    "Pick a sketch plane and anchor a sketch to the origin",
    "Use the main sketch tools, including construction geometry",
    "Apply geometric constraints and dimensions, and say what each one does",
    "Count degrees of freedom and recognize under-, fully and over-defined sketches",
  ],
  slides: [
    {
      image: { src: "/img/photo/cad-screen.jpg", alt: "A CAD program showing a 3D model being built", credit: "Tachymètre (talk) / Wikimedia Commons (Public domain)" },
      title: "Planes and the origin",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Sketch planes and the origin",
      body: `Almost every feature starts from a **sketch**: a 2D drawing on a flat plane. Every Onshape Part Studio begins with three default planes that meet at the **origin**, the point (0, 0, 0):
- **Top** plane: the XY plane (Z points up out of it).
- **Front** plane: the XZ plane.
- **Right** plane: the YZ plane.

Pick the plane that matches how the part sits. A flat plate is usually sketched on the Top plane and extruded up. You can also sketch on any flat face of a part you've already made.

The origin matters because it's a fixed point that never moves. Tying your sketch to it (for example, putting a corner or the center of a rectangle on the origin) is what finally stops the sketch from sliding around.`,
    },
    {
      heading: "Sketch tools",
      body: `The tools you'll use most:
- **Line:** click point to point. Lines chain together, sharing their endpoints.
- **Corner rectangle** and **Center point rectangle:** a rectangle from two opposite corners, or from its center outward. The center point version is great for symmetric parts: start it on the origin.
- **Circle:** click the center, then drag out the radius.
- **Arc:** Onshape has 3-point, tangent and center point arcs.
- **Construction** geometry: lines and circles that are only references, like a centerline, a bolt circle or a diagonal. They're drawn dashed and never become part of the solid.

As you draw, Onshape adds some constraints automatically (for example, Horizontal when you draw a nearly flat line, or Coincident when you click on an existing point). Watch for the small constraint icons that appear.`,
      callout: {
        kind: "tip",
        text: "Keep sketches simple. Round the corners of a part with the Fillet feature after extruding, instead of drawing arcs in the sketch. Simple sketches are easier to constrain and easier to change later.",
      },
    },
    {
      heading: "Geometric constraints",
      body: `A **constraint** is a rule about shape or position. The common ones:
- **Coincident:** two points in the same place, or a point on a line or curve.
- **Horizontal / Vertical:** a line is level, or straight up and down (also works between two points).
- **Parallel / Perpendicular:** two lines run the same direction, or meet at 90°.
- **Tangent:** a line or arc meets a curve smoothly, without a corner.
- **Equal:** two lines have the same length, or two circles the same radius.
- **Concentric:** two circles or arcs share a center.
- **Midpoint:** a point sits at the middle of a line.
- **Symmetric:** two points or entities are mirror images across a line (often a construction centerline).
- **Fix:** freezes an entity exactly where it is.

**Dimensions** set sizes and distances: a length, a diameter, an angle, or the distance between two things. In Onshape you add them with the Dimension tool and type in the value.`,
    },
    {
      heading: "Degrees of freedom",
      body: `A **degree of freedom** (DOF) is one independent way something can move. A point in a 2D sketch has **2**: it can move in x and in y. A circle has **3**: its center's x and y, plus its radius.

Each constraint or dimension removes freedom, usually 1. A Coincident between two points removes 2, because it ties both x and y. When the count reaches zero, the sketch is **fully defined**: nothing can move unless you change a dimension.

Onshape shows the state with color:
- **Blue** geometry is **under-defined**: it can still be dragged.
- **Black** geometry is **fully defined**.
- **Red** means **over-defined**: constraints that fight each other (like two different lengths for the same line), or that repeat what other constraints already force. Delete the extra constraint to fix it.

A constraint only counts if it removes freedom that isn't already removed. If the bottom line is Horizontal and the right line is Vertical, that corner is already 90°, so adding a Perpendicular there is **redundant**: it removes nothing, and CAD programs usually flag it as over-defining.`,
      formula: {
        expr: "DOF left = DOF of the geometry − freedom removed by independent constraints and dimensions",
        where: [
          ["point", "2 DOF (x and y)"],
          ["line", "4 DOF (its two endpoints)"],
          ["circle", "3 DOF (center x, center y, radius)"],
          ["most constraints and dimensions", "remove 1"],
          ["Coincident (point on point), Concentric", "remove 2"],
        ],
      },
      example: {
        problem: "Four lines are joined into a closed loop, then constrained: Horizontal on the top and bottom lines, Vertical on both sides, width 40 mm, height 20 mm, and one corner Coincident with the origin. Count the DOF at each step.",
        solution: `Four separate lines: 4 × 4 = 16 DOF. Joining the four corners with Coincident constraints removes 2 each: 16 − 8 = **8 DOF** (the same as 4 free corner points × 2).

Two Horizontal and two Vertical constraints: 8 − 4 = **4 DOF**. It's now a true rectangle, but it can still slide left-right, slide up-down, and change width and height.

Width 40 and height 20: 4 − 2 = **2 DOF** (it can still slide around).

Corner Coincident with the origin: 2 − 2 = **0 DOF**. Fully defined, and Onshape draws it black.

For the M5 spacer: two circles have 3 + 3 = 6 DOF. Putting both centers on the origin removes 2 + 2, leaving 2. The Ø12 and Ø5.5 dimensions remove the last 2: **fully defined**.`,
      },
    },
  ],
  quiz: [
    {
      q: "How many degrees of freedom does a single free point have in a 2D sketch?",
      choices: ["1", "2", "3", "4"],
      answer: 1,
      explain: "A point in a plane can move in x and in y: 2 degrees of freedom. (A circle has 3: its center's x and y, plus the radius.)",
    },
    {
      q: "Four joined lines have Horizontal constraints on the top and bottom and Vertical constraints on both sides. How many degrees of freedom remain?",
      choices: ["0", "2", "4", "8"],
      answer: 2,
      explain: "4 corner points × 2 = 8, minus 4 for the H and V constraints = 4. It can still slide in x and y and change width and height.",
    },
    {
      q: "In Onshape, what does it mean when sketch geometry turns black?",
      choices: ["The lines are construction geometry", "The sketch has a conflict", "The sketch is fully defined", "The lines are selected"],
      answer: 2,
      explain: "Black means fully defined: zero degrees of freedom. Blue means it can still move, and red means over-defined.",
    },
    {
      q: "The bottom line is Horizontal and the right line is Vertical. You add a Perpendicular constraint between them. What happens?",
      choices: [
        "It removes one more degree of freedom",
        "It removes two degrees of freedom",
        "It rotates the sketch by 90°",
        "It's redundant: H and V already make that corner 90°, so it removes nothing and is flagged as over-defining",
      ],
      answer: 3,
      explain: "A constraint only removes freedom that isn't already removed. Horizontal plus Vertical already force a right angle, so Perpendicular repeats them.",
    },
    {
      q: "Which is the best way to fully define a 40 × 20 mm rectangle for a part that should be symmetric about the origin?",
      choices: [
        "Put a Fix constraint on every corner",
        "Draw a Center point rectangle starting on the origin, then add the 40 and 20 dimensions",
        "Drag the corners until the sizes look right",
        "Dimension all four sides separately",
      ],
      answer: 1,
      explain: "Starting from the origin captures the symmetry, and two dimensions finish it. Fix records no intent, dragging isn't exact, and dimensioning all four sides over-defines the rectangle.",
    },
  ],
  cadProjects: ["first-block", "m5-spacer"],
  inTheField: `A constraint solver sits at the heart of every professional CAD system, working out where sketch geometry must go every time a dimension changes. Engineers fully define sketches as standard practice, and many companies check for it in design reviews, because under-defined geometry can shift silently when a model is edited. Dimensioning from functional datums in CAD matches how drawings are dimensioned under standards such as ASME Y14.5 and ISO GPS, so the model and the drawing tell the same story.`,
  resources: [
    { label: "Onshape Learning Center", url: "https://learn.onshape.com/" },
  ],
};
