"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

export function GalleryWall({ items }: { items: GalleryItem[] }) {
  const visibleItems = useMemo(() => items.filter((item) => item.is_visible !== false), [items]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : visibleItems[activeIndex] ?? null;

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowRight") setActiveIndex((index) => (index === null ? index : (index + 1) % visibleItems.length));
      if (event.key === "ArrowLeft") setActiveIndex((index) => (index === null ? index : (index - 1 + visibleItems.length) % visibleItems.length));
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, visibleItems.length]);

  function move(direction: -1 | 1) {
    setActiveIndex((index) => {
      if (index === null) return index;
      return (index + direction + visibleItems.length) % visibleItems.length;
    });
  }

  return (
    <>
      <section className="gallery-wall">
        {visibleItems.map((item, index) => (
          <button type="button" className="gallery-tile" key={item.id} onClick={() => setActiveIndex(index)}>
            <span className="gallery-tile-media">
              <img src={item.image_url} alt={item.title} loading={index < 2 ? "eager" : "lazy"} decoding="async" />
              <span className="gallery-tile-action">
                <Maximize2 className="h-4 w-4" aria-hidden />
              </span>
            </span>
            <span className="gallery-tile-copy">
              <span>{item.title}</span>
              {item.description ? <small>{item.description}</small> : null}
            </span>
          </button>
        ))}
      </section>

      {activeItem ? (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={activeItem.title}>
          <button type="button" className="gallery-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Закрыть">
            <X className="h-5 w-5" aria-hidden />
          </button>

          {visibleItems.length > 1 ? (
            <>
              <button type="button" className="gallery-lightbox-nav is-left" onClick={() => move(-1)} aria-label="Предыдущее фото">
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button type="button" className="gallery-lightbox-nav is-right" onClick={() => move(1)} aria-label="Следующее фото">
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </>
          ) : null}

          <figure className="gallery-lightbox-frame">
            <img src={activeItem.image_url} alt={activeItem.title} />
            <figcaption>
              <span>{activeItem.title}</span>
              {activeItem.description ? <small>{activeItem.description}</small> : null}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
