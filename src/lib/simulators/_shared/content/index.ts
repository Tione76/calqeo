import type { SimulatorDefinition } from "../../types";
import type { ContentRegistry } from "./types";
import { RICH_CONTENT_SLUGS } from "./types";
import { immobilierContent } from "./immobilier";
import { financeContent } from "./finance";
import { fiscaliteContent } from "./fiscalite";
import { travauxContent } from "./travaux";
import { santeContent } from "./sante";
import { quotidienContent } from "./quotidien";
import { emploiContent } from "./emploi";
import { entrepriseContent } from "./entreprise";

const contentRegistry: ContentRegistry = {
  ...immobilierContent,
  ...financeContent,
  ...fiscaliteContent,
  ...travauxContent,
  ...santeContent,
  ...quotidienContent,
  ...emploiContent,
  ...entrepriseContent,
};

export function applyContentEnrichment(
  sim: SimulatorDefinition
): SimulatorDefinition {
  if (RICH_CONTENT_SLUGS.has(sim.slug)) {
    return sim;
  }

  const enriched = contentRegistry[sim.slug];
  if (!enriched) {
    return sim;
  }

  return {
    ...sim,
    content: enriched.content,
    faq: enriched.faq,
  };
}

export function getEnrichedSlugs(): string[] {
  return Object.keys(contentRegistry);
}
