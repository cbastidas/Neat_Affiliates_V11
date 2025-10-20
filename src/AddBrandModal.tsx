import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { supabase } from './lib/supabaseClient';

interface CommissionTier {
  range: string;
  rate: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AddBrandModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [commissionType, setCommissionType] = useState('Commission');
  const [tiersLabel, setTiersLabel] = useState('NDC');
  //const [about, setAbout] = useState('');
  const [tiers, setTiers] = useState<CommissionTier[]>([
    { range: '0 - 24', rate: '25%' },
    { range: '25 - 49', rate: '30%' },
    { range: '50 - 79', rate: '35%' },
    { range: '80 - 150', rate: '40%' },
    { range: '150 - Inf', rate: '45%' },
  ]);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTierChange = (index: number, field: 'range' | 'rate', value: string) => {
    const updated = [...tiers];
    updated[index][field] = value;
    setTiers(updated);
  };

  const handleAddTier = () => {
    setTiers([...tiers, { range: '', rate: '' }]);
  };

  const handleRemoveTier = (index: number) => {
    const updated = [...tiers];
    updated.splice(index, 1);
    setTiers(updated);
  };

  const uploadLogo = async (): Promise<string> => {
    if (!logoFile) throw new Error('No logo file selected');
    const fileName = `${Date.now()}-${logoFile.name}`;
    const { error } = await supabase.storage.from('brand-logos').upload(fileName, logoFile);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('brand-logos').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const logoUrl = await uploadLogo();
      const { error } = await supabase.from('brands').insert([
        {
          name,
          logo_url: logoUrl,
          commission_type: commissionType,
          commission_tiers: tiers,
          commission_tiers_label: tiersLabel,
          //about,
          is_visible: true,
        },
      ]);
      if (error) throw error;
      alert('✅ Brand created!');
      onSave();
      onClose();
      resetForm();
    } catch (err: any) {
      alert('❌ Error creating brand: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setName('');
    setLogoFile(null);
    setPreviewUrl('');
    setCommissionType('Commission');
    setTiersLabel('NDC');
    //setAbout('');
    setTiers([
      { range: '0 - 24', rate: '25%' },
      { range: '25 - 48', rate: '30%' },
    ]);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Fondo oscuro */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Contenedor */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
          <h2 className="text-xl font-bold text-center">Add New Brand</h2>

          {/* Logo */}
          <div className="text-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Logo preview" className="h-16 mx-auto object-contain mb-2" />
            ) : (
              <div className="text-gray-400 text-sm mb-2">No logo uploaded</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
          </div>

          {/* Inputs */}
          <input
            type="text"
            placeholder="Brand name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
          />


          {/* Encabezados de columna */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={tiersLabel}
              onChange={(e) => setTiersLabel(e.target.value)}
              className="border rounded p-2 font-semibold"
            >
              <option value="NDC">NDC</option>
              <option value="NGR">NGR</option>
            </select>

            <select
              value={commissionType}
              onChange={(e) => setCommissionType(e.target.value)}
              className="border rounded p-2 font-semibold"
            >
              <option value="Commission">Commission</option>
              <option value="CPA">CPA</option>
              <option value="Hybrid">Hybrid (Commission + CPA)</option>
            </select>
          </div>

          {/* Tabla de tiers */}
          {tiers.map((tier, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={tier.range}
                placeholder="Range"
                onChange={(e) => handleTierChange(i, 'range', e.target.value)}
                className="w-2/3 border rounded p-1"
              />
              <input
                type="text"
                value={tier.rate}
                placeholder="Rate"
                onChange={(e) => handleTierChange(i, 'rate', e.target.value)}
                className="w-1/3 border rounded p-1"
              />
              {tiers.length > 1 && (
                <button onClick={() => handleRemoveTier(i)} className="text-red-500 font-bold">✕</button>
              )}
            </div>
          ))}
          <button onClick={handleAddTier} className="text-sm text-blue-600 hover:underline mt-1">
            + Add Tier
          </button>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 pt-4">
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            <button
              onClick={handleCreate}
              disabled={saving}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {saving ? 'Creating...' : 'Create Brand'}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
