import Button from "../ui/Button";

export default function CTA() {
  return (
    <section className="relative bg-gradient-to-br from-navy to-navy-dark text-white text-center py-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-gold to-sky" />
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ailemize Katılın</h2>
        <p className="text-white/80 text-lg mb-9 max-w-xl mx-auto">
          Anadolu Emekliler Derneği'ne üye olarak tüm hizmet ve
          faaliyetlerimizden yararlanabilirsiniz.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button variant="gold" href="#iletisim">
            Üye Ol
          </Button>
          <Button variant="outline" href="#iletisim">
            Detaylı Bilgi Al
          </Button>
        </div>
      </div>
    </section>
  );
}
