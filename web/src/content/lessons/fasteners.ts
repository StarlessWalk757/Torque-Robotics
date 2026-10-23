import type { Lesson } from "../types";

export const fasteners: Lesson = {
  id: "fasteners",
  unit: "mechanical",
  title: "Fasteners & Bolted Joints",
  minutes: 16,
  summary: "How to read a metric fastener spec, size the two holes a bolted joint needs, and understand what a bolt really does: it clamps, it isn't a pin.",
  objectives: [
    "Read a spec like M3 × 0.5 × 12 and pick the right head, drive and grade",
    "Size a clearance hole and a tapped hole for any metric screw",
    "Explain preload, and why friction between the clamped parts carries the load",
    "Keep a joint tight, and use heat-set inserts when the part is plastic",
  ],
  slides: [
    {
      image: { src: "/img/photo/bolts-screws.jpg", alt: "An assortment of hex bolts and screws", credit: "Phiarc / Wikimedia Commons (CC BY-SA 4.0)" },
      title: "Reading a fastener spec",
      bullets: [],
    },
    {
      image: { src: "/img/photo/socket-cap-screws.jpg", alt: "Socket head cap screws of several lengths", credit: "Cdang / Wikimedia Commons (Public domain)" },
      title: "Two kinds of hole",
      bullets: [],
    },
    {
      image: { src: "/img/photo/tapped-hole.jpg", alt: "A tap cutting a threaded hole in metal", credit: "Department of the Interior. Patent Office. (1849 - 1925) / Wikimedia Commons (Public domain)" },
      title: "Thread engagement",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "Reading a fastener spec",
      body: `A screw's name is a specification. **M3 × 0.5 × 12** means:

- **M3** — metric thread, 3 mm across the outside of the threads. So an M3 screw will *not* drop through a 3.0 mm hole.
- **0.5** — the **pitch**, the distance between threads. Every size has a standard coarse pitch (M3 → 0.5, M4 → 0.7, M5 → 0.8), so it's usually left out.
- **12** — the length in millimetres, measured from under the head.

**Head types** matter more than they look. A **socket head cap screw** has a tall head and a deep hex socket, and takes the most torque: it's the default. A **button head** is tidier but its shallower socket strips more easily. A **countersunk** head sits flush, but it centres itself in its hole, so it fights you if the holes don't line up.

The number stamped on the head is the strength class: **8.8** is ordinary steel, **12.9** is about twice as strong. Stainless is for corrosion resistance, not strength.`,
      callout: {
        kind: "tip",
        text: "Buy an M3 assortment with 6, 8, 10, 12, 16 and 20 mm lengths and you'll cover almost every robot you build. Choose a length so the screw engages at least one diameter of thread (3 mm for an M3) but doesn't bottom out in the hole.",
      },
    },
    {
      heading: "Two kinds of hole, and the washers between",
      body: `A bolted joint needs **two different holes**, and mixing them up is the commonest beginner CAD mistake.

The part nearest the head gets a **clearance hole**, deliberately bigger than the screw so it slides through:

- M3 → **Ø3.4 mm**  ·  M4 → **Ø4.5 mm**  ·  M5 → **Ø5.5 mm**  ·  M6 → **Ø6.6 mm**

The far part gets a **tapped hole** with a thread cut into it, drilled at roughly the screw diameter minus the pitch (M3 → 2.5 mm, M4 → 3.3 mm, M5 → 4.2 mm), or it gets a **nut** and another clearance hole.

Why does the near part need clearance? If the screw threaded into both parts it would bottom out and never squeeze them together. The clearance hole is what lets the screw pull the parts into contact — that's the whole mechanism.

**Washers** go under the head or nut. A **flat washer** spreads the load, which matters on soft materials like aluminium or plastic. A **nyloc nut** has a nylon collar the thread bites into; it genuinely resists loosening, it's the standard on hobby robots, and it loses its grip after a few re-uses.`,
      callout: {
        kind: "warning",
        text: "Never run a screw into a clearance hole and call the joint done because it feels tight. If the screw is threading into sheet metal or plastic that wasn't tapped, it's cutting its own thread into material that will tear out the first time the joint is loaded.",
      },
    },
    {
      heading: "What a bolt actually does",
      body: `Here's the idea that changes how you look at every machine.

**A bolt is not a pin.** Its job isn't to sit in a hole and stop the parts sliding. Its job is to **stretch like a very stiff spring** and squeeze the parts together. That squeeze is the **preload**, and once the parts are clamped, **friction between their faces** carries any sideways load. The bolt just keeps the friction switched on.

The numbers are startling: a properly tightened M3 screw puts around two kilonewtons of clamp into a joint — about the weight of two adults, from one 3 mm screw.

This explains three things at once. The clearance hole is *correct*, because the bolt isn't meant to touch the sides. Joints fail when the sideways load beats the friction, because then the bolt really does become a thin hardened pin being hammered sideways. And when a joint must resist a big sideways load for certain, engineers add **dowel pins** and let the bolts do nothing but clamp.`,
      example: {
        problem: "A bracket has to resist 600 N of sideways load. You have M3 class 8.8 screws, each giving about 2.0 kN of preload, clamping two clean dry steel plates (μ ≈ 0.2). How many screws do you need?",
        solution: `Each screw's friction capacity = 0.2 × 2000 N = **400 N**.

600 ÷ 400 = 1.5, so you need **two screws** (and you'd probably use two anyway, so the bracket can't rotate).

Now spot the trap: paint the plates and μ might drop to 0.1. Capacity per screw becomes 200 N, and you need **three**. The surface finish of the faying surfaces matters as much as the bolt. On real structures the clamped faces are deliberately left bare, or blasted, exactly for this reason.`,
      },
    },
    {
      heading: "Keeping it tight, and the plastic problem",
      body: `**Why joints loosen.** Not because the screw unwinds itself. Vibration makes the clamped faces slip microscopically, each slip lets the thread turn a fraction, and preload bleeds away. Low preload means more slipping, which loses preload faster — and then the nut spins off in seconds.

So the real fix is **enough preload that the faces never slip**. Everything else is insurance: **nyloc nuts**, a drop of **threadlocker** (blue comes apart with hand tools, red usually needs heat), or serrated flange nuts.

**Thread engagement.** A thread needs depth to work: about 1 × the screw diameter in steel, 1.5–2 × in aluminium, and 2 × or more in plastic — where it will still be the weak link.

**Heat-set inserts** are the proper answer for 3D prints: small knurled brass sleeves that you push into a slightly undersized hole with a hot soldering iron. The plastic melts into the knurling and freezes. You get a real metal thread, the load spread over far more plastic, and a joint you can take apart many times — which a thread tapped straight into PLA cannot survive.`,
      callout: {
        kind: "real-world",
        text: "Walk around any 3D printer, drone or competition robot and you'll see this hierarchy in action: heat-set inserts in printed brackets, tapped threads in aluminum extrusion, nyloc nuts wherever a fastener goes through into open air, and threadlocker on anything that was annoying to reach.",
      },
    },
  ],
  quiz: [
    {
      q: "What does the 0.5 in M3 × 0.5 × 12 tell you?",
      choices: ["The thread pitch is 0.5 mm from crest to crest", "The screw is 0.5 mm shorter than nominal", "The head is 0.5 mm tall", "The clearance hole should be 0.5 mm oversize"],
      answer: 0,
      explain: "It's the pitch: 0.5 mm between neighbouring thread crests, which is M3's standard coarse pitch. The 3 is the nominal (major) diameter and the 12 is the length under the head.",
    },
    {
      q: "You're bolting two plates together with an M4 screw and a nut. What size holes do the plates need?",
      choices: ["4.0 mm in both", "4.5 mm in both", "4.5 mm in one and 3.3 mm in the other", "3.3 mm in both, then tap both"],
      answer: 1,
      explain: "With a nut, both plates need clearance holes, and ISO 273 medium clearance for M4 is 4.5 mm. The 3.3 mm figure is the tap drill, which you'd only use if you were threading the far plate instead of using a nut. A 4.0 mm hole is the screw's own nominal diameter, so at best it's a jam fit, not a clearance hole.",
    },
    {
      q: "In a properly designed bolted joint, what carries a sideways (shear) load across the joint?",
      choices: ["The bolt shank, acting as a pin", "Friction between the clamped faces, held on by the bolt's preload", "The threads in the tapped hole", "The washer under the head"],
      answer: 1,
      explain: "The bolt stretches and clamps; friction between the faying surfaces carries the shear. If the load beats the friction, the parts slip and the bolt starts taking impact loads sideways — which is exactly the condition that breaks bolts. Where shear must be carried positively, engineers add dowel pins rather than relying on the bolt as a pin.",
    },
    {
      q: "Why does a bolted joint need a washer under the head on a 3D-printed part?",
      choices: [
        "To make the screw longer",
        "To spread the clamping force over more plastic, so the head doesn't sink in",
        "To stop the screw rusting",
        "To make the hole bigger",
      ],
      answer: 1,
      explain: "Plastic is soft, so a bare screw head digs in, the joint loses its grip and the screw works loose. A washer spreads that same force over a much larger area. The same trick helps on soft woods and thin sheet metal.",
    },
    {
      q: "You need to screw into a 3D-printed PLA bracket, and the joint will be taken apart several times. What's the best approach?",
      choices: ["Tap an M3 thread straight into the PLA and use the normal 1.2 N·m metal spec", "Use a self-tapping screw and tighten it hard each time", "Melt a brass heat-set insert into the print and screw into that", "Use a 12.9 screw instead of 8.8, since it's stronger"],
      answer: 2,
      explain: "A heat-set insert gives a real metal thread and spreads the load into a much larger area of plastic, so it survives repeated assembly. A thread tapped into PLA strips at roughly half the metal torque spec and chews itself up after a few cycles. A stronger bolt grade doesn't help at all, because the plastic is the weak link, not the screw.",
    },
  ],
  buildAlong: {
    title: "Measure, clamp, and strip a thread on purpose",
    intro: "Twenty minutes with a handful of M3 hardware and a caliper will turn every number in this lesson into something you've felt in your hands. The last step is deliberately destructive, which is the point: knowing where the limit is makes you confident everywhere below it.",
    parts: [
      { id: "m3-hardware", qty: 1, note: "you need M3 screws in a few lengths, plain nuts, and a couple of standoffs" },
      { id: "digital-caliper", qty: 1 },
      { id: "safety-glasses", qty: 1, note: "for the stripping step, when something may suddenly let go" },
      { id: "hex-key-set", qty: 1 },
      { id: "heat-set-inserts-m3", qty: 1, note: "optional, for the threads-in-plastic step" },
    ],
    steps: [
      "**Read the spec off the hardware.** Measure an M3 screw across the threads: you should get about **2.9 mm**, just under the 3 mm nominal, because the nominal is the theoretical maximum. Then measure the length from under the head and check it against what the bag says.",
      "**Measure the pitch the professional way.** A single 0.5 mm pitch is too small to measure reliably. Instead, measure across **ten** thread crests with the caliper and divide by ten. You should land very close to 0.5 mm. (This trick — measure many, divide — is the same idea as the vernier reading in the **Units, Measurement & Tolerances** lesson.)",
      "**See the clearance hole.** If you have a scrap of 3D print, plywood or thick card, drill or punch a 3.4 mm hole and push the screw through. It should drop through freely. Now appreciate that a 3.0 mm hole wouldn't take the screw at all.",
      "**Feel what preload does.** Bolt two pieces of scrap (wood, thick card, a couple of popsicle sticks) together through clearance holes with a screw and a plain nut. With the nut finger-tight, try to slide the two pieces sideways past each other: they move easily. Now tighten the nut properly and try again. Nothing moves. You just switched on the friction, and you didn't change the bolt's position by more than a fraction of a millimetre.",
      "**Count thread engagement.** Screw a 6 mm M3 screw into a standoff and see how little thread is actually engaged. Then use a 10 mm screw. The rule of thumb says about 3 mm of engagement in steel is enough for the bolt to be the weak link, so a 6 mm screw through a 3 mm plate is right at the edge.",
      "**Now strip one on purpose.** Put on your safety glasses. Find something plastic you don't care about: a scrap print, a bottle cap, a soft plastic lid. Thread an M3 screw into an undersized hole (about 2.5 mm) and tighten slowly, with a short driver, paying attention to the feel. At some point the resistance stops rising and the screw just keeps turning. That's the thread shearing. Note roughly how hard you had to pull — it's much less force than you expected.",
      "**Repeat in metal if you can.** If you have access to a tapped metal part, you'll find you simply cannot strip it by hand with a short key: the bolt would give way first. That difference between metal and plastic is the whole reason heat-set inserts exist.",
      "**Optional: test loosening.** Put two screws with nuts through holes in a scrap plate — one a plain nut, one a nyloc if your kit has them — both barely snug. Tap the plate with the handle of a screwdriver a few dozen times. The loose plain nut backs off; the nyloc holds. Then do it again with both nuts properly tight, and neither moves. That's the real lesson: preload first, locking device second.",
    ],
    safety: [
      "Wear eye protection for the stripping step. A screw or a fragment of plastic can let go suddenly.",
      "Use a short driver, not a long bar, when you're probing for a limit. A long lever makes it very easy to apply far more torque than you intend.",
      "Clamp small parts, don't hold them in your hand while turning a screw into them.",
    ],
  },
  inTheField: `Fastener engineering is one of the most standardised fields there is, because interchangeability is the whole point. ISO 898-1 defines the property classes (8.8, 10.9, 12.9) and the test methods behind them; ISO 273 fixes clearance hole sizes; ISO 4762, ISO 7380 and ISO 10642 define socket cap, button and countersunk head geometry. For joints that really matter, engineers don't stop at a torque table: the German standard VDI 2230 lays out a full bolted-joint calculation that accounts for the stiffness of the bolt and the clamped parts, embedding, and how external load splits between them. In cars, engine head bolts are tightened torque-to-angle past yield and replaced every time the head comes off, because that gives far more consistent preload than torque alone. In aircraft, fasteners are torqued to published values, often safety-wired, and logged. And in competition robotics, pre-match inspection routinely finds loose fasteners — which is why experienced teams mark every critical bolt with a paint pen, so a glance shows whether it has turned.`,
};
