"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    assets: true,
    textures: true,
  });

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <div key={category.id}>
          <button
            onClick={() => toggleExpanded(category.id)}
            className="flex items-center gap-1.5 py-1.5 font-mono text-nav uppercase tracking-[0.06em] text-text-primary hover:text-text-secondary transition-colors"
          >
            {expanded[category.id] ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
            {category.name}
          </button>
          {expanded[category.id] && (
            <div className="pl-4 space-y-1">
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onSelect(sub.id)}
                  className={`flex items-center gap-2 py-1 font-mono text-label uppercase tracking-[0.08em] transition-colors ${
                    selected === sub.id ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  <span className="text-[10px]">{selected === sub.id ? "[\u2022]" : "[ ]"}</span>
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
