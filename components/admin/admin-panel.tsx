"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  Archive,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Edit,
  FileText,
  Loader2,
  LogOut,
  Plus,
  RotateCcw,
  Settings,
  Shield,
  Trash,
  UserCheck,
  XCircle
} from "lucide-react";
import clsx from "clsx";
import { defaultSiteContent, mergeSiteContent } from "@/lib/site-content";
import { createBrowserSupabaseClient, isBrowserSupabaseConfigured } from "@/lib/supabase/client";
import { Application, MemberWithRole, Role, SiteContent } from "@/lib/types";

type AdminTab = "applications" | "members" | "roles" | "archive" | "content";

const tabLabels: Record<AdminTab, string> = {
  applications: "Анкеты",
  members: "Участники",
  roles: "Руководство",
  archive: "Архив",
  content: "Тексты"
};

const tabIcons: Record<AdminTab, typeof UserCheck> = {
  applications: UserCheck,
  members: Shield,
  roles: Settings,
  archive: Archive,
  content: FileText
};

const roleThemes = [
  "royal-gold",
  "graphite-gold",
  "amber-gold",
  "deep-blue-gold",
  "dark-bronze",
  "dark-copper",
  "dark-silver",
  "dark-emerald",
  "dark-blue",
  "dark-violet",
  "dark-gray",
  "graphite"
];

const emptyApplication: Application = {
  id: "",
  name: "",
  age: 16,
  birth_date: "",
  game_nickname: "",
  game_id: "",
  invited_by: "",
  nationality: "",
  languages: "",
  location: "",
  device: "",
  ult_skill: "",
  sns_skill: "",
  first_impression: "",
  photo_url: "",
  status: "pending"
};

const emptyMember: MemberWithRole = {
  id: "",
  name: "",
  age: 16,
  birth_date: "",
  game_nickname: "",
  game_id: "",
  invited_by: "",
  nationality: "",
  languages: "",
  location: "",
  device: "",
  ult_skill: "",
  sns_skill: "",
  first_impression: "",
  photo_url: "",
  role_id: "",
  status: "active",
  joined_at: new Date().toISOString().slice(0, 10),
  role: null
};

const emptyRole: Role = {
  id: "",
  name: "",
  slug: "",
  description: "",
  color_theme: "graphite",
  sort_order: 99
};

function slugifyRoleName(value: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ы: "y",
    э: "e",
    ю: "yu",
    я: "ya"
  };

  const slug = value
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `role-${Date.now()}`;
}

function displayStatus(status: string) {
  const labels: Record<string, string> = {
    pending: "На проверке",
    approved: "Одобрена",
    rejected: "Отклонена",
    active: "Активен",
    archived: "Архивирован"
  };

  return labels[status] ?? status;
}

function applicationPayload(application: Application) {
  return {
    name: application.name,
    age: Number(application.age),
    birth_date: application.birth_date,
    game_nickname: application.game_nickname,
    game_id: application.game_id,
    invited_by: application.invited_by || null,
    nationality: application.nationality || null,
    languages: application.languages || null,
    location: application.location || null,
    device: application.device || null,
    ult_skill: application.ult_skill || null,
    sns_skill: application.sns_skill || null,
    first_impression: application.first_impression || null,
    photo_url: application.photo_url || null,
    status: application.status
  };
}

function memberPayload(member: MemberWithRole) {
  return {
    name: member.name,
    age: Number(member.age),
    birth_date: member.birth_date,
    game_nickname: member.game_nickname,
    game_id: member.game_id,
    invited_by: member.invited_by || null,
    nationality: member.nationality || null,
    languages: member.languages || null,
    location: member.location || null,
    device: member.device || null,
    ult_skill: member.ult_skill || null,
    sns_skill: member.sns_skill || null,
    first_impression: member.first_impression || null,
    photo_url: member.photo_url || null,
    role_id: member.role_id || null,
    status: member.status,
    joined_at: member.joined_at
  };
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false
}: {
  label: string;
  value: string | number | null | undefined;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm text-silver">{label}</span>
      <input required={required} type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="field" />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange
}: {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm text-silver">{label}</span>
      <textarea value={value ?? ""} onChange={(event) => onChange(event.target.value)} className="field min-h-24 resize-y" />
    </label>
  );
}

