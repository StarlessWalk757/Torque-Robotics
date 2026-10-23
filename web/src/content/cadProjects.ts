// Step-by-step Onshape instructions for each graded CAD project. The exact numbers that get graded live
// on the server (ProjectCatalog.java) and are shown from there, so they can never disagree with the grader.
import type { Rich } from "./types";

export interface CadProjectGuide {
  id: string;
  title: string;
  skills: string[];
  lessons: string[];          // lesson ids to review first
  steps: Rich[];
  realWorld: Rich;
  samples: { file: string; label: string }[];
}

const exportStep =
  "**Export:** in the Parts list (bottom left), right-click your part → **Export**. Set **Format: STL**, **STL format: Binary**, **Units: Millimeter**, **Resolution: Fine**, then click Export and save the file.";

const screenshotStep =
  "Optional but recommended: take a screenshot of your part and one of your sketch (with dimensions visible). The AI mentor uses them to comment on things the measurements can't show.";

export const cadGuides: CadProjectGuide[] = [
  {
    id: "first-block",
    title: "Your First Part: a Gauge Block",
    skills: ["Creating a Part Studio", "Sketch on a plane", "Center point rectangle", "Dimensions", "Extrude", "STL export"],
    lessons: ["sketching-constraints"],
    steps: [
      "Sign in to Onshape and click **Create → Document**. Name it \"Torque projects\". You'll land in a **Part Studio**.",
      "Click **Sketch**, then click the **Top** plane in the graphics area (or in the Feature list).",
      "Choose **Center point rectangle**. Click the **origin** first (so the block is centered on it), then click again to finish the rectangle.",
      "Choose **Dimension** (shortcut **D**). Click the top edge, place the dimension, and type **40**. Dimension a side edge and type **20**. The lines should turn black: the sketch is fully defined.",
      "Click the green check to close the sketch. Choose **Extrude**, select the rectangle region, set the depth to **10 mm**, and confirm.",
      exportStep,
      "Come back here, upload the STL, and click **Grade my part**.",
    ],
    realWorld: "Machinists use precision **gauge blocks** to calibrate measuring tools. The same principle applies here: an exact, known size you can check.",
    samples: [
      { file: "first-block.stl", label: "Correct block" },
      { file: "first-block-inches.stl", label: "Exported in inches (mistake)" },
    ],
  },
  {
    id: "m5-spacer",
    title: "M5 Bolt Spacer",
    skills: ["Circles", "Concentric constraint", "Extruding a region with a hole", "Clearance holes"],
    lessons: ["sketching-constraints", "features"],
    steps: [
      "Create a new **Part Studio** tab (the + button at the bottom left → Create Part Studio).",
      "Start a **Sketch** on the **Top** plane. Draw a **Circle** centered on the origin, and a second, smaller circle also centered on the origin.",
      "Dimension the outer circle **12 mm** and the inner circle **5.5 mm** (Onshape dimensions circles by diameter). If a circle's center isn't on the origin, add a **Coincident** or **Concentric** constraint.",
      "Close the sketch. **Extrude** only the ring-shaped region between the circles to **10 mm**. The inner circle becomes a through-hole.",
      "Why 5.5 mm and not 5.0? An M5 bolt is 5 mm across its threads. ISO 273 lists 5.5 mm as the medium clearance hole, so the bolt slides in without binding.",
      exportStep,
      "Upload the STL here and grade it.",
    ],
    realWorld: "Spacers and standoffs hold circuit boards and plates at exact distances in almost every robot, computer and appliance.",
    samples: [{ file: "m5-spacer.stl", label: "Correct spacer" }],
  },
  {
    id: "sensor-plate",
    title: "Sensor Mounting Plate",
    skills: ["Symmetric constraint", "Construction lines", "Hole spacing from a datum", "Thin plates"],
    lessons: ["sketching-constraints", "features", "measurement"],
    steps: [
      "New Part Studio → **Sketch** on **Top**. Draw a **Center point rectangle** from the origin and dimension it **50 × 30 mm**.",
      "Draw a horizontal **construction line** (select the line and press **Q**) through the origin, across the long direction.",
      "Draw two **Circles** with their centers on that construction line. Draw a short vertical **construction line** through the origin, then add a **Symmetric** constraint: select the two circle centers and that vertical line (the line of symmetry).",
      "Dimension the distance between the two circle centers: **40 mm**. Give one circle a diameter of **3.4 mm** and add an **Equal** constraint so the other matches.",
      "Close the sketch and **Extrude** the plate region to **3 mm**. The circles become holes.",
      "Tip: dimensioning from the center (a **datum**) keeps the holes symmetric even if you later change the plate size. That's design intent.",
      exportStep,
      screenshotStep,
    ],
    realWorld: "Sensor boards (like the HC-SR04) come with mounting holes. Engineers design brackets to match them using the hole spacing on the board's drawing.",
    samples: [
      { file: "sensor-plate.stl", label: "Correct plate" },
      { file: "sensor-plate-mistakes.stl", label: "Plate with 3 mistakes" },
    ],
  },
  {
    id: "nema17-mount",
    title: "NEMA 17 Stepper Motor Mount",
    skills: ["Industry-standard interfaces", "Square bolt patterns", "Midpoint constraints", "Large bores"],
    lessons: ["features", "assemblies-export", "motors"],
    steps: [
      "New Part Studio → **Sketch** on **Top**. **Center point rectangle** from the origin, dimensioned **50 × 50 mm**.",
      "Draw a **Circle** at the origin with a diameter of **22.5 mm**. This bore clears the motor's 22 mm centering boss.",
      "Draw a second **Center point rectangle** from the origin and make it **construction** (Q). Dimension it **31 × 31 mm**. This is the NEMA 17 bolt pattern.",
      "Draw a small **Circle** on each corner of the construction square (the centers snap to the corners). Dimension one **3.4 mm** and make the other three **Equal** to it.",
      "Close the sketch and **Extrude** the plate region to **4 mm**.",
      "Optional: add **Fillets** of 3–5 mm to the four outer vertical edges. Rounded corners are stronger and safer to handle.",
      exportStep,
      screenshotStep,
    ],
    realWorld: "NEMA 17 is a standard frame size from the National Electrical Manufacturers Association. Almost every hobby 3D printer and CNC machine uses these motors, so a mount built to the standard fits motors from any manufacturer.",
    samples: [{ file: "nema17-mount.stl", label: "Correct mount" }],
  },
  {
    id: "chassis-plate",
    title: "Robot Chassis Base Plate",
    skills: ["Open-ended design", "Layout for a real robot", "Edge distance and wall thickness", "Explaining design intent"],
    lessons: ["differential-drive", "assemblies-export"],
    steps: [
      "Plan first: sketch on paper where the two motors (on one axle line), the caster, the battery pack and the Arduino go. Decide which screws you'll use (M3 is typical: Ø3.4 mm holes).",
      "In a new Part Studio, sketch the plate outline within **160 × 120 mm**. Consider rounded corners (**Sketch fillet**) to avoid sharp points.",
      "Add clearance holes for the motor brackets, caster and electronics standoffs. Use construction lines and **Symmetric** constraints so the motors line up on one axle.",
      "Optional: add weight-saving or wire pass-through cutouts, keeping at least **1.5 mm** of material between any hole and the edge or another hole.",
      "**Extrude** to a thickness between **3 and 5 mm**.",
      exportStep,
      "Attach screenshots of the part and your sketch, and write a short explanation of your design choices: where the motors, caster and battery go, and why. Part of your grade comes from this.",
    ],
    realWorld: "In industry, the base plate or chassis is often the first part designed, because every other part mounts to it. It sets the robot's center of mass, stiffness and wiring paths.",
    samples: [{ file: "chassis-plate.stl", label: "Example chassis" }],
  },
];

export const guideFor = (id: string) => cadGuides.find((g) => g.id === id);
