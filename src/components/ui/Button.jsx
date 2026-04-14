const variants = {
  primary:
    "bg-brand-red text-white hover:bg-brand-red-dark hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5",
  outline:
    "bg-transparent text-white border-2 border-white/40 hover:bg-white/10 hover:border-white",
  gold: "bg-gold text-navy-dark font-bold hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5",
};

export default function Button({ variant = "primary", href, children, className = "", ...props }) {
  const base =
    "inline-block px-8 py-3.5 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer text-center";
  const cls = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
