import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase-admin";
import { db } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Delete user data from Firestore
    const batch = db.batch();
    
    // Delete user profile
    batch.delete(db.collection('users').doc(uid));
    
    // Delete user addresses
    const addressesRef = db.collection('addresses').where('userId', '==', uid);
    const addressesSnapshot = await addressesRef.get();
    addressesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete user orders (optional - you might want to keep them for records)
    const ordersRef = db.collection('orders').where('userId', '==', uid);
    const ordersSnapshot = await ordersRef.get();
    ordersSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Execute batch delete
    await batch.commit();

    // Delete the user authentication account
    await auth.deleteUser(uid);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
