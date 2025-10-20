import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AuthLink {
  id: string;
  instance: string;
  login: string;
  signup: string;
  order: number;
}

const instanceOptions = [
  'Throne',
  'Realm',
  'Bluffbet',
  'Vidavegas BR',
  'Vidavegas Latam',
];

function SortableItem({ auth, onChange, onDelete }: {
  auth: AuthLink;
  onChange: (id: string, updates: Partial<AuthLink>) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: auth.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-wrap items-center gap-2 p-2 border rounded">
      <div {...attributes} {...listeners} className="cursor-move px-2">☰</div>
      <select
        value={auth.instance}
        onChange={(e) => onChange(auth.id, { instance: e.target.value })}
        className="border p-1 rounded"
      >
        {instanceOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <input
        placeholder="Login URL"
        value={auth.login}
        onChange={(e) => onChange(auth.id, { login: e.target.value })}
        className="border p-1 rounded flex-1"
      />
      <input
        placeholder="Signup URL"
        value={auth.signup}
        onChange={(e) => onChange(auth.id, { signup: e.target.value })}
        className="border p-1 rounded flex-1"
      />
      <button onClick={() => onDelete(auth.id)} className="text-red-600 ml-2">🗑️</button>
    </div>
  );
}

export default function AuthEditor() {
  const [authLinks, setAuthLinks] = useState<AuthLink[]>([]);
  const [newAuth, setNewAuth] = useState<Omit<AuthLink, 'id' | 'order'>>({
    instance: '',
    login: '',
    signup: '',
  });
  const [message, setMessage] = useState('');

  const fetchLinks = async () => {
    const { data } = await supabase.from('auth_links').select('*').order('order');
    if (data) setAuthLinks(data);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAdd = async () => {
    if (!newAuth.instance || !newAuth.login || !newAuth.signup) return;
    const order = authLinks.length;

    const { error } = await supabase.from('auth_links').insert([{ ...newAuth, order }]);
    if (!error) {
      setMessage('✅ Added successfully!');
      setNewAuth({ instance: '', login: '', signup: '' });
      fetchLinks();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('auth_links').delete().eq('id', id);
    if (!error) {
      setMessage('🗑️ Deleted successfully.');
      fetchLinks();
    }
  };

  const handleUpdate = async (id: string, updates: Partial<AuthLink>) => {
    const { error } = await supabase.from('auth_links').update(updates).eq('id', id);
    if (!error) {
      setMessage('✅ Updated successfully!');
      fetchLinks();
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = authLinks.findIndex((item) => item.id === active.id);
      const newIndex = authLinks.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(authLinks, oldIndex, newIndex);
      setAuthLinks(reordered);

      // Save new order to Supabase
      for (let i = 0; i < reordered.length; i++) {
        await supabase.from('auth_links').update({ order: i }).eq('id', reordered[i].id);
      }

      setMessage('✅ Order updated!');
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {message && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded">{message}</div>
      )}
      <div className="flex flex-wrap gap-2">
        <select
          value={newAuth.instance}
          onChange={(e) => setNewAuth({ ...newAuth, instance: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Instance</option>
          {instanceOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          placeholder="Login URL"
          value={newAuth.login}
          onChange={(e) => setNewAuth({ ...newAuth, login: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <input
          placeholder="Signup URL"
          value={newAuth.signup}
          onChange={(e) => setNewAuth({ ...newAuth, signup: e.target.value })}
          className="border p-2 rounded flex-1"
        />
        <button onClick={handleAdd} className="bg-purple-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={authLinks.map(a => a.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {authLinks.map((auth) => (
              <SortableItem
                key={auth.id}
                auth={auth}
                onChange={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
