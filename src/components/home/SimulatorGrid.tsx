"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { simulators, searchSimulators } from "@/lib/simulators";
import { getSimulatorsGroupedByDomain } from "@/lib/simulators/navigation";
import { DOMAIN_LABELS, getSimulatorDomain } from "@/lib/simulators/types";
import { SearchBar } from "@/components/layout/SearchBar";
import { Card } from "@/components/ui/Card";
import { SimulatorIconComponent } from "@/components/ui/SimulatorIcon";

export function SimulatorGrid() {
  const [query, setQuery] = useState("");
  const groups = getSimulatorsGroupedByDomain();

  const filtered = useMemo(
    () => (query ? searchSimulators(query) : simulators),
    [query]
  );

  return (
    <section id="simulateurs" className="scroll-mt-24">
      <div className="text-center">
        <h2 className="section-title">Tous nos outils</h2>
        <p className="section-subtitle mx-auto max-w-2xl">
          {simulators.length} simulateurs et calculateurs gratuits, classés par
          thématique pour répondre à vos questions du quotidien.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-xl">
        <SearchBar
          defaultValue={query}
          onSearch={setQuery}
          placeholder="Rechercher un outil…"
        />
      </div>

      {query ? (
        filtered.length === 0 ? (
          <p className="mt-10 text-center text-slate-500">
            Aucun outil ne correspond à votre recherche.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((sim) => (
              <SimulatorCard key={sim.slug} sim={sim} />
            ))}
          </div>
        )
      ) : (
        <div className="mt-12 space-y-16">
          {groups.map((group) => (
            <div key={group.domain} id={group.anchor} className="scroll-mt-24">
              <h3 className="font-display text-xl font-bold text-brand-900">
                {group.label}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {group.count} outil{group.count > 1 ? "s" : ""}
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.all.slice(0, 6).map((sim) => (
                  <SimulatorCard key={sim.slug} sim={sim} />
                ))}
              </div>
              {group.count > 6 && (
                <Link
                  href={`/simulateurs#${group.anchor}`}
                  className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Voir les {group.count} outils {group.label.toLowerCase()} →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SimulatorCard({
  sim,
}: {
  sim: (typeof simulators)[number];
}) {
  return (
    <Link href={`/simulateurs/${sim.slug}`} className="group block">
      <Card hover className="flex h-full flex-col">
        <SimulatorIconComponent icon={sim.icon} />
        <p className="mt-3 text-xs font-medium uppercase tracking-wider text-brand-600">
          {DOMAIN_LABELS[getSimulatorDomain(sim)]}
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
  );
}
