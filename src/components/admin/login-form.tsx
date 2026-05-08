"use client";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { NoticeMessage, type Notice } from "@/components/notice";
import { buttonClass, inputClass } from "@/components/ui";
import { getClientErrorMessage } from "@/lib/client-api";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      setNotice(
        error
          ? { tone: "error", message: error.message }
          : { tone: "success", message: "Đã gửi magic link. Kiểm tra email để đăng nhập." }
      );
    } catch (error) {
      setNotice({ tone: "error", message: getClientErrorMessage(error, "Không thể gửi magic link.") });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Email
        <input
          className={inputClass}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>
      <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "w-full")}>
        {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Mail size={18} aria-hidden />}
        Gửi magic link
      </button>
      <NoticeMessage notice={notice} />
    </form>
  );
}
