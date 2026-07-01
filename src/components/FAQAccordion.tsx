"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { FAQ } from "@/types";

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="card-frame overflow-hidden">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`${index < faqs.length - 1 ? "border-b border-[rgba(0,0,0,0.12)]" : ""}`}
        >
          <button
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between px-5 py-4 cursor-pointer text-left hover:bg-[rgba(0,0,0,0.02)] transition-colors duration-150"
          >
            <span className="font-mono text-body uppercase tracking-[0.02em] text-text-primary pr-4">
              {faq.question}
            </span>
            <span className="text-text-tertiary shrink-0">
              {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 300, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 font-mono text-body text-text-secondary leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
