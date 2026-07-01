"use client";

import { ArrowRight, Square } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import YouTubeCarousel from "@/components/YouTubeCarousel";
import CornerDots from "@/components/CornerDots";
import { videos } from "@/data/videos";

export default function AboutPage() {
  return (
    <div className="pt-14 bg-white min-h-screen">
      <div className="max-w-content mx-auto border-x-2 border-x-[rgba(0,0,0,0.1)] bg-white relative">
        
        {/* Section 1: Hero / Header */}
        <section className="relative border-b-2 border-b-[rgba(0,0,0,0.1)] py-20 px-6 text-center">
          {/* Intersection Corner Dots */}
          <CornerDots className="-top-[9px] -left-[9px] z-10" />
          <CornerDots className="-top-[9px] -right-[9px] z-10" />
          <CornerDots className="-bottom-[9px] -left-[9px] z-10" />
          <CornerDots className="-bottom-[9px] -right-[9px] z-10" />

          <ScrollReveal>
            <div className="flex flex-col items-center gap-1.5 mb-6 select-none">
              <span className="font-mono text-[14px] text-text-tertiary tracking-[0.2em] leading-none">&#183;&#183;&#183;</span>
              <p className="font-mono text-section-label uppercase tracking-[0.15em] text-text-tertiary">
                [ About ]
              </p>
              <span className="font-mono text-[14px] text-text-tertiary tracking-[0.2em] leading-none">&#183;&#183;&#183;</span>
            </div>
            <h1 className="font-display text-display-l md:text-display-xl text-text-primary max-w-4xl mx-auto leading-tight">
              Meet the Creative Mind Behind Tassofly.
            </h1>
          </ScrollReveal>
        </section>

        {/* Section 2: The Why */}
        <section className="relative border-b-2 border-b-[rgba(0,0,0,0.1)] py-20 px-8">
          {/* Intersection Corner Dots */}
          <CornerDots className="-top-[9px] -left-[9px] z-10" />
          <CornerDots className="-top-[9px] -right-[9px] z-10" />
          <CornerDots className="-bottom-[9px] -left-[9px] z-10" />
          <CornerDots className="-bottom-[9px] -right-[9px] z-10" />

          <div className="grid lg:grid-cols-[55%_45%] gap-12 items-center">
            <ScrollReveal>
              <div>
                <h2 className="font-display text-display-l text-text-primary mb-8 leading-none">
                  The Why
                </h2>
                <div className="space-y-6 font-mono text-body text-text-secondary leading-relaxed">
                  <p>
                    Welcome :) I&apos;m Arif - a freelance designer and founder of Tassofly. After 10 years in the apparel and design space, I realized many amazing techniques weren&apos;t accessible to newer designers. My mission is to democratize professional design tools and empower the next generation of creators worldwide.
                  </p>
                  <p>
                    When I first began, trying to figure out what all my favorite designers were doing was like getting blood from a stone. It costed me hundreds of eye-scorching hours to start designing the way I wanted to. But I was left wondering:
                  </p>
                  <p>
                    Why aren&apos;t these techniques more accessible to newer designers? Or better yet...
                  </p>
                  <p className="text-text-primary font-medium">
                    What can I do about it?
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-text-primary text-white rounded-button px-5 py-3 font-mono text-button uppercase tracking-[0.06em] hover:bg-text-secondary transition-colors duration-200"
                  >
                    <Square size={8} fill="currentColor" />
                    EXPLORE TOOLS
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="relative p-1 border-2 border-[rgba(0,0,0,0.1)] rounded-card bg-bg-secondary">
                <img
                  src="/images/about-doron.png"
                  alt="Doron portrait next to Broadway poster"
                  className="w-full aspect-[3/4] object-cover rounded-card border-2 border-[rgba(0,0,0,0.1)] grayscale hover:grayscale-0 transition-all duration-300 shadow-card"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Section 3: Mission & YouTube Carousel */}
        <section className="relative py-20 px-8">
          {/* Intersection Corner Dots */}
          <CornerDots className="-top-[9px] -left-[9px] z-10" />
          <CornerDots className="-top-[9px] -right-[9px] z-10" />
          <CornerDots className="-bottom-[9px] -left-[9px] z-10" />
          <CornerDots className="-bottom-[9px] -right-[9px] z-10" />

          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <p className="font-mono text-section-label uppercase tracking-[0.1em] text-text-tertiary mb-3">
                  [MISSION]
                </p>
                <h2 className="font-display text-display-m md:text-display-l text-text-primary leading-tight">
                  Professional Design, Made Simple
                </h2>
              </div>
              <a
                href="https://youtube.com/@TassoflyDesign"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-bg-secondary text-text-primary border border-[rgba(0,0,0,0.08)] rounded-button px-5 py-3 font-mono text-button uppercase tracking-[0.06em] hover:bg-bg-tertiary transition-colors duration-200 shrink-0"
              >
                <Square size={8} fill="currentColor" />
                LEARN HOW TO CREATE STUNNING DESIGNS
                <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <YouTubeCarousel videos={videos} />
          </ScrollReveal>
        </section>

      </div>
    </div>
  );
}
