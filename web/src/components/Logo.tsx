// the torque mark: a gear with a turning arrow through it
// drawn in code rather than an svg file so it stays sharp at any size and takes the current text colour
export function Logo({ size = 28 }: { size?: number }) {
  // spur gear outline. teeth are trapezoids spaced round the pitch circle
  const teeth = 10, module = 3.2, cx = 20, cy = 20, angle = 0.1;
  const rp = (module * teeth) / 2, ra = rp + module, rd = rp - 1.25 * module;
  const step = (2 * Math.PI) / teeth;
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const a = angle + i * step;
    for (const [r, th] of [[rd, a - step * 0.5], [rd, a - step * 0.28], [ra, a - step * 0.14],
                           [ra, a + step * 0.14], [rd, a + step * 0.28]] as [number, number][]) {
      d += (d === "" ? "M" : "L") + (cx + r * Math.cos(th)).toFixed(2) + "," + (cy + r * Math.sin(th)).toFixed(2);
    }
  }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden>
      <path d={d + "Z"} fill="var(--brand)" />
      <circle cx="20" cy="20" r="6.5" fill="var(--paper)" />
      <circle cx="20" cy="20" r="2.6" fill="var(--amber)" />
    </svg>
  );
}
