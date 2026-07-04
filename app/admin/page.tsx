import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SectionHeading } from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Админ-панель",
    description: "Закрытая панель управления сайтом гильдии Континенталь.",
    path: "/admin"
  }),
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-[118rem] px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Settings}
        eyebrow="Закрытый доступ"
        title="Админ-панель"
        description="Здесь администратор проверяет анкеты, публикует участников, управляет архивом, руководством и текстами сайта."
      />

      <section className="mt-12">
        <AdminPanel />
      </section>
    </main>
  );
}
