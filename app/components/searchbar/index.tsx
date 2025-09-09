"use client";

import { useIsSmUp } from "@/app/hooks/useIsSmUp";
import { SearchIcon } from "../icons/search";

type Props = {
  value: string;
  onChange: (v: string) => void;
  count: number;
};

export default function SearchBar({ value, onChange, count }: Props) {
  const isSmUp = useIsSmUp();

  // boyut preset'leri
  const inputSize = isSmUp
    ? "h-11 px-5 pr-12 text-[15px]"   // sm ve üstü
    : "h-9  px-4 pr-10 text-[14px]";  // mobil

  const iconSize = isSmUp ? 26 : 20;

  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Şarkı veya sanatçı ara…"
        aria-label="Şarkı ara"
        className={[
          "w-full rounded-2xl outline-none shadow-sm",
          inputSize,
          "border border-brand-18 bg-brand4 backdrop-blur",
          "focus:ring-[0.5px] focus:ring-bg-brand3 focus:border-[rgb(var(--accent))/0.90]",
        ].join(" ")}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
        <SearchIcon size={iconSize} />
      </div>
    </div>
  );
}
