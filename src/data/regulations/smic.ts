import type { RegulationModule } from "./types";

export const SMIC_REGULATION: RegulationModule = {
  meta: {
    id: "smic",
    label: "SMIC et durée légale du travail",
    lastUpdated: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      {
        name: "Légifrance — Code du travail",
        url: "https://www.legifrance.gouv.fr/codes/id/LC/texte",
      },
      {
        name: "Service-Public.fr — SMIC",
        url: "https://www.service-public.fr/particuliers/vosdroits/F2300",
      },
    ],
    openData: {
      available: true,
      endpoint: "https://www.data.gouv.fr/fr/datasets/salaire-minimum-de-croissance-smic/",
      notes: "SMIC révisé au 1er janvier chaque année par arrêté.",
    },
  },
};

/**
 * SMIC horaire brut (€/h).
 * @source Arrêté relatif au salaire minimum — 1er janvier 2025
 */
export const SMIC_HORAIRE_BRUT = 11.65;

/** Durée légale du travail (heures/semaine). */
export const HEURES_LEGALES_SEMAINE = 35;

/** Jours ouvrables de congés payés acquis par mois. */
export const JOURS_CONGES_PAR_MOIS = 2.5;

export const SMIC_MENSUEL_BRUT_35H = SMIC_HORAIRE_BRUT * HEURES_LEGALES_SEMAINE;
export const SMIC_JOURNALIER = (SMIC_MENSUEL_BRUT_35H * 12) / 365;

/** @deprecated Alias rétrocompatibilité */
export const SMIC_HORAIRE_2025 = SMIC_HORAIRE_BRUT;
