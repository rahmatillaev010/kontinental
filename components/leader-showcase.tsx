"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaSteam,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaVk,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from "react-icons/fa6";
import { Crown, Globe, Languages, MapPin, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { getCountryBadge } from "@/lib/countries";
import { LeadershipProfile } from "@/lib/types";

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const socialIcons = {
  telegram: FaTelegram,
  discord: FaDiscord,
  tiktok: FaTiktok,
  instagram: FaInstagram,
  youtube: FaYoutube,
  vk: FaVk,
  steam: FaSteam,
  github: FaGithub,
  facebook: FaFacebook,
  x: FaXTwitter,
  twitter: FaXTwitter,
  threads: FaThreads,
  whatsapp: FaWhatsapp,
  website: Globe
};

function getTimeParts(assignedAt: string): TimeParts {
  const start = new Date(assignedAt).getTime();
  const diff = Math.max(0, Date.now() - start);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export function LeaderShowcase({ leader }: { leader: LeadershipProfile }) {
  const [time, setTime] = useState<TimeParts>(() => getTimeParts(leader.assigned_at));
  const country = getCountryBadge(leader.country, leader.nationality, leader.city);
  const profileRows = useMemo(
    () => [
      { label: "Возраст", value: leader.age ? `${leader.age}` : "Не указан", icon: UserRound },
      { label: "Нация", value: leader.nationality || "Не указана", icon: ShieldCheck },
      { label: "Страна", value: country ? `${country.flag} ${country.name}` : leader.country || "Не указана", icon: Globe },
      { label: "Город", value: leader.city || "Не указан", icon: MapPin },
      { label: "Языки", value: leader.languages || "Не указаны", icon: Languages }
    ],
    [country, leader.age, leader.city, leader.country, leader.languages, leader.nationality]
  );

  useEffect(() => {
    setTime(getTimeParts(leader.assigned_at));
    const interval = window.setInterval(() => setTime(getTimeParts(leader.assigned_at)), 1000);
    return () => window.clearInterval(interval);
  }, [leader.assigned_at]);

  return (
    <section className="leader-cinema relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: `url(${leader.background_url || "/hero/royal-hall.svg"})` }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(214,174,92,0.24),transparent_34%),linear-gradient(180deg,rgba(3,5,10,0.1),#05070d_82%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="leader-crown-intro mx-auto mb-10 flex h-28 w-28 items-center justify-center rounded-full border border-gold/30 bg-black/55 shadow-[0_0_90px_rgba(214,174,92,0.34)] backdrop-blur">
          <Crown className="h-14 w-14 text-gold" aria-hidden />
        </div>

        <div className="mb-9 text-center">
          <p className="inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-gold-soft">
            <Sparkles className="h-4 w-4" aria-hidden />
            Лидер гильдии
          </p>
          <h1 className="mt-4 font-display text-5xl text-white sm:text-7xl">{leader.name}</h1>
          <p className="mt-3 text-lg text-silver">{leader.game_nickname || leader.role_title}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="leader-glass-card leader-card-enter min-h-[44rem] p-5 sm:p-6">
            <div className="relative overflow-hidden rounded-lg border border-gold/20">
              <img src={leader.photo_url || "/avatars/leader.svg"} alt={leader.name} className="h-[25rem] w-full object-cover" />
              <div className="absolute left-4 top-4 rounded-lg border border-gold/35 bg-black/70 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-soft backdrop-blur">
                {leader.status === "online" ? "Онлайн" : "Не в сети"}
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profileRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4" key={row.label}>
                    <Icon className="mb-3 h-5 w-5 text-gold" aria-hidden />
                    <p className="text-xs uppercase tracking-[0.14em] text-silver">{row.label}</p>
                    <p className="mt-1 font-bold text-white">{row.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-gold/25 bg-gold/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Назначен</p>
              <p className="mt-1 font-display text-2xl text-white">{formatDate(leader.assigned_at)}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-gold-soft">В должности</p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {[
                  ["дней", time.days],
                  ["часов", time.hours],
                  ["минут", time.minutes],
                  ["секунд", time.seconds]
                ].map(([label, value]) => (
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3" key={label as string}>
                    <p className="font-display text-2xl text-white">{value as number}</p>
                    <p className="text-[0.65rem] uppercase tracking-[0.12em] text-silver">{label as string}</p>
                  </div>
                ))}
              </div>
            </div>

            {leader.social_links?.length ? (
              <div className="mt-5">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gold-soft">Социальные сети</p>
                <div className="flex flex-wrap gap-2">
                  {leader.social_links.map((link) => {
                    const platform = link.platform;
                    if (!platform || !link.url) return null;
                    const Icon = socialIcons[platform.icon_key.toLowerCase() as keyof typeof socialIcons] ?? Globe;
                    return (
                      <a className="social-icon-button" href={link.url} target="_blank" rel="noreferrer" title={platform.name} style={{ color: platform.color ?? "#f7e8ad" }} key={link.id}>
                        {platform.icon_url ? <img src={platform.icon_url} alt="" className="h-5 w-5 object-contain" /> : <Icon className="h-5 w-5" aria-hidden />}
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </article>

          <article className="leader-glass-card leader-card-enter min-h-[44rem] p-7 sm:p-9 [animation-delay:0.16s]">
            <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Описание</p>
            <h2 className="mt-4 font-display text-4xl text-white">Голос и решение Континенталя</h2>
            <div className="mt-8 space-y-5 whitespace-pre-line text-lg leading-9 text-silver">
              {leader.role_description ||
                "Лидер Континенталя отвечает за порядок, атмосферу и направление состава.\n\nЕго задача — держать гильдию собранной, сильной и уважительной к каждому участнику."}
            </div>

            <div className="mt-10 rounded-lg border-l-2 border-gold bg-gold/10 p-5">
              <p className="font-display text-2xl text-white">“Дисциплина, уважение и сила состава.”</p>
              <p className="mt-4 text-gold-soft">{leader.signature || leader.name}</p>
            </div>

            {leader.cover_url ? <img src={leader.cover_url} alt="" className="mt-8 h-56 w-full rounded-lg border border-white/10 object-cover" /> : null}
          </article>
        </div>
      </div>
    </section>
  );
}
