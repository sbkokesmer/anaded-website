export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-navy mb-3">{title}</h2>
      {subtitle && (
        <p className="text-gray-500 text-lg max-w-xl mx-auto">{subtitle}</p>
      )}
      <div className="w-16 h-1 bg-gradient-to-r from-brand-red to-gold mx-auto mt-4 rounded-full" />
    </div>
  );
}
