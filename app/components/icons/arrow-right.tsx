import { IconBase, type IconProps } from "./icon-base";

export function ArrowRightIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </IconBase>
  );
}
