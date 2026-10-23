import type { Lesson } from "../content/types";
import { href } from "../lib/router";
import { unitById } from "../content/curriculum";
import { UnitPhoto } from "./icons";

// shared top of the quiz / build pages. always two ways back to the lesson (crumb + button)
// so a side page is never a dead end
export function LessonSubHead({ lesson, eyebrow, title, lead }: {
  lesson: Lesson; eyebrow: string; title: string; lead: string;
}) {
  const unit = unitById(lesson.unit);
  return (
    <>
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={href("learn", lesson.unit)}>{unit.title}</a>
        <span>›</span>
        <a href={href("lesson", lesson.id)}>{lesson.title}</a>
        <span>›</span>
        <span>{eyebrow}</span>
      </nav>
      <header className="sub-head">
        <div className="lesson-title-row">
          <span className="unit-badge"><UnitPhoto unit={lesson.unit} size={58} /></span>
          <h1>{title}</h1>
        </div>
        <p className="lead">{lead}</p>
        <a className="btn small" href={href("lesson", lesson.id)}>← Back to the lesson</a>
      </header>
    </>
  );
}
