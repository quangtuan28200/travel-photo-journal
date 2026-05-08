import { Images } from "lucide-react";

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-[340px] items-center justify-center rounded-lg border border-dashed border-ink/15 bg-linen/70 p-8 text-center shadow-sm">
      <div className="max-w-md">
        <span className="mx-auto grid size-12 place-items-center rounded-lg bg-tide/10 text-tide">
          <Images size={22} aria-hidden />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-ink">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">{body}</p>
      </div>
    </div>
  );
}
