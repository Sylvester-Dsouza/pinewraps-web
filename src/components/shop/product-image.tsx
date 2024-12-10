'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageType {
  url: string;
  isPrimary?: boolean;
}

interface Props {
  images: ImageType[];
}

export default function ProductImage({ images }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Find primary image or use first image
  const primaryImageIndex = images.findIndex(img => img.isPrimary) || 0;
  const validImages = images.length > 0 ? images : [{ url: '/placeholder.jpg' }];

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  };

  return (
    <div className="relative w-full h-full group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <Image
          src={validImages[currentImageIndex].url}
          alt="Product Image"
          fill
          className={`
            object-contain
            duration-700 ease-in-out
            ${isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'}
          `}
          onLoad={() => setIsLoading(false)}
          priority
        />
      </div>

      {/* Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={goToPreviousImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnail Navigation */}
      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-black' : 'bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
