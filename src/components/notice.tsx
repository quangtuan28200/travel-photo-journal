import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cx } from "@/components/ui";

export type Notice = {
  tone: "error" | "success";
  message: string;
};

export function NoticeMessage({ notice, className = "" }: { notice: Notice | null; className?: string }) {
  if (!notice) {
    return null;
  }

  const isError = notice.tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <p
      role={isError ? "alert" : "status"}
      className={cx(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm leading-6 shadow-sm",
        isError ? "border-clay/25 bg-clay/10 text-clay" : "border-moss/20 bg-moss/10 text-moss",
        className
      )}
    >
      <Icon className="mt-0.5 shrink-0" size={16} aria-hidden />
      <span>{notice.message}</span>
    </p>
  );
}
