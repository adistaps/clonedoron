import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        "bg-secondary": "#F5F5F5",
        "bg-tertiary": "#EEEEEE",
        "text-primary": "#111111",
        "text-secondary": "#555555",
        "text-tertiary": "#888888",
        border: "rgba(0, 0, 0, 0.1)",
        "border-hover": "rgba(0, 0, 0, 0.2)",
        "accent-purple": "#7C6CFF",
        "accent-purple-hover": "#6B5BEE",
        "accent-orange": "#E8784A",
        "accent-orange-bg": "#FFF0EB",
        "folder-tab": "#CCCCCC",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-l": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-m": ["2.625rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-s": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "heading-m": ["1.5rem", { lineHeight: "1.3" }],
        body: ["0.8125rem", { lineHeight: "1.6", letterSpacing: "0.02em" }],
        "body-sm": ["0.6875rem", { lineHeight: "1.5", letterSpacing: "0.04em" }],
        label: ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        nav: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.06em" }],
        button: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.06em" }],
        price: ["0.75rem", { lineHeight: "1", letterSpacing: "0.02em" }],
        "product-title": ["1.125rem", { lineHeight: "1.3" }],
        "section-label": ["0.625rem", { lineHeight: "1.4", letterSpacing: "0.1em" }],
      },
      maxWidth: {
        content: "1280px",
      },
      borderRadius: {
        card: "8px",
        button: "6px",
        badge: "4px",
        "folder-tab": "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        elevated: "0 8px 24px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)",
        nav: "0 1px 0 rgba(0,0,0,0.08)",
      },
      spacing: {
        section: "80px",
        "section-mobile": "48px",
      },
    },
  },
  plugins: [],
};

export default config;
