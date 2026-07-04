"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Crown,
  Database,
  Edit,
  FileText,
  Globe2,
  GripVertical,
  Home,
  ImageIcon,
  Languages,
  Link,
  LockKeyhole,
  Loader2,
  LogOut,
  MapPin,
  Move,
  Newspaper,
  Plus,
  RotateCcw,
  RotateCw,
  Save,
  Settings,
  Shield,
  Trash,
  Upload,
  User,
  UserCheck,
  XCircle
} from "lucide-react";
import type { IconType } from "react-icons";
import { FaDiscord, FaFacebook, FaGithub, FaGlobe, FaInstagram, FaSteam, FaTelegramPlane, FaTwitch, FaVk, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";
import clsx from "clsx";
import { countryOptions, getCountryBadge } from "@/lib/countries";
import { demoLeadershipProfiles } from "@/lib/demo-data";
import { defaultSiteContent, mergeSiteContent } from "@/lib/site-content";
import { createBrowserSupabaseClient, isBrowserSupabaseConfigured } from "@/lib/supabase/client";
import { Application, CombatRequest, GalleryItem, LeadershipProfile, MemberWithRole, Role, SiteContent, SocialPlatform } from "@/lib/types";

type AdminTab =
  | "dashboard"
  | "stats"
  | "news"
  | "socials"
  | "leader"
  | "applications"
  | "combat"
  | "leaders"
  | "members"
  | "roles"
  | "archive"
  | "gallery"
  | "content"
  | "history"
  | "settings"
  | "users"
  | "access"
  | "logs";

const tabLabels: Record<AdminTab, string> = {
  dashboard: "Панель управления",
  stats: "Статистика",
  news: "Текст",
  socials: "Соцсети",
  leader: "Лидер",
  applications: "Анкеты",
  combat: "МЯСО/КВ",
  leaders: "Руководители",
  members: "Участники",
  roles: "Должности",
  archive: "Архив",
  gallery: "Галерея",
  content: "Тексты",
  history: "История",
  settings: "Настройки",
  users: "Пользователи",
  access: "Роли и доступ",
  logs: "Логи системы"
};

const tabIcons: Record<AdminTab, typeof UserCheck> = {
  dashboard: Home,
  stats: BarChart3,
  news: Newspaper,
  socials: Link,
  leader: Crown,
  applications: UserCheck,
  combat: FileText,
  leaders: UserCheck,
  members: Shield,
  roles: Settings,
  archive: Archive,
  gallery: FileText,
  content: FileText,
  history: BookOpen,
  settings: Settings,
  users: User,
  access: LockKeyhole,
  logs: FileText
};

const adminGroups: Array<{ title: string; items: AdminTab[] }> = [
  { title: "Главное", items: ["dashboard", "stats", "news"] },
  { title: "Гильдия", items: ["leader", "leaders", "members", "applications", "combat", "history", "gallery", "archive"] },
  { title: "Система", items: ["settings", "users", "access", "logs"] }
];

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
  telegram_url: "",
  tiktok_url: "",
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

const emptyGalleryItem: GalleryItem = {
  id: "",
  title: "",
  description: "",
  image_url: "",
  sort_order: 99,
  is_visible: true
};

const emptyLeader: LeadershipProfile = {
  id: "",
  name: "",
  game_nickname: "",
  age: 16,
  role_title: "",
  role_description: "",
  photo_url: "",
  assigned_at: new Date().toISOString().slice(0, 10),
  status: "offline",
  sort_order: 99,
  is_visible: true,
  best_leader_month: "",
  events_count: null,
  wars_count: null,
  invited_count: null,
  social_links: []
};

const emptySocialPlatform: SocialPlatform = {
  id: "",
  name: "",
  icon_key: "website",
  icon_url: "",
  color: "#e3c980",
  sort_order: 99,
  is_visible: true
};

type SocialPreset = {
  name: string;
  icon_key: string;
  color: string;
  sort_order: number;
  Icon: IconType;
};

const socialPresets: SocialPreset[] = [
  { name: "Telegram", icon_key: "telegram", color: "#2aabee", sort_order: 1, Icon: FaTelegramPlane },
  { name: "Discord", icon_key: "discord", color: "#5865f2", sort_order: 2, Icon: FaDiscord },
  { name: "TikTok", icon_key: "tiktok", color: "#ff2f6d", sort_order: 3, Icon: SiTiktok },
  { name: "Instagram", icon_key: "instagram", color: "#e4405f", sort_order: 4, Icon: FaInstagram },
  { name: "YouTube", icon_key: "youtube", color: "#ff0033", sort_order: 5, Icon: FaYoutube },
  { name: "VK", icon_key: "vk", color: "#4c75a3", sort_order: 6, Icon: FaVk },
  { name: "Facebook", icon_key: "facebook", color: "#1877f2", sort_order: 7, Icon: FaFacebook },
  { name: "X", icon_key: "x", color: "#f0f3f7", sort_order: 8, Icon: FaXTwitter },
  { name: "Steam", icon_key: "steam", color: "#66c0f4", sort_order: 9, Icon: FaSteam },
  { name: "Twitch", icon_key: "twitch", color: "#9146ff", sort_order: 10, Icon: FaTwitch },
  { name: "GitHub", icon_key: "github", color: "#f0f3f7", sort_order: 11, Icon: FaGithub },
  { name: "Website", icon_key: "website", color: "#e3c980", sort_order: 12, Icon: FaGlobe },
  { name: "WhatsApp", icon_key: "whatsapp", color: "#25d366", sort_order: 13, Icon: FaWhatsapp }
];

function uniqueGalleryName(file: File) {
  const extension = file.name.split(".").pop() || "jpg";
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `items/${id}.${extension.toLowerCase()}`;
}

function uniqueLeaderPhotoName(file: File) {
  const extension = file.name.split(".").pop() || "jpg";
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `leaders/${id}.${extension.toLowerCase()}`;
}

function uniqueMemberPhotoName(file: File) {
  const extension = file.name.split(".").pop() || "jpg";
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `members/${id}.${extension.toLowerCase()}`;
}

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

function getSocialPreset(iconKey?: string | null) {
  const normalized = (iconKey || "website").toLowerCase();
  return socialPresets.find((preset) => preset.icon_key === normalized) ?? socialPresets.find((preset) => preset.icon_key === "website") ?? socialPresets[0];
}

function getPlatformIcon(platform: Pick<SocialPlatform, "icon_key" | "name">) {
  return getSocialPreset(platform.icon_key || platform.name)?.Icon ?? FaGlobe;
}

function platformFromPreset(preset: SocialPreset): SocialPlatform {
  return {
    id: `preset-${preset.icon_key}`,
    name: preset.name,
    icon_key: preset.icon_key,
    icon_url: null,
    color: preset.color,
    sort_order: preset.sort_order,
    is_visible: true
  };
}

function presetPlatforms(): SocialPlatform[] {
  return socialPresets.map(platformFromPreset);
}

function transientLeaderId(id?: string | null) {
  return Boolean(id?.startsWith("fallback-"));
}

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
} | null | undefined;

const leadershipSchemaRepairMessage =
  "В Supabase не хватает таблиц лидерства: leadership_profiles, social_platforms или leadership_social_links. Выполни SQL-файл supabase/leadership_patch.sql в Supabase SQL Editor, затем обнови страницу админки.";

function isMissingSchemaTableError(error: SupabaseErrorLike) {
  const message = (error?.message ?? "").toLowerCase();
  return error?.code === "PGRST205" || message.includes("could not find the table") || message.includes("schema cache");
}

function adminErrorMessage(error: SupabaseErrorLike, fallback: string) {
  if (isMissingSchemaTableError(error)) {
    return `${leadershipSchemaRepairMessage} Технически: ${error?.message ?? "schema cache"}`;
  }

  return error?.message ?? fallback;
}

function leaderFromMember(member: MemberWithRole, index = 0): LeadershipProfile {
  return {
    ...emptyLeader,
    id: `fallback-${member.id || `leader-${index}`}`,
    name: member.name || "Амир",
    game_nickname: member.game_nickname || "KNTL.Crown",
    age: member.age ?? null,
    nationality: member.nationality,
    country: member.nationality || member.location,
    city: member.location,
    languages: member.languages,
    role_title: member.role?.slug === "leader" ? "Лидер" : member.role?.name ?? "Лидер",
    role_description: member.first_impression || "Лидер Континенталя.",
    signature: member.name,
    photo_url: member.photo_url || "/avatars/leader.svg",
    assigned_at: member.joined_at || new Date().toISOString().slice(0, 10),
    status: "online",
    sort_order: index + 1,
    is_visible: true,
    social_links: []
  };
}

function fallbackLeadershipFromMembers(members: MemberWithRole[]): LeadershipProfile[] {
  if (demoLeadershipProfiles.length) {
    return demoLeadershipProfiles.map((leader) => ({
      ...leader,
      id: `fallback-${leader.id}`,
      social_links:
        leader.social_links?.map((link) => {
          const iconKey = link.platform?.icon_key ?? "website";
          return {
            ...link,
            id: `fallback-${link.id}`,
            leader_id: `fallback-${leader.id}`,
            platform_id: `preset-${iconKey}`,
            platform: link.platform
              ? {
                  ...link.platform,
                  id: `preset-${iconKey}`
                }
              : null
          };
        }) ?? []
    }));
  }

  const leaderMembers = members.filter((member) => member.role?.slug === "leader" || member.name.toLowerCase() === "амир");
  const source = leaderMembers.length ? leaderMembers : members.slice(0, 1);
  return source.map((member, index) => leaderFromMember(member, index));
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
    telegram_url: member.telegram_url || null,
    tiktok_url: member.tiktok_url || null,
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

function AdminEditorOverlay({
  children,
  onClose,
  size = "wide"
}: {
  children: ReactNode;
  onClose: () => void;
  size?: "wide" | "full";
}) {
  return (
    <div className="admin-editor-backdrop" role="dialog" aria-modal="true">
      <div className={clsx("admin-editor-window", size === "full" && "is-full")}>
        <div className="admin-editor-close-row">
          <button type="button" className="button-secondary min-h-0 rounded-2xl px-3 py-2" onClick={onClose}>
            <XCircle className="h-4 w-4" aria-hidden />
            Закрыть
          </button>
        </div>
        <div className="admin-editor-scroll">{children}</div>
      </div>
    </div>
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
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [roles, setRoles] = useState<Role[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [combatRequests, setCombatRequests] = useState<CombatRequest[]>([]);
  const [combatDraft, setCombatDraft] = useState<CombatRequest | null>(null);
  const [leaders, setLeaders] = useState<LeadershipProfile[]>([]);
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);
  const [leaderDraft, setLeaderDraft] = useState<LeadershipProfile | null>(null);
  const [leaderSocials, setLeaderSocials] = useState<Record<string, { enabled: boolean; url: string; sort_order: number }>>({});
  const [leaderUpload, setLeaderUpload] = useState<File | null>(null);
  const [memberUpload, setMemberUpload] = useState<File | null>(null);
  const [leaderDeleteTarget, setLeaderDeleteTarget] = useState<LeadershipProfile | null>(null);
  const [leaderStep, setLeaderStep] = useState(1);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [cropEditorOpen, setCropEditorOpen] = useState(false);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoRotate, setPhotoRotate] = useState(0);
  const [photoX, setPhotoX] = useState(50);
  const [photoY, setPhotoY] = useState(50);
  const [dragLeaderId, setDragLeaderId] = useState<string | null>(null);
  const [dragSocialId, setDragSocialId] = useState<string | null>(null);
  const [socialPickerOpen, setSocialPickerOpen] = useState(false);
  const [socialDraft, setSocialDraft] = useState<SocialPlatform | null>(null);
  const [members, setMembers] = useState<MemberWithRole[]>([]);
  const [archivedMembers, setArchivedMembers] = useState<MemberWithRole[]>([]);
  const [memberStep, setMemberStep] = useState(1);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [contentItems, setContentItems] = useState<SiteContent[]>(defaultSiteContent);
  const [applicationDraft, setApplicationDraft] = useState<Application | null>(null);
  const [memberDraft, setMemberDraft] = useState<MemberWithRole | null>(null);
  const [roleDraft, setRoleDraft] = useState<Role | null>(null);
  const [roleCreateOpen, setRoleCreateOpen] = useState(false);
  const [galleryDraft, setGalleryDraft] = useState<GalleryItem | null>(null);
  const [galleryUpload, setGalleryUpload] = useState<File | null>(null);
  const [contentDraft, setContentDraft] = useState<SiteContent | null>(null);
  const [newRole, setNewRole] = useState<Role>({ ...emptyRole });
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clockTick, setClockTick] = useState(0);

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
    const timer = window.setInterval(() => setClockTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

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

    const [rolesResult, applicationsResult, combatResult, leadersResult, platformsResult, linksResult, membersResult, archivedResult, galleryResult, contentResult] = await Promise.all([
      supabase.from("roles").select("*").order("sort_order", { ascending: true }),
      supabase.from("applications").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("combat_requests").select("*").eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("leadership_profiles").select("*").order("sort_order", { ascending: true }),
      supabase.from("social_platforms").select("*").order("sort_order", { ascending: true }),
      supabase.from("leadership_social_links").select("*").order("sort_order", { ascending: true }),
      supabase.from("members").select("*, role:roles(*)").eq("status", "active").order("joined_at", { ascending: false }),
      supabase.from("members").select("*, role:roles(*)").eq("status", "archived").order("joined_at", { ascending: false }),
      supabase.from("gallery_items").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_content").select("*").order("sort_order", { ascending: true })
    ]);

    const warnings = [
      rolesResult.error ? "roles" : null,
      applicationsResult.error ? "applications" : null,
      combatResult.error ? "combat_requests" : null,
      leadersResult.error ? "leadership_profiles" : null,
      platformsResult.error ? "social_platforms" : null,
      linksResult.error ? "leadership_social_links" : null,
      membersResult.error ? "members" : null,
      archivedResult.error ? "members archive" : null,
      galleryResult.error ? "gallery_items" : null,
      contentResult.error ? "site_content" : null
    ].filter(Boolean);

    const loadedMembers = membersResult.error ? [] : ((membersResult.data ?? []) as MemberWithRole[]);
    const loadedArchivedMembers = archivedResult.error ? [] : ((archivedResult.data ?? []) as MemberWithRole[]);
    const loadedPlatforms = platformsResult.error || !platformsResult.data?.length ? presetPlatforms() : ((platformsResult.data ?? []) as SocialPlatform[]);
    const loadedLeaders =
      leadersResult.error || platformsResult.error || linksResult.error || !leadersResult.data?.length
        ? fallbackLeadershipFromMembers(loadedMembers)
        : ((leadersResult.data ?? []) as LeadershipProfile[]);
    const loadedLinks = (linksResult.error ? [] : (linksResult.data ?? [])) as Array<{ leader_id: string; platform_id: string; url: string; is_visible: boolean; sort_order: number }>;

    setRoles(rolesResult.error ? [] : ((rolesResult.data ?? []) as Role[]));
    setApplications(applicationsResult.error ? [] : ((applicationsResult.data ?? []) as Application[]));
    setCombatRequests(combatResult.error ? [] : ((combatResult.data ?? []) as CombatRequest[]));
    setSocialPlatforms(loadedPlatforms);
    setLeaders(
      loadedLeaders.map((leader) => {
        const linkedSocials = loadedLinks
          .filter((link) => link.leader_id === leader.id)
          .map((link) => ({ ...link, id: `${link.leader_id}-${link.platform_id}`, platform: loadedPlatforms.find((platform) => platform.id === link.platform_id) ?? null }));

        return {
          ...leader,
          social_links: linkedSocials.length ? linkedSocials : leader.social_links ?? []
        };
      })
    );
    setMembers(loadedMembers);
    setArchivedMembers(loadedArchivedMembers);
    setGalleryItems(galleryResult.error ? [] : ((galleryResult.data ?? []) as GalleryItem[]));
    setContentItems(contentResult.error || !contentResult.data?.length ? defaultSiteContent : mergeSiteContent(contentResult.data as SiteContent[]));

    const leadershipSchemaMissing = [leadersResult.error, platformsResult.error, linksResult.error].some(isMissingSchemaTableError);
    if (leadershipSchemaMissing) {
      setError(leadershipSchemaRepairMessage);
    } else if (warnings.length) {
      setError(`Часть разделов пока не загрузилась: ${warnings.join(", ")}. Обычно это значит, что нужно заново выполнить SQL из supabase/schema.sql.`);
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

    setError(null);
    const uploadedUrl = memberUpload ? await uploadMemberPhoto() : null;
    if (memberUpload && !uploadedUrl) return;

    const payload = memberPayload({ ...memberDraft, photo_url: uploadedUrl || memberDraft.photo_url });
    const request = memberDraft.id ? supabase.from("members").update(payload).eq("id", memberDraft.id) : supabase.from("members").insert(payload);
    const { error: updateError } = await request;

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setNotice(memberDraft.id ? "Данные участника сохранены." : "Участник добавлен.");
    setMemberUpload(null);
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

  async function updateCombatRequest(status: "contacted" | "rejected") {
    if (!supabase || !combatDraft) return;

    const { error: updateError } = await supabase.from("combat_requests").update({ status }).eq("id", combatDraft.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setCombatDraft(null);
    setNotice(status === "contacted" ? "Заявка МЯСО/КВ отмечена как обработанная." : "Заявка МЯСО/КВ отклонена.");
    await loadData();
  }

  async function deleteCombatRequest(request: CombatRequest) {
    if (!supabase) return;
    const confirmed = window.confirm(`Удалить заявку от ${request.guild_name}?`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from("combat_requests").delete().eq("id", request.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setCombatDraft(null);
    setNotice("Заявка МЯСО/КВ удалена.");
    await loadData();
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

  async function uploadGalleryImage() {
    if (!supabase || !galleryUpload) return null;

    if (!galleryUpload.type.startsWith("image/")) {
      setError("В галерею можно загрузить только изображение.");
      return null;
    }

    if (galleryUpload.size > 10 * 1024 * 1024) {
      setError("Фото для галереи должно быть меньше 10 МБ.");
      return null;
    }

    const filePath = uniqueGalleryName(galleryUpload);
    const { error: uploadError } = await supabase.storage.from("gallery").upload(filePath, galleryUpload, {
      cacheControl: "3600",
      upsert: false
    });

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function saveGalleryItem() {
    if (!supabase || !galleryDraft) return;

    setError(null);
    const uploadedUrl = galleryUpload ? await uploadGalleryImage() : null;
    if (galleryUpload && !uploadedUrl) return;

    const payload = {
      title: galleryDraft.title,
      description: galleryDraft.description || null,
      image_url: uploadedUrl || galleryDraft.image_url,
      sort_order: Number(galleryDraft.sort_order),
      is_visible: Boolean(galleryDraft.is_visible)
    };

    if (!payload.image_url) {
      setError("Добавь фото или вставь ссылку на изображение.");
      return;
    }

    const request = galleryDraft.id
      ? supabase.from("gallery_items").update(payload).eq("id", galleryDraft.id)
      : supabase.from("gallery_items").insert(payload);

    const { error: saveError } = await request;

    if (saveError) {
      setError(saveError.message);
      return;
    }

    setGalleryDraft(null);
    setGalleryUpload(null);
    setNotice("Галерея сохранена.");
    await loadData();
  }

  async function deleteGalleryItem(item: GalleryItem) {
    if (!supabase) return;
    const confirmed = window.confirm(`Удалить фото "${item.title}" из галереи?`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from("gallery_items").delete().eq("id", item.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setGalleryDraft(null);
    setNotice("Фото удалено из галереи.");
    await loadData();
  }

  async function uploadLeaderPhoto() {
    if (!supabase || !leaderUpload) return null;

    if (!leaderUpload.type.startsWith("image/")) {
      setError("Фото руководителя должно быть изображением.");
      return null;
    }

    if (leaderUpload.size > 5 * 1024 * 1024) {
      setError("Фото руководителя должно быть меньше 5 МБ.");
      return null;
    }

    const filePath = uniqueLeaderPhotoName(leaderUpload);
    const { error: uploadError } = await supabase.storage.from("member-photos").upload(filePath, leaderUpload, {
      cacheControl: "3600",
      upsert: false
    });

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("member-photos").getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function uploadMemberPhoto() {
    if (!supabase || !memberUpload) return null;

    if (!memberUpload.type.startsWith("image/")) {
      setError("Фото участника должно быть изображением.");
      return null;
    }

    if (memberUpload.size > 5 * 1024 * 1024) {
      setError("Фото участника должно быть меньше 5 МБ.");
      return null;
    }

    const filePath = uniqueMemberPhotoName(memberUpload);
    const { error: uploadError } = await supabase.storage.from("member-photos").upload(filePath, memberUpload, {
      cacheControl: "3600",
      upsert: false
    });

    if (uploadError) {
      setError(uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("member-photos").getPublicUrl(filePath);
    return data.publicUrl;
  }

  function openLeaderEditor(leader: LeadershipProfile) {
    const socials: Record<string, { enabled: boolean; url: string; sort_order: number }> = {};
    for (const platform of socialPlatforms) {
      const platformKey = (platform.icon_key || platform.name).toLowerCase();
      const link = leader.social_links?.find((item) => {
        const linkKey = (item.platform?.icon_key || item.platform?.name || "").toLowerCase();
        return item.platform_id === platform.id || Boolean(linkKey && linkKey === platformKey);
      });
      socials[platform.id] = {
        enabled: Boolean(link?.is_visible && link.url),
        url: link?.url ?? "",
        sort_order: link?.sort_order ?? platform.sort_order
      };
    }
    setLeaderDraft(leader);
    setLeaderSocials(socials);
    setLeaderUpload(null);
    setLeaderStep(1);
    setPhotoMenuOpen(false);
    setMediaLibraryOpen(false);
    setCropEditorOpen(false);
    setPhotoScale(1);
    setPhotoRotate(0);
    setPhotoX(50);
    setPhotoY(50);
  }

  function openLeaderFromMember(memberId: string, forcedRoleTitle?: string) {
    const member = members.find((item) => item.id === memberId);
    if (!member) return;

    openLeaderEditor({
      ...emptyLeader,
      name: member.name,
      game_nickname: member.game_nickname,
      age: member.age,
      nationality: member.nationality,
      country: member.location,
      city: member.location,
      languages: member.languages,
      role_title: forcedRoleTitle ?? member.role?.name ?? "Руководитель",
      role_description: member.first_impression || "",
      photo_url: member.photo_url,
      assigned_at: new Date().toISOString().slice(0, 10),
      sort_order: forcedRoleTitle ? 1 : leaders.length + 1
    });
  }

  async function saveLeader() {
    if (!supabase || !leaderDraft) return;

    setError(null);
    const uploadedUrl = leaderUpload ? await uploadLeaderPhoto() : null;
    if (leaderUpload && !uploadedUrl) return;

    const payload = {
      name: leaderDraft.name,
      game_nickname: leaderDraft.game_nickname || null,
      age: leaderDraft.age ? Number(leaderDraft.age) : null,
      nationality: leaderDraft.nationality || null,
      country: leaderDraft.country || null,
      city: leaderDraft.city || null,
      languages: leaderDraft.languages || null,
      role_title: leaderDraft.role_title,
      role_description: leaderDraft.role_description || null,
      signature: leaderDraft.signature || null,
      photo_url: uploadedUrl || leaderDraft.photo_url || null,
      background_url: leaderDraft.background_url || null,
      cover_url: leaderDraft.cover_url || null,
      assigned_at: leaderDraft.assigned_at,
      status: leaderDraft.status,
      sort_order: Number(leaderDraft.sort_order),
      is_visible: Boolean(leaderDraft.is_visible),
      best_leader_month: leaderDraft.best_leader_month || null,
      events_count: leaderDraft.events_count ? Number(leaderDraft.events_count) : null,
      wars_count: leaderDraft.wars_count ? Number(leaderDraft.wars_count) : null,
      invited_count: leaderDraft.invited_count ? Number(leaderDraft.invited_count) : null
    };

    const shouldUpdateLeader = Boolean(leaderDraft.id && !transientLeaderId(leaderDraft.id));
    const saveResult = shouldUpdateLeader
      ? await supabase.from("leadership_profiles").update(payload).eq("id", leaderDraft.id).select("id").single()
      : await supabase.from("leadership_profiles").insert(payload).select("id").single();

    if (saveResult.error || !saveResult.data) {
      setError(adminErrorMessage(saveResult.error, "Не удалось сохранить руководителя."));
      return;
    }

    const leaderId = saveResult.data.id as string;
    for (const platform of socialPlatforms) {
      const value = leaderSocials[platform.id];
      if (!value) continue;
      const url = value.url.trim();

      if (value.enabled && url) {
        const persistedPlatform = await ensurePersistedPlatform(platform);
        if (!persistedPlatform || persistedPlatform.id.startsWith("preset-")) {
          setError(leadershipSchemaRepairMessage);
          return;
        }

        const { error: linkError } = await supabase.from("leadership_social_links").upsert(
          {
            leader_id: leaderId,
            platform_id: persistedPlatform.id,
            url,
            is_visible: true,
            sort_order: Number(value.sort_order)
          },
          { onConflict: "leader_id,platform_id" }
        );
        if (linkError) {
          setError(adminErrorMessage(linkError, "Не удалось сохранить ссылку руководителя."));
          return;
        }
      } else if (!platform.id.startsWith("preset-")) {
        await supabase.from("leadership_social_links").delete().eq("leader_id", leaderId).eq("platform_id", platform.id);
      }
    }

    setLeaderDraft(null);
    setLeaderUpload(null);
    setNotice("Руководитель сохранён.");
    await loadData();
  }

  async function deleteLeader(leader: LeadershipProfile) {
    if (!supabase) return;
    if (transientLeaderId(leader.id)) {
      setLeaders((current) => current.filter((item) => item.id !== leader.id));
      setLeaderDraft(null);
      setLeaderDeleteTarget(null);
      setNotice("Заготовка лидера убрана из редактора. Если нужно удалить опубликованного лидера, сначала сохраните данные в Supabase.");
      return;
    }

    const { error: deleteError } = await supabase.from("leadership_profiles").delete().eq("id", leader.id);
    if (deleteError) {
      setError(adminErrorMessage(deleteError, "Не удалось удалить руководителя."));
      return;
    }
    setLeaderDraft(null);
    setLeaderDeleteTarget(null);
    setNotice("Руководитель удалён.");
    await loadData();
  }

  async function moveLeader(leader: LeadershipProfile, direction: -1 | 1) {
    if (!supabase) return;
    const index = leaders.findIndex((item) => item.id === leader.id);
    const neighbor = leaders[index + direction];
    if (!neighbor) return;
    const [firstResult, secondResult] = await Promise.all([
      supabase.from("leadership_profiles").update({ sort_order: neighbor.sort_order }).eq("id", leader.id),
      supabase.from("leadership_profiles").update({ sort_order: leader.sort_order }).eq("id", neighbor.id)
    ]);
    if (firstResult.error || secondResult.error) {
      setError(adminErrorMessage(firstResult.error ?? secondResult.error, "Не удалось поменять порядок руководителей."));
      return;
    }
    await loadData();
  }

  async function dropLeaderOn(target: LeadershipProfile) {
    if (!supabase || !dragLeaderId || dragLeaderId === target.id) {
      setDragLeaderId(null);
      return;
    }

    const dragged = leaders.find((leader) => leader.id === dragLeaderId);
    if (!dragged) {
      setDragLeaderId(null);
      return;
    }

    const [firstResult, secondResult] = await Promise.all([
      supabase.from("leadership_profiles").update({ sort_order: target.sort_order }).eq("id", dragged.id),
      supabase.from("leadership_profiles").update({ sort_order: dragged.sort_order }).eq("id", target.id)
    ]);

    if (firstResult.error || secondResult.error) {
      setError(adminErrorMessage(firstResult.error ?? secondResult.error, "Не удалось поменять порядок руководителей."));
    }

    setDragLeaderId(null);
    await loadData();
  }

  async function saveSocialPlatform() {
    if (!supabase || !socialDraft) return;
    const payload = {
      name: socialDraft.name,
      icon_key: socialDraft.icon_key || "website",
      icon_url: socialDraft.icon_url || null,
      color: socialDraft.color || null,
      sort_order: Number(socialDraft.sort_order),
      is_visible: Boolean(socialDraft.is_visible)
    };
    const request = socialDraft.id ? supabase.from("social_platforms").update(payload).eq("id", socialDraft.id) : supabase.from("social_platforms").insert(payload);
    const { error: saveError } = await request;
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSocialDraft(null);
    setNotice("Социальная сеть сохранена.");
    await loadData();
  }

  async function deleteSocialPlatform(platform: SocialPlatform) {
    if (!supabase) return;
    const confirmed = window.confirm(`Удалить социальную сеть ${platform.name}?`);
    if (!confirmed) return;
    const { error: deleteError } = await supabase.from("social_platforms").delete().eq("id", platform.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setSocialDraft(null);
    setNotice("Социальная сеть удалена.");
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
          <label>
            <span className="mb-2 block text-sm text-silver">Страна / флаг</span>
            <select value={applicationDraft.nationality ?? ""} onChange={(event) => setApplicationDraft({ ...applicationDraft, nationality: event.target.value })} className="field">
              <option value="">Не выбрано</option>
              {countryOptions.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </label>
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

  function renderCombatRequests() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          {combatRequests.length ? null : <div className="royal-border rounded-lg p-5 text-silver">Новых заявок МЯСО/КВ пока нет.</div>}
          {combatRequests.map((request) => (
            <button
              type="button"
              className={clsx(
                "w-full rounded-lg border p-4 text-left transition hover:border-gold/45",
                combatDraft?.id === request.id ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"
              )}
              key={request.id}
              onClick={() => setCombatDraft(request)}
            >
              <p className="font-display text-xl text-white">{request.guild_name}</p>
              <p className="mt-1 text-sm text-silver">{request.telegram_username} · На проверке</p>
            </button>
          ))}
        </div>

        {combatDraft ? (
          <div className="royal-border rounded-lg p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">Заявка МЯСО/КВ</p>
                <h3 className="font-display text-2xl text-white">{combatDraft.guild_name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="button-primary" onClick={() => updateCombatRequest("contacted")}>
                  <CheckCircle className="h-4 w-4" aria-hidden />
                  Связались
                </button>
                <button type="button" className="button-secondary" onClick={() => updateCombatRequest("rejected")}>
                  <XCircle className="h-4 w-4" aria-hidden />
                  Отклонить
                </button>
                <button type="button" className="button-secondary" onClick={() => deleteCombatRequest(combatDraft)}>
                  <Trash className="h-4 w-4" aria-hidden />
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Название гильдии</p>
                <p className="mt-2 text-white">{combatDraft.guild_name}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Telegram</p>
                <p className="mt-2 text-white">{combatDraft.telegram_username}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Согласие</p>
                <p className="mt-2 text-white">{combatDraft.rules_agreed ? "С правилами согласен" : "Нет согласия"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Дата заявки</p>
                <p className="mt-2 text-white">{combatDraft.created_at ? new Date(combatDraft.created_at).toLocaleString("ru-RU") : "Не указано"}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Описание</p>
                <p className="mt-2 leading-7 text-white">{combatDraft.description || "Без описания"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="royal-border rounded-lg p-6 text-silver">Выбери заявку слева, чтобы открыть её.</div>
        )}
      </div>
    );
  }

  function getLeaderDuration(date: string) {
    void clockTick;
    const diff = Math.max(0, Date.now() - new Date(date).getTime());
    const totalSeconds = Math.floor(diff / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
  }

  function updateLeaderSocial(platformId: string, value: Partial<{ enabled: boolean; url: string; sort_order: number }>) {
    const current = leaderSocials[platformId] ?? { enabled: false, url: "", sort_order: socialPlatforms.find((platform) => platform.id === platformId)?.sort_order ?? 99 };
    setLeaderSocials({ ...leaderSocials, [platformId]: { ...current, ...value } });
  }

  async function ensurePersistedPlatform(platform: SocialPlatform) {
    if (!supabase || !platform.id.startsWith("preset-")) {
      return platform;
    }

    const payload = {
      name: platform.name,
      icon_key: platform.icon_key,
      icon_url: platform.icon_url || null,
      color: platform.color || "#e3c980",
      sort_order: platform.sort_order,
      is_visible: true
    };

    const { data, error: insertError } = await supabase.from("social_platforms").insert(payload).select("*").single();
    if (!insertError && data) {
      return data as SocialPlatform;
    }

    const { data: existingByIcon } = await supabase.from("social_platforms").select("*").eq("icon_key", platform.icon_key).maybeSingle();
    if (existingByIcon) {
      return existingByIcon as SocialPlatform;
    }

    const { data: existingByName } = await supabase.from("social_platforms").select("*").eq("name", platform.name).maybeSingle();
    return existingByName ? (existingByName as SocialPlatform) : null;
  }

  function isMainLeaderProfile(leader: LeadershipProfile) {
    const title = leader.role_title.toLowerCase();
    return title.includes("лидер") && !title.includes("врем");
  }

  async function addPresetSocial(preset: SocialPreset) {
    setError(null);
    const existing = socialPlatforms.find((platform) => platform.icon_key.toLowerCase() === preset.icon_key || platform.name.toLowerCase() === preset.name.toLowerCase());
    const previousId = existing?.id ?? "";
    let platform = existing ?? null;

    if (platform?.id.startsWith("preset-")) {
      platform = (await ensurePersistedPlatform(platform)) ?? platform;
    }

    if (!platform && supabase) {
      const { data, error: insertError } = await supabase
        .from("social_platforms")
        .insert({
          name: preset.name,
          icon_key: preset.icon_key,
          icon_url: null,
          color: preset.color,
          sort_order: preset.sort_order,
          is_visible: true
        })
        .select("*")
        .single();

      if (!insertError && data) {
        platform = data as SocialPlatform;
      }
    }

    if (!platform) {
      platform = platformFromPreset(preset);
    }

    const selectedPlatform = platform;
    setSocialPlatforms((current) => {
      const withoutDuplicate = current.filter(
        (item) => item.id !== previousId && item.id !== selectedPlatform.id && item.icon_key.toLowerCase() !== selectedPlatform.icon_key.toLowerCase()
      );
      return [...withoutDuplicate, selectedPlatform].sort((first, second) => first.sort_order - second.sort_order);
    });
    setLeaderSocials((current) => {
      const previousValue = previousId ? current[previousId] : undefined;
      const currentValue = current[selectedPlatform.id];
      const next = { ...current };
      if (previousId && previousId !== selectedPlatform.id) {
        delete next[previousId];
      }
      next[selectedPlatform.id] = {
        enabled: true,
        url: previousValue?.url ?? currentValue?.url ?? "",
        sort_order: previousValue?.sort_order ?? currentValue?.sort_order ?? selectedPlatform.sort_order
      };
      return next;
    });
    setSocialPickerOpen(false);
    setNotice(`${preset.name} добавлена. Осталось вставить ссылку и сохранить руководителя.`);
  }

  function dropSocialOn(targetId: string) {
    if (!dragSocialId || dragSocialId === targetId) {
      setDragSocialId(null);
      return;
    }

    const dragged = leaderSocials[dragSocialId];
    const target = leaderSocials[targetId];
    const draggedPlatform = socialPlatforms.find((platform) => platform.id === dragSocialId);
    const targetPlatform = socialPlatforms.find((platform) => platform.id === targetId);

    setLeaderSocials({
      ...leaderSocials,
      [dragSocialId]: {
        enabled: dragged?.enabled ?? false,
        url: dragged?.url ?? "",
        sort_order: target?.sort_order ?? targetPlatform?.sort_order ?? 99
      },
      [targetId]: {
        enabled: target?.enabled ?? false,
        url: target?.url ?? "",
        sort_order: dragged?.sort_order ?? draggedPlatform?.sort_order ?? 99
      }
    });
    setDragSocialId(null);
  }

  function clearEditorState() {
    setMemberDraft(null);
    setMemberStep(1);
    setContentDraft(null);
    setCombatDraft(null);
    setGalleryDraft(null);
    setLeaderDraft(null);
    setSocialDraft(null);
    setRoleCreateOpen(false);
    setSocialPickerOpen(false);
  }

  function renderLeaderPreview() {
    if (!leaderDraft) return null;

    const duration = getLeaderDuration(leaderDraft.assigned_at);
    const enabledSocials = socialPlatforms
      .map((platform) => ({ platform, value: leaderSocials[platform.id] }))
      .filter((item) => item.value?.enabled && item.value.url.trim())
      .sort((first, second) => (first.value?.sort_order ?? 0) - (second.value?.sort_order ?? 0));

    return (
      <aside className="sticky top-28 rounded-[24px] border border-gold/25 bg-gradient-to-br from-white/[0.09] to-black/50 p-4 shadow-[0_0_60px_rgba(201,164,93,0.12)] backdrop-blur">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold-soft">Живой предпросмотр</p>
        <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/35">
          <img
            src={leaderDraft.photo_url || "/avatars/leader.svg"}
            alt=""
            className="h-[300px] w-full object-cover"
            style={{ objectPosition: `${photoX}% ${photoY}%`, transform: `scale(${photoScale}) rotate(${photoRotate}deg)` }}
          />
        </div>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-soft">{leaderDraft.role_title || "Должность"}</p>
          <h3 className="mt-2 font-display text-3xl text-white">{leaderDraft.name || "Имя руководителя"}</h3>
          <p className="mt-1 text-silver">{leaderDraft.game_nickname || "Игровой ник"}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-silver">
            <span>Возраст: {leaderDraft.age || "—"}</span>
            <span>{leaderDraft.status === "online" ? "Онлайн" : "Не в сети"}</span>
            <span>{leaderDraft.country || "Страна"}</span>
            <span>{leaderDraft.city || "Город"}</span>
          </div>
          <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-gold-soft">В должности</p>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center">
              {[
                ["дней", duration.days],
                ["часов", duration.hours],
                ["мин", duration.minutes],
                ["сек", duration.seconds]
              ].map(([label, value]) => (
                <div className="rounded-xl bg-black/30 p-2" key={label as string}>
                  <p className="font-display text-xl text-white">{value as number}</p>
                  <p className="text-[0.62rem] uppercase text-silver">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
          {enabledSocials.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {enabledSocials.map(({ platform }) => {
                const SocialIcon = getPlatformIcon(platform);
                return (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold" style={{ color: platform.color ?? "#e3c980" }} key={platform.id}>
                  <SocialIcon className="h-4 w-4" aria-hidden />
                  {platform.name}
                </span>
                );
              })}
            </div>
          ) : null}
        </div>
      </aside>
    );
  }

  function renderLeaders(mode: "all" | "leader" = "all") {
    const duration = leaderDraft ? getLeaderDuration(leaderDraft.assigned_at) : null;
    const visibleLeaders = mode === "leader" ? leaders.filter(isMainLeaderProfile) : leaders;
    const emptyText =
      mode === "leader"
        ? "Лидер пока не выбран. Создай карточку лидера или назначь его из участников."
        : "Руководителей пока нет. Нажми кнопку выше и создай первую карточку.";
    const infoRows = leaderDraft
      ? [
          { icon: User, label: "Имя", value: leaderDraft.name, type: "text", onChange: (value: string) => setLeaderDraft({ ...leaderDraft, name: value }) },
          { icon: Shield, label: "Игровой ник", value: leaderDraft.game_nickname ?? "", type: "text", onChange: (value: string) => setLeaderDraft({ ...leaderDraft, game_nickname: value }) },
          { icon: UserCheck, label: "Возраст", value: leaderDraft.age ?? "", type: "number", onChange: (value: string) => setLeaderDraft({ ...leaderDraft, age: value ? Number(value) : null }) },
          { icon: Crown, label: "Нация", value: leaderDraft.nationality ?? "", type: "text", onChange: (value: string) => setLeaderDraft({ ...leaderDraft, nationality: value }) },
          { icon: MapPin, label: "Город", value: leaderDraft.city ?? "", type: "text", onChange: (value: string) => setLeaderDraft({ ...leaderDraft, city: value }) },
          { icon: Languages, label: "Языки", value: leaderDraft.languages ?? "", type: "text", onChange: (value: string) => setLeaderDraft({ ...leaderDraft, languages: value }) }
        ]
      : [];

    return (
      <div className="admin-leader-grid">
        <div className="space-y-4">
          <button
            type="button"
            className="button-primary w-full rounded-2xl"
            onClick={() => openLeaderEditor({ ...emptyLeader, role_title: mode === "leader" ? "Лидер" : "", sort_order: mode === "leader" ? 1 : leaders.length + 1 })}
          >
            <Plus className="h-4 w-4" aria-hidden />
            {mode === "leader" ? "Создать лидера" : "Добавить руководителя"}
          </button>

          <label className="block rounded-[22px] border border-gold/20 bg-gold/10 p-4">
            <span className="mb-2 block text-sm font-bold text-gold-soft">{mode === "leader" ? "Назначить лидера из участников" : "Назначить из участников"}</span>
            <select className="field" defaultValue="" onChange={(event) => openLeaderFromMember(event.target.value, mode === "leader" ? "Лидер" : undefined)}>
              <option value="" disabled>
                Выбери участника
              </option>
              {members.map((member) => (
                <option value={member.id} key={member.id}>
                  {member.name} — {member.role?.name ?? member.game_nickname}
                </option>
              ))}
            </select>
          </label>

          {visibleLeaders.length ? null : <div className="royal-border rounded-lg p-5 text-silver">{emptyText}</div>}

          {visibleLeaders.map((leader, index) => (
            <div
              className={clsx(
                "group rounded-[22px] border p-4 transition hover:-translate-y-1 hover:border-gold/45",
                leaderDraft?.id === leader.id ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]",
                dragLeaderId === leader.id && "opacity-60"
              )}
              draggable
              key={leader.id}
              onDragStart={() => setDragLeaderId(leader.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dropLeaderOn(leader)}
            >
              <button type="button" className="flex w-full gap-3 text-left" onClick={() => openLeaderEditor(leader)}>
                <img src={leader.photo_url || "/avatars/member.svg"} alt="" className="h-16 w-20 rounded-md border border-white/10 object-cover" />
                <span>
                  <span className="block font-display text-xl text-white">{leader.name}</span>
                  <span className="mt-1 block text-sm text-silver">
                    {leader.role_title} · порядок {leader.sort_order}
                  </span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-gold-soft">{leader.status === "online" ? "Онлайн" : "Не в сети"}</span>
                </span>
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => moveLeader(leader, -1)} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </button>
                <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => moveLeader(leader, 1)} disabled={index === visibleLeaders.length - 1}>
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </button>
                <button type="button" className="button-secondary min-h-0 px-3 py-2 hover:border-red-300/60 hover:bg-red-500/10" onClick={() => setLeaderDeleteTarget(leader)}>
                  <Trash className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="min-w-0">
          {leaderDraft ? (
            <div className="royal-border space-y-5 rounded-[28px] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Редактор профиля</p>
                  <h3 className="font-display text-3xl text-white">{leaderDraft.id ? leaderDraft.name : "Новый руководитель"}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="button-primary rounded-2xl" onClick={saveLeader}>
                    <Save className="h-4 w-4" aria-hidden />
                    {leaderDraft.id ? "Сохранить изменения" : "Создать руководителя"}
                  </button>
                  {leaderDraft.id ? (
                    <button type="button" className="button-secondary rounded-2xl border-red-300/35 bg-red-500/10 text-red-100" onClick={() => setLeaderDeleteTarget(leaderDraft)}>
                      <Trash className="h-4 w-4" aria-hidden />
                      Удалить руководителя
                    </button>
                  ) : null}
                </div>
              </div>

              <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Фото</p>
                    <h4 className="font-display text-2xl text-white">Фото руководителя</h4>
                  </div>
                  <ImageIcon className="h-5 w-5 text-gold" aria-hidden />
                </div>
                <button type="button" className="group relative block w-full overflow-hidden rounded-[24px] border border-gold/25 bg-black/35" onClick={() => setPhotoMenuOpen(!photoMenuOpen)}>
                  <img
                    src={leaderDraft.photo_url || "/avatars/leader.svg"}
                    alt=""
                    className="h-[310px] w-full object-cover transition duration-300 group-hover:scale-[1.03] max-sm:h-[240px]"
                    style={{ objectPosition: `${photoX}% ${photoY}%`, transform: `scale(${photoScale}) rotate(${photoRotate}deg)` }}
                  />
                  <span className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-sm font-bold text-white backdrop-blur">
                    Нажмите, чтобы изменить фото
                  </span>
                </button>

                {photoMenuOpen ? (
                  <div className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-black/50 p-3 sm:grid-cols-3">
                    <label className="button-secondary justify-start rounded-2xl">
                      <Upload className="h-4 w-4" aria-hidden />
                      Выбрать из устройства
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          setLeaderUpload(file);
                          if (file) {
                            setLeaderDraft({ ...leaderDraft, photo_url: URL.createObjectURL(file) });
                            setCropEditorOpen(true);
                          }
                        }}
                      />
                    </label>
                    <button type="button" className="button-secondary justify-start rounded-2xl" onClick={() => setMediaLibraryOpen(!mediaLibraryOpen)}>
                      <ImageIcon className="h-4 w-4" aria-hidden />
                      Выбрать из медиатеки
                    </button>
                    <button type="button" className="button-secondary justify-start rounded-2xl" onClick={() => setLeaderDraft({ ...leaderDraft, photo_url: "" })}>
                      <Trash className="h-4 w-4" aria-hidden />
                      Удалить фото
                    </button>
                  </div>
                ) : null}

                {mediaLibraryOpen ? (
                  <div className="mt-3 grid max-h-72 gap-2 overflow-auto rounded-2xl border border-white/10 bg-black/50 p-3 sm:grid-cols-2">
                    {galleryItems.length ? null : <p className="text-sm text-silver">Медиатека пока пустая. Фото можно добавить во вкладке “Галерея”.</p>}
                    {galleryItems.map((item) => (
                      <button
                        type="button"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-left hover:border-gold/40"
                        key={item.id}
                        onClick={() => {
                          setLeaderDraft({ ...leaderDraft, photo_url: item.image_url });
                          setMediaLibraryOpen(false);
                          setCropEditorOpen(true);
                        }}
                      >
                        <img src={item.image_url} alt="" className="h-14 w-20 rounded-lg object-cover" />
                        <span className="text-sm text-white">{item.title}</span>
                      </button>
                    ))}
                  </div>
                ) : null}

                {cropEditorOpen ? (
                  <div className="mt-4 rounded-[24px] border border-gold/25 bg-gold/10 p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h4 className="font-display text-xl text-white">Настройка изображения</h4>
                      <button type="button" className="button-secondary min-h-0 rounded-2xl px-3 py-2" onClick={() => setCropEditorOpen(false)}>
                        Сохранить кадр
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {[
                        ["Масштаб", "1", "1.8", photoScale, setPhotoScale, "0.05"],
                        ["Перемещение X", "0", "100", photoX, setPhotoX, "1"],
                        ["Перемещение Y", "0", "100", photoY, setPhotoY, "1"],
                        ["Поворот", "-12", "12", photoRotate, setPhotoRotate, "1"]
                      ].map(([label, min, max, value, setter, step]) => (
                        <label className="text-sm text-silver" key={label as string}>
                          {label as string}
                          <input
                            type="range"
                            min={min as string}
                            max={max as string}
                            step={step as string}
                            value={value as number}
                            onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
                            className="mt-2 w-full accent-[#c9a45d]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Основная информация</p>
                <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
                  {infoRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <label className="grid gap-3 bg-black/20 p-4 sm:grid-cols-[1fr_minmax(14rem,1.25fr)] sm:items-center" key={row.label}>
                        <span className="flex items-center gap-3 font-bold text-white">
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold-soft">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          {row.label}
                        </span>
                        <input className="field min-h-[3rem] rounded-2xl" type={row.type} value={row.value} onChange={(event) => row.onChange(event.target.value)} />
                      </label>
                    );
                  })}
                  <label className="grid gap-3 bg-black/20 p-4 sm:grid-cols-[1fr_minmax(14rem,1.25fr)] sm:items-center">
                    <span className="flex items-center gap-3 font-bold text-white">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold-soft">
                        <Globe2 className="h-4 w-4" aria-hidden />
                      </span>
                      Страна / флаг
                    </span>
                    <select className="field min-h-[3rem] rounded-2xl" value={leaderDraft.country ?? ""} onChange={(event) => setLeaderDraft({ ...leaderDraft, country: event.target.value })}>
                      <option value="">Не выбрано</option>
                      {countryOptions.map((country) => (
                        <option value={country.name} key={country.name}>
                          {country.flag} {country.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Должность</p>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Field label="Должность" value={leaderDraft.role_title} required onChange={(value) => setLeaderDraft({ ...leaderDraft, role_title: value })} />
                  <Field label="Дата назначения" type="date" value={leaderDraft.assigned_at} required onChange={(value) => setLeaderDraft({ ...leaderDraft, assigned_at: value })} />
                  <Field label="Порядок отображения" type="number" value={leaderDraft.sort_order} onChange={(value) => setLeaderDraft({ ...leaderDraft, sort_order: Number(value) })} />
                  <label>
                    <span className="mb-2 block text-sm text-silver">Статус</span>
                    <select value={leaderDraft.status} onChange={(event) => setLeaderDraft({ ...leaderDraft, status: event.target.value as "online" | "offline" })} className="field">
                      <option value="online">Онлайн</option>
                      <option value="offline">Не в сети</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 xl:col-span-2">
                    <input type="checkbox" checked={leaderDraft.is_visible} onChange={(event) => setLeaderDraft({ ...leaderDraft, is_visible: event.target.checked })} className="h-4 w-4 accent-[#c9a45d]" />
                    <span className="text-sm text-silver">Показывать на странице руководства</span>
                  </label>
                </div>
                {duration ? (
                  <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-gold-soft">Таймер должности</p>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                      {[["дней", duration.days], ["часов", duration.hours], ["мин", duration.minutes], ["сек", duration.seconds]].map(([label, value]) => (
                        <div className="rounded-xl bg-black/30 p-3" key={label as string}>
                          <p className="font-display text-2xl text-white">{value as number}</p>
                          <p className="text-[0.65rem] uppercase text-silver">{label as string}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-gold-soft">Социальные сети</p>
                  <button type="button" className="button-secondary min-h-0 rounded-2xl px-3 py-2" onClick={() => setSocialPickerOpen(true)}>
                    <Plus className="h-4 w-4" aria-hidden />
                    Добавить соцсеть
                  </button>
                </div>
                <div className="space-y-3">
                  {socialPlatforms
                    .map((platform) => ({ platform, value: leaderSocials[platform.id] ?? { enabled: false, url: "", sort_order: platform.sort_order } }))
                    .sort((first, second) => (first.value.sort_order ?? first.platform.sort_order) - (second.value.sort_order ?? second.platform.sort_order))
                    .map(({ platform, value }) => {
                    const SocialIcon = getPlatformIcon(platform);
                    return (
                      <div
                        className={clsx(
                          "grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 transition hover:border-gold/35 lg:grid-cols-[2rem_minmax(10rem,0.8fr)_minmax(13rem,1fr)] 2xl:grid-cols-[2rem_minmax(10rem,0.8fr)_minmax(13rem,1fr)_6.5rem_3rem]",
                          dragSocialId === platform.id && "opacity-60"
                        )}
                        draggable
                        key={platform.id}
                        onDragStart={() => setDragSocialId(platform.id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => dropSocialOn(platform.id)}
                      >
                        <GripVertical className="mt-3 h-4 w-4 text-silver" aria-hidden />
                        <label className="flex items-center gap-3 text-sm font-bold text-white">
                          <input type="checkbox" checked={value.enabled} onChange={(event) => updateLeaderSocial(platform.id, { enabled: event.target.checked })} className="h-4 w-4 accent-[#c9a45d]" />
                          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/30" style={{ color: platform.color ?? "#e3c980" }}>
                            {platform.icon_url ? <img src={platform.icon_url} alt="" className="h-5 w-5 object-contain" /> : <SocialIcon className="h-5 w-5" aria-hidden />}
                          </span>
                          <span>
                            <span className="block">{platform.name}</span>
                            <span className="text-xs font-normal text-silver">{value.enabled ? "включено" : "выключено"}</span>
                          </span>
                        </label>
                        <input className="field" placeholder={`Ссылка на ${platform.name}`} value={value.url} onChange={(event) => updateLeaderSocial(platform.id, { url: event.target.value })} />
                        <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={saveLeader}>
                          <Save className="h-4 w-4" aria-hidden />
                          Сохранить
                        </button>
                        <button type="button" className="button-secondary min-h-0 px-3 py-2 hover:border-red-300/60 hover:bg-red-500/10" onClick={() => updateLeaderSocial(platform.id, { enabled: false, url: "" })}>
                          <Trash className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Описание</p>
                <div className="grid gap-4">
                  <TextArea label="Описание обязанностей" value={leaderDraft.role_description} onChange={(value) => setLeaderDraft({ ...leaderDraft, role_description: value })} />
                  <Field label="Подпись" value={leaderDraft.signature} onChange={(value) => setLeaderDraft({ ...leaderDraft, signature: value })} />
                </div>
              </section>

              <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Статистика</p>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Field label="Лучший руководитель месяца" value={leaderDraft.best_leader_month} onChange={(value) => setLeaderDraft({ ...leaderDraft, best_leader_month: value })} />
                  <Field label="Проведено мероприятий" type="number" value={leaderDraft.events_count ?? ""} onChange={(value) => setLeaderDraft({ ...leaderDraft, events_count: value ? Number(value) : null })} />
                  <Field label="Организовано КВ" type="number" value={leaderDraft.wars_count ?? ""} onChange={(value) => setLeaderDraft({ ...leaderDraft, wars_count: value ? Number(value) : null })} />
                  <Field label="Приглашено участников" type="number" value={leaderDraft.invited_count ?? ""} onChange={(value) => setLeaderDraft({ ...leaderDraft, invited_count: value ? Number(value) : null })} />
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                <button type="button" className="button-secondary rounded-2xl" onClick={() => setLeaderDraft(null)}>
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Назад
                  </button>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="button-primary rounded-2xl" onClick={saveLeader}>
                      <Save className="h-4 w-4" aria-hidden />
                      {leaderDraft.id ? "Сохранить изменения" : "Создать руководителя"}
                    </button>
                    {leaderDraft.id ? (
                      <button type="button" className="button-secondary rounded-2xl border-red-300/35 bg-red-500/10 text-red-100" onClick={() => setLeaderDeleteTarget(leaderDraft)}>
                        <Trash className="h-4 w-4" aria-hidden />
                        Удалить руководителя
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
          ) : (
            <div className="royal-border rounded-[28px] p-8 text-silver">Выбери руководителя слева или нажми “Добавить руководителя”.</div>
          )}
        </div>

        <div className="leader-preview-column">{renderLeaderPreview()}</div>

          <div className="hidden">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">Система соцсетей</p>
                <h3 className="font-display text-2xl text-white">Иконки и ссылки</h3>
              </div>
              <button type="button" className="button-secondary" onClick={() => setSocialDraft({ ...emptySocialPlatform, sort_order: socialPlatforms.length + 1 })}>
                <Plus className="h-4 w-4" aria-hidden />
                Новая соцсеть
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {socialPlatforms.map((platform) => (
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3" key={platform.id}>
                  <button type="button" className="w-full text-left" onClick={() => setSocialDraft(platform)}>
                    <p className="font-bold text-white">{platform.name}</p>
                    <p className="mt-1 text-sm text-silver">
                      {platform.icon_key} · порядок {platform.sort_order} · {platform.is_visible ? "включена" : "скрыта"}
                    </p>
                  </button>
                  <button type="button" className="button-secondary mt-3 min-h-0 px-3 py-2" onClick={() => deleteSocialPlatform(platform)}>
                    <Trash className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              ))}
            </div>

            {socialDraft ? (
              <div className="mt-5 rounded-lg border border-gold/25 bg-gold/10 p-4">
                <h4 className="font-display text-xl text-white">{socialDraft.id ? "Редактирование соцсети" : "Новая соцсеть"}</h4>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="Название" value={socialDraft.name} required onChange={(value) => setSocialDraft({ ...socialDraft, name: value })} />
                  <Field label="Ключ иконки" value={socialDraft.icon_key} onChange={(value) => setSocialDraft({ ...socialDraft, icon_key: value })} />
                  <Field label="Своя SVG/PNG иконка URL" value={socialDraft.icon_url} onChange={(value) => setSocialDraft({ ...socialDraft, icon_url: value })} />
                  <Field label="Цвет" value={socialDraft.color} onChange={(value) => setSocialDraft({ ...socialDraft, color: value })} />
                  <Field label="Порядок" type="number" value={socialDraft.sort_order} onChange={(value) => setSocialDraft({ ...socialDraft, sort_order: Number(value) })} />
                  <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4">
                    <input type="checkbox" checked={socialDraft.is_visible} onChange={(event) => setSocialDraft({ ...socialDraft, is_visible: event.target.checked })} className="h-4 w-4 accent-[#c9a45d]" />
                    <span className="text-sm text-silver">Показывать соцсеть в системе</span>
                  </label>
                </div>
                <button type="button" className="button-primary mt-4" onClick={saveSocialPlatform}>
                  <Edit className="h-4 w-4" aria-hidden />
                  Сохранить соцсеть
                </button>
              </div>
            ) : null}
          </div>

        {socialPickerOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-4 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-[28px] border border-gold/30 bg-[#11131a] p-5 shadow-[0_30px_130px_rgba(0,0,0,0.62)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Каталог соцсетей</p>
                  <h3 className="font-display text-3xl text-white">Выбери соцсеть</h3>
                  <p className="mt-2 text-sm text-silver">Название, иконка и цвет уже готовы. Потом нужно только вставить ссылку.</p>
                </div>
                <button type="button" className="button-secondary rounded-2xl" onClick={() => setSocialPickerOpen(false)}>
                  <XCircle className="h-4 w-4" aria-hidden />
                  Закрыть
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {socialPresets.map((preset) => {
                  const Icon = preset.Icon;
                  const alreadyExists = socialPlatforms.some((platform) => platform.icon_key.toLowerCase() === preset.icon_key || platform.name.toLowerCase() === preset.name.toLowerCase());
                  return (
                    <button
                      type="button"
                      className="group flex items-center gap-4 rounded-[22px] border border-white/10 bg-white/[0.035] p-4 text-left transition hover:-translate-y-1 hover:border-gold/45 hover:bg-gold/10"
                      onClick={() => addPresetSocial(preset)}
                      key={preset.icon_key}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/35 shadow-[0_0_28px_rgba(255,255,255,0.06)]" style={{ color: preset.color }}>
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold text-white">{preset.name}</span>
                        <span className="mt-1 block text-sm text-silver">{alreadyExists ? "Уже есть в системе, включим для карточки" : "Добавить готовую соцсеть"}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {leaderDeleteTarget ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[24px] border border-red-300/30 bg-[#141016] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
              <h3 className="font-display text-3xl text-white">Удалить руководителя?</h3>
              <p className="mt-3 leading-7 text-silver">После удаления карточка исчезнет со страницы руководства. Это действие нельзя отменить.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="button-secondary rounded-2xl" onClick={() => setLeaderDeleteTarget(null)}>
                  Отмена
                </button>
                <button type="button" className="button-secondary rounded-2xl border-red-300/50 bg-red-500/20 text-red-100 hover:bg-red-500/30" onClick={() => deleteLeader(leaderDeleteTarget)}>
                  <Trash className="h-4 w-4" aria-hidden />
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  function renderMemberEditor(mode: "active" | "archived") {
    const list = mode === "active" ? members : archivedMembers;
    const memberCountry = memberDraft ? getCountryBadge(memberDraft.nationality, memberDraft.location) : null;
    const memberSteps = [
      { id: 1, title: "Фото", note: "Обложка и личные данные" },
      { id: 2, title: "Игра", note: "Free Fire и должность" },
      { id: 3, title: "Соцсети", note: "Ссылки и публикация" },
      { id: 4, title: "Описание", note: "Впечатление" },
      { id: 5, title: "Предпросмотр", note: "Проверка карточки" }
    ];

    return (
      <div className="grid gap-6 2xl:grid-cols-[20rem_minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          {mode === "active" ? (
            <button
              type="button"
              className="button-primary w-full rounded-2xl"
              onClick={() => {
                setMemberDraft({ ...emptyMember, role_id: defaultRoleId, joined_at: new Date().toISOString().slice(0, 10) });
                setMemberUpload(null);
                setMemberStep(1);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Добавить участника
            </button>
          ) : null}

          {list.map((member) => (
            <div
              className={clsx(
                "rounded-[22px] border p-4 transition hover:-translate-y-1 hover:border-gold/45",
                memberDraft?.id === member.id ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"
              )}
              key={member.id}
            >
              <button
                type="button"
                className="flex w-full items-center gap-3 text-left"
                onClick={() => {
                  setMemberDraft(member);
                  setMemberUpload(null);
                  setMemberStep(1);
                }}
              >
                <img src={member.photo_url || "/avatars/member.svg"} alt="" className="h-16 w-20 rounded-2xl border border-white/10 object-cover" />
                <span>
                  <span className="block font-display text-xl text-white">{member.name}</span>
                  <span className="mt-1 block text-sm text-silver">
                    {member.game_nickname} · {member.role?.name ?? "Без должности"}
                  </span>
                </span>
              </button>
              <div className="mt-3 flex gap-2">
                {mode === "active" ? (
                  <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => archiveMember(member)}>
                    <Archive className="h-4 w-4" aria-hidden />
                  </button>
                ) : (
                  <button type="button" className="button-secondary min-h-0 px-3 py-2" onClick={() => restoreMember(member)}>
                    <RotateCcw className="h-4 w-4" aria-hidden />
                  </button>
                )}
                <button type="button" className="button-secondary min-h-0 px-3 py-2 hover:border-red-300/60 hover:bg-red-500/10" onClick={() => deleteMember(member)}>
                  <Trash className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>

        {memberDraft ? (
          <div className="royal-border space-y-5 rounded-[28px] p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">{displayStatus(memberDraft.status)}</p>
                <h3 className="font-display text-3xl text-white">{memberDraft.id ? memberDraft.name : "Новый участник"}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="button-primary rounded-2xl" onClick={saveMember}>
                  <Save className="h-4 w-4" aria-hidden />
                  {memberDraft.id ? "Сохранить изменения" : "Создать участника"}
                </button>
                {memberDraft.status === "active" ? (
                  <button type="button" className="button-secondary rounded-2xl" onClick={() => archiveMember(memberDraft)}>
                    <Archive className="h-4 w-4" aria-hidden />
                    В архив
                  </button>
                ) : (
                  <button type="button" className="button-secondary rounded-2xl" onClick={() => restoreMember(memberDraft)}>
                    <RotateCcw className="h-4 w-4" aria-hidden />
                    Восстановить
                  </button>
                )}
                <button type="button" className="button-secondary rounded-2xl border-red-300/35 bg-red-500/10 text-red-100" onClick={() => deleteMember(memberDraft)}>
                  <Trash className="h-4 w-4" aria-hidden />
                  Удалить
                </button>
              </div>
            </div>

            <div className="member-wizard-steps">
              {memberSteps.map((step) => (
                <button type="button" className={clsx("member-wizard-step", memberStep === step.id && "is-active")} onClick={() => setMemberStep(step.id)} key={step.id}>
                  <span>{step.id}</span>
                  <strong>{step.title}</strong>
                  <small>{step.note}</small>
                </button>
              ))}
            </div>

            {memberStep === 1 ? (
            <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gold-soft">Фото участника</p>
              <div className="grid gap-4 xl:grid-cols-[18rem_minmax(0,1fr)]">
                <img src={memberDraft.photo_url || "/avatars/member.svg"} alt="" className="h-[280px] w-full rounded-[24px] border border-gold/25 object-cover max-sm:h-[230px]" />
                <div className="space-y-3">
                  <label className="button-secondary w-full justify-start rounded-2xl">
                    <Upload className="h-4 w-4" aria-hidden />
                    Выбрать из устройства
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        setMemberUpload(file);
                        if (file) setMemberDraft({ ...memberDraft, photo_url: URL.createObjectURL(file) });
                      }}
                    />
                  </label>
                  <button type="button" className="button-secondary w-full justify-start rounded-2xl" onClick={() => setMemberDraft({ ...memberDraft, photo_url: "" })}>
                    <Trash className="h-4 w-4" aria-hidden />
                    Удалить фото
                  </button>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm leading-6 text-silver">
                    Фото показывается без растягивания: оно красиво обрезается по центру, как в карточках сайта.
                  </div>
                </div>
              </div>
            </section>
            ) : null}

            {memberStep === 1 ? (
            <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Основная информация</p>
              <div className="grid gap-4">
              <Field label="Имя" value={memberDraft.name} required onChange={(value) => setMemberDraft({ ...memberDraft, name: value })} />
              <Field label="Возраст" type="number" value={memberDraft.age} required onChange={(value) => setMemberDraft({ ...memberDraft, age: Number(value) })} />
              <Field label="Дата рождения" type="date" value={memberDraft.birth_date} required onChange={(value) => setMemberDraft({ ...memberDraft, birth_date: value })} />
              <label>
                <span className="mb-2 block text-sm text-silver">Страна / флаг</span>
                <select value={memberDraft.nationality ?? ""} onChange={(event) => setMemberDraft({ ...memberDraft, nationality: event.target.value })} className="field">
                  <option value="">Не выбрано</option>
                  {countryOptions.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Языки" value={memberDraft.languages} onChange={(value) => setMemberDraft({ ...memberDraft, languages: value })} />
              <Field label="Откуда" value={memberDraft.location} onChange={(value) => setMemberDraft({ ...memberDraft, location: value })} />
              </div>
            </section>
            ) : null}

            {memberStep === 2 ? (
            <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Игровая информация</p>
              <div className="grid gap-4">
              <Field label="Ник в игре" value={memberDraft.game_nickname} required onChange={(value) => setMemberDraft({ ...memberDraft, game_nickname: value })} />
              <Field label="ID в игре" value={memberDraft.game_id} required onChange={(value) => setMemberDraft({ ...memberDraft, game_id: value })} />
              <Field label="Кто позвал" value={memberDraft.invited_by} onChange={(value) => setMemberDraft({ ...memberDraft, invited_by: value })} />
              <Field label="Устройство" value={memberDraft.device} onChange={(value) => setMemberDraft({ ...memberDraft, device: value })} />
              <Field label="Ульт" value={memberDraft.ult_skill} onChange={(value) => setMemberDraft({ ...memberDraft, ult_skill: value })} />
              <Field label="СНС" value={memberDraft.sns_skill} onChange={(value) => setMemberDraft({ ...memberDraft, sns_skill: value })} />
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
              </div>
            </section>
            ) : null}

            {memberStep === 3 ? (
            <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Соцсети и публикация</p>
              <div className="grid gap-4">
              <Field label="Telegram ссылка" value={memberDraft.telegram_url} onChange={(value) => setMemberDraft({ ...memberDraft, telegram_url: value })} />
              <Field label="TikTok ссылка" value={memberDraft.tiktok_url} onChange={(value) => setMemberDraft({ ...memberDraft, tiktok_url: value })} />
              <label>
                <span className="mb-2 block text-sm text-silver">Статус</span>
                <select value={memberDraft.status} onChange={(event) => setMemberDraft({ ...memberDraft, status: event.target.value as "active" | "archived" })} className="field">
                  <option value="active">Активен</option>
                  <option value="archived">Архивирован</option>
                </select>
              </label>
              </div>
            </section>
            ) : null}

            {memberStep === 4 ? (
            <section className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
              <TextArea label="Первое впечатление" value={memberDraft.first_impression} onChange={(value) => setMemberDraft({ ...memberDraft, first_impression: value })} />
            </section>
            ) : null}

            {memberStep === 5 ? (
              <section className="rounded-[24px] border border-gold/20 bg-gold/10 p-4">
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-gold-soft">Финальная проверка</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-silver">Имя</p>
                    <p className="mt-1 font-display text-2xl text-white">{memberDraft.name || "Не указано"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-silver">Игровой ник</p>
                    <p className="mt-1 font-display text-2xl text-white">{memberDraft.game_nickname || "Не указано"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-silver">Должность</p>
                    <p className="mt-1 text-white">{roles.find((role) => role.id === memberDraft.role_id)?.name ?? memberDraft.role?.name ?? "Не указано"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-silver">Статус</p>
                    <p className="mt-1 text-white">{displayStatus(memberDraft.status)}</p>
                  </div>
                </div>
              </section>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <button type="button" className="button-secondary rounded-2xl" onClick={() => setMemberStep((step) => Math.max(1, step - 1))} disabled={memberStep === 1}>
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Назад
              </button>
              <div className="flex flex-wrap gap-2">
                {memberStep < memberSteps.length ? (
                  <button type="button" className="button-primary rounded-2xl" onClick={() => setMemberStep((step) => Math.min(memberSteps.length, step + 1))}>
                    Дальше
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                ) : (
                  <button type="button" className="button-primary rounded-2xl" onClick={saveMember}>
                    <Save className="h-4 w-4" aria-hidden />
                    {memberDraft.id ? "Сохранить изменения" : "Создать участника"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="royal-border rounded-[28px] p-8 text-silver">Выбери участника слева, чтобы изменить данные, или нажми “Добавить участника”.</div>
        )}

        {memberDraft ? (
          <aside className="sticky top-28 h-fit rounded-[24px] border border-gold/25 bg-gradient-to-br from-white/[0.09] to-black/50 p-4 shadow-[0_0_60px_rgba(201,164,93,0.12)] backdrop-blur">
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gold-soft">Предпросмотр участника</p>
            <img src={memberDraft.photo_url || "/avatars/member.svg"} alt="" className="h-[280px] w-full rounded-[22px] border border-white/10 object-cover" />
            <p className="mt-4 text-xs uppercase tracking-[0.18em] text-gold-soft">{roles.find((role) => role.id === memberDraft.role_id)?.name ?? memberDraft.role?.name ?? "Должность"}</p>
            <h3 className="mt-2 font-display text-3xl text-white">{memberDraft.name || "Имя"}</h3>
            <p className="text-silver">{memberDraft.game_nickname || "Ник"}</p>
            {memberCountry ? <p className="mt-2 text-sm font-bold text-gold-soft">{memberCountry.flag} {memberCountry.name}</p> : null}
            <div className="mt-4 grid gap-2 text-sm text-silver">
              <span>ID: {memberDraft.game_id || "—"}</span>
              <span>Устройство: {memberDraft.device || "—"}</span>
              <span>Языки: {memberDraft.languages || "—"}</span>
            </div>
          </aside>
        ) : null}
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

  function renderGallery() {
    return (
      <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-3">
          <button
            type="button"
            className="button-primary w-full"
            onClick={() => {
              setGalleryDraft({ ...emptyGalleryItem, sort_order: galleryItems.length + 1 });
              setGalleryUpload(null);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Добавить фото
          </button>

          {galleryItems.length ? null : <div className="royal-border rounded-lg p-5 text-silver">Фото пока нет или таблица gallery_items ещё не создана в Supabase.</div>}

          {galleryItems.map((item) => (
            <button
              type="button"
              className={clsx(
                "w-full rounded-lg border p-3 text-left transition hover:border-gold/45",
                galleryDraft?.id === item.id ? "border-gold/60 bg-gold/10" : "border-white/10 bg-white/[0.03]"
              )}
              key={item.id}
              onClick={() => {
                setGalleryDraft(item);
                setGalleryUpload(null);
              }}
            >
              <div className="flex gap-3">
                <img src={item.image_url} alt="" className="h-16 w-20 rounded-md object-cover" />
                <div>
                  <p className="font-display text-xl text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-silver">
                    Порядок: {item.sort_order} · {item.is_visible ? "Показывается" : "Скрыто"}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {galleryDraft ? (
          <div className="royal-border rounded-lg p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">Редактирование галереи</p>
                <h3 className="font-display text-2xl text-white">{galleryDraft.id ? galleryDraft.title : "Новое фото"}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="button-primary" onClick={saveGalleryItem}>
                  <Edit className="h-4 w-4" aria-hidden />
                  Сохранить
                </button>
                {galleryDraft.id ? (
                  <button type="button" className="button-secondary" onClick={() => deleteGalleryItem(galleryDraft)}>
                    <Trash className="h-4 w-4" aria-hidden />
                    Удалить
                  </button>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Название" value={galleryDraft.title} required onChange={(value) => setGalleryDraft({ ...galleryDraft, title: value })} />
              <Field label="Порядок" type="number" value={galleryDraft.sort_order} onChange={(value) => setGalleryDraft({ ...galleryDraft, sort_order: Number(value) })} />
              <Field label="Ссылка на фото" value={galleryDraft.image_url} onChange={(value) => setGalleryDraft({ ...galleryDraft, image_url: value })} />
              <label className="block">
                <span className="mb-2 block text-sm text-silver">Загрузить новое фото</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(event) => setGalleryUpload(event.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-silver file:mr-3 file:rounded-lg file:border-0 file:bg-gold file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black"
                />
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <input type="checkbox" checked={galleryDraft.is_visible} onChange={(event) => setGalleryDraft({ ...galleryDraft, is_visible: event.target.checked })} className="h-4 w-4 accent-[#c9a45d]" />
                <span className="text-sm text-silver">Показывать на сайте</span>
              </label>
              <TextArea label="Описание" value={galleryDraft.description} onChange={(value) => setGalleryDraft({ ...galleryDraft, description: value })} />
            </div>

            {galleryDraft.image_url ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
                <img src={galleryDraft.image_url} alt="" className="h-72 w-full object-cover" />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="royal-border rounded-lg p-6 text-silver">Выбери фото слева или нажми “Добавить фото”.</div>
        )}
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

  function renderSocials() {
    return (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]">
        <div className="space-y-5">
          <div className="royal-border rounded-[28px] p-5">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Каталог соцсетей</p>
                <h3 className="font-display text-3xl text-white">Готовые карточки</h3>
                <p className="mt-2 max-w-2xl leading-7 text-silver">
                  Выбери площадку, и название, иконка, цвет и порядок подставятся автоматически. После этого останется сохранить соцсеть в системе и использовать её в профилях лидера или руководства.
                </p>
              </div>
              <button type="button" className="button-primary rounded-2xl" onClick={() => setSocialDraft({ ...emptySocialPlatform, sort_order: socialPlatforms.length + 1 })}>
                <Plus className="h-4 w-4" aria-hidden />
                Своя соцсеть
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {socialPresets.map((preset) => {
                const Icon = preset.Icon;
                const existing = socialPlatforms.find((platform) => platform.icon_key.toLowerCase() === preset.icon_key || platform.name.toLowerCase() === preset.name.toLowerCase());

                return (
                  <button
                    type="button"
                    className={clsx(
                      "group rounded-[22px] border p-4 text-left transition hover:-translate-y-1 hover:border-gold/45 hover:bg-gold/10",
                      existing ? "border-gold/35 bg-gold/10" : "border-white/10 bg-white/[0.035]"
                    )}
                    onClick={() =>
                      setSocialDraft(
                        existing ?? {
                          ...emptySocialPlatform,
                          name: preset.name,
                          icon_key: preset.icon_key,
                          color: preset.color,
                          sort_order: preset.sort_order,
                          is_visible: true
                        }
                      )
                    }
                    key={preset.icon_key}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/35" style={{ color: preset.color }}>
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <span>
                        <span className="block font-bold text-white">{preset.name}</span>
                        <span className="mt-1 block text-sm text-silver">{existing ? "Уже добавлена" : "Готовый шаблон"}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="royal-border rounded-[28px] p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Опубликованные соцсети</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {socialPlatforms.map((platform) => {
                const Icon = getPlatformIcon(platform);
                return (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4" key={platform.id}>
                    <button type="button" className="flex w-full items-center gap-3 text-left" onClick={() => setSocialDraft(platform)}>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black/35" style={{ color: platform.color ?? "#e3c980" }}>
                        {platform.icon_url ? <img src={platform.icon_url} alt="" className="h-5 w-5 object-contain" /> : <Icon className="h-5 w-5" aria-hidden />}
                      </span>
                      <span>
                        <span className="block font-bold text-white">{platform.name}</span>
                        <span className="mt-1 block text-sm text-silver">
                          {platform.icon_key} · порядок {platform.sort_order} · {platform.is_visible ? "показывается" : "скрыта"}
                        </span>
                      </span>
                    </button>
                    <div className="mt-3 flex gap-2">
                      <button type="button" className="button-secondary min-h-0 rounded-2xl px-3 py-2" onClick={() => setSocialDraft(platform)}>
                        <Edit className="h-4 w-4" aria-hidden />
                        Изменить
                      </button>
                      <button type="button" className="button-secondary min-h-0 rounded-2xl px-3 py-2 hover:border-red-300/60 hover:bg-red-500/10" onClick={() => deleteSocialPlatform(platform)}>
                        <Trash className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="royal-border h-fit rounded-[28px] p-5 xl:sticky xl:top-28">
          {socialDraft ? (
            <>
              <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">{socialDraft.id ? "Редактирование" : "Новая соцсеть"}</p>
              <h3 className="mt-2 font-display text-3xl text-white">{socialDraft.name || "Соцсеть"}</h3>
              <div className="mt-5 grid gap-4">
                <Field label="Название" value={socialDraft.name} required onChange={(value) => setSocialDraft({ ...socialDraft, name: value })} />
                <Field label="Ключ иконки" value={socialDraft.icon_key} onChange={(value) => setSocialDraft({ ...socialDraft, icon_key: value })} />
                <Field label="Своя SVG/PNG иконка URL" value={socialDraft.icon_url} onChange={(value) => setSocialDraft({ ...socialDraft, icon_url: value })} />
                <Field label="Цвет" value={socialDraft.color} onChange={(value) => setSocialDraft({ ...socialDraft, color: value })} />
                <Field label="Порядок" type="number" value={socialDraft.sort_order} onChange={(value) => setSocialDraft({ ...socialDraft, sort_order: Number(value) })} />
                <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <input type="checkbox" checked={socialDraft.is_visible} onChange={(event) => setSocialDraft({ ...socialDraft, is_visible: event.target.checked })} className="h-4 w-4 accent-[#c9a45d]" />
                  <span className="text-sm text-silver">Показывать соцсеть в системе</span>
                </label>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" className="button-primary rounded-2xl" onClick={saveSocialPlatform}>
                  <Save className="h-4 w-4" aria-hidden />
                  Сохранить
                </button>
                <button type="button" className="button-secondary rounded-2xl" onClick={() => setSocialDraft(null)}>
                  <XCircle className="h-4 w-4" aria-hidden />
                  Закрыть
                </button>
              </div>
            </>
          ) : (
            <div>
              <Globe2 className="h-8 w-8 text-gold" aria-hidden />
              <h3 className="mt-5 font-display text-3xl text-white">Выбери карточку</h3>
              <p className="mt-3 leading-7 text-silver">Здесь редактируются глобальные шаблоны соцсетей: иконка, цвет, название, видимость и порядок.</p>
            </div>
          )}
        </aside>
      </div>
    );
  }

  function renderDashboard() {
    const cards = [
      { label: "Анкет на проверке", value: applications.length, icon: UserCheck },
      { label: "Участников", value: members.length, icon: Shield },
      { label: "Руководителей", value: leaders.length, icon: Crown },
      { label: "Фото в галерее", value: galleryItems.length, icon: ImageIcon }
    ];

    return (
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div className="rounded-[24px] border border-gold/20 bg-gradient-to-br from-gold/10 to-white/[0.025] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]" key={card.label}>
                <Icon className="h-6 w-6 text-gold" aria-hidden />
                <p className="mt-6 font-display text-4xl text-white">{card.value}</p>
                <p className="mt-2 text-sm text-silver">{card.label}</p>
              </div>
            );
          })}
        </div>

        <div className="royal-border rounded-[28px] p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Быстрый доступ</p>
          <h3 className="mt-2 font-display text-3xl text-white">Что чаще всего нужно менять</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {(["leader", "leaders", "members"] as AdminTab[]).map((item) => {
              const Icon = tabIcons[item];
              return (
                <button
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:-translate-y-1 hover:border-gold/45 hover:bg-gold/10"
                  onClick={() => {
                    clearEditorState();
                    setTab(item);
                  }}
                  key={item}
                >
                  <Icon className="h-5 w-5 text-gold" aria-hidden />
                  <span className="mt-4 block font-bold text-white">{tabLabels[item]}</span>
                  <span className="mt-1 block text-sm text-silver">Открыть редактор</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function renderSoftPlaceholder(title: string, text: string, icon: typeof UserCheck = Activity) {
    const Icon = icon;
    return (
      <div className="royal-border rounded-[28px] p-8">
        <Icon className="h-8 w-8 text-gold" aria-hidden />
        <h3 className="mt-5 font-display text-3xl text-white">{title}</h3>
        <p className="mt-3 max-w-2xl leading-7 text-silver">{text}</p>
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
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="rounded-[24px] border border-gold/20 bg-gold/10 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-gold-soft">Континенталь CMS</p>
          <h2 className="mt-2 font-display text-2xl text-white">Панель</h2>
          <p className="mt-2 text-sm leading-6 text-silver">Управление сайтом без кода.</p>
        </div>

        {adminGroups.map((group) => (
          <nav className="admin-sidebar-group" key={group.title}>
            <p className="admin-sidebar-title">{group.title}</p>
            {group.items.map((item) => {
              const Icon = tabIcons[item];
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    clearEditorState();
                    setTab(item);
                  }}
                  className={clsx("admin-sidebar-link", tab === item && "is-active")}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  <span>{tabLabels[item]}</span>
                </button>
              );
            })}
          </nav>
        ))}
      </aside>

      <div className="min-w-0 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-gold-soft">Админ-панель</p>
            <h2 className="font-display text-3xl text-white">{tabLabels[tab]}</h2>
          </div>
          <button type="button" className="button-secondary" onClick={signOut}>
            <LogOut className="h-4 w-4" aria-hidden />
            Выйти
          </button>
        </div>

      {notice ? <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-100">{notice}</p> : null}
      {error ? <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p> : null}
      {dataLoading ? (
        <div className="royal-border flex items-center gap-3 rounded-lg p-5 text-silver">
          <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden />
          Обновляю данные...
        </div>
      ) : null}

      {tab === "dashboard" ? renderDashboard() : null}
      {tab === "stats" ? renderSoftPlaceholder("Статистика", "Здесь будет общий обзор активности портала: заявки, участники, обновления и живые показатели.", BarChart3) : null}
      {tab === "news" ? renderContent() : null}
      {tab === "socials" ? renderSocials() : null}
      {tab === "leader" ? renderLeaders("leader") : null}

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

      {tab === "combat" ? renderCombatRequests() : null}
      {tab === "leaders" ? renderLeaders() : null}
      {tab === "members" ? renderMemberEditor("active") : null}
      {tab === "archive" ? renderMemberEditor("archived") : null}
      {tab === "roles" ? renderRoles() : null}
      {tab === "gallery" ? renderGallery() : null}
      {tab === "content" ? renderContent() : null}
      {tab === "history" ? renderContent() : null}
      {tab === "settings" ? renderSoftPlaceholder("Настройки", "Сюда можно будет вынести внешний вид, ссылки, фон и системные параметры портала.", Settings) : null}
      {tab === "users" ? renderSoftPlaceholder("Пользователи", "Пользователи и права доступа хранятся в Supabase Auth и таблице admin_users.", User) : null}
      {tab === "access" ? renderRoles() : null}
      {tab === "logs" ? renderSoftPlaceholder("Логи системы", "Здесь позже можно показать историю действий: кто изменил данные, когда и что именно.", FileText) : null}
      </div>
    </div>
  );
}
