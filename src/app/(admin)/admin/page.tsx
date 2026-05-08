import Link from "next/link";
import { Edit3, Eye, Images } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/empty-state";
import { photoUrl } from "@/components/photo-url";
import { getAdminTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const trips = await getAdminTrips();

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Albums</h1>
        <p className="mt-2 text-sm text-ink/62">Tạo, xuất bản và quản lý ảnh cho từng chuyến đi.</p>
      </div>
      {trips.length ? (
        <div className="grid gap-4">
          {trips.map((trip) => (
            <article key={trip.id} className="grid gap-4 rounded-lg bg-white/70 p-4 shadow-sm ring-1 ring-ink/5 sm:grid-cols-[180px_1fr_auto] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-ink/10">
                {trip.cover_photo ? (
                  <Image
                    src={photoUrl(trip.cover_photo.r2_thumb_key)}
                    alt={trip.title}
                    fill
                    sizes="180px"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{trip.title}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${trip.is_published ? "bg-moss/15 text-moss" : "bg-ink/10 text-ink/55"}`}>
                    {trip.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink/62">{trip.location ?? "Chưa có địa điểm"}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink/62">
                  <Images size={16} aria-hidden />
                  {trip.photo_count} ảnh
                </p>
              </div>
              <div className="flex gap-2">
                {trip.is_published ? (
                  <Link href={`/trips/${trip.slug}`} className="grid size-10 place-items-center rounded-md border border-ink/10 bg-white text-ink hover:bg-paper" aria-label="Xem public">
                    <Eye size={17} aria-hidden />
                  </Link>
                ) : null}
                <Link href={`/admin/trips/${trip.id}`} className="grid size-10 place-items-center rounded-md bg-ink text-paper hover:bg-ink/90" aria-label="Sửa album">
                  <Edit3 size={17} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Chưa có album" body="Tạo album đầu tiên, upload ảnh và bật trạng thái xuất bản để hiện ở trang chủ." />
      )}
    </section>
  );
}
