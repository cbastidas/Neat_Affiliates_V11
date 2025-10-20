// TermsEditor.tsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { Editor } from '@tinymce/tinymce-react';

export default function TermsEditor() {
  const [content, setContent] = useState('');
  const id = 'c37be501-afa1-4898-9e67-c7166c5efb89'; 

  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.from('terms').select('content').eq('id', id).single();
      if (error) console.error('❌ Error fetching terms:', error.message);
      else setContent(data?.content || '');
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.from('terms').update({ content }).eq('id', id);
    if (error) {
      alert('❌ Failed to save terms');
    } else {
      alert('✅ Terms saved successfully');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>📝</span> Edit Terms & Conditions
      </h2>
      <Editor
        apiKey="w6v1vek49dbuuk99hkdpd8uxv1cphoscqzkfjq9e3h3p9ak2" 
        value={content}
        init={{
          height: 500,
          menubar: true,
          plugins: 'link table code lists fullscreen',
          toolbar:
            'undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link table | fullscreen',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        }}
        onEditorChange={(newContent) => setContent(newContent)}
      />
      <button
        onClick={handleSave}
        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        💾 Save
      </button>

    </div>
  );
}
