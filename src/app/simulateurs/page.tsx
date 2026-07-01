import type { Metadata } from "next";
import Link from "next/link";
import {
  getSimulatorsGroupedByDomain,
  SIMULATOR_COUNT,
} from "@/lib/simulators/navigation";
import { Card } from "@/components/ui/Card";
import { SimulatorIconComponent } from "@/components/ui/SimulatorIcon";

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
          <a
            key={group.domain}
            href={`#${group.anchor}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
          >
            {group.label} ({group.count})
          </a>
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
            <h2
              id={`${group.anchor}-heading`}
              className="font-display text-2xl font-bold text-brand-900"
            >
              {group.label}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {group.count} outil{group.count > 1 ? "s" : ""}
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.all.map((sim) => (
                <Link
                  key={sim.slug}
                  href={`/simulateurs/${sim.slug}`}
                  className="group block"
                >
                  <Card hover className="flex h-full flex-col">
                    <SimulatorIconComponent icon={sim.icon} />
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-brand-600">
                      {sim.domainLabel}
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
          </section>
        ))}
      </div>
    </div>
  );
}
