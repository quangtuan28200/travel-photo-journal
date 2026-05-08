"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { NoticeMessage } from "@/components/notice";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className="rounded-lg bg-white/70 p-6 shadow-sm ring-1 ring-ink/5">
        <h1 className="text-3xl font-semibold">Đã có lỗi xảy ra</h1>
        <NoticeMessage
          className="mt-4"
          notice={{ tone: "error", message: "Không thể tải trang. Vui lòng thử lại." }}
        />
        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90"
        >
          <RotateCcw size={17} aria-hidden />
          Thử lại
        </button>
      </div>
    </main>
  );
}
