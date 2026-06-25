import type { SimulatorDefinition } from "../types";
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
    title: "Simulateur de rendement locatif brut",
    metaDescription:
      "Estimez le rendement locatif brut avant charges : loyers annuels rapportés au coût total d'acquisition. Calcul rapide pour comparer des biens.",
  },
  "rendement-locatif-net": {
    title: "Simulateur de rendement locatif net",
    metaDescription:
      "Calculez le rendement locatif net après charges et vacance locative. Outil gratuit pour affiner la rentabilité réelle de votre investissement.",
  },
  "rentabilite-lmnp": {
    title: "Simulateur de rentabilité LMNP",
    metaDescription:
      "Estimez la rentabilité d'une location meublée (LMNP) : loyers, charges, fiscalité simplifiée. Simulateur gratuit pour investisseurs.",
  },
  "taux-endettement": {
    title: "Simulateur de taux d'endettement",
    metaDescription:
      "Calculez votre taux d'endettement et vérifiez le respect du plafond de 35 %. Outil gratuit pour préparer votre dossier de crédit immobilier.",
  },
  "impot-sur-le-revenu": {
    title: "Simulateur d'impôt sur le revenu",
    metaDescription:
      "Estimez votre impôt sur le revenu selon le barème progressif, vos revenus et votre quotient familial. Calcul indicatif gratuit en ligne.",
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
    title: seoTitle,
    metaTitle,
    metaDescription,
    keywords,
  };
}

export function jsonLdSoftwareApplication(sim: Pick<
  SimulatorDefinition,
  "slug" | "title" | "shortDescription" | "metaDescription"
>) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: sim.title,
    description: sim.metaDescription || sim.shortDescription,
    url: `${SITE.url}/simulateurs/${sim.slug}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };
}
