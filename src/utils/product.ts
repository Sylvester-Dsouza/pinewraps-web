import { Product } from '@/types/product';

export function getProductPrice(product: Product): { min: number; max: number | null } {
  // If no variations, return base price
  if (!product.variations || product.variations.length === 0) {
    return { min: product.basePrice, max: null };
  }

  // First check for variant combinations
  try {
    const combinations = typeof product.variantCombinations === 'string' 
      ? JSON.parse(product.variantCombinations || '[]')
      : product.variantCombinations || [];

    if (Array.isArray(combinations) && combinations.length > 0) {
      const combinationPrices = combinations
        .map(combo => combo.price)
        .filter(price => typeof price === 'number');

      if (combinationPrices.length > 0) {
        return {
          min: Math.min(...combinationPrices),
          max: combinationPrices.length > 1 ? Math.max(...combinationPrices) : null
        };
      }
    }
  } catch (e) {
    console.error('Error parsing variant combinations:', e);
  }

  // If no valid combination prices, fall back to single variation prices
  const allPrices: number[] = [product.basePrice];
  product.variations.forEach(variation => {
    variation.options.forEach(option => {
      if (typeof option.priceAdjustment === 'number') {
        allPrices.push(product.basePrice + option.priceAdjustment);
      }
    });
  });

  // Return min and max prices
  return {
    min: Math.min(...allPrices),
    max: allPrices.length > 1 ? Math.max(...allPrices) : null
  };
}
