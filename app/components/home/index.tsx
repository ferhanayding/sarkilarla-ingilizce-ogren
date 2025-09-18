"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/client";
import { SongLite } from "@/types/songs";

import SearchBar from "../searchbar";
import EmptyState from "../empty-state";
import SongCard from "../song-card";
import SongListRows from "../song-table";
import { useIsSmUp } from "@/app/hooks/useIsSmUp";
import { useSongs } from "@/app/action/songs";
import { CardGridSkeleton, FullScreenLoader } from "../ui/loading";
import { ListSkeleton } from "../icons/list-skeleton";
import { GridIcon } from "../icons/grid-icon";
import { ListIcon } from "../icons/list-icon";
import AdUnit from "../ad-unit";
import AdBanner728x90 from "../ad-unit";

type ViewMode = "grid" | "list";

export default function HomeClient() {
  const [q, setQ] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const twoCols = useIsSmUp();

  const [_userEmail, setUserEmail] = useState<string | null>(null);
  const [_checking, setChecking] = useState(true);
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

  const { items, isLoading } = useSongs(q, 50, 0);

  const data: SongLite[] = useMemo(() => {
    if (items && items.length > 0) return items;
    if (!isLoading && q) return [];
    return items;
  }, [items, isLoading, q]);

  const showingGrid = view === "grid" && twoCols;
  const count = isLoading ? 0 : data.length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[rgb(24,35,50)]">
            <AdBanner728x90   />

      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="sm:flex sm:items-center sm:justify-between text-center sm:text-left self-center sm:self-auto w-full">
            <p className="opacity-70 text-sm sm:text-base text-white/100">
              • İngilizce şarkılar • Türkçe okunuş • Türkçe anlam 
            </p>

            {twoCols && (
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
            )}
          </div>
        </div>

        <div className="mt-4">
          <SearchBar value={q} onChange={setQ} count={count} />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {isLoading ? (
          showingGrid ? (
            <CardGridSkeleton />
          ) : (
            <ListSkeleton />
          )
        ) : data.length === 0 ? (
          <EmptyState query={q} />
        ) : showingGrid ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((s) => (
              <SongCard key={s.slug} song={s} />
            ))}
          </div>
        ) : (
          <SongListRows songs={data} />
        )}
      </main>
      
    </div>
  );
}
