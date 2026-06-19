"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, HelpCircle } from "lucide-react";

const navLinks = [
  { href: "/shop", label: "SHOP" },
  { href: "/bundles", label: "DEALS" },
];

const moreLinks = [
  { href: "/about", label: "ABOUT US" },
  { href: "/support", label: "GET HELP" },
];

export default function Navbar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Deteksi Scroll
  useEffect(() => {
    const handleScroll = () => {
      // Jika di-scroll lebih dari 50 pixel ke bawah, ubah state menjadi true
      setIsScrolled(window.scrollY > 50);
    };

    // Jalankan sekali saat pertama kali render untuk memastikan posisi awal
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---- Logika Tema Navbar ----
  // Navbar akan menggunakan tema hero (teks putih, glass redup) 
  // HANYA JIKA: berada di homepage ("/") DAN belum di-scroll
  const isHomePage = pathname === "/";
  const showTransparentTheme = isHomePage && !isScrolled;

  // ---- Style tokens dinamis ----
  // Saat di hero: Gunakan efek glass putih redup agar pil tetap terlihat elegan. 
  // Saat discroll/halaman lain: Gunakan efek glass agak terang/solid.
  const pillBg = showTransparentTheme
    ? "bg-white/[0.12] backdrop-blur-xl backdrop-saturate-150 border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
    : "bg-white/60 backdrop-blur-xl backdrop-saturate-150 border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)]";

  const pillHoverBg = showTransparentTheme
    ? "hover:bg-white/[0.2]"
    : "hover:bg-white/80";

  // Saat di hero teks putih. Saat discroll ambil dari tailwind config Anda (text-primary)
  const textColor = showTransparentTheme
    ? "text-white"
    : "text-text-primary";

  const dividerColor = showTransparentTheme
    ? "bg-white/50"
    : "bg-border"; // Menggunakan warna border dari config Anda

  const dropdownBg = showTransparentTheme
    ? "bg-black/40 backdrop-blur-xl border-white/20 shadow-xl" // Dropdown gelap jika dibuka di hero
    : "bg-white/80 backdrop-blur-xl border-black/10 shadow-lg"; // Dropdown terang jika dibuka saat discroll

  return (
    <>
      <nav className="fixed top-6 left-0 right-0 z-50 pointer-events-none">
        <div className="max-w-content mx-auto px-6 flex flex-wrap md:flex-nowrap items-center justify-between pointer-events-auto gap-4">

          {/* Logo Pill */}
          <Link
            href="/"
            className={`h-10 w-10 md:h-12 md:w-12 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${pillBg} ${pillHoverBg}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-colors duration-300 ${textColor}`}
            >
              <path
                d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </Link>

          {/* Center Pill - Desktop */}
          <div
            className={`hidden md:flex h-12 px-6 rounded-full border items-center gap-6 font-mono text-[11px] uppercase tracking-[0.08em] transition-all duration-300 ${pillBg}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:opacity-60 transition-opacity duration-150 flex items-center h-full ${textColor}`}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider Dot */}
            <span className={`w-1 h-1 rounded-full transition-colors duration-300 ${dividerColor}`}></span>

            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button className={`hover:opacity-60 transition-opacity duration-150 flex items-center gap-1.5 h-full ${textColor}`}>
                MORE
                <svg width="8" height="8" viewBox="0 0 10 10" className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 mt-1 border rounded-[8px] min-w-[140px] py-2 z-50 transition-colors duration-300 ${dropdownBg}`}
                  >
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-4 py-2 font-mono text-[10px] transition-colors duration-150 ${showTransparentTheme ? "text-white hover:bg-white/10" : "text-text-secondary hover:text-text-primary hover:bg-black/[0.05]"}`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Pill - Desktop */}
          <div
            className={`hidden md:flex h-12 px-6 rounded-full border items-center gap-8 font-mono text-[11px] uppercase tracking-[0.08em] transition-all duration-300 ${pillBg}`}
          >
            <Link
              href="/support"
              className={`hover:opacity-60 transition-opacity duration-150 flex items-center gap-2 ${textColor}`}
            >
              GET HELP
              <HelpCircle size={14} />
            </Link>
          </div>

          {/* Mobile Toggle Pill */}
          <button
            className={`md:hidden h-10 w-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${pillBg} ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/[0.85] backdrop-blur-2xl backdrop-saturate-150 pt-24 px-6 pointer-events-auto"
          >
            <div className="flex flex-col gap-4 font-mono text-[13px] uppercase tracking-[0.08em]">
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="py-4 border-b border-white/20 text-white flex justify-between items-center">
                SHOP
              </Link>
              <Link href="/bundles" onClick={() => setMobileOpen(false)} className="py-4 border-b border-white/20 text-white flex justify-between items-center">
                DEALS
              </Link>
              <Link href="/support" onClick={() => setMobileOpen(false)} className="py-4 border-b border-white/20 text-white flex justify-between items-center">
                GET HELP
                <HelpCircle size={16} />
              </Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="py-4 border-b border-white/20 text-white flex justify-between items-center">
                ABOUT US
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}