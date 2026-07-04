import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Crown,
  AlertTriangle,
  ScrollText,
  Shield,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { MemberCard } from "@/components/member-card";
import { RoyalHallWebGL } from "@/components/royal-hall-webgl";
import { getMembers, getPendingApplicationsCount, getRoles, getSiteContent } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";
import { getContentItem } from "@/lib/site-content";

export const metadata: Metadata = createPageMetadata({
  title: "Континенталь",
  description: "Главная сцена закрытого портала элитной гильдии Free Fire.",
  path: "/"
});

export const dynamic = "force-dynamic";

const guildJoinCards = [
  {
    title: "Критерии вступления",
    text: ["КБ: ранг Мастер", "БО: ранг Мастер", "Возраст от 16 лет", "Наличие микрофона"],
    points: ["Мастер КБ", "Мастер БО", "16+", "Микрофон"]
  },
  {
    title: "Что требуется",
    text: ["Быть активным в беседе", "Набирать минимум 2000 ОС каждую неделю", "Сменить ник в течение недели после вступления", "Уважительно относиться к участникам гильдии"],
    points: ["2К ОС", "Активность", "Уважение", "Неделя на ник"]
  },
  {
    title: "Правила гильдии",
    text: ["Соблюдать уважительное общение", "Конфликты решать только в личных сообщениях", "При серьёзных ситуациях обращаться к лидеру", "Оскорбления по национальному или религиозному признаку приводят к моментальному исключению"],
    points: ["Без токсичности", "Личные сообщения", "Уважение", "Перманентный кик"]
  },
  {
    title: "Как проходит вступление",
    text: ["Ознакомиться с правилами", "Заполнить анкету", "Дождаться проверки администрации", "Получить решение лидера"],
    points: ["Анкета", "Проверка", "Ответ лидера", "Вступление"]
  }
];

const portalSteps = [
  {
    icon: UserPlus,
    title: "1. Анкета",
    text: "Игрок заполняет форму. Данные не появляются на сайте сразу."
  },
  {
    icon: UserCheck,
    title: "2. Проверка",
    text: "Администратор открывает заявку, проверяет данные и исправляет ошибки."
  },
  {
    icon: CheckCircle,
    title: "3. Публикация",
    text: "После одобрения участник появляется в составе гильдии."
  },
  {
    icon: Archive,
    title: "4. Архив",
    text: "Если участник уходит, его можно перенести в архив или восстановить."
  }
];

