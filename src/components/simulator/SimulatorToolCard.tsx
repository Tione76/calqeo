import Link from "next/link";
import type { SiteDomain } from "@/lib/simulators/types";
import { CALQEO_SIMULATOR_ACCENT } from "@/lib/design/calqeo-theme";
import { cn } from "@/lib/utils/cn";
import { Card } from "@/components/ui/Card";
import { SimulatorCategoryIllustration } from "@/components/simulator/SimulatorCategoryIllustration";

export type SimulatorToolCardProps = {
  slug: string;
  title: string;
  shortDescription: string;
  domain: SiteDomain;
  categoryLabel?: string;
  cta?: string;
  className?: string;
};

/** Carte outil Calqeo — listings, portails et simulateurs associés. */
export function SimulatorToolCard({
  slug,
  title,
  shortDescription,
  domain,
  categoryLabel,
  cta = "Calculer",
  className,
}: SimulatorToolCardProps) {
  return (
    <Link
      href={`/simulateurs/${slug}`}
      className={cn("group block h-full", className)}
    >
      <Card hover className="flex h-full flex-col">
        <SimulatorCategoryIllustration domain={domain} size="card" />
        {categoryLabel && (
          <p
            className="mt-3 text-xs font-medium uppercase tracking-wider"
            style={{ color: CALQEO_SIMULATOR_ACCENT }}
          >
            {categoryLabel}
          </p>
        )}
        <h3
          className={cn(
            "font-display text-lg font-semibold text-brand-900 transition-colors duration-300",
            categoryLabel ? "mt-2" : "mt-3",
            "group-hover:text-[#3F6B52]"
          )}
        >
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {shortDescription}
        </p>
        <span
          className="mt-5 inline-flex items-center gap-1.5 border-t border-slate-100 pt-4 text-sm font-semibold transition-colors duration-300"
          style={{ color: CALQEO_SIMULATOR_ACCENT }}
        >
          {cta}
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
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
  );
}
