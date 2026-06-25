-- ============================================================
--  Üyelik Başvuruları
--  Herkes başvuru gönderebilir; sadece admin görür/onaylar/reddeder.
-- ============================================================
create table if not exists public.applications (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  message    text,
  status     text not null default 'pending',  -- pending | approved | rejected
  created_at timestamptz default now()
);

alter table public.applications enable row level security;

-- Herkes (giriş yapmamış ziyaretçi dahil) başvuru gönderebilir
create policy "anyone submit applications"
  on public.applications for insert with check (true);

-- Başvuruları sadece admin okuyabilir / güncelleyebilir / silebilir
create policy "admin read applications"
  on public.applications for select using (public.is_admin());
create policy "admin update applications"
  on public.applications for update
  using (public.is_admin()) with check (public.is_admin());
create policy "admin delete applications"
  on public.applications for delete using (public.is_admin());
