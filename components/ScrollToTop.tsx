"use client";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomSpacing, setBottomSpacing] = useState(24); // Marge initiale en px

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Ajuster la position du bouton si le footer devient visible
        if (footerTop < windowHeight) {
          setBottomSpacing(windowHeight - footerTop + 24);
        } else {
          setBottomSpacing(24);
        }
      }

      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 p-2 bg-primary text-white rounded-full shadow-md transition-all ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ bottom: `${bottomSpacing}px` }} // Position dynamique en fonction du footer
    >
      <ArrowUp size={20} />
    </button>
  );
}
