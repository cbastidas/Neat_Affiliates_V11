import { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import TestimonialsEditor from './TestimonialsEditor';
// ⚠️ Note: Ensure you have 'lucide-react' installed or use your own icons
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

interface Testimonial {
  id: string;
  title: string;
  content: string;
}

// 🎯 Define the new prop interface
interface TestimonialsProps {
    onSignup: () => void;
}

// 🎯 Accept the new prop
export default function Testimonials({ onSignup }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  // --- Carousel State ---
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Store the max index the carousel can scroll to (0 if all fit)
  const [maxScrollIndex, setMaxScrollIndex] = useState(0); 

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setTestimonials(data || []);
      }
    };
    fetchTestimonials();
  }, []);

  // --- Logic to calculate the maximum scrollable index ---
  const calculateMaxScroll = () => {
    const el = trackRef.current;
    if (!el || testimonials.length === 0) {
        setMaxScrollIndex(0);
        return;
    }

    // Get the width of a single slide (must wait for render)
    const slideEl = el.querySelector('.testimonial-slide');
    if (!slideEl) return;
    const slideWidth = slideEl.clientWidth;

    // Calculate how many slides fit in the track's visible area
    const visibleSlidesCount = Math.floor(el.clientWidth / slideWidth);

    // Max index is total items minus visible count
    const max = testimonials.length - visibleSlidesCount;
    
    // Ensure max is not negative
    setMaxScrollIndex(Math.max(0, max));

    // Adjust the active index if the window resizes
    setActive(i => Math.min(i, Math.max(0, max)));
  };

  useEffect(() => {
    // Run once after initial load and whenever data changes
    calculateMaxScroll(); 
    window.addEventListener('resize', calculateMaxScroll);
    
    // Clean up listener
    return () => window.removeEventListener('resize', calculateMaxScroll);

  }, [testimonials, trackRef.current]); 
  
  // --- Carousel Scroll Handler ---
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slideEl = el.querySelector('.testimonial-slide');
    if (!slideEl) return;
    
    // Use the width of the first slide for calculation
    const cardWidth = slideEl.clientWidth; 
    
    // Calculate which slide group is currently active
    const i = Math.round(el.scrollLeft / cardWidth);
    
    // Update the active index, clamped to the calculated maximum
    setActive(Math.min(i, maxScrollIndex)); 
  };

  // --- Snap to a specific index (used by dots and arrows) ---
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slideEl = el.querySelector('.testimonial-slide');
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

  if (isAdmin) return <TestimonialsEditor />;
  if (testimonials.length === 0) return null;


  return (
    <section id="Testimonials" className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-4xl font-bold mb-4 text-purple-900">✨ Testimonials</h2>
      <p className="text-lg text-gray-600 mb-12">
        Here is what our partners say about us.
      </p>

      {/* --- Main Container (Relative for absolute arrows) --- */}
      <div className="max-w-6xl mx-auto relative"> 
        
        {/* Left Arrow (Visible only if scrollable and NOT at the start) */}
        {maxScrollIndex > 0 && active > 0 && (
          <button
            onClick={() => moveCarousel('left')}
            // hidden sm:flex hides on mobile (where swipe is used)
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-purple-600" />
          </button>
        )}

        {/* Horizontal track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="
            relative flex overflow-x-auto
            snap-x snap-mandatory
            scroll-smooth
            [-webkit-overflow-scrolling:touch]
            no-scrollbar
            w-full
            px-4 
            mx-[-1rem] 
          "
        >
          {testimonials.map((t) => (
              <div
                key={t.id}
                className="
                  testimonial-slide 
                  snap-start shrink-0 
                  w-full sm:w-1/2 lg:w-1/3 
                  px-4 
              "
              >
                 <div
                   className="bg-white p-6 rounded-xl shadow transition-all border border-gray-100 text-left h-full flex flex-col justify-between hover:border-purple-300"
                 >
                   <div>
                     <h3 className="text-xl font-semibold text-gray-800 mb-2">
                       {t.title}
                     </h3>
                     <p className="text-gray-700 leading-relaxed italic border-l-4 border-purple-300 pl-3">
                       "{t.content}"
                     </p>
                   </div>
                   <p className="mt-4 text-right text-sm font-medium text-purple-600">— A Satisfied Affiliate</p>
                 </div>
              </div>
          ))}
        </div>
        
        {/* Right Arrow (Visible only if scrollable and NOT at the end) */}
        {maxScrollIndex > 0 && active < maxScrollIndex && (
          <button
            onClick={() => moveCarousel('right')}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-100 transition"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-6 h-6 text-purple-600" />
          </button>
        )}


        {/* Dots */}
        {testimonials.length > 0 && (
          <div className="mt-5 flex items-center justify-center gap-2">
             {/* Render a dot for each scrollable index/group */}
            {Array.from({ length: maxScrollIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial group ${i + 1}`}
                className={`h-2.5 rounded-full transition
                  ${i === active ? "bg-purple-700 w-6" : "bg-gray-300 w-2.5 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* 🎯 NEW CTA BUTTON */}
      <div className="text-center mt-16">
          <h3 className="text-xl text-gray-700 mb-4">
            Ready to become our next success story?
          </h3>
          <button
              onClick={onSignup}
              className="text-base sm:text-lg lg:text-xl font-bold px-8 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-800 shadow-lg transition"
          >
              Join the Affiliates Community
          </button>
      </div>
    </section>
  );
}