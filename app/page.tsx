"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SONGS } from "@/dummyData/songs";

export default function HomePage() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return SONGS;
    return SONGS.filter(s => {
      const hay = [
        s.title, s.artist, s.slug,
        ...(s.tags ?? []),
      ].join(" ").toLowerCase();
      return hay.includes(term);
    });
  }, [q]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Phonetic Karaoke 🎤</h1>
        <p className="opacity-70">İngilizce şarkılar • Türkçe okunuş • Türkçe anlam</p>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Şarkı veya sanatçı ara…"
            className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-black/10"
          />
          <span className="text-sm opacity-60 whitespace-nowrap">
            {filtered.length} sonuç
          </span>
        </div>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s:any) => (
          <Link
            key={s.slug}
            href={`/song/${s.slug}`}
            className="rounded-xl border p-4 hover:shadow-md transition group"
          >
            <h3 className="font-semibold group-hover:underline">{s.title}</h3>
            <p className="opacity-70">{s.artist}</p>
            <div className="mt-3 text-xs opacity-60">
              {s.tags?.slice(0, 3).map((t:any) => (
                <span key={t} className="mr-2">#{t}</span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
