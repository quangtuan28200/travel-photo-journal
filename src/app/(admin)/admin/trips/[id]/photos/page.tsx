import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PhotoManager } from "@/components/admin/photo-manager";
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
      <Link href={`/admin/trips/${trip.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Sửa album
      </Link>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Ảnh trong {trip.title}</h1>
        <p className="mt-2 text-sm text-ink/62">Upload, đặt caption, chọn cover và xoá ảnh.</p>
      </div>
      <PhotoManager trip={trip} photos={trip.photos} r2PublicUrl={r2PublicUrl} />
    </section>
  );
}
