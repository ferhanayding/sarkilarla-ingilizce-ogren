// app/components/Topbar.tsx
"use client";

import Link from "next/link";
import { LogOutIcon } from "../icons/logout";
import { LogInIcon } from "../icons/logIn";
import { useAuth } from "@/app/context/auth/auth-provider";



export default function Topbar() {
      const { userEmail, checking, signOut } = useAuth();

  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 border shadow-sm bg-white hover:shadow transition"
        >
          <div className="h-7 w-7 rounded-xl flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-600 to-rose-500 shadow-sm">
            L
          </div>
          <span className="font-extrabold tracking-tight">LOGO</span>
        </Link>

        {/* Sağ taraf: auth */}
        <div className="flex items-center gap-2">
          {checking ? (
            <div className="h-9 w-28 rounded-lg border animate-pulse bg-white/50" />
          ) : userEmail ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm opacity-70">
                {userEmail}
              </span>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm bg-white hover:shadow-sm active:scale-[0.98] transition"
              >
                <LogOutIcon size={16} className="opacity-70" />
                Çıkış yap
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white bg-gradient-to-tr from-indigo-600 to-rose-500 shadow hover:brightness-105 active:scale-[0.98] transition"
            >
              <LogInIcon size={16} className="opacity-70" />
              Giriş yap
            </Link>
          )}
        </div>
      </div>
      {/* Gradient alt çizgi */}
      <div className="h-[1px] w-full bg-gradient-to-r from-indigo-200 via-rose-200 to-amber-200" />
    </div>
  );
}
