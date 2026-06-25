/**
 * Constantes et formules simplifiées paie / social (estimation indicative).
 * Les valeurs réglementaires sont centralisées dans @/lib/config/urssaf.
 */

import {
  SMIC_HORAIRE_BRUT,
  SMIC_MENSUEL_BRUT_35H,
  HEURES_LEGALES_SEMAINE,
  JOURS_CONGES_PAR_MOIS,
  SMIC_JOURNALIER,
  COTISATIONS_SALARIALES_DEFAUT,
  COTISATIONS_PATRONALES_DEFAUT,
  CSG_ASSIETTE_BRUT,
  CSG_CRDS_TAUX,
  NET_TO_BRUT_DIVISEUR_INITIAL,
  NET_TO_BRUT_FACTEUR_CORRECTION,
  NET_TO_BRUT_ITERATIONS,
  LICENCIEMENT_ANCIENNETE_MIN,
  LICENCIEMENT_TAUX_10_ANS,
  LICENCIEMENT_TAUX_APRES_10_ANS,
  LICENCIEMENT_SEUIL_ANNEES,
  IJSS_TAUX_INDEMNISATION,
  IJSS_PLAFOND_SMIC_MULTIPLE,
  ARE_TAUX_JOURNALIER,
  ARE_PLAFOND_SMIC_MULTIPLE,
} from "@/lib/config/urssaf";

export {
  SMIC_HORAIRE_BRUT as SMIC_HORAIRE_2025,
  SMIC_MENSUEL_BRUT_35H,
  HEURES_LEGALES_SEMAINE,
  JOURS_CONGES_PAR_MOIS,
  SMIC_JOURNALIER,
};

/** Estimation net avant impôt à partir du brut mensuel. */
export function brutToNetMensuel(
  brut: number,
  tauxCotisationsSalariales = COTISATIONS_SALARIALES_DEFAUT
): number {
  const baseCSG = brut * CSG_ASSIETTE_BRUT;
  const csgCrds = baseCSG * CSG_CRDS_TAUX;
  const cotisations = brut * (tauxCotisationsSalariales / 100);
  return Math.max(0, brut - cotisations - csgCrds);
}

/** Estimation brut à partir du net (itération simple). */
export function netToBrutMensuel(
  netCible: number,
  tauxCotisationsSalariales = COTISATIONS_SALARIALES_DEFAUT
): number {
  let brut = netCible / NET_TO_BRUT_DIVISEUR_INITIAL;
  for (let i = 0; i < NET_TO_BRUT_ITERATIONS; i++) {
    const net = brutToNetMensuel(brut, tauxCotisationsSalariales);
    brut += (netCible - net) * NET_TO_BRUT_FACTEUR_CORRECTION;
  }
  return Math.max(0, brut);
}

/** Coût employeur mensuel estimé (charges patronales). */
export function coutEmployeurMensuel(
  brut: number,
  tauxPatronal = COTISATIONS_PATRONALES_DEFAUT
): number {
  return brut * (1 + tauxPatronal / 100);
}

/** Indemnité légale de licenciement (hors cas particuliers). */
export function indemniteLicenciementLegale(
  salaireMensuelBrut: number,
  anneesAnciennete: number
): number {
  if (anneesAnciennete < LICENCIEMENT_ANCIENNETE_MIN) return 0;
  const annees = Math.floor(anneesAnciennete);
  const moisSup = anneesAnciennete - annees;

  let indemnite = 0;
  if (annees <= LICENCIEMENT_SEUIL_ANNEES) {
    indemnite =
      salaireMensuelBrut * LICENCIEMENT_TAUX_10_ANS * (annees + moisSup / 12);
  } else {
    indemnite =
      salaireMensuelBrut * LICENCIEMENT_TAUX_10_ANS * LICENCIEMENT_SEUIL_ANNEES +
      salaireMensuelBrut *
        LICENCIEMENT_TAUX_APRES_10_ANS *
        (annees - LICENCIEMENT_SEUIL_ANNEES + moisSup / 12);
  }
  return Math.max(0, indemnite);
}

/** IJSS journalière simplifiée (plafonnée). */
export function ijssJournaliere(salaireMensuelBrut: number): number {
  const journalier = (salaireMensuelBrut * 12) / 365;
  const plafond = SMIC_JOURNALIER * IJSS_PLAFOND_SMIC_MULTIPLE;
  return Math.min(
    journalier * IJSS_TAUX_INDEMNISATION,
    plafond * IJSS_TAUX_INDEMNISATION
  );
}

/** Allocation ARE journalière simplifiée. */
export function areJournaliere(salaireJournalierReference: number): number {
  const brut = salaireJournalierReference * ARE_TAUX_JOURNALIER;
  const plafond = SMIC_JOURNALIER * ARE_PLAFOND_SMIC_MULTIPLE;
  return Math.min(brut, plafond);
}
