import type { SimulatorCardRef } from "@/lib/simulators/navigation";
import { CATEGORY_LABELS } from "@/lib/simulators/types";
import { SimulatorToolCard } from "@/components/simulator/SimulatorToolCard";

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

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {simulators.map((sim) => (
          <SimulatorToolCard
            key={sim.slug}
            slug={sim.slug}
            title={sim.title}
            shortDescription={sim.shortDescription}
            domain={sim.domain}
            categoryLabel={CATEGORY_LABELS[sim.category]}
            cta="Calculer"
          />
        ))}
      </div>
    </section>
  );
}
