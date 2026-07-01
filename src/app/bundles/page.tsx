"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import BundleCard from "@/components/BundleCard";
import DiscountTiers from "@/components/DiscountTiers";
import MarqueeTicker from "@/components/MarqueeTicker";
import ScrollReveal from "@/components/ScrollReveal";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { bundles as staticBundles } from "@/data/bundles";
import { products as staticProducts } from "@/data/products";

const bundleMarqueeItems = ["[ bundle & save ]", "[ more files ]", "[ less $$ ]"];

const bundleTabs = [
  { id: "all", label: "All Assets" },
  { id: "plugin", label: "Plugins" },
  { id: "textures", label: "Textures" },
  { id: "template", label: "Templates" },
  { id: "font", label: "Fonts" },
  { id: "freebies", label: "Freebies" },
];

function dbToBundle(row: Record<string, unknown>) {
  return {
    id: (row.slug as string) || (row.id as string),
    slug: (row.slug as string) || (row.id as string),
    name: row.name as string,
    color: (row.color as string) || "#A3A3A3",
    saveAmount: (row.save_amount as number) || 0,
    image: (row.image_url as string) || "",
    products: [] as string[],
  };
}

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

export default function BundlesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [bundleItems, setBundleItems] = useState<string[]>([]);
  const [bundles, setBundles] = useState(staticBundles);
  const [products, setProducts] = useState(staticProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [{ data: dbBundles }, { data: dbProducts }] = await Promise.all([
        supabase.from("bundles").select("*").eq("is_active", true).order("created_at", { ascending: false }),
        supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }),
      ]);

      if (dbBundles && dbBundles.length > 0) setBundles(dbBundles.map(dbToBundle) as typeof staticBundles);
      if (dbProducts && dbProducts.length > 0) setProducts(dbProducts.map(dbToProduct) as typeof staticProducts);

      setLoading(false);
    }
    loadData();
  }, []);

  const toggleBundleItem = (productId: string) => {
    setBundleItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const getDiscount = () => {
    const count = bundleItems.length;
    if (count >= 8) return 0.25;
    if (count >= 5) return 0.20;
    if (count >= 3) return 0.15;
    return 0;
  };

  const subtotal = bundleItems.reduce((sum, id) => {
    const p = products.find((pr) => pr.id === id);
    return sum + (p?.price || 0);
  }, 0);

  const discount = getDiscount();
  const savings = subtotal * discount;
  const total = subtotal - savings;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeTab === "all") return true;
      if (activeTab === "freebies") return product.isFreebie;
      return product.type?.toLowerCase().includes(activeTab.toLowerCase());
    });
  }, [activeTab, products]);

  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="px-6 pt-12 pb-8 text-center">
        <ScrollReveal>
          <span className="inline-block bg-accent-orange-bg text-accent-orange font-mono text-label uppercase tracking-[0.08em] px-3 py-1.5 rounded-badge mb-4">
            SAVE UP TO 50%
          </span>
          <h1 className="font-display text-display-l text-text-primary mb-4">
            Bundle &amp; Save.
          </h1>
          <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary max-w-md mx-auto leading-relaxed">
            MORE FILES IN YOUR FOLDER, LESS $$ OUT OF YOUR WALLET. CHOOSE FROM CURATED BUNDLES OR BUILD YOUR OWN.
          </p>
        </ScrollReveal>
      </section>

      {/* Marquee */}
      <MarqueeTicker items={bundleMarqueeItems} />

      {/* Bundle Cards */}
      <section className="py-section px-6">
        <div className="max-w-content mx-auto">
          {loading ? (
            <div className="text-center py-8 font-mono text-text-tertiary">Loading bundles...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bundles.map((bundle, i) => (
                <ScrollReveal key={bundle.id} delay={i * 0.1}>
                  <BundleCard bundle={bundle} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Mix & Match */}
      <section className="bg-bg-secondary py-section px-6">
        <div className="max-w-content mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <h2 className="font-display text-heading-m text-text-primary mb-2">
                  Legacy Bundle
                </h2>
                <p className="font-mono text-body text-accent-orange mb-1">Save $20+</p>
                <p className="font-mono text-body-sm text-text-secondary uppercase">20+ Legacy Mockups</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div>
                <h2 className="font-display text-display-s text-text-primary mb-3">Mix &amp; Match</h2>
                <p className="font-mono text-body text-text-secondary mb-6">
                  Design your perfect bundle by selecting 3 or more products.
                </p>
                <DiscountTiers />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product List with Add to Bundle */}
      <section className="py-section px-6">
        <div className="max-w-content mx-auto">
          {/* Bundle Summary Bar */}
          {bundleItems.length > 0 && (
            <ScrollReveal>
              <div className="bg-bg-secondary border border-[#CCCCCC] rounded-card p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <span className="font-mono text-body text-text-primary">{bundleItems.length} Items</span>
                  <span className="font-mono text-body text-accent-orange">Save: ${savings.toFixed(2)} USD</span>
                  <span className="font-mono text-body text-text-secondary">
                    Total: <span className="text-text-primary font-medium">${total.toFixed(2)}</span>
                  </span>
                </div>
                <button className="bg-accent-purple text-white rounded-button px-5 py-2.5 font-mono text-button uppercase tracking-[0.06em] hover:bg-accent-purple-hover transition-colors duration-200">
                  CHECKOUT BUNDLE
                </button>
              </div>
            </ScrollReveal>
          )}

          {/* Tabs */}
          <ScrollReveal>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {bundleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 font-mono text-button uppercase tracking-[0.06em] rounded-button border transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-text-primary text-white border-text-primary"
                      : "bg-white text-text-secondary border-[#CCCCCC] hover:bg-bg-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 0.03}>
                <div className="relative">
                  <ProductCard product={product} showAddButton={false} />
                  <button
                    onClick={() => toggleBundleItem(product.id)}
                    className={`absolute bottom-3 right-3 font-mono text-body-sm uppercase tracking-[0.04em] flex items-center gap-1 px-3 py-1.5 rounded-button border transition-all duration-200 ${
                      bundleItems.includes(product.id)
                        ? "bg-accent-purple text-white border-accent-purple"
                        : "bg-white text-text-tertiary border-[#CCCCCC] hover:text-text-primary hover:border-text-primary"
                    }`}
                  >
                    <Plus size={12} />
                    {bundleItems.includes(product.id) ? "Added" : "Add Item"}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
