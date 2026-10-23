import type { Lesson } from "../types";

export const ohmsLaw: Lesson = {
  id: "ohms-law",
  unit: "electrical",
  title: "Voltage, Current, Resistance & Ohm's Law",
  minutes: 22,
  summary: "What voltage, current and resistance really are, how Ohm's law connects them, and how to read a resistor's color code.",
  objectives: [
    "Define charge, current, voltage and resistance with their units",
    "Use V = I × R to find any one quantity from the other two",
    "Explain why a circuit has to be a closed loop for current to flow",
  ],
  slides: [
    {
      image: { src: "/img/photo/resistors.jpg", alt: "Electronic resistors showing their colour-coded bands", credit: "Windell Oskay from Sunnyvale, CA, USA / Wikimedia Commons (CC BY 2.0)" },
      title: "Voltage and resistance",
      bullets: [],
    },
    {
      image: { src: "/img/photo/multimeter.jpg", alt: "A digital multimeter measuring a circuit", credit: "Harke / Wikimedia Commons (Public domain)" },
      title: "Ohm's law",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Charge and current",
      body: `Everything electrical starts with **electric charge**, measured in **coulombs** (C). Electrons carry a tiny negative charge: it takes about 6.24 × 10¹⁸ electrons to make one coulomb.

**Current** (symbol I) is the rate at which charge flows past a point in a circuit. It's measured in **amperes** (A), or amps for short. One ampere means one coulomb of charge passes every second. Small circuits usually use **milliamps** (mA): 1 mA = 0.001 A.

Which way does current flow? Engineers use **conventional current**, which flows out of the **positive (+)** terminal, through the circuit, and back into the **negative (−)** terminal. In metal wires, the charges that actually move are electrons, and they drift the other way, from − to +. Both descriptions predict the same circuit behavior, so every schematic, datasheet and formula uses conventional current.`,
      formula: {
        expr: "I = Q ÷ t",
        where: [
          ["I", "current (amperes, A)"],
          ["Q", "charge that flows past a point (coulombs, C)"],
          ["t", "time (seconds, s)"],
        ],
      },
    },
    {
      heading: "Voltage and resistance",
      body: `**Voltage** (symbol V) is the **electric potential difference** between two points: how much energy each coulomb of charge gains or loses moving between them. It's measured in **volts** (V), and 1 volt = 1 joule per coulomb. Voltage is always measured *between* two points. When someone says "this pin is at 5 V," they mean 5 V above a reference point called **ground** (0 V), usually the battery's − terminal.

A battery works like a charge pump: it raises charge to a higher potential, and the charge gives that energy back as it flows through the rest of the circuit.

**Resistance** (symbol R) is how strongly something opposes current. It's measured in **ohms** (Ω). Copper wire has very little resistance. A **resistor** is a part made to have a specific resistance, so you can control how much current flows.

Current only flows around a **closed circuit**: an unbroken loop from the + terminal back to the − terminal. Break the loop anywhere (a switch, a loose wire) and the current stops everywhere in that loop.`,
      callout: {
        kind: "tip",
        text: "**The water analogy.** Voltage is like water pressure, current is like the flow rate, and a resistor is like a narrow section of pipe. It's a helpful picture, but it has limits: a cut water pipe spills water, while an open circuit simply stops the current. Wires don't \"fill up\" or empty the way pipes do, and the analogy says nothing about the magnetic effects you'll meet with motors.",
      },
    },
    {
      heading: "Ohm's law",
      body: `In the 1820s, Georg Ohm found that for many materials the current is proportional to the voltage: double the voltage and you double the current. The constant that links them is the resistance.

Rearrange it to find whichever quantity you need. A memory trick is the **V-I-R triangle**: V on top, I and R on the bottom. Cover the one you want and the other two show you the math.
- **V = I × R** (voltage)
- **I = V ÷ R** (current)
- **R = V ÷ I** (resistance)

Always use base units (volts, amps, ohms) in the formula, then convert. 22 mA is 0.022 A, and 4.7 kΩ is 4700 Ω.

Ohm's law describes **ohmic** parts like resistors and wires, whose resistance stays constant. Some parts are *not* ohmic: an LED's current rises very steeply once the voltage passes its forward voltage, and a light bulb's filament resistance increases as it heats up. For those, you still use R = V ÷ I at a single operating point, but the value changes.`,
      formula: {
        expr: "V = I × R",
        where: [
          ["V", "voltage across the part (volts, V)"],
          ["I", "current through the part (amperes, A)"],
          ["R", "resistance (ohms, Ω)"],
        ],
      },
      example: {
        problem: "A 220 Ω resistor is connected across a 5 V supply. How much current flows? Then: what resistor would let 10 mA flow from a 9 V battery?",
        solution: `**Part 1:** I = V ÷ R = 5 V ÷ 220 Ω = 0.0227 A ≈ **22.7 mA**.

**Part 2:** Convert first: 10 mA = 0.010 A. R = V ÷ I = 9 V ÷ 0.010 A = **900 Ω**.

900 Ω isn't a standard resistor value. The common values nearby are 820 Ω and 1 kΩ. With 1 kΩ you'd get 9 ÷ 1000 = 9 mA, a little under the target, which is usually the safer choice.`,
      },
    },
  ],
  quiz: [
    {
      q: "A 12 V supply is connected across a 400 Ω resistor. What current flows?",
      choices: ["4800 A", "33 A", "30 mA", "3 mA"],
      answer: 2,
      explain: "I = V ÷ R = 12 V ÷ 400 Ω = 0.03 A = 30 mA. Multiplying (4800) or dividing the wrong way around (400 ÷ 12 ≈ 33) are the common mistakes.",
    },
    {
      q: "A current of one ampere means that how much charge flows past a point each second?",
      choices: ["One volt", "One coulomb", "One ohm", "One watt"],
      answer: 1,
      explain: "Current is charge per unit time: 1 A = 1 coulomb per second. Volts measure the push behind the charge, ohms the resistance to it, and watts the power.",
    },
    {
      q: "In the wires outside a battery, which way does **conventional** current flow?",
      choices: ["From − to +", "It changes direction many times a second", "It doesn't flow outside the battery", "From + to −"],
      answer: 3,
      explain: "Conventional current flows out of the + terminal, through the circuit, and into the − terminal. Electrons in the wire drift the opposite way (− to +), but circuit formulas and diagrams use conventional current.",
    },
    {
      q: "You want 20 mA to flow from a 9 V battery through a resistor. What resistance do you need?",
      choices: ["180 Ω", "450 Ω", "0.18 Ω", "4.5 kΩ"],
      answer: 1,
      explain: "Convert 20 mA to 0.020 A, then R = V ÷ I = 9 ÷ 0.020 = 450 Ω. Forgetting to convert mA to A gives the wrong answer 0.45 Ω.",
    },
    {
      q: "You keep the supply voltage the same but swap a resistor for one with twice the resistance. What happens to the current?",
      choices: ["It doubles", "It stays the same", "It halves", "It drops to zero"],
      answer: 2,
      explain: "I = V ÷ R. With V fixed, doubling R halves the current. This is also why a near-zero resistance across a battery is so dangerous: as R falls toward nothing, the current climbs enormously.",
    },
  ],
  buildAlong: {
    title: "Check Ohm's law with a multimeter",
    intro: "Read some resistors by their color bands, confirm them with a multimeter, then power them from your Arduino's 5 V pin and check that V = I × R holds. You don't need to upload any code: the Arduino is just a 5 V supply here.",
    parts: [
      { id: "arduino-uno", qty: 1, note: "or the board from an arduino-starter-kit, powered over USB" },
      { id: "breadboard", qty: 1 },
      { id: "jumper-wires", qty: 2 },
      { id: "resistor-kit", qty: 1, note: "you'll use a 220 Ω and a 1 kΩ resistor" },
      { id: "multimeter", qty: 1 },
    ],
    steps: [
      "Pick a 220 Ω resistor (red-red-brown-gold) and a 1 kΩ resistor (brown-black-red-gold). Write down what the bands say each one should be.",
      "Set the multimeter to resistance (**Ω**). With nothing powered, touch the probes to each end of one resistor and read the value. Don't hold both metal ends with your fingers: your body's resistance adds a parallel path and throws off the reading. Is each value within ±5% of the marking?",
      "Unplug the Arduino. Push the 1 kΩ resistor into the breadboard. Use jumper wires to connect one end to the Arduino's **5V** pin and the other end to a **GND** pin.",
      "Plug the Arduino into USB. Set the meter to **DC volts** (V with a straight line), put the red probe on the 5V end of the resistor and the black probe on the GND end. Write down the voltage. Over USB it's often a little under 5 V, such as 4.8–5.0 V.",
      "Calculate the current with Ohm's law: I = V ÷ R, using *your measured* V and R. With about 5 V and 1 kΩ you should get about 5 mA.",
      "Unplug the Arduino, swap in the 220 Ω resistor, and repeat. You should get about 22–23 mA. Notice that the current changed by the same factor as the resistance (1000 ÷ 220 ≈ 4.5).",
      "Challenge: predict the current for a resistor you haven't tried yet, then measure its voltage and resistance to check. Keep every resistor at 220 Ω or more on the 5 V pin.",
    ],
    safety: [
      "Always unplug the Arduino before changing wires on the breadboard.",
      "Never connect the 5V pin directly to GND with a wire. That's a short circuit.",
      "Leave the meter in voltage or resistance mode. On a current (A or mA) setting the meter is nearly a short circuit, so touching the probes across a supply can blow its fuse or damage the board.",
    ],
  },
  inTheField: `Ohm's law is the first calculation behind almost every circuit an electrical engineer designs: choosing a resistor to limit LED current, predicting the voltage a sensor will produce, or checking how much voltage a long wire loses before power reaches a motor. Circuit-board designers use it with the IPC-2152 standard to size copper traces so they don't overheat at the required current. Resistor values and color codes are standardized worldwide (IEC 60062 for markings and IEC 60063 for the E12 and E24 "preferred values"), so a 220 Ω resistor means the same thing in every factory. Technicians troubleshooting robots, cars and appliances use a multimeter and Ohm's law to find broken wires, shorts and failed parts.`,
  resources: [
    { label: "Arduino docs", url: "https://docs.arduino.cc/" },
    { label: "NIST SI units guide", url: "https://www.nist.gov/pml/owm/metric-si/si-units" },
  ],
};
