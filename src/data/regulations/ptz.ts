import type { RegulationModule } from "./types";
import { CALQEO_DATA_LAST_VERIFIED } from "./constants";

export const PTZ_REGULATION: RegulationModule = {
  meta: {
    id: "ptz",
    label: "Prêt à taux zéro (PTZ)",
    lastUpdated: CALQEO_DATA_LAST_VERIFIED,
    effectiveFrom: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "Service-Public.fr", url: "https://www.service-public.fr/particuliers/vosdroits/F10793" },
      { name: "ANIL", url: "https://www.anil.org" },
    ],
  },
};

export type PtzZone = "A" | "Abis" | "B1" | "B2" | "C";

/** Plafonds de revenus fiscaux de référence par zone (€). */
export const PTZ_PLAFONDS_REVENUS: Record<PtzZone, number> = {
  A: 49_000,
  Abis: 49_000,
  B1: 42_000,
  B2: 34_500,
  C: 31_500,
};

/** Quotité PTZ par zone (fraction du prix). */
export const PTZ_QUOTITES: Record<PtzZone, number> = {
  A: 0.4,
  Abis: 0.4,
  B1: 0.4,
  B2: 0.2,
  C: 0.2,
};

/** Montant maximum du PTZ (€). */
export const PTZ_MONTANT_MAX = 100_000;

export function getPtzPlafondRevenu(zone: string): number {
  return PTZ_PLAFONDS_REVENUS[zone as PtzZone] ?? PTZ_PLAFONDS_REVENUS.B1;
}

export function getPtzQuotite(zone: string): number {
  return PTZ_QUOTITES[zone as PtzZone] ?? PTZ_QUOTITES.B1;
}

/** Plafond de coût de l'opération retenu pour le calcul (€, estimation simplifiée). */
export const PTZ_PLAFONDS_COUT: Record<PtzZone, number> = {
  A: 265_000,
  Abis: 265_000,
  B1: 250_000,
  B2: 225_000,
  C: 200_000,
};

export function getPtzPlafondCout(zone: string): number {
  return PTZ_PLAFONDS_COUT[zone as PtzZone] ?? PTZ_PLAFONDS_COUT.B1;
}

export function estimerPtz(params: {
  revenuFiscal: number;
  prixBien: number;
  zone: string;
  nbPersonnes?: number;
}): {
  eligible: boolean;
  montant: number;
  plafond: number;
  plafondRevenuEffectif: number;
  quotite: number;
  prixRetenu: number;
  plafondCout: number;
} {
  const { revenuFiscal, prixBien, zone, nbPersonnes = 1 } = params;
  const plafond = getPtzPlafondRevenu(zone);
  const plafondRevenuEffectif = plafond * Math.max(1, nbPersonnes * 0.5);
  const eligible = revenuFiscal <= plafondRevenuEffectif;
  const quotite = getPtzQuotite(zone);
  const plafondCout = getPtzPlafondCout(zone);
  const prixRetenu = Math.min(prixBien, plafondCout);
  const montant = eligible ? Math.min(prixRetenu * quotite, PTZ_MONTANT_MAX) : 0;
  return {
    eligible,
    montant,
    plafond,
    plafondRevenuEffectif,
    quotite,
    prixRetenu,
    plafondCout,
  };
}
