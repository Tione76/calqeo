import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { simulators } from "../src/lib/simulators/index";
import { FEATURED_SLUGS } from "../src/lib/simulators/featured-slugs";
import {
  DOMAIN_ANCHORS,
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  getSimulatorDomain,
} from "../src/lib/simulators/types";

const CUSTOM_FORM_SLUGS = new Set([
  "capacite-emprunt",
  "rendement-locatif",
  "mensualite-pret-immobilier",
]);

const dataDir = resolve(import.meta.dirname, "../src/data");
mkdirSync(dataDir, { recursive: true });

const searchEntries = simulators.map((sim) => ({
  slug: sim.slug,
  title: sim.title,
  shortDescription: sim.shortDescription,
  metaTitle: sim.metaTitle,
  metaDescription: sim.metaDescription,
  category: sim.category,
  icon: sim.icon,
  domain: getSimulatorDomain(sim),
  domainLabel: DOMAIN_LABELS[getSimulatorDomain(sim)],
  keywords: sim.keywords,
}));

function toCardRef(sim: (typeof simulators)[number]) {
  const domain = getSimulatorDomain(sim);
  return {
    slug: sim.slug,
    title: sim.title,
    shortDescription: sim.shortDescription,
    icon: sim.icon,
    category: sim.category,
    domain,
    domainLabel: DOMAIN_LABELS[domain],
  };
}

function toNavRef(sim: (typeof simulators)[number]) {
  return { slug: sim.slug, title: sim.title };
}

const groups = DOMAIN_ORDER.map((domain) => {
  const all = simulators.filter((s) => getSimulatorDomain(s) === domain);
  const featured = FEATURED_SLUGS[domain]
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is (typeof simulators)[number] => !!s)
    .map(toNavRef);

  return {
    domain,
    label: DOMAIN_LABELS[domain],
    anchor: DOMAIN_ANCHORS[domain],
    count: all.length,
    featured: featured.length > 0 ? featured : all.slice(0, 4).map(toNavRef),
    preview: all.slice(0, 6).map(toCardRef),
    all: all.map(toCardRef),
  };
});

const genericFormSlugs = simulators
  .filter((sim) => sim.formFields && sim.defaultValues)
  .map((sim) => sim.slug)
  .filter((slug) => !CUSTOM_FORM_SLUGS.has(slug));

const manifest = {
  count: simulators.length,
  groups,
  genericFormSlugs,
};

writeFileSync(
  resolve(dataDir, "simulator-search-index.json"),
  `${JSON.stringify(searchEntries, null, 2)}\n`,
  "utf8"
);
writeFileSync(
  resolve(dataDir, "simulator-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8"
);

console.log(`Generated ${searchEntries.length} search entries`);
console.log(`Generated manifest with ${groups.length} domain groups`);
