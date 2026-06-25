-- ============================================================
--  İletişim Bilgileri (tek satırlık, admin düzenleyebilir)
-- ============================================================
create table if not exists public.contact_info (
  id               int primary key default 1,
  address          text,
  phone            text,
  phone_secondary  text,
  email            text,
  website          text,
  hours            text,
  instagram        text,
  facebook         text,
  instagram_handle text,
  facebook_handle  text,
  updated_at       timestamptz default now(),
  constraint single_row check (id = 1)
);

alter table public.contact_info enable row level security;

create policy "read contact_info"
  on public.contact_info for select using (true);
create policy "admin write contact_info"
  on public.contact_info for all
  using (public.is_admin()) with check (public.is_admin());

-- Mevcut değerlerle başlat
insert into public.contact_info
  (id, address, phone, phone_secondary, email, website, hours, instagram, facebook, instagram_handle, facebook_handle)
values
  (1,
   'Tepebağ Mah. İnönü Cad. Dış Kapı No:41 Kızılay İşhanı Kat:2 D:25 Seyhan / ADANA',
   '0552 363 92 92',
   '0322 352 92 92',
   'info@anaded.com',
   'www.anaded.com',
   'Pazartesi - Cuma: 09:00 - 17:00',
   'https://instagram.com/Anaded2021',
   'https://facebook.com/Anaded2021',
   '@Anaded2021',
   'Anaded2021')
on conflict (id) do nothing;
