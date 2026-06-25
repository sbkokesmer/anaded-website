import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Sayfa (route) değişince en üste döner.
 * URL'de hash (#bolum) varsa o bölüme kaydırır.
 */
export default function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        // bölüm DOM'a girmiş olsun diye küçük gecikme
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
