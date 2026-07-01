"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/lib/supabase";

const STATIC_CATEGORIES = [
  { id: "assets", slug: "assets", label: "[ASSETS]" },
  { id: "texture", slug: "textures", label: "[TEXTURE]" },
  { id: "mockups", slug: "mockups", label: "[MOCKUPS]" },
  { id: "bundles", slug: "bundles", label: "[BUNDLES]" },
  { id: "vector", slug: "vector", label: "[VECTOR]" },
];

const config = [
  { rotate: -1.2, bottom: 0, width: 300, overlap: 0 },
  { rotate: 0.5, bottom: 22, width: 270, overlap: -80 },
  { rotate: -0.5, bottom: 4, width: 270, overlap: -80 },
  { rotate: 0.8, bottom: 18, width: 250, overlap: -70 },
  { rotate: -0.3, bottom: 0, width: 250, overlap: -65 },
];

type CatItem = { id: string; slug: string; label: string };

export default function ShopByType() {
  const [categories, setCategories] = useState<CatItem[]>(STATIC_CATEGORIES);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, slug, name")
        .is("parent_id", null)
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setCategories(
          data.map((c: { id: string; slug: string; name: string }) => ({
            id: c.id,
            slug: c.slug,
            label: `[${c.name.toUpperCase()}]`,
          }))
        );
      }
    }
    fetchCategories();
  }, []);

  const displayCats = categories.slice(0, 5);

  return (
    <section className="py-20 px-6 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-content mx-auto">
        <ScrollReveal>
          <SectionHeader
            label="[all assets]"
            heading="Shop By Type"
            link={{ href: "/shop", text: "VIEW ALL" }}
          />
        </ScrollReveal>

        {/* Overlapping folder cards */}
        <div className="flex items-end justify-center mt-10 overflow-hidden" style={{ paddingBottom: "28px" }}>
          {displayCats.map((cat, i) => {
            const c = config[i] || config[config.length - 1];
            return (
              <ScrollReveal key={cat.id} delay={i * 0.06}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex-shrink-0 flex flex-col group cursor-pointer"
                  style={{
                    width: `${c.width}px`,
                    marginLeft: i === 0 ? 0 : `${c.overlap}px`,
                    marginBottom: `${c.bottom}px`,
                    zIndex: displayCats.length - i,
                    transform: `rotate(${c.rotate}deg)`,
                    position: "relative",
                    transition: "transform 0.3s ease, z-index 0s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.zIndex = "99";
                    el.style.transform = `rotate(${c.rotate}deg) translateY(-14px)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.zIndex = String(displayCats.length - i);
                    el.style.transform = `rotate(${c.rotate}deg)`;
                  }}
                >
                  {/* Folder tab */}
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary"
                    style={{
                      background: "#eaeaea",
                      border: "1px solid #ccc",
                      borderBottom: "none",
                      padding: "4px 12px",
                      width: "fit-content",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    {cat.label}
                  </span>

                  {/* Card body */}
                  <div
                    style={{
                      width: "100%",
                      height: `${Math.round(c.width * 1.45)}px`,
                      background: "#f0f0f0",
                      border: "1px solid #ccc",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className="group-hover:shadow-md transition-shadow duration-300"
                  >
                    <span className="font-mono text-[11px] text-[#bbb] uppercase tracking-[0.1em]">
                      {cat.label}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}