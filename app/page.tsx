// app/page.tsx
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { supabaseServerComponent } from "@/lib/supabase/server";
import { SONGS } from "@/dummyData/songs";
import HomeClient from "./components/home";

export default async function HomePage() {
  const supabase = await supabaseServerComponent();  // ⬅️ artık async
  const { data: { user } } = await supabase.auth.getUser();
  console.log("user:", user);

  if (!user) redirect("/auth/login");

  return <HomeClient songs={SONGS} />;
}
