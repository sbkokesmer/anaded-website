import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaBullhorn,
  FaThumbtack,
  FaCalendarAlt,
  FaTag,
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaPlus,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";
import {
  fetchAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
  swapSortOrder,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AnnouncementFormModal from "../components/announcements/AnnouncementFormModal";

const categoryColors = {
  "Genel Kurul": "bg-navy/10 text-navy",
  Gezi: "bg-sky-light text-navy",
  "Sağlık": "bg-green-50 text-green-700",
  Bilgilendirme: "bg-gold-light text-yellow-800",
  Aidat: "bg-red-50 text-brand-red",
  "Eğitim": "bg-purple-50 text-purple-700",
  Etkinlik: "bg-orange-50 text-orange-700",
};

export default function Announcements() {
  const { isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (item) => {
    if (!confirm(`"${item.title}" duyurusu silinsin mi?`)) return;
    try {
      await deleteAnnouncement(item.id);
      await load();
    } catch (err) {
      alert("Silme başarısız: " + err.message);
    }
  };

  const togglePin = async (item) => {
    try {
      await updateAnnouncement(item.id, { pinned: !item.pinned });
      await load();
    } catch (err) {
      alert("Güncellenemedi: " + err.message);
    }
  };

  const move = async (list, i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    try {
      await swapSortOrder("announcements", list[i], list[j]);
      await load();
    } catch (err) {
      alert("Sıralama değiştirilemedi: " + err.message);
    }
  };

  const categories = [
    "Tümü",
    ...new Set(announcements.map((a) => a.category).filter(Boolean)),
  ];

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.summary || "").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "Tümü" || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const pinned = filtered.filter((a) => a.pinned);
  const regular = filtered.filter((a) => !a.pinned);

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy via-navy-dark to-[#0a1535] text-white py-16 relative overflow-hidden">
        <div className="absolute -top-1/3 -right-1/5 w-[500px] h-[500px] bg-sky/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition"
          >
            <FaArrowLeft className="text-xs" />
            Ana Sayfaya Dön
          </Link>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center">
                <FaBullhorn className="text-gold text-xl" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">Duyurular</h1>
                <p className="text-white/60 text-sm mt-1">
                  Derneğimizin güncel duyuruları ve haberleri
                </p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition cursor-pointer shadow-lg shadow-brand-red/20"
              >
                <FaPlus /> Yeni Duyuru Ekle
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-300">
            <FaSpinner className="animate-spin text-3xl" />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Duyurularda ara..."
                    className="w-full pl-11 pr-10 py-3 border-2 border-gray-100 rounded-xl text-sm focus:border-sky focus:outline-none transition"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                        activeCategory === cat
                          ? "bg-navy text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              {filtered.length} duyuru bulundu
            </p>

            {/* Pinned */}
            {pinned.length > 0 && (
              <div className="mb-8 space-y-4">
                {pinned.map((item, i) => (
                  <AnnouncementCard
                    key={item.id}
                    item={item}
                    expanded={expandedId === item.id}
                    onToggle={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    pinned
                    isAdmin={isAdmin}
                    onDelete={handleDelete}
                    onTogglePin={() => togglePin(item)}
                    onMove={(dir) => move(pinned, i, dir)}
                    canMoveUp={i > 0}
                    canMoveDown={i < pinned.length - 1}
                  />
                ))}
              </div>
            )}

            {/* Regular */}
            <div className="space-y-4">
              {regular.map((item, i) => (
                <AnnouncementCard
                  key={item.id}
                  item={item}
                  expanded={expandedId === item.id}
                  onToggle={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  onTogglePin={() => togglePin(item)}
                  onMove={(dir) => move(regular, i, dir)}
                  canMoveUp={i > 0}
                  canMoveDown={i < regular.length - 1}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <FaBullhorn className="text-5xl text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  Duyuru bulunamadı
                </h3>
                <p className="text-gray-400 text-sm">
                  {announcements.length === 0
                    ? "Henüz duyuru eklenmemiş."
                    : "Arama kriterlerinizi değiştirmeyi deneyin."}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <AnnouncementFormModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreated={load}
      />
    </div>
  );
}

function AnnouncementCard({
  item,
  expanded,
  onToggle,
  pinned = false,
  isAdmin,
  onDelete,
  onTogglePin,
  onMove,
  canMoveUp,
  canMoveDown,
}) {
  const colorClass =
    categoryColors[item.category] || "bg-gray-100 text-gray-600";

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-300 ${
        pinned
          ? "border-gold/40 shadow-md shadow-gold/10"
          : "border-gray-100 shadow-sm hover:shadow-md"
      }`}
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
          {onMove && (
            <>
              <button
                onClick={() => onMove(-1)}
                disabled={!canMoveUp}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-navy hover:text-white transition cursor-pointer disabled:opacity-30"
                title="Yukarı"
              >
                <FaChevronUp className="text-xs" />
              </button>
              <button
                onClick={() => onMove(1)}
                disabled={!canMoveDown}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-navy hover:text-white transition cursor-pointer disabled:opacity-30"
                title="Aşağı"
              >
                <FaChevronDown className="text-xs" />
              </button>
            </>
          )}
          <button
            onClick={() => onTogglePin(item)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition cursor-pointer ${
              item.pinned
                ? "bg-gold/20 text-gold hover:bg-gold hover:text-white"
                : "bg-gray-50 text-gray-400 hover:bg-gold hover:text-white"
            }`}
            title={item.pinned ? "Sabitten kaldır" : "Sabitle"}
          >
            <FaThumbtack className="text-xs" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-brand-red hover:text-white transition cursor-pointer"
            title="Duyuruyu sil"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      )}
      <button onClick={onToggle} className="w-full text-left p-6 cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex-shrink-0">
            {pinned ? (
              <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center">
                <FaThumbtack className="text-gold text-sm" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <FaBullhorn className="text-gray-400 text-sm" />
              </div>
            )}
          </div>

          <div className={`flex-1 min-w-0 ${isAdmin ? "pr-32" : "pr-8"}`}>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {pinned && (
                <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                  Sabitlenmiş
                </span>
              )}
              {item.category && (
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}
                >
                  <FaTag className="inline text-[10px] mr-1" />
                  {item.category}
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-navy mb-1.5 leading-snug">
              {item.title}
            </h3>
            {item.summary && (
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.summary}
              </p>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <FaCalendarAlt />
                {item.date}
              </span>
              {item.content && item.content !== item.summary && (
                <span className="flex items-center gap-1 text-xs text-brand-red font-medium">
                  {expanded ? "Kapat" : "Devamını Oku"}
                  {expanded ? (
                    <FaChevronUp className="text-[10px]" />
                  ) : (
                    <FaChevronDown className="text-[10px]" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </button>

      {expanded && item.content && (
        <div className="px-6 pb-6 pt-0">
          <div className="ml-14 border-t border-gray-100 pt-5">
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {item.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
