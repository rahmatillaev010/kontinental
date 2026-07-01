import { GalleryHorizontal } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const gallery = [
  { src: "/gallery/hall.svg", title: "Королевский зал" },
  { src: "/gallery/crest.svg", title: "Знак гильдии" },
  { src: "/gallery/archive.svg", title: "Архив состава" },
  { src: "/assets/hero-archive.png", title: "Штаб Континенталя" }
];

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={GalleryHorizontal}
        eyebrow="Витрина"
        title="Галерея"
        description="Место для скриншотов, турнирных моментов, обложек и памятных изображений гильдии."
      />

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        {gallery.map((item) => (
          <article className="group overflow-hidden rounded-lg border border-gold/25 bg-black/30" key={item.src}>
            <img src={item.src} alt={item.title} className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
            <div className="border-t border-white/10 p-4">
              <h2 className="font-display text-2xl text-white">{item.title}</h2>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
