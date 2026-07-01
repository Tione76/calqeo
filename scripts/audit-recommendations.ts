import {
  averageRecommendationCount,
  buildRecommendationMap,
  getRecommendedSlugs,
  RECOMMENDATION_TARGET,
} from "../src/lib/simulators/_shared/recommendations";
import { simulators } from "../src/lib/simulators/index";

const map = buildRecommendationMap(simulators);
const avg = averageRecommendationCount(map);
const avgBefore = 3;

console.log(`Simulateurs publiés : ${simulators.length}`);
console.log(`Moyenne recommandations avant : ${avgBefore}`);
console.log(`Moyenne recommandations après : ${avg.toFixed(1)} (cible ${RECOMMENDATION_TARGET})`);

const samples = [
  "taxe-fonciere",
  "mensualite-pret-immobilier",
  "rentabilite-lmnp",
  "calculateur-imc",
  "impot-sur-le-revenu",
];

console.log("\nExemples de recommandations :");
for (const slug of samples) {
  const related = getRecommendedSlugs(map, slug);
  console.log(`\n${slug} (${related.length}) :`);
  for (const relatedSlug of related) {
    const sim = simulators.find((entry) => entry.slug === relatedSlug);
    console.log(`  - ${relatedSlug} · ${sim?.title ?? "?"}`);
  }
}

const lowBefore = [
  "taxe-fonciere",
  "calculateur-tva",
  "convertisseur-heures-minutes",
  "quantite-peinture",
  "colocation-rentabilite",
  "revision-loyer-irl",
];

console.log("\nSimulateurs peu reliés auparavant (3 liens explicites max) — intégration après moteur :");
for (const slug of lowBefore) {
  const count = getRecommendedSlugs(map, slug).length;
  console.log(`  ${slug}: ${count} recommandations`);
}
