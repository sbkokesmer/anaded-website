import { useState, useEffect } from "react";
import { FaSpinner, FaEdit } from "react-icons/fa";
import Modal from "../ui/Modal";
import { updateContactInfo } from "../../lib/api";

const FIELDS = [
  { key: "address", label: "Adres", type: "textarea" },
  { key: "phone", label: "Telefon (1)" },
  { key: "phoneSecondary", label: "Telefon (2)" },
  { key: "email", label: "E-posta" },
  { key: "website", label: "Web Sitesi" },
  { key: "hours", label: "Çalışma Saatleri" },
  { key: "instagram", label: "Instagram Linki" },
  { key: "instagramHandle", label: "Instagram Kullanıcı Adı" },
  { key: "facebook", label: "Facebook Linki" },
  { key: "facebookHandle", label: "Facebook Kullanıcı Adı" },
];

export default function ContactFormModal({ open, onClose, current, onSaved }) {
  const [form, setForm] = useState(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Modal her açıldığında güncel değerlerle doldur
  useEffect(() => {
    if (open) {
      setForm(current);
      setError("");
    }
  }, [open, current]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateContactInfo(form);
      await onSaved();
      onClose();
    } catch (err) {
      setError("Kaydedilemedi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={saving ? () => {} : onClose} maxWidth="max-w-xl">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-1 flex items-center gap-2">
          <FaEdit className="text-sky" />
          İletişim Bilgilerini Düzenle
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Sitedeki tüm iletişim bilgileri buradan güncellenir.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-navy font-medium text-sm mb-1.5">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={form?.[field.key] || ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  rows={2}
                  className="form-input resize-none"
                />
              ) : (
                <input
                  value={form?.[field.key] || ""}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="form-input"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
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
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
