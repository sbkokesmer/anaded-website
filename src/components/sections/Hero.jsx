import Button from "../ui/Button";

export default function Hero() {
  return (
    <section
      id="anasayfa"
      className="relative bg-gradient-to-br from-navy via-navy-dark to-[#0a1535] text-white py-24 md:py-32 overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute -top-1/3 -right-1/5 w-[600px] h-[600px] bg-sky/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-1/4 -left-1/10 w-[400px] h-[400px] bg-gold/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Emeklilerimize <span className="text-gold">Değer</span> Katıyoruz
          </h1>
          <p className="text-lg text-white/85 mb-9 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Anadolu Emekliler Derneği olarak 2021 yılından bu yana emeklilerimizin
            sosyal, kültürel ve ekonomik haklarını korumak, yaşam kalitelerini
            artırmak için çalışıyoruz.
          </p>
          <div className="flex gap-4 justify-center md:justify-start flex-wrap">
            <Button href="#iletisim">Bize Ulaşın</Button>
            <Button variant="outline" href="#hakkimizda">
              Daha Fazla Bilgi
            </Button>
          </div>
        </div>
        <div className="flex-shrink-0">
          <img
            src="/assets/logo.jpeg"
            alt="ANADED Logo"
            className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover border-4 border-white/20 shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
