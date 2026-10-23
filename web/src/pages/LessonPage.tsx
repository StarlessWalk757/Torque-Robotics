import { lessonById, nextLesson, unitById, lessonsIn } from "../content/curriculum";
import { LessonVideo } from "../components/LessonVideo";
import { LessonSlides } from "../components/LessonSlides";
import { RichText } from "../components/RichText";
import { SectionView } from "../components/SectionView";
import { href } from "../lib/router";
import { isComplete, useProgress } from "../lib/progress";
import { cadGuides } from "../content/cadProjects";
import { IconArrow, IconBuild, IconCheck, IconQuiz, UnitPhoto } from "../components/icons";

// the lesson itself. video, objectives, the sections, then where to go next
// quiz and build are separate pages, this one is only reading
export function LessonPage({ id }: { id: string }) {
  const lesson = lessonById(id);
  const saved = useProgress();

  // id comes out of the url so it could be anything. bail before touching lesson.anything
  if (!lesson) {
    return (
      <div className="wrap page narrow">
        <h1>Lesson not found</h1>
        <p><a className="btn primary" href={href("learn")}>Back to the course</a></p>
      </div>
    );
  }
  const unit = unitById(lesson.unit);
  const sameUnit = lessonsIn(lesson.unit);
  const index = sameUnit.findIndex((l) => l.id === lesson.id); // only for the "lesson 3 of 6" crumb
  const next = nextLesson(lesson.id); // crosses into the next unit, unlike sameUnit
  const myProgress = saved.lessons[lesson.id];
  const complete = isComplete(saved, lesson.id);
  // lessons store project ids, not the projects. filter(Boolean) drops any id that no longer exists
  const projects = (lesson.cadProjects ?? []).map((wanted) => cadGuides.find((g) => g.id === wanted)).filter(Boolean);
  const quizTried = myProgress?.quizBest !== undefined; // 0 is a real score, so check for undefined not falsy

  // one --unit here colours the badge, bullets, formula rules and chevrons all the way down
  return (
    <div className="wrap page lesson" style={{ ["--unit" as string]: unit.color }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={href("learn", lesson.unit)}>{unit.title}</a>
        <span>›</span>
        <span>Lesson {index + 1} of {sameUnit.length}</span>
      </nav>

      <header className="lesson-head">
        <div>
          <div className="lesson-title-row">
            <span className="unit-badge"><UnitPhoto unit={lesson.unit} size={58} /></span>
            <h1>{lesson.title}</h1>
          </div>
          <p className="lead">{lesson.summary}</p>
        </div>
        <div className="lesson-status">
          <span className={"pill" + (complete ? " done" : "")}>
            {complete ? <><IconCheck size={14} /> Completed</> : `${lesson.minutes} min`}
          </span>
        </div>
      </header>

      {/* slides are the main teaching now, so they come first and the video only shows if there is one */}
      {lesson.slides?.length
        ? <LessonSlides slides={lesson.slides} title={lesson.title} />
        : <LessonVideo video={lesson.video} title={lesson.title} />}
      {lesson.slides?.length && lesson.video ? <LessonVideo video={lesson.video} title={lesson.title} /> : null}

      {/* solo = no picture, so the text takes the full width instead of leaving an empty rail */}
      <div className={"lesson-grid" + (lesson.image ? "" : " solo")}>
        <article className="lesson-main">
          <section className="objectives">
            <h2>You'll learn to</h2>
            <ul>{lesson.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          </section>

          <h2 className="part-title" id="ideas">Key ideas</h2>
          {lesson.sections.map((section, i) => <SectionView key={section.heading} section={section} id={`sec-${i}`} />)}


          <section className="field-note reveal">
            <h2>In the field</h2>
            <RichText text={lesson.inTheField} />
            {lesson.resources && lesson.resources.length > 0 && (
              <ul className="resources">
                {lesson.resources.map((r) => (
                  <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.label} ↗</a></li>
                ))}
              </ul>
            )}
          </section>

          <h2 className="part-title">What's next</h2>
          <div className="action-cards">
            <a className="action-card primary" href={href("quiz", lesson.id)}>
              <span className="action-icon"><IconQuiz size={20} /></span>
              <strong>{quizTried ? "Retake the quiz" : "Take the quiz"}</strong>
              <span>{lesson.quiz.length} questions{quizTried ? ` · best so far ${myProgress!.quizBest}/${myProgress!.quizTotal}` : " · 70% completes the lesson"}</span>
            </a>
            {lesson.buildAlong && (
              <a className="action-card" href={href("build", lesson.id)}>
                <span className="action-icon"><IconBuild size={20} /></span>
                <strong>Build it for real</strong>
                <span>{lesson.buildAlong.title}</span>
              </a>
            )}
            {projects.map((g) => (
              // the ! is because filter(Boolean) doesn't convince typescript these aren't undefined
              <a key={g!.id} className="action-card" href={href("cad", g!.id)}>
                <span className="action-icon"><UnitPhoto unit="cad" size={26} /></span>
                <strong>CAD project</strong>
                <span>{g!.title} · graded by measurement</span>
              </a>
            ))}
          </div>

          <div className="lesson-next">
            {/* last lesson has no next, so send them to CAD Studio rather than a dead end */}
            <a className="next-card" href={next ? href("lesson", next.id) : href("cad")}>
              <div>
                <span>{next ? "Next lesson" : "You've reached the end"}</span>
                <strong>{next ? next.title : "Design something in CAD Studio"}</strong>
              </div>
              <span className="arrow"><IconArrow size={24} /></span>
            </a>
          </div>
        </article>

        {lesson.image && (
          <aside className="lesson-side">
            <figure className="lesson-figure">
              <img src={lesson.image.src} alt={lesson.image.alt} />
              {lesson.image.caption && <figcaption>{lesson.image.caption}</figcaption>}
            </figure>
          </aside>
        )}
      </div>
    </div>
  );
}
