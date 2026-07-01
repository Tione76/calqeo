import {
  CATEGORY_LABELS,
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  getSimulatorDomain,
  type SimulatorCategory,
  type SimulatorDefinition,
  type SimulatorIcon,
  type SiteDomain,
} from "../types";
import { CATEGORY_AFFINITY } from "./recommendations";

export const FEATURED_DOMAIN_COUNT = 4;
export const FEATURED_CATEGORY_COUNT = 3;

/** Seuil de confiance pour proposer une catégorie secondaire (ratio vs score primaire). */
export const SECONDARY_CONFIDENCE_THRESHOLD = 0.55;

/** Seuil minimal de confiance pour signaler une incohérence primaire dans l'audit. */
export const PRIMARY_SUGGESTION_MIN_CONFIDENCE = 50;

export interface PortalNavRef {
  slug: string;
  title: string;
}

export interface PortalSimulatorRef {
  slug: string;
  title: string;
  shortDescription: string;
  icon: SimulatorIcon;
  metadataCategory: SimulatorCategory;
  primaryCategory: SimulatorCategory;
  secondaryCategory: SimulatorCategory | null;
  primaryCategoryLabel: string;
  secondaryCategoryLabel: string | null;
}

export interface PortalCategoryNode {
  id: SimulatorCategory;
  label: string;
  path: string;
  count: number;
  featured: PortalNavRef[];
  simulators: PortalSimulatorRef[];
}

export interface PortalDomainNode {
  id: SiteDomain;
  label: string;
  path: string;
  count: number;
  featured: PortalNavRef[];
  categories: PortalCategoryNode[];
}

export interface PortalSimulatorIndexEntry {
  domain: SiteDomain;
  primaryCategory: SimulatorCategory;
  secondaryCategory: SimulatorCategory | null;
  domainPath: string;
  categoryPath: string;
  domainLabel: string;
  primaryCategoryLabel: string;
  secondaryCategoryLabel: string | null;
}

export interface PortalTree {
  version: 1;
  simulatorCount: number;
  domainCount: number;
  categoryHubCount: number;
  domains: PortalDomainNode[];
  simulatorIndex: Record<string, PortalSimulatorIndexEntry>;
  domainIds: SiteDomain[];
}

export interface CategoryScore {
  category: SimulatorCategory;
  label: string;
  score: number;
}

export interface ClassificationSuggestion {
  slug: string;
  title: string;
  domain: SiteDomain;
  /** Catégorie officielle (métadonnée ou fallback auto). */
  primaryCategory: SimulatorCategory;
  primaryCategoryLabel: string;
  primarySource: "metadata" | "auto";
  /** Meilleure alternative si l'algorithme estime un autre classement primaire. */
  primarySuggestion: {
    category: SimulatorCategory;
    label: string;
    confidence: number;
  } | null;
  /** Catégorie secondaire retenue pour le portail (si seuil atteint). */
  secondaryCategory: SimulatorCategory | null;
  secondaryCategoryLabel: string | null;
  secondaryConfidence: number | null;
  rankedScores: CategoryScore[];
}

export interface SimulatorClassification {
  primaryCategory: SimulatorCategory;
  secondaryCategory: SimulatorCategory | null;
  primarySource: "metadata" | "auto";
}

const STOP_WORDS = new Set([
  "de",
  "du",
  "des",
  "le",
  "la",
  "les",
  "un",
  "une",
  "et",
  "en",
  "pour",
  "avec",
  "sur",
  "par",
  "au",
  "aux",
  "ou",
  "calcul",
  "calculez",
  "estimez",
  "simulez",
  "simulateur",
  "calculateur",
  "simulation",
  "estimation",
  "gratuit",
  "gratuite",
  "ligne",
  "outil",
]);

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function simulatorTokens(sim: SimulatorDefinition): Set<string> {
  return new Set([
    ...tokenize(sim.title),
    ...tokenize(sim.shortDescription),
    ...tokenize(sim.metaDescription),
    ...(sim.keywords ?? []).flatMap((keyword) => tokenize(keyword)),
    ...sim.slug.split("-").filter((part) => part.length >= 3),
  ]);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function buildInboundRelationCounts(
  simulators: readonly SimulatorDefinition[]
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const sim of simulators) {
    for (const related of sim.relatedSlugs ?? []) {
      counts.set(related, (counts.get(related) ?? 0) + 1);
    }
  }
  return counts;
}

