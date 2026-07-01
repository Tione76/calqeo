import {
  getSimulatorDomain,
  type SimulatorDefinition,
  type SiteDomain,
} from "../types";
import { SITE } from "@/lib/site/config";

/** Longueur cible SERP (title final incluant le suffixe de marque du layout). */
export const META_TITLE_EFFECTIVE_MAX = 60;
export const META_DESCRIPTION_MAX = 155;
const TITLE_BRAND_SUFFIX = ` | ${SITE.name}`;

type ToolKind = "simulateur" | "calculateur";

interface SeoOverride {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const CALCULATEUR_DOMAINS = new Set(["sante", "quotidien"]);
const SIMULATEUR_DOMAINS = new Set(["immobilier", "finance", "emploi", "fiscalite", "travaux"]);
const CALCULATEUR_CATEGORIES = new Set([
  "sante",
  "conversion",
  "pratique",
  "materiaux",
]);

/** Personnalisations SEO par slug (prioritaires sur la génération automatique). */
const SEO_OVERRIDES: Record<string, SeoOverride> = {
  "capacite-emprunt": {
    title: "Simulateur de capacité d'emprunt immobilier",
    metaTitle: "Simulateur capacité d'emprunt immobilier",
    metaDescription:
      "Estimez votre capacité d'emprunt et votre budget d'achat selon vos revenus, apport et taux d'endettement. Simulateur gratuit.",
  },
  "mensualite-pret-immobilier": {
    title: "Simulateur de mensualité de prêt immobilier",
    metaTitle: "Simulateur mensualité prêt immobilier",
    metaDescription:
      "Calculez la mensualité de votre crédit immobilier : capital, taux, durée et assurance. Estimation instantanée du coût total.",
  },
  "rendement-locatif": {
    title: "Simulateur de rendement locatif",
    metaTitle: "Simulateur rendement locatif brut et net",
    metaDescription:
      "Calculez le rendement locatif brut et net de votre investissement immobilier. Estimez la rentabilité locative et le cash-flow.",
  },
  "rendement-locatif-brut": {
    title: "Calculateur de rendement locatif brut",
    metaTitle: "Rendement locatif brut — Avant charges",
    metaDescription:
      "Estimez le rendement locatif brut avant charges : loyers annuels rapportés au coût d'acquisition. Idéal pour comparer des biens.",
  },
  "rendement-locatif-net": {
    title: "Calculateur de rendement locatif net",
    metaTitle: "Rendement locatif net — Après charges",
    metaDescription:
      "Calculez le rendement locatif net après charges courantes et vacance locative. Affinez la rentabilité réelle de votre investissement.",
  },
  "rentabilite-lmnp": {
    title: "Simulateur de rentabilité LMNP",
    metaTitle: "Simulateur rentabilité LMNP meublé",
    metaDescription:
      "Estimez la rentabilité d'une location meublée (LMNP) : loyers, charges, fiscalité simplifiée. Simulateur gratuit pour investisseurs.",
  },
  "cash-flow-immobilier": {
    title: "Simulateur de cash-flow immobilier",
    metaTitle: "Simulateur cash-flow immobilier locatif",
    metaDescription:
      "Calculez le cash-flow mensuel de votre investissement locatif après loyer, crédit et charges. Évaluez l'autofinancement.",
  },
  "frais-de-notaire": {
    title: "Calculateur de frais de notaire",
    metaTitle: "Calculateur frais de notaire immobilier",
    metaDescription:
      "Estimez les frais de notaire lors d'un achat immobilier neuf ou ancien. Calcul gratuit des droits de mutation et émoluments.",
  },
  "plus-value-immobiliere": {
    title: "Simulateur de plus-value immobilière",
    metaTitle: "Simulateur plus-value immobilière",
    metaDescription:
      "Estimez la plus-value immobilière et l'impôt associé lors d'une revente. Abattements pour durée de détention inclus.",
  },
  "tableau-amortissement": {
    title: "Simulateur de tableau d'amortissement",
    metaTitle: "Tableau d'amortissement crédit immobilier",
    metaDescription:
      "Générez le tableau d'amortissement de votre prêt immobilier : capital, intérêts et capital restant dû mois par mois.",
  },
  "taux-endettement": {
    title: "Simulateur de taux d'endettement",
    metaTitle: "Simulateur taux d'endettement — Plafond 35 %",
    metaDescription:
      "Calculez votre taux d'endettement et vérifiez le respect du plafond de 35 %. Préparez votre dossier de crédit immobilier.",
  },
  "impot-sur-le-revenu": {
    title: "Simulateur d'impôt sur le revenu",
    metaTitle: "Simulateur impôt sur le revenu 2026",
    metaDescription:
      "Estimez votre impôt sur le revenu selon le barème progressif 2026, vos revenus et votre quotient familial. Calcul indicatif gratuit.",
  },
  "micro-entrepreneur-charges": {
    title: "Simulateur charges micro-entrepreneur",
    metaTitle: "Simulateur charges micro-entrepreneur URSSAF",
    metaDescription:
      "Calculez les cotisations sociales du régime micro-entrepreneur selon votre activité et votre chiffre d'affaires. Estimation gratuite.",
  },
  "calculateur-tva": {
    title: "Calculateur de TVA",
    metaTitle: "Calculateur TVA HT, TTC — 20 %, 10 %, 5,5 %",
    metaDescription:
      "Calculez la TVA à partir d'un montant HT ou TTC. Outil gratuit pour les taux 20 %, 10 % et 5,5 %.",
  },
  "budget-reste-a-vivre": {
    title: "Simulateur de reste à vivre",
    metaTitle: "Simulateur reste à vivre mensuel",
    metaDescription:
      "Calculez votre reste à vivre après charges fixes et crédits. Préparez un projet immobilier ou ajustez votre budget.",
  },
  "taux-marginal-imposition": {
    title: "Simulateur de taux marginal d'imposition",
    metaTitle: "Taux marginal d'imposition (TMI) 2026",
    metaDescription:
      "Identifiez votre tranche marginale d'imposition (TMI) selon vos revenus et votre quotient familial. Barème 2026 indicatif.",
  },
  "quotient-familial": {
    title: "Simulateur de quotient familial",
    metaTitle: "Simulateur quotient familial — Parts IR",
    metaDescription:
      "Calculez votre quotient familial et le nombre de parts fiscales pour estimer votre impôt sur le revenu.",
  },
  "prelevement-a-la-source": {
    title: "Simulateur de prélèvement à la source",
    metaTitle: "Simulateur prélèvement à la source",
    metaDescription:
      "Estimez le montant prélevé à la source sur votre salaire ou vos revenus. Calcul gratuit du taux et des retenues mensuelles.",
  },
  "frais-kilometriques": {
    title: "Calculateur de frais kilométriques",
    metaTitle: "Calculateur frais kilométriques 2026",
    metaDescription:
      "Estimez vos frais kilométriques déductibles selon le barème fiscal officiel. Calcul gratuit pour déclaration d'impôts.",
  },
  "maprimerenov": {
    title: "Simulateur MaPrimeRénov'",
    metaTitle: "Simulateur MaPrimeRénov' rénovation",
    metaDescription:
      "Estimez le montant de MaPrimeRénov' pour vos travaux de rénovation énergétique selon vos revenus et le type de gestes.",
  },
  "quantite-peinture": {
    title: "Calculateur de quantité de peinture",
    metaTitle: "Calculateur quantité de peinture m²",
    metaDescription:
      "Estimez la quantité de peinture nécessaire pour vos murs et plafonds. Calcul gratuit en litres selon la surface et les couches.",
  },
  "simulateur-retraite": {
    title: "Simulateur de retraite",
    metaTitle: "Simulateur retraite — Estimation pension",
    metaDescription:
      "Estimez le montant de votre future pension de retraite selon vos cotisations et votre âge de départ. Projection indicative gratuite.",
  },
  "loa-vs-credit-auto": {
    title: "Simulateur LOA vs crédit auto",
    metaTitle: "Simulateur LOA vs crédit auto",
    metaDescription:
      "Comparez le coût total d'une LOA et d'un crédit auto pour le même véhicule. Simulation gratuite pour choisir le meilleur financement.",
  },
  "salaire-brut-net": {
    title: "Simulateur salaire brut net",
    metaTitle: "Simulateur salaire brut net",
    metaDescription:
      "Calculez votre salaire net à partir du brut mensuel : cotisations sociales et CSG. Estimateur gratuit pour salariés et négociations.",
  },
  "calculateur-tjm-freelance": {
    title: "Calculateur TJM freelance",
    metaTitle: "Calculateur TJM freelance — Taux journalier",
    metaDescription:
      "Calculez votre TJM pour atteindre votre revenu net cible : jours facturables, charges et frais. Outil gratuit pour indépendants.",
  },
  "calculateur-imc": {
    title: "Calculateur d'IMC",
    metaTitle: "Calculateur IMC — Indice masse corporelle",
    metaDescription:
      "Calculez votre IMC (indice de masse corporelle) à partir de votre taille et poids. Interprétation instantanée et repères santé.",
  },
};

function inferToolKind(sim: SimulatorDefinition): ToolKind {
  if (CALCULATEUR_DOMAINS.has(getSimulatorDomain(sim))) return "calculateur";
  if (CALCULATEUR_CATEGORIES.has(sim.category)) return "calculateur";
  if (getSimulatorDomain(sim) === "entreprise") return "calculateur";
  if (SIMULATEUR_DOMAINS.has(getSimulatorDomain(sim))) return "simulateur";
  return "simulateur";
}

/** Slugs où « Calculateur » reste plus naturel que « Simulateur » (H1 uniquement). */
const H1_CALCULATEUR_SLUGS = new Set<string>([
  "calculateur-imc",
  "calculateur-tva",
  "calculateur-pourcentage",
  "calculateur-age",
  "calculateur-pourboire",
  "calculateur-ovulation",
  "calculateur-tjm-freelance",
  "regle-de-trois",
  "partage-facture",
  "convertisseur-devises",
  "convertisseur-heures-minutes",
  "vitesse-distance-temps",
  "evolution-pourcentage",
  "quantite-peinture",
  "calcul-carrelage",
  "volume-beton",
  "surface-parquet",
  "volume-surface-piece",
  "quantite-mortier",
  "frais-de-notaire",
  "date-accouchement",
]);

function inferH1Kind(sim: SimulatorDefinition): ToolKind {
  if (H1_CALCULATEUR_SLUGS.has(sim.slug)) return "calculateur";
  const overrideTitle = SEO_OVERRIDES[sim.slug]?.title;
  if (overrideTitle && /^calculateur/i.test(overrideTitle)) return "calculateur";
  return "simulateur";
}

function frenchDe(phrase: string): string {
  const trimmed = phrase.trim();
  const first = trimmed.charAt(0).toLowerCase();
  if ("aeiouéèêàâh".includes(first)) {
    return `d'${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
  }
  return `de ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function trimAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > max * 0.55) {
    return slice.slice(0, lastSpace).replace(/[,;:\-—\s]+$/u, "");
  }
  return slice.replace(/[,;:\-—\s]+$/u, "");
}

function metaTitleMaxLength(): number {
  return META_TITLE_EFFECTIVE_MAX - TITLE_BRAND_SUFFIX.length;
}

/** Title affiché dans `<title>` (avant ajout du suffixe de marque du layout). */
export function clampMetaTitle(title: string): string {
  const t = title
    .replace(/\s+/g, " ")
    .replace(/ — Calcul gratuit en ligne$/iu, "")
    .replace(/ — Calcul gratuit$/iu, "")
    .replace(/ — Gratuit en ligne$/iu, "")
    .replace(/ — Gratuit$/iu, "")
    .trim();

  const max = metaTitleMaxLength();
  if (t.length <= max) return t;

  const dashIdx = t.indexOf(" — ");
  if (dashIdx > 0) {
    const main = t.slice(0, dashIdx);
    const subtitle = t.slice(dashIdx + 3);
    const roomForSubtitle = max - main.length - 3;
    if (roomForSubtitle >= 8) {
      const candidate = `${main} — ${trimAtWord(subtitle, roomForSubtitle)}`;
      if (candidate.length <= max) return candidate;
    }
    const mainOnly = trimAtWord(main, max);
    if (mainOnly.length <= max) return mainOnly;
  }

  return trimAtWord(t, max);
}

/** Meta description affichée dans `<meta name="description">`. */
export function clampMetaDescription(description: string): string {
  let d = description.replace(/\s+/g, " ").trim();
  if (d.length <= META_DESCRIPTION_MAX) return d;

  // Retire les préfixes redondants ajoutés par d'anciens templates auto.
  d = d.replace(
    /^(Simulateur|Calculateur)\s+(de\s+|d')(.+?)\s*:\s*/iu,
    (_, __prefix, rest: string) =>
      `${rest.charAt(0).toUpperCase()}${rest.slice(1)} : `
  );

  if (d.length <= META_DESCRIPTION_MAX) return d;

  d = d.replace(
    /\s+(Simulez|Calculez)\s+en\s+ligne\s+gratuitement\s*—\s*estimation\s+instantanée[^.]*\.?/giu,
    "."
  );

  if (d.length <= META_DESCRIPTION_MAX) return d.replace(/\.\.+$/u, ".");

  const slice = d.slice(0, META_DESCRIPTION_MAX);
  const lastSpace = slice.lastIndexOf(" ");
  const trimmed = (lastSpace > 90 ? slice.slice(0, lastSpace) : slice).replace(
    /[,;:\s]+$/u,
    ""
  );
  return `${trimmed}.`;
}

export function effectiveMetaTitle(title: string): string {
  return `${title}${TITLE_BRAND_SUFFIX}`;
}

export function buildSeoTitle(sim: SimulatorDefinition): string {
  const override = SEO_OVERRIDES[sim.slug]?.title;
  if (override) return override;

  const raw = sim.title.trim();
  if (/^(simulateur|calculateur)\s/i.test(raw)) {
    return capitalizeFirst(raw);
  }

  const kind = inferToolKind(sim);
  const label = kind === "calculateur" ? "Calculateur" : "Simulateur";
  return `${label} ${frenchDe(raw)}`;
}

/** Titre H1 affiché sur la page — privilégie « Simulateur » sauf cas pertinents. */
export function buildH1Title(sim: SimulatorDefinition): string {
  const override = SEO_OVERRIDES[sim.slug]?.title;
  if (override) {
    if (
      !H1_CALCULATEUR_SLUGS.has(sim.slug) &&
      /^Calculateur/i.test(override)
    ) {
      return override.replace(/^Calculateur/i, "Simulateur");
    }
    return override;
  }

  const raw = sim.title.trim();
  if (/^(simulateur|calculateur)\s/i.test(raw)) {
    const normalized = capitalizeFirst(raw);
    if (
      !H1_CALCULATEUR_SLUGS.has(sim.slug) &&
      /^Calculateur/i.test(normalized)
    ) {
      return normalized.replace(/^Calculateur/i, "Simulateur");
    }
    return normalized;
  }

  const kind = inferH1Kind(sim);
  const label = kind === "calculateur" ? "Calculateur" : "Simulateur";
  return `${label} ${frenchDe(raw)}`;
}

export function buildMetaTitle(sim: SimulatorDefinition, seoTitle: string): string {
  const override = SEO_OVERRIDES[sim.slug]?.metaTitle;
  if (override) return clampMetaTitle(override);

  const inline = sim.metaTitle.trim();
  if (inline.length >= 30) {
    return clampMetaTitle(inline);
  }

  return clampMetaTitle(seoTitle);
}

export function buildMetaDescription(sim: SimulatorDefinition): string {
  const override = SEO_OVERRIDES[sim.slug]?.metaDescription;
  if (override) return clampMetaDescription(override);

  const inline = sim.metaDescription?.trim();
  if (inline && inline.length >= 40) {
    return clampMetaDescription(inline);
  }

  const sd = sim.shortDescription.trim().replace(/\.$/u, "");
  const kind = inferToolKind(sim);
  const cta =
    kind === "calculateur"
      ? "Calculateur gratuit en ligne."
      : "Simulateur gratuit en ligne.";

  return clampMetaDescription(`${sd}. ${cta}`);
}

export function buildSeoKeywords(sim: SimulatorDefinition): string[] {
  const kind = inferToolKind(sim);
  const subject = sim.title.toLowerCase();
  const extras = [
    `${kind} ${subject}`,
    `calcul ${subject}`,
    `estimation ${subject}`,
    `comment calculer ${subject}`,
    `${kind} en ligne`,
    "outil de calcul gratuit",
    "estimation en ligne",
  ];

  return [...new Set([...(sim.keywords ?? []), ...extras])].slice(0, 14);
}

export function applySeoEnrichment(sim: SimulatorDefinition): SimulatorDefinition {
  const seoTitle = buildSeoTitle(sim);
  const metaTitle = buildMetaTitle(sim, seoTitle);
  const metaDescription = buildMetaDescription(sim);
  const keywords = buildSeoKeywords(sim);

  return {
    ...sim,
    title: buildH1Title(sim),
    metaTitle: clampMetaTitle(metaTitle),
    metaDescription: clampMetaDescription(metaDescription),
    keywords,
  };
}

const DOMAIN_APPLICATION_CATEGORY: Record<SiteDomain, string> = {
  immobilier: "FinanceApplication",
  finance: "FinanceApplication",
  emploi: "BusinessApplication",
  entreprise: "BusinessApplication",
  fiscalite: "FinanceApplication",
  travaux: "UtilitiesApplication",
  sante: "HealthApplication",
  quotidien: "UtilitiesApplication",
  "aides-sociales": "GovernmentApplication",
};

export function jsonLdSoftwareApplication(
  sim: Pick<
    SimulatorDefinition,
    "slug" | "title" | "shortDescription" | "metaDescription" | "category"
  >,
  domain: SiteDomain
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: sim.title,
    description: sim.metaDescription || sim.shortDescription,
    url: `${SITE.url}/simulateurs/${sim.slug}`,
    applicationCategory: DOMAIN_APPLICATION_CATEGORY[domain],
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}
