import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and anon key must be set in environment variables');
}

// Browser / client-side client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types matching our DB schema
export type DbProduct = {
  id: string;
  slug: string;
  name: string;
  sku?: string;
  type?: string;
  category_id?: string;
  price: number;
  image_url?: string;
  description?: string;
  features?: string[];
  includes?: string[];
  created_by?: string;
  compatibility?: string;
  badge?: string;
  is_freebie?: boolean;
  is_active?: boolean;
  created_at?: string;
};

export type DbBundle = {
  id: string;
  slug: string;
  name: string;
  color?: string;
  save_amount?: number;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
};

export type DbCategory = {
  id: string;
  slug: string;
  name: string;
  parent_id?: string | null;
  sort_order?: number;
};

export type DbHomepageSection = {
  id: string;
  key: string;
  label?: string;
  heading?: string;
  subheading?: string;
  cta_text?: string;
  cta_link?: string;
  is_visible: boolean;
  sort_order: number;
  content?: Record<string, unknown>;
};
