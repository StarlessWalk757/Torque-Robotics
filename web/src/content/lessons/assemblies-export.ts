import type { Lesson } from "../types";

export const assembliesExport: Lesson = {
  id: "assemblies-export",
  unit: "cad",
  title: "Assemblies, Mates & Exporting STL",
  minutes: 22,
  summary: "Put parts together in an assembly, control how they move with mates, check the fit, and export parts correctly for 3D printing and for other CAD programs.",
  objectives: [
    "Explain the difference between parts, instances and assemblies",
    "Choose a mate and state the degrees of freedom it leaves",
    "Export a correct STL (millimeters, one part per file) and know when to use STEP instead",
  ],
  slides: [
    {
      image: { src: "/img/photo/3d-printer.jpg", alt: "A 3D printer building a part layer by layer", credit: "MukhtaromST / Wikimedia Commons (CC0)" },
      title: "Exporting an STL",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Parts, instances and assemblies",
      body: `A **part** is a single solid body. In Onshape, parts are modeled in a Part Studio, and one Part Studio can hold several parts designed together, like a plate and the bracket that bolts to it.

An **assembly** brings parts together, positions them, and defines how they can move. Each part you insert into an assembly is an **instance**, a reference to the part, not a copy. Insert the same wheel four times and you get four instances; edit the wheel in its Part Studio and all four update.

Before mating anything, **fix** one part (usually the base or frame) so it stays put. Everything else is then mated to it, directly or through other parts.`,
    },
    {
      heading: "Mates and degrees of freedom",
      body: `A free part floating in space has **6 degrees of freedom**: it can slide along X, Y and Z, and rotate about X, Y and Z.

A **mate** connects two parts and takes some of those freedoms away. You place a **mate connector** on each part — a small set of axes on a face, an edge or the centre of a hole — and the mate lines the two up, then allows only certain motion:

- **Fastened:** nothing moves. A bolted bracket.
- **Revolute:** turns about one axis. A wheel on an axle, a hinge, a motor shaft.
- **Slider:** slides along one axis. A drawer slide or a linear rail.
- **Cylindrical:** turns *and* slides. A shaft in a plain bushing.
- **Ball:** turns about all three axes. A ball joint.

Then drag the part. If it moves the way the real mechanism would, your mates are right; if it goes somewhere impossible, they aren't.`,
      formula: {
        expr: "DOF left = 6 − DOF removed by the mate",
        where: [
          ["6", "3 translations + 3 rotations of a free rigid body"],
          ["Revolute", "removes 5, leaves 1"],
          ["Cylindrical", "removes 4, leaves 2"],
        ],
      },
    },
    {
      heading: "Exporting an STL for printing",
      body: `To 3D print a part (or upload it for grading), export it as an **STL** file:

1. In the Part Studio, right-click the part in the **Parts list** and choose **Export**.
2. Set the format to **STL**.
3. Set the units to **Millimeter**.
4. Choose a resolution; **Fine** is a good choice.
5. Export **one part per file**.

An **STL** stores a part as a mesh of flat **triangles**, each listed by its three corner points (plus a direction). Curved surfaces become many small flat facets. That has three consequences:
- **No units.** The file holds plain numbers like 40, with no "mm" attached. Slicers almost always assume millimeters, so exporting in inches turns a 40 mm edge into 1.575, which prints as a 1.575 mm speck.
- **Resolution matters.** Finer settings use more, smaller triangles, so circles are rounder but the file is bigger.
- **The design history is gone.** An STL is a dead shape: no features, no dimensions to edit. Keep the CAD model as the original.`,
      example: {
        problem: "A Ø3.4 mm hole (r = 1.7 mm) is exported with 8 segments around it, or with 16. How far do the flat facets cut inside the true circle?",
        solution: `n = 8: s = 1.7 × (1 − cos 22.5°) = 1.7 × (1 − 0.9239) ≈ **0.13 mm**.

n = 16: s = 1.7 × (1 − cos 11.25°) = 1.7 × (1 − 0.9808) ≈ **0.033 mm**.

The mesh corners sit on the true circle, so the flat sides fall inside it and make the hole slightly smaller. With a coarse export that error (0.13 mm) is more than the ±0.1 mm tolerance on the graded projects. That's one reason to export at a fine resolution.`,
      },
    },
  ],
  quiz: [
    {
      q: "How many degrees of freedom does a Revolute mate leave?",
      choices: ["0", "1", "2", "3"],
      answer: 1,
      explain: "Revolute allows one motion: rotation about the mate connector's Z axis. It removes the other 5 of the 6 freedoms.",
    },
    {
      q: "A shaft must both turn and slide inside a plain bushing. Which mate models that?",
      choices: ["Fastened", "Slider", "Cylindrical", "Revolute"],
      answer: 2,
      explain: "Cylindrical leaves 2 DOF: rotation about Z and translation along Z. Revolute would stop the sliding, and Slider would stop the turning.",
    },
    {
      q: "Why should you set the units to Millimeter when exporting an STL for printing?",
      choices: [
        "STL files store no units, and slicers usually read the numbers as millimeters",
        "Inches make the triangles coarser",
        "Onshape can't export in inches",
        "Millimeters make the part watertight",
      ],
      answer: 0,
      explain: "An STL is just numbers. Exported in inches, a 40 mm edge is written as 1.575, and a slicer that assumes millimeters prints it 25.4 times too small.",
    },
    {
      q: "What is actually inside an STL file?",
      choices: [
        "The sketches and features used to build the part",
        "A photograph of the part from several angles",
        "The part's surface, covered in flat triangles",
        "Instructions telling the printer where to move",
      ],
      answer: 2,
      explain: "An STL is just a bag of triangles covering the outside of the part. It has no sketches, no features and no true curves — a circular hole becomes a many-sided polygon. That's why you export at a fine resolution, and why the grader measures triangles.",
    },
    {
      q: "You export an STL at a coarse resolution. What goes wrong when it's measured or printed?",
      choices: [
        "Nothing: resolution only changes the file size",
        "Round features come out visibly faceted, and a hole can measure smaller than you drew it",
        "The part comes out larger than designed",
        "The file can no longer be opened",
      ],
      answer: 1,
      explain: "A coarse export approximates a circle with very few straight edges. Those edges cut inside the true circle, so the hole is undersize, the surface looks faceted, and a part that is correct in CAD can fail a measurement check.",
    },
  ],
  buildAlong: {
    title: "Print and assemble a NEMA 17 motor mount",
    intro: "Model the NEMA 17 mount project, assemble it in Onshape with real fasteners from Standard Content, then print it and check the fit with real M3 screws. If you have a NEMA 17 stepper motor (many are salvaged from old 3D printers), bolt it on.",
    parts: [
      { id: "pla-filament", qty: 1, note: "or use a school, library or online print service" },
      { id: "m3-hardware", qty: 1, note: "you need 4 × M3 socket head screws, 8 mm long, for a 4 mm plate" },
      { id: "digital-caliper", qty: 1, note: "to measure the bore and hole spacing" },
    ],
    steps: [
      "Model the **nema17-mount** project to its exact spec (50 × 50 × 4 mm plate, Ø22.5 bore, four Ø3.4 holes on a 31 mm square) and grade it until it passes.",
      "Create an **Assembly** tab. Insert the plate and **Fix** it. If you like, model a simple stand-in for the motor in a Part Studio: a 42 mm square block with a Ø22 × 2 mm boss and four holes on the same 31 mm square.",
      "Mate the motor block to the plate with a **Fastened** mate, using mate connectors at the center of the boss and the center of the bore. Drag it: it shouldn't move.",
      "Insert four **M3 × 8 socket head screws** from **Standard Content** and mate each one into a hole with a **Fastened** mate (or Revolute, if you want to spin them). Check that nothing overlaps.",
      "Export the plate alone: right-click it in the Parts list → **Export** → STL, **Millimeter**, Fine resolution. Print it lying flat, with the 50 × 50 face on the bed, so the holes print as vertical circles.",
      "Measure the print with the caliper: plate size, thickness and bore diameter. For hole spacing, measure across the **outside** edges of two holes (A) and across their **inside** edges (B). The center distance is (A + B) ÷ 2. Compare it with 31 mm.",
      "Try an M3 screw in each hole. If they're tight, your printer makes holes undersize. Note by how much: the next lesson covers how to compensate.",
      "Optional: bolt a NEMA 17 motor to the plate with the four M3 × 8 screws. The motor's holes are threaded; the plate's holes are clearance holes. Tighten gently; plastic cracks if you overdo it.",
    ],
    safety: [
      "This build doesn't power the motor. Leave it unplugged.",
      "Let prints cool before removing them; the nozzle and bed get hot enough to burn.",
      "Don't over-tighten screws into plastic parts. Snug is enough.",
    ],
  },
  cadProjects: ["nema17-mount", "chassis-plate"],
  inTheField: `Real products are designed as assemblies with hundreds or thousands of parts, and engineers use mates and motion studies to check that mechanisms like robot arms, landing gear and car suspensions move without colliding. Clash detection in the assembly catches interference before any metal is cut, which is far cheaper than finding it on the factory floor. Companies exchange models with suppliers as STEP files (ISO 10303) and send 2D drawings dimensioned to ASME Y14.5 or ISO standards for manufacturing. STL and 3MF files feed 3D printers everywhere from school labs to aerospace factories printing production parts.`,
  resources: [
    { label: "Onshape Learning Center", url: "https://learn.onshape.com/" },
  ],
};
