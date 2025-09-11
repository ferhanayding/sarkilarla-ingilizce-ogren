import { NextRequest, NextResponse } from "next/server";
import { supabaseRoute } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } } // <-- Promise değil
) {
  const { slug } = params;

  const { supabase, res } = supabaseRoute(req);

  const { data, error } = await supabase
    .from("songs")
    .select("slug,title,artist,youtube_id,lines,tags")
    .eq("slug", slug)
    .maybeSingle();

  console.log("API GET /api/songs/[slug] çağrıldı:", { slug, data, error });

  if (error) {
    // Eğer cookie set edildiyse headers'ı yine geçir
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: res.headers }
    );
  }

  return NextResponse.json(data ?? null, { headers: res.headers });
}
