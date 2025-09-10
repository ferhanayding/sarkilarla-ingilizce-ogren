"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase/client";
import { signInWithPasswordAction } from "@/app/action/auth";
import { toast } from "sonner"; 
import { Button } from "@/app/components/ui/button";

const BG_URL =
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1974&auto=format&fit=crop";

type Tab = "login" | "register";


const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta gir"),
  password: z.string().min(5, "En az 5 karakter"),
});

const registerSchema = z
  .object({
    email: z.string().email("Geçerli bir e-posta gir"),
    password: z.string().min(5, "En az 5 karakter"),
    confirm: z.string().min(5, "En az 5 karakter"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Şifreler eşleşmiyor",
    path: ["confirm"],
  });

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register: regLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register: regRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });
  const [pending, startTransition] = React.useTransition();

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    setServerError(null);
    startTransition(async () => {
      const res = await signInWithPasswordAction(values);
      if (res?.error) setServerError(res.error);
    });
    setLoading(false);
  }
async function onRegister(values: z.infer<typeof registerSchema>) {
  setLoading(true);
  setServerError(null);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
      setServerError(error.message);
      return;
    }

    if (data.session) {
      toast.success("Kayıt başarılı, giriş yapabilirsin.");
       setTab("login");
    } else {
      toast.info("Kayıt başarılı, giriş yapabilirsin.");
      setTab("login");
    }
  } catch (e: any) {
    const msg = e?.message || "Bilinmeyen bir hata oluştu.";
    setServerError(msg);
    toast.error(msg);
  } finally {
    setLoading(false);
  }
}




  return (
    <main className="relative min-h-[calc(100dvh-62px)] text-white">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-sm" />
      <div className="pointer-events-none absolute -z-10 inset-x-0 -top-24 mx-auto h-64 w-[900px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(600px_200px_at_center,theme(colors.indigo.500/.35),transparent)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-12">
          <section className="hidden lg:block lg:col-span-6">
            <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm p-8 h-full flex flex-col justify-between shadow-[0_10px_60px_rgba(0,0,0,.5)]">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight">
                  AyLovYu
                </h1>
                <p className="mt-2 text-white/80">
                  İngilizce şarkılar • Türkçe okunuş • Türkçe anlam. Favori
                  şarkılarını öğrenirken söyle!
                </p>
              </div>
              <ul className="space-y-3 text-white/85 text-sm mt-8">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                  Gerçek zamanlı senkronize söz akışı
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-fuchsia-400" />
                  Phonetic odak modu (EN/TR opsiyonel)
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                  YouTube oynatıcı ile entegre
                </li>
              </ul>
              <p className="text-xs text-white/60 mt-8">
                Devam ederek Hizmet Koşulları'nı ve Gizlilik Politikası'nı kabul
                edersin.
              </p>
            </div>
          </section>

          <section className="lg:col-span-6">
            <div className="mx-auto max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_10px_60px_rgba(0,0,0,.6)] p-6 sm:p-8">
              <div className="grid grid-cols-2 rounded-xl p-1 bg-white/5 border border-white/10">
                <button
                  onClick={() => setTab("login")}
                  className={[
                    "h-10 rounded-lg text-sm transition",
                    tab === "login"
                      ? "bg-white/20 shadow-inner"
                      : "hover:bg-white/10",
                  ].join(" ")}
                >
                  Giriş yap
                </button>
                <button
                  onClick={() => setTab("register")}
                  className={[
                    "h-10 rounded-lg text-sm transition",
                    tab === "register"
                      ? "bg-white/20 shadow-inner"
                      : "hover:bg-white/10",
                  ].join(" ")}
                >
                  Kayıt ol
                </button>
              </div>

              {tab === "login" ? (
                <form
                  onSubmit={handleLoginSubmit(onLogin)}
                  className="space-y-4"
                >
                  <Field label="E-posta" error={loginErrors.email?.message}>
                    <input
                      type="email"
                      placeholder="ornek@posta.com"
                      className="form-input"
                      {...regLogin("email")}
                      disabled={loading}
                    />
                  </Field>

                  <Field label="Şifre" error={loginErrors.password?.message}>
                    <PasswordInput
                      placeholder="••••••••"
                      {...regLogin("password")}
                      disabled={loading}
                    />
                  </Field>

                  {serverError && (
                    <p className="text-sm text-rose-300">{serverError}</p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 opacity-80">
                      <input type="checkbox" className="accent-fuchsia-400" />
                      Beni hatırla
                    </label>
                    <a
                      href="#"
                      className="text-indigo-200 hover:text-white/90 underline underline-offset-4"
                    >
                      Şifremi unuttum
                    </a>
                  </div>

                  <Button
                    className="w-full h-11  bg-gradient-to-tr from-indigo-600 to-rose-500 hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60"
                    loading={loading}
                  >
                    {loading ? "Giriş yapılıyor…" : "Giriş yap"}
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={handleRegisterSubmit(onRegister)}
                  className="space-y-4"
                >
                  <Field label="E-posta" error={registerErrors.email?.message}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="ornek@posta.com"
                      className="form-input"
                      {...regRegister("email")}
                      disabled={loading}
                    />
                  </Field>

                  <Field label="Şifre" error={registerErrors.password?.message}>
                    <PasswordInput
                      placeholder="En az 6 karakter"
                      {...regRegister("password")}
                      disabled={loading}
                    />
                  </Field>

                  <Field
                    label="Şifre (tekrar)"
                    error={registerErrors.confirm?.message}
                  >
                    <PasswordInput
                      placeholder="Tekrar şifre"
                      {...regRegister("confirm")}
                      disabled={loading}
                    />
                  </Field>

                  {serverError && (
                    <p className="text-sm text-rose-300">{serverError}</p>
                  )}

                  <button
                    className="w-full h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 hover:brightness-105 active:scale-[0.99] transition disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Kayıt oluşturuluyor…" : "Kayıt ol"}
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-xs text-white/70">
                Devam ederek <a className="underline">Koşullar</a> ve{" "}
                <a className="underline">Gizlilik</a>’i kabul etmiş olursun.
              </p>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        .form-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          outline: none;
          transition: box-shadow 0.2s, background 0.2s, border-color 0.2s;
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .form-input:focus {
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
          border-color: rgba(255, 255, 255, 0.35);
          background: rgba(255, 255, 255, 0.12);
        }
        .input-wrap .form-input {
          padding-right: 44px;
        }

        /* Autofill farklarını kapat (özellikle iOS/Chrome) */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm opacity-90">{label}</label>
      {children}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(function PasswordInput({ className = "", ...props }, ref) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative input-wrap">
      <input
        ref={ref}
        type={show ? "text" : "password"}
        autoComplete={props.autoComplete ?? "current-password"}
        className={`form-input ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 grid place-items-center text-white/80 hover:text-white"
        aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
      >
        {show ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M21 12s-3-7-9-7-9 7-9 7a16.9 16.9 0 004.27 4.86"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M21 12s-3-7-9-7-9 7-9 7 3 7 9 7 9-7 9-7z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </button>
      <style jsx>{`
        .form-input {
          width: 100%;
          height: 44px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          outline: none;
          transition: box-shadow 0.2s, background 0.2s, border-color 0.2s;
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
        .form-input:focus {
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25);
          border-color: rgba(255, 255, 255, 0.35);
          background: rgba(255, 255, 255, 0.12);
        }
        .input-wrap .form-input {
          padding-right: 44px;
        }

        /* Autofill farklarını kapat (özellikle iOS/Chrome) */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #fff;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
});
