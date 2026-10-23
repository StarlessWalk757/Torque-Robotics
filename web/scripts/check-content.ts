// walks every lesson looking for structural mistakes. `npm run check:content`
// it has no idea whether the engineering is right, that still needs a person -- but broken quizzes,
// missing parts and links pointing at nothing are the sort of thing it does catch
import { lessons, units } from "../src/content/curriculum";
import { parts } from "../src/content/parts";
import { cadGuides } from "../src/content/cadProjects";

// this runs in node, and the project doesn't carry @types/node. declaring the two bits used here is
// cheaper than pulling in the whole package for one file
declare const process: { exitCode?: number; exit(code?: number): never };

const problems: string[] = [];
const warn: string[] = [];
const fail = (where: string, msg: string) => problems.push(`${where}: ${msg}`);

const ids = new Set<string>();
const partIds = new Set(parts.map((p) => p.id));
const cadIds = new Set(cadGuides.map((g) => g.id));
const ALLOWED_HOSTS = ["learn.onshape.com", "www.onshape.com", "cad.onshape.com", "docs.arduino.cc", "www.nist.gov"];

for (const l of lessons) {
  const at = `lesson ${l.id}`;
  if (ids.has(l.id)) fail(at, "duplicate id");
  ids.add(l.id);
  if (!units.some((u) => u.id === l.unit)) fail(at, `unknown unit ${l.unit}`);
  if (l.objectives.length < 2) fail(at, "needs at least 2 objectives");
  if (l.sections.length < 3) fail(at, "needs at least 3 sections");
  if (l.sections.length > 4) warn.push(`${at}: ${l.sections.length} sections (the lesson page is meant to stay short)`);

  const words = l.sections.reduce((n, s) => n + s.body.split(/\s+/).length, 0);
  if (words > 800) warn.push(`${at}: ${words} words of reading`);

  if (l.quiz.length !== 5) fail(at, `quiz has ${l.quiz.length} questions (expected 5)`);
  const slots = new Set<number>();
  l.quiz.forEach((q, i) => {
    if (q.answer < 0 || q.answer >= q.choices.length) fail(at, `quiz Q${i + 1} answer index out of range`);
    if (new Set(q.choices).size !== q.choices.length) fail(at, `quiz Q${i + 1} has duplicate choices`);
    if (q.choices.length < 3) fail(at, `quiz Q${i + 1} needs at least 3 choices`);
    if (!q.explain.trim()) fail(at, `quiz Q${i + 1} has no explanation`);
    slots.add(q.answer);
  });
  if (slots.size < 2) warn.push(`${at}: every quiz answer is in the same position`);

  for (const p of l.buildAlong?.parts ?? []) if (!partIds.has(p.id)) fail(at, `unknown part "${p.id}"`);
  for (const c of l.cadProjects ?? []) if (!cadIds.has(c)) fail(at, `unknown CAD project "${c}"`);
  for (const r of l.resources ?? []) {
    const host = new URL(r.url).host;
    if (!ALLOWED_HOSTS.includes(host)) fail(at, `resource link to unverified host ${host}`);
  }
}

for (const g of cadGuides) for (const lid of g.lessons) if (!ids.has(lid)) fail(`CAD guide ${g.id}`, `links to missing lesson "${lid}"`);

const minutes = lessons.reduce((n, l) => n + l.minutes, 0);
console.log(`Checked ${lessons.length} lessons across ${units.length} units (${minutes} minutes of material).`);
for (const w of warn) console.log("warning  " + w);
for (const p of problems) console.log("PROBLEM  " + p);
if (problems.length) {
  console.log(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log("No problems found.");
