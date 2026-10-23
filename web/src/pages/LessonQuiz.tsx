import { useState } from "react";
import { lessonById, nextLesson } from "../content/curriculum";
import { Quiz } from "../components/Quiz";
import { LessonSubHead } from "../components/LessonSubHead";
import { href } from "../lib/router";
import { quizPass, isComplete, progress, useProgress } from "../lib/progress";
import { IconArrow, IconCheck } from "../components/icons";

// quiz lives on its own page so the lesson doesn't turn into a scroll marathon
export function LessonQuiz({ id }: { id: string }) {
  const lesson = lessonById(id);
  const saved = useProgress();
  // null until they hit check. separate from saved progress so the page can react right away
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  if (!lesson) {
    return (
      <div className="wrap page narrow">
        <h1>Quiz not found</h1>
        <p><a className="btn primary" href={href("learn")}>Back to the course</a></p>
      </div>
    );
  }
  const next = nextLesson(lesson.id);
  // this sitting's score wins if there is one, otherwise fall back to whether it was passed before
  const passed = result ? result.correct / result.total >= quizPass : isComplete(saved, lesson.id);

  return (
    <div className="wrap page narrow" style={{ ["--unit" as string]: "var(--brand)" }}>
      <LessonSubHead
        lesson={lesson}
        eyebrow="Quiz"
        title={`${lesson.title}: quiz`}
        lead={`${lesson.quiz.length} questions. Every answer is explained, right or wrong, and ${Math.ceil(quizPass * lesson.quiz.length)} correct marks the lesson complete.`}
      />

      {/* key on the lesson id, else switching lessons would keep the old answers ticked */}
      <Quiz
        key={lesson.id}
        questions={lesson.quiz}
        onFinish={(correct, total) => {
          progress.quiz(lesson.id, correct, total); // save it
          setResult({ correct, total });          // and show the follow-up below
        }}
      />

      {result && (
        <div className="quiz-after">
          {passed ? (
            <>
              <h2><IconCheck size={20} /> Lesson complete</h2>
              <div className="action-cards">
                {next && (
                  <a className="action-card primary" href={href("lesson", next.id)}>
                    <strong>Next lesson</strong>
                    <span>{next.title}</span>
                  </a>
                )}
                <a className="action-card" href={href("learn", lesson.unit)}>
                  <strong>Back to the unit</strong>
                  <span>Pick your next lesson</span>
                </a>
              </div>
            </>
          ) : (
            <>
              <h2>Worth another look</h2>
              <p className="lead">
                Read the explanations above, then go back over the key ideas and try again. Nothing is recorded except
                your best score.
              </p>
              <p>
                <a className="btn primary" href={href("lesson", lesson.id)}>
                  Back to the lesson <span className="arrow"><IconArrow size={16} /></span>
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