export function AdminPanel() {
  const [supabase] = useState<SupabaseClient | null>(() => createBrowserSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);
  const [tab, setTab] = useState<AdminTab>("applications");
  const [roles, setRoles] = useState<Role[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [archivedMembers, setArchivedMembers] = useState<MemberWithRole[]>([]);
  const [contentItems, setContentItems] = useState<SiteContent[]>(defaultSiteContent);
  const [applicationDraft, setApplicationDraft] = useState<Application | null>(null);
  const [memberDraft, setMemberDraft] = useState<MemberWithRole | null>(null);
  const [roleDraft, setRoleDraft] = useState<Role | null>(null);
  const [contentDraft, setContentDraft] = useState<SiteContent | null>(null);
  const [newRole, setNewRole] = useState<Role>({ ...emptyRole });
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabaseReady = useMemo(() => isBrowserSupabaseConfigured(), []);
  const defaultRoleId = roles.find((role) => role.slug === "member")?.id ?? roles[0]?.id ?? "";

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const client = supabase;
    const currentSession = session;

    if (!client || !currentSession) {
      setIsAdmin(false);
      setAdminChecked(true);
      return;
    }

    async function checkAdmin(checkedClient: SupabaseClient, checkedSession: Session) {
      setAdminChecked(false);
      const { data, error: adminError } = await checkedClient
        .from("admin_users")
        .select("user_id")
        .eq("user_id", checkedSession.user.id)
        .maybeSingle();

      const allowed = Boolean(data) && !adminError;
      setIsAdmin(allowed);
      setAdminChecked(true);

      if (allowed) {
        await loadData();
      }
    }

    checkAdmin(client, currentSession);
  }, [session, supabase]);

  async function loadData() {
    if (!supabase) return;

    setDataLoading(true);
    setError(null);

    const [rolesResult, applicationsResult, membersResult, archivedResult, contentResult] = await Promise.all([
      supabase.from("roles").select("*").order("sort_order", { ascending: true }),
      supabase.from("applications").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("members").select("*, role:roles(*)").eq("status", "active").order("joined_at", { ascending: false }),
      supabase.from("members").select("*, role:roles(*)").eq("status", "archived").order("joined_at", { ascending: false }),
      supabase.from("site_content").select("*").order("sort_order", { ascending: true })
    ]);

    if (rolesResult.error || applicationsResult.error || membersResult.error || archivedResult.error || contentResult.error) {
      setError("Не удалось загрузить данные. Проверь SQL, RLS, таблицу site_content и права администратора.");
    } else {
      setRoles((rolesResult.data ?? []) as Role[]);
      setApplications((applicationsResult.data ?? []) as Application[]);
      setMembers((membersResult.data ?? []) as MemberWithRole[]);
      setArchivedMembers((archivedResult.data ?? []) as MemberWithRole[]);
      setContentItems(contentResult.data?.length ? mergeSiteContent(contentResult.data as SiteContent[]) : defaultSiteContent);
    }

    setDataLoading(false);
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    setError(null);
    setNotice(null);
    setAuthLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
    }

    setAuthLoading(false);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  }

  async function saveApplication() {
    if (!supabase || !applicationDraft) return;

    setError(null);
    const { error: updateError } = await supabase.from("applications").update(applicationPayload(applicationDraft)).eq("id", applicationDraft.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice("Анкета сохранена.");
    await loadData();
  }

  async function rejectApplication() {
    if (!supabase || !applicationDraft) return;

    const { error: rejectError } = await supabase.from("applications").update({ status: "rejected" }).eq("id", applicationDraft.id);

    if (rejectError) {
      setError(rejectError.message);
      return;
    }

    setApplicationDraft(null);
    setNotice("Анкета отклонена.");
    await loadData();
  }

  async function publishApplication() {
    if (!supabase || !applicationDraft) return;

    const roleId = defaultRoleId;
    if (!roleId) {
      setError("Сначала добавь хотя бы одну должность.");
      return;
    }

    const { data: existingMember, error: existingMemberError } = await supabase
      .from("members")
      .select("id, name, game_id")
      .eq("game_id", applicationDraft.game_id)
      .maybeSingle();

    if (existingMemberError) {
      setError(existingMemberError.message);
      return;
    }

    if (existingMember) {
      setError(`Участник с ID ${applicationDraft.game_id} уже опубликован: ${existingMember.name}. Эту повторную заявку можно отклонить.`);
      return;
    }

    const newMember = {
      ...memberPayload({
        ...emptyMember,
        ...applicationDraft,
        id: "",
        role_id: roleId,
        status: "active",
        joined_at: new Date().toISOString().slice(0, 10),
        role: null
      }),
      role_id: roleId,
      status: "active"
    };

    const { error: insertError } = await supabase.from("members").insert(newMember);

    if (insertError) {
      if (insertError.code === "23505" || insertError.message.includes("members_game_id_key")) {
        setError(`Участник с ID ${applicationDraft.game_id} уже есть в составе. Эту заявку можно отклонить как повторную.`);
      } else {
        setError(insertError.message);
      }
      return;
    }

    const { error: approveError } = await supabase.from("applications").update({ status: "approved" }).eq("id", applicationDraft.id);

    if (approveError) {
      setError(approveError.message);
      return;
    }

    setNotice("Участник опубликован.");
    setApplicationDraft(null);
    await loadData();
  }

  async function saveMember() {
    if (!supabase || !memberDraft) return;

    const { error: updateError } = await supabase.from("members").update(memberPayload(memberDraft)).eq("id", memberDraft.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice("Данные участника сохранены.");
    await loadData();
  }

  async function archiveMember(member: MemberWithRole) {
    if (!supabase) return;
    const { error: archiveError } = await supabase.from("members").update({ status: "archived" }).eq("id", member.id);
    if (archiveError) setError(archiveError.message);
    else {
      setNotice("Участник перенесён в архив.");
      setMemberDraft(null);
      await loadData();
    }
  }

  async function restoreMember(member: MemberWithRole) {
    if (!supabase) return;
    const { error: restoreError } = await supabase.from("members").update({ status: "active" }).eq("id", member.id);
    if (restoreError) setError(restoreError.message);
    else {
      setNotice("Участник восстановлен.");
      setMemberDraft(null);
      await loadData();
    }
  }

  async function deleteMember(member: MemberWithRole) {
    if (!supabase) return;
    const confirmed = window.confirm(`Удалить участника ${member.name}? Это действие нельзя отменить.`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from("members").delete().eq("id", member.id);
    if (deleteError) setError(deleteError.message);
    else {
      setNotice("Участник удалён.");
      setMemberDraft(null);
      await loadData();
    }
  }

  async function addRole(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    const payload = {
      name: newRole.name,
      slug: newRole.slug || slugifyRoleName(newRole.name),
      description: newRole.description || null,
      color_theme: newRole.color_theme || "graphite",
      sort_order: Number(newRole.sort_order)
    };

    const { error: insertError } = await supabase.from("roles").insert(payload);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNewRole({ ...emptyRole, sort_order: roles.length + 1 });
    setNotice("Должность добавлена.");
    await loadData();
  }

  async function saveRole() {
    if (!supabase || !roleDraft) return;

    const { error: updateError } = await supabase
      .from("roles")
      .update({
        name: roleDraft.name,
        slug: roleDraft.slug || slugifyRoleName(roleDraft.name),
        description: roleDraft.description || null,
        color_theme: roleDraft.color_theme || "graphite",
        sort_order: Number(roleDraft.sort_order)
      })
      .eq("id", roleDraft.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice("Должность сохранена.");
    await loadData();
  }

  async function deleteRole(role: Role) {
    if (!supabase) return;
    const confirmed = window.confirm(`Удалить должность ${role.name}? Участникам с этой должностью нужно будет назначить другую.`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from("roles").delete().eq("id", role.id);
    if (deleteError) setError(deleteError.message);
    else {
      setRoleDraft(null);
      setNotice("Должность удалена.");
      await loadData();
    }
  }

  async function moveRole(role: Role, direction: -1 | 1) {
    if (!supabase) return;
    const index = roles.findIndex((item) => item.id === role.id);
    const neighbor = roles[index + direction];
    if (!neighbor) return;

    const first = supabase.from("roles").update({ sort_order: neighbor.sort_order }).eq("id", role.id);
    const second = supabase.from("roles").update({ sort_order: role.sort_order }).eq("id", neighbor.id);
    const [firstResult, secondResult] = await Promise.all([first, second]);

    if (firstResult.error || secondResult.error) {
      setError("Не удалось поменять порядок должностей.");
      return;
    }

    await loadData();
  }

  async function saveContent() {
    if (!supabase || !contentDraft) return;

    const { error: updateError } = await supabase
      .from("site_content")
      .upsert(
        {
          key: contentDraft.key,
          title: contentDraft.title,
          body: contentDraft.body,
          href: contentDraft.href || null,
          sort_order: Number(contentDraft.sort_order)
        },
        { onConflict: "key" }
      );

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice("Текст сайта сохранён.");
    await loadData();
  }

  function renderApplicationEditor() {
    if (!applicationDraft) {
      return <div className="royal-border rounded-lg p-6 text-silver">Выбери анкету слева, чтобы открыть её.</div>;
    }

    return (
      <div className="royal-border rounded-lg p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">{displayStatus(applicationDraft.status)}</p>
            <h3 className="font-display text-2xl text-white">{applicationDraft.name}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="button-secondary" onClick={saveApplication}>
              <Edit className="h-4 w-4" aria-hidden />
              Сохранить
            </button>
            <button type="button" className="button-secondary" onClick={rejectApplication}>
              <XCircle className="h-4 w-4" aria-hidden />
              Отклонить
            </button>
            <button type="button" className="button-primary" onClick={publishApplication}>
              <CheckCircle className="h-4 w-4" aria-hidden />
              Опубликовать
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Имя" value={applicationDraft.name} required onChange={(value) => setApplicationDraft({ ...applicationDraft, name: value })} />
          <Field label="Возраст" type="number" value={applicationDraft.age} required onChange={(value) => setApplicationDraft({ ...applicationDraft, age: Number(value) })} />
          <Field label="Дата рождения" type="date" value={applicationDraft.birth_date} required onChange={(value) => setApplicationDraft({ ...applicationDraft, birth_date: value })} />
          <Field label="Ник в игре" value={applicationDraft.game_nickname} required onChange={(value) => setApplicationDraft({ ...applicationDraft, game_nickname: value })} />
          <Field label="ID в игре" value={applicationDraft.game_id} required onChange={(value) => setApplicationDraft({ ...applicationDraft, game_id: value })} />
          <Field label="Кто позвал" value={applicationDraft.invited_by} onChange={(value) => setApplicationDraft({ ...applicationDraft, invited_by: value })} />
          <Field label="Нация" value={applicationDraft.nationality} onChange={(value) => setApplicationDraft({ ...applicationDraft, nationality: value })} />
          <Field label="Языки" value={applicationDraft.languages} onChange={(value) => setApplicationDraft({ ...applicationDraft, languages: value })} />
          <Field label="Откуда" value={applicationDraft.location} onChange={(value) => setApplicationDraft({ ...applicationDraft, location: value })} />
          <Field label="Устройство" value={applicationDraft.device} onChange={(value) => setApplicationDraft({ ...applicationDraft, device: value })} />
          <Field label="Ульт" value={applicationDraft.ult_skill} onChange={(value) => setApplicationDraft({ ...applicationDraft, ult_skill: value })} />
          <Field label="СНС" value={applicationDraft.sns_skill} onChange={(value) => setApplicationDraft({ ...applicationDraft, sns_skill: value })} />
          <Field label="Фото URL" value={applicationDraft.photo_url} onChange={(value) => setApplicationDraft({ ...applicationDraft, photo_url: value })} />
          <TextArea label="Первое впечатление" value={applicationDraft.first_impression} onChange={(value) => setApplicationDraft({ ...applicationDraft, first_impression: value })} />
        </div>
      </div>
    );
  }

  function renderMemberEditor(mode: "active" | "archived") {
    const list = mode === "active" ? members : archivedMembers;

    return (
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {list.map((member) => (
            <button
              type="button"
              className={clsx(
                "w-full rounded-lg border p-4 text-left transition hover:border-gold/45",
                memberDraft?.id === member.id ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"
              )}
              key={member.id}
              onClick={() => setMemberDraft(member)}
            >
              <p className="font-display text-xl text-white">{member.name}</p>
              <p className="mt-1 text-sm text-silver">
                {member.game_nickname} · {member.role?.name ?? "Без должности"}
              </p>
            </button>
          ))}
        </div>

        {memberDraft ? (
          <div className="royal-border rounded-lg p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">{displayStatus(memberDraft.status)}</p>
                <h3 className="font-display text-2xl text-white">{memberDraft.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="button-secondary" onClick={saveMember}>
                  <Edit className="h-4 w-4" aria-hidden />
                  Сохранить
                </button>
                {memberDraft.status === "active" ? (
                  <button type="button" className="button-secondary" onClick={() => archiveMember(memberDraft)}>
                    <Archive className="h-4 w-4" aria-hidden />
                    В архив
                  </button>
                ) : (
                  <button type="button" className="button-secondary" onClick={() => restoreMember(memberDraft)}>
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Восстановить
                  </button>
                )}
                <button type="button" className="button-secondary" onClick={() => deleteMember(memberDraft)}>
                  <Trash className="h-4 w-4" aria-hidden />
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Имя" value={memberDraft.name} required onChange={(value) => setMemberDraft({ ...memberDraft, name: value })} />
              <Field label="Возраст" type="number" value={memberDraft.age} required onChange={(value) => setMemberDraft({ ...memberDraft, age: Number(value) })} />
              <Field label="Дата рождения" type="date" value={memberDraft.birth_date} required onChange={(value) => setMemberDraft({ ...memberDraft, birth_date: value })} />
              <Field label="Ник в игре" value={memberDraft.game_nickname} required onChange={(value) => setMemberDraft({ ...memberDraft, game_nickname: value })} />
              <Field label="ID в игре" value={memberDraft.game_id} required onChange={(value) => setMemberDraft({ ...memberDraft, game_id: value })} />
              <Field label="Кто позвал" value={memberDraft.invited_by} onChange={(value) => setMemberDraft({ ...memberDraft, invited_by: value })} />
              <Field label="Нация" value={memberDraft.nationality} onChange={(value) => setMemberDraft({ ...memberDraft, nationality: value })} />
              <Field label="Языки" value={memberDraft.languages} onChange={(value) => setMemberDraft({ ...memberDraft, languages: value })} />
              <Field label="Откуда" value={memberDraft.location} onChange={(value) => setMemberDraft({ ...memberDraft, location: value })} />
              <Field label="Устройство" value={memberDraft.device} onChange={(value) => setMemberDraft({ ...memberDraft, device: value })} />
              <Field label="Ульт" value={memberDraft.ult_skill} onChange={(value) => setMemberDraft({ ...memberDraft, ult_skill: value })} />
              <Field label="СНС" value={memberDraft.sns_skill} onChange={(value) => setMemberDraft({ ...memberDraft, sns_skill: value })} />
              <Field label="Фото URL" value={memberDraft.photo_url} onChange={(value) => setMemberDraft({ ...memberDraft, photo_url: value })} />
              <Field label="Дата вступления" type="date" value={memberDraft.joined_at} onChange={(value) => setMemberDraft({ ...memberDraft, joined_at: value })} />
              <label>
                <span className="mb-2 block text-sm text-silver">Должность</span>
                <select value={memberDraft.role_id ?? ""} onChange={(event) => setMemberDraft({ ...memberDraft, role_id: event.target.value })} className="field">
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm text-silver">Статус</span>
                <select value={memberDraft.status} onChange={(event) => setMemberDraft({ ...memberDraft, status: event.target.value as "active" | "archived" })} className="field">
                  <option value="active">Активен</option>
                  <option value="archived">Архивирован</option>
                </select>
              </label>
              <TextArea label="Первое впечатление" value={memberDraft.first_impression} onChange={(value) => setMemberDraft({ ...memberDraft, first_impression: value })} />
            </div>
          </div>
        ) : (
          <div className="royal-border rounded-lg p-6 text-silver">Выбери участника слева, чтобы изменить данные.</div>
        )}
      </div>
    );
  }

  function renderRoles() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {roles.map((role, index) => (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4" key={role.id}>
              <button type="button" className="w-full text-left" onClick={() => setRoleDraft(role)}>
                <p className="font-display text-xl text-white">{role.name}</p>
                <p className="mt-1 text-sm text-silver">Порядок: {role.sort_order}</p>
              </button>
              <div className="mt-3 flex gap-2">
                <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => moveRole(role, -1)} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </button>
                <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => moveRole(role, 1)} disabled={index === roles.length - 1}>
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </button>
                <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => deleteRole(role)}>
                  <Trash className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <form onSubmit={addRole} className="royal-border rounded-lg p-5">
            <h3 className="mb-4 font-display text-2xl text-white">Новая должность</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Название" value={newRole.name} required onChange={(value) => setNewRole({ ...newRole, name: value, slug: newRole.slug || slugifyRoleName(value) })} />
              <Field label="Slug" value={newRole.slug} onChange={(value) => setNewRole({ ...newRole, slug: value })} />
              <Field label="Порядок" type="number" value={newRole.sort_order} onChange={(value) => setNewRole({ ...newRole, sort_order: Number(value) })} />
              <label>
                <span className="mb-2 block text-sm text-silver">Стиль</span>
                <select value={newRole.color_theme ?? "graphite"} onChange={(event) => setNewRole({ ...newRole, color_theme: event.target.value })} className="field">
                  {roleThemes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
              <TextArea label="Описание" value={newRole.description} onChange={(value) => setNewRole({ ...newRole, description: value })} />
            </div>
            <button type="submit" className="button-primary mt-4">
              <Plus className="h-4 w-4" aria-hidden />
              Добавить должность
            </button>
          </form>

          {roleDraft ? (
            <div className="royal-border rounded-lg p-5">
              <h3 className="mb-4 font-display text-2xl text-white">Редактирование должности</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Название" value={roleDraft.name} required onChange={(value) => setRoleDraft({ ...roleDraft, name: value })} />
                <Field label="Slug" value={roleDraft.slug} onChange={(value) => setRoleDraft({ ...roleDraft, slug: value })} />
                <Field label="Порядок" type="number" value={roleDraft.sort_order} onChange={(value) => setRoleDraft({ ...roleDraft, sort_order: Number(value) })} />
                <label>
                  <span className="mb-2 block text-sm text-silver">Стиль</span>
                  <select value={roleDraft.color_theme ?? "graphite"} onChange={(event) => setRoleDraft({ ...roleDraft, color_theme: event.target.value })} className="field">
                    {roleThemes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </label>
                <TextArea label="Описание" value={roleDraft.description} onChange={(value) => setRoleDraft({ ...roleDraft, description: value })} />
              </div>
              <button type="button" className="button-primary mt-4" onClick={saveRole}>
                <Edit className="h-4 w-4" aria-hidden />
                Сохранить должность
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function renderContent() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {contentItems.map((item) => (
            <button
              type="button"
              className={clsx(
                "w-full rounded-lg border p-4 text-left transition hover:border-gold/45",
                contentDraft?.key === item.key ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"
              )}
              key={item.key}
              onClick={() => setContentDraft(item)}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">{item.key}</p>
              <p className="mt-2 font-display text-xl text-white">{item.title}</p>
              <p className="mt-2 max-h-12 overflow-hidden text-sm leading-6 text-silver">{item.body}</p>
            </button>
          ))}
        </div>

        {contentDraft ? (
          <div className="royal-border rounded-lg p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">Редактирование текста</p>
                <h3 className="font-display text-2xl text-white">{contentDraft.title}</h3>
              </div>
              <button type="button" className="button-primary" onClick={saveContent}>
                <Edit className="h-4 w-4" aria-hidden />
                Сохранить текст
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Ключ блока</p>
                <p className="mt-2 text-white">{contentDraft.key}</p>
              </div>
              <Field label="Порядок" type="number" value={contentDraft.sort_order} onChange={(value) => setContentDraft({ ...contentDraft, sort_order: Number(value) })} />
              <Field label="Заголовок" value={contentDraft.title} required onChange={(value) => setContentDraft({ ...contentDraft, title: value })} />
              <Field label="Ссылка, если нужна" value={contentDraft.href} onChange={(value) => setContentDraft({ ...contentDraft, href: value })} />
              <TextArea label="Текст блока" value={contentDraft.body} onChange={(value) => setContentDraft({ ...contentDraft, body: value })} />
            </div>
          </div>
        ) : (
          <div className="royal-border rounded-lg p-6 text-silver">
            Выбери текст слева. Здесь можно менять заголовки и описания главной страницы, истории и информационных блоков.
          </div>
        )}
      </div>
    );
  }

  if (!supabaseReady || !supabase) {
    return (
      <div className="royal-border rounded-lg p-6">
        <Settings className="mb-5 h-8 w-8 text-gold" aria-hidden />
        <h2 className="font-display text-3xl text-white">Supabase ещё не подключён</h2>
        <p className="mt-4 leading-7 text-silver">
          Публичные страницы работают на демо-данных. Чтобы включить админ-панель, создай Supabase-проект и вставь ключи в файл .env.local.
        </p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="royal-border flex items-center gap-3 rounded-lg p-6 text-silver">
        <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden />
        Проверяю вход...
      </div>
    );
  }

  if (!session) {
    return (
      <form onSubmit={signIn} className="royal-border mx-auto max-w-xl rounded-lg p-6">
        <UserCheck className="mb-5 h-8 w-8 text-gold" aria-hidden />
        <h2 className="font-display text-3xl text-white">Вход администратора</h2>
        <p className="mt-3 leading-7 text-silver">Войти можно через пользователя, созданного в Supabase Auth и добавленного в таблицу admin_users.</p>

        <div className="mt-6 grid gap-4">
          <Field label="Email" type="email" value={email} required onChange={setEmail} />
          <Field label="Пароль" type="password" value={password} required onChange={setPassword} />
        </div>

        {error ? <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}

        <button type="submit" className="button-primary mt-5 w-full">
          <Shield className="h-4 w-4" aria-hidden />
          Войти
        </button>
      </form>
    );
  }

  if (!adminChecked) {
    return (
      <div className="royal-border flex items-center gap-3 rounded-lg p-6 text-silver">
        <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden />
        Проверяю права администратора...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="royal-border rounded-lg p-6">
        <XCircle className="mb-5 h-8 w-8 text-red-200" aria-hidden />
        <h2 className="font-display text-3xl text-white">Нет доступа</h2>
        <p className="mt-4 leading-7 text-silver">Вход выполнен, но этот пользователь не добавлен в таблицу admin_users.</p>
        <button type="button" className="button-secondary mt-5" onClick={signOut}>
          <LogOut className="h-4 w-4" aria-hidden />
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Админ-панель</p>
          <h2 className="font-display text-3xl text-white">Управление порталом</h2>
        </div>
        <button type="button" className="button-secondary" onClick={signOut}>
          <LogOut className="h-4 w-4" aria-hidden />
          Выйти
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-5">
        {(["applications", "members", "roles", "archive", "content"] as AdminTab[]).map((item) => {
          const Icon = tabIcons[item];

          return (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setMemberDraft(null);
                setContentDraft(null);
              }}
              className={clsx(
                "flex items-center gap-2 rounded-lg border px-4 py-3 text-left transition",
                tab === item ? "border-gold/60 bg-gold/12 text-gold-soft" : "border-white/10 bg-white/[0.03] text-silver hover:border-gold/30"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {tabLabels[item]}
            </button>
          );
        })}
      </div>

      {notice ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{notice}</p> : null}
      {error ? <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      {dataLoading ? (
        <div className="royal-border flex items-center gap-3 rounded-lg p-5 text-silver">
          <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden />
          Обновляю данные...
        </div>
      ) : null}

      {tab === "applications" ? (
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-3">
            {applications.map((application) => (
              <button
                type="button"
                className={clsx(
                  "w-full rounded-lg border p-4 text-left transition hover:border-gold/45",
                  applicationDraft?.id === application.id ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"
                )}
                key={application.id}
                onClick={() => setApplicationDraft(application)}
              >
                <p className="font-display text-xl text-white">{application.name}</p>
                <p className="mt-1 text-sm text-silver">
                  {application.game_nickname} · {displayStatus(application.status)}
                </p>
              </button>
            ))}
          </div>
          {renderApplicationEditor()}
        </div>
      ) : null}

      {tab === "members" ? renderMemberEditor("active") : null}
      {tab === "archive" ? renderMemberEditor("archived") : null}
      {tab === "roles" ? renderRoles() : null}
      {tab === "content" ? renderContent() : null}
    </div>
  );
}
