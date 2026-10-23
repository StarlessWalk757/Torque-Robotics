import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { api, type CadProjectInfo, type GradeResult } from "../lib/api";
import { guideFor } from "../content/cadProjects";
import { lessonById } from "../content/curriculum";
import { RichText } from "../components/RichText";
import { href } from "../lib/router";
import { cadBest, progress, useProgress } from "../lib/progress";
import { useStatus } from "../App";

const maxImages = 3;

// lazy() so three.js isn't in the main bundle. it's by far the biggest dependency and most
// people never upload anything, so it only downloads once a part is actually chosen
const StlViewer = lazy(() => import("../components/StlViewer").then((m) => ({ default: m.StlViewer })));

// the circular score gauge. two circles on top of each other: grey track, coloured arc over it
function ScoreRing({ value, max, passed }: { value: number; max: number; passed: boolean }) {
  const pct = max ? value / max : 0; // max could be 0, don't divide by it
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 110 110" width="110" height="110" className="score-ring" role="img" aria-label={`Score ${value} out of ${max}`}>
      <circle cx="55" cy="55" r={radius} fill="none" stroke="var(--line)" strokeWidth="10" />
      {/* dash as long as the score, then a gap the size of the whole circle, so only that much shows.
          rotate -90 because svg circles start at 3 o'clock and this should start at the top */}
      <circle cx="55" cy="55" r={radius} fill="none" stroke={passed ? "var(--green)" : "var(--rust)"} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${pct * circumference} ${circumference}`} transform="rotate(-90 55 55)" className="val" />
      <text x="55" y="52" textAnchor="middle" fontSize="24" fontWeight="800" fill="var(--ink)">{Math.round(pct * 100)}%</text>
      <text x="55" y="72" textAnchor="middle" fontSize="11" fill="var(--muted)">{value} / {max}</text>
    </svg>
  );
}

function Results({ r }: { r: GradeResult }) {
  const axes = ["X", "Y", "Z"];
  return (
    <div className="results" id="results">
      <div className="results-head">
        <ScoreRing value={r.total} max={r.totalMax} passed={r.passed} />
        <div>
          <span className={"verdict " + (r.passed ? "pass" : "fail")}>{r.passed ? "Passed" : "Not yet: keep going"}</span>
          <p className="results-summary">{r.review.summary}</p>
          <p className="fine">
            Measured: {r.measuredScore}/{r.measuredMax}
            {r.designMax > 0 && (r.designScore !== null ? ` · Design review: ${r.designScore}/${r.designMax}` : " · Design review unavailable offline (not counted)")}
            {" · "}Feedback by {r.reviewMode === "claude" ? "the AI mentor" : "built-in rules (offline)"}
          </p>
        </div>
      </div>

      {r.unitsWarning && <div className="callout warning"><strong>Check your export units</strong><p>{r.unitsWarning}</p></div>}

      <h3>Measured checks</h3>
      <div className="table-wrap">
        <table className="checks">
          <thead>
            <tr><th>Requirement</th><th>Expected</th><th>Measured</th><th>Points</th></tr>
          </thead>
          <tbody>
            {r.checks.map((c) => (
              <tr key={c.id} className={c.passed ? "ok" : "no"}>
                <td><span className="mark" aria-hidden>{c.passed ? "✓" : "✗"}</span> {c.label}</td>
                <td>{c.expected}</td>
                <td className="mono">{c.measured}</td>
                <td className="mono">{c.earned}/{c.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {r.review.fixes.length > 0 && (
        <>
          <h3>What to fix</h3>
          <ol className="fixes">
            {r.review.fixes.map((f, i) => (
              <li key={i}>
                <strong>{f.issue}</strong>
                <p className="muted">{f.why}</p>
                <p><span className="how-label">In Onshape:</span> {f.howInOnshape}</p>
              </li>
            ))}
          </ol>
        </>
      )}

      {r.review.strengths.length > 0 && (
        <>
          <h3>What you got right</h3>
          <ul className="strengths">{r.review.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </>
      )}

      {r.designMax > 0 && r.review.designRationale && (
        <div className="callout real-world">
          <strong>Design review{r.designScore !== null ? ` · ${r.designScore}/${r.designMax}` : ""}</strong>
          <RichText text={r.review.designRationale} />
        </div>
      )}

      {r.review.principle && (
        <div className="callout tip">
          <strong>Engineering principle</strong>
          <RichText text={r.review.principle} />
        </div>
      )}

      <details className="measure-details">
        <summary>All measurements</summary>
        <dl className="kv">
          <div><dt>Size (X × Y × Z)</dt><dd>{r.mesh.size.map((v) => v.toFixed(2)).join(" × ")} mm</dd></div>
          <div><dt>Volume</dt><dd>{r.mesh.volume.toFixed(1)} mm³</dd></div>
          <div><dt>Surface area</dt><dd>{r.mesh.surfaceArea.toFixed(1)} mm²</dd></div>
          <div><dt>Closed solid</dt><dd>{r.mesh.watertight ? "yes" : `no (${r.mesh.openEdges} open edges)`}</dd></div>
          <div><dt>Bodies</dt><dd>{r.mesh.shells}</dd></div>
          <div><dt>Through-holes (Euler)</dt><dd>{r.mesh.throughHoles ?? "n/a"}</dd></div>
          <div><dt>Triangles</dt><dd>{r.mesh.triangles.toLocaleString()}</dd></div>
          {r.mesh.slice && <div><dt>Holes run along</dt><dd>{axes[r.mesh.slice.axis]} axis</dd></div>}
        </dl>
        {r.mesh.slice && r.mesh.slice.holes.length > 0 && (
          <div className="table-wrap">
            <table className="checks small">
              <thead><tr><th>Hole</th><th>Diameter</th><th>Center</th><th>Round?</th></tr></thead>
              <tbody>
                {r.mesh.slice.holes.map((h, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="mono">{h.round ? "Ø" : "≈Ø"}{h.diameter.toFixed(2)} mm</td>
                    <td className="mono">({h.cx.toFixed(2)}, {h.cy.toFixed(2)})</td>
                    <td>{h.round ? "yes" : "no"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </div>
  );
}

export function CadProjectPage({ id }: { id: string }) {
  const [info, setInfo] = useState<CadProjectInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [stl, setStl] = useState<File | null>(null);
  const [stlBuf, setStlBuf] = useState<ArrayBuffer | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);
  const guide = guideFor(id);
  const status = useStatus();
  const saved = useProgress();
  const best = cadBest(saved, id);

  // server sends the whole list, so pick ours out of it rather than adding a second endpoint
  useEffect(() => {
    api.projects()
      .then((all) => {
        const found = all.find((proj) => proj.id === id);
        if (found) setInfo(found);
        else setLoadError("That project doesn't exist."); // id out of the url, could be anything
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Couldn't load the project."));
  }, [id]);

  // createObjectURL hands back a url pointing at the file in memory, for the thumbnails
  // useMemo so new urls aren't made on every render, and the effect revokes the old ones --
  // skip that and the browser holds onto every screenshot until the tab closes
  const previews = useMemo(() => images.map((file) => URL.createObjectURL(file)), [images]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  // checks here are only to give a fast, clear message. the server checks the file properly again
  const chooseStl = async (file: File | undefined | null) => {
    if (!file) return; // cancelled the picker
    setError(null);
    setResult(null); // old grade belongs to the old file
    if (!file.name.toLowerCase().endsWith(".stl")) {
      setError("Please choose an .stl file (in Onshape: right-click the part → Export → STL).");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError("That file is over 25 MB. Export again with Resolution: Fine or Medium.");
      return;
    }
    setStl(file);
    setStlBuf(await file.arrayBuffer()); // the 3D viewer needs the bytes, not the File
  };

  const loadSample = async (file: string) => {
    const res = await fetch("/samples/" + file);
    const blob = await res.blob();
    await chooseStl(new File([blob], file, { type: "model/stl" }));
  };

  const addImages = (list: FileList | null) => {
    if (!list) return;
    // FileList isn't a real array, hence Array.from before filtering
    const ok = Array.from(list).filter((file) => /^image\/(png|jpeg|gif|webp)$/.test(file.type) && file.size <= 5 * 1024 * 1024);
    if (ok.length < list.length) setError("Screenshots must be PNG, JPEG, GIF or WebP images under 5 MB.");
    setImages((have) => [...have, ...ok].slice(0, maxImages)); // add to what's there, then cap
  };

  const grade = async () => {
    if (!stl) return;
    setBusy(true);
    setError(null);
    try {
      const graded = await api.grade(id, stl, images, notes);
      setResult(graded);
      progress.cadAttempt(id, { at: new Date().toISOString(), total: graded.total, totalMax: graded.totalMax, passed: graded.passed });
      // small delay so React has painted the results before trying to scroll to them
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Grading failed. Please try again.");
    } finally {
      setBusy(false); // finally, or a failed upload leaves the button stuck
    }
  };

  if (loadError) {
    return <div className="wrap page narrow"><h1>CAD project</h1><p className="form-error">{loadError}</p><a href={href("cad")}>← All projects</a></div>;
  }

  return (
    <div className="wrap page cad-page">
      <nav className="crumbs"><a href={href("cad")}>CAD Studio</a> <span>›</span> <span>Project {info?.order ?? ""}</span></nav>
      <header className="page-head">
        <h1>{info?.title ?? guide?.title ?? "Loading…"}</h1>
        {info && <p className="lead">{info.summary}</p>}
        {best && <span className={"pill" + (best.passed ? " done" : " warn")}>Your best: {best.total}/{best.totalMax}{best.passed ? " ✓ passed" : ""}</span>}
      </header>

      <div className="cad-grid">
        <div className="cad-brief">
          {info && (
            <section className="spec reveal">
              <h2>Specification</h2>
              <table>
                <tbody>
                  {info.spec.map((row) => (
                    <tr key={row.label}><th>{row.label}</th><td>{row.value}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="fine">All sizes in millimeters. Tolerances like ± 0.1 mean anything within 0.1 mm of the value passes.</p>
            </section>
          )}
          {guide && (
            <>
              <section>
                <h2>Build it in Onshape</h2>
                <ol className="steps">{guide.steps.map((s, i) => <li key={i}><RichText text={s} /></li>)}</ol>
              </section>
              <section className="callout real-world">
                <strong>Why this matters</strong>
                <RichText text={guide.realWorld} />
              </section>
              <section>
                <h3>Review first</h3>
                <div className="chips">
                  {guide.lessons.map((lid) => {
                    const l = lessonById(lid);
                    return l ? <a key={lid} className="chip" href={href("lesson", lid)}>{l.title}</a> : null;
                  })}
                </div>
              </section>
            </>
          )}
        </div>

        <div className="cad-submit">
          <section className="card reveal">
            <h2>Submit your part</h2>
            <div
              className={"dropzone" + (drag ? " drag" : "") + (stl ? " has" : "")}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); void chooseStl(e.dataTransfer.files[0]); }}
              onClick={() => fileInput.current?.click()}
              role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.current?.click(); } }}
              aria-label="Choose an STL file"
            >
              <input ref={fileInput} type="file" accept=".stl" hidden onChange={(e) => void chooseStl(e.target.files?.[0])} />
              {stl ? (
                <span><b>{stl.name}</b> · {(stl.size / 1024).toFixed(0)} KB · click to replace</span>
              ) : (
                <span><b>Drop your .stl here</b> or click to choose a file</span>
              )}
            </div>
            {guide && guide.samples.length > 0 && (
              <p className="samples">
                No part yet? Try a sample:{" "}
                {guide.samples.map((s, i) => (
                  <span key={s.file}>
                    {i > 0 && " · "}
                    <button className="linklike" onClick={() => void loadSample(s.file)}>{s.label}</button>
                  </span>
                ))}
              </p>
            )}
            {stlBuf && (
              <Suspense fallback={<div className="stl-viewer" />}>
                <StlViewer data={stlBuf} />
              </Suspense>
            )}

            {!status?.serverless && <h3>Screenshots <span className="muted">(optional, up to {maxImages})</span></h3>}
            <div className="thumbs" hidden={status?.serverless}>
              {previews.map((u, i) => (
                <div key={u} className="thumb">
                  <img src={u} alt={`Screenshot ${i + 1}`} />
                  <button aria-label="Remove screenshot" onClick={() => setImages((cur) => cur.filter((_, j) => j !== i))}>×</button>
                </div>
              ))}
              {images.length < maxImages && (
                <button className="thumb add" onClick={() => imgInput.current?.click()}>+ Add</button>
              )}
              <input ref={imgInput} type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple hidden onChange={(e) => { addImages(e.target.files); e.target.value = ""; }} />
            </div>

            {!status?.serverless && <h3>Explain your design <span className="muted">(optional{info?.designPoints ? ", but it counts on this project" : ""})</span></h3>}
            {!status?.serverless && <textarea value={notes} maxLength={2000} rows={4} onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you do and why? e.g. I used a Symmetric constraint so the holes stay centered…" />}
            {!status?.serverless && <span className="counter">{notes.length}/2000</span>}

            {error && <p className="form-error">{error}</p>}
            {status?.serverless ? (
              <div className="callout warning">
                <strong>Grading needs the Torque server</strong>
                <p>
                  This preview is the web app on its own. You can read the whole brief, follow the Onshape steps and
                  preview an STL in 3D here, but measuring and grading happen in the Java server. Run Torque locally
                  (<code>java -jar server/target/torque.jar</code>) to submit this part.
                </p>
              </div>
            ) : (
              <button className="btn primary big full" disabled={!stl || busy} onClick={grade}>
                {busy ? "Measuring and reviewing…" : "Grade my part"}
              </button>
            )}
            {!status?.serverless && <p className="fine">
              Your file is measured in memory and not stored.
              {status?.ai ? " Screenshots, your explanation and the measurements are sent to the AI mentor (Anthropic's Claude) to write feedback." : ""}
            </p>}
          </section>
        </div>
      </div>

      {result && <Results r={result} />}
    </div>
  );
}
