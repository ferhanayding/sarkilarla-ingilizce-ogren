// app/page.tsx
export const dynamic = "force-dynamic";


import { SONGS } from "@/dummyData/songs";
import HomeClient from "./components/home";

export default async function HomePage() {
  // const supabase = await supabaseServerComponent();  // ⬅️ artık async
  // const { data: { user } } = await supabase.auth.getUser();
  // console.log("user:", user);



  return <HomeClient songs={SONGS} />;
}
