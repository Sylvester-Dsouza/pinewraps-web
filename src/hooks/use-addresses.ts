import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { UserAddress } from '@/types/address';
import { toast } from 'react-hot-toast';

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      console.log('No user found, skipping fetch');
      return;
    }
    
    setLoading(true);
    console.log('Starting to fetch addresses...');

    try {
      const token = await user.getIdToken();
      console.log('Got auth token, making API request...');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch addresses: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      const { success, data, error } = responseData;
      
      if (!success || error) {
        throw new Error(error?.message || 'Failed to fetch addresses');
      }

      console.log('Setting addresses:', data);
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addAddress = useCallback(async (address: Partial<UserAddress>) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const token = await user.getIdToken();
      const isUpdate = Boolean(address.id);
      const url = isUpdate 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses/${address.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses`;

      console.log(`${isUpdate ? 'Updating' : 'Adding'} address:`, address);
      
      const response = await fetch(url, {
        method: isUpdate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(address)
      });

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to ${isUpdate ? 'update' : 'add'} address: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      const { success, error } = responseData;
      
      if (!success || error) {
        throw new Error(error?.message || `Failed to ${isUpdate ? 'update' : 'add'} address`);
      }

      // Refresh the addresses list
      await fetchAddresses();
      toast.success(`Address ${isUpdate ? 'updated' : 'added'} successfully`);
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(`Failed to ${address.id ? 'update' : 'add'} address`);
      throw error;
    }
  }, [user, fetchAddresses]);

  const deleteAddress = useCallback(async (addressId: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete address: ${response.status}`);
      }

      const responseData = await response.json();
      const { success, error } = responseData;

      if (!success || error) {
        throw new Error(error?.message || 'Failed to delete address');
      }

      // Refresh the addresses list
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }, [user, fetchAddresses]);

  const setDefaultAddress = useCallback(async (addressId: string) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isDefault: true })
      });

      if (!response.ok) {
        throw new Error(`Failed to set default address: ${response.status}`);
      }

      const responseData = await response.json();
      const { success, error } = responseData;

      if (!success || error) {
        throw new Error(error?.message || 'Failed to set default address');
      }

      // Refresh the addresses list
      await fetchAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }, [user, fetchAddresses]);

  return {
    addresses,
    loading,
    fetchAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress
  };
}
