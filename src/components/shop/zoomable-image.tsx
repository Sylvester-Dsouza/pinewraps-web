'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  onLoad?: () => void;
}

export default function ZoomableImage({ src, alt, onLoad }: Props) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsZoomed(false);
  };

  const handleTouchStart = () => {
    if (isMobile) setIsZoomed(true);
  };

  const handleTouchEnd = () => {
    if (isMobile) setIsZoomed(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Original Image */}
      <div ref={imageRef} className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          onLoad={onLoad}
          priority
        />
      </div>

      {/* Zoomed Image */}
      {isZoomed && (
        <div 
          className={`absolute inset-0 pointer-events-none ${
            isMobile ? 'bg-white' : ''
          }`}
        >
          <div
            className={`relative w-full h-full ${
              isMobile ? 'scale-150' : 'scale-200'
            }`}
            style={
              isMobile
                ? undefined
                : {
                    transform: `scale(2)`,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
            }
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
