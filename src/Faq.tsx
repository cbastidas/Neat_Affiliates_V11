import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function Faq() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data } = await supabase.from('faqs').select('*').order('order');
      if (data) {
        setFaqs(data);
        const firstCat = data[0]?.category;
        if (firstCat) setActiveCategory(firstCat);
      }
    };
    fetchFaqs();
  }, []);

  const categories = [...new Set(faqs.map(f => f.category))];

  const filtered = faqs.filter(f => f.category === activeCategory);

  return (
    <section id="FAQ" className="py-16 text-center bg-white rounded-2xl border">
      <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
      <p className="text-gray-600 mb-6">You can find the answers to your questions. For different questions, please contact us.</p>

      <div className="flex justify-center flex-wrap gap-4 mb-6">
        {categories.map((cat) => (
          <button key={cat} className={`px-4 py-2 rounded-full ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-left">
        {filtered.map((faq) => (
          <div key={faq.id} className="mb-4 border rounded bg-white">
            <button onClick={() => setExpanded(expanded === faq.id ? null : faq.id)} className="w-full text-left px-4 py-3 font-semibold">
              {faq.question}
            </button>
            {expanded === faq.id && (
              <div className="px-4 pb-4 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
