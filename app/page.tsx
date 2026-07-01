import Link from "next/link";
import { Archive, ArrowUpRight, BookOpen, CheckCircle, Crown, ScrollText, Send, Settings, Shield, UserCheck, UserPlus, Users } from "lucide-react";
import { ApplicationModal } from "@/components/application-modal";
import { MemberCard } from "@/components/member-card";
import { getMembers, getPendingApplicationsCount, getRoles, getSiteContent } from "@/lib/data";
import { getContentItem } from "@/lib/site-content";

export default async function HomePage() {
  const [members, roles, pendingCount, content] = await Promise.all([getMembers("active"), getRoles(), getPendingApplicationsCount(), getSiteContent()]);
  const leader = members.find((member) => member.role?.slug === "leader") ?? members[0];
  const homeWelcome = getContentItem(content, "home_welcome");
  const homeManifest = getContentItem(content, "home_manifest");
  const homeGuildInfo = getContentItem(content, "home_guild_info");
  const homeJoinInfo = getContentItem(content, "home_join_info");
  const homeContentCards = [
    { icon: BookOpen, item: homeGuildInfo },
    { icon: UserPlus, item: homeJoinInfo },
    { icon: Shield, item: homeManifest }
  ];
  const portalSteps = [
    {
      icon: UserPlus,
      title: "1. Анкета",
      text: "Игрок заполняет красивую форму. Данные не появляются на сайте сразу."
    },
    {
      icon: UserCheck,
      title: "2. Проверка",
      text: "Администратор открывает заявку, смотрит данные и исправляет их при необходимости."
    },
    {
      icon: CheckCircle,
      title: "3. Публикация",
      text: "После одобрения игрок получает должность и появляется в составе гильдии."
    },
    {
      icon: Archive,
      title: "4. Архив",
      text: "Если участник ушёл из состава, его можно перенести в архив и позже восстановить."
    }
  ];
  const guildSystems = [
    {
      number: "05",
      icon: Shield,
      title: "Стратегия состава",
      text: "Лидер и администрация видят роли, порядок, заявки и активный состав в одной системе."
    },
    {
      number: "04",
      icon: Users,
      title: "Представление участников",
      text: "Каждый игрок получает карточку и отдельную страницу с важной информацией."
    },
    {
      number: "03",
      icon: UserCheck,
      title: "Проверка заявок",
      text: "Анкета сначала попадает в админ-панель и не публикуется без решения администратора."
    },
    {
      number: "02",
      icon: Settings,
      title: "Руководство и роли",
      text: "Руководство хранится в базе, поэтому названия, порядок и описания можно менять без переписывания сайта."
    },
    {
      number: "01",
      icon: Archive,
      title: "Архив гильдии",
      text: "Бывших участников можно хранить отдельно, восстанавливать или удалять при необходимости."
    }
  ];

  return (
    <main>
      <section className="relative min-h-[86vh] overflow-hidden">
        <div className="absolute inset-0">
          <img src="/assets/hero-archive.png" alt="" className="hero-image-motion h-full w-full object-cover opacity-48" />
          <div className="hero-vignette-motion absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/82 to-obsidian/30" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />
        </div>

        <div className="hero-service-grid absolute right-6 top-24 w-[38rem] grid-cols-2 gap-2">
          <Link href="/members" className="hero-service-card">
            <span className="hero-service-title">Состав гильдии</span>
            <span className="hero-service-description">Просмотр участников открывается по коду доступа от лидера.</span>
            <span className="hero-service-meta">
              Участники
              <ArrowUpRight className="hero-service-arrow h-5 w-5" aria-hidden />
            </span>
          </Link>
          <Link href="/application" className="hero-service-card">
            <span className="hero-service-title">Вступить в штаб</span>
            <span className="hero-service-description">Заполни анкету, дождись проверки и ответа руководства.</span>
            <span className="hero-service-meta">
              Анкета
              <ArrowUpRight className="hero-service-arrow h-5 w-5" aria-hidden />
            </span>
          </Link>
        </div>

        <div className="hero-info-panel absolute right-6 top-72 hidden w-[38rem] grid-cols-2 gap-2 2xl:grid">
          <div className="hero-info-card">
            <BookOpen className="h-5 w-5 text-gold" aria-hidden />
            <p className="font-display text-xl text-white">{homeGuildInfo.title}</p>
            <p className="mt-2 text-sm leading-6 text-silver">{homeGuildInfo.body}</p>
          </div>
          <div className="hero-info-card">
            <UserPlus className="h-5 w-5 text-gold" aria-hidden />
            <p className="font-display text-xl text-white">{homeJoinInfo.title}</p>
            <p className="mt-2 text-sm leading-6 text-silver">{homeJoinInfo.body}</p>
          </div>
        </div>

        <Link
          href="/application"
          className="hero-contact-strip absolute bottom-8 right-0 hidden min-w-56 items-center justify-between rounded-l-lg border border-gold/25 bg-white px-5 py-4 text-sm font-bold text-black shadow-royal xl:flex"
        >
          Связаться с руководством
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
            <h1 className="hero-title font-display text-6xl leading-none text-white sm:text-7xl lg:text-8xl">
              Континенталь
            </h1>
            <p className="hero-copy mt-6 max-w-2xl text-lg leading-8 text-silver">
              {homeWelcome.body}
            </p>
            <div className="hero-note-card mt-5 max-w-2xl rounded-lg border border-gold/25 bg-black/35 p-4 backdrop-blur">
              <p className="font-display text-xl text-white">{homeManifest.title}</p>
              <p className="mt-2 leading-7 text-silver">{homeManifest.body}</p>
              {homeWelcome.href ? (
                <a href={homeWelcome.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-gold-soft hover:text-white">
                  <Send className="h-4 w-4" aria-hidden />
                  Канал гильдии в Telegram
                </a>
              ) : null}
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
              <a href="https://t.me/glkontinental" target="_blank" rel="noreferrer" className="button-secondary">
                <Send className="h-4 w-4" aria-hidden />
                Telegram-канал
              </a>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:hidden">
              <Link href="/members" className="hero-mobile-service-card">
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-gold-soft">Состав</span>
                  <span className="mt-1 block font-bold">Состав гильдии</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden />
              </Link>
              <Link href="/application" className="hero-mobile-service-card">
                <span>
                  <span className="block text-xs uppercase tracking-[0.18em] text-gold-soft">Анкета</span>
                  <span className="mt-1 block font-bold">Вступить в гильдию</span>
                </span>
                <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-band scroll-reveal">
        <div className="scroll-stagger mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
          {homeContentCards.map(({ icon: Icon, item }, index) => (
            <article className={`royal-border portal-step reveal-up reveal-delay-${index + 1} rounded-lg p-5`} key={item.key}>
              <Icon className="relative mb-5 h-7 w-7 text-gold" aria-hidden />
              <h2 className="relative font-display text-2xl text-white">{item.title}</h2>
              <p className="relative mt-3 leading-7 text-silver">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="scroll-reveal grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="section-code">
              <BookOpen className="h-4 w-4" aria-hidden />
              //Основа
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl text-white sm:text-5xl">
              Портал работает как штаб, а не как простая страница
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-silver">
              Вся система разложена по этапам: от заявки до публикации, от руководства до архива. Участник быстро понимает, где он находится и что происходит дальше.
            </p>
          </div>

          <div className="scroll-stagger">
            {guildSystems.map((system) => {
              const Icon = system.icon;

              return (
                <article className="numbered-row" key={system.number}>
                  <span className="numbered-index">{system.number}</span>
                  <div>
                    <h3 className="numbered-title">{system.title}</h3>
                    <p className="numbered-copy mt-3">{system.text}</p>
                  </div>
                  <Icon className="h-6 w-6 text-gold" aria-hidden />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-band scroll-reveal">
        <div className="scroll-stagger mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="royal-border stat-card reveal-up reveal-delay-1 rounded-lg p-5">
            <Users className="mb-4 h-6 w-6 text-gold" aria-hidden />
            <p className="font-display text-4xl text-white">{members.length}</p>
            <p className="mt-1 text-sm text-silver">участников в активном составе</p>
          </div>
          <div className="royal-border stat-card reveal-up reveal-delay-2 rounded-lg p-5">
            <Shield className="mb-4 h-6 w-6 text-gold" aria-hidden />
            <p className="font-display text-4xl text-white">{roles.length}</p>
            <p className="mt-1 text-sm text-silver">ролей в руководстве и составе</p>
          </div>
          <div className="royal-border stat-card reveal-up reveal-delay-3 rounded-lg p-5">
            <Archive className="mb-4 h-6 w-6 text-gold" aria-hidden />
            <p className="font-display text-4xl text-white">{pendingCount}</p>
            <p className="mt-1 text-sm text-silver">анкет ждут проверки</p>
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
            У гильдии есть понятный порядок: заявка, проверка, публикация и архив. Ничего не появляется случайно.
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

      <section className="scroll-reveal mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
            <Crown className="h-4 w-4" aria-hidden />
            Лидер
          </div>
          <h2 className="font-display text-4xl text-white">Центр решений гильдии</h2>
          <p className="mt-4 leading-7 text-silver">
            Лидерский блок показывает главного представителя состава. В админ-панели можно менять роли, обновлять данные и переносить участников в архив.
          </p>
          <div className="mt-6">
            <Link href="/leader" className="button-secondary">
              <Crown className="h-4 w-4" aria-hidden />
              Смотреть лидера
            </Link>
          </div>
        </div>

        <div>
          {leader ? <MemberCard member={leader} /> : null}
        </div>
      </section>

      <section className="page-band scroll-reveal">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Кандидатам</p>
            <h2 className="mt-2 font-display text-3xl text-white">Анкета не публикуется сразу</h2>
            <p className="mt-3 max-w-2xl leading-7 text-silver">
              Сначала она попадает в раздел проверки. Администратор открывает заявку, редактирует данные при необходимости и только потом публикует участника.
            </p>
          </div>
          <ApplicationModal buttonLabel="Отправить анкету" />
        </div>
      </section>
    </main>
  );
}
