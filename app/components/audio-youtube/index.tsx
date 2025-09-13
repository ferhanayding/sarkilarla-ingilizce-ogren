import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

export default function YoutubeAudioPlayer({ videoId,
    onReady,
    playing,
    togglePlay,
    current,
    duration,
    onSeek

 }: { videoId: string,
    onReady: (event: { target: YouTubePlayer }) => void,
    playing: boolean,
    togglePlay: () => void,
    current: number,
    duration: number,
    onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void
  }) {


  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div className="">
        <YouTube
        
          videoId={videoId}
          opts={{
            
            width: "1",
            height: "1",
            playerVars: { autoplay: 1, controls: 0 },
          }}
          onReady={onReady}
        />
      </div>

      {/* Kontroller */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="px-4 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold"
        >
          {playing ? "⏸" : "▶"}
        </button>
        <span className="text-xs font-mono text-white/80">
          {format(current)} / {format(duration)}
        </span>
      </div>

      {/* İlerleme çubuğu */}
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={current}
        onChange={onSeek}
        className="w-full accent-fuchsia-400"
      />
    </div>
  );
}

function format(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(1, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
