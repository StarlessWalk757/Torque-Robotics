// quiz scores + cad attempts, kept in localStorage. no accounts, so this browser is the only copy
import { useSyncExternalStore } from "react";

export interface LessonProgress {
  quizBest?: number;     // best ever, not latest
  quizTotal?: number;
  completedAt?: string;  // stamped once, the first pass
}

export interface CadAttempt {
  at: string;
  total: number;
  totalMax: number;
  passed: boolean;
}

export interface Progress {
  name: string;
  lessons: Record<string, LessonProgress>;  // key = lesson id
  cad: Record<string, CadAttempt[]>;        // key = project id, newest last
}

// v1 so if the shape changes later, old saves get stranded instead of crashing the new code
const storageKey = "torque.progress.v1";
const blank: Progress = { name: "", lessons: {}, cad: {} };
export const quizPass = 0.7;

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return blank;
    // could be anything under that key, so backfill rather than trust it
    const old = JSON.parse(raw) as Partial<Progress>;
    return { name: old.name ?? "", lessons: old.lessons ?? {}, cad: old.cad ?? {} };
  } catch {
    return blank; // damaged json or storage off
  }
}

// one copy for the whole app + who wants telling when it changes
let data: Progress = loadProgress();
const listeners = new Set<() => void>();

// everything goes through here, so there's one place that writes and one that notifies
function saveProgress(next: Progress) {
  data = next;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch {
    // full or blocked. app still works, just won't survive a refresh
  }
  listeners.forEach((fn) => fn());
}

export const progress = {
  get: () => data,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  // ... copies the old one and name overwrites just that field
  // has to be a NEW object or React won't notice anything changed
  setName(name: string) {
    saveProgress({ ...data, name: name.slice(0, 40) });
  },

  quiz(lessonId: string, correct: number, outOf: number) {
    const old = data.lessons[lessonId] ?? {};
    const best = Math.max(old.quizBest ?? 0, correct); // retaking can never lose you progress
    const passed = best / outOf >= quizPass;
    saveProgress({
      ...data,
      lessons: {
        ...data.lessons,
        [lessonId]: {
          ...old,
          quizBest: best,
          quizTotal: outOf,
          completedAt: old.completedAt ?? (passed ? new Date().toISOString() : undefined), // keep the first date
        },
      },
    });
  },

  cadAttempt(projectId: string, attempt: CadAttempt) {
    // last 20 only. someone could upload a hundred times and fill their storage
    const tries = [...(data.cad[projectId] ?? []), attempt].slice(-20);
    saveProgress({ ...data, cad: { ...data.cad, [projectId]: tries } });
  },

  reset() {
    saveProgress(blank);
  },
};

// react side. anything calling this re-renders when saveProgress runs
export function useProgress(): Progress {
  return useSyncExternalStore(progress.subscribe, progress.get);
}

// done = quiz passed. !! turns the date (or nothing) into true/false
export const isComplete = (p: Progress, lessonId: string) => !!p.lessons[lessonId]?.completedAt;

// compare by percent, projects are marked out of different totals
export const cadBest = (p: Progress, projectId: string) => {
  const tries = p.cad[projectId] ?? [];
  return tries.reduce<CadAttempt | undefined>(
    (best, t) => (!best || t.total / t.totalMax > best.total / best.totalMax ? t : best),
    undefined,
  );
};
