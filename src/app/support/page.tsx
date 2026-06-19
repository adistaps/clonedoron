"use client";

import { ExternalLink } from "lucide-react";
import FAQAccordion from "@/components/FAQAccordion";
import ScrollReveal from "@/components/ScrollReveal";
import { faqs } from "@/data/faqs";

const helpCategories = [
  { label: "MY ORDER / EMAIL", href: "https://help.doron.supply/" },
  { label: "PRODUCT INSTALLATION / ACTIVATION", href: "https://help.doron.supply/en/categories/product-usage" },
  { label: "USING A PRODUCT", href: "https://support.doron.supply/" },
];

export default function SupportPage() {
  return (
    <div className="pt-20 pb-16">
      {/* Hero */}
      <section className="px-6 pt-16 pb-12 text-center">
        <ScrollReveal>
          <p className="font-mono text-section-label uppercase text-text-tertiary mb-4">
            [ support ]
          </p>
          <h1 className="font-display text-display-l text-text-primary">
            I Need Help With...
          </h1>
        </ScrollReveal>
      </section>

      {/* Help Categories */}
      <section className="px-6 pb-10">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {helpCategories.map((cat) => (
                <a
                  key={cat.label}
                  href={cat.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#CCCCCC] rounded-card px-5 py-3 font-mono text-button uppercase tracking-[0.06em] text-text-primary hover:bg-bg-secondary transition-colors duration-200"
                >
                  {cat.label}
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Info */}
      <section className="border-t border-[rgba(0,0,0,0.08)] px-6 py-6">
        <ScrollReveal>
          <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary text-center max-w-lg mx-auto leading-relaxed">
            SEND US A MESSAGE USING THE CHAT WIDGET IN THE BOTTOM RIGHT CORNER OF YOUR SCREEN, OR{" "}
            <a href="mailto:support@doronsupply.com" className="underline hover:text-text-primary transition-colors">
              VIA EMAIL
            </a>
            .
          </p>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-[rgba(0,0,0,0.08)] px-6 py-section">
        <div className="max-w-content mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <h2 className="font-display text-display-m text-text-primary mb-3">
                  FAQ(S)
                </h2>
                <p className="font-mono text-body-sm uppercase tracking-[0.04em] text-text-secondary">
                  FREQUENTLY ASKED QUESTIONS &rarr;
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <FAQAccordion faqs={faqs} />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
