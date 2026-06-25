import {
  FaImages,
  FaTrash,
  FaCalendarAlt,
  FaChevronUp,
  FaChevronDown,
  FaLockOpen,
  FaLock,
  FaCheck,
  FaSpinner,
} from "react-icons/fa";

/**
 * Faaliyet kutucuğu. Kapak fotoğrafı varsa onu, yoksa degrade bir placeholder gösterir.
 * Tıklanınca galeri açılır. Admin ise yönetim kontrolleri görünür.
 */
export default function ActivityCard({
  activity,
  onOpen,
  isAdmin,
  onDelete,
  onMove,
  canMoveUp,
  canMoveDown,
  onToggleOpen,
  isMember,
  registered,
  registering,
  onRegister,
}) {
  const photoCount = activity.activity_photos?.length || 0;
  const isOpen = activity.is_open !== false;

  const stop = (e, fn) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      onClick={() => onOpen(activity)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md shadow-navy/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Kapak */}
      <div className="relative h-48 overflow-hidden">
        {activity.cover_url ? (
          <img
            src={activity.cover_url}
            alt={activity.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-light to-sky/30">
            <img
              src="/assets/logo.jpeg"
              alt="ANADED"
              className="w-20 h-20 rounded-full object-cover shadow-md opacity-90"
            />
          </div>
        )}

        {photoCount > 0 && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/55 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            <FaImages className="text-[10px]" />
            {photoCount}
          </span>
        )}

        {/* Admin kontrolleri */}
        {isAdmin && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {onMove && (
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={(e) => stop(e, () => onMove(-1))}
                  disabled={!canMoveUp}
                  className="w-7 h-6 flex items-center justify-center rounded bg-white/90 text-navy hover:bg-navy hover:text-white transition cursor-pointer disabled:opacity-30"
                  title="Yukarı taşı"
                >
                  <FaChevronUp className="text-[10px]" />
                </button>
                <button
                  onClick={(e) => stop(e, () => onMove(1))}
                  disabled={!canMoveDown}
                  className="w-7 h-6 flex items-center justify-center rounded bg-white/90 text-navy hover:bg-navy hover:text-white transition cursor-pointer disabled:opacity-30"
                  title="Aşağı taşı"
                >
                  <FaChevronDown className="text-[10px]" />
                </button>
              </div>
            )}
            <button
              onClick={(e) => stop(e, () => onDelete(activity))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-brand-red hover:bg-brand-red hover:text-white transition cursor-pointer"
              title="Faaliyeti sil"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        )}

        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors flex items-end p-4 opacity-0 group-hover:opacity-100 pointer-events-none">
          <span className="text-white text-sm font-medium flex items-center gap-2">
            <FaImages /> Fotoğrafları Gör
          </span>
        </div>
      </div>

      {/* İçerik */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2">
          {activity.date && (
            <p className="text-brand-red text-xs font-semibold flex items-center gap-1.5">
              <FaCalendarAlt className="text-[10px]" />
              {activity.date}
            </p>
          )}
          {/* Kayıt durumu — admin tıklayınca aç/kapa */}
          {isAdmin && onToggleOpen ? (
            <button
              onClick={(e) => stop(e, () => onToggleOpen())}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full transition cursor-pointer ${
                isOpen
                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              title={isOpen ? "Kaydı kapat" : "Kaydı aç"}
            >
              {isOpen ? <FaLockOpen className="text-[9px]" /> : <FaLock className="text-[9px]" />}
              {isOpen ? "Kayıt Açık" : "Kayıt Kapalı"}
            </button>
          ) : (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                isOpen ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {isOpen ? "Kayıt Açık" : "Kayıt Kapalı"}
            </span>
          )}
        </div>
        <h3 className="text-navy font-bold mb-2">{activity.title}</h3>
        {activity.description && (
          <p className="text-gray-500 text-sm line-clamp-3">{activity.description}</p>
        )}

        {/* Üye: kaydı açık faaliyetlere kayıt ol */}
        {isMember && (isOpen || registered) && (
          <button
            onClick={(e) => stop(e, () => onRegister())}
            disabled={registering}
            className={`mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 ${
              registered
                ? "bg-green-600 text-white hover:bg-red-500"
                : "bg-brand-red text-white hover:bg-brand-red-dark"
            }`}
            title={registered ? "Vazgeçmek için tıkla" : "Bu faaliyete kayıt ol"}
          >
            {registering ? (
              <FaSpinner className="animate-spin" />
            ) : registered ? (
              <>
                <FaCheck /> Katılacağım
              </>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
