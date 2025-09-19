// components/nav-link.tsx (örnek)
import { cx } from "@/lib/ui/cx";
import Link from "next/link";

type Props = {
  href: string;
  title?: string;
  active?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function NavLink({ href, title, active, className, children }: Props) {
  return (
    <Link
      href={href}
      title={title}
      aria-current={active ? "page" : undefined}
      className={cx(
        "inline-flex items-center gap-2 h-9 rounded-xl px-3 text-sm",
        "select-none cursor-pointer",        // 👈 garanti
        active ? "bg-white/15" : "hover:bg-white/10",
        "border border-white/15 text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
