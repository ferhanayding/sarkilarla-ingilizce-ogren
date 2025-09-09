"use client";

import { useEffect, useRef } from "react";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    // autofocus cancel
    const id = setTimeout(() => cancelRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(id);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onMouseDown={(e) => {
        // backdrop click kapatsın
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative mx-4 w-full max-w-sm rounded-2xl border border-white/10
                      bg-[rgb(var(--brand))] text-white shadow-2xl p-4">
        <h2 id="confirm-title" className="text-base font-semibold">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-white/80">{description}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center h-9 px-3 rounded-xl
                       border border-white/20 bg-white/10 hover:bg-white/20
                       text-white text-sm transition cursor-pointer"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center justify-center h-9 px-3 rounded-xl
                       text-white text-sm transition cursor-pointer
                       bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))/0.92]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
