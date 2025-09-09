export function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" {...props}>
      <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" fill="currentColor" opacity=".12" />
      <path d="M12 8.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" fill="currentColor" />
      <path d="M11 10.5h2v7h-2z" fill="currentColor" />
    </svg>
  );
}