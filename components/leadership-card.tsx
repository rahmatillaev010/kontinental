"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSpotify,
  FaSteam,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaVk,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube
} from "react-icons/fa6";
import { Globe, Trophy, Star, Swords, Users, CalendarDays } from "lucide-react";
import type { IconType } from "react-icons";
import { LeadershipProfile } from "@/lib/types";

type TimeParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const iconMap: Record<string, IconType> = {
  telegram: FaTelegram,
  discord: FaDiscord,
  tiktok: FaTiktok,
  instagram: FaInstagram,
  youtube: FaYoutube,
  vk: FaVk,
  github: FaGithub,
  steam: FaSteam,
  facebook: FaFacebook,
  x: FaXTwitter,
  twitter: FaXTwitter,
  threads: FaThreads,
  whatsapp: FaWhatsapp,
  twitch: FaTwitch,
  reddit: FaReddit,
  spotify: FaSpotify,
  linkedin: FaLinkedin,
  pinterest: FaPinterest,
  snapchat: FaSnapchat,
  website: Globe
};

function getTimeParts(assignedAt: string): TimeParts {
  const start = new Date(assignedAt).getTime();
  const diff = Math.max(0, Date.now() - start);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export function LeadershipCard({ leader }: { leader: LeadershipProfile }) {
  const [time, setTime] = useState<TimeParts>(() => getTimeParts(leader.assigned_at));
  const stats = useMemo(
    () =>
      [
        leader.best_leader_month ? { label: "Лучший руководитель месяца", value: leader.best_leader_month, icon: Trophy } : null,
        { label: "Количество дней в должности", value: `${time.days}`, icon: Star },
        leader.events_count ? { label: "Проведённых мероприятий", value: `${leader.events_count}`, icon: CalendarDays } : null,
        leader.wars_count ? { label: "Организованных КВ", value: `${leader.wars_count}`, icon: Swords } : null,
        leader.invited_count ? { label: "Приглашённых участников", value: `${leader.invited_count}`, icon: Users } : null
      ].filter(Boolean) as { label: string; value: string; icon: typeof Trophy }[],
    [leader.best_leader_month, leader.events_count, leader.invited_count, leader.wars_count, time.days]
  );

  useEffect(() => {
    setTime(getTimeParts(leader.assigned_at));
    const interval = window.setInterval(() => setTime(getTimeParts(leader.assigned_at)), 1000);
    return () => window.clearInterval(interval);
  }, [leader.assigned_at]);

  return (
    <article className="leadership-card">
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/30">
        <img src={leader.photo_url || "/avatars/member.svg"} alt={leader.name} className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-4 top-4 rounded-lg border border-gold/30 bg-black/65 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-gold-soft backdrop-blur">
          {leader.status === "online" ? "Онлайн" : "Не в сети"}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">{leader.role_title}</p>
          <h2 className="mt-2 font-display text-3xl text-white">{leader.name}</h2>
          {leader.game_nickname ? <p className="mt-1 text-silver">{leader.game_nickname}</p> : null}
          <div className="mt-4 grid gap-2 text-sm text-silver sm:grid-cols-2">
            <p>Возраст: {leader.age ?? "не указан"}</p>
            <p>Назначен: {leader.assigned_at}</p>
          </div>
          <p className="mt-4 leading-7 text-silver">{leader.role_description || "Описание обязанностей можно добавить в админ-панели."}</p>
        </div>

        <div className="mt-5 rounded-lg border border-gold/25 bg-gold/10 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gold-soft">В должности</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              ["дня", time.days],
              ["часов", time.hours],
              ["минут", time.minutes],
              ["секунд", time.seconds]
            ].map(([label, value]) => (
              <div className="rounded-lg border border-white/10 bg-black/25 p-2" key={label as string}>
                <p className="font-display text-2xl text-white">{value as number}</p>
                <p className="text-[0.68rem] uppercase tracking-[0.12em] text-silver">{label as string}</p>
              </div>
            ))}
          </div>
        </div>

        {stats.length ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3" key={stat.label}>
                  <Icon className="mb-2 h-4 w-4 text-gold" aria-hidden />
                  <p className="font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs leading-5 text-silver">{stat.label}</p>
                </div>
              );
            })}
          </div>
        ) : null}

        {leader.social_links?.length ? (
          <div className="mt-5">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gold-soft">Социальные сети</p>
            <div className="flex flex-wrap gap-2">
              {leader.social_links.map((link) => {
                const platform = link.platform;
                if (!platform || !link.url) return null;
                const Icon = iconMap[platform.icon_key.toLowerCase()] ?? Globe;

                return (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-button"
                    style={{ color: platform.color ?? "#f7e8ad" }}
                    aria-label={platform.name}
                    key={link.id}
                    title={platform.name}
                  >
                    {platform.icon_url ? <img src={platform.icon_url} alt="" className="h-5 w-5 object-contain" /> : <Icon className="h-5 w-5" aria-hidden />}
                  </a>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
