/**
 * Audit bibliothèque brouillons — npx tsx scripts/audit-drafts.ts
 */
import { draftSimulators, DRAFT_COUNT, ARCHIVED_DRAFT_COUNT } from "../src/lib/simulators/drafts";
import { archivedDraftSimulators } from "../src/lib/simulators/drafts/archive";
import { DOMAIN_LABELS, getSimulatorDomain } from "../src/lib/simulators/types";

const byDomain = draftSimulators.reduce<Record<string, number>>((acc, d) => {
  const domain = getSimulatorDomain(d);
  acc[domain] = (acc[domain] ?? 0) + 1;
  return acc;
}, {});

console.log("=== Bibliothèque brouillons Calqeo (active) ===");
console.log(`Brouillons actifs: ${DRAFT_COUNT}`);
console.log(`Brouillons archivés: ${ARCHIVED_DRAFT_COUNT} (total archive: ${archivedDraftSimulators.length})`);
console.log("\nRépartition active :");
for (const [domain, count] of Object.entries(byDomain)) {
  console.log(`  ${DOMAIN_LABELS[domain as keyof typeof DOMAIN_LABELS] ?? domain}: ${count}`);
}
