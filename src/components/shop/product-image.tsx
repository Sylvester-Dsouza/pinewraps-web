'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ZoomableImage from './zoomable-image';
import Image from 'next/image';

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
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full">
        {/* Main Image */}
        <div className="relative w-full h-full">
          <ZoomableImage
            src={validImages[currentImageIndex].url}
            alt="Product Image"
            onLoad={() => setIsLoading(false)}
          />
        </div>

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPreviousImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {validImages.length > 1 && (
        <div className="relative group">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all snap-start ${
                  index === currentImageIndex
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Mobile Scroll Indicators */}
          <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent md:hidden" />
          <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent md:hidden" />
        </div>
      )}

      <style jsx global>{`
        /* Hide scrollbar but keep functionality */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
}
