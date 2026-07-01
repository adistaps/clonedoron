"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import DiscountTiers from "@/components/DiscountTiers";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { products as staticProducts } from "@/data/products";
import { categories as staticCategories } from "@/data/categories";

// Map DB product row to frontend Product shape
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

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState("all-assets");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(staticProducts);
  const [categories, setCategories] = useState(staticCategories);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Sync category state from URL query parameter
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Fetch live data from Supabase
  useEffect(() => {
    async function loadData() {
      setLoadingProducts(true);

      // Load products
      const { data: dbProducts } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (dbProducts && dbProducts.length > 0) {
        setProducts(dbProducts.map(dbToProduct) as typeof staticProducts);
      }

      // Load categories for filter sidebar
      const { data: dbCats } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (dbCats && dbCats.length > 0) {
        // Build tree matching the CategoryFilter component format
        const parents = dbCats.filter((c: { parent_id: string | null }) => !c.parent_id);
        const built = parents.map((p: { id: string; slug: string; name: string }) => ({
          id: p.slug,
          name: p.name,
          subcategories: dbCats
            .filter((c: { parent_id: string }) => c.parent_id === p.id)
            .map((c: { slug: string; name: string }) => ({ id: c.slug, name: c.name })),
        }));
        setCategories(built as typeof staticCategories);
      }

      setLoadingProducts(false);
    }

    loadData();
  }, []);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(window.location.search);
    params.set("category", cat);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory && selectedCategory !== "all-assets") {
      filtered = filtered.filter((p) => {
        if (selectedCategory === "freebies" || selectedCategory === "free") return p.isFreebie;
        // Match by category slug or subcategory slug stored in the product
        return (
          (p as unknown as { category?: string }).category === selectedCategory ||
          (p as unknown as { subcategory?: string }).subcategory === selectedCategory ||
          p.type?.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery, products]);

  return (
    <div className="pt-20 pb-16 px-6">
      <div className="max-w-content mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <aside className="lg:w-[280px] shrink-0">
            <ScrollReveal>
              <h1 className="font-display text-display-s text-text-primary mb-6">
                All Assets
              </h1>

              {/* Search */}
              <div className="relative mb-6">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-[#CCCCCC] rounded-button pl-9 pr-4 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary bg-white focus:outline-none focus:border-accent-purple transition-colors"
                />
              </div>

              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                selected={selectedCategory}
                onSelect={handleSelectCategory}
              />

              {/* Special Offer */}
              <div className="mt-8 border border-[#CCCCCC] rounded-card p-4">
                <p className="font-mono text-label uppercase text-text-tertiary mb-3">
                  [Special offer]
                </p>
                <div className="space-y-2 font-mono text-body-sm text-text-secondary uppercase">
                  <p>3-5 ITEMS — <span className="text-accent-orange">15% OFF</span></p>
                  <p>5-7 ITEMS — <span className="text-accent-orange">20% OFF</span></p>
                  <p>8+ ITEMS — <span className="text-accent-orange">25% OFF</span></p>
                </div>
              </div>
            </ScrollReveal>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <ScrollReveal>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-display-s text-text-primary">
                  {selectedCategory === "all-assets"
                    ? `All Assets (${filteredProducts.length})`
                    : `${selectedCategory.replace(/-/g, " ").toUpperCase()} (${filteredProducts.length})`}
                </h2>
                <div className="relative w-60">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-[#CCCCCC] rounded-button pl-9 pr-4 py-2 font-mono text-body-sm text-text-primary placeholder:text-text-tertiary bg-white focus:outline-none focus:border-accent-purple transition-colors"
                  />
                </div>
              </div>
            </ScrollReveal>

            {loadingProducts ? (
              <div className="py-16 text-center text-text-tertiary font-mono text-sm">
                Loading products...
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, i) => (
                    <ScrollReveal key={product.id} delay={i * 0.03}>
                      <ProductCard product={product} />
                    </ScrollReveal>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16">
                    <p className="font-mono text-body text-text-tertiary uppercase">
                      No products found
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center font-mono uppercase text-text-tertiary">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
