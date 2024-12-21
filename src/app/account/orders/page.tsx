'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { STORE_INFO } from "@/lib/constants";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  cakeWriting?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  date?: string;
  createdAt: string;
  items: OrderItem[];
  deliveryMethod: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  deliveryInstructions?: string;
  paymentMethod: string;
  paymentStatus?: string;
  pointsRedeemed?: number;
  discountAmount?: number;
  rewards?: {
    pointsEarned: number;
    tier: string;
  };
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress?: {
    street?: string;
    apartment?: string;
    emirate?: string;
    city?: string;
    pincode?: string;
  };
  streetAddress?: string;
  apartment?: string;
  emirate?: string;
  city?: string;
  pincode?: string;
  country?: string;
}

function OrderDetailsModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Order #{order.orderNumber}</h2>
            <p className="text-sm text-gray-500">
              {new Date(order.date || order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer and Shipping Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Information */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium mb-2 text-sm">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p>{order.customer?.name}</p>
                <p className="text-gray-600">{order.customer?.email}</p>
                <p className="text-gray-600">{order.customer?.phone}</p>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-medium mb-2 text-sm">Shipping Method</h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.deliveryMethod === 'PICKUP' ? 'Store Pickup' : 'Delivery'}</p>
                {order.deliveryMethod === 'DELIVERY' && order.deliveryDate && (
                  <p className="text-gray-600">
                    Delivery: {new Date(order.deliveryDate).toLocaleDateString()} {order.deliveryTimeSlot}
                  </p>
                )}
                {order.deliveryMethod === 'PICKUP' && order.pickupDate && (
                  <>
                    <p className="text-gray-600">
                      Pickup: {new Date(order.pickupDate).toLocaleDateString()} {order.pickupTimeSlot}
                    </p>
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium">Pickup Location:</p>
                      <p className="text-gray-600">{STORE_INFO.name}</p>
                      <p className="text-gray-600">{STORE_INFO.address.street}</p>
                      <p className="text-gray-600">{STORE_INFO.address.city}, {STORE_INFO.address.country}</p>
                      <p className="mt-1 text-gray-600">{STORE_INFO.hours}</p>
                      <p className="text-gray-600">{STORE_INFO.phone}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryMethod === 'DELIVERY' && (
              <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                <h3 className="font-medium mb-2 text-sm">Delivery Address</h3>
                <div className="text-sm space-y-1">
                  {order.streetAddress && (
                    <p className="font-medium">
                      {order.streetAddress}
                    </p>
                  )}
                  {order.apartment && (
                    <p className="text-gray-600">
                      {order.apartment}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {[
                      order.city,
                      order.emirate,
                      order.pincode
                    ].filter(Boolean).join(', ')}
                  </p>
                  <p className="text-gray-600">{order.country || 'United Arab Emirates'}</p>
                  {order.deliveryInstructions && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs font-medium text-gray-500">Delivery Instructions:</p>
                      <p className="text-sm text-gray-600">{order.deliveryInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="border rounded-lg overflow-hidden">
            <h3 className="font-medium p-3 bg-gray-50 text-sm">Order Items</h3>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="p-3 flex justify-between items-start text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="text-gray-600 text-xs space-y-0.5">
                      {item.variant && <p>Variant: {item.variant}</p>}
                      {item.cakeWriting && <p>Writing: {item.cakeWriting}</p>}
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border rounded-lg overflow-hidden">
            <h3 className="font-medium p-3 bg-gray-50 text-sm">Price Breakdown</h3>
            <div className="p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              {order.deliveryMethod === 'DELIVERY' && (
                <div className="flex justify-between">
                  <span>Delivery Method</span>
                  <span>Delivery</span>
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
            <div className="border rounded-lg overflow-hidden">
              <h3 className="font-medium p-3 bg-gray-50 text-sm">Rewards & Points</h3>
              <div className="p-3 space-y-2 text-sm">
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { user } = useAuth();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">
            {new Date(order.date || order.createdAt).toLocaleDateString()}
          </p>
          {order.rewards && order.rewards.pointsEarned && order.rewards.pointsEarned > 0 && (
            <p className="text-sm text-green-600 mt-1">
              +{order.rewards.pointsEarned} points earned
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="mb-1">
            <span className={`inline-block px-2 py-1 text-xs rounded ${
              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
              order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="font-semibold">{formatPrice(order.total)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div>
              <span className="font-medium">{item.name}</span>
              {item.variant && (
                <span className="text-gray-500 ml-2">({item.variant})</span>
              )}
              {item.cakeWriting && (
                <p className="text-gray-500 text-xs">Writing: {item.cakeWriting}</p>
              )}
            </div>
            <div className="text-right">
              <p>{item.quantity}x {formatPrice(item.price)}</p>
            </div>
          </div>
        ))}
      </div>

      {order.deliveryMethod && (
        <div className="mt-4 pt-4 border-t text-sm">
          <p className="font-medium">Delivery Details</p>
          <p className="text-gray-600">
            {order.deliveryMethod} - {order.deliveryDate && new Date(order.deliveryDate).toLocaleDateString()} {order.deliveryTimeSlot}
          </p>
          {order.pickupDate && (
            <p className="text-gray-600">
              Pickup - {new Date(order.pickupDate).toLocaleDateString()} {order.pickupTimeSlot}
            </p>
          )}
          {order.deliveryInstructions && (
            <p className="text-gray-500 text-xs mt-1">
              Instructions: {order.deliveryInstructions}
            </p>
          )}
        </div>
      )}

      {order.rewards && order.rewards.pointsEarned && order.rewards.pointsEarned > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Points earned:</span>
            <span className="text-green-600 font-medium">+{order.rewards.pointsEarned} points</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Earned at {order.rewards.tier} tier rate
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t flex justify-end gap-3">
        <Link href={`/account/orders/${order.id}`}>
          <button
            className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchOrders = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=1&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to fetch orders');
      }

      // Access orders from the correct path in the response
      const ordersList = data.data.results || [];
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to load orders. Please try again later.');
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchOrders}>Try Again</Button>
      </div>
    );
  }

  // Ensure orders is an array before rendering
  const ordersList = Array.isArray(orders) ? orders : [];

  if (ordersList.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <Link href="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {ordersList.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
