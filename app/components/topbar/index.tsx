"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth/auth-provider";
import { LogOutIcon } from "../icons/logout";
import { LogInIcon } from "../icons/logIn";
import { LogoLight } from "../icons/logom-light";

import { NavLink } from "./nav-link";
import { AvatarTooltip } from "./avatar-tooltip";
import { ConfirmDialog } from "../modals/confirm-modal";
import { HomeIcon } from "../icons/home-topbar";
import { InfoIcon } from "../icons/info-icon";
import { HeartIcon } from "../icons/heart-fav";

export default function Topbar() {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");
  const { userEmail, checking, signOut } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  useEffect(() => {}, [isAuth]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const wrap =
    "sticky top-0 z-50 h-[65px] text-white relative " +
    "bg-[rgb(var(--brand2))] " +
    "border-b border-white/10 " +
    "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10 " +
    (scrolled ? "shadow-[0_4px_12px_rgba(0,0,0,.15)]" : "");

  return (
    <>
      <div className={wrap}>
        <div className="mx-auto max-w-[1170px] h-[65px] px-4 flex items-center justify-between">
          {isAuth ? (
            <>
              <div className="flex-1 flex justify-start">
                <Link
                  href="/"
                  aria-label="Anasayfa"
                  className=" rounded-2xl px-2 py-1 hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
                >
                  <LogoLight width={44} height={44} />
                </Link>
              </div>
              <div className="w-[140px] shrink-0 flex items-center justify-end gap-1 sm:gap-2">
                <NavLink href="/" active={pathname === "/"} title="Anasayfa">
                  <HomeIcon />
                  <span className="hidden sm:inline">Anasayfa</span>
                </NavLink>

                <NavLink
                  href="/about"
                  active={pathname.startsWith("/about")}
                  title="Hakkımızda"
                >
                  <InfoIcon />
                  <span className="hidden sm:inline">Hakkımızda</span>
                </NavLink>


              </div>
            </>
          ) : (
            <>
              <Link
                href="/"
                aria-label="Anasayfa"
                className="inline-flex items-center gap-2 rounded-2xl px-2 py-1 hover:opacity-95 active:scale-[0.99] transition cursor-pointer"
              >
                <LogoLight width={44} height={44} />
              </Link>

              <div className="flex items-center gap-1 sm:gap-2">
                <NavLink href="/" active={pathname === "/"} title="Anasayfa">
                  <HomeIcon />
                  <span className="hidden sm:inline">Anasayfa</span>
                </NavLink>

                <NavLink
                  href="/about"
                  active={pathname.startsWith("/about")}
                  title="Hakkımızda"
                >
                  <InfoIcon />
                  <span className="hidden sm:inline">Hakkımızda</span>
                </NavLink>

                {checking && (
                  <NavLink
                    href="/favorites"
                    active={pathname.startsWith("/favorites")}
                    title="Favorilerim"
                  >
                    <HeartIcon />
                    <span className="hidden sm:inline">Favorilerim</span>
                  </NavLink>
                )}

                {checking ? (
                  <div className="h-9 w-28 rounded-xl border border-white/15 bg-white/10 animate-pulse" />
                ) : userEmail ? (
                  <div className="flex items-center gap-2">
                    <AvatarTooltip email={userEmail} />
                    <button
                      onClick={() => setConfirmOpen(true)}
                      className="inline-flex items-center gap-2 h-9 rounded-xl border border-white/20 px-3 text-sm bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                    >
                      <LogOutIcon size={16} className="opacity-95" />
                      Çıkış yap
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm text-white shadow
                               bg-[rgb(var(--success))] hover:bg-[rgb(var(--accent))/0.92]
                               hover:brightness-110 active:scale-[0.98] transition cursor-pointer"
                  >
                    <LogInIcon size={16} className="opacity-95" />
                    Giriş yap
                  </Link>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Çıkış onayı modalı */}
      <ConfirmDialog
        open={confirmOpen}
        title="Çıkış yapılsın mı?"
        description="Hesabınızdan çıkış yapmak üzeresiniz. Emin misiniz?"
        confirmText="Evet, çıkış yap"
        cancelText="Vazgeç"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          await signOut();
        }}
      />
    </>
  );
}
