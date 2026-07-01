import Link from "next/link";
import type { PortalNavRef } from "@/lib/simulators/_shared/portal-tree";
import type { PortalSimulatorRef } from "@/lib/simulators/_shared/portal-tree";
import { Card } from "@/components/ui/Card";
import { SimulatorIconComponent } from "@/components/ui/SimulatorIcon";

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
  featuredSlugs?: Set<string>;
}

export function SimulatorCardGrid({ simulators, featuredSlugs }: SimulatorCardGridProps) {
  if (simulators.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {simulators.map((sim) => (
        <Link key={sim.slug} href={`/simulateurs/${sim.slug}`} className="group block">
          <Card hover className="flex h-full flex-col">
            <SimulatorIconComponent icon={sim.icon} />
            {featuredSlugs?.has(sim.slug) && (
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-accent-600">
                Mis en avant
              </p>
            )}
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-brand-600">
              {sim.primaryCategoryLabel}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-brand-900 group-hover:text-brand-700">
              {sim.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {sim.shortDescription}
            </p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
              Utiliser l&apos;outil
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </Card>
        </Link>
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
  return (
    <section aria-labelledby="portal-faq-heading" className="mt-16">
      <h2 id="portal-faq-heading" className="font-display text-2xl font-bold text-brand-900">
        Questions fréquentes
      </h2>
      <dl className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-brand-900">{item.question}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
