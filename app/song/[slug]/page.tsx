import type { Metadata } from "next";
import { supabaseServerComponent } from "@/lib/supabase/server";
import Client from "./Client";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await supabaseServerComponent();
    const { data } = await supabase
      .from("songs")
      .select("slug,title,artist")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return { title: "Bulunamadı", robots: { index: false } };

    const title = `${data.title} — ${data.artist}`;
    const description = `${data.artist} – ${data.title} telaffuz, çeviri ve senkron sözler.`;

    return {
      title,
      description,
      alternates: { canonical: `/songs/${slug}` },
      openGraph: { title, description, url: `/songs/${slug}` },
      twitter: { title, description, card: "summary_large_image" },
    };
  } catch {
    return {};
  }
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <Client slug={slug} />;
}
