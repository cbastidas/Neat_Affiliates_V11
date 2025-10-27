import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TermsIndex() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const terms = [
    { label: 'Instance 1', path: 'realm-terms-of-use' },
    { label: 'Casinomaxi', path: 'casinomaxi-terms-of-use' },
    { label: 'Instance 2', path: 'throne-terms-of-use' },
    { label: 'Vidavegas', path: 'vidavegas-terms-of-use' },
    { label: 'Bluffbet', path: 'bluffbet-terms-of-use' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-900">NeatAffiliates – Terms and Conditions</h1>
      <div className="text-left space-y-4">
        {terms.map((item) => (
          <div
            key={item.path}
            onClick={() =>
              navigate(`/terms/${item.path}${isAdmin ? '?admin=true' : ''}`)
            }
            className="cursor-pointer p-4 bg-white shadow hover:bg-purple-50 rounded-md border"
          >
            <h3 className="text-lg font-semibold text-purple-800">{item.label}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
