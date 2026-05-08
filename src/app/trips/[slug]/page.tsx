import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Images, MapPin } from "lucide-react";
import { photoUrl } from "@/components/photo-url";
import { Lightbox } from "@/components/lightbox";
import { SiteShell } from "@/components/site-shell";
import { buttonClass, surfaceClass } from "@/components/ui";
import { getPublishedTripBySlug } from "@/lib/trips";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getPublishedTripBySlug(slug);

  if (!trip) {
    return {
      title: "Không tìm thấy chuyến đi"
    };
  }

  return {
    title: trip.title,
    description: trip.description ?? `Ảnh du lịch tại ${trip.location ?? trip.title}`
  };
}

function formatFullDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getPublishedTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const dateText = [formatFullDate(trip.started_at), formatFullDate(trip.ended_at)].filter(Boolean).join(" - ");

  return (
    <SiteShell>
      <Link href="/" className={buttonClass("ghost", "mb-7 w-fit px-0 hover:bg-transparent")}>
        <ArrowLeft size={16} aria-hidden />
        Tất cả chuyến đi
      </Link>

      <section className="mb-9 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-tide">Album du lịch</p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.03] text-ink sm:text-7xl">{trip.title}</h1>
          {trip.description ? <p className="mt-5 max-w-3xl text-base leading-7 text-ink/68 sm:text-lg">{trip.description}</p> : null}
        </div>
        <aside className={surfaceClass("p-5")}>
          <div className="grid gap-4 text-sm text-ink/68">
            {trip.location ? (
              <p className="flex items-center gap-2">
                <MapPin size={17} className="text-tide" aria-hidden />
                {trip.location}
              </p>
            ) : null}
            {dateText ? (
              <p className="flex items-center gap-2">
                <CalendarDays size={17} className="text-tide" aria-hidden />
                {dateText}
              </p>
            ) : null}
            <p className="flex items-center gap-2">
              <Images size={17} className="text-tide" aria-hidden />
              {trip.photos.length} ảnh
            </p>
          </div>
        </aside>
      </section>

      {trip.photos.length ? (
        <Lightbox
          photos={trip.photos.map((photo) => ({
            id: photo.id,
            src: photoUrl(photo.r2_large_key),
            alt: photo.caption ?? trip.title,
            caption: photo.caption,
            width: photo.width,
            height: photo.height
          }))}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-ink/15 bg-linen/70 p-8 text-center text-sm text-ink/60">
          Album này chưa có ảnh.
        </div>
      )}
    </SiteShell>
  );
}
