import type { RegulationModule } from "./types";

export const CAF_REGULATION: RegulationModule = {
  meta: {
    id: "caf",
    label: "CAF — prestations familiales et sociales",
    lastUpdated: "2025-04-01",
    effectiveFrom: "2025-04-01",
    referencePeriod: "2025",
    sources: [
      { name: "CAF.fr", url: "https://www.caf.fr" },
      { name: "Service-Public.fr — Allocations familiales", url: "https://www.service-public.fr/particuliers/vosdroits/F13132" },
      { name: "Code de la sécurité sociale", url: "https://www.legifrance.gouv.fr" },
    ],
    openData: {
      available: false,
      notes: "Montants révisés annuellement — pas d'API publique unifiée.",
    },
  },
};

/** Allocation de base par enfant (€/mois) — barème 2025 simplifié. */
export const ALLOCATIONS_FAMILIALES = {
  montant2Enfants: 136.99,
  montantParEnfantSupplementaire: 69.39,
} as const;

/** Plafond ressources annuelles couple 2 enfants (€) — indicatif. */
export const ALLOC_FAM_PLAFOND_COUPLE_2_ENFANTS = 72_000;

/** Complément familial — montant mensuel max (€). */
export const COMPLEMENT_FAMILIAL_MAX = 185.25;

/** Allocation de rentrée scolaire 2025 (€). */
export const ARS_MONTANTS = {
  primaire: 398.09,
  college: 418.6,
  lycee: 434.61,
} as const;

/** Prime de naissance (€). */
export const PRIME_NAISSANCE = 985.63;

/** Prime à l'adoption (€). */
export const PRIME_ADOPTION = 985.63;

/** AAH — montant mensuel plein (€). */
export const AAH_MONTANT_PLEIN = 971.37;

/** AAH — plafond ressources mensuel personne seule (€). */
export const AAH_PLAFOND_RESSOURCES_ISOLE = 1100;

/** AAH — taux de réduction sur revenus au-delà du plafond. */
export const AAH_TAUX_REDUCTION_RESSOURCES = 0.5;

/**
 * Estime l'AAH mensuelle (€) — formule simplifiée.
 */
export function estimerAah(revenusMensuels: number): number {
  if (revenusMensuels <= AAH_PLAFOND_RESSOURCES_ISOLE) return AAH_MONTANT_PLEIN;
  const reduction =
    (revenusMensuels - AAH_PLAFOND_RESSOURCES_ISOLE) * AAH_TAUX_REDUCTION_RESSOURCES;
  return Math.max(0, Math.round((AAH_MONTANT_PLEIN - reduction) * 100) / 100);
}

/** Chèque énergie — montants possibles (€). */
export const CHEQUE_ENERGIE_MONTANTS = [48, 98, 194, 277] as const;

/** Chèque énergie — plafond revenu fiscal personne seule (€). */
export const CHEQUE_ENERGIE_PLAFOND_ISOLE = 11_000;

/** Chèque énergie — seuils revenu fiscal (€) pour barème simplifié. */
export const CHEQUE_ENERGIE_SEUILS = {
  palier4: 5_600,
  palier3: 6_800,
  palier2: 9_200,
} as const;

/** PAJE — montant forfaitaire de base par enfant (€/mois). @source CAF 2025 */
export const PAJE_MONTANT_BASE_ENFANT = 197.49;

/** PAJE — plafond ressources mensuelles foyer (€) pour calcul simplifié. */
export const PAJE_PLAFOND_RESSOURCES = 1_200;

/** PAJE — part minimale versée quelle que soit la situation (fraction). */
export const PAJE_PART_MIN = 0.4;

/** Bourse CROUS — montants annuels indicatifs par tranche (€). */
export const BOURSE_CROUS_TRANCHES = [
  { maxRevenuParPart: 3_000, montant: 5_000 },
  { maxRevenuParPart: 5_000, montant: 3_000 },
  { maxRevenuParPart: 8_000, montant: 1_500 },
  { maxRevenuParPart: 12_000, montant: 500 },
] as const;

/**
 * Estime le montant du chèque énergie (€) selon le revenu fiscal.
 * Barème pédagogique simplifié — attribution réelle par dossier.
 */
export function estimerChequeEnergie(revenuFiscal: number): number {
  if (revenuFiscal > CHEQUE_ENERGIE_PLAFOND_ISOLE) return 0;
  if (revenuFiscal <= CHEQUE_ENERGIE_SEUILS.palier4) return CHEQUE_ENERGIE_MONTANTS[3];
  if (revenuFiscal <= CHEQUE_ENERGIE_SEUILS.palier3) return CHEQUE_ENERGIE_MONTANTS[2];
  if (revenuFiscal <= CHEQUE_ENERGIE_SEUILS.palier2) return CHEQUE_ENERGIE_MONTANTS[1];
  return CHEQUE_ENERGIE_MONTANTS[0];
}

/**
 * Estime la PAJE mensuelle (€) — formule simplifiée.
 */
export function estimerPaje(nbEnfants: number, revenusMensuels: number): number {
  const taux = Math.max(0, 1 - revenusMensuels / PAJE_PLAFOND_RESSOURCES);
  const coeff = PAJE_PART_MIN + (1 - PAJE_PART_MIN) * taux;
  return Math.round(PAJE_MONTANT_BASE_ENFANT * nbEnfants * coeff * 100) / 100;
}

/**
 * Estime une bourse CROUS annuelle (€) selon le revenu fiscal par part.
 */
export function estimerBourseCrous(revenuFiscalParPart: number): number {
  for (const tranche of BOURSE_CROUS_TRANCHES) {
    if (revenuFiscalParPart <= tranche.maxRevenuParPart) return tranche.montant;
  }
  return 0;
}
