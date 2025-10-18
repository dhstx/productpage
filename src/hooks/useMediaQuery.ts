import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    // Support older Safari
    // @ts-ignore - addListener is deprecated but used as fallback
    m.addEventListener ? m.addEventListener("change", onChange) : m.addListener(onChange);
    return () => {
      // @ts-ignore - removeListener is deprecated but used as fallback
      m.removeEventListener ? m.removeEventListener("change", onChange) : m.removeListener(onChange);
    };
  }, [query]);

  return matches;
}
