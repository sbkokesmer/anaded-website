import { useEffect, useState, useCallback } from "react";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaCheck,
  FaSpinner,
  FaImages,
} from "react-icons/fa";
import Modal from "../ui/Modal";
import {
  fetchActivities,
  fetchMyActivityRegistrations,
  registerActivity,
  unregisterActivity,
} from "../../lib/api";

export default function EventsModal({ open, onClose }) {
  const [activities, setActivities] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [acts, regs] = await Promise.all([
        fetchActivities(),
        fetchMyActivityRegistrations(),
      ]);
      setActivities(acts);
      setMyRegs(regs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  const toggle = async (activity) => {
    const isRegistered = myRegs.includes(activity.id);
    setBusyId(activity.id);
    try {
      if (isRegistered) {
        await unregisterActivity(activity.id);
        setMyRegs((prev) => prev.filter((id) => id !== activity.id));
      } else {
        await registerActivity(activity.id);
        setMyRegs((prev) => [...prev, activity.id]);
      }
    } catch (err) {
      alert("İşlem başarısız: " + err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-1 flex items-center gap-2 pr-8">
          <FaCalendarCheck className="text-gold" />
          Faaliyet Kayıt
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Derneğimizin faaliyetlerine katılım için kayıt olabilirsiniz.
        </p>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-300">
            <FaSpinner className="animate-spin text-2xl" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FaCalendarCheck className="text-4xl mx-auto mb-3 text-gray-200" />
            <p className="text-sm">Şu an kayıt olunabilecek faaliyet yok.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {activities.map((activity) => {
              const registered = myRegs.includes(activity.id);
              const busy = busyId === activity.id;
              return (
                <div
                  key={activity.id}
                  className={`rounded-xl border p-4 transition ${
                    registered ? "border-green-200 bg-green-50/50" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-navy">{activity.title}</h3>
                      {activity.description && (
                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                      )}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-2">
                        {activity.date && (
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt /> {activity.date}
                          </span>
                        )}
                        {activity.activity_photos?.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <FaImages /> {activity.activity_photos.length} fotoğraf
                          </span>
                        )}
                      </div>
                    </div>
                    {activity.is_open !== false || registered ? (
                      <button
                        onClick={() => toggle(activity)}
                        disabled={busy || (activity.is_open === false && !registered)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex-shrink-0 disabled:opacity-60 ${
                          registered
                            ? "bg-green-600 text-white hover:bg-red-500"
                            : "bg-brand-red text-white hover:bg-brand-red-dark"
                        }`}
                      >
                        {busy ? (
                          <FaSpinner className="animate-spin" />
                        ) : registered ? (
                          <>
                            <FaCheck /> Katılacağım
                          </>
                        ) : (
                          "Kayıt Ol"
                        )}
                      </button>
                    ) : (
                      <span className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-400 flex-shrink-0">
                        Kayıt Kapalı
                      </span>
                    )}
                  </div>
                  {registered && (
                    <p className="text-[11px] text-green-600 mt-2">
                      ✓ Kaydınız alındı. Vazgeçmek için butona tekrar tıklayın.
                    </p>
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
