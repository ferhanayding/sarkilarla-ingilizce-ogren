"use client";

import Link from "next/link";
import { tagStyleFor } from "@/lib/ui/tag-styles";
import { Song } from "@/types/songs";
import { ArrowRightIcon } from "../icons/arrow-right";

export default function SongCard({ song }: { song: Song }) {
  return (
    <Link
      href={`/song/${song.slug}`}
      className={[
        "group relative rounded-2xl transition cursor-pointer",
        // ✅ Topbar ile aynı: solid brand + beyaz hat
        "bg-brand2 border border-white/10",
        "shadow-sm hover:shadow-md hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-35",
      ].join(" ")}
    >
      {/* üstte ince çizgi (istersen accent yerine beyaz kullan) */}
      <div className="absolute inset-x-0 -top-px h-px bg-white/10" />

      <div className="p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-tight group-hover:underline decoration-white/40">
            {song.title}
          </h3>
          <span className="rounded-full border border-white/20 bg-white/10 text-[11px] px-2 py-0.5 text-white/90">
            Şarkı
          </span>
        </div>

        <p className="mt-1 text-sm text-white/70">{song.artist}</p>

        {song.tags?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {song.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className={`text-xs rounded-full px-2 py-1 border transition ${tagStyleFor(
                  t
                )} bg-white/10 border-white/20 text-white/90`}
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
  );
}
