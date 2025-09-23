"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";
import type { YouTubeEvent, YouTubePlayer, YouTubeProps } from "react-youtube";
import { useSong } from "@/app/action/song";
import { SongType } from "@/types/songs";
import { SongDetailSkeleton } from "@/app/components/song-detail/skeleton";
import { ErrorState } from "@/app/components/song-detail/error";
import { SegBtn } from "@/app/components/song-detail/seg-button";
import { formatTime, toSecondsOrNull } from "@/lib/ui";
import { Button } from "@/app/components/ui/button";
import { Clock3, Maximize2, Minimize2, Pause, Play } from "lucide-react";
import { cx } from "@/lib/ui/cx";
import { chipTone } from "@/ui/theme/utils";

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
  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Bir hata oluştu.";

    return <ErrorState message={message} onRetry={() => mutate?.()} />;
  }
  if (!song) return <ErrorState message="Şarkı bulunamadı." />;

  return <SongDetail song={song as SongType} />;
}

function SongDetail({ song }: { song: SongType }) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const activeRowRef = useRef<HTMLDivElement | null>(null);
  const [sec, setSec] = useState(0);
  const [view, setView] = useState<ViewMode>("full");
  const [autoplay, setAutoplay] = useState<boolean>(true);
  const [lyricsExpanded, setLyricsExpanded] = useState(false);
  const [showTranslations, setShowTranslations] = useState(true);

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

  const activeLine = useMemo(
    () => (activeRange.start >= 0 ? song.lines[activeRange.start] : null),
    [activeRange.start, song.lines]
  );

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const t = await playerRef.current?.getCurrentTime?.();
        if (typeof t === "number") setSec(Math.floor(t));
      } catch {}
    }, 300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (activeRange.start >= 0)
      activeRowRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
  }, [activeRange.start]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (autoplay) player.playVideo?.();
      else player.pauseVideo?.();
    } catch (err) {
      console.error("Video kontrolü başarısız", err);
    }
  }, [autoplay]);

  const onReady = useCallback(
    (event: YouTubeEvent<unknown>) => {
      playerRef.current = event.target;
      try {
        if (autoplay) {
          event.target.playVideo();
        } else {
          event.target.pauseVideo();
        }
      } catch (err) {
        console.error("Oynatma hatası", err);
      }
    },
    [autoplay]
  );

  const seekTo = useCallback((t: string | null) => {
    const s = toSecondsOrNull(t);
    if (s != null) {
      playerRef.current?.seekTo?.(s, true);
      setSec(s);
    }
  }, []);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => !prev);
  }, []);

  const toggleLyricsExpanded = useCallback(() => {
    setLyricsExpanded((prev) => !prev);
  }, []);

  const toggleTranslations = useCallback(() => {
    setShowTranslations((prev) => !prev);
  }, []);

  const changeView = useCallback((mode: ViewMode) => setView(mode), []);

  const showVideo = view !== "phFocus";
  const isFullView = view === "full";
  const translationsEnabled = isFullView && showTranslations;
  const lyricWrapperClass = cx(
    lyricsExpanded
      ? null
      : "h-[66vh] sm:h-[72vh] lg:h-[calc(100dvh-340px)] overflow-auto",
    "lyricsScroll"
  );
  const activeLineTime = activeLine ? toSecondsOrNull(activeLine.t) : null;
  const activeLineFormatted =
    activeLineTime != null ? formatTime(activeLineTime) : null;

  const expandButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLyricsExpanded}
      startIcon={
        lyricsExpanded ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )
      }
      className="min-w-[150px]"
      title={lyricsExpanded ? "Daha kompakt görünüm" : "Geniş görünüm"}
    >
      {lyricsExpanded ? "Daha küçük görünüm" : "Geniş görünüm"}
    </Button>
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
                  opts={{
                    ...YT_OPTS,
                    playerVars: { ...YT_OPTS.playerVars, autoplay },
                  }}
                  onReady={onReady}
                  className="absolute inset-0"
                  iframeClassName="w-full h-full"
                />
              </div>
            </section>
          )}

          <header className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:px-7 sm:py-4 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_auto_auto] lg:items-start">
              <div className="text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {song.title}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-white/80">
                  {song.artist}
                </p>
                {song.tags?.length ? (
                  <div className="mt-3 flex flex-wrap justify-center lg:justify-start gap-1.5">
                    {song.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cx(
                          "text-xs font-medium px-2.5 py-1 rounded-full border",
                          chipTone(tag)
                        )}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="order-3 lg:order-none flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                <div className="inline-flex w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 p-1">
                  <SegBtn
                    active={view === "full"}
                    onClick={() => changeView("full")}
                    label="Tümü"
                    className="h-9 px-4 text-sm rounded-lg min-w-[84px]"
                  />
                  <SegBtn
                    active={view === "phOnly"}
                    onClick={() => changeView("phOnly")}
                    label="Sadece Ph"
                    className="h-9 px-4 text-sm rounded-lg min-w-[106px]"
                  />
                  <SegBtn
                    active={view === "phFocus"}
                    onClick={() => changeView("phFocus")}
                    label="Ph Odak"
                    className="h-9 px-4 text-sm rounded-lg min-w-[96px]"
                  />
                </div>

                {isFullView ? (
                  <Button
                    size="sm"
                    variant={showTranslations ? "brand2" : "outline"}
                    onClick={toggleTranslations}
                    className="rounded-lg"
                    aria-pressed={showTranslations}
                  >
                    Çeviri: {showTranslations ? "Açık" : "Kapalı"}
                  </Button>
                ) : null}
              </div>

              <div className="order-2 lg:order-none flex flex-col items-center gap-2 sm:flex-row sm:justify-end">
                <Button
                  onClick={toggleAutoplay}
                  className="w-full sm:w-auto"
                  variant={autoplay ? "accent" : "outline"}
                  startIcon={autoplay ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  aria-pressed={autoplay}
                >
                  Otomatik oynatma: {autoplay ? "Açık" : "Kapalı"}
                </Button>
              </div>
            </div>
          </header>

          <section className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]" aria-live="polite">
            {activeLine ? (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-white/60">
                    Şu an söylenen satır
                  </span>
                  <p className="text-lg sm:text-xl font-extrabold text-white drop-shadow-[0_0_16px_rgba(236,72,153,.3)]">
                    {activeLine.ph}
                  </p>
                  <div className="space-y-1 text-[13px] sm:text-sm text-white/85">
                    {activeLine.en ? (
                      <p className="italic break-words">{activeLine.en}</p>
                    ) : null}
                    {activeLine.tr ? (
                      <p className="text-indigo-200/95 break-words">{activeLine.tr}</p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!activeLine?.t}
                    onClick={() => seekTo(activeLine?.t ?? null)}
                    startIcon={<Clock3 className="h-4 w-4" />}
                    className="min-w-[150px]"
                  >
                    {activeLineFormatted
                      ? `${activeLineFormatted} satırına git`
                      : "Zaman bilgisi yok"}
                  </Button>
                  {expandButton}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-sm sm:text-base text-white/80">
                  <p className="font-semibold text-white/90">
                    Şarkıyı oynatmaya başladığında senkron satırlar vurgulanır.
                  </p>
                  <p>
                    Her satırın yanındaki zaman etiketlerine tıklayarak istediğin bölüme atlayabilirsin.
                  </p>
                </div>
                {expandButton}
              </div>
            )}
          </section>

          {view === "phFocus" ? (
            <section className="max-w-6xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                <div className={cx(lyricWrapperClass, "px-1 space-y-2 sm:space-y-3")}
                >
                  {song.lines.map((ln, i) => {
                    const isActive =
                      activeRange.start >= 0 &&
                      i >= activeRange.start &&
                      i < activeRange.end;
                    return (
                      <div
                        key={i}
                        ref={i === activeRange.start ? activeRowRef : null}
                        className={cx(
                          "py-2 sm:py-3 text-white/90 text-xl sm:text-2xl leading-relaxed transition", 
                          isActive
                            ? "font-extrabold drop-shadow-[0_0_18px_rgba(236,72,153,.35)]"
                            : "opacity-85"
                        )}
                      >
                        {ln.ph}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          ) : (
            <section>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-2 sm:p-3 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                <div className={cx(lyricWrapperClass, "space-y-2")}
                >
                  {song.lines.map((ln: Line, i: number) => {
                    const isActive =
                      activeRange.start >= 0 &&
                      i >= activeRange.start &&
                      i < activeRange.end;
                    const timestamp = toSecondsOrNull(ln.t);
                    const activePhClass = view === "phOnly"
                      ? "text-fuchsia-300 font-extrabold text-lg sm:text-xl lg:text-2xl drop-shadow-[0_0_20px_rgba(255,0,180,.25)]"
                      : "text-fuchsia-300 font-extrabold text-base sm:text-lg lg:text-2xl drop-shadow-[0_0_20px_rgba(255,0,180,.25)]";
                    const inactivePhClass = view === "phOnly"
                      ? "text-fuchsia-200/90 font-semibold text-base sm:text-lg lg:text-xl"
                      : "text-fuchsia-200/85 font-bold text-sm sm:text-base lg:text-xl";

                    return (
                      <div
                        key={i}
                        ref={i === activeRange.start ? activeRowRef : null}
                        className={cx(
                          "rounded-xl px-3 sm:px-4 py-3 sm:py-3.5 transition",
                          isActive
                            ? "bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,.12)]"
                            : "hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex flex-col items-center gap-2 pt-1">
                            <span
                              className={cx(
                                "block h-4 w-1 rounded-full",
                                isActive
                                  ? "bg-fuchsia-400/80"
                                  : "bg-white/10"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => seekTo(ln.t)}
                              disabled={timestamp == null}
                              className={cx(
                                "flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] sm:text-xs font-medium transition",
                                "border-white/20 bg-white/10 text-white/80 hover:bg-white/15",
                                isActive &&
                                  "border-fuchsia-400/70 text-fuchsia-100 shadow-[0_0_18px_rgba(236,72,153,.25)]",
                                timestamp == null &&
                                  "opacity-55 cursor-not-allowed hover:bg-white/10"
                              )}
                              title={
                                timestamp != null
                                  ? "Bu satıra git"
                                  : "Zaman etiketi yok"
                              }
                            >
                              <Clock3 className="h-3.5 w-3.5" />
                              <span>{timestamp != null ? formatTime(timestamp) : "--:--"}</span>
                            </button>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p
                              className={cx(
                                "tracking-wide break-words transition-colors",
                                isActive ? activePhClass : inactivePhClass
                              )}
                            >
                              {ln.ph}
                            </p>

                            {translationsEnabled ? (
                              <div className="mt-1 space-y-0.5 text-[12px] sm:text-sm">
                                {ln.en ? (
                                  <p className="italic text-white/85 break-words">
                                    {ln.en}
                                  </p>
                                ) : null}
                                {ln.tr ? (
                                  <p className="text-indigo-200/95 break-words">
                                    {ln.tr}
                                  </p>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
