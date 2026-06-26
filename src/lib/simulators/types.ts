export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; title?: string; items: string[]; ordered?: boolean }
  | { type: "highlight"; title: string; text: string; variant?: "info" | "warning" }
  | {
      type: "steps";
      items: { label: string; value: string; detail?: string }[];
    }
  | {
      type: "links";
      title?: string;
      items: { href: string; label: string }[];
    };

export interface ContentSubsection {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

export interface EditorialSection {
  id: string;
  title: string;
  subtitle?: string;
  subsections?: ContentSubsection[];
  blocks?: ContentBlock[];
}

export interface SimulatorContent {
  sections: EditorialSection[];
}

export interface FAQItem {
  question: string;
  blocks: ContentBlock[];
}

export interface ResultLine {
  label: string;
  value: string;
  highlight?: boolean;
  description?: string;
}

export interface ResultTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

/** Niveau d'interprétation pédagogique du résultat. */
export type InterpretationLevel =
  | "favorable"
  | "intermediate"
  | "warning"
  | "neutral";

export interface ResultPrimary {
  label: string;
  value: string;
}

export interface ResultInterpretation {
  level: InterpretationLevel;
  badge?: string;
  title: string;
  message: string;
}

export interface ResultAdvice {
  title: string;
  items: string[];
}

export interface ResultComparison {
  scenario: string;
  value: string;
  detail?: string;
}

export interface ResultCallout {
  variant: "info" | "tip" | "warning" | "note";
  title: string;
  text: string;
}

export interface SimulatorResult {
  /** Résumé court — conservé pour compatibilité et accessibilité. */
  summary: string;
  lines: ResultLine[];
  table?: ResultTable;
  /** Résultat principal mis en avant (sinon dérivé automatiquement). */
  primary?: ResultPrimary;
  /** Phrase contextualisée avec les valeurs saisies. */
  narrative?: string;
  interpretation?: ResultInterpretation;
  advice?: ResultAdvice;
  comparisons?: ResultComparison[];
  callouts?: ResultCallout[];
}

export interface FormFieldOption {
  value: number | string;
  label: string;
}

export interface FormField {
  key: string;
  label: string;
  type: "number" | "select";
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
  options?: FormFieldOption[];
}

export interface SimulatorDefinition<TInput = Record<string, number | string>> {
  slug: string;
  title: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Grande catégorie du site (défaut : immobilier pour rétrocompatibilité). */
  domain?: SiteDomain;
  category: SimulatorCategory;
  icon: SimulatorIcon;
  content: SimulatorContent;
  faq: FAQItem[];
  formFields?: FormField[];
  defaultValues?: Record<string, number | string>;
  calculate: (input: TInput) => SimulatorResult;
  relatedSlugs?: string[];
  /** Identifiants des modules src/data/regulations/ utilisés (ex. "impot", "rsa"). */
  regulationIds?: string[];
  /** Brouillon : non indexé tant que non activé via drafts/activation.ts */
  publicationStatus?: "published" | "draft";
}

/** Verticales principales du site. */
export type SiteDomain =
  | "immobilier"
  | "finance"
  | "emploi"
  | "entreprise"
  | "fiscalite"
  | "travaux"
  | "sante"
  | "quotidien"
  | "aides-sociales";

export type SimulatorCategory =
  | "financement"
  | "investissement"
  | "fiscalite"
  | "gestion"
  | "credit"
  | "epargne"
  | "impots"
  | "materiaux"
  | "energie"
  | "sante"
  | "conversion"
  | "pratique"
  | "salaire"
  | "social"
  | "independant"
  | "entreprise-gestion";

export type SimulatorIcon =
  | "wallet"
  | "chart"
  | "home"
  | "calculator"
  | "percent"
  | "building"
  | "heart"
  | "tools"
  | "scale"
  | "briefcase"
  | "users";

export const DOMAIN_LABELS: Record<SiteDomain, string> = {
  immobilier: "Immobilier",
  finance: "Finance personnelle",
  emploi: "Emploi & salaire",
  entreprise: "Entreprises & indépendants",
  fiscalite: "Fiscalité",
  travaux: "Travaux & habitat",
  sante: "Santé",
  quotidien: "Calculs du quotidien",
  "aides-sociales": "Aides sociales",
};

export const DOMAIN_ORDER: SiteDomain[] = [
  "immobilier",
  "finance",
  "emploi",
  "entreprise",
  "fiscalite",
  "travaux",
  "sante",
  "quotidien",
  "aides-sociales",
];

export const DOMAIN_ANCHORS: Record<SiteDomain, string> = {
  immobilier: "immobilier",
  finance: "finance",
  emploi: "emploi",
  entreprise: "entreprise",
  fiscalite: "fiscalite",
  travaux: "travaux",
  sante: "sante",
  quotidien: "quotidien",
  "aides-sociales": "aides-sociales",
};

export const CATEGORY_LABELS: Record<SimulatorCategory, string> = {
  financement: "Financement",
  investissement: "Investissement",
  fiscalite: "Fiscalité immobilière",
  gestion: "Gestion locative",
  credit: "Crédit & emprunt",
  epargne: "Épargne & budget",
  impots: "Impôts & charges",
  materiaux: "Matériaux & surfaces",
  energie: "Énergie & rénovation",
  sante: "Santé & bien-être",
  conversion: "Conversions",
  pratique: "Calculs pratiques",
  salaire: "Salaire & paie",
  social: "Protection sociale",
  independant: "Freelance & indépendants",
  "entreprise-gestion": "Gestion d'entreprise",
};

export function getSimulatorDomain(
  sim: Pick<SimulatorDefinition, "domain">
): SiteDomain {
  return sim.domain ?? "immobilier";
}
