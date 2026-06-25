import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { simulators } from "../src/lib/simulators/index";
import { DOMAIN_LABELS, getSimulatorDomain } from "../src/lib/simulators/types";

const entries = simulators.map((sim) => ({
  slug: sim.slug,
  title: sim.title,
  shortDescription: sim.shortDescription,
  metaTitle: sim.metaTitle,
  metaDescription: sim.metaDescription,
  category: sim.category,
  domain: getSimulatorDomain(sim),
  domainLabel: DOMAIN_LABELS[getSimulatorDomain(sim)],
  keywords: sim.keywords,
}));

const outPath = resolve(
  import.meta.dirname,
  "../src/data/simulator-search-index.json"
);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
console.log(`Generated ${entries.length} search entries → ${outPath}`);
