import { useState, useEffect } from "react";

export function useScrollPosition(threshold = 400) {
  const [scrolled, setScrolled] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      setPastThreshold(window.scrollY > threshold);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrolled, pastThreshold };
}
