"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const tiers = [
  { discount: "15%", label: "OFF", items: "2+ Items" },
  { discount: "20%", label: "OFF", items: "5+ Items" },
  { discount: "25%", label: "OFF", items: "8+ Items" },
];

export default function DiscountTiers() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {tiers.map((tier, i) => (
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
