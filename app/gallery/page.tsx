import type { Metadata } from "next";
import { GalleryHorizontal } from "lucide-react";
import { GalleryWall } from "@/components/gallery-wall";
import { SectionHeading } from "@/components/section-heading";
import { getGalleryItems } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Галерея",
  description: "Галерея моментов, скриншотов и визуальной истории гильдии Континенталь.",
  path: "/gallery"
});

export default async function GalleryPage() {
  const gallery = await getGalleryItems();

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={GalleryHorizontal}
        eyebrow="Витрина"
        title="Галерея"
        description="Место для скриншотов, турнирных моментов, обложек и памятных изображений гильдии."
      />

      <GalleryWall items={gallery} />
    </main>
  );
}
