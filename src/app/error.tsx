"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { NoticeMessage } from "@/components/notice";
import { buttonClass, surfaceClass } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-12 sm:px-6">
      <div className={surfaceClass("p-6 sm:p-7")}>
        <p className="text-sm font-semibold uppercase text-tide">Lỗi hệ thống</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Đã có lỗi xảy ra</h1>
        <NoticeMessage
          className="mt-4"
          notice={{ tone: "error", message: "Không thể tải trang. Vui lòng thử lại." }}
        />
        <button type="button" onClick={reset} className={buttonClass("primary", "mt-5")}>
          <RotateCcw size={17} aria-hidden />
          Thử lại
        </button>
      </div>
    </main>
  );
}
