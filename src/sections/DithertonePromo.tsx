"use client";

import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function DithertonePromo() {
  return (
    <section className="px-6 pb-16">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto border border-[#CCCCCC] rounded-xl overflow-hidden shadow-elevated">
          <div className="grid md:grid-cols-2">
            {/* Left - Image placeholder */}
            <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-[#1a1a3e] via-[#2d2d6a] to-[#1a1a3e] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-500 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 text-center">
                <p className="font-mono text-label uppercase text-white/60 mb-2 tracking-[0.1em]">
                  dt
                </p>
                <p className="font-display text-display-s text-white">
                  dither<span className="text-purple-300">tone</span>
                </p>
                <p className="font-mono text-label uppercase text-white/60 mt-2 tracking-[0.1em]">
                  PRO
                </p>
              </div>
            </div>

            {/* Right - Info */}
            <div className="p-8 flex flex-col justify-center">
              <p className="font-mono text-label uppercase text-text-tertiary tracking-[0.1em] mb-3">
                TRUSTED BY 9,000+ DESIGNERS
              </p>
              <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary leading-relaxed mb-6">
                THE ALL-IN-ONE PHOTOSHOP PLUGIN FOR BITMAPPING AND DITHERING.
              </p>
              <button className="self-start inline-flex items-center gap-2 bg-text-primary text-white rounded-button px-4 py-2.5 font-mono text-button uppercase tracking-[0.06em] hover:bg-text-secondary transition-colors duration-200">
                START DITHERING NOW
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
