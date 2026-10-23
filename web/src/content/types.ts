// the shape every lesson has to fit. lessons are plain data, not code, so a typo in one is a red squiggle
// here rather than a blank page at runtime. this file is the single thing that decides what a lesson IS

export type UnitId = "foundations" | "mechanical" | "electrical" | "robotics" | "cad";

export interface Unit {
  id: UnitId;
  title: string;
  blurb: string;
  color: string; // accent color for the unit
}

// just a string, but one that RichText will read for markup: blank line = paragraph, "- " = bullet,
// **bold** *italic* `code`. named so it's obvious which strings get rendered and which are plain
export type Rich = string;

export interface Formula {
  expr: string;                                 // written out plainly, e.g. "τ = r × F". no latex, it's shown in monospace
  where?: [symbol: string, meaning: string][];  // pairs: the symbol, then what it means
}

export interface Section {
  heading: string;
  body: Rich;
  formula?: Formula;
  // the solution is hidden behind a button, so there's a chance to try it first
  example?: { problem: Rich; solution: Rich };
  callout?: { kind: "tip" | "warning" | "real-world"; text: Rich };
  code?: { language: string; source: string; caption?: string };
}

// one slide in a lesson's deck. replaces the video: same material, but read at your own pace
// bullets are short -- a slide someone has to pause and study is really a paragraph in disguise
export interface Slide {
  title: string;
  bullets: string[];
  // the picture carries the slide. files go in web/public/img/
  image?: { src: string; alt: string; credit?: string };
  formula?: string;              // shown in monospace under the bullets
  note?: string;                 // the one line to take away, if there is one
  links?: { label: string; url: string }[];   // only on a resources slide
}

export interface Question {
  q: Rich;
  choices: string[];
  answer: number; // index into choices
  explain: Rich;  // why the answer is right (and common wrong answers are wrong)
}

export interface BuildAlong {
  title: string;
  intro: Rich;
  // ids only, never the part details -- those live in parts.ts so a price or link is edited in one place
  parts: { id: string; qty: number; note?: string }[];
  steps: Rich[];
  safety?: string[];
  code?: { language: string; source: string; caption?: string }; // the arduino sketch, when the build has one
}

export interface Lesson {
  id: string;
  unit: UnitId;
  title: string;
  minutes: number;
  summary: string;
  objectives: string[];
  // the slide deck. this is the main way a lesson is taught -- read at your own pace instead of
  // sitting through a video, and it stays in step with the written sections below it
  slides?: Slide[];
  // either a youtube id or a path to a file in public/. LessonVideo works out which by looking at it,
  // and shows a "coming soon" note when there's neither
  video?: string;
  // one still for the lesson itself, beside the text. also web/public/
  image?: { src: string; alt: string; caption?: string };
  sections: Section[];
  quiz: Question[];
  buildAlong?: BuildAlong;
  // ids of cad projects worth trying once this lesson is done
  cadProjects?: string[];
  // where this actually turns up in real work. one short note
  inTheField: Rich;
  // links out. official docs only, so nothing here can rot into something odd
  resources?: { label: string; url: string }[];
}
