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

  return scheme;
}