import type { Lesson } from "../types";

export const torqueLevers: Lesson = {
  id: "torque-levers",
  unit: "mechanical",
  title: "Torque & Levers",
  minutes: 20,
  summary: "What torque is, why the distance from the pivot matters, how levers trade force for distance, and how to size the torque a robot arm needs.",
  objectives: [
    "Calculate torque from a force, its distance from the pivot, and its angle",
    "Find the moment arm of a force and tell clockwise from counterclockwise torque",
    "Use Στ = 0 to balance a lever",
    "Work out the mechanical advantage of a lever, and what it costs in distance",
  ],
  slides: [
    {
      image: { src: "/img/diagrams/torque-rF.svg", alt: "Two wrenches on the same bolt: a 0.5 m one giving 10 newton-metres and a 1.0 m one giving 20, for the same 20 N push" },
      title: "Torque = force \u00d7 distance",
      bullets: [],
    },
    {
      image: { src: "/img/diagrams/moment-arm.svg", alt: "A wrench on a bolt with a force applied at an angle; the blue line shows that only the perpendicular distance, r sin theta, counts as the moment arm" },
      title: "The moment arm is the catch",
      bullets: [],
    },
    {
      image: { src: "/img/diagrams/lever-balance.svg", alt: "A balanced lever: 20 N at 1.4 m on one side equals 80 N at 0.35 m on the other, both 28 newton-metres" },
      title: "Balancing a lever",
      bullets: [],
    },
    {
      image: { src: "/img/diagrams/arm-worst-case.svg", alt: "A robot arm folded in versus held straight out, showing the horizontal position has the longest moment arm and needs the most torque" },
      title: "Sizing a robot arm",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "What torque is",
      body: `A force can push something along, but it can also make it **turn**. **Torque** (symbol τ, the Greek letter tau) measures how strongly a force makes something rotate about a **pivot** (also called an axis or fulcrum).

Two things decide the torque:
- **How hard you push**: the force F, in newtons (N).
- **How far from the pivot you push**: the distance r, in meters (m), from the pivot to where the force acts.

That's why door handles are on the side far from the hinges, and why a long wrench loosens a stuck bolt more easily than a short one. Torque is measured in **newton-meters (N·m)**.`,
      formula: {
        expr: "τ = r × F        magnitude: τ = r F sin θ",
        where: [
          ["τ", "torque (N·m)"],
          ["r", "distance from the pivot to where the force acts (m)"],
          ["F", "force (N)"],
          ["θ", "angle between the line from the pivot (r) and the force (F)"],
        ],
      },
      example: {
        problem: "You push on a wrench 0.25 m from the bolt with 50 N. What is the torque if you push (a) at 90° to the handle, (b) at 30° to the handle, (c) straight along the handle?",
        solution: `(a) sin 90° = 1, so τ = 0.25 × 50 × 1 = **12.5 N·m**

(b) sin 30° = 0.5, so τ = 0.25 × 50 × 0.5 = **6.25 N·m**. Same force, half the turning effect.

(c) sin 0° = 0, so τ = **0 N·m**. Pushing along the handle only pushes on the bolt; it can't turn it.`,
      },
    },
    {
      heading: "Moment arm, direction and balance",
      body: `The × in τ = r × F stands for a **cross product**: only the part of the force that is **perpendicular** to r makes torque. There's an equivalent way to see this. Draw the force's **line of action** (the line the force acts along). The **moment arm** is the perpendicular distance from the pivot to that line. Then torque = moment arm × force. In the wrench example (b), the moment arm is 0.25 × sin 30° = 0.125 m, and 0.125 × 50 = 6.25 N·m, the same answer.

Torque has a direction: **clockwise** (↻) or **counterclockwise** (↺). Engineers usually call counterclockwise positive (this follows the right-hand rule), but any sign convention works as long as you stick to it.

When all the torques on an object add up to zero, it doesn't start to spin. This is **rotational equilibrium**: Στ = 0 (Σ, sigma, means "sum of"). A balanced seesaw, a shelf bracket, and a robot arm holding still all obey it. (For an object to stay completely still, the forces must also add up to zero, ΣF = 0. On a seesaw, the fulcrum pushes up to supply that.)`,
      formula: {
        expr: "Στ = 0    →    F₁ × d₁ = F₂ × d₂ (for a lever with one force on each side)",
        where: [
          ["F₁, F₂", "forces (for weights, W = m × g with g = 9.81 m/s²)"],
          ["d₁, d₂", "moment arms: perpendicular distances from the fulcrum (m)"],
        ],
      },
      example: {
        problem: "A 30 kg rider sits 2.0 m left of a seesaw's pivot. Where should a 40 kg rider sit on the right to balance?",
        solution: `Left torque = 30 × 9.81 × 2.0 = 294.3 N × 2.0 m ≈ **589 N·m** (counterclockwise).

For balance, 40 × 9.81 × d = 589 → 392.4 × d = 588.6 → d = **1.5 m**.

Notice that g cancels out: 30 × 2.0 = 40 × d gives the same answer. The heavier rider balances by sitting closer.`,
      },
    },
    {
      heading: "Levers and mechanical advantage",
      body: `A **lever** is a rigid bar that pivots on a **fulcrum**. You apply an **effort** force to move a **load**. The **effort arm** is the distance from the fulcrum to the effort; the **load arm** is the distance from the fulcrum to the load.

Balancing torques (effort × effort arm = load × load arm) tells you how much the lever multiplies your force. That multiplier is the **mechanical advantage** (MA).

But there's no free lunch. If a lever multiplies force by 6, the effort end has to move **6 times farther** than the load. The work you put in (force × distance) equals the work that comes out, ignoring friction. Levers trade force for distance; they never create energy.`,
      formula: {
        expr: "MA = load ÷ effort = effort arm ÷ load arm (ideal)",
        where: [
          ["MA", "mechanical advantage (no units)"],
          ["effort arm", "fulcrum to effort (m)"],
          ["load arm", "fulcrum to load (m)"],
        ],
      },
      example: {
        problem: "A crowbar rests on a fulcrum 0.2 m from the rock it lifts. You push down 1.2 m from the fulcrum with 100 N. How much force lifts the rock, and how far does it move if your hand moves 12 cm?",
        solution: `MA = 1.2 ÷ 0.2 = **6**

Load force = 6 × 100 N = **600 N** (ideal: ignoring friction and the bar's own weight)

The rock moves 12 cm ÷ 6 = **2 cm**.

Check the work: 100 N × 0.12 m = 12 J in, and 600 N × 0.02 m = 12 J out. Work is conserved.`,
      },
      callout: {
        kind: "tip",
        text: "An MA below 1 isn't a bad lever. It trades force for **speed and range of motion**: the load end moves farther and faster than the effort. That's exactly what a throwing arm, a fishing rod or a fast robot arm wants.",
      },
    },
  ],
  quiz: [
    {
      q: "You push 40 N at right angles to a wrench, 0.2 m from the bolt. What is the torque?",
      choices: ["0.005 N·m", "40.2 N·m", "8 N·m", "200 N·m"],
      answer: 2,
      explain: "τ = r × F = 0.2 m × 40 N = 8 N·m. (Dividing gives 0.005 and adding gives 40.2; neither is torque.)",
    },
    {
      q: "You pull on a wrench handle with 60 N, but straight along the handle, away from the bolt. What torque do you make?",
      choices: ["0 N·m", "It depends on the length of the handle", "60 N·m", "Half the torque of a perpendicular push"],
      answer: 0,
      explain: "The force's line of action passes through the pivot, so the moment arm is zero (θ = 0°, sin 0° = 0). Pulling along the handle can't turn the bolt at all.",
    },
    {
      q: "A 20 kg child sits 1.5 m from a seesaw's pivot. Where must a 30 kg child sit on the other side to balance?",
      choices: ["2.25 m", "1.5 m", "0.67 m", "1.0 m"],
      answer: 3,
      explain: "Balance torques: 20 × 1.5 = 30 × d, so d = 30 ÷ 30 = 1.0 m. (g appears on both sides and cancels.)",
    },
    {
      q: "A robot arm holds a 1.0 kg camera 0.30 m out from its shoulder joint. Roughly what torque must the shoulder motor supply just to hold it still?",
      choices: ["0.3 N·m", "2.9 N·m", "9.8 N·m", "29 N·m"],
      answer: 1,
      explain: "The camera's weight is 1.0 × 9.81 ≈ 9.8 N, acting 0.30 m from the pivot, so τ = 9.8 × 0.30 ≈ 2.9 N·m. Move the camera twice as far out and the motor needs twice the torque.",
    },
    {
      q: "A lever has a 0.9 m effort arm and a 0.3 m load arm. Ignoring friction, what happens when you push the effort end down 30 cm?",
      choices: ["The load lifts 3× your force and rises 90 cm", "The load gets 1/3 of your force and rises 10 cm", "The load lifts 3× your force and rises 10 cm", "The load lifts 3× your force and rises 30 cm"],
      answer: 2,
      explain: "MA = 0.9 ÷ 0.3 = 3, so the load force is 3× the effort. Work is conserved, so the load moves 1/3 as far: 30 cm ÷ 3 = 10 cm.",
    },
  ],
  inTheField: `Torque calculations are the first step in sizing almost every actuator. Robot designers compute worst-case joint torques (arm horizontal, fully loaded, plus the torque to accelerate it) before choosing motors and gearboxes, then add a safety factor. Mechanics tighten bolts with torque wrenches to a specified torque in N·m, because the right torque stretches the bolt just enough to clamp the parts. Cranes and excavators use load charts and moment limiters that stop the machine before the load's moment could tip it over. Structural and mechanical engineers use Στ = 0 and ΣF = 0 every day to find the forces in beams, brackets and linkages.`,
};
