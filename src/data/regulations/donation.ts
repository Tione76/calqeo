import type { RegulationModule } from "./types";
import { CALQEO_DATA_LAST_VERIFIED } from "./constants";

export const DONATION_REGULATION: RegulationModule = {
  meta: {
    id: "donation",
    label: "Droits de donation et succession",
    lastUpdated: CALQEO_DATA_LAST_VERIFIED,
    effectiveFrom: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "impots.gouv.fr — Donations", url: "https://www.impots.gouv.fr/particulier/donation" },
      { name: "Notaires de France", url: "https://www.notaires.fr" },
    ],
  },
};

/** Abattement enfant (€) — renouvelable tous les 15 ans. */
export const DONATION_ABATTEMENT_ENFANT = 100_000;

/** Abattement petit-enfant (€). */
export const DONATION_ABATTEMENT_PETIT_ENFANT = 31_865;

/** Abattement autres liens (€). */
export const DONATION_ABATTEMENT_AUTRE = 1594;

/** Seuils barème simplifié (€). */
export const DONATION_SEUILS = {
  tranche1: 8072,
  tranche2: 12_109,
  tranche3: 15_932,
  tranche4: 552_324,
} as const;

/**
 * Droits de mutation — formule simplifiée du simulateur publié (taux unique sur la base).
 * Ne remplace pas le barème progressif officiel.
 */
export function calculerDroitsMutation(baseTaxable: number): number {
  if (baseTaxable <= 0) return 0;
  if (baseTaxable <= DONATION_SEUILS.tranche1) return baseTaxable * 0.05;
  if (baseTaxable <= DONATION_SEUILS.tranche2) return baseTaxable * 0.1;
  if (baseTaxable <= DONATION_SEUILS.tranche3) return baseTaxable * 0.15;
  if (baseTaxable <= DONATION_SEUILS.tranche4) return baseTaxable * 0.2;
  return baseTaxable * 0.3;
}
