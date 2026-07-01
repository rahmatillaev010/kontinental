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
