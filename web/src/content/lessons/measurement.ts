import type { Lesson } from "../types";

export const measurement: Lesson = {
  id: "measurement",
  unit: "foundations",
  title: "Units, Measurement & Tolerances",
  minutes: 22,
  summary: "SI units, converting millimetres and inches, reading digital and vernier calipers, and using tolerances to decide whether a part is good.",
  image: {
    src: "/img/caliper.svg",
    alt: "A vernier caliper with the slider's zero past 14 mm and the 23rd vernier line aligned",
    caption: "Reading a vernier: whole millimetres from the main scale, then the line that lines up.",
  },
  objectives: [
    "Name the SI base and derived units engineers use most, and convert between mm and inches",
    "Read a digital caliper and a vernier caliper (outside, inside and depth)",
    "Use a tolerance to accept or reject a part, and explain why 3D-printed parts need clearance",
  ],
  slides: [
    {
      image: { src: "/img/photo/caliper-digital.jpg", alt: "A dial caliper and a measuring microscope on a workbench", credit: "Douglas W. Jones / Wikimedia Commons (CC0)" },
      title: "Reading a caliper",
      bullets: [],
    },
    {
      image: { src: "/img/photo/caliper-vernier.jpg", alt: "A vernier caliper showing the main scale and the sliding vernier scale", credit: "R. Henrik Nilsson / Wikimedia Commons (CC BY 4.0)" },
      title: "Vernier calipers",
      bullets: [],
    },
    {
      image: { src: "/img/photo/micrometer.jpg", alt: "A micrometer screw gauge, used where a caliper is not precise enough", credit: "Encik Tekateki / Wikimedia Commons (CC0)" },
      title: "Tolerances: how close is close enough?",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "SI units: the engineer's language",
      body: `Every measurement is a **number plus a unit**. "The shaft is 20" is useless: 20 millimeters and 20 inches differ by a factor of 25.4.

Engineers worldwide use **SI**, the metric system. The units you'll meet in this course:

- **meter (m)** length, **kilogram (kg)** mass, **second (s)** time, **ampere (A)** current
- **newton (N)** force, **volt (V)** voltage, **ohm (Ω)** resistance, **watt (W)** power

**Prefixes** scale them by powers of ten: k (kilo) = ×1000, m (milli) = ÷1000, μ (micro) = ÷1,000,000. So 2.2 kΩ is 2200 Ω and 20 mA is 0.020 A.

Mechanical drawings are almost always dimensioned in **millimetres**, which keeps the numbers whole and avoids decimal-point mistakes.`,
      callout: {
        kind: "real-world",
        text: "In 1999 NASA lost the Mars Climate Orbiter because one team's software reported thruster impulse in pound-force seconds while the navigation software expected newton-seconds. A unit mix-up destroyed a spacecraft.",
      },
    },
    {
      heading: "Converting between millimeters and inches",
      body: `In the US you'll still meet inches on screws, lumber and some drawings. The conversion is **exact** by definition (since 1959): one inch is exactly 25.4 mm.

To convert without mistakes, multiply by a fraction equal to 1 that cancels the unit you don't want: 3 in × (25.4 mm / 1 in) = 76.2 mm. The "in" cancels, leaving mm.`,
      formula: {
        expr: "1 in = 25.4 mm (exactly)        mm = in × 25.4        in = mm ÷ 25.4",
      },
      example: {
        problem: "A drawing calls for a 3/8 in hole. What is that in millimeters? And how many inches is a 50 mm part?",
        solution: `3/8 in = 0.375 in. 0.375 × 25.4 = **9.525 mm**

50 mm ÷ 25.4 = 1.9685… in ≈ **1.969 in**

Sanity check: an inch is a bit more than 25 mm, so 50 mm should be a bit under 2 in. ✓`,
      },
    },
    {
      heading: "Reading a caliper",
      body: `A **caliper** measures lengths to hundredths of a millimeter. One tool measures three ways:
- **Outside jaws** (the big lower jaws) grip the outside of a part: thickness, width, a shaft's diameter.
- **Inside jaws** (the small upper jaws) go *into* a hole or slot and open against its walls.
- **Depth rod** slides out of the end of the beam. Rest the end of the beam on the top of a hole and push the rod down to the bottom.

**Digital calipers**: clean the jaws, close them and press ZERO, then measure. Read the display (usually to 0.01 mm) and check the mm/in setting.

**Vernier calipers** need no battery. The **main scale** on the beam is in millimetres; the **vernier scale** on the slider has divisions that are each slightly shorter than 1 mm, which is the trick that lets you read fractions of a millimetre. Reading one takes three steps:

- Find the vernier's **zero line** and read the main-scale millimetre just to its **left**.
- Find the **one vernier line that lines up exactly** with a main-scale line.
- Add that line's number × the caliper's resolution (usually 0.02 mm).`,
      formula: {
        expr: "reading = main-scale mm (left of vernier zero) + k × resolution",
        where: [
          ["k", "number of the vernier line that lines up best (count from 0)"],
          ["resolution", "0.02 mm or 0.05 mm, printed on the caliper"],
        ],
      },
      example: {
        problem: "On a 0.02 mm vernier caliper, the vernier zero sits just past the 21 mm mark, and vernier line 17 (two lines past the label \"3\") lines up with a main-scale line. What's the reading?",
        solution: `Main scale: **21 mm**.

Vernier: 17 × 0.02 = **0.34 mm**. (Check with the labels: "3" means 0.30 mm, and two more lines add 0.04 mm.)

Reading: 21 + 0.34 = **21.34 mm**.`,
      },
      callout: {
        kind: "tip",
        text: "Hold the part square in the jaws, close them gently (don't squeeze), and measure a few times in different spots. Always check that a digital caliper reads 0.00 with the jaws closed before you start.",
      },
    },
    {
      heading: "Tolerances: how close is close enough?",
      body: `No part is ever made to exactly the drawing size. A **tolerance** says how far from the **nominal** (ideal) size a part can be and still work. A dimension of **20.00 ± 0.05 mm** means any part from the **lower limit** 19.95 mm to the **upper limit** 20.05 mm is acceptable. Outside that band, the part is **rejected**. Tolerances can also be one-sided, like 10.0 +0.1/−0 mm.

Tighter tolerances cost more: better machines, slower cutting, more inspection. Make them only as tight as the job needs.

When two parts go together, the difference in their sizes decides the **fit**. A **clearance fit** leaves the hole bigger than the shaft so they slide or spin; an **interference fit** makes the shaft slightly bigger so it has to be pressed in and then stays put.

**3D prints need extra clearance.** Printed holes come out slightly undersize, so a 10.0 mm peg usually won't go into a hole drawn at 10.0 mm. Start with about 0.2 mm of clearance per side and print a small test piece, because every printer is a little different.`,
      example: {
        problem: "A drawing says 20.00 ± 0.05 mm. You measure three parts: 20.03 mm, 19.94 mm and 20.05 mm. Which pass?",
        solution: `Limits: 20.00 − 0.05 = **19.95 mm** and 20.00 + 0.05 = **20.05 mm**.

- 20.03 mm: inside the band → **accept**
- 19.94 mm: below 19.95 → **reject** (too small)
- 20.05 mm: exactly on the upper limit → **accept** (the limits themselves are allowed)`,
      },
    },
  ],
  quiz: [
    {
      q: "A bolt is 3/4 in long. How long is it in millimeters?",
      choices: ["29.5 mm", "1.905 mm", "19.05 mm", "7.5 mm"],
      answer: 2,
      explain: "3/4 in = 0.75 in, and 0.75 × 25.4 = 19.05 mm. Going from inches to millimeters, you multiply by 25.4, so the number gets bigger.",
    },
    {
      q: "A drawing gives a shaft length as 0.045 m. What is that in millimeters?",
      choices: ["4.5 mm", "45 mm", "450 mm", "0.45 mm"],
      answer: 1,
      explain: "There are 1000 mm in a metre, so 0.045 × 1000 = 45 mm. Engineering drawings are almost always in millimetres for exactly this reason: no decimals to lose.",
    },
    {
      q: "On a 0.02 mm vernier caliper, the main scale shows 14 mm just left of the vernier zero, and vernier line 23 lines up. What's the reading?",
      choices: ["14.23 mm", "14.46 mm", "16.30 mm", "14.023 mm"],
      answer: 1,
      explain: "Reading = 14 + 23 × 0.02 = 14 + 0.46 = 14.46 mm. Reading the line number as if it were hundredths gives 14.23, which is wrong: on this caliper each vernier line is worth 0.02 mm.",
    },
    {
      q: "A drawing specifies 12.00 ± 0.10 mm. Which measured part must be rejected?",
      choices: ["12.11 mm", "11.92 mm", "12.08 mm", "12.00 mm"],
      answer: 0,
      explain: "The limits are 11.90 mm to 12.10 mm. 12.11 mm is above the upper limit. The other three are inside the band.",
    },
    {
      q: "A hardware shop sells a 10 mm rod. Your American drawing calls for 3/8 in. Will the rod fit the hole?",
      choices: [
        "No: 3/8 in is 9.525 mm, so a 10 mm rod is too fat",
        "Yes: 3/8 in is exactly 10 mm",
        "No: 3/8 in is 12.7 mm, so the rod is too thin",
        "There is no way to compare inches and millimetres",
      ],
      answer: 0,
      explain: "3/8 in = 0.375 × 25.4 = 9.525 mm, so a 10 mm rod is about half a millimetre too big. Mixing the two systems without converting is behind a lot of parts that don't fit.",
    },
  ],
  buildAlong: {
    title: "Measure real objects with a digital caliper",
    intro: "Check your caliper skills against official specifications. US coins have published sizes, and AA batteries have a standard size range, so you can test both your accuracy and your precision.",
    parts: [{ id: "digital-caliper", qty: 1, note: "a vernier caliper works too; read it with the method from this lesson" }],
    steps: [
      "Wipe the jaws clean, close them and press ZERO. Check it reads 0.00 mm. Make a table in your notebook with columns: object, what you measured, reading 1 to 5, average, spec.",
      "Measure the **diameter of a US quarter** five times, turning the coin a little each time. Record every reading, then the average. The US Mint's specification is **24.26 mm**. How close is your average (accuracy)? How spread out are your five readings (precision)?",
      "Measure the quarter's **thickness** (spec: 1.75 mm), then a penny (spec: 19.05 mm diameter, 1.52 mm thick). Worn coins may read a little small. Why?",
      "Use the **inside jaws** to measure the inside diameter of a bottle cap or a metal washer. Then use the **depth rod** to measure how deep the bottle cap is.",
      "Measure the diameter of a few **AA batteries**. The IEC standard for AA (LR6) cells allows a diameter from 13.5 to 14.5 mm. Accept or reject each one.",
      "Switch the caliper to inches and measure the quarter again. Check it: 24.26 ÷ 25.4 ≈ 0.955 in.",
      "Write a short conclusion: which measurement was hardest to repeat, and why?",
    ],
    safety: ["Caliper jaw tips are sharp. Don't point them at anyone, and close the jaws when you put the caliper away."],
  },
  inTheField: `Measuring and inspecting parts is a whole engineering specialty called **metrology**. Factories check parts with calipers, micrometers and coordinate measuring machines (CMMs) that probe points to within a few micrometers. Drawings in the US follow ASME Y14.5, the standard for dimensioning and tolerancing (including GD&T, geometric dimensioning and tolerancing), while ISO 286 defines standard hole and shaft fits used worldwide. Every measuring tool in a good shop is regularly calibrated against reference standards traceable to national labs like NIST. Aerospace and medical-device companies keep inspection records for every critical part they ship.`,
  resources: [{ label: "NIST: SI units", url: "https://www.nist.gov/pml/owm/metric-si/si-units" }],
};
