"use client";

import Link from "next/link";
import { SongLite } from "@/types/songs";
import { useIsSmUp } from "@/app/hooks/useIsSmUp";
import { Tooltip } from "../tooltip";

export default function SongListRows({ songs }: { songs: SongLite[] }) {
  const twoCols = useIsSmUp();

  return (
    <div className="grid sm:grid-cols-2 mx-auto">
      {songs.map((s, i) => {
        const badge = (s.artist || s.title || "A").charAt(0).toUpperCase();

        const useBrand2 = twoCols ? i % 4 < 2 : i % 2 === 0;
        const rowStyle = {
          ["--row" as any]: useBrand2 ? "49 60 75" : "68 78 92",
        };

        return (
          <Link
            key={s.slug}
            href={`/song/${s.slug}`}
            title={`${s.artist} - ${s.title}`}
            style={rowStyle}
            className={[
              "group flex items-center justify-between px-3 py-3 cursor-pointer w-full",
              "transition-colors duration-150",
              "bg-[rgb(var(--row))] hover:bg-[rgba(49,60,75,0.69)] text-white",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span className="grid place-items-center h-6 w-6 rounded-md bg-rose-600 text-white text-xs font-bold select-none">
                {badge}
              </span>

              <div className="min-w-0">
                <div className="truncate sm:text-[15px] text-[12px] font-medium">
                  {s.artist} - {s.title}
                </div>
              </div>
            </div>
            {s.hasTimestamps ? (
              <Tooltip content="Senkron sözler hazır" placement="bottom">
                <button className="h-6 w-6 grid place-items-center rounded-full bg-white/10 text-success">
                  ✓
                </button>
              </Tooltip>
            ) : (
              <Tooltip content="Senkron söz yok" placement="bottom">
                <button className="h-6 w-6 grid place-items-center rounded-full bg-white/10 text-warning">
                  ✗
                </button>
              </Tooltip>
            )}
          </Link>
        );
      })}
    </div>
  );
}
