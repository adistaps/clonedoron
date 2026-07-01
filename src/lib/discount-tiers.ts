/**
 * Discount Tier utility — centralized source of truth for bundle discount logic
 * Fetches from Supabase homepage_sections key='build_bundle'
 */

import { supabase } from '@/lib/supabase';

export interface DiscountTier {
  min_items: number;
  discount_percent: number;
}

export interface DiscountTiersData {
  tiers: DiscountTier[];
}

/**
 * Fetch discount tiers from Supabase
 * Falls back to defaults if not found or empty
 */
export async function fetchDiscountTiers(): Promise<DiscountTier[]> {
  try {
    const { data } = await supabase
      .from('homepage_sections')
      .select('content')
      .eq('key', 'build_bundle')
      .single();

    if (data && data.content && Array.isArray(data.content.discount_tiers)) {
      return data.content.discount_tiers as DiscountTier[];
    }
  } catch (error) {
    console.error('[v0] Error fetching discount tiers:', error);
  }

  // Default fallback
  return [
    { min_items: 2, discount_percent: 15 },
    { min_items: 4, discount_percent: 25 },
  ];
}

/**
 * Calculate discount percentage for given item count
 * Returns highest tier that matches the count
 */
export function calculateDiscount(itemCount: number, tiers: DiscountTier[]): number {
  if (!tiers || tiers.length === 0) return 0;

  // Sort tiers by min_items descending to find highest applicable tier
  const sorted = [...tiers].sort((a, b) => b.min_items - a.min_items);

  for (const tier of sorted) {
    if (itemCount >= tier.min_items) {
      return tier.discount_percent / 100;
    }
  }

  return 0;
}

/**
 * Format tier display (used by DiscountTiers component)
 */
export function formatTierDisplay(tier: DiscountTier): {
  discount: string;
  label: string;
  items: string;
} {
  return {
    discount: `${tier.discount_percent}%`,
    label: 'OFF',
    items: `${tier.min_items}+ Items`,
  };
}
