/**
 * Rétrocompatibilité — les constantes vivent dans @/data/regulations/.
 */
export * from "@/data/regulations/fiscalite";
export * from "@/data/regulations/impot";
export {
  DONATION_ABATTEMENT_ENFANT,
  DONATION_ABATTEMENT_PETIT_ENFANT,
  calculerDroitsMutation,
} from "@/data/regulations/donation";

/** @deprecated Utiliser DONATION_ABATTEMENT_ENFANT — alias rétrocompatibilité */
export const DONATION_ABATTEMENTS: Record<string, number> = {
  enfant: 100_000,
  petitenfant: 31_865,
  autre: 1594,
};

/** Taux droits donation simplifié (simulateur pédagogique) */
export const DONATION_TAUX_SIMPLIFIE = 0.2;
