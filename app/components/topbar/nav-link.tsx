"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";

export type NavLinkProps = PropsWithChildren<{
  href: string;
  title?: string;
  active?: boolean;
}>;

export function NavLink({ href, title, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      title={title}
      className={[
        "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm transition cursor-pointer",
        "border border-white/10 bg-white/[0.06] hover:bg-white/[0.12]",
        active ? "bg-white/[0.14] border-white/20 ring-1 ring-white/15" : "",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
