import { IconBase, type IconProps } from "./icon-base";

export function LogInIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 7l-5 5 5 5" />
      <path d="M3 12h12" />
      <path d="M12 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" opacity=".8" />
    </IconBase>
  );
}
