import { partById } from "../content/parts";

// build-along lists only store an id + how many, so the actual part details get looked up here
// means a price or a link is only ever edited in one place (parts.ts)
export function PartsList({ items }: { items: { id: string; qty: number; note?: string }[] }) {
  return (
    <ul className="parts-list">
      {items.map(({ id, qty, note }) => {
        const part = partById(id);
        if (!part) return null; // bad id in a lesson shouldn't take the page down
        return (
          <li key={id}>
            <div className="parts-main">
              <span className="parts-qty">{qty}×</span>
              <div>
                <strong>{part.name}</strong>
                {note && <span className="parts-note"> ({note})</span>}
                <p>{part.why}</p>
              </div>
            </div>
            <div className="parts-links">
              {part.links.map((link) => (
                // noreferrer as well as noopener, these go off to shops
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="buy">
                  {link.store} <span aria-hidden>↗</span>
                </a>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
