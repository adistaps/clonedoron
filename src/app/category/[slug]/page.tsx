"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { products as staticProducts } from "@/data/products";

function dbToProduct(row: Record<string, unknown>) {
  return {
    id: (row.slug as string) || (row.id as string),
    slug: (row.slug as string) || (row.id as string),
    name: row.name as string,
    type: (row.type as string) || "",
    category: "",
    subcategory: "",
    price: (row.price as number) || 0,
    image: (row.image_url as string) || "",
    description: (row.description as string) || "",
    features: (row.features as string[]) || [],
    includes: (row.includes as string[]) || [],
    createdBy: (row.created_by as string) || "",
    compatibility: (row.compatibility as string) || "",
    isFreebie: (row.is_freebie as boolean) || false,
  };
}

export default function CategoryPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : (params.slug?.[0] ?? "");

  const [categoryName, setCategoryName] = useState<string>("");
  const [parentName, setParentName] = useState<string | null>(null);
  const [parentSlug, setParentSlug] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<{ id: string; slug: string; name: string }[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof dbToProduct>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function loadCategory() {
      setLoading(true);

      // 1. Get the category
      const { data: cat } = await supabase
        .from("categories")
        .select("*, parent:parent_id(id, slug, name)")
        .eq("slug", slug)
        .single();

      if (cat) {
        setCategoryName(cat.name);
        const parent = cat.parent as { id?: string; slug?: string; name?: string } | null;
        if (parent && parent.name) {
          setParentName(parent.name);
          setParentSlug(parent.slug ?? null);
        }

        // 2. Get sub-categories
        const { data: subs } = await supabase
          .from("categories")
          .select("id, slug, name")
          .eq("parent_id", cat.id)
          .order("sort_order");

        setSubCategories((subs as { id: string; slug: string; name: string }[]) || []);

        // 3. Fetch products for this category + subcategories
        // Get all category ids including self and children
        const catIds = [cat.id, ...((subs as { id: string }[]) || []).map((s) => s.id)];

        const { data: dbProducts } = await supabase
          .from("products")
          .select("*")
          .in("category_id", catIds)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts.map(dbToProduct));
        } else {
          // Fallback: filter static products by category slug
          const matched = staticProducts.filter(
            (p) =>
              (p as unknown as { category?: string }).category === slug ||
              (p as unknown as { subcategory?: string }).subcategory === slug
          );
          setProducts(matched.map((p) => ({ ...p, image: p.image || "", isFreebie: p.isFreebie ?? false })));
        }
      } else {
        // Category not found in DB — try static fallback
        const matched = staticProducts.filter(
          (p) =>
            (p as unknown as { category?: string }).category === slug ||
            (p as unknown as { subcategory?: string }).subcategory === slug
        );
        setCategoryName(slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
        setProducts(matched.map((p) => ({ ...p, image: p.image || "", isFreebie: p.isFreebie ?? false })));
      }

      setLoading(false);
    }

    loadCategory();
  }, [slug]);

  return (
    <div className="pt-20 pb-16 px-6">
      <div className="max-w-content mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-text-tertiary mb-8">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-text-primary transition-colors">Shop</Link>
          {parentName && parentSlug && (
            <>
              <ChevronRight size={12} />
              <Link href={`/category/${parentSlug}`} className="hover:text-text-primary transition-colors">
                {parentName}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-text-primary font-semibold">{categoryName || slug}</span>
        </nav>

        {/* Header */}
        <ScrollReveal>
          <div className="mb-10">
            <h1 className="font-display text-display-m text-text-primary mb-3">
              {categoryName || slug.replace(/-/g, " ")}
            </h1>
            <p className="font-mono text-body-sm text-text-secondary uppercase tracking-wide">
              {loading ? "Loading..." : `${products.length} product${products.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </ScrollReveal>

        {/* Sub-category pills */}
        {subCategories.length > 0 && (
          <ScrollReveal>
            <div className="flex flex-wrap gap-2 mb-8">
              {subCategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${sub.slug}`}
                  className="px-4 py-2 border border-[#CCCCCC] rounded-button font-mono text-body-sm uppercase tracking-[0.06em] text-text-secondary hover:bg-text-primary hover:text-white hover:border-text-primary transition-colors duration-200"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="py-16 text-center font-mono text-text-tertiary uppercase">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-body text-text-tertiary uppercase">No products in this category yet.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 font-mono text-body-sm uppercase underline underline-offset-4 text-text-secondary hover:text-text-primary transition-colors"
            >
              Browse All Products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.03}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
