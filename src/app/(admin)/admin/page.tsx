import Link from "next/link";
import { Edit3, Eye, Images, MapPin } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/empty-state";
import { photoUrl } from "@/components/photo-url";
import { badgeClass, buttonClass, surfaceClass } from "@/components/ui";
import { getAdminTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const trips = await getAdminTrips();

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-tide">Dashboard</p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Albums</h1>
          <p className="mt-2 text-sm leading-6 text-ink/64">Tạo, xuất bản và quản lý ảnh cho từng chuyến đi.</p>
        </div>
        <span className="rounded-lg border border-ink/10 bg-white/75 px-3 py-2 text-sm font-semibold text-ink shadow-sm">
          {trips.length} album
        </span>
      </div>
      {trips.length ? (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <article key={trip.id} className={surfaceClass("grid gap-4 p-4 sm:grid-cols-[190px_1fr_auto] sm:items-center")}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand/40">
                {trip.cover_photo ? (
                  <Image
                    src={photoUrl(trip.cover_photo.r2_thumb_key)}
                    alt={trip.title}
                    fill
                    sizes="190px"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-sm font-medium text-ink/55">Chưa có ảnh</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-ink">{trip.title}</h2>
                  <span className={badgeClass(trip.is_published ? "published" : "draft")}>
                    {trip.is_published ? "Đã xuất bản" : "Bản nháp"}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink/62">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={16} className="text-tide" aria-hidden />
                    {trip.location ?? "Chưa có địa điểm"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Images size={16} className="text-tide" aria-hidden />
                    {trip.photo_count} ảnh
                  </span>
                </div>
              </div>
              <div className="flex gap-2 sm:justify-end">
                {trip.is_published ? (
                  <Link href={`/trips/${trip.slug}`} className={buttonClass("secondary", "size-11 px-0")} aria-label="Xem public">
                    <Eye size={17} aria-hidden />
                  </Link>
                ) : null}
                <Link href={`/admin/trips/${trip.id}`} className={buttonClass("primary", "size-11 px-0")} aria-label="Sửa album">
                  <Edit3 size={17} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Chưa có album" body="Tạo album đầu tiên, upload ảnh và bật trạng thái xuất bản để hiển thị ở trang chủ." />
      )}
    </section>
  );
}
