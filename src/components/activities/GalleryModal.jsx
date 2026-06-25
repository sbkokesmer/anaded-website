import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaImages,
  FaPlus,
  FaTrash,
  FaStar,
  FaRegStar,
  FaSpinner,
  FaCalendarAlt,
} from "react-icons/fa";
import Modal from "../ui/Modal";
import { uploadFile } from "../../lib/supabase";
import {
  addActivityPhotos,
  deleteActivityPhoto,
  updateActivity,
} from "../../lib/api";

export default function GalleryModal({ activity, open, onClose, isAdmin, onChange }) {
  const [index, setIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!activity) return null;

  const photos = activity.activity_photos || [];
  const current = photos[index];

  const go = (dir) => {
    setIndex((i) => (i + dir + photos.length) % photos.length);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // aynı dosyayı tekrar seçebilmek için
    if (!files.length) return;

    setUploading(true);
    setError("");
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadFile("activity-photos", file);
        urls.push(url);
      }
      await addActivityPhotos(activity.id, urls);
      // İlk fotoğrafsa otomatik kapak yap
      if (!activity.cover_url && urls.length) {
        await updateActivity(activity.id, { cover_url: urls[0] });
      }
      await onChange();
    } catch (err) {
      setError("Yükleme başarısız: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo) => {
    if (!confirm("Bu fotoğraf silinsin mi?")) return;
    try {
      await deleteActivityPhoto(photo.id);
      // Silinen fotoğraf kapaksa kapağı temizle
      if (activity.cover_url === photo.url) {
        await updateActivity(activity.id, { cover_url: null });
      }
      setIndex(0);
      await onChange();
    } catch (err) {
      setError("Silme başarısız: " + err.message);
    }
  };

  const handleSetCover = async (photo) => {
    try {
      await updateActivity(activity.id, { cover_url: photo.url });
      await onChange();
    } catch (err) {
      setError("Kapak ayarlanamadı: " + err.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="p-6 sm:p-8">
        {/* Başlık */}
        <div className="mb-5 pr-10">
          {activity.date && (
            <p className="text-brand-red text-xs font-semibold mb-1 flex items-center gap-1.5">
              <FaCalendarAlt className="text-[10px]" />
              {activity.date}
            </p>
          )}
          <h2 className="text-2xl font-bold text-navy">{activity.title}</h2>
          {activity.description && (
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              {activity.description}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-2.5 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Ana görüntü */}
        {photos.length > 0 ? (
          <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
            <img
              src={current?.url}
              alt={activity.title}
              className="w-full h-full object-contain"
            />
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => go(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition cursor-pointer"
                >
                  <FaChevronRight />
                </button>
                <span className="absolute bottom-3 right-3 bg-black/55 text-white text-xs px-2.5 py-1 rounded-full">
                  {index + 1} / {photos.length}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center text-gray-400">
            <img
              src="/assets/logo.jpeg"
              alt="ANADED"
              className="w-20 h-20 rounded-full object-cover mb-3 opacity-90"
            />
            <p className="text-sm">Henüz fotoğraf eklenmemiş.</p>
          </div>
        )}

        {/* Küçük resimler */}
        {photos.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
            {photos.map((p, i) => {
              const isCover = activity.cover_url === p.url;
              return (
                <div key={p.id} className="relative flex-shrink-0 group">
                  <button
                    onClick={() => setIndex(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                      i === index ? "border-sky" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  </button>
                  {isCover && (
                    <span className="absolute top-1 left-1 text-gold text-xs drop-shadow" title="Kapak fotoğrafı">
                      <FaStar />
                    </span>
                  )}
                  {isAdmin && (
                    <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      {!isCover && (
                        <button
                          onClick={() => handleSetCover(p)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow text-gold hover:bg-gold hover:text-white transition cursor-pointer"
                          title="Kapak yap"
                        >
                          <FaRegStar className="text-[10px]" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-white shadow text-brand-red hover:bg-brand-red hover:text-white transition cursor-pointer"
                        title="Sil"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Admin: fotoğraf ekle */}
        {isAdmin && (
          <div className="mt-5 pt-5 border-t border-gray-100">
            <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-light text-navy rounded-lg text-sm font-semibold hover:bg-sky/30 transition cursor-pointer">
              {uploading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPlus />
              )}
              {uploading ? "Yükleniyor..." : "Fotoğraf Ekle"}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploading}
                onChange={handleUpload}
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">
              Birden fazla fotoğraf seçebilirsin. ⭐ ile bir fotoğrafı kutucukta görünecek kapak yapabilirsin.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
