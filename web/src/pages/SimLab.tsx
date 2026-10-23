import { useState } from "react";
import { api, type SimBuilt } from "../lib/api";
import { useStatus } from "../App";
import { IconArrow, IconSpark } from "../components/icons";

const examples = [
  "A gear train where I can change both tooth counts and see the output speed",
  "An LED with a resistor, where I pick the supply voltage and the resistor value",
  "A lever I can slide the pivot along to see the force change",
  "A differential drive robot where I set each wheel's speed",
  "A motor's torque–speed curve as I load it up",
];

// type what you want, the server builds it
// IMPORTANT: every decision about what's allowed happens on the server, not here. anything checked in
// this file would be trivial to skip by just calling the api directly
export function SimLab() {
  const status = useStatus();
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);     // disables the button and swaps in the working message
  const [built, setBuilt] = useState<SimBuilt | null>(null);
  const [error, setError] = useState("");

  const run = async (text: string) => {
    const asked = text.trim();
    if (!asked || busy) return; // guard against double clicks while one is already going
    setBusy(true);
    setError("");
    setBuilt(null); // clear the old sim first, otherwise it sits there during the wait
    try {
      setBuilt(await api.buildSim(asked));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false); // finally, so a failure doesn't leave the button stuck on "Building…"
    }
  };

  return (
    <div className="wrap page narrow">
      <header className="page-head">
        <p className="eyebrow">Simulation lab</p>
        <h1>Ask for a simulation</h1>
        <p className="lead">
          Describe what you want to play with and it gets built here. It only knows this course, so ask about
          something you've met in a lesson — or a deeper corner of it.
        </p>
      </header>

      <form
        className="sim-ask"
        // form not just a button, so enter submits too. preventDefault stops the page reloading
        onSubmit={(e) => {
          e.preventDefault();
          run(prompt);
        }}
      >
        <textarea
          value={prompt}
          maxLength={300}
          rows={3}
          placeholder="e.g. a gear train where I can change the tooth counts and watch the torque"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="sim-ask-foot">
          <span className="counter">{prompt.length} / 300</span>
          <button className="btn primary" disabled={busy || prompt.trim().length < 4}>
            {busy ? "Building…" : "Build it"}
            <span className="arrow"><IconArrow size={16} /></span>
          </button>
        </div>
      </form>

      {!built && !busy && (
        <section className="sim-examples">
          <h2>Try one of these</h2>
          <div className="chips">
            {/* type="button" or it submits the form above */}
            {examples.map((example) => (
              <button key={example} className="chip" type="button" onClick={() => { setPrompt(example); run(example); }}>
                {example}
              </button>
            ))}
          </div>
        </section>
      )}

      {busy && (
        <div className="sim-busy">
          <IconSpark size={18} /> Working out the physics and drawing it…
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {built && !built.allowed && (
        <div className="callout warning">
          <strong>Not something I can build</strong>
          <p>{built.note}</p>
        </div>
      )}

      {built?.allowed && (
        <section className="sim-result">
          <h2>{built.title}</h2>
          {/* sandbox with allow-scripts ONLY. leaving out allow-same-origin is the whole point --
              it puts the frame on its own origin so the sim can't read the page, storage or cookies.
              adding allow-same-origin back would undo all of it. */}
          <iframe
            className="sim-frame"
            title={built.title}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            srcDoc={built.html}
          />
          <p className="fine">
            Built on request, so check it against the lesson before you trust a number. It runs in a sealed frame
            with no internet access.
          </p>
          <button className="btn small" onClick={() => { setBuilt(null); setPrompt(""); }}>Ask for another</button>
        </section>
      )}

      {status?.serverless && (
        <div className="callout warning">
          <strong>Not available on this copy</strong>
          <p>The lab needs the Torque server behind it. Everything else on this preview works.</p>
        </div>
      )}
    </div>
  );
}
