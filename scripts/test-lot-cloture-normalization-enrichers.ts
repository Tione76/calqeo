import { applyBaseNormalization } from "../src/lib/simulators/_shared/results/normalize";
import { enrichSimulatorResult } from "../src/lib/simulators/_shared/results";
import { parseFormattedNumber, parsePercent } from "../src/lib/simulators/_shared/results/parse";
import { rendementLocatif } from "../src/lib/simulators/rendement-locatif";
import {
  fraisNotaire,
  tauxEndettement,
} from "../src/lib/simulators/additional/financement-1";
import { assuranceEmprunteur } from "../src/lib/simulators/additional/financement-2";
import { revisionLoyerIrl } from "../src/lib/simulators/additional/gestion";
import { revisionLoyerCommercial } from "../src/lib/simulators/additional/gestion-2";
import {
  quantitePeinture,
  volumeBeton,
} from "../src/lib/simulators/general/travaux";
import {
  calculateurImc,
  dateAccouchement,
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

const rendementLocatifDefaults = {
  prixAchat: 180000,
  fraisNotaire: 14400,
  travaux: 10000,
  loyerMensuel: 850,
  chargesAnnuelles: 2400,
  vacanceLocative: 5,
};

const cases: Case[] = [
  {
    slug: "rendement-locatif",
    sim: rendementLocatif,
    input: rendementLocatifDefaults,
    minPrimary: 1,
  },
  {
    slug: "frais-de-notaire",
    sim: fraisNotaire,
    input: fraisNotaire.defaultValues!,
    minPrimary: 1000,
  },
  {
    slug: "assurance-emprunteur",
    sim: assuranceEmprunteur,
    input: assuranceEmprunteur.defaultValues!,
    minPrimary: 50,
  },
  {
    slug: "revision-loyer-irl",
    sim: revisionLoyerIrl,
    input: revisionLoyerIrl.defaultValues!,
    minPrimary: 800,
  },
  {
    slug: "revision-loyer-commercial",
    sim: revisionLoyerCommercial,
    input: revisionLoyerCommercial.defaultValues!,
    minPrimary: 20000,
  },
  {
    slug: "taux-endettement",
    sim: tauxEndettement,
    input: tauxEndettement.defaultValues!,
    minPrimary: 30,
  },
  {
    slug: "quantite-peinture",
    sim: quantitePeinture,
    input: quantitePeinture.defaultValues!,
    minPrimary: 1,
  },
  {
    slug: "volume-beton",
    sim: volumeBeton,
    input: volumeBeton.defaultValues!,
    minPrimary: 2,
  },
  {
    slug: "calculateur-imc",
    sim: calculateurImc,
    input: calculateurImc.defaultValues!,
    minPrimary: 18,
  },
  {
    slug: "date-accouchement",
    sim: dateAccouchement,
    input: dateAccouchement.defaultValues!,
    textPrimary: true,
  },
];

function primaryValue(result: ReturnType<typeof enrichSimulatorResult>): number {
  const v = result.primary?.value ?? "";
  return (
    parsePercent(v) ??
    parseFormattedNumber(
      v.replace(/\/(mois|jour|h|an)$/i, "").replace(/ L$/i, "").replace(/ m³$/i, "")
    ) ??
    0
  );
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

  const highlightStillInLines = normalized.lines.some((l) => l.highlight);
  const okPrimary = c.textPrimary ? primaryText.length > 3 : primary > 0;
  const okMin = c.minPrimary != null ? primary >= c.minPrimary : true;
  const narrativeOk = Boolean(enriched.narrative && enriched.narrative.length > 20);
  const interpretationOk = Boolean(enriched.interpretation?.title);
  const pass = okPrimary && okMin && narrativeOk && interpretationOk && !highlightStillInLines;

  console.log(
    `${pass ? "PASS" : "FAIL"} ${c.slug}`,
    `primary=${enriched.primary?.value}`,
    `narrative=${narrativeOk}`,
    `interpretation=${interpretationOk}`,
    `normalizedHighlights=${highlightStillInLines}`
  );

  if (!pass) {
    failed++;
    console.log("  normalized lines:", normalized.lines.map((l) => l.label).join(", "));
    console.log("  primary numeric:", primary, "text:", primaryText);
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${cases.length} tests FAILED`);
  process.exit(1);
}

console.log(`\n${cases.length}/${cases.length} tests PASSED`);
