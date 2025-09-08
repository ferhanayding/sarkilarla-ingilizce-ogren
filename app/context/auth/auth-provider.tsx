"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type AuthCtx = {
  userEmail: string | null;
  checking: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export default function AuthProvider({
  children,
  initialUserEmail = null,
}: {
  children: React.ReactNode;
  /** SSR'dan gelen ilk kullanıcı (flicker azaltır) */
  initialUserEmail?: string | null;
}) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail);
  const [checking, setChecking] = useState<boolean>(true);

  // İlk yüklemede kullanıcıyı oku + auth state dinle
  useEffect(() => {
    let alive = true;

    async function boot() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!alive) return;
        setUserEmail(data.user?.email ?? null);
      } finally {
        if (alive) setChecking(false);
      }
    }
    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUserEmail(session?.user?.email ?? null);
      // server component'ları güncelle (cookie/middleware senkronu)
      router.refresh();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const signInWithPassword: AuthCtx["signInWithPassword"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      await supabase.auth.getSession(); 
      router.replace("/");
      router.refresh();
    }
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    router.refresh();
  };

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data.user?.email ?? null);
  };

  const value = useMemo<AuthCtx>(
    () => ({ userEmail, checking, signInWithPassword, signOut, refreshUser }),
    [userEmail, checking]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
