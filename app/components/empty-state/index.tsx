"use client";

import { SearchIcon } from "../icons/search";

export default function EmptyState({ query }: { query: string }) {
  return (
    <div
      className="rounded-2xl border p-10 text-center shadow-sm backdrop-blur
                border-brand-14 bg-brand-tint-4"
    >
      <div
        className="mx-auto mb-3 h-10 w-10 rounded-xl border flex items-center justify-center
                  border-brand-18 bg-accent-10"
      >
        <SearchIcon size={16} className="h-6 w-6 text-accent opacity-80" />
      </div>
      <h3 className="text-lg font-semibold">Sonuç yok</h3>
      <p className="mt-1 text-sm opacity-70">
        “{query}” için eşleşme bulamadım. Başka bir anahtar kelime dene.
      </p>
    </div>
  );
}
