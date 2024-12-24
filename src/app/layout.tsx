import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { AddressProvider } from '@/contexts/address-context';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pinewraps',
  description: 'Delicious treats and custom cakes',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-white text-black min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <AddressProvider>
              <Navbar />
              <Toaster position="top-center" />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
            </AddressProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
