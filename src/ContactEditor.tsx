import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';



interface Contact {
  id: string;
  label: string;
  value: string;
  type: string;
  emoji_url?: string;
}

export default function ContactEditor() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Partial<Contact>>({});
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Contact>>({});

  const fetchContacts = async () => {
    const { data, error } = await supabase.from('contact_info').select('*');
    if (!error) setContacts(data || []);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const uploadEmoji = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('contacticons')
      .upload(fileName, file);

    if (error) throw new Error(error.message);
    return `https://acjvweypsumucqdjpwol.supabase.co/storage/v1/object/public/contacticons/${fileName}`;
  };

  const handleAddContact = async () => {
    let emojiUrl = '';
    if (iconFile) {
      try {
        emojiUrl = await uploadEmoji(iconFile);
      } catch (error) {
        alert('❌ Failed to upload emoji');
        return;
      }
    }

    const { error } = await supabase.from('contact_info').insert({
      ...newContact,
      emoji_url: emojiUrl,
    });

    if (!error) {
      alert('✅ Contact added successfully!');
      fetchContacts();
      setNewContact({});
      setIconFile(null);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('contact_info').delete().eq('id', id);
    if (!error) {
      alert('🗑️ Contact deleted.');
      fetchContacts();
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditedValues(contact);
  };

  const handleSave = async (id: string) => {
    let emojiUrl = editedValues.emoji_url || '';
    if (iconFile) {
      try {
        emojiUrl = await uploadEmoji(iconFile);
      } catch (error) {
        alert('❌ Failed to upload emoji');
        return;
      }
    }

    const { error } = await supabase
      .from('contact_info')
      .update({ ...editedValues, emoji_url: emojiUrl })
      .eq('id', id);

    if (!error) {
      alert('✅ Contact updated successfully!');
      fetchContacts();
      setEditingId(null);
      setIconFile(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Upload PNG or JPG emoji image. Recommended size: 40x40px.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          placeholder="Label"
          className="border px-2 py-1 rounded"
          value={newContact.label || ''}
          onChange={(e) => setNewContact({ ...newContact, label: e.target.value })}
        />
        <input
          placeholder="Value"
          className="border px-2 py-1 rounded"
          value={newContact.value || ''}
          onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
        />
        <select
          value={newContact.type || ''}
          className="border px-2 py-1 rounded"
          onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
        >
          <option value="">Type</option>
          <option value="email">Email</option>
          <option value="teams">Teams</option>
          <option value="telegram">Telegram</option>
        </select>
        <input type="file" onChange={(e) => setIconFile(e.target.files?.[0] || null)} />
        <button
          onClick={handleAddContact}
          className="bg-purple-600 text-white px-4 py-1 rounded"
        >
          ➕ Add Contact
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-6 rounded-lg shadow text-left relative">
            {editingId === contact.id ? (
              <>
                <input
                  className="w-full mb-2 border px-2 py-1 rounded"
                  value={editedValues.label || ''}
                  onChange={(e) => setEditedValues({ ...editedValues, label: e.target.value })}
                />
                <input
                  className="w-full mb-2 border px-2 py-1 rounded"
                  value={editedValues.value || ''}
                  onChange={(e) => setEditedValues({ ...editedValues, value: e.target.value })}
                />
                <select
                  className="w-full mb-2 border px-2 py-1 rounded"
                  value={editedValues.type || ''}
                  onChange={(e) => setEditedValues({ ...editedValues, type: e.target.value })}
                >
                  <option value="email">Email</option>
                  <option value="teams">Teams</option>
                  <option value="telegram">Telegram</option>
                </select>
                <input
                  type="file"
                  onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                  className="mb-2"
                />
                <div className="flex gap-3">
                  <button onClick={() => handleSave(contact.id)} className="text-green-600">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="absolute top-4 right-4">
                  {contact.emoji_url && (
                    <img
                      src={contact.emoji_url}
                      alt="icon"
                      className="w-10 h-10 object-contain rounded"
                    />
                  )}
                </div>
                <p className="font-bold">{contact.label}</p>
                <p className="text-gray-700">{contact.value}</p>
                <p className="text-xs text-gray-400">{contact.type}</p>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 text-sm"
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
