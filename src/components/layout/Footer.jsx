import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { NAV_LINKS, SERVICES, CONTACT_INFO } from "../../constants/data";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-white pt-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo.jpeg"
                alt="ANADED"
                className="w-16 h-16 rounded-full"
              />
            </div>
            <h3 className="font-bold text-lg mb-2">Anadolu Emekliler Derneği</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Emeklilerimizin yaşam kalitesini artırmak, haklarını savunmak ve
              sosyal dayanışmayı güçlendirmek için 2021 yılından bu yana faaliyet
              gösteriyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-semibold mb-5">Hızlı Bağlantılar</h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <a
                    href={`#${link.to}`}
                    className="text-white/60 text-sm hover:text-sky transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-gold font-semibold mb-5">Hizmetler</h4>
            <ul className="space-y-2.5">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.title}>
                  <a
                    href="#hizmetler"
                    className="text-white/60 text-sm hover:text-sky transition"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold font-semibold mb-5">İletişim</h4>
            <ul className="space-y-2.5 text-white/60 text-sm">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-sky transition">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+90${CONTACT_INFO.phone.replace(/\D/g, "").slice(1)}`}
                  className="hover:text-sky transition"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`tel:+90${CONTACT_INFO.phoneSecondary.replace(/\D/g, "").slice(1)}`}
                  className="hover:text-sky transition"
                >
                  {CONTACT_INFO.phoneSecondary}
                </a>
              </li>
              <li>{CONTACT_INFO.address}</li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky transition"
              >
                <FaInstagram />
              </a>
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky transition"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        <div className="text-center py-6 text-white/40 text-sm">
          &copy; 2026 <span className="text-brand-red font-semibold">ANADED</span> -
          Anadolu Emekliler Derneği. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
