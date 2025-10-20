import { useEffect, useState } from 'react';
import './styles.css';
import BackgroundAnimation from './BackgroundAnimation';
import BrandCard from './BrandCard';
import { supabase } from './lib/supabaseClient';
import PublicBrandLogoGallery from './BrandsSection';
import AdminDashboard from './AdminDashboard';
import WhyJoin from './WhyJoin';
import AdminLogin from './AdminLogin';
import { Session } from '@supabase/supabase-js';
import Contact from './Contact';
import Faq from './Faq';
import LoginSignupModal from './LoginSignupModal';
import NewsImage from './NewsImage';
import HomeHero from "./HomeHero";
import BackToTopLogo from "./BackToTopLogo";



export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching brands:', error.message);
      } else {
        setBrands(data || []);
      }
    };

    fetchBrands();

    // 🟣 Admin Authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const isAdmin = window.location.search.includes('admin=true');

  if (isAdmin) {
    return session ? <AdminDashboard /> : <AdminLogin />;
  }

  const groupOrder = ['Realm', 'Throne', 'Neatplay', 'Neatplay-Latam'];
  const publicNames: Record<string, string> = {
  Realm: 'Instance 1',
  Throne: 'Instance 2',
  'Neatplay': 'Instance 3',
  'Neatplay-Latam': 'Instance 4',
};

  const groupedBrands = groupOrder.map((groupName) => ({
    groupName,
    brands: brands.filter((b) => b.group === groupName),
  }));

  // return


  return (
    
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Navbar */}
<nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 flex justify-between items-center flex-wrap z-20">

  {/* Logo - Takes to TOP */}
  <div
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
    }}
    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
  >
    <img src="/logo.png" alt="Logo" style={{ height: '28px' }} />
  </div>

    {/* Hamburguer Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-purple-700"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

{/* Desktop nav */}
<div className="hidden md:flex flex-wrap gap-2 justify-end w-full max-w-full">

  {[
    'WhyJoin',
    'News',
    'CommissionRate',
    'OurBrands',
    'Contact',
    'FAQ',
  ].map((id) => (
    <button
      key={id}
      onClick={() => scrollToSection(id)}
      className="text-gray-700 text-sm px-3 py-2 rounded hover:bg-gray-100 transition"
    >
      {id.replace(/([A-Z])/g, ' $1').trim()}
    </button>
  ))}

  <button
    onClick={() => setModalType('login')}
    className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-800"
  >
    Login
  </button>
  <button
    onClick={() => setModalType('signup')}
    className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
  >
    Signup
  </button>
</div>

</nav>


      {/* Mobile Menu Dropdown */}
{menuOpen && (
  <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-50 px-4 py-4">
    {[
      { id: 'WhyJoin', label: 'Why Join' },
      { id: 'News', label: 'News' },
      { id: 'CommissionRate', label: 'Commission Rate' },
      { id: 'OurBrands', label: 'Our Brands' },
      { id: 'Contact', label: 'Contact' },
      { id: 'FAQ', label: 'FAQ' },
    ].map(({ id, label }) => (
      <button
        key={id}
        onClick={() => scrollToSection(id)}
        className="block w-full text-left text-gray-700 py-2 px-2 rounded hover:bg-gray-100"
      >
        {label}
      </button>
    ))}

    {/* Login/Signup en mobile */}
    <button
      onClick={() => { setModalType('login'); setMenuOpen(false); }}
      className="block w-full text-left text-purple-700 py-2 px-2 font-medium hover:bg-purple-100"
    >
      Login
    </button>
    <button
      onClick={() => { setModalType('signup'); setMenuOpen(false); }}
      className="block w-full text-left text-green-700 py-2 px-2 font-medium hover:bg-green-100"
    >
      Signup
    </button>
  </div>
)}

      {/* Main content */}
      <div><BackgroundAnimation /></div>
      <div>
        <HomeHero
          onLogin={() => setModalType('login')}
          onSignup={() => setModalType('signup')}
          onScrollNext={() => scrollToSection('WhyJoin')}
        />
      </div>

      <main className="pt-24 max-w-5xl mx-auto px-4">

        

        {
          <WhyJoin />
        }

        {
          <NewsImage />
        }

{/* ✅ Commission Rate with dynamic cards */}
        <section id="CommissionRate" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderWidth: '2px', borderRadius: '1rem', backgroundColor: 'white'}}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#1f2937' }}>
              Commission Rate
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
              Earn more as you grow. Our laddered commission system rewards your success.
            </p>
            <div className="space-y-16 mt-8">
               {groupedBrands.map(({ groupName, brands }) => (
                 brands.length > 0 && (
                   <section
                     key={groupName}
                     className="p-6 bg-white rounded-lg border shadow-sm"
                   >
                     <h3 className="text-2xl sm:text-3xl font-bold text-purple-800 text-center mb-6 underline decoration-purple-300 underline-offset-4">
                       {publicNames[groupName] || groupName}
                     </h3>
            
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center bg-white rounded-2xl border">
              {brands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  id={brand.id}
                  logoUrl={brand.logo_url}
                  name={brand.name}
                  commissionTiers={brand.commission_tiers || []}
                  commissionType={brand.commission_type}
                  //about={brand.about}
                  isVisible={brand.is_visible}
                  commission_tiers_label={brand.commission_tiers_label}
                  onSave={() => {}}
                  isPublicView={true} // 👈 IMPORTANT: Public Mode
                />
              ))}
            </div>
        </section>
                 )
              ))}
            </div>
          </div>  
        </section>

        <div id="OurBrands" className="py-16">
        <PublicBrandLogoGallery />
        </div>

        

        <Contact />   
        <br></br> 

        <Faq />

      {/* Login and Signup Section */}
      <div className="text-center my-10">
          <button
            onClick={() => setModalType('login')}
            className="bg-purple-700 text-white px-5 py-2 rounded mx-2 hover:bg-purple-800"
          >
            Login
          </button>
          <button
            onClick={() => setModalType('signup')}
            className="bg-green-700 text-white px-5 py-2 rounded mx-2 hover:bg-green-800"
          >
            Signup
          </button>

          {modalType && (
            <LoginSignupModal
              isOpen={true}
              type={modalType}
              onClose={() => setModalType(null)}
            />
          )}
      </div>


    {/* Footer logo + mobile FAB */}
    <BackToTopLogo homeAnchorId="HomeHero" />
    </main>
    </div>
  );
}
