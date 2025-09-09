"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Song } from "@/types/songs";
import SearchBar from "../searchbar";
import EmptyState from "../empty-state";
import SongCard from "../song-card";

export default function HomeClient({ songs }: { songs: Song[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

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
    <div className="min-h-screen relative  overflow-hidden bg-brand3">
      {/* Brand-temalı arka plan katmanları */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* temel yumuşak degrade (çok açık) */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white" />
        {/* brand tint glow (üst) */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 h-[22rem] w-[1000px] rounded-full blur-3xl opacity-70
                        bg-[radial-gradient(700px_240px_at_center,rgb(var(--brand,15_28_46))/0.10,transparent)]"
        />

        <div
          className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-60
                        bg-[radial-gradient(45%_45%_at_center,rgb(var(--accent,37_99_235))/0.18,transparent)]"
        />
        {/* ikinci tint (sağ-alt) */}
        <div
          className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full blur-3xl opacity-50
                        bg-[radial-gradient(50%_50%_at_center,rgb(var(--brand,15_28_46))/0.12,transparent)]"
        />
      </div>

      {/* HERO + ARAMA */}
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--brand,15_28_46))]">
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
