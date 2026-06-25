import { Link } from "react-router-dom";
import { FaCalendarCheck, FaArrowLeft } from "react-icons/fa";
import ActivitiesView from "../components/activities/ActivitiesView";

export default function Activities() {
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center">
              <FaCalendarCheck className="text-gold text-xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Faaliyetlerimiz</h1>
              <p className="text-white/60 text-sm mt-1">
                Derneğimizin düzenlediği tüm etkinlik ve faaliyetler
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-12">
        <ActivitiesView />
      </div>
    </div>
  );
}
