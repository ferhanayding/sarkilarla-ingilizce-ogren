// components/Tooltip.tsx (patch)
"use client";

import React, {
  ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type Placement = "top" | "right" | "bottom" | "left";

type TooltipProps = {
  content: ReactNode;
  children?: React.ReactNode;
  placement?: Placement;
  offset?: number;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number;
};

export function Tooltip({
  content,
  children,
  placement = "top",
  offset = 8,
  openDelay = 80,
  closeDelay = 80,
  className = "",
  open: controlledOpen,
  onOpenChange,
  width,
}: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (v: boolean) =>
    isControlled ? onOpenChange?.(v) : setUncontrolledOpen(v);

  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 0,
    top: 0,
  });
  const arrowSize = 8;

  const compute = () => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = offset + arrowSize / 2;
    let left = 0,
      top = 0;

    switch (placement) {
      case "top":
        left = r.left + r.width / 2;
        top = r.top - gap;
        break;
      case "bottom":
        left = r.left + r.width / 2;
        top = r.bottom + gap;
        break;
      case "left":
        left = r.left - gap;
        top = r.top + r.height / 2;
        break;
      case "right":
        left = r.right + gap;
        top = r.top + r.height / 2;
        break;
    }
    setPos({ left, top });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    compute();
    const onScroll = () => compute();
    const onResize = () => compute();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, placement, offset, width]);

  const handlers = {
    onMouseEnter: () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      openTimer.current = window.setTimeout(() => setOpen(true), openDelay);
    },
    onMouseLeave: () => {
      if (openTimer.current) window.clearTimeout(openTimer.current);
      closeTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
    },
    onFocus: () => setOpen(true),
    onBlur: () => setOpen(false),
    onKeyDown: (e: React.KeyboardEvent) => e.key === "Escape" && setOpen(false),
  };

  const positionClasses =
    placement === "top"
      ? "translate-x-[-50%] -translate-y-full origin-bottom"
      : placement === "bottom"
      ? "translate-x-[-50%] translate-y-0 origin-top"
      : placement === "left"
      ? "-translate-x-full translate-y-[-50%] origin-right"
      : "translate-x-0 translate-y-[-50%] origin-left";

  const arrowBase =
    "absolute h-2 w-2 rotate-45 bg-black/90 border border-white/5";
  const arrowPos =
    placement === "top"
      ? `${arrowBase} left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2`
      : placement === "bottom"
      ? `${arrowBase} left-1/2 top-0 -translate-y-1/2 -translate-x-1/2`
      : placement === "left"
      ? `${arrowBase} right-0 top-1/2 -translate-x-1/2 -translate-y-1/2`
      : `${arrowBase} left-0 top-1/2 translate-x-[-50%] -translate-y-1/2`;

  const box =
    mounted && isOpen
      ? createPortal(
          <div
            id={id}
            role="tooltip"
            className={[
              "fixed",
              "pointer-events-none select-none",
              positionClasses,
              "rounded-md px-2 py-1 text-xs text-white",
              "bg-black/90 shadow-lg border border-white/10",
              "opacity-100",
              className,
            ].join(" ")}
            style={{ left: pos.left, top: pos.top, width }}
          >
            <span aria-hidden className={arrowPos} />
            <div className="pointer-events-auto">{content}</div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <span
        ref={anchorRef}
        aria-describedby={isOpen ? id : undefined}
        tabIndex={0}
        className="inline-block align-middle"
        {...handlers}
      >
        {children}
      </span>
      {box}
    </>
  );
}
