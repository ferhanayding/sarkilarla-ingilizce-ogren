// app/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { supabaseServerAction } from "@/lib/supabase/server";

export async function signInWithPasswordAction(values: { email: string; password: string }) {
  const supabase = await supabaseServerAction();
  const { error } = await supabase.auth.signInWithPassword(values);
  if (error) return { error: error.message };
  redirect("/"); // en hızlı geçiş
}

export async function signOutAction() {
  const supabase = await supabaseServerAction();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
