import { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import LoginSignupModal from './LoginSignupModal';

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

  // Mobile carousel state/refs
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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

  // keep active index in range if items change
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, (items?.length || 1) - 1)));
  }, [items]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading Why Join section...</p>;
  }

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, (items?.length || 1) - 1));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive(i);
  };

  return (
    <section id="WhyJoin" className="py-16 bg-white rounded-2xl border">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Why Join Neat Affiliates?
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Top reasons why affiliates love working with us
        </p>

        {/* Mobile: horizontal carousel (1 card per view) */}
        <div className="md:hidden">
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
            "
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full shrink-0 snap-start px-2"
              >
                <div className="p-6 bg-white shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition text-center">
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

          {/* Dots */}
          {items.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to card ${i + 1}`}
                  className={`
                    h-2.5 rounded-full transition
                    ${i === active ? 'bg-purple-700 w-6' : 'bg-gray-300 w-2.5 hover:bg-gray-400'}
                  `}
                />
              ))}
            </div>
          )}
        </div>

        {/* Desktop / Tablet: grid unchanged */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white shadow-md rounded-lg border border-gray-100 hover:shadow-lg transition"
            >
              {item.emoji_url && (
                <img
                  src={item.emoji_url}
                  alt={item.title}
                  className="mx-auto mb-4"
                  style={{ width: 60, height: 60 }}
                />
              )}
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{item.title}</h3>
              <p className="text-gray-600 text-center">{item.description}</p>
            </div>
          ))}
        </div>

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
