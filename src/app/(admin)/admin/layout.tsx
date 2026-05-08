import Link from "next/link";
import { Camera, LogOut, Plus } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { requireAdminUser } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminUser();

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-ink text-paper">
            <Camera size={20} aria-hidden />
          </span>
          <span>
            <span className="block text-sm uppercase tracking-[0.18em] text-ink/55">Admin</span>
            <span className="block text-lg font-semibold">Quản lý album</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/trips/new"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-ink/90"
          >
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
