import { Button } from "../../ui/button";

export function SegBtn({ active, onClick, label,className }: { active: boolean; onClick: () => void; label: string, className?: string }) {
  return (
    <Button
      onClick={onClick}
      className={[
        className,
        "h-9 px-3 rounded-lg text-sm border transition",
        active ? "bg-white/20 border-white/20 shadow-inner" : "bg-transparent border-transparent hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </Button>
  );
}