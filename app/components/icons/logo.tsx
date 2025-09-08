"use client";

import Link from "next/link";
import LogoMark from "./logo-mark";

type Props = {
  compact?: boolean; // true: sadece ikon + kısa ad
};

export default function Logo({ compact = false }: Props) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border shadow-sm bg-white hover:shadow transition"
    >
      <div className="h-7 w-7 rounded-xl flex items-center justify-center">
        <LogoMark size={28} variant="mono"  />
      </div>
      <span className="font-extrabold tracking-tight">
        {compact ? "PK" : "ingilizce Şarkı söyle"}
      </span>
    </Link>
  );
}
