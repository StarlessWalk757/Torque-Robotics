import type { Lesson } from "../types";

export const ledsResistors: Lesson = {
  id: "leds-resistors",
  unit: "electrical",
  title: "LEDs & Current-Limiting Resistors",
  minutes: 20,
  summary: "How diodes and LEDs work, which way round an LED goes, and how to calculate the resistor that keeps it (and your Arduino) safe.",
  objectives: [
    "Explain what a diode does and identify an LED's anode and cathode",
    "Describe forward voltage and why an LED can't limit its own current",
    "Calculate a current-limiting resistor and choose a standard value",
    "Check how much power the resistor has to get rid of",
  ],
  slides: [
    {
      image: { src: "/img/photo/led.jpg", alt: "A light emitting diode with its long anode and short cathode legs", credit: "Leon Brooks / Wikimedia Commons (Public domain)" },
      title: "Diodes: one-way valves",
      bullets: [],
    },
    {
      image: { src: "/img/photo/breadboard.jpg", alt: "A breadboard with components and jumper wires", credit: "Safranek-interia.eu / Wikimedia Commons (CC0)" },
      title: "Why it needs a resistor",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Diodes: one-way valves for current",
      body: `A **diode** is a component that lets current flow in only one direction, like a one-way valve in a pipe. Its two ends are the **anode** (+) and the **cathode** (−). Current flows from anode to cathode. Connected backwards, a diode blocks current.

An **LED** (light-emitting diode) is a diode that gives off light when current flows through it. Because it's a diode, it only works one way round:
- The **anode** (+) is the **longer leg**. It connects toward the positive side of the supply.
- The **cathode** (−) is the **shorter leg**. Most 5 mm LEDs also have a **flat edge** on the rim on the cathode side.

In a circuit diagram, an LED is drawn as a triangle pointing at a bar, with two little arrows for light. The triangle points the way current flows, and the bar is the cathode.`,
      callout: {
        kind: "tip",
        text: "Legs trimmed to the same length? Look for the flat edge on the rim. An LED that's in backwards simply stays dark at the low voltages we use, so if nothing lights up, try turning it around.",
      },
    },
    {
      heading: "Forward voltage",
      body: `Current only starts to flow through an LED once the voltage across it reaches roughly its **forward voltage** (**V_f**). While it's lit, the LED's voltage stays close to V_f even as the current changes a lot.

V_f depends mostly on the LED's color, because different colors are made from different semiconductor materials. Typical values for standard 5 mm LEDs:
- Red: about **1.8–2.2 V**
- Green, blue and white: about **2.8–3.4 V** (some older, yellow-green LEDs are closer to 2.1 V)

These are typical values only. V_f also changes a little with current and temperature, and it varies between parts. The exact number for your LED is in its **datasheet** (or the store listing), usually given at a test current such as 20 mA.`,
    },
    {
      heading: "Why an LED needs a resistor",
      body: `Look at an LED's **current–voltage (I–V) curve**. Below V_f, almost no current flows. Past a bend called the **knee**, the current rises very steeply: a few tenths of a volt more can multiply the current many times over.

That means you can't safely control an LED's current by picking a voltage. If you connect an LED straight to a 5 V supply, nothing limits the current. It rushes far past the LED's rating, and the LED (or the Arduino pin driving it) can be damaged.

The fix is a resistor in **series** (in the same path) with the LED. The supply voltage is shared: the LED takes about V_f, and the resistor takes the rest. Because a resistor follows Ohm's law (V = I × R), it sets the current in a predictable way.`,
      callout: {
        kind: "warning",
        text: "Never connect an LED directly across a battery or an Arduino's 5 V pin without a resistor. Every LED in a circuit needs its own current limit.",
      },
    },
    {
      heading: "Calculating the resistor",
      body: `The resistor gets whatever voltage the LED doesn't use: V_supply − V_f. Dividing that by the current you want gives the resistance.

Resistors come in **standard values**. The common **E12 series** has 12 values in each decade: 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82 (times 1, 10, 100, 1000 …). If your answer isn't a standard value, pick the **next value up**. A slightly bigger resistor gives slightly less current, which is the safe direction.

Finally, check the resistor's **power**, the energy it turns into heat each second. Common through-hole resistors are rated for **¼ W** (0.25 W). Staying well under the rating keeps the resistor cool.`,
      formula: {
        expr: "R = (V_supply − V_f) ÷ I_LED        P_R = (V_supply − V_f) × I = I² × R",
        where: [
          ["R", "resistance (Ω)"],
          ["V_supply", "supply voltage (V)"],
          ["V_f", "LED forward voltage (V)"],
          ["I_LED", "LED current you want, in amps (10 mA = 0.010 A)"],
          ["P_R", "power turned into heat in the resistor (W)"],
        ],
      },
      example: {
        problem: "You want to light a red LED (V_f = 2.0 V) at 10 mA from a 5 V supply. Which resistor should you use, what current will actually flow, and how much power does the resistor handle?",
        solution: `R = (5.0 V − 2.0 V) ÷ 0.010 A = 3.0 V ÷ 0.010 A = **300 Ω**

300 Ω isn't an E12 value, so round up to **330 Ω**.

Actual current: I = 3.0 V ÷ 330 Ω ≈ 0.0091 A = **9.1 mA** (a little under the target, which is fine).

Resistor power: P = 3.0 V × 0.0091 A ≈ 0.027 W = **27 mW**, about a tenth of a ¼ W rating.`,
      },
    },
  ],
  quiz: [
    {
      q: "Which leg of a standard LED connects toward the positive (+) side of the supply?",
      choices: ["The longer leg (anode)", "The shorter leg (cathode)", "Either leg: LEDs work both ways", "The leg next to the flat edge of the rim"],
      answer: 0,
      explain: "The anode is the longer leg and goes toward +. The shorter leg, on the flat-edge side, is the cathode and goes toward −. LEDs are diodes, so they only work one way round.",
    },
    {
      q: "A blue LED has V_f = 3.0 V. What resistor gives 10 mA from a 5 V supply?",
      choices: ["500 Ω", "300 Ω", "200 Ω", "800 Ω"],
      answer: 2,
      explain: "R = (5.0 − 3.0) V ÷ 0.010 A = 200 Ω. (300 Ω would be right for a red LED with V_f = 2.0 V; 500 Ω forgets to subtract V_f.) 200 Ω isn't an E12 value, so you'd use 220 Ω.",
    },
    {
      q: "Your calculation gives 300 Ω. You have 270 Ω and 330 Ω resistors. Following the rule in this lesson, which do you choose?",
      choices: [
        "270 Ω, because it gives more current",
        "330 Ω, the next standard value up, so the current stays at or below your target",
        "Neither: you must find an exact 300 Ω resistor",
        "Leave the resistor out, since the LED will limit itself",
      ],
      answer: 1,
      explain: "Round up to the next standard value. A slightly larger resistor gives slightly less current (3.0 V ÷ 330 Ω ≈ 9.1 mA instead of 10 mA), which is the safe direction.",
    },
    {
      q: "Why can't you run an LED straight from a voltage source without a resistor?",
      choices: [
        "LEDs only work on AC",
        "The resistor makes the LED change color",
        "LEDs need at least 5 V to turn on",
        "Its current rises so steeply with voltage that nothing would keep the current at a safe level",
      ],
      answer: 3,
      explain: "Past the knee of its I–V curve, a small change in voltage makes a huge change in current. The series resistor sets the current using Ohm's law.",
    },
    {
      q: "A red LED (V_f = 2.0 V) runs from 5 V through a 150 Ω resistor. How much power does the resistor turn into heat?",
      choices: ["0.3 W", "60 mW", "20 mW", "100 mW"],
      answer: 1,
      explain: "I = (5.0 − 2.0) V ÷ 150 Ω = 0.020 A (20 mA). The resistor has 3.0 V across it, so P = 3.0 V × 0.020 A = 0.060 W = 60 mW. (100 mW would use the whole 5 V, but 2 V of that is across the LED.)",
    },
  ],
  buildAlong: {
    title: "Blink and fade an LED safely",
    intro: "Wire an LED with a properly calculated resistor to an Arduino pin, make it blink, then fade it smoothly. We'll use 470 Ω, which keeps the current at a safe level on both the UNO R3 and the UNO R4.",
    parts: [
      { id: "arduino-uno", qty: 1 },
      { id: "breadboard", qty: 1 },
      { id: "jumper-wires", qty: 2 },
      { id: "resistor-kit", qty: 1, note: "one 470 Ω (yellow-violet-brown) resistor, or 1 kΩ (brown-black-red) if you don't have 470 Ω" },
      { id: "leds", qty: 1, note: "any color; red is easiest to start with" },
      { id: "multimeter", qty: 1, note: "optional, for step 6" },
    ],
    steps: [
      "Unplug the Arduino from USB while you wire. Find your LED's **anode** (longer leg) and **cathode** (shorter leg, flat side).",
      "Do the math first. For a red LED (V_f ≈ 2.0 V) on a 5 V pin with 470 Ω: I = (5.0 − 2.0) ÷ 470 ≈ **6.4 mA**. That's under about 8 mA (UNO R4 Minima) and 20 mA (UNO R3). A green, blue or white LED (V_f ≈ 3 V) gets about (5 − 3) ÷ 470 ≈ 4.3 mA.",
      "Push the LED into the breadboard so its two legs are in **different** numbered rows, for example the anode in row 15 and the cathode in row 16.",
      "Put the 470 Ω resistor from row 10 to row 15, so it connects to the anode. Run a jumper wire from Arduino **pin 9** to row 10, and another from the cathode's row (16) to an Arduino **GND** pin.",
      "Plug in USB and upload the sketch below. The LED should blink three times, then fade up and down. If it stays dark, unplug and check that the LED isn't backwards.",
      "Optional: with the LED on, set your multimeter to DC volts and measure across the resistor. Divide by 470 Ω to find the real current (I = V_R ÷ R). Is it close to your prediction?",
      "Try a different color LED. Predict whether it will get more or less current with the same resistor (hint: a higher V_f leaves less voltage for the resistor).",
    ],
    safety: ["Unplug USB before changing wiring, so you don't short a pin by accident."],
    code: {
      language: "cpp",
      caption: "Blink, then fade. Pin 9 is a PWM pin (marked ~ on the UNO), which is what lets analogWrite fade the LED. You'll learn how PWM works in the PWM lesson.",
      source: `// Blink an LED three times, then fade it up and down.
// Wiring: pin 9 -> 470 ohm resistor -> LED anode (long leg); LED cathode -> GND

const int LED_PIN = 9;   // a PWM pin (marked ~), so analogWrite can fade it

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // Blink three times
  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_PIN, HIGH);  // LED on
    delay(300);
    digitalWrite(LED_PIN, LOW);   // LED off
    delay(300);
  }

  // Fade up: analogWrite takes 0 (off) to 255 (fully on)
  for (int level = 0; level <= 255; level++) {
    analogWrite(LED_PIN, level);
    delay(5);
  }
  // Fade back down
  for (int level = 255; level >= 0; level--) {
    analogWrite(LED_PIN, level);
    delay(5);
  }
  delay(500);
}`,
    },
  },
  inTheField: `The series-resistor calculation in this lesson is used on nearly every circuit board with an indicator LED, from routers to car dashboards. For lighting, where efficiency matters, engineers use constant-current LED driver chips instead, because a resistor wastes power as heat and doesn't adjust as the battery or temperature changes. Good designers also **derate** parts, running them comfortably below their maximum current and power so they stay cool and last longer. LED brightness in phone screens and displays is often controlled with fast switching (PWM), the same idea you'll use with analogWrite.`,
  resources: [
    { label: "Arduino docs (board specs and pin limits)", url: "https://docs.arduino.cc/" },
    { label: "Arduino language reference", url: "https://docs.arduino.cc/language-reference/" },
  ],
};
