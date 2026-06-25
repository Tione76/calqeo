/**
 * Aides publiques, dispositifs d'exonération et règles immobilières (HCSF)
 *
 * Sources : anah.fr (MaPrimeRénov'), HCSF, notaires.fr
 * Révision typique : MaPrimeRénov' 1×/an ; HCSF stable ; frais notaire selon barème départemental.
 */

import type { MicroActivite } from "./urssaf";

// ─── ACRE ──────────────────────────────────────────────────────────

/**
 * Réduction ACRE 1re année (% des cotisations URSSAF).
 * @source Code de la sécurité sociale — exonération partielle créateurs
 * @maj Occasionnel
 */
export const ACRE_REDUCTION_ANNEE_1 = 50;

// ─── Portage / freelance (estimations pédagogiques) ────────────────

/**
 * Taux charges + impôts par défaut — simulateur TJM / facturation (% du CA).
 * @source Estimation micro BIC/BNC avec IR modéré
 */
export const FREELANCE_TAUX_CHARGES_DEFAUT = 35;

/** Taux charges TNS par défaut — simulateur coût horaire (% du CA) */
export const TNS_TAUX_CHARGES_DEFAUT = 45;

// ─── MaPrimeRénov' ─────────────────────────────────────────────────

/** Couleurs MaPrimeRénov' (profils revenus) */
export type MaPrimeRenovCouleur = "bleu" | "jaune" | "violet" | "rose";

/** Types de travaux MaPrimeRénov' modélisés */
export type MaPrimeRenovTravaux = "isolation" | "pac" | "chaudiere";

/**
 * Forfaits MaPrimeRénov' (€) par type de travaux et profil revenus.
 * @source anah.fr — barèmes 2024
 * @maj 1×/an (révision MaPrimeRénov')
 */
export const MAPRIMERENOV_FORFAITS: Record<
  MaPrimeRenovTravaux,
  Record<MaPrimeRenovCouleur, number>
> = {
  isolation: { bleu: 7500, jaune: 4000, violet: 2500, rose: 1000 },
  pac: { bleu: 5000, jaune: 4000, violet: 3000, rose: 0 },
  chaudiere: { bleu: 4000, jaune: 3000, violet: 2000, rose: 0 },
};

export function getMaPrimeRenovForfait(
  travaux: string,
  couleur: string
): number {
  const t = MAPRIMERENOV_FORFAITS[travaux as MaPrimeRenovTravaux];
  if (!t) return 0;
  return t[couleur as MaPrimeRenovCouleur] ?? 0;
}

// ─── Immobilier — crédit & acquisition ─────────────────────────────

/**
 * Plafond taux d'endettement HCSF (% des revenus nets).
 * @source Recommandation HCSF — 35 % depuis 2022
 * @maj Stable (surveillance HCSF)
 */
export const HCSF_TAUX_ENDETTEMENT_MAX = 35;

/**
 * Taux moyen frais de notaire — bien ancien (% du prix d'achat).
 * @source Estimation nationale moyenne ~7 à 8 %
 */
export const FRAIS_NOTAIRE_ANCIEN_POURCENT = 7.5;

/**
 * Taux moyen frais de notaire — bien neuf / VEFA (% du prix d'achat).
 * @source Estimation ~2 à 3 %
 */
export const FRAIS_NOTAIRE_NEUF_POURCENT = 2.5;

/**
 * Facteur prix + frais notaire → prix du bien seul (ancien ~8 %).
 * Utilisé : prixBien = budgetTotal / FACTEUR
 * @source 1 + 7,5 % ≈ 1,08 pour l'ancien
 */
export const FRAIS_NOTAIRE_FACTEUR_BUDGET = 1.08;

/** Retourne le taux notaire (%) selon type de bien */
export function getFraisNotaireTaux(typeBien: string): number {
  return typeBien === "neuf"
    ? FRAIS_NOTAIRE_NEUF_POURCENT
    : FRAIS_NOTAIRE_ANCIEN_POURCENT;
}

/** Libellés taux micro pour les selects (généré depuis urssaf) */
export function labelMicroActivite(activite: MicroActivite): string {
  const labels: Record<MicroActivite, string> = {
    vente: "Vente",
    bic: "Prestations BIC",
    bnc: "Prestations BNC",
  };
  return labels[activite];
}
