import { useSearchParams } from 'react-router-dom';
import TermsEditor from './TermsEditor';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

export default function Terms() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const TERMS_ID = 'c37be501-afa1-4898-9e67-c7166c5efb89';

  useEffect(() => {
    const fetchTerms = async () => {
      const { data, error } = await supabase
        .from('terms')
        .select('content')
        .eq('id', TERMS_ID)
        .single();

if (!error && data?.content) {

      const replacedContent = data.content
        .replace(/\bRealm\b/g, 'Instance 1')
        .replace(/\bThrone\b/g, 'Instance 2');

      setContent(replacedContent);
    }
    setLoading(false);
  };

  fetchTerms();
}, []);

  if (isAdmin) return <TermsEditor />;

  if (loading) {
    return (
      <section className="py-12 text-center">
        <p className="text-gray-500">Loading terms...</p>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 max-w-5xl mx-auto">
      <p className="text-3xl font-bold mb-4">
          Throne Entertainment & Empire of Kingdoms – Terms of Use
      </p>
      <article
        className="prose prose-lg prose-purple max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
