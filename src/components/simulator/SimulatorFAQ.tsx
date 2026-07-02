"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/simulators/types";
import { ContentBlocks } from "@/components/simulator/ContentBlocks";

interface SimulatorFAQProps {
  items: FAQItem[];
}

export function SimulatorFAQ({ items }: SimulatorFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="section-title">
        Questions fréquentes
      </h2>
      <p className="section-subtitle">
        Réponses détaillées aux interrogations les plus courantes sur ce
        simulateur.
      </p>

      <div className="mt-8 divide-y divide-slate-200/80 overflow-hidden rounded-[1.4rem] border border-slate-200/50 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.1)]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-slate-50/80"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-slate-900">
                  {item.question}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              {isOpen && (
                <div className="px-6 pb-5">
                  <ContentBlocks blocks={item.blocks} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
