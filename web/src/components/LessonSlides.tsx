import { useEffect, useState } from "react";
import type { Slide } from "../content/types";

// the deck that replaces the video. one slide at a time, arrows or keyboard to move
// state is just the index -- everything on screen is worked out from that one number
export function LessonSlides({ slides, title }: { slides: Slide[]; title: string }) {
  const [at, setAt] = useState(0);
  const slide = slides[at];
  const last = slides.length - 1;

  // clamped rather than wrapped. looping back to slide 1 off the end feels like a mistake
  const go = (to: number) => setAt(Math.max(0, Math.min(last, to)));

  // arrow keys, because anyone reading a deck reaches for them
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore while typing in a box, or the quiz textarea would eat its own arrows
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") setAt((n) => Math.min(slides.length - 1, n + 1));
      if (e.key === "ArrowLeft") setAt((n) => Math.max(0, n - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  return (
    <section className="deck" aria-roledescription="slide deck" aria-label={`${title} slides`}>
      {/* key on the index so each slide replays the fade instead of the text just swapping */}
      <div className="deck-stage" key={at}>
        <h3 className="deck-title">{slide.title}</h3>

        {slide.bullets.length > 0 && (
          <ul className="deck-points">
            {slide.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        )}

        {slide.image && (
          <figure className="deck-figure">
            <img src={slide.image.src} alt={slide.image.alt} loading="lazy" />
            {slide.image.credit && <figcaption>{slide.image.credit}</figcaption>}
          </figure>
        )}

        {slide.formula && <p className="deck-formula">{slide.formula}</p>}

        {slide.links && (
          <ul className="deck-links">
            {slide.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
              </li>
            ))}
          </ul>
        )}

        {slide.note && <p className="deck-note"><strong>Remember:</strong> {slide.note}</p>}
      </div>

      <div className="deck-bar">
        <button className="btn small" onClick={() => go(at - 1)} disabled={at === 0}>← Back</button>

        {/* one dot per slide, clickable, so a long deck can be skipped around */}
        <div className="deck-dots">
          {slides.map((s, i) => (
            <button
              key={s.title}
              className={"deck-dot" + (i === at ? " on" : "") + (i < at ? " seen" : "")}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              aria-current={i === at ? "true" : undefined}
            />
          ))}
        </div>

        <span className="deck-count">{at + 1} / {slides.length}</span>
        <button className="btn small primary" onClick={() => go(at + 1)} disabled={at === last}>Next →</button>
      </div>
    </section>
  );
}
