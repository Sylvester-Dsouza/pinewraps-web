'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddresses } from '@/hooks/use-addresses';
import { Emirates, UserAddress } from '@/types/address';

interface AddressFormProps {
  onSuccess?: () => void;
  existingAddress?: UserAddress | null;
}

const EMIRATES: { value: Emirates; label: string }[] = [
  { value: 'DUBAI', label: 'Dubai' },
  { value: 'ABU_DHABI', label: 'Abu Dhabi' },
  { value: 'SHARJAH', label: 'Sharjah' },
  { value: 'AJMAN', label: 'Ajman' },
  { value: 'UMM_AL_QUWAIN', label: 'Umm Al Quwain' },
  { value: 'RAS_AL_KHAIMAH', label: 'Ras Al Khaimah' },
  { value: 'FUJAIRAH', label: 'Fujairah' },
];

const DEFAULT_FORM_DATA = {
  street: '',
  apartment: '',
  emirate: 'DUBAI' as Emirates,
  city: 'Dubai',
  pincode: '',
  country: 'United Arab Emirates',
  type: 'SHIPPING' as 'SHIPPING' | 'BILLING'
};

export default function AddressForm({ onSuccess, existingAddress }: AddressFormProps) {
  const { addAddress } = useAddresses();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    if (existingAddress) {
      return {
        street: existingAddress.street,
        apartment: existingAddress.apartment,
        emirate: existingAddress.emirate,
        city: existingAddress.city || 'Dubai',
        pincode: existingAddress.pincode || '',
        country: existingAddress.country || 'United Arab Emirates',
        type: existingAddress.type || 'SHIPPING'
      };
    }
    return DEFAULT_FORM_DATA;
  });

  // Update form when existingAddress changes
  useEffect(() => {
    if (existingAddress) {
      console.log('Setting form data from existing address:', existingAddress);
      setFormData({
        street: existingAddress.street,
        apartment: existingAddress.apartment,
        emirate: existingAddress.emirate,
        city: existingAddress.city || 'Dubai',
        pincode: existingAddress.pincode || '',
        country: existingAddress.country || 'United Arab Emirates',
        type: existingAddress.type || 'SHIPPING'
      });
    } else {
      console.log('Resetting form to default data');
      setFormData(DEFAULT_FORM_DATA);
    }
  }, [existingAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting form data:', formData);
      await addAddress({
        ...formData,
        id: existingAddress?.id,
        isDefault: existingAddress?.isDefault || false,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            placeholder="Enter street address"
            required
            className="bg-white text-gray-900 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
            Apartment
          </label>
          <Input
            id="apartment"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            placeholder="Enter apartment/suite"
            required
            className="bg-white text-gray-900 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="emirate" className="block text-sm font-medium text-gray-700">
            Emirate
          </label>
          <Select
            value={formData.emirate}
            onValueChange={(value) => setFormData({ ...formData, emirate: value as Emirates })}
          >
            <SelectTrigger id="emirate" className="bg-white text-gray-900 border-gray-300">
              <SelectValue placeholder="Select emirate" />
            </SelectTrigger>
            <SelectContent>
              {EMIRATES.map((emirate) => (
                <SelectItem key={emirate.value} value={emirate.value}>
                  {emirate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
            required
            className="bg-white text-gray-900 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
            Postal Code
          </label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            placeholder="Enter postal code"
            required
            className="bg-white text-gray-900 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <Input
            id="country"
            value={formData.country}
            disabled
            className="bg-gray-50 text-gray-500 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Address Type
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value as 'SHIPPING' | 'BILLING' })}
          >
            <SelectTrigger id="type" className="bg-white text-gray-900 border-gray-300">
              <SelectValue placeholder="Select address type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SHIPPING">Shipping Address</SelectItem>
              <SelectItem value="BILLING">Billing Address</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : existingAddress ? 'Update Address' : 'Add Address'}
        </Button>
      </div>
    </form>
  );
}
