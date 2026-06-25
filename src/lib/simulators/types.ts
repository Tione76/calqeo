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

export interface SimulatorResult {
  summary: string;
  lines: ResultLine[];
  table?: ResultTable;
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
  | "quotidien";

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
