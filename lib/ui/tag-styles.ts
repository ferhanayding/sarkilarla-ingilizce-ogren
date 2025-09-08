
const TAG_STYLES = [
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-sky-50 text-sky-700 border-sky-200",
] as const;

export function tagStyleFor(text: string) {
  const idx =
    [...text].reduce((a, c) => a + c.charCodeAt(0), 0) % TAG_STYLES.length;
  return TAG_STYLES[idx];
}
