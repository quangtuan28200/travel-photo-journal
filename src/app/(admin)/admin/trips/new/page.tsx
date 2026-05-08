import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TripForm } from "@/components/admin/trip-form";
import { buttonClass } from "@/components/ui";

export default function NewTripPage() {
  return (
    <section>
      <Link href="/admin" className={buttonClass("ghost", "mb-6 w-fit px-0 hover:bg-transparent")}>
        <ArrowLeft size={16} aria-hidden />
        Albums
      </Link>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase text-tide">Album mới</p>
        <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Tạo chuyến đi</h1>
      </div>
      <TripForm />
    </section>
  );
}
