-- ============================================================
--  Aidat Ödeme Takibi (üye + yıl + ay)
-- ============================================================
create table if not exists public.dues_payments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null,
  year       int not null,
  month      int not null,            -- 1..12
  paid       boolean default true,
  amount     numeric,
  paid_at    timestamptz default now(),
  unique (user_id, year, month)
);

alter table public.dues_payments enable row level security;

-- Üye kendi ödemelerini görür; admin hepsini görür/yönetir
create policy "dues read own/admin" on public.dues_payments
  for select using (user_id = auth.uid() or public.is_admin());
create policy "dues admin write" on public.dues_payments
  for all using (public.is_admin()) with check (public.is_admin());
