'use client';

import { ProductVariation } from '@/types/product';
import { formatPrice } from '@/services/api';

interface VariationSelectorProps {
  variation: ProductVariation;
  basePrice: number;
  selectedOption: string;
  onSelect: (optionId: string) => void;
}

export default function VariationSelector({ 
  variation, 
  basePrice,
  selectedOption,
  onSelect 
}: VariationSelectorProps) {
  // Check if the variation type is SIZE (case insensitive)
  const isSize = variation.type === 'SIZE';

  if (isSize) {
    return (
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-gray-700 uppercase min-w-[80px]">
          {variation.type}
        </label>
        <div className="flex flex-wrap gap-3 flex-1">
          {variation.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedOption === option.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }
              `}
            >
              <span>{option.value}</span>
              {option.priceAdjustment !== 0 && (
                <span className={`ml-1 text-xs ${selectedOption === option.id ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formatPrice(option.priceAdjustment)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm font-medium text-gray-700 uppercase min-w-[80px]">
        {variation.type}
      </label>
      <select
        value={selectedOption}
        onChange={(e) => onSelect(e.target.value)}
        className="flex-1 px-4 py-2 bg-gray-100 rounded-lg text-gray-900 appearance-none cursor-pointer"
      >
        {variation.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.value}
            {option.priceAdjustment !== 0 && (
              ` (${formatPrice(option.priceAdjustment)})`
            )}
          </option>
        ))}
      </select>
    </div>
  );
}
