import { useEffect, useMemo, useRef, useState } from "react";

export type WhyJoinItem = {
  id: string;
  title: string;
  description: string;
  emoji_url?: string; 
};

export default function WhyJoinMobileCarousel({
  items,
  className = "",
}: {
  items: WhyJoinItem[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Keep index in range if items change
  const max = Math.max(0, items.length - 1);
  useEffect(() => setIndex((i) => Math.min(i, max)), [max]);

  // Scroll handler -> update active dot
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndex(i);
  };

  // Snap to slide
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, max));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  // Prevent layout shift by fixing slide min-width to viewport of the track
  const slideStyle = useMemo<React.CSSProperties>(() => ({}), []);

  return (
    <div className={className}>
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="
          relative
          flex
          overflow-x-auto
          snap-x snap-mandatory
          scroll-smooth
          [-webkit-overflow-scrolling:touch]
          no-scrollbar
        "
        // make each child the width of the track
        style={{ scrollBehavior: "smooth" }}
      >
        {items.map((it) => (
          <div
            key={it.id}
            className="
              shrink-0
              snap-start
              w-full
              px-4
            "
            style={slideStyle}
          >
            <article className="bg-white rounded-2xl shadow p-6 text-center border">
              {it.emoji_url && (
                <img
                  src={it.emoji_url}
                  alt={it.title}
                  className="w-16 h-16 object-contain mx-auto mb-3"
                />
              )}
              <h4 className="text-lg font-semibold mb-2">{it.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{it.description}</p>
            </article>
          </div>
        ))}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`
                h-2.5 w-2.5 rounded-full transition
                ${i === index ? "bg-purple-700 w-6" : "bg-gray-300 hover:bg-gray-400"}
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Optional: Hide the horizontal scrollbar in mobile (Tailwind plugin not required) */
declare global {
  // nothing; just to prevent TS isolatedModules warning if needed
}
