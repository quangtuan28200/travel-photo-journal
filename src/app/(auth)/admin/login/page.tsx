import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getAdminUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white/75 p-6 shadow-soft ring-1 ring-ink/5">
        <p className="text-sm uppercase tracking-[0.2em] text-tide">Admin</p>
        <h1 className="mt-3 text-3xl font-semibold">Đăng nhập quản trị</h1>
        <p className="mt-3 text-sm leading-6 text-ink/62">Nhập email nằm trong ADMIN_EMAILS để nhận magic link đăng nhập.</p>
        <LoginForm />
      </div>
    </main>
  );
}
