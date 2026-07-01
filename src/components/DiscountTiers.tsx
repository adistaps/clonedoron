"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchDiscountTiers, formatTierDisplay, DiscountTier } from "@/lib/discount-tiers";
import ScrollReveal from "./ScrollReveal";

export default function DiscountTiers() {
  const [tiers, setTiers] = useState<DiscountTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTiers() {
      setLoading(true);
      const fetchedTiers = await fetchDiscountTiers();
      setTiers(fetchedTiers);
      setLoading(false);
    }
    loadTiers();
  }, []);

  if (loading) {
    return <div className="text-text-tertiary text-sm">Loading tiers...</div>;
  }

  const displayTiers = tiers.map(formatTierDisplay);

  return (
    <div className="grid grid-cols-3 gap-3">
      {displayTiers.map((tier, i) => (
        <ScrollReveal key={i} delay={i * 0.08}>
          <motion.div
            className="bg-white border border-[rgba(0,0,0,0.12)] rounded-[6px] px-4 py-6 text-center hover:border-[rgba(0,0,0,0.25)] transition-colors duration-200"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-display text-[2rem] md:text-display-m text-accent-orange leading-none mb-1">
              {tier.discount} <span className="text-[1.25rem] md:text-display-s">OFF</span>
            </p>
            <p className="font-mono text-[10px] text-text-tertiary uppercase tracking-[0.08em] mt-2">
              {tier.items}
            </p>
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  );
}
