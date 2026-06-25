import { useEffect, useState, useCallback } from "react";
import {
  FaBell,
  FaBullhorn,
  FaImages,
  FaCalendarCheck,
  FaCreditCard,
  FaTrash,
  FaSpinner,
  FaCheckDouble,
  FaUserPlus,
  FaUserSlash,
} from "react-icons/fa";
import Modal from "../ui/Modal";
import { setNotificationState } from "../../lib/api";
import { getNotifications, getAdminNotifications } from "../../lib/notifications";

const TYPE_META = {
  announcement: { icon: FaBullhorn, cls: "bg-gold-light text-yellow-700", label: "Duyuru" },
  activity: { icon: FaImages, cls: "bg-sky-light text-navy", label: "Faaliyet" },
  dues: { icon: FaCreditCard, cls: "bg-red-50 text-brand-red", label: "Aidat" },
  application: { icon: FaUserPlus, cls: "bg-green-50 text-green-700", label: "Başvuru" },
  deletion: { icon: FaUserSlash, cls: "bg-red-50 text-brand-red", label: "Silme" },
  registration: { icon: FaCalendarCheck, cls: "bg-sky-light text-navy", label: "Kayıt" },
};

export default function NotificationsModal({ open, onClose, profile, isAdmin = false, onRead }) {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAdmin
        ? await getAdminNotifications()
        : await getNotifications(profile);
      setNotifs(data); // bu oturumda okunmamış vurgusu görünsün
      // Panel açıldı → arka planda hepsini okundu işaretle (rozet temizlensin)
      const unread = data.filter((n) => !n.read);
      if (unread.length) {
        await Promise.all(
          unread.map((n) =>
            setNotificationState(n.key, { read: true }).catch(() => {})
          )
        );
        onRead?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profile, isAdmin, onRead]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const markRead = async (n) => {
    if (n.read) return;
    setNotifs((prev) =>
      prev.map((x) => (x.key === n.key ? { ...x, read: true } : x))
    );
    try {
      await setNotificationState(n.key, { read: true });
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (n) => {
    setNotifs((prev) => prev.filter((x) => x.key !== n.key));
    try {
      await setNotificationState(n.key, { deleted: true, read: true });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    const unread = notifs.filter((n) => !n.read);
    setNotifs((prev) => prev.map((x) => ({ ...x, read: true })));
    await Promise.all(
      unread.map((n) => setNotificationState(n.key, { read: true }).catch(() => {}))
    );
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-5 pr-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <FaBell className="text-gold" />
            Bildirimler
            {unreadCount > 0 && (
              <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
                {unreadCount} yeni
              </span>
            )}
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-navy hover:text-brand-red font-medium cursor-pointer"
            >
              <FaCheckDouble /> Tümünü okundu yap
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-300">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaBell className="text-4xl mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Bildiriminiz yok.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {notifs.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.announcement;
              const Icon = meta.icon;
              return (
                <div
                  key={n.key}
                  onClick={() => markRead(n)}
                  className={`group flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    n.read
                      ? "bg-white border-gray-100"
                      : "bg-sky-light/40 border-sky/30"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.cls}`}>
                    <Icon className="text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="w-2 h-2 bg-brand-red rounded-full flex-shrink-0" />
                      )}
                      <p className={`text-sm ${n.read ? "text-navy font-medium" : "text-navy font-bold"}`}>
                        {n.title}
                      </p>
                    </div>
                    {n.body && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.date).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(n);
                    }}
                    className="p-1.5 text-gray-300 hover:text-brand-red transition cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Sil"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
