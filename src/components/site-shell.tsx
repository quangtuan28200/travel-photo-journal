import Link from "next/link";
import { Camera, LockKeyhole } from "lucide-react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-ink text-paper">
            <Camera size={20} aria-hidden />
          </span>
          <span>
            <span className="block text-sm uppercase tracking-[0.18em] text-ink/55">Travel Journal</span>
            <span className="block text-lg font-semibold">Ảnh qua những chuyến đi</span>
          </span>
        </Link>
        <Link
          href="/admin"
          className="inline-flex size-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 text-ink shadow-sm transition hover:bg-white"
          aria-label="Admin"
        >
          <LockKeyhole size={18} aria-hidden />
        </Link>
      </header>
      {children}
    </main>
  );
}
