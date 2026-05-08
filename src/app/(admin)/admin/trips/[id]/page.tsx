import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TripForm } from "@/components/admin/trip-form";
import { getAdminTrip } from "@/lib/trips";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditTripPage({ params }: Props) {
  const { id } = await params;
  const trip = await getAdminTrip(id);

  if (!trip) {
    notFound();
  }

  return (
    <section>
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Albums
      </Link>
      <h1 className="mb-6 text-3xl font-semibold">Sửa album</h1>
      <TripForm trip={trip} />
    </section>
  );
}
