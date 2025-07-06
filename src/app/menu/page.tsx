'use client';

import { useEffect, useState } from 'react';
import API from '@/lib/api';
import MenuTable from '@/components/MenuTable';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
};

function isApiError(error: unknown): error is { response: { status: number } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    (error as { response: unknown }).response !== null &&
    'status' in (error as { response: { status?: unknown } }).response
  );
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await API.get('/menu');
        setMenu(res.data);
      } catch (err) {
        if (isApiError(err) && err.response.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [router]);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Menu Items</h1>
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : (
          <MenuTable items={menu} setMenu={setMenu} />
        )}
      </div>
    </>
  );
}
