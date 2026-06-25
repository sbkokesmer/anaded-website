-- ============================================================
--  Hesap Silme Talepleri
-- ============================================================
-- user_id'ye FK koymuyoruz ki kullanıcı silindiğinde kayıt yönetilebilsin.
create table if not exists public.deletion_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  email      text,
  name       text,
  status     text not null default 'pending',  -- pending | approved | rejected
  reason     text,
  created_at timestamptz default now()
);

alter table public.deletion_requests enable row level security;

-- Kullanıcı kendi talebini oluşturabilir ve görebilir
create policy "del req insert own" on public.deletion_requests
  for insert with check (user_id = auth.uid());
create policy "del req read own/admin" on public.deletion_requests
  for select using (user_id = auth.uid() or public.is_admin());

-- Sadece admin günceller/siler
create policy "del req admin update" on public.deletion_requests
  for update using (public.is_admin()) with check (public.is_admin());
create policy "del req admin delete" on public.deletion_requests
  for delete using (public.is_admin());
