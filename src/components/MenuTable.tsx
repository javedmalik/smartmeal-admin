'use client';

import { MenuItem } from '@/app/menu/page';
import { Dispatch, SetStateAction, useState } from 'react';
import MenuForm from './MenuForm';
import API from '@/lib/api';
import { toast } from 'react-toastify';

type Props = {
  items: MenuItem[];
  setMenu: Dispatch<SetStateAction<MenuItem[]>>;
};

export default function MenuTable({ items, setMenu }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  const handleAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      setMenu(menu => menu.filter(i => i.id !== id));
      toast.success('Item deleted!');
    } catch {
      toast.error('Delete failed.');
    }
  };

  const handleSave = async (data: Omit<MenuItem, 'id' | 'createdAt'>, id?: number) => {
    try {
      if (id) {
        // Edit existing item
        await API.put(`/menu/${id}`, { ...data, id });
        setMenu(menu => menu.map(i => (i.id === id ? { ...i, ...data } : i)));
        toast.success('Item updated!');
      } else {
        // Add new item
        const res = await API.post('/menu', data);
        // Optionally fetch again or just append
        setMenu(menu => [...menu, { ...data, id: Math.random(), createdAt: new Date().toISOString() }]);
        toast.success('Item added!');
      }
    } catch {
      toast.error('Save failed.');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded">
          + Add Menu Item
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Available</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.description}</td>
                <td className="p-3">₹{Number(item.price).toFixed(2)}</td>
                <td className="p-3">{item.isAvailable ? 'Yes' : 'No'}</td>
                <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <button className="text-blue-600 hover:underline" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="ml-2 text-red-600 hover:underline" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">No menu items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <MenuForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        initialData={editItem}
      />
    </div>
  );
}
