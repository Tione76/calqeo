import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  poidsIdeal,
  caloriesJournalieres,
  calculateurOvulation,
  hydratationQuotidienne,
  proteinesJournalieres,
  economiesArretTabac,
  unitesAlcool,
  cyclesSommeil,
} from "../src/lib/simulators/general/sante";

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
  { slug: "poids-ideal", sim: poidsIdeal, input: poidsIdeal.defaultValues!, minPrimary: 50 },
  { slug: "calories-journalieres", sim: caloriesJournalieres, input: caloriesJournalieres.defaultValues!, minPrimary: 1500 },
  { slug: "calculateur-ovulation", sim: calculateurOvulation, input: calculateurOvulation.defaultValues!, textPrimary: true },
  { slug: "hydratation-quotidienne", sim: hydratationQuotidienne, input: hydratationQuotidienne.defaultValues!, minPrimary: 1 },
  { slug: "proteines-journalieres", sim: proteinesJournalieres, input: proteinesJournalieres.defaultValues!, minPrimary: 50 },
  { slug: "economies-arret-tabac", sim: economiesArretTabac, input: economiesArretTabac.defaultValues!, minPrimary: 500 },
  { slug: "unites-alcool", sim: unitesAlcool, input: unitesAlcool.defaultValues!, minPrimary: 1 },
  { slug: "cycles-sommeil", sim: cyclesSommeil, input: cyclesSommeil.defaultValues!, textPrimary: true },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v.replace(/\/(mois|jour|h)$/i, "").replace(/ L\/jour$/i, "").replace(/ g$/i, "")) ?? 0;
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

  const okPrimary = c.textPrimary
    ? primaryText.length > 3
    : primary > 0;
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

console.log("\nAll LOT Santé enricher tests passed.");
