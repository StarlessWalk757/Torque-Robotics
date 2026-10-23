// the course. units in the order they're taken, lessons in the order they're taught.
// the order of the `lessons` array below IS the course order -- nothing stores a lesson number, so
// moving a lesson means moving one line here and everything else follows
import type { Lesson, Unit, UnitId } from "./types";
import { measurement } from "./lessons/measurement";
import { forcesFbd } from "./lessons/forces-fbd";
import { torqueLevers } from "./lessons/torque-levers";
import { gears } from "./lessons/gears";
import { beltsChains } from "./lessons/belts-chains";
import { motors } from "./lessons/motors";
import { bearingsShafts } from "./lessons/bearings-shafts";
import { fasteners } from "./lessons/fasteners";
import { ohmsLaw } from "./lessons/ohms-law";
import { ledsResistors } from "./lessons/leds-resistors";
import { pwmHbridge } from "./lessons/pwm-hbridge";
import { senseThinkAct } from "./lessons/sense-think-act";
import { arduinoBasics } from "./lessons/arduino-basics";
import { differentialDrive } from "./lessons/differential-drive";
import { sketchingConstraints } from "./lessons/sketching-constraints";
import { features } from "./lessons/features";
import { assembliesExport } from "./lessons/assemblies-export";

export const units: Unit[] = [
  { id: "foundations", title: "Foundations", blurb: "Measuring accurately, and the forces acting on a part.", color: "#0d6e8c" },
  { id: "mechanical", title: "Mechanical", blurb: "Torque, gears, belts, motors, bearings and fasteners: what makes a robot move, and what holds it together.", color: "#2051c9" },
  { id: "electrical", title: "Electrical", blurb: "Voltage, current and resistance, then LEDs and motor drivers.", color: "#5b32c9" },
  { id: "robotics", title: "Robotics", blurb: "Sensors, Arduino, and driving a two-wheeled robot.", color: "#8e2fb5" },
  { id: "cad", title: "CAD with Onshape", blurb: "Design real parts in free professional CAD, then submit them to be measured and graded.", color: "#a62a74" },
];

export const lessons: Lesson[] = [
  measurement, forcesFbd,
  torqueLevers, gears, beltsChains, motors, bearingsShafts, fasteners,
  ohmsLaw, ledsResistors, pwmHbridge,
  senseThinkAct, arduinoBasics, differentialDrive,
  sketchingConstraints, features, assembliesExport,
];

export const lessonById = (id: string) => lessons.find((l) => l.id === id);
export const lessonsIn = (unit: UnitId) => lessons.filter((l) => l.unit === unit);
export const unitById = (id: UnitId) => units.find((u) => u.id === id)!;

// the next lesson overall, which crosses into the next unit at the end of one. different from
// "next in this unit", which is why it goes through orderedLessons rather than lessonsIn
export function nextLesson(id: string): Lesson | undefined {
  const ordered = orderedLessons();
  const i = ordered.findIndex((l) => l.id === id);
  return i >= 0 ? ordered[i + 1] : undefined;
}

export const orderedLessons = () => units.flatMap((u) => lessonsIn(u.id));
