import { useState } from "react";
import type { Section } from "../content/types";
import { RichText } from "./RichText";
import { CodeBlock } from "./CodeBlock";

// hidden until they ask for it, so the answer isn't sitting there while you're still thinking
function Example({ problem, solution }: { problem: string; solution: string }) {
  const [showing, setShowing] = useState(false);
  return (
    <div className="example">
      <div className="example-q">
        <span className="example-tag">Worked example</span>
        <RichText text={problem} />
      </div>
      {showing ? (
        <div className="example-a">
          <RichText text={solution} />
        </div>
      ) : (
        <button className="btn small" onClick={() => setShowing(true)}>Try it first, then show the solution</button>
      )}
    </div>
  );
}

// one section of a lesson. everything past the body is optional, hence all the && checks
export function SectionView({ section, id }: { section: Section; id?: string }) {
  return (
    <section className="lsec reveal" id={id}>
      <h3>{section.heading}</h3>
      <RichText text={section.body} />

      {section.formula && (
        <div className="formula">
          {/* two formulas split by a run of spaces become two lines instead of one long wrap */}
          <div className="formula-expr">
            {section.formula.expr.split(/\s{2,}/).map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
          {section.formula.where && (
            <dl>
              {section.formula.where.map(([sym, meaning]) => (
                <div key={sym}>
                  <dt>{sym}</dt>
                  <dd>{meaning}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* spread, because the object's fields are already named the same as the props */}
      {section.code && <CodeBlock {...section.code} />}
      {section.example && <Example {...section.example} />}

      {section.callout && (
        <div className={"callout " + section.callout.kind}>
          <strong>{section.callout.kind === "tip" ? "Tip" : section.callout.kind === "warning" ? "Watch out" : "In the real world"}</strong>
          <RichText text={section.callout.text} />
        </div>
      )}
    </section>
  );
}
