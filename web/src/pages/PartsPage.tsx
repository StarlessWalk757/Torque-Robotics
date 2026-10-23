import { parts, type Part } from "../content/parts";
import { lessons } from "../content/curriculum";
import { href } from "../lib/router";

// listed in this order on purpose, kits first since that's what most people should buy
const categories: Part["category"][] = ["Kits", "Electronics", "Motors & motion", "Mechanical", "Tools & safety"];

// "Motors & motion" -> "motors-motion", for the jump links
const slug = (text: string) => text.toLowerCase().replace(/[^a-z]+/g, "-");

export function PartsPage() {
  // searched backwards from the lessons, so adding a part to a build updates this page by itself
  const usedIn = (partId: string) => lessons.filter((l) => l.buildAlong?.parts.some((item) => item.id === partId));
  return (
    <div className="wrap page">
      <header className="page-head">
        <h1>Parts & Kits</h1>
        <p className="lead">
          Everything the build-alongs use, so you can follow the videos with real hardware. A starter kit plus a robot chassis covers most lessons.
        </p>
        <div className="callout tip">
          <strong>Before you buy</strong>
          <ul>
            <li>Ask a parent or guardian before buying anything online.</li>
            <li>Amazon links are searches, not specific listings. Compare the specs under "Look for", and choose sellers with good reviews.</li>
            <li>Torque doesn't sell anything or earn money from these links.</li>
            <li>Many schools, libraries and makerspaces lend Arduino kits and 3D printers, so check there first.</li>
          </ul>
        </div>
        <nav className="jump-row" aria-label="Jump to a category">
          {categories.map((cat) => (
            // real href so it still works without js, but preventDefault + scrollIntoView to get the smooth scroll
            // and to keep the hash router from thinking this is a page change
            <a key={cat} className="chip" href={"#cat-" + slug(cat)}
              onClick={(e) => { e.preventDefault(); document.getElementById("cat-" + slug(cat))?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
              {cat} <b>{parts.filter((p) => p.category === cat).length}</b>
            </a>
          ))}
        </nav>
      </header>
      {categories.map((cat) => (
        <section key={cat} id={"cat-" + slug(cat)} className="parts-cat reveal">
          <h2>{cat}</h2>
          <div className="parts-grid">
            {parts.filter((part) => part.category === cat).map((part) => {
              const inLessons = usedIn(part.id); // named apart from the imported `lessons` so it's clear which is which
              return (
                <article key={part.id} className="part-card reveal">
                  <h3>{part.name}</h3>
                  <p>{part.why}</p>
                  <p className="look"><b>Look for:</b> {part.lookFor}</p>
                  {inLessons.length > 0 && (
                    <p className="used">
                      Used in:{" "}
                      {/* i > 0 && ", " puts commas between but not before the first */}
                      {inLessons.map((l, i) => (
                        <span key={l.id}>{i > 0 && ", "}<a href={href("lesson", l.id)}>{l.title}</a></span>
                      ))}
                    </p>
                  )}
                  <div className="parts-links">
                    {part.links.map((link) => (
                      <a key={link.url} className="buy" href={link.url} target="_blank" rel="noopener noreferrer">{link.store} <span aria-hidden>↗</span></a>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
