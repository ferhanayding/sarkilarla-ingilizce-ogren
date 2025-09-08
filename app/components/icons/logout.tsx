import { IconBase, type IconProps } from "./icon-base";

export function LogOutIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M12 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" opacity=".6" />
    </IconBase>
  );
}
