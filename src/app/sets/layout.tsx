import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perfect Combinations | Pinewraps',
  description: 'Discover our perfect combinations of cakes and flowers. Make your celebrations extra special with our thoughtfully curated combo packages.',
};

export default function CombosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
