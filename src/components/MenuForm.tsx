'use client';

import { useForm } from 'react-hook-form';
import { MenuItem } from '@/app/menu/page';
import React from 'react';

type MenuFormProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<MenuItem, 'id' | 'createdAt'>, id?: number) => void;
  initialData?: MenuItem | null;
};

export default function MenuForm({ open, onClose, onSave, initialData }: MenuFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<MenuItem, 'id' | 'createdAt'>>({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      isAvailable: true,
    }
  });

  // Reset form fields when opening or changing data
  React.useEffect(() => {
    if (open) {
      reset(initialData || { name: '', description: '', price: 0, isAvailable: true });
    }
  }, [open, initialData, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit((data) => {
          onSave(data, initialData?.id);
          onClose();
        })}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>
        <div className="mb-4">
          <label className="block mb-1">Name</label>
          <input
            {...register('name', { required: true })}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Price (₹)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: true, min: 1 })}
            className="w-full border border-gray-300 rounded p-2"
          />
          {errors.price && <p className="text-red-500 text-sm">Enter a valid price</p>}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            {...register('isAvailable')}
            className="mr-2"
            defaultChecked={initialData?.isAvailable ?? true}
          />
          <label>Available</label>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            {initialData ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
