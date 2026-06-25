/**
 * URSSAF & Code du travail — paramètres paie et cotisations sociales
 *
 * Sources : urssaf.fr, Légifrance, service-public.fr
 * Révision typique : SMIC au 1er janvier ; cotisations micro-entreprise au 1er janvier
 *                    ou à la date de publication de l'arrêté URSSAF.
 */

/** Type d'activité micro-entreprise pour les taux URSSAF */
export type MicroActivite = "vente" | "bic" | "bnc";

// ─── SMIC & durée légale ───────────────────────────────────────────

/**
 * SMIC horaire brut (€/h).
 * @source Arrêté relatif au salaire minimum — 1er janvier 2025
 * @maj 1×/an (janvier)
 */
export const SMIC_HORAIRE_BRUT = 11.65;

/**
 * Durée légale du travail (heures/semaine).
 * @source Code du travail, art. L3121-27
 */
export const HEURES_LEGALES_SEMAINE = 35;

/**
 * Jours ouvrables de congés payés acquis par mois (droit commun).
 * @source Code du travail, art. L3141-3
 */
export const JOURS_CONGES_PAR_MOIS = 2.5;

/** SMIC mensuel brut pour 35 h/semaine (calculé) */
export const SMIC_MENSUEL_BRUT_35H = SMIC_HORAIRE_BRUT * HEURES_LEGALES_SEMAINE;

/** SMIC journalier brut (calculé à partir du mensuel) */
export const SMIC_JOURNALIER = (SMIC_MENSUEL_BRUT_35H * 12) / 365;

/** @deprecated Utiliser SMIC_HORAIRE_BRUT — alias rétrocompatibilité */
export const SMIC_HORAIRE_2025 = SMIC_HORAIRE_BRUT;

// ─── Cotisations salariales (estimation) ───────────────────────────

/**
 * Taux moyen de cotisations salariales (% du brut) — défaut simulateurs paie.
 * @source Estimation non cadre — varie selon statut et rémunération
 */
export const COTISATIONS_SALARIALES_DEFAUT = 22;

/**
 * Taux moyen de charges patronales (% du brut) — défaut simulateurs embauche.
 * @source Estimation moyenne employeur
 */
export const COTISATIONS_PATRONALES_DEFAUT = 42;

/** Assiette CSG déductible (% du brut) */
export const CSG_ASSIETTE_BRUT = 0.9825;

/** Taux CSG + CRDS sur assiette (% de l'assiette CSG) */
export const CSG_CRDS_TAUX = 0.092;

/** Diviseur initial pour l'itération brut → net */
export const NET_TO_BRUT_DIVISEUR_INITIAL = 0.77;

/** Facteur de correction par itération brut → net */
export const NET_TO_BRUT_FACTEUR_CORRECTION = 1.15;

/** Nombre d'itérations pour la convergence brut → net */
export const NET_TO_BRUT_ITERATIONS = 8;

// ─── Micro-entreprise (cotisations URSSAF) ─────────────────────────

/**
 * Taux de cotisations sociales micro-entreprise (% du CA encaissé).
 * @source URSSAF auto-entrepreneur — arrêté annuel
 * @maj 1×/an (janvier)
 */
export const MICRO_ENTREPRENEUR_TAUX: Record<MicroActivite, number> = {
  /** Vente de marchandises, restauration, hébergement */
  vente: 12.3,
  /** Prestations de services commerciales ou artisanales (BIC) */
  bic: 21.2,
  /** Prestations de services libérales (BNC) */
  bnc: 24.6,
};

/**
 * Plafonds de chiffre d'affaires micro-entreprise (€/an).
 * @source Code général des impôts, art. 50-0
 * @maj 1×/an (janvier)
 */
export const MICRO_ENTREPRENEUR_PLAFONDS = {
  vente: 77_700,
  prestations: 188_700,
} as const;

/** Retourne le taux URSSAF micro pour une activité */
export function getMicroEntrepreneurTaux(activite: string): number {
  return MICRO_ENTREPRENEUR_TAUX[activite as MicroActivite] ?? MICRO_ENTREPRENEUR_TAUX.bic;
}

// ─── Heures supplémentaires ────────────────────────────────────────

/**
 * Nombre d'heures sup majorées à 25 % avant passage à 50 %.
 * @source Code du travail, art. L3121-22
 */
export const HEURES_SUP_SEUIL_25 = 8;

/** Majoration légale 1re tranche (multiplicateur : 1 + 0,25) */
export const HEURES_SUP_MAJORATION_25 = 1.25;

/** Majoration légale 2e tranche (multiplicateur : 1 + 0,50) */
export const HEURES_SUP_MAJORATION_50 = 1.5;

// ─── Licenciement ──────────────────────────────────────────────────

/**
 * Ancienneté minimale (années) pour indemnité légale de licenciement.
 * @source Code du travail, art. R1234-2
 */
export const LICENCIEMENT_ANCIENNETE_MIN = 0.67;

/**
 * Fraction du salaire mensuel par année d'ancienneté (≤ 10 ans).
 * @source 1/4 de mois par année
 */
export const LICENCIEMENT_TAUX_10_ANS = 1 / 4;

/**
 * Fraction du salaire mensuel par année d'ancienneté (> 10 ans).
 * @source 1/3 de mois par année au-delà de 10 ans
 */
export const LICENCIEMENT_TAUX_APRES_10_ANS = 1 / 3;

/** Seuil d'ancienneté (années) pour le changement de taux */
export const LICENCIEMENT_SEUIL_ANNEES = 10;

// ─── IJSS (arrêt maladie) ──────────────────────────────────────────

/**
 * Taux d'indemnisation IJSS (% du salaire journalier).
 * @source Code de la sécurité sociale, art. L323-1
 */
export const IJSS_TAUX_INDEMNISATION = 0.5;

/**
 * Plafond journalier IJSS exprimé en multiple du SMIC journalier.
 * @source Plafond ≈ 1,8 × SMIC journalier (simplifié)
 */
export const IJSS_PLAFOND_SMIC_MULTIPLE = 1.8;

// ─── ARE (allocation chômage) ──────────────────────────────────────

/**
 * Taux ARE (% du salaire journalier de référence).
 * @source Code du travail — estimation simplifiée 57 %
 */
export const ARE_TAUX_JOURNALIER = 0.57;

/**
 * Plafond ARE : multiple SMIC journalier × taux × durée max simplifiée.
 * @source Formule simplifiée du simulateur
 */
export const ARE_PLAFOND_SMIC_MULTIPLE = 0.57 * 4.5;

// ─── Portage salarial (estimation) ─────────────────────────────────

/**
 * Part nette estimée du CA en portage salarial après frais de gestion (%).
 * @source Estimation moyenne ~75 % du CA net de frais portage
 */
export const PORTAGE_NET_CA_RATIO = 0.75;
