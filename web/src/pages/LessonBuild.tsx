import { lessonById } from "../content/curriculum";
import { LessonSubHead } from "../components/LessonSubHead";
import { RichText } from "../components/RichText";
import { PartsList } from "../components/PartsList";
import { CodeBlock } from "../components/CodeBlock";
import { useReveal } from "../lib/reveal";
import { href } from "../lib/router";
import { IconQuiz } from "../components/icons";

// the hands-on build, own page. parts + steps + sketch + safety
export function LessonBuild({ id }: { id: string }) {
  const lesson = lessonById(id);
  const build = lesson?.buildAlong; // ?. because lesson might not exist at all
  useReveal([id]);

  // two ways to get here wrongly: bad id, or a lesson that simply has no build
  if (!lesson || !build) {
    return (
      <div className="wrap page narrow">
        <h1>No build for this lesson</h1>
        <p><a className="btn primary" href={lesson ? href("lesson", lesson.id) : href("learn")}>Back to the lesson</a></p>
      </div>
    );
  }

  return (
    <div className="wrap page narrow">
      <LessonSubHead lesson={lesson} eyebrow="Build along" title={build.title} lead="Do it for real. Read the whole thing once before you start." />

      <RichText text={build.intro} />

      <h2 className="part-title">What you need</h2>
      <PartsList items={build.parts} />
      <p className="fine">
        Links go to stores or store searches. Prices and stock change, so compare the specs in{" "}
        <a href={href("parts")}>Parts &amp; Kits</a>, and ask a parent or guardian before buying online.
      </p>

      {build.safety && (
        <div className="callout warning">
          <strong>Safety</strong>
          <ul>{build.safety.map((line) => <li key={line}>{line}</li>)}</ul>
        </div>
      )}

      <h2 className="part-title">Steps</h2>
      {/* index as key is fine here, the steps never reorder */}
      <ol className="steps">
        {build.steps.map((step, i) => <li key={i}><RichText text={step} /></li>)}
      </ol>
      {build.code && <CodeBlock {...build.code} />}

      <div className="lesson-next">
        <a className="next-card" href={href("quiz", lesson.id)}>
          <div>
            <span>Built it?</span>
            <strong>Take the {lesson.title} quiz</strong>
          </div>
          <span className="arrow"><IconQuiz size={24} /></span>
        </a>
      </div>
    </div>
  );
}
