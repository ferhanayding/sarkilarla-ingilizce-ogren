export function ListSkeleton() {
  return (
    <div className="grid sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-md bg-[rgb(var(--brand2,49_60_75))]/70 animate-pulse my-1"
        />
      ))}
    </div>
  );
}
