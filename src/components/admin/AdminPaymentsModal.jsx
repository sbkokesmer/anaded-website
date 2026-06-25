import { useEffect, useState, useCallback } from "react";
import { FaCreditCard, FaSpinner, FaUser, FaTrash, FaBroom } from "react-icons/fa";
import Modal from "../ui/Modal";
import { fetchPayments, fetchNotificationStates, setNotificationState } from "../../lib/api";

export default function AdminPaymentsModal({ open, onClose, onCleared }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, states] = await Promise.all([
        fetchPayments(),
        fetchNotificationStates(),
      ]);
      setPayments(all.filter((p) => !states[`payment:${p.id}`]?.deleted));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const clearOne = async (p) => {
    setPayments((prev) => prev.filter((x) => x.id !== p.id));
    try {
      await setNotificationState(`payment:${p.id}`, { deleted: true, read: true });
      onCleared?.();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    if (!confirm("Tüm ödeme bildirimleri temizlensin mi?")) return;
    const current = payments;
    setPayments([]);
    try {
      await Promise.all(
        current.map((p) =>
          setNotificationState(`payment:${p.id}`, { deleted: true, read: true }).catch(() => {})
        )
      );
      onCleared?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-1 pr-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <FaCreditCard className="text-brand-red" />
            Yeni Ödemeler
            {payments.length > 0 && (
              <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
                {payments.length}
              </span>
            )}
          </h2>
          {payments.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-red font-medium cursor-pointer"
            >
              <FaBroom /> Tümünü temizle
            </button>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Üyelerin yaptığı aidat ödemeleri burada görünür.
        </p>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-300">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaCreditCard className="text-4xl mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Yeni ödeme bildirimi yok.</p>
            <p className="text-xs text-gray-300 mt-1">
              (PayTR entegrasyonu sonrası ödemeler otomatik buraya düşecek.)
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-navy text-sm">{p.member_name || "Üye"}</p>
                  <p className="text-xs text-gray-400">
                    {p.amount ? `${p.amount} ₺ · ` : ""}
                    {new Date(p.created_at).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <button
                  onClick={() => clearOne(p)}
                  className="p-2 text-gray-300 hover:text-brand-red transition cursor-pointer"
                  title="Temizle"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
