import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { NAV_LINKS, SERVICES } from "../../constants/data";
import { useContact } from "../../context/ContactContext";

export default function Footer() {
  const { contact } = useContact();

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
                  {link.isPage ? (
                    <Link
                      to={link.to}
                      className="text-white/60 text-sm hover:text-sky transition"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <Link
                      to={`/#${link.to}`}
                      className="text-white/60 text-sm hover:text-sky transition"
                    >
                      {link.label}
                    </Link>
                  )}
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
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-sky transition">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="hover:text-sky transition"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.phoneSecondary && (
                <li>
                  <a
                    href={`tel:${contact.phoneSecondary.replace(/\s/g, "")}`}
                    className="hover:text-sky transition"
                  >
                    {contact.phoneSecondary}
                  </a>
                </li>
              )}
              {contact.address && <li>{contact.address}</li>}
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky transition"
              >
                <FaInstagram />
              </a>
              <a
                href={contact.facebook}
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
