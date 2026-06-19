"use client";

import Link from "next/link";
import { ArrowRight, Square } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import DiscountTiers from "@/components/DiscountTiers";
import CornerDots from "@/components/CornerDots";

export default function BuildBundle() {
  return (
    <section className="relative bg-white py-20 px-6 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-content mx-auto relative">
        <CornerDots className="top-0 left-0" />
        <CornerDots className="top-0 right-0" />
        <CornerDots className="bottom-0 left-0" />
        <CornerDots className="bottom-0 right-0" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-20">
          {/* Left side: Text */}
          <ScrollReveal className="flex-1 max-w-lg">
            <h2 className="font-display text-display-m text-text-primary mb-2 leading-[1.05] italic">
              Build Your Own
              <br />
              Bundle and Save
            </h2>
            <p className="font-mono text-[10px] uppercase text-text-secondary max-w-sm mt-5 mb-8 tracking-[0.06em] leading-relaxed">
              ADD 2 OR MORE ASSETS TO YOUR CART &amp; ENJOY 15% OFF, WITH MORE SAVINGS AS YOU ADD MORE.
            </p>
            <Link
              href="/bundles"
              className="inline-flex items-center gap-3 bg-accent-purple text-white rounded-[4px] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-accent-purple-hover transition-colors duration-200"
            >
              <Square size={8} fill="currentColor" />
              EXPLORE PRODUCTS
              <ArrowRight size={14} />
            </Link>
          </ScrollReveal>

          {/* Right side: Discount Tiers */}
          <ScrollReveal delay={0.1} className="w-full lg:w-[480px]">
            <DiscountTiers />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
