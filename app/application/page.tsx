import { UserPlus } from "lucide-react";
import { ApplicationModal } from "@/components/application-modal";
import { SectionHeading } from "@/components/section-heading";

export default function ApplicationPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={UserPlus}
        eyebrow="Кандидат"
        title="Анкета"
        description="Заполненная анкета отправляется на проверку и получает статус pending. На сайте она появится только после публикации администратором."
      />

      <section className="mt-12 rounded-lg border border-gold/25 bg-gradient-to-br from-royal/35 to-black/30 p-6 text-center">
        <p className="mx-auto mb-6 max-w-2xl leading-7 text-silver">
          Открой форму, заполни основные данные, добавь фото при желании и отправь заявку. Администрация увидит её в панели проверки.
        </p>
        <ApplicationModal openOnMount buttonLabel="Открыть анкету" />
      </section>
    </main>
  );
}
