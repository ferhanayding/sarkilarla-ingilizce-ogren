// Tabs.tsx
import React, { useEffect, useRef, useState } from "react";
import { GridIcon } from "../icons/grid-icon";
import { ListIcon } from "../icons/list-icon";
import { formatNumber } from "@/lib/ui";

type TabsProps = {
  setView: (view: "grid" | "list") => void;
  view: "grid" | "list";
  count: number;
};

const base =
  "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm transition border " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-35";

function CountUp({
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

  return <span className="tabular-nums">{formatNumber(display)}</span>;
}

export default function Tabs({ setView, view, count }: TabsProps) {
  const isGrid = view === "grid";
  const isList = view === "list";

  return (
    <div
      className="flex items-center gap-2 self-end"
      role="tablist"
      aria-label="Görünüm"
    >
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
        >
          <CountUp value={count} />
        </span>
      </div>

      <button
        type="button"
        role="tab"
        aria-selected={isGrid}
        onClick={() => setView("grid")}
        title="Kart görünümü"
        className={[
          base,
          isGrid
            ? "bg-white text-[rgb(var(--brand,15_28_46))] border-white/80"
            : "bg-[rgb(var(--brand2,49_60_75))] text-white border-white/20 hover:brightness-110 cursor-pointer",
        ].join(" ")}
      >
        <GridIcon /> Kart
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={isList}
        onClick={() => setView("list")}
        title="Liste görünümü"
        className={[
          base,
          isList
            ? "bg-white text-[rgb(var(--brand,15_28_46))] border-white/80"
            : "bg-[rgb(var(--brand2,49_60_75))] text-white border-white/20 hover:brightness-110 cursor-pointer",
        ].join(" ")}
      >
        <ListIcon /> Liste
      </button>
    </div>
  );
}
