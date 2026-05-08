import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TripForm } from "@/components/admin/trip-form";
import { buttonClass } from "@/components/ui";
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
      <Link href="/admin" className={buttonClass("ghost", "mb-6 w-fit px-0 hover:bg-transparent")}>
        <ArrowLeft size={16} aria-hidden />
        Albums
      </Link>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-tide">Chỉnh sửa</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">{trip.title}</h1>
      </div>
      <TripForm trip={trip} />
    </section>
  );
}
