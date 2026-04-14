import { ACTIVITIES } from "../../constants/data";
import SectionTitle from "../ui/SectionTitle";

export default function Activities() {
  return (
    <section id="faaliyetler" className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        <SectionTitle
          title="Son Faaliyetler"
          subtitle="Derneğimizin düzenlediği etkinlikler ve gerçekleştirdiği faaliyetler."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {ACTIVITIES.map((activity) => (
            <div
              key={activity.title}
              className="bg-white rounded-2xl overflow-hidden shadow-md shadow-navy/5 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy/10 transition-all duration-300"
            >
              <div
                className={`h-48 flex items-center justify-center text-5xl bg-gradient-to-br ${activity.bg}`}
              >
                {activity.emoji}
              </div>
              <div className="p-6">
                <p className="text-brand-red text-xs font-semibold mb-2">
                  {activity.date}
                </p>
                <h3 className="text-navy font-bold mb-2">{activity.title}</h3>
                <p className="text-gray-500 text-sm">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
