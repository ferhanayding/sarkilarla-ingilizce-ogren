"use client";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "@/lib/swr/fetcher";

export default function SwrProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        dedupingInterval: 500,
      }}
    >
      {children}
    </SWRConfig>
  );
}
