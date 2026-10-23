// light / dark / follow the computer. saved per device
import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
const themeKey = "torque.theme";

function sysDark() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches;
}

// styles.css all hangs off data-theme, so flipping this one attribute repaints the site
export function applyTheme(theme: Theme) {
  const isDark = theme === "dark" || (theme === "system" && sysDark());
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  document.documentElement.style.colorScheme = isDark ? "dark" : "light"; // scrollbars + inputs too
}

export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(themeKey) as Theme) || "system");

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      // blocked or full. just won't be remembered
    }

    // only "system" can change by itself while they're sitting on the page
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const redo = () => applyTheme("system");
    mediaQuery.addEventListener("change", redo);
    return () => mediaQuery.removeEventListener("change", redo);
  }, [theme]);

  return [theme, setTheme];
}

// main.tsx calls this before React mounts, else the page flashes white then snaps to dark
export function initTheme() {
  applyTheme(((typeof localStorage !== "undefined" && localStorage.getItem(themeKey)) as Theme) || "system");
}