export default async function HomePage() {
  const [members, roles, pendingCount, content] = await Promise.all([getMembers("active"), getRoles(), getPendingApplicationsCount(), getSiteContent()]);
  const leader = members.find((member) => member.role?.slug === "leader") ?? members[0];
  const deputy = members.find((member) => member.role?.slug === "deputy") ?? members.find((member) => member.id !== leader?.id);
  const leadership = [leader, deputy].filter(Boolean);
  const homeWelcome = getContentItem(content, "home_welcome");
  const homeManifest = getContentItem(content, "home_manifest");
  const foundation = getContentItem(content, "home_foundation");
  const discordLink = getContentItem(content, "home_discord_link");
  const tiktokLink = getContentItem(content, "home_tiktok_link");
  const leaderContact = getContentItem(content, "home_leader_contact");

  const socialLinks = [
    { icon: FaDiscord, label: "Discord", item: discordLink },
    { icon: SiTiktok, label: "TikTok", item: tiktokLink },
    { icon: FaTelegramPlane, label: "Telegram", item: leaderContact }
  ];

  return (
    <main className="cinematic-scroll">
      <nav className="scene-dots" aria-label="Переходы по главной">
        {[
          ["home", "Вход"],
          ["stats", "Сила"],
          ["leaders", "Лидеры"],
          ["join", "Вступление"],
          ["portal", "Портал"]
        ].map(([id, label], index) => (
          <a href={`#scene-${id}`} data-scene-dot={id} className={index === 0 ? "is-active" : undefined} key={id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{label}</strong>
          </a>
        ))}
      </nav>

      <section id="scene-home" data-scene="home" className="cinema-scene relative min-h-[86vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <RoyalHallWebGL />
          <img src="/assets/hero-archive.png" alt="" className="hero-image-motion relative z-0 h-full w-full object-cover opacity-65" />
          <div className="hero-vignette-motion absolute inset-0 z-10 bg-gradient-to-r from-obsidian/72 via-obsidian/42 to-obsidian/5" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-obsidian to-transparent" />
        </div>

        <div className="hero-social-panel absolute right-6 top-28 z-20 hidden w-[34rem] 2xl:block">
          <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Связь и переходы</p>
          <div className="mt-4 grid gap-3">
            {socialLinks.map(({ icon: Icon, item }) => (
              <a href={item.href || "#"} target={item.href && item.href !== "#" ? "_blank" : undefined} rel="noreferrer" className="hero-social-card" key={item.key}>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl text-white">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-silver">{item.body}</span>
                </span>
                <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-gold" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        <Link
          href="/rules"
          className="hero-contact-strip absolute bottom-8 right-0 z-20 hidden min-w-56 items-center justify-between rounded-l-lg border border-gold/25 bg-white px-5 py-4 text-sm font-bold text-black shadow-royal xl:flex"
        >
          Вступить в гильдию
          <ArrowUpRight className="h-5 w-5" aria-hidden />
        </Link>

        <div className="relative z-20 mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-7">
              <span className="intro-crown">
                <Crown className="h-12 w-12" aria-hidden />
              </span>
            </div>
            <div className="gold-rule mb-7" />
            <div className="hero-kicker mb-5 inline-flex items-center gap-2 rounded-lg border border-gold/35 bg-black/35 px-3 py-1 text-xs uppercase tracking-[0.24em] text-gold-soft backdrop-blur">
              <Crown className="h-4 w-4" aria-hidden />
              {homeWelcome.title}
            </div>
            <h1 className="hero-title font-display text-6xl leading-none text-white sm:text-7xl lg:text-8xl">Континенталь</h1>
            <p className="hero-copy mt-6 max-w-2xl text-lg leading-8 text-silver">{homeWelcome.body}</p>
            <div className="hero-note-card mt-5 max-w-2xl rounded-lg border border-gold/25 bg-black/35 p-4 backdrop-blur">
              <p className="font-display text-xl text-white">{homeManifest.title}</p>
              <p className="mt-2 leading-7 text-silver">{homeManifest.body}</p>
              <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold-soft">
                <Crown className="h-4 w-4" aria-hidden />
                {foundation.title}: {foundation.body}
              </p>
            </div>

            <div className="hero-actions mt-8 flex flex-wrap gap-3">
              <Link href="/rules" className="button-primary">
                <UserPlus className="h-4 w-4" aria-hidden />
                Заполнить анкету
              </Link>
              <Link href="/roles" className="button-secondary">
                <Shield className="h-4 w-4" aria-hidden />
                Руководство
              </Link>
              <Link href="/members" className="button-secondary">
                <Users className="h-4 w-4" aria-hidden />
                Участники
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:hidden">
              {socialLinks.map(({ icon: Icon, label, item }) => (
                <a href={item.href || "#"} target={item.href && item.href !== "#" ? "_blank" : undefined} rel="noreferrer" className="hero-mobile-service-card" key={item.key}>
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.18em] text-gold-soft">{label}</span>
                      <span className="mt-1 block font-bold">{item.title}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="scene-stats" data-scene="stats" className="cinema-scene page-band scroll-reveal">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-code justify-center">
              <Shield className="h-4 w-4" aria-hidden />
              Живая сводка
            </p>
            <h2 className="mt-4 font-display text-4xl text-white sm:text-6xl">Сила Континенталя</h2>
            <p className="mt-4 leading-8 text-silver">Каждый раздел портала собирает состав, должности и заявки в одну понятную систему.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="royal-border stat-card rounded-lg p-5">
              <Users className="mb-4 h-6 w-6 text-gold" aria-hidden />
              <p className="font-display text-4xl text-white">{members.length}</p>
              <p className="mt-1 text-sm text-silver">участников в активном составе</p>
            </div>
            <div className="royal-border stat-card rounded-lg p-5">
              <Shield className="mb-4 h-6 w-6 text-gold" aria-hidden />
              <p className="font-display text-4xl text-white">{roles.length}</p>
              <p className="mt-1 text-sm text-silver">должностей в руководстве и составе</p>
            </div>
            <div className="royal-border stat-card rounded-lg p-5">
              <Archive className="mb-4 h-6 w-6 text-gold" aria-hidden />
              <p className="font-display text-4xl text-white">{pendingCount}</p>
              <p className="mt-1 text-sm text-silver">анкет ждут проверки</p>
            </div>
          </div>
        </div>
      </section>

      <section id="scene-leaders" data-scene="leaders" className="cinema-scene mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
            <Crown className="h-4 w-4" aria-hidden />
            Руководство
          </div>
          <h2 className="font-display text-4xl text-white">Лидер и временный лидер</h2>
          <p className="mt-4 leading-7 text-silver">
            Эти карточки берутся из состава. Администратор может менять фото, имя, возраст, ник, ID и должность в админ-панели.
          </p>
        </div>

        <div className="scroll-stagger mt-10 grid gap-5 lg:grid-cols-2">
          {leadership.map((member) => (member ? <MemberCard member={member} key={member.id} /> : null))}
        </div>
      </section>

      <section id="scene-join" data-scene="join" className="cinema-scene page-band scroll-reveal">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="section-code">
                <UserPlus className="h-4 w-4" aria-hidden />
                Вступление
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl text-white sm:text-5xl">Вступление в гильдию</h2>
              <p className="mt-5 max-w-xl leading-8 text-silver">
                Перед подачей заявки ознакомьтесь с критериями вступления и правилами гильдии. После отправки анкеты администрация рассмотрит вашу заявку и свяжется с вами.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/rules" className="button-primary">
                  <UserPlus className="h-4 w-4" aria-hidden />
                  Подать заявку
                </Link>
                <Link href="/rules" className="button-secondary">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Правила гильдии
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {guildJoinCards.map((rule) => (
                <article className="combat-rule-card flex min-h-[17rem] flex-col" key={rule.title}>
                  <CheckCircle className="h-5 w-5 text-gold" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl text-white">{rule.title}</h3>
                  <ul className="mt-3 flex-1 space-y-2 leading-7 text-silver">
                    {rule.text.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {rule.points.map((point) => (
                      <span className="rounded-lg border border-gold/25 bg-gold/10 px-2.5 py-1 text-xs font-bold text-gold-soft" key={point}>
                        {point}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-red-400/35 bg-red-500/10 p-6 shadow-[0_0_45px_rgba(239,68,68,0.08)]">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-300/30 bg-red-500/15 text-red-200">
                <AlertTriangle className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-3xl text-white">Запрещено</h3>
                <p className="mt-3 max-w-4xl leading-8 text-red-100/90">
                  Запрещена реклама и продажа стороннего программного обеспечения, читов, усилителей, накруток, скриптов и любых других файлов. При нарушении игрок исключается из гильдии.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="scene-portal" data-scene="portal" className="cinema-scene mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
            <ScrollText className="h-4 w-4" aria-hidden />
            Всё по полочкам
          </div>
          <h2 className="font-display text-4xl text-white">Как работает портал</h2>
          <p className="mt-4 leading-7 text-silver">
            Заявка проходит путь от заполнения до публикации. Без решения администратора участник на сайте не появляется.
          </p>
        </div>

        <div className="scroll-stagger mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {portalSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article className={`royal-border portal-step reveal-up reveal-delay-${Math.min(index + 1, 4)} rounded-lg p-5`} key={step.title}>
                <Icon className="relative mb-5 h-7 w-7 text-gold" aria-hidden />
                <h3 className="relative font-display text-2xl text-white">{step.title}</h3>
                <p className="relative mt-3 leading-7 text-silver">{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
