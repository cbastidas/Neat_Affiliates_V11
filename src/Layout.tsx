import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  onOpenModal: (type: 'login' | 'signup') => void;
}

export default function Layout({ onOpenModal }: LayoutProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Navbar onOpenModal={onOpenModal} />
      <main style={{ paddingTop: '6rem' }}>
        <Outlet />
      </main>
      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}
