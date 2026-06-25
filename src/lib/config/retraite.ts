/**
 * Épargne retraite & produits d'épargne réglementés
 *
 * Sources : service-public.fr, AMF, Code monétaire et financier
 * Révision typique : plafonds Livret A/LDDS (rare) ; taux Livret A (semestriel) ;
 *                    plafond PEA stable ; règle des 4 % = règle empirique.
 */

// ─── Règle des 4 % (retraite) ──────────────────────────────────────

/**
 * Taux de retrait annuel durable sur capital retraite (%).
 * @source Règle empirique « safe withdrawal rate » — 4 %/an
 * @maj Stable — réévaluer si changement de doctrine patrimoniale
 */
export const RETRAITE_TAUX_RETRAIT_DURABLE = 0.04;

// ─── Livret A ──────────────────────────────────────────────────────

/**
 * Plafond de dépôt Livret A (€).
 * @source Arrêté — 22 950 € depuis 2013
 * @maj Rare (révision gouvernementale)
 */
export const LIVRET_A_PLAFOND = 22_950;

/**
 * Plafond LDDS (€) — complément du Livret A.
 * @source 12 950 € — même taux que Livret A
 */
export const LDDS_PLAFOND = 12_950;

// ─── PEA ───────────────────────────────────────────────────────────

/**
 * Plafond de versements PEA classique (€).
 * @source CGI, art. 163 quater D — 150 000 €
 * @maj Rare
 */
export const PEA_PLAFOND_VERSEMENTS = 150_000;
