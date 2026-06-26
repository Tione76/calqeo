import type { SimulatorDefinition } from "../../types";
import { isArchivedDraftSlug } from "../archive/slugs";

export function partitionDrafts(simulators: SimulatorDefinition[]): {
  active: SimulatorDefinition[];
  archived: SimulatorDefinition[];
} {
  const active: SimulatorDefinition[] = [];
  const archived: SimulatorDefinition[] = [];
  for (const sim of simulators) {
    if (isArchivedDraftSlug(sim.slug)) {
      archived.push(sim);
    } else {
      active.push(sim);
    }
  }
  return { active, archived };
}
