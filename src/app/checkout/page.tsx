'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, calculatePointsPreview } from '@/lib/utils';
import ShippingForm, { ShippingDetails } from '@/components/checkout/shipping-form';
import ProtectedRoute from '@/components/auth/protected-route';
import { toast } from 'react-hot-toast';
import { PaymentService } from '@/services/payment.service';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerData, setCustomerData] = useState<{
    firstName: string;
    lastName: string;
    phone: string;
  } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('delivery');
  const [selectedEmirate, setSelectedEmirate] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT';
    value: number;
    discount: number;
    minOrderAmount?: number;
    maxDiscount?: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [customerRewards, setCustomerRewards] = useState<{
    tier: string;
    points: number;
    totalPoints: number;
    history: any[];
  } | null>(null);
  const [useRewardPoints, setUseRewardPoints] = useState(false);

  // Fetch customer data when component mounts
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/customers/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCustomerData({
              firstName: data.data.firstName,
              lastName: data.data.lastName,
              phone: data.data.phone || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, [user]);

  // Fetch user's rewards when component mounts
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = await user?.getIdToken();
        if (!token) return;

        const response = await fetch('/api/rewards', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setCustomerRewards({
            tier: data.data.tier,
            points: data.data.points,
            totalPoints: data.data.totalPoints,
            history: data.data.history || []
          });
        }
      } catch (error) {
        console.error('Error fetching rewards:', error);
      }
    };

    if (user) {
      fetchRewards();
    }
  }, [user]);

  // Calculate totals
  const subtotal = useMemo(() => {
    return state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [state.items]);

  const deliveryFee = useMemo(() => {
    return deliveryMethod === 'delivery' 
      ? selectedEmirate?.toUpperCase() === 'DUBAI' ? 30 : 50
      : 0;
  }, [deliveryMethod, selectedEmirate]);

  const maxRedeemablePoints = customerRewards?.points || 0;
  const rewardsDiscount = useRewardPoints ? Math.min((maxRedeemablePoints * 0.25), subtotal * 0.25) : 0;
  const couponDiscount = appliedCoupon?.discount || 0;

  const total = useMemo(() => {
    // Calculate total with all discounts and fees
    const calculatedTotal = Math.max(0, subtotal - couponDiscount - rewardsDiscount + deliveryFee);
    // Round to 2 decimal places to avoid floating point issues
    return Math.round(calculatedTotal * 100) / 100;
  }, [subtotal, couponDiscount, rewardsDiscount, deliveryFee]);

  // Calculate points to be earned based on tier
  const pointsToEarn = useMemo(() => {
    if (!customerRewards) return 0;
    const tierMultipliers = {
      'BRONZE': 0.07,
      'SILVER': 0.12,
      'GOLD': 0.15,
      'PLATINUM': 0.20
    };
    const multiplier = tierMultipliers[customerRewards.tier as keyof typeof tierMultipliers] || 0.07;
    return Math.floor(total * multiplier);
  }, [total, customerRewards]);

  const handleDeliveryMethodChange = (method: 'pickup' | 'delivery', emirate: string) => {
    setDeliveryMethod(method);
    setSelectedEmirate(emirate);
  };

  // Handle form submission
  const handleSubmit = async (shippingDetails: ShippingDetails) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Please sign in to continue');
      }

      // Generate idempotency key
      const idempotencyKey = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare order data
      const orderData = {
        idempotencyKey,
        // Customer Information
        firstName: shippingDetails.firstName,
        lastName: shippingDetails.lastName,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        
        // Address Information
        streetAddress: shippingDetails.address,
        apartment: shippingDetails.apartment,
        emirate: shippingDetails.emirate,
        city: shippingDetails.city || 'Dubai',
        pincode: shippingDetails.pincode,
        
        // Delivery Information
        deliveryMethod: deliveryMethod === 'delivery' ? 'DELIVERY' : 'PICKUP',
        deliveryDate: shippingDetails.deliveryDate,
        deliveryTimeSlot: shippingDetails.deliveryTime,
        deliveryFee,
        
        // Pickup Information
        pickupDate: deliveryMethod === 'pickup' ? shippingDetails.deliveryDate : null,
        pickupTimeSlot: deliveryMethod === 'pickup' ? shippingDetails.deliveryTime : null,
        
        // Payment Information
        paymentMethod: shippingDetails.paymentMethod,
        
        // Order Details
        items: state.items.map(item => ({
          name: item.name,
          variant: item.variant || '',
          variations: item.selectedVariations || [],
          price: item.price,
          quantity: item.quantity,
          cakeWriting: item.cakeWriting || ''
        })),
        subtotal,
        total,
        couponDiscount,
        rewardsDiscount,
        deliveryFee,
        
        // Coupon Information
        couponCode: appliedCoupon?.code,
        
        // Points Information
        pointsToEarn,
        pointsRedeemed: useRewardPoints ? maxRedeemablePoints : 0,
        
        // Optional Information
        isGift: shippingDetails.isGift,
        giftMessage: shippingDetails.giftMessage,
      };

      console.log('Submitting order:', orderData); // Debug log

      // Create order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }

      // Get order ID from response
      const { data } = await response.json();

      if (shippingDetails.paymentMethod === 'CASH') {
        // For cash on delivery, redirect to thank you page
        clearCart();
        router.push(`/thank-you?orderId=${data.id}`);
      } else {
        try {
          // Show loading state immediately
          setIsSubmitting(true);
          
          // For card payments, initialize N-Genius payment
          const paymentUrl = await PaymentService.createPayment(data.id);
          if (!paymentUrl) {
            throw new Error('No payment URL received');
          }
          
          // Clear cart only after successful payment initialization
          clearCart();
          
          // Redirect to N-Genius payment page
          window.location.href = paymentUrl;
        } catch (paymentError) {
          console.error('Payment initialization error:', paymentError);
          
          // Delete the pending order since payment failed
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${data.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          throw new Error('Payment initialization failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
      setIsSubmitting(false);
    }
  };

  // Handle coupon validation
  const validateCoupon = async () => {
    if (!couponCode || isValidatingCoupon) return;
    
    setIsValidatingCoupon(true);
    try {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Please sign in to apply coupon');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${couponCode}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ total: subtotal }),
      });

      const data = await response.json();
      console.log('Raw coupon response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid coupon');
      }

      if (data.success && data.data) {
        // Ensure numeric values
        const couponData = {
          code: data.data.code,
          type: data.data.type,
          value: data.data.type === 'FIXED_AMOUNT' ? parseFloat(data.data.value.replace(/[^\d.-]/g, '')) : parseFloat(data.data.value),
          discount: data.data.discount,
          minOrderAmount: data.data.minOrderAmount ? parseFloat(data.data.minOrderAmount) : undefined,
          maxDiscount: data.data.maxDiscount ? parseFloat(data.data.maxDiscount) : undefined
        };

        console.log('Processed coupon data:', couponData);
        setAppliedCoupon(couponData);
        toast.success('Coupon applied successfully!');
      } else {
        setAppliedCoupon(null);
        toast.error(data.error || 'Invalid coupon');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to validate coupon');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const renderRewardsSection = () => {
    if (!customerRewards || customerRewards.points === 0) return null;

    const maxDiscount = (customerRewards.points * 0.25).toFixed(2);
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Your Reward Points</h3>
            <p className="text-sm text-gray-500">You have {customerRewards.points} points (Worth AED {maxDiscount})</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useRewardPoints"
              checked={useRewardPoints}
              onChange={(e) => setUseRewardPoints(e.target.checked)}
              className="h-4 w-4 text-black border-gray-300 rounded"
              disabled={customerRewards.points === 0}
            />
            <label htmlFor="useRewardPoints" className="ml-2 text-sm text-gray-900">
              Use Points
            </label>
          </div>
        </div>
        {pointsToEarn > 0 && (
          <p className="mt-2 text-sm text-green-600">
            You'll earn {pointsToEarn} points from this order!
          </p>
        )}
      </div>
    );
  };

  // Redirect to cart if empty
  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some items to your cart before checking out.</p>
        <Link
          href="/shop"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your payment...</p>
            </div>
          </div>
        )}
        {/* Header */}
        <header className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Return to cart</span>
              </Link>
              <h1 className="text-2xl font-bold text-center text-gray-900">Checkout</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            {/* Main Content */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ShippingForm 
                  onSubmit={handleSubmit}
                  onDeliveryMethodChange={handleDeliveryMethodChange}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 sticky top-8">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                
                <div className="divide-y divide-gray-200">
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.variant || ''}-${item.cakeWriting || ''}`} className="py-4 flex space-x-4">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        {/* Show selected variations */}
                        {item.selectedVariations?.filter(variation => variation.value).map((variation, index) => (
                          <p key={index} className="mt-1 text-sm text-gray-500">
                            {variation.type}: {variation.value}
                          </p>
                        ))}
                        {item.cakeWriting && (
                          <p className="mt-1 text-sm text-gray-500">Writing: {item.cakeWriting}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {renderRewardsSection()}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {subtotal.toFixed(2)}</span>
                  </div>
                  {deliveryMethod === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee ({selectedEmirate || 'Dubai'})</span>
                      <span>AED {deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-AED {couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {rewardsDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Rewards Discount</span>
                      <span>-AED {rewardsDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full py-2 pl-10 text-sm text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={validateCoupon}
                    className="ml-2 bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                  >
                    Apply
                  </button>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  form="shipping-form"
                  className="mt-6 w-full bg-black text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
