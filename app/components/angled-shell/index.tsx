// components/AngledShell.tsx
"use client";

import React, { useLayoutEffect, useRef, useState } from "react";

type Props = {
  height?: number;
  rise?: number;
  tail?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;

  /** Ölçüm tamamlanana kadar shimmer iskelet göster */
  showSkeleton?: boolean;
  /** İskelet arka plan rengi (gradient bu rengin üzerinde akar) */
  skeletonBase?: string;
  /** İskelet ek sınıfı */
  skeletonClassName?: string;

  /** Path dışı zemin rengi (opsiyonel) */
  underFill?: string;
};

export default function AngledShell({
  height = 65,
  rise = 14,
  tail = 96,
  fill = "rgb(var(--brand2))",
  stroke = "rgba(255,255,255,0.16)",
  strokeWidth = 1,
  className = "",
  children,
  showSkeleton = true,
  skeletonBase = "rgb(var(--brand2))",
  skeletonClassName = "",
  underFill = "transparent",
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => setW(el.clientWidth));
    obs.observe(el);
    setW(el.clientWidth);
    return () => obs.disconnect();
  }, []);

  const h = height;

  const d =
    w <= 0
      ? ""
      : [
          `M 0 0`,
          `H ${w}`,
          `V ${h - rise}`,
          `H ${Math.max(0, w - tail)}`,
          `L ${Math.max(0, w - tail - rise)} ${h}`,
          `H 0`,
          `Z`,
        ].join(" ");

  const ready = w > 0;

  return (
    <div ref={hostRef} className={`relative ${className}`} style={{ height }}>
      {/* SKELETON */}
      {!ready && showSkeleton && (
        <div
          className={`absolute inset-0 overflow-hidden ${skeletonClassName}`}
          style={{ background: skeletonBase }}
          aria-hidden
        >
          <div
            className="absolute inset-0 animate-shimmer
                          bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.08),transparent)]
                          bg-[length:200%_100%]"
          />
        </div>
      )}

      {/* SVG kap, ölçüm gelince görünür */}
      {ready && (
        <svg
          aria-hidden
          className="absolute inset-0 block pointer-events-none"
          width="100%"
          height="100%"
          viewBox={`0 0 ${Math.max(1, w)} ${h}`}
          preserveAspectRatio="none"
        >
          {/* Path dışı zemin boyası (sağ alttaki boşluğu kapatır) */}
          <rect
            x="0"
            y="0"
            width={Math.max(1, w)}
            height={h}
            fill={underFill}
          />
          <path d={d} fill={fill} />
          <path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="miter"
          />
        </svg>
      )}

      {/* içerik (yükseklik sabit olduğundan layout oynamaz) */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
