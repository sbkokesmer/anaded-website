import { useEffect, useState, useCallback } from "react";
import {
  FaCalendarCheck,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { fetchEvents, createEvent, deleteEvent } from "../../lib/api";

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    capacity: "",
    description: "",
  });

  const load = useCallback(async () => {
    try {
      setEvents(await fetchEvents());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await createEvent({
        title: form.title.trim(),
        date: form.date.trim(),
        location: form.location.trim(),
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
        description: form.description.trim(),
        is_open: true,
      });
      setForm({ title: "", date: "", location: "", capacity: "", description: "" });
      setShowForm(false);
      await load();
    } catch (err) {
      alert("Eklenemedi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (event) => {
    if (!confirm(`"${event.title}" etkinliği silinsin mi?`)) return;
    try {
      await deleteEvent(event.id);
      await load();
    } catch (err) {
      alert("Silinemedi: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <FaCalendarCheck className="text-gold" />
          Etkinlikler
        </h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition cursor-pointer"
        >
          <FaPlus /> Yeni Etkinlik
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-gray-50 rounded-xl p-4 mb-5 space-y-3">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Etkinlik başlığı *"
            className="form-input bg-white"
          />
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              placeholder="Tarih (örn. 20 Nisan)"
              className="form-input bg-white"
            />
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Yer"
              className="form-input bg-white"
            />
            <input
              value={form.capacity}
              onChange={(e) => set("capacity", e.target.value)}
              placeholder="Kontenjan"
              type="number"
              className="form-input bg-white"
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Açıklama"
            rows={2}
            className="form-input bg-white resize-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <FaSpinner className="animate-spin" />}
            {saving ? "Kaydediliyor..." : "Etkinlik Ekle"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-8 text-gray-300">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">Henüz etkinlik yok.</p>
      ) : (
        <div className="space-y-2">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl p-3.5"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-navy text-sm">{ev.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-1">
                  {ev.date && <span>{ev.date}</span>}
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt /> {ev.location}
                    </span>
                  )}
                  {ev.capacity && (
                    <span className="flex items-center gap-1">
                      <FaUsers /> {ev.capacity}
                    </span>
                  )}
                  <span className={ev.is_open ? "text-green-600" : "text-gray-400"}>
                    {ev.is_open ? "Kayıt açık" : "Kapalı"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => remove(ev)}
                className="p-2 text-gray-300 hover:text-brand-red transition cursor-pointer"
                title="Sil"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
