import { NextRequest } from "next/server";
import { supabaseServerComponent } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;

  const supabase = await supabaseServerComponent();
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
