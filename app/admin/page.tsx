import { Settings } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import { SectionHeading } from "@/components/section-heading";

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
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
