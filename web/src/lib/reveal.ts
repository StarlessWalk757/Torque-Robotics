// class "reveal" starts invisible, .shown in the css does the fade up
// one observer for the page instead of per component, since stuff arrives late (cad projects wait on the server)
import { useEffect } from "react";

export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const noMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const showAll = () =>
      document.querySelectorAll<HTMLElement>(".reveal:not(.shown)").forEach((el) => el.classList.add("shown"));

    // no animation wanted, or browser too old -> show everything. never leave it hidden
    if (noMotion || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("shown");
            obs.unobserve(entry.target); // once only, and stops the list growing forever
          }
        }
      },
      // -8% so it has to clear the bottom edge properly before it counts
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    const watchNew = () =>
      document.querySelectorAll<HTMLElement>(".reveal:not(.shown)").forEach((el) => obs.observe(el));
    watchNew();

    // anything React renders after this first pass needs picking up too
    const watcher = new MutationObserver(watchNew);
    watcher.observe(document.body, { childList: true, subtree: true });

    // backstop. invisible content is way worse than a skipped animation
    const backstop = window.setTimeout(showAll, 4000);

    return () => {
      obs.disconnect();
      watcher.disconnect();
      window.clearTimeout(backstop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
