export function toSecondsOrNull(str: string | null): number | null {
  if (!str) return null;
  const m = str.match(/^(\d+)\.(\d+)$/);
  if (!m) return null;
  const min = Number(m[1]);
  const sec = Number(m[2]);
  if (Number.isNaN(min) || Number.isNaN(sec)) return null;
  return min * 60 + sec;
}

export function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}