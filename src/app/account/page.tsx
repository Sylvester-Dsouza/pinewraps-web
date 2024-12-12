'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Mail, Phone, Lock, LogOut, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { getFullPhoneNumber, validatePhone, formatPhoneNumber } from '@/lib/format-phone';

export default function ProfilePage() {
  const { user, customerData, signOut, updateUserProfile, updateUserPassword, isEmailUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [firstName, setFirstName] = useState(customerData?.firstName || '');
  const [lastName, setLastName] = useState(customerData?.lastName || '');
  const [phone, setPhone] = useState(customerData?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(customerData?.dateOfBirth || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (customerData) {
      setFirstName(customerData.firstName);
      setLastName(customerData.lastName);
      setPhone(formatPhoneNumber(customerData.phone) || '');
      setDateOfBirth(customerData.dateOfBirth || '');
    }
  }, [customerData]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return 'Not set';
    try {
      return format(new Date(date), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Validate phone number
      if (phone && !validatePhone(phone)) {
        toast.error('Please enter a valid UAE mobile number');
        return;
      }

      // Validate age
      if (dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        
        if (age < 18) {
          toast.error('You must be at least 18 years old');
          return;
        }
      }

      await updateUserProfile({
        firstName,
        lastName,
        phone: getFullPhoneNumber(phone),
        dateOfBirth
      });
      setIsEditingProfile(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await updateUserPassword(currentPassword, newPassword);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Loading...'}
            </h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
            Edit Profile
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <User className="h-5 w-5" />
            <span>{customerData ? `${customerData.firstName} ${customerData.lastName}` : 'Loading...'}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="h-5 w-5" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Phone className="h-5 w-5" />
            <span>{customerData?.phone || 'Not set'}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="h-5 w-5" />
            <span>{customerData?.dateOfBirth ? formatDate(customerData.dateOfBirth) : 'Not set'}</span>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent className="p-4 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative flex items-center mt-1">
                  <div className="absolute left-3 text-gray-500">+971</div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const formattedNumber = formatPhoneNumber(e.target.value);
                      setPhone(formattedNumber);
                    }}
                    placeholder="501234567"
                    className="pl-16"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Enter your mobile number without country code (e.g., 501234567)</p>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1"
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
                <p className="mt-1 text-sm text-gray-500">You must be at least 18 years old</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProfile}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Security */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Security</h3>
          {isEmailUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3 text-gray-600">
          <Lock className="h-5 w-5" />
          <span>
            {isEmailUser
              ? 'Email and Password login'
              : 'Signed in with Google'}
          </span>
        </div>

        {/* Change Password Dialog */}
        <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="currentPassword" className="text-right text-sm font-medium text-gray-700">
                  Current
                </label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="newPassword" className="text-right text-sm font-medium text-gray-700">
                  New
                </label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="confirmPassword" className="text-right text-sm font-medium text-gray-700">
                  Confirm
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Account Actions</h3>
        <div className="space-y-4">
          <Button 
            variant="destructive" 
            className="w-full sm:w-auto"
            onClick={handleSignOut}
            disabled={loading}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
