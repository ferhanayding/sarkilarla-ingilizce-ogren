import "server-only";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON!;

async function getCookieStore() {
  return (await Promise.resolve(cookies() as any)) as {
    get: (name: string) => { value: string } | undefined;
    set: (opts: { name: string; value: string } & CookieOptions) => void;
  };
}

export async function supabaseServerComponent() {
  const cookieStore = await getCookieStore();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(_name: string, _value: string, _opts?: CookieOptions) {
      },
      remove(_name: string, _opts?: CookieOptions) {
      },
    },
  });
}

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
