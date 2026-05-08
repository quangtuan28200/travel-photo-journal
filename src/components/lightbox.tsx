"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { buttonClass, cx } from "@/components/ui";

export type LightboxPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  width?: number | null;
  height?: number | null;
};

export function Lightbox({ photos }: { photos: LightboxPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index === null ? index : (index + 1) % photos.length));
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) => (index === null ? index : (index - 1 + photos.length) % photos.length));
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, photos.length]);

  return (
    <>
      <div className="masonry">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="masonry-item group w-full overflow-hidden rounded-lg border border-ink/10 bg-linen/80 text-left shadow-panel transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-editorial focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-tide/25"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width ?? 1200}
              height={photo.height ?? 800}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.025]"
            />
            {photo.caption ? <span className="block px-4 py-3 text-sm leading-6 text-ink/65">{photo.caption}</span> : null}
          </button>
        ))}
      </div>

      {activePhoto && activeIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/94 p-4" role="dialog" aria-modal="true">
          <button type="button" className={cx(buttonClass("secondary", "absolute right-4 top-4 size-11 rounded-full px-0 bg-white/10 text-white hover:bg-white/20"), "border-white/15")} onClick={() => setActiveIndex(null)} aria-label="Đóng">
            <X size={22} aria-hidden />
          </button>
          <button
            type="button"
            className={cx(buttonClass("secondary", "absolute left-4 top-1/2 size-11 -translate-y-1/2 rounded-full px-0 bg-white/10 text-white hover:bg-white/20"), "border-white/15")}
            onClick={() => setActiveIndex((activeIndex - 1 + photos.length) % photos.length)}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={26} aria-hidden />
          </button>
          <figure className="max-h-[88vh] max-w-6xl">
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={activePhoto.width ?? 2000}
              height={activePhoto.height ?? 1333}
              sizes="100vw"
              className="max-h-[78vh] w-auto rounded-lg object-contain shadow-editorial"
              priority
            />
            {activePhoto.caption ? <figcaption className="mt-4 text-center text-sm leading-6 text-white/80">{activePhoto.caption}</figcaption> : null}
          </figure>
          <button
            type="button"
            className={cx(buttonClass("secondary", "absolute right-4 top-1/2 size-11 -translate-y-1/2 rounded-full px-0 bg-white/10 text-white hover:bg-white/20"), "border-white/15")}
            onClick={() => setActiveIndex((activeIndex + 1) % photos.length)}
            aria-label="Ảnh sau"
          >
            <ChevronRight size={26} aria-hidden />
          </button>
        </div>
      ) : null}
    </>
  );
}
