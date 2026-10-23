// whole site is one page, so the # in the url is the entire navigation system
// "#/lesson/gears" -> ["lesson", "gears"], App switches on parts[0]
// hash instead of real paths = no server config, works on any static host
import { useEffect, useState } from "react";

// filter(Boolean) kills the empty strings the leading slash leaves behind
function getParts(hash: string): string[] {
  return hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
}

export function useRoute(): string[] {
  const [parts, setParts] = useState(() => getParts(window.location.hash));

  useEffect(() => {
    // hashchange fires on link clicks AND back/forward, so one listener covers both
    function onHashChange() {
      setParts(getParts(window.location.hash));
      window.scrollTo({ top: 0 }); // short page would open halfway down otherwise
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange); // else they stack up
  }, []);

  return parts;
}

// other direction. every <a> goes through this so nothing hand-writes a hash
export const href = (...bits: string[]) => "#/" + bits.map(encodeURIComponent).join("/");
