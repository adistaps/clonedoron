"use client";

import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import CornerDots from "@/components/CornerDots";
import ScrollReveal from "@/components/ScrollReveal";
import { products } from "@/data/products";

const favoriteProducts = [
  products[0], // DITHERTONE Pro
  products[2], // Printer Noise Textures
  products[1], // Worn Plastisol 2
  products[3], // mobGlow
];

export default function CrowdFavorites() {
  return (
    <section className="relative py-20 px-6 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-content mx-auto relative">
        <CornerDots className="top-0 left-0" />
        <CornerDots className="top-0 right-0" />
        <CornerDots className="bottom-0 left-0" />
        <CornerDots className="bottom-0 right-0" />

        <ScrollReveal>
          <SectionHeader
            label="[Crowd Favorites]"
            heading="Beyond The Basics"
            link={{ href: "/shop", text: "VIEW ALL" }}
          />
        </ScrollReveal>

        {/* 4 Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {favoriteProducts.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        {/* Trusted By Section */}
        <ScrollReveal delay={0.2}>
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand 1 */}
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.12em]">
                  [TRUSTED BY]
                </span>
                <div className="h-8 flex items-center">
                  <span className="font-display text-[22px] font-bold tracking-tight text-text-primary">
                    Supreme
                  </span>
                </div>
                <p className="font-mono text-[10px] text-text-secondary leading-relaxed uppercase tracking-wide">
                  We&apos;ve built tools used by the biggest names in streetwear and merchandise.
                </p>
              </div>

              {/* Brand 2 */}
              <div className="flex flex-col gap-2.5 pt-0 md:pt-[22px]">
                <div className="h-8 flex items-center">
                  <span className="font-display text-[22px] font-bold tracking-[-0.05em] text-text-primary uppercase">
                    METALLICA
                  </span>
                </div>
                <p className="font-mono text-[10px] text-text-secondary leading-relaxed uppercase tracking-wide">
                  From industry titans to bedroom designers, our assets are trusted globally.
                </p>
              </div>

              {/* Brand 3 */}
              <div className="flex flex-col gap-2.5 pt-0 md:pt-[22px]">
                <div className="h-8 flex items-center">
                  <span className="font-display text-[22px] font-bold text-text-primary">
                    <span className="text-[#E8392C]">A</span>dobe
                  </span>
                </div>
                <p className="font-mono text-[10px] text-text-secondary leading-relaxed uppercase tracking-wide">
                  Trusted by Adobe themselves to provide premium assets to their users.
                </p>
              </div>

              {/* Brand 4 */}
              <div className="flex flex-col gap-2.5 pt-0 md:pt-[22px]">
                <div className="h-8 flex items-center">
                  <span className="font-display text-[22px] font-bold italic tracking-[-0.04em] text-text-primary">
                    100 THIEVES
                  </span>
                </div>
                <p className="font-mono text-[10px] text-text-secondary leading-relaxed uppercase tracking-wide">
                  Used to create merchandise for the biggest esports organization in the world.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
