// line icons on a 24x24 grid. one per unit, plus a handful for the interface
// stroke is currentColor everywhere, so an icon just takes the colour of whatever it sits in -- that's
// how the unit accent reaches them without any of them knowing which unit they're for
import type { UnitId } from "../content/types";

// shared attributes, spread into every icon so they can't drift apart
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// compass and ruler. measuring, and the design process
export const IconFoundations = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M12 3v3" />
    <circle cx="12" cy="4" r="1.3" />
    <path d="M12 6 5.5 20M12 6l6.5 14" />
    <path d="M8.6 13.4h6.8" />
  </svg>
);

// gear. mechanical
export const IconMechanical = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
  </svg>
);

// resistor and a wire. electrical
export const IconElectrical = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M2.5 12h3.2l1.6-4 2.4 8 2.4-8 2.4 8 1.6-4h3.4" />
  </svg>
);

// robot head. robotics
export const IconRobotics = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <rect x="4.5" y="8" width="15" height="11" rx="3" />
    <path d="M12 4.2V8" />
    <circle cx="12" cy="3.4" r="1.2" />
    <path d="M9.3 12.4v1.8M14.7 12.4v1.8" />
    <path d="M1.8 12.5v3M22.2 12.5v3" />
  </svg>
);

// Isometric cube: CAD.
export const IconCad = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M12 2.9 20.3 7v9.9L12 21.1 3.7 16.9V7z" />
    <path d="M3.7 7 12 11.3 20.3 7M12 11.3v9.8" />
  </svg>
);

export const unitIcons: Record<UnitId, (p: { size?: number }) => JSX.Element> = {
  foundations: IconFoundations,
  mechanical: IconMechanical,
  electrical: IconElectrical,
  robotics: IconRobotics,
  cad: IconCad,
};

export const IconPlay = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22} fill="currentColor" stroke="none">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const IconCheck = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22} strokeWidth={2.4}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);

export const IconArrow = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M4 12h15.5M13.5 6l6 6-6 6" />
  </svg>
);

export const IconSpark = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M13 2.5 5.5 13.5h5.2L10 21.5 18.5 10h-5.3z" />
  </svg>
);

export const IconSun = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5M18.6 18.6l-1.5-1.5M6.9 6.9 5.4 5.4" />
  </svg>
);

export const IconMoon = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
  </svg>
);

// clipboard with a tick. the quiz
export const IconQuiz = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M9 3h6v3H9z" />
    <path d="M15 4.5h2.5A1.5 1.5 0 0 1 19 6v13.5A1.5 1.5 0 0 1 17.5 21h-11A1.5 1.5 0 0 1 5 19.5V6a1.5 1.5 0 0 1 1.5-1.5H9" />
    <path d="m8.5 13 2.2 2.2L15.5 10" />
  </svg>
);


// wrench. the hands-on build
export const IconBuild = (p: { size?: number }) => (
  <svg {...base} width={p.size ?? 22} height={p.size ?? 22}>
    <path d="M14.5 3a5 5 0 0 0-4.4 7.3L3 17.4V21h3.6l7.1-7.1A5 5 0 1 0 14.5 3z" />
    <path d="M16.5 7.5h.01" />
  </svg>
);


// photos instead of the line drawings for the unit badges. the drawings were too abstract to tell
// apart at this size. cropped square because every place one of these lands is a square
export const unitPhotos: Record<UnitId, string> = {
  foundations: "/img/unit/foundations.jpg",
  mechanical: "/img/unit/mechanical.jpg",
  electrical: "/img/unit/electrical.jpg",
  robotics: "/img/unit/robotics.jpg",
  cad: "/img/unit/cad.jpg",
};

const unitAlt: Record<UnitId, string> = {
  foundations: "A vernier caliper",
  mechanical: "Meshing steel gears on a machine",
  electrical: "A circuit board with electronic components",
  robotics: "An industrial robot arm",
  cad: "A 3D model on screen in CAD software",
};

// same job as the icon it replaced, so it takes its size from whatever contains it
export const UnitPhoto = ({ unit, size = 22 }: { unit: UnitId; size?: number }) => (
  <img
    className="unit-photo"
    src={unitPhotos[unit]}
    alt={unitAlt[unit]}
    width={size}
    height={size}
    loading="lazy"
  />
);
