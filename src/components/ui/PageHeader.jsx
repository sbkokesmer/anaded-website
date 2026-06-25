import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

/**
 * Sayfa üst başlık bandı (Faaliyetler/Duyurular sayfalarıyla aynı stil).
 */
export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
  backTo = "/",
  backLabel = "Ana Sayfaya Dön",
}) {
  return (
    <div className="bg-gradient-to-br from-navy via-navy-dark to-[#0a1535] text-white py-16 relative overflow-hidden">
      <div className="absolute -top-1/3 -right-1/5 w-[500px] h-[500px] bg-sky/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition"
        >
          <FaArrowLeft className="text-xs" />
          {backLabel}
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gold/20 rounded-2xl flex items-center justify-center">
            <Icon className="text-gold text-xl" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
            {subtitle && <p className="text-white/60 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
