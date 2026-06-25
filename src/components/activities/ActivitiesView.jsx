import { useEffect, useState, useCallback } from "react";
import { FaPlus, FaSpinner, FaImages } from "react-icons/fa";
import ActivityCard from "./ActivityCard";
import GalleryModal from "./GalleryModal";
import ActivityFormModal from "./ActivityFormModal";
import {
  fetchActivities,
  deleteActivity,
  updateActivity,
  swapSortOrder,
  fetchMyActivityRegistrations,
  registerActivity,
  unregisterActivity,
} from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

/**
 * Faaliyet listesini + galeri + admin ekleme mantığını barındıran ortak bileşen.
 * @param {number}  [limit]      - en fazla kaç faaliyet gösterilsin (anasayfa için 3)
 * @param {boolean} [showAdd]    - admin "Yeni Faaliyet" butonu görünsün mü
 */
export default function ActivitiesView({ limit, showAdd = true }) {
  const { isAdmin, user } = useAuth();
  const isMember = !!user && !isAdmin;
  const [activities, setActivities] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [busyReg, setBusyReg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchActivities();
      setActivities(data);
      setSelected((sel) =>
        sel ? data.find((a) => a.id === sel.id) || null : null
      );
      if (isMember) {
        setMyRegs(await fetchMyActivityRegistrations());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isMember]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (activity) => {
    if (!confirm(`"${activity.title}" faaliyeti silinsin mi?`)) return;
    try {
      await deleteActivity(activity.id);
      await load();
    } catch (err) {
      alert("Silme başarısız: " + err.message);
    }
  };

  const shown = limit ? activities.slice(0, limit) : activities;

  const move = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= shown.length) return;
    try {
      await swapSortOrder("activities", shown[i], shown[j]);
      await load();
    } catch (err) {
      alert("Sıralama değiştirilemedi: " + err.message);
    }
  };

  const handleRegister = async (activity) => {
    const registered = myRegs.includes(activity.id);
    setBusyReg(activity.id);
    try {
      if (registered) {
        await unregisterActivity(activity.id);
        setMyRegs((prev) => prev.filter((id) => id !== activity.id));
      } else {
        await registerActivity(activity.id);
        setMyRegs((prev) => [...prev, activity.id]);
      }
    } catch (err) {
      alert("İşlem başarısız: " + err.message);
    } finally {
      setBusyReg(null);
    }
  };

  const toggleOpen = async (activity) => {
    try {
      await updateActivity(activity.id, { is_open: !activity.is_open });
      await load();
    } catch (err) {
      alert("Güncellenemedi: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-gray-300">
        <FaSpinner className="animate-spin text-3xl" />
      </div>
    );
  }

  return (
    <>
      {/* Admin: Yeni faaliyet ekle */}
      {isAdmin && showAdd && (
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition cursor-pointer shadow-lg shadow-brand-red/20"
          >
            <FaPlus /> Yeni Faaliyet Ekle
          </button>
        </div>
      )}

      {error && (
        <p className="text-center text-brand-red text-sm mb-6">
          Hata: {error}
        </p>
      )}

      {shown.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FaImages className="text-5xl mx-auto mb-4 text-gray-200" />
          <p>Henüz faaliyet eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {shown.map((activity, i) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onOpen={setSelected}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onMove={(dir) => move(i, dir)}
              canMoveUp={i > 0}
              canMoveDown={i < shown.length - 1}
              onToggleOpen={() => toggleOpen(activity)}
              isMember={isMember}
              registered={myRegs.includes(activity.id)}
              registering={busyReg === activity.id}
              onRegister={() => handleRegister(activity)}
            />
          ))}
        </div>
      )}

      <GalleryModal
        activity={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        isAdmin={isAdmin}
        onChange={load}
      />

      <ActivityFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreated={load}
      />
    </>
  );
}
