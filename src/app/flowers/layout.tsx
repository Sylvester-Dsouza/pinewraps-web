import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fresh Flowers Collection | Pinewraps',
  description: 'Explore our stunning collection of fresh flowers. From elegant bouquets to custom arrangements, find the perfect flowers to express your emotions.',
};

export default function FlowersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
