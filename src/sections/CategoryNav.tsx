"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { shopCategoryNav } from "@/data/categories";

export default function CategoryNav() {
  return (
    <section className="border-y border-[rgba(0,0,0,0.08)]">
      <div className="flex overflow-x-auto">
        {shopCategoryNav.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.id}`}
            className="flex-shrink-0 flex items-center gap-3 px-5 py-5 border-r border-[rgba(0,0,0,0.08)] hover:bg-bg-secondary transition-colors duration-200 group min-w-[160px]"
          >
            <div>
              <p className="font-mono text-label text-text-tertiary mb-1">
                [{cat.number}]
              </p>
              <div className="w-12 h-12 bg-bg-tertiary rounded flex items-center justify-center mb-1">
                <span className="font-mono text-label uppercase text-text-tertiary">
                  {cat.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-mono text-body text-text-primary lowercase">
                {cat.name}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="text-[#CCCCCC] group-hover:translate-x-1 transition-transform duration-200 shrink-0"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
