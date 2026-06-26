import type { RegulationMeta, RegulationSource } from "./types";
import { SMIC_REGULATION } from "./smic";
import { URSSAF_REGULATION } from "./urssaf";
import { IMPOT_REGULATION } from "./impot";
import { FISCALITE_REGULATION } from "./fiscalite";
import { RETRAITE_REGULATION } from "./retraite";
import { IMMOBILIER_REGULATION } from "./immobilier";
import { CAF_REGULATION } from "./caf";
import { RSA_REGULATION } from "./rsa";
import { APL_REGULATION } from "./apl";
import { PTZ_REGULATION } from "./ptz";
import { IFI_REGULATION } from "./ifi";
import { DONATION_REGULATION } from "./donation";
import { EMPLOI_REGULATION } from "./emploi";

/** Registre central — ajouter un module ici pour l'exposer aux simulateurs. */
export const REGULATION_MODULES: Record<string, RegulationModuleLike> = {
  smic: SMIC_REGULATION,
  urssaf: URSSAF_REGULATION,
  impot: IMPOT_REGULATION,
  fiscalite: FISCALITE_REGULATION,
  retraite: RETRAITE_REGULATION,
  immobilier: IMMOBILIER_REGULATION,
  caf: CAF_REGULATION,
  rsa: RSA_REGULATION,
  apl: APL_REGULATION,
  ptz: PTZ_REGULATION,
  ifi: IFI_REGULATION,
  donation: DONATION_REGULATION,
  emploi: EMPLOI_REGULATION,
};

export type RegulationModuleLike = { meta: RegulationMeta };

export function getRegulationMeta(id: string): RegulationMeta | undefined {
  return REGULATION_MODULES[id]?.meta;
}

/** Agrège sources et date pour un ou plusieurs modules réglementaires. */
export function getRegulatoryNotice(regulationIds: string[]): {
  lastUpdated: string;
  sources: RegulationSource[];
  referencePeriods: string[];
} {
  const metas = regulationIds
    .map((id) => getRegulationMeta(id))
    .filter((m): m is RegulationMeta => !!m);

  if (metas.length === 0) {
    return { lastUpdated: "", sources: [], referencePeriods: [] };
  }

  const lastUpdated = metas
    .map((m) => m.lastUpdated)
    .sort()
    .reverse()[0];

  const sourcesMap = new Map<string, RegulationSource>();
  for (const meta of metas) {
    for (const src of meta.sources) {
      sourcesMap.set(`${src.name}|${src.url}`, src);
    }
  }

  const referencePeriods = [...new Set(metas.map((m) => m.referencePeriod))];

  return {
    lastUpdated,
    sources: [...sourcesMap.values()],
    referencePeriods,
  };
}

/** Référence globale affichée sur le site (année courante des barèmes). */
export const REGULATIONS_GLOBAL = {
  annee: 2025,
  derniereMiseAJour: "2025-04-01",
  prochaineRevision: "2026-01-01",
} as const;
