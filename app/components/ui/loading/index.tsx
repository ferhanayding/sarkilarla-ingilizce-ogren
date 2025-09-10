"use client";

import React from "react";

export function FullScreenLoader({ children }: { children?: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="fixed inset-0 z-[1000] grid place-items-center bg-[rgb(var(--brand3,68_78_92))] text-white"
    >
      {children ?? <DefaultSpinner />}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative rounded-2xl p-4 bg-[rgb(var(--brand2,49_60_75))] text-white overflow-hidden skeleton"
        >
          <div className="h-4 w-2/3 rounded bg-white/15" />
          <div className="h-3 w-1/3 rounded bg-white/10 mt-2" />
          <div className="flex gap-2 mt-4">
            <div className="h-6 w-16 rounded-full bg-white/10" />
            <div className="h-6 w-14 rounded-full bg-white/10" />
            <div className="h-6 w-12 rounded-full bg-white/10 hidden sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DefaultSpinner() {
  return (
    <div className="flex items-center gap-3 text-white/90">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white/90" />
      Yükleniyor…
    </div>
  );
}
