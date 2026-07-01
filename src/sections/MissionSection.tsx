"use client";

import { ArrowRight, Square } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeCarousel from "@/components/YouTubeCarousel";
import { videos } from "@/data/videos";

export default function MissionSection() {
  return (
    <section className="py-20 px-6 border-b border-[rgba(0,0,0,0.1)]">
      <div className="max-w-content mx-auto">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-[10px] uppercase text-text-tertiary mb-2 tracking-[0.12em]">
                [MISSION]
              </p>
              <h2 className="font-display text-display-m text-text-primary italic">
                Professional Design, Made Simple
              </h2>
            </div>
            <a
              href="https://youtube.com/@TassoflyDesign"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#f0f0f0] text-text-primary rounded-[5px] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.06em] hover:bg-[#e5e5e5] border border-[rgba(0,0,0,0.08)] transition-colors duration-200 shrink-0"
            >
              <Square size={7} fill="currentColor" />
              LEARN HOW TO CREATE STUNNING DESIGNS
              <ArrowRight size={13} />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <YouTubeCarousel videos={videos.slice(0, 4)} />
        </ScrollReveal>
      </div>
    </section>
  );
}
