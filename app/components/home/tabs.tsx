import React from "react";
import { GridIcon } from "../icons/grid-icon";
import { ListIcon } from "../icons/list-icon";

type TabsProps = {
  setView: (view: "grid" | "list") => void;
  view: "grid" | "list";
};

const base =
  "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm transition border " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-35";

export default function Tabs({ setView, view }: TabsProps) {
  const isGrid = view === "grid";
  const isList = view === "list";

  return (
    <div
      className="flex items-center gap-2 self-end"
      role="tablist"
      aria-label="Görünüm"
    >
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
