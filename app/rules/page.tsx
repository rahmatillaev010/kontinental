import type { Metadata } from "next";
import { CheckCircle, Crown, Mic, Shield, Star, UserPlus, Users } from "lucide-react";
import { ApplicationModal } from "@/components/application-modal";
import { getMembers } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Вступление",
  description: "Правила вступления, критерии и анкета кандидата в гильдию Континенталь.",
  path: "/rules"
});

const cards = [
  {
    title: "Критерии вступления",
    icon: CheckCircle,
    lines: ["КБ — Мастер", "БО — Мастер", "Возраст от 16 лет", "Наличие микрофона"],
    badges: ["Мастер КБ", "Мастер БО", "16+", "Микрофон"]
  },
  {
    title: "Обязанности участника",
    icon: Shield,
    lines: ["Активность в беседе", "Минимум 2000 ОС каждую неделю", "Смена ника в течение недели", "Уважительное отношение к участникам"],
    badges: ["2К ОС", "Активность", "Уважение", "Смена ника"]
  },
  {
    title: "Правила гильдии",
    icon: Crown,
    lines: [
      "Соблюдать уважительное общение",
      "Конфликты решать только в личных сообщениях",
      "При серьёзных ситуациях обращаться к лидеру",
      "Оскорбления по национальному или религиозному признаку приводят к моментальному исключению"
    ],
    badges: ["Без токсичности", "Личные сообщения", "Уважение", "Перманентный кик"]
  }
];

const timeline = ["Ознакомление с правилами", "Заполнение анкеты", "Проверка администрацией", "Ответ лидера", "Вступление в гильдию"];

export default async function RulesPage() {
  const members = await getMembers("active");

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <article className="royal-border rounded-lg p-7 lg:sticky lg:top-28">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
            <UserPlus className="h-4 w-4" aria-hidden />
            Набор игроков
          </div>
          <h1 className="font-display text-5xl leading-tight text-white sm:text-6xl">Вступление в гильдию</h1>
          <p className="mt-5 leading-8 text-silver">
            Перед подачей заявки ознакомьтесь с требованиями и правилами гильдии. После проверки анкеты администрация свяжется с вами.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ApplicationModal buttonLabel="Подать заявку" />
            <a href="#guild-rules" className="button-secondary">
              <Shield className="h-4 w-4" aria-hidden />
              Правила гильдии
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              ["Участников", members.length.toString(), Users],
              ["Онлайн", "24/7", Star],
              ["Мин. возраст", "16+", UserPlus],
              ["Мин. ранг", "Мастер", Crown]
            ].map(([label, value, Icon]) => (
              <div className="rounded-lg border border-gold/20 bg-gold/10 p-4" key={label as string}>
                <Icon className="mb-3 h-5 w-5 text-gold" aria-hidden />
                <p className="font-display text-2xl text-white">{value as string}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-silver">{label as string}</p>
              </div>
            ))}
          </div>
        </article>

        <div className="grid gap-4 md:grid-cols-2" id="guild-rules">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="combat-rule-card flex min-h-[21rem] flex-col p-7" key={card.title}>
                <Icon className="h-6 w-6 text-gold" aria-hidden />
                <h2 className="mt-4 font-display text-3xl text-white">{card.title}</h2>
                <ul className="mt-4 flex-1 space-y-2 leading-7 text-silver">
                  {card.lines.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.badges.map((badge) => (
                    <span className="rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-soft" key={badge}>
                      {badge}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}

          <article className="combat-rule-card flex min-h-[21rem] flex-col p-7">
            <Mic className="h-6 w-6 text-gold" aria-hidden />
            <h2 className="mt-4 font-display text-3xl text-white">Этапы вступления</h2>
            <div className="mt-5 flex-1 space-y-4">
              {timeline.map((item, index) => (
                <div className="flex gap-3" key={item}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-sm font-bold text-gold-soft">
                    {index + 1}
                  </span>
                  <p className="pt-1 leading-7 text-silver">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Анкета", "Проверка", "Ответ", "Принятие"].map((badge) => (
                <span className="rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-soft" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
