import {
  getSimulatorDomain,
  type SimulatorCategory,
  type SimulatorDefinition,
  type SiteDomain,
} from "../types";

export const RECOMMENDATION_MIN = 6;
export const RECOMMENDATION_MAX = 10;
export const RECOMMENDATION_TARGET = 8;

interface SimulatorProfile {
  slug: string;
  title: string;
  domain: SiteDomain;
  category: SimulatorCategory;
  keywords: Set<string>;
  textTokens: Set<string>;
  slugTokens: Set<string>;
  regulationIds: Set<string>;
  /** Slugs déclarés + slugs qui référencent ce simulateur (graphe implicite). */
  relationSlugs: Set<string>;
}

/** Affinités inter-catégories (parcours utilisateur), sans liste par slug. */
export const CATEGORY_AFFINITY: Partial<
  Record<SimulatorCategory, Partial<Record<SimulatorCategory, number>>>
> = {
  financement: {
    credit: 22,
    investissement: 18,
    fiscalite: 12,
    epargne: 8,
    gestion: 6,
  },
  credit: {
    financement: 22,
    epargne: 12,
    impots: 8,
  },
  investissement: {
    fiscalite: 24,
    financement: 16,
    gestion: 14,
    credit: 10,
    impots: 8,
  },
  fiscalite: {
    investissement: 24,
    gestion: 14,
    impots: 14,
    financement: 8,
  },
  gestion: {
    fiscalite: 16,
    investissement: 14,
    financement: 6,
  },
  impots: {
    fiscalite: 18,
    salaire: 14,
    social: 12,
    independant: 10,
    epargne: 8,
  },
  salaire: {
    impots: 16,
    social: 14,
    independant: 10,
    epargne: 8,
  },
  social: {
    salaire: 14,
    impots: 12,
    epargne: 8,
  },
  independant: {
    impots: 14,
    "entreprise-gestion": 12,
    salaire: 10,
    credit: 8,
  },
  "entreprise-gestion": {
    independant: 12,
    impots: 10,
    salaire: 8,
  },
  epargne: {
    credit: 12,
    impots: 10,
    financement: 8,
  },
  materiaux: {
    energie: 16,
  },
  energie: {
    materiaux: 14,
    financement: 10,
    investissement: 8,
  },
  conversion: {
    pratique: 14,
  },
  pratique: {
    conversion: 14,
    epargne: 6,
  },
  sante: {
    pratique: 6,
  },
};

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
  "son",
  "ses",
  "votre",
  "vos",
  "est",
  "sont",
  "the",
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
  "montant",
  "annuel",
  "annuelle",
  "mensuel",
  "mensuelle",
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

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union > 0 ? intersection / union : 0;
}

function buildProfiles(simulators: readonly SimulatorDefinition[]): SimulatorProfile[] {
  const inboundRelations = new Map<string, Set<string>>();

  for (const sim of simulators) {
    for (const related of sim.relatedSlugs ?? []) {
      const set = inboundRelations.get(related) ?? new Set<string>();
      set.add(sim.slug);
      inboundRelations.set(related, set);
    }
  }

  return simulators.map((sim) => {
    const relationSlugs = new Set(sim.relatedSlugs ?? []);
    for (const inbound of inboundRelations.get(sim.slug) ?? []) {
      relationSlugs.add(inbound);
    }

    return {
      slug: sim.slug,
      title: sim.title,
      domain: getSimulatorDomain(sim),
      category: sim.category,
      keywords: new Set(
        (sim.keywords ?? []).flatMap((keyword) => tokenize(keyword))
      ),
      textTokens: new Set([
        ...tokenize(sim.title),
        ...tokenize(sim.shortDescription),
        ...tokenize(sim.metaDescription),
      ]),
      slugTokens: new Set(sim.slug.split("-").filter((part) => part.length >= 3)),
      regulationIds: new Set(sim.regulationIds ?? []),
      relationSlugs,
    };
  });
}

