"use client";

import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo
      }
    });

    setIsSubmitting(false);
    setStatus(error ? error.message : "Đã gửi magic link. Kiểm tra email để đăng nhập.");
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm font-medium">
        Email
        <input
          className="rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 transition focus:ring-4"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Mail size={18} aria-hidden />}
        Gửi magic link
      </button>
      {status ? <p className="text-sm leading-6 text-ink/65">{status}</p> : null}
    </form>
  );
}
