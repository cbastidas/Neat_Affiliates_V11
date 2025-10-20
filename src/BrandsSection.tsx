import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Logo {
  id: number;
  name: string;
  logo_url: string;
  is_visible: boolean;
}

export default function BrandLogoGallery() {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from('logos') 
        .select('id, name, logo_url, is_visible');

      if (error) {
        console.error('Error fetching logos:', error.message);
      } else if (data) {
       
        const visibleLogos = data.filter((logo) => logo.is_visible);
        setLogos(visibleLogos);
      }
    };

    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <section className="py-12 bg-white overflow-hidden relative py-16 bg-white rounded-2xl border">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-purple-700">Our Brands</h2>

        <div className="relative w-full overflow-hidden">
          <div className="flex animate-marquee gap-8 w-max">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo.id}-${index}`}
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center"
              >
                <img
                  src={logo.logo_url}
                  alt={logo.name}
                  className="max-h-[60px] w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-marquee {
            animation: marquee 20s linear infinite;
            display: flex;
            width: fit-content;
          }
        `}
      </style>
    </section>
  );
}
