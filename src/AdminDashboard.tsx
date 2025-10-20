import { useEffect, useRef, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import BrandCard from './BrandCard.tsx';
import AddBrandModal from './AddBrandModal.tsx';
import WhyJoinEditor from './WhyJoinEditor';
import ContactEditor from './ContactEditor';
import FaqEditor from './FaqEditor';
import AuthEditor from './AuthEditor';
import LogoVisibilityManager from './LogoVisibilityManager';
import './styles.css';

interface CommissionTier {
  range: string;
  rate: string;
}

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  commission_text: string;
  commission_type: string;
  about: string;
  is_visible: boolean;
  commission_tiers: CommissionTier[];
  group?: string;
}

export default function AdminDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const whyJoinRef = useRef<HTMLDivElement>(null);
  const commissionRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading brands:', error);
    } else {
      setBrands(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="p-6">
      {/* NAVBAR FIXED */}
      <div className="fixed top-0 left-0 w-full bg-white shadow z-20 p-4 flex justify-between items-center">
         <div className="flex items-center gap-4">
    <img
      src="./logo.png"
      alt="Logo"
      className="h-10 cursor-pointer"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    />
    <h1 className="text-xl font-bold">Admin Dashboard</h1>
    <button
      onClick={handleLogout}
      className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
    >
      Logout
    </button>
  </div>
        <div style=

              {{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#374151',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}>
          <button style=

              {{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#374151',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }} onClick={() => whyJoinRef.current?.scrollIntoView({ behavior: 'smooth' })}>Why Join</button>
          <button style=

              {{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#374151',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }}  onClick={() => commissionRef.current?.scrollIntoView({ behavior: 'smooth' })}>Commission Rate</button>
          <button style=

              {{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#374151',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }} onClick={() => brandsRef.current?.scrollIntoView({ behavior: 'smooth' })}>Our Brands</button>
          <button style=

              {{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#374151',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }} onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}>Contact</button>
          <button style=

              {{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                color: '#374151',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                transition: 'background 0.2s, color 0.2s',
                whiteSpace: 'nowrap',
              }} onClick={() => faqRef.current?.scrollIntoView({ behavior: 'smooth' })}>FAQ</button>
        </div>
      </div>

      <div className="pt-28 space-y-16">
        <section ref={whyJoinRef}>
          <h2 className="text-2xl font-bold text-center mb-6"></h2>
          <WhyJoinEditor />
        </section>
        


        <section ref={commissionRef}>
          <h2 className="text-2xl font-bold text-center mb-6">Commission Rate</h2>
          <AddBrandModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={fetchBrands} />
          <div className="flex justify-center mb-4">
            <button onClick={() => setShowAddModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              ➕ Add Brand
            </button>
          </div>
          {loading ? (
            <p className="text-center">Loading brands...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
              {brands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  id={brand.id}
                  logoUrl={brand.logo_url}
                  name={brand.name}
                  commissionTiers={brand.commission_tiers || []}
                  commissionType={brand.commission_type}
                  isVisible={brand.is_visible}
                  onSave={fetchBrands}
                  group={brand.group}
                />
              ))}
            </div>
          )}
        </section>

        <section ref={brandsRef}>
          <h2 className="text-2xl font-bold text-center mb-6"></h2>
          <LogoVisibilityManager />
        </section>

        <section ref={contactRef}>
          <h2 className="text-2xl font-bold text-center mb-6">📬 Contact Admin Editor</h2>
          <ContactEditor />
        </section>

        <section ref={faqRef}>
          <h2 className="text-2xl font-bold text-center mb-6">❓ FAQ Admin Editor</h2>
          <FaqEditor />
        </section>

        <section ref={loginRef}>
          <h2 className="text-2xl font-bold text-center mb-6">🔐 Login/Signup Admin Editor</h2>
          <AuthEditor/>
        </section>
      </div>
    </div>
  );
}
