import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import SectionTitle from "../ui/SectionTitle";
import ActivitiesView from "../activities/ActivitiesView";

export default function Activities() {
  return (
    <section id="faaliyetler" className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        <SectionTitle
          title="Son Faaliyetler"
          subtitle="Derneğimizin düzenlediği etkinlikler ve gerçekleştirdiği faaliyetler."
        />

        {/* Anasayfada sadece son 3 faaliyet gösterilir */}
        <ActivitiesView limit={3} />

        {/* Daha fazlası → ayrı faaliyetler sayfası */}
        <div className="flex justify-center mt-12">
          <Link
            to="/faaliyetler"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-navy text-white rounded-lg font-semibold text-sm hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/30 transition-all duration-300"
          >
            Daha Fazlasını Gör
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}
