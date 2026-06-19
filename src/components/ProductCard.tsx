"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  showAddButton?: boolean;
}

export default function ProductCard({ product, showAddButton = true }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`}>
      <motion.div
        className="folder-tab-card group cursor-pointer"
        whileHover={{ y: -2 }}
        transition={{ duration: 250 }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-card">
          <div className="absolute inset-0 bg-gradient-to-br from-bg-secondary to-bg-tertiary flex items-center justify-center">
            <span className="font-display text-product-title text-text-tertiary uppercase">
              {product.name.split(" ")[0]}
            </span>
          </div>
          {product.badge && (
            <div className="absolute top-3 right-3 bg-accent-orange-bg text-accent-orange font-mono text-label uppercase tracking-[0.08em] px-2 py-1 rounded-badge">
              {product.badge}
            </div>
          )}
          {product.isFreebie && (
            <div className="absolute top-3 right-3 bg-accent-purple text-white font-mono text-label uppercase tracking-[0.08em] px-2 py-1 rounded-badge">
              FREEBIE
            </div>
          )}
        </div>

        {/* Title Bar */}
        <div className="px-4 py-3 border-b border-[rgba(0,0,0,0.06)]">
          <div className="dotted-title">
            <span className="font-display text-product-title text-text-primary truncate">
              {product.name}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-3">
          <p className="font-mono text-body uppercase tracking-[0.02em] text-text-primary mb-1">
            {product.name}
          </p>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 bg-text-tertiary rounded-sm" />
            <span className="font-mono text-label uppercase tracking-[0.08em] text-text-tertiary">
              {product.type}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-price text-text-primary">
              ${product.price.toFixed(2)} USD
            </span>
            {showAddButton && (
              <button
                onClick={(e) => e.preventDefault()}
                className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-tertiary hover:text-text-primary transition-colors duration-150 flex items-center gap-1"
              >
                <Plus size={12} /> Add Item
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
