import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTimes,
  FaExpand,
} from "react-icons/fa";
import {
  fetchAllProfiles,
  fetchAllDuesForYear,
  setDuesPayment,
} from "../../lib/api";

const MONTHS = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

export default function DuesManager({ fullPage = false }) {
  const [profiles, setProfiles] = useState([]);
  const [duesMap, setDuesMap] = useState({}); // "userId-month" -> true
  const [year, setYear] = useState(2026);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async (yr) => {
    setLoading(true);
    try {
      const [profs, dues] = await Promise.all([
        fetchAllProfiles(),
        fetchAllDuesForYear(yr),
      ]);
      setProfiles(profs);
      const map = {};
      for (const d of dues) if (d.paid) map[`${d.user_id}-${d.month}`] = true;
      setDuesMap(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(year);
  }, [year, load]);

  const toggle = async (userId, month) => {
    const key = `${userId}-${month}`;
    const newPaid = !duesMap[key];
    setBusy(key);
    // iyimser güncelle
    setDuesMap((m) => ({ ...m, [key]: newPaid }));
    try {
      await setDuesPayment(userId, year, month, newPaid);
    } catch (err) {
      setDuesMap((m) => ({ ...m, [key]: !newPaid })); // geri al
      alert("Güncellenemedi: " + err.message);
    } finally {
      setBusy(null);
    }
  };

  const q = search.toLowerCase().trim();
  const filtered = q
    ? profiles.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.member_id || "").toLowerCase().includes(q)
      )
    : profiles;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <h2 className="text-lg font-bold text-navy flex items-center gap-2">
          <FaCreditCard className="text-brand-red" />
          Aidat Takibi
        </h2>
        <div className="flex items-center gap-2">
          {!fullPage && (
            <Link
              to="/aidat-takibi"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-navy text-white rounded-lg text-xs font-semibold hover:bg-navy-light transition"
              title="Tam sayfa görüntüle"
            >
              <FaExpand className="text-[10px]" /> Tam Sayfa
            </Link>
          )}
          <button
            onClick={() => setYear((y) => y - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            <FaChevronLeft className="text-xs" />
          </button>
          <span className="font-bold text-navy w-14 text-center">{year}</span>
          <button
            onClick={() => setYear((y) => y + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
          >
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* İsim arama */}
      <div className="relative mb-4">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Üye adı veya üye no ile ara..."
          className="w-full pl-10 pr-9 py-2.5 border-2 border-gray-100 rounded-lg text-sm focus:border-sky focus:outline-none transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <FaTimes className="text-sm" />
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-4">
        Bir ayın kutucuğuna tıklayarak ödendi (yeşil) / ödenmedi (boş) olarak işaretleyebilirsin.
      </p>

      {loading ? (
        <div className="flex justify-center py-10 text-gray-300">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">
          {profiles.length === 0 ? "Üye bulunamadı." : "Aramayla eşleşen üye yok."}
        </p>
      ) : (
        <div className={`overflow-x-auto ${fullPage ? "" : "max-h-[440px] overflow-y-auto"}`}>
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr>
                <th className="text-left py-2 px-2 text-gray-400 font-medium sticky left-0 bg-white">
                  Üye
                </th>
                {MONTHS.map((m, i) => (
                  <th key={i} className="py-2 px-1 text-gray-400 font-medium text-xs text-center w-9 bg-white">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-50">
                  <td className="py-2 px-2 sticky left-0 bg-white">
                    <p className="font-medium text-navy whitespace-nowrap">
                      {p.name || "(isimsiz)"}
                    </p>
                    <p className="text-[11px] text-gray-400">{p.member_id}</p>
                  </td>
                  {MONTHS.map((_, i) => {
                    const month = i + 1;
                    const key = `${p.id}-${month}`;
                    const paid = !!duesMap[key];
                    return (
                      <td key={i} className="py-1.5 px-1 text-center">
                        <button
                          onClick={() => toggle(p.id, month)}
                          disabled={busy === key}
                          className={`w-7 h-7 rounded-md border-2 transition cursor-pointer ${
                            paid
                              ? "bg-green-500 border-green-500 text-white"
                              : "bg-white border-gray-200 hover:border-gray-300"
                          }`}
                          title={paid ? "Ödendi" : "Ödenmedi"}
                        >
                          {paid ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
