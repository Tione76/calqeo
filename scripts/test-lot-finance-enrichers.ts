import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  interetsComposes,
  simulateurInflation,
  budgetResteAVivre,
  simulateurRetraite,
  rendementLivretA,
  rendementPea,
  coutTotalCreditConsommation,
  loaVsCreditAuto,
  fraisKilometriques,
} from "../src/lib/simulators/general/finance";

type Case = {
  slug: string;
  sim: { calculate: (input: Record<string, number | string>) => { summary: string; lines: { label: string; value: string; highlight?: boolean }[] } };
  input: Record<string, number | string>;
  minPrimary?: number;
};

const cases: Case[] = [
  {
    slug: "interets-composes",
    sim: interetsComposes,
    input: interetsComposes.defaultValues!,
    minPrimary: 10000,
  },
  {
    slug: "simulateur-inflation",
    sim: simulateurInflation,
    input: simulateurInflation.defaultValues!,
    minPrimary: 10000,
  },
  {
    slug: "budget-reste-a-vivre",
    sim: budgetResteAVivre,
    input: budgetResteAVivre.defaultValues!,
    minPrimary: 500,
  },
  {
    slug: "simulateur-retraite",
    sim: simulateurRetraite,
    input: simulateurRetraite.defaultValues!,
    minPrimary: 50000,
  },
  {
    slug: "rendement-livret-a",
    sim: rendementLivretA,
    input: rendementLivretA.defaultValues!,
    minPrimary: 500,
  },
  {
    slug: "rendement-pea",
    sim: rendementPea,
    input: rendementPea.defaultValues!,
    minPrimary: 10000,
  },
  {
    slug: "cout-total-credit-consommation",
    sim: coutTotalCreditConsommation,
    input: coutTotalCreditConsommation.defaultValues!,
    minPrimary: 500,
  },
  {
    slug: "loa-vs-credit-auto",
    sim: loaVsCreditAuto,
    input: loaVsCreditAuto.defaultValues!,
  },
  {
    slug: "frais-kilometriques",
    sim: fraisKilometriques,
    input: fraisKilometriques.defaultValues!,
    minPrimary: 1000,
  },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v.replace(/\/mois$/i, "")) ?? 0;
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

  const okPrimary =
    c.slug === "loa-vs-credit-auto"
      ? primaryText.length > 0 && (primaryText === "LOA" || primaryText === "Crédit auto")
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

console.log("\nAll LOT Finance enricher tests passed.");
