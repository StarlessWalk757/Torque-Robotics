import { units, lessonsIn, orderedLessons } from "../content/curriculum";
import { href } from "../lib/router";
import { cadBest, isComplete, useProgress } from "../lib/progress";
import { cadGuides } from "../content/cadProjects";
import { IconArrow, UnitPhoto } from "../components/icons";

// drawn rather than an image file, so it stays sharp at any size and weighs nothing
// the gear maths is the real thing from the gears lesson: module sets tooth size, so a 10 tooth
// and a 20 tooth gear at the same module actually mesh, which is why the picture looks right
function HeroArt() {
  const gear = (cx: number, cy: number, teeth: number, color: string) => {
    const module = 8;
    const rp = (module * teeth) / 2;   // pitch radius, where the two gears touch
    const ra = rp + module;            // tip, outside edge of a tooth
    const rd = rp - 1.25 * module;     // root, bottom of the gap
    const step = (2 * Math.PI) / teeth; // angle per tooth
    let d = "";
    // five points per tooth: down, across the root, up the flank, over the tip, back down
    for (let i = 0; i < teeth; i++) {
      const a = i * step;
      for (const [r, th] of [[rd, a - step * 0.5], [rd, a - step * 0.28], [ra, a - step * 0.14],
                             [ra, a + step * 0.14], [rd, a + step * 0.28]] as [number, number][]) {
        // M on the first point (move to), L on everything after it (line to)
        d += (d === "" ? "M" : "L") + (cx + r * Math.cos(th)).toFixed(1) + "," + (cy + r * Math.sin(th)).toFixed(1);
      }
    }
    return <path d={d + "Z"} fill="#1E3A5A" stroke={color} strokeWidth={2} strokeLinejoin="round" />; // Z closes the loop
  };
  return (
    <svg viewBox="0 0 440 340" aria-hidden>
      <rect width="440" height="340" rx="22" fill="#0d2634" />
      {Array.from({ length: 18 }, (_, i) => (
        <line key={"v" + i} x1={i * 25} y1={0} x2={i * 25} y2={340} stroke="rgba(160,200,255,0.07)" />
      ))}
      {Array.from({ length: 14 }, (_, i) => (
        <line key={"h" + i} x1={0} y1={i * 25} x2={440} y2={i * 25} stroke="rgba(160,200,255,0.07)" />
      ))}
      {gear(150, 215, 10, "#4CC9F0")}
      {gear(270, 215, 20, "#A9B8C9")}
      <text x="26" y="44" fill="#E8EEF6" fontSize="15" fontFamily="Space Grotesk, Inter, sans-serif" fontWeight="600">
        Gear train · 2 : 1 reduction
      </text>
      <text x="26" y="66" fill="#8FA3BA" fontSize="12.5" fontFamily="JetBrains Mono, monospace">
        torque ×2 · speed ÷2
      </text>
    </svg>
  );
}

