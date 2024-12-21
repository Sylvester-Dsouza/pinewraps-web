'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { getFullPhoneNumber, formatPhoneNumber } from '@/lib/format-phone';
import { getAvailableTimeSlots, deliveryConfig, getStorePickupSlots } from '@/config/delivery-slots';

export interface ShippingDetails {
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  emirate: string;
  pincode?: string;
  paymentMethod: 'CREDIT_CARD' | 'CASH' | 'BANK_TRANSFER';
  deliveryDate: string;
  deliveryTime: string;
  isGift: boolean;
  giftMessage?: string;
  giftRecipientName?: string;
  giftRecipientPhone?: string;
  deliveryMethod: 'delivery' | 'pickup';
  firstName: string;
  lastName: string;
}

interface ShippingFormProps {
  onSubmit: (details: ShippingDetails) => void;
  onDeliveryMethodChange: (method: 'delivery' | 'pickup', emirate: string) => void;
}

const emirates = Object.keys(deliveryConfig).sort();

export default function ShippingForm({ onSubmit, onDeliveryMethodChange }: ShippingFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ShippingDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    emirate: '',
    pincode: '',
    paymentMethod: 'CREDIT_CARD', // Set default payment method to CREDIT_CARD
    deliveryDate: '',
    deliveryTime: '',
    isGift: false,
    giftMessage: '',
    giftRecipientName: '',
    giftRecipientPhone: '',
    deliveryMethod: 'delivery'
  });
  const [customerData, setCustomerData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
  }>({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<ShippingDetails>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        // Set email immediately when user is available
        if (user?.email) {
          setFormData(prev => ({
            ...prev,
            email: user.email
          }));
        }

        if (!user) {
          setIsLoading(false);
          return;
        }

        const token = await user.getIdToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/customers/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const customerData = {
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              phone: data.data.phone || ''
            };
            setCustomerData(customerData);
            setFormData(prev => ({
              ...prev,
              ...customerData,
              phone: customerData.phone ? formatPhoneNumber(customerData.phone) : ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.error('Failed to load customer data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [user]);

  useEffect(() => {
    // Update available time slots when delivery method or date changes
    if (formData.deliveryDate) {
      const date = new Date(formData.deliveryDate);
      const slots = formData.deliveryMethod === 'pickup' 
        ? getStorePickupSlots(date)
        : getAvailableTimeSlots(formData.emirate, date);
      setAvailableTimeSlots(slots);
    }
  }, [formData.deliveryDate, formData.deliveryMethod, formData.emirate]);

  const validateForm = () => {
    const newErrors: Partial<ShippingDetails> = {};

    // Only validate address-related fields if delivery is selected
    if (formData.deliveryMethod === 'delivery') {
      if (!formData.address) newErrors.address = 'Street address is required';
      if (!formData.emirate) newErrors.emirate = 'Emirate selection is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
      if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time slot is required';

      // Check if the selected time slot is still available
      if (formData.deliveryTime && formData.emirate && formData.deliveryDate) {
        const availableSlots = getAvailableTimeSlots(formData.emirate, new Date(formData.deliveryDate));
        if (!availableSlots.includes(formData.deliveryTime)) {
          newErrors.deliveryTime = 'Selected time slot is no longer available';
        }
      }
    }
    
    // Phone validation is always required
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 9) {
      newErrors.phone = 'Please enter a valid 9-digit UAE phone number';
    }

    // Pickup time slot is required
    if (formData.deliveryMethod === 'pickup' && !formData.deliveryTime) {
      newErrors.deliveryTime = 'Pickup time slot is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clear any existing errors
    setErrors({});

    // Include firstName and lastName from customerData in the submission
    const submissionData = {
      ...formData,
      firstName: customerData.firstName,
      lastName: customerData.lastName
    };

    // Call the onSubmit callback with the form data
    onSubmit({
      ...submissionData,
      city: submissionData.city || 'United Arab Emirates', // Ensure city has a default value
      paymentMethod: submissionData.paymentMethod as 'CREDIT_CARD' | 'CASH' | 'BANK_TRANSFER',
      deliveryMethod: submissionData.deliveryMethod.toLowerCase() as 'delivery' | 'pickup',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Prevent email, firstName, and lastName fields from being changed
    if (name === 'email' || name === 'firstName' || name === 'lastName') {
      return;
    }

    if (name === 'phone') {
      // Format phone number without country code
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Handle delivery method and emirate changes
    if (name === 'deliveryMethod' || name === 'emirate') {
      onDeliveryMethodChange(
        name === 'deliveryMethod' ? value as 'delivery' | 'pickup' : formData.deliveryMethod,
        name === 'emirate' ? value : formData.emirate
      );
    }

    // Clear error when user starts typing
    if (errors[name as keyof ShippingDetails]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDeliveryMethodChange = (method: 'delivery' | 'pickup') => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: method,
      deliveryTime: '', // Reset delivery time when changing method
      emirate: method === 'pickup' ? 'Dubai' : prev.emirate // Set Dubai for pickup
    }));
    onDeliveryMethodChange(method, method === 'pickup' ? 'Dubai' : formData.emirate);
  };

  const inputClasses = (fieldName: string) => `
    w-full px-3 py-2 border border-gray-300 rounded-md
    shadow-sm text-base
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    transition duration-150 ease-in-out
    ${(fieldName === 'email' || fieldName === 'firstName' || fieldName === 'lastName') ? 'bg-gray-50' : 'bg-white'}
  `;

  const labelClasses = 'block text-sm font-semibold text-gray-700 mb-1';
  const sectionClasses = 'bg-white p-6 rounded-lg shadow-sm space-y-6 border border-gray-100';
  const sectionTitleClasses = 'text-xl font-bold text-gray-900 mb-6';

  // Get tomorrow's date for minimum date selection in Dubai timezone
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 4); // Adjust to Dubai time
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-8" id="shipping-form">
      {isLoading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Contact Information */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>Contact Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={labelClasses}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClasses('firstName')}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClasses}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClasses('lastName')}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses('email')}
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClasses}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputClasses('phone')}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Gift Options */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>Send This Order as a Gift</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isGift"
                    checked={formData.isGift}
                    onChange={(e) => {
                      const isGift = e.target.checked;
                      setFormData(prev => ({ ...prev, isGift }));
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="isGift" className="ml-3 text-sm font-medium text-gray-700">
                    This is a Gift
                  </label>
                </div>
                
                {formData.isGift && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="giftRecipientName" className={labelClasses}>
                          Recipient's Name
                        </label>
                        <input
                          type="text"
                          id="giftRecipientName"
                          name="giftRecipientName"
                          value={formData.giftRecipientName}
                          onChange={handleChange}
                          className={inputClasses('giftRecipientName')}
                          placeholder="Enter recipient's name"
                        />
                      </div>

                      <div>
                        <label htmlFor="giftRecipientPhone" className={labelClasses}>
                          Recipient's Phone
                        </label>
                        <input
                          type="tel"
                          id="giftRecipientPhone"
                          name="giftRecipientPhone"
                          value={formData.giftRecipientPhone}
                          onChange={handleChange}
                          className={inputClasses('giftRecipientPhone')}
                          placeholder="Enter recipient's phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="giftMessage" className={labelClasses}>
                        Greeting Message
                      </label>
                      <textarea
                        id="giftMessage"
                        name="giftMessage"
                        rows={3}
                        value={formData.giftMessage}
                        onChange={handleChange}
                        className={`${inputClasses('giftMessage')} resize-none`}
                        placeholder="Write your gift message here"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Your message will be printed on a gift card and included with the order
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className={sectionClasses}>
            <h2 className={sectionTitleClasses}>Delivery Options</h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="deliveryMethod" className={labelClasses}>
                  Delivery Method
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.deliveryMethod === 'pickup'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => handleDeliveryMethodChange('pickup')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="pickup"
                        name="deliveryMethod"
                        value="pickup"
                        checked={formData.deliveryMethod === 'pickup'}
                        onChange={handleChange}
                        className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="pickup" className="text-base font-medium text-gray-900">
                        Store Pickup
                      </label>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.deliveryMethod === 'delivery'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                    onClick={() => handleDeliveryMethodChange('delivery')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        id="delivery"
                        name="deliveryMethod"
                        value="delivery"
                        checked={formData.deliveryMethod === 'delivery'}
                        onChange={handleChange}
                        className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="delivery" className="text-base font-medium text-gray-900">
                        Standard Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Date and Time */}
              {formData.deliveryMethod === 'pickup' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="deliveryDate" className={labelClasses}>
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      min={minDate}
                      className={inputClasses('deliveryDate')}
                    />
                  </div>
                  <div>
                    <label htmlFor="deliveryTime" className={labelClasses}>
                      Pickup Time
                    </label>
                    <select
                      id="deliveryTime"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className={inputClasses('deliveryTime')}
                      required
                    >
                      <option value="">Select Time Slot</option>
                      {availableTimeSlots.map((slot, index) => (
                        <option key={index} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {errors.deliveryTime && (
                      <p className="mt-2 text-sm text-red-600">{errors.deliveryTime}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address - Only show when delivery is selected */}
          {formData.deliveryMethod === 'delivery' && (
            <div className={sectionClasses}>
              <h2 className={sectionTitleClasses}>Shipping Address</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="address" className={labelClasses}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House No, Building Name, Street"
                    className={inputClasses('address')}
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="apartment" className={labelClasses}>
                    Apartment/Suite/Unit (Optional)
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, or unit number"
                    className={inputClasses('apartment')}
                  />
                </div>

                <div>
                  <label htmlFor="emirate" className={labelClasses}>
                    Emirate
                  </label>
                  <select
                    id="emirate"
                    name="emirate"
                    value={formData.emirate}
                    onChange={handleChange}
                    className={inputClasses('emirate')}
                  >
                    <option value="">Select Emirate</option>
                    {emirates.map((emirate) => (
                      <option key={emirate} value={emirate}>
                        {emirate}
                      </option>
                    ))}
                  </select>
                  {errors.emirate && (
                    <p className="mt-2 text-sm text-red-600">{errors.emirate}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className={labelClasses}>
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClasses('city')}
                    />
                    {errors.city && (
                      <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="pincode" className={labelClasses}>
                      PIN Code (Optional)
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter PIN code (optional)"
                      className={inputClasses('pincode')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className={labelClasses}>
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value="United Arab Emirates"
                    className={`${inputClasses('country')} bg-gray-50`}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Delivery Date and Time - After shipping address */}
          {formData.deliveryMethod === 'delivery' && (
            <div className={sectionClasses}>
              <h2 className={sectionTitleClasses}>Delivery Schedule</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="deliveryDate" className={labelClasses}>
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      id="deliveryDate"
                      name="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      min={minDate}
                      className={inputClasses('deliveryDate')}
                    />
                    {errors.deliveryDate && (
                      <p className="mt-2 text-sm text-red-600">{errors.deliveryDate}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="deliveryTime" className={labelClasses}>
                      Delivery Time
                    </label>
                    <select
                      id="deliveryTime"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleChange}
                      className={inputClasses('deliveryTime')}
                      disabled={!formData.emirate || !formData.deliveryDate}
                    >
                      <option value="">Select Time Slot</option>
                      {availableTimeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                    {!formData.emirate && (
                      <p className="mt-2 text-sm text-gray-500">Please select an emirate first to view available time slots</p>
                    )}
                    {!formData.deliveryDate && (
                      <p className="mt-2 text-sm text-gray-500">Please select a delivery date first to view available time slots</p>
                    )}
                    {errors.deliveryTime && (
                      <p className="mt-2 text-sm text-red-600">{errors.deliveryTime}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </form>
  );
}
