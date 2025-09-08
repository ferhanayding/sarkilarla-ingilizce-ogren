"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/auth/auth-provider";

export default function LoginPage() {
 const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await signInWithPassword(email, password);
    if (error) alert(error);
  }


  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto p-6 space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="w-full px-3 py-2 rounded border bg-transparent"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Şifre"
        className="w-full px-3 py-2 rounded border bg-transparent"
      />
      <button className="w-full px-3 py-2 rounded bg-white/10 border">
        Giriş yap
      </button>
    </form>
  );
}
