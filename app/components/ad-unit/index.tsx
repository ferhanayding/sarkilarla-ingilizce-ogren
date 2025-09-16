// app/components/AdUnit.tsx
"use client";
import { useEffect, useRef } from "react";

export default function AdUnit() {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
    pushed.current = true;
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8176951447137413"
      data-ad-slot="2762441159"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
