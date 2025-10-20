import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { Editor } from '@tinymce/tinymce-react';

export default function TermsViewer() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from('terms')
        .select('content')
        .eq('slug', slug)
        .single();

      if (error) {
        console.warn('No content found for this slug.');
        setContent('');
      } else {
        setContent(data?.content || '');
      }
      setLoading(false);
    };

    fetchContent();
  }, [slug]);

  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);

    const { error } = await supabase
      .from('terms')
      .upsert([{ slug, content }], { onConflict: 'slug' });

    if (error) {
      alert('❌ Error saving content');
      console.error(error);
    } else {
      alert('✅ Terms updated!');
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      {isAdmin ? (
        <>
          <h2 className="text-2xl font-bold mb-4">✏️ Edit Terms & Conditions</h2>
          <Editor
            apiKey="w6v1vek49dbuuk99hkdpd8uxv1cphoscqzkfjq9e3h3p9ak2"
            init={{
              height: 500,
              menubar: false,
              plugins: 'lists link table code',
              toolbar:
                'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link table | code',
            }}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
          />
          <button
            onClick={handleSave}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : '💾 Save'}
          </button>
        </>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="prose max-w-full"
        />
      )}
    </div>
  );
}
