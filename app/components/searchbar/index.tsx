// app/components/SearchBar.tsx
"use client";

import { SearchIcon } from "../icons/search";

type Props = {
  value: string;
  onChange: (v: string) => void;
  count: number;
};

export default function SearchBar({ value, onChange, count }: Props) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Şarkı veya sanatçı ara…"
        aria-label="Şarkı ara"
        className="w-full rounded-2xl border border-slate-200/70 px-5 py-3 pr-12 outline-none shadow-sm bg-white/90 backdrop-blur focus:ring-4 focus:ring-indigo-200/50"
      />
      <div className="absolute right-3 top-[34%] -translate-y-[50%] pointer-events-none opacity-60">
        <SearchIcon size={26} />
      </div>
      <div className="mt-2 text-sm opacity-60">{count} sonuç</div>
    </div>
  );
}
