import type { FAQItem, SimulatorContent } from "../../types";

export interface EnrichedSimulatorContent {
  content: SimulatorContent;
  faq: FAQItem[];
}

export type ContentRegistry = Record<string, EnrichedSimulatorContent>;

/** Simulateurs déjà dotés d'un contenu éditorial complet. */
export const RICH_CONTENT_SLUGS = new Set([
  "capacite-emprunt",
  "mensualite-pret-immobilier",
  "rendement-locatif",
]);
