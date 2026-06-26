import type { RegulationModule } from "./types";
import { SMIC_JOURNALIER } from "./smic";

export type MicroActivite = "vente" | "bic" | "bnc";

export const URSSAF_REGULATION: RegulationModule = {
  meta: {
    id: "urssaf",
    label: "Cotisations URSSAF et droit du travail",
    lastUpdated: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "URSSAF", url: "https://www.urssaf.fr" },
      { name: "autoentrepreneur.urssaf.fr", url: "https://www.autoentrepreneur.urssaf.fr" },
      { name: "Légifrance", url: "https://www.legifrance.gouv.fr" },
    ],
    openData: {
      available: false,
      notes: "Barèmes publiés par arrêté — pas d'API unifiée à ce jour.",
    },
  },
};

export const COTISATIONS_SALARIALES_DEFAUT = 22;
export const COTISATIONS_PATRONALES_DEFAUT = 42;
export const CSG_ASSIETTE_BRUT = 0.9825;
export const CSG_CRDS_TAUX = 0.092;
export const NET_TO_BRUT_DIVISEUR_INITIAL = 0.77;
export const NET_TO_BRUT_FACTEUR_CORRECTION = 1.15;
export const NET_TO_BRUT_ITERATIONS = 8;

export const MICRO_ENTREPRENEUR_TAUX: Record<MicroActivite, number> = {
  vente: 12.3,
  bic: 21.2,
  bnc: 24.6,
};

export const MICRO_ENTREPRENEUR_PLAFONDS = {
  vente: 77_700,
  prestations: 188_700,
} as const;

export function getMicroEntrepreneurTaux(activite: string): number {
  return MICRO_ENTREPRENEUR_TAUX[activite as MicroActivite] ?? MICRO_ENTREPRENEUR_TAUX.bic;
}

export const HEURES_SUP_SEUIL_25 = 8;
export const HEURES_SUP_MAJORATION_25 = 1.25;
export const HEURES_SUP_MAJORATION_50 = 1.5;

export const LICENCIEMENT_ANCIENNETE_MIN = 0.67;
export const LICENCIEMENT_TAUX_10_ANS = 1 / 4;
export const LICENCIEMENT_TAUX_APRES_10_ANS = 1 / 3;
export const LICENCIEMENT_SEUIL_ANNEES = 10;

export const IJSS_TAUX_INDEMNISATION = 0.5;
export const IJSS_PLAFOND_SMIC_MULTIPLE = 1.8;

export const ARE_TAUX_JOURNALIER = 0.57;
export const ARE_PLAFOND_SMIC_MULTIPLE = 0.57 * 4.5;

export const PORTAGE_NET_CA_RATIO = 0.75;

export { SMIC_JOURNALIER };
