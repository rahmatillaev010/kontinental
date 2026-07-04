import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Archive, CalendarDays, Crown, Gamepad2, Languages, MapPin, MonitorSmartphone, Shield, UserRound } from "lucide-react";
import { MembersAccessGate } from "@/components/members-access-gate";
import { getCountryBadge } from "@/lib/countries";
import { getMemberById } from "@/lib/data";
import { getRoleVisual } from "@/lib/role-styles";
import { createPageMetadata } from "@/lib/seo";

function Detail({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">{label}</p>
      <p className="mt-2 text-white">{value || "Не указано"}</p>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) {
    return createPageMetadata({
      title: "Участник не найден",
      description: "Профиль участника Континенталя не найден или был скрыт.",
      path: `/members/${id}`
    });
  }

  return createPageMetadata({
    title: `${member.name} — ${member.game_nickname}`,
    description: `Профиль участника гильдии Континенталь: ${member.name}, ${member.game_nickname}, ${member.role?.name ?? "участник"}.`,
    path: `/members/${id}`
  });
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) {
    notFound();
  }

  const visual = getRoleVisual(member.role);
  const Icon = visual.Icon;
  const country = getCountryBadge(member.nationality, member.location);

  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <Link href="/members" className="button-secondary mb-8">
        Назад к участникам
      </Link>

      <MembersAccessGate>
        <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="royal-border rounded-lg p-4">
            <div className="relative overflow-hidden rounded-md border border-white/10">
              <img
                src={member.photo_url || "/avatars/member.svg"}
                alt={member.name}
                className="h-[32rem] w-full object-cover"
              />
              <div className="absolute right-4 top-4 rounded-lg border border-gold/30 bg-black/60 p-3 text-gold-soft backdrop-blur">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-gold-soft">
              <Crown className="h-4 w-4" aria-hidden />
              Карточка участника
            </div>
            <h1 className="font-display text-5xl text-white">{member.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-lg text-silver">
              <UserRound className="h-5 w-5 text-gold" aria-hidden />
              {member.game_nickname}
            </p>
            {country ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold-soft">
                <span className="text-lg">{country.flag}</span>
                {country.name}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Detail label="Возраст" value={member.age} />
              <Detail label="Дата рождения" value={member.birth_date} />
              <Detail label="ID в игре" value={member.game_id} />
              <Detail label="Должность" value={member.role?.name} />
              <Detail label="Кто позвал" value={member.invited_by} />
              <Detail label="Нация" value={member.nationality} />
              <Detail label="Страна" value={country ? `${country.flag} ${country.name}` : member.location} />
              <Detail label="Языки" value={member.languages} />
              <Detail label="Откуда" value={member.location} />
              <Detail label="Устройство" value={member.device} />
              <Detail label="Уровень игры в ульт" value={member.ult_skill} />
              <Detail label="Уровень игры в СНС" value={member.sns_skill} />
              <Detail label="Дата вступления" value={member.joined_at} />
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Первое впечатление</p>
              <p className="mt-2 leading-7 text-white">{member.first_impression || "Не указано"}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-silver">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <Shield className="h-4 w-4 text-gold" aria-hidden />
                Статус: {member.status === "active" ? "активен" : "архивирован"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <CalendarDays className="h-4 w-4 text-gold" aria-hidden />
                {member.joined_at}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <Gamepad2 className="h-4 w-4 text-gold" aria-hidden />
                Free Fire
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <MonitorSmartphone className="h-4 w-4 text-gold" aria-hidden />
                {member.device || "Устройство"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <Languages className="h-4 w-4 text-gold" aria-hidden />
                {member.languages || "Языки"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                {member.status === "archived" ? <Archive className="h-4 w-4 text-gold" aria-hidden /> : <MapPin className="h-4 w-4 text-gold" aria-hidden />}
                {member.location || "Локация"}
              </span>
            </div>
          </div>
        </section>
      </MembersAccessGate>
    </main>
  );
}
