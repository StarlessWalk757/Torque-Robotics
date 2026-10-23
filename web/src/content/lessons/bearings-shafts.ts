import type { Lesson } from "../types";

export const bearingsShafts: Lesson = {
  id: "bearings-shafts",
  unit: "mechanical",
  title: "Bearings & Shafts",
  minutes: 17,
  summary: "What a bearing really does, how to pick one and fit it without wrecking it, and why a long shaft droops far more than you'd guess.",
  objectives: [
    "Explain what a bearing does and tell radial load from thrust load",
    "Choose between a plain bushing and a ball bearing, and read a bearing's size code",
    "Work out which of two bearings carries more of the load, and why overhang is expensive",
    "Fit a bearing without damaging it, and pick a shaft feature that will actually hold",
  ],
  slides: [
    {
      image: { src: "/img/photo/ball-bearing.jpg", alt: "A ball bearing showing the inner race, outer race and rolling balls", credit: "R. Henrik Nilsson / Wikimedia Commons (CC BY 4.0)" },
      title: "What a bearing actually does",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "What a bearing actually does",
      body: `Say "bearing" and most people think *low friction*. That's only half of it, and it's the less important half. A bearing does two jobs at once:

- It **locates** the shaft, so it can't wander sideways or flop about.
- It lets the shaft **turn** with very little resistance.

Drop a shaft through a hole and you get rotation with terrible location: it rattles, wears the hole oval, and the gear on the end stops meshing. Clamp the shaft and you get perfect location and no rotation. A bearing gives you both.

Load arrives in two directions, and the direction decides what you need. **Radial load** acts across the shaft — belt tension, gear teeth, the weight of a wheel. **Axial load** (or **thrust**) acts along the shaft, the way a propeller or a leadscrew pushes. An ordinary deep-groove ball bearing takes plenty of radial load and a useful amount of thrust; a plain bushing takes almost no thrust at all.`,
      callout: {
        kind: "tip",
        text: "You own several 608 bearings already. A skateboard or scooter wheel uses two of them, and so does almost every fidget spinner. Spin one and listen: a good bearing is quiet and coasts; a gritty one has had dirt or a press-fit mistake in its past.",
      },
    },
    {
      heading: "Bushings, ball bearings, and reading the size code",
      body: `A **bushing** is a sleeve of low-friction material — bronze, or a slippery plastic — that the shaft rubs inside. Cheap, tiny, quiet, tolerant of dirt, and fine for slow or occasional movement. What it isn't good at is speed.

A **ball bearing** replaces that rubbing with rolling. Two hardened rings, the **inner** and **outer race**, hold a ring of balls. Far less friction, and because the races are ground precisely, much better location too.

The size codes look cryptic, but in the common miniature series the last digits give the bore:

- **608** — 8 mm bore, 22 mm outside, 7 mm wide: the skateboard bearing
- **625** — 5 mm bore, 16 mm outside, 5 mm wide
- **6000** — 10 mm bore, 26 mm outside, 8 mm wide

A suffix says how it's closed: **ZZ** means metal shields, **2RS** rubber seals. Seals keep dirt out and add drag.`,
    },
    {
      heading: "Which bearing carries the load, and why overhang is expensive",
      body: `A shaft usually runs in **two** bearings, and they don't share the load equally. **The bearing nearer the load takes the bigger share**, and whatever the split, the two always add up to the load. Slide a pulley right next to one bearing and that bearing takes nearly all of it — so moving a heavy wheel closer to a bearing is a free way to lighten everything.

The second rule is **overhang**: the part of the shaft sticking out past its bearing. Shafts aren't rigid, and the droop grows much faster than the overhang does. **Double the overhang and the droop goes up about eight times.**

So when a shaft feels floppy, in order of value: shorten the overhang, support it at both ends, and only then make it thicker.`,
      callout: {
        kind: "tip",
        text: "Length works against you fast, so engineers spend their effort shortening spans before they spend it adding material. Shorten the overhang before you thicken the shaft.",
      },
    },
    {
      heading: "Fitting bearings, and shafts that have to grip",
      body: `A bearing has maybe ten micrometres of internal clearance, so how you install it decides whether it lives.

**The fit.** The ring that turns relative to the load gets the tight one. Normally the shaft spins, so the inner race is a light **press fit** on the shaft and the outer race is a close slip fit in the housing. A loose inner race will creep and polish the shaft until both are ruined.

**Push on the right ring.** Fitting it to a shaft, push only on the **inner** race; fitting it into a housing, only on the **outer**. Push the wrong one and the force travels through the balls, denting both races — the bearing still turns, but it rumbles for ever. Never hammer a bearing.

**Gripping the shaft.** A round shaft is slippery, so something has to key the gear to it: a **D-shaft** with a flat ground along it, a **keyway** with a square key for serious torque, or a **set screw** — which must land on a flat, or it just digs a crater and works loose. A **circlip** in a groove stops a part sliding along the shaft, but carries no torque.`,
      callout: {
        kind: "warning",
        text: "Never heat a bearing above about 120 °C to install it, and never press a bearing on with its seals or shields taking the load. If a bearing feels gritty after assembly, it is already damaged — swap it rather than hoping it beds in.",
      },
    },
  ],
  quiz: [
    {
      q: "A belt pulls sideways on a pulley mounted on a shaft. What kind of load is that on the shaft's bearings?",
      choices: ["Thrust (axial) load", "Radial load", "Torsional load", "No load at all — the bearings only see torque"],
      answer: 1,
      explain: "Belt tension pulls across the shaft, square to its axis, so it's a radial load. Thrust would be a push *along* the shaft axis, like a worm gear or a propeller gives.",
    },
    {
      q: "A pulley on a shaft sits much closer to bearing A than to bearing B. Which bearing carries more of its load?",
      choices: [
        "Bearing A, the near one",
        "Bearing B, the far one",
        "They always share it equally",
        "Neither: the frame carries it instead",
      ],
      answer: 0,
      explain: "The bearing nearer the load always takes the bigger share, and the two shares always add up to the load. Push down on a stick held between two fingers and slide your hand toward one finger — you can feel the load shift onto it.",
    },
    {
      q: "You need to press a new 608 bearing onto an 8 mm shaft. Where should the pressing force go?",
      choices: ["On the outer race, so the inner race stays clean", "On the seals, to spread the force evenly", "Anywhere — bearings are hardened steel and very tough", "On the inner race only, so no force goes through the balls"],
      answer: 3,
      explain: "Pushing on the inner race sends the force straight into the part that has to move onto the shaft. Push on the outer race instead and the whole load travels through the balls, denting both races (brinelling). The bearing will still spin, but it will rumble for the rest of its life.",
    },
    {
      q: "A shaft overhangs 50 mm from its bearing and droops 0.1 mm at the tip. You redesign it to overhang 100 mm instead, same shaft, same load. Roughly how much does it droop now?",
      choices: ["0.2 mm", "0.4 mm", "0.8 mm", "1.6 mm"],
      answer: 2,
      explain: "Cantilever deflection goes as L³, so doubling the length multiplies the droop by 2³ = 8: about 0.8 mm. Answering 0.2 mm assumes deflection is proportional to length, which is the most common mistake here.",
    },
    {
      q: "Your gear sits on a plain round shaft and keeps slipping instead of turning it. What's the right fix?",
      choices: [
        "Tighten the set screw much harder against the round shaft",
        "Use a shaft with a flat (a D-shaft) or a keyway, so the set screw or key has something to bite on",
        "Add a second bearing",
        "Use a bigger gear",
      ],
      answer: 1,
      explain: "A set screw on a plain round shaft only digs a dent and eventually slips. A flat or a keyway gives it a positive surface to grip, which is why hobby motor shafts almost always come with a flat already machined on them.",
    },
  ],
  buildAlong: {
    title: "Investigate a 608 — the bearing you already own",
    intro: "A skateboard wheel, a scooter wheel and most fidget spinners all run on 608 bearings: 8 mm bore, 22 mm outside, 7 mm wide. Spend twenty minutes with one and a caliper, and every idea in this lesson becomes something you can feel.",
    parts: [
      { id: "digital-caliper", qty: 1, note: "to check the bearing's three dimensions against the standard" },
      { id: "m3-hardware", qty: 1, note: "optional: a long M3 screw makes a handy spin test axle for a 625 or 688" },
      { id: "ball-bearings-608", qty: 1, note: "a 10-pack is cheaper than one, and you'll want a spare to take apart" },
      { id: "shaft-coupler-set", qty: 1, note: "optional, for the couplings section" },
    ],
    steps: [
      "Find a 608. A skateboard or scooter wheel holds two of them (pop them out with the end of the axle, levering gently against the inner race). A dead fidget spinner has three or four. Ask before you take anything apart.",
      "Measure it. You should read **22.00 mm** across the outside, **8.00 mm** through the bore, and **7.00 mm** wide, within a few hundredths. These numbers are set by an ISO standard, which is why any brand of 608 fits any 608 pocket.",
      "Hold the outer race still and try to **wobble** the inner race side to side. That tiny amount of play is the bearing's internal clearance, usually around ten micrometres — too small to measure with a caliper but easy to feel.",
      "Now push the inner race *along* the axis while holding the outer race. It moves a little, then stops firmly. That's the bearing taking a **thrust load**: it resists, but with much less stiffness than it resists radial load.",
      "Spin it. A dry, clean bearing coasts for several seconds and sounds like a quiet hiss. If it stops dead or rumbles, something has brinelled the races or dirt has got in. If you have two, compare a good one to a tired one with your eyes shut.",
      "Pop the rubber seal off one side of a 2RS bearing with a pin (work around the edge, don't bend it), and spin it again. It spins noticeably longer with the seal off. That's the trade: drag versus keeping dirt out.",
      "Try a **fit** by hand. Push the bearing onto an 8 mm rod or bolt shank. A proper press fit needs real force — if it slides on loosely, the shaft is undersize and the bearing will creep and polish it. Notice how you instinctively push on the inner race, which is exactly right.",
      "Finally, a load-sharing check you can feel. Hold a pencil between two fingers as your two 'bearings', about 100 mm apart, and press down on it with your other hand. Slide your pressing finger toward one support and feel the load shift onto that finger. The nearer bearing always takes more.",
    ],
    safety: [
      "Levering bearings out of wheels can make parts fly. Wear eye protection and lever against a solid surface, not toward yourself.",
      "Bearing grease is messy and not for skin or eyes. Wash your hands afterwards, and don't degrease a bearing you plan to keep using unless you can re-oil it.",
    ],
  },
  inTheField: `Bearings are the most standardised mechanical part on earth, and that's deliberate: ISO 15 fixes the boundary dimensions so a 608 from any factory drops into any 608 pocket, and ISO 281 defines the rating-life calculation that every manufacturer's catalog uses. Engineers choosing bearings for a gearbox or a wind-turbine main shaft start from the duty cycle — how much load, at what speed, for how many hours — and run exactly the L₁₀ calculation from this lesson, with extra factors for lubrication cleanliness and temperature. Precision classes matter where runout does: ABEC and ISO 492 class ratings separate a skateboard bearing from a machine-tool spindle bearing. In service, big plants monitor bearings by vibration and by the sound they make, because a spalled race has a characteristic frequency signature long before it fails outright. And if you want to see how far this engineering has come, consider that a hard-drive spindle bearing runs at 7200 RPM, for years, with a positioning tolerance measured in nanometres.`,
};
