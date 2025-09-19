"use client";

import Link from "next/link";
import { SongLite } from "@/types/songs";
import { ArrowRightIcon } from "../icons/arrow-right";
import { chipTone } from "@/ui/theme/utils";
import AngledShell from "../angled-shell";
import { Tooltip } from "../tooltip";

export default function SongCard({ song }: { song: SongLite }) {
  const has = song.hasTimestamps;

  return (
    <AngledShell
      className={[
        "group relative rounded-2xl overflow-hidden transition",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-35",
      ].join(" ")}
      height={165}
      rise={10}
      tail={50}
      underFill={"rgb(var(--brand2)/0.50)"}
    >
      <Link
        href={`/song/${song.slug}`}
        className="block h-full focus:outline-none"
      >
        <div className="absolute inset-x-0 -top-px h-px bg-white/10" />
        <div className="p-4 text-white">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-semibold leading-tight group-hover:underline decoration-white/40 flex items-center ">
              {song.title}
            </h3>
            <div className="relative ">
              {song.hasTimestamps ? (
                <Tooltip content="Senkron sözler hazır" placement="bottom">
                  <button className="h-8 w-8 grid place-items-center rounded-full bg-white/10 text-success">
                    ✓
                  </button>
                </Tooltip>
              ) : (
                <Tooltip content="Senkron söz yok" placement="bottom">
                  <button className="h-8 w-8 grid place-items-center rounded-full bg-white/10 text-warning">
                    ✗
                  </button>
                </Tooltip>
              )}
            </div>
          </div>

          <p className="text-sm text-white/70">{song.artist}</p>
          {song.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {song.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className={`text-xs rounded-full px-2 py-1 border transition ${chipTone(
                    t
                  )}`}
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
            <span>Detayları gör</span>
            <ArrowRightIcon
              size={10}
              className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-white"
            />
          </div>
        </div>
      </Link>

      <style jsx>{`
        .group:hover svg path[stroke] {
          stroke: rgba(255, 255, 255, 0.18);
        }
      `}</style>
    </AngledShell>
  );
}
