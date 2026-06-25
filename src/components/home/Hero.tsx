import Link from "next/link";
import { Suspense } from "react";
import { DOMAIN_ORDER, DOMAIN_LABELS, DOMAIN_ANCHORS } from "@/lib/simulators/types";
import { SIMULATOR_COUNT } from "@/lib/simulators/navigation";
import { SearchBar } from "@/components/layout/SearchBar";
import { SITE } from "@/lib/site/config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent-400 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-brand-400 blur-3xl" />
      </div>

      <div className="container-app relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            100 % gratuit — Résultats instantanés
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Simulez et calculez{" "}
            <span className="text-accent-400">en un clic</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-brand-100 sm:text-xl">
            {SITE.tagline}. {SIMULATOR_COUNT} outils : immobilier, finance,
            emploi, entreprises, fiscalité, travaux, santé et quotidien.
          </p>

          <div className="mx-auto mt-8 max-w-xl">
            <Suspense
              fallback={
                <div className="h-14 animate-pulse rounded-2xl bg-white/20" />
              }
            >
              <SearchBar
                redirectOnSubmit
                placeholder="Ex : IMC, TVA, capacité emprunt, impôt…"
                className="[&_input]:border-0 [&_input]:shadow-lg"
              />
            </Suspense>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {DOMAIN_ORDER.map((domain) => (
              <Link
                key={domain}
                href={`/simulateurs#${DOMAIN_ANCHORS[domain]}`}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {DOMAIN_LABELS[domain]}
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="#simulateurs"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-800 transition-colors hover:bg-brand-50"
            >
              Voir tous les outils
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            { value: String(SIMULATOR_COUNT), label: "Outils disponibles" },
            { value: "8", label: "Grandes catégories" },
            { value: "0 €", label: "Coût d'utilisation" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/10 px-6 py-5 text-center backdrop-blur-sm"
            >
              <p className="font-display text-2xl font-bold text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-brand-200">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
