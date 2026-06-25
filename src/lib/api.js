import { supabase } from "./supabase";

// Backend'e (Heroku) admin yetkisiyle istek atan ortak yardımcı
async function callBackend(path, body) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) throw new Error("Backend adresi (VITE_BACKEND_URL) tanımlı değil.");
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("Oturum bulunamadı, tekrar giriş yapın.");
  const res = await fetch(`${backendUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "İşlem başarısız oldu.");
  return data;
}

// Bir tablonun bir sonraki sort_order değeri (en üst/sona eklemek için)
async function nextSortOrder(table) {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.sort_order || 0) + 1;
}

// ============================================================
//  FAALİYETLER
// ============================================================
export async function fetchActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*, activity_photos(*)")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  // Her faaliyetin fotoğraflarını eskiden yeniye sırala
  return (data || []).map((a) => ({
    ...a,
    activity_photos: (a.activity_photos || []).sort(
      (x, y) => new Date(x.created_at) - new Date(y.created_at)
    ),
  }));
}

export async function createActivity({ title, date, description, cover_url }) {
  const sort_order = await nextSortOrder("activities"); // yeni faaliyet en üste
  const { data, error } = await supabase
    .from("activities")
    .insert({ title, date, description, cover_url, sort_order })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateActivity(id, fields) {
  const { data, error } = await supabase
    .from("activities")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteActivity(id) {
  const { error } = await supabase.from("activities").delete().eq("id", id);
  if (error) throw error;
}

export async function addActivityPhotos(activityId, urls) {
  if (!urls.length) return [];
  const rows = urls.map((url) => ({ activity_id: activityId, url }));
  const { data, error } = await supabase
    .from("activity_photos")
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteActivityPhoto(id) {
  const { error } = await supabase
    .from("activity_photos")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ============================================================
//  DUYURULAR
// ============================================================
export async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAnnouncement(fields) {
  const sort_order = await nextSortOrder("announcements");
  const { data, error } = await supabase
    .from("announcements")
    .insert({ ...fields, sort_order })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAnnouncement(id, fields) {
  const { error } = await supabase
    .from("announcements")
    .update(fields)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAnnouncement(id) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

// ============================================================
//  ANLAŞMALI KURUMLAR
// ============================================================
export async function fetchPartners() {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createPartner({ name, logo_url }) {
  const sort_order = await nextSortOrder("partners"); // sona ekle
  const { data, error } = await supabase
    .from("partners")
    .insert({ name, logo_url, sort_order })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePartner(id, fields) {
  const { error } = await supabase.from("partners").update(fields).eq("id", id);
  if (error) throw error;
}

export async function deletePartner(id) {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) throw error;
}

// İki öğenin sort_order değerlerini değiştir (yukarı/aşağı taşıma)
export async function swapSortOrder(table, a, b) {
  await supabase.from(table).update({ sort_order: b.sort_order }).eq("id", a.id);
  await supabase.from(table).update({ sort_order: a.sort_order }).eq("id", b.id);
}

// Ödemeler (PayTR — admin gelen kutusu)
export async function fetchPayments() {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ============================================================
//  ÜYELİK BAŞVURULARI
// ============================================================
export async function createApplication({ name, email, phone, message }) {
  // Backend üzerinden: aynı e-posta ile mükerrer başvuru / zaten üye kontrolü
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) throw new Error("Backend adresi tanımlı değil.");
  const res = await fetch(`${backendUrl}/submit-application`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Başvuru gönderilemedi.");
  return data;
}

export async function fetchApplications() {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateApplicationStatus(id, status) {
  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

/**
 * Başvuruyu onaylar: backend kullanıcı oluşturur, şifre üretir ve
 * onay e-postası gönderir. (service_role gerektiği için backend'de yapılır.)
 */
export async function approveApplication(applicationId) {
  return callBackend("/approve-application", { applicationId });
}

export async function rejectApplication(applicationId, reason) {
  return callBackend("/reject-application", { applicationId, reason });
}

export async function deleteApplication(id) {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) throw error;
}

// ============================================================
//  PROFİL (üye kendi profili)
// ============================================================
export async function fetchMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateMyProfile(fields) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  const { error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", user.id);
  if (error) throw error;
}

// Şifre / e-posta / ad güncelleme (Supabase Auth)
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function updateAuthName(name) {
  const { error } = await supabase.auth.updateUser({ data: { name } });
  if (error) throw error;
}

// ============================================================
//  ETKİNLİKLER (kayıt olunabilir)
// ============================================================
export async function fetchEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchMyRegistrations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("event_registrations")
    .select("event_id")
    .eq("user_id", user.id);
  if (error) throw error;
  return (data || []).map((r) => r.event_id);
}

export async function registerEvent(eventId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  const { error } = await supabase
    .from("event_registrations")
    .insert({ event_id: eventId, user_id: user.id });
  if (error) throw error;
}

export async function unregisterEvent(eventId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id);
  if (error) throw error;
}

// Admin: etkinlik yönetimi
export async function createEvent(fields) {
  const { data, error } = await supabase
    .from("events")
    .insert(fields)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

// ============================================================
//  FAALİYET KAYITLARI (üye katılımı)
// ============================================================
export async function fetchMyActivityRegistrations() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("activity_registrations")
    .select("activity_id")
    .eq("user_id", user.id);
  if (error) throw error;
  return (data || []).map((r) => r.activity_id);
}

export async function registerActivity(activityId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  const { error } = await supabase
    .from("activity_registrations")
    .insert({ activity_id: activityId, user_id: user.id });
  if (error) throw error;
}

export async function unregisterActivity(activityId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  const { error } = await supabase
    .from("activity_registrations")
    .delete()
    .eq("activity_id", activityId)
    .eq("user_id", user.id);
  if (error) throw error;
}

// Admin: tüm faaliyet kayıtları (üye adı + faaliyet adı ile)
export async function fetchAllActivityRegistrations() {
  const { data: regs, error } = await supabase
    .from("activity_registrations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!regs.length) return [];

  const actIds = [...new Set(regs.map((r) => r.activity_id))];
  const userIds = [...new Set(regs.map((r) => r.user_id))];
  const [{ data: acts }, { data: profs }] = await Promise.all([
    supabase.from("activities").select("id,title").in("id", actIds),
    supabase.from("profiles").select("id,name").in("id", userIds),
  ]);
  const actMap = Object.fromEntries((acts || []).map((a) => [a.id, a.title]));
  const profMap = Object.fromEntries((profs || []).map((p) => [p.id, p.name]));

  return regs.map((r) => ({
    ...r,
    activityTitle: actMap[r.activity_id] || "Faaliyet",
    memberName: profMap[r.user_id] || "Üye",
  }));
}

// ============================================================
//  BİLDİRİM DURUMLARI (okundu/silindi — kullanıcı başına)
// ============================================================
export async function fetchNotificationStates() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};
  const { data, error } = await supabase
    .from("notification_states")
    .select("*")
    .eq("user_id", user.id);
  if (error) throw error;
  const map = {};
  for (const row of data || []) map[row.notif_key] = row;
  return map;
}

export async function setNotificationState(notifKey, patch) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  const { error } = await supabase.from("notification_states").upsert(
    {
      user_id: user.id,
      notif_key: notifKey,
      ...patch,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,notif_key" }
  );
  if (error) throw error;
}

// ============================================================
//  HESAP SİLME TALEPLERİ
// ============================================================
export async function createDeletionRequest() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");
  // Profilden ad bilgisi
  const { data: prof } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();
  const { error } = await supabase.from("deletion_requests").insert({
    user_id: user.id,
    email: user.email,
    name: prof?.name || user.user_metadata?.name || "",
    status: "pending",
  });
  if (error) throw error;
}

export async function fetchMyDeletionRequest() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("deletion_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchDeletionRequests() {
  const { data, error } = await supabase
    .from("deletion_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function approveDeletion(requestId) {
  return callBackend("/approve-deletion", { requestId });
}

export async function rejectDeletion(requestId, reason) {
  return callBackend("/reject-deletion", { requestId, reason });
}

// ============================================================
//  AİDAT ÖDEME TAKİBİ
// ============================================================
export async function fetchMyDues() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("dues_payments")
    .select("*")
    .eq("user_id", user.id);
  if (error) throw error;
  return data || [];
}

export async function fetchMemberDues(userId, year) {
  let q = supabase.from("dues_payments").select("*").eq("user_id", userId);
  if (year) q = q.eq("year", year);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function setDuesPayment(userId, year, month, paid) {
  if (paid) {
    const { error } = await supabase.from("dues_payments").upsert(
      { user_id: userId, year, month, paid: true, paid_at: new Date().toISOString() },
      { onConflict: "user_id,year,month" }
    );
    if (error) throw error;
  } else {
    // Ödenmedi → kaydı sil
    const { error } = await supabase
      .from("dues_payments")
      .delete()
      .eq("user_id", userId)
      .eq("year", year)
      .eq("month", month);
    if (error) throw error;
  }
}

export async function fetchAllDuesForYear(year) {
  const { data, error } = await supabase
    .from("dues_payments")
    .select("*")
    .eq("year", year);
  if (error) throw error;
  return data || [];
}

export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("member_id", { ascending: true });
  if (error) throw error;
  return data || [];
}

// ============================================================
//  İLETİŞİM BİLGİLERİ (tek satır, id=1)
// ============================================================
const dbToContact = (r) =>
  r && {
    address: r.address,
    phone: r.phone,
    phoneSecondary: r.phone_secondary,
    email: r.email,
    website: r.website,
    hours: r.hours,
    instagram: r.instagram,
    facebook: r.facebook,
    instagramHandle: r.instagram_handle,
    facebookHandle: r.facebook_handle,
  };

export async function fetchContactInfo() {
  const { data, error } = await supabase
    .from("contact_info")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return dbToContact(data);
}

export async function updateContactInfo(fields) {
  const { error } = await supabase
    .from("contact_info")
    .update({
      address: fields.address,
      phone: fields.phone,
      phone_secondary: fields.phoneSecondary,
      email: fields.email,
      website: fields.website,
      hours: fields.hours,
      instagram: fields.instagram,
      facebook: fields.facebook,
      instagram_handle: fields.instagramHandle,
      facebook_handle: fields.facebookHandle,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw error;
}
