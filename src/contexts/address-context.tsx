'use client';

import { createContext, useContext, useState } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'react-hot-toast';

export interface Address {
  id: string;
  street: string;
  apartment: string;
  emirates: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  loading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  defaultAddress: Address | null;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAddresses = async () => {
    if (!user) {
      setAddresses([]);
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch addresses');

      const data = await response.json();
      setAddresses(data.data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(address)
      });

      if (!response.ok) throw new Error('Failed to add address');

      toast.success('Address added successfully');
      await fetchAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
      throw error;
    }
  };

  const updateAddress = async (id: string, address: Partial<Address>) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(address)
      });

      if (!response.ok) throw new Error('Failed to update address');

      toast.success('Address updated successfully');
      await fetchAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete address');

      toast.success('Address deleted successfully');
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    return updateAddress(id, { isDefault: true });
  };

  const defaultAddress = addresses.find(addr => addr.isDefault) || null;

  return (
    <AddressContext.Provider value={{
      addresses,
      loading,
      fetchAddresses,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      defaultAddress
    }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
}
