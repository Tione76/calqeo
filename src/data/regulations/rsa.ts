import type { RegulationModule } from "./types";

export const RSA_REGULATION: RegulationModule = {
  meta: {
    id: "rsa",
    label: "Revenu de solidarité active (RSA)",
    lastUpdated: "2025-04-01",
    effectiveFrom: "2025-04-01",
    referencePeriod: "2025",
    sources: [
      { name: "CAF.fr — RSA", url: "https://www.caf.fr/allocataires/aides-et-demarches/droits-et-prestations/le-revenu-de-solidarite-active-rsa" },
      { name: "Service-Public.fr — RSA", url: "https://www.service-public.fr/particuliers/vosdroits/F12484" },
      { name: "Code de l'action sociale et des familles", url: "https://www.legifrance.gouv.fr" },
    ],
  },
};

/** Montant forfaitaire RSA personne seule (€/mois). */
export const RSA_MONTANT_FORFAITAIRE_ISOLE = 607.75;

/** Majoration par personne à charge (€/mois). */
export const RSA_MAJORATION_PERSONNE_CHARGE = 291.87;

/** Majoration couple (€/mois). */
export const RSA_MAJORATION_COUPLE = 291.87;

/** Prime d'activité — montant minimum garanti (€/mois). */
export const PRIME_ACTIVITE_MONTANT_MIN = 16.38;

/** Prime d'activité — montant forfaitaire base (€/mois). */
export const PRIME_ACTIVITE_FORFAIT = 607.75;

/** Prime d'activité — taux de la bonification sur revenus d'activité. */
export const PRIME_ACTIVITE_TAUX_BONIFICATION = 0.62;

/** Prime d'activité — plafond ressources couple (€/mois). */
export const PRIME_ACTIVITE_PLAFOND_COUPLE = 3500;

/** Prime d'activité — plafond ressources personne seule (€/mois). */
export const PRIME_ACTIVITE_PLAFOND_ISOLE = 1800;

/**
 * Estimation simplifiée du RSA mensuel.
 * Formule pédagogique : max(0, forfait - 0,62 × revenus).
 */
export function estimerRsaMensuel(
  revenusMensuels: number,
  personnesCharge: number,
  enCouple = false,
): number {
  let forfait = RSA_MONTANT_FORFAITAIRE_ISOLE;
  if (enCouple) forfait += RSA_MAJORATION_COUPLE;
  forfait += personnesCharge * RSA_MAJORATION_PERSONNE_CHARGE;
  const droit = forfait - 0.62 * revenusMensuels;
  return Math.max(0, Math.round(droit * 100) / 100);
}

/**
 * Estimation simplifiée de la prime d'activité.
 */
export function estimerPrimeActivite(
  revenusMensuels: number,
  enCouple = false,
): number {
  const plafond = enCouple ? PRIME_ACTIVITE_PLAFOND_COUPLE : PRIME_ACTIVITE_PLAFOND_ISOLE;
  if (revenusMensuels <= 0 || revenusMensuels > plafond) return 0;
  const montant =
    PRIME_ACTIVITE_FORFAIT -
    PRIME_ACTIVITE_TAUX_BONIFICATION * revenusMensuels +
    PRIME_ACTIVITE_MONTANT_MIN;
  return Math.max(PRIME_ACTIVITE_MONTANT_MIN, Math.round(montant * 100) / 100);
}
