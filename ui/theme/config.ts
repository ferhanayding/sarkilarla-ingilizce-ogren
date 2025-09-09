// ui/theme.config.ts
import type { CSSProperties } from "react";

export const tokens = {
  brand: "#0F1C2E",       // ana renk (steel navy)
  foreground: "#FFFFFF",  // metin
  accent: "#2563EB",      // CTA mavi
} as const;

// küçük yardımcı: #rrggbb | #rgb -> "r g b"
function hexToRgbTriplet(hex: string): string {
  const h = hex.replace("#", "");
  const to255 = (s: string) => parseInt(s.length === 1 ? s + s : s, 16);
  const r = to255(h.length === 3 ? h[0] : h.slice(0, 2));
  const g = to255(h.length === 3 ? h[1] : h.slice(2, 4));
  const b = to255(h.length === 3 ? h[2] : h.slice(4, 6));
  return `${r} ${g} ${b}`;
}

export function themeStyleFrom(t = tokens): CSSProperties {
  return {
    ["--brand" as any]: hexToRgbTriplet(t.brand),
    ["--brand-foreground" as any]: hexToRgbTriplet(t.foreground),
    ["--accent" as any]: hexToRgbTriplet(t.accent),
  } as CSSProperties;
}

// çoğu yerde bu yeterli
export const themeStyle = themeStyleFrom(tokens);
