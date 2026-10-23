import type { Lesson } from "../types";

export const motors: Lesson = {
  id: "motors",
  unit: "mechanical",
  title: "DC Motors & Torque–Speed Curves",
  minutes: 22,
  summary: "How a brushed DC motor makes torque, how to read its torque–speed curve, where it makes the most power, why stalling cooks it, and how a gearbox reshapes the curve.",
  objectives: [
    "Explain at a high level how current in a magnetic field turns a DC motor",
    "Define stall torque, free speed, stall current and free current",
    "Use the straight torque–speed line to find the speed at any load",
    "Explain why a stalled motor draws the most current and overheats",
    "Predict how a gearbox changes a motor's output curve",
  ],
  slides: [
    {
      image: { src: "/img/photo/dc-motor.jpg", alt: "A brushed DC electric motor", credit: "Christian Kral / Wikimedia Commons (CC BY 4.0)" },
      title: "How a brushed DC motor turns",
      bullets: [],
    },
    {
      image: { src: "/img/photo/gearmotor.jpg", alt: "A small DC motor with a gearbox attached to its output shaft", credit: "Pioneer UAV, Inc / Wikimedia Commons (CC0)" },
      title: "Gearboxes reshape the curve",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "How a brushed DC motor turns",
      body: `A wire carrying current inside a magnetic field feels a **force**. That's the whole secret of an electric motor. The force is strongest when the wire crosses the field at right angles, and it grows with the field strength, the current and the length of wire in the field (F = B × I × L).

In a **brushed DC motor**, a coil of wire (the **armature**) sits between magnets and can spin on a shaft. Current flows one way along one side of the coil and the opposite way along the other side, so one side is pushed up and the other down. Those two forces make a **torque** that turns the coil.

After half a turn, the forces would start pushing the coil backward. The **commutator** fixes this: it's a split ring on the shaft, touched by two springy contacts called **brushes**. Every half turn, it swaps which way current flows through the coil, so the torque always turns the same direction. Real motors use several coils and commutator segments so the torque is smoother.`,
      callout: {
        kind: "tip",
        text: "Reverse the battery wires and the current flows the other way through the coil, so the motor spins the other way. That's how a motor driver (an H-bridge) drives a robot backward.",
      },
    },
    {
      heading: "The four numbers on every motor datasheet",
      body: `A spinning motor also acts like a generator: it makes a voltage called **back-EMF** that pushes against the supply. The faster it spins, the bigger the back-EMF, and the less current can flow. Less current means less torque. That's why a motor slows down smoothly as you load it, and why it can't speed up forever.

Four numbers describe a brushed DC motor at a given voltage:
- **Free speed** (no-load speed), ω_free: how fast it spins with nothing attached. Almost all the supply voltage is canceled by back-EMF.
- **Free current**, I_free: the small current it draws at free speed, just enough to overcome its own friction.
- **Stall torque**, τ_stall: the torque the motor makes when its shaft is held completely still. It's the most torque the motor can make. Zero speed, zero back-EMF.
- **Stall current**, I_stall: the current it draws when stalled. This is the **biggest** current the motor ever draws, limited mainly by the resistance of the coil, brushes, wires and battery.

For a permanent-magnet brushed DC motor (the kind in robot kits), speed falls in a nearly **straight line** as torque rises, and current rises in a straight line with torque. The formulas below use this ideal straight-line model.`,
      formula: {
        expr: "ω = ω_free × (1 − τ ÷ τ_stall)        I = I_free + (I_stall − I_free) × τ ÷ τ_stall",
        where: [
          ["ω", "speed at load torque τ (RPM or rad/s)"],
          ["τ", "load torque on the motor shaft (N·m)"],
          ["I", "current drawn at that load (A)"],
        ],
      },
      callout: {
        kind: "warning",
        text: "These numbers change with voltage: in this model, doubling the voltage roughly doubles both free speed and stall torque. Always check which voltage a datasheet's numbers are for.",
      },
    },
    {
      heading: "Gearboxes reshape the curve",
      body: `Small DC motors spin fast but make little torque. A robot wheel or arm usually needs the opposite. As you saw in the Gears lesson, a gearbox with ratio GR **multiplies torque by GR** and **divides speed by GR** (ideally). It stretches the whole torque–speed line: the output's stall torque is τ_stall × GR and its free speed is ω_free ÷ GR.

Power is **not** multiplied: an ideal gearbox keeps P_max the same, and a real one loses some of it to friction. Small plastic multi-stage gearboxes can lose a large share, so check real output specs when you can.

The current drawn from the battery depends on the torque at the **motor** shaft, which is the output torque ÷ GR. A bigger reduction makes the same load feel lighter to the motor, so it draws less current and runs cooler.`,
      example: {
        problem: "The example motor drives a robot arm that needs 1.77 N·m to hold a load (from the Torque & Levers lesson). Would a 20:1 gearbox work? What about 100:1? (Assume ideal gearboxes.)",
        solution: `20:1 → output stall torque = 0.04 × 20 = **0.8 N·m**. That's less than 1.77 N·m, so the arm would stall and droop. It can't even hold the load.

100:1 → output stall torque = 0.04 × 100 = **4 N·m**, free speed = 6000 ÷ 100 = 60 RPM.

The load is 1.77 ÷ 4 ≈ 44% of stall, so the arm lifts at about 60 × (1 − 0.44) ≈ **33 RPM** and the motor draws about 0.2 + 4.8 × 0.44 ≈ 2.3 A. That works, but it's a fairly heavy load. A real gearbox's friction would push it closer to stall, so an engineer might choose an even bigger ratio or a stronger motor.`,
      },
      callout: {
        kind: "real-world",
        text: "The yellow TT motors in many robot kits are a small brushed motor with a built-in plastic 1:48 gearbox, giving roughly 200 RPM at 6 V with no load.",
      },
    },
  ],
  quiz: [
    {
      q: "A motor has a free speed of 3000 RPM and a stall torque of 0.2 N·m. How fast does it spin with a 0.1 N·m load?",
      choices: ["3000 RPM", "1500 RPM", "750 RPM", "0 RPM"],
      answer: 1,
      explain: "ω = 3000 × (1 − 0.1 ÷ 0.2) = 3000 × 0.5 = 1500 RPM. The torque–speed line is straight, so half the stall torque gives half the free speed.",
    },
    {
      q: "As you load a brushed DC motor more and more heavily, what happens to the current it draws?",
      choices: [
        "It falls, because the motor slows down",
        "It stays the same whatever the load",
        "It rises, and is highest of all at stall",
        "It rises only if you also raise the voltage",
      ],
      answer: 2,
      explain: "A loaded motor slows, which reduces the back-EMF fighting the supply, so more current flows. At stall there is no back-EMF at all, which is why stall current is the biggest number on the datasheet.",
    },
    {
      q: "Which pair of datasheet numbers describes a motor spinning with nothing attached to its shaft?",
      choices: [
        "Free speed and free current",
        "Stall torque and stall current",
        "Free speed and stall current",
        "Stall torque and free current",
      ],
      answer: 0,
      explain: "With no load the motor runs at its fastest (free speed) and draws only the small current needed to overcome its own friction (free current). The stall pair describes the opposite extreme: shaft held still, maximum torque, maximum current.",
    },
    {
      q: "Why can a stalled motor overheat quickly?",
      choices: [
        "It draws its highest current, and with no motion, all the electrical power becomes heat",
        "The battery voltage doubles when the shaft stops",
        "The magnets rub against the coil",
        "A stalled motor draws no current, so its cooling stops",
      ],
      answer: 0,
      explain: "With the shaft stopped, there's no back-EMF, so current is at its maximum (I_stall). None of the power leaves as mechanical work, so it all heats the coil.",
    },
    {
      q: "You add an ideal 10:1 gearbox to a motor with a stall torque of 0.05 N·m and a free speed of 5000 RPM. What are the output stall torque and free speed?",
      choices: ["0.005 N·m and 50,000 RPM", "0.5 N·m and 5000 RPM", "0.5 N·m and 500 RPM", "0.05 N·m and 500 RPM"],
      answer: 2,
      explain: "A 10:1 reduction multiplies torque by 10 (0.05 → 0.5 N·m) and divides speed by 10 (5000 → 500 RPM). Maximum power stays the same.",
    },
  ],
  buildAlong: {
    title: "Measure a TT motor's speed with slow-motion video",
    intro: "Find your motor's real free speed with a phone camera, then see how much it slows down when it has to drive a robot. You'll check the \"about 200 RPM at 6 V\" spec yourself.",
    parts: [
      { id: "robot-chassis-2wd", qty: 1, note: "includes two TT motors and wheels; or use a single TT motor with a wheel" },
      { id: "battery-holder-4aa", qty: 1, note: "plus 4 AA batteries" },
      { id: "multimeter", qty: 1, note: "optional, for the current step" },
      { id: "safety-glasses", qty: 1 },
    ],
    steps: [
      "Put a bright strip of tape across one wheel, from the hub to the rim, so you can see each revolution clearly. Measure the wheel's diameter (TT wheels are often about 65 mm) and write it down.",
      "With the battery switch **off**, connect the battery holder's red and black wires to one TT motor's two terminals. Hold or tape the motor down so the wheel is **off the ground** and free to spin.",
      "Find your phone's slow-motion frame rate in its camera settings (often 120 or 240 frames per second). Switch the batteries on and film the wheel from the side for a few seconds, then switch off.",
      "In a video app that can step frame by frame, count how many frames it takes the tape to go around **10 times**. Then: **RPM = 60 × fps × 10 ÷ frames**. For example, at 240 fps, 10 turns in 720 frames gives 60 × 240 × 10 ÷ 720 = **200 RPM**.",
      "Compare with the spec (about 200 RPM at 6 V, no load). Fresh alkaline AAs can give a little over 6 V and rechargeable NiMH cells about 4.8 V, and speed follows voltage, so your number may differ.",
      "Now put the motors on the robot chassis (wire both to the battery pack; if one wheel spins backward, swap that motor's two wires). Time the robot driving 1 m on a smooth floor. Its speed v = 1 m ÷ time, and the loaded wheel speed is RPM = v ÷ (π × wheel diameter) × 60. It should be lower than the free speed you measured: the load moved the operating point down the torque–speed line.",
      "Optional: with an adult's help, measure current. Set the multimeter to DC amps, move the red probe to the high-current jack (often labeled 10 A), and connect it **in series** between the battery's red wire and the motor. Compare the current with the wheel spinning freely and with the robot driving. Move the red probe back to the voltage jack when you're done.",
    ],
    safety: [
      "Wear safety glasses when motors spin, and keep fingers, hair and loose sleeves away from the wheels.",
      "Don't hold a motor stalled for more than a second or two. It draws its biggest current and heats up fast.",
      "Use only the 4 × AA pack (about 6 V). Never connect motors to wall outlets or modify lithium batteries.",
    ],
  },
  inTheField: `Engineers pick motors by overlaying the load's needs on motor curves published by manufacturers, then choosing a gear ratio that puts the normal operating point in an efficient, cool-running region. Datasheets also give a continuous torque rating, set by how much heat the motor can shed, which is usually far below stall torque. FIRST Robotics teams use motor curves to predict drivetrain speed and pushing force and to avoid tripping breakers by stalling. Industrial motors are designed and rated to standards such as IEC 60034 and NEMA MG 1. Brushless motors in drones and electric cars use electronic commutation instead of brushes, but engineers read their torque–speed limits in the same way.`,
};
