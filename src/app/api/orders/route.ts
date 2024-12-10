import { NextResponse } from 'next/server';
import { ShippingDetails } from '@/components/checkout/shipping-form';
import { auth } from '@/lib/firebase-admin';
import prisma from '@/lib/prisma';
import { calculateTier, TIER_THRESHOLDS } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  selectedVariations?: {
    type: string;
    value: string;
    priceAdjustment: number;
  }[];
  cakeWriting?: string;
  variant?: string;
}

interface Order {
  items: OrderItem[];
  shipping: ShippingDetails;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get the user's email from the query params
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    // Verify the email matches the token
    if (email !== decodedToken.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get orders from the database
    const orders = await prisma.order.findMany({
      where: {
        userEmail: email
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: true,
        delivery: true
      }
    });

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const orderData = await request.json();
    console.log('Order Data:', { total: orderData.total, pointsToEarn: orderData.pointsToEarn });

    // Get the customer ID
    const customer = await prisma.customer.findUnique({
      where: {
        email: decodedToken.email
      }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Calculate points based on total order amount and current tier
    const pointsEarned = Math.floor(orderData.total * TIER_THRESHOLDS[customer.tier || 'BRONZE'].discount);
    const newTotalPoints = (customer.totalPoints || 0) + pointsEarned;
    const newTier = calculateTier(newTotalPoints);

    // Create the order in the database with the calculated points
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`,
        status: 'PENDING',
        total: orderData.total,
        subtotal: orderData.subtotal,
        paymentMethod: orderData.paymentMethod,
        pointsEarned: pointsEarned, 
        pointsRedeemed: orderData.redeemPoints || 0,
        items: {
          create: orderData.items.map((item: OrderItem) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant || null,
            variations: item.selectedVariations ? JSON.stringify(item.selectedVariations) : '[]',
            cakeWriting: item.cakeWriting
          }))
        },
        delivery: {
          create: orderData.shipping.deliveryMethod === 'delivery' ? {
            type: orderData.shipping.deliveryMethod,
            requestedDate: orderData.shipping.deliveryDate,
            requestedTime: orderData.shipping.deliveryTime,
            street: orderData.shipping.address,
            apartment: orderData.shipping.apartment,
            city: orderData.shipping.city,
            emirates: orderData.shipping.emirate,
            postalCode: orderData.shipping.pincode,
            instructions: orderData.shipping.instructions
          } : {
            type: 'pickup',
            requestedDate: orderData.shipping.deliveryDate,
            requestedTime: orderData.shipping.deliveryTime,
          }
        }
      },
      include: {
        items: true,
        delivery: true
      }
    });

    console.log('Created Order:', { id: order.id, pointsEarned: order.pointsEarned });

    // Update user rewards with the points from the order
    const updatedRewards = await prisma.userReward.upsert({
      where: {
        customerId: customer.id
      },
      create: {
        customerId: customer.id,
        points: pointsEarned,
        totalPoints: pointsEarned,
        tier: calculateTier(pointsEarned) // Calculate tier based on total points
      },
      update: {
        points: { increment: pointsEarned },
        totalPoints: { increment: pointsEarned },
        tier: newTier // Use the calculated tier
      },
      include: {
        history: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        order,
        rewards: {
          pointsEarned: order.pointsEarned,
          newTier: newTier !== customer.tier ? newTier : undefined,
          currentPoints: updatedRewards.points,
          tier: newTier
        }
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
