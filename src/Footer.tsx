// Footer.tsx
import { useLocation, useNavigate } from 'react-router-dom';

interface FooterProps {
  onOpenModal: (type: 'login' | 'signup') => void;
}


export default function Footer({  }: FooterProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.search.includes('admin=true');

  return (
    <footer className="text-center py-8 text-gray-600 text-sm">
      
      <button
        onClick={() => navigate(isAdmin ? '/terms?admin=true' : '/terms')}
        className="text-purple-600 underline"
      >
        Terms and Conditions
      </button>

      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Neat Affiliates. All rights reserved.
      </p>
    </footer>
  );
}