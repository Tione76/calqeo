import type { RegulationModule } from "./types";
import type { MicroActivite } from "./urssaf";
import { CALQEO_DATA_LAST_VERIFIED } from "./constants";

export const FISCALITE_REGULATION: RegulationModule = {
  meta: {
    id: "fiscalite",
    label: "Fiscalité — PFU, TVA, crédits d'impôt",
    lastUpdated: CALQEO_DATA_LAST_VERIFIED,
    effectiveFrom: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "impots.gouv.fr", url: "https://www.impots.gouv.fr" },
      { name: "BOFiP", url: "https://bofip.impots.gouv.fr" },
    ],
  },
};

export const PFU_TAUX_GLOBAL = 0.3;
export const PFU_TAUX_IR = 0.128;
export const PFU_TAUX_PS = 0.172;
export const PFU_NET_RATIO = 1 - PFU_TAUX_GLOBAL;

export const PEA_PS_APRES_5_ANS = 0.172;
export const PEA_DUREE_FISCALITE_MIN = 5;

export const FRANCHISE_TVA = {
  prestations: 37_500,
  ventes: 85_000,
  coefficientSeuilMajore: 1.25,
} as const;

export const TVA_TAUX = {
  normal: 20,
  intermediaire: 10,
  reduit: 5.5,
  superReduit: 2.1,
} as const;

export const IMPOT_LIBERATOIRE_TAUX: Record<MicroActivite, number> = {
  vente: 0.01,
  bic: 0.017,
  bnc: 0.022,
};

export function getImpotLiberatoireTaux(activite: string): number {
  return IMPOT_LIBERATOIRE_TAUX[activite as MicroActivite] ?? IMPOT_LIBERATOIRE_TAUX.bic;
}

export const CREDIT_IMPOT_EMPLOI_DOMICILE = {
  plafondDepenses: 12_000,
  tauxCredit: 0.5,
} as const;

export const BAREME_KILOMETRIQUE: Record<number, number> = {
  3: 0.41,
  4: 0.493,
  5: 0.543,
  6: 0.568,
  7: 0.601,
};

export const BAREME_KILOMETRIQUE_DEFAUT_CV = 5;
export const BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE = 1.2;

export function getBaremeKilometriqueCoeff(cv: number): number {
  return BAREME_KILOMETRIQUE[cv] ?? BAREME_KILOMETRIQUE[BAREME_KILOMETRIQUE_DEFAUT_CV];
}

export const MICRO_FONCIER_ABATTEMENT = 0.7;
export const MICRO_MEUBLE_ABATTEMENT = 0.5;
export const PLUS_VALUE_IMMO_TAUX_SIMPLIFIE = 0.362;
