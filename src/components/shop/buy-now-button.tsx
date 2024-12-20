'use client';

import { useRouter } from 'next/navigation';

export default function BuyNowButton() {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push('/checkout');
  };

  return (
    <button
      className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
      onClick={handleBuyNow}
    >
      Buy Now
    </button>
  );
}
