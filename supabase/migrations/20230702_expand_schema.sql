-- ============================================================
-- 20230702_expand_schema.sql
-- Expand DB to match PRD-Tassofly-Admin-CMS
-- ============================================================

-- 1. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order int DEFAULT 0
);

INSERT INTO public.categories (slug, name, parent_id, sort_order) VALUES
  ('assets', 'Assets', NULL, 1),
  ('textures', 'Textures', NULL, 2),
  ('freebies', 'Freebies', NULL, 3)
ON CONFLICT (slug) DO NOTHING;

-- Sub-categories for assets
INSERT INTO public.categories (slug, name, parent_id, sort_order)
SELECT 'plugins-software', 'Plugins & Software', id, 1 FROM public.categories WHERE slug = 'assets'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (slug, name, parent_id, sort_order)
SELECT 'actions-templates', 'Actions & Templates', id, 2 FROM public.categories WHERE slug = 'assets'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (slug, name, parent_id, sort_order)
SELECT 'fonts-vector', 'Fonts & Vector', id, 3 FROM public.categories WHERE slug = 'assets'
ON CONFLICT (slug) DO NOTHING;

-- Sub-categories for textures
INSERT INTO public.categories (slug, name, parent_id, sort_order)
SELECT 'vintage-merch', 'Vintage & Merch', id, 1 FROM public.categories WHERE slug = 'textures'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (slug, name, parent_id, sort_order)
SELECT 'analog-print', 'Analog & Print', id, 2 FROM public.categories WHERE slug = 'textures'
ON CONFLICT (slug) DO NOTHING;

-- 2. Expand products table with PRD columns
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS includes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_by text DEFAULT 'TASSOFLY';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compatibility text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_freebie boolean DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 3. Bundles (the real bundle/deal packages from PRD)
CREATE TABLE IF NOT EXISTS public.bundles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  color text DEFAULT '#A3A3A3',
  save_amount numeric(10,2) DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Bundle ↔ Product many-to-many
CREATE TABLE IF NOT EXISTS public.bundle_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id uuid NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order int DEFAULT 0,
  UNIQUE(bundle_id, product_id)
);

-- 5. Homepage sections CMS
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text,
  heading text,
  subheading text,
  cta_text text,
  cta_link text,
  is_visible boolean DEFAULT true,
  sort_order int DEFAULT 0,
  content jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Seed default homepage sections
INSERT INTO public.homepage_sections (key, label, heading, subheading, cta_text, cta_link, sort_order, content) VALUES
  ('hero', '[HERO]', 'Design Smarter, Not Harder.', 'Premium Photoshop plugins, textures, actions, and design assets.', 'Shop All', '/shop', 1, '{"badges": [{"icon": "refresh-cw", "title": "FREE UPDATES", "subtitle": "FOR LIFE"}, {"icon": "zap", "title": "INSTANT", "subtitle": "DOWNLOAD"}, {"icon": "shield", "title": "SECURE", "subtitle": "CHECKOUT"}]}'),
  ('crowd_favorites', '[Crowd Favorites]', 'Beyond The Basics', 'Our most popular products, handpicked by the community.', 'View All Products', '/shop', 2, '{}'),
  ('shop_by_type', '[Shop By Type]', 'Browse By Category', 'Find exactly what you need for your next project.', NULL, NULL, 3, '{}'),
  ('build_bundle', '[Build Your Bundle]', 'Bundle & Save', 'The more you add, the more you save.', NULL, NULL, 4, '{"discount_tiers": [{"min_items": 2, "discount_percent": 15}, {"min_items": 4, "discount_percent": 25}]}'),
  ('popular_bundles', '[Popular Bundles]', 'Pre-Made Bundles', 'Curated collections at unbeatable prices.', 'View All Bundles', '/bundles', 5, '{}'),
  ('mission', '[Mission]', 'Our Mission', 'We create tools that empower designers to push creative boundaries.', NULL, NULL, 6, '{}')
ON CONFLICT (key) DO NOTHING;

-- 6. Section items — which products/bundles appear in which homepage section
CREATE TABLE IF NOT EXISTS public.section_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.homepage_sections(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('product', 'bundle')),
  item_id uuid NOT NULL,
  sort_order int DEFAULT 0
);

-- 7. Videos (Mission section)
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  thumbnail_url text,
  youtube_url text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0
);

-- 8. FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int DEFAULT 0,
  is_active boolean DEFAULT true
);

-- 9. Supabase Storage bucket for product images
-- NOTE: Run this in Supabase Dashboard → SQL Editor if storage schema not accessible:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
