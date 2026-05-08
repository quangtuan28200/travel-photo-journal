import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TripForm } from "@/components/admin/trip-form";

export default function NewTripPage() {
  return (
    <section>
      <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft size={16} aria-hidden />
        Albums
      </Link>
      <h1 className="mb-6 text-3xl font-semibold">Album mới</h1>
      <TripForm />
    </section>
  );
}
