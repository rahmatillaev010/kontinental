"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MemberCard } from "@/components/member-card";
import { MemberWithRole, Role } from "@/lib/types";

type MemberGridProps = {
  members: MemberWithRole[];
  roles: Role[];
};

function splitValues(value: string | null | undefined) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function MemberGrid({ members, roles }: MemberGridProps) {
  const [query, setQuery] = useState("");
  const [roleId, setRoleId] = useState("all");
  const [device, setDevice] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState("role");

  const devices = useMemo(
    () => Array.from(new Set(members.map((member) => member.device).filter(Boolean) as string[])).sort(),
    [members]
  );

  const languages = useMemo(
    () => Array.from(new Set(members.flatMap((member) => splitValues(member.languages)))).sort(),
    [members]
  );

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const roleOrder = new Map(roles.map((role) => [role.id, role.sort_order]));

    return members
      .filter((member) => {
        const searchText = `${member.name} ${member.game_nickname} ${member.game_id}`.toLowerCase();
        const matchesQuery = normalizedQuery ? searchText.includes(normalizedQuery) : true;
        const matchesRole = roleId === "all" ? true : member.role_id === roleId;
        const matchesDevice = device === "all" ? true : member.device === device;
        const matchesLanguage = language === "all" ? true : splitValues(member.languages).includes(language);

        return matchesQuery && matchesRole && matchesDevice && matchesLanguage;
      })
      .sort((first, second) => {
        if (sort === "joined") {
          return new Date(second.joined_at).getTime() - new Date(first.joined_at).getTime();
        }

        return (roleOrder.get(first.role_id ?? "") ?? 999) - (roleOrder.get(second.role_id ?? "") ?? 999);
      });
  }, [device, language, members, query, roleId, roles, sort]);

  return (
    <div className="space-y-8">
      <div className="royal-border rounded-lg p-4">
        <div className="mb-4 flex items-center gap-2 text-gold-soft">
          <SlidersHorizontal className="h-5 w-5" aria-hidden />
          <h2 className="font-display text-xl text-white">Поиск и фильтры</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <label className="lg:col-span-2">
            <span className="mb-2 block text-sm text-silver">Имя, ник или ID</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="field pl-10"
                placeholder="Например: Crown"
              />
            </span>
          </label>

          <label>
            <span className="mb-2 block text-sm text-silver">Должность</span>
            <select value={roleId} onChange={(event) => setRoleId(event.target.value)} className="field">
              <option value="all">Все</option>
              {roles.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm text-silver">Устройство</span>
            <select value={device} onChange={(event) => setDevice(event.target.value)} className="field">
              <option value="all">Все</option>
              {devices.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm text-silver">Язык</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} className="field">
              <option value="all">Все</option>
              {languages.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm text-silver">Сортировка</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="field">
              <option value="role">По должности</option>
              <option value="joined">По дате вступления</option>
            </select>
          </label>
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard member={member} key={member.id} />
          ))}
        </div>
      ) : (
        <div className="royal-border rounded-lg p-8 text-center text-silver">Никого не найдено.</div>
      )}
    </div>
  );
}
