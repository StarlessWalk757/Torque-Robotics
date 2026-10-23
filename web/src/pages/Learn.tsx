import { units, lessonsIn, orderedLessons, unitById } from "../content/curriculum";
import type { UnitId } from "../content/types";
import { href } from "../lib/router";
import { isComplete, useProgress } from "../lib/progress";
import { IconArrow, IconBuild, IconCheck, IconPlay, UnitPhoto } from "../components/icons";

// course map. one unit at a time via the tabs, otherwise it's a wall of 17 rows
// unit comes off the url (#/learn/mechanical), so a unit is linkable on its own
export function Learn({ unit }: { unit?: string }) {
  const saved = useProgress();
  const all = orderedLessons();
  const doneCount = all.filter((l) => isComplete(saved, l.id)).length;
  // first unfinished lesson = where the resume card points. ?? all[0] covers finishing everything
  const nextUp = all.find((l) => !isComplete(saved, l.id)) ?? all[0];
  const started = Object.keys(saved.lessons).length > 0;

  // url could say anything, so check it's real before trusting it. no unit in the url = open the one they're up to
  const realUnit = units.some((u) => u.id === unit);
  const openUnit = unitById((realUnit ? unit : nextUp.unit) as UnitId);
  const lessons = lessonsIn(openUnit.id);
  const unitDone = lessons.filter((l) => isComplete(saved, l.id)).length;
  const at = units.findIndex((u) => u.id === openUnit.id);
  const prevUnit = units[at - 1]; // undefined at either end, which the jsx checks for
  const nextUnit = units[at + 1];

  // --unit set here so every colour below (bar, tabs, chevrons) follows the unit without passing props down
  return (
    <div className="wrap page" style={{ ["--unit" as string]: openUnit.color }}>
      <header className="page-head">
        <p className="eyebrow">The course</p>
        <h1>{all.length} lessons, in order</h1>
        <div className="course-progress">
          <div className="bar"><i style={{ width: `${(doneCount / all.length) * 100}%` }} /></div>
          <span>{doneCount} of {all.length} complete</span>
        </div>
      </header>

      <a className="resume-card" href={href("lesson", nextUp.id)}>
        <span className="resume-icon"><IconPlay size={28} /></span>
        <span className="resume-text">
          <span>{started ? "Pick up where you left off" : "Start here"}</span>
          <strong>{nextUp.title}</strong>
        </span>
        <span className="resume-meta">{nextUp.minutes} min</span>
        <span className="arrow"><IconArrow size={22} /></span>
      </a>

      <nav className="unit-tabs" aria-label="Units">
        {units.map((u, i) => {
          const unitLessons = lessonsIn(u.id);
          const finished = unitLessons.filter((l) => isComplete(saved, l.id)).length;
          const on = u.id === openUnit.id;
          return (
            <a
              key={u.id}
              href={href("learn", u.id)}
              className={"unit-tab" + (on ? " on" : "")}
              style={{ ["--unit" as string]: u.color }}
              aria-current={on ? "page" : undefined}
            >
              <UnitPhoto unit={u.id} size={30} />
              <span className="unit-tab-name">{i + 1}. {u.title}</span>
              {/* tick once the whole unit is done, count until then */}
              <span className="unit-tab-count">{finished === unitLessons.length ? <IconCheck size={13} /> : `${finished}/${unitLessons.length}`}</span>
            </a>
          );
        })}
      </nav>

      {/* key on the unit so switching tabs remounts this and replays the fade */}
      <section className="unit-panel" key={openUnit.id}>
        <div className="unit-panel-head">
          <span className="unit-badge"><UnitPhoto unit={openUnit.id} size={68} /></span>
          <div>
            <h2>{openUnit.title}</h2>
            <p>{openUnit.blurb}</p>
          </div>
          <span className="unit-count">
            <span className="bar"><i style={{ width: `${(unitDone / lessons.length) * 100}%` }} /></span>
            {unitDone}/{lessons.length}
          </span>
        </div>

        <ol className="lesson-list">
          {lessons.map((l, i) => {
            const complete = isComplete(saved, l.id);
            return (
              <li key={l.id}>
                <a href={href("lesson", l.id)} className={"lesson-row" + (complete ? " done" : "")}>
                  <span className="lesson-check" aria-label={complete ? "Completed" : "Not completed"}>
                    {complete ? <IconCheck size={15} /> : i + 1}
                  </span>
                  <span className="lesson-info">
                    <strong>{l.title}</strong>
                    <span>{l.summary}</span>
                  </span>
                  <span className="lesson-marks">
                    {l.buildAlong && <i title="Has a hands-on build"><IconBuild size={15} /></i>}
                    {l.cadProjects?.length ? <i title="Leads to a CAD project"><UnitPhoto unit="cad" size={21} /></i> : null}
                    <b>{l.minutes} min</b>
                  </span>
                  <span className="row-go" aria-hidden>›</span>
                </a>
              </li>
            );
          })}
        </ol>

        {openUnit.id === "cad" && (
          <a className="action-card" href={href("cad")} style={{ marginTop: 18, maxWidth: 420 }}>
            <strong>Open CAD Studio</strong>
            <span>Submit a part you've designed and have it measured and graded</span>
          </a>
        )}

        <div className="unit-nav">
          {prevUnit ? (
            <a className="btn" href={href("learn", prevUnit.id)}>← {prevUnit.title}</a>
          ) : <span />}
          {nextUnit && <a className="btn" href={href("learn", nextUnit.id)}>{nextUnit.title} →</a>}
        </div>
      </section>
    </div>
  );
}
