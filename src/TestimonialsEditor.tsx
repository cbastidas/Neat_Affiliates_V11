import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface testimonials {
  id: string;
  title: string;
  content: string;
}

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<testimonials[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTestimonial, setEditedTestimonial] = useState<Partial<testimonials>>({});
  const [newTestimonial, setNewTestimonial] = useState({ title: '', content: '' });

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!error) setTestimonials(data || []);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from('testimonials').insert(newTestimonial);
    if (!error) {
      setNewTestimonial({ title: '', content: '' });
      fetchTestimonials();
    } else {
      alert('Error adding testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      fetchTestimonials();
    } else {
      alert('Error deleting testimonial');
    }
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .update(editedTestimonial)
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      setEditedTestimonial({});
      fetchTestimonials();
    } else {
      alert('Error updating testimonial');
    }
  };

  return (
    <section id="TestimonialsEditor" className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">📝 Edit Testimonials</h2>

      {/* Add new */}
      <div className="flex flex-col gap-2 max-w-md mb-8">
        <input
          type="text"
          placeholder="Title"
          value={newTestimonial.title}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Content"
          value={newTestimonial.content}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-fit"
        >
          ➕ Add Testimonial
        </button>
      </div>

      {/* Existing testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white shadow rounded p-4">
            {editingId === t.id ? (
              <>
                <input
                  type="text"
                  value={editedTestimonial.title || ''}
                  onChange={(e) => setEditedTestimonial({ ...editedTestimonial, title: e.target.value })}
                  className="w-full border px-2 py-1 mb-2 rounded"
                />
                <textarea
                  value={editedTestimonial.content || ''}
                  onChange={(e) => setEditedTestimonial({ ...editedTestimonial, content: e.target.value })}
                  className="w-full border px-2 py-1 mb-2 rounded"
                />
                <button
                  onClick={() => handleSave(t.id)}
                  className="text-green-600 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-1">{t.title}</h3>
                <p className="text-gray-700 mb-2">{t.content}</p>
                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setEditedTestimonial({ title: t.title, content: t.content });
                  }}
                  className="text-blue-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
