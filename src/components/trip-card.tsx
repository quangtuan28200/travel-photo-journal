import Link from "next/link";
import { CalendarDays, Images, MapPin } from "lucide-react";
import Image from "next/image";
import { photoUrl } from "@/components/photo-url";
import { cx } from "@/components/ui";
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

function MetaItem({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-ink/62">
      <Icon className="shrink-0 text-tide" size={15} aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}

export function TripCard({ trip, featured = false }: { trip: TripWithCover; featured?: boolean }) {
  const cover = trip.cover_photo;

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className={cx(
        "group block overflow-hidden rounded-lg border border-ink/10 bg-linen/80 shadow-panel transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-editorial focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tide/25",
        featured && "lg:grid lg:grid-cols-[1.2fr_0.8fr]"
      )}
      data-testid="trip-card"
    >
      <div className={cx("relative overflow-hidden bg-sand/40", featured ? "aspect-[16/11] lg:aspect-auto" : "aspect-[4/3]")}>
        {cover ? (
          <Image
            src={photoUrl(cover.r2_large_key)}
            alt={cover.caption ?? trip.title}
            fill
            sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-tide/10 text-sm font-medium text-ink/55">Chưa có ảnh</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/45 to-transparent opacity-80" aria-hidden />
      </div>
      <div className={cx("flex h-full flex-col justify-between p-5", featured && "sm:p-7")}>
        <div>
          <p className="text-xs font-semibold uppercase text-tide">Album du lịch</p>
          <h2 className={cx("mt-2 font-display font-semibold leading-tight text-ink", featured ? "text-3xl sm:text-4xl" : "text-2xl")}>{trip.title}</h2>
          {trip.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/65">{trip.description}</p> : null}
        </div>
        <div className="mt-5 grid gap-2 border-t border-ink/10 pt-4">
          <MetaItem icon={MapPin}>{trip.location ?? "Chưa có địa điểm"}</MetaItem>
          <MetaItem icon={CalendarDays}>{formatDateRange(trip)}</MetaItem>
          <MetaItem icon={Images}>{trip.photo_count} ảnh</MetaItem>
        </div>
      </div>
    </Link>
  );
}
