"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notFound, useParams } from "next/navigation";
import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeProps } from "react-youtube";
import { useSong } from "@/app/action/song";
import { SongType } from "@/types/songs";
import { SongDetailSkeleton } from "@/app/components/song-detail/skeleton";
import { ErrorState } from "@/app/components/song-detail/error";
import { SegBtn } from "@/app/components/song-detail/seg-button";
import { formatTime, toSecondsOrNull } from "@/lib/ui";
import { Button } from "@/app/components/ui/button";

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

export default function SongDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { song, isLoading, error, mutate } = useSong(slug);

  if (isLoading) return <SongDetailSkeleton />;
  if (error)
    return (
      <ErrorState
        message={String((error as any)?.message || error)}
        onRetry={() => mutate?.()}
      />
    );
  if (!song) return notFound();

  return <SongDetail song={song as SongType} />;
}

function SongDetail({ song }: { song: SongType }) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [sec, setSec] = useState(0);
  const [view, setView] = useState<ViewMode>("full");
  const [autoplay, setAutoplay] = useState(true);

  const timedIdxs = useMemo(() => {
    const arr: { i: number; t: number }[] = [];
    song.lines.forEach((ln: Line, i) => {
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
    if (!autoplay) {
      try {
        e.target.pauseVideo?.();
      } catch {}
    }
  };

  const seekTo = (t: string | null) => {
    const s = toSecondsOrNull(t);
    if (s != null) {
      playerRef.current?.seekTo?.(s, true);
      setSec(s);
    }
  };

  const showVideo = view !== "phFocus";

  return (
    <main className="min-h-dvh bg-brand3 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          <header className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:px-7 sm:py-3 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  {song.title}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-white/80">
                  {song.artist}
                </p>
              </div>

              <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
                <SegBtn
                  active={view === "full"}
                  onClick={() => setView("full")}
                  label="Tümü"
                />
                <SegBtn
                  active={view === "phOnly"}
                  onClick={() => setView("phOnly")}
                  label="Sadece Ph"
                />
                <SegBtn
                  active={view === "phFocus"}
                  onClick={() => setView("phFocus")}
                  label="Ph Odak"
                />
              </div>

              <Button
                onClick={() => {
                  setAutoplay((a) => {
                    const nxt = !a;
                    if (!nxt) {
                      try {
                        playerRef.current?.pauseVideo?.();
                      } catch {}
                    }
                    return nxt;
                  });
                }}
                className={[
                  "h-9 px-3 rounded-lg text-sm border transition",
                  autoplay
                    ? "border-emerald-400/50 bg-emerald-500/15"
                    : "border-white/15 bg-white/5 hover:bg-white/10",
                ].join(" ")}
                title="Otomatik oynatma"
              >
                Autoplay: {autoplay ? "Açık" : "Kapalı"}
              </Button>
            </div>
          </header>

          {view === "phFocus" ? (
            <section className="max-w-4xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                <div className="h-[66vh] sm:h-[72vh] lg:h-[calc(100dvh-340px)] overflow-auto px-1 lyricsScroll">
                  {song.lines.map((ln, i) => (
                    <div
                      key={i}
                      ref={i === activeRange.start ? activeRowRef : null}
                      className={[
                        "py-2 sm:py-3 text-white/90 text-xl sm:text-2xl leading-relaxed",
                        i >= activeRange.start && i < activeRange.end
                          ? "font-extrabold drop-shadow-[0_0_14px_rgba(236,72,153,.25)]"
                          : "opacity-85",
                      ].join(" ")}
                    >
                      {ln.ph}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
              {showVideo && (
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-10 self-start">
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,.55)] aspect-video">
                    <YouTube
                      videoId={song.youtube_id}
                      opts={{
                        ...YT_OPTS,
                        playerVars: {
                          ...YT_OPTS?.playerVars,
                          autoplay: autoplay ? 1 : 0,
                        },
                      }}
                      onReady={onReady}
                      className="absolute inset-0"
                      iframeClassName="w-full h-full"
                    />
                  </div>
                  <div className="flex justify-center gap-3 text-xs sm:text-sm font-mono text-white/75">
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1">
                      ⏱ {formatTime(sec)}
                    </span>
                  </div>
                </div>
              )}

              <div className={showVideo ? "lg:col-span-7" : "lg:col-span-12"}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-2 sm:p-3 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                  <div className="h-[66vh] sm:h-[72vh] lg:h-[calc(100dvh-340px)] overflow-auto lyricsScroll">
                    {song.lines.map((ln: Line, i: number) => {
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
                              ? "bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,.12)]"
                              : "hover:bg-white/[0.04]",
                          ].join(" ")}
                        >
                          <div className="min-w-0">
                            <div className="flex items-start gap-2">
                              <span
                                className={[
                                  "mt-1 block h-4 w-1 rounded-full",
                                  isInActive
                                    ? "bg-fuchsia-400/80"
                                    : "bg-white/10",
                                ].join(" ")}
                              />
                              <p
                                className={[
                                  "tracking-wide break-words",
                                  isInActive
                                    ? "text-fuchsia-200 font-extrabold text-base sm:text-lg lg:text-2xl drop-shadow-[0_0_20px_rgba(255,0,180,.25)]"
                                    : "text-fuchsia-200/85 font-bold text-sm sm:text-base lg:text-xl",
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
                                <p className="text-[12px] sm:text-sm text-indigo-200/95 break-words">
                                  {ln.tr}
                                </p>
                              </>
                            )}
                          </div>
                          <div className="flex items-start">
                            <button
                              onClick={() => seekTo(ln.t)}
                              disabled={toSecondsOrNull(ln.t) == null}
                              className={[
                                "whitespace-nowrap tabular-nums font-mono text-[10px] sm:text-[11px] h-7 px-2 rounded-md border transition",
                                toSecondsOrNull(ln.t) == null
                                  ? "border-white/10 bg-white/5 text-white/40 cursor-not-allowed"
                                  : "border-white/15 bg-white/10 hover:bg-white/20 text-white/90",
                              ].join(" ")}
                              title={ln.t ? "Bu zamana atla" : "Zaman yok"}
                            >
                              {ln.t ?? "—"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <style jsx>{`
        .lyricsScroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.55) transparent;
        }
        .lyricsScroll::-webkit-scrollbar {
          width: 8px;
        }
        .lyricsScroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .lyricsScroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.55);
          border-radius: 9999px;
        }
        .lyricsScroll::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.85);
        }
      `}</style>
    </main>
  );
}
