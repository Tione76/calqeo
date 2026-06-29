import type { RegulationModule } from "./types";
import { CALQEO_DATA_LAST_VERIFIED } from "./constants";

export const EMPLOI_REGULATION: RegulationModule = {
  meta: {
    id: "emploi",
    label: "Droit du travail et avantages salariaux",
    lastUpdated: CALQEO_DATA_LAST_VERIFIED,
    effectiveFrom: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "Service-Public.fr — Travail", url: "https://www.service-public.fr/particuliers/vosdroits/N19871" },
      { name: "Légifrance — Code du travail", url: "https://www.legifrance.gouv.fr" },
      { name: "URSSAF", url: "https://www.urssaf.fr" },
    ],
  },
};

/** Prime de précarité CDD — taux légal (% du total des rémunérations). */
export const PRIME_PRECARITE_CDD = 0.1;

/** Ticket restaurant — plafond d'exonération URSSAF (€/ticket). */
export const TICKET_RESTAURANT_EXONERATION = 7.18;

/** Ticket restaurant — participation employeur minimale (%). */
export const TICKET_RESTAURANT_PART_EMPLOYEUR = 0.5;

/** Chèques vacances — participation employeur minimale (%). */
export const CHEQUES_VACANCES_PART_EMPLOYEUR_MIN = 0.5;

/** Mutuelle — participation employeur minimale (%). */
export const MUTUELLE_PART_EMPLOYEUR_MIN = 0.5;

/** Agirc-Arrco — taux total simplifié (% du brut). */
export const AGIRC_TAUX_TOTAL = 0.0787;

/** Forfait jours — jours travaillés par an (référence). */
export const FORFAIT_JOURS_ANNUEL = 218;

/** Temps partiel — minimum légal (heures/semaine). */
export const TEMPS_PARTIEL_MIN_HEURES = 24;

/** Rupture conventionnelle — indemnité minimale (fraction du mois par année). */
export const RUPTURE_CONV_MIN_PAR_AN = 0.25;

/** Rupture conventionnelle — plafond indemnité (mois de salaire). */
export const RUPTURE_CONV_PLAFOND_MOIS = 6;

/** Indemnité chômage partiel — taux simplifié (% du brut). */
export const CHOMAGE_PARTIEL_TAUX = 0.7;

/** Coût chômage employeur — durée moyenne indemnisation (mois). */
export const CHOMAGE_DUREE_MOYENNE_MOIS = 12;

/** Transport domicile-travail — plafond exonération (€/an). */
export const TRANSPORT_EXONERATION_PLAFOND = 200;

/** Prime exceptionnelle — abattement social simplifié (%). */
export const PRIME_EXCEPTIONNELLE_ABATTEMENT = 0.5;

/** Préavis démission — durée légale non-cadre 6 mois à 2 ans (mois). */
export const PREAVIS_DEMISSION_6M_2A = 1;

/** Préavis démission — durée légale non-cadre plus de 2 ans (mois). */
export const PREAVIS_DEMISSION_PLUS_2A = 2;

/** Préavis licenciement — durée légale 6 mois à 2 ans (mois). */
export const PREAVIS_LICENCIEMENT_6M_2A = 1;

/** Préavis licenciement — durée légale plus de 2 ans (mois). */
export const PREAVIS_LICENCIEMENT_PLUS_2A = 2;

/** ALS — coefficient par rapport à l'APL (estimation). */
export const ALS_COEFFICIENT_APL = 0.95;

/** ARE — coefficient durée simplifiée. */
export const ARE_COEFF_DUREE = 0.75;

/** ARE — durée minimale droits (jours). */
export const ARE_DUREE_MIN_JOURS = 122;

/** ARE — durée maximale droits (jours). */
export const ARE_DUREE_MAX_JOURS = 730;

/** ARE — durée plancher 53-55 ans (jours). */
export const ARE_DUREE_PLANCHER_53_55 = 730;

/** ARE — durée plancher 55+ ans (jours). */
export const ARE_DUREE_PLANCHER_55_PLUS = 900;
