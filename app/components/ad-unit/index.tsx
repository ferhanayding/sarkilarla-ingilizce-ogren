"use client";
import { useEffect, useRef, useState } from "react";

export default function AdUnit() {
  const pushedRef = useRef(false);
  useEffect(() => {
    if (pushedRef.current) return;
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {}
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8176951447137413"
      data-ad-slot="2762441159"
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-adtest="on"
    />
  );
}
