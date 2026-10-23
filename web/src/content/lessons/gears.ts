import type { Lesson } from "../types";

export const gears: Lesson = {
  id: "gears",
  unit: "mechanical",
  title: "Gears & Gear Ratios",
  minutes: 18,
  summary: "How gears trade speed for torque, how to calculate a gear ratio, and how engineers stack stages into gearboxes.",
  objectives: [
    "Calculate a gear ratio from tooth counts",
    "Predict output speed, torque and direction of a gear pair",
    "Explain why meshed gears turn opposite ways, and when to use an idler",
  ],
  slides: [
    {
      image: { src: "/img/photo/gears-spur.jpg", alt: "A small steel pinion meshing with a large gear on industrial machinery", credit: "W.carter / Wikimedia Commons (CC0)" },
      title: "What a gear pair does",
      bullets: [],
    },
    {
      image: { src: "/img/gears/gear-ratio-example.png", alt: "A 25-tooth driver gear meshing a 75-tooth driven gear, giving a 3:1 ratio", credit: "From the RoboSpartans team training deck" },
      title: "The gear ratio",
      bullets: [],
    },
    {
      image: { src: "/img/gears/speed-torque-tradeoff.png", alt: "Three gear pairs showing how a smaller driver against a larger driven gear trades speed for torque", credit: "From the RoboSpartans team training deck" },
      title: "Why torque goes up",
      bullets: [],
    },
    {
      image: { src: "/img/photo/gearbox.jpg", alt: "The inside of a gearbox showing several gear stages on different shafts", credit: "NASA Kennedy Space Center / NASA/Kim Shiflett / Wikimedia Commons (Public domain)" },
      title: "Compound gear trains",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "What a gear pair does",
      body: `A gear is a wheel with teeth. When two gears **mesh**, the teeth of the driving gear (the **driver**, usually on the motor) push the teeth of the **driven** gear. Because the teeth can't slip, the motion is transferred exactly.

Two things always happen:
- Meshing gears spin in **opposite directions**.
- If the gears are different sizes, the speed and torque change. A small gear driving a big gear makes the output **slower but stronger**.`,
    },
    {
      heading: "The gear ratio",
      body: `The **gear ratio** compares the driven gear to the driver. Because both gears' teeth pass the contact point at the same rate, you can use tooth counts directly.

A ratio above 1 (like 3 : 1) is a **reduction**: slower output, more torque. A ratio below 1 is an **overdrive**: faster output, less torque.`,
      formula: {
        expr: "GR = N_driven ÷ N_driver = ω_in ÷ ω_out = τ_out ÷ τ_in (ideal)",
        where: [
          ["N", "number of teeth"],
          ["ω", "rotational speed (RPM or rad/s)"],
          ["τ", "torque (N·m)"],
        ],
      },
      example: {
        problem: "A motor spins at 3000 RPM with 0.2 N·m of torque. Its 15-tooth pinion drives a 45-tooth gear. What are the output speed and torque?",
        solution: `GR = 45 ÷ 15 = **3 : 1** (a reduction)

Output speed = 3000 ÷ 3 = **1000 RPM**

Output torque (ideal) = 0.2 × 3 = **0.6 N·m**

With a 95% mesh efficiency (typical for plastic hobby gears; good metal spur gears reach about 97–99%): 0.6 × 0.95 ≈ **0.57 N·m**. The speed is still exactly 1000 RPM, because teeth can't slip; friction steals torque, not speed.`,
      },
    },
    {
      heading: "Why torque goes up: power is conserved",
      body: `Gears can't create energy. Mechanical power is torque times angular speed, so if a gearbox divides speed by 3, it multiplies torque by (at most) 3.

Real gears lose some power to friction, roughly 1–3% per stage for good metal spur gears and more for plastic hobby gears. That's why the output torque is a bit less than the ideal value.`,
      formula: {
        expr: "P = τ × ω",
        where: [
          ["P", "power (watts)"],
          ["τ", "torque (N·m)"],
          ["ω", "angular speed in rad/s (RPM × 2π ÷ 60)"],
        ],
      },
      callout: {
        kind: "tip",
        text: "Pick the ratio from what the output needs. A robot arm lifting weight needs torque (big reduction). A flywheel shooter needs speed (small reduction or overdrive).",
      },
    },
    {
      heading: "Idler gears and compound gear trains",
      body: `An **idler** is a gear placed between the driver and driven gears. It makes the output spin the **same** direction as the input and lets you span a larger distance, but it doesn't change the overall ratio because its teeth cancel out: (N_idler ÷ N_driver) × (N_driven ÷ N_idler) = N_driven ÷ N_driver.

A **compound gear train** puts two gears on the same shaft. The big gear of one stage turns the small gear of the next stage. The stage ratios **multiply**, which makes large reductions possible in a small space.`,
      formula: { expr: "GR_total = GR₁ × GR₂ × GR₃ × …" },
      example: {
        problem: "A gearbox has two stages: 10T → 50T, then 12T → 36T. What's the total ratio?",
        solution: "Stage 1: 50 ÷ 10 = 5. Stage 2: 36 ÷ 12 = 3. Total = 5 × 3 = **15 : 1**. A 3000 RPM motor would turn the output at 200 RPM.",
      },
    },
  ],
  quiz: [
    {
      q: "A 10-tooth gear drives a 40-tooth gear. What is the gear ratio?",
      choices: ["1 : 4", "4 : 1", "30 : 1", "400 : 1"],
      answer: 1,
      explain: "GR = N_driven ÷ N_driver = 40 ÷ 10 = 4, written 4 : 1. The driver turns 4 times for each turn of the output.",
    },
    {
      q: "The motor in that 4 : 1 pair spins at 800 RPM with 0.5 N·m. Ignoring friction, what does the output do?",
      choices: ["3200 RPM, 0.125 N·m", "200 RPM, 2.0 N·m", "200 RPM, 0.5 N·m", "800 RPM, 2.0 N·m"],
      answer: 1,
      explain: "A 4 : 1 reduction divides speed by 4 (800 → 200 RPM) and multiplies torque by 4 (0.5 → 2.0 N·m). Power stays the same.",
    },
    {
      q: "You add an idler gear between a driver and a driven gear. What changes?",
      choices: ["The gear ratio doubles", "The output direction flips to match the input", "The output torque increases", "Nothing at all"],
      answer: 1,
      explain: "An idler reverses the direction (so the output now turns the same way as the input) but its teeth cancel out of the ratio.",
    },
    {
      q: "Two gears are meshed together. The driver turns clockwise. Which way does the driven gear turn?",
      choices: ["It depends on the gear ratio", "Clockwise, the same way", "Counter-clockwise, the opposite way", "It depends on which gear has more teeth"],
      answer: 2,
      explain: "Where the teeth meet, one gear's surface pushes the other's the opposite way, so meshed gears always counter-rotate. If you need the same direction, add an idler between them or use a belt.",
    },
    {
      q: "A two-stage gearbox has stages of 4 : 1 and 5 : 1. What's the total ratio?",
      choices: ["9 : 1", "20 : 1", "1.25 : 1", "45 : 1"],
      answer: 1,
      explain: "Stage ratios multiply: 4 × 5 = 20 : 1. (Adding them is a common mistake.)",
    },
  ],
  buildAlong: {
    title: "Feel a gear ratio with LEGO Technic",
    intro: "Build a hand-cranked gear pair and prove the ratio math by counting turns. Then feel how much easier (or harder) it is to hold the output still.",
    parts: [
      { id: "technic-gears", qty: 1, note: "you need an 8T, a 24T and a 40T gear, two axles and a beam" },
      { id: "tt-motor", qty: 1, note: "optional, for a motorized version" },
      { id: "battery-holder-4aa", qty: 1, note: "optional, to power the motor" },
    ],
    steps: [
      "Push two axles through a Technic beam so the holes are the right distance apart for an **8T and a 24T** gear to mesh. On a straight beam, 8T + 24T mesh when the axles are 2 holes apart (16 mm; Technic holes are 8 mm apart, and with module 1 this pair's center distance is (8 + 24) ÷ 2 = 16 mm).",
      "Put the 8T gear on the crank axle and the 24T gear on the output axle. Stick a piece of tape on the 24T gear as a marker.",
      "Turn the crank slowly and count: how many crank turns make the tape go around once? You should get **3**, matching 24 ÷ 8 = 3 : 1.",
      "Hold the output axle with your fingers and try turning the crank. Then swap the gears (24T on the crank). Which way is easier to stall? The 3 : 1 reduction gives the output 3× the torque.",
      "Swap the 24T for a **40T** gear (8T + 40T mesh 3 holes apart, 24 mm). Predict the ratio before counting: 40 ÷ 8 = 5 : 1.",
      "Challenge: build a compound train (8T → 24T, with another 8T on the same axle as the 24T, driving a 40T). Predict the total ratio (3 × 5 = 15 : 1) and check it by counting.",
    ],
    safety: ["Keep fingers clear of meshing gears when a motor is driving them. Motors can pinch."],
  },
  inTheField: `Gearboxes are everywhere engineers need to match a motor to a job. Electric-vehicle drivetrains usually use a single fixed reduction of roughly 8–10 : 1 because electric motors spin fast. Robot-arm joints use compact high-ratio gearboxes (planetary or strain-wave "harmonic" drives) to get enormous torque from small motors. In FIRST Robotics, teams choose drivetrain ratios to balance top speed against pushing power. Engineers size gears with standards from AGMA and ISO, which specify tooth strength, accuracy and lubrication.`,
};
