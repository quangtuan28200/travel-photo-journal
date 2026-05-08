"use client";

import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NoticeMessage, type Notice } from "@/components/notice";
import { buttonClass, inputClass, surfaceClass, textareaClass } from "@/components/ui";
import { getClientErrorMessage, requestJson } from "@/lib/client-api";
import { slugify } from "@/lib/slug";
import type { Trip } from "@/lib/types";

type TripFormProps = {
  trip?: Trip;
};

function Field({ label, children, helper }: { label: string; children: React.ReactNode; helper?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-ink">
      {label}
      {children}
      {helper ? <span className="text-xs font-normal leading-5 text-ink/55">{helper}</span> : null}
    </label>
  );
}

export function TripForm({ trip }: TripFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(trip?.title ?? "");
  const [slug, setSlug] = useState(trip?.slug ?? "");
  const [location, setLocation] = useState(trip?.location ?? "");
  const [startedAt, setStartedAt] = useState(trip?.started_at ?? "");
  const [endedAt, setEndedAt] = useState(trip?.ended_at ?? "");
  const [description, setDescription] = useState(trip?.description ?? "");
  const [isPublished, setIsPublished] = useState(trip?.is_published ?? false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function syncTitle(value: string) {
    setTitle(value);

    if (!trip && !slug) {
      setSlug(slugify(value));
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice(null);

    try {
      const payload = await requestJson<{ trip: Trip }>(
        trip ? `/api/admin/trips/${trip.id}` : "/api/admin/trips",
        {
          method: trip ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            slug,
            location,
            started_at: startedAt,
            ended_at: endedAt,
            description,
            is_published: isPublished
          })
        },
        "Không thể lưu album."
      );

      router.push(`/admin/trips/${payload.trip.id}`);
      router.refresh();
    } catch (error) {
      setNotice({ tone: "error", message: getClientErrorMessage(error, "Không thể lưu album.") });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteTrip() {
    if (!trip || !window.confirm("Xoá album và toàn bộ ảnh trong album này?")) {
      return;
    }

    setIsSubmitting(true);
    setNotice(null);

    try {
      await requestJson<{ ok: true }>(
        `/api/admin/trips/${trip.id}`,
        {
          method: "DELETE"
        },
        "Không thể xoá album."
      );

      router.push("/admin");
      router.refresh();
    } catch (error) {
      setNotice({ tone: "error", message: getClientErrorMessage(error, "Không thể xoá album.") });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={surfaceClass("grid gap-6 p-5 sm:p-6")} onSubmit={submit}>
      <section className="grid gap-5">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Thông tin album</h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">Tên, đường dẫn và phần mô tả sẽ xuất hiện ở trang public.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Tên album">
            <input className={inputClass} value={title} onChange={(event) => syncTitle(event.target.value)} required />
          </Field>
          <Field label="Slug" helper="Dùng trong URL public của album.">
            <input className={inputClass} value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required />
          </Field>
          <Field label="Địa điểm">
            <input className={inputClass} value={location} onChange={(event) => setLocation(event.target.value)} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Ngày bắt đầu">
              <input className={inputClass} type="date" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} />
            </Field>
            <Field label="Ngày kết thúc">
              <input className={inputClass} type="date" value={endedAt} onChange={(event) => setEndedAt(event.target.value)} />
            </Field>
          </div>
        </div>
        <Field label="Mô tả" helper="Giữ ngắn gọn, thiên về câu chuyện và cảm xúc của chuyến đi.">
          <textarea className={`${textareaClass} min-h-36`} value={description} onChange={(event) => setDescription(event.target.value)} />
        </Field>
      </section>

      <section className="rounded-lg border border-ink/10 bg-linen/70 p-4">
        <label className="flex items-start gap-3 text-sm font-semibold text-ink">
          <input className="mt-1 size-4 accent-ink" type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
          <span>
            Xuất bản album
            <span className="mt-1 block text-xs font-normal leading-5 text-ink/58">Khi bật, album có thể xuất hiện ở trang chủ và đường dẫn public.</span>
          </span>
        </label>
      </section>

      <NoticeMessage notice={notice} />

      <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5">
        <button type="submit" disabled={isSubmitting} className={buttonClass("primary")}>
          {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Save size={18} aria-hidden />}
          Lưu album
        </button>
        {trip ? (
          <>
            <button type="button" onClick={() => router.push(`/admin/trips/${trip.id}/photos`)} className={buttonClass("secondary")}>
              <Upload size={18} aria-hidden />
              Quản lý ảnh
            </button>
            <button type="button" onClick={deleteTrip} disabled={isSubmitting} className={buttonClass("danger", "sm:ml-auto")}>
              <Trash2 size={18} aria-hidden />
              Xoá
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}
