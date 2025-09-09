"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notFound, useParams } from "next/navigation";
import YouTube from "react-youtube";
import type { YouTubePlayer, YouTubeProps } from "react-youtube";
import { SONGS } from "@/dummyData/songs";

type Line = { t: string | null; en: string; tr: string; ph: string };

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

type ViewMode = "full" | "phOnly" | "phFocus";

export default function SongDetailPage() {
  const params = useParams<{ slug: string }>();
  const song = useMemo(
    () => SONGS.find((s) => s.slug === params.slug),
    [params.slug]
  );
  if (!song) return notFound();
  return <SongDetail song={song} />;
}

function SongDetail({ song }: { song: (typeof SONGS)[number] }) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [sec, setSec] = useState(0);
  const [view, setView] = useState<ViewMode>("full"); // full | phOnly | phFocus
  const [autoplay, setAutoplay] = useState(true); // otomatik oynatma

  // zamanlı satırlar
  const timedIdxs = useMemo(() => {
    const arr: { i: number; t: number }[] = [];
    song.lines.forEach((ln: Line, i) => {
      const ts = toSecondsOrNull(ln.t);
      if (ts != null) arr.push({ i, t: ts });
    });
    return arr;
  }, [song.lines]);

  // aktif aralık
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

  // player zamanı poll
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const t = await playerRef.current?.getCurrentTime?.();
        if (typeof t === "number") setSec(Math.floor(t));
      } catch {}
    }, 300);
    return () => clearInterval(id);
  }, []);

  // aktif satıra scroll
  const activeRowRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (activeRange.start >= 0) {
      activeRowRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
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
  const showEN = view === "full";
  const showTR = view === "full";

  return (
    <main className="min-h-dvh bg-gradient-to-br from-[#0b0b1a] via-[#181234] to-[#2a0f3f] text-white">

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_240px]">
          <AdSlot side="left" />

          <div className="min-w-0">
            <div className="max-w-screen-xl mx-auto space-y-6">
              <header className="flex flex-col gap-3 items-center text-center">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_20px_rgba(255,0,200,0.35)]">
                    {song.title}
                  </h1>
                  <p className="mt-1 text-base sm:text-lg opacity-85">
                    {song.artist}
                  </p>
                </div>

                {/* Kontrol butonları */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      setView((v) => (v === "phOnly" ? "full" : "phOnly"))
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm border transition
                      ${
                        view === "phOnly"
                          ? "bg-fuchsia-500/20 border-fuchsia-400/60"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                    title="Sadece phonetic (EN/TR gizle)"
                  >
                    {view === "phOnly" ? "Ph Only: ON" : "Ph Only"}
                  </button>

                  <button
                    onClick={() =>
                      setView((v) => (v === "phFocus" ? "full" : "phFocus"))
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm border transition
                      ${
                        view === "phFocus"
                          ? "bg-amber-500/20 border-amber-400/60"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                    title="Her şeyi kapat; sadece phonetic"
                  >
                    {view === "phFocus" ? "Ph Focus: ON" : "Ph Focus"}
                  </button>

                  <button
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
                    className={`px-3 py-1.5 rounded-lg text-sm border transition
                      ${
                        autoplay
                          ? "bg-emerald-500/20 border-emerald-400/60"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      }`}
                    title="Otomatik oynatma"
                  >
                    Autoplay: {autoplay ? "ON" : "OFF"}
                  </button>
                </div>
              </header>

              {/* Ph Focus modunda yalnızca büyük akış */}
              {view === "phFocus" ? (
                <section className="max-w-4xl mx-auto">
                  <div className="h-[65vh] sm:h-[70vh] lg:h-[calc(100dvh-320px)] overflow-auto px-2 lyricsScroll">
                    {song.lines.map((ln, i) => (
                      <div
                        key={i}
                        ref={i === activeRange.start ? activeRowRef : null}
                        className="py-2 text-white/85 text-xl sm:text-2xl"
                      >
                        {ln.ph}
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                // Normal düzen (video + sözler)
                <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                  {/* Sol: Video (isteğe bağlı) */}
                  {showVideo && (
                    <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-10 self-start">
                      {/* responsive video kutusu */}
                      <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,.6)] aspect-video sm:aspect-[16/9]">
                        <YouTube
                          videoId={song.youtubeId}
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
                      <div className="flex justify-center gap-3 text-xs sm:text-sm font-mono text-white/85">
                        <span>⏱ {formatTime(sec)}</span>
                      </div>
                    </div>
                  )}

                  {/* Sağ: Akış metni */}
                  <div
                    className={showVideo ? "lg:col-span-7" : "lg:col-span-12"}
                  >
                    <div className="h-[65vh] sm:h-[70vh] lg:h-[calc(100dvh-320px)] overflow-auto px-2 lyricsScroll">
                      {song.lines.map((ln: Line, i: number) => {
                        const isInActive =
                          activeRange.start >= 0 &&
                          i >= activeRange.start &&
                          i < activeRange.end;
                        return (
                          <div
                            key={i}
                            ref={i === activeRange.start ? activeRowRef : null}
                            className="grid grid-cols-[1fr_auto] items-start gap-x-3 px-1 py-3"
                          >
                            {/* Sol: metin (min-w-0 = sararken butonu itmez) */}
                            <div className="min-w-0">
                              <p
                                className={[
                                  "tracking-wide break-words",
                                  isInActive
                                    ? "text-fuchsia-200 font-extrabold text-base sm:text-lg lg:text-2xl drop-shadow-[0_0_20px_rgba(255,0,180,.35)]"
                                    : "text-fuchsia-200/80 font-bold text-sm sm:text-base lg:text-xl",
                                ].join(" ")}
                              >
                                {ln.ph}
                              </p>
                              {showEN && (
                                <p className="text-xs sm:text-sm italic text-white/85 break-words">
                                  {ln.en}
                                </p>
                              )}
                              {showTR && (
                                <p className="text-xs sm:text-sm text-indigo-200 break-words">
                                  {ln.tr}
                                </p>
                              )}
                            </div>

                            {/* Sağ: zaman butonu (hep sağda, tek satır) */}
                            <div className="flex items-start">
                              <button
                                onClick={() => seekTo(ln.t)}
                                disabled={toSecondsOrNull(ln.t) == null}
                                className={[
                                  "whitespace-nowrap tabular-nums font-mono text-[10px] sm:text-[11px] h-6 px-2 rounded-md border transition",
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
                </section>
              )}
            </div>
          </div>

          {/* RIGHT AD (xl+) */}
          <AdSlot side="right" />
        </div>
      </div>

      {/* custom scrollbar */}
      <style jsx>{`
        .lyricsScroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(236, 72, 153, 0.6) transparent;
        }
        .lyricsScroll::-webkit-scrollbar {
          width: 8px;
        }
        .lyricsScroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .lyricsScroll::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.6);
          border-radius: 9999px;
        }
        .lyricsScroll::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.85);
        }
      `}</style>
    </main>
  );
}

function AdSlot({ side }: { side: "left" | "right" }) {
  return (
    <aside
      className={[
        "hidden xl:block sticky top-10 h-[calc(100dvh-80px)]",
        side === "left" ? "" : "",
      ].join(" ")}
    >
      {/* placeholder: buraya reklam script/iframe gelecek */}
      <div className="h-full w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-3 flex items-center justify-center text-center text-xs text-white/70">
        <div>
          <div className="mb-2 font-semibold">AD SLOT ({side})</div>
          <div className="opacity-70">
            Örn: 300×600, 300×250, 160×600
            <br />
            Sticky konumda durur
          </div>
        </div>
      </div>
    </aside>
  );
}

/** "m.ss" -> saniye; yoksa null */
function toSecondsOrNull(str: string | null): number | null {
  if (!str) return null;
  const m = str.match(/^(\d+)\.(\d+)$/);
  if (!m) return null;
  const min = Number(m[1]);
  const sec = Number(m[2]);
  if (Number.isNaN(min) || Number.isNaN(sec)) return null;
  return min * 60 + sec;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
