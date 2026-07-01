-- Континенталь: готовая схема Supabase
-- Запусти этот файл в Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  color_theme text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null check (age between 1 and 120),
  birth_date date not null,
  game_nickname text not null,
  game_id text not null unique,
  invited_by text,
  nationality text,
  languages text,
  location text,
  device text,
  ult_skill text,
  sns_skill text,
  first_impression text,
  photo_url text,
  role_id uuid references public.roles(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'archived')),
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age integer not null check (age between 1 and 120),
  birth_date date not null,
  game_nickname text not null,
  game_id text not null,
  invited_by text,
  nationality text,
  languages text,
  location text,
  device text,
  ult_skill text,
  sns_skill text,
  first_impression text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  body text not null,
  href text,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Дополнительная таблица нужна для безопасной админ-панели.
-- Сюда добавляется user_id пользователя из Supabase Auth.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roles_touch_updated_at on public.roles;
create trigger roles_touch_updated_at
before update on public.roles
for each row execute function public.touch_updated_at();

drop trigger if exists members_touch_updated_at on public.members;
create trigger members_touch_updated_at
before update on public.members
for each row execute function public.touch_updated_at();

drop trigger if exists applications_touch_updated_at on public.applications;
create trigger applications_touch_updated_at
before update on public.applications
for each row execute function public.touch_updated_at();

drop trigger if exists site_content_touch_updated_at on public.site_content;
create trigger site_content_touch_updated_at
before update on public.site_content
for each row execute function public.touch_updated_at();

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

alter table public.roles enable row level security;
alter table public.members enable row level security;
alter table public.applications enable row level security;
alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "roles are public" on public.roles;
create policy "roles are public"
on public.roles for select
to anon, authenticated
using (true);

drop policy if exists "admins manage roles" on public.roles;
create policy "admins manage roles"
on public.roles for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "public reads visible members" on public.members;
create policy "public reads visible members"
on public.members for select
to anon, authenticated
using (status in ('active', 'archived'));

drop policy if exists "admins manage members" on public.members;
create policy "admins manage members"
on public.members for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "anyone creates pending applications" on public.applications;
create policy "anyone creates pending applications"
on public.applications for insert
to anon, authenticated
with check (status = 'pending');

drop policy if exists "admins read applications" on public.applications;
create policy "admins read applications"
on public.applications for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "admins update applications" on public.applications;
create policy "admins update applications"
on public.applications for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admins delete applications" on public.applications;
create policy "admins delete applications"
on public.applications for delete
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "site content is public" on public.site_content;
create policy "site content is public"
on public.site_content for select
to anon, authenticated
using (true);

drop policy if exists "admins manage site content" on public.site_content;
create policy "admins manage site content"
on public.site_content for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "admin user can read own access" on public.admin_users;
create policy "admin user can read own access"
on public.admin_users for select
to authenticated
using (user_id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "admins manage admin users" on public.admin_users;
create policy "admins manage admin users"
on public.admin_users for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'member-photos',
  'member-photos',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads member photos" on storage.objects;
create policy "public reads member photos"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'member-photos');

drop policy if exists "anyone uploads application photos" on storage.objects;
create policy "anyone uploads application photos"
on storage.objects for insert
to anon, authenticated
with check (
  bucket_id = 'member-photos'
  and (storage.foldername(name))[1] = 'applications'
);

drop policy if exists "admins manage member photos" on storage.objects;
create policy "admins manage member photos"
on storage.objects for all
to authenticated
using (bucket_id = 'member-photos' and public.is_admin(auth.uid()))
with check (bucket_id = 'member-photos' and public.is_admin(auth.uid()));

insert into public.roles (name, slug, description, color_theme, sort_order)
values
  ('Лидер', 'leader', 'Главный хранитель гильдии и её решений.', 'royal-gold', 1),
  ('Управляющий чатом', 'chat-manager', 'Следит за порядком, общением и атмосферой в чате.', 'graphite-gold', 2),
  ('Управляющая чатом', 'chat-manager-female', 'Помогает участникам и держит чат в спокойном порядке.', 'amber-gold', 3),
  ('Временный лидер (заместитель)', 'deputy', 'Берёт руководство на себя, когда это нужно гильдии.', 'deep-blue-gold', 4),
  ('Офицер I', 'officer-i', 'Старший офицер состава.', 'dark-bronze', 5),
  ('Офицер II', 'officer-ii', 'Офицер боевого состава.', 'dark-copper', 6),
  ('Офицер III', 'officer-iii', 'Офицер поддержки состава.', 'dark-silver', 7),
  ('Советник I', 'advisor-i', 'Помогает советами, наблюдением и опытом.', 'dark-emerald', 8),
  ('Проверяющий I', 'checker-i', 'Проверяет анкеты и новых кандидатов.', 'dark-blue', 9),
  ('Проверяющий II', 'checker-ii', 'Помогает проверять заявки и данные участников.', 'dark-violet', 10),
  ('Участник', 'member', 'Основной состав гильдии.', 'dark-gray', 11),
  ('Новичок', 'rookie', 'Новый участник на этапе знакомства с гильдией.', 'graphite', 12)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    color_theme = excluded.color_theme,
    sort_order = excluded.sort_order;

