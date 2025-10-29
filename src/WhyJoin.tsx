import { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import LoginSignupModal from './LoginSignupModal';
// Import icons for navigation arrows
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

interface WhyJoinItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  emoji_url: string;
}

export default function WhyJoin() {
  const [items, setItems] = useState<WhyJoinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

  // Carousel state/refs
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [maxScrollIndex, setMaxScrollIndex] = useState(0); // Max index for navigation

  useEffect(() => {
    const fetchWhyJoinItems = async () => {
      const { data, error } = await supabase
        .from('why_join')
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error loading Why Join cards:', error.message);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchWhyJoinItems();
  }, []);

  // --- Logic to calculate the maximum scrollable index ---
  const calculateMaxScroll = () => {
    const el = trackRef.current;
    if (!el || items.length === 0) {
        setMaxScrollIndex(0);
        return;
    }

    // Must wait for the slide to be rendered to get its width
    const slideEl = el.querySelector('.why-join-slide');
    if (!slideEl) return;
    const slideWidth = slideEl.clientWidth;

    // Calculate how many slides fit in the track's visible area
    const visibleSlidesCount = Math.floor(el.clientWidth / slideWidth);

    // Max index is total items minus visible count
    const max = items.length - visibleSlidesCount;
    
    // Ensure max is not negative
    setMaxScrollIndex(Math.max(0, max));

    // Adjust the active index if the window resizes
    setActive(i => Math.min(i, Math.max(0, max)));
  };

  useEffect(() => {
    // Run once after initial load and whenever data changes/window resizes
    calculateMaxScroll(); 
    window.addEventListener('resize', calculateMaxScroll);
    
    // Clean up listener
    return () => window.removeEventListener('resize', calculateMaxScroll);

  }, [items, trackRef.current]); 
  
  if (loading) {
    return <p className="text-center text-gray-500">Loading Why Join section...</p>;
  }

  // --- Carousel Scroll Handler ---
  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slideEl = el.querySelector('.why-join-slide');
    if (!slideEl) return;
    
    const cardWidth = slideEl.clientWidth; 
    const i = Math.round(el.scrollLeft / cardWidth);
    
    setActive(Math.min(i, maxScrollIndex)); 
  };
  
  // --- Snap to a specific index (used by dots and arrows) ---
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slideEl = el.querySelector('.why-join-slide');
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
  // -----------------------------------------------------


  return (
    <section id="WhyJoin" className="py-16 bg-white rounded-2xl border">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Why Join Neat Affiliates?
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Top reasons why affiliates love working with us
        </p>

        {/* --- UNIVERSAL CAROUSEL STRUCTURE --- */}
        <div className="relative max-w-6xl mx-auto">
          
          {/* Left Arrow (Visible only if scrollable and NOT at the start) */}
          {maxScrollIndex > 0 && active > 0 && (
            <button
              onClick={() => moveCarousel('left')}
              // Only visible on tablet/desktop (sm:flex)
              className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6 text-purple-600" />
            </button>
          )}

          {/* Carousel Track */}
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="
              relative
              flex
              overflow-x-auto
              snap-x snap-mandatory
              scroll-smooth
              [-webkit-overflow-scrolling:touch]
              no-scrollbar
              w-full 
              px-4
              mx-[-1rem]
            "
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="
                  why-join-slide // Reference class for JS
                  shrink-0 snap-start 
                  w-full sm:w-1/2 lg:w-1/3 // 1 card (mobile), 2 cards (sm), 3 cards (lg)
                  px-4 // Gutter between slides
                "
              >
                <div className="p-6 bg-white shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition text-center hover:border-purple-300">
                  {item.emoji_url && (
                    <img
                      src={item.emoji_url}
                      alt={item.title}
                      className="mx-auto mb-4"
                      style={{ width: 60, height: 60 }}
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Arrow (Visible only if scrollable and NOT at the end) */}
          {maxScrollIndex > 0 && active < maxScrollIndex && (
            <button
              onClick={() => moveCarousel('right')}
              className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6 text-purple-600" />
            </button>
          )}

          {/* Dots */}
          {items.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {/* Render a dot for each scrollable index/group */}
              {Array.from({ length: maxScrollIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to card group ${i + 1}`}
                  className={`
                    h-2.5 rounded-full transition
                    ${i === active ? 'bg-purple-700 w-6' : 'bg-gray-300 w-2.5 hover:bg-gray-400'}
                  `}
                />
              ))}
            </div>
          )}
        </div>
        {/* --- END UNIVERSAL CAROUSEL --- */}


        {/* CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => setModalType('signup')}
            className="text-xl font-bold px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-800 shadow-lg transition"
          >
            Join Neat Affiliates
          </button>
        </div>

        {modalType && (
          <LoginSignupModal
            isOpen={true}
            type={modalType}
            onClose={() => setModalType(null)}
          />
        )}
      </div>
    </section>
  );
}