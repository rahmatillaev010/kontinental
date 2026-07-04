export type Role = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color_theme: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type MemberStatus = "active" | "archived";
export type ApplicationStatus = "pending" | "approved" | "rejected";

export type Member = {
  id: string;
  name: string;
  age: number;
  birth_date: string;
  game_nickname: string;
  game_id: string;
  invited_by: string | null;
  nationality: string | null;
  languages: string | null;
  location: string | null;
  device: string | null;
  ult_skill: string | null;
  sns_skill: string | null;
  first_impression: string | null;
  photo_url: string | null;
  telegram_url?: string | null;
  tiktok_url?: string | null;
  role_id: string | null;
  status: MemberStatus;
  joined_at: string;
  created_at?: string;
  updated_at?: string;
  role?: Role | null;
};

export type Application = {
  id: string;
  name: string;
  age: number;
  birth_date: string;
  game_nickname: string;
  game_id: string;
  invited_by: string | null;
  nationality: string | null;
  languages: string | null;
  location: string | null;
  device: string | null;
  ult_skill: string | null;
  sns_skill: string | null;
  first_impression: string | null;
  photo_url: string | null;
  status: ApplicationStatus;
  created_at?: string;
  updated_at?: string;
};

export type MemberWithRole = Member & {
  role: Role | null;
};

export type SiteContent = {
  id: string;
  key: string;
  title: string;
  body: string;
  href: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
};

export type SocialPlatform = {
  id: string;
  name: string;
  icon_key: string;
  icon_url: string | null;
  color: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
};

export type LeadershipSocialLink = {
  id: string;
  leader_id: string;
  platform_id: string;
  url: string;
  is_visible: boolean;
  sort_order: number;
  platform?: SocialPlatform | null;
  created_at?: string;
  updated_at?: string;
};

export type LeadershipProfile = {
  id: string;
  name: string;
  game_nickname: string | null;
  age: number | null;
  nationality?: string | null;
  country?: string | null;
  city?: string | null;
  languages?: string | null;
  role_title: string;
  role_description: string | null;
  signature?: string | null;
  photo_url: string | null;
  background_url?: string | null;
  cover_url?: string | null;
  assigned_at: string;
  status: "online" | "offline";
  sort_order: number;
  is_visible: boolean;
  best_leader_month: string | null;
  events_count: number | null;
  wars_count: number | null;
  invited_count: number | null;
  social_links?: LeadershipSocialLink[];
  created_at?: string;
  updated_at?: string;
};

export type CombatRequestStatus = "pending" | "contacted" | "rejected";

export type CombatRequest = {
  id: string;
  guild_name: string;
  telegram_username: string;
  description: string | null;
  rules_agreed: boolean;
  status: CombatRequestStatus;
  created_at?: string;
  updated_at?: string;
};
