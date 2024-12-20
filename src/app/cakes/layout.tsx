import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Cakes Collection | Pinewraps',
  description: 'Discover our exquisite collection of handcrafted cakes. From classic designs to custom creations, find the perfect cake for your special occasion.',
};

export default function CakesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
