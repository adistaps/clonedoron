"use client";

import { motion } from "framer-motion";

interface MarqueeTickerProps {
  items: string[];
  className?: string;
}

export default function MarqueeTicker({ items, className = "" }: MarqueeTickerProps) {
  const content = items.join(" \u00B7 ");

  return (
    <div className={`w-full overflow-hidden border-y border-[rgba(0,0,0,0.08)] ${className}`}>
      <motion.div
        className="flex whitespace-nowrap py-3"
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          duration: 30,
          ease: "linear",
        }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-secondary mx-0 shrink-0">
          {content} &middot;&nbsp;
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-text-secondary mx-0 shrink-0">
          {content} &middot;&nbsp;
        </span>
      </motion.div>
    </div>
  );
}
