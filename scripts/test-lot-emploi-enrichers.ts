import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import {
  salaireBrutNet,
  salaireNetBrut,
  coutTotalEmbauche,
  indemnitesLicenciement,
  congesPayesAcquis,
  ijssArretMaladie,
  allocationChomageAre,
  heuresSupplementaires,
  salaireTempsPartiel,
  smicNet,
} from "../src/lib/simulators/general/emploi";

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
  { slug: "salaire-brut-net", sim: salaireBrutNet, input: salaireBrutNet.defaultValues!, minPrimary: 1500 },
  { slug: "salaire-net-brut", sim: salaireNetBrut, input: salaireNetBrut.defaultValues!, minPrimary: 2000 },
  { slug: "cout-total-embauche-salarie", sim: coutTotalEmbauche, input: coutTotalEmbauche.defaultValues!, minPrimary: 3000 },
  { slug: "indemnites-licenciement", sim: indemnitesLicenciement, input: indemnitesLicenciement.defaultValues!, minPrimary: 1000 },
  { slug: "conges-payes-acquis", sim: congesPayesAcquis, input: congesPayesAcquis.defaultValues!, minPrimary: 10 },
  { slug: "ijss-arret-maladie", sim: ijssArretMaladie, input: ijssArretMaladie.defaultValues!, minPrimary: 10 },
  { slug: "allocation-chomage-are", sim: allocationChomageAre, input: allocationChomageAre.defaultValues!, minPrimary: 500 },
  { slug: "heures-supplementaires", sim: heuresSupplementaires, input: heuresSupplementaires.defaultValues!, minPrimary: 100 },
  { slug: "salaire-temps-partiel", sim: salaireTempsPartiel, input: salaireTempsPartiel.defaultValues!, minPrimary: 1000 },
  { slug: "smic-net", sim: smicNet, input: smicNet.defaultValues!, minPrimary: 1000 },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return parsePercent(v) ?? parseFormattedNumber(v.replace(/\/(mois|jour|h)$/i, "").replace(/ jours$/i, "")) ?? 0;
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

console.log("\nAll LOT Emploi enricher tests passed.");
