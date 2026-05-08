import { redirect } from "next/navigation";
import { Camera } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { surfaceClass } from "@/components/ui";
import { getAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getAdminUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className={surfaceClass("w-full max-w-md p-6 sm:p-7")}>
        <span className="grid size-12 place-items-center rounded-lg bg-ink text-paper shadow-panel">
          <Camera size={21} aria-hidden />
        </span>
        <p className="mt-6 text-sm font-semibold uppercase text-tide">Admin</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Đăng nhập quản trị</h1>
        <p className="mt-3 text-sm leading-6 text-ink/64">
          Nhập email trong danh sách quản trị để nhận magic link đăng nhập.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
