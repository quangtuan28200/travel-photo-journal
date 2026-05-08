"use client";

import { useRouter } from "next/navigation";
import { buttonClass } from "@/components/ui";
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
    <button type="button" onClick={logout} className={buttonClass("secondary", "size-11 px-0")} aria-label="Đăng xuất">
      {children}
    </button>
  );
}
