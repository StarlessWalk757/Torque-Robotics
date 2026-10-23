import type { Lesson } from "../types";

const RAMP_SKETCH = `// Ramp a DC motor up and down in both directions with a TB6612FNG driver.
// Wiring (channel A):
//   PWMA -> pin 9 (a PWM pin, marked ~)   AIN1 -> pin 7   AIN2 -> pin 8   STBY -> pin 6
//   VCC -> Arduino 5V   VM -> 4xAA battery +   AO1/AO2 -> motor
//   GND -> Arduino GND AND battery -  (all grounds connected)

const int PWMA = 9;
const int AIN1 = 7;
const int AIN2 = 8;
const int STBY = 6;

void setup() {
  pinMode(PWMA, OUTPUT);
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(STBY, OUTPUT);
  digitalWrite(STBY, HIGH);  // HIGH = driver on (LOW puts it in standby)
}

// speed: -255 (full reverse) to 255 (full forward)
void drive(int speed) {
  if (speed >= 0) {
    digitalWrite(AIN1, HIGH);  // forward: AIN1 HIGH, AIN2 LOW
    digitalWrite(AIN2, LOW);
  } else {
    digitalWrite(AIN1, LOW);   // reverse: AIN1 LOW, AIN2 HIGH
    digitalWrite(AIN2, HIGH);
    speed = -speed;            // analogWrite needs a positive number
  }
  analogWrite(PWMA, speed);    // duty cycle = speed / 255
}

void loop() {
  for (int s = 0; s <= 255; s++) { drive(s); delay(10); }    // speed up forward
  for (int s = 255; s >= 0; s--) { drive(s); delay(10); }    // slow down
  delay(500);
  for (int s = 0; s <= 255; s++) { drive(-s); delay(10); }   // speed up in reverse
  for (int s = 255; s >= 0; s--) { drive(-s); delay(10); }   // slow down
  delay(500);
}`;