insert into public.site_content (key, title, body, href, sort_order)
values
  ('home_welcome', 'Добро пожаловать в Континенталь', 'Континенталь — легендарная гильдия, в которой собраны самые сильные игроки во всех аспектах ⚜️', 'https://t.me/glkontinental/3', 1),
  ('home_manifest', 'Дружба, дисциплина и победы', 'Дружите, веселитесь, уважайте состав и играйте во благо участников. Ульт и СНС приветствуются, порядок держится руководством.', null, 2),
  ('home_guild_info', 'Информация о гильдии', 'Здесь собрана главная информация о Континентале: состав, руководство, правила, история, архив и заявки на вступление.', null, 3),
  ('home_join_info', 'Вступить в гильдию', 'Заполни анкету, дождись проверки наставителя или администратора, после этого с тобой свяжется руководство.', null, 4),
  ('history_intro', 'История Континенталя', 'Раздел сделан как спокойный архив гильдии: без шума, с уважением к каждому этапу состава.', null, 10),
  ('history_foundation', 'Основание', 'Континенталь появился как состав, где уважение, дисциплина и командная игра важны не меньше побед.', null, 11),
  ('history_structure', 'Структура', 'Руководство собрано в понятную систему: лидер, управляющие, офицеры, советники, проверяющие и участники.', null, 12),
  ('history_archive', 'Архив', 'Каждый участник получает свою страницу, а история состава сохраняется даже после перехода в архив.', null, 13),
  ('history_future', 'Будущее', 'Портал помогает гильдии расти аккуратно: заявки проходят проверку, роли обновляются, состав остаётся живым.', null, 14),
  ('history_code', 'Кодекс Континенталя', 'Континенталь держится на простой идее: сильная гильдия начинается с порядка. Здесь ценят честную игру, спокойное общение, участие в жизни состава и уважение к лидеру, администрации и новичкам.', null, 15)
on conflict (key) do update
set title = excluded.title,
    body = excluded.body,
    href = excluded.href,
    sort_order = excluded.sort_order;

insert into public.members (
  name, age, birth_date, game_nickname, game_id, invited_by, nationality, languages,
  location, device, ult_skill, sns_skill, first_impression, photo_url, role_id, status, joined_at
)
values
  ('Амир', 20, '2006-02-14', 'KNTL.Crown', '123456789', 'Основатель', 'Казах', 'Русский, Казахский', 'Алматы', 'iPhone', 'Сильный', 'Сильный', 'Гильдия должна быть дисциплиной, уважением и честной игрой.', '/avatars/leader.svg', (select id from public.roles where slug = 'leader'), 'active', '2025-01-12'),
  ('Данил', 18, '2007-04-08', 'KNTL.Chat', '771255018', 'Лидер', 'Русский', 'Русский', 'Астана', 'Android', 'Хороший', 'Средний', 'Сразу понравился спокойный порядок в составе.', '/avatars/chat.svg', (select id from public.roles where slug = 'chat-manager'), 'active', '2025-03-04'),
  ('Рамиль', 19, '2006-09-20', 'KNTL.Shield', '845620113', 'Офицер I', 'Татарин', 'Русский, Татарский', 'Казань', 'Android', 'Сильный', 'Хороший', 'Здесь ценят стабильность и командную игру.', '/avatars/officer.svg', (select id from public.roles where slug = 'officer-i'), 'active', '2025-05-18'),
  ('София', 21, '2004-11-03', 'KNTL.Archive', '924681002', 'Совет', 'Казашка', 'Русский, Казахский, Английский', 'Шымкент', 'iPad', 'Хороший', 'Хороший', 'Портал ощущается как место, где у каждого есть история.', '/avatars/advisor.svg', (select id from public.roles where slug = 'advisor-i'), 'active', '2025-07-02'),
  ('Нурсултан', 17, '2008-01-27', 'KNTL.Check', '665501442', 'Управляющий чатом', 'Казах', 'Русский, Казахский', 'Караганда', 'Android', 'Средний', 'Хороший', 'Понравилось, что анкеты проверяют аккуратно.', '/avatars/checker.svg', (select id from public.roles where slug = 'checker-i'), 'active', '2025-08-19'),
  ('Алина', 16, '2009-06-30', 'KNTL.Astra', '550913728', 'Подруга', 'Казашка', 'Русский', 'Павлодар', 'iPhone', 'Хороший', 'Средний', 'Красиво, спокойно, без лишнего шума.', '/avatars/member.svg', (select id from public.roles where slug = 'member'), 'active', '2025-09-01'),
  ('Максим', 15, '2010-03-11', 'KNTL.New', '739002611', 'Telegram', 'Русский', 'Русский', 'Омск', 'Android', 'Учусь', 'Средний', 'Хочется стать частью сильного состава.', '/avatars/rookie.svg', (select id from public.roles where slug = 'rookie'), 'active', '2025-10-10'),
  ('Егор', 18, '2007-12-05', 'KNTL.Old', '480016622', 'Старый состав', 'Русский', 'Русский', 'Новосибирск', 'Android', 'Средний', 'Средний', 'Был частью первого набора участников.', '/avatars/archive.svg', (select id from public.roles where slug = 'member'), 'archived', '2024-12-20')
on conflict (game_id) do nothing;

insert into public.applications (
  name, age, birth_date, game_nickname, game_id, invited_by, nationality, languages,
  location, device, ult_skill, sns_skill, first_impression, photo_url, status
)
select
  'Тимур', 16, '2009-02-02', 'Pending.K', '900221144', 'Telegram', 'Казах',
  'Русский, Казахский', 'Тараз', 'Android', 'Хороший', 'Учусь',
  'Гильдия выглядит серьёзной и собранной.', null, 'pending'
where not exists (
  select 1 from public.applications where game_id = '900221144'
);

-- После создания пользователя в Authentication добавь администратора так:
-- insert into public.admin_users (user_id) values ('ВСТАВЬ_AUTH_USER_ID_СЮДА');
