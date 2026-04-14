import { SERVICES } from "../../constants/data";
import SectionTitle from "../ui/SectionTitle";

const iconBg = {
  sky: "bg-sky-light text-navy",
  red: "bg-red-100 text-brand-red",
  gold: "bg-gold-light text-navy-dark",
};

export default function Services() {
  return (
    <section id="hizmetler" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <SectionTitle
          title="Hizmetlerimiz"
          subtitle="Emeklilerimize sunduğumuz kapsamlı hizmetlerimiz ile yanlarındayız."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:-translate-y-2 hover:shadow-xl hover:shadow-navy/8 hover:border-sky transition-all duration-300"
            >
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl mb-5 ${iconBg[service.color]}`}
              >
                <service.Icon />
              </div>
              <h3 className="text-lg font-bold text-navy mb-3">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
