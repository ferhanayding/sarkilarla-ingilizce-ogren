import { IconBase, type IconProps } from "./icon-base";

/** Ortak: props.size ile kontrol (default 44) */
function withSizeSize(props: IconProps & { size?: number }) {
  const { size = 44, width, height, ...rest } = props as any;
  return { width: width ?? size, height: height ?? size, rest };
}

export function LogoDark(props: IconProps & { size?: number }) {
  const { width, height, rest } = withSizeSize(props);
  return (
    <IconBase
      width={width}
      height={height}
      viewBox="0 0 1024 1024"
      shapeRendering="geometricPrecision"
      {...rest}
    >
      {/* Daire dolgusu */}
      <circle cx="512" cy="512" r="420" fill="#0b0b1a" />

      {/* Halkalar (sırasıyla: beyaz, siyah, beyaz-geniş, siyah) */}
      <circle cx="512" cy="512" r="425" fill="none" stroke="#ffffff" strokeWidth="10" />
      <circle cx="512" cy="512" r="435" fill="none" stroke="#000000" strokeWidth="6" />
      <circle cx="512" cy="512" r="447" fill="none" stroke="#ffffff" strokeWidth="14" />
      <circle cx="512" cy="512" r="459" fill="none" stroke="#000000" strokeWidth="6" />

      {/* Sol slash '/' */}
      <g transform="translate(355,512) rotate(-16)">
        <rect x="-24.5" y="-226.5" width="49" height="453" rx="24.5" fill="#ffffff" />
      </g>

      {/* Sağ slash '/' */}
      <g transform="translate(669,512) rotate(-16)">
        <rect x="-24.5" y="-226.5" width="49" height="453" rx="24.5" fill="#ffffff" />
      </g>

      {/* Mikrofon */}
      <rect x="429" y="406" width="166" height="124" rx="53" fill="#ffffff" />
      {/* Izgara çizgileri */}
      <rect x="458" y="427" width="108" height="6" rx="3" fill="#ffffff" opacity="0.70" />
      <rect x="458" y="452" width="108" height="6" rx="3" fill="#ffffff" opacity="0.70" />
      <rect x="458" y="477" width="108" height="6" rx="3" fill="#ffffff" opacity="0.70" />
      <rect x="458" y="502" width="108" height="6" rx="3" fill="#ffffff" opacity="0.70" />
      {/* Gövde ve kaide */}
      <rect x="490" y="543" width="43" height="69" rx="21.5" fill="#ffffff" />
      <rect x="450" y="625" width="124" height="19" rx="9.5" fill="#ffffff" />
    </IconBase>
  );
}
