import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { simulators } from "../src/lib/simulators/index";
import { buildPortalTree } from "../src/lib/simulators/_shared/portal-tree";
import {
  DOMAIN_ANCHORS,
  DOMAIN_LABELS,
  getSimulatorDomain,
} from "../src/lib/simulators/types";

const CUSTOM_FORM_SLUGS = new Set([
  "capacite-emprunt",
  "rendement-locatif",
  "mensualite-pret-immobilier",
]);

const dataDir = resolve(import.meta.dirname, "../src/data");
mkdirSync(dataDir, { recursive: true });

const portalTree = buildPortalTree(simulators);

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
  const portalEntry = portalTree.simulatorIndex[sim.slug];
  return {
    slug: sim.slug,
    title: sim.title,
    shortDescription: sim.shortDescription,
    icon: sim.icon,
    category: sim.category,
    domain,
    domainLabel: DOMAIN_LABELS[domain],
    primaryCategory: portalEntry?.primaryCategory ?? sim.category,
    primaryCategoryLabel: portalEntry?.primaryCategoryLabel,
    categoryPath: portalEntry?.categoryPath,
  };
}

function toNavRef(sim: (typeof simulators)[number]) {
  return { slug: sim.slug, title: sim.title };
}

const groups = portalTree.domains.map((domainNode) => {
  const all = simulators.filter((s) => getSimulatorDomain(s) === domainNode.id);

  return {
    domain: domainNode.id,
    label: domainNode.label,
    anchor: DOMAIN_ANCHORS[domainNode.id],
    path: domainNode.path,
    count: domainNode.count,
    featured: domainNode.featured,
    categories: domainNode.categories.map((category) => ({
      id: category.id,
      label: category.label,
      path: category.path,
      count: category.count,
      featured: category.featured,
    })),
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
writeFileSync(
  resolve(dataDir, "portal-tree.json"),
  `${JSON.stringify(portalTree, null, 2)}\n`,
  "utf8"
);

console.log(`Generated ${searchEntries.length} search entries`);
console.log(`Generated manifest with ${groups.length} domain groups`);
console.log(
  `Generated portal tree: ${portalTree.domainCount} domains, ${portalTree.categoryHubCount} category hubs`
);
