import Link from "next/link";
import { CalendarDays, Images, MapPin } from "lucide-react";
import Image from "next/image";
import { photoUrl } from "@/components/photo-url";
import type { TripWithCover } from "@/lib/types";

function formatDateRange(trip: TripWithCover) {
  if (!trip.started_at && !trip.ended_at) {
    return "Chưa có ngày";
  }

  const formatter = new Intl.DateTimeFormat("vi-VN", {
    month: "short",
    year: "numeric"
  });
  const start = trip.started_at ? formatter.format(new Date(trip.started_at)) : null;
  const end = trip.ended_at ? formatter.format(new Date(trip.ended_at)) : null;

  return start && end && start !== end ? `${start} - ${end}` : start ?? end ?? "Chưa có ngày";
}

export function TripCard({ trip }: { trip: TripWithCover }) {
  const cover = trip.cover_photo;

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group overflow-hidden rounded-lg bg-white/70 shadow-soft ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:bg-white"
      data-testid="trip-card"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/10">
        {cover ? (
          <Image
            src={photoUrl(cover.r2_large_key)}
            alt={cover.caption ?? trip.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-moss/15 text-sm text-ink/55">Chưa có ảnh</div>
        )}
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-xl font-semibold leading-tight">{trip.title}</h2>
          {trip.description ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/62">{trip.description}</p> : null}
        </div>
        <div className="grid gap-2 text-sm text-ink/60">
          <span className="flex items-center gap-2">
            <MapPin size={16} aria-hidden />
            {trip.location ?? "Chưa có địa điểm"}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays size={16} aria-hidden />
            {formatDateRange(trip)}
          </span>
          <span className="flex items-center gap-2">
            <Images size={16} aria-hidden />
            {trip.photo_count} ảnh
          </span>
        </div>
      </div>
    </Link>
  );
}
