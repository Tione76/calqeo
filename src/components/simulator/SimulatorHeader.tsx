import Link from "next/link";
import type { SiteDomain } from "@/lib/simulators/types";
import { CALQEO_SIMULATOR_ACCENT } from "@/lib/design/calqeo-theme";
import { SimulatorCategoryIllustration } from "@/components/simulator/SimulatorCategoryIllustration";

interface SimulatorBreadcrumbProps {
  title: string;
  domainLabel: string;
  domainPath: string;
  categoryLabel: string;
  categoryPath: string;
}

export function SimulatorBreadcrumb({
  title,
  domainLabel,
  domainPath,
  categoryLabel,
  categoryPath,
}: SimulatorBreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <li>
          <Link href="/" className="transition-colors hover:text-brand-700">
            Accueil
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/simulateurs" className="transition-colors hover:text-brand-700">
            Outils
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={domainPath} className="transition-colors hover:text-brand-700">
            {domainLabel}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={categoryPath} className="transition-colors hover:text-brand-700">
            {categoryLabel}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="font-medium text-brand-900">{title}</li>
      </ol>
    </nav>
  );
}

interface SimulatorHeaderProps {
  title: string;
  description: string;
  domainLabel: string;
  domainPath: string;
  categoryLabel: string;
  categoryPath: string;
  illustrationDomain: SiteDomain;
}

export function SimulatorHeader({
  title,
  description,
  domainLabel,
  domainPath,
  categoryLabel,
  categoryPath,
  illustrationDomain,
}: SimulatorHeaderProps) {
  return (
    <header className="mb-10">
      <SimulatorBreadcrumb
        title={title}
        domainLabel={domainLabel}
        domainPath={domainPath}
        categoryLabel={categoryLabel}
        categoryPath={categoryPath}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <SimulatorCategoryIllustration domain={illustrationDomain} size="header" />
        <div>
          <p
            className="text-sm font-medium uppercase tracking-wider"
            style={{ color: CALQEO_SIMULATOR_ACCENT }}
          >
            {domainLabel} · {categoryLabel}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}
