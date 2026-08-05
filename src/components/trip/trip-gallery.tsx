"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { TripDetail } from "@/data/trip-details";

type TripGalleryProps = {
  images: NonNullable<TripDetail["gallery"]>;
};

export function TripGallery({ images }: TripGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const activePhotoNumber = activeIndex === null ? 0 : activeIndex + 1;

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight")
        setActiveIndex((index) =>
          index === null ? 0 : (index + 1) % images.length
        );
      if (event.key === "ArrowLeft")
        setActiveIndex((index) =>
          index === null ? 0 : (index - 1 + images.length) % images.length
        );
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  if (!images.length) return null;

  return (
    <section className="trip-detail-card trip-gallery-card" id="gallery">
      <div className="trip-section-title-row">
        <h2>Gallery</h2>
        <button
          className="gallery-open-button"
          type="button"
          onClick={() => setActiveIndex(0)}
        >
          View all photos ({images.length * 24})
        </button>
      </div>
      <div className="trip-gallery-strip">
        {images.map((image, index) => (
          <button
            type="button"
            onClick={() => setActiveIndex(index)}
            key={image.src}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 767px) 28vw, 180px"
            />
          </button>
        ))}
      </div>

      {activeImage && typeof document !== "undefined"
        ? createPortal(
            <div
              className="gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Trip photo viewer"
            >
              <button
                className="gallery-lightbox-backdrop"
                type="button"
                aria-label="Dismiss photo viewer"
                onClick={() => setActiveIndex(null)}
              />
              <div className="gallery-lightbox-panel">
                <div className="gallery-lightbox-topbar">
                  <p>
                    <span>
                      {activePhotoNumber} / {images.length}
                    </span>
                    {activeImage.alt}
                  </p>
                  <button
                    className="gallery-close"
                    type="button"
                    aria-label="Close photo viewer"
                    onClick={() => setActiveIndex(null)}
                  >
                    <X aria-hidden="true" size={24} />
                  </button>
                </div>
                {images.length > 1 ? (
                  <button
                    className="gallery-nav previous"
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setActiveIndex((index) =>
                        index === null
                          ? 0
                          : (index - 1 + images.length) % images.length
                      )
                    }
                  >
                    <ChevronLeft aria-hidden="true" size={28} />
                  </button>
                ) : null}
                <figure>
                  <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    sizes="100vw"
                    priority
                  />
                </figure>
                {images.length > 1 ? (
                  <button
                    className="gallery-nav next"
                    type="button"
                    aria-label="Next photo"
                    onClick={() =>
                      setActiveIndex((index) =>
                        index === null ? 0 : (index + 1) % images.length
                      )
                    }
                  >
                    <ChevronRight aria-hidden="true" size={28} />
                  </button>
                ) : null}
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}
