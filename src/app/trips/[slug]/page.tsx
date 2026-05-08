import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { photoUrl } from "@/components/photo-url";
import { Lightbox } from "@/components/lightbox";
import { SiteShell } from "@/components/site-shell";
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
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Tất cả chuyến đi
      </Link>
      <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.72fr] lg:items-end">
        <div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{trip.title}</h1>
          {trip.description ? <p className="mt-5 max-w-3xl text-base leading-7 text-ink/68 sm:text-lg">{trip.description}</p> : null}
        </div>
        <div className="rounded-lg border border-ink/10 bg-white/55 p-5 text-sm text-ink/65">
          {trip.location ? (
            <p className="flex items-center gap-2">
              <MapPin size={17} aria-hidden />
              {trip.location}
            </p>
          ) : null}
          {dateText ? (
            <p className="mt-3 flex items-center gap-2">
              <CalendarDays size={17} aria-hidden />
              {dateText}
            </p>
          ) : null}
        </div>
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
        <div className="rounded-lg border border-dashed border-ink/15 bg-white/45 p-8 text-center text-sm text-ink/60">
          Album này chưa có ảnh.
        </div>
      )}
    </SiteShell>
  );
}