export function Home() {
  const saved = useProgress();
  const all = orderedLessons();
  const done = all.filter((l) => isComplete(saved, l.id)).length;
  const next = all.find((l) => !isComplete(saved, l.id)) ?? all[0]; // first unfinished, or lesson 1
  // "started" is wider than done > 0 on purpose: opening a quiz and failing still counts as started
  const started = done > 0 || Object.keys(saved.lessons).length > 0;
  const cadPassed = cadGuides.filter((g) => cadBest(saved, g.id)?.passed).length;
  const buildCount = all.filter((l) => l.buildAlong).length; // counted, not typed in, so the stat can't go stale

  return (
    <div className="home">
      <section className="hero wrap">
        <div className="hero-text">
          <p className="eyebrow reveal shown">Robotics · Mechanics · Electronics · CAD</p>
          <h1 className="reveal shown">
            Learn robotics the way teams actually do it: <em>by building</em>.
          </h1>
          <p className="lead reveal shown d1">
            Everything that goes into a working robot — the mechanics, the wiring, the code and the CAD.
            Build it with real parts, and have your CAD graded by exact measurement.
          </p>
          <div className="hero-cta reveal shown d2">
            <a className="btn primary big" href={href("lesson", next.id)}>
              {started ? `Continue: ${next.title}` : "Start the first lesson"}
              <span className="arrow"><IconArrow size={18} /></span>
            </a>
            <a className="btn big" href={href("learn")}>See all {all.length} lessons</a>
          </div>
          {started && (
            <p className="hero-progress reveal shown d3">
              {saved.name ? `${saved.name}, you've` : "You've"} finished <b>{done}</b> of {all.length} lessons and passed <b>{cadPassed}</b> of {cadGuides.length} CAD projects.
            </p>
          )}
        </div>
        <div className="hero-art reveal shown d2">
          <HeroArt />
        </div>
      </section>

      <section className="wrap">
        <div className="stat-strip reveal">
          <div><b>{all.length}</b><span>lessons</span></div>
          <div><b>{cadGuides.length}</b><span>graded CAD projects</span></div>
          <div><b>{buildCount}</b><span>hands-on builds</span></div>
        </div>
      </section>

      <section className="wrap">
        <div className="section-head reveal">
          <div>
            <h2>Five units, in order</h2>
            <p>Each one builds on the last, from first principles to a working robot.</p>
          </div>
          <a href={href("learn")} className="go">All lessons →</a>
        </div>
        <div className="unit-grid">
          {units.map((u, i) => {
            const ls = lessonsIn(u.id);
            const d = ls.filter((l) => isComplete(saved, l.id)).length;
            return (
              <a
                key={u.id}
                className={"unit-card reveal d" + Math.min(4, i % 3)}
                href={href("learn", u.id)}
                style={{ ["--unit" as string]: u.color }}
              >
                <span className="unit-icon"><UnitPhoto unit={u.id} size={112} /></span>
                <span className="unit-num">Unit {i + 1}</span>
                <h3>{u.title}</h3>
                <p>{u.blurb}</p>
                <div className="bar"><i style={{ width: `${ls.length ? (d / ls.length) * 100 : 0}%` }} /></div>
                <span className="unit-meta">{d} / {ls.length} lessons</span>
                <span className="row-go" aria-hidden>›</span>
              </a>
            );
          })}
          <a className="unit-card cad-card reveal d2" href={href("cad")}>
            <span className="unit-icon"><UnitPhoto unit="cad" size={28} /></span>
            <span className="unit-num">Projects</span>
            <h3>CAD Studio</h3>
            <p>Five graded Onshape projects, from your first block to a motor mount and your own robot chassis.</p>
            <div className="bar"><i style={{ width: `${(cadPassed / cadGuides.length) * 100}%` }} /></div>
            <span className="unit-meta">{cadPassed} / {cadGuides.length} passed</span>
            <span className="row-go" aria-hidden>›</span>
          </a>
        </div>
      </section>

      <section className="wrap ready-wrap">
        <div className="section-head reveal">
          <div>
            <h2>What this gets you ready for</h2>
            <p>The skills a robotics team actually needs, from the drivetrain to the wiring to the parts you design yourself.</p>
          </div>
        </div>
        <ul className="ready">
          <li className="reveal"><b>Robotics competitions</b><span>Drivetrains, gear ratios, wiring, sensors and control loops.</span></li>
          <li className="reveal d1"><b>Designing real parts</b><span>Onshape CAD, fits and clearances, fasteners, parts that can actually be made.</span></li>
          <li className="reveal d2"><b>Your own projects</b><span>Sizing a resistor, picking a motor, powering it safely, debugging it.</span></li>
          <li className="reveal d3"><b>Understanding your robot</b><span>Why it drifts, why a motor stalls, why a bolt works loose — and how to fix each one.</span></li>
        </ul>
      </section>
    </div>
  );
}
