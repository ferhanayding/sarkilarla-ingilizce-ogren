"use client";

import { SearchIcon } from "../icons/search";

export default function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur p-10 text-center shadow-sm">
      <div className="mx-auto mb-3 h-10 w-10 rounded-xl border flex items-center justify-center bg-gradient-to-br from-indigo-50 to-rose-50">
       <SearchIcon size={16} className="h-6 w-6 text-indigo-400 opacity-70" />
      </div>
      <h3 className="text-lg font-semibold">Sonuç yok</h3>
      <p className="mt-1 text-sm opacity-70">
        “{query}” için eşleşme bulamadım. Başka bir anahtar kelime dene.
      </p>
    </div>
  );
}
