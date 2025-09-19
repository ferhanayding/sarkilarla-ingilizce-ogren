import { formatNumber } from "@/lib/ui";
import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  duration = 500,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = display;
    fromRef.current = from;
    startRef.current = null;

    const step = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min((t - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(from + (value - from) * eased);
      setDisplay(current);
      if (p < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div
      className="inline-flex items-center gap-2 h-9 rounded-full border border-black/10
                      backdrop-blur px-3 text-sm shadow-sm
                    text-white transition"
      title="Toplam şarkı"
    >
      <span className="text-white/60">Toplam</span>
      <span
        className="font-semibold text-white/80 tabular-nums
                       animate-[fadeIn_.2s_ease] select-none"
      ></span>{" "}
      <span className="tabular-nums">{formatNumber(display)}</span>
    </div>
  );
}
