import type { Lesson } from "../types";

export const arduinoBasics: Lesson = {
  id: "arduino-basics",
  unit: "robotics",
  title: "Microcontrollers & Arduino",
  minutes: 22,
  summary: "What a microcontroller is, how an Arduino sketch runs, and how to read buttons and knobs and blink LEDs without freezing your program.",
  objectives: [
    "Explain what a microcontroller is and how it differs from a laptop",
    "Describe how setup() and loop() run, and use pinMode, digitalWrite and digitalRead",
    "Read a button with INPUT_PULLUP and act on it in loop()",
  ],
  slides: [
    {
      image: { src: "/img/photo/arduino.jpg", alt: "An Arduino microcontroller board", credit: "DustyDingo / Wikimedia Commons (Public domain)" },
      title: "A computer on one chip",
      bullets: [],
    },
    {
      image: { src: "/img/photo/breadboard.jpg", alt: "A breadboard with components and jumper wires", credit: "Safranek-interia.eu / Wikimedia Commons (CC0)" },
      title: "Reading a button",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "A computer on one chip",
      body: `A **microcontroller** is a complete small computer on a single chip. Inside are a processor (the **CPU**), **flash memory** that stores your program, **RAM** for variables, and **I/O** (input/output) hardware: pins that can read or set voltages, timers, and an **analog-to-digital converter** that measures voltages.

A laptop is different. It has many separate chips, runs an **operating system**, and juggles many programs at once. A microcontroller has no operating system. It runs **one program**, starts almost instantly when powered, and uses very little power, which is why microcontrollers are hidden inside microwaves, cars, toys and robots.

The **Arduino UNO** is a board built around a microcontroller, plus a USB connection for uploading programs. Two versions are common:
- **UNO R3**: an ATmega328P running at 16 MHz, with 32 KB of flash and 2 KB of RAM. Its pins use **5 V logic**.
- **UNO R4 Minima**: a Renesas RA4M1 (an Arm Cortex-M4) running at 48 MHz, with 256 KB of flash and 32 KB of RAM. It keeps the same board shape and 5 V pins.

Every sketch in this lesson runs on both.`,
      callout: {
        kind: "warning",
        text: "Pins can only supply a little current. The UNO R4's pins are rated for about 8 mA each, less than the R3's. That's why the builds here use a 1 kΩ resistor with each LED, which keeps the current to about 3 mA.",
      },
    },
    {
      heading: "setup(), loop() and digital outputs",
      body: `An Arduino program is called a **sketch**. Every sketch has two functions:

- \`setup()\` runs **once**, when the board powers up or resets. Use it to configure pins and start things.
- \`loop()\` runs **forever**. As soon as it finishes, it starts again from the top.

To control an LED, first make its pin an output with \`pinMode(pin, OUTPUT)\`. Then \`digitalWrite(pin, HIGH)\` sets the pin to 5 V (on) and \`digitalWrite(pin, LOW)\` sets it to 0 V (off). \`delay(ms)\` pauses the program for that many **milliseconds** (thousandths of a second).

Pin 13 is connected to a small LED on the board labeled **L**, and \`LED_BUILTIN\` is a name for that pin, so you can blink an LED with no wiring at all.`,
      code: {
        language: "cpp",
        caption: "Blink: the built-in LED turns on for 1 s, then off for 1 s, forever.",
        source: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);   // runs once
}

void loop() {                     // runs forever
  digitalWrite(LED_BUILTIN, HIGH); // LED on (5 V)
  delay(1000);                     // wait 1000 ms
  digitalWrite(LED_BUILTIN, LOW);  // LED off (0 V)
  delay(1000);
}`,
      },
    },
    {
      heading: "Reading a button: variables, if, and INPUT_PULLUP",
      body: `A **variable** is a named box that holds a value, like \`int count = 0;\` (a whole number) or \`bool ledOn = false;\` (true or false). An \`if\` statement runs code only when a condition is true, with an optional \`else\` for when it's false.

To read a button, use \`digitalRead(pin)\`, which returns HIGH or LOW. But an input pin that isn't connected to anything **floats**: it picks up electrical noise and reads randomly. The fix is a **pull-up resistor** that gently holds the pin at 5 V. The Arduino has one built in, turned on with \`pinMode(pin, INPUT_PULLUP)\`.

Wire the button between the pin and **GND**. Then:
- Not pressed: the pull-up holds the pin at 5 V, so it reads **HIGH**.
- Pressed: the button connects the pin straight to ground, so it reads **LOW**.

So with INPUT_PULLUP, **LOW means pressed**. It feels backward at first, but it's the most common way to wire buttons because it needs no extra parts.`,
      code: {
        language: "cpp",
        caption: "The LED on pin 8 lights while the button on pin 2 is held down.",
        source: `const int BUTTON_PIN = 2;   // button between pin 2 and GND
const int LED_PIN = 8;      // LED + 1 kOhm resistor to GND

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {   // LOW = pressed
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}`,
      },
    },
  ],
  quiz: [
    {
      q: "How many times does `setup()` run?",
      choices: ["Once every loop", "Forever", "Once, when the board powers up or resets", "Every 1000 ms"],
      answer: 2,
      explain: "setup() runs once at power-up or reset. loop() is the function that repeats forever.",
    },
    {
      q: "You want to blink an LED on pin 13. Which line belongs in `setup()`, and why?",
      choices: [
        "`digitalWrite(13, HIGH);`, to turn the pin on once",
        "`pinMode(13, OUTPUT);`, to tell the chip that pin 13 will drive something",
        "`pinMode(13, INPUT);`, so the pin can send current",
        "Nothing: pins are outputs by default",
      ],
      answer: 1,
      explain: "Every pin starts as an input, which can sense a voltage but not drive one. `pinMode(13, OUTPUT)` in `setup()` switches it over; the `digitalWrite` calls that actually blink it belong in `loop()`.",
    },
    {
      q: "A button is wired between pin 2 and GND, and the pin is set to `INPUT_PULLUP`. What does `digitalRead(2)` return while the button is pressed?",
      choices: ["HIGH", "LOW", "A random value", "1023"],
      answer: 1,
      explain: "The internal pull-up holds the pin HIGH when the button is open. Pressing connects the pin to ground, so it reads LOW. (1023 would come from analogRead, not digitalRead.)",
    },
    {
      q: "What happens when the program reaches the last line of `loop()`?",
      choices: [
        "The board stops until you press reset",
        "It runs `setup()` again",
        "It goes straight back to the first line of `loop()` and runs it again",
        "It waits one second, then repeats",
      ],
      answer: 2,
      explain: "`loop()` runs over and over, thousands of times a second, for as long as the board has power. That endless repetition is what lets a robot keep checking its sensors and reacting.",
    },
    {
      q: "Which statement about a microcontroller is true?",
      choices: [
        "It needs an operating system like Windows to run a sketch",
        "It combines a CPU, memory and I/O pins on a single chip",
        "It can only run programs while plugged into a laptop",
        "It is a type of sensor",
      ],
      answer: 1,
      explain: "A microcontroller is a small computer on one chip. It runs your program with no operating system, and once uploaded, the sketch runs whenever the board has power (from USB or batteries).",
    },
  ],
  buildAlong: {
    title: "Blink, button and knob",
    intro: "Build three classic Arduino circuits on one breadboard: an LED that blinks without delay(), a button that responds instantly, and a knob that sets the blink speed and prints its voltage.",
    parts: [
      { id: "arduino-uno", qty: 1 },
      { id: "breadboard", qty: 1 },
      { id: "jumper-wires", qty: 8 },
      { id: "leds", qty: 1 },
      { id: "resistor-kit", qty: 1, note: "you need one 1 kΩ resistor (brown-black-red)" },
      { id: "pushbuttons", qty: 1 },
      { id: "potentiometer", qty: 1 },
    ],
    steps: [
      "Unplug USB while you wire. Run a jumper from the Arduino's **5V** pin to the breadboard's red (+) rail and from **GND** to the blue (−) rail.",
      "**LED**: connect pin **8** to one end of a **1 kΩ resistor**. Put the other end of the resistor in the same row as the LED's **long leg** (the anode). Connect the LED's short leg (the flat side, the cathode) to the GND rail.",
      "**Button**: push the button across the breadboard's center gap. Connect one leg to pin **2** and the leg diagonally opposite to the GND rail. No resistor is needed because the sketch turns on INPUT_PULLUP.",
      "**Potentiometer**: connect its two outer legs to the 5 V and GND rails, and its middle leg (the wiper) to **A0**.",
      "Plug in USB, upload the sketch below, and open the Serial Monitor at **9600 baud**. Turn the knob: the blink speed and the printed voltage should both change.",
      "Hold the button: the on-board **L** LED lights instantly, even while the external LED is blinking. Now try adding a `delay(1000)` at the end of `loop()`. What happens to the button and the printing?",
    ],
    code: {
      language: "cpp",
      caption: "The knob sets the blink speed; the button lights the on-board LED instantly.",
      source: `const int LED_PIN = 8;       // external LED through a 1 kOhm resistor
const int BUTTON_PIN = 2;    // button to GND (internal pull-up)
const int POT_PIN = A0;      // potentiometer wiper

bool ledOn = false;
unsigned long lastToggle = 0;
unsigned long lastPrint = 0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  unsigned long now = millis();
  int reading = analogRead(POT_PIN);                       // 0-1023
  unsigned long interval = map(reading, 0, 1023, 100, 1000); // ms

  // Blink without delay()
  if (now - lastToggle >= interval) {
    lastToggle = now;
    ledOn = !ledOn;
    digitalWrite(LED_PIN, ledOn ? HIGH : LOW);
  }

  // The button is checked thousands of times per second
  if (digitalRead(BUTTON_PIN) == LOW) {   // LOW = pressed
    digitalWrite(LED_BUILTIN, HIGH);
  } else {
    digitalWrite(LED_BUILTIN, LOW);
  }

  // Print twice a second
  if (now - lastPrint >= 500) {
    lastPrint = now;
    float volts = reading * 5.0 / 1023.0;
    Serial.print("Pot: ");
    Serial.print(reading);
    Serial.print("  (");
    Serial.print(volts, 2);
    Serial.println(" V)");
  }
}`,
    },
    safety: [
      "Always wire with USB unplugged, and double-check before plugging in. Never connect 5V directly to GND: that's a short circuit.",
    ],
  },
  inTheField: `A modern car contains dozens of microcontrollers, running everything from the windows to the airbags, and they talk to each other over a network called CAN bus. Embedded-systems engineers write their firmware in C and C++, the same languages Arduino uses, and code that must be safe often follows strict rules such as the MISRA C guidelines. Like your millis() blink, professional firmware avoids blocking waits: it uses timers, interrupts, or a small real-time operating system so the chip can respond to events within microseconds. Many engineers still sketch out a first prototype on an Arduino before designing a custom circuit board.`,
  resources: [
    { label: "Arduino docs", url: "https://docs.arduino.cc/" },
    { label: "Arduino language reference", url: "https://docs.arduino.cc/language-reference/" },
  ],
};
