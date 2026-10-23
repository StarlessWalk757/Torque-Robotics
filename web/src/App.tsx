import { createContext, useContext, useEffect, useState } from "react";
import { useRoute, href } from "./lib/router";
import { api, type Status } from "./lib/api";
import { useTheme } from "./lib/theme";
import { useReveal } from "./lib/reveal";
import { Home } from "./pages/Home";
import { Learn } from "./pages/Learn";
import { LessonPage } from "./pages/LessonPage";
import { LessonQuiz } from "./pages/LessonQuiz";
import { LessonBuild } from "./pages/LessonBuild";
import { CadStudio } from "./pages/CadStudio";
import { SimLab } from "./pages/SimLab";
import { CadProjectPage } from "./pages/CadProjectPage";
import { PartsPage } from "./pages/PartsPage";
import { About } from "./pages/About";
import { Logo } from "./components/Logo";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { IconMoon, IconSun } from "./components/icons";

// context so deep pages can ask "is the server there?" without passing it down through every component
const StatusContext = createContext<Status | null>(null);
export const useStatus = () => useContext(StatusContext);

// four destinations, that's the whole site
// parts is a reference list, not somewhere you go, so it's in the footer instead
const navLinks: [string, string][] = [
  ["learn", "Lessons"],
  ["sim", "Simulations"],
  ["cad", "CAD Studio"],
  ["about", "About"],
];

// these are all reached from a lesson, so "Lessons" should stay lit while you're on one
const lessonPages = ["lesson", "quiz", "build"];

export function App() {
  const route = useRoute();
  const [status, setStatus] = useState<Status | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // phone menu
  const [scrolled, setScrolled] = useState(false);  // top bar grows a border once you move
  const [theme, setTheme] = useTheme();
  const routeKey = route.join("/"); // the route as one string, so effects can depend on it

  // ask the server once on load. [] = run on mount only
  useEffect(() => {
    api.status().then(setStatus).catch(() => setStatus({ ai: false, model: "offline", passPercent: 70, serverless: true }));
  }, []);

  // on every page change: shut the phone menu and go back to the top
  // without the scroll, a short page opens halfway down after a long one
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [routeKey]);

  // passive: true because this never calls preventDefault, lets the browser scroll smoothly
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // run once, in case the page loaded already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useReveal([routeKey]); // restart the entrance animations on each new page

  // this if-chain is the router. route[0] is the page, route[1] is whatever it needs (a lesson id etc)
  // order matters at the bottom: "cad" with an id is a project, "cad" alone is the studio
  const [page, arg] = route;
  let body: JSX.Element;
  if (!page) body = <Home />; // empty hash = home
  else if (page === "learn") body = <Learn unit={arg} />;
  else if (page === "lesson" && arg) body = <LessonPage id={arg} />;
  else if (page === "quiz" && arg) body = <LessonQuiz id={arg} />;
  else if (page === "build" && arg) body = <LessonBuild id={arg} />;
  else if (page === "sim") body = <SimLab />;
  else if (page === "cad" && arg) body = <CadProjectPage id={arg} />;
  else if (page === "cad") body = <CadStudio />;
  else if (page === "parts") body = <PartsPage />;
  else if (page === "about") body = <About />;
  else body = <NotFound />;

  const active = lessonPages.includes(page) ? "learn" : page;
  // read off the html tag rather than the theme value, since "system" could be either one
  const dark = document.documentElement.dataset.theme === "dark";

  return (
    <StatusContext.Provider value={status}>
      <a className="skip" href="#main">Skip to content</a>
      <header className={"topbar" + (scrolled ? " stuck" : "")}>
        <div className="wrap topbar-in">
          <a href="#/" className="brand" aria-label="Torque home">
            <Logo />
            <span>Torque</span>
          </a>
          <button className="menu-btn" aria-expanded={menuOpen} aria-controls="nav" onClick={() => setMenuOpen((v) => !v)}>
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <path d={menuOpen ? "M5 5l14 14M19 5L5 19" : "M3 6h18M3 12h18M3 18h18"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <nav id="nav" className={"nav" + (menuOpen ? " open" : "")}>
            {navLinks.map(([id, label]) => (
              <a key={id} href={href(id)} className={active === id ? "active" : ""} aria-current={active === id ? "page" : undefined}>
                {label}
              </a>
            ))}
            <button
              className="theme-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              title={dark ? "Light mode" : "Dark mode"}
            >
              {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="main">
        {/* key on the route so React rebuilds instead of reusing -- replays the fade, and resets
            the error boundary so one broken page doesn't stay broken after you navigate away */}
        <div className="page-fade" key={routeKey}>
          <ErrorBoundary key={routeKey}>{body}</ErrorBoundary>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer-in">
          <span className="footer-brand">
            <Logo size={20} /> Torque
          </span>
          <span>Learn robotics by building. Progress is saved only in this browser.</span>
          <span className="footer-links">
            <a href={href("parts")}>Parts & kits</a>
            <a href={href("about")}>Privacy & how grading works →</a>
          </span>
        </div>
      </footer>
    </StatusContext.Provider>
  );
}

function NotFound() {
  return (
    <div className="wrap page narrow">
      <h1>That page doesn't exist</h1>
      <p className="lead">The link may be out of date. Try the course map.</p>
      <p><a className="btn primary" href={href("learn")}>Go to the course</a></p>
    </div>
  );
}
