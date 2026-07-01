"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import BundleCard from "@/components/BundleCard";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";
import { bundles as staticBundles } from "@/data/bundles";

// Map DB row → BundleCard format
function dbToBundle(row: Record<string, unknown>) {
  return {
    id: (row.slug as string) || (row.id as string),
    slug: (row.slug as string) || (row.id as string),
    name: row.name as string,
    color: (row.color as string) || "#A3A3A3",
    saveAmount: (row.save_amount as number) || 0,
    image: (row.image_url as string) || "",
    products: [] as string[],
  };
}

export default function PopularBundles() {
  const [displayBundles, setDisplayBundles] = useState(staticBundles.slice(0, 6));

  useEffect(() => {
    async function fetchBundles() {
      // Fetch all products and bundle_products for populating products in bundles
      const [{ data: allProducts }, { data: bundleProducts }] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true),
        supabase.from("bundle_products").select("bundle_id, product_id").order("sort_order"),
      ]);

      // Try to get featured bundles from section_items for popular_bundles section
      const { data: section } = await supabase
        .from("homepage_sections")
        .select("id")
        .eq("key", "popular_bundles")
        .single();

      if (section?.id) {
        const { data: items } = await supabase
          .from("section_items")
          .select("item_id, sort_order")
          .eq("section_id", section.id)
          .eq("item_type", "bundle")
          .order("sort_order", { ascending: true })
          .limit(6);

        if (items && items.length > 0) {
          const bundleIds = items.map((i: { item_id: string }) => i.item_id);
          const { data: bundles } = await supabase
            .from("bundles")
            .select("*")
            .in("id", bundleIds)
            .eq("is_active", true);

          if (bundles && bundles.length > 0) {
            // Populate products in bundles
            const bundleProductMap = new Map<string, string[]>();
            bundleProducts?.forEach((bp: any) => {
              const bundleId = bp.bundle_id as string;
              if (!bundleProductMap.has(bundleId)) {
                bundleProductMap.set(bundleId, []);
              }
              bundleProductMap.get(bundleId)!.push(bp.product_id as string);
            });

            const sorted = bundleIds
              .map((id: string) => {
                const bundle = bundles.find((b) => b.id === id);
                if (!bundle) return null;
                
                const transformed = dbToBundle(bundle);
                const productIds = bundleProductMap.get(bundle.id);
                if (productIds) {
                  transformed.products = productIds
                    .map(productId => {
                      const product = allProducts?.find((p: any) => p.id === productId);
                      return product?.slug || productId;
                    })
                    .filter(Boolean);
                }
                return transformed;
              })
              .filter(Boolean);

            setDisplayBundles(sorted);
            return;
          }
        }
      }

      // Fallback: latest 6 active bundles from DB
      const { data: allBundles } = await supabase
        .from("bundles")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (allBundles && allBundles.length > 0) {
        // Populate products in bundles
        const bundleProductMap = new Map<string, string[]>();
        bundleProducts?.forEach((bp: any) => {
          const bundleId = bp.bundle_id as string;
          if (!bundleProductMap.has(bundleId)) {
            bundleProductMap.set(bundleId, []);
          }
          bundleProductMap.get(bundleId)!.push(bp.product_id as string);
        });

        const populatedBundles = allBundles.map((bundle: any) => {
          const transformed = dbToBundle(bundle);
          const productIds = bundleProductMap.get(bundle.id);
          if (productIds) {
            transformed.products = productIds
              .map(productId => {
                const product = allProducts?.find((p: any) => p.id === productId);
                return product?.slug || productId;
              })
              .filter(Boolean);
          }
          return transformed;
        });

        setDisplayBundles(populatedBundles);
      }
      // else keep static fallback
    }

    fetchBundles();
  }, []);

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
          {displayBundles.map((bundle, i) => (
            <ScrollReveal key={bundle.id} delay={i * 0.06}>
              <BundleCard bundle={bundle} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
