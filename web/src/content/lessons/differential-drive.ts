import type { Lesson } from "../types";

export const differentialDrive: Lesson = {
  id: "differential-drive",
  unit: "robotics",
  title: "Differential Drive Robots",
  minutes: 16,
  summary: "How a two-wheeled robot steers by changing wheel speeds, how to work out how fast it rolls, and why timed moves always drift.",
  objectives: [
    "Convert motor RPM and wheel size into wheel speed",
    "Explain how driving the two wheels at different speeds steers the robot",
    "Predict the motion for straight driving, spinning, pivoting and curves",
    "Explain why open-loop dead reckoning drifts and how encoders help",
  ],
  slides: [
    {
      image: { src: "/img/photo/robot-two-wheel.jpg", alt: "A small two-wheeled mobile robot", credit: "Pioneer UAV, Inc / Wikimedia Commons (CC0)" },
      title: "Two wheels, two motors",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Two wheels, two motors",
      body: `A **differential-drive** robot has two wheels on the same axle line, each turned by its **own** motor, plus a free-spinning **caster** (a swivel wheel or a smooth ball) that holds the robot level.

There's no steering wheel. The robot turns by driving its wheels at **different speeds**:
- Same speed, same direction: it drives straight.
- One wheel faster: it curves toward the slower side.
- Equal speeds in opposite directions: it spins in place.

This design is popular because it's simple, cheap and can turn in a tight space. Robot vacuums, many warehouse robots, power wheelchairs and most classroom robot kits use it. (Tanks and many FIRST robots use a close cousin called **skid steer** or tank drive, with several wheels or treads on each side.)`,
    },
    {
      heading: "From motor RPM to wheel speed",
      body: `A motor's speed is usually given in **RPM**: revolutions per minute. Turning that into a speed along the floor takes one idea — **every turn of the wheel moves the robot forward by one circumference**, as long as the wheel doesn't slip.

So work out the circumference (π × diameter), count how many turns happen each second (RPM ÷ 60), and multiply.`,
      formula: {
        expr: "speed = π × d × RPM ÷ 60",
        where: [
          ["speed", "how fast the wheel rolls along the floor (m/s)"],
          ["d", "wheel diameter (m)"],
          ["RPM", "wheel revolutions per minute, after the gearbox"],
        ],
      },
      example: {
        problem: "A robot has 65 mm wheels driven at 120 RPM. How fast does it roll?",
        solution: `One turn of the wheel covers π × 0.065 = **0.204 m**.

120 RPM is 120 ÷ 60 = **2 turns per second**.

So the speed is 2 × 0.204 ≈ **0.41 m/s**, a bit under half a metre a second.

Careful with the units: use the diameter in metres, not millimetres, and remember the RPM you want is the wheel's, after the gearbox, not the bare motor's.`,
      },
      callout: {
        kind: "tip",
        text: "A TT gear motor is rated about 200 RPM at 6 V with no load. Under the robot's weight, and at less than full PWM, it turns slower, so measure your robot's real speed instead of trusting the label.",
      },
    },
    {
      heading: "Four motions to know",
      body: `Four wheel-speed combinations give a differential-drive robot its whole vocabulary:

- **Straight**: both wheels the same speed, same direction.
- **Gentle curve**: both forward, one a little faster. The robot turns toward the **slower** wheel, in a wide arc. The bigger the difference, the tighter the arc.
- **Pivot around one wheel**: one wheel stopped. The robot swings around the stopped wheel, so the turn is about half a robot-width across.
- **Spin in place**: equal speeds in **opposite** directions. The robot turns about the middle of its axle and goes nowhere.

Spinning in place is the tightest turn there is, which is why robot vacuums and warehouse robots use this layout: they can turn around in a corridor no wider than themselves.

Turning by a set angle — a quarter turn, say — is normally done by testing rather than by calculation. Set both motors to a spin, time how long a full circle takes, and a quarter of that time is your quarter turn. Motors take a moment to get going and wheels slip a little, so the measured number always beats the predicted one.`,
    },
    {
      heading: "Why robots drift, and how to fix it",
      body: `Tell two "identical" motors to run at the same PWM and they won't turn at quite the same speed. Small differences in the motors, gearboxes, wheels, and friction add up. If you program a robot with **open-loop** timed moves ("drive forward for 3 seconds"), it can't notice.

Estimating position by adding up how the wheels moved is called **dead reckoning**. Its errors **grow** the farther you go: a tiny heading error keeps pushing the robot sideways with every meter it drives.

The fix is **feedback** (**closed-loop** control). **Wheel encoders** are sensors that count how far each wheel has turned. The program compares the two wheels with each other and with the target, and adjusts each motor's PWM until they match. Even with encoders, wheels slip on the floor, so serious robots also use a gyroscope to measure turning, and cameras, lidar or known landmarks to correct their position.`,
      example: {
        problem: "Your robot's right motor runs just 2% fast: v_L = 0.300 m/s, v_R = 0.306 m/s, b = 0.14 m. It tries to drive 2 m straight. How far off does it end up?",
        solution: `Over the 2 m, the right wheel rolls 2% farther than the left: about **4 cm** of extra travel on one side.

Four centimetres of difference across a 14 cm track is enough to swing the robot's heading by roughly **16°**, and once it's pointing the wrong way, every further centimetre takes it further off line.

By the end of the 2 m it's about **28 cm** to the left of where you aimed. Drive 4 m instead of 2 and the error is more than four times bigger, because the heading error has had longer to work.`,
      },
      callout: {
        kind: "real-world",
        text: "Warehouse robots that carry shelves use dead reckoning between stops, then read barcodes or markers on the floor to snap their position estimate back to the truth.",
      },
    },
  ],
  quiz: [
    {
      q: "Both wheels of a differential-drive robot move forward at 0.2 m/s. What does the robot do?",
      choices: ["Spins in place", "Curves to the left", "Stays still", "Drives straight at 0.2 m/s"],
      answer: 3,
      explain: "With no difference between the wheel speeds there is nothing to make it turn, so it drives straight ahead at the speed both wheels are doing.",
    },
    {
      q: "A robot's left wheel runs slower than its right wheel, both forward. What does the robot do?",
      choices: [
        "Drives straight, but more slowly",
        "Curves to the left, in a big arc",
        "Curves to the right, in a big arc",
        "Spins in place to the left",
      ],
      answer: 1,
      explain: "The faster wheel travels the outside of the curve, so the robot turns toward the slower wheel: left here. Both wheels still go forward, so it's a wide arc rather than a spin. A spin needs one wheel forward and one backward.",
    },
    {
      q: "Which pair of wheel speeds makes the robot spin in place?",
      choices: ["v_L = 0.2, v_R = −0.2 m/s", "v_L = 0, v_R = 0.2 m/s", "v_L = 0.2, v_R = 0.4 m/s", "v_L = 0.2, v_R = 0.2 m/s"],
      answer: 0,
      explain: "Equal and opposite speeds give v = 0 with ω ≠ 0, so the robot turns around the middle of its axle. One wheel stopped (v_L = 0) gives a pivot around that wheel instead.",
    },
    {
      q: "A wheel with a 60 mm diameter turns at 100 RPM. About how fast does it roll?",
      choices: ["0.63 m/s", "6.0 m/s", "0.31 m/s", "0.16 m/s"],
      answer: 2,
      explain: "One turn covers π × 0.060 ≈ 0.188 m. 100 RPM is 100 ÷ 60 ≈ 1.67 turns per second. 1.67 × 0.188 ≈ 0.31 m/s. (Using the radius by mistake halves the answer.)",
    },
    {
      q: "You program a robot to drive a square with timed moves, and it ends up far from where it started. What's the main reason?",
      choices: [
        "The Arduino's clock is too slow to time the moves",
        "Differential-drive robots can't drive in squares",
        "Its motors don't match exactly, and open-loop timing never checks or corrects the error",
        "The caster steers the robot randomly",
      ],
      answer: 2,
      explain: "Timed moves are open loop: the code never measures what really happened. Small mismatches in motors, wheels and friction make every side and turn a little off, and the errors add up. Encoders and a gyro let the robot measure and correct.",
    },
  ],
  buildAlong: {
    title: "2WD robot: drive a square",
    intro: "Build a two-wheeled robot and program it to drive a square using timed moves. Then watch where it really ends up, and figure out why.",
    parts: [
      { id: "robot-chassis-2wd", qty: 1, note: "includes two TT motors, wheels and a caster" },
      { id: "arduino-uno", qty: 1 },
      { id: "motor-driver-tb6612", qty: 1 },
      { id: "battery-holder-4aa", qty: 1, note: "plus 4 AA batteries, for the motors" },
      { id: "breadboard", qty: 1, note: "a half-size one fits on most chassis plates" },
      { id: "jumper-wires", qty: 16 },
      { id: "safety-glasses", qty: 1, note: "if you need to solder header pins or motor wires" },
    ],
    steps: [
      "Assemble the chassis following its instructions: mount the two TT motors, press on the wheels, and attach the caster. If the motor wires or the driver's header pins need soldering, ask an adult to help, and wear safety glasses.",
      "Push the TB6612FNG breakout into the breadboard. Wire the **logic side**: **VCC** → Arduino **5V**, **GND** → Arduino **GND**, **STBY** → pin **4**.",
      "Wire the **control pins**: **PWMA** → pin **5**, **AIN1** → pin **7**, **AIN2** → pin **8** (left motor), and **PWMB** → pin **6**, **BIN1** → pin **11**, **BIN2** → pin **12** (right motor).",
      "Wire the **motor side**: left motor to **AO1/AO2**, right motor to **BO1/BO2**. Battery holder red wire → **VM**, black wire → a driver **GND** pin. All grounds (battery, driver and Arduino) must be connected together: that's the **common ground**.",
      "Keep the Arduino on USB for the first test and prop the robot up so its wheels spin freely in the air. Upload the sketch, switch on the batteries, and press reset. If a wheel spins backward, swap that motor's two wires.",
      "Now set it on the floor (a long USB cable works; for a cable-free robot you'll need a USB power bank for the Arduino). Tune TURN_MS until each turn is close to 90°, and SIDE_MS for sides about 50 cm long.",
      "Put a coin at the start and run it a few times. Where does it finish? Try drawing the path on paper, or taping a marker to the back. Which errors grow as it goes: the turns or the straight sides?",
    ],
    safety: [
      "Never connect the 6 V battery to the Arduino's 5V pin, and keep battery wires from touching each other.",
      "Switch the battery holder off when you're not testing, so the robot doesn't drive off the table.",
    ],
    code: {
      language: "cpp",
      caption: "Open-loop square: four timed straight sides and four timed spins.",
      source: `// 2WD robot: drive a square with timed moves (open loop)
// TB6612FNG: motor A = left, motor B = right
const int PWMA = 5, AIN1 = 7, AIN2 = 8;
const int PWMB = 6, BIN1 = 11, BIN2 = 12;
const int STBY = 4;

const int SPEED = 150;                // PWM, 0-255
const unsigned long SIDE_MS = 1500;   // time for one side (tune this)
const unsigned long TURN_MS = 450;    // time for a 90-degree spin (tune this)

// speed: -255 (full reverse) to 255 (full forward)
void setMotor(int pwmPin, int in1, int in2, int speed) {
  speed = constrain(speed, -255, 255);
  digitalWrite(in1, speed > 0 ? HIGH : LOW);
  digitalWrite(in2, speed < 0 ? HIGH : LOW);
  analogWrite(pwmPin, abs(speed));
}

void drive(int left, int right) {
  setMotor(PWMA, AIN1, AIN2, left);
  setMotor(PWMB, BIN1, BIN2, right);
}

void setup() {
  pinMode(PWMA, OUTPUT); pinMode(AIN1, OUTPUT); pinMode(AIN2, OUTPUT);
  pinMode(PWMB, OUTPUT); pinMode(BIN1, OUTPUT); pinMode(BIN2, OUTPUT);
  pinMode(STBY, OUTPUT);
  digitalWrite(STBY, HIGH);   // wake up the driver

  delay(2000);                // time to set the robot down
  for (int side = 0; side < 4; side++) {
    drive(SPEED, SPEED);      // straight
    delay(SIDE_MS);
    drive(-SPEED, SPEED);     // spin left in place
    delay(TURN_MS);
  }
  drive(0, 0);                // stop
}

void loop() {
  // Nothing: the square runs once. Press reset to run it again.
}`,
    },
  },
  inTheField: `Differential drive is everywhere in real robots. Robot vacuums use it with bump sensors and cliff sensors, and warehouse robots use it to slide under shelving units and carry them to workers. Power wheelchairs are differential drive too: the joystick sets the two wheel speeds. Engineers never trust timing alone. They fuse wheel encoders with a gyroscope (and often lidar or floor markers) in software to estimate the robot's position, and industrial driverless vehicles must meet safety standards such as ISO 3691-4.`,
};
