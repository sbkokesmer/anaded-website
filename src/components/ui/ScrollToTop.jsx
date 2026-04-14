import { FaChevronUp } from "react-icons/fa";
import { useScrollPosition } from "../../hooks/useScrollDirection";

export default function ScrollToTop() {
  const { pastThreshold } = useScrollPosition();

  if (!pastThreshold) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-red/30 hover:bg-brand-red-dark hover:-translate-y-1 transition-all z-50 cursor-pointer"
      aria-label="Yukarı çık"
    >
      <FaChevronUp />
    </button>
  );
}
