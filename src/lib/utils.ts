import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-AE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Tier configuration
export const TIER_THRESHOLDS = {
  GREEN: { points: 0, discount: 0.07 },    // 0-499 points
  SILVER: { points: 500, discount: 0.12 },  // 500-999 points
  GOLD: { points: 1000, discount: 0.15 },   // 1000-2999 points
  PLATINUM: { points: 3000, discount: 0.20 } // 3000+ points
} as const;

export const TIER_BENEFITS = {
  GREEN: 'Earn 7% points on all orders',
  SILVER: 'Earn 12% points on all orders',
  GOLD: 'Earn 15% points on all orders',
  PLATINUM: 'Earn 20% points on all orders'
} as const;

export const TIER_COLORS = {
  GREEN: 'bg-green-600 text-white',
  SILVER: 'bg-silver text-black',
  GOLD: 'bg-gold text-black',
  PLATINUM: 'bg-platinum text-white',
} as const;

export type Tier = keyof typeof TIER_THRESHOLDS;

export function calculateTier(totalPoints: number): Tier {
  if (totalPoints >= TIER_THRESHOLDS.PLATINUM.points) return 'PLATINUM';
  if (totalPoints >= TIER_THRESHOLDS.GOLD.points) return 'GOLD';
  if (totalPoints >= TIER_THRESHOLDS.SILVER.points) return 'SILVER';
  return 'GREEN';
}

export function calculatePointsPreview(total: number, tier: Tier) {
  // Calculate points based on total order amount
  return Math.floor(total * TIER_THRESHOLDS[tier].discount);
}

export function calculateNextTierProgress(totalPoints: number) {
  const currentTier = calculateTier(totalPoints);
  const tiers = ['GREEN', 'SILVER', 'GOLD', 'PLATINUM'] as const;
  const currentTierIndex = tiers.indexOf(currentTier);
  
  if (currentTierIndex === tiers.length - 1) return null;
  
  const nextTier = tiers[currentTierIndex + 1];
  const pointsNeeded = TIER_THRESHOLDS[nextTier].points - totalPoints;
  const progress = (totalPoints / TIER_THRESHOLDS[nextTier].points) * 100;
  
  return {
    nextTier,
    pointsNeeded: Math.max(0, pointsNeeded),
    progress: Math.min(100, progress)
  };
}
