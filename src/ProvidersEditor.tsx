import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Provider {
  id: string;
  name: string;
  type: 'payment' | 'game';
  logo_url: string;
}

export default function ProvidersEditor() {
  const [paymentProviders, setPaymentProviders] = useState<Provider[]>([]);
  const [gameProviders, setGameProviders] = useState<Provider[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'payment' | 'game'>('payment');
  const [file, setFile] = useState<File | null>(null);

  const fetchProviders = async () => {
    const { data, error } = await supabase.from('providers').select('*');
    if (!error && data) {
      setPaymentProviders(data.filter(p => p.type === 'payment'));
      setGameProviders(data.filter(p => p.type === 'game'));
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const uploadLogo = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('providerlogos')
      .upload(fileName, file);

    if (error) throw new Error(error.message);

    return `https://acjvweypsumucqdjpwol.supabase.co/storage/v1/object/public/providerlogos/${fileName}`;
  };

  const handleAddProvider = async () => {
    let logo_url = '';
    if (file) {
      try {
        logo_url = await uploadLogo(file);
      } catch (error) {
        alert('❌ Error uploading logo');
        return;
      }
    }

    const { error } = await supabase.from('providers').insert({ name, type, logo_url });
    if (!error) {
      alert('✅ Provider added');
      setName('');
      setFile(null);
      fetchProviders();
    } else {
      alert('❌ Failed to add provider');
    }
  };

  const ProviderCard = ({ provider }: { provider: Provider }) => {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(provider.name);
    const [editFile, setEditFile] = useState<File | null>(null);

    const handleSave = async () => {
      let newLogoUrl = provider.logo_url;
      if (editFile) {
        try {
          newLogoUrl = await uploadLogo(editFile);
        } catch (error) {
          alert('❌ Error uploading logo');
          return;
        }
      }
      const { error } = await supabase
        .from('providers')
        .update({ name: editName, logo_url: newLogoUrl })
        .eq('id', provider.id);

      if (!error) {
        alert('✅ Provider updated');
        setEditing(false);
        fetchProviders();
      } else {
        alert('❌ Failed to update');
      }
    };

    const handleDelete = async () => {
      const { error } = await supabase.from('providers').delete().eq('id', provider.id);
      if (!error) {
        alert('🗑️ Provider deleted');
        fetchProviders();
      }
    };

    return (
      <div className="bg-white p-4 rounded shadow text-center">
        {editing ? (
          <>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border px-2 py-1 mb-2"
            />
            <input type="file" onChange={(e) => setEditFile(e.target.files?.[0] || null)} className="mb-2" />
            <button onClick={handleSave} className="text-green-600 mr-2">Save</button>
            <button onClick={() => setEditing(false)} className="text-gray-600">Cancel</button>
          </>
        ) : (
          <>
            <img src={provider.logo_url} alt={provider.name} className="w-40 h-40 object-contain mx-auto mb-2" />
            <p className="font-semibold text-sm mb-1">{provider.name}</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setEditing(true)} className="text-blue-600">Edit</button>
              <button onClick={handleDelete} className="text-red-600">Delete</button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-10">
      <div>
        <h2 className="text-xl font-bold text-blue-600">🧾 Payment Providers</h2>
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button
            onClick={() => {
              setType('payment');
              handleAddProvider();
            }}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            ➕ Create Payment Provider
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {paymentProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-purple-600">🎮 Game Providers</h2>
        <div className="flex gap-2 mb-4">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button
            onClick={() => {
              setType('game');
              handleAddProvider();
            }}
            className="bg-purple-600 text-white px-4 py-1 rounded"
          >
            ➕ Create Game Provider
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gameProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      </div>
    </div>
  );
}
