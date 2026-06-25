import { useState } from "react";
import { FaSpinner, FaBullhorn } from "react-icons/fa";
import Modal from "../ui/Modal";
import { createAnnouncement } from "../../lib/api";

const CATEGORY_OPTIONS = [
  "Genel Kurul",
  "Gezi",
  "Sağlık",
  "Bilgilendirme",
  "Aidat",
  "Eğitim",
  "Etkinlik",
  "Diğer",
];

export default function AnnouncementFormModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Bilgilendirme");
  const [pinned, setPinned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setTitle("");
    setSummary("");
    setContent("");
    setDate("");
    setCategory("Bilgilendirme");
    setPinned(false);
    setError("");
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await createAnnouncement({
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim() || summary.trim(),
        date: date.trim(),
        category,
        pinned,
      });
      reset();
      await onCreated();
      onClose();
    } catch (err) {
      setError("Kaydedilemedi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={close} maxWidth="max-w-xl">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-1 flex items-center gap-2">
          <FaBullhorn className="text-gold" />
          Yeni Duyuru Ekle
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Üyelere gösterilecek duyuru bilgilerini gir.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Başlık *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Duyuru başlığı"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-navy font-medium text-sm mb-1.5">Tarih</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Örn. 22 Mart 2026"
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-navy font-medium text-sm mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Özet</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Kısa özet (listede görünür)"
              className="form-input resize-none"
            />
          </div>

          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Detay İçerik</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Duyurunun tam metni ('Devamını Oku' ile açılır). Boş bırakılırsa özet kullanılır."
              className="form-input resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="accent-gold w-4 h-4"
            />
            Bu duyuruyu en üste sabitle (📌)
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              disabled={saving}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-200 transition cursor-pointer disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-brand-red text-white rounded-lg font-semibold text-sm hover:bg-brand-red-dark transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving && <FaSpinner className="animate-spin" />}
              {saving ? "Kaydediliyor..." : "Duyuruyu Ekle"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
