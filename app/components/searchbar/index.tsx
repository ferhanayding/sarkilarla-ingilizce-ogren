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
        className={[
          "w-full rounded-2xl px-5 py-3 pr-12 outline-none shadow-sm ",
          "border border-brand-18 bg-brand3 backdrop-blur",
          "focus:ring-[0.5px] focus:ring-bg-brand3 focus:border-[rgb(var(--accent))/0.90]",
        ].join(" ")}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
        <SearchIcon size={30} />
      </div>
    </div>
  );
}
