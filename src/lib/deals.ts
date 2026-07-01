import { supabase } from "@/lib/supabase";

export interface Deal {
  id: string;
  product_id: string;
  title: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
}

/**
 * Fetch all active deals for today
 */
export async function fetchActiveDealsByDate(dateStr?: string): Promise<Map<string, Deal>> {
  const date = dateStr || new Date().toISOString().split("T")[0];

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .lte("start_date", date)
    .gte("end_date", date);

  const dealMap = new Map<string, Deal>();
  
  if (deals) {
    deals.forEach((deal: Deal) => {
      dealMap.set(deal.product_id, deal);
    });
  }

  return dealMap;
}

/**
 * Get deal for a specific product
 */
export async function getDealForProduct(productId: string): Promise<Deal | null> {
  const date = new Date().toISOString().split("T")[0];

  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .eq("product_id", productId)
    .lte("start_date", date)
    .gte("end_date", date)
    .limit(1);

  return deals && deals.length > 0 ? deals[0] : null;
}

/**
 * Calculate original price from discounted price
 */
export function calculateOriginalPrice(price: number, discountPercent: number): number {
  return price / (1 - discountPercent / 100);
}

/**
 * Calculate discounted price
 */
export function calculateDiscountedPrice(price: number, discountPercent: number): number {
  return price * (1 - discountPercent / 100);
}

/**
 * Format deal badge text
 */
export function formatDealBadge(discountPercent: number): string {
  return `${discountPercent}% OFF`;
}
