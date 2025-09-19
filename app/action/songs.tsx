"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/swr/fetcher";
import { SongLite } from "@/types/songs";

type SongsResponse = {
  items: SongLite[];
  count: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};

export function useSongs(q = "", limit = 30, offset = 0) {
  const qs = new URLSearchParams({
    q,
    limit: String(limit),
    offset: String(offset),
  }).toString();

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<SongsResponse>(`/api/songs?${qs}`, fetcher, {
      keepPreviousData: true,
      revalidateOnFocus: false,
      dedupingInterval: 500,
    });

  return {
    items: data?.items ?? [],
    count: data?.count ?? 0,
    hasMore: data?.hasMore ?? false,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
