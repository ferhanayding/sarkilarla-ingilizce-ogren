import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  title?: string;
  decorative?: boolean;
};

export function IconBase({
  size = 20,
  title,
  decorative = true,
  children,
  className,
  ...rest
}: IconProps) {
  const ariaProps = decorative
    ? { "aria-hidden": true }
    : { role: "img", "aria-label": title ?? "icon" };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...ariaProps}
      {...rest}
    >
      {children}
    </svg>
  );
}
