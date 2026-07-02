"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  getSimulatorsGroupedByDomain,
  SIMULATOR_COUNT,
  type DomainNavGroup,
  type SimulatorCardRef,
} from "@/lib/simulators/navigation";
import type { SiteDomain } from "@/lib/simulators/types";
import {
  searchSimulators,
  type SearchableSimulator,
} from "@/lib/simulators/search-client";
import { SearchBar } from "@/components/layout/SearchBar";
import { SimulatorToolCard } from "@/components/simulator/SimulatorToolCard";
import { CategoryIllustrationImage } from "@/components/home/CategoryIllustrationImage";
import { HOME_CATEGORY_TAGLINES } from "@/components/home/category-taglines";
import { HOME_CATEGORY_INTROS } from "@/components/home/category-intros";
import {
  getCategoryTheme,
  type CategoryTheme,
} from "@/components/home/category-theme";
import { getHomeCardCta } from "@/components/home/card-cta";

const POPULAR_HOME_LIMIT = 3;

function getPopularCards(group: DomainNavGroup): SimulatorCardRef[] {
  return group.featured
    .slice(0, POPULAR_HOME_LIMIT)
    .map((ref) => group.all.find((sim) => sim.slug === ref.slug))
    .filter((sim): sim is SimulatorCardRef => sim != null);
}

function CategoryThemes({
  group,
  className = "",
  desktop = false,
}: {
  group: DomainNavGroup;
  className?: string;
  desktop?: boolean;
}) {
  if (group.categories.length === 0) return null;

  return (
    <p className={className}>
      {group.categories.map((category, index) => (
        <span key={category.id}>
          {index > 0 && (
            <span className="mx-1.5 text-slate-300" aria-hidden="true">
              ·
            </span>
          )}
          <Link
            href={category.path}
            className={
              desktop
                ? "text-slate-400 transition-colors duration-500 hover:text-[var(--theme-accent-hover,var(--theme-accent))] hover:underline"
                : "transition-colors hover:text-brand-700"
            }
          >
            {category.label}
          </Link>
        </span>
      ))}
    </p>
  );
}

