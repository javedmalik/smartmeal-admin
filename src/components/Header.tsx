'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center mb-6 shadow">
      <span className="text-xl font-bold tracking-wide cursor-pointer" onClick={() => router.push('/menu')}>
        SmartMeal Admin
      </span>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-700 px-4 py-2 rounded font-medium hover:bg-blue-100"
      >
        Logout
      </button>
    </header>
  );
}
