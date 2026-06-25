import {
  FaBalanceScale,
  FaHeartbeat,
  FaPlane,
  FaGraduationCap,
  FaHandsHelping,
  FaShieldAlt,
} from "react-icons/fa";

export const NAV_LINKS = [
  { label: "Ana Sayfa", to: "anasayfa" },
  { label: "Hakkımızda", to: "/hakkimizda", isPage: true },
  { label: "Hizmetler", to: "/hizmetler", isPage: true },
  { label: "Faaliyetler", to: "/faaliyetler", isPage: true },
  { label: "Duyurular", to: "/duyurular", isPage: true },
  { label: "İletişim", to: "/iletisim", isPage: true },
];

export const STATS = [
  { icon: "👥", value: "5.000+", label: "Kayıtlı Üye" },
  { icon: "🏛", value: "3", label: "Şube Sayısı" },
  { icon: "🏆", value: "200+", label: "Düzenlenen Etkinlik" },
  { icon: "📅", value: "2021", label: "Kuruluş Yılı" },
];

export const ABOUT_FEATURES = [
  "Emekli hakları savunuculuğu",
  "Sosyal ve kültürel etkinlikler",
  "Sağlık ve danışmanlık hizmetleri",
  "Gezi ve tatil organizasyonları",
  "Hukuki destek ve rehberlik",
];

export const SERVICES = [
  {
    Icon: FaBalanceScale,
    title: "Hukuki Danışmanlık",
    description:
      "Emeklilik hakları, maaş hesaplamaları ve yasal süreçler hakkında ücretsiz hukuki danışmanlık hizmeti sunuyoruz.",
    color: "sky",
  },
  {
    Icon: FaHeartbeat,
    title: "Sağlık Hizmetleri",
    description:
      "Periyodik sağlık taramaları, sağlık seminerleri ve anlaşmalı sağlık kuruluşlarında indirimli hizmet imkanı.",
    color: "red",
  },
  {
    Icon: FaPlane,
    title: "Gezi ve Tatil",
    description:
      "Yurt içi ve yurt dışı gezi organizasyonları, uygun fiyatlı tatil paketleri ve kültürel turlar düzenliyoruz.",
    color: "gold",
  },
  {
    Icon: FaGraduationCap,
    title: "Eğitim ve Kurslar",
    description:
      "Teknoloji kullanımı, el sanatları, yabancı dil ve kişisel gelişim kursları ile aktif yaşamı destekliyoruz.",
    color: "sky",
  },
  {
    Icon: FaHandsHelping,
    title: "Sosyal Dayanışma",
    description:
      "Üyelerimiz arasında dayanışmayı güçlendiren etkinlikler, yardımlaşma programları ve sosyal buluşmalar.",
    color: "red",
  },
  {
    Icon: FaShieldAlt,
    title: "Hak Savunuculuğu",
    description:
      "Emekli haklarının korunması ve geliştirilmesi için yetkili kurumlara karşı savunuculuk faaliyetleri yürütüyoruz.",
    color: "gold",
  },
];

export const ACTIVITIES = [
  {
    emoji: "🌴",
    date: "15 Mart 2026",
    title: "Antalya Kültür Gezisi",
    description:
      "Üyelerimizle birlikte Antalya'nın tarihi ve doğal güzelliklerini keşfettik.",
    bg: "from-sky-light to-sky/30",
  },
  {
    emoji: "🏥",
    date: "8 Mart 2026",
    title: "Sağlık Semineri",
    description:
      "Uzman doktorlarımız ile emeklilere yönelik sağlıklı yaşam semineri düzenledik.",
    bg: "from-gold-light to-gold/30",
  },
  {
    emoji: "🎵",
    date: "1 Mart 2026",
    title: "Bahar Şenliği",
    description:
      "Geleneksel bahar şenliğimizde müzik, dans ve eğlence dolu bir gün geçirdik.",
    bg: "from-red-100 to-red-200",
  },
];