function buildCategoryCentroids(
  simulators: readonly SimulatorDefinition[],
  domain: SiteDomain
): Map<SimulatorCategory, Set<string>> {
  const centroids = new Map<SimulatorCategory, Set<string>>();
  for (const sim of simulators) {
    if (getSimulatorDomain(sim) !== domain) continue;
    const tokens = simulatorTokens(sim);
    const existing = centroids.get(sim.category) ?? new Set<string>();
    for (const token of tokens) existing.add(token);
    centroids.set(sim.category, existing);
  }
  return centroids;
}

function categoriesInDomain(
  simulators: readonly SimulatorDefinition[],
  domain: SiteDomain
): SimulatorCategory[] {
  const categories = new Set<SimulatorCategory>();
  for (const sim of simulators) {
    if (getSimulatorDomain(sim) === domain) categories.add(sim.category);
  }
  return [...categories];
}

/** Score d'appartenance d'un simulateur à une catégorie (même domaine). */
export function scoreCategoryFit(
  sim: SimulatorDefinition,
  category: SimulatorCategory,
  domain: SiteDomain,
  centroids: Map<SimulatorCategory, Set<string>>
): number {
  const centroid = centroids.get(category);
  if (!centroid || centroid.size === 0) return 0;

  let score = jaccard(simulatorTokens(sim), centroid) * 45;
  if (sim.category === category) score += 28;
  score += CATEGORY_AFFINITY[sim.category]?.[category] ?? 0;
  score += CATEGORY_AFFINITY[category]?.[sim.category] ?? 0;

  if (getSimulatorDomain(sim) !== domain) score *= 0.25;

  return score;
}

function rankCategoryScores(
  sim: SimulatorDefinition,
  simulators: readonly SimulatorDefinition[]
): CategoryScore[] {
  const domain = getSimulatorDomain(sim);
  const centroids = buildCategoryCentroids(simulators, domain);
  const candidates = categoriesInDomain(simulators, domain);

  return candidates
    .map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      score: scoreCategoryFit(sim, category, domain, centroids),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);
}

function toConfidence(numerator: number, denominator: number): number {
  if (denominator <= 0 || numerator <= 0) return 0;
  return Math.min(100, Math.round((numerator / denominator) * 100));
}

function hasValidMetadataCategory(sim: SimulatorDefinition): boolean {
  return Boolean(sim.category && CATEGORY_LABELS[sim.category]);
}

/**
 * Résout la catégorie primaire officielle.
 * La métadonnée `category` est toujours prioritaire lorsqu'elle est valide.
 * L'algorithme n'intervient qu'en l'absence de catégorie valide.
 */
export function resolvePrimaryCategory(
  sim: SimulatorDefinition,
  simulators: readonly SimulatorDefinition[]
): Pick<SimulatorClassification, "primaryCategory" | "primarySource"> {
  if (hasValidMetadataCategory(sim)) {
    return { primaryCategory: sim.category, primarySource: "metadata" };
  }

  const ranked = rankCategoryScores(sim, simulators);
  if (ranked.length === 0) {
    return { primaryCategory: sim.category, primarySource: "auto" };
  }

  return { primaryCategory: ranked[0].category, primarySource: "auto" };
}

