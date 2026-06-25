import type { SimulatorResult } from "../../types";
import { applyBaseNormalization } from "./normalize";
import { applyHeuristicEnrichment } from "./enrichers/heuristics";
import { SLUG_ENRICHERS } from "./enrichers/slugs";

type EnricherInput = Record<string, number | string>;

function dedupeResult(result: SimulatorResult): SimulatorResult {
  let advice = result.advice;
  const narrative = result.narrative?.trim();
  const summary = result.summary.trim();

  if (advice && narrative) {
    advice = {
      ...advice,
      items: advice.items.filter(
        (item) =>
          !narrative.toLowerCase().includes(item.toLowerCase().slice(0, 24))
      ),
    };
    if (advice.items.length === 0) advice = undefined;
  }

  if (narrative && summary && narrative === summary) {
    return { ...result, advice, narrative: undefined };
  }

  return { ...result, advice };
}

/** Enrichit le résultat brut pour l'affichage premium (sans modifier calculate()). */
export function enrichSimulatorResult(
  slug: string,
  input: EnricherInput,
  raw: SimulatorResult
): SimulatorResult {
  let result = applyBaseNormalization(raw);

  const specific = SLUG_ENRICHERS[slug];
  if (specific) {
    result = applyBaseNormalization(specific(input, result));
  }

  result = applyHeuristicEnrichment(slug, input, result);
  return dedupeResult(result);
}

export { applyBaseNormalization, pickPrimaryLine, secondaryLines } from "./normalize";
