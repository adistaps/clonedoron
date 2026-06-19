"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
  label: string;
  heading: string;
  link?: { href: string; text: string };
  className?: string;
}

export default function SectionHeader({ label, heading, link, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 ${className}`}>
      <div>
        <p className="font-mono text-section-label uppercase text-text-tertiary mb-2">
          {label}
        </p>
        <h2 className="font-display text-display-s text-text-primary">
          {heading}
        </h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary hover:text-text-primary transition-colors duration-150 flex items-center gap-1 shrink-0"
        >
          {link.text}
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
