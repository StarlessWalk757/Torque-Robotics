import type { Lesson } from "../types";

export const forcesFbd: Lesson = {
  id: "forces-fbd",
  unit: "foundations",
  title: "Forces & Loads",
  minutes: 14,
  summary: "What a force is, how to work out weight, and the sketch engineers draw before sizing any part: the free-body diagram.",
  objectives: [
    "Describe a force by its size in newtons and its direction",
    "Work out the weight of a part with W = m × g",
    "Draw a free-body diagram and check whether the forces balance",
  ],
  slides: [
    {
      image: { src: "/img/diagrams/weight.svg", alt: "A 2 kg mass and the 19.6 newton weight force it produces, showing W equals m times g" },
      title: "Weight is a force",
      bullets: [],
    },
    {
      image: { src: "/img/diagrams/fbd.svg", alt: "A bracket bolted to a wall holding a load, redrawn as a free-body diagram with arrows for weight, load and the two bolt reactions" },
      title: "Drawing a free-body diagram",
      bullets: [],
    },
    {
      image: { src: "/img/diagrams/equilibrium.svg", alt: "A block on a table with weight down and normal force up, equal and opposite, so the forces balance" },
      title: "Static equilibrium",
      bullets: [],
    },
  ],
  sections: [
    {
      heading: "A force is a size and a direction",
      body: `A **force** is a push or a pull. To describe one completely you need two things:
- its **size** (how hard), measured in **newtons (N)**
- its **direction** (which way it acts)

That's why engineers draw forces as arrows: a longer arrow means a bigger force, and the arrowhead shows the direction. One newton is about the weight of a small apple.

The force you'll meet most is **weight**: gravity pulling on mass. It always points straight down, and you get it by multiplying the mass by g, which is about 9.81 m/s² on Earth.

**Mass** and **weight** are not the same thing. Mass (in kilograms) is how much stuff is there, and it doesn't change. Weight (in newtons) is a force, and it depends on gravity, which is why the same object weighs about a sixth as much on the Moon.`,
      formula: {
        expr: "W = m × g",
        where: [
          ["W", "weight (N), pointing straight down"],
          ["m", "mass (kg)"],
          ["g", "9.81 m/s² on Earth"],
        ],
      },
      example: {
        problem: "A robot arm has to hold up a 2 kg motor. What force does it have to supply?",
        solution: "W = m × g = 2 kg × 9.81 m/s² = **19.6 N**, pointing down. So the arm has to push up with 19.6 N just to hold the motor still, and a bit more to lift it.",
      },
    },
    {
      heading: "Where the forces on a part come from",
      body: `When you look at a part, the forces on it come from two places: gravity, and whatever it touches.

- **Weight** pulls down on everything, always. W = m × g.
- A **surface pushes**. A bench, a bearing face or a bolted plate can only push the part away from itself, never pull it back. Engineers call this push the **normal force**, where "normal" means perpendicular: it points straight out of the surface.
- A **rope, belt or cable pulls**. This pull is called **tension**, and it acts along the rope. A rope can never push.
- **Friction** resists sliding. It acts along the surfaces that are touching, in the direction that opposes the slide. Friction gets a lesson of its own later.
- **Applied forces** are everything else you add on purpose: a motor pushing, a spring pressing, a hand pulling.

Those two rules — surfaces only push, ropes only pull — catch a surprising number of mistakes on their own.`,
      callout: {
        kind: "tip",
        text: "If you've drawn a force and you can't say what is causing it, it probably isn't real. Every arrow should be traceable to gravity or to something touching the part.",
      },
    },
    {
      heading: "The free-body diagram",
      body: `A **free-body diagram** is a sketch of **one** part, drawn on its own as if you had cut it out of the machine, with **every** force acting on it. Engineers draw one before almost any calculation, because it makes forgotten forces and invented forces easy to spot.

How to draw one:
- **Pick one part** and draw it as a simple box or dot.
- Draw **weight** first, straight down.
- Look at everywhere the part **touches** something, and draw the push or pull from each of those things.
- Draw only forces **on** this part. The forces it pushes back with belong on someone else's diagram.
- Label each arrow with its size if you know it, and draw bigger forces as longer arrows.

Then ask the one question the whole sketch is for: **do the arrows cancel out?** If the up arrows add up to the down arrows, and the same sideways, the part stays where it is. Engineers call that **equilibrium**. If they don't cancel, the leftover force has to go somewhere: the part accelerates, bends, or breaks.`,
      formula: {
        expr: "Balanced:  forces up = forces down     forces left = forces right",
      },
      example: {
        problem: "A 10 kg battery box hangs from a single cable. The cable is rated to hold 150 N. Is that enough?",
        solution: `Free-body diagram of the box: weight down, cable tension up. Nothing else touches it.

Weight = 10 × 9.81 = **98.1 N** down.

For it to hang still, the cable has to pull up with the same 98.1 N. That's less than the 150 N rating, so **yes**, with about 1.5 times the strength needed to spare.

If you hung a second 10 kg box underneath, the cable would need 196 N and would be over its rating.`,
      },
    },
  ],
  quiz: [
    {
      q: "What is the weight of a 5.0 kg robot on Earth?",
      choices: ["5.0 N", "49 N", "0.51 N", "9.8 N"],
      answer: 1,
      explain: "W = m × g = 5.0 × 9.81 ≈ 49 N. Mass is in kilograms; weight is a force, in newtons.",
    },
    {
      q: "A motor sits on a flat shelf, not moving. What does the shelf do?",
      choices: [
        "Nothing: the motor is just resting on it",
        "It pulls the motor down with the same force as gravity",
        "It pushes the motor up with the same force as the motor's weight",
        "It pushes the motor sideways",
      ],
      answer: 2,
      explain: "The motor is not accelerating, so the arrows have to cancel. Weight pulls down, so the shelf must push up by exactly the same amount. Surfaces push; they never pull.",
    },
    {
      q: "Which of these forces can a rope supply?",
      choices: ["A pull along the rope", "A push along the rope", "A sideways push", "Any of these"],
      answer: 0,
      explain: "A rope, cable or belt can only pull, along its own length. If your diagram shows a rope pushing, something is wrong.",
    },
    {
      q: "On a free-body diagram of a part, which forces belong on the sketch?",
      choices: [
        "Every force the part exerts on other things",
        "Only the forces that are unbalanced",
        "Only gravity, since the others cancel",
        "Every force acting on that part, from gravity and from whatever touches it",
      ],
      answer: 3,
      explain: "A free-body diagram shows one part with every force acting on it. Forces the part exerts on other things go on those other parts' diagrams.",
    },
    {
      q: "A 10 kg crate hangs motionless from a rope. What is the tension in the rope?",
      choices: ["10 N", "0 N, because nothing is moving", "98.1 N", "196 N"],
      answer: 2,
      explain: "The arrows have to cancel: tension up equals weight down, so T = 10 × 9.81 = 98.1 N. \"Not moving\" means the forces balance, not that there are none.",
    },
  ],
  inTheField: `Free-body diagrams are the first step in nearly every mechanical and civil engineering calculation. Structural engineers balance forces to find the load in every beam of a bridge before choosing the steel. Robotics engineers draw one for each arm link to work out how much force the joint motors have to supply while holding a load. Computer tools such as finite element analysis solve the same balance for millions of tiny pieces at once, but engineers still sanity-check the answer against a sketch on paper.`,
};
