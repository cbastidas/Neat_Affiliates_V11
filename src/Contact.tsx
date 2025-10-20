import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface ContactInfo {
  id: string;
  label: string;
  value: string;
  type: string;
  emoji_url?: string;
}

export default function Contact() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching contacts:', error.message);
      } else {
        setContacts(data || []);
      }
    };

    fetchContacts();
  }, []);

  return (
    <section id="Contact" className="text-center py-16 bg-gray-50 rounded-2xl border">
      <h2 className="text-3xl font-bold text-purple-700 mb-2">Contact Us</h2>
      <p className="text-gray-600 mb-8">
        Reach out to us via Email, Telegram or Microsoft Teams.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4 bg-grey-50 rounded-2xl border">
        {contacts.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            {item.emoji_url && (
              <img
                src={item.emoji_url}
                alt={item.label}
                className="w-14 h-14 object-contain mb-3 rounded-full shadow-sm"
              />
            )}
            <p className="text-lg font-semibold">{item.label}</p>
            <a
              href={
                item.type === 'email'
                  ? `mailto:${item.value}`
                  : item.type === 'telegram'
                  ? `https://t.me/${item.value.replace('@', '')}`
                  : item.value
              }
              className="text-blue-600 underline break-words mt-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.value}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
