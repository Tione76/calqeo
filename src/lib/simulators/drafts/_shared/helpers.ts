import type { SimulatorDefinition } from "../../types";
import { applyContentEnrichment } from "../../_shared/content";
import { applySeoEnrichment } from "../../_shared/seo";

/** Marque un simulateur comme brouillon et applique l'enrichissement éditorial. */
export function draftSimulator(sim: SimulatorDefinition): SimulatorDefinition {
  const enriched = applySeoEnrichment(
    applyContentEnrichment({ ...sim, publicationStatus: "draft" })
  );
  return { ...enriched, publicationStatus: "draft" };
}

export const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;
