import { useEffect, useState, useCallback } from "react";
import {
  FaUserSlash,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaEnvelope,
  FaRegClock,
} from "react-icons/fa";
import {
  fetchDeletionRequests,
  approveDeletion,
  rejectDeletion,
} from "../../lib/api";

const REJECT_REASONS = [
  "Ödenmemiş aidat borcunuz bulunmaktadır.",
  "Konuyla ilgili sizinle iletişime geçeceğiz.",
  "Eksik bilgi nedeniyle işleme alınamadı.",
  "Diğer",
];

export default function DeletionRequestsManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [rejecting, setRejecting] = useState(null); // request id
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [customReason, setCustomReason] = useState("");

  const load = useCallback(async () => {
    try {
      setRequests(await fetchDeletionRequests());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (r) => {
    if (
      !confirm(
        `"${r.name || r.email}" hesabı KALICI olarak silinecek ve bilgilendirme e-postası gönderilecek. Emin misin?`
      )
    )
      return;
    setBusyId(r.id);
    try {
      await approveDeletion(r.id);
      alert("Hesap silindi ve kullanıcı bilgilendirildi.");
      await load();
    } catch (err) {
      alert("Silme başarısız: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  const submitReject = async (r) => {
    const finalReason = reason === "Diğer" ? customReason.trim() : reason;
    if (!finalReason) {
      alert("Lütfen bir neden girin.");
      return;
    }
    setBusyId(r.id);
    try {
      await rejectDeletion(r.id, finalReason);
      alert("Talep reddedildi ve kullanıcı bilgilendirildi.");
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

  const pending = requests.filter((r) => r.status === "pending");

  if (!loading && pending.length === 0) return null; // bekleyen yoksa gösterme

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-5">
        <FaUserSlash className="text-brand-red" />
        Hesap Silme Talepleri
        {pending.length > 0 && (
          <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
            {pending.length}
          </span>
        )}
      </h2>

      {loading ? (
        <div className="flex justify-center py-8 text-gray-300">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((r) => {
            const busy = busyId === r.id;
            return (
              <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="font-bold text-navy">{r.name || "(isimsiz)"}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      {r.email && (
                        <span className="flex items-center gap-1.5">
                          <FaEnvelope className="text-gray-300" /> {r.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <FaRegClock className="text-gray-300" />
                        {new Date(r.created_at).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                  </div>
                  {!rejecting && (
                    <div className="flex items-center gap-2">
                      {busy ? (
                        <FaSpinner className="animate-spin text-gray-300" />
                      ) : (
                        <>
                          <button
                            onClick={() => approve(r)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-brand-red text-white rounded-lg text-xs font-semibold hover:bg-brand-red-dark transition cursor-pointer"
                          >
                            <FaCheck /> Onayla (Sil)
                          </button>
                          <button
                            onClick={() => {
                              setRejecting(r.id);
                              setReason(REJECT_REASONS[0]);
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200 transition cursor-pointer"
                          >
                            <FaTimes /> Reddet
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Reddet — neden seçimi */}
                {rejecting === r.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs font-semibold text-navy">Red nedeni seçin:</p>
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
                        onClick={() => submitReject(r)}
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
