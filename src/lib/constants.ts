// API URLs
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

// Store Information
export const STORE_INFO = {
  name: 'Pinewraps Store',
  address: {
    street: 'Maid Road - Jumeirah - Jumeirah 1',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },
  hours: 'Open ⋅ Closes 9 pm',
  phone: '+971 54 404 4864',
} as const;
