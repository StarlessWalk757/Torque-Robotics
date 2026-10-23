import type { Lesson } from "../types";

export const beltsChains: Lesson = {
  id: "belts-chains",
  unit: "mechanical",
  title: "Belts, Chains & Pulleys",
  minutes: 22,
  summary: "How machines carry power across a gap: timing belts, V-belts and chains, the ratio math they share with gears, and how to size a belt and tension it without wrecking your bearings.",
  objectives: [
    "Explain when a belt or chain beats a train of gears",
    "Calculate a pulley or sprocket ratio, and how much belt one turn pulls through",
    "Choose between a timing belt, a V-belt and a chain for a job",
  ],
  slides: [
    {
      image: { src: "/img/photo/pulley-block.jpg", alt: "A pulley wheel with rope running over it", credit: "Alexander Roumega / Wikimedia Commons (CC0)" },
      title: "Why not just mesh gears?",
      bullets: [],
    },
    {
      image: { src: "/img/belts/timing-belt-pulleys.png", alt: "A toothed timing belt running between two toothed pulleys", credit: "From the RoboSpartans team training deck" },
      title: "Timing belts",
      bullets: [],
    },
    {
      image: { src: "/img/photo/roller-chain.jpg", alt: "Roller chain running on a sprocket", credit: "Jaques Boyer, Scientific American, 18 April 1908, p. 273-274. / Wikimedia Commons (Public domain)" },
      title: "V-belts and chain",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Why not just mesh gears?",
      body: `In the **Gears & Gear Ratios** lesson the two gears were touching. Real machines are rarely that tidy: the motor goes where there's room for it, and the wheel goes where the wheel has to be.

You *could* bridge the gap with a line of idler gears, but every extra gear needs its own shaft, its own bearings and its own slot in the frame, and each mesh costs you a little power.

A **belt** or **chain** drive spans the gap with one flexible loop. The wheel doing the driving is the **driver**, the one being turned is the **driven** wheel. What you gain:

- **Distance.** A 400 mm gap costs one longer belt, not five more gears.
- **Freedom in layout.** Move the motor 20 mm and you just re-tension the belt.
- **Shock absorption.** A belt gives a little, so a jolt doesn't land straight on gear teeth.

What you give up is stiffness, and sometimes the guarantee of no slip.`,
      callout: {
        kind: "real-world",
        text: "Look at a 3D printer: one stepper motor sits low in the frame, driving the print head through a long GT2 belt. The motor's weight never has to move. That's the whole reason the belt is there.",
      },
    },
    {
      heading: "The ratio: the same math you already know",
      body: `Here's the good news. A belt or chain can't stretch much and its teeth can't skip, so the same length of belt that leaves the driver has to arrive at the driven wheel. That gives you exactly the gear-ratio relationship, with tooth counts swapped in from the pulleys or sprockets.

A ratio above 1 is a **reduction** (slower, stronger output); below 1 is an **overdrive**.

One difference from gears: an **open belt** — the normal kind, with both spans parallel — turns both shafts the **same** direction. With gears you'd need an idler to get that.

One more number is worth knowing: **how much belt one turn pulls through**. A toothed belt is divided into teeth a fixed distance apart — its **pitch** — so one full turn of a pulley moves pitch × number of teeth of belt. A 20-tooth GT2 pulley (2 mm pitch) pulls through 40 mm per turn. That's exactly how a 3D printer works out how far to spin its motor to move the print head a given distance.`,
      formula: {
        expr: "ratio = N_driven ÷ N_driver = n_in ÷ n_out = τ_out ÷ τ_in (ideal)        v = π × d × n",
        where: [
          ["N", "teeth on a pulley or sprocket"],
          ["n", "rotational speed (rev/s for the speed formula; RPM ÷ 60)"],
          ["d", "pitch diameter (m, for v in m/s)"],
          ["v", "belt speed (m/s)"],
          ["τ", "torque (N·m)"],
        ],
      },
      example: {
        problem: "A motor turning 600 RPM at 0.10 N·m drives a 20-tooth GT2 pulley, which drives a 60-tooth GT2 pulley. GT2 belt pitch is 2 mm. Find the ratio, the output speed and torque, and the belt speed.",
        solution: `Ratio = 60 ÷ 20 = **3 : 1**, a reduction.

Output speed = 600 ÷ 3 = **200 RPM**. Output torque (ideal) = 0.10 × 3 = **0.30 N·m**. A well-tensioned toothed belt runs at about 95–98% efficiency, so call it 0.30 × 0.97 ≈ **0.29 N·m**.

Driver pitch diameter = 2 × 20 ÷ π = **12.73 mm** = 0.01273 m.

Belt speed = π × 0.01273 × (600 ÷ 60) = **0.40 m/s**.

Sanity check without π: each turn of a 20-tooth pulley pulls 20 teeth × 2 mm = 40 mm of belt, and there are 10 turns a second. 40 × 10 = 400 mm/s. Same answer.`,
      },
    },
    {
      heading: "Timing belts, V-belts and chains",
      body: `Three families, three different bargains.

A **timing belt** has teeth moulded into it that drop into grooves on the pulley, so it cannot slip: one turn of the motor always means the same movement at the output. **GT2** (2 mm pitch) is the belt in almost every desktop 3D printer.

A **V-belt** is a rubber belt with a wedge-shaped cross-section that grips its pulley by **friction** alone. It can slip — which is sometimes a feature, because if something jams the belt squeals instead of snapping a shaft. It's quiet and forgives sloppy alignment, which is why it drives your car's alternator.

A **chain** runs on **sprockets**, with steel rollers sitting in pockets between the teeth. It carries the heaviest loads of the three, which is why it drives motorcycles, bikes and competition robots. The cost is maintenance: chain needs oil, and it needs re-tensioning as the joints wear.

- Need exact positioning? Timing belt.
- Need a drive that forgives overload? V-belt.
- Need to move a heavy robot? Chain.`,
      callout: {
        kind: "tip",
        text: "Toothed belts and chains both need enough **wrap angle** so that several teeth share the load. Below roughly 120° of wrap on the small pulley you're asking two or three teeth to do everything, and a toothed belt will start skipping (people call it ratcheting). A bigger small pulley, or an idler, fixes it.",
      },
    },
  ],
  quiz: [
    {
      q: "A 15-tooth sprocket drives a 45-tooth sprocket with #25 chain. The motor turns 900 RPM. What does the output shaft do?",
      choices: ["2700 RPM, same direction", "300 RPM, same direction", "300 RPM, opposite direction", "900 RPM, opposite direction"],
      answer: 1,
      explain: "Ratio = 45 ÷ 15 = 3 : 1, so 900 ÷ 3 = 300 RPM. A normal (open) chain or belt drive turns both shafts the same way; you'd need a crossed flat belt or an extra gear to reverse it.",
    },
    {
      q: "A GT2 belt has a 2 mm pitch. How much belt passes through when a 20-tooth GT2 pulley makes one full turn?",
      choices: ["2 mm", "20 mm", "40 mm", "It depends on the belt tension"],
      answer: 2,
      explain: "One turn moves all 20 teeth past the belt, and each tooth is 2 mm of pitch, so 20 × 2 = 40 mm. Tension doesn't change it: that's the point of a toothed belt.",
    },
    {
      q: "A machine must hold an exact position and reverse direction often — a 3D printer's X axis, say. Which drive fits best?",
      choices: ["A timing belt, because its teeth can't slip and it has almost no backlash", "A V-belt, because it can slip if something jams", "A chain, because it carries the highest load", "A crossed flat belt, because it reverses the output"],
      answer: 0,
      explain: "Positioning needs repeatability: a given motor movement must always produce the same head movement. A timing belt's teeth can't slip, and a preloaded toothed belt has almost no backlash. A V-belt's slip would lose position, and a chain's weight, noise and maintenance aren't worth it at these tiny loads.",
    },
    {
      q: "Your drive needs the two shafts to turn in the **same** direction, and you can't move them. What's the simplest fix?",
      choices: [
        "Use a crossed (figure-eight) belt",
        "Use an open belt, which already turns both pulleys the same way",
        "Add a third pulley between them",
        "Swap the belt for a chain",
      ],
      answer: 1,
      explain: "An open belt wraps the same side of both pulleys, so they turn the same way — that's the normal arrangement. A crossed belt reverses the second shaft. Meshed gears are the ones that reverse direction unless you add an idler.",
    },
    {
      q: "Your motor and your wheel are 400 mm apart and you can't move either of them. Why is a belt or chain the easy answer?",
      choices: [
        "A belt carries more torque than any gear can",
        "One belt spans the gap; meshed gears would need a long train of extra gears in between",
        "Belts never need any tension",
        "Gears only work on shafts that are exactly parallel",
      ],
      answer: 1,
      explain: "Gears only talk to their neighbours, so bridging 400 mm means a chain of idler gears, each adding cost, friction and backlash. A belt or chain just needs to be longer.",
    },
  ],
  buildAlong: {
    title: "Measure a real chain drive: your bicycle",
    intro: "You almost certainly own a precision chain drive already. A bike is a variable-ratio chain drive with a measurable pitch, measurable sprockets and a measurable output, and everything in this lesson shows up on it. This takes about 20 minutes and costs nothing.",
    parts: [
      { id: "digital-caliper", qty: 1, note: "to measure the chain pitch and the roller diameter" },
      { id: "steel-ruler", qty: 1, note: "to measure the wheel diameter" },
      { id: "gt2-belt-kit", qty: 1, note: "the 20T and 60T GT2 pair from the worked example" },
    ],
    steps: [
      "With the bike still and the chain slack (shift to the smallest rear cog), measure the **chain pitch**: put the caliper's jaws across two neighbouring pin centers. You should read very close to **12.7 mm**, which is 1/2 inch. Every derailleur bicycle chain in the world uses this pitch.",
      "Count the teeth on the **front chainring** (the big sprocket at the pedals) and on one **rear cog**. Mark a starting tooth with a bit of tape so you don't lose count. Write both numbers down.",
      "Work out the ratio: N_driven ÷ N_driver, where the chainring is the driver. For a 48-tooth chainring and a 16-tooth cog, that's 16 ÷ 48 = **0.33 : 1** — an overdrive. The wheel turns three times for every turn of the pedals.",
      "Check it by turning the pedals. Lift the rear wheel (or flip the bike), mark the wheel with tape, and turn the pedals exactly once. Count the wheel's turns. You should get your ratio's reciprocal — three, for the example above.",
      "Measure the wheel's diameter with the ruler and work out its circumference (π × d). A typical 700c road wheel with a tyre is about 0.67 m across, so roughly **2.1 m** per turn.",
      "Now predict your speed. Pedalling at 80 RPM in that gear: wheel speed = 80 ÷ 0.33 = 240 RPM, so 240 × 2.1 = 504 m per minute = **30 km/h**. Shift to a different cog and recalculate — that's a gearbox you can feel.",
      "Shift to the largest rear cog and count again. The ratio is now a reduction, which is exactly why climbing gear is slow and strong. Same chain, same pedals, different tooth count.",
      "Last check: look at how the derailleur holds a spring-loaded pulley against the chain. That's a **tensioner idler**, and it exists because the required chain length changes every time you shift to a different sprocket.",
    ],
    safety: [
      "Work on a bike that is stationary and stable, ideally upside down or in a stand. Never put fingers near a moving chain where it meets a sprocket: that pinch point is strong enough to injure.",
      "Chain lubricant is dirty and hard to wash out of clothes. Use gloves or an old rag.",
    ],
  },
  inTheField: `Belt and chain drives are everywhere a motor isn't where the load is. Nearly every desktop 3D printer positions its print head with GT2 timing belts; industrial robots, CNC gantries and camera gimbals use the same idea in bigger sizes. Car engines drive their camshafts with a toothed belt or chain precisely because the timing must never slip, and the accessory drive runs on a serpentine V-ribbed belt where a little slip is harmless. Motorcycles and bicycles use roller chain because nothing else carries that much torque per gram. The standards are mature and specific: ANSI/ASME B29.1 covers the #25 and #35 roller chain sizes used in FIRST Robotics, and ISO 5296 and ISO 13050 cover synchronous belt tooth profiles including GT2 and HTD. Engineers size these drives with the manufacturer's power-rating tables, which fold in belt width, pulley diameter, wrap angle and a service factor for shock loads — and then they check the bearing loads the tension creates, because that's usually what fails first.`,
};
