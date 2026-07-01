/**
 * Audit des sources réglementaires — liste les 109 simulateurs publiés
 * et leurs regulationIds (inline ou regulation-ids.ts).
 */
import { simulators } from "../src/lib/simulators/index";
import { SIMULATOR_REGULATION_IDS } from "../src/lib/simulators/regulation-ids";
import { getRegulatoryNotice } from "../src/data/regulations/registry";

const rows = simulators.map((s) => {
  const fromMap = SIMULATOR_REGULATION_IDS[s.slug];
  const ids = s.regulationIds ?? fromMap ?? [];
  const notice = ids.length > 0 ? getRegulatoryNotice(ids) : null;
  return {
    slug: s.slug,
    domain: s.domain,
    category: s.category,
    regulationIds: ids,
    sourceCount: notice?.sources.length ?? 0,
    fromMap: !!fromMap,
    inline: !!(s as { regulationIds?: string[] }).regulationIds && !fromMap,
  };
});

console.log(`Total simulateurs publiés: ${rows.length}`);
console.log(`Avec sources: ${rows.filter((r) => r.regulationIds.length > 0).length}`);
console.log(`Sans sources: ${rows.filter((r) => r.regulationIds.length === 0).length}`);
console.log("\n=== AVEC SOURCES ===");
for (const r of rows.filter((r) => r.regulationIds.length > 0)) {
  console.log(`${r.slug}\t${r.regulationIds.join("+")}\t${r.sourceCount} sources\t${r.domain}`);
}
console.log("\n=== SANS SOURCES ===");
for (const r of rows.filter((r) => r.regulationIds.length === 0)) {
  console.log(`${r.slug}\t${r.domain}\t${r.category}`);
}
