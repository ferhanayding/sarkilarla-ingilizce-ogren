"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function sendReset() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback`, // bu route'ta form gösterebilirsin
    });
    setMsg(error ? error.message : "Sıfırlama e-postası gönderildi.");
  }

  return (
    <div className="max-w-sm mx-auto p-6 space-y-3">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 rounded border bg-transparent"
        value={email} onChange={(e)=>setEmail(e.target.value)}
      />
      <button onClick={sendReset} className="w-full px-3 py-2 rounded bg-white/10 border">
        Sıfırlama gönder
      </button>
      {msg && <p className="text-sm opacity-80">{msg}</p>}
    </div>
  );
}
