// app/songs/[slug]/page.tsx (veya senin yolu)
import { SongType } from "@/types/songs";
import type { Metadata, ResolvingMetadata } from "next";

type Props = { params: { song: SongType } };

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata    
): Promise<Metadata> {
  const { song } = params;
  if (!song) return { title: "Bulunamadı", robots: { index: false } };

  const title = `${song.title} — ${song.artist}`;
  const desc = `${song.artist} – ${song.title} telaffuz, çeviri ve senkron sözler.`;

  return {
    title,
    description: desc,
    alternates: { canonical: `/songs/${song.slug}` },
    openGraph: { title, description: desc, url: `/songs/${song.slug}` },
    twitter: { title, description: desc, card: "summary_large_image" },
  };
}
