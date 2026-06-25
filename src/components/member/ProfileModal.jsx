import { useState, useEffect } from "react";
import { FaSpinner, FaUserEdit, FaCamera, FaLock, FaExclamationTriangle } from "react-icons/fa";
import Modal from "../ui/Modal";
import { uploadFile } from "../../lib/supabase";
import {
  updateMyProfile,
  updatePassword,
  updateAuthName,
  createDeletionRequest,
  fetchMyDeletionRequest,
} from "../../lib/api";
import { sanitizePhoneInput, isValidTurkishPhone } from "../../lib/validators";

export default function ProfileModal({ open, onClose, profile, email, onSaved }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [delRequest, setDelRequest] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setName(profile?.name || "");
      setPhone(profile?.phone || "");
      setAvatarPreview(profile?.avatar_url || "");
      setAvatarFile(null);
      setPassword("");
      setPassword2("");
      setError("");
      setSuccess(false);
      fetchMyDeletionRequest()
        .then(setDelRequest)
        .catch(() => setDelRequest(null));
    }
  }, [open, profile]);

  const requestDeletion = async () => {
    if (
      !confirm(
        "Hesabınızı silmek istediğinize emin misiniz?\n\nTalebiniz dernek yönetimine iletilecek. Onaylanırsa hesabınız kalıcı olarak silinecektir."
      )
    )
      return;
    setDelLoading(true);
    try {
      await createDeletionRequest();
      setDelRequest(await fetchMyDeletionRequest());
    } catch (err) {
      alert("Talep gönderilemedi: " + err.message);
    } finally {
      setDelLoading(false);
    }
  };

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.trim() && !isValidTurkishPhone(phone)) {
      setError("Geçerli bir telefon numarası girin (örn. 0532 123 45 67).");
      return;
    }
    if (password && password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }
    if (password && password !== password2) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let avatar_url = profile?.avatar_url || null;
      if (avatarFile) avatar_url = await uploadFile("avatars", avatarFile);

      await updateMyProfile({ name: name.trim(), phone: phone.trim(), avatar_url });
      await updateAuthName(name.trim());
      if (password) await updatePassword(password);

      setSuccess(true);
      await onSaved();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError("Kaydedilemedi: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={saving ? () => {} : onClose} maxWidth="max-w-lg">
      <div className="p-6 sm:p-8">
        <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2 pr-8">
          <FaUserEdit className="text-sky" />
          Profili Düzenle
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5 rounded-lg mb-4">
            ✓ Profiliniz güncellendi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-sky-light flex items-center justify-center text-3xl font-bold text-navy">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  (name || "?").charAt(0).toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-navy-light transition">
                <FaCamera className="text-xs" />
                <input type="file" accept="image/*" className="hidden" onChange={onPickAvatar} />
              </label>
            </div>
            <p className="text-xs text-gray-400">Profil fotoğrafı eklemek için kameraya tıkla</p>
          </div>

          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Ad Soyad</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="form-input" />
          </div>

          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">Telefon</label>
            <input
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              placeholder="0532 123 45 67"
              className="form-input"
            />
          </div>

          <div>
            <label className="block text-navy font-medium text-sm mb-1.5">E-posta</label>
            <input value={email || ""} disabled className="form-input bg-gray-50 text-gray-400" />
            <p className="text-[11px] text-gray-400 mt-1">
              E-posta değişikliği için dernek ile iletişime geçin.
            </p>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <p className="text-navy font-semibold text-sm mb-3 flex items-center gap-2">
              <FaLock className="text-gray-400" /> Şifre Değiştir (isteğe bağlı)
            </p>
            <div className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Yeni şifre"
                className="form-input"
              />
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Yeni şifre (tekrar)"
                className="form-input"
              />
            </div>
          </div>

          {/* Tehlikeli bölge: hesap silme */}
          <div className="pt-3 border-t border-gray-100">
            <p className="text-brand-red font-semibold text-sm mb-2 flex items-center gap-2">
              <FaExclamationTriangle /> Hesabı Sil
            </p>
            {delRequest?.status === "pending" ? (
              <div className="bg-gold-light text-yellow-800 text-sm px-4 py-3 rounded-lg">
                Hesap silme talebiniz <strong>yönetim onayında</strong>. Sonuç e-posta ile bildirilecektir.
              </div>
            ) : delRequest?.status === "rejected" ? (
              <div className="bg-red-50 text-brand-red text-sm px-4 py-3 rounded-lg">
                Önceki talebiniz reddedildi{delRequest.reason ? `: ${delRequest.reason}` : "."}{" "}
                <button
                  type="button"
                  onClick={requestDeletion}
                  className="underline font-semibold cursor-pointer"
                >
                  Tekrar talep et
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs text-gray-500">
                  Hesabınızı silmek isterseniz talebiniz yönetime iletilir.
                </p>
                <button
                  type="button"
                  onClick={requestDeletion}
                  disabled={delLoading}
                  className="px-4 py-2 bg-red-50 text-brand-red rounded-lg text-sm font-semibold hover:bg-brand-red hover:text-white transition cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {delLoading && <FaSpinner className="animate-spin" />}
                  Hesabımı Sil
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
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
