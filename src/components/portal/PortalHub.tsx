"use client";

import { useState } from "react";
import Link from "next/link";
import type { PortalNavRef } from "@/lib/simulators/_shared/portal-tree";
import type { PortalSimulatorRef } from "@/lib/simulators/_shared/portal-tree";
import { SimulatorToolCard } from "@/components/simulator/SimulatorToolCard";

interface PortalBreadcrumbItem {
  label: string;
  href?: string;
}

interface PortalBreadcrumbProps {
  items: PortalBreadcrumbItem[];
}

export function PortalBreadcrumb({ items }: PortalBreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-brand-700">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-brand-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

interface SimulatorCardGridProps {
  simulators: PortalSimulatorRef[];
}

export function SimulatorCardGrid({ simulators }: SimulatorCardGridProps) {
  if (simulators.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {simulators.map((sim) => (
        <SimulatorToolCard
          key={sim.slug}
          slug={sim.slug}
          title={sim.title}
          shortDescription={sim.shortDescription}
          domain={sim.domain}
          categoryLabel={sim.primaryCategoryLabel}
          cta="Utiliser l'outil"
        />
      ))}
    </div>
  );
}

interface FeaturedSimulatorLinksProps {
  featured: PortalNavRef[];
}

export function FeaturedSimulatorLinks({ featured }: FeaturedSimulatorLinksProps) {
  if (featured.length === 0) return null;

  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {featured.map((sim) => (
        <li key={sim.slug}>
          <Link
            href={`/simulateurs/${sim.slug}`}
            className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 transition-colors hover:border-brand-300 hover:bg-brand-100"
          >
            {sim.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

interface PortalCategoryLinksProps {
  categories: { label: string; path: string; count: number }[];
  currentPath?: string;
}

export function PortalCategoryLinks({ categories, currentPath }: PortalCategoryLinksProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Sous-catégories">
      {categories.map((category) => {
        const isCurrent = category.path === currentPath;
        return (
          <Link
            key={category.path}
            href={category.path}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isCurrent
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {category.label} ({category.count})
          </Link>
        );
      })}
    </nav>
  );
}

interface PortalDomainLinksProps {
  domains: { label: string; path: string; count: number }[];
  currentPath?: string;
}

export function PortalDomainLinks({ domains, currentPath }: PortalDomainLinksProps) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Autres domaines">
      {domains.map((domain) => {
        const isCurrent = domain.path === currentPath;
        return (
          <Link
            key={domain.path}
            href={domain.path}
            aria-current={isCurrent ? "page" : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isCurrent
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {domain.label} ({domain.count})
          </Link>
        );
      })}
    </nav>
  );
}

interface PortalLightFaqProps {
  items: { question: string; answer: string }[];
}

export function PortalLightFaq({ items }: PortalLightFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section aria-labelledby="portal-faq-heading" className="mt-16">
      <h2 id="portal-faq-heading" className="section-title">
        Questions fréquentes
      </h2>

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
                <span className="font-medium text-slate-900">{item.question}</span>
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
                <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
