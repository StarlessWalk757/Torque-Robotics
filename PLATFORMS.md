# Tools, languages and platforms

| Part | Language / tool | Why |
|---|---|---|
| Server | **Java 21**, **Spring Boot 3.5** (Maven) | REST API, file uploads, STL geometry analysis, grading, rate limiting |
| STL analysis | Java (no libraries) | Binary/ASCII STL parser; vertex welding; volume by the divergence theorem; watertight and manifold checks; through-hole count from Euler's formula; plane cross-sections to measure holes |
| AI mentor | **Anthropic Java SDK** with **Claude** (`claude-sonnet-5-5`) | CAD feedback and lesson Q&A through structured outputs (JSON that maps onto Java records) |
| Web app | **TypeScript**, **React 18**, **Vite 6** | Single-page app with hash routing, light/dark themes, and scroll-triggered motion |
| Animations | TypeScript + SVG | Every "video" is a pure function of time, so it can be paused, scrubbed, slowed down and captioned. A pacing layer stretches each caption's stretch of the timeline so nothing is rushed |
| Narration | Web Speech API | The browser's built-in text-to-speech reads the captions sentence by sentence, with pauses at punctuation and units spoken as words ("Ω" → "ohms") |
| 3D viewer | **three.js** | Previews uploaded STL files |
| Sample parts | three.js `ExtrudeGeometry` + `STLExporter` (Node script) | Generates the sample STLs used by the tests and the "try a sample" buttons |
| Tests | JUnit 5 + Spring MockMvc; a TypeScript content checker (run with `tsx`) | 21 server tests (JUnit); structural checks of every lesson |
| CAD taught | **Onshape** (free, browser-based) | Students design the graded parts here |

Open-source libraries: Spring Boot (Apache-2.0), React (MIT), Vite (MIT), three.js (MIT), Anthropic Java SDK (MIT), tsx (MIT).
Fonts: Inter and JetBrains Mono (SIL Open Font License).
