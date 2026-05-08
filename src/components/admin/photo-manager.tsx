"use client";

import { ImagePlus, Loader2, Star, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NoticeMessage, type Notice } from "@/components/notice";
import { buttonClass, inputClass, surfaceClass, textareaClass } from "@/components/ui";
import { getClientErrorMessage, requestJson } from "@/lib/client-api";
import type { Photo, Trip } from "@/lib/types";

function buildPhotoUrl(r2PublicUrl: string, key: string) {
  return `${r2PublicUrl}/${key}`;
}

export function PhotoManager({ trip, photos, r2PublicUrl }: { trip: Trip; photos: Photo[]; r2PublicUrl: string }) {
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!files?.length) {
      setNotice({ tone: "error", message: "Chọn ít nhất một ảnh." });
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    setIsUploading(true);
    setNotice(null);

    try {
      const payload = await requestJson<{ photos: Photo[] }>(
        `/api/admin/trips/${trip.id}/photos`,
        {
          method: "POST",
          body: formData
        },
        "Không thể upload ảnh."
      );

      setNotice({ tone: "success", message: `Đã upload ${payload.photos.length} ảnh.` });
      router.refresh();
    } catch (error) {
      setNotice({ tone: "error", message: getClientErrorMessage(error, "Không thể upload ảnh.") });
    } finally {
      setIsUploading(false);
    }
  }

  async function patchPhoto(photoId: string, input: { caption?: string; sort_order?: number; set_as_cover?: boolean }) {
    setNotice(null);

    try {
      await requestJson<{ photo: Photo }>(
        `/api/admin/photos/${photoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(input)
        },
        "Không thể cập nhật ảnh."
      );

      router.refresh();
    } catch (error) {
      setNotice({ tone: "error", message: getClientErrorMessage(error, "Không thể cập nhật ảnh.") });
    }
  }

  async function deletePhoto(photoId: string) {
    if (!window.confirm("Xoá ảnh này?")) {
      return;
    }

    setNotice(null);

    try {
      await requestJson<{ ok: true }>(
        `/api/admin/photos/${photoId}`,
        {
          method: "DELETE"
        },
        "Không thể xoá ảnh."
      );

      router.refresh();
    } catch (error) {
      setNotice({ tone: "error", message: getClientErrorMessage(error, "Không thể xoá ảnh.") });
    }
  }

  return (
    <div className="space-y-6">
      <form className={surfaceClass("grid gap-4 p-5 sm:p-6")} onSubmit={upload}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Upload ảnh</h2>
            <p className="mt-1 text-sm leading-6 text-ink/60">Hỗ trợ JPEG, PNG, WebP, HEIC và HEIF. Ảnh sẽ được xử lý thành nhiều kích thước.</p>
          </div>
          <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-tide/20 bg-tide/10 px-3 text-sm font-semibold text-tide">
            <ImagePlus size={16} aria-hidden />
            {photos.length} ảnh
          </span>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Chọn ảnh
          <input
            className="rounded-lg border border-dashed border-ink/20 bg-white/90 px-3 py-5 text-sm shadow-sm file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:py-2 file:text-sm file:font-semibold file:text-paper hover:border-tide/40"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            onChange={(event) => setFiles(event.target.files)}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isUploading} className={buttonClass("primary")}>
            {isUploading ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Upload size={18} aria-hidden />}
            Upload
          </button>
          <NoticeMessage notice={notice} />
        </div>
      </form>

      {photos.length ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo.id} className={surfaceClass("overflow-hidden")}>
              <div className="relative aspect-[4/3] bg-sand/40">
                <Image
                  src={buildPhotoUrl(r2PublicUrl, photo.r2_thumb_key)}
                  alt={photo.caption ?? trip.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4 p-4">
                <label className="grid gap-2 text-xs font-semibold uppercase text-ink/50">
                  Caption
                  <textarea
                    className={`${textareaClass} min-h-20 normal-case`}
                    defaultValue={photo.caption ?? ""}
                    onBlur={(event) => patchPhoto(photo.id, { caption: event.target.value })}
                  />
                </label>
                <label className="grid gap-2 text-xs font-semibold uppercase text-ink/50">
                  Thứ tự
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    defaultValue={photo.sort_order}
                    onBlur={(event) => patchPhoto(photo.id, { sort_order: Number(event.target.value) })}
                  />
                </label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => patchPhoto(photo.id, { set_as_cover: true })} className={buttonClass("secondary", "flex-1")}>
                    <Star size={16} aria-hidden />
                    Cover
                  </button>
                  <button type="button" onClick={() => deletePhoto(photo.id)} className={buttonClass("danger", "size-11 px-0")} aria-label="Xoá ảnh">
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-lg border border-dashed border-ink/15 bg-linen/70 p-8 text-center text-sm text-ink/60">
          Album này chưa có ảnh. Upload ảnh đầu tiên để bắt đầu dựng gallery.
        </div>
      )}
    </div>
  );
}
