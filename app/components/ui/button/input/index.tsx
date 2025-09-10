"use client";

import { forwardRef } from "react";
import { cx } from "@/lib/ui/cx";

type Size = "sm" | "md" | "lg";
type Variant = "surface" | "white";

// 👇 Native input props'tan "size"ı düşüyoruz
type NativeInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export type InputProps = NativeInputProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: Size;        
  variant?: Variant;
  error?: string;
};

const sizes = {
  sm: { wrapper: "h-9",  input: "h-9 text-[13px]", leftPad: "pl-8",  rightPad: "pr-8"  },
  md: { wrapper: "h-10", input: "h-10 text-[14px]", leftPad: "pl-9",  rightPad: "pr-10" },
  lg: { wrapper: "h-11", input: "h-11 text-[15px]", leftPad: "pl-10", rightPad: "pr-11" },
} as const satisfies Record<Size, { wrapper: string; input: string; leftPad: string; rightPad: string }>;

const variants = {
  surface:
    "border border-[rgb(var(--brand2,49_60_75))/0.18] bg-[rgb(var(--brand3,68_78_92))] text-white placeholder-white/70 focus:ring-2 focus:ring-[rgb(var(--accent))/0.25] focus:border-[rgb(var(--accent))/0.4]",
  white:
    "border border-slate-200 bg-white text-[rgb(var(--brand))] placeholder-black/40 focus:ring-2 focus:ring-[rgb(var(--accent))/0.25] focus:border-[rgb(var(--accent))/0.4]",
} as const satisfies Record<Variant, string>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leftIcon, rightIcon, size = "md", variant = "surface", error, ...rest },
  ref
) {
  const s = sizes[size];
  const v = variants[variant];

  return (
    <div className={cx("relative", s.wrapper)}>
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        aria-invalid={!!error}
        className={cx(
          "w-full rounded-2xl outline-none shadow-sm transition",
          v,
          leftIcon && s.leftPad,
          rightIcon && s.rightPad,
          !leftIcon && "px-4",
          !rightIcon && "pr-4",
          s.input,
          className
        )}
        {...rest}   // ← buraya artık native "size" hiçbir şekilde sızmıyor
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
          {rightIcon}
        </div>
      )}
      {error && <div className="mt-1 text-xs text-rose-400">{error}</div>}
    </div>
  );
});
