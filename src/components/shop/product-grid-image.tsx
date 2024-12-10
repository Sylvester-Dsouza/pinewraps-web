'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function ProductGridImage({ src, alt, className = '' }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={src || '/placeholder.jpg'}
        alt={alt || 'Product Image'}
        fill
        className={`
          object-cover
          duration-700 ease-in-out
          ${isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'}
        `}
        onLoad={() => setIsLoading(false)}
        priority
      />
    </div>
  );
}
