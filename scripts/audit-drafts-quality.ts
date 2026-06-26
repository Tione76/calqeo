/**
 * Audit qualité des brouillons actifs — npx tsx scripts/audit-drafts-quality.ts
 */
import { draftSimulators, ARCHIVED_DRAFT_COUNT } from "../src/lib/simulators/drafts";
import { archivedDraftSimulators } from "../src/lib/simulators/drafts/archive";
import {
  DRAFT_PRIORITY_A,
  DRAFT_PRIORITY_B,
  DRAFT_PRIORITY_C,
} from "../src/lib/simulators/drafts/archive/priorities";
import { ARCHIVED_DRAFT_SLUGS } from "../src/lib/simulators/drafts/archive/slugs";
import manifest from "../src/data/simulator-manifest.json";
import { DOMAIN_LABELS, getSimulatorDomain } from "../src/lib/simulators/types";

const publishedSlugs = new Set(
  manifest.groups.flatMap((g) => g.all.map((s) => s.slug))
);

const allValidSlugs = new Set([
  ...publishedSlugs,
  ...draftSimulators.map((s) => s.slug),
]);

type Issue = { slug: string; type: string; detail: string };
const issues: Issue[] = [];

for (const sim of draftSimulators) {
  if (!sim.slug || !sim.title || !sim.metaTitle || !sim.metaDescription) {
    issues.push({ slug: sim.slug, type: "metadata", detail: "Métadonnées SEO incomplètes" });
  }
  if (!sim.formFields?.length || !sim.defaultValues) {
    issues.push({ slug: sim.slug, type: "form", detail: "Formulaire ou defaultValues manquant" });
  }
  if (!sim.content?.sections?.length) {
    issues.push({ slug: sim.slug, type: "content", detail: "Contenu éditorial absent" });
  }
  if (!sim.faq?.length || sim.faq.length < 3) {
    issues.push({ slug: sim.slug, type: "faq", detail: `FAQ insuffisante (${sim.faq?.length ?? 0})` });
  }
  if (sim.publicationStatus !== "draft") {
    issues.push({ slug: sim.slug, type: "status", detail: "publicationStatus !== draft" });
  }
  if (publishedSlugs.has(sim.slug)) {
    issues.push({ slug: sim.slug, type: "duplicate-published", detail: "Slug déjà publié" });
  }
  if (ARCHIVED_DRAFT_SLUGS.has(sim.slug)) {
    issues.push({ slug: sim.slug, type: "archived-in-active", detail: "Brouillon archivé présent dans la bibliothèque active" });
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sim.slug)) {
    issues.push({ slug: sim.slug, type: "slug", detail: "Slug invalide (URL)" });
  }
  for (const rel of sim.relatedSlugs ?? []) {
    if (!allValidSlugs.has(rel)) {
      issues.push({ slug: sim.slug, type: "related-missing", detail: `relatedSlug introuvable: ${rel}` });
    }
    if (ARCHIVED_DRAFT_SLUGS.has(rel)) {
      issues.push({ slug: sim.slug, type: "related-archived", detail: `relatedSlug pointe vers archive: ${rel}` });
    }
  }
  const priority = [...DRAFT_PRIORITY_A, ...DRAFT_PRIORITY_B, ...DRAFT_PRIORITY_C];
  if (!priority.includes(sim.slug)) {
    issues.push({ slug: sim.slug, type: "priority", detail: "Absent des listes A/B/C" });
  }
}

const prioritySlugs = new Set([...DRAFT_PRIORITY_A, ...DRAFT_PRIORITY_B, ...DRAFT_PRIORITY_C]);
for (const slug of draftSimulators.map((s) => s.slug)) {
  if (!prioritySlugs.has(slug)) continue;
}
for (const slug of [...DRAFT_PRIORITY_A, ...DRAFT_PRIORITY_B, ...DRAFT_PRIORITY_C]) {
  if (!draftSimulators.some((s) => s.slug === slug)) {
    issues.push({ slug, type: "priority-orphan", detail: "Priorité A/B/C sans brouillon actif" });
  }
  if (ARCHIVED_DRAFT_SLUGS.has(slug)) {
    issues.push({ slug, type: "priority-archived", detail: "Priorité A/B/C sur un slug archivé" });
  }
}

const byDomain = draftSimulators.reduce<Record<string, number>>((acc, d) => {
  const domain = getSimulatorDomain(d);
  acc[domain] = (acc[domain] ?? 0) + 1;
  return acc;
}, {});

console.log("=== Audit consolidation brouillons Calqeo ===\n");
console.log(`Brouillons actifs: ${draftSimulators.length}`);
console.log(`Brouillons archivés: ${archivedDraftSimulators.length} (attendu: ${ARCHIVED_DRAFT_COUNT})`);
console.log(`Issues actifs: ${issues.length}`);

console.log("\n--- Répartition active ---");
for (const [domain, count] of Object.entries(byDomain)) {
  console.log(`  ${DOMAIN_LABELS[domain as keyof typeof DOMAIN_LABELS] ?? domain}: ${count}`);
}

console.log("\n--- Priorités ---");
console.log(`  A: ${DRAFT_PRIORITY_A.length} | B: ${DRAFT_PRIORITY_B.length} | C: ${DRAFT_PRIORITY_C.length}`);

if (issues.length > 0) {
  console.log("\n--- Issues ---");
  const byType = issues.reduce<Record<string, number>>((a, i) => {
    a[i.type] = (a[i.type] ?? 0) + 1;
    return a;
  }, {});
  for (const [t, n] of Object.entries(byType)) console.log(`  ${t}: ${n}`);
  for (const i of issues.slice(0, 50)) {
    console.log(`  [${i.type}] ${i.slug}: ${i.detail}`);
  }
  if (issues.length > 50) console.log(`  ... et ${issues.length - 50} autres`);
} else {
  console.log("\n✓ Aucune issue — bibliothèque active prête à publier.");
}

process.exit(issues.length > 0 ? 1 : 0);
