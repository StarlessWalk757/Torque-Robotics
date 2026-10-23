// Builds example STL files for every CAD project: correct answers plus a few deliberate mistakes.
// They're used by the Java tests and offered in the app as "try a sample" files, so anyone can see
// grading work without designing a part first. Run with: npm run samples
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDirs = [join(here, "../public/samples"), join(here, "../../server/src/test/resources/stl")];
for (const d of outDirs) mkdirSync(d, { recursive: true });

const SEGMENTS = 48;

function circle(cx, cy, r) {
  const p = new THREE.Path();
  p.absarc(cx, cy, r, 0, Math.PI * 2, true);
  return p;
}

function rect(w, h) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2);
  s.lineTo(w / 2, -h / 2);
  s.lineTo(w / 2, h / 2);
  s.lineTo(-w / 2, h / 2);
  s.closePath();
  return s;
}

function roundedRect(PathClass, cx, cy, w, h, r) {
  const s = new PathClass();
  const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - r);
  s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
  s.lineTo(x0 + r, y1);
  s.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + r);
  s.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function save(name, shape, depth, scale = 1) {
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: SEGMENTS });
  if (scale !== 1) geo.scale(scale, scale, scale);
  const data = new STLExporter().parse(new THREE.Mesh(geo), { binary: true });
  const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  for (const d of outDirs) writeFileSync(join(d, name), bytes);
  console.log("wrote", name, `(${geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3} triangles)`);
}

// 1. First part: 40 × 20 × 10 block
save("first-block.stl", rect(40, 20), 10);
// Same block exported in inches (a common mistake)
save("first-block-inches.stl", rect(40, 20), 10, 1 / 25.4);

// 2. M5 spacer: Ø12 outside, Ø5.5 hole, 10 long
{
  const s = new THREE.Shape();
  s.absarc(0, 0, 6, 0, Math.PI * 2, false);
  s.holes.push(circle(0, 0, 2.75));
  save("m5-spacer.stl", s, 10);
}

// 3. Sensor plate: 50 × 30 × 3 with two Ø3.4 holes 40 apart
{
  const s = rect(50, 30);
  s.holes.push(circle(-20, 0, 1.7), circle(20, 0, 1.7));
  save("sensor-plate.stl", s, 3);
}
// Mistakes: holes drawn at Ø3.0 (screw size, no clearance), 38 mm apart, and shifted 1 mm off center
{
  const s = rect(50, 30);
  s.holes.push(circle(-18, 0, 1.5), circle(20, 0, 1.5));
  save("sensor-plate-mistakes.stl", s, 3);
}

// 4. NEMA 17 mount: 50 × 50 × 4, Ø22.5 bore, 4 × Ø3.4 on a 31 mm square
{
  const s = rect(50, 50);
  s.holes.push(circle(0, 0, 11.25));
  for (const [x, y] of [[-15.5, -15.5], [15.5, -15.5], [15.5, 15.5], [-15.5, 15.5]]) s.holes.push(circle(x, y, 1.7));
  save("nema17-mount.stl", s, 4);
}

// 5. Chassis plate: 150 × 110 × 4, rounded corners, motor mounts, caster, electronics holes, weight-saving cutouts
{
  const s = roundedRect(THREE.Shape, 0, 0, 150, 110, 8);
  // Motor bracket holes (M3), two per side, on the rear axle line x = -40
  for (const y of [-45, 45]) for (const dx of [-9, 9]) s.holes.push(circle(-40 + dx, y, 1.7));
  // Caster holes at the front (M3, 20 mm apart)
  s.holes.push(circle(60, -10, 1.7), circle(60, 10, 1.7));
  // Microcontroller standoffs (M3) on a 50 × 40 rectangle
  for (const [x, y] of [[0, -20], [50, -20], [0, 20], [50, 20]]) s.holes.push(circle(x - 10, y, 1.7));
  // Wire pass-through and weight-saving slot
  s.holes.push(circle(-40, 0, 6));
  s.holes.push(roundedRect(THREE.Path, 15, 0, 20, 14, 4));
  save("chassis-plate.stl", s, 4);
}
