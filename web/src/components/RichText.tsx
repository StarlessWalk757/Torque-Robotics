// lesson bodies are plain strings, so this turns the little bit of markup they use into real elements
// blank line = new paragraph, "- " = bullet, "1. " = numbered, **bold** *italic* `code` inline
// building elements instead of setting innerHTML, so lesson text can never inject html
import type { ReactNode } from "react";

// walks one line and swaps the **bold** / `code` / *italic* pieces out for real tags
// keyBase is passed down so the keys stay unique across every line on the page
function withMarks(text: string, keyBase: string): ReactNode[] {
  const bits: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g;
  let from = 0; // end of the last match, so the plain text between them isn't lost
  let match: RegExpExecArray | null;
  let n = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > from) bits.push(text.slice(from, match.index));
    const piece = match[0];
    const key = `${keyBase}-${n++}`;
    // order matters: ** has to be checked before *, or bold reads as italic
    if (piece.startsWith("**")) bits.push(<strong key={key}>{piece.slice(2, -2)}</strong>);
    else if (piece.startsWith("`")) bits.push(<code key={key}>{piece.slice(1, -1)}</code>);
    else bits.push(<em key={key}>{piece.slice(1, -1)}</em>);
    from = match.index + piece.length;
  }
  if (from < text.length) bits.push(text.slice(from)); // tail after the last match
  return bits;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const chunks = text.trim().split(/\n\s*\n/); // blank line splits paragraphs
  return (
    <div className={"rich" + (className ? " " + className : "")}>
      {chunks.map((chunk, i) => {
        const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);

        if (lines.length && lines.every((line) => line.startsWith("- "))) {
          return <ul key={i}>{lines.map((line, j) => <li key={j}>{withMarks(line.slice(2), `${i}-${j}`)}</li>)}</ul>;
        }
        if (lines.length && lines.every((line) => /^\d+\.\s/.test(line))) {
          return <ol key={i}>{lines.map((line, j) => <li key={j}>{withMarks(line.replace(/^\d+\.\s/, ""), `${i}-${j}`)}</li>)}</ol>;
        }

        // sentence then bullets, which happens a lot in the lessons
        const firstBullet = lines.findIndex((line) => line.startsWith("- "));
        if (firstBullet > 0 && lines.slice(firstBullet).every((line) => line.startsWith("- "))) {
          return (
            <div key={i}>
              <p>{withMarks(lines.slice(0, firstBullet).join(" "), `${i}p`)}</p>
              <ul>{lines.slice(firstBullet).map((line, j) => <li key={j}>{withMarks(line.slice(2), `${i}-${j}`)}</li>)}</ul>
            </div>
          );
        }

        return <p key={i}>{withMarks(lines.join(" "), `${i}`)}</p>; // plain paragraph
      })}
    </div>
  );
}
