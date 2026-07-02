import Link from "next/link";
import { Suspense } from "react";
import { DOMAIN_ORDER, DOMAIN_LABELS } from "@/lib/simulators/types";
import { getDomainNavGroups } from "@/lib/simulators/navigation";
import { SearchBar } from "@/components/layout/SearchBar";
import { HeroDesktopBackdrop } from "@/components/home/HeroDesktopBackdrop";

const HERO_REASSURANCE_BADGES = [
  { title: "100 % gratuit", subtitle: "Aucun abonnement" },
  { title: "Sans inscription", subtitle: "Accès immédiat" },
  { title: "Résultats instantanés", subtitle: "En quelques secondes" },
] as const;

export function Hero() {
  const domainGroups = getDomainNavGroups();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent-400 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-brand-400 blur-3xl" />
      </div>
      <HeroDesktopBackdrop />

      <div className="container-app relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm md:border md:border-white/[0.12] md:bg-white/[0.08] md:px-5 md:py-2 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <span className="h-2 w-2 rounded-full bg-accent-400" />
            100 % gratuit — Résultats instantanés
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Simulez et calculez{" "}
            <span className="text-accent-400">en un clic</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-brand-100 sm:text-xl">
            Avant de décider, prenez deux minutes pour simuler votre situation.
          </p>

          <div className="mx-auto mt-8 max-w-xl md:mt-10">
            <Suspense
              fallback={
                <div className="h-14 animate-pulse rounded-2xl bg-white/20" />
              }
            >
              <SearchBar
                redirectOnSubmit
                placeholder="Ex : IMC, TVA, capacité emprunt, impôt…"
                className="[&_input]:border-0 [&_input]:shadow-lg md:[&_input]:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)] md:[&_input]:ring-1 md:[&_input]:ring-white/15"
              />
            </Suspense>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-2.5">
            {DOMAIN_ORDER.map((domain) => {
              const group = domainGroups.find((entry) => entry.domain === domain);
              if (!group) return null;
              return (
                <Link
                  key={domain}
                  href={group.path}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20 md:border md:border-white/[0.08] md:bg-white/[0.06] md:px-3.5 md:py-1.5 md:text-[0.8125rem] md:tracking-wide md:hover:border-white/[0.14] md:hover:bg-white/[0.11]"
                >
                  {DOMAIN_LABELS[domain]}
                </Link>
              );
            })}
          </div>

          <div className="mt-8">
            <Link
              href="#simulateurs"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-800 transition-colors hover:bg-brand-50 md:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)] md:ring-1 md:ring-white/20 md:hover:bg-white/95"
            >
              Voir tous les outils
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-3 sm:gap-4 md:mt-16">
          {HERO_REASSURANCE_BADGES.map((badge) => (
            <div
              key={badge.title}
              className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3.5 text-center shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-colors duration-300 hover:border-white/[0.16] hover:bg-white/[0.11] sm:px-5 sm:py-4"
            >
              <p className="text-sm font-semibold text-white">
                <span className="mr-1.5 text-accent-400" aria-hidden>
                  ✓
                </span>
                {badge.title}
              </p>
              <p className="mt-1 text-xs text-brand-200/90">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
