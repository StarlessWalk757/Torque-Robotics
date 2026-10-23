// every call to the java server is in here, so an endpoint only ever moves in one place
// these interfaces have to match the java records by hand. nothing checks across the two languages

export interface Status {
  ai: boolean;
  model: string;
  passPercent: number;
  // true when nothing is answering, like a static preview. grading needs the server, the lessons don't
  serverless?: boolean;
}

export interface SpecRow { label: string; value: string }
export interface CadProjectInfo {
  id: string; order: number; title: string; level: string; summary: string;
  spec: SpecRow[]; designPoints: number; designRubric: string; nominalSize: number[];
}

// one requirement off the brief, after the server measured the part against it
export interface Check { id: string; label: string; passed: boolean; earned: number; points: number; expected: string; measured: string; fix: string }

// one closed outline from slicing the part. either the edge of the solid or a hole
export interface LoopInfo { hole: boolean; area: number; perimeter: number; cx: number; cy: number; diameter: number; round: boolean; roundness: number }

// measured straight off the stl, no ai anywhere in here
export interface MeshReport {
  triangles: number; min: number[]; max: number[]; size: number[]; sortedSize: number[]; volume: number; surfaceArea: number;
  watertight: boolean; openEdges: number; nonManifoldEdges: number; flippedEdges: number; shells: number;
  throughHoles: number | null; invertedNormals: boolean;
  slice: { axis: number; at: number; outlines: LoopInfo[]; holes: LoopInfo[] } | null;
}

// the written feedback. reads the numbers above, never allowed to overrule them
export interface CadReview {
  summary: string; strengths: string[]; fixes: { issue: string; why: string; howInOnshape: string }[];
  principle: string; designScore: number; designRationale: string; source: string;
}

export interface GradeResult {
  projectId: string; projectTitle: string; measuredScore: number; measuredMax: number; designScore: number | null; designMax: number;
  total: number; totalMax: number; passed: boolean; checks: Check[]; mesh: MeshReport; unitsWarning: string | null;
  review: CadReview; reviewMode: "claude" | "offline";
}

export interface SimBuilt { allowed: boolean; title: string; html: string; note: string }

// shared by all of them. throw the server's own message, it's written for the visitor
// the catch is for when the body isn't json at all (crash page)
async function getJson<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  // never throws. no server shouldn't stop the lessons being readable
  status: () =>
    fetch("/api/status")
      .then((res) => getJson<Status>(res))
      .catch(() => ({ ai: false, model: "offline", passPercent: 70, serverless: true }) as Status),

  // server first, then the copy baked into the build so briefs still read on a static preview
  projects: () =>
    fetch("/api/cad/projects")
      .then((res) => getJson<CadProjectInfo[]>(res))
      .catch(() => fetch("/cad-projects.json").then((res) => getJson<CadProjectInfo[]>(res))),

  // prompt is only ever checked server side. checking here would be pointless, anyone can edit what the browser sends
  buildSim: (prompt: string) =>
    fetch("/api/sim/build", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) })
      .then((res) => getJson<SimBuilt>(res)),

  // FormData not json, it's files. don't set Content-Type here, fetch does the multipart boundary itself
  grade(projectId: string, stl: File, images: File[], notes: string) {
    const form = new FormData();
    form.append("projectId", projectId);
    form.append("stl", stl);
    images.forEach((pic) => form.append("images", pic));
    form.append("notes", notes);
    return fetch("/api/cad/grade", { method: "POST", body: form }).then((res) => getJson<GradeResult>(res));
  },
};
