import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react'; 

interface NavbarProps {
  onOpenModal: (type: 'login' | 'signup') => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsAdmin(params.get('admin') === 'true');
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-4 flex items-center justify-between z-20">
      {/* Logo */}
      <div
        onClick={() => {
          window.location.href = isAdmin ? '/?admin=true' : '/';
        }}
        className="cursor-pointer flex items-center gap-3"
      >
        <img src="/logo.png" alt="Logo" className="h-7" />
        {isAdmin && (
          <span className="text-lg font-bold text-gray-800 whitespace-nowrap">
            Admin Dashboard
          </span>
        )}
      </div>

      {/* Hamburguer Menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-purple-700"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navbar Desktop */}
      <div className={`hidden md:flex gap-2 flex-wrap justify-end`}>
        {[
          'WhyJoin',
          'CommissionRate',
          'Our Brands',
          'Contact',
          'FAQ',
          'Login',
          'Signup',
        ].map((id) => {
          const targetId =
            isAdmin && id === 'WhyJoin' ? 'why-join-editor'
              : id === 'Our Brands' ? 'OurBrands'
              : id;

          const isLogin = id === 'Login';
          const isSignup = id === 'Signup';

          return (
            <button
              key={id}
              onClick={() => {
                if (isLogin) onOpenModal('login');
                else if (isSignup) onOpenModal('signup');
                else scrollToSection(targetId);
              }}
              className="text-gray-700 text-sm px-3 py-2 rounded hover:bg-gray-100 transition"
            >
              {id === 'Signup' ? <strong>Signup</strong> : id.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          );
        })}
      </div>

      {/* Navbar Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md px-6 py-4 flex flex-col gap-2 z-40">
          {[
            'WhyJoin',
            'CommissionRate',
            'Our Brands',
            'Contact',
            'FAQ',
            'Login',
            'Signup',
          ].map((id) => {
            const targetId =
              isAdmin && id === 'WhyJoin' ? 'why-join-editor'
                : id === 'Our Brands' ? 'OurBrands'
                : id;

            const isLogin = id === 'Login';
            const isSignup = id === 'Signup';

            return (
              <button
                key={id}
                onClick={() => {
                  if (isLogin) onOpenModal('login');
                  else if (isSignup) onOpenModal('signup');
                  else scrollToSection(targetId);
                }}
                className="text-gray-700 text-sm text-left px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                {id === 'Signup' ? <strong>Signup</strong> : id.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
