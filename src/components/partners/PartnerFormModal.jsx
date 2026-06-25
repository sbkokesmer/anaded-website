import { useState } from "react";
import { FaSpinner, FaHandshake, FaImage } from "react-icons/fa";
import Modal from "../ui/Modal";
import { uploadFile } from "../../lib/supabase";
import { createPartner } from "../../lib/api";

export default function PartnerFormModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setFile(null);
    setPreview("");
    setError("");
  };

  const close = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const onPick = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Kurum adı zorunludur.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let logo_url = null;
      if (file) logo_url = await uploadFile("partner-logos", file);
      await createPartner({ name: name.trim(), logo_url });
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
    <Modal open={open} onClose={close} maxWidth="max-w-md">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-1 flex items-center gap-2">
          <FaHandshake className="text-sky" />
          Anlaşmalı Kurum Ekle
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Kurumun adını yaz ve logosunu yükle.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Kurum Adı *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn. Özel Adana Hastanesi"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Logo</label>
            <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-6 text-gray-400 hover:border-sky hover:text-sky transition cursor-pointer">
              {preview ? (
                <img src={preview} alt="" className="h-20 object-contain" />
              ) : (
                <>
                  <FaImage className="text-2xl" />
                  <span className="text-sm font-medium">Logo seç</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={onPick} />
            </label>
          </div>

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
              {saving ? "Kaydediliyor..." : "Kurumu Ekle"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
