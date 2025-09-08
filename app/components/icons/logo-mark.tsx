"use client";

import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  size?: number;
  /** 'solid' (gradient zemin), 'outline' (sadece çizgiler), 'mono' (currentColor tek renk) */
  variant?: "solid" | "outline" | "mono";
};

export default function LogoMark({
  size = 28,
  variant = "solid",
  className,
  ...rest
}: Props) {
  const gid = React.useId(); // gradient id çakışmasın

  if (variant === "mono") {
    // Tek renk (currentColor). Koyu/renkli zeminlerde ideal.
    return (
      <div
      className="inline-flex items-center gap-2 rounded-2xl  border shadow-sm bg-white hover:shadow transition"
      >

      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        {...rest}
        >
        {/* dış çerçeve */}
        <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" />
        {/* fonetik slash'lar */}
        <path d="M8 7l-2.5 10M14 7l-2.5 10" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
        {/* mikrofon kapsülü */}
        <rect x="15.4" y="8.5" width="3.4" height="6.2" rx="1.7" fill="#fff" />
        {/* mic gövde */}
        <path d="M17.1 14.7v1.6c0 1.6-1.3 2.7-3 2.7h-3.2" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
      </svg>
        </div>
    );
  }

  if (variant === "outline") {
    // Sadece çizgiler (zeminsiz). Açık zeminlerde çok temiz durur.
    return (
      <div
        className="inline-flex items-center gap-2 rounded-2xl  border shadow-sm bg-white hover:shadow transition"
      >

      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        {...rest}
        >
        <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <path d="M8 7l-2.5 10M14 7l-2.5 10" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
        <rect x="15.4" y="8.5" width="3.4" height="6.2" rx="1.7" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <path d="M17.1 14.7v1.6c0 1.6-1.3 2.7-3 2.7h-3.2" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      </svg>
        </div>
    );
  }

  // default: 'solid' — gradient zemin + beyaz glyph
  return (
    <div   className="inline-flex items-center gap-2 rounded-2xl  border shadow-sm bg-white hover:shadow transition" >

    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      {...rest}
      >
      <defs>
        <linearGradient id={`pk-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4f46e5" />   {/* indigo-600 */}
          <stop offset="70%" stopColor="#ec4899" />  {/* pink-500/rose-500 */}
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill={`url(#pk-${gid})`} />
      <path d="M8 7l-2.5 10M14 7l-2.5 10" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
      <rect x="15.4" y="8.5" width="3.4" height="6.2" rx="1.7" fill="#fff" />
      <path d="M17.1 14.7v1.6c0 1.6-1.3 2.7-3 2.7h-3.2" stroke="#fff" strokeWidth={1.9} strokeLinecap="round" />
    </svg>
      </div>
  );
}
