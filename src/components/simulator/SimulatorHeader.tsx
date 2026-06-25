import Link from "next/link";
import { CATEGORY_LABELS, DOMAIN_ANCHORS, DOMAIN_LABELS, type SimulatorCategory, type SiteDomain } from "@/lib/simulators/types";
import { SimulatorIconComponent } from "@/components/ui/SimulatorIcon";

interface SimulatorBreadcrumbProps {
  title: string;
  domain: SiteDomain;
}

export function SimulatorBreadcrumb({ title, domain }: SimulatorBreadcrumbProps) {
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
          <Link
            href={`/simulateurs#${DOMAIN_ANCHORS[domain]}`}
            className="transition-colors hover:text-brand-700"
          >
            {DOMAIN_LABELS[domain]}
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
  domain: SiteDomain;
  category: SimulatorCategory;
  icon: Parameters<typeof SimulatorIconComponent>[0]["icon"];
}

export function SimulatorHeader({
  title,
  description,
  domain,
  category,
  icon,
}: SimulatorHeaderProps) {
  return (
    <header className="mb-10">
      <SimulatorBreadcrumb title={title} domain={domain} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <SimulatorIconComponent icon={icon} className="h-14 w-14 shrink-0" />
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-brand-600">
            {DOMAIN_LABELS[domain]} · {CATEGORY_LABELS[category]}
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
