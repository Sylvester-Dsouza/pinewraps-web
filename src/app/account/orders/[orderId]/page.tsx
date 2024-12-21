'use client';

import { useEffect, useState, use } from "react";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { STORE_INFO } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const token = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to fetch order');
        }

        setOrder(data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error instanceof Error ? error.message : 'Failed to load order. Please try again later.');
        toast.error('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || 'Order not found'}</p>
        <Link href="/account/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <Link 
            href="/account/orders" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-500 mt-1">
            Placed on {new Date(order.date || order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 text-sm rounded-full ${
            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
            order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
            order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.status}
          </span>
          {order.paymentStatus && (
            <span className={`mt-2 px-3 py-1 text-sm rounded-full ${
              order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
              order.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Payment: {order.paymentStatus}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h2 className="font-medium p-4 bg-gray-50 text-sm">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="p-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="text-sm text-gray-500 space-y-0.5">
                      {item.variant && <p>Variant: {item.variant}</p>}
                      {item.cakeWriting && <p>Writing: {item.cakeWriting}</p>}
                      <p>Quantity: {item.quantity}</p>
                      <p>Price per item: {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h2 className="font-medium p-4 bg-gray-50 text-sm">Delivery Details</h2>
            <div className="p-4 space-y-4">
              <div>
                <p className="font-medium text-sm">Method</p>
                <p className="text-gray-600">{order.deliveryMethod === 'PICKUP' ? 'Store Pickup' : 'Delivery'}</p>
              </div>

              {order.deliveryMethod === 'DELIVERY' ? (
                <>
                  <div>
                    <p className="font-medium text-sm">Delivery Time</p>
                    <p className="text-gray-600">
                      {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()} {order.deliveryTimeSlot}
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">Delivery Address</p>
                    <div className="text-gray-600">
                      {order.streetAddress && <p>{order.streetAddress}</p>}
                      {order.apartment && <p>{order.apartment}</p>}
                      <p>
                        {[order.city, order.emirate, order.pincode].filter(Boolean).join(', ')}
                      </p>
                      <p>{order.country || 'United Arab Emirates'}</p>
                    </div>
                  </div>

                  {order.deliveryInstructions && (
                    <div>
                      <p className="font-medium text-sm">Delivery Instructions</p>
                      <p className="text-gray-600">{order.deliveryInstructions}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium text-sm">Pickup Time</p>
                    <p className="text-gray-600">
                      {order.pickupDate && new Date(order.pickupDate).toLocaleDateString()} {order.pickupTimeSlot}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm">Pickup Location</p>
                    <div className="text-gray-600">
                      <p>{STORE_INFO.name}</p>
                      <p>{STORE_INFO.address.street}</p>
                      <p>{STORE_INFO.address.city}, {STORE_INFO.address.country}</p>
                      <p className="mt-1">{STORE_INFO.hours}</p>
                      <p>{STORE_INFO.phone}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h2 className="font-medium p-4 bg-gray-50 text-sm">Customer Information</h2>
            <div className="p-4 space-y-2">
              <p className="font-medium">{order.customer?.name}</p>
              <p className="text-gray-600">{order.customer?.email}</p>
              <p className="text-gray-600">{order.customer?.phone}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h2 className="font-medium p-4 bg-gray-50 text-sm">Price Breakdown</h2>
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>

              {order.deliveryMethod === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{formatPrice(order.deliveryCharge || 0)}</span>
                </div>
              )}

              {order.pointsRedeemed && order.pointsRedeemed > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Points Redeemed</span>
                  <span>-{formatPrice(order.pointsRedeemed * 0.25)}</span>
                </div>
              )}

              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Rewards & Points */}
          {((order.rewards?.pointsEarned ?? 0) > 0 || (order.pointsRedeemed ?? 0) > 0) && (
            <div className="bg-white rounded-lg border overflow-hidden">
              <h2 className="font-medium p-4 bg-gray-50 text-sm">Rewards & Points</h2>
              <div className="p-4 space-y-2 text-sm">
                {order.rewards?.pointsEarned && order.rewards.pointsEarned > 0 && (
                  <div className="flex justify-between">
                    <span>Points Earned</span>
                    <span className="text-green-600">+{order.rewards.pointsEarned} points</span>
                  </div>
                )}
                {order.pointsRedeemed && order.pointsRedeemed > 0 && (
                  <div className="flex justify-between">
                    <span>Points Redeemed</span>
                    <span className="text-gray-600">{order.pointsRedeemed} points</span>
                  </div>
                )}
                {order.rewards?.tier && (
                  <p className="text-xs text-gray-500 mt-2 pt-2 border-t">
                    Points earned at {order.rewards.tier} tier rate
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <h2 className="font-medium p-4 bg-gray-50 text-sm">Payment Method</h2>
            <div className="p-4">
              <p className="text-gray-600">{order.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
