"use client";

import { Loader2, Star, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { photoUrl } from "@/components/photo-url";
import type { Photo, Trip } from "@/lib/types";

export function PhotoManager({ trip, photos }: { trip: Trip; photos: Photo[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!files?.length) {
      setStatus("Chọn ít nhất một ảnh.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    setIsUploading(true);
    setStatus(null);

    const response = await fetch(`/api/admin/trips/${trip.id}/photos`, {
      method: "POST",
      body: formData
    });
    const payload = await response.json();

    setIsUploading(false);
    setStatus(response.ok ? `Đã upload ${payload.photos.length} ảnh.` : payload.error ?? "Không thể upload ảnh.");
    router.refresh();
  }

  async function patchPhoto(photoId: string, input: { caption?: string; sort_order?: number; set_as_cover?: boolean }) {
    const response = await fetch(`/api/admin/photos/${photoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.error ?? "Không thể cập nhật ảnh.");
      return;
    }

    router.refresh();
  }

  async function deletePhoto(photoId: string) {
    if (!window.confirm("Xoá ảnh này?")) {
      return;
    }

    const response = await fetch(`/api/admin/photos/${photoId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const payload = await response.json();
      setStatus(payload.error ?? "Không thể xoá ảnh.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form className="rounded-lg bg-white/70 p-5 shadow-sm ring-1 ring-ink/5" onSubmit={upload}>
        <label className="grid gap-2 text-sm font-medium">
          Upload ảnh
          <input className="rounded-md border border-dashed border-ink/20 bg-white px-3 py-5" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple onChange={(event) => setFiles(event.target.files)} />
        </label>
        <button type="submit" disabled={isUploading} className="mt-4 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 disabled:opacity-60">
          {isUploading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Upload size={18} aria-hidden />}
          Upload
        </button>
        {status ? <p className="mt-3 text-sm text-ink/65">{status}</p> : null}
      </form>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <article key={photo.id} className="overflow-hidden rounded-lg bg-white/70 shadow-sm ring-1 ring-ink/5">
            <div className="aspect-[4/3] bg-ink/10">
              <img src={photoUrl(photo.r2_thumb_key)} alt={photo.caption ?? trip.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="space-y-3 p-4">
              <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
                Caption
                <textarea
                  className="min-h-20 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none ring-tide/30 focus:ring-4"
                  defaultValue={photo.caption ?? ""}
                  onBlur={(event) => patchPhoto(photo.id, { caption: event.target.value })}
                />
              </label>
              <label className="grid gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink/45">
                Thứ tự
                <input
                  className="rounded-md border border-ink/10 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink outline-none ring-tide/30 focus:ring-4"
                  type="number"
                  min="0"
                  defaultValue={photo.sort_order}
                  onBlur={(event) => patchPhoto(photo.id, { sort_order: Number(event.target.value) })}
                />
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => patchPhoto(photo.id, { set_as_cover: true })} className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-ink/10 bg-white px-3 py-2 text-sm font-semibold text-ink hover:bg-paper">
                  <Star size={16} aria-hidden />
                  Cover
                </button>
                <button type="button" onClick={() => deletePhoto(photo.id)} className="grid size-10 place-items-center rounded-md border border-clay/20 bg-clay/10 text-clay hover:bg-clay/15" aria-label="Xoá ảnh">
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
