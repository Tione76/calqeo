import type { SimulatorHeadings } from "./types";
import { GENERIC_HEADINGS } from "./types";
import { immobilierHeadings } from "./immobilier";
import { emploiHeadings } from "./emploi";
import { entrepriseHeadings } from "./entreprise";
import { financeHeadings } from "./finance";
import { fiscaliteHeadings } from "./fiscalite";
import { travauxHeadings } from "./travaux";
import { santeHeadings } from "./sante";
import { quotidienHeadings } from "./quotidien";

export type { SimulatorHeadings } from "./types";
export { GENERIC_HEADINGS } from "./types";

/** Cartographie manuelle des titres H2/H3 — un jeu unique par simulateur. */
export const SIMULATOR_HEADINGS: Record<string, SimulatorHeadings> = {
  ...immobilierHeadings,
  ...emploiHeadings,
  ...entrepriseHeadings,
  ...financeHeadings,
  ...fiscaliteHeadings,
  ...travauxHeadings,
  ...santeHeadings,
  ...quotidienHeadings,
};

export function getSimulatorHeadings(slug: string): SimulatorHeadings {
  return SIMULATOR_HEADINGS[slug] ?? GENERIC_HEADINGS;
}
