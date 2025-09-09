"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Song } from "@/types/songs";

import SearchBar from "../searchbar";
import EmptyState from "../empty-state";
import SongCard from "../song-card";
import SongListRows from "../song-table";

type ViewMode = "grid" | "list";

export default function HomeClient({ songs }: { songs: Song[] }) {
  const [q, setQ] = useState("");
  const [_userEmail, setUserEmail] = useState<string | null>(null);
  const [_checking, setChecking] = useState(true);
  const [view, setView] = useState<ViewMode>("grid"); // 👈 toggle state

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserEmail(data.user?.email ?? null);
      setChecking(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return songs;
    return songs.filter((s) => {
      const hay = [s.title, s.artist, s.slug, ...(s.tags ?? [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [q, songs]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-brand3">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        {/* başlık + toggle üst sağ */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--brand,15_28_46))]">
              şarkılarlaİngilizceÖğreniyorum.COM
            </h1>
            <p className="opacity-70">İngilizce şarkılar • Türkçe okunuş • Türkçe anlam</p>
          </div>

          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              title="Kart görünümü"
              className={[
                "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm transition cursor-pointer border",
                view === "grid"
                  ? "text-white bg-[rgb(var(--brand2,49_60_75))] border-white/20"
                  : "text-[rgb(var(--brand,15_28_46))] bg-white/70 hover:bg-white/90 border-[rgb(var(--brand2,49_60_75))/0.18]",
              ].join(" ")}
            >
              <GridIcon /> Kart
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              title="Liste görünümü"
              className={[
                "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm transition cursor-pointer border",
                view === "list"
                  ? "text-white bg-[rgb(var(--brand2,49_60_75))] border-white/20"
                  : "text-[rgb(var(--brand,15_28_46))] bg-white/70 hover:bg-white/90 border-[rgb(var(--brand2,49_60_75))/0.18]",
              ].join(" ")}
            >
              <ListIcon /> Liste
            </button>
          </div>
        </div>

        <div className="mt-4">
          <SearchBar value={q} onChange={setQ} count={filtered.length} />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {filtered.length === 0 ? (
          <EmptyState query={q} />
        ) : view === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SongCard key={s.slug} song={s} />
            ))}
          </div>
        ) : (
          <SongListRows songs={filtered} />
        )}
      </main>
    </div>
  );
}

/* ikonlar */
function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...props}>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" fill="currentColor" />
    </svg>
  );
}
function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...props}>
      <path d="M4 6h16v3H4zm0 5h16v3H4zm0 5h16v3H4z" fill="currentColor" />
    </svg>
  );
}
