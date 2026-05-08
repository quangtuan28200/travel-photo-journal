import { EmptyState } from "@/components/empty-state";
import { SiteShell } from "@/components/site-shell";
import { TripCard } from "@/components/trip-card";
import { getPublishedTrips } from "@/lib/trips";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const trips = await getPublishedTrips();

  return (
    <SiteShell>
      <section className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.22em] text-tide">Bộ sưu tập cá nhân</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">Những nơi đã đi qua, giữ lại bằng ảnh.</h1>
        <p className="mt-5 text-base leading-7 text-ink/68 sm:text-lg">
          Mỗi album là một chuyến đi, gom lại những khung hình, địa điểm và câu chuyện đáng nhớ.
        </p>
      </section>

      {trips.length ? (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </section>
      ) : (
        <EmptyState title="Chưa có chuyến đi công khai" body="Đăng nhập admin để tạo album, upload ảnh và bật trạng thái xuất bản." />
      )}
    </SiteShell>
  );
}
