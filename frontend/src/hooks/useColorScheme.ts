// src/hooks/useColorScheme.ts
import { useEffect, useState } from "react";

/*  Hook for Color Scheme Detection
--------------------------------------------------------------------------------
- Detects the user's preferred color scheme (light or dark) using the 
  'prefers-color-scheme' media query. 
- Listens for changes in the preference and updates the scheme accordingly.
------------------------------------------------------------------------------*/
export function useColorScheme(): "light" | "dark" {
  const getScheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [scheme, setScheme] = useState<"light" | "dark">(getScheme());

  useEffect(() => {
    const matcher = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) =>
      setScheme(e.matches ? "dark" : "light");
    matcher.addEventListener("change", listener);
    return () => matcher.removeEventListener("change", listener);
  }, []);

  // Write data-theme on <html> so the CSS [data-theme] selector overrides
  // the @media block. This runs after every scheme change and on mount,
  // keeping CSS and React state in sync. The @media fallback handles the
  // initial paint before this effect executes.
  useEffect(() => {
    document.documentElement.dataset.theme = scheme;
  }, [scheme]);

  return scheme;
}