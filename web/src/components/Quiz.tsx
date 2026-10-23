import { useState } from "react";
import type { Question } from "../content/types";
import { RichText } from "./RichText";
import { quizPass } from "../lib/progress";

// nothing is marked until they hit check, so a wrong click isn't punished straight away
export function Quiz({ questions, onFinish }: { questions: Question[]; onFinish: (correct: number, total: number) => void }) {
  // one slot per question, null = not answered yet. parallel to questions by index
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);

  // worked out every render instead of stored, so it can't drift out of sync with answers
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const allDone = answers.every((a) => a !== null);

  const check = () => {
    setChecked(true);
    onFinish(correct, questions.length); // parent saves it, this doesn't touch storage
  };
  const retry = () => {
    setAnswers(questions.map(() => null));
    setChecked(false);
  };

  return (
    <div className="quiz">
      {questions.map((question, qIndex) => (
        <fieldset key={qIndex} className="quiz-q">
          <legend>
            <span className="quiz-n">{qIndex + 1}</span>
            <RichText text={question.q} />
          </legend>

          <div className="quiz-choices">
            {question.choices.map((choice, choiceIndex) => {
              const picked = answers[qIndex] === choiceIndex;
              // before checking: show what they picked. after: show right/wrong
              const look = checked
                ? choiceIndex === question.answer ? "right" : picked ? "wrong" : ""
                : picked ? "chosen" : "";
              return (
                <button
                  key={choiceIndex}
                  className={"quiz-choice " + look}
                  disabled={checked}
                  aria-pressed={picked}
                  // copy the whole array with this one slot replaced. editing in place wouldn't re-render
                  onClick={() => setAnswers((old) => old.map((v, i) => (i === qIndex ? choiceIndex : v)))}
                >
                  <span className="quiz-letter">{String.fromCharCode(65 + choiceIndex)}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {/* explain every question after checking, not just the missed ones */}
          {checked && (
            <div className={"quiz-explain " + (answers[qIndex] === question.answer ? "right" : "wrong")}>
              <strong>{answers[qIndex] === question.answer ? "Correct." : "Not quite."}</strong> <RichText text={question.explain} />
            </div>
          )}
        </fieldset>
      ))}

      <div className="quiz-foot">
        {!checked ? (
          <button className="btn primary" disabled={!allDone} onClick={check}>
            {allDone ? "Check answers" : `Answer all ${questions.length} questions`}
          </button>
        ) : (
          <>
            <div className={"quiz-score " + (correct / questions.length >= quizPass ? "pass" : "fail")}>
              {correct} / {questions.length} correct
              <span>{correct / questions.length >= quizPass ? " · Lesson complete!" : ` · ${Math.ceil(quizPass * questions.length)} needed to complete the lesson`}</span>
            </div>
            <button className="btn" onClick={retry}>Try again</button>
          </>
        )}
      </div>
    </div>
  );
}
