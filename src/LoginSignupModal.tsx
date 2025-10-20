// LoginSignupModal.tsx
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { createPortal } from 'react-dom';

interface AuthLink {
  id: number;
  instance: string;
  order: number;
  login: string;
  signup: string;
}

interface Brand {
  id: number;
  name: string;
  group: string; // instance name
}

interface Props {
  isOpen: boolean;
  type: 'login' | 'signup'; // Type of modal
  onClose: () => void;
}

export default function LoginSignupModal({ isOpen, type, onClose }: Props) {
  const [authLinks, setAuthLinks] = useState<AuthLink[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Fetch both auth links and brands from Supabase
  const fetchData = async () => {
    const { data: authData } = await supabase
      .from('auth_links')
      .select('*')
      .order('order');

    const { data: brandData } = await supabase
      .from('brands')
      .select('id, name, group');

    if (authData) setAuthLinks(authData);
    if (brandData) setBrands(brandData);
  };

  // Group auth links by instance name
  const groupedLinks = authLinks.reduce((acc: Record<string, AuthLink[]>, item) => {
    acc[item.instance] = acc[item.instance] || [];
    acc[item.instance].push(item);
    return acc;
  }, {});

  if (!isOpen) return null;

return createPortal(
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>
      <h3 className="text-xl font-bold mb-4 text-center capitalize">{type} Links</h3>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {Object.entries(groupedLinks).map(([instance, links]) => {
          const associatedBrands = brands
            .filter((b) => b.group === instance)
            .map((b) => b.name)
            .join(', ') || 'No brands associated';

          const showTooltip = instance === 'Realm' || instance === 'Throne';
          const tooltipText = showTooltip
            ? `Brands for this instance: ${associatedBrands}`
            : undefined;

          return (
            <a
              key={instance}
              href={type === 'login' ? links[0].login : links[0].signup}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div
                title={tooltipText}
                className="border p-4 rounded shadow hover:bg-purple-50 transition duration-300 cursor-pointer text-center"
              >
                <p className="font-bold">{instance}</p>
                <p className="text-sm text-gray-600">
                  {type === 'login' ? 'Login' : 'Signup'} Link
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  </div>,
  document.body
);

}
