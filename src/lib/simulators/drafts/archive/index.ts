import { archivedAidesSocialesDrafts } from "./aides-sociales";
import { archivedImmobilierDrafts } from "./immobilier";
import { archivedFinanceDrafts } from "./finance";
import { archivedEmploiDrafts } from "./emploi";
import { archivedEntrepriseDrafts } from "./entreprise";
import { archivedFiscaliteDrafts } from "./fiscalite";
import { archivedTravauxDrafts } from "./travaux";
import { archivedSanteDrafts } from "./sante";
import { archivedQuotidienDrafts } from "./quotidien";

export const archivedDraftSimulators = [
  ...archivedAidesSocialesDrafts,
  ...archivedImmobilierDrafts,
  ...archivedFinanceDrafts,
  ...archivedEmploiDrafts,
  ...archivedEntrepriseDrafts,
  ...archivedFiscaliteDrafts,
  ...archivedTravauxDrafts,
  ...archivedSanteDrafts,
  ...archivedQuotidienDrafts,
];

export const ARCHIVED_DRAFT_COUNT = archivedDraftSimulators.length;

export { ARCHIVED_DRAFT_SLUGS, isArchivedDraftSlug } from "./slugs";
export { DRAFT_PRIORITY_A, DRAFT_PRIORITY_B, DRAFT_PRIORITY_C, getDraftPriority } from "./priorities";
