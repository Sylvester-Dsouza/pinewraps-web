import axios from 'axios';
import { auth } from '@/lib/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class PaymentService {
  static async createPayment(orderId: string): Promise<string> {
    try {
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        throw new Error('User not authenticated');
      }

      const response = await axios.post(`${API_URL}/api/payments/create`, {
        orderId
      }, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      return response.data.paymentUrl;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  static async getPaymentStatus(ref: string): Promise<string> {
    try {
      console.log('Getting payment status for ref:', ref);
      
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/api/payments/status/${ref}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      console.log('Payment status response:', response.data);
      
      if (!response.data || !response.data.status) {
        console.error('Invalid response from payment status API:', response.data);
        throw new Error('Invalid response from payment API');
      }
      
      return response.data.status;
    } catch (error) {
      console.error('Error getting payment status:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Payment API error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }

  static async getPaymentDetails(ref: string): Promise<any> {
    try {
      console.log('Getting payment details for ref:', ref);
      
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      const response = await axios.get(`${API_URL}/api/payments/status/${ref}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      console.log('Payment details response:', response.data);
      
      if (!response.data) {
        console.error('Invalid response from payment details API:', response.data);
        throw new Error('Invalid response from payment API');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error getting payment details:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Payment API error: ${error.response?.data?.error || error.message}`);
      }
      throw error;
    }
  }
}
