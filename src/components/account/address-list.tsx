'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';

const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Umm Al Quwain',
  'Ras Al Khaimah',
  'Fujairah'
];

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function AddressList() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    apartment: '',
    city: 'United Arab Emirates',
    state: '',
    zipCode: '',
    country: 'UAE',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch addresses');

      const data = await response.json();
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const url = editingAddress
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses/${editingAddress.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses`;

      const response = await fetch(url, {
        method: editingAddress ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to save address');

      toast.success(editingAddress ? 'Address updated successfully' : 'Address added successfully');
      setIsEditing(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address');
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      apartment: address.apartment || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete address');

      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: 'United Arab Emirates',
      state: '',
      zipCode: '',
      country: 'UAE',
      phone: '',
      isDefault: false
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Addresses</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Address
        </Button>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-black">{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="bg-gray-50 text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="bg-gray-50 text-black"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Street Address</label>
              <Input
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
                className="bg-gray-50 text-black"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Apartment/Suite (Optional)</label>
              <Input
                value={formData.apartment}
                onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                className="bg-gray-50 text-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">State/Emirate</label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger className="bg-gray-50 text-black border-gray-200">
                    <SelectValue placeholder="Select emirate" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    {EMIRATES.map((emirate) => (
                      <SelectItem 
                        key={emirate} 
                        value={emirate}
                        className="text-black hover:bg-gray-100"
                      >
                        {emirate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Country</label>
                <Input
                  value="United Arab Emirates"
                  disabled
                  className="bg-gray-100 text-gray-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  required
                  className="bg-gray-50 text-black"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="bg-gray-50 text-black"
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm text-gray-700">Set as default address</span>
            </label>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingAddress ? 'Save Changes' : 'Add Address'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No addresses saved yet</p>
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-gray-50 rounded-lg p-4 flex justify-between items-start"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-black">
                    {address.firstName} {address.lastName}
                  </span>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{address.phone}</p>
                <p className="text-gray-600 text-sm">{address.street}</p>
                {address.apartment && (
                  <p className="text-gray-600 text-sm">{address.apartment}</p>
                )}
                <p className="text-gray-600 text-sm">
                  {address.state}, United Arab Emirates {address.zipCode}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address)}
                  className="text-gray-600 hover:text-black"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