export const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "2026 Yılı Genel Kurul Toplantısı",
    summary:
      "Derneğimizin 2026 yılı olağan genel kurul toplantısı 20 Nisan 2026 tarihinde gerçekleştirilecektir. Tüm üyelerimizin katılımını bekliyoruz.",
    content:
      "Derneğimizin 2026 yılı olağan genel kurul toplantısı 20 Nisan 2026 Pazar günü saat 10:00'da dernek merkezinde gerçekleştirilecektir. Gündem maddeleri: yönetim kurulu faaliyet raporu, mali rapor, denetim kurulu raporu ve yeni dönem bütçesinin görüşülmesi. Tüm üyelerimizin katılımını önemle rica ederiz.",
    date: "22 Mart 2026",
    category: "Genel Kurul",
    pinned: true,
  },
  {
    id: 2,
    title: "Antalya Kültür Gezisi Kayıtları Başladı",
    summary:
      "25-28 Nisan tarihlerinde düzenlenecek Antalya kültür gezimiz için kayıtlar başlamıştır. Kontenjan sınırlıdır.",
    content:
      "25-28 Nisan 2026 tarihlerinde düzenlenecek Antalya kültür gezimiz için kayıtlar başlamıştır. Gezi programı: Kaleiçi, Aspendos, Perge antik kenti ziyaretleri ve Düden Şelalesi turu. Konaklama 5 yıldızlı otelde, tam pansiyon olarak planlanmıştır. Kontenjan 40 kişi ile sınırlıdır. Kayıt için dernek merkezimize başvurabilirsiniz.",
    date: "20 Mart 2026",
    category: "Gezi",
    pinned: false,
  },
  {
    id: 3,
    title: "Ücretsiz Sağlık Taraması",
    summary:
      "Anlaşmalı hastanelerimizde üyelerimize özel ücretsiz genel sağlık taraması kampanyamız başlamıştır.",
    content:
      "Derneğimiz ile anlaşmalı hastanelerde üyelerimize özel ücretsiz genel sağlık taraması kampanyamız 1 Nisan - 30 Nisan 2026 tarihleri arasında devam edecektir. Tarama kapsamında: tam kan sayımı, tansiyon ölçümü, şeker testi, kolesterol ve göz muayenesi yer almaktadır. Randevu almak için dernek sekreterliğimizi arayabilirsiniz.",
    date: "18 Mart 2026",
    category: "Sağlık",
    pinned: false,
  },
  {
    id: 4,
    title: "Emekli Maaş Zammı Bilgilendirme Toplantısı",
    summary:
      "2026 yılı emekli maaş zamları hakkında bilgilendirme toplantısı düzenlenecektir.",
    content:
      "2026 yılı ikinci yarı emekli maaş zamları, ek ödemeler ve intibak düzenlemeleri hakkında üyelerimizi bilgilendirmek amacıyla 5 Nisan 2026 Cumartesi günü saat 14:00'te dernek merkezinde uzman hukukçularımız eşliğinde bilgilendirme toplantısı düzenlenecektir. Katılım ücretsizdir.",
    date: "15 Mart 2026",
    category: "Bilgilendirme",
    pinned: false,
  },
  {
    id: 5,
    title: "Nisan Ayı Aidat Hatırlatması",
    summary:
      "Nisan ayı aidat ödemelerinizi dernek merkezinden veya banka havalesi ile yapabilirsiniz.",
    content:
      "Değerli üyelerimiz, Nisan 2026 aidatlarınızı dernek merkezimizden elden, Ziraat Bankası TR00 0000 0000 0000 0000 0000 00 IBAN numaralı hesabımıza havale/EFT ile veya PTT aracılığıyla ödeyebilirsiniz. Açıklama kısmına üye numaranızı yazmayı unutmayınız.",
    date: "14 Mart 2026",
    category: "Aidat",
    pinned: false,
  },
  {
    id: 6,
    title: "Teknoloji Kullanım Kursu Başlıyor",
    summary:
      "Akıllı telefon ve bilgisayar kullanımı kursu 10 Nisan'da başlıyor. Kayıtlar açıktır.",
    content:
      "Üyelerimize yönelik akıllı telefon ve bilgisayar kullanımı kursu 10 Nisan 2026 tarihinde başlayacaktır. 8 haftalık kurs programında temel telefon kullanımı, WhatsApp, e-devlet işlemleri, video görüşme ve internet güvenliği konuları işlenecektir. Kurs her Perşembe 10:00-12:00 saatleri arasında dernek merkezinde yapılacaktır. Kontenjan 20 kişi ile sınırlıdır.",
    date: "12 Mart 2026",
    category: "Eğitim",
    pinned: false,
  },
  {
    id: 7,
    title: "8 Mart Dünya Kadınlar Günü Kutlaması",
    summary:
      "8 Mart Dünya Kadınlar Günü kapsamında kadın üyelerimize özel etkinlik düzenlendi.",
    content:
      "8 Mart Dünya Kadınlar Günü kapsamında kadın üyelerimize özel kahvaltılı buluşma ve müzikli eğlence programı düzenlenmiştir. Etkinliğe 85 kadın üyemiz katılmıştır. Programda kadın hakları konusunda bilgilendirme sunumu da yapılmıştır.",
    date: "8 Mart 2026",
    category: "Etkinlik",
    pinned: false,
  },
];

export const CONTACT_INFO = {
  address:
    "Tepebağ Mah. İnönü Cad. Dış Kapı No:41 Kızılay İşhanı Kat:2 D:25 Seyhan / ADANA",
  phone: "0552 363 92 92",
  phoneSecondary: "0322 352 92 92",
  email: "info@anaded.com",
  website: "www.anaded.com",
  hours: "Pazartesi - Cuma: 09:00 - 17:00",
  instagram: "https://instagram.com/Anaded2021",
  facebook: "https://facebook.com/Anaded2021",
  instagramHandle: "@Anaded2021",
  facebookHandle: "Anaded2021",
};
