import type { SimulatorDefinition } from "../types";
import { aidesSocialesDrafts } from "./aides-sociales";
import { immobilierDrafts } from "./immobilier";
import { financeDrafts } from "./finance";
import { emploiDrafts } from "./emploi";
import { entrepriseDrafts } from "./entreprise";
import { fiscaliteDrafts } from "./fiscalite";
import { travauxDrafts } from "./travaux";
import { santeDrafts } from "./sante";
import { quotidienDrafts } from "./quotidien";
import {
  archivedDraftSimulators,
  ARCHIVED_DRAFT_COUNT,
} from "./archive";

export const draftSimulators: SimulatorDefinition[] = [
  ...aidesSocialesDrafts,
  ...immobilierDrafts,
  ...financeDrafts,
  ...emploiDrafts,
  ...entrepriseDrafts,
  ...fiscaliteDrafts,
  ...travauxDrafts,
  ...santeDrafts,
  ...quotidienDrafts,
];

export function getDraftBySlug(slug: string): SimulatorDefinition | undefined {
  return draftSimulators.find((s) => s.slug === slug);
}

export const DRAFT_COUNT = draftSimulators.length;

export {
  aidesSocialesDrafts,
  immobilierDrafts,
  financeDrafts,
  emploiDrafts,
  entrepriseDrafts,
  fiscaliteDrafts,
  travauxDrafts,
  santeDrafts,
  quotidienDrafts,
  archivedDraftSimulators,
  ARCHIVED_DRAFT_COUNT,
};
