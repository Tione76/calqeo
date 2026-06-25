import Link from "next/link";
import type { SimulatorCardRef } from "@/lib/simulators/navigation";
import { CATEGORY_LABELS } from "@/lib/simulators/types";
import { Card } from "@/components/ui/Card";
import { SimulatorIconComponent } from "@/components/ui/SimulatorIcon";

interface RelatedSimulatorsProps {
  simulators: SimulatorCardRef[];
}

export function RelatedSimulators({ simulators }: RelatedSimulatorsProps) {
  if (simulators.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="section-title">
        Autres simulateurs
      </h2>
      <p className="section-subtitle">
        Complétez votre analyse avec nos autres outils gratuits.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulators.map((sim) => (
          <Link
            key={sim.slug}
            href={`/simulateurs/${sim.slug}`}
            className="group block"
          >
            <Card hover className="h-full">
              <SimulatorIconComponent icon={sim.icon} />
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-brand-600">
                {CATEGORY_LABELS[sim.category]}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-brand-900 group-hover:text-brand-700">
                {sim.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                {sim.shortDescription}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                Calculer
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
    </section>
  );
}
