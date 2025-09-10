// components/ui/Modal.tsx
"use client";

import React, {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export type ModalProps = {
  open: boolean;
  onClose: () => void;

  /** İçerik */
  children?: ReactNode;

  /** Başlık ve açıklama (erişilebilirlik için id bağlar) */
  title?: ReactNode;
  description?: ReactNode;

  /** Ayak alanı (butonlar vs) */
  footer?: ReactNode;

  /** Çeşitli davranışlar */
  closeOnEsc?: boolean;              // default: true
  closeOnBackdrop?: boolean;         // default: true
  preventScroll?: boolean;           // default: true
  restoreFocus?: boolean;            // default: true

  /** Odak yönetimi */
  initialFocusRef?: React.RefObject<HTMLElement>; // açılışta odaklanacak eleman

  /** Stil & boyut */
  size?: ModalSize;                  // default: "md"
  className?: string;                // dialog panel (kutu)
  backdropClassName?: string;        // arka plan
  containerClassName?: string;       // ortalayan kapsayıcı
  zIndexClassName?: string;          // z-index
  portalRoot?: HTMLElement | null;   // default: document.body
};

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Modal({
  open,
  onClose,
  children,
  title,
  description,
  footer,
  closeOnEsc = true,
  closeOnBackdrop = true,
  preventScroll = true,
  restoreFocus = true,
  initialFocusRef,
  size = "md",
  className,
  backdropClassName,
  containerClassName,
  zIndexClassName = "z-[100]",
  portalRoot,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  // SSR uyumu
  useEffect(() => setMounted(true), []);

  // Scroll kilidi
  useEffect(() => {
    if (!mounted || !preventScroll) return;
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open, preventScroll, mounted]);

  // Odak restore
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      lastActiveRef.current = (document.activeElement as HTMLElement) ?? null;

      // İlk odak
      const focusTarget =
        initialFocusRef?.current ??
        dialogRef.current?.querySelector<HTMLElement>(focusableSelector) ??
        dialogRef.current;

      queueMicrotask(() => focusTarget?.focus?.());
    } else if (restoreFocus) {
      // Modal kapandığında odak geri gelsin
      lastActiveRef.current?.focus?.();
    }
  }, [open, initialFocusRef, restoreFocus, mounted]);

  // ESC kapatma
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Odak tuzağı: Tab döngüsü
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  // Portal hedefi
  const root = useMemo(() => portalRoot ?? (mounted ? document.body : null), [portalRoot, mounted]);
  if (!mounted || !root) return null;
  if (!open) return null;

  // Boyut sınıfları
  const sizeClass =
    size === "sm"
      ? "max-w-sm"
      : size === "md"
      ? "max-w-md"
      : size === "lg"
      ? "max-w-lg"
      : size === "xl"
      ? "max-w-2xl"
      : "max-w-[min(96vw,960px)] w-[96vw] h-[96vh]"; // full

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onMouseDown={(e) => {
        if (!closeOnBackdrop) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${backdropClassName ?? ""}`}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={`relative mx-4 w-full ${sizeClass} rounded-2xl border border-white/10 bg-[rgb(var(--brand2,38_44_56))] text-white shadow-2xl outline-none
                    data-[enter]:animate-in data-[enter]:fade-in data-[enter]:zoom-in-95
                    data-[leave]:animate-out data-[leave]:fade-out data-[leave]:zoom-out-95
                    ${className ?? ""}`}
      >
        <div className={`p-4 ${containerClassName ?? ""}`}>
          {title ? (
            <h2 id={titleId} className="text-base font-semibold">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p id={descId} className="mt-1 text-sm text-white/80">
              {description}
            </p>
          ) : null}

          {/* İçerik */}
          <div className={title || description ? "mt-4" : ""}>{children}</div>

          {/* Footer */}
          {footer ? <div className="mt-4">{footer}</div> : null}
        </div>
      </div>
    </div>,
    root
  );
}
