// app/HomeClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Song } from "@/types/songs";
import Topbar from "../topbar";
import SearchBar from "../searchbar";
import EmptyState from "../empty-state";
import SongCard from "../song-card";

export default function HomeClient({ songs }: { songs: Song[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  // Auth durumunu oku
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.refresh();
  }

  return (
    <div className="min-h-screen relative isolate overflow-hidden">
      {/* Renkli arka plan katmanları */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-rose-50" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[900px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(600px_200px_at_center,theme(colors.indigo.200/.6),transparent)]" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-50 bg-rose-200" />
        <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-amber-200" />
      </div>


      {/* HERO + ARAMA */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Phonetic Karaoke 🎤
            </h1>
            <p className="opacity-70">
              İngilizce şarkılar • Türkçe okunuş • Türkçe anlam
            </p>
          </div>

          <SearchBar value={q} onChange={setQ} count={filtered.length} />
        </div>
      </section>

      {/* KART GRID */}
      <main className="mx-auto max-w-6xl px-4 pb-12">
        {filtered.length === 0 ? (
          <EmptyState query={q} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <SongCard key={s.slug} song={s} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
