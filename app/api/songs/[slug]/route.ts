import { NextResponse } from "next/server";
import { supabaseServerComponent } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const supabase = await supabaseServerComponent();
  const { data, error } = await supabase
    .from("songs")
    .select("id,slug,title,artist,youtube_id,tags,lines,created_at")
    .eq("slug", params.slug)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
