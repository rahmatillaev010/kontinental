import { Shield } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const rules = [
  "Уважать участников, администрацию и кандидатов.",
  "Не публиковать личные данные других людей без разрешения.",
  "Не оскорблять, не провоцировать и не устраивать конфликты в чате.",
  "Следить за честной игрой и не использовать запрещённые способы победы.",
  "Заявки проходят проверку: анкета не означает автоматическое вступление.",
  "Администрация может редактировать данные участника перед публикацией.",
  "При уходе из состава участник может быть перенесён в архив."
];

export default function RulesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Shield}
        eyebrow="Кодекс"
        title="Правила"
        description="Спокойные правила для сильного состава: порядок, уважение и честность."
      />

      <section className="mt-12 space-y-3">
        {rules.map((rule, index) => (
          <article className="royal-border flex gap-4 rounded-lg p-4" key={rule}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold/35 bg-gold/10 text-sm font-bold text-gold-soft">
              {index + 1}
            </span>
            <p className="leading-7 text-silver">{rule}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
