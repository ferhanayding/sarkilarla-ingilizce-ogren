import { NextResponse } from "next/server";
import { supabaseServerComponent } from "@/lib/supabase/server";

type Line = { t?: string | null };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 24), 100);
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

  const supabase = await supabaseServerComponent();

  let query = supabase
    .from("songs")
    .select("id,slug,title,artist,youtube_id,tags,created_at,lines", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,artist.ilike.%${q}%,slug.ilike.%${q}%`
    );
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items =
    (data ?? []).map((row) => {
      const lines = (row as any).lines as Line[] | null;

      // KURAL: bir tane bile boş t varsa => false, hepsi doluysa => true
      const hasTimestamps =
        Array.isArray(lines) &&
        lines.length > 0 &&
        lines.every((ln) => (ln?.t ?? "").toString().trim() !== "");

      const { lines: _omit, ...rest } = row as any;
      return { ...rest, hasTimestamps };
    }) ?? [];

  return NextResponse.json({
    items,
    count: count ?? 0,
    offset,
    limit,
    hasMore: offset + limit < (count ?? 0),
  });
}
