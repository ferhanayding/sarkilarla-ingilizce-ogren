// ui/theme.config.ts

export const tokens = {
  brand:   "#0F1C2E",
  brand2:  "#313C4B",     // ✅ yeni ikinci renk
  brand3:"#182332",
  brand4:"#EEF2F6",
  foreground: "#FFFFFF",
  accent:  "#2563EB",
} as const;

export const themeStyle = {
  ["--brand" as any]:  "15 28 46",
  ["--brand2" as any]: "49 60 75",   // ✅
  ["--brand3" as any]: "24 35 50",
  ["--brand4" as any]: "238 242 246",
  ["--brand-foreground" as any]: "255 255 255",
  ["--accent" as any]: "37 99 235",

} as const;
// ui/theme.config.ts

