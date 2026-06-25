import { FaConciergeBell } from "react-icons/fa";
import PageHeader from "../components/ui/PageHeader";
import Services from "../components/sections/Services";

export default function ServicesPage() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      <PageHeader
        icon={FaConciergeBell}
        title="Hizmetlerimiz"
        subtitle="Üyelerimize sunduğumuz hizmetler"
      />
      <Services />
    </div>
  );
}
