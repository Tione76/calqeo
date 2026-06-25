/**
 * Fiscalité — impôts, TVA, prélèvements sociaux, barèmes
 *
 * Sources : impots.gouv.fr, BOFiP, Légifrance
 * Révision typique : barème IR au printemps (revenus N-1) ; PFU stable ;
 *                    barème kilométrique au 1er janvier ; seuils TVA au 1er janvier.
 */

import type { MicroActivite } from "./urssaf";

// ─── Barème impôt sur le revenu ─────────────────────────────────────

/**
 * Tranche du barème progressif IR (revenu par part, €).
 * @source CGI, art. 197 — barème 2026 sur revenus 2025
 * @maj 1×/an (printemps, revenus de l'année précédente)
 */
export const IR_TRANCHES = [
  { max: 11_294, taux: 0 },
  { max: 28_797, taux: 0.11 },
  { max: 82_341, taux: 0.3 },
  { max: 177_106, taux: 0.41 },
  { max: Infinity, taux: 0.45 },
] as const;

/** Calcule l'impôt sur le revenu pour un revenu par part (barème progressif) */
export function calculerImpotBareme(revenuParPart: number): number {
  let impot = 0;
  let prev = 0;
  for (const { max, taux } of IR_TRANCHES) {
    const tranche = Math.min(revenuParPart, max) - prev;
    if (tranche > 0) impot += tranche * taux;
    prev = max;
    if (revenuParPart <= max) break;
  }
  return impot;
}

// ─── Quotient familial (parts) ─────────────────────────────────────

/** Part supplémentaire pour parent isolé */
export const QF_PART_PARENT_ISOLE = 0.25;

/** Parts par enfant : 0,5 (1er et 2e), 1 (3e et suivants) */
export function partsEnfants(nombreEnfants: number): number {
  let parts = 0;
  for (let i = 1; i <= nombreEnfants; i++) {
    parts += i >= 3 ? 1 : 0.5;
  }
  return parts;
}

// ─── PFU / Flat tax ────────────────────────────────────────────────

/**
 * Prélèvement forfaitaire unique — taux global (%).
 * @source CGI, art. 200 A — 12,8 % IR + 17,2 % PS = 30 %
 */
export const PFU_TAUX_GLOBAL = 0.3;

/** Part IR du PFU (12,8 %) */
export const PFU_TAUX_IR = 0.128;

/** Part prélèvements sociaux du PFU (17,2 %) */
export const PFU_TAUX_PS = 0.172;

/** Net après PFU (% du brut) */
export const PFU_NET_RATIO = 1 - PFU_TAUX_GLOBAL;

// ─── PEA (fiscalité plus-values) ───────────────────────────────────

/**
 * Prélèvements sociaux seuls après 5 ans de détention PEA (% du gain).
 * @source CGI, art. 163 quater D
 */
export const PEA_PS_APRES_5_ANS = 0.172;

/** Durée minimale de détention pour fiscalité PEA avantageuse (années) */
export const PEA_DUREE_FISCALITE_MIN = 5;

// ─── TVA ───────────────────────────────────────────────────────────

/**
 * Seuils de franchise en base de TVA (€ CA annuel HT).
 * @source CGI, art. 293 B — seuils 2025
 * @maj 1×/an (janvier)
 */
export const FRANCHISE_TVA = {
  /** Prestations de services et activités libérales */
  prestations: 37_500,
  /** Vente de marchandises, restauration, hébergement */
  ventes: 85_000,
  /** Coefficient seuil majoré (tolérance dépassement) */
  coefficientSeuilMajore: 1.25,
} as const;

/**
 * Taux de TVA en vigueur (%).
 * @source CGI, art. 278 à 281 bis
 */
export const TVA_TAUX = {
  normal: 20,
  intermediaire: 10,
  reduit: 5.5,
  superReduit: 2.1,
} as const;

// ─── Micro-entreprise — impôt libératoire ──────────────────────────

/**
 * Taux impôt libératoire micro-entreprise (% du CA).
 * @source CGI, art. 200 quater — option IR libératoire
 * @maj 1×/an
 */
export const IMPOT_LIBERATOIRE_TAUX: Record<MicroActivite, number> = {
  vente: 0.01,
  bic: 0.017,
  bnc: 0.022,
};

export function getImpotLiberatoireTaux(activite: string): number {
  return IMPOT_LIBERATOIRE_TAUX[activite as MicroActivite] ?? IMPOT_LIBERATOIRE_TAUX.bic;
}

// ─── Crédit d'impôt emploi à domicile ──────────────────────────────

/**
 * Plafond de dépenses éligibles au crédit d'impôt emploi à domicile (€/an).
 * @source CGI, art. 199 sexdecies — 12 000 € (majorations possibles)
 * @maj Occasionnel (loi de finances)
 */
export const CREDIT_IMPOT_EMPLOI_DOMICILE = {
  plafondDepenses: 12_000,
  tauxCredit: 0.5,
} as const;

// ─── Donations (barème simplifié) ──────────────────────────────────

/**
 * Abattements donation en ligne directe (€).
 * @source CGI, art. 777 — abattements 2024
 * @maj Occasionnel
 */
export const DONATION_ABATTEMENTS: Record<string, number> = {
  enfant: 100_000,
  petitenfant: 31_865,
  autre: 1_594,
};

/** Taux droits donation simplifié (simulateur pédagogique) */
export const DONATION_TAUX_SIMPLIFIE = 0.2;

// ─── Barème kilométrique ───────────────────────────────────────────

/**
 * Coefficients barème kilométrique automobile (€/km) par puissance fiscale (CV).
 * @source BOFiP BOI-BIC-CHG-00040 — barème 2024
 * @maj 1×/an (janvier)
 */
export const BAREME_KILOMETRIQUE: Record<number, number> = {
  3: 0.41,
  4: 0.493,
  5: 0.543,
  6: 0.568,
  7: 0.601,
};

/** Coefficient par défaut si puissance non trouvée (5 CV) */
export const BAREME_KILOMETRIQUE_DEFAUT_CV = 5;

/**
 * Bonus véhicule électrique sur le barème kilométrique (multiplicateur).
 * @source BOFiP — majoration 20 % pour VE
 */
export const BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE = 1.2;

/** Retourne le coefficient €/km pour une puissance fiscale */
export function getBaremeKilometriqueCoeff(cv: number): number {
  return BAREME_KILOMETRIQUE[cv] ?? BAREME_KILOMETRIQUE[BAREME_KILOMETRIQUE_DEFAUT_CV];
}

// ─── Location / plus-values (estimations) ──────────────────────────

/** Abattement micro-foncier (% des recettes) */
export const MICRO_FONCIER_ABATTEMENT = 0.7;

/** Abattement micro-BIC location meublée (% des recettes) */
export const MICRO_MEUBLE_ABATTEMENT = 0.5;

/** Taux global plus-value immobilière simplifié (IR + PS) */
export const PLUS_VALUE_IMMO_TAUX_SIMPLIFIE = 0.362;
