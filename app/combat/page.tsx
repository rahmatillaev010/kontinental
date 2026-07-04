import type { Metadata } from "next";
import { Crosshair, ScrollText, Shield, Swords, UserRound } from "lucide-react";
import { CombatRequestForm } from "@/components/combat-request-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "МЯСО / КВ",
  description: "Боевые правила, форматы комнат и заявка на МЯСО или КВ против Континенталя.",
  path: "/combat"
});

const meatSections = [
  { title: "Формат", items: ["4×4", "6×6"] },
  { title: "Оружие", items: ["Дробаш", "Дигл", "UMP"] },
  { title: "Правила", items: ["Неограниченные патроны", "Only Head", "Поднимать запрещено", "ПК по договорённости"] },
  { title: "Навыки", items: ["Алок", "Келли", "Моко", "Каролина"] }
];

const warSections = [
  { title: "Создание комнаты", items: ["4×4", "6×6 если смешка", "Эмулятор по договорённости", "Запасы запрещены", "Киберпосылка запрещена"] },
  { title: "Разрешённое оружие", items: ["Дигл", "UZI", "UMP", "AUG", "XM8", "Ястреб", "SVD", "AWM", "MP40", "AK47", "P90"] },
  { title: "Экономика", items: ["Ремкомплект — 0 монет", "Грибы — 0 монет", "Броня и шлем 2 уровня", "Улучшение до 3 уровня разрешено"] },
  { title: "Раунды", items: ["13 раундов", "Первый раунд — 2200 монет", "Остальные — Full Buy"] },
  { title: "Персонажи", items: ["Активные: Алок, Камиль", "Пассивные: Хаято, Волчара, Луна, Келли, Моко, Рафаэль, Итан, Мадияр, Флай, Максим, Леон, Форд, Лаура"] },
  { title: "Дополнительно", items: ["Гранаты запрещены", "Чипы запрещены", "ПК запрещён", "Перезаход запрещён", "Фабрика и дамба — только земля", "Контейнеры разрешены", "AWM — 1 на команду", "MP40 — 1 на команду", "Ожидание — 10 минут"] }
];

function RuleSection({ title, index, sections }: { title: string; index: string; sections: { title: string; items: string[] }[] }) {
  return (
    <section className="royal-border rounded-lg p-6 sm:p-8">
      <div className="mb-7 flex flex-wrap items-center gap-3">
        <Swords className="h-7 w-7 text-gold" aria-hidden />
        <h2 className="font-display text-4xl text-white">
          {index}. {title}
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <article className="combat-rule-card min-h-[12rem] p-5" key={section.title}>
            <div className="mb-4 flex items-center gap-3">
              <ScrollText className="h-5 w-5 text-gold" aria-hidden />
              <h3 className="font-display text-2xl text-white">{section.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span className="rounded-lg border border-gold/25 bg-gold/10 px-3 py-2 text-sm font-bold text-gold-soft" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CombatPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="mx-auto mb-12 max-w-3xl text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
          <Crosshair className="h-4 w-4" aria-hidden />
          МЯСО / КВ
        </div>
        <h1 className="font-display text-5xl text-white sm:text-6xl">Правила МЯСО / КВ</h1>
        <p className="mt-4 leading-8 text-silver">Ознакомьтесь с правилами выбранного режима перед участием в матчах.</p>
      </section>

      <RuleSection title="Правила МЯСО" index="1" sections={meatSections} />

      <div className="h-16 sm:h-24" />

      <RuleSection title="Правила КВ" index="2" sections={warSections} />

      <section className="royal-border mt-16 rounded-lg p-6 sm:p-8">
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <Shield className="h-7 w-7 text-gold" aria-hidden />
          <h2 className="font-display text-4xl text-white">Заявка на МЯСО / КВ</h2>
        </div>
        <CombatRequestForm />
      </section>
    </main>
  );
}
