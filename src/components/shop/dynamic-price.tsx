'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/services/api';
import { ProductVariation } from '@/types/product';
import VariationSelector from './variation-selector';

interface DynamicPriceProps {
  basePrice: number;
  variations: ProductVariation[];
  combinations?: Array<{
    size: string;
    flavour: string;
    price: number;
  }>;
  onPriceChange: (price: number) => void;
  onVariationsChange: (variations: Array<{
    type: string;
    value: string;
    priceAdjustment: number;
  }>) => void;
}

export default function DynamicPrice({ 
  basePrice, 
  variations = [],
  combinations = [],
  onPriceChange,
  onVariationsChange
}: DynamicPriceProps) {
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [currentPrice, setCurrentPrice] = useState(basePrice);

  // Helper function to get option value by ID
  const getOptionValue = (variationId: string, optionId: string) => {
    const variation = variations.find(v => v.id === variationId);
    const option = variation?.options.find(o => o.id === optionId);
    return option?.value || '';
  };

  // Helper function to get option price adjustment by ID
  const getOptionPriceAdjustment = (variationId: string, optionId: string) => {
    const variation = variations.find(v => v.id === variationId);
    const option = variation?.options.find(o => o.id === optionId);
    return option?.priceAdjustment || 0;
  };

  // Helper function to update selected variations array
  const updateSelectedVariationsArray = () => {
    const selectedArray = variations.map(variation => {
      const selectedOptionId = selectedVariations[variation.id];
      return {
        type: variation.type,
        value: getOptionValue(variation.id, selectedOptionId),
        priceAdjustment: getOptionPriceAdjustment(variation.id, selectedOptionId)
      };
    });
    onVariationsChange(selectedArray);
  };

  // Set default selections and calculate initial price
  useEffect(() => {
    const defaults: Record<string, string> = {};
    let initialPrice = basePrice;

    if (variations.length > 0) {
      variations.forEach(variation => {
        if (variation.options.length > 0) {
          defaults[variation.id] = variation.options[0].id;
        }
      });

      // Try to find combination price for default selections
      const size = getOptionValue(
        variations.find(v => v.type === 'SIZE')?.id || '',
        defaults[variations.find(v => v.type === 'SIZE')?.id || '']
      );
      const flavour = getOptionValue(
        variations.find(v => v.type === 'FLAVOUR')?.id || '',
        defaults[variations.find(v => v.type === 'FLAVOUR')?.id || '']
      );

      const combination = combinations.find(c => c.size === size && c.flavour === flavour);
      if (combination) {
        initialPrice = combination.price;
      }
    }

    setSelectedVariations(defaults);
    setCurrentPrice(initialPrice);
    onPriceChange(initialPrice);
  }, [variations, basePrice, combinations, onPriceChange]);

  // Calculate and update price when variations change
  useEffect(() => {
    // Get selected size and flavour values
    const sizeVariation = variations.find(v => v.type === 'SIZE');
    const flavourVariation = variations.find(v => v.type === 'FLAVOUR');

    const selectedSize = getOptionValue(
      sizeVariation?.id || '',
      selectedVariations[sizeVariation?.id || '']
    );
    const selectedFlavour = getOptionValue(
      flavourVariation?.id || '',
      selectedVariations[flavourVariation?.id || '']
    );

    // First check if there's a combination price (for multiple variations)
    const combination = combinations.find(
      c => c.size === selectedSize && c.flavour === selectedFlavour
    );

    if (combination) {
      // Use combination price if found
      setCurrentPrice(combination.price);
      onPriceChange(combination.price);
    } else {
      // If no combination price, check for individual variation prices
      let finalPrice = basePrice;
      let useBasePrice = true;

      // Check if we have any variations with price adjustments
      for (const variation of variations) {
        const selectedOptionId = selectedVariations[variation.id];
        const selectedOption = variation.options.find(opt => opt.id === selectedOptionId);
        
        if (selectedOption && selectedOption.priceAdjustment !== 0) {
          // If any variation has a price adjustment, we'll use that instead of base price
          useBasePrice = false;
          finalPrice = selectedOption.priceAdjustment;
          break;
        }
      }

      // Set the final price
      setCurrentPrice(finalPrice);
      onPriceChange(finalPrice);
    }

    updateSelectedVariationsArray();
  }, [selectedVariations, variations, combinations, basePrice, onPriceChange]);

  const handleVariationChange = (variationId: string, optionId: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationId]: optionId
    }));
  };

  return (
    <div className="space-y-6">
      {/* Current Price Display */}
      <div className="text-3xl font-bold text-gray-900">
        {formatPrice(currentPrice)}
      </div>

      {/* Variations */}
      <div className="space-y-3">
        {variations
          .filter(variation => {
            // Only show variations that have options
            return variation.options && variation.options.length > 0;
          })
          .map((variation) => (
            <div key={variation.id}>
              <VariationSelector
                variation={variation}
                basePrice={basePrice}
                selectedOption={selectedVariations[variation.id] || variation.options[0]?.id || ''}
                onSelect={(optionId) => handleVariationChange(variation.id, optionId)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
