import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaInstagram,
  FaFacebookF,
  FaEdit,
} from "react-icons/fa";
import SectionTitle from "../ui/SectionTitle";
import Button from "../ui/Button";
import { useContact } from "../../context/ContactContext";
import { useAuth } from "../../context/AuthContext";
import { createApplication } from "../../lib/api";
import { sanitizePhoneInput, isValidTurkishPhone } from "../../lib/validators";
import ContactFormModal from "../contact/ContactFormModal";

const EMPTY_FORM = { name: "", email: "", phone: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const { contact, refresh } = useContact();
  const { isAdmin } = useAuth();

  const contactItems = [
    { icon: FaMapMarkerAlt, label: "Adres", value: contact.address },
    {
      icon: FaPhone,
      label: "Telefon",
      value: [contact.phone, contact.phoneSecondary].filter(Boolean).join(" / "),
    },
    { icon: FaEnvelope, label: "E-posta", value: contact.email },
    { icon: FaClock, label: "Çalışma Saatleri", value: contact.hours },
  ];

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const phoneInvalid = form.phone.trim() !== "" && !isValidTurkishPhone(form.phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneInvalid) {
      setError("Lütfen geçerli bir telefon numarası girin (örn. 0532 123 45 67).");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await createApplication(form);
      setSubmitted(true);
      setForm(EMPTY_FORM);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="iletisim" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <SectionTitle
          title="İletişim"
          subtitle="Bizimle iletişime geçmekten çekinmeyin, her zaman yanınızdayız."
        />

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowEdit(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-lg text-sm font-semibold hover:bg-navy-light transition cursor-pointer"
            >
              <FaEdit /> İletişim Bilgilerini Düzenle
            </button>
          </div>
        )}
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
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-sky-light text-navy flex items-center justify-center hover:bg-sky hover:text-white transition"
              >
                <FaInstagram />
              </a>
              <a
                href={contact.facebook}
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
            <h3 className="text-xl font-bold text-navy mb-1">
              Başvuru İçin Doldurunuz
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Üyelik başvurunuzu iletin, en kısa sürede sizinle iletişime geçelim.
            </p>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-5">
                ✓ Başvurunuz alındı! Dernek yönetimi en kısa sürede değerlendirecektir.
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-brand-red text-sm px-4 py-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {[
              { id: "name", label: "Ad Soyad", type: "text", placeholder: "Adınız ve soyadınız", required: true },
              { id: "email", label: "E-posta", type: "email", placeholder: "E-posta adresiniz", required: true },
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
                  value={form[field.id]}
                  onChange={(e) =>
                    set(
                      field.id,
                      field.id === "phone"
                        ? sanitizePhoneInput(e.target.value)
                        : e.target.value
                    )
                  }
                  placeholder={field.placeholder}
                  required={field.required}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-sm focus:outline-none transition ${
                    field.id === "phone" && phoneInvalid
                      ? "border-red-300 focus:border-brand-red"
                      : "border-gray-100 focus:border-sky"
                  }`}
                />
                {field.id === "phone" && phoneInvalid && (
                  <p className="text-xs text-brand-red mt-1">
                    Geçerli bir telefon numarası girin (örn. 0532 123 45 67).
                  </p>
                )}
              </div>
            ))}
            <div className="mb-5">
              <label
                htmlFor="message"
                className="block mb-1.5 text-navy font-medium text-sm"
              >
                Mesajınız / Notunuz
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Eklemek istedikleriniz..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg text-sm focus:border-sky focus:outline-none transition resize-y"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </form>
        </div>
      </div>

      <ContactFormModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        current={contact}
        onSaved={refresh}
      />
    </section>
  );
}
