import { useEffect, useState } from "react";
import { api, type CadProjectInfo } from "../lib/api";
import { href } from "../lib/router";
import { cadBest, useProgress } from "../lib/progress";
import { useStatus } from "../App";

// list of the graded CAD projects. the briefs come from the server (or the bundled copy) rather than
// being written out here, so the specs can only ever be in one place
export function CadStudio() {
  // null means still loading, [] would mean loaded and empty. two different things, hence null not []
  const [projects, setProjects] = useState<CadProjectInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const saved = useProgress();
  const status = useStatus();

  useEffect(() => {
    api.projects().then(setProjects).catch((err) => setError(err instanceof Error ? err.message : "Couldn't load projects."));
  }, []); // [] = fetch once on mount, not on every render

  return (
    <div className="wrap page">
      <header className="page-head">
        <p className="eyebrow">Graded projects</p>
        <h1>CAD Studio</h1>
        <p className="lead">
          Design each part in <a href="https://www.onshape.com/en/education/" target="_blank" rel="noopener noreferrer">Onshape</a> (free and runs in a browser, even on a Chromebook),
          export it as an STL, and upload it here. You'll get your grade in seconds.
        </p>
      </header>

      {status?.serverless && (
        <div className="callout warning reveal">
          <strong>Preview without the grader</strong>
          <p>
            This copy of Torque is the web app on its own, so uploads can't be measured here: grading runs in the
            Java server. Every brief, spec and set of Onshape steps below is complete, and you can still open a
            project and spin a sample part in 3D. To be graded, run Torque with its server (see the README) or use
            the hosted version.
          </p>
        </div>
      )}

      <section className="grading-explainer">
        <div className="reveal">
          <span className="ge-n">1</span>
          <h3>Measured exactly</h3>
          <p>The server reads every triangle of your STL and measures its size, volume, and whether it's a closed solid. It counts through-holes with Euler's formula and measures each hole's diameter and position from a cross-section, to ±0.01 mm. These checks decide your measured points, and no AI is involved.</p>
        </div>
        <div className="reveal d1">
          <span className="ge-n">2</span>
          <h3>Reviewed by the AI mentor</h3>
          <p>
            An AI mentor reads those exact measurements plus your screenshots and explanation. It explains what to fix and how in Onshape, and it can't overrule a measurement.
            {status && !status.ai && !status.serverless && " (Offline right now: feedback comes from the built-in rules instead.)"}
          </p>
        </div>
        <div className="reveal d2">
          <span className="ge-n">3</span>
          <h3>Pass at {status?.passPercent ?? 70}%</h3>
          <p>Fix, re-export and upload as many times as you like. Your best score is saved on this device. The open-design chassis also earns up to 30 points for design quality.</p>
        </div>
      </section>

      {/* three states: failed, still loading, loaded */}
      {error && <p className="form-error">{error} Is the Torque server running?</p>}
      {!projects && !error && <p className="muted">Loading projects…</p>}
      {projects && (
        <div className="project-grid">
          {projects.map((proj) => {
            const best = cadBest(saved, proj.id); // undefined until they've uploaded once
            return (
              <a key={proj.id} className="project-card reveal" href={href("cad", proj.id)}>
                <div className="project-top">
                  <span className="project-num">{proj.order}</span>
                  <span className={"level " + proj.level.toLowerCase()}>{proj.level}</span>
                </div>
                <h3>{proj.title}</h3>
                <p>{proj.summary}</p>
                <div className="project-foot">
                  {best ? (
                    <span className={"pill" + (best.passed ? " done" : " warn")}>
                      Best: {best.total}/{best.totalMax} {best.passed ? "✓ passed" : ""}
                    </span>
                  ) : (
                    <span className="pill">Not attempted</span>
                  )}
                  <span className="go">Open →</span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
