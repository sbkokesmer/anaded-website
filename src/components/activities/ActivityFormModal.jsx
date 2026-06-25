import { useState } from "react";
import { FaSpinner, FaImage, FaPlusCircle } from "react-icons/fa";
import Modal from "../ui/Modal";
import { uploadFile } from "../../lib/supabase";
import { createActivity, addActivityPhotos } from "../../lib/api";

export default function ActivityFormModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // {file, preview}
  const [coverIdx, setCoverIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setFiles([]);
    setCoverIdx(0);
    setError("");
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const onPickFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    const mapped = picked.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    if (coverIdx === i) setCoverIdx(0);
    else if (coverIdx > i) setCoverIdx((c) => c - 1);
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
      // 1) Fotoğrafları yükle
      const urls = [];
      for (const { file } of files) {
        const url = await uploadFile("activity-photos", file);
        urls.push(url);
      }
      // 2) Faaliyeti oluştur (kapak = seçilen fotoğraf)
      const cover_url = urls.length ? urls[coverIdx] || urls[0] : null;
      const activity = await createActivity({
        title: title.trim(),
        date: date.trim(),
        description: description.trim(),
        cover_url,
      });
      // 3) Galeri fotoğraflarını bağla
      if (urls.length) await addActivityPhotos(activity.id, urls);

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
          <FaPlusCircle className="text-brand-red" />
          Yeni Faaliyet Ekle
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Faaliyet bilgilerini gir ve fotoğraflarını yükle.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Başlık *">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn. Antalya Kültür Gezisi"
              className="form-input"
            />
          </Field>

          <Field label="Tarih">
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Örn. 15 Mart 2026"
              className="form-input"
            />
          </Field>

          <Field label="Açıklama">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Faaliyet hakkında kısa açıklama..."
              className="form-input resize-none"
            />
          </Field>

          {/* Fotoğraflar */}
          <Field label="Fotoğraflar">
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 text-gray-400 hover:border-sky hover:text-sky transition cursor-pointer">
              <FaImage />
              <span className="text-sm font-medium">Fotoğraf seç (birden fazla olabilir)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onPickFiles}
              />
            </label>

            {files.length > 0 && (
              <>
                <p className="text-xs text-gray-400 mt-3 mb-2">
                  Kutucukta görünecek <strong>kapak</strong> fotoğrafını seçmek için üzerine tıkla:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="relative group">
                      <button
                        type="button"
                        onClick={() => setCoverIdx(i)}
                        className={`block w-full aspect-square rounded-lg overflow-hidden border-2 transition ${
                          coverIdx === i ? "border-gold ring-2 ring-gold/30" : "border-transparent"
                        }`}
                      >
                        <img src={f.preview} alt="" className="w-full h-full object-cover" />
                      </button>
                      {coverIdx === i && (
                        <span className="absolute top-1 left-1 bg-gold text-navy-dark text-[9px] font-bold px-1.5 py-0.5 rounded">
                          KAPAK
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-brand-red text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Field>

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
              {saving ? "Kaydediliyor..." : "Faaliyeti Ekle"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-navy font-medium text-sm mb-1.5">{label}</label>
      {children}
    </div>
  );
}
