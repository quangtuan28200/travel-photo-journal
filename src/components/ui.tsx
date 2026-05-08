export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const focusRing = "outline-none transition focus-visible:ring-4 focus-visible:ring-tide/25";

export function buttonClass(
  variant: "primary" | "secondary" | "danger" | "ghost" = "primary",
  className = ""
) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-ink text-paper shadow-panel hover:bg-dusk",
    secondary: "border border-ink/10 bg-white/80 text-ink shadow-sm hover:bg-linen",
    danger: "border border-clay/25 bg-clay/10 text-clay hover:bg-clay/15",
    ghost: "text-ink/70 hover:bg-ink/5 hover:text-ink"
  };

  return cx(base, focusRing, variants[variant], className);
}

export const inputClass = cx(
  "min-h-11 rounded-lg border border-ink/10 bg-white/90 px-3 py-2.5 text-sm text-ink shadow-sm placeholder:text-ink/35",
  focusRing
);

export const textareaClass = cx(
  "rounded-lg border border-ink/10 bg-white/90 px-3 py-2.5 text-sm leading-6 text-ink shadow-sm placeholder:text-ink/35",
  focusRing
);

export function surfaceClass(className = "") {
  return cx("rounded-lg border border-ink/10 bg-white/80 shadow-panel backdrop-blur", className);
}

export function badgeClass(tone: "published" | "draft" | "neutral" = "neutral") {
  const tones = {
    published: "border-moss/20 bg-moss/10 text-moss",
    draft: "border-ink/10 bg-ink/5 text-ink/60",
    neutral: "border-tide/20 bg-tide/10 text-tide"
  };

  return cx("inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone]);
}
