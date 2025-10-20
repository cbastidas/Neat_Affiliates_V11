import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import App from './App';
import Testimonials from './Testimonials';
import Providers from './Providers';
import TermsIndex from './TermsIndex';
import TermsViewer from './TermsViewer';
import { useState } from 'react';
import LoginSignupModal from './LoginSignupModal';

export default function Root() {
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout onOpenModal={setModalType} />}>
            <Route path="/" element={<App />} />
            <Route path="/terms" element={<TermsIndex />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/terms/:slug" element={<TermsViewer />} />
          </Route>
        </Routes>
      </BrowserRouter>

      {modalType && (
        <LoginSignupModal
          isOpen={true}
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}
