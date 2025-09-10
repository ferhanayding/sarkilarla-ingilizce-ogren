function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-36 rounded-2xl bg-[rgb(var(--brand2,49_60_75))]/70 animate-pulse"
        />
      ))}
    </div>
  );
}