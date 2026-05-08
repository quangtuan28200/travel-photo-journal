import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PhotoManager } from "@/components/admin/photo-manager";
import { buttonClass } from "@/components/ui";
import { getPublicConfig } from "@/lib/config";
import { getAdminTrip } from "@/lib/trips";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PhotosPage({ params }: Props) {
  const { id } = await params;
  const trip = await getAdminTrip(id);
  const { r2PublicUrl } = getPublicConfig();

  if (!trip) {
    notFound();
  }

  return (
    <section>
      <Link href={`/admin/trips/${trip.id}`} className={buttonClass("ghost", "mb-6 w-fit px-0 hover:bg-transparent")}>
        <ArrowLeft size={16} aria-hidden />
        Sửa album
      </Link>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-tide">Thư viện ảnh</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Ảnh trong {trip.title}</h1>
        <p className="mt-2 text-sm leading-6 text-ink/64">Upload, đặt caption, chọn cover và xoá ảnh.</p>
      </div>
      <PhotoManager trip={trip} photos={trip.photos} r2PublicUrl={r2PublicUrl} />
    </section>
  );
}
