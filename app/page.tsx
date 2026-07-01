import Link from "next/link";
import {
  Archive,
  ArrowUpRight,
  BookOpen,
  CheckCircle,
  Crown,
  MessageCircle,
  ScrollText,
  Shield,
  Swords,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import { ApplicationModal } from "@/components/application-modal";
import { MemberCard } from "@/components/member-card";
import { getMembers, getPendingApplicationsCount, getRoles, getSiteContent } from "@/lib/data";
import { getContentItem } from "@/lib/site-content";

const combatRules = [
  {
    title: "Клановая война",
    text: "Форматы 4/4 и 6/6. Комнаты создаются по договорённости, порядок держит руководство.",
    points: ["4/4", "6/6", "без лишних споров"]
  },
  {
    title: "Оружие",
    text: "Основные условия: дробовик, дигл, дистанция 10 м и честная игра без запрещённых преимуществ.",
    points: ["дробь", "дигл", "10 м"]
  },
  {
    title: "Навыки",
    text: "Перед заявкой игрок знакомится с правилами и указывает, в каких режимах готов играть.",
    points: ["Алок", "Келли", "Моко", "Каролина"]
  },
  {
    title: "Заявка",
    text: "Если игрок хочет в КВ или мясо, он читает правила, заполняет анкету, а заявка приходит в админку.",
    points: ["проверка", "ответ лидера", "публикация после решения"]
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
    { icon: MessageCircle, item: discordLink },
    { icon: Swords, item: tiktokLink },
    { icon: Crown, item: leaderContact }
  ];

  return (
    <main>
      <section className="relative min-h-[86vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/hero-archive.png" alt="" className="hero-image-motion h-full w-full object-cover opacity-48" />
          <div className="hero-vignette-motion absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/82 to-obsidian/30" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
        </div>

        <div className="hero-social-panel absolute right-6 top-28 hidden w-[34rem] 2xl:block">
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
          href="/application"
          className="hero-contact-strip absolute bottom-8 right-0 hidden min-w-56 items-center justify-between rounded-l-lg border border-gold/25 bg-white px-5 py-4 text-sm font-bold text-black shadow-royal xl:flex"
        >
          Вступить в гильдию
          <ArrowUpRight className="h-5 w-5" aria-hidden />
        </Link>

        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
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
              <div className="hero-application-cta">
                <ApplicationModal />
              </div>
              <Link href="/roles" className="button-secondary">
                <Shield className="h-4 w-4" aria-hidden />
                Руководство
              </Link>
              <Link href="/members" className="button-secondary">
                <Users className="h-4 w-4" aria-hidden />
                Участники
              </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:hidden">
              <a href={discordLink.href || "#"} target={discordLink.href ? "_blank" : undefined} rel="noreferrer" className="hero-mobile-service-card">
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-gold-soft">Discord</span>
                  <span className="mt-1 block font-bold">{discordLink.title}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden />
              </a>
              <a href={leaderContact.href || "#"} target={leaderContact.href ? "_blank" : undefined} rel="noreferrer" className="hero-mobile-service-card">
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-gold-soft">Связь</span>
                  <span className="mt-1 block font-bold">{leaderContact.title}</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="page-band scroll-reveal">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
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
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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

      <section className="page-band scroll-reveal">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="section-code">
                <Swords className="h-4 w-4" aria-hidden />
                Правила КВ / мясо
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl text-white sm:text-5xl">Перед вступлением игрок читает правила</h2>
              <p className="mt-5 max-w-xl leading-8 text-silver">
                Если игрок хочет попасть в КВ или мясо, он сначала знакомится с условиями, потом заполняет анкету. Заявка приходит в админку, а руководство уже связывается с кандидатом.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/rules" className="button-secondary">
                  <BookOpen className="h-4 w-4" aria-hidden />
                  Читать правила
                </Link>
                <ApplicationModal buttonLabel="Заполнить анкету" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {combatRules.map((rule) => (
                <article className="combat-rule-card" key={rule.title}>
                  <Swords className="h-5 w-5 text-gold" aria-hidden />
                  <h3 className="mt-4 font-display text-2xl text-white">{rule.title}</h3>
                  <p className="mt-3 leading-7 text-silver">{rule.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
