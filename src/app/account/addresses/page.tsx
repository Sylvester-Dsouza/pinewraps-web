'use client';

import { useEffect, useState } from 'react';
import { useAddresses } from '@/hooks/use-addresses';
import AddressForm from '@/components/forms/address-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Trash, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { UserAddress } from '@/types/address';

export default function AddressesPage() {
  const { addresses, loading, fetchAddresses, deleteAddress, setDefaultAddress } = useAddresses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<UserAddress | null>(null);

  useEffect(() => {
    fetchAddresses().then(() => {
      toast.success('Addresses fetched');
    }).catch(() => {
      toast.error('Error fetching addresses');
    });
  }, [fetchAddresses]);

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      await fetchAddresses(); // Refresh the list after deletion
      toast.success('Address deleted successfully');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      await fetchAddresses(); // Refresh the list after setting default
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default address');
    }
  };

  const handleEditAddress = (address: UserAddress) => {
    setAddressToEdit(address);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setAddressToEdit(null);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Addresses</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add New Address</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No addresses added yet</p>
          <Button onClick={() => setIsDialogOpen(true)}>Add Address</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="flex items-start justify-between border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 text-gray-500" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">
                      {address.street}
                    </h3>
                    {address.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 mt-1">
                    {address.apartment && `${address.apartment}, `}
                    {address.emirate}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefaultAddress(address.id)}
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="bg-white p-4 gap-4 max-w-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {addressToEdit ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            onSuccess={async () => {
              handleCloseDialog();
              await fetchAddresses(); // Refresh the list after adding/editing
              toast.success('Address added/edited successfully');
            }}
            existingAddress={addressToEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