export function SimulatorGrid() {
  const [query, setQuery] = useState("");
  const groups = getSimulatorsGroupedByDomain();

  const filtered = useMemo(
    () => (query ? searchSimulators(query) : []),
    [query]
  );

  return (
    <section id="simulateurs" className="scroll-mt-24">
      {/* Mobile — identité Calqeo */}
      <div className="md:hidden">
        <div className="text-center">
          <h2 className="section-title">Tous nos outils</h2>
          <p className="section-subtitle mx-auto max-w-2xl">
            {SIMULATOR_COUNT} simulateurs et calculateurs gratuits, classés par
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
      </div>

      {/* Desktop — transition Hero → catégories */}
      <div className="hidden text-center md:block md:px-6 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[700px]">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-900 lg:text-[1.75rem] lg:leading-snug">
            Des outils fiables pour prendre les bonnes décisions.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-500 lg:mt-5">
            Immobilier, budget, fiscalité, travaux, santé ou vie quotidienne :
            trouvez en quelques secondes le simulateur adapté à votre situation.
          </p>
        </div>
      </div>

      {query ? (
        filtered.length === 0 ? (
          <p className="mt-10 text-center text-slate-500">
            Aucun outil ne correspond à votre recherche.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:mt-14 md:gap-8">
            {filtered.map((sim) => (
              <SimulatorCard key={sim.slug} sim={sim} mobileLayout />
            ))}
          </div>
        )
      ) : (
        <div className="mt-12 space-y-14 md:mt-0 md:space-y-0">
          {groups.map((group, index) => {
            const popularCards = getPopularCards(group);
            const tagline = HOME_CATEGORY_TAGLINES[group.domain];
            const intro = HOME_CATEGORY_INTROS[group.domain];
            const theme = getCategoryTheme(group.domain);

            return (
              <div key={group.domain}>
                <div id={group.anchor} className="scroll-mt-24">
                  {/* Mobile — identité Calqeo */}
                  <div
                    className="md:hidden -mx-1 rounded-[1.4rem] px-5 py-8 sm:mx-0"
                    style={{ backgroundColor: theme.sectionWash }}
                  >
                    <div className="flex items-start gap-4">
                      <CategoryIllustrationImage domain={group.domain} size="mobile" />
                      <div className="min-w-0 flex-1">
                        <h3
                          className="font-display text-xs font-semibold uppercase tracking-[0.18em]"
                          style={{ color: theme.accent }}
                        >
                          {group.label}
                        </h3>
                        {tagline && (
                          <p className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight text-slate-800">
                            {tagline}
                          </p>
                        )}
                        <p
                          className="mt-2 text-xs font-medium"
                          style={{ color: theme.accent, opacity: 0.72 }}
                        >
                          {group.count} outil{group.count > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <CategoryThemes
                      group={group}
                      className="mt-4 text-xs leading-relaxed text-slate-500"
                    />

                    {intro && (
                      <p className="mt-5 text-sm leading-relaxed text-slate-600">{intro}</p>
                    )}

                    <div className="mt-7 grid gap-5">
                      {popularCards.map((sim) => (
                        <SimulatorToolCard
                          key={sim.slug}
                          slug={sim.slug}
                          title={sim.title}
                          shortDescription={sim.shortDescription}
                          domain={group.domain}
                          cta={getHomeCardCta(sim.slug, sim.title)}
                        />
                      ))}
                    </div>

                    <Link
                      href={group.path}
                      className="home-category-cta mt-8 inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: theme.accent }}
                    >
                      <span
                        className="h-px w-6"
                        style={{ backgroundColor: theme.accentBorder }}
                        aria-hidden
                      />
                      Voir les {group.count} outils
                      <span aria-hidden>→</span>
                    </Link>
                  </div>

                  {/* Desktop — identité Calqeo */}
                  <div
                    className="home-fade-up relative hidden md:mb-12 md:block md:-mx-6 md:px-6 md:py-24 lg:-mx-8 lg:px-8 lg:py-28"
                    style={{
                      animationDelay: `${index * 70}ms`,
                      backgroundColor: theme.sectionWash,
                      ["--theme-accent" as string]: theme.accent,
                      ["--theme-accent-hover" as string]: theme.accentHover,
                      ["--theme-accent-border" as string]: theme.accentBorder,
                    }}
                  >
                    <div
                      className="absolute bottom-10 left-0 top-10 w-[3px] rounded-full"
                      style={{ backgroundColor: theme.accent }}
                      aria-hidden
                    />

                    {index > 0 && (
                      <div
                        className="absolute left-6 right-6 top-0 h-px bg-slate-100 lg:left-8 lg:right-8"
                        aria-hidden
                      />
                    )}

                    <div className="flex items-start gap-8 pl-6 lg:gap-10 lg:pl-8">
                      <CategoryIllustrationImage domain={group.domain} />

                      <div className="min-w-0 flex-1 pt-1">
                        <h3
                          className="font-display text-[0.8rem] font-semibold uppercase tracking-[0.22em]"
                          style={{ color: theme.accent }}
                        >
                          {group.label}
                        </h3>
                        {tagline && (
                          <p className="mt-4 font-display text-xl font-medium tracking-tight text-slate-800 lg:text-[1.35rem] lg:leading-snug">
                            {tagline}
                          </p>
                        )}
                        <p
                          className="mt-3 text-xs font-medium"
                          style={{ color: theme.accent, opacity: 0.72 }}
                        >
                          {group.count} outil{group.count > 1 ? "s" : ""}
                        </p>
                        <CategoryThemes
                          group={group}
                          desktop
                          className="mt-5 text-xs leading-relaxed"
                        />
                      </div>
                    </div>

                    {intro && (
                      <p className="mt-8 max-w-2xl pl-6 text-sm leading-relaxed text-[#4b5563] lg:pl-8">
                        {intro}
                      </p>
                    )}

                    <div className="mt-10 grid gap-9 pl-6 lg:grid-cols-3 lg:pl-8">
                      {popularCards.map((sim, cardIndex) => (
                        <SimulatorCard
                          key={sim.slug}
                          sim={sim}
                          domain={group.domain}
                          theme={theme}
                          animationDelay={cardIndex * 90}
                        />
                      ))}
                    </div>

                    <Link
                      href={group.path}
                      className="home-category-cta group/link mt-12 inline-flex items-center gap-2.5 pl-6 text-base font-semibold lg:pl-8"
                      style={{ color: theme.accent }}
                    >
                      <span
                        className="h-px w-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:w-11"
                        style={{ backgroundColor: theme.accentBorder }}
                        aria-hidden
                      />
                      Voir les {group.count} outils
                      <span
                        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-1"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SimulatorCard({
  sim,
  mobileLayout = false,
  domain,
  theme,
  animationDelay = 0,
}: {
  sim: SimulatorCardRef | SearchableSimulator;
  mobileLayout?: boolean;
  domain?: SiteDomain;
  theme?: CategoryTheme;
  animationDelay?: number;
}) {
  const cardTheme = theme ?? (domain ? getCategoryTheme(domain) : undefined);
  const simDomain =
    domain ?? ("domain" in sim ? (sim as SimulatorCardRef).domain : undefined);
  const resolvedTheme = cardTheme ?? (simDomain ? getCategoryTheme(simDomain) : undefined);
  const cta = getHomeCardCta(sim.slug, sim.title);

  if (mobileLayout) {
    const domain = simDomain ?? ("domain" in sim ? sim.domain : "quotidien");
    const cta = getHomeCardCta(sim.slug, sim.title);

    return (
      <>
        <SimulatorToolCard
          slug={sim.slug}
          title={sim.title}
          shortDescription={sim.shortDescription}
          domain={domain}
          categoryLabel={"domainLabel" in sim ? sim.domainLabel : undefined}
          cta={cta}
          className="md:hidden"
        />
        <EditorialCard
          sim={sim}
          cta={cta}
          theme={resolvedTheme}
          className="hidden md:flex"
          asLink
        />
      </>
    );
  }

  return (
    <EditorialCard
      sim={sim}
      cta={cta}
      theme={resolvedTheme}
      animationDelay={animationDelay}
      asLink
    />
  );
}

function EditorialCard({
  sim,
  cta,
  theme,
  animationDelay = 0,
  className = "",
  asLink = false,
}: {
  sim: SimulatorCardRef | SearchableSimulator;
  cta: string;
  theme?: CategoryTheme;
  animationDelay?: number;
  className?: string;
  asLink?: boolean;
}) {
  const article = (
    <article
      className={`home-fade-up flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-200/50 bg-white p-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:p-9 group-hover:-translate-y-[3px] group-hover:shadow-[0_16px_48px_-20px_rgba(15,23,42,0.16)] ${className}`}
      style={{
        borderTopWidth: "4px",
        borderTopColor: theme?.accent ?? "#cbd5e1",
        animationDelay: `${animationDelay + 120}ms`,
        ["--theme-accent" as string]: theme?.accent,
        ["--theme-accent-hover" as string]: theme?.accentHover,
      }}
    >
      <h3 className="font-display text-[1.2rem] font-semibold leading-snug text-brand-900 transition-colors duration-500 group-hover:text-[var(--theme-accent,#2D6A7E)] lg:text-[1.28rem]">
        {sim.title}
      </h3>
      <p className="mt-4 flex-1 text-[0.95rem] leading-7 text-slate-600">
        {sim.shortDescription}
      </p>
      <span
        className="home-category-cta mt-8 inline-flex items-center gap-2 border-t border-slate-100 pt-5 text-base font-semibold"
        style={{ color: theme?.accent ?? "#2D6A7E" }}
      >
        {cta}
        <CardArrow />
      </span>
    </article>
  );

  if (asLink) {
    return (
      <Link
        href={`/simulateurs/${sim.slug}`}
        className="group block h-full"
        style={{ animationDelay: `${animationDelay + 120}ms` }}
      >
        {article}
      </Link>
    );
  }

  return article;
}

function CardArrow() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  );
}
