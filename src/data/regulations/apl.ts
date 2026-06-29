import type { RegulationModule } from "./types";

export const APL_REGULATION: RegulationModule = {
  meta: {
    id: "apl",
    label: "Aide personnalisée au logement (APL)",
    lastUpdated: "2025-04-01",
    effectiveFrom: "2025-04-01",
    referencePeriod: "2025",
    sources: [
      { name: "CAF.fr — APL", url: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/logement/les-aides-personnalisees-au-logement-apl-als-alf" },
      { name: "Service-Public.fr — APL", url: "https://www.service-public.fr/particuliers/vosdroits/F12006" },
      { name: "anil.org", url: "https://www.anil.org" },
    ],
  },
};

/** Plafonds de loyer mensuel par zone (€) — barème simplifié 2025. */
export const APL_PLAFONDS_LOYER: Record<string, number> = {
  "1": 277.26,
  "2": 277.26,
  "3": 243.34,
  "4": 218.94,
  "5": 196.46,
};

/** Plafonds de ressources annuelles par zone (€) — personne seule. */
export const APL_PLAFONDS_RESSOURCES: Record<string, number> = {
  "1": 5000,
  "2": 5000,
  "3": 4500,
  "4": 4000,
  "5": 3500,
};

/** Participation minimale du locataire (€/mois). */
export const APL_PARTICIPATION_MIN = 39.35;

/** Taux de prise en charge maximal. */
export const APL_TAUX_MAX = 0.65;

/** Coefficient familial de base. */
export const APL_COEFF_FAMILIAL_BASE = 1;

/** Majoration par personne à charge. */
export const APL_MAJORATION_CHARGE = 0.3;

/**
 * Estimation simplifiée APL mensuelle.
 * Ne remplace pas le simulateur CAF officiel.
 */
export function estimerAplMensuelle(params: {
  loyer: number;
  revenusMensuels: number;
  zone: string;
  personnesCharge?: number;
}): number {
  const { loyer, revenusMensuels, zone, personnesCharge = 0 } = params;
  const plafondLoyer = APL_PLAFONDS_LOYER[zone] ?? APL_PLAFONDS_LOYER["3"];
  const loyerRetenu = Math.min(loyer, plafondLoyer);
  const coeff = APL_COEFF_FAMILIAL_BASE + personnesCharge * APL_MAJORATION_CHARGE;
  const resteVivre = Math.max(0, revenusMensuels - 500 * coeff);
  const chargeTheorique = loyerRetenu - resteVivre * 0.05;
  const apl = Math.min(
    loyerRetenu * APL_TAUX_MAX,
    Math.max(0, loyerRetenu - chargeTheorique - APL_PARTICIPATION_MIN),
  );
  return Math.round(apl * 100) / 100;
}
