import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { NAV_LINKS, CONTACT_INFO } from "../../constants/data";
import { useScrollPosition } from "../../hooks/useScrollDirection";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { scrolled } = useScrollPosition();
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {/* Top Bar */}
      <div className="bg-navy-dark text-white py-2 text-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <FaEnvelope className="text-sky" />
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="text-sky hover:text-white transition"
              >
                {CONTACT_INFO.email}
              </a>
            </span>
            <span className="flex items-center gap-2">
              <FaPhone className="text-sky" />
              <span className="text-gray-300">{CONTACT_INFO.phone}</span>
            </span>
          </div>
          <span className="flex items-center gap-2">
            <FaClock className="text-sky" />
            <span className="text-gray-300">Pzt - Cum: 09:00 - 17:00</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-navy/10" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 py-2">
            <img
              src="/assets/logo.jpeg"
              alt="ANADED Logo"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-navy leading-tight">
                Anadolu Emekliler Derneği
              </span>
              <span className="text-xs font-semibold text-brand-red tracking-widest">
                ANADED
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center">
            <ul className="flex">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  {link.isPage ? (
                    <Link
                      to={link.to}
                      className="block px-5 py-6 text-navy font-medium text-sm hover:text-brand-red border-b-3 border-transparent hover:border-brand-red hover:bg-gray-50 transition-all"
                    >
                      {link.label}
                    </Link>
                  ) : isHome ? (
                    <a
                      href={`#${link.to}`}
                      className="block px-5 py-6 text-navy font-medium text-sm hover:text-brand-red border-b-3 border-transparent hover:border-brand-red hover:bg-gray-50 transition-all"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={`/#${link.to}`}
                      className="block px-5 py-6 text-navy font-medium text-sm hover:text-brand-red border-b-3 border-transparent hover:border-brand-red hover:bg-gray-50 transition-all"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/panel"
                  className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg text-sm font-medium hover:bg-navy-light transition"
                >
                  <FaUser className="text-xs" />
                  {user.name.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-brand-red transition cursor-pointer"
                  title="Çıkış Yap"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link
                to="/giris"
                className="ml-4 flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition"
              >
                <FaUser className="text-xs" />
                Üye Girişi
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-navy text-xl cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden bg-white shadow-lg border-t border-gray-100">
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  {link.isPage ? (
                    <Link
                      to={link.to}
                      className="block px-5 py-4 text-navy font-medium border-b border-gray-100 hover:bg-gray-50 hover:text-brand-red transition"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ) : isHome ? (
                    <a
                      href={`#${link.to}`}
                      className="block px-5 py-4 text-navy font-medium border-b border-gray-100 hover:bg-gray-50 hover:text-brand-red transition"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={`/#${link.to}`}
                      className="block px-5 py-4 text-navy font-medium border-b border-gray-100 hover:bg-gray-50 hover:text-brand-red transition"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Auth */}
            <div className="p-4 border-t border-gray-100">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/panel"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-navy text-white rounded-lg text-sm font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <FaUser className="text-xs" />
                    Üye Paneli
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="py-3 px-4 bg-gray-100 text-gray-600 rounded-lg text-sm cursor-pointer"
                  >
                    <FaSignOutAlt />
                  </button>
                </div>
              ) : (
                <Link
                  to="/giris"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-brand-red text-white rounded-lg text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  <FaUser className="text-xs" />
                  Üye Girişi
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