export const pwmHbridge: Lesson = {
  id: "pwm-hbridge",
  unit: "electrical",
  title: "PWM & H-Bridge Motor Drivers",
  minutes: 24,
  summary: "Why a microcontroller pin can't run a motor, how PWM controls speed by switching fast, and how an H-bridge driver like the TB6612FNG runs a motor forward and backward.",
  objectives: [
    "Explain why a motor needs a driver instead of an Arduino pin",
    "Calculate duty cycle and average voltage for a PWM signal",
    "Use analogWrite on the Arduino's PWM pins",
    "Explain how an H-bridge reverses a motor, and why shoot-through must never happen",
  ],
  slides: [
    {
      image: { src: "/img/photo/h-bridge.jpg", alt: "A motor driver board of the kind used to run a motor from a microcontroller", credit: "Raimond Spekking / Wikimedia Commons (CC BY-SA 4.0)" },
      title: "The H-bridge",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Why a pin can't drive a motor",
      body: `An Arduino pin is made to send **signals**, not power. Three things go wrong if you connect a motor straight to one:
- **Current.** An UNO R3 pin should supply about 20 mA at most (40 mA is its absolute maximum), and an UNO R4 Minima pin is rated around 8 mA. A small TT motor draws from roughly a hundred to a few hundred milliamps while running, and much more when it starts or stalls.
- **Voltage.** The motor may want a different voltage (like 6 V from batteries) than the pin's 5 V.
- **Inductive kickback.** A motor's windings are a coil, an **inductor**. Current through an inductor can't stop instantly, so when you switch the motor off it pushes back with a voltage spike that can be many times the supply voltage. That spike can destroy the transistor or pin that switched it.

The fix is a **motor driver**: a chip that uses the pin's small signal to switch the big motor current from a separate supply. Driver chips like the TB6612FNG handle the kickback for you: diodes built into their output transistors give the motor's current a safe path when a switch turns off.`,
      callout: {
        kind: "warning",
        text: "Never connect a motor directly to an Arduino pin, and don't power a motor from the Arduino's 5V pin. Use a driver and a separate motor supply, with the grounds connected.",
      },
    },
    {
      heading: "PWM: controlling power by switching fast",
      body: `A driver is basically a set of switches: fully on or fully off. So how do you get half speed? **Pulse-width modulation (PWM)**: switch the voltage on and off many times per second, and vary how long it stays on.

The signal is a **square wave**. The **period** (T) is the time for one on-off cycle, and the **duty cycle** (D) is the fraction of each period it's on. The motor's coils and spinning mass smooth out the pulses, so it responds mostly to the **average** voltage.

For a motor under a steady load, speed roughly follows the average voltage. That's a simplification: a real motor needs a minimum voltage to overcome friction and start turning, and its speed also depends on the load.`,
      formula: {
        expr: "D = t_on ÷ T        V_avg ≈ D × V_supply",
        where: [
          ["D", "duty cycle (0 to 1, or 0% to 100%)"],
          ["t_on", "time the signal is on in each cycle (s)"],
          ["T", "period of one cycle (s); frequency f = 1 ÷ T"],
          ["V_supply", "the voltage being switched (V)"],
        ],
      },
      example: {
        problem: "A PWM signal switches a 6 V motor supply. It's on for 1.5 ms of every 2.0 ms cycle. What are the duty cycle, the average voltage and the frequency?",
        solution: `D = 1.5 ms ÷ 2.0 ms = **0.75** (75%)

V_avg ≈ 0.75 × 6 V = **4.5 V**

f = 1 ÷ 0.0020 s = **500 Hz**`,
      },
    },
    {
      heading: "PWM on an Arduino: analogWrite",
      body: `On an Arduino, \`analogWrite(pin, value)\` makes a PWM signal. The value goes from **0** (always off) to **255** (always on), so the duty cycle is value ÷ 255. Despite the name, it doesn't output a true analog voltage; it outputs fast pulses.

Only some pins can do this. On the UNO they're marked with a **~**: pins **3, 5, 6, 9, 10 and 11**.

The default PWM frequency on the UNO R3 is about **490 Hz** on most of those pins and about **980 Hz** on pins 5 and 6. Other boards, including the UNO R4, can use different frequencies, so check your board's documentation if the exact frequency matters. At these frequencies you may hear a motor whine; that's normal.`,
      example: {
        problem: "You call `analogWrite(9, 64)` on a 5 V UNO. What's the duty cycle and the average voltage on pin 9?",
        solution: `D = 64 ÷ 255 ≈ **0.25** (25%)

V_avg ≈ 0.25 × 5 V ≈ **1.25 V**

Through a motor driver switching a 6 V battery, the same value would give the motor about 0.25 × 6 ≈ 1.5 V on average.`,
      },
    },
    {
      heading: "The H-bridge: forward, reverse, brake, coast",
      body: `To reverse a DC motor, you reverse the current through it. An **H-bridge** does that with four switches (transistors in a real chip) arranged like the letter H, with the motor as the crossbar:
- **Forward**: close the top-left and bottom-right switches (one diagonal pair). Current flows through the motor one way.
- **Reverse**: close the other diagonal pair. Current flows the other way.
- **Brake**: close both bottom switches. This shorts the motor's terminals together. A spinning motor acts as a generator, so the short makes it resist turning and stop quickly.
- **Coast**: open all four. The motor is disconnected and spins down freely.

**Shoot-through**: never close both switches on the same side (top and bottom). That connects the supply straight to ground through the switches, a short circuit with huge current that can destroy the driver. Driver chips include logic that prevents this, and engineers add a tiny delay (**dead time**) between turning one switch off and the other on.`,
      callout: {
        kind: "real-world",
        text: "The same switching idea, scaled up, drives electric cars, elevators and industrial machines. Their three-phase motors use three bridge legs (six switches) instead of two, switched thousands of times per second with carefully controlled dead time to avoid shoot-through.",
      },
    },
  ],
  quiz: [
    {
      q: "On a 5 V Arduino UNO, what's the average voltage from `analogWrite(9, 64)`?",
      choices: ["about 1.25 V", "about 3.75 V", "about 2.5 V", "about 0.25 V"],
      answer: 0,
      explain: "Duty cycle = 64 ÷ 255 ≈ 25%, and 0.25 × 5 V ≈ 1.25 V. (3.75 V would be 75% duty, analogWrite value 191.)",
    },
    {
      q: "Why shouldn't you connect a DC motor directly to an Arduino pin?",
      choices: [
        "Motors only run on AC",
        "The pin's voltage is too high for any motor",
        "The motor needs far more current than a pin can supply, and switching it off creates voltage spikes (inductive kickback)",
        "It works fine, but the motor will only spin one way",
      ],
      answer: 2,
      explain: "A pin is limited to about 20 mA (UNO R3) or less (about 8 mA on the UNO R4 Minima), while a small motor draws hundreds of mA. The motor's coil also produces a voltage spike when switched off. A driver solves both.",
    },
    {
      q: "In an H-bridge, what happens if the top and bottom switches on the same side are closed together?",
      choices: [
        "The motor spins at double speed",
        "The supply is shorted straight to ground (shoot-through)",
        "The motor brakes gently",
        "Nothing, because the motor limits the current",
      ],
      answer: 1,
      explain: "Both switches on one side connect the supply directly to ground without going through the motor. That's a short circuit called shoot-through, and it can destroy the driver.",
    },
    {
      q: "An H-bridge is driving a motor forward. How do you make it run in reverse?",
      choices: [
        "Close the other diagonal pair of switches, so the current crosses the motor the other way",
        "Turn the PWM frequency down",
        "Swap the battery's wires round",
        "Close all four switches at once",
      ],
      answer: 0,
      explain: "Each diagonal pair connects one motor terminal to + and the other to −. Swapping to the other diagonal swaps which terminal is positive, so the motor runs backwards without anyone rewiring anything. Closing all four is the short circuit from the previous question.",
    },
    {
      q: "Which of these Arduino UNO pins is marked ~ as a PWM pin for analogWrite?",
      choices: ["2", "7", "10", "13"],
      answer: 2,
      explain: "The UNO's PWM pins are marked ~: 3, 5, 6, 9, 10 and 11. Pins 2, 7 and 13 aren't PWM pins on the UNO, so they can't fade an LED or set a motor speed with analogWrite.",
    },
  ],
  buildAlong: {
    title: "Drive a TT motor with a TB6612FNG",
    intro: "Run a TT gear motor forward and backward at changing speeds. The motor gets power from 4×AA batteries through the driver, while the Arduino runs from USB and only sends signals.",
    parts: [
      { id: "arduino-uno", qty: 1 },
      { id: "motor-driver-tb6612", qty: 1, note: "breakout boards often come with header pins you need to solder on" },
      { id: "tt-motor", qty: 1, note: "one with wires already attached is easiest" },
      { id: "battery-holder-4aa", qty: 1, note: "plus 4 AA batteries" },
      { id: "breadboard", qty: 1 },
      { id: "jumper-wires", qty: 12 },
      { id: "safety-glasses", qty: 1 },
      { id: "potentiometer", qty: 1, note: "optional, for the challenge in the last step" },
    ],
    steps: [
      "If your TB6612FNG breakout came without header pins attached, solder them on first (or ask a teacher or adult to help). Wear safety glasses while soldering.",
      "Push the driver into the breadboard so it straddles the center gap. Keep the battery holder **switched off** and the Arduino **unplugged** while you wire.",
      "Logic side: driver **VCC** → Arduino **5V**. Driver **GND** → Arduino **GND**. **PWMA** → pin **9**, **AIN1** → pin **7**, **AIN2** → pin **8**, **STBY** → pin **6**.",
      "Motor side: battery **red (+)** → driver **VM**. Battery **black (−)** → driver **GND** (the same ground as the Arduino). The motor's two wires → **AO1** and **AO2**.",
      "Double-check: the battery + goes **only** to VM, never to the Arduino's 5V pin. All the grounds (battery −, driver GND, Arduino GND) are connected.",
      "Plug in USB and upload the sketch from the lesson. Then switch the battery holder on. The motor should speed up, slow down, reverse, and repeat.",
      "If the motor spins the \"wrong\" way first, swap its two wires on AO1/AO2. Try changing the `delay(10)` values, or limit the top speed to 150 and watch the difference.",
      "Challenge: add a potentiometer on A0 and use `analogRead(A0) / 4` as the speed (0–1023 becomes 0–255).",
    ],
    safety: [
      "Wear safety glasses when soldering, and when running motors under load.",
      "Keep fingers, hair and loose cords away from spinning shafts and wheels.",
      "Don't let the battery's bare wires touch each other. Switch the battery pack off before changing any wiring.",
    ],
    code: { language: "cpp", caption: "Upload with the battery switched off, then switch it on.", source: RAMP_SKETCH },
  },
  inTheField: `PWM and H-bridges are how almost every modern electric motor is controlled. In electric vehicles, the inverter is a set of bridge legs built from IGBTs or silicon-carbide MOSFETs, switched thousands of times per second to drive the motor. FIRST Robotics teams use motor controllers that take a command from the robot's computer and use PWM internally to drive large motors in both directions. Drones use electronic speed controllers (ESCs) built on the same half-bridge switches, and industrial variable-frequency drives run factory pumps and conveyors this way. Power-electronics engineers design these circuits around dead time, switching losses and heat, following standards from organizations like the IEC and IEEE.`,
  resources: [
    { label: "Arduino language reference (analogWrite)", url: "https://docs.arduino.cc/language-reference/" },
    { label: "Arduino docs", url: "https://docs.arduino.cc/" },
  ],
};
