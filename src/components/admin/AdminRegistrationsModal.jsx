import { useEffect, useState, useCallback } from "react";
import {
  FaCalendarCheck,
  FaSpinner,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
  FaBroom,
} from "react-icons/fa";
import Modal from "../ui/Modal";
import { fetchAllActivityRegistrations, fetchNotificationStates, setNotificationState } from "../../lib/api";

export default function AdminRegistrationsModal({ open, onClose, onCleared }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [all, states] = await Promise.all([
        fetchAllActivityRegistrations(),
        fetchNotificationStates(),
      ]);
      // Temizlenmiş (deleted) kayıtları çıkar
      setRegs(all.filter((r) => !states[`areg:${r.id}`]?.deleted));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const clearOne = async (r) => {
    setRegs((prev) => prev.filter((x) => x.id !== r.id));
    try {
      await setNotificationState(`areg:${r.id}`, { deleted: true, read: true });
      onCleared?.();
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    if (!confirm("Tüm kayıt bildirimleri temizlensin mi? (Üyelerin kaydı silinmez)")) return;
    const current = regs;
    setRegs([]);
    try {
      await Promise.all(
        current.map((r) =>
          setNotificationState(`areg:${r.id}`, { deleted: true, read: true }).catch(() => {})
        )
      );
      onCleared?.();
    } catch (err) {
      console.error(err);
    }
  };

  // Faaliyete göre grupla
  const groups = {};
  for (const r of regs) {
    if (!groups[r.activity_id]) groups[r.activity_id] = { title: r.activityTitle, members: [] };
    groups[r.activity_id].members.push(r);
  }
  const groupList = Object.entries(groups);

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3 mb-1 pr-8">
          <h2 className="text-xl font-bold text-navy flex items-center gap-2">
            <FaCalendarCheck className="text-gold" />
            Faaliyet Kayıtları
            {regs.length > 0 && (
              <span className="text-xs font-bold bg-brand-red text-white px-2 py-0.5 rounded-full">
                {regs.length}
              </span>
            )}
          </h2>
          {regs.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-red font-medium cursor-pointer"
            >
              <FaBroom /> Tümünü temizle
            </button>
          )}
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Üyelerin faaliyetlere katılım kayıtları. Temizlemek kaydı silmez, sadece bu listeden kaldırır.
        </p>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-300">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : groupList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaCalendarCheck className="text-4xl mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Yeni faaliyet kaydı yok.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {groupList.map(([id, g]) => {
              const isOpen = expanded === id;
              return (
                <div key={id} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpanded(isOpen ? null : id)}
                    className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition cursor-pointer"
                  >
                    <span className="font-bold text-navy">{g.title}</span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="bg-sky-light text-navy text-xs font-semibold px-2 py-0.5 rounded-full">
                        {g.members.length} kişi
                      </span>
                      {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 space-y-1.5 border-t border-gray-50">
                      {g.members.map((m) => (
                        <div key={m.id} className="flex items-center gap-2 text-sm text-gray-600 pt-2">
                          <FaUser className="text-gray-300 text-xs" />
                          {m.memberName}
                          <span className="text-xs text-gray-300 ml-auto">
                            {new Date(m.created_at).toLocaleDateString("tr-TR")}
                          </span>
                          <button
                            onClick={() => clearOne(m)}
                            className="p-1.5 text-gray-300 hover:text-brand-red transition cursor-pointer"
                            title="Bu kaydı listeden temizle"
                          >
                            <FaTrash className="text-[10px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
