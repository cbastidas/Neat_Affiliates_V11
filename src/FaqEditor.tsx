// FaqEditor.tsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
}

const categories = [
  'Commission',
  'General',
  'Payment Issues',
  'Reporting and Statistics',
  'Support',
  'Technical Questions',
];

export default function FaqEditor() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedFaqs, setEditedFaqs] = useState<Record<string, Partial<Faq>>>({});
  const [newFaq, setNewFaq] = useState<Omit<Faq, 'id' | 'order'>>({
    category: categories[0],
    question: '',
    answer: '',
  });
  const [successMessage, setSuccessMessage] = useState<string>('');

  const fetchFaqs = async () => {
    const { data } = await supabase.from('faqs').select('*').order('order', { ascending: true });
    if (data) setFaqs(data);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAdd = async () => {
    if (!newFaq.category || !newFaq.question || !newFaq.answer) return;
    const order = faqs.filter(f => f.category === newFaq.category).length;
    const { error } = await supabase.from('faqs').insert([{ ...newFaq, order }]);
    if (!error) {
      setNewFaq({ category: categories[0], question: '', answer: '' });
      fetchFaqs();
      setSuccessMessage('FAQ added successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setEditedFaqs((prev) => ({ ...prev, [faq.id]: { question: faq.question, answer: faq.answer } }));
  };

  const handleSave = async (id: string) => {
    const updated = editedFaqs[id];
    if (!updated) return;
    const { error } = await supabase.from('faqs').update(updated).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchFaqs();
      setSuccessMessage('FAQ updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from('faqs').delete().eq('id', id);
    fetchFaqs();
  };

  const handleChange = (id: string, field: keyof Faq, value: string) => {
    setEditedFaqs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  return (
    <div className="py-8">
      <h2 className="text-xl font-bold mb-4"></h2>

      {successMessage && <div className="text-green-600 mb-4">{successMessage}</div>}

      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full ${selectedCategory === cat ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded bg-gray-100 mb-6">
        <h3 className="font-semibold mb-2">Add New FAQ</h3>
        <select
          value={newFaq.category}
          onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          placeholder="Question"
          value={newFaq.question}
          onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Answer"
          value={newFaq.answer}
          onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={handleAdd} className="bg-purple-600 text-white px-4 py-2 rounded">Add</button>
      </div>

      {faqs.filter(f => f.category === selectedCategory).map((faq) => (
        <div key={faq.id} className="border rounded shadow p-4 mb-4 bg-white">
          {editingId === faq.id ? (
            <>
              <input
                className="w-full border p-2 font-semibold mb-2"
                value={editedFaqs[faq.id]?.question || ''}
                onChange={(e) => handleChange(faq.id, 'question', e.target.value)}
              />
              <textarea
                className="w-full border p-2 mb-2"
                value={editedFaqs[faq.id]?.answer || ''}
                onChange={(e) => handleChange(faq.id, 'answer', e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={() => handleSave(faq.id)} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
                <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p className="font-semibold text-lg">{faq.question}</p>
              <p className="text-gray-700">{faq.answer}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleEdit(faq)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(faq.id)} className="text-red-600">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
