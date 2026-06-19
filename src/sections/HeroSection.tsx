"use client";

import { motion } from "framer-motion";
import { ArrowRight, Square, RefreshCw, Star, CreditCard, Zap, Headphones } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Logo3DHero = dynamic(() => import("./Logo3DHero"), { ssr: false });

const features = [
  { icon: RefreshCw, title: "FREE UPDATES", subtitle: "FOR LIFE" },
  { icon: Star, title: "80+", subtitle: "REVIEWS" },
  { icon: CreditCard, title: "NO", subtitle: "SUBSCRIPTION" },
  { icon: Zap, title: "EASY", subtitle: "TO USE" },
  { icon: Headphones, title: "24/7", subtitle: "SUPPORT" },
];

export default function HeroSection() {
  return (
    <>
      <section className="relative overflow-hidden bg-black" style={{ minHeight: "100svh" }}>

        {/* 3D canvas — fullscreen */}
        <div className="absolute inset-0 z-0">
          <Logo3DHero />
        </div>

        {/* Dark-to-transparent top vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 35%, transparent 60%)",
          }}
        />

        {/* Purple-blue radial bloom from bottom center */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 55% at 50% 105%, rgba(75,65,155,0.5) 0%, transparent 70%)",
          }}
        />

        {/* Strong white fade at the very bottom — connects to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{
            height: "38%",
            background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,1) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-30 flex flex-col items-center pt-28 pb-0">
          <motion.div
            className="text-center max-w-3xl px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.p
              className="font-mono text-[10px] uppercase text-white/50 mb-6 tracking-[0.15em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
            </motion.p>

            <motion.h1
              className="font-display text-[3.5rem] md:text-[4.5rem] leading-[0.92] text-white mb-8 italic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              Design Smarter,
              <br />
              Not Harder
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-accent-purple text-white rounded-[4px] px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.08em] hover:bg-accent-purple-hover transition-colors duration-200"
              >
                <Square size={8} fill="currentColor" />
                BROWSE PRODUCTS
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Drag hint — above the white fade */}
          <p className="mt-auto font-mono text-[10px] uppercase tracking-widest text-white/30 pointer-events-none select-none" style={{ marginTop: "38vh" }}>
            drag to rotate
          </p>
        </div>

      </section>

      {/* Feature Bar — outside the hero, sits on white bg, seamless join */}
      <div className="w-full border-t border-b border-black/10 bg-white">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-5 py-4 ${idx < features.length - 1 ? "md:border-r border-black/10" : ""
                    } ${idx < features.length - 2 ? "border-b md:border-b-0 border-black/10" : ""}`}
                >
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-black/[0.08] rounded-[4px] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-text-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[10px] font-bold text-text-primary uppercase tracking-wider leading-tight">
                      {feat.title}
                    </span>
                    <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider leading-tight">
                      {feat.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}