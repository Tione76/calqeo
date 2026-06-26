import type { RegulationModule } from "./types";

export const IFI_REGULATION: RegulationModule = {
  meta: {
    id: "ifi",
    label: "Impôt sur la fortune immobilière (IFI)",
    lastUpdated: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "impots.gouv.fr — IFI", url: "https://www.impots.gouv.fr/particulier/impots-et-fortune-immobiliere-ifi" },
      { name: "BOFiP", url: "https://bofip.impots.gouv.fr" },
    ],
  },
};

/** Seuil d'assujettissement patrimoine net taxable (€). */
export const IFI_SEUIL = 1_300_000;

/** Abattement résidence principale (fraction). */
export const IFI_ABATTEMENT_RP = 0.3;

/** Tranches IFI — formule simplifiée du simulateur publié (pédagogique). */
export const IFI_TRANCHES_SIMPLIFIEES = [
  { max: 800_000, taux: 0.005 },
  { max: 300_000, taux: 0.006 },
  { max: 500_000, taux: 0.007 },
  { max: 1_000_000, taux: 0.008 },
  { max: 3_000_000, taux: 0.009 },
  { max: Infinity, taux: 0.01 },
] as const;

/** Calcule l'IFI avec la formule simplifiée du simulateur Calqeo (sans régression). */
export function calculerIfi(patrimoineNet: number): number {
  if (patrimoineNet <= IFI_SEUIL) return 0;
  let reste = patrimoineNet - 800_000;
  let ifi = 800_000 * 0.005;
  for (const tr of IFI_TRANCHES_SIMPLIFIEES.slice(1)) {
    const tranche = Math.min(reste, tr.max);
    ifi += tranche * tr.taux;
    reste -= tranche;
    if (reste <= 0) break;
  }
  return Math.round(ifi);
}
