-- ============================================================
--  ANADED — Başlangıç verileri (opsiyonel)
--  schema.sql çalıştırıldıktan SONRA bunu çalıştır.
--  Mevcut sitedeki örnek faaliyet ve duyuruları veritabanına taşır.
-- ============================================================

-- ---- Faaliyetler ----
insert into public.activities (title, date, description, sort_order) values
  ('Antalya Kültür Gezisi', '15 Mart 2026', 'Üyelerimizle birlikte Antalya''nın tarihi ve doğal güzelliklerini keşfettik.', 3),
  ('Sağlık Semineri',       '8 Mart 2026',  'Uzman doktorlarımız ile emeklilere yönelik sağlıklı yaşam semineri düzenledik.', 2),
  ('Bahar Şenliği',         '1 Mart 2026',  'Geleneksel bahar şenliğimizde müzik, dans ve eğlence dolu bir gün geçirdik.', 1);

-- ---- Duyurular ----
insert into public.announcements (title, summary, content, date, category, pinned) values
  ('2026 Yılı Genel Kurul Toplantısı',
   'Derneğimizin 2026 yılı olağan genel kurul toplantısı 20 Nisan 2026 tarihinde gerçekleştirilecektir. Tüm üyelerimizin katılımını bekliyoruz.',
   'Derneğimizin 2026 yılı olağan genel kurul toplantısı 20 Nisan 2026 Pazar günü saat 10:00''da dernek merkezinde gerçekleştirilecektir. Gündem maddeleri: yönetim kurulu faaliyet raporu, mali rapor, denetim kurulu raporu ve yeni dönem bütçesinin görüşülmesi. Tüm üyelerimizin katılımını önemle rica ederiz.',
   '22 Mart 2026', 'Genel Kurul', true),
  ('Antalya Kültür Gezisi Kayıtları Başladı',
   '25-28 Nisan tarihlerinde düzenlenecek Antalya kültür gezimiz için kayıtlar başlamıştır. Kontenjan sınırlıdır.',
   '25-28 Nisan 2026 tarihlerinde düzenlenecek Antalya kültür gezimiz için kayıtlar başlamıştır. Gezi programı: Kaleiçi, Aspendos, Perge antik kenti ziyaretleri ve Düden Şelalesi turu. Konaklama 5 yıldızlı otelde, tam pansiyon olarak planlanmıştır. Kontenjan 40 kişi ile sınırlıdır. Kayıt için dernek merkezimize başvurabilirsiniz.',
   '20 Mart 2026', 'Gezi', false),
  ('Ücretsiz Sağlık Taraması',
   'Anlaşmalı hastanelerimizde üyelerimize özel ücretsiz genel sağlık taraması kampanyamız başlamıştır.',
   'Derneğimiz ile anlaşmalı hastanelerde üyelerimize özel ücretsiz genel sağlık taraması kampanyamız 1 Nisan - 30 Nisan 2026 tarihleri arasında devam edecektir. Tarama kapsamında: tam kan sayımı, tansiyon ölçümü, şeker testi, kolesterol ve göz muayenesi yer almaktadır. Randevu almak için dernek sekreterliğimizi arayabilirsiniz.',
   '18 Mart 2026', 'Sağlık', false),
  ('Emekli Maaş Zammı Bilgilendirme Toplantısı',
   '2026 yılı emekli maaş zamları hakkında bilgilendirme toplantısı düzenlenecektir.',
   '2026 yılı ikinci yarı emekli maaş zamları, ek ödemeler ve intibak düzenlemeleri hakkında üyelerimizi bilgilendirmek amacıyla 5 Nisan 2026 Cumartesi günü saat 14:00''te dernek merkezinde uzman hukukçularımız eşliğinde bilgilendirme toplantısı düzenlenecektir. Katılım ücretsizdir.',
   '15 Mart 2026', 'Bilgilendirme', false),
  ('Nisan Ayı Aidat Hatırlatması',
   'Nisan ayı aidat ödemelerinizi dernek merkezinden veya banka havalesi ile yapabilirsiniz.',
   'Değerli üyelerimiz, Nisan 2026 aidatlarınızı dernek merkezimizden elden, Ziraat Bankası TR00 0000 0000 0000 0000 0000 00 IBAN numaralı hesabımıza havale/EFT ile veya PTT aracılığıyla ödeyebilirsiniz. Açıklama kısmına üye numaranızı yazmayı unutmayınız.',
   '14 Mart 2026', 'Aidat', false),
  ('Teknoloji Kullanım Kursu Başlıyor',
   'Akıllı telefon ve bilgisayar kullanımı kursu 10 Nisan''da başlıyor. Kayıtlar açıktır.',
   'Üyelerimize yönelik akıllı telefon ve bilgisayar kullanımı kursu 10 Nisan 2026 tarihinde başlayacaktır. 8 haftalık kurs programında temel telefon kullanımı, WhatsApp, e-devlet işlemleri, video görüşme ve internet güvenliği konuları işlenecektir. Kurs her Perşembe 10:00-12:00 saatleri arasında dernek merkezinde yapılacaktır. Kontenjan 20 kişi ile sınırlıdır.',
   '12 Mart 2026', 'Eğitim', false),
  ('8 Mart Dünya Kadınlar Günü Kutlaması',
   '8 Mart Dünya Kadınlar Günü kapsamında kadın üyelerimize özel etkinlik düzenlendi.',
   '8 Mart Dünya Kadınlar Günü kapsamında kadın üyelerimize özel kahvaltılı buluşma ve müzikli eğlence programı düzenlenmiştir. Etkinliğe 85 kadın üyemiz katılmıştır. Programda kadın hakları konusunda bilgilendirme sunumu da yapılmıştır.',
   '8 Mart 2026', 'Etkinlik', false);