function pickSecondaryCategory(
  primaryCategory: SimulatorCategory,
  ranked: CategoryScore[]
): { category: SimulatorCategory | null; confidence: number | null } {
  const primaryScore =
    ranked.find((entry) => entry.category === primaryCategory)?.score ?? 0;
  if (primaryScore <= 0) return { category: null, confidence: null };

  const bestAlternative = ranked.find((entry) => entry.category !== primaryCategory);
  if (!bestAlternative) return { category: null, confidence: null };

  const confidence = toConfidence(bestAlternative.score, primaryScore);
  if (bestAlternative.score < primaryScore * SECONDARY_CONFIDENCE_THRESHOLD) {
    return { category: null, confidence: null };
  }

  return { category: bestAlternative.category, confidence };
}

export function classifySimulator(
  sim: SimulatorDefinition,
  simulators: readonly SimulatorDefinition[]
): SimulatorClassification {
  const { primaryCategory, primarySource } = resolvePrimaryCategory(sim, simulators);
  const ranked = rankCategoryScores(sim, simulators);
  const secondary = pickSecondaryCategory(primaryCategory, ranked);

  return {
    primaryCategory,
    secondaryCategory: secondary.category,
    primarySource,
  };
}

/** Analyse complète pour l'audit : suggestions sans modification des métadonnées. */
export function analyzeClassification(
  sim: SimulatorDefinition,
  simulators: readonly SimulatorDefinition[]
): ClassificationSuggestion {
  const { primaryCategory, primarySource } = resolvePrimaryCategory(sim, simulators);
  const ranked = rankCategoryScores(sim, simulators);
  const primaryScore =
    ranked.find((entry) => entry.category === primaryCategory)?.score ?? 0;

  const bestRanked = ranked[0];
  let primarySuggestion: ClassificationSuggestion["primarySuggestion"] = null;

  if (
    primarySource === "metadata" &&
    bestRanked &&
    bestRanked.category !== primaryCategory &&
    bestRanked.score > primaryScore
  ) {
    const confidence = toConfidence(bestRanked.score, bestRanked.score + primaryScore);
    if (confidence >= PRIMARY_SUGGESTION_MIN_CONFIDENCE) {
      primarySuggestion = {
        category: bestRanked.category,
        label: bestRanked.label,
        confidence,
      };
    }
  }

  const secondary = pickSecondaryCategory(primaryCategory, ranked);

  return {
    slug: sim.slug,
    title: sim.title,
    domain: getSimulatorDomain(sim),
    primaryCategory,
    primaryCategoryLabel: CATEGORY_LABELS[primaryCategory],
    primarySource,
    primarySuggestion,
    secondaryCategory: secondary.category,
    secondaryCategoryLabel: secondary.category
      ? CATEGORY_LABELS[secondary.category]
      : null,
    secondaryConfidence: secondary.confidence,
    rankedScores: ranked,
  };
}

export function analyzeAllClassifications(
  simulators: readonly SimulatorDefinition[]
): ClassificationSuggestion[] {
  return simulators.map((sim) => analyzeClassification(sim, simulators));
}

function featuredScore(
  sim: SimulatorDefinition,
  inboundCounts: Map<string, number>
): number {
  let score = (inboundCounts.get(sim.slug) ?? 0) * 4;
  score += (sim.keywords?.length ?? 0) * 0.75;
  score += (sim.regulationIds?.length ?? 0) * 2;
  score += sim.relatedSlugs?.length ?? 0;
  return score;
}

function pickFeatured(
  simulators: SimulatorDefinition[],
  inboundCounts: Map<string, number>,
  limit: number
): PortalNavRef[] {
  return [...simulators]
    .sort((a, b) => {
      const diff = featuredScore(b, inboundCounts) - featuredScore(a, inboundCounts);
      if (diff !== 0) return diff;
      return a.title.localeCompare(b.title, "fr");
    })
    .slice(0, limit)
    .map((sim) => ({ slug: sim.slug, title: sim.title }));
}

