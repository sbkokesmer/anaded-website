import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
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
import { useNotifications } from "../context/NotificationContext";
import ApplicationsManager from "../components/admin/ApplicationsManager";
import DeletionRequestsManager from "../components/admin/DeletionRequestsManager";
import DuesManager from "../components/admin/DuesManager";
import DuesModal from "../components/member/DuesModal";
import EventsModal from "../components/member/EventsModal";
import NotificationsModal from "../components/member/NotificationsModal";
import ProfileModal from "../components/member/ProfileModal";
import AdminRegistrationsModal from "../components/admin/AdminRegistrationsModal";
import AdminPaymentsModal from "../components/admin/AdminPaymentsModal";
import { fetchMyProfile } from "../lib/api";
import { getAdminNotifications } from "../lib/notifications";

export default function Dashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const { unreadCount, refresh: refreshNotifBadge } = useNotifications();
  const [profile, setProfile] = useState(null);
  const [regCount, setRegCount] = useState(0);
  const [payCount, setPayCount] = useState(0);
  const [modal, setModal] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      setProfile(await fetchMyProfile());
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadAdminCounts = useCallback(async () => {
    try {
      const notifs = await getAdminNotifications();
      // Sadece okunmamış (yeni) olanları say — görülünce rozet temizlenir
      setRegCount(notifs.filter((n) => n.type === "registration" && !n.read).length);
      setPayCount(notifs.filter((n) => n.type === "payment" && !n.read).length);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (user) loadProfile();
  }, [user, loadProfile]);

  useEffect(() => {
    if (isAdmin) loadAdminCounts();
  }, [isAdmin, loadAdminCounts]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-gray-300">
        <span className="w-8 h-8 border-4 border-gray-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/giris" replace />;

  // Profil verileri (yüklenene kadar metadata/e-posta yedeği)
  const meta = user.user_metadata || {};
  const name = profile?.name || meta.name || user.email?.split("@")[0] || "Üye";
  const memberId = profile?.member_id || "—";
  const phone = profile?.phone || meta.phone || "—";
  const joinDate = profile?.join_date
    ? new Date(profile.join_date).toLocaleDateString("tr-TR")
    : "—";
  const avatar = profile?.avatar_url;

  const quickActions = isAdmin
    ? [
        { key: "payments", icon: FaCreditCard, label: "Yeni Ödemeler", color: "bg-sky-light text-navy", badge: payCount },
        { key: "aregs", icon: FaCalendarCheck, label: "Faaliyet Kayıtları", color: "bg-gold-light text-navy-dark", badge: regCount },
        { key: "notifs", icon: FaBell, label: "Bildirimler", color: "bg-red-50 text-brand-red", badge: unreadCount },
        { key: "profile", icon: FaUser, label: "Profil Düzenle", color: "bg-green-50 text-green-700" },
      ]
    : [
        { key: "dues", icon: FaCreditCard, label: "Aidat Öde", color: "bg-sky-light text-navy", disabled: true },
        { key: "events", icon: FaCalendarCheck, label: "Faaliyet Kayıt", color: "bg-gold-light text-navy-dark" },
        { key: "notifs", icon: FaBell, label: "Bildirimler", color: "bg-red-50 text-brand-red", badge: unreadCount },
        { key: "profile", icon: FaUser, label: "Profil Düzenle", color: "bg-green-50 text-green-700" },
      ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-navy-dark text-white py-10">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Hoş geldiniz, {name}</h1>
              <p className="text-white/60 text-sm mt-1">Üye No: {memberId}</p>
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
        {/* Admin: Üyelik başvuruları + etkinlik yönetimi */}
        {isAdmin && (
          <div className="mb-10 space-y-6">
            <ApplicationsManager />
            <DeletionRequestsManager />
            <DuesManager />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {quickActions.map((action) => (
            <button
              key={action.key}
              onClick={() => !action.disabled && setModal(action.key)}
              disabled={action.disabled}
              title={action.disabled ? "PayTR entegrasyonu sonrası aktif olacak" : undefined}
              className={`relative bg-white p-5 rounded-xl transition-all duration-300 border border-gray-100 text-left ${
                action.disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              }`}
            >
              <div
                className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center text-lg mb-3`}
              >
                <action.icon />
              </div>
              <span className="text-navy font-semibold text-sm">{action.label}</span>
              {action.disabled && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                  Yakında
                </span>
              )}
              {!action.disabled && action.badge > 0 && (
                <span className="absolute top-3 right-3 min-w-5 h-5 px-1 bg-brand-red text-white text-xs rounded-full flex items-center justify-center font-bold">
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
                  { icon: FaUser, label: "Ad Soyad", value: name },
                  { icon: FaEnvelope, label: "E-posta", value: user.email },
                  { icon: FaPhone, label: "Telefon", value: phone },
                  { icon: FaIdCard, label: "Üye No", value: memberId },
                  { icon: FaCalendarAlt, label: "Üyelik Tarihi", value: joinDate },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-sky-light rounded-lg flex items-center justify-center text-navy flex-shrink-0 text-sm">
                      <item.icon />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-navy">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2.5 rounded-lg">
                  <FaCheckCircle />
                  <span className="text-sm font-medium">Üyelik Aktif</span>
                </div>
              </div>

              <button
                onClick={() => setModal("profile")}
                className="w-full mt-4 py-2.5 bg-gray-100 text-navy rounded-lg text-sm font-semibold hover:bg-gray-200 transition cursor-pointer"
              >
                Profili Düzenle
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hızlı erişim kartları */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <FaBell className="text-gold" />
                Bildirimler & Faaliyetler
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setModal("notifs")}
                  className="text-left p-5 bg-red-50/50 rounded-xl hover:bg-red-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FaBell className="text-brand-red text-xl" />
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
                        {unreadCount} yeni
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-navy text-sm">Bildirimleri Gör</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isAdmin
                      ? "Başvurular, faaliyet kayıtları ve talepler"
                      : "Yeni duyuru ve faaliyetler"}
                  </p>
                </button>
                <button
                  onClick={() => setModal(isAdmin ? "aregs" : "events")}
                  className="text-left p-5 bg-gold-light/40 rounded-xl hover:bg-gold-light transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <FaCalendarCheck className="text-gold text-xl" />
                    {isAdmin && regCount > 0 && (
                      <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
                        {regCount}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-navy text-sm">
                    {isAdmin ? "Faaliyet Kayıtları" : "Faaliyetlere Katıl"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isAdmin
                      ? "Kim hangi faaliyete kayıt oldu"
                      : "Faaliyetleri gör ve kayıt ol"}
                  </p>
                </button>
              </div>
            </div>

            {/* Aidat Durumu (sadece üyede) */}
            {!isAdmin && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <FaCreditCard className="text-brand-red" />
                Aidat Durumu
              </h2>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm text-gray-500">
                    {profile?.dues_paid
                      ? "Aidatınız güncel görünüyor."
                      : profile?.next_dues_date
                      ? `Son ödeme tarihi: ${new Date(profile.next_dues_date).toLocaleDateString("tr-TR")}`
                      : "Aidat bilgisi için dernek ile iletişime geçebilirsiniz."}
                  </p>
                </div>
                <button
                  disabled
                  title="PayTR entegrasyonu sonrası aktif olacak"
                  className="px-5 py-2.5 bg-gray-200 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed"
                >
                  Aidat Öde (Yakında)
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Modaller */}
      <DuesModal open={modal === "dues"} onClose={() => setModal(null)} profile={profile} />
      <EventsModal open={modal === "events"} onClose={() => setModal(null)} />
      <NotificationsModal
        open={modal === "notifs"}
        onClose={() => {
          setModal(null);
          refreshNotifBadge();
        }}
        onRead={refreshNotifBadge}
        profile={profile}
        isAdmin={isAdmin}
      />
      <AdminRegistrationsModal
        open={modal === "aregs"}
        onClose={() => {
          setModal(null);
          loadAdminCounts();
          refreshNotifBadge();
        }}
        onCleared={() => {
          loadAdminCounts();
          refreshNotifBadge();
        }}
        onSeen={() => {
          loadAdminCounts();
          refreshNotifBadge();
        }}
      />
      <AdminPaymentsModal
        open={modal === "payments"}
        onClose={() => {
          setModal(null);
          loadAdminCounts();
          refreshNotifBadge();
        }}
        onCleared={() => {
          loadAdminCounts();
          refreshNotifBadge();
        }}
        onSeen={() => {
          loadAdminCounts();
          refreshNotifBadge();
        }}
      />
      <ProfileModal
        open={modal === "profile"}
        onClose={() => setModal(null)}
        profile={profile}
        email={user.email}
        onSaved={loadProfile}
      />
    </div>
  );
}
