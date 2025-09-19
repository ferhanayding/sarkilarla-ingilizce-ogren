"use client";
import { useIsSmUp } from "@/app/hooks/useIsSmUp";
import { SearchIcon } from "../icons/search";
import { Input } from "../ui/button/input";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
  const isSmUp = useIsSmUp();

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Şarkı veya sanatçı ara…"
        size={isSmUp ? "lg" : "md"}
        variant="surface"
        rightIcon={
          <SearchIcon className="text-white" size={isSmUp ? 30 : 18} />
        }
      />
    </div>
  );
}
