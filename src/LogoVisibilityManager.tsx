import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Logo {
  id: string;
  name: string;
  logo_url: string;
  is_visible: boolean;
}

export default function LogoVisibilityManager() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Logo>>({});
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchLogos = async () => {
    const { data, error } = await supabase.from('logos').select('*');
    if (error) console.error('Error fetching logos:', error.message);
    else setLogos(data || []);
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleEdit = (logo: Logo) => {
    setEditingId(logo.id);
    setEditedValues({ name: logo.name, is_visible: logo.is_visible });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedValues({});
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase.from('logos').update(editedValues).eq('id', id);
    if (error) {
      alert('❌ Error saving: ' + error.message);
    } else {
      alert('✅ Logo updated successfully!');
      fetchLogos();
      handleCancel();
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this logo?');
    if (!confirm) return;
    const { error } = await supabase.from('logos').delete().eq('id', id);
    if (!error) {
      alert('🗑️ Logo deleted.');
      fetchLogos();
    }
  };

  const handleUpload = async () => {
    if (!newLogoFile || !newLogoName) {
      alert('Please provide a name and a file.');
      return;
    }

    setUploading(true);

    const fileExt = newLogoFile.name.split('.').pop();
    const fileName = `${Date.now()}-${newLogoName}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('brand-logos')
      .upload(fileName, newLogoFile);

    if (uploadError) {
      alert('❌ Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const publicUrl = supabase.storage.from('brand-logos').getPublicUrl(fileName).data.publicUrl;

    const { error: insertError } = await supabase.from('logos').insert([
      {
        name: newLogoName,
        logo_url: publicUrl,
        is_visible: true,
      },
    ]);

    if (insertError) {
      alert('❌ Failed to save logo in database: ' + insertError.message);
    } else {
      alert('✅ Logo added successfully!');
      setNewLogoName('');
      setNewLogoFile(null);
      fetchLogos();
    }

    setUploading(false);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
        🖼️ Manage Logos
      </h2>

      {/* Upload New Logo */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Brand Name"
          value={newLogoName}
          onChange={(e) => setNewLogoName(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-60"
        />
        <input
          type="file"
          accept="image/png,image/jpg,image/jpeg,image/svg+xml"
          onChange={(e) => setNewLogoFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          + Add Logo
        </button>
        <p className="text-xs text-gray-500">
          Upload PNG/SVG (100x100px recommended)
        </p>
      </div>

      {/* Logos Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {logos.map((logo) => (
          <div key={logo.id} className="border p-3 rounded shadow flex flex-col items-center bg-white">
            <img
              src={logo.logo_url}
              alt={logo.name}
              className="h-16 object-contain mb-2"
            />

            {editingId === logo.id ? (
              <>
                <input
                  value={editedValues.name || ''}
                  onChange={(e) =>
                    setEditedValues({ ...editedValues, name: e.target.value })
                  }
                  className="border rounded px-2 py-1 text-sm w-full text-center mb-1"
                />
                <label className="text-sm flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={editedValues.is_visible}
                    onChange={() =>
                      setEditedValues({
                        ...editedValues,
                        is_visible: !editedValues.is_visible,
                      })
                    }
                  />
                  Visible
                </label>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(logo.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-2 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-center font-medium text-sm truncate w-full">{logo.name}</p>
                <p className="text-xs text-gray-500">
                  {logo.is_visible ? '✅ Visible' : '❌ Hidden'}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(logo)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(logo.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
