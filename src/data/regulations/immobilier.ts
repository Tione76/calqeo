import type { RegulationModule } from "./types";
import type { MicroActivite } from "./urssaf";

export const IMMOBILIER_REGULATION: RegulationModule = {
  meta: {
    id: "immobilier",
    label: "Règles immobilières et crédit (HCSF, notaire)",
    lastUpdated: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "HCSF", url: "https://www.hcsf.finances.gouv.fr" },
      { name: "Notaires de France", url: "https://www.notaires.fr" },
      { name: "anah.fr — MaPrimeRénov'", url: "https://www.anah.gouv.fr" },
    ],
  },
};

export const ACRE_REDUCTION_ANNEE_1 = 50;
export const FREELANCE_TAUX_CHARGES_DEFAUT = 35;
export const TNS_TAUX_CHARGES_DEFAUT = 45;

export type MaPrimeRenovCouleur = "bleu" | "jaune" | "violet" | "rose";
export type MaPrimeRenovTravaux = "isolation" | "pac" | "chaudiere";

export const MAPRIMERENOV_FORFAITS: Record<
  MaPrimeRenovTravaux,
  Record<MaPrimeRenovCouleur, number>
> = {
  isolation: { bleu: 7500, jaune: 4000, violet: 2500, rose: 1000 },
  pac: { bleu: 5000, jaune: 4000, violet: 3000, rose: 0 },
  chaudiere: { bleu: 4000, jaune: 3000, violet: 2000, rose: 0 },
};

export function getMaPrimeRenovForfait(travaux: string, couleur: string): number {
  const t = MAPRIMERENOV_FORFAITS[travaux as MaPrimeRenovTravaux];
  if (!t) return 0;
  return t[couleur as MaPrimeRenovCouleur] ?? 0;
}

export const HCSF_TAUX_ENDETTEMENT_MAX = 35;
export const FRAIS_NOTAIRE_ANCIEN_POURCENT = 7.5;
export const FRAIS_NOTAIRE_NEUF_POURCENT = 2.5;
export const FRAIS_NOTAIRE_FACTEUR_BUDGET = 1.08;

export function getFraisNotaireTaux(typeBien: string): number {
  return typeBien === "neuf" ? FRAIS_NOTAIRE_NEUF_POURCENT : FRAIS_NOTAIRE_ANCIEN_POURCENT;
}

export function labelMicroActivite(activite: MicroActivite): string {
  const labels: Record<MicroActivite, string> = {
    vente: "Vente",
    bic: "Prestations BIC",
    bnc: "Prestations BNC",
  };
  return labels[activite];
}
