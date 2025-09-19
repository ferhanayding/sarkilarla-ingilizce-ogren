"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { SongLite } from "@/types/songs";

import SearchBar from "../searchbar";
import EmptyState from "../empty-state";
import SongCard from "../song-card";
import SongListRows from "../song-table";
import { useIsSmUp } from "@/app/hooks/useIsSmUp";
import { useSongs } from "@/app/action/songs";
import { CardGridSkeleton } from "../ui/loading";
import { ListSkeleton } from "../icons/list-skeleton";
import Tabs from "./tabs";

type ViewMode = "grid" | "list";
const PAGE = 15;

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

  const [offset, setOffset] = useState(0);
  const {
    items,
    count: soundsCount,
    isLoading,
    hasMore,
  } = useSongs(q, PAGE, offset);

  const [list, setList] = useState<SongLite[]>([]);

  useEffect(() => {
    setOffset(0);
    setList([]);
  }, [q]);

  const sameBySlug = (a: SongLite[] = [], b: SongLite[] = []) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++)
      if (a[i].slug !== b[i].slug) return false;
    return true;
  };
  useEffect(() => {
    if (!items) return;
    setList((prev) => {
      if (offset === 0) {
        return sameBySlug(prev, items) ? prev : items;
      }
      const seen = new Set(prev.map((x) => x.slug));
      const toAdd = items.filter((it) => !seen.has(it.slug));
      return toAdd.length ? [...prev, ...toAdd] : prev;
    });
  }, [items, offset]);

  const ioRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
      if (!node) return;

      ioRef.current = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e.isIntersecting && !isLoading && hasMore) {
            setOffset((p) => p + PAGE);
          }
        },
        {
          root: null,
          threshold: 0,
          rootMargin: "600px 0px",
        }
      );
      ioRef.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const onScroll = () => {
      if (isLoading || !hasMore) return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewport = window.innerHeight;
      const full = document.documentElement.scrollHeight;
      if (scrollY + viewport + 800 >= full) {
        setOffset((p) => p + PAGE);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading, hasMore]);

  const showingGrid = view === "grid" && twoCols;
  const firstLoad = isLoading && offset === 0;
  const count = firstLoad ? 0 : list.length;
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[rgb(24,35,50)]">
      <section className="mx-auto max-w-6xl px-4 pt-8 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="sm:flex sm:items-center sm:justify-between text-center sm:text-left self-center sm:self-auto w-full">
            <p className="opacity-70 text-sm sm:text-base text-white/100">
              • İngilizce şarkılar • Türkçe okunuş • Türkçe anlam
            </p>

            {twoCols && (
              <Tabs setView={setView} view={view} count={soundsCount} />
            )}
          </div>
        </div>

        <div className="mt-4">
          <SearchBar value={q} onChange={setQ} count={count} />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {firstLoad ? (
          showingGrid ? (
            <CardGridSkeleton />
          ) : (
            <ListSkeleton />
          )
        ) : list.length === 0 ? (
          <EmptyState query={q} />
        ) : showingGrid ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((s) => (
                <SongCard key={s.slug} song={s} />
              ))}
            </div>

            {/* sentinel */}
            <div ref={sentinelRef} className="h-10" />
            {isLoading && hasMore && (
              <div className="mt-6 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
              </div>
            )}
          </>
        ) : (
          <>
            <SongListRows songs={list} />
            <div ref={sentinelRef} className="h-10" />
            {isLoading && hasMore && (
              <div className="mt-6 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
