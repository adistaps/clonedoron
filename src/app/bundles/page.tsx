"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import BundleCard from "@/components/BundleCard";
import DiscountTiers from "@/components/DiscountTiers";
import MarqueeTicker from "@/components/MarqueeTicker";
import ScrollReveal from "@/components/ScrollReveal";
import { bundles } from "@/data/bundles";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const bundleMarqueeItems = ["[ bundle & save ]", "[ more files ]", "[ less $$ ]"];

const bundleTabs = [
  { id: "all", label: "All Assets" },
  { id: "tools", label: "Tools" },
  { id: "mockups", label: "Mockups" },
  { id: "textures", label: "Textures" },
  { id: "fonts", label: "Fonts" },
  { id: "freebies", label: "Freebies" },
];

export default function BundlesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [bundleItems, setBundleItems] = useState<string[]>([]);

  const toggleBundleItem = (productId: string) => {
    setBundleItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
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
      if (activeTab === "tools") {
        return (
          product.subcategory === "plugins-software" ||
          product.subcategory === "actions-templates" ||
          product.type.toLowerCase().includes("plugin") ||
          product.type.toLowerCase().includes("action") ||
          product.type.toLowerCase().includes("template")
        );
      }
      if (activeTab === "mockups") {
        return (
          product.category === "mockups" ||
          product.subcategory === "clothing" ||
          product.type.toLowerCase().includes("mockup")
        );
      }
      if (activeTab === "textures") {
        return (
          product.category === "textures" ||
          product.type.toLowerCase().includes("texture")
        );
      }
      if (activeTab === "fonts") {
        return (
          product.subcategory === "fonts-vector" ||
          product.type.toLowerCase().includes("font")
        );
      }
      if (activeTab === "freebies") {
        return product.isFreebie;
      }
      return true;
    });
  }, [activeTab]);

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
            MORE FILES IN YOUR FOLDER, LESS $$ OUT OF YOUR WALLET. CHOOSE FROM CURATED BUNDLES FOR A LARGER DISCOUNT OR BUILD YOUR OWN BUNDLE.
          </p>
        </ScrollReveal>
      </section>

      {/* Marquee */}
      <MarqueeTicker items={bundleMarqueeItems} />

      {/* Bundle Cards */}
      <section className="py-section px-6">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map((bundle, i) => (
              <ScrollReveal key={bundle.id} delay={i * 0.1}>
                <BundleCard bundle={bundle} />
              </ScrollReveal>
            ))}
          </div>
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
                <p className="font-mono text-body text-accent-orange mb-1">
                  Save $20+
                </p>
                <p className="font-mono text-body-sm text-text-secondary uppercase">
                  20+ Legacy Mockups
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h2 className="font-display text-display-s text-text-primary mb-3">
                  Mix &amp; Match
                </h2>
                <p className="font-mono text-body text-text-secondary mb-6">
                  Design your perfect bundle by selecting 3 or more products. Enjoy more savings as you add more items.
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
                  <span className="font-mono text-body text-text-primary">
                    {bundleItems.length} Items
                  </span>
                  <span className="font-mono text-body text-accent-orange">
                    Save: ${savings.toFixed(2)} USD
                  </span>
                  <span className="font-mono text-body text-text-secondary">
                    Total cost: <span className="text-text-primary font-medium">${total.toFixed(2)}</span>
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
