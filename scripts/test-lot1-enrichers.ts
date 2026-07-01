import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import { deficitFoncier, donationSuccession, locationMeubleeVsNue, ifiFortuneImmobiliere } from "../src/lib/simulators/additional/fiscalite-2";
import { encadrementLoyers, depotGarantieLocatif, chargesRecuperables, loyerChargesComprises } from "../src/lib/simulators/additional/gestion-2";

type Case = {
  slug: string;
  sim: { calculate: (input: Record<string, number | string>) => { summary: string; lines: { label: string; value: string; highlight?: boolean }[] } };
  input: Record<string, number | string>;
  expectPrimaryNonZero?: boolean;
  minPrimary?: number;
};

const cases: Case[] = [
  {
    slug: "deficit-foncier",
    sim: deficitFoncier,
    input: { loyers: 9000, charges: 2000, interets: 5500, travaux: 12000, tmi: 30 },
    expectPrimaryNonZero: true,
    minPrimary: 5000,
  },
  {
    slug: "donation-succession-immobiliere",
    sim: donationSuccession,
    input: { valeurBien: 350000, lien: "enfant", abattementUtilise: 0 },
    expectPrimaryNonZero: true,
    minPrimary: 10000,
  },
  {
    slug: "location-meublee-vs-nue",
    sim: locationMeubleeVsNue,
    input: { investissement: 180000, loyerNue: 750, loyerMeublee: 900, chargesNue: 2800, chargesMeublee: 3200, tmi: 30 },
    expectPrimaryNonZero: true,
    minPrimary: 1,
  },
  {
    slug: "ifi-impot-fortune-immobiliere",
    sim: ifiFortuneImmobiliere,
    input: { patrimoineBrut: 1800000, dettes: 200000, valeurRP: 650000 },
    expectPrimaryNonZero: true,
    minPrimary: 1000,
  },
  {
    slug: "encadrement-loyers",
    sim: encadrementLoyers,
    input: { loyerReference: 32, surface: 45, complementLoyer: 0, loyerActuel: 1550, zone: "30" },
    expectPrimaryNonZero: true,
    minPrimary: 1700,
  },
  {
    slug: "depot-garantie-locatif",
    sim: depotGarantieLocatif,
    input: { loyerHC: 850, typeBail: "nu", depotDemande: 1700 },
    expectPrimaryNonZero: true,
    minPrimary: 1700,
  },
  {
    slug: "charges-recuperables-locataire",
    sim: chargesRecuperables,
    input: { chargesCopro: 1800, eau: 240, chauffage: 600, ordures: 180, entretien: 400 },
    expectPrimaryNonZero: true,
    minPrimary: 3000,
  },
  {
    slug: "loyer-charges-comprises",
    sim: loyerChargesComprises,
    input: { mode: "cc_vers_hc", loyer: 950, charges: 120 },
    expectPrimaryNonZero: true,
    minPrimary: 800,
  },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v) ?? 0;
}

let failed = 0;

for (const c of cases) {
  const raw = c.sim.calculate(c.input);
  const normalized = applyBaseNormalization(raw);
  const enriched = enrichSimulatorResult(c.slug, c.input, raw);
  const primary = primaryValue(enriched);
  const computedPrimary = primaryValue(applyBaseNormalization(enriched));

  const okPrimary = c.expectPrimaryNonZero ? primary > 0 : true;
  const okMin = c.minPrimary != null ? primary >= c.minPrimary : true;
  const narrativeOk = Boolean(enriched.narrative && enriched.narrative.length > 20);
  const linesOk = (enriched.lines?.length ?? 0) > 0;
  const calloutOk = (enriched.callouts?.length ?? 0) > 0;
  const pass = okPrimary && okMin && narrativeOk && linesOk && calloutOk;

  console.log(
    `${pass ? "PASS" : "FAIL"} ${c.slug}`,
    `primary=${enriched.primary?.value}`,
    `narrative=${narrativeOk}`,
    `lines=${enriched.lines?.length ?? 0}`,
    `callouts=${enriched.callouts?.length ?? 0}`
  );

  if (!pass) {
    failed++;
    console.log("  raw summary:", raw.summary);
    console.log("  normalized primary removed from lines:", normalized.lines.length, "->", enriched.lines?.length);
    console.log("  primary numeric:", primary, "min:", c.minPrimary);
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}

console.log("\nAll LOT 1 enricher tests passed.");