function computeScore(source: SimulatorProfile, target: SimulatorProfile): number {
  if (source.slug === target.slug) return Number.NEGATIVE_INFINITY;

  let score = 0;

  // 1. Même catégorie (priorité maximale)
  if (source.category === target.category) {
    score += 42;
  }

  // 2. Catégories complémentaires (parcours naturel)
  score += CATEGORY_AFFINITY[source.category]?.[target.category] ?? 0;

  // 3. Même domaine
  if (source.domain === target.domain) {
    score += 16;
  }

  // 4. Proximité sémantique (mots-clés SEO)
  score += jaccard(source.keywords, target.keywords) * 34;

  // 5. Proximité textuelle (titre + descriptions)
  score += jaccard(source.textTokens, target.textTokens) * 28;

  // 6. Racines communes dans le slug
  score += jaccard(source.slugTokens, target.slugTokens) * 22;

  // 7. Relations existantes (graphe déclaré, bidirectionnel)
  if (source.relationSlugs.has(target.slug)) {
    score += 26;
  }

  // 8. Même cadre réglementaire (thème fiscal, URSSAF, immobilier…)
  score += jaccard(source.regulationIds, target.regulationIds) * 20;

  // 9. Pont inter-domaines utile (ex. fiscalité générale ↔ immobilier locatif)
  if (
    source.domain !== target.domain &&
    jaccard(source.textTokens, target.textTokens) >= 0.08
  ) {
    score += 6;
  }

  return score;
}

function pickCount(
  available: number,
  min: number,
  max: number,
  target: number
): number {
  if (available <= 0) return 0;
  const desired = Math.min(max, Math.max(min, target));
  return Math.min(available, desired);
}

/**
 * Pré-calcule les recommandations pour tous les simulateurs (O(n²), exécuté une seule fois).
 */
export function buildRecommendationMap(
  simulators: readonly SimulatorDefinition[]
): ReadonlyMap<string, readonly string[]> {
  const profiles = buildProfiles(simulators);
  const cache = new Map<string, readonly string[]>();

  for (const source of profiles) {
    const ranked = profiles
      .filter((target) => target.slug !== source.slug)
      .map((target) => ({
        slug: target.slug,
        score: computeScore(source, target),
        title: target.title,
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.title.localeCompare(b.title, "fr");
      });

    let selected = ranked.slice(0, RECOMMENDATION_MAX).map((entry) => entry.slug);

    if (selected.length < RECOMMENDATION_MIN) {
      const fallback = profiles
        .filter((target) => target.slug !== source.slug && !selected.includes(target.slug))
        .map((target) => ({
          slug: target.slug,
          score:
            (source.domain === target.domain ? 10 : 0) +
            (source.category === target.category ? 8 : 0),
          title: target.title,
        }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.title.localeCompare(b.title, "fr");
        });

      selected = [
        ...selected,
        ...fallback
          .slice(0, RECOMMENDATION_MIN - selected.length)
          .map((entry) => entry.slug),
      ];
    }

    cache.set(source.slug, selected);
  }

  return cache;
}

export function getRecommendedSlugs(
  map: ReadonlyMap<string, readonly string[]>,
  slug: string,
  options?: { min?: number; max?: number; target?: number }
): string[] {
  const min = options?.min ?? RECOMMENDATION_MIN;
  const max = options?.max ?? RECOMMENDATION_MAX;
  const target = options?.target ?? RECOMMENDATION_TARGET;
  const ranked = map.get(slug) ?? [];
  const count = pickCount(ranked.length, min, max, target);
  return ranked.slice(0, count);
}

/** Moyenne du nombre de recommandations retournées (diagnostic). */
export function averageRecommendationCount(
  map: ReadonlyMap<string, readonly string[]>,
  options?: { min?: number; max?: number; target?: number }
): number {
  if (map.size === 0) return 0;
  let total = 0;
  for (const slug of map.keys()) {
    total += getRecommendedSlugs(map, slug, options).length;
  }
  return total / map.size;
}
