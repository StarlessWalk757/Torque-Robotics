import { useState } from "react";
import { useStatus } from "../App";
import { progress, useProgress } from "../lib/progress";

export function About() {
  const status = useStatus();
  const saved = useProgress();
  // local copy so typing doesn't write to storage on every keystroke -- only on save
  const [name, setName] = useState(saved.name);
  return (
    <div className="wrap page narrow about">
      <header className="page-head">
        <h1>About Torque</h1>
        <p className="lead">
          Torque teaches middle and high school students how to build a robot and understand why it works.
          It covers the mechanics that move it, the electronics that power it, the sensors and code that control it,
          and the CAD used to design its parts — through written lessons, hands-on builds, a simulation lab,
          and CAD projects graded by exact measurement.
        </p>
      </header>

      <section>
        <h2>Who it's for</h2>
        <p>Students (about ages 12–18) on a robotics team, hoping to join one, or without a team at their school at all. Also teachers looking for a free, self-paced robotics course. No experience is needed.</p>
      </section>

      <section>
        <h2>How grading works</h2>
        <p>
          <b>Quizzes</b> are checked instantly in your browser. <b>CAD projects</b> are graded in two layers. First, the Java server
          reads your STL file and measures it exactly: the bounding box, volume, whether it's a closed solid, the number of through-holes
          (from Euler's formula, V − E + F = 2 − 2g), and each hole's diameter and position from a cross-section. Every measurable point
          comes from those numbers. Second, an AI mentor reads the measurements, your screenshots and your explanation, and writes feedback on
          what to fix in Onshape. The AI can't change a measured result. On the open-design chassis project, it scores a published design rubric worth 30 points.
        </p>
        <p className="muted">
          {!status
            ? "Checking what's available…"
            : status.serverless
              ? "This copy is the web app on its own, with no Torque server behind it: lessons, simulators and quizzes all work, but CAD uploads can't be measured here."
              : status.ai
                ? `AI mentor status: connected (${status.model}).`
                : "AI mentor status: offline. Measured grading still works; feedback uses built-in rules."}
        </p>
      </section>

      <section>
        <h2>Privacy</h2>
        <ul>
          <li>There are no accounts. Your progress and optional nickname are saved only in this browser's local storage.</li>
          <li>Uploaded STL files are measured in memory and never saved on the server.</li>
          <li>When the AI mentor is connected, your mentor questions, screenshots, design explanation and the part's measurements are sent to Anthropic's Claude API to generate a reply. Don't include personal information in them.</li>
          <li>Torque has no ads or trackers, and it doesn't earn money from store links.</li>
        </ul>
        <div className="name-box">
          <label>
            <span>What should Torque call you? Optional, and saved only on this device.</span>
            <div className="row">
              <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="First name or nickname" />
              <button className="btn" onClick={() => progress.setName(name.trim())}>Save</button>
            </div>
          </label>
        </div>
        <button className="btn small" onClick={() => { if (confirm("Erase all your Torque progress on this device?")) progress.reset(); }}>
          Erase my progress on this device
        </button>
      </section>

      <section>
        <h2>Accessibility</h2>
        <ul>
          <li>Every animation has captions and can be narrated aloud using your device's text-to-speech, with symbols read as words ("Ω" as "ohms") and a breath between sentences.</li>
          <li>Lessons pace themselves: the animation slows down so each caption stays on screen long enough to be read without rushing.</li>
          <li>Light and dark themes, following your system by default, with a switch in the top bar.</li>
          <li>Keyboard controls in the player: <kbd>Space</kbd> play/pause, <kbd>←</kbd>/<kbd>→</kbd> skip 5 s, <kbd>C</kbd> captions, <kbd>N</kbd> narration, <kbd>F</kbd> full screen.</li>
          <li>Playback speed from 0.75× to 1.5×, and if your system asks for reduced motion, animations and page transitions stop moving.</li>
        </ul>
      </section>

      <section>
        <h2>Built with</h2>
        <ul>
          <li><b>Java 21 + Spring Boot 3.5</b>: the server, the STL parser and mesh analyzer, and the grader.</li>
          <li><b>React 18 + TypeScript + Vite</b>: the web app, the animation player, and the simulations (hand-drawn SVG).</li>
          <li><b>three.js</b>: the 3D viewer for uploaded parts.</li>
          <li><b>Anthropic Java SDK with Claude</b>: the AI mentor and simulation lab (structured JSON output).</li>
          <li>Fonts: Inter and JetBrains Mono (SIL Open Font License).</li>
        </ul>
        <p className="muted">Onshape, Arduino, LEGO and other product names belong to their owners. Torque isn't affiliated with or endorsed by them.</p>
      </section>

      <section>
        <h2>Safety</h2>
        <p>Build-alongs use low-voltage power only (USB or AA batteries). Wear safety glasses when cutting, drilling, soldering or running motors under load. Never work on wall-outlet (mains) electricity, and never puncture, short or improperly charge lithium batteries.</p>
      </section>
    </div>
  );
}
