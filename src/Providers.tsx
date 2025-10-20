import { useEffect, useState } from 'react';
import ProvidersEditor from './ProvidersEditor';
import { useSearchParams } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';


interface Providers {
  id: string;
  name: string;
  type: 'payment' | 'game';
  logo_url: string;
}

export default function Providers() {
  const [paymentProviders, setPaymentProviders] = useState<Providers[]>([]);
  const [searchParams] = useSearchParams();
  const [gameProviders, setGameProviders] = useState<Providers[]>([]);
  const isAdmin = searchParams.get('admin') === 'true';

  useEffect(() => {
    const fetchProviders = async () => {
      const { data, error } = await supabase.from('providers').select('*');
      if (error) {
        console.error('Error fetching providers:', error.message);
        return;
      }

      const payments = data.filter((p: Providers) => p.type === 'payment');
      const games = data.filter((p: Providers) => p.type === 'game');
      setPaymentProviders(payments);
      setGameProviders(games);
    };

    fetchProviders();
  }, []);

  if (isAdmin) return <ProvidersEditor />;

  const renderSection = (title: string, items: Providers[]) => (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {items.map((provider) => (
          <div
            key={provider.id}
            className="flex flex-col items-center bg-white p-4 shadow rounded"
          >
            <img
              src={provider.logo_url}
              alt={provider.name}
              className="w-40 h-40 object-contain mb-2"
            />
            <p className="text-sm text-center font-semibold">{provider.name}</p>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="py-16 px-4 bg-gray-50 min-h-screen">
      {renderSection('💳 Payment Providers', paymentProviders)}
      {renderSection('🎮 Game Providers', gameProviders)}
    </div>
  );
}
