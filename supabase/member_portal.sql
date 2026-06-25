-- ============================================================
--  ÜYE PANELİ — profiller, etkinlikler, kayıtlar, bildirim durumları
-- ============================================================

-- Üye numarası için sayaç (örnek veride ANADED-1042 vardı, 1043'ten devam)
create sequence if not exists public.member_seq start 1043;

-- ---- PROFİLLER ----
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text,
  phone          text,
  member_id      text,
  avatar_url     text,
  join_date      date default now(),
  next_dues_date date,                 -- aidat son ödeme tarihi (admin belirler)
  dues_paid      boolean default false,
  created_at     timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles read own/admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles update own/admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy "profiles insert" on public.profiles
  for insert with check (true);

-- Yeni kullanıcı oluşunca otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, phone, member_id, join_date)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'ANADED-' || nextval('public.member_seq'),
    now()
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mevcut kullanıcılar için profil oluştur (geriye dönük)
insert into public.profiles (id, name, phone, member_id, join_date)
select u.id,
       coalesce(u.raw_user_meta_data->>'name', ''),
       coalesce(u.raw_user_meta_data->>'phone', ''),
       'ANADED-' || nextval('public.member_seq'),
       u.created_at::date
from auth.users u
where u.id not in (select id from public.profiles);

-- ---- ETKİNLİKLER (kayıt olunabilir) ----
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  date        text,
  location    text,
  capacity    int,
  is_open     boolean default true,
  created_at  timestamptz default now()
);
alter table public.events enable row level security;
create policy "events read" on public.events for select using (true);
create policy "events admin write" on public.events for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- ETKİNLİK KAYITLARI ----
create table if not exists public.event_registrations (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid references public.events(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (event_id, user_id)
);
alter table public.event_registrations enable row level security;
create policy "regs read own/admin" on public.event_registrations
  for select using (user_id = auth.uid() or public.is_admin());
create policy "regs insert own" on public.event_registrations
  for insert with check (user_id = auth.uid());
create policy "regs delete own/admin" on public.event_registrations
  for delete using (user_id = auth.uid() or public.is_admin());

-- ---- BİLDİRİM DURUMLARI (kullanıcı başına okundu/silindi) ----
create table if not exists public.notification_states (
  user_id    uuid references auth.users(id) on delete cascade,
  notif_key  text not null,
  read       boolean default false,
  deleted    boolean default false,
  updated_at timestamptz default now(),
  primary key (user_id, notif_key)
);
alter table public.notification_states enable row level security;
create policy "notif states own" on public.notification_states
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---- AVATAR STORAGE ----
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true) on conflict (id) do nothing;

create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');
create policy "avatars auth insert" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "avatars auth update" on storage.objects
  for update using (bucket_id = 'avatars' and auth.role() = 'authenticated');
create policy "avatars auth delete" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.role() = 'authenticated');
