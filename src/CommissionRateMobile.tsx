import { useEffect, useRef, useState } from "react";
import BrandCard from "./BrandCard";
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

/** Adjust this shape to match your Supabase 'brands' select */
export type Brand = {
  id: string;
  logo_url: string;
  name: string;
  commission_tiers: { range: string; rate: string }[];
  commission_type: string;
  commission_tiers_label?: string;
  is_visible: boolean;
  group?: string;
  signup_url?: string; // if you store it
};

export default function CommissionRateMobile({
  brands,
}: {
  brands: Brand[];
  signupByInstance?: Record<string, string>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [maxScrollIndex, setMaxScrollIndex] = useState(0); 

  // --- Logic to calculate the maximum scrollable index ---
  const calculateMaxScroll = () => {
    const el = trackRef.current;
    if (!el || brands.length === 0) {
        setMaxScrollIndex(0);
        return;
    }

    // Get the width of a single slide (must wait for render)
    const slideEl = el.querySelector('.brand-slide');
    if (!slideEl) return;
    const slideWidth = slideEl.clientWidth;

    // Calculate how many slides fit in the track's visible area
    const visibleSlidesCount = Math.floor(el.clientWidth / slideWidth);

    // Max index is total items minus visible count
    const max = brands.length - visibleSlidesCount;
    
    // Ensure max is not negative
    setMaxScrollIndex(Math.max(0, max));

    // Adjust the active index if the window resizes
    setActive(i => Math.min(i, Math.max(0, max)));
  };

  useEffect(() => {
    // Recalculate max index on initial load, data change, and window resize
    calculateMaxScroll(); 
    window.addEventListener('resize', calculateMaxScroll);
    
    // Clean up listener
    return () => window.removeEventListener('resize', calculateMaxScroll);

  }, [brands, trackRef.current]); 


  // --- Carousel Scroll Handler ---
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slideEl = el.querySelector('.brand-slide');
    if (!slideEl) return;
    
    // Use the width of the first slide for calculation
    const cardWidth = slideEl.clientWidth; 
    
    // Calculate which slide group is currently active
    const i = Math.round(el.scrollLeft / cardWidth);
    
    // Update the active index, clamped to the calculated maximum
    setActive(Math.min(i, maxScrollIndex)); 
  };
  

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slideEl = el.querySelector('.brand-slide');
    if (!slideEl) return;
    
    const cardWidth = slideEl.clientWidth;
    
    const clamped = Math.max(0, Math.min(i, maxScrollIndex));
    el.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActive(clamped);
  };
  
  // --- Function to move the carousel one step left/right ---
  const moveCarousel = (direction: 'left' | 'right') => {
    let nextIndex = active;
    if (direction === 'left') {
      nextIndex = Math.max(0, active - 1);
    } else {
      nextIndex = Math.min(maxScrollIndex, active + 1);
    }
    goTo(nextIndex);
  };
  

  return (
    // NOTE: If you use this component inside BrandsSection, 
    // ensure that BrandsSection doesn't contain a separate grid structure
    <div className="max-w-6xl mx-auto relative">
      
      {/* Left Arrow (Visible only if scrollable and NOT at the start) */}
      {maxScrollIndex > 0 && active > 0 && (
        <button
          onClick={() => moveCarousel('left')}
          // Only visible on tablet/desktop (sm:flex)
          className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition"
          aria-label="Previous brand"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>
      )}

      {/* Carousel Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="
          relative
          flex overflow-x-auto
          snap-x snap-mandatory
          scroll-smooth
          [-webkit-overflow-scrolling:touch]
          no-scrollbar
          w-full
          // Ensure padding to prevent cards from touching screen edges
          px-4 
          mx-[-1rem]
        "
      >
        {brands.map((b) => (
            <div
              key={b.id}
              className="
                brand-slide // Reference class for JS
                snap-start shrink-0 
                // Define visibility: 1 on mobile, 2 on sm, 3 on lg (adjust based on your cards)
                w-full sm:w-1/2 lg:w-1/3 
                px-4 // Gutter between slides
            "
            >
              <div className="w-full bg-white rounded-2xl border shadow-md p-4 sm:p-6">
                <BrandCard
                  id={b.id}
                  logoUrl={b.logo_url}
                  name={b.name}
                  commissionTiers={b.commission_tiers}
                  commissionType={b.commission_type}
                  commission_tiers_label={b.commission_tiers_label}
                  isVisible={b.is_visible}
                  onSave={() => {}}
                  isPublicView={true}
                  group={b.group}
                  signupUrl={b.signup_url}
                />
              </div>
            </div>
        ))}
      </div>

      {/* Right Arrow (Visible only if scrollable and NOT at the end) */}
      {maxScrollIndex > 0 && active < maxScrollIndex && (
        <button
          onClick={() => moveCarousel('right')}
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition"
          aria-label="Next brand"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>
      )}

      {/* Dots */}
      {brands.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {Array.from({ length: maxScrollIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to brand group ${i + 1}`}
              className={`h-2.5 rounded-full transition
                ${i === active ? "bg-purple-700 w-6" : "bg-gray-300 w-2.5 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}