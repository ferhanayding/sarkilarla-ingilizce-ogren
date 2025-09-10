"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cx } from "@/lib/ui/cx";

type Variant = "accent" | "brand" | "brand2" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  pill?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  prefetch?: boolean;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2";
const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-3 text-[15px]",
  lg: "h-11 px-4 text-base",
};
const radii = {
  normal: "rounded-xl",
  pill: "rounded-full",
};
const variants: Record<Variant, string> = {
  accent:
    "text-white bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent))/0.92] focus-visible:ring-[rgb(var(--accent))/0.35]",
  brand:
    "text-white bg-[rgb(var(--brand))] hover:bg-[rgb(var(--brand))/0.9] focus-visible:ring-[rgb(var(--accent))/0.35]",
  brand2:
    "text-white bg-[rgb(var(--brand2,49_60_75))] hover:bg-[rgb(var(--brand2,49_60_75))/0.9] focus-visible:ring-[rgb(var(--accent))/0.35]",
  outline:
    "text-white border border-white/20 bg-transparent hover:bg-white/10 focus-visible:ring-[rgb(var(--accent))/0.35]",
  ghost:
    "text-[rgb(var(--brand))] bg-transparent hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-[rgb(var(--accent))/0.25]",
};

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
  );
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    href,
    children,
    className,
    variant = "brand2",
    size = "md",
    pill,
    fullWidth,
    loading,
    startIcon,
    endIcon,
    ...rest
  },
  ref
) {
  const cls = cx(
    base,
    sizes[size],
    pill ? radii.pill : radii.normal,
    variants[variant],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} ref={ref as any} className={cls} {...(rest as any)}>
        {loading ? <Spinner /> : startIcon}
        <span>{children}</span>
        {endIcon}
      </Link>
    );
  }

  return (
    <button
      ref={ref as any}
      className={cls}
      disabled={loading || (rest as any)?.disabled}
      {...(rest as any)}
    >
      {loading ? <Spinner /> : startIcon}
      <span>{children}</span>
      {endIcon}
    </button>
  );
});
