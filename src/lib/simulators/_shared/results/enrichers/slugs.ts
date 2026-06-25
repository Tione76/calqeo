/**
 * Registre central — fusion de tous les enrichisseurs par domaine.
 * Chaque simulateur (109) possède un enrichisseur dédié.
 */
import { SLUG_ENRICHERS as EMPLOI_ENRICHERS } from "./emploi";
import { SLUG_ENRICHERS as ENTREPRISE_ENRICHERS } from "./entreprise";
import { SLUG_ENRICHERS as FINANCE_ENRICHERS } from "./finance";
import { SLUG_ENRICHERS as FISCALITE_ENRICHERS } from "./fiscalite";
import { SLUG_ENRICHERS as IMMOBILIER_ENRICHERS } from "./immobilier";
import { SLUG_ENRICHERS as QUOTIDIEN_ENRICHERS } from "./quotidien";
import { SLUG_ENRICHERS as SANTE_ENRICHERS } from "./sante";
import { SLUG_ENRICHERS as TRAVAUX_ENRICHERS } from "./travaux";
import type { Enricher } from "./helpers";

/** Fiscalité générale uniquement — les 6 slugs immo-fiscal sont dans immobilier.ts */
const FISCALITE_GENERALE = Object.fromEntries(
  Object.entries(FISCALITE_ENRICHERS).filter(
    ([slug]) =>
      ![
        "impot-revenus-fonciers",
        "taxe-fonciere",
        "deficit-foncier",
        "donation-succession-immobiliere",
        "location-meublee-vs-nue",
        "ifi-impot-fortune-immobiliere",
      ].includes(slug)
  )
) as Record<string, Enricher>;

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  ...IMMOBILIER_ENRICHERS,
  ...FINANCE_ENRICHERS,
  ...EMPLOI_ENRICHERS,
  ...FISCALITE_GENERALE,
  ...ENTREPRISE_ENRICHERS,
  ...SANTE_ENRICHERS,
  ...TRAVAUX_ENRICHERS,
  ...QUOTIDIEN_ENRICHERS,
};
