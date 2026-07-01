import Link from "next/link";
import { Languages, MonitorSmartphone, Shield, UserRound } from "lucide-react";
import clsx from "clsx";
import { getRoleVisual } from "@/lib/role-styles";
import { MemberWithRole } from "@/lib/types";

type MemberCardProps = {
  member: MemberWithRole;
};

export function MemberCard({ member }: MemberCardProps) {
  const role = member.role;
  const visual = getRoleVisual(role);
  const Icon = visual.Icon;

  return (
    <article
      className={clsx(
        "member-card-motion group relative overflow-hidden rounded-lg border p-3 transition duration-300 hover:-translate-y-1 hover:shadow-royal",
        visual.cardClass
      )}
    >
      <div className={clsx("absolute left-0 top-0 h-full w-1", visual.railClass)} />
      <div className="relative overflow-hidden rounded-md border border-white/10 bg-black/30">
        <img
          src={member.photo_url || "/avatars/member.svg"}
          alt={member.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute right-3 top-3 rounded-lg border border-black/30 bg-black/55 p-2 text-gold-soft backdrop-blur">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>

      <div className="space-y-4 px-1 pb-1 pt-4">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={clsx("rounded-lg border px-2.5 py-1 text-xs font-semibold", visual.badgeClass)}>
              {role?.name ?? "Участник"}
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-silver">
              ID {member.game_id}
            </span>
          </div>
          <h2 className="font-display text-2xl text-white">{member.name}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-silver">
            <UserRound className="h-4 w-4 text-gold" aria-hidden />
            {member.game_nickname}
          </p>
        </div>

        <div className="grid gap-2 text-sm text-silver">
          <p className="flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4 text-gold" aria-hidden />
            {member.device || "Устройство не указано"}
          </p>
          <p className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-gold" aria-hidden />
            {member.languages || "Языки не указаны"}
          </p>
        </div>

        <Link href={`/members/${member.id}`} className="button-secondary w-full">
          <Shield className="h-4 w-4" aria-hidden />
          Подробнее
        </Link>
      </div>
    </article>
  );
}
