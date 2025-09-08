// app/components/SongCard.tsx
"use client";

import Link from "next/link";
import { tagStyleFor } from "@/lib/ui/tag-styles";
import { Song } from "@/types/songs";
import { ArrowRightIcon } from "../icons/arrow-right";

export default function SongCard({ song }: { song: Song }) {
  return (
    <Link
      href={`/song/${song.slug}`}
      className="group relative rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
    >
      {/* kart üst gradient çerçeve */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-indigo-300 via-rose-300 to-amber-300 opacity-60" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight group-hover:underline decoration-indigo-400/60">
            {song.title}
          </h3>
          <span className="rounded-full border px-2 py-0.5 text-[11px] opacity-70">
            Şarkı
          </span>
        </div>
        <p className="mt-1 text-sm opacity-70">{song.artist}</p>

        {song.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {song.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className={`text-xs rounded-full border px-2 py-1 transition ${tagStyleFor(
                  t
                )}`}
              >
                #{t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex items-center gap-2 text-xs opacity-60">
          <span>Detayları gör</span>
        <ArrowRightIcon size={10} className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
