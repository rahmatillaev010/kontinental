-- Kontinental: leadership tables patch.
-- Run this once in Supabase Dashboard -> SQL Editor if the admin panel says:
-- "Could not find the table 'public.leadership_profiles' in the schema cache".

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where admin_users.user_id = uid
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.leadership_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  game_nickname text,
  age integer check (age between 1 and 120),
  nationality text,
  country text,
  city text,
  languages text,
  role_title text not null,
  role_description text,
  signature text,
  photo_url text,
  background_url text,
  cover_url text,
  assigned_at date not null default current_date,
  status text not null default 'offline' check (status in ('online', 'offline')),
  sort_order integer not null default 100,
  is_visible boolean not null default true,
  best_leader_month text,
  events_count integer,
  wars_count integer,
  invited_count integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leadership_profiles add column if not exists nationality text;
alter table public.leadership_profiles add column if not exists country text;
alter table public.leadership_profiles add column if not exists city text;
alter table public.leadership_profiles add column if not exists languages text;
alter table public.leadership_profiles add column if not exists signature text;
alter table public.leadership_profiles add column if not exists background_url text;
alter table public.leadership_profiles add column if not exists cover_url text;
alter table public.leadership_profiles add column if not exists best_leader_month text;
alter table public.leadership_profiles add column if not exists events_count integer;
alter table public.leadership_profiles add column if not exists wars_count integer;
alter table public.leadership_profiles add column if not exists invited_count integer;

create table if not exists public.social_platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_key text not null,
  icon_url text,
  color text,
  sort_order integer not null default 100,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leadership_social_links (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.leadership_profiles(id) on delete cascade,
  platform_id uuid not null references public.social_platforms(id) on delete cascade,
  url text not null,
  is_visible boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (leader_id, platform_id)
);

drop trigger if exists leadership_profiles_touch_updated_at on public.leadership_profiles;
create trigger leadership_profiles_touch_updated_at
before update on public.leadership_profiles
for each row execute function public.touch_updated_at();

drop trigger if exists social_platforms_touch_updated_at on public.social_platforms;
create trigger social_platforms_touch_updated_at
before update on public.social_platforms
for each row execute function public.touch_updated_at();

drop trigger if exists leadership_social_links_touch_updated_at on public.leadership_social_links;
create trigger leadership_social_links_touch_updated_at
before update on public.leadership_social_links
for each row execute function public.touch_updated_at();

alter table public.leadership_profiles enable row level security;
alter table public.social_platforms enable row level security;
alter table public.leadership_social_links enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "leadership profiles are public" on public.leadership_profiles;
create policy "leadership profiles are public"
on public.leadership_profiles for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "admins manage leadership profiles" on public.leadership_profiles;
create policy "admins manage leadership profiles"
on public.leadership_profiles for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "social platforms are public" on public.social_platforms;
create policy "social platforms are public"
on public.social_platforms for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "admins manage social platforms" on public.social_platforms;
create policy "admins manage social platforms"
on public.social_platforms for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "leadership social links are public" on public.leadership_social_links;
create policy "leadership social links are public"
on public.leadership_social_links for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "admins manage leadership social links" on public.leadership_social_links;
create policy "admins manage leadership social links"
on public.leadership_social_links for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into public.social_platforms (name, icon_key, icon_url, color, sort_order, is_visible)
select item.name, item.icon_key, null, item.color, item.sort_order, true
from (
  values
    ('Telegram', 'telegram', '#2AABEE', 1),
    ('Discord', 'discord', '#5865F2', 2),
    ('TikTok', 'tiktok', '#ff2f6d', 3),
    ('Instagram', 'instagram', '#E4405F', 4),
    ('YouTube', 'youtube', '#FF0033', 5),
    ('VK', 'vk', '#4C75A3', 6),
    ('Facebook', 'facebook', '#1877F2', 7),
    ('X', 'x', '#ffffff', 8),
    ('Steam', 'steam', '#66c0f4', 9),
    ('Twitch', 'twitch', '#9146FF', 10),
    ('GitHub', 'github', '#ffffff', 11),
    ('Website', 'website', '#e3c980', 12),
    ('WhatsApp', 'whatsapp', '#25d366', 13)
) as item(name, icon_key, color, sort_order)
where not exists (
  select 1
  from public.social_platforms existing
  where lower(existing.icon_key) = lower(item.icon_key)
);

insert into public.leadership_profiles (
  name,
  game_nickname,
  age,
  nationality,
  country,
  city,
  languages,
  role_title,
  role_description,
  signature,
  photo_url,
  background_url,
  assigned_at,
  status,
  sort_order,
  is_visible,
  best_leader_month,
  events_count,
  wars_count,
  invited_count
)
select
  'Амир',
  'KNTL.Crown',
  20,
  'Казах',
  'Казахстан',
  'Алматы',
  'Русский, Казахский',
  'Лидер',
  'Лидер Континенталя.' || chr(10) || chr(10) ||
    'Отвечает за решения, атмосферу, дисциплину и финальное слово по важным вопросам состава.' || chr(10) || chr(10) ||
    'Держит гильдию собранной, уважительной и сильной.',
  'Амир',
  '/avatars/leader.svg',
  '/hero/royal-hall.svg',
  '2025-01-12',
  'online',
  1,
  true,
  'Июнь 2026',
  12,
  8,
  18
where not exists (
  select 1
  from public.leadership_profiles
  where lower(role_title) = lower('Лидер')
);

insert into public.leadership_social_links (leader_id, platform_id, url, is_visible, sort_order)
select l.id, p.id, 'https://t.me/glkontinental', true, 1
from public.leadership_profiles l
join public.social_platforms p on p.icon_key = 'telegram'
where l.name = 'Амир'
  and not exists (
    select 1
    from public.leadership_social_links link
    where link.leader_id = l.id
      and link.platform_id = p.id
  );

notify pgrst, 'reload schema';
