import Link from "next/link";
import { Camera, LockKeyhole } from "lucide-react";
import { buttonClass } from "@/components/ui";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper" href="#content">
        Bỏ qua điều hướng
      </a>
      <header className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-ink/10 bg-linen/80 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-lg pr-2 outline-none transition focus-visible:ring-4 focus-visible:ring-tide/25">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-ink text-paper shadow-panel">
            <Camera size={20} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase text-tide">Travel Journal</span>
            <span className="block truncate text-base font-semibold text-ink sm:text-lg">Ảnh qua những chuyến đi</span>
          </span>
        </Link>
        <Link href="/admin" className={buttonClass("secondary", "size-11 shrink-0 px-0")} aria-label="Admin">
          <LockKeyhole size={18} aria-hidden />
        </Link>
      </header>
      <div id="content">{children}</div>
    </main>
  );
}
