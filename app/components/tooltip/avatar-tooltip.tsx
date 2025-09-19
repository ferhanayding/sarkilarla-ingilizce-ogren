"use client";

import { useId } from "react";
import { Tooltip } from "./index";

export type AvatarTooltipProps = {
  email?: string;
};

export function AvatarTooltip({ email }: AvatarTooltipProps) {
  const letter = (email || "U").charAt(0).toUpperCase();
  const tooltipId = useId();

  return (
    <div className="">
      <Tooltip
        content={email ?? "Profil"}
        placement="bottom"
        offset={8}
        openDelay={300}
      >
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
      </Tooltip>
    </div>
  );
}
