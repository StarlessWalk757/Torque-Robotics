# Torque

**Learn robotics the way teams actually do it: by building.**

Torque is a web app that teaches middle and high school students everything that goes into a working robot:
the mechanics that move it, the electronics that power it, the sensors and code that control it, and the CAD
used to design its parts.

Seventeen lessons across five units — Foundations, Mechanical, Electrical, Robotics, and CAD with Onshape.
Each lesson has:

- a **slide deck** of real photographs and technical diagrams
- **key ideas** with formulas, worked examples and real-world callouts
- a **5-question quiz** with an explanation for every answer, right or wrong
- a **build-along** for most lessons, listing the parts to buy so students can follow along with real hardware

**CAD Studio** has five graded Onshape projects. Students export an STL and upload it, and the server measures
it exactly: overall size, volume, closed-solid check, through-hole count by Euler's formula, and every hole's
diameter and position from a cross-section. Those measurements alone decide the score — the AI reads the
finished numbers and writes the feedback, and cannot change a single mark. It scores only the published
30-point design rubric on the open-design chassis project.

**Simulations** lets a student describe a simulation in their own words and have it built. It only covers
topics the course teaches, enforced by an allow-list, a scope check, a constrained generator, and a
deterministic check on the result. The page runs in a sandboxed frame that cannot reach the network.

Progress is saved in the browser only. There are no accounts, and nothing personal leaves the device.
