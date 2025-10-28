import { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import TestimonialsEditor from './TestimonialsEditor';

interface Testimonial {
  id: string;
  title: string;
  content: string;
}

export default function Testimonials() {
  // Store all testimonials to display in the carousel
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  // --- Carousel State ---
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      // Load all visible testimonials
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
  
  // --- Carousel Logic ---
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    // Calculate which slide is active based on scroll position and card width
    const cardWidth = el.querySelector('.testimonial-slide')?.clientWidth || el.clientWidth;
    const i = Math.round(el.scrollLeft / cardWidth);
    setActive(i);
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const count = testimonials.length || 1;
    const clamped = Math.max(0, Math.min(i, count - 1));
    // Calculate the scroll position based on the actual card width
    const cardWidth = el.querySelector('.testimonial-slide')?.clientWidth || el.clientWidth;
    el.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
  };
  // -----------------------------------------------------

  if (isAdmin) return <TestimonialsEditor />;
  
  // If there are no testimonials, don't render the section
  if (testimonials.length === 0) return null;


  return (
    <section id="Testimonials" className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-4xl font-bold mb-4 text-purple-900">✨ Testimonials</h2>
      <p className="text-lg text-gray-600 mb-12">
        Here is what our partners say about us.
      </p>

      {/* --- Single Carousel for Mobile and Desktop --- */}
      <div className="max-w-6xl mx-auto"> 
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
            // Add horizontal padding so cards don't touch screen edges on small screens
            px-4 
            // Add a slight negative margin to compensate for section padding
            mx-[-1rem] 
          "
        >
          {testimonials.map((t) => (
              <div
                key={t.id}
                className="
                  testimonial-slide // Reference class for JS
                  snap-start shrink-0 
                  w-full sm:w-1/2 lg:w-1/3 // Defines how many cards are visible (1 on mobile, 2 on sm, 3 on lg)
                  px-4 // Creates space (gutter) between cards
              "
              >
                 <div
                   className="bg-white p-6 rounded-xl shadow transition-all border border-gray-100 text-left h-full flex flex-col justify-between"
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

        {/* Dots (Optional) - Only show if not all cards fit */}
        {testimonials.length > 0 && (
          <div className="mt-5 flex items-center justify-center gap-2">
             {/* Create a dot for each card */}
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-2.5 rounded-full transition
                  ${i === active ? "bg-purple-700 w-6" : "bg-gray-300 w-2.5 hover:bg-gray-400"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}