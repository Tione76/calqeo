import {
  analyzeAllClassifications,
  buildPortalTree,
} from "../src/lib/simulators/_shared/portal-tree";
import { simulators } from "../src/lib/simulators/index";

const tree = buildPortalTree(simulators);
const analyses = analyzeAllClassifications(simulators);

console.log("=== Portal tree audit ===\n");
console.log(`Simulateurs publiés : ${tree.simulatorCount}`);
console.log(`Domaines actifs : ${tree.domainCount}`);
console.log(`Pages sous-catégories : ${tree.categoryHubCount}`);
console.log(`Pages domaines : ${tree.domainCount}`);
console.log(`Total pages hub : ${tree.domainCount + tree.categoryHubCount}`);

const metadataOverrides = analyses.filter(
  (entry) => entry.primaryCategory !== simulators.find((s) => s.slug === entry.slug)!.category
);
console.log(`\nReclassements primaires automatiques : ${metadataOverrides.length} (attendu : 0)`);

console.log("\n--- Domaines ---");
for (const domain of tree.domains) {
  console.log(`\n${domain.label} (${domain.path}) — ${domain.count} sims`);
  console.log(`  Featured: ${domain.featured.map((s) => s.slug).join(", ")}`);
  for (const category of domain.categories) {
    console.log(
      `  · ${category.label} (${category.path}) — ${category.count} sims`
    );
    console.log(`    Featured: ${category.featured.map((s) => s.slug).join(", ")}`);
  }
}

const primarySuggestions = analyses.filter((entry) => entry.primarySuggestion);
console.log(`\n--- Suggestions de reclassement primaire (${primarySuggestions.length}) ---`);
console.log("(Aucune modification automatique — métadonnée conservée)\n");
for (const entry of primarySuggestions.sort((a, b) => b.primarySuggestion!.confidence - a.primarySuggestion!.confidence)) {
  const suggestion = entry.primarySuggestion!;
  console.log(`${entry.title}`);
  console.log(`  Slug : ${entry.slug}`);
  console.log(`  Catégorie actuelle : ${entry.primaryCategoryLabel} (${entry.primaryCategory})`);
  console.log(`  Suggestion : ${suggestion.label} (${suggestion.category})`);
  console.log(`  Confiance : ${suggestion.confidence} %`);
  console.log("");
}

const secondaryAssignments = analyses.filter((entry) => entry.secondaryCategory);
console.log(`--- Catégories secondaires retenues (${secondaryAssignments.length}) ---\n`);
for (const entry of secondaryAssignments.sort((a, b) => (b.secondaryConfidence ?? 0) - (a.secondaryConfidence ?? 0))) {
  console.log(`${entry.slug}`);
  console.log(`  Primaire (métadonnée) : ${entry.primaryCategoryLabel}`);
  console.log(`  Secondaire : ${entry.secondaryCategoryLabel} — confiance ${entry.secondaryConfidence} %`);
}

const autoPrimary = analyses.filter((entry) => entry.primarySource === "auto");
if (autoPrimary.length > 0) {
  console.log(`\n--- Classements primaires automatiques (${autoPrimary.length}) ---\n`);
  for (const entry of autoPrimary) {
    console.log(`  ${entry.slug} → ${entry.primaryCategoryLabel} (source: auto)`);
  }
} else {
  console.log("\n--- Classements primaires automatiques : 0 (toutes les métadonnées sont valides) ---");
}

console.log("\n--- Vérification intégrité ---");
let mismatch = 0;
for (const sim of simulators) {
  const entry = tree.simulatorIndex[sim.slug];
  if (entry.primaryCategory !== sim.category) {
    mismatch++;
    console.log(`  ERREUR: ${sim.slug} metadata=${sim.category} portal=${entry.primaryCategory}`);
  }
}
if (mismatch === 0) {
  console.log("  OK — 100 % des simulateurs utilisent leur catégorie métadonnée comme primaire.");
} else {
  console.log(`  ERREUR — ${mismatch} simulateur(s) avec primaire ≠ métadonnée.`);
}
