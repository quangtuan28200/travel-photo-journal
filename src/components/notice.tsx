import { AlertCircle, CheckCircle2 } from "lucide-react";

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
      className={[
        "flex items-start gap-2 rounded-md px-3 py-2 text-sm leading-6",
        isError ? "bg-clay/10 text-clay" : "bg-tide/10 text-ink",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon className="mt-0.5 shrink-0" size={16} aria-hidden />
      <span>{notice.message}</span>
    </p>
  );
}
