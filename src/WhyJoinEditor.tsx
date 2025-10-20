import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Reason {
  id: number;
  emoji_url: string;
  title: string;
  description: string;
  order: number;
}

export default function WhyJoinEditor() {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [newReason, setNewReason] = useState<Omit<Reason, 'id' | 'order'>>({
    emoji_url: '',
    title: '',
    description: '',
  });

  const fetchReasons = async () => {
    const { data } = await supabase.from('why_join').select('*').order('order');
    if (data) setReasons(data);
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleAdd = async () => {
    if (!newReason.title || !newReason.description) return;
    const order = reasons.length;
    const { error } = await supabase
      .from('why_join')
      .insert([{ ...newReason, order }]);

    if (!error) {
      setNewReason({ emoji_url: '', title: '', description: '' });
      fetchReasons();
    }
  };

  const handleUpdate = async (id: number, updates: Partial<Reason>) => {
    await supabase.from('why_join').update(updates).eq('id', id);
    fetchReasons();
  };

  const handleDelete = async (id: number) => {
    await supabase.from('why_join').delete().eq('id', id);
    fetchReasons();
  };

  const handleFileUpload = async (
    file: File,
    reasonId?: number,
    isNew?: boolean
  ) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `emoji/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('whyjoinicons')
      .upload(filePath, file);

    if (uploadError) {
      alert('Upload failed');
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('whyjoinicons')
      .getPublicUrl(filePath);

    if (isNew) {
      setNewReason({ ...newReason, emoji_url: publicUrlData.publicUrl });
    } else if (reasonId) {
      await handleUpdate(reasonId, { emoji_url: publicUrlData.publicUrl });
    }
  };

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
        Why Join Neat Affiliates?
      </h2>
      <p className="text-center text-gray-500 mb-6">Admin view — editable section</p>

      {/* Add new card form */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        <input
          type="file"
          accept="image/png, image/svg+xml, image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, undefined, true);
          }}
        />
        <span className="text-sm text-gray-500">Upload PNG/SVG image, max 100x100px</span>
        <input
          placeholder="Title"
          value={newReason.title}
          onChange={(e) => setNewReason({ ...newReason, title: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Description"
          value={newReason.description}
          onChange={(e) =>
            setNewReason({ ...newReason, description: e.target.value })
          }
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + Add Card
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reasons.map((reason) => (
          <div
            key={reason.id}
            className="p-6 border rounded shadow-sm text-center relative"
          >
            {reason.emoji_url && (
              <img
                src={reason.emoji_url}
                alt="Emoji"
                className="mx-auto mb-2 h-16 object-contain"
              />
            )}
            <input
              className="text-xl font-bold text-center w-full mb-2"
              value={reason.title}
              onChange={(e) => handleUpdate(reason.id, { title: e.target.value })}
            />
            <textarea
              className="text-gray-600 text-sm w-full text-center h-24"
              value={reason.description}
              onChange={(e) =>
                handleUpdate(reason.id, { description: e.target.value })
              }
            />
            <div className="mt-2 flex justify-center gap-4">
              <button
                onClick={() => handleDelete(reason.id)}
                className="text-red-600 font-semibold"
              >
                Delete
              </button>
              <label className="text-blue-600 cursor-pointer">
                Change Emoji
                <input
                  type="file"
                  accept="image/png, image/svg+xml, image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, reason.id);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
