'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  console.log('APIURL: ', API);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/Auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      router.push('/menu');
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">SmartMeal Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
