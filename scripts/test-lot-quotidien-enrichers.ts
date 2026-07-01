import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  calculateurTva,
  calculateurPourcentage,
  regleDeTrois,
  calculateurAge,
  calculateurPourboire,
  partageFacture,
  convertisseurDevises,
  convertisseurHeuresMinutes,
  vitesseDistanceTemps,
  evolutionPourcentage,
} from "../src/lib/simulators/general/quotidien";

type Case = {
  slug: string;
  sim: {
    calculate: (input: Record<string, number | string>) => {
      summary: string;
      lines: { label: string; value: string; highlight?: boolean }[];
    };
  };
  input: Record<string, number | string>;
  minPrimary?: number;
  textPrimary?: boolean;
};

const cases: Case[] = [
  { slug: "calculateur-tva", sim: calculateurTva, input: calculateurTva.defaultValues!, minPrimary: 100 },
  { slug: "calculateur-pourcentage", sim: calculateurPourcentage, input: calculateurPourcentage.defaultValues!, minPrimary: 1 },
  { slug: "regle-de-trois", sim: regleDeTrois, input: regleDeTrois.defaultValues!, minPrimary: 100 },
  { slug: "calculateur-age", sim: calculateurAge, input: calculateurAge.defaultValues!, textPrimary: true },
  { slug: "calculateur-pourboire", sim: calculateurPourboire, input: calculateurPourboire.defaultValues!, minPrimary: 80 },
  { slug: "partage-facture", sim: partageFacture, input: partageFacture.defaultValues!, minPrimary: 20 },
  { slug: "convertisseur-devises", sim: convertisseurDevises, input: convertisseurDevises.defaultValues!, minPrimary: 100 },
  { slug: "convertisseur-heures-minutes", sim: convertisseurHeuresMinutes, input: convertisseurHeuresMinutes.defaultValues!, minPrimary: 100 },
  { slug: "vitesse-distance-temps", sim: vitesseDistanceTemps, input: vitesseDistanceTemps.defaultValues!, textPrimary: true },
  { slug: "evolution-pourcentage", sim: evolutionPourcentage, input: evolutionPourcentage.defaultValues!, minPrimary: 1 },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v.replace(/ min$/i, "").replace(/ h$/i, "").replace(/ s$/i, "")) ?? 0;
}

function textPrimary(result: ReturnType<typeof enrichSimulatorResult>): string {
  return result.primary?.value?.trim() ?? "";
}

let failed = 0;

for (const c of cases) {
  const raw = c.sim.calculate(c.input);
  const normalized = applyBaseNormalization(raw);
  const enriched = enrichSimulatorResult(c.slug, c.input, raw);
  const primary = primaryValue(enriched);
  const primaryText = textPrimary(enriched);

  const okPrimary = c.textPrimary ? primaryText.length > 2 : primary > 0;
  const okMin = c.minPrimary != null ? primary >= c.minPrimary : true;
  const narrativeOk = Boolean(enriched.narrative && enriched.narrative.length > 20);
  const interpretationOk = Boolean(enriched.interpretation?.title);
  const comparisonsOk = (enriched.comparisons?.length ?? 0) > 0;
  const pass = okPrimary && okMin && narrativeOk && interpretationOk && comparisonsOk;

  console.log(
    `${pass ? "PASS" : "FAIL"} ${c.slug}`,
    `primary=${enriched.primary?.value}`,
    `narrative=${narrativeOk}`,
    `interpretation=${interpretationOk}`,
    `comparisons=${enriched.comparisons?.length ?? 0}`
  );

  if (!pass) {
    failed++;
    console.log("  normalized lines:", normalized.lines.map((l) => l.label).join(", "));
    console.log("  primary numeric:", primary, "text:", primaryText);
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}

console.log("\nAll LOT Calculs du quotidien enricher tests passed.");
