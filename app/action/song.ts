import { fetcher } from "@/lib/swr/fetcher";
import useSWR from "swr";

export function useSong(slug?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/songs/${encodeURIComponent(slug)}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );
  console.log("useSong çağrıldı:", { slug, data, error, isLoading });
  return { song: data as any | null, error, isLoading, mutate };
}
