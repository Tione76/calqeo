import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  calculateurTjmFreelance,
  revenuNetIndependant,
  sasuRemunerationDividendes,
  portageSalarialVsFreelance,
  seuilFranchiseTva,
  breakEvenEntreprise,
  margeCommercialeTaux,
  coutHoraireChargeTns,
  exonerationAcre,
  facturationObjectifRevenuNet,
} from "../src/lib/simulators/general/entreprise";

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
  {
    slug: "calculateur-tjm-freelance",
    sim: calculateurTjmFreelance,
    input: calculateurTjmFreelance.defaultValues!,
    minPrimary: 200,
  },
  {
    slug: "revenu-net-independant",
    sim: revenuNetIndependant,
    input: revenuNetIndependant.defaultValues!,
    minPrimary: 1000,
  },
  {
    slug: "sasu-remuneration-dividendes",
    sim: sasuRemunerationDividendes,
    input: sasuRemunerationDividendes.defaultValues!,
    minPrimary: 1000,
  },
  {
    slug: "portage-salarial-vs-freelance",
    sim: portageSalarialVsFreelance,
    input: portageSalarialVsFreelance.defaultValues!,
    textPrimary: true,
  },
  {
    slug: "seuil-franchise-tva",
    sim: seuilFranchiseTva,
    input: seuilFranchiseTva.defaultValues!,
    textPrimary: true,
  },
  {
    slug: "break-even-entreprise",
    sim: breakEvenEntreprise,
    input: breakEvenEntreprise.defaultValues!,
    minPrimary: 500,
  },
  {
    slug: "marge-commerciale-taux",
    sim: margeCommercialeTaux,
    input: margeCommercialeTaux.defaultValues!,
    minPrimary: 10,
  },
  {
    slug: "cout-horaire-charge-tns",
    sim: coutHoraireChargeTns,
    input: coutHoraireChargeTns.defaultValues!,
    minPrimary: 30,
  },
  {
    slug: "exoneration-acre",
    sim: exonerationAcre,
    input: exonerationAcre.defaultValues!,
    minPrimary: 100,
  },
  {
    slug: "facturation-objectif-revenu-net",
    sim: facturationObjectifRevenuNet,
    input: facturationObjectifRevenuNet.defaultValues!,
    minPrimary: 2000,
  },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v.replace(/\/(mois|jour|h|an)$/i, "").replace(/ HT$/i, "")) ?? 0;
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
    ? primaryText.length > 0
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

console.log("\nAll LOT Entreprise enricher tests passed.");
