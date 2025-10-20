import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';
import TestimonialsEditor from './TestimonialsEditor';

interface Testimonial {
  id: string;
  title: string;
  content: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setTestimonials(data || []);
    };

    fetchTestimonials();
  }, []);

  if (isAdmin) return <TestimonialsEditor />;

  return (
    <section id="Testimonials" className="py-20 px-4 text-center bg-gradient-to-b from-white to-gray-50">
      <h2 className="text-4xl font-bold mb-4 text-purple-900">Testimonials</h2>
      <p className="text-lg text-gray-600 mb-12">
        Here is what our partners say about us
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-all border border-gray-100 text-left"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {testimonial.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {testimonial.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
