export function chipTone(tag: string) {
  const t = tag.toLowerCase();
  if (/(rock|metal|guitar|hard)/.test(t))
    return "bg-blue-400/15 border-blue-400/40 text-blue-100";
  if (/(pop|dance|soul|jazz)/.test(t))
    return "bg-emerald-400/15 border-emerald-400/40 text-emerald-100";
  if (/(retro|80s|90s|sad|ballad)/.test(t))
    return "bg-rose-500/15 border-rose-500/40 text-rose-100";

  const h = Array.from(t).reduce((a, c) => a + c.charCodeAt(0), 0) % 3;
  return [
    "bg-emerald-400/15 border-emerald-400/40 text-emerald-100", 
    "bg-rose-500/15 border-rose-500/40 text-rose-100", 
    "bg-blue-400/15 border-blue-400/40 text-blue-100", 
  ][h];
}