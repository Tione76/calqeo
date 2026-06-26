import type { SimulatorDefinition, SiteDomain } from "../types";
import { getSimulatorDomain, DOMAIN_LABELS } from "../types";
import { SITE } from "@/lib/site/config";

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
    metaTitle:
      "Simulateur de capacité d'emprunt immobilier — Calcul gratuit en ligne",
    metaDescription:
      "Estimez votre capacité d'emprunt et votre budget d'achat immobilier selon vos revenus, apport et taux d'endettement. Simulateur gratuit pour calculer combien emprunter.",
  },
  "mensualite-pret-immobilier": {
    title: "Simulateur de mensualité de prêt immobilier",
    metaTitle:
      "Simulateur de mensualité de prêt immobilier — Calcul gratuit en ligne",
    metaDescription:
      "Calculez la mensualité de votre crédit immobilier : capital, taux, durée et assurance. Estimation instantanée du coût total des intérêts.",
  },
  "rendement-locatif": {
    title: "Simulateur de rendement locatif",
    metaTitle:
      "Simulateur de rendement locatif — Calcul brut et net gratuit",
    metaDescription:
      "Calculez le rendement locatif brut et net de votre investissement immobilier. Outil gratuit pour estimer la rentabilité locative et le cash-flow.",
  },
  "rendement-locatif-brut": {
    title: "Calculateur de rendement locatif brut",
    metaTitle:
      "Calculateur de rendement locatif brut — Avant charges et vacance",
    metaDescription:
      "Estimez le rendement locatif brut avant charges : loyers annuels rapportés au coût total d'acquisition. Idéal pour comparer rapidement plusieurs biens.",
  },
  "rendement-locatif-net": {
    title: "Calculateur de rendement locatif net",
    metaTitle:
      "Calculateur de rendement locatif net — Après charges et vacance",
    metaDescription:
      "Calculez le rendement locatif net après charges courantes et vacance locative. Affinez la rentabilité réelle de votre investissement locatif.",
  },
  "rentabilite-lmnp": {
    title: "Simulateur de rentabilité LMNP",
    metaTitle:
      "Simulateur de rentabilité LMNP — Location meublée non professionnelle",
    metaDescription:
      "Estimez la rentabilité d'une location meublée (LMNP) : loyers, charges, fiscalité simplifiée. Simulateur gratuit pour investisseurs en meublé.",
  },
  "cash-flow-immobilier": {
    title: "Simulateur de cash-flow immobilier",
    metaTitle: "Simulateur de cash-flow immobilier — Trésorerie locative",
    metaDescription:
      "Calculez le cash-flow mensuel de votre investissement locatif après loyer, crédit et charges. Outil gratuit pour évaluer l'autofinancement.",
  },
  "frais-de-notaire": {
    title: "Calculateur de frais de notaire",
    metaTitle: "Calculateur de frais de notaire — Estimation achat immobilier",
    metaDescription:
      "Estimez les frais de notaire lors d'un achat immobilier neuf ou ancien. Calcul gratuit des droits de mutation et émoluments.",
  },
  "plus-value-immobiliere": {
    title: "Simulateur de plus-value immobilière",
    metaTitle: "Simulateur de plus-value immobilière — Impôt et abattements",
    metaDescription:
      "Estimez la plus-value immobilière et l'impôt associé lors d'une revente. Abattements pour durée de détention inclus.",
  },
  "tableau-amortissement": {
    title: "Simulateur de tableau d'amortissement",
    metaTitle: "Tableau d'amortissement crédit immobilier — Calcul gratuit",
    metaDescription:
      "Générez le tableau d'amortissement de votre prêt immobilier : capital, intérêts et capital restant dû mois par mois.",
  },
  "taux-endettement": {
    title: "Simulateur de taux d'endettement",
    metaTitle: "Simulateur de taux d'endettement — Plafond 35 % gratuit",
    metaDescription:
      "Calculez votre taux d'endettement et vérifiez le respect du plafond de 35 %. Outil gratuit pour préparer votre dossier de crédit immobilier.",
  },
  "impot-sur-le-revenu": {
    title: "Simulateur d'impôt sur le revenu",
    metaTitle: "Simulateur impôt sur le revenu — Barème 2026 gratuit",
    metaDescription:
      "Estimez votre impôt sur le revenu selon le barème progressif 2026, vos revenus et votre quotient familial. Calcul indicatif gratuit en ligne.",
  },
  "micro-entrepreneur-charges": {
    title: "Simulateur charges micro-entrepreneur",
    metaTitle: "Simulateur charges micro-entrepreneur — Cotisations URSSAF",
    metaDescription:
      "Calculez les cotisations sociales du régime micro-entrepreneur selon votre activité et votre chiffre d'affaires. Estimation gratuite.",
  },
  "calculateur-tva": {
    title: "Calculateur de TVA",
    metaTitle: "Calculateur de TVA — HT, TTC et taux 20 %, 10 %, 5,5 %",
    metaDescription:
      "Calculez la TVA à partir d'un montant HT ou TTC. Outil gratuit pour les taux 20 %, 10 % et 5,5 %.",
  },
  "budget-reste-a-vivre": {
    title: "Simulateur de reste à vivre",
    metaTitle: "Simulateur reste à vivre — Budget mensuel gratuit",
    metaDescription:
      "Calculez votre reste à vivre après charges fixes et crédits. Outil gratuit pour préparer un projet immobilier ou ajuster votre budget.",
  },
  "taux-marginal-imposition": {
    title: "Simulateur de taux marginal d'imposition",
    metaTitle: "Taux marginal d'imposition (TMI) — Calcul gratuit 2026",
    metaDescription:
      "Identifiez votre tranche marginale d'imposition (TMI) selon vos revenus et votre quotient familial. Barème 2026 indicatif.",
  },
  "quotient-familial": {
    title: "Simulateur de quotient familial",
    metaTitle: "Simulateur quotient familial — Nombre de parts IR",
    metaDescription:
      "Calculez votre quotient familial et le nombre de parts fiscales pour estimer votre impôt sur le revenu.",
  },
  "prelevement-a-la-source": {
    title: "Simulateur de prélèvement à la source",
    metaTitle: "Simulateur prélèvement à la source — Taux personnalisé",
    metaDescription:
      "Estimez le montant prélevé à la source sur votre salaire ou vos revenus. Calcul gratuit du taux et des retenues mensuelles.",
  },
  "frais-kilometriques": {
    title: "Calculateur de frais kilométriques",
    metaTitle: "Calculateur frais kilométriques — Barème fiscal 2026",
    metaDescription:
      "Estimez vos frais kilométriques déductibles selon le barème fiscal officiel. Calcul gratuit pour déclaration d'impôts.",
  },
  "maprimerenov": {
    title: "Simulateur MaPrimeRénov'",
    metaTitle: "Simulateur MaPrimeRénov' — Aides rénovation énergétique",
    metaDescription:
      "Estimez le montant de MaPrimeRénov' pour vos travaux de rénovation énergétique selon vos revenus et le type de gestes.",
  },
  "quantite-peinture": {
    title: "Calculateur de quantité de peinture",
    metaTitle: "Calculateur quantité de peinture — Litres et surfaces",
    metaDescription:
      "Estimez la quantité de peinture nécessaire pour vos murs et plafonds. Calcul gratuit en litres selon la surface et le nombre de couches.",
  },
  "simulateur-retraite": {
    title: "Simulateur de retraite",
    metaTitle: "Simulateur retraite — Estimation pension gratuite",
    metaDescription:
      "Estimez le montant de votre future pension de retraite selon vos cotisations et votre âge de départ. Projection indicative gratuite.",
  },
  "loa-vs-credit-auto": {
    title: "Simulateur LOA vs crédit auto",
    metaTitle: "Simulateur LOA vs crédit auto — Comparaison gratuite",
    metaDescription:
      "Comparez le coût total d'une LOA et d'un crédit auto pour le même véhicule. Simulation gratuite pour choisir le meilleur financement.",
  },
  "salaire-brut-net": {
    title: "Simulateur salaire brut net",
    metaTitle: "Simulateur salaire brut net — Calcul gratuit en ligne",
    metaDescription:
      "Calculez votre salaire net à partir du brut mensuel : cotisations sociales et CSG. Estimateur gratuit pour salariés et négociations.",
  },
  "calculateur-tjm-freelance": {
    title: "Calculateur TJM freelance",
    metaTitle: "Calculateur TJM freelance — Taux journalier moyen gratuit",
    metaDescription:
      "Calculez votre TJM pour atteindre votre revenu net cible : jours facturables, charges et frais. Outil gratuit pour indépendants.",
  },
  "calculateur-imc": {
    title: "Calculateur d'IMC",
    metaTitle: "Calculateur d'IMC — Indice de masse corporelle gratuit",
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
  if (override) return override;

  if (/—/.test(sim.metaTitle) && sim.metaTitle.length >= 40) {
    return sim.metaTitle;
  }

  return `${seoTitle} — Calcul gratuit en ligne`;
}

export function buildMetaDescription(
  sim: SimulatorDefinition,
  seoTitle: string
): string {
  const override = SEO_OVERRIDES[sim.slug]?.metaDescription;
  if (override) return override;

  if (sim.metaDescription.length >= 120) {
    return sim.metaDescription;
  }

  const kind = inferToolKind(sim);
  const domain = DOMAIN_LABELS[getSimulatorDomain(sim)].toLowerCase();
  const verb = kind === "calculateur" ? "Calculez" : "Simulez";

  return `${seoTitle} : ${sim.shortDescription} ${verb} en ligne gratuitement — estimation instantanée pour vos projets ${domain}.`;
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
  const metaDescription = buildMetaDescription(sim, seoTitle);
  const keywords = buildSeoKeywords(sim);

  return {
    ...sim,
    title: buildH1Title(sim),
    metaTitle,
    metaDescription,
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
