// lib/supabase/server.ts
import "server-only";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON!;

/** Helper: Next14 (sync) + Next15 (async) uyumlu cookie store */
async function getCookieStore() {
  // cookies() sync ise de async ise de çalışır
  return (await Promise.resolve(cookies() as any)) as {
    get: (name: string) => { value: string } | undefined;
    set: (opts: { name: string; value: string } & CookieOptions) => void;
  };
}

/** 1) Server Component (RSC): SADECE OKU — set/remove NO-OP */
export async function supabaseServerComponent() {
  const cookieStore = await getCookieStore();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(_name: string, _value: string, _opts?: CookieOptions) {
        // RSC'de cookie yazılamaz → NO-OP (aksi halde "Cookies can only be modified..." hatası)
      },
      remove(_name: string, _opts?: CookieOptions) {
        // NO-OP
      },
    },
  });
}

/** 2) Route Handler (app/api/**): OKU + YAZ (NextResponse ile) */
export function supabaseRoute(req: NextRequest) {
  const res = NextResponse.next();
  const client = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options?: CookieOptions) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });
  return { supabase: client, res };
}

/** 3) Server Action: OKU + YAZ (burada cookies().set serbest) */
export async function supabaseServerAction() {
  const cookieStore = await getCookieStore();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options?: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options?: CookieOptions) {
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}
