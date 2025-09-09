// app/page.tsx
export const dynamic = "force-dynamic";


import { SONGS } from "@/dummyData/songs";
import HomeClient from "./components/home";

export default async function HomePage() {




  return <HomeClient songs={SONGS} />;
}