function toPortalSimulatorRef(
  sim: SimulatorDefinition,
  classification: SimulatorClassification
): PortalSimulatorRef {
  return {
    slug: sim.slug,
    title: sim.title,
    shortDescription: sim.shortDescription,
    icon: sim.icon,
    metadataCategory: sim.category,
    primaryCategory: classification.primaryCategory,
    secondaryCategory: classification.secondaryCategory,
    primaryCategoryLabel: CATEGORY_LABELS[classification.primaryCategory],
    secondaryCategoryLabel: classification.secondaryCategory
      ? CATEGORY_LABELS[classification.secondaryCategory]
      : null,
  };
}

export function buildPortalTree(
  simulators: readonly SimulatorDefinition[]
): PortalTree {
  const inboundCounts = buildInboundRelationCounts(simulators);
  const classifications = new Map<string, SimulatorClassification>();

  for (const sim of simulators) {
    classifications.set(sim.slug, classifySimulator(sim, simulators));
  }

  const simulatorIndex: PortalTree["simulatorIndex"] = {};

  for (const sim of simulators) {
    const domain = getSimulatorDomain(sim);
    const classification = classifications.get(sim.slug)!;
    const domainPath = `/simulateurs/${domain}`;
    const categoryPath = `${domainPath}/${classification.primaryCategory}`;

    simulatorIndex[sim.slug] = {
      domain,
      primaryCategory: classification.primaryCategory,
      secondaryCategory: classification.secondaryCategory,
      domainPath,
      categoryPath,
      domainLabel: DOMAIN_LABELS[domain],
      primaryCategoryLabel: CATEGORY_LABELS[classification.primaryCategory],
      secondaryCategoryLabel: classification.secondaryCategory
        ? CATEGORY_LABELS[classification.secondaryCategory]
        : null,
    };
  }

  const domains: PortalDomainNode[] = [];
  let categoryHubCount = 0;

  for (const domain of DOMAIN_ORDER) {
    const domainSims = simulators.filter((s) => getSimulatorDomain(s) === domain);
    if (domainSims.length === 0) continue;

    const byPrimary = new Map<SimulatorCategory, SimulatorDefinition[]>();
    for (const sim of domainSims) {
      const primary = classifications.get(sim.slug)!.primaryCategory;
      const list = byPrimary.get(primary) ?? [];
      list.push(sim);
      byPrimary.set(primary, list);
    }

    const categories: PortalCategoryNode[] = [...byPrimary.entries()]
      .sort(([a], [b]) =>
        CATEGORY_LABELS[a].localeCompare(CATEGORY_LABELS[b], "fr")
      )
      .map(([categoryId, categorySims]) => {
        categoryHubCount++;
        const sorted = [...categorySims].sort((a, b) =>
          a.title.localeCompare(b.title, "fr")
        );
        return {
          id: categoryId,
          label: CATEGORY_LABELS[categoryId],
          path: `/simulateurs/${domain}/${categoryId}`,
          count: sorted.length,
          featured: pickFeatured(sorted, inboundCounts, FEATURED_CATEGORY_COUNT),
          simulators: sorted.map((sim) =>
            toPortalSimulatorRef(sim, classifications.get(sim.slug)!)
          ),
        };
      });

    domains.push({
      id: domain,
      label: DOMAIN_LABELS[domain],
      path: `/simulateurs/${domain}`,
      count: domainSims.length,
      featured: pickFeatured(domainSims, inboundCounts, FEATURED_DOMAIN_COUNT),
      categories,
    });
  }

  return {
    version: 1,
    simulatorCount: simulators.length,
    domainCount: domains.length,
    categoryHubCount,
    domains,
    simulatorIndex,
    domainIds: domains.map((domain) => domain.id),
  };
}

export function getDomainHubPath(domain: SiteDomain): string {
  return `/simulateurs/${domain}`;
}

export function getCategoryHubPath(
  domain: SiteDomain,
  category: SimulatorCategory
): string {
  return `/simulateurs/${domain}/${category}`;
}
