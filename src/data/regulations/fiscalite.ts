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
/** @deprecated Taux global simplifié — préférer calculerPlusValueImmobiliere() */
export const PLUS_VALUE_IMMO_TAUX_SIMPLIFIE = 0.362;

export const PLUS_VALUE_IMMO_TAUX_IR = 0.19;
export const PLUS_VALUE_IMMO_TAUX_PS = 0.172;
export const PLUS_VALUE_IMMO_EXONERATION_IR_ANNEES = 22;
export const PLUS_VALUE_IMMO_EXONERATION_PS_ANNEES = 30;

/** Abattement IR pour durée de détention (0 à 1). */
export function abattementPlusValueIR(annees: number): number {
  if (annees <= 5) return 0;
  if (annees >= PLUS_VALUE_IMMO_EXONERATION_IR_ANNEES) return 1;
  return (annees - 5) * 0.06;
}

/** Abattement prélèvements sociaux pour durée de détention (0 à 1). */
export function abattementPlusValuePS(annees: number): number {
  if (annees <= 5) return 0;
  if (annees >= PLUS_VALUE_IMMO_EXONERATION_PS_ANNEES) return 1;
  if (annees > PLUS_VALUE_IMMO_EXONERATION_IR_ANNEES) {
    return 0.28 + (annees - PLUS_VALUE_IMMO_EXONERATION_IR_ANNEES) * 0.09;
  }
  if (annees === PLUS_VALUE_IMMO_EXONERATION_IR_ANNEES) return 0.28;
  return (annees - 5) * 0.0165;
}

/** Surtaxe sur les plus-values immobilières élevées (fractions de PV imposable IR). */
export function surtaxePlusValueImmobiliere(pvImposableIR: number): number {
  if (pvImposableIR <= 50_000) return 0;
  const tranches = [
    { max: 100_000, rate: 0.02 },
    { max: 150_000, rate: 0.03 },
    { max: 200_000, rate: 0.04 },
    { max: 250_000, rate: 0.05 },
    { max: Number.POSITIVE_INFINITY, rate: 0.06 },
  ];
  let surtax = 0;
  let prev = 50_000;
  for (const { max, rate } of tranches) {
    if (pvImposableIR <= prev) break;
    surtax += (Math.min(pvImposableIR, max) - prev) * rate;
    prev = max;
  }
  return surtax;
}

export type PlusValueImmobiliereResult = {
  prixAchat: number;
  fraisAcquisition: number;
  travaux: number;
  prixVente: number;
  anneesDetention: number;
  prixAcquisitionCorrige: number;
  plusValueBrute: number;
  abattementIRPct: number;
  abattementPSPct: number;
  abattementIRMontant: number;
  abattementPSMontant: number;
  plusValueImposableIR: number;
  plusValueImposablePS: number;
  impotRevenu: number;
  prelevementsSociaux: number;
  surtaxe: number;
  impotTotal: number;
  plusValueNette: number;
  anneesRestantesExonerationIR: number;
  anneesRestantesExonerationPS: number;
  economieFiscaleFraisTravaux: number;
  impactFraisTravauxSurPlusValue: number;
};

function calculerImpotsPlusValue(plusValueBrute: number, annees: number) {
  const abattementIRPct = abattementPlusValueIR(annees);
  const abattementPSPct = abattementPlusValuePS(annees);
  const abattementIRMontant = plusValueBrute * abattementIRPct;
  const abattementPSMontant = plusValueBrute * abattementPSPct;
  const plusValueImposableIR = plusValueBrute - abattementIRMontant;
  const plusValueImposablePS = plusValueBrute - abattementPSMontant;
  const impotRevenu = plusValueImposableIR * PLUS_VALUE_IMMO_TAUX_IR;
  const prelevementsSociaux = plusValueImposablePS * PLUS_VALUE_IMMO_TAUX_PS;
  const surtaxe = surtaxePlusValueImmobiliere(plusValueImposableIR);
  const impotTotal = impotRevenu + prelevementsSociaux + surtaxe;
  return {
    abattementIRPct,
    abattementPSPct,
    abattementIRMontant,
    abattementPSMontant,
    plusValueImposableIR,
    plusValueImposablePS,
    impotRevenu,
    prelevementsSociaux,
    surtaxe,
    impotTotal,
    plusValueNette: plusValueBrute - impotTotal,
  };
}

/** Calcul détaillé plus-value immobilière (barèmes IR / PS officiels). */
export function calculerPlusValueImmobiliere(params: {
  prixAchat: number;
  fraisAcquisition: number;
  travaux: number;
  prixVente: number;
  anneesDetention: number;
}): PlusValueImmobiliereResult {
  const prixAchat = Math.max(0, params.prixAchat);
  const fraisAcquisition = Math.max(0, params.fraisAcquisition);
  const travaux = Math.max(0, params.travaux);
  const prixVente = Math.max(0, params.prixVente);
  const anneesDetention = Math.max(0, params.anneesDetention);
  const prixAcquisitionCorrige = prixAchat + fraisAcquisition + travaux;
  const plusValueBrute = Math.max(0, prixVente - prixAcquisitionCorrige);
  const impots = calculerImpotsPlusValue(plusValueBrute, anneesDetention);

  const plusValueSansFraisTravaux = Math.max(0, prixVente - prixAchat);
  const impotsSansFraisTravaux = calculerImpotsPlusValue(
    plusValueSansFraisTravaux,
    anneesDetention
  );

  return {
    prixAchat,
    fraisAcquisition,
    travaux,
    prixVente,
    anneesDetention,
    prixAcquisitionCorrige,
    plusValueBrute,
    ...impots,
    anneesRestantesExonerationIR: Math.max(
      0,
      PLUS_VALUE_IMMO_EXONERATION_IR_ANNEES - anneesDetention
    ),
    anneesRestantesExonerationPS: Math.max(
      0,
      PLUS_VALUE_IMMO_EXONERATION_PS_ANNEES - anneesDetention
    ),
    economieFiscaleFraisTravaux:
      impotsSansFraisTravaux.impotTotal - impots.impotTotal,
    impactFraisTravauxSurPlusValue:
      plusValueSansFraisTravaux - plusValueBrute,
  };
}
