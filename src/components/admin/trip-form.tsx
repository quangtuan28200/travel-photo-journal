"use client";

import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NoticeMessage, type Notice } from "@/components/notice";
import { getClientErrorMessage, requestJson } from "@/lib/client-api";
import { slugify } from "@/lib/slug";
import type { Trip } from "@/lib/types";

type TripFormProps = {
  trip?: Trip;
};

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
    <form className="grid gap-5 rounded-lg bg-white/70 p-5 shadow-sm ring-1 ring-ink/5" onSubmit={submit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Tên album
          <input className="rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 focus:ring-4" value={title} onChange={(event) => syncTitle(event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Slug
          <input className="rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 focus:ring-4" value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Địa điểm
          <input className="rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 focus:ring-4" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium">
            Ngày bắt đầu
            <input className="rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 focus:ring-4" type="date" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Ngày kết thúc
            <input className="rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 focus:ring-4" type="date" value={endedAt} onChange={(event) => setEndedAt(event.target.value)} />
          </label>
        </div>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Mô tả
        <textarea className="min-h-36 rounded-md border border-ink/10 bg-white px-3 py-3 outline-none ring-tide/30 focus:ring-4" value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input className="size-4 accent-ink" type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} />
        Xuất bản album
      </label>
      <NoticeMessage notice={notice} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-paper transition hover:bg-ink/90 disabled:opacity-60">
          {isSubmitting ? <Loader2 className="animate-spin" size={18} aria-hidden /> : <Save size={18} aria-hidden />}
          Lưu album
        </button>
        {trip ? (
          <>
            <button type="button" onClick={() => router.push(`/admin/trips/${trip.id}/photos`)} className="inline-flex items-center gap-2 rounded-md border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:bg-paper">
              <Upload size={18} aria-hidden />
              Quản lý ảnh
            </button>
            <button type="button" onClick={deleteTrip} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md border border-clay/20 bg-clay/10 px-4 py-3 text-sm font-semibold text-clay transition hover:bg-clay/15 disabled:opacity-60">
              <Trash2 size={18} aria-hidden />
              Xoá
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}
