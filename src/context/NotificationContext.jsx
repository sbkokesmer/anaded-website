import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { fetchMyProfile } from "../lib/api";
import { getNotifications, getAdminNotifications } from "../lib/notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    try {
      let notifs;
      if (isAdmin) {
        notifs = await getAdminNotifications();
      } else {
        const profile = await fetchMyProfile();
        notifs = await getNotifications(profile);
      }
      setUnreadCount(notifs.filter((n) => !n.read).length);
    } catch (err) {
      console.error("[Notifications] sayım hatası:", err.message);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refresh }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
