import { ArrowRight, Images, MapPin } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { SiteShell } from "@/components/site-shell";
import { TripCard } from "@/components/trip-card";
import { buttonClass } from "@/components/ui";
import { getPublishedTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trips = await getPublishedTrips();
  const featuredTrip = trips[0];
  const remainingTrips = trips.slice(1);
  const photoCount = trips.reduce((total, trip) => total + trip.photo_count, 0);

  return (
    <SiteShell>
      <section className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-tide">Bộ sưu tập cá nhân</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-ink sm:text-7xl">
            Những nơi đã đi qua, giữ lại bằng ảnh.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-ink/68 sm:text-lg">
            Mỗi album là một chuyến đi, gom lại khung hình, địa điểm và câu chuyện đáng nhớ.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/10 bg-white/75 px-4 text-sm font-semibold text-ink shadow-sm">
              <MapPin size={17} className="text-tide" aria-hidden />
              {trips.length} chuyến đi
            </span>
            <span className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-ink/10 bg-white/75 px-4 text-sm font-semibold text-ink shadow-sm">
              <Images size={17} className="text-tide" aria-hidden />
              {photoCount} ảnh
            </span>
          </div>
        </div>

        {featuredTrip ? (
          <TripCard trip={featuredTrip} featured />
        ) : (
          <EmptyState title="Chưa có chuyến đi công khai" body="Đăng nhập admin để tạo album, upload ảnh và bật trạng thái xuất bản." />
        )}
      </section>

      {remainingTrips.length ? (
        <section aria-labelledby="gallery-heading">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-tide">Gallery</p>
              <h2 id="gallery-heading" className="mt-1 font-display text-3xl font-semibold text-ink">
                Các album khác
              </h2>
            </div>
            <a href="#content" className={buttonClass("ghost", "hidden sm:inline-flex")}>
              Xem từ đầu
              <ArrowRight size={16} aria-hidden />
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {remainingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
