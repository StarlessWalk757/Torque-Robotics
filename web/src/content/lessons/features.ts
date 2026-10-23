import type { Lesson } from "../types";

export const features: Lesson = {
  id: "features",
  unit: "cad",
  title: "Extrude, Revolve, Holes & Fillets",
  minutes: 22,
  summary: "The features that turn sketches into solid parts: extrudes, revolves, holes, fillets, chamfers, patterns and mirrors, and why their order matters.",
  objectives: [
    "Choose an extrude end type and result (New, Add, Remove, Intersect)",
    "Model round parts with Revolve and calculate their volume",
    "Explain when to use the Hole feature, a fillet or a chamfer",
    "Say when to reach for the Hole feature instead of an extruded circle",
  ],
  slides: [
    {
      image: { src: "/img/photo/printed-part.jpg", alt: "A 3D printed plastic part", credit: "U.S. Air Force photo by Airman 1st Class Joseph Barron / Wikimedia Commons (Public domain)" },
      title: "Extrude",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Extrude",
      body: `**Extrude** takes a closed sketch region (a **profile**) and pushes it straight out, perpendicular to the sketch plane. It's the feature you'll use most.

The **end type** says how far it goes:
- **Blind:** a set depth, like 10 mm.
- **Symmetric:** the depth is split evenly on both sides of the sketch plane.
- **Up to** a face, part or vertex: stops at existing geometry, so it updates if that geometry moves.
- **Through all:** goes through everything (used for cuts that must go all the way through).

The **result** says what happens to material that's already there:
- **New** makes a separate part.
- **Add** joins the new solid to an existing part.
- **Remove** cuts the shape away (pockets, slots, holes).
- **Intersect** keeps only where the new shape and the part overlap.`,
      formula: {
        expr: "V = A × d",
        where: [
          ["V", "volume of the extruded solid (mm³)"],
          ["A", "area of the profile (mm²)"],
          ["d", "extrude depth (mm)"],
        ],
      },
      example: {
        problem: "The sensor plate project is a 50 × 30 mm rectangle with two Ø3.4 mm holes, extruded 3 mm. What's its volume?",
        solution: `Rectangle area: 50 × 30 = 1500 mm².

Each hole: π × r² = π × 1.7² ≈ 9.08 mm². Two holes: ≈ 18.16 mm².

Profile area A ≈ 1500 − 18.16 = 1481.84 mm².

V = A × d ≈ 1481.84 × 3 ≈ **4446 mm³** (about 4.45 cm³).`,
      },
    },
    {
      heading: "Revolve",
      body: `**Revolve** spins a profile around an **axis** (a sketch line, often a construction line, or an edge). It's the natural way to model anything round: shafts, wheels, spacers, knobs and pulleys. You can revolve all the way around (360°) or only part way.

Two rules: the profile must be on one side of the axis (it can touch the axis but not cross it), and it must be a closed region. If the profile touches the axis you get a solid part; if there's a gap between the profile and the axis, you get a hole down the middle.

The volume of a revolved part follows **Pappus's centroid theorem**: the area of the profile times the distance its center (**centroid**) travels.`,
      formula: {
        expr: "V = θ × A × r̄        (full turn: V = 2π × A × r̄)",
        where: [
          ["θ", "revolve angle in radians (360° = 2π)"],
          ["A", "profile area (mm²)"],
          ["r̄", "distance from the axis to the profile's centroid (mm)"],
        ],
      },
      example: {
        problem: "The M5 spacer is a rectangle from 2.75 mm to 6 mm away from the axis and 10 mm tall, revolved 360°. Find its volume two ways.",
        solution: `Profile: (6 − 2.75) × 10 = 3.25 × 10 = 32.5 mm². Its centroid is halfway across: r̄ = (2.75 + 6) ÷ 2 = 4.375 mm.

Pappus: V = 2π × 32.5 × 4.375 ≈ **893.4 mm³**.

Check as a tube: V = π × (R² − r²) × L = π × (6² − 2.75²) × 10 = π × 28.4375 × 10 ≈ **893.4 mm³**. The answers match. The outside diameter is 2 × 6 = 12 mm and the hole is 2 × 2.75 = 5.5 mm, just as the project asks.`,
      },
    },
    {
      heading: "The Hole feature",
      body: `You *could* make a hole by sketching a circle and extruding it with Remove. For holes meant for screws, the **Hole** feature is better:
- It places holes on **sketch points**, so one sketch can position several holes.
- It knows **standard sizes** (ISO metric and ANSI inch). Pick the screw size and the fit, and it sets the diameter. For example, the ISO 273 clearance holes for an M3 screw are 3.2 (fine), 3.4 (medium) and 3.6 mm (coarse).
- It makes **counterbores** (a wider, flat-bottomed step, so a socket head screw sits below the surface), **countersinks** (a cone, so a flat head screw sits flush), and **tapped** (threaded) holes.
- Drawings made from the part can show the hole information automatically.

Metric flat head screws use a 90° countersink; inch flat head screws use 82°. If you pick the standard in the Hole feature, you don't have to remember this.`,
      callout: {
        kind: "tip",
        text: "Holes in 3D-printed parts usually come out a little small. For graded CAD projects, model the exact size the spec asks for (Ø3.4 for M3). The printing lesson shows how to handle shrinkage on your own printer.",
      },
    },
    {
      heading: "Fillets and chamfers",
      body: `A **fillet** rounds an edge with a radius. A **chamfer** cuts an edge off at an angle (usually 45°) with a flat face.

They aren't just for looks:
- **Inside corners carry stress.** When a part is loaded, stress piles up at a sharp inside corner, a **stress concentration**. Cracks tend to start there, especially under repeated loads. A fillet spreads the stress along a curve and lowers the peak.
- **Outside edges** are rounded or chamfered to remove sharp edges that cut hands and wires, and to help parts slide together: a small **lead-in chamfer** guides a pin into its hole.

Engineers describe stress concentration with a factor Kₜ. Its value depends on the shape; for sharp inside corners it can be 2 or more, and it drops as the fillet radius grows.`,
      example: {
        problem: "A bracket's plain section carries a nominal stress of 10 MPa. Suppose a sharp inside corner gives Kₜ = 2.5, and adding a fillet brings it down to Kₜ = 1.5. What is the peak stress in each case?",
        solution: `Sharp: σ_max = 2.5 × 10 = **25 MPa**.

Filleted: σ_max = 1.5 × 10 = **15 MPa**.

Same load, same material, 40% lower peak stress, just from rounding a corner. (These Kₜ values are illustrative; real values come from charts or simulation for the exact shape.)`,
      },
    },
  ],
  quiz: [
    {
      q: "You want a round spacer with a hole through its center, made from one rectangle sketched beside an axis. Which feature makes it?",
      choices: ["Extrude", "Revolve", "Fillet", "Mirror"],
      answer: 1,
      explain: "Revolving a rectangle that sits away from the axis sweeps out a tube. The gap between the rectangle and the axis becomes the hole.",
    },
    {
      q: "Which extrude result would you use to cut a slot into an existing part?",
      choices: ["New", "Add", "Intersect", "Remove"],
      answer: 3,
      explain: "Remove subtracts the extruded shape from the part. New makes a separate part, Add joins material, and Intersect keeps only the overlap.",
    },
    {
      q: "Why do engineers put fillets on sharp inside corners of parts that carry load?",
      choices: [
        "Stress concentrates at sharp inside corners, and a fillet spreads it out",
        "Fillets always make parts lighter",
        "Sharp corners can't be exported to STL",
        "The Hole feature requires fillets",
      ],
      answer: 0,
      explain: "A sharp inside corner raises the local peak stress (a stress concentration). Rounding it lowers the peak, so cracks are less likely to start there.",
    },
    {
      q: "A plate is 50 × 30 mm with two Ø3.4 mm through-holes, extruded 3 mm. About what is its volume?",
      choices: ["4,500 mm³", "1,482 mm³", "4,446 mm³", "4,391 mm³"],
      answer: 2,
      explain: "A = 50 × 30 − 2 × π × 1.7² ≈ 1481.8 mm², so V = A × 3 ≈ 4446 mm³. 4,500 forgets the holes, and 1,482 is the area, not the volume.",
    },
    {
      q: "Why use the Hole feature instead of sketching a circle and cutting it with an extrude?",
      choices: [
        "It's the only way to make a hole go all the way through",
        "It knows standard fastener sizes, so you pick \"M3 clearance\" instead of looking up 3.4 mm yourself",
        "Sketched circles can't be dimensioned",
        "It makes the part lighter",
      ],
      answer: 1,
      explain: "Both methods remove the same material, but the Hole feature carries the *intent*: it offers standard clearance and tapped sizes, counterbores and countersinks, and says what the hole is for. An extruded circle is just a round gap.",
    },
  ],
  cadProjects: ["m5-spacer", "sensor-plate", "nema17-mount"],
  inTheField: `Nearly every machined or molded part starts as extrudes and revolves: turned parts like shafts are revolves, and plates and brackets are extrudes with holes and pockets. Engineers pick fillet sizes using stress-concentration data (such as Peterson's charts) and finite-element analysis, and machinists appreciate inside fillets that match a standard cutter radius, since a round end mill can't cut a perfectly sharp inside corner. Standard hole sizes come from standards such as ISO 273 for clearance holes, so parts from different companies bolt together. Designing with patterns and mirrors also makes models faster to update when a requirement changes.`,
  resources: [
    { label: "Onshape Learning Center", url: "https://learn.onshape.com/" },
  ],
};
