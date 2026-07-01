"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bundle } from "@/types";

interface BundleCardProps {
  bundle: Bundle;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  return (
    <Link href={`/bundles`}>
      <motion.div
        className="group cursor-pointer h-full card-frame overflow-hidden accent-corner-tl accent-corner-tr accent-corner-bl accent-corner-br"
        whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)" }}
        transition={{ duration: 0.25 }}
      >
        {/* Top colored tab */}
        <div
          className="px-4 py-2.5"
          style={{ backgroundColor: bundle.color }}
        >
          <div className="dotted-title">
            <span className="font-display text-product-title text-white truncate">
              {bundle.name}
            </span>
          </div>
        </div>

        {/* Product collage area */}
        <div className="relative aspect-[4/3] bg-[#f5f5f5] p-3">
          <div className="grid grid-cols-2 gap-2 h-full">
            {bundle.products.slice(0, 4).map((productId, i) => (
              <div
                key={productId}
                className="bg-[#e8e8e8] rounded-[3px] flex items-center justify-center border border-[rgba(0,0,0,0.05)]"
                style={{ transform: `rotate(${(i - 1.5) * 2}deg)` }}
              >
                <span className="font-mono text-[9px] uppercase text-[#aaa] text-center px-2 tracking-wide">
                  {productId.replace(/-/g, " ").substring(0, 14)}
                </span>
              </div>
            ))}
          </div>

          {/* Save badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-accent-orange-bg text-accent-orange font-mono text-[10px] uppercase tracking-[0.08em] px-2.5 py-1.5 rounded-badge font-medium">
            SAVE ${bundle.saveAmount.toFixed(2)}
          </div>
        </div>

        {/* Bottom colored tab */}
        <div
          className="px-4 py-2.5"
          style={{ backgroundColor: bundle.color }}
        >
          <div className="dotted-title">
            <span className="font-display text-product-title text-white">
              {bundle.name.includes("MASTER") ? "MASTER KIT" : bundle.name.includes("GLITCH") ? "KIT" : bundle.name.includes("SILVER") ? "BUNDLE" : bundle.name.includes("MIXED") ? "MEDLEY" : bundle.name.includes("MERCHANDISE") ? "MASTER KIT" : "BUNDLE"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
