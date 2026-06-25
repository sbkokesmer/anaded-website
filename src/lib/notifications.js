import {
  fetchAnnouncements,
  fetchActivities,
  fetchNotificationStates,
  fetchApplications,
  fetchDeletionRequests,
  fetchAllActivityRegistrations,
  fetchPayments,
} from "./api";

export function buildNotifications({ announcements, activities, profile, states }) {
  const list = [];

  // Üye, üyelik tarihinden ÖNCE eklenen içerik için bildirim almaz.
  const baseline = profile?.created_at ? new Date(profile.created_at) : null;
  const isNew = (createdAt) => !baseline || new Date(createdAt) > baseline;

  for (const a of announcements) {
    if (!isNew(a.created_at)) continue;
    list.push({
      key: `announcement:${a.id}`,
      type: "announcement",
      title: a.title,
      body: a.summary,
      date: a.created_at,
    });
  }
  for (const a of activities) {
    if (!isNew(a.created_at)) continue;
    list.push({
      key: `activity:${a.id}`,
      type: "activity",
      title: `Yeni faaliyet: ${a.title}`,
      body: a.description,
      date: a.created_at,
    });
  }
  if (profile?.next_dues_date && !profile.dues_paid) {
    const due = new Date(profile.next_dues_date);
    if (new Date() >= due) {
      list.push({
        key: `dues:${profile.next_dues_date}`,
        type: "dues",
        title: "Aidat ödemeniz gerekiyor",
        body: `Aidat son ödeme tarihi (${due.toLocaleDateString("tr-TR")}) geldi. Lütfen ödemenizi yapınız.`,
        date: profile.next_dues_date,
      });
    }
  }

  return list
    .map((n) => {
      const st = states[n.key] || {};
      return { ...n, read: !!st.read, deleted: !!st.deleted };
    })
    .filter((n) => !n.deleted)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

/** Panel rozeti için: okunmamış bildirim sayısı */
export async function getNotifications(profile) {
  const [announcements, activities, states] = await Promise.all([
    fetchAnnouncements(),
    fetchActivities(),
    fetchNotificationStates(),
  ]);
  return buildNotifications({ announcements, activities, profile, states });
}

// ---- ADMIN bildirimleri (üyeden farklı) ----
// Kaynak: yeni üyelik başvuruları, hesap silme talepleri, faaliyet kayıtları.
// (Admin kendi eklediği faaliyet/duyuru için bildirim ALMAZ.)
// PayTR kurulunca ödeme bildirimleri de buraya eklenecek.
export async function getAdminNotifications() {
  const [apps, dels, regs, pays, states] = await Promise.all([
    fetchApplications(),
    fetchDeletionRequests(),
    fetchAllActivityRegistrations(),
    fetchPayments(),
    fetchNotificationStates(),
  ]);

  const list = [];
  for (const a of apps.filter((x) => x.status === "pending")) {
    list.push({
      key: `application:${a.id}`,
      type: "application",
      title: `Yeni üyelik başvurusu: ${a.name}`,
      body: a.email,
      date: a.created_at,
    });
  }
  for (const d of dels.filter((x) => x.status === "pending")) {
    list.push({
      key: `deletion:${d.id}`,
      type: "deletion",
      title: `Hesap silme talebi: ${d.name || d.email}`,
      body: d.email,
      date: d.created_at,
    });
  }
  for (const r of regs) {
    list.push({
      key: `areg:${r.id}`,
      type: "registration",
      title: `${r.memberName} faaliyete kayıt oldu`,
      body: r.activityTitle,
      date: r.created_at,
    });
  }
  for (const p of pays) {
    list.push({
      key: `payment:${p.id}`,
      type: "payment",
      title: `${p.member_name || "Üye"} ödeme yaptı`,
      body: p.amount ? `${p.amount} ₺` : "Aidat ödemesi",
      date: p.created_at,
    });
  }

  return list
    .map((n) => {
      const st = states[n.key] || {};
      return { ...n, read: !!st.read, deleted: !!st.deleted };
    })
    .filter((n) => !n.deleted)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
