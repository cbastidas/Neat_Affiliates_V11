import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface CommissionTier {
  range: string;
  rate: string;
}

interface BrandCardProps {
  id: string;
  logoUrl: string;
  name: string;
  commissionTiers: CommissionTier[];
  commissionType: string;
  isVisible: boolean;
  commission_tiers_label?: string;
  onSave: () => void;
  isPublicView?: boolean;
  group?: string;
}

export default function BrandCard({
  id,
  logoUrl,
  name,
  commissionTiers,
  commissionType,
  commission_tiers_label,
  isVisible,
  onSave,
  isPublicView = false,
  group,
}: BrandCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [tiers, setTiers] = useState<CommissionTier[]>(commissionTiers);
  const [editedVisible, setEditedVisible] = useState(isVisible);
  const [editedTiersLabel, setEditedTiersLabel] = useState(commission_tiers_label);
  const [editedCommissionType, setEditedCommissionType] = useState(commissionType);
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(logoUrl);
  const [saving, setSaving] = useState(false);
  const [editedGroup, setEditedGroup] = useState(group || '');

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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setNewLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadNewLogo = async (): Promise<string> => {
    if (!newLogoFile) return logoUrl;
    const fileName = `${Date.now()}-${newLogoFile.name}`;
    const { error } = await supabase.storage.from('brand-logos').upload(fileName, newLogoFile);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('brand-logos').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const logoPublicUrl = await uploadNewLogo();

      const { error } = await supabase.from('brands').update({
        name: editedName,
        commission_tiers: tiers,
        is_visible: editedVisible,
        commission_tiers_label: editedTiersLabel,
        commission_type: editedCommissionType,
        logo_url: logoPublicUrl,
        group: editedGroup,
      }).eq('id', id);

      if (error) throw error;

      alert('✅ Brand updated!');
      onSave();
      setIsEditing(false);
    } catch (err: any) {
      alert('❌ Error saving brand: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(name);
    setTiers(commissionTiers);
    setEditedVisible(isVisible);
    setEditedTiersLabel(commission_tiers_label);
    setEditedCommissionType(commissionType);
    setNewLogoFile(null);
    setPreviewUrl(logoUrl);
    setEditedGroup(group || '');
  };

  return (
    <div className="brand-card mx-auto">
      <div className="flex justify-between items-center mb-2">
        <img src={previewUrl} alt={name} className="h-10 object-contain" />
        {!isPublicView && (
          isEditing ? (
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={editedVisible}
                onChange={() => setEditedVisible(!editedVisible)}
                className="accent-green-600"
              />
              <span>{editedVisible ? 'Visible' : 'Hidden'}</span>
            </label>
          ) : (
            <span className="text-xs text-gray-500">{isVisible ? '✅ Visible' : '❌ Hidden'}</span>
          )
        )}
      </div>

      {isEditing && !isPublicView && (
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="mb-2 text-sm"
        />
      )}

      {isEditing && !isPublicView ? (
        <input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="text-lg font-semibold text-center mb-1 border p-1 rounded"
        />
      ) : (
        <h3 className="text-lg font-semibold text-center mb-1">{editedName}</h3>
      )}

      {/* Group Selector */}
      {!isPublicView && (
        isEditing ? (
          <select
            value={editedGroup}
            onChange={(e) => setEditedGroup(e.target.value)}
            className="text-center border rounded p-1 w-full mb-2 bg-yellow-100 shadow"
          >
            <option value="">-- Select Group --</option>
            <option value="Realm">Realm</option>
            <option value="Throne">Throne</option>
            <option value="Neatplay">Neatplay</option>
            <option value="Neatplay - Latam">Neatplay - Latam</option>
          </select>
        ) : (
          <div className="text-sm text-center text-purple-600 mb-2 font-medium">
            {editedGroup ? `Belongs to: ${editedGroup}` : <span className="text-gray-400">No group assigned</span>}
          </div>
        )
      )}

      {isEditing && !isPublicView && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            value={editedTiersLabel}
            onChange={(e) => setEditedTiersLabel(e.target.value)}
            className="border rounded p-1 font-semibold"
          >
            <option value="NDC">NDC Tiers</option>
            <option value="NGR">NGR Tiers</option>
          </select>
          <select
            value={editedCommissionType}
            onChange={(e) => setEditedCommissionType(e.target.value)}
            className="border rounded p-1 font-semibold"
          >
            <option value="Commission">Commission</option>
            <option value="CPA">CPA</option>
            <option value="Hybrid">Hybrid (Commission + CPA)</option>
          </select>
        </div>
      )}

      <div className="overflow-x-auto text-sm">
        <table className="table-fixed w-full text-sm text-left text-gray-700 border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-2 border border-gray-200 w-1/2 truncate">{editedTiersLabel} TIERS</th>
              <th className="px-4 py-2 border border-gray-200 w-1/2 truncate">{editedCommissionType}</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border border-gray-200 align-top">
                  {isEditing && !isPublicView ? (
                    <input
                      value={tier.range}
                      onChange={(e) => handleTierChange(index, 'range', e.target.value)}
                      className="w-full border rounded p-1 text-sm"
                    />
                  ) : (
                    tier.range
                  )}
                </td>
                <td className="px-3 py-2 border border-gray-200 text-center align-top">
                  {isEditing && !isPublicView ? (
                    <div className="flex justify-end items-center gap-1">
                      <input
                        value={tier.rate}
                        onChange={(e) => handleTierChange(index, 'rate', e.target.value)}
                        className="w-full border rounded p-1 text-center text-sm"
                      />
                      {tiers.length > 1 && (
                        <button onClick={() => handleRemoveTier(index)} className="text-red-500 font-bold">✕</button>
                      )}
                    </div>
                  ) : (
                    <strong>{tier.rate}</strong>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <colgroup>
          <col style={{ width: '60%' }} />
          <col style={{ width: '40%' }} />
        </colgroup>

        {isEditing && !isPublicView && (
          <button
            onClick={handleAddTier}
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            + Add Tier
          </button>
        )}
      </div>

      {!isPublicView && (
        <div className="flex justify-center gap-2 mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>
      )}
    </div>
  );
}
