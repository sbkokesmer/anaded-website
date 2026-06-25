import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaTrash,
  FaHandshake,
  FaSpinner,
  FaBuilding,
  FaArrowRight,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import SectionTitle from "../ui/SectionTitle";
import PartnerFormModal from "../partners/PartnerFormModal";
import { fetchPartners, deletePartner, swapSortOrder } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

/**
 * @param {number}  [limit]        - en fazla kaç kurum gösterilsin (anasayfa: 3)
 * @param {boolean} [showMore]     - "Daha Fazla Gör" butonu (Hakkımızda'ya gider)
 * @param {boolean} [allowReorder] - admin sıralama oklarını göster
 */
export default function Partners({ limit, showMore = false, allowReorder = false }) {
  const { isAdmin } = useAuth();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    try {
      setPartners(await fetchPartners());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (partner) => {
    if (!confirm(`"${partner.name}" kurumu silinsin mi?`)) return;
    try {
      await deletePartner(partner.id);
      await load();
    } catch (err) {
      alert("Silme başarısız: " + err.message);
    }
  };

  const move = async (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= partners.length) return;
    try {
      await swapSortOrder("partners", partners[i], partners[j]);
      await load();
    } catch (err) {
      alert("Sıralama değiştirilemedi: " + err.message);
    }
  };

  if (!loading && partners.length === 0 && !isAdmin) return null;

  const shown = limit ? partners.slice(0, limit) : partners;

  return (
    <section id="kurumlar" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <SectionTitle
          title="Anlaşmalı Kurumlar"
          subtitle="Üyelerimizin indirimli ve öncelikli hizmet alabildiği iş ortaklarımız."
        />

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-brand-red-dark transition cursor-pointer shadow-lg shadow-brand-red/20"
            >
              <FaPlus /> Anlaşmalı Kurum Ekle
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10 text-gray-300">
            <FaSpinner className="animate-spin text-3xl" />
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <FaHandshake className="text-5xl mx-auto mb-4 text-gray-200" />
            <p>Henüz anlaşmalı kurum eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((p, i) => (
              <div
                key={p.id}
                className="group relative bg-white rounded-2xl p-7 flex flex-col items-center justify-center gap-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[200px]"
              >
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    {allowReorder && (
                      <>
                        <button
                          onClick={() => move(i, -1)}
                          disabled={i === 0}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-navy hover:text-white transition cursor-pointer disabled:opacity-30"
                          title="Yukarı"
                        >
                          <FaChevronUp className="text-[10px]" />
                        </button>
                        <button
                          onClick={() => move(i, 1)}
                          disabled={i === shown.length - 1}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-navy hover:text-white transition cursor-pointer disabled:opacity-30"
                          title="Aşağı"
                        >
                          <FaChevronDown className="text-[10px]" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(p)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-brand-red hover:text-white transition cursor-pointer"
                      title="Sil"
                    >
                      <FaTrash className="text-[10px]" />
                    </button>
                  </div>
                )}
                {p.logo_url ? (
                  <img src={p.logo_url} alt={p.name} className="max-h-28 max-w-[80%] object-contain" />
                ) : (
                  <FaBuilding className="text-6xl text-navy/20" />
                )}
                <p className="text-navy text-base font-bold text-center leading-snug">{p.name}</p>
              </div>
            ))}
          </div>
        )}

        {showMore && partners.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link
              to="/hakkimizda#kurumlar"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white rounded-lg font-semibold text-sm hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30 transition-all duration-300"
            >
              Daha Fazla Gör
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        )}
      </div>

      <PartnerFormModal open={showForm} onClose={() => setShowForm(false)} onCreated={load} />
    </section>
  );
}
