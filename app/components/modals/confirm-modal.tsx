"use client";

import React, { useRef, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  danger?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "Vazgeç",
  onConfirm,
  onCancel,
  closeOnEsc = true,
  closeOnBackdrop = true,
  danger = false,
  size = "sm",
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  const confirmBtnClass = danger
    ? "bg-[rgb(var(--error,220_38_38))] hover:bg-[rgb(var(--error,220_38_38))]/90"
    : "bg-[rgb(var(--error,37_99_235))] hover:bg-[rgb(var(--error,37_99_235))]/90";

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      closeOnEsc={closeOnEsc}
      closeOnBackdrop={closeOnBackdrop}
      size={size}
      className="bg-[rgb(var(--brand2,38_44_56))]"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            ref={cancelRef}
            type="button"
            
            onClick={onCancel}
            disabled={loading}
            className="inline-flex h-9 px-3 items-center justify-center rounded-xl
                       border border-white/20 bg-white/10 hover:bg-white/20
                       text-white text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`inline-flex h-9 px-3 items-center justify-center rounded-xl text-white text-sm transition
                       ${confirmBtnClass} disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                {confirmText}
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      }
    />
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      role="status"
      aria-label="Yükleniyor"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}
