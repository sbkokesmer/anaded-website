import { FaCheck } from "react-icons/fa";
import { ABOUT_FEATURES } from "../../constants/data";

export default function About() {
  return (
    <section id="hakkimizda" className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="bg-gradient-to-br from-sky-light to-gold-light rounded-2xl p-10 flex items-center justify-center min-h-[350px]">
              <img
                src="/assets/logo.jpeg"
                alt="ANADED"
                className="w-52 h-52 rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-navy text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-navy/30">
              <span className="text-gold">5</span> Yıllık Tecrübe
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-5">
              Anadolu Emekliler Derneği Hakkında
            </h2>
            <p className="text-gray-500 mb-4 leading-relaxed">
              ANADED, 2021 yılında emeklilerin haklarını savunmak, sosyal
              dayanışmayı güçlendirmek ve emeklilerin yaşam standartlarını
              yükseltmek amacıyla kurulmuştur.
            </p>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Derneğimiz, Türkiye genelinde emeklilere yönelik sosyal, kültürel
              ve sağlık alanlarında çeşitli faaliyetler düzenlemekte; üyelerimizin
              refahını artırmaya yönelik projeler geliştirmektedir.
            </p>
            <ul className="space-y-3">
              {ABOUT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-700">
                  <span className="w-7 h-7 bg-sky-light text-navy rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-xs" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
