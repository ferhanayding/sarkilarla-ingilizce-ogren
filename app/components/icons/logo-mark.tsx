import { IconBase, type IconProps } from "./icon-base";

export function LogoMarkIcon({ size = 20, ...props }: IconProps) {
  return (
    <IconBase size={size} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" />
      <path d="M10 7v10" stroke="#fff" strokeWidth="2" />
      <path d="M13.5 7H10" stroke="#fff" strokeWidth="2" />
    </IconBase>
  );
}
