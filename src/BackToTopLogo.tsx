// BackToTopLogo.tsx
// Desktop: bottom-left NeatAffiliates logo (click -> scroll top)
// Mobile: floating circular up-arrow button on bottom-left

import { useEffect, useState } from "react";

type Props = {
  homeAnchorId?: string;
};

export default function BackToTopLogo({ homeAnchorId }: Props) {
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const el = homeAnchorId ? document.getElementById(homeAnchorId) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop / Tablet logo in bottom-left */}
      <div
        onClick={goTop}
        role="button"
        aria-label="Back to top"
        className="hidden md:flex fixed bottom-6 right-6 items-center justify-center cursor-pointer z-30"
      >
        <img
          src="/logo.png"
          alt="NeatAffiliates logo"
          className="w-32 opacity-30 grayscale hover:opacity-60 hover:grayscale-0 transition duration-300"
        />
      </div>

      {/* Mobile floating button (bottom-left circle) */}
      {showFab && (
        <button
          onClick={goTop}
          aria-label="Back to top"
          className="md:hidden fixed bottom-6 right-4 z-40 w-12 h-12 rounded-full bg-purple-700 text-white shadow-lg flex items-center justify-center active:scale-95 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
