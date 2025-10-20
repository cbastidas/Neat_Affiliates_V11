import { useEffect, useState } from 'react';
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

  if (loading) {
    return <p className="text-center text-gray-500">Loading Why Join section...</p>;
  }

  return (
    <section id="WhyJoin" className="py-16 bg-white rounded-2xl border">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Why Join Neat Affiliates?
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Top reasons why affiliates love working with us
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

        <br/>
          <br/>
            <div className="text-center mt-12">
              <button onClick={() => setModalType('signup')} 
              className="text-xl font-bold px-6 py-3 rounded-full bg-purple-600 text-white hover:bg-purple-800 shadow-lg transition z-1000"
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
