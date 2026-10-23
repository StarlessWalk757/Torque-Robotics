import { useState } from "react";

// arduino sketches in the lessons. copy button because nobody retypes a sketch by hand
export function CodeBlock({ language, source, caption }: { language: string; source: string; caption?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // flip the label back so it can be used again
    } catch {
      // clipboard blocked (happens without https). text is still selectable, so no error shown
    }
  };

  return (
    <figure className="code">
      <div className="code-head">
        <span>{caption ?? language}</span>
        <button className="btn small ghost" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
      </div>
      <pre><code>{source.trim()}</code></pre>
    </figure>
  );
}
