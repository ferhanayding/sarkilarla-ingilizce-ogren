// app/api/songs/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // params artık Promise -> await et
  const { slug } = await params;

  const { supabase, res } = supabaseRoute(req);

  const { data, error } = await supabase
    .from("songs")
    .select("slug,title,artist,youtubeId,lines,tags")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? null, { headers: res.headers });
}
