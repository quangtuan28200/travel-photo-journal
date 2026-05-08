export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-dashed border-ink/15 bg-white/45 p-8 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/65">{body}</p>
      </div>
    </div>
  );
}
