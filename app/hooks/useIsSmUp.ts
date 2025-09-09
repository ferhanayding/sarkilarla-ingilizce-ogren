"use client";

import { useEffect, useState } from "react";

/** (min-width: 640px) true/false döndürür (Tailwind `sm`). */
export function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 640px)");
    const onChange = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsSmUp("matches" in e ? e.matches : (e as MediaQueryList).matches);

    // init
    onChange(mql as any);

    // subscribe (eski/yeni API uyumlu)
    if (mql.addEventListener) mql.addEventListener("change", onChange as any);
    else mql.addListener(onChange as any);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", onChange as any);
      else mql.removeListener(onChange as any);
    };
  }, []);

  return isSmUp;
}
