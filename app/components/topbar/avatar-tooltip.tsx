"use client";

import { useId } from "react";

export type AvatarTooltipProps = {
  email?: string;
};

export function AvatarTooltip({ email }: AvatarTooltipProps) {
  const letter = (email || "U").charAt(0).toUpperCase();
  const tooltipId = useId();

  return (
    <div className="relative group">
      <button
        type="button"
        aria-describedby={tooltipId}
        aria-label={email ? email : "Kullanıcı"}
        className="h-9 w-9 rounded-full grid place-items-center text-sm font-semibold
                   border border-white/25 bg-white/10 text-white hover:bg-white/20
                   transition select-none outline-none cursor-pointer"
      >
        {letter}
      </button>

      <div
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2
             whitespace-nowrap rounded-md px-2 py-1 text-xs text-white
             bg-black/90 shadow-lg opacity-0 group-hover:opacity-100
             group-focus-within:opacity-100 transition z-[60]"
      >
        <span
          aria-hidden
          className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-black/90"
        />
        {email ?? "Profil"}
      </div>
    </div>
  );
}
