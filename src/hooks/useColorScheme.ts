// src/hooks/useColorScheme.ts
import { useEffect, useState } from "react";

/*  Hook: useColorScheme
--------------------------------------------------------------------------------
    Description: Custom React hook that detects the current color scheme (light
    or dark) based on the user's system preferences. It listens for changes
    in the color scheme and updates the state.
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