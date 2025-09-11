import Link from "next/link";

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <main className="min-h-dvh grid place-items-center bg-brand3 text-white">
      <div className="w-full max-w-md mx-auto rounded-2xl border border-rose-400/25 bg-rose-500/10 backdrop-blur-sm p-6 shadow-[0_10px_40px_rgba(0,0,0,.45)] text-center">
        <div className="text-2xl font-extrabold">Bir şeyler ters gitti</div>
        <p className="mt-2 text-white/80 break-words">{message ?? "Beklenmeyen bir hata oluştu."}</p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="h-9 px-3 rounded-lg text-sm border border-white/15 bg-white/10 hover:bg-white/20"
            >
              Tekrar dene
            </button>
          )}
          <Link
            href="/"
            className="h-9 px-3 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    </main>
  );
}
