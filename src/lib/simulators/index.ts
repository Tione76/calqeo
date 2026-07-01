import { capaciteEmprunt } from "./capacite-emprunt";
import { rendementLocatif } from "./rendement-locatif";
import { mensualitePret } from "./mensualite-pret";
import { additionalSimulators } from "./additional";
import { generalSimulators } from "./general";
import { getSimulatorDomain, DOMAIN_LABELS, type SimulatorDefinition } from "./types";
import { applyContentEnrichment } from "./_shared/content";
import { applySeoEnrichment } from "./_shared/seo";
import {
  buildRecommendationMap,
  getRecommendedSlugs,
  RECOMMENDATION_MAX,
  RECOMMENDATION_MIN,
  RECOMMENDATION_TARGET,
} from "./_shared/recommendations";
import { getSimulatorRegulationIds } from "./regulation-ids";
import { ACTIVATED_DRAFTS } from "./drafts/activation";

/**
 * Registre central des simulateurs publiés.
 * Pour ajouter un simulateur : créez un dossier dans src/lib/simulators/
 * puis importez-le et ajoutez-le à ce tableau.
 * Pour publier un brouillon : ajoutez son slug dans drafts/activation.ts.
 */
const rawPublishedSimulators = [
  capaciteEmprunt,
  rendementLocatif,
  mensualitePret,
  ...additionalSimulators,
  ...generalSimulators,
] as const;

const activatedDrafts = ACTIVATED_DRAFTS.map((sim) => ({
  ...sim,
  publicationStatus: "published" as const,
}));

const rawSimulators = [...rawPublishedSimulators, ...activatedDrafts] as const;

function enrichSimulator(sim: SimulatorDefinition): SimulatorDefinition {
  const regulationIds = sim.regulationIds ?? getSimulatorRegulationIds(sim.slug);
  const enriched = applySeoEnrichment(applyContentEnrichment(sim));
  return regulationIds ? { ...enriched, regulationIds } : enriched;
}

export const simulators = rawSimulators.map((sim) =>
  enrichSimulator(sim as SimulatorDefinition)
) as unknown as typeof rawSimulators;

const recommendationMap = buildRecommendationMap(
  simulators as unknown as SimulatorDefinition[]
);

export type RegisteredSimulator = (typeof simulators)[number];

export function getSimulatorBySlug(
  slug: string
): RegisteredSimulator | undefined {
  return simulators.find((s) => s.slug === slug);
}

export function getAllSimulatorSlugs(): string[] {
  return simulators.map((s) => s.slug);
}

/** Bibliothèque de brouillons — import direct depuis ./drafts (hors bundle production). */
export { ACTIVATE_DRAFT_SLUGS, ACTIVATED_DRAFTS } from "./drafts/activation";
export { REJECTED_DRAFT_IDEAS, getRejectedDraftCount } from "./drafts/catalog";

export function getRelatedSimulators(
  currentSlug: string,
  limit?: number
): RegisteredSimulator[] {
  const slugs = getRecommendedSlugs(recommendationMap, currentSlug, {
    min: limit != null ? Math.min(limit, RECOMMENDATION_MIN) : RECOMMENDATION_MIN,
    max: limit ?? RECOMMENDATION_MAX,
    target: limit ?? RECOMMENDATION_TARGET,
  });

  return slugs
    .map((slug) => simulators.find((sim) => sim.slug === slug))
    .filter((sim): sim is RegisteredSimulator => !!sim);
}

export {
  buildRecommendationMap,
  getRecommendedSlugs,
  averageRecommendationCount,
  RECOMMENDATION_MIN,
  RECOMMENDATION_MAX,
  RECOMMENDATION_TARGET,
} from "./_shared/recommendations";

export function searchSimulators(query: string): RegisteredSimulator[] {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [...simulators];

  return simulators.filter((s) => {
    const haystack = [
      s.title,
      s.metaTitle,
      s.shortDescription,
      s.metaDescription,
      s.category,
      getSimulatorDomain(s),
      DOMAIN_LABELS[getSimulatorDomain(s)],
      ...s.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return normalized.split(/\s+/).every((word) => haystack.includes(word));
  });
}

export type { SimulatorDefinition, FAQItem, SimulatorResult, ResultLine, SimulatorContent as SimulatorContentData, SiteDomain, SimulatorCategory } from "./types";
export { getSimulatorDomain, DOMAIN_LABELS, DOMAIN_ORDER, DOMAIN_ANCHORS } from "./types";
