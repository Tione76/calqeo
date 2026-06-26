import { capaciteEmprunt } from "./capacite-emprunt";
import { rendementLocatif } from "./rendement-locatif";
import { mensualitePret } from "./mensualite-pret";
import { additionalSimulators } from "./additional";
import { generalSimulators } from "./general";
import { getSimulatorDomain, DOMAIN_LABELS, type SimulatorDefinition } from "./types";
import { applyContentEnrichment } from "./_shared/content";
import { applySeoEnrichment } from "./_shared/seo";
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
  limit = 3
): RegisteredSimulator[] {
  const current = simulators.find((s) => s.slug === currentSlug);
  if (!current) return [];

  const explicit = (current.relatedSlugs ?? [])
    .map((slug) => simulators.find((s) => s.slug === slug))
    .filter((s): s is RegisteredSimulator => !!s && s.slug !== currentSlug);

  const rest = simulators
    .filter(
      (s) =>
        s.slug !== currentSlug &&
        !explicit.some((e) => e.slug === s.slug)
    )
    .sort((a, b) => {
      const score = (s: RegisteredSimulator) => {
        const domainMatch =
          getSimulatorDomain(s) === getSimulatorDomain(current!) ? 0 : 1;
        const categoryMatch = s.category === current.category ? 0 : 1;
        return domainMatch * 2 + categoryMatch;
      };
      return score(a) - score(b);
    });

  return [...explicit, ...rest].slice(0, limit);
}

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
