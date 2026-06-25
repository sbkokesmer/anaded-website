-- ============================================================
--  ANADED Website — Supabase Şeması
--  Supabase Dashboard > SQL Editor > New query > buraya yapıştır > Run
-- ============================================================

-- ------------------------------------------------------------
-- 1) Admin yetkisi
-- ------------------------------------------------------------
-- Admin e-postalarını tutan tablo. Sadece buradaki e-postalar
-- veri ekleyip/düzenleyebilir/silebilir.
create table if not exists public.admins (
  email text primary key
);

-- !!! ADMIN E-POSTANI BURAYA YAZ !!!
-- (Birazdan Authentication bölümünde aynı e-posta ile bir kullanıcı oluşturacaksın)
insert into public.admins (email)
values ('admin@anaded.com')
on conflict (email) do nothing;

-- admins tablosunu dışarıya kapat (kimse listesini okuyamasın).
-- Aşağıdaki is_admin() fonksiyonu security definer olduğu için yine de çalışır.
alter table public.admins enable row level security;

-- Giriş yapan kullanıcının admin olup olmadığını döndüren yardımcı fonksiyon
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admins
    where email = (auth.jwt() ->> 'email')
  );
$$;

-- ------------------------------------------------------------
-- 2) Faaliyetler
-- ------------------------------------------------------------
create table if not exists public.activities (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        text,                       -- "15 Mart 2026" gibi serbest metin
  description text,
  cover_url   text,                       -- kutucukta görünecek kapak fotoğrafı
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- Her faaliyetin galeri fotoğrafları
create table if not exists public.activity_photos (
  id          uuid primary key default gen_random_uuid(),
  activity_id uuid references public.activities(id) on delete cascade,
  url         text not null,
  created_at  timestamptz default now()
);

-- ------------------------------------------------------------
-- 3) Duyurular
-- ------------------------------------------------------------
create table if not exists public.announcements (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  summary    text,
  content    text,
  date       text,
  category   text,
  pinned     boolean default false,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4) Anlaşmalı Kurumlar
-- ------------------------------------------------------------
create table if not exists public.partners (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  logo_url   text,
  created_at timestamptz default now()
);

-- ============================================================
--  RLS (Row Level Security) — Herkes OKUR, sadece admin YAZAR
-- ============================================================
alter table public.activities      enable row level security;
alter table public.activity_photos enable row level security;
alter table public.announcements   enable row level security;
alter table public.partners        enable row level security;

-- Okuma: herkese açık
create policy "read activities"      on public.activities      for select using (true);
create policy "read activity_photos" on public.activity_photos for select using (true);
create policy "read announcements"   on public.announcements   for select using (true);
create policy "read partners"        on public.partners        for select using (true);

-- Yazma (insert/update/delete): sadece admin
create policy "admin write activities"      on public.activities      for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write activity_photos" on public.activity_photos for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write announcements"   on public.announcements   for all using (public.is_admin()) with check (public.is_admin());
create policy "admin write partners"        on public.partners        for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
--  STORAGE — fotoğraf/logo depolama bucket'ları
-- ============================================================
insert into storage.buckets (id, name, public)
values ('activity-photos', 'activity-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('partner-logos', 'partner-logos', true)
on conflict (id) do nothing;

-- Okuma: herkese açık
create policy "public read activity-photos"
  on storage.objects for select using (bucket_id = 'activity-photos');
create policy "public read partner-logos"
  on storage.objects for select using (bucket_id = 'partner-logos');

-- Yükleme/güncelleme/silme: sadece admin
create policy "admin write activity-photos"
  on storage.objects for insert with check (bucket_id = 'activity-photos' and public.is_admin());
create policy "admin update activity-photos"
  on storage.objects for update using (bucket_id = 'activity-photos' and public.is_admin());
create policy "admin delete activity-photos"
  on storage.objects for delete using (bucket_id = 'activity-photos' and public.is_admin());

create policy "admin write partner-logos"
  on storage.objects for insert with check (bucket_id = 'partner-logos' and public.is_admin());
create policy "admin update partner-logos"
  on storage.objects for update using (bucket_id = 'partner-logos' and public.is_admin());
create policy "admin delete partner-logos"
  on storage.objects for delete using (bucket_id = 'partner-logos' and public.is_admin());
