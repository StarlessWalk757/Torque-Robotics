// what to buy to follow the lessons along. links were right when this was written
// amazon ones point at a search, not one listing -- single listings disappear and then the link is dead
// the "look for" line is the thing that matters, not the link. specs drift between sellers

export interface Part {
  id: string;
  name: string;
  category: "Kits" | "Electronics" | "Motors & motion" | "Mechanical" | "Tools & safety";
  why: string;
  lookFor: string;
  links: { store: string; url: string }[];
}

const amazon = (q: string) => ({ store: "Amazon (search)", url: "https://www.amazon.com/s?k=" + encodeURIComponent(q).replace(/%20/g, "+") });
const adafruitSearch = (q: string) => ({ store: "Adafruit (search)", url: "https://www.adafruit.com/search?q=" + encodeURIComponent(q) });
const sparkfunSearch = (q: string) => ({ store: "SparkFun (search)", url: "https://www.sparkfun.com/catalogsearch/result/?q=" + encodeURIComponent(q) });

export const parts: Part[] = [
  // ---- Kits --------------------------------------------------------------------------------------------
  {
    id: "arduino-starter-kit",
    name: "Arduino Starter Kit (with UNO board)",
    category: "Kits",
    why: "Covers the electrical and Arduino lessons in one box: board, breadboard, wires, resistors, LEDs, a motor, sensors and a project book.",
    lookFor: "Official kit or a clone kit that includes an UNO-compatible board, breadboard, 220 Ω and 10 kΩ resistors, LEDs, pushbuttons and a potentiometer.",
    links: [
      { store: "Arduino Store", url: "https://store.arduino.cc/products/arduino-starter-kit-multi-language" },
      amazon("arduino uno starter kit"),
    ],
  },
  {
    id: "sparkfun-inventors-kit",
    name: "SparkFun Inventor's Kit",
    category: "Kits",
    why: "An alternative all-in-one kit with a RedBoard (Arduino-compatible), a motor driver, two motors and a distance sensor. It's enough to build a small robot.",
    lookFor: "Current version (v4.1 or later).",
    links: [{ store: "SparkFun", url: "https://www.sparkfun.com/products/15267" }],
  },
  {
    id: "robot-chassis-2wd",
    name: "2WD robot chassis kit with TT motors",
    category: "Kits",
    why: "The base for the differential-drive and PID lessons: a plate, two geared motors, wheels and a caster.",
    lookFor: "Two 3–6 V TT gear motors, wheels, a caster wheel or ball, and mounting hardware.",
    links: [
      { store: "Adafruit", url: "https://www.adafruit.com/product/3216" },
      amazon("2WD smart robot car chassis kit TT motor"),
    ],
  },

  // ---- Electronics -------------------------------------------------------------------------------------
  {
    id: "arduino-uno",
    name: "Arduino UNO R4 Minima (or UNO R3)",
    category: "Electronics",
    why: "The microcontroller that runs every Arduino sketch in Torque.",
    lookFor: "UNO R4 Minima/WiFi or UNO R3. All code in Torque works on both. Clones work too.",
    links: [
      { store: "Arduino Store", url: "https://store.arduino.cc/products/uno-r4-minima" },
      { store: "Arduino Store (R3)", url: "https://store.arduino.cc/products/arduino-uno-rev3" },
      amazon("arduino uno r4 minima"),
    ],
  },
  {
    id: "breadboard",
    name: "Solderless breadboard (400 or 830 points)",
    category: "Electronics",
    why: "Lets you build circuits by pushing parts into holes: no soldering, and easy to fix mistakes.",
    lookFor: "Half-size (400) or full-size (830) with power rails on both sides.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/64" }, amazon("solderless breadboard 830")],
  },
  {
    id: "jumper-wires",
    name: "Jumper wires (male-to-male)",
    category: "Electronics",
    why: "Connect the breadboard to the Arduino and to each other.",
    lookFor: "A pack of 40+ male-to-male wires, 10–20 cm long. Add a few male-to-female for sensors.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/758" }, amazon("jumper wires male to male dupont")],
  },
  {
    id: "resistor-kit",
    name: "Resistor assortment (1/4 W)",
    category: "Electronics",
    why: "Current-limiting resistors for LEDs, voltage dividers, and Ohm's-law experiments.",
    lookFor: "1/4 W through-hole, 5% or 1% tolerance, including 220 Ω, 330 Ω, 1 kΩ, 10 kΩ.",
    links: [amazon("resistor assortment kit 1/4W"), sparkfunSearch("resistor kit")],
  },
  {
    id: "leds",
    name: "5 mm LEDs (assorted colors)",
    category: "Electronics",
    why: "The first output you'll control. Great for learning forward voltage and current limits.",
    lookFor: "Standard 5 mm through-hole LEDs; the listing should state forward voltage and max current (typically 20 mA).",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/4203" }, amazon("5mm LED assortment")],
  },
  {
    id: "pushbuttons",
    name: "Tactile pushbuttons",
    category: "Electronics",
    why: "Digital inputs for Arduino sketches.",
    lookFor: "6 mm or 12 mm through-hole tactile switches that fit a breadboard.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/1119" }, amazon("tactile push button switch breadboard")],
  },
  {
    id: "potentiometer",
    name: "10 kΩ potentiometer",
    category: "Electronics",
    why: "A knob you can turn to make an adjustable voltage divider, an easy analog input.",
    lookFor: "Linear (B-taper) 10 kΩ with pins that fit a breadboard.",
    links: [amazon("10k potentiometer breadboard"), adafruitSearch("10K potentiometer")],
  },
  {
    id: "multimeter",
    name: "Digital multimeter",
    category: "Tools & safety",
    why: "Measures voltage, current and resistance. It's the most important tool for troubleshooting circuits.",
    lookFor: "Auto-ranging, with DC voltage, DC current (mA range) and resistance; continuity beep is a big plus.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/850" }, amazon("auto ranging digital multimeter")],
  },
  {
    id: "motor-driver-tb6612",
    name: "TB6612FNG dual motor driver",
    category: "Electronics",
    why: "An H-bridge chip that lets an Arduino drive two DC motors forward and backward with PWM speed control.",
    lookFor: "TB6612FNG breakout (1.2 A per channel). It's more efficient than the older L298N.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/2448" }, sparkfunSearch("TB6612FNG"), amazon("TB6612FNG motor driver")],
  },
  {
    id: "ultrasonic-hcsr04",
    name: "HC-SR04 ultrasonic distance sensor",
    category: "Electronics",
    why: "Measures distance with sound pulses (about 2 cm to 4 m). Used in the sensor and PID lessons.",
    lookFor: "HC-SR04 (5 V). On 3.3 V boards, use a divider on ECHO or a 3.3 V version (HC-SR04+).",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/3942" }, amazon("HC-SR04 ultrasonic sensor")],
  },
  {
    id: "battery-holder-4aa",
    name: "4 × AA battery holder with switch",
    category: "Electronics",
    why: "Powers robot motors (about 6 V with alkaline AAs). The switch makes it easy to turn off.",
    lookFor: "4 × AA holder with on/off switch and wire leads. Rechargeable NiMH AAs give about 4.8 V.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/830" }, amazon("4 AA battery holder with switch")],
  },


  // ---- Motors & motion ---------------------------------------------------------------------------------
  {
    id: "tt-motor",
    name: "TT gear motor (3–6 V)",
    category: "Motors & motion",
    why: "The classic yellow hobby motor with a built-in 1:48 gearbox, used in the motor, gear, and robot lessons.",
    lookFor: "3–6 V DC, 1:48 ratio (about 200 RPM at 6 V). Buy a pair for a robot.",
    links: [{ store: "Adafruit", url: "https://www.adafruit.com/product/3777" }, amazon("TT gear motor 1:48 3-6V")],
  },

  // ---- Mechanical --------------------------------------------------------------------------------------
  {
    id: "technic-gears",
    name: "LEGO Technic gears and axles",
    category: "Mechanical",
    why: "The easiest way to build and feel real gear ratios. Technic's 8, 24 and 40-tooth gears give clean 3:1 and 5:1 ratios.",
    lookFor: "A Technic gear assortment with 8T, 24T and 40T spur gears, axles and a beam frame. Any Technic set with gears works.",
    links: [amazon("LEGO Technic gears axles assortment")],
  },
  {
    id: "gt2-belt-kit",
    name: "GT2 timing belt and pulley set (6 mm wide)",
    category: "Mechanical",
    why: "Build the exact belt drive from the belts lesson and feel why a toothed belt can't slip.",
    lookFor: "2 mm pitch, 6 mm wide closed-loop belts (200–400 mm), 20T and 60T pulleys with a 5 mm bore, and at least one smooth idler pulley.",
    links: [amazon("GT2 timing belt pulley kit 20T 60T 6mm idler")],
  },
  {
    id: "m3-hardware",
    name: "M3 screw, nut and standoff kit",
    category: "Mechanical",
    why: "The most common robot fastener. Your CAD projects use Ø3.4 mm clearance holes sized for M3 screws.",
    lookFor: "M3 socket-head screws (6–20 mm), nuts, and nylon or brass standoffs.",
    links: [amazon("M3 screw nut standoff assortment kit")],
  },

  {
    id: "steel-ruler",
    name: "Steel ruler (300 mm, mm markings)",
    category: "Tools & safety",
    why: "Measuring spring stretch and checking larger parts where a caliper is too short.",
    lookFor: "300 mm / 12 in stainless ruler with millimeter markings that start at the very end.",
    links: [amazon("300mm stainless steel ruler metric")],
  },



  // ---- Tools & safety ----------------------------------------------------------------------------------
  {
    id: "digital-caliper",
    name: "Digital caliper (150 mm / 6 in)",
    category: "Tools & safety",
    why: "Measures parts to 0.01 mm. You'll use it to check 3D prints against your CAD.",
    lookFor: "150 mm range, 0.01 mm resolution, mm/inch switch. Stainless steel lasts longer than plastic.",
    links: [amazon("digital caliper 150mm stainless")],
  },
  {
    id: "safety-glasses",
    name: "Safety glasses (ANSI Z87.1)",
    category: "Tools & safety",
    why: "Wear them whenever you cut, drill, solder, or spin motors under load.",
    lookFor: "Marked ANSI Z87.1 (or Z87+). Fit over prescription glasses if needed.",
    links: [amazon("safety glasses ANSI Z87.1")],
  },
  {
    id: "pla-filament",
    name: "PLA 3D-printer filament (or a print service)",
    category: "Tools & safety",
    why: "To print your CAD projects. No printer? Many libraries and schools print for free, or use an online print service.",
    lookFor: "1.75 mm PLA from a known brand. Check which diameter your printer takes.",
    links: [amazon("PLA filament 1.75mm")],
  },
  {
    id: "ball-bearings-608",
    name: "608 ball bearings (8 × 22 × 7 mm), pack of 10",
    category: "Mechanical",
    why: "The most common hobby bearing: the one in skateboard wheels, 3D printers and spinners. Perfect for feeling radial vs thrust load and press fits.",
    lookFor: "608ZZ (metal shields) or 608-2RS (rubber seals). Check the size reads 8 × 22 × 7 mm.",
    links: [amazon("608ZZ bearing 8x22x7 10 pack")],
  },
  {
    id: "shaft-coupler-set",
    name: "Flexible shaft couplers (5 mm)",
    category: "Mechanical",
    why: "Joins a motor shaft to another shaft while forgiving the small misalignment you'll always have.",
    lookFor: "5 mm to 5 mm or 5 mm to 8 mm bore, jaw or helical type, with set screws.",
    links: [amazon("flexible shaft coupler 5mm motor")],
  },
  {
    id: "hex-key-set",
    name: "Metric hex key (Allen) set, 1.5–6 mm",
    category: "Tools & safety",
    why: "Every socket-head screw in these projects needs one. A short arm also makes it harder to over-torque a small screw.",
    lookFor: "1.5, 2, 2.5, 3, 4, 5 and 6 mm. Ball ends help you reach awkward screws.",
    links: [amazon("metric hex key allen wrench set 1.5-6mm")],
  },
  {
    id: "heat-set-inserts-m3",
    name: "M3 brass heat-set inserts (with an iron tip)",
    category: "Mechanical",
    why: "The right way to put threads in a 3D print: the brass insert melts into the plastic and takes the screw instead of the plastic.",
    lookFor: "Knurled brass M3 inserts with the recommended hole diameter in the listing, plus an insert tip that fits your soldering iron.",
    links: [amazon("M3 brass heat set inserts soldering iron tip")],
  },
];

export const partById = (id: string) => parts.find((p) => p.id === id);
