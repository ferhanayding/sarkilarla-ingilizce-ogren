import { NextResponse } from "next/server";
import { supabaseServerComponent } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 24), 100);
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

  const supabase = await supabaseServerComponent();

  let query = supabase
    .from("songs")
    .select("id,slug,title,artist,youtube_id,tags,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(`title.ilike.%${q}%,artist.ilike.%${q}%,slug.ilike.%${q}%`);
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    items: data ?? [],
    count: count ?? 0,
    offset,
    limit,
    hasMore: (offset + limit) < (count ?? 0),
  });
}
