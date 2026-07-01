import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  impotSurLeRevenu,
  quotientFamilial,
  prelevementALaSource,
  flatTax30Pourcent,
  microEntrepreneurCharges,
  creditImpotEmploiDomicile,
  impotDividendes,
  tauxMarginalImposition,
  donationNumeraire,
  cesuCreditImpot,
} from "../src/lib/simulators/general/fiscalite-generale";

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
    slug: "impot-sur-le-revenu",
    sim: impotSurLeRevenu,
    input: impotSurLeRevenu.defaultValues!,
    minPrimary: 500,
  },
  {
    slug: "quotient-familial",
    sim: quotientFamilial,
    input: quotientFamilial.defaultValues!,
    minPrimary: 10000,
  },
  {
    slug: "prelevement-a-la-source",
    sim: prelevementALaSource,
    input: prelevementALaSource.defaultValues!,
    minPrimary: 50,
  },
  {
    slug: "flat-tax-30-pourcent",
    sim: flatTax30Pourcent,
    input: flatTax30Pourcent.defaultValues!,
    minPrimary: 500,
  },
  {
    slug: "micro-entrepreneur-charges",
    sim: microEntrepreneurCharges,
    input: microEntrepreneurCharges.defaultValues!,
    minPrimary: 10000,
  },
  {
    slug: "credit-impot-emploi-domicile",
    sim: creditImpotEmploiDomicile,
    input: creditImpotEmploiDomicile.defaultValues!,
    minPrimary: 1000,
  },
  {
    slug: "impot-dividendes",
    sim: impotDividendes,
    input: impotDividendes.defaultValues!,
    minPrimary: 2000,
  },
  {
    slug: "taux-marginal-imposition",
    sim: tauxMarginalImposition,
    input: tauxMarginalImposition.defaultValues!,
    minPrimary: 1,
  },
  {
    slug: "donation-numeraire",
    sim: donationNumeraire,
    input: { ...donationNumeraire.defaultValues!, montant: 120000 },
    minPrimary: 1000,
  },
  {
    slug: "cesu-credit-impot",
    sim: cesuCreditImpot,
    input: cesuCreditImpot.defaultValues!,
    minPrimary: 500,
  },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v) ?? 0;
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

  const okPrimary = c.textPrimary ? primaryText.length > 0 : primary > 0;
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

console.log("\nAll LOT Fiscalité générale enricher tests passed.");
