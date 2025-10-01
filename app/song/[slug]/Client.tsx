"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeProps } from "react-youtube";
import { useSong } from "@/app/action/song";
import { SongType } from "@/types/songs";
import { SongDetailSkeleton } from "@/app/components/song-detail/skeleton";
import { ErrorState } from "@/app/components/song-detail/error";
import { SegBtn } from "@/app/components/song-detail/seg-button";
import { toSecondsOrNull } from "@/lib/ui";
import { Button } from "@/app/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

type Line = { t: string | null; en: string; tr: string; ph: string };
type ViewMode = "full" | "phOnly" | "phFocus";

const YT_OPTS: YouTubeProps["opts"] = {
  width: "100%",
  height: "100%",
  playerVars: {
    autoplay: 0,
    controls: 1,
    rel: 0,
    modestbranding: 1,
    playsinline: 1,
  },
};

export default function Client({ slug }: { slug: string }) {
  const { song, isLoading, error, mutate } = useSong(slug);

  if (isLoading) return <SongDetailSkeleton />;
  if (error)
    return (
      <ErrorState
        message={String((error as any)?.message || error)}
        onRetry={() => mutate?.()}
      />
    );
  if (!song) return <ErrorState message="Şarkı bulunamadı." />;

  return <SongDetail song={song as SongType} />;
}

