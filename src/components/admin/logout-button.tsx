"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex size-10 items-center justify-center rounded-md border border-ink/10 bg-white/60 text-ink shadow-sm transition hover:bg-white"
      aria-label="Đăng xuất"
    >
      {children}
    </button>
  );
}
