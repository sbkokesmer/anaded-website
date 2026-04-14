import { Navigate, Link } from "react-router-dom";
import {
  FaUser,
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaSignOutAlt,
  FaCheckCircle,
  FaCreditCard,
  FaBell,
  FaCalendarCheck,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const announcements = [
  {
    date: "20 Mart 2026",
    text: "Antalya gezisi için kayıtlar başlamıştır.",
    type: "info",
  },
  {
    date: "15 Mart 2026",
    text: "Nisan ayı aidat ödeme hatırlatması.",
    type: "warning",
  },
  {
    date: "10 Mart 2026",
    text: "Sağlık taraması randevuları açılmıştır.",
    type: "info",
  },
];

const quickActions = [
  { icon: FaCreditCard, label: "Aidat Öde", color: "bg-sky-light text-navy" },
  { icon: FaCalendarCheck, label: "Etkinlik Kayıt", color: "bg-gold-light text-navy-dark" },
  { icon: FaBell, label: "Bildirimler", color: "bg-red-50 text-brand-red", badge: 3 },
  { icon: FaUser, label: "Profil Düzenle", color: "bg-green-50 text-green-700" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) return <Navigate to="/giris" replace />;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-navy-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hoş geldiniz, {user.name}</h1>
              <p className="text-white/60 text-sm mt-1">
                Üye No: {user.memberId}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            <FaSignOutAlt />
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="relative bg-white p-5 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 text-left"
            >
              <div
                className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-lg mb-3`}
              >
                <action.icon />
              </div>
              <span className="text-navy font-semibold text-sm">
                {action.label}
              </span>
              {action.badge && (
                <span className="absolute top-3 right-3 w-5 h-5 bg-brand-red text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <FaIdCard className="text-sky" />
                Üye Bilgileri
              </h2>
              <div className="space-y-4">
                {[
                  { icon: FaUser, label: "Ad Soyad", value: user.name },
                  { icon: FaEnvelope, label: "E-posta", value: user.email },
                  { icon: FaPhone, label: "Telefon", value: user.phone },
                  { icon: FaIdCard, label: "Üye No", value: user.memberId },
                  { icon: FaCalendarAlt, label: "Üyelik Tarihi", value: user.joinDate },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-sky-light rounded-lg flex items-center justify-center text-navy flex-shrink-0 text-sm">
                      <item.icon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-navy">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Membership Status */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2.5 rounded-lg">
                  <FaCheckCircle />
                  <span className="text-sm font-medium">Üyelik Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Announcements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <FaBell className="text-gold" />
                Duyurular
              </h2>
              <div className="space-y-3">
                {announcements.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-sky-light/30 transition"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        item.type === "warning" ? "bg-gold" : "bg-sky"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-navy">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <FaCreditCard className="text-brand-red" />
                Aidat Durumu
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-600 mb-1">Ödenen</p>
                  <p className="text-2xl font-bold text-green-700">12</p>
                  <p className="text-xs text-green-500 mt-1">ay</p>
                </div>
                <div className="bg-gold-light rounded-xl p-4 text-center">
                  <p className="text-xs text-yellow-700 mb-1">Bekleyen</p>
                  <p className="text-2xl font-bold text-yellow-700">1</p>
                  <p className="text-xs text-yellow-600 mt-1">ay</p>
                </div>
                <div className="bg-sky-light rounded-xl p-4 text-center">
                  <p className="text-xs text-navy mb-1">Toplam</p>
                  <p className="text-2xl font-bold text-navy">₺1.200</p>
                  <p className="text-xs text-gray-500 mt-1">2026 yılı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
