import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  calculCarrelage,
  surfaceParquet,
  maprimerenov,
  estimationConsommationEnergie,
  pompeAChaleurEconomies,
  volumeSurfacePiece,
  quantiteMortier,
  economiesIsolation,
} from "../src/lib/simulators/general/travaux";

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
};

const cases: Case[] = [
  { slug: "calcul-carrelage", sim: calculCarrelage, input: calculCarrelage.defaultValues!, minPrimary: 10 },
  { slug: "surface-parquet", sim: surfaceParquet, input: surfaceParquet.defaultValues!, minPrimary: 1 },
  { slug: "maprimerenov", sim: maprimerenov, input: maprimerenov.defaultValues!, minPrimary: 500 },
  { slug: "estimation-consommation-energie", sim: estimationConsommationEnergie, input: estimationConsommationEnergie.defaultValues!, minPrimary: 500 },
  { slug: "pompe-a-chaleur-economies", sim: pompeAChaleurEconomies, input: pompeAChaleurEconomies.defaultValues!, minPrimary: 500 },
  { slug: "volume-surface-piece", sim: volumeSurfacePiece, input: volumeSurfacePiece.defaultValues!, minPrimary: 10 },
  { slug: "quantite-mortier", sim: quantiteMortier, input: quantiteMortier.defaultValues!, minPrimary: 1 },
  { slug: "economies-isolation", sim: economiesIsolation, input: economiesIsolation.defaultValues!, minPrimary: 100 },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v.replace(/ m³$/i, "").replace(/ kg$/i, "")) ?? 0;
}

let failed = 0;

for (const c of cases) {
  const raw = c.sim.calculate(c.input);
  const normalized = applyBaseNormalization(raw);
  const enriched = enrichSimulatorResult(c.slug, c.input, raw);
  const primary = primaryValue(enriched);

  const okPrimary = primary > 0;
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
    console.log("  primary numeric:", primary);
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}

console.log("\nAll LOT Travaux enricher tests passed.");
