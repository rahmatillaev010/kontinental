import { AlertTriangle, CheckCircle, Mic, Shield, Swords } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

const entryCriteria = [
  "КБ рейтинг: ранг Мастер.",
  "БО рейтинг: ранг Мастер.",
  "Возраст от 16 лет.",
  "Микрофон обязателен.",
  "Активность в беседе обязательна.",
  "2к+ ОС в неделю.",
  "Неделя на смену ника.",
  "2 шармы лидеру."
];

const guildRules = [
  {
    title: "Уважение",
    text: "Участники гильдии обязаны быть адекватными и относиться к гильдии с уважением и пониманием."
  },
  {
    title: "Токсичность",
    text: "Первое нарушение получает предупреждение. Повторное нарушение приводит к кику."
  },
  {
    title: "Конфликты",
    text: "Все конфликты решаются только в личных сообщениях. Гильдия не должна страдать из-за личных ссор."
  },
  {
    title: "Серьёзные ситуации",
    text: "При серьёзных недопониманиях нужно сообщать лидеру или администрации."
  },
  {
    title: "Нация и религия",
    text: "Оскорбление нации или религии приводит к перманентному кику из гильдии."
  },
  {
    title: "Файлы и софт",
    text: "Создание или продажа сторонних файлов запрещена: софты, усилители, накрутка и похожие нарушения."
  },
  {
    title: "Администрация",
    text: "Оскорбление администрации чата наказуемо. Возможны предупреждение, мут, кик или бан в зависимости от тяжести нарушения."
  }
];

const meatRules = [
  "Форматы: 4/4 и 6/6.",
  "Оружие: дробовик, дигл, дистанция 10 м.",
  "Навыки: Алок, Келли, Моко, Каролина.",
  "ПК только по договору.",
  "Поднимать нельзя, если это запрещено условиями комнаты.",
  "Правила читаются до анкеты, чтобы кандидат понимал порядок."
];

export default function RulesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        icon={Shield}
        eyebrow="Критерии и кодекс"
        title="Правила гильдии"
        description="Критерии для вступления и спокойные правила Континенталя: уважение, активность, честная игра и порядок."
      />

      <section className="mt-12 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="royal-border rounded-lg p-6">
          <div className="mb-5 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-gold" aria-hidden />
            <h2 className="font-display text-3xl text-white">Критерии для вступления</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {entryCriteria.map((rule) => (
              <div className="rounded-lg border border-gold/20 bg-gold/10 px-4 py-3 text-sm font-semibold text-gold-soft" key={rule}>
                {rule}
              </div>
            ))}
          </div>
        </article>

        <article className="royal-border rounded-lg p-6">
          <div className="mb-5 flex items-center gap-3">
            <Swords className="h-6 w-6 text-gold" aria-hidden />
            <h2 className="font-display text-3xl text-white">Правила КВ / мясо</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {meatRules.map((rule) => (
              <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 leading-7 text-silver" key={rule}>
                {rule}
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {guildRules.map((rule) => (
          <article className="combat-rule-card" key={rule.title}>
            <AlertTriangle className="h-5 w-5 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-2xl text-white">{rule.title}</h2>
            <p className="mt-3 leading-7 text-silver">{rule.text}</p>
          </article>
        ))}
      </section>

      <section className="page-band mt-12 rounded-lg border border-white/10">
        <div className="grid gap-6 p-6 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
            <Mic className="h-7 w-7" aria-hidden />
          </span>
          <div>
            <h2 className="font-display text-3xl text-white">Как вступить</h2>
            <p className="mt-3 leading-7 text-silver">
              Кандидат сначала читает правила, потом заполняет анкету. Заявка приходит в админ-панель, руководство проверяет данные и связывается с игроком.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
