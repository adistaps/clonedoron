"use client";

import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import ScrollReveal from "@/components/ScrollReveal";

const categories = [
  { id: "assets", label: "[ASSETS]" },
  { id: "texture", label: "[TEXTURE]" },
  { id: "mockups", label: "[MOCKUPS]" },
  { id: "bundles", label: "[BUNDLES]" },
  { id: "vector", label: "[VECTOR]" },
];

const config = [
  { rotate: -1.2, bottom: 0, width: 300, overlap: 0 },
  { rotate: 0.5, bottom: 22, width: 270, overlap: -80 },
  { rotate: -0.5, bottom: 4, width: 270, overlap: -80 },
  { rotate: 0.8, bottom: 18, width: 250, overlap: -70 },
  { rotate: -0.3, bottom: 0, width: 250, overlap: -65 },
];

export default function ShopByType() {
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
          {categories.map((cat, i) => {
            const c = config[i];
            return (
              <ScrollReveal key={cat.id} delay={i * 0.06}>
                <Link
                  href={`/shop?category=${cat.id}`}
                  className="flex-shrink-0 flex flex-col group cursor-pointer"
                  style={{
                    width: `${c.width}px`,
                    marginLeft: i === 0 ? 0 : `${c.overlap}px`,
                    marginBottom: `${c.bottom}px`,
                    zIndex: categories.length - i,
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
                    el.style.zIndex = String(categories.length - i);
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
                    {/* Replace with <img> when images are ready */}
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