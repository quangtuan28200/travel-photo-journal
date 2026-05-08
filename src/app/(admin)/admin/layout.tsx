import Link from "next/link";
import { Camera, LogOut, Plus } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { buttonClass } from "@/components/ui";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-ink/10 bg-linen/80 px-3 py-3 shadow-sm backdrop-blur sm:px-4">
        <Link href="/admin" className="flex min-w-0 items-center gap-3 rounded-lg pr-2 outline-none transition focus-visible:ring-4 focus-visible:ring-tide/25">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-ink text-paper shadow-panel">
            <Camera size={20} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-xs font-semibold uppercase text-tide">Admin</span>
            <span className="block truncate text-base font-semibold text-ink sm:text-lg">Quản lý album</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/admin/trips/new" className={buttonClass("primary")}>
            <Plus size={17} aria-hidden />
            Album mới
          </Link>
          <LogoutButton>
            <LogOut size={17} aria-hidden />
          </LogoutButton>
        </div>
      </header>
      {children}
    </main>
  );
}
