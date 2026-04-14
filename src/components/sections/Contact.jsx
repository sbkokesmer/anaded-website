import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { CONTACT_INFO } from "../../constants/data";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";

const contactItems = [
  { icon: FaMapMarkerAlt, label: "Adres", value: CONTACT_INFO.address },
  {
    icon: FaPhone,
    label: "Telefon",
    value: `${CONTACT_INFO.phone} / ${CONTACT_INFO.phoneSecondary}`,
  },
  { icon: FaEnvelope, label: "E-posta", value: CONTACT_INFO.email },
  { icon: FaClock, label: "Çalışma Saatleri", value: CONTACT_INFO.hours },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="iletisim" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <SectionTitle
          title="İletişim"
          subtitle="Bizimle iletişime geçmekten çekinmeyin, her zaman yanınızdayız."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h3 className="text-2xl font-bold text-navy mb-5">Bize Ulaşın</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Sorularınız, önerileriniz veya üyelik başvurunuz için aşağıdaki
              kanallardan bize ulaşabilirsiniz.
            </p>
            <div className="space-y-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-sky-light rounded-xl flex items-center justify-center text-navy flex-shrink-0">
                    <item.icon />
                  </div>
                  <div>
                    <strong className="block text-navy text-sm">
                      {item.label}
                    </strong>
                    <span className="text-gray-500 text-sm">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-sky-light text-navy flex items-center justify-center hover:bg-sky hover:text-white transition"
              >
                <FaInstagram />
              </a>
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl bg-sky-light text-navy flex items-center justify-center hover:bg-sky hover:text-white transition"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-sm"
          >
            {[
              { id: "name", label: "Ad Soyad", type: "text", placeholder: "Adınız ve soyadınız" },
              { id: "email", label: "E-posta", type: "email", placeholder: "E-posta adresiniz" },
              { id: "phone", label: "Telefon", type: "tel", placeholder: "Telefon numaranız", required: false },
            ].map((field) => (
              <div key={field.id} className="mb-4">
                <label
                  htmlFor={field.id}
                  className="block mb-1.5 text-navy font-medium text-sm"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  placeholder={field.placeholder}
                  required={field.required !== false}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg text-sm focus:border-sky focus:outline-none transition"
                />
              </div>
            ))}
            <div className="mb-5">
              <label
                htmlFor="message"
                className="block mb-1.5 text-navy font-medium text-sm"
              >
                Mesajınız
              </label>
              <textarea
                id="message"
                placeholder="Mesajınızı yazın..."
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg text-sm focus:border-sky focus:outline-none transition resize-y"
              />
            </div>
            <Button type="submit" className="w-full">
              {submitted ? "Mesajınız Gönderildi!" : "Mesaj Gönder"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
