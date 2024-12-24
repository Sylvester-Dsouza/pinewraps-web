'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import { toast } from 'react-hot-toast';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

interface AuthContextType {
  user: User | null;
  customerData: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: string;
  } | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithFacebook: () => Promise<User>;
  signInWithApple: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (email: string, password: string, userData: { firstName: string; lastName: string; phone: string }) => Promise<User>;
  signOut: () => Promise<void>;
  checkEmailSignInMethods: (email: string) => Promise<string[]>;
  updateUserProfile: (data: { firstName: string; lastName: string; phone: string; dateOfBirth?: string }) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  isEmailUser: boolean;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [customerData, setCustomerData] = useState<{ firstName: string; lastName: string; phone: string; dateOfBirth?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomerData = async (token: string) => {
    try {
      console.log('Fetching customer data...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error fetching customer data:', { status: response.status, data: errorData });
        throw new Error(errorData?.error?.message || 'Failed to fetch customer data');
      }

      const responseData = await response.json();
      console.log('Customer data response:', responseData);

      if (responseData.success && responseData.data) {
        setCustomerData({
          firstName: responseData.data.firstName,
          lastName: responseData.data.lastName,
          phone: responseData.data.phone || '',
          dateOfBirth: responseData.data.dateOfBirth || ''
        });
      } else {
        throw new Error(responseData.error?.message || 'Failed to fetch customer data');
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      toast.error('Failed to fetch customer data');
    }
  };

  const setAuthToken = (token: string) => {
    // Store in localStorage
    localStorage.setItem('authToken', token);
    // Store in cookie with HttpOnly and Secure flags
    document.cookie = `authToken=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
    // Also set the Firebase session cookie
    document.cookie = `__session=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
  };

  const clearAuthToken = () => {
    // Clear from localStorage
    localStorage.removeItem('authToken');
    // Clear cookies
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          
          // Store the token
          setAuthToken(token);
          
          // Set the user state
          setUser(firebaseUser);
          
          // Fetch customer data with token
          await fetchCustomerData(token);
        } else {
          // Clear the token and user data
          clearAuthToken();
          setUser(null);
          setCustomerData(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        // Clear data on error
        clearAuthToken();
        setUser(null);
        setCustomerData(null);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const setSessionCookie = async (user: User) => {
    try {
      // Get a Firebase ID token
      const token = await user.getIdToken(true);
      
      // Call the session endpoint to set the cookie
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to set session cookie');
      }
    } catch (error) {
      console.error('Error setting session cookie:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...');
      
      // Configure Google provider
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      console.log('Opening Google popup...');
      const result = await signInWithPopup(auth, googleProvider).catch((error) => {
        console.error('Google popup error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign in cancelled by user');
        }
        if (error.code === 'auth/unauthorized-domain') {
          throw new Error('This domain is not authorized for sign-in. Please contact support.');
        }
        throw error;
      });
      
      console.log('Getting ID token...');
      const token = await result.user.getIdToken();
      
      // Store the token
      setAuthToken(token);
      
      console.log('Calling backend social auth...');
      try {
        // Call the backend social auth endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/social`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            token,
            provider: 'GOOGLE',
            email: result.user.email,
            firstName: result.user.displayName?.split(' ')[0] || '',
            lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
            imageUrl: result.user.photoURL || ''
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('Backend auth error:', { status: response.status, data: errorData });
          throw new Error('Failed to authenticate with backend');
        }

        const data = await response.json();
        console.log('Backend auth success:', data);

        // Set customer data
        if (data.success && data.data?.customer) {
          setCustomerData({
            firstName: data.data.customer.firstName,
            lastName: data.data.customer.lastName,
            phone: data.data.customer.phone || '',
            dateOfBirth: data.data.customer.dateOfBirth || ''
          });
        }

        // Set user and session cookie
        setUser(result.user);
        await setSessionCookie(result.user);
      } catch (error) {
        console.error('Backend auth error:', error);
        // Still set the user even if backend fails
        setUser(result.user);
        throw error;
      }

      return result.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      clearAuthToken();
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      console.log('Starting Facebook sign in...');
      
      const result = await signInWithPopup(auth, facebookProvider).catch((error) => {
        console.error('Facebook popup error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign in cancelled by user');
        }
        if (error.code === 'auth/unauthorized-domain') {
          throw new Error('This domain is not authorized for sign-in. Please contact support.');
        }
        throw error;
      });
      
      const token = await result.user.getIdToken();
      setAuthToken(token);
      
      // Call the backend social auth endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token,
          provider: 'FACEBOOK',
          email: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          imageUrl: result.user.photoURL || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Backend auth error:', { status: response.status, data: errorData });
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      console.log('Backend auth success:', data);

      if (data.success && data.data?.customer) {
        setCustomerData({
          firstName: data.data.customer.firstName,
          lastName: data.data.customer.lastName,
          phone: data.data.customer.phone || '',
          dateOfBirth: data.data.customer.dateOfBirth || ''
        });
      }

      await setSessionCookie(result.user);
      return result.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      clearAuthToken();
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      console.log('Starting Apple sign in...');
      
      // Configure Apple provider
      appleProvider.addScope('email');
      appleProvider.addScope('name');
      
      const result = await signInWithPopup(auth, appleProvider).catch((error) => {
        console.error('Apple popup error:', error);
        if (error.code === 'auth/popup-closed-by-user') {
          throw new Error('Sign in cancelled by user');
        }
        if (error.code === 'auth/unauthorized-domain') {
          throw new Error('This domain is not authorized for sign-in. Please contact support.');
        }
        throw error;
      });
      
      const token = await result.user.getIdToken();
      setAuthToken(token);
      
      // Call the backend social auth endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/social`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token,
          provider: 'APPLE',
          email: result.user.email,
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          imageUrl: result.user.photoURL || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Backend auth error:', { status: response.status, data: errorData });
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      console.log('Backend auth success:', data);

      if (data.success && data.data?.customer) {
        setCustomerData({
          firstName: data.data.customer.firstName,
          lastName: data.data.customer.lastName,
          phone: data.data.customer.phone || '',
          dateOfBirth: data.data.customer.dateOfBirth || ''
        });
      }

      await setSessionCookie(result.user);
      return result.user;
    } catch (error: any) {
      console.error('Sign in error:', error);
      clearAuthToken();
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // First sign in with Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Set the session cookie
      await setSessionCookie(result.user);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Store the token
      setAuthToken(idToken);

      // Call the login endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const data = await response.json();
      
      if (data.success) {
        // Set the user state
        setUser(result.user);
        
        // Set customer data
        setCustomerData({
          firstName: data.data.customer.firstName,
          lastName: data.data.customer.lastName,
          phone: data.data.customer.phone || '',
          dateOfBirth: data.data.customer.dateOfBirth || ''
        });
        
        toast.success('Signed in successfully');
        return result.user;
      } else {
        throw new Error(data.error?.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      clearAuthToken();
      toast.error('Failed to sign in with email');
      throw error;
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    userData: {
      firstName: string;
      lastName: string;
      phone: string;
    }
  ) => {
    try {
      // Create user with Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();

      // Call the backend to create customer record
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          email: email
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create customer record');
      }

      const data = await response.json();
      if (data.success) {
        setUser(result.user);
        setCustomerData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone
        });
        toast.success('Account created successfully');
      } else {
        throw new Error(data.error?.message || 'Failed to create customer record');
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const checkEmailSignInMethods = async (email: string) => {
    if (!email) {
      throw new Error('Email is required');
    }
    
    try {
      return await fetchSignInMethodsForEmail(auth, email);
    } catch (error: any) {
      console.error('Error checking email sign-in methods:', error);
      if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address');
      }
      throw error;
    }
  };

  const updateUserProfile = async (data: { firstName: string; lastName: string; phone: string; dateOfBirth?: string }) => {
    if (!user) throw new Error('No user logged in');

    try {
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update local user object
      const updatedUser = await response.json();
      // We might need to refresh the user's token to get the updated custom claims
      await user.getIdToken(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) throw new Error('No user logged in');

    try {
      // Validate password requirements
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      // Create credentials with current password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      
      // First re-authenticate
      try {
        await reauthenticateWithCredential(user, credential);
      } catch (error: any) {
        if (error.code === 'auth/wrong-password') {
          throw new Error('Current password is incorrect');
        }
        throw error;
      }

      // Then update password
      await updatePassword(user, newPassword);
      
      toast.success('Password updated successfully');
    } catch (error: any) {
      console.error('Error updating password:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign in again before changing your password');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please use a stronger password');
      } else {
        toast.error(error.message || 'Failed to update password');
      }
      
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address');
      } else {
        toast.error('Failed to send password reset email. Please try again.');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      clearAuthToken();
      setUser(null);
      setCustomerData(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const isEmailUser = user?.providerData[0]?.providerId === 'password';

  const value = {
    user,
    customerData,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    checkEmailSignInMethods,
    updateUserProfile,
    updateUserPassword,
    isEmailUser,
    sendPasswordReset
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
