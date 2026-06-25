import { FaEnvelope } from "react-icons/fa";
import PageHeader from "../components/ui/PageHeader";
import Contact from "../components/sections/Contact";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      <PageHeader
        icon={FaEnvelope}
        title="İletişim"
        subtitle="Bizimle iletişime geçin"
      />
      <Contact />
    </div>
  );
}
