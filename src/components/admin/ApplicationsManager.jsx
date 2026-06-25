import { useEffect, useState, useCallback } from "react";
import {
  FaUserPlus,
  FaCheck,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaEnvelope,
  FaPhone,
  FaRegClock,
} from "react-icons/fa";
import {
  fetchApplications,
  updateApplicationStatus,
  deleteApplication,
  approveApplication,
  rejectApplication,
} from "../../lib/api";

const REJECT_REASONS = [
  "Kontenjanımız dolmuştur.",
  "Üyelik kriterlerini sağlamadığınız tespit edilmiştir.",
  "Başvuru bilgileriniz eksik veya hatalıdır.",
  "Diğer",
];

const STATUS = {
  pending: { label: "Bekliyor", cls: "bg-gold-light text-yellow-800" },
  approved: { label: "Onaylandı", cls: "bg-green-50 text-green-700" },
  rejected: { label: "Reddedildi", cls: "bg-red-50 text-brand-red" },
};

export default function ApplicationsManager() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [rejecting, setRejecting] = useState(null); // app id
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const load = useCallback(async () => {
    try {
      setApps(await fetchApplications());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id, status) => {
    setBusyId(id);
    try {
      await updateApplicationStatus(id, status);
      await load();
    } catch (err) {
      alert("İşlem başarısız: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const approve = async (app) => {
    if (
      !confirm(
        `"${app.name}" onaylanacak.\n\nSistem ${app.email} için bir üye hesabı oluşturup giriş bilgilerini e-posta ile gönderecek. Onaylıyor musun?`
      )
    )
      return;
    setBusyId(app.id);
    try {
      const result = await approveApplication(app.id);
      await load();
      if (result.warning) alert("Onaylandı ancak: " + result.warning);
      else alert(`✓ ${app.name} onaylandı ve giriş bilgileri ${app.email} adresine gönderildi.`);
    } catch (err) {
      alert("Onaylama başarısız: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const submitReject = async (app) => {
    const finalReason = reason === "Diğer" ? customReason.trim() : reason;
    if (!finalReason) {
      alert("Lütfen bir neden girin.");
      return;
    }
    setBusyId(app.id);
    try {
      await rejectApplication(app.id, finalReason);
      alert(`Başvuru reddedildi ve ${app.email} bilgilendirildi.`);
      setRejecting(null);
      setCustomReason("");
      setReason(REJECT_REASONS[0]);
      await load();
    } catch (err) {
      alert("İşlem başarısız: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (app) => {
    if (!confirm(`"${app.name}" başvurusu kalıcı olarak silinsin mi?`)) return;
    setBusyId(app.id);
    try {
      await deleteApplication(app.id);
      await load();
    } catch (err) {
      alert("Silme başarısız: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = apps.filter((a) => a.status === "pending").length;
  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <FaUserPlus className="text-brand-red" />
          Üyelik Başvuruları
          {pendingCount > 0 && (
            <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
              {pendingCount} yeni
            </span>
          )}
        </h2>
        <div className="flex gap-1.5">
          {[
            { k: "pending", l: "Bekleyen" },
            { k: "approved", l: "Onaylı" },
            { k: "rejected", l: "Reddedilen" },
            { k: "all", l: "Tümü" },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                filter === f.k
                  ? "bg-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-300">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-10">
          {filter === "pending"
            ? "Bekleyen başvuru yok."
            : "Bu kategoride başvuru yok."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const st = STATUS[app.status] || STATUS.pending;
            const busy = busyId === app.id;
            return (
              <div
                key={app.id}
                className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-navy">{app.name}</h3>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                      {app.email && (
                        <span className="flex items-center gap-1.5">
                          <FaEnvelope className="text-gray-300" /> {app.email}
                        </span>
                      )}
                      {app.phone && (
                        <span className="flex items-center gap-1.5">
                          <FaPhone className="text-gray-300" /> {app.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <FaRegClock className="text-gray-300" />
                        {new Date(app.created_at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {app.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                        {app.message}
                      </p>
                    )}
                  </div>

                  {/* Aksiyonlar */}
                  <div className="flex items-center gap-2">
                    {busy ? (
                      <FaSpinner className="animate-spin text-gray-300" />
                    ) : (
                      <>
                        {app.status !== "approved" && (
                          <button
                            onClick={() => approve(app)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition cursor-pointer"
                            title="Onayla ve giriş bilgilerini e-posta ile gönder"
                          >
                            <FaCheck /> Onayla
                          </button>
                        )}
                        {app.status !== "rejected" && (
                          <button
                            onClick={() => {
                              setRejecting(app.id);
                              setReason(REJECT_REASONS[0]);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-brand-red rounded-lg text-xs font-semibold hover:bg-red-50 transition cursor-pointer"
                            title="Reddet"
                          >
                            <FaTimes /> Reddet
                          </button>
                        )}
                        <button
                          onClick={() => remove(app)}
                          className="p-2 text-gray-300 hover:text-brand-red transition cursor-pointer"
                          title="Sil"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Reddet — neden seçimi */}
                {rejecting === app.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs font-semibold text-navy">
                      Red nedeni seçin (kullanıcıya e-posta ile bildirilecek):
                    </p>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="form-input"
                    >
                      {REJECT_REASONS.map((rr) => (
                        <option key={rr} value={rr}>{rr}</option>
                      ))}
                    </select>
                    {reason === "Diğer" && (
                      <input
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        placeholder="Nedeni yazın..."
                        className="form-input"
                      />
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => submitReject(app)}
                        disabled={busy}
                        className="flex-1 py-2 bg-brand-red text-white rounded-lg text-xs font-semibold hover:bg-brand-red-dark transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {busy && <FaSpinner className="animate-spin" />}
                        Reddet ve Bilgilendir
                      </button>
                      <button
                        onClick={() => setRejecting(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition cursor-pointer"
                      >
                        Vazgeç
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
