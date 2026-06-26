import { buildRichContent, buildFaq, p, hl } from "../content-builder";
import type { ContentRegistry } from "./types";

export interface SimulatorContentSpec {
  intro: string;
  definition: string;
  objectif: string;
  variables: string[];
  formule: string;
  formuleDetail?: string;
  interpretation: string[];
  limitesCalcul: string[];
  example: {
    title: string;
    donnees: string[];
    calcul: string[];
    resultat: string;
    interpretation: string;
  };
  maillage: { slug: string; label: string }[];
  conseils: string[];
  limites: string[];
  faq: { question: string; answer: string }[];
}

export function createEnrichedEntry(
  slug: string,
  spec: SimulatorContentSpec
): ContentRegistry[string] {
  return {
    content: buildRichContent(
      {
        intro: spec.intro,
        definition: spec.definition,
        objectif: spec.objectif,
        variables: spec.variables,
        formules: [
          p(spec.formule),
          ...(spec.formuleDetail ? [hl("Formule", spec.formuleDetail)] : []),
        ],
        interpretation: spec.interpretation.map((t) => p(t)),
        limitesCalcul: spec.limitesCalcul,
        example: spec.example,
        maillage: spec.maillage,
        conseils: spec.conseils,
        limites: spec.limites,
      },
      slug
    ),
    faq: buildFaq(spec.faq),
  };
}

export function createRegistry(
  entries: Record<string, SimulatorContentSpec>
): ContentRegistry {
  return Object.fromEntries(
    Object.entries(entries).map(([slug, spec]) => [
      slug,
      createEnrichedEntry(slug, spec),
    ])
  );
}
