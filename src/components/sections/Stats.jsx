import { STATS } from "../../constants/data";

export default function Stats() {
  return (
    <div className="max-w-7xl mx-auto px-5 -mt-10 relative z-10">
      <div className="bg-white rounded-2xl shadow-xl shadow-navy/10 p-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-navy">
                {stat.value}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
