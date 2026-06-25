import { FaInfoCircle } from "react-icons/fa";
import PageHeader from "../components/ui/PageHeader";
import About from "../components/sections/About";
import Partners from "../components/sections/Partners";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      <PageHeader
        icon={FaInfoCircle}
        title="Hakkımızda"
        subtitle="Anadolu Emekliler Derneği'ni daha yakından tanıyın"
      />
      <About />
      {/* Tüm anlaşmalı kurumlar (admin sıralayabilir) */}
      <Partners allowReorder />
    </div>
  );
}