function SongDetail({ song }: { song: SongType }) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [sec, setSec] = useState(0);
  const [view, setView] = useState<ViewMode>("full");
  const [lyricsExpanded, setLyricsExpanded] = useState(false);

  const totalSeconds = useMemo(() => {
    let last = 0;
    for (const ln of song.lines as Line[]) {
      const s = toSecondsOrNull(ln.t);
      if (s != null) last = Math.max(last, s);
    }
    return last;
  }, [song.lines]);

  const mm = String(Math.floor(totalSeconds / 60)).padStart(1, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const durationTxt = `${mm}:${ss}`;

  const timedIdxs = useMemo(() => {
    const arr: { i: number; t: number }[] = [];
    (song.lines as Line[]).forEach((ln, i) => {
      const ts = toSecondsOrNull(ln.t);
      if (ts != null) arr.push({ i, t: ts });
    });
    return arr;
  }, [song.lines]);

  const activeRange = useMemo(() => {
    if (timedIdxs.length === 0) return { start: -1, end: -1 };
    let k = -1;
    for (let j = 0; j < timedIdxs.length; j++) {
      if (timedIdxs[j].t <= sec) k = j;
      else break;
    }
    if (k === -1) return { start: -1, end: timedIdxs[0].i };
    const start = timedIdxs[k].i;
    const end = timedIdxs[k + 1]?.i ?? song.lines.length;
    return { start, end };
  }, [sec, timedIdxs, song.lines.length]);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const t = await playerRef.current?.getCurrentTime?.();
        if (typeof t === "number") setSec(Math.floor(t));
      } catch {}
    }, 300);
    return () => clearInterval(id);
  }, []);

  const activeRowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (activeRange.start >= 0)
      activeRowRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, [activeRange.start]);

  const onReady = (e: any) => {
    playerRef.current = e.target;
  };

  const showVideo = view !== "phFocus";

  const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/85">
      {children}
    </span>
  );

  return (
    <main className="min-h-dvh bg-brand3 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          {showVideo && (
            <section className="relative w-full mx-auto md:w-3/4 lg:w-1/2 rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,.55)]">
              <div className="relative w-full mx-auto aspect-video">
                <YouTube
                  videoId={song.youtube_id}
                  opts={YT_OPTS}
                  onReady={onReady}
                  className="absolute inset-0"
                  iframeClassName="w-full h-full"
                />
              </div>
            </section>
          )}

          <header className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:px-7 sm:py-4 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {song.title}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-white/80">
                  {song.artist}
                </p>
              </div>

              <div className="justify-self-center">
                <div className="inline-flex w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 p-1">
                  <SegBtn
                    active={view === "full"}
                    onClick={() => setView("full")}
                    label="Full"
                    className="h-9 px-4 text-sm rounded-lg min-w-[80px]"
                  />
                  <SegBtn
                    active={view === "phOnly"}
                    onClick={() => setView("phOnly")}
                    label="Ph only"
                    className="h-9 px-4 text-sm rounded-lg min-w-[94px]"
                  />
                  <SegBtn
                    active={view === "phFocus"}
                    onClick={() => setView("phFocus")}
                    label="Ph focus"
                    className="h-9 px-4 text-sm rounded-lg min-w-[94px]"
                  />
                </div>
              </div>

              <div className="justify-self-center lg:justify-self-end">
                <div className="flex flex-wrap items-center gap-2">
                  {(song.tags ?? []).map((t) => (
                    <Chip key={t}>#{t}</Chip>
                  ))}
                  {Array.isArray(song.tags) &&
                    song.tags.find((t) => /^\d{4}$/.test(t)) && (
                      <Chip>{song.tags.find((t) => /^\d{4}$/.test(t))}</Chip>
                    )}
                  <Chip>⏱ {durationTxt}</Chip>
                </div>
              </div>
            </div>
          </header>

          {view === "phFocus" ? (
            <section className="max-w-6xl mx-auto">
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                <div
                  className={[
                    lyricsExpanded
                      ? ""
                      : "h-[66vh] sm:h-[72vh] lg:h-[calc(100dvh-340px)] overflow-auto",
                    "px-1 lyricsScroll",
                  ].join(" ")}
                >
                  {(song.lines as Line[]).map((ln, i) => (
                    <div
                      key={i}
                      ref={i === activeRange.start ? activeRowRef : null}
                      className={[
                        "py-2 sm:py-3 text-white/95 text-xl sm:text-2xl leading-relaxed",
                        i >= activeRange.start && i < activeRange.end
                          ? "font-extrabold drop-shadow-[0_0_14px_rgba(255,255,255,.25)]"
                          : "opacity-85",
                      ].join(" ")}
                    >
                      {ln.ph}
                    </div>
                  ))}
                </div>

                <Button
                  startIcon={
                    lyricsExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )
                  }
                  onClick={() => setLyricsExpanded((v) => !v)}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 text-white/90 px-2.5 py-1.5 text-xs sm:text-sm transition"
                  title={lyricsExpanded ? "Küçült" : "Büyüt"}
                  aria-label={lyricsExpanded ? "Küçült" : "Büyüt"}
                >
                  <span className="hidden sm:inline">
                    {lyricsExpanded ? "Küçült" : "Büyüt"}
                  </span>
                </Button>
              </div>
            </section>
          ) : (
            <section>
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-2 sm:p-3 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                <div
                  className={[
                    lyricsExpanded
                      ? ""
                      : "h-[66vh] sm:h-[72vh] lg:h-[calc(100dvh-340px)] overflow-auto",
                    "lyricsScroll",
                  ].join(" ")}
                >
                  {(song.lines as Line[]).map((ln, i) => {
                    const isInActive =
                      activeRange.start >= 0 &&
                      i >= activeRange.start &&
                      i < activeRange.end;

                    return (
                      <div
                        key={i}
                        ref={i === activeRange.start ? activeRowRef : null}
                        className={[
                          "grid grid-cols-[1fr_auto] items-start gap-x-3 rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 transition",
                          isInActive
                            ? "bg-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,.12)]"
                            : "hover:bg-white/[0.05]",
                        ].join(" ")}
                      >
                        <div className="min-w-0">
                          <div className="flex items-start gap-2">
                            <span
                              className={[
                                "mt-1 block h-4 w-1 rounded-full",
                                isInActive ? "bg-white" : "bg-white/20",
                              ].join(" ")}
                            />
                            <p
                              className={[
                                "tracking-wide break-words",
                                isInActive
                                  ? "text-white font-extrabold text-base sm:text-lg lg:text-2xl drop-shadow-[0_0_20px_rgba(255,255,255,.25)]"
                                  : "text-white/85 font-bold text-sm sm:text-base lg:text-xl",
                              ].join(" ")}
                            >
                              {ln.ph}
                            </p>
                          </div>

                          {view === "full" && (
                            <>
                              <p className="mt-1 text-[12px] sm:text-sm italic text-white/85 break-words">
                                {ln.en}
                              </p>
                              <p className="text-[12px] sm:text-sm text-white/85/95 break-words">
                                {ln.tr}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  startIcon={
                    lyricsExpanded ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )
                  }
                  onClick={() => setLyricsExpanded((v) => !v)}
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 hover:bg-white/15 text-white/90 px-2.5 py-1.5 text-xs sm:text-sm transition"
                  title={lyricsExpanded ? "Küçült" : "Büyüt"}
                  aria-label={lyricsExpanded ? "Küçült" : "Büyüt"}
                >
                  <span className="hidden sm:inline">
                    {lyricsExpanded ? "Küçült" : "Büyüt"}
                  </span>
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx>{`
        .lyricsScroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.55) transparent;
        }
        .lyricsScroll::-webkit-scrollbar {
          width: 8px;
        }
        .lyricsScroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .lyricsScroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.55);
          border-radius: 9999px;
        }
        .lyricsScroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.85);
        }
      `}</style>
    </main>
  );
}
