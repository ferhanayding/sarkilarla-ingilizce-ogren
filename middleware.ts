// middleware.ts (proje kökünde)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // req/res üzerinden cookie adapter
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON!,
    {
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
    }
  );

  // session’ı okutup/yenilet (cookie refresh)
  await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)"],
};
