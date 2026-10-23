import type { Lesson } from "../types";

export const senseThinkAct: Lesson = {
  id: "sense-think-act",
  unit: "robotics",
  title: "Sense, Think, Act: Robot Sensors",
  minutes: 20,
  summary: "How robots measure the world: the sense–think–act loop, digital and analog sensors, and how an ultrasonic sensor turns an echo into a distance.",
  objectives: [
    "Describe the sense–think–act loop and tell sensors apart from actuators",
    "Explain the difference between digital and analog sensors",
    "Calculate distance from an HC-SR04 echo time",
    "Say what an HC-SR04 needs from your program to take a reading",
  ],
  slides: [
    {
      image: { src: "/img/photo/ultrasonic-sensor.jpg", alt: "An HC-SR04 ultrasonic distance sensor with its two transducers", credit: "SparkFun / Wikimedia Commons (CC BY 2.0)" },
      title: "The HC-SR04 ultrasonic sensor",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "The sense–think–act loop",
      body: `Every robot, from a toy car to a Mars rover, runs the same basic cycle:

- **Sense**: read the **sensors**, the parts that measure something about the world (distance, light, touch, angle).
- **Think**: the program decides what to do with those numbers.
- **Act**: drive the **actuators**, the parts that make something happen (motors, servos, LEDs, speakers).

Then it does it all again. The loop repeats **many times per second**, which is what lets a robot react to a world that keeps changing. A hobby robot might run its loop tens of times a second; a drone's flight controller runs its stabilizing loop thousands of times a second.

A quick way to tell them apart: a sensor turns something physical into a signal the computer can read, and an actuator turns a signal from the computer into something physical.`,
      callout: {
        kind: "tip",
        text: "When a robot misbehaves, ask which step is broken. Is the sensor reading wrong (sense), is the logic wrong (think), or is the motor not doing what it's told (act)? Printing sensor values to the Serial Monitor is the fastest way to find out.",
      },
    },
    {
      heading: "Kinds of sensors",
      body: `Sensors come in a few families, based on the kind of signal they give the microcontroller:

- **Digital sensors** have only two states. A **bump switch** (or limit switch) is either pressed or not, so the Arduino reads it as HIGH or LOW with \`digitalRead\`.
- **Analog sensors** give a voltage that can be anywhere in a range. A **potentiometer** (a knob) gives a voltage that follows its angle. A **light sensor** such as a photoresistor, wired in a voltage divider, gives a voltage that changes with brightness. The Arduino UNO's \`analogRead\` turns 0–5 V into a number from 0 to 1023.
- **Distance sensors** measure how far away something is. **Ultrasonic** sensors time an echo of sound. **Infrared** sensors use reflected light, and **lidar** times pulses of laser light.

Real robots combine many of these. A robot vacuum has bump switches on its bumper, infrared "cliff" sensors that look down for stairs, and often a lidar or camera to map the room.`,
    },
    {
      heading: "How the HC-SR04 ultrasonic sensor works",
      body: `The HC-SR04 has two round "eyes." One is a tiny speaker (the **transmitter**) and one is a microphone (the **receiver**). They work at 40 kHz, which is **ultrasound**: too high-pitched for humans to hear.

One measurement works like this:
- The Arduino sets the **TRIG** pin HIGH for **10 µs** (10 microseconds, or millionths of a second).
- The sensor sends a short burst of 40 kHz sound.
- The **ECHO** pin goes HIGH, and it stays HIGH until the reflected sound comes back.

So **the width of the ECHO pulse is the round-trip time** of the sound. The Arduino measures it with \`pulseIn()\`. Because the sound traveled to the object *and back*, you divide by 2.

Sound travels about **343 m/s in air at 20 °C**. That's 0.0343 cm per microsecond, which gives a handy shortcut: distance in cm ≈ echo time in µs ÷ 58. The sensor's useful range is about **2 cm to 4 m**.`,
      formula: {
        expr: "d = v × t ÷ 2        d (cm) ≈ t (µs) ÷ 58",
        where: [
          ["d", "distance to the object"],
          ["v", "speed of sound, ≈ 343 m/s = 0.0343 cm/µs (air at 20 °C)"],
          ["t", "echo pulse width (round-trip time)"],
        ],
      },
      example: {
        problem: "The ECHO pin stays HIGH for 1,166 µs. How far away is the object?",
        solution: `Round trip = 0.0343 cm/µs × 1,166 µs = 40.0 cm

The sound went there and back, so d = 40.0 ÷ 2 = **20.0 cm**.

Shortcut check: 1,166 ÷ 58 ≈ **20.1 cm**. Close enough, since the shortcut rounds 2 ÷ 0.0343 ≈ 58.3 down to 58.`,
      },
      code: {
        language: "cpp",
        caption: "HC-SR04 distance meter. Open the Serial Monitor at 9600 baud.",
        source: `// HC-SR04 ultrasonic distance meter
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);
  Serial.begin(9600);
}

void loop() {
  // SENSE: send a 10 microsecond pulse on TRIG
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // Time how long ECHO stays HIGH, in microseconds.
  // Give up after 30,000 us (about 5 m of travel each way).
  unsigned long duration = pulseIn(ECHO_PIN, HIGH, 30000UL);

  // THINK: turn time into distance
  if (duration == 0) {
    Serial.println("No echo (out of range)");  // pulseIn returns 0 on timeout
  } else {
    float distanceCm = duration * 0.0343 / 2.0;
    Serial.print("Distance: ");
    Serial.print(distanceCm, 1);
    Serial.println(" cm");
  }

  delay(60);  // let old echoes die out before the next ping
}`,
      },
    },
  ],
  quiz: [
    {
      q: "The ECHO pulse from an HC-SR04 is 2,332 µs wide. About how far away is the object? (Use 0.0343 cm/µs.)",
      choices: ["80 cm", "20 cm", "40 cm", "58 cm"],
      answer: 2,
      explain: "Round trip = 0.0343 × 2,332 ≈ 80 cm. The sound went there and back, so the object is 80 ÷ 2 = 40 cm away. (Check: 2,332 ÷ 58 ≈ 40.) Picking 80 cm means forgetting to divide by 2.",
    },
    {
      q: "Why does the distance formula divide by 2?",
      choices: [
        "Because the sensor has two eyes",
        "Because the sound travels to the object and back again",
        "Because the speed of sound is doubled at 40 kHz",
        "To convert microseconds into milliseconds",
      ],
      answer: 1,
      explain: "The echo time measures the whole round trip. The distance to the object is only half of that path. (The two \"eyes\" are just the transmitter and receiver.)",
    },
    {
      q: "Which of these is an actuator?",
      choices: ["A potentiometer", "A bump switch", "A light sensor", "A DC motor"],
      answer: 3,
      explain: "An actuator makes something happen in the world. A motor turns electrical signals into motion. The other three are sensors: they measure something and report it to the microcontroller.",
    },
    {
      q: "What's the key difference between a bump switch and a potentiometer as sensors?",
      choices: [
        "The bump switch is digital (two states); the potentiometer is analog (a range of values)",
        "The bump switch is analog; the potentiometer is digital",
        "Both are digital, but the potentiometer is faster",
        "Only the potentiometer needs to be wired to the Arduino",
      ],
      answer: 0,
      explain: "A bump switch is either pressed or not, so digitalRead gives HIGH or LOW. A potentiometer's voltage can be anywhere from 0 to 5 V, so analogRead gives a number from 0 to 1023.",
    },
    {
      q: "What does your program have to do to start a single HC-SR04 measurement?",
      choices: [
        "Read the ECHO pin and wait for it to go HIGH on its own",
        "Send a short HIGH pulse (about 10 µs) to the TRIG pin",
        "Hold TRIG HIGH for the whole measurement",
        "Nothing: the sensor measures continuously by itself",
      ],
      answer: 1,
      explain: "A brief pulse on TRIG tells the sensor to send its burst of sound. The sensor then raises ECHO for as long as the sound takes to come back, and your job is to time that pulse.",
    },
  ],
  buildAlong: {
    title: "HC-SR04 distance meter",
    intro: "Wire an ultrasonic sensor to your Arduino and print live distances to the Serial Monitor. Then test its limits: soft objects, slanted surfaces, and things off to the side.",
    parts: [
      { id: "arduino-uno", qty: 1 },
      { id: "ultrasonic-hcsr04", qty: 1 },
      { id: "breadboard", qty: 1 },
      { id: "jumper-wires", qty: 4, note: "male-to-female wires are handy if you don't use a breadboard" },
    ],
    steps: [
      "Unplug the Arduino from USB while you wire. Push the HC-SR04 into the breadboard so its four pins are in four separate rows, with the eyes facing out.",
      "Connect **VCC** to the Arduino's **5V** pin and **GND** to **GND**.",
      "Connect **Trig** to digital pin **9** and **Echo** to digital pin **10**. (The UNO R3 and R4 both use 5 V logic, so ECHO can connect directly.)",
      "Plug in USB, upload the distance-meter sketch from this lesson, and open the Serial Monitor at **9600 baud**.",
      "Hold a book flat in front of the sensor and move it. Measure the real distance with a ruler from the front of the sensor. How close do the readings get?",
      "Now try a pillow or a sweater, then tilt the book to about 45°. Watch for jumpy readings or \"No echo.\"",
      "Challenge: take 5 readings in a row, store them in an array, and print the median. Does it stay steadier than single readings?",
    ],
  },
  inTheField: `Ultrasonic sensors are the parking sensors in car bumpers: they're cheap, work in the dark, and are good at spotting large objects a meter or two away. Warehouse robots and self-driving cars combine several kinds of sensors, such as lidar, radar, cameras and ultrasonics, because each one fails in different conditions. This is called **sensor fusion**. Automotive engineers design these systems under safety standards like ISO 26262, which requires planning for what happens when a sensor gives a wrong reading. The same sense–think–act loop you'll write on an Arduino runs inside every one of them.`,
  resources: [
    { label: "Arduino language reference (pulseIn, digitalWrite)", url: "https://docs.arduino.cc/language-reference/" },
  ],
};
