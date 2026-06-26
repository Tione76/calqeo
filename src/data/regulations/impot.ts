import type { RegulationModule } from "./types";

export const IMPOT_REGULATION: RegulationModule = {
  meta: {
    id: "impot",
    label: "Impôt sur le revenu — barème progressif",
    lastUpdated: "2025-04-01",
    referencePeriod: "Revenus 2025 (barème 2026)",
    sources: [
      { name: "impots.gouv.fr", url: "https://www.impots.gouv.fr" },
      { name: "BOFiP", url: "https://bofip.impots.gouv.fr" },
      { name: "Légifrance — CGI art. 197", url: "https://www.legifrance.gouv.fr" },
    ],
    openData: {
      available: true,
      endpoint: "https://www.data.gouv.fr/fr/datasets/bareme-impot-sur-le-revenu/",
      notes: "Barème révisé chaque année au printemps.",
    },
  },
};

/** Barème progressif IR (revenu par part, €). Revenus 2025 / barème 2026. */
export const IR_TRANCHES = [
  { max: 11_294, taux: 0 },
  { max: 28_797, taux: 0.11 },
  { max: 82_341, taux: 0.3 },
  { max: 177_106, taux: 0.41 },
  { max: Infinity, taux: 0.45 },
] as const;

export function calculerImpotBareme(revenuParPart: number): number {
  let impot = 0;
  let prev = 0;
  for (const { max, taux } of IR_TRANCHES) {
    const tranche = Math.min(revenuParPart, max) - prev;
    if (tranche > 0) impot += tranche * taux;
    prev = max;
    if (revenuParPart <= max) break;
  }
  return impot;
}

export const QF_PART_PARENT_ISOLE = 0.25;

export function partsEnfants(nombreEnfants: number): number {
  let parts = 0;
  for (let i = 1; i <= nombreEnfants; i++) {
    parts += i >= 3 ? 1 : 0.5;
  }
  return parts;
}
