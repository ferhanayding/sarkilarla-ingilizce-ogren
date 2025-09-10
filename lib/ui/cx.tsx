// Daha esnek cx — clsx benzeri
export type ClassValue =
  | string
  | number
  | bigint
  | null
  | undefined
  | false
  | ClassValue[]
  | { [className: string]: any };

export function cx(...args: ClassValue[]): string {
  const out: string[] = [];

  const push = (val: ClassValue) => {
    if (!val) return; // null/undefined/false/0/0n → atla
    if (typeof val === "string") {
      out.push(val);
    } else if (Array.isArray(val)) {
      val.forEach(push);
    } else if (typeof val === "object") {
      for (const [k, v] of Object.entries(val)) {
        if (v) out.push(k);
      }
    }
    // number/bigint gelirse "0" gibi class yazmasın diye eklemiyoruz
  };

  args.forEach(push);
  return out.join(" ");
}
