"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const product = getProductBySlug(slug);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const relatedProducts = getRelatedProducts(slug);

  if (!product) return null;

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-content mx-auto">
        {/* Breadcrumb */}
        <ScrollReveal>
          <div className="flex items-center gap-2 font-mono text-body-sm uppercase text-text-tertiary mb-8">
            <Link href="/shop" className="hover:text-text-primary transition-colors">SHOP</Link>
            <span>&rarr;</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-text-primary transition-colors">
              {product.category === "textures" ? "TEXTURES" : "ASSETS"}
            </Link>
            <span>&rarr;</span>
            <span className="text-text-primary">{product.name.toUpperCase()}</span>
          </div>
        </ScrollReveal>

        {/* Product Layout */}
        <div className="grid lg:grid-cols-[55%_45%] gap-12">
          {/* Left - Images */}
          <ScrollReveal>
            <div className="space-y-4">
              <div className="relative border border-[#CCCCCC] rounded-card overflow-hidden aspect-square bg-bg-secondary">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] flex items-center justify-center">
                  <span className="font-display text-display-s text-white/30 uppercase text-center px-8">
                    {product.name}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 text-white font-mono text-label uppercase px-2 py-1 rounded">
                  2X ZOOM
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="aspect-square border border-[#CCCCCC] rounded bg-bg-secondary flex items-center justify-center">
                  <span className="font-mono text-label uppercase text-text-tertiary">Before</span>
                </div>
                <div className="aspect-square border border-[#CCCCCC] rounded bg-bg-secondary flex items-center justify-center">
                  <span className="font-mono text-label uppercase text-text-tertiary">After</span>
                </div>
                <div className="aspect-square border border-[#CCCCCC] rounded bg-bg-secondary flex items-center justify-center">
                  <span className="font-mono text-label uppercase text-text-tertiary">Detail</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right - Info */}
          <ScrollReveal delay={0.1}>
            <div>
              <h1 className="font-display text-display-m text-text-primary mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-8">
                <span className="font-mono text-price text-text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <button className="inline-flex items-center gap-2 bg-accent-purple text-white rounded-button px-5 py-3 font-mono text-button uppercase tracking-[0.06em] hover:bg-accent-purple-hover transition-colors duration-200">
                  <Plus size={14} />
                  ADD TO CART
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Description */}
              <div className="border-t border-[rgba(0,0,0,0.08)] py-5">
                <p className="font-mono text-section-label uppercase text-text-tertiary mb-3">
                  [Description]
                </p>
                <p className="font-mono text-body text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div className="border-t border-[rgba(0,0,0,0.08)] py-5">
                  <p className="font-mono text-section-label uppercase text-text-tertiary mb-3">
                    [FEATURES]
                  </p>
                  <ul className="space-y-0">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="font-mono text-body text-text-primary py-3 border-b border-[rgba(0,0,0,0.06)] last:border-b-0"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes */}
              {product.includes.length > 0 && (
                <div className="border-t border-[rgba(0,0,0,0.08)] py-5">
                  <p className="font-mono text-section-label uppercase text-text-tertiary mb-3">
                    [INCLUDES]
                  </p>
                  <ul className="space-y-2">
                    {product.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 font-mono text-body text-text-secondary">
                        <span className="w-1.5 h-1.5 bg-[#CCCCCC] rounded-sm mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dropdowns */}
              <div className="border-t border-[rgba(0,0,0,0.08)] py-5 space-y-3">
                {/* Created By */}
                <div className="border border-[rgba(0,0,0,0.1)] rounded-card overflow-hidden">
                  <button
                    onClick={() => toggleDropdown("created")}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  >
                    <span className="font-mono text-body uppercase tracking-[0.02em] text-text-primary flex items-center gap-2">
                      [CREATED BY] <ChevronDown size={14} className={`transition-transform ${openDropdown === "created" ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {openDropdown === "created" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 font-mono text-body text-text-secondary">
                          <Link href="/about" className="underline hover:text-text-primary transition-colors">
                            {product.createdBy}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Compatibility */}
                <div className="border border-[rgba(0,0,0,0.1)] rounded-card overflow-hidden">
                  <button
                    onClick={() => toggleDropdown("compatibility")}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors"
                  >
                    <span className="font-mono text-body uppercase tracking-[0.02em] text-text-primary flex items-center gap-2">
                      [COMPATIBILITY] <ChevronDown size={14} className={`transition-transform ${openDropdown === "compatibility" ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {openDropdown === "compatibility" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 font-mono text-body text-text-secondary">
                          {product.compatibility}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <ScrollReveal>
              <SectionHeader
                label="[Crowd Favorites]"
                heading="Designers Also Loved:"
                link={{ href: "/shop", text: "VIEW ALL" }}
              />
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp, i) => (
                <ScrollReveal key={rp.id} delay={i * 0.05}>
                  <ProductCard product={rp} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
