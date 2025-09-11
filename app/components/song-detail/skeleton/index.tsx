export function SongDetailSkeleton() {
  return (
    <main className="min-h-dvh bg-brand3 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 sm:px-7 sm:py-3 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <SkeletonLine className="h-7 sm:h-8 w-52 sm:w-72 mb-2" />
                <SkeletonLine className="h-4 w-40" />
              </div>
              <div className="inline-flex gap-2 p-1 rounded-xl border border-white/10 bg-white/5">
                <SkeletonLine className="h-9 w-16 rounded-lg" />
                <SkeletonLine className="h-9 w-24 rounded-lg" />
                <SkeletonLine className="h-9 w-20 rounded-lg" />
              </div>
              <SkeletonLine className="h-9 w-28 rounded-lg" />
            </div>
          </div>

          {/* Content skeleton: video + lyrics */}
          <section className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,.55)] aspect-video">
                <SkeletonLine className="absolute inset-0 rounded-none" />
              </div>
              <div className="flex justify-center gap-3 text-xs sm:text-sm font-mono text-white/75">
                <SkeletonLine className="h-7 w-20 rounded-md" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-2 sm:p-3 shadow-[0_10px_40px_rgba(0,0,0,.45)]">
                <div className="h-[66vh] sm:h-[72vh] lg:h-[calc(100dvh-340px)] overflow-auto lyricsScroll space-y-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto] gap-3 px-3 sm:px-4 py-3 rounded-xl"
                    >
                      <div>
                        <div className="flex items-start gap-2">
                          <SkeletonLine className="h-4 w-1 rounded-full mt-1" />
                          <SkeletonLine className="h-6 sm:h-7 w-2/3" />
                        </div>
                        <SkeletonLine className="h-3 w-1/2 mt-2" />
                        <SkeletonLine className="h-3 w-2/5 mt-1" />
                      </div>
                      <SkeletonLine className="h-7 w-12 rounded-md" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* keyframes for shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
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
function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={[
        "rounded-md bg-white/10",
        "[background-image:linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.15)_50%,rgba(255,255,255,0)_100%)]",
        "bg-[length:200%_100%] ",
        className,
      ].join(" ")}
    />
  );
}
