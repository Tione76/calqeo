import type { Metadata } from "next";
import Link from "next/link";
import {
  getSimulatorsGroupedByDomain,
  SIMULATOR_COUNT,
} from "@/lib/simulators/navigation";
import { SimulatorToolCard } from "@/components/simulator/SimulatorToolCard";

export const metadata: Metadata = {
  title: "Simulateurs et calculateurs gratuits en ligne",
  description: `${SIMULATOR_COUNT} simulateurs et calculateurs gratuits : crédit immobilier, impôts, travaux, santé, budget. Estimez en ligne sans inscription.`,
  alternates: { canonical: "/simulateurs" },
};

export default function SimulateursPage() {
  const groups = getSimulatorsGroupedByDomain();

  return (
    <div className="container-app py-10 sm:py-14">
      <nav aria-label="Fil d'Ariane" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="transition-colors hover:text-brand-700">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-brand-900">Outils</li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
        Simulateurs et calculateurs en ligne gratuits
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        {SIMULATOR_COUNT} outils pour simuler un crédit, calculer un impôt,
        estimer des travaux ou comparer des scénarios — résultats instantanés,
        sans inscription.
      </p>

      <nav
        className="mt-8 flex flex-wrap gap-2"
        aria-label="Catégories"
      >
        {groups.map((group) => (
          <Link
            key={group.domain}
            href={group.path}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            {group.label} ({group.count})
          </Link>
        ))}
      </nav>

      <div className="mt-12 space-y-16">
        {groups.map((group) => (
          <section
            key={group.domain}
            id={group.anchor}
            className="scroll-mt-24"
            aria-labelledby={`${group.anchor}-heading`}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2
                  id={`${group.anchor}-heading`}
                  className="font-display text-2xl font-bold text-brand-900"
                >
                  <Link href={group.path} className="hover:text-brand-700">
                    {group.label}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {group.count} outil{group.count > 1 ? "s" : ""}
                  {group.categories.length > 0 && (
                    <>
                      {" "}
                      ·{" "}
                      {group.categories.map((category, index) => (
                        <span key={category.id}>
                          {index > 0 && ", "}
                          <Link
                            href={category.path}
                            className="text-brand-600 hover:text-brand-700"
                          >
                            {category.label}
                          </Link>
                        </span>
                      ))}
                    </>
                  )}
                </p>
              </div>
              <Link
                href={group.path}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                Page {group.label.toLowerCase()} →
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.all.map((sim) => (
                <SimulatorToolCard
                  key={sim.slug}
                  slug={sim.slug}
                  title={sim.title}
                  shortDescription={sim.shortDescription}
                  domain={sim.domain}
                  categoryLabel={sim.domainLabel}
                  cta="Utiliser l'outil"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
