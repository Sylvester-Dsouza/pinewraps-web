import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Get the order from the database
    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the user owns this order
    if (order.userEmail !== decodedToken.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if order is within 6 hours
    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 6) {
      return NextResponse.json(
        { error: 'Orders can only be cancelled within 6 hours of placement' },
        { status: 400 }
      );
    }

    // Check if order is in PENDING status
    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending orders can be cancelled' },
        { status: 400 }
      );
    }

    // Update the order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: {
        id: params.orderId
      },
      data: {
        status: 'CANCELLED'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
