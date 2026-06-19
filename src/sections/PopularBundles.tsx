"use client";

import SectionHeader from "@/components/SectionHeader";
import BundleCard from "@/components/BundleCard";
import ScrollReveal from "@/components/ScrollReveal";
import { bundles } from "@/data/bundles";

export default function PopularBundles() {
  return (
    <section className="py-20 px-6 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-content mx-auto">
        <ScrollReveal>
          <SectionHeader
            label="[DEALS]"
            heading="Popular Bundles"
            link={{ href: "/bundles", text: "VIEW ALL" }}
          />
        </ScrollReveal>

        {/* 2 rows × 3 columns of bundle cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bundles.slice(0, 6).map((bundle, i) => (
            <ScrollReveal key={bundle.id} delay={i * 0.06}>
              <BundleCard bundle={bundle} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
