"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import DiscountTiers from "@/components/DiscountTiers";
import ScrollReveal from "@/components/ScrollReveal";
import { products } from "@/data/products";
import { categories } from "@/data/categories";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState("all-assets");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync category state from URL query parameter on mount or URL change
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const params = new URLSearchParams(window.location.search);
    params.set("category", cat);
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory && selectedCategory !== "all-assets") {
      filtered = filtered.filter((p) => {
        // Parent category mapping
        if (selectedCategory === "assets") return p.category === "assets";
        if (selectedCategory === "textures") return p.category === "textures";
        if (selectedCategory === "mockups") return p.category === "mockups" || p.subcategory === "clothing";
        if (selectedCategory === "tools") return p.subcategory === "plugins-software" || p.subcategory === "actions-templates";
        if (selectedCategory === "fonts") return p.subcategory === "fonts-vector";
        if (selectedCategory === "freebies") return p.isFreebie;
        if (selectedCategory === "bundles") return false; // Main product list doesn't show bundles

        // Subcategory mapping
        if (selectedCategory === "plugins-software") return p.subcategory === "plugins-software";
        if (selectedCategory === "actions-templates") return p.subcategory === "actions-templates";
        if (selectedCategory === "fonts-vector") return p.subcategory === "fonts-vector";
        if (selectedCategory === "all-textures") return p.category === "textures";
        if (selectedCategory === "analog-print") return p.subcategory === "analog-print";
        if (selectedCategory === "vintage-merch") return p.subcategory === "vintage-merch";
        if (selectedCategory === "clothing") return p.subcategory === "clothing";
        if (selectedCategory === "all-bundles") return false;
        if (selectedCategory === "popular") return ["dithertone-pro", "worn-plastisol-2", "printer-noise", "mobglow"].includes(p.id);
        if (selectedCategory === "best-sellers") return ["dithertone-pro", "vintone", "worn-plastisol-2"].includes(p.id);
        if (selectedCategory === "free") return p.isFreebie;
        return true;
      });
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

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
                    ? "All Assets"
                    : categories.find((c) => c.id === selectedCategory)?.name ||
                      categories.flatMap((c) => c.subcategories).find((s) => s.id === selectedCategory)?.name ||
                      selectedCategory.toUpperCase()}
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
