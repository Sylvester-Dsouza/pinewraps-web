'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Address {
  id: string;
  street: string;
  apartment: string;
  emirates: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface AddressFormProps {
  address?: Address | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const emirates = [
  'ABU_DHABI',
  'AJMAN',
  'DUBAI',
  'FUJAIRAH',
  'RAS_AL_KHAIMAH',
  'SHARJAH',
  'UMM_AL_QUWAIN'
];

const emiratesDisplay = {
  ABU_DHABI: 'Abu Dhabi',
  AJMAN: 'Ajman',
  DUBAI: 'Dubai',
  FUJAIRAH: 'Fujairah',
  RAS_AL_KHAIMAH: 'Ras Al Khaimah',
  SHARJAH: 'Sharjah',
  UMM_AL_QUWAIN: 'Umm Al Quwain'
};

export default function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: address?.street || '',
    apartment: address?.apartment || '',
    emirates: address?.emirates || '',
    postalCode: address?.postalCode || '',
    isDefault: address?.isDefault || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value.toString());
    });
    // Add fixed country
    form.append('country', 'United Arab Emirates');
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">
          {address ? 'Edit Address' : 'Add New Address'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <textarea
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              rows={2}
              required
            />
          </div>

          {/* Apartment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apartment
            </label>
            <input
              type="text"
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Apartment, suite, unit, etc."
              required
            />
          </div>

          {/* Emirates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emirate
            </label>
            <select
              value={formData.emirates}
              onChange={(e) => setFormData({ ...formData, emirates: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
              <option value="">Select Emirate</option>
              {emirates.map((emirate) => (
                <option key={emirate} value={emirate}>
                  {emiratesDisplay[emirate]}
                </option>
              ))}
            </select>
          </div>

          {/* Postal Code and Country */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value="United Arab Emirates"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
                disabled
              />
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
              Set as default address
            </label>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900"
            >
              {address ? 'Update' : 'Add'} Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
