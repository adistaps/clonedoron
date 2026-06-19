"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[rgba(0,0,0,0.08)] w-full">
      {/* Top Row: Main Content Columns */}
      <div className="border-b border-[rgba(0,0,0,0.08)]">
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[rgba(0,0,0,0.08)] border-x border-[rgba(0,0,0,0.08)]">
          
          {/* Column 1: Brand & Links (Spans 2 columns) */}
          <div className="col-span-2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-text-primary mb-4">
                <path
                  d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              <p className="font-mono text-label uppercase tracking-[0.1em] text-text-primary mb-1">
                DORONSUPPLY:
              </p>
              <p className="font-mono text-body-sm uppercase tracking-[0.05em] text-text-secondary">
                BEYOND THE BASICS.
              </p>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-4 border-t border-[rgba(0,0,0,0.04)]">
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/support"
                  className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[9px] text-text-tertiary">&#9670;</span> SUPPORT
                </Link>
                <Link
                  href="/about"
                  className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[9px] text-text-tertiary">&#9670;</span> ABOUT
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  href="https://instagram.com/doronsupply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[9px] text-text-tertiary">&#9670;</span> INSTAGRAM
                </Link>
                <Link
                  href="#"
                  className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[9px] text-text-tertiary">&#9670;</span> GALLERY
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                <Link
                  href="https://youtube.com/@DoronStudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5"
                >
                  <span className="text-[9px] text-text-tertiary">&#9670;</span> YOUTUBE
                </Link>
              </div>
            </div>
          </div>

          {/* Column 2: Keep In Touch (Spans 2 columns) */}
          <div className="col-span-2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-heading-m text-text-primary mb-3">
                Keep In Touch
              </h3>
              <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary mb-6 leading-relaxed">
                UNLOCK FREEBIES, EXCLUSIVE SALES, AND STAY UP TO DATE ON THE TOOLS THAT HELP YOU LIVE YOUR DESIGN DREAMS.
              </p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-[#CCCCCC] rounded-button px-4 py-2.5 font-mono text-body text-text-primary placeholder:text-text-tertiary bg-white focus:outline-none focus:border-accent-purple transition-colors"
              />
              <button className="bg-bg-secondary text-text-primary rounded-button px-4 py-2.5 font-mono text-button uppercase tracking-[0.06em] hover:bg-bg-tertiary border border-[rgba(0,0,0,0.08)] transition-colors duration-200 whitespace-nowrap flex items-center gap-1.5 shrink-0">
                <span>&#8629;</span> SUBSCRIBE NOW
              </button>
            </div>
          </div>

          {/* Column 3: Affiliate / Earn $$ (Spans 2 columns) */}
          <div className="col-span-2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-heading-m text-text-primary mb-3">
                Earn $$ Using Our Tools
              </h3>
              <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary mb-6 leading-relaxed">
                EARN UP TO $500 BY CREATING CONTENT USING DORON SUPPLY TOOLS.
              </p>
            </div>

            <button className="bg-bg-secondary text-text-primary rounded-button px-4 py-3 font-mono text-button uppercase tracking-[0.06em] hover:bg-bg-tertiary border border-[rgba(0,0,0,0.08)] transition-colors duration-200 flex items-center justify-center gap-2 w-full">
              CLICK HERE TO LEARN MORE
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Row: Copyright & Legal Links */}
      <div>
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-[rgba(0,0,0,0.08)] border-x border-[rgba(0,0,0,0.08)]">
          
          {/* Copyright Cell (Spans 2 columns) */}
          <div className="col-span-2 px-6 py-4 md:px-8 flex items-center justify-center md:justify-start">
            <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-tertiary">
              &copy;2026, DORON STUDIO LLC
            </p>
          </div>

          {/* Privacy Policy (1 column) */}
          <div className="col-span-1 px-4 py-4 flex items-center justify-center">
            <Link
              href="#"
              className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="text-[8px]">&#9670;</span> PRIVACY POLICY
            </Link>
          </div>

          {/* Terms of Service (1 column) */}
          <div className="col-span-1 px-4 py-4 flex items-center justify-center">
            <Link
              href="#"
              className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="text-[8px]">&#9670;</span> TERMS OF SERVICE
            </Link>
          </div>

          {/* Disclaimer (1 column) */}
          <div className="col-span-1 px-4 py-4 flex items-center justify-center">
            <Link
              href="#"
              className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="text-[8px]">&#9670;</span> DISCLAIMER
            </Link>
          </div>

          {/* Refund Policy (1 column) */}
          <div className="col-span-1 px-4 py-4 flex items-center justify-center">
            <Link
              href="#"
              className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
            >
              <span className="text-[8px]">&#9670;</span> REFUND POLICY
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
