/**
 * Paramètres réglementaires centralisés — Calqeo
 *
 * Mettez à jour les fichiers thématiques ci-dessous lors des révisions légales
 * (généralement 1 à 2 fois par an : SMIC au 1er janvier, barème IR au printemps, etc.).
 *
 * @see urssaf.ts   — SMIC, cotisations, micro-entreprise, IJSS, ARE, licenciement
 * @see fiscalite.ts — IR, PFU, TVA, crédits d'impôt, barème kilométrique
 * @see retraite.ts — Épargne retraite, Livret A, PEA, règle des 4 %
 * @see aides.ts    — MaPrimeRénov', ACRE, portage, immobilier (HCSF, notaire)
 */

export const CONFIG_REFERENCE = {
  /** Année de référence des paramètres (affichage / SEO) */
  annee: 2025,
  /** Date de dernière révision manuelle des constantes (ISO) */
  derniereMiseAJour: "2025-01-01",
  /** Prochaine révision attendue */
  prochaineRevision: "2026-01-01",
} as const;

export * from "./urssaf";
export * from "./fiscalite";
export * from "./retraite";
export * from "./aides";
