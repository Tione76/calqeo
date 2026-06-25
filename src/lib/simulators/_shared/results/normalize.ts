import type {
  ResultLine,
  ResultPrimary,
  SimulatorResult,
} from "../../types";

/** Choisit la ligne à mettre en avant comme résultat principal. */
export function pickPrimaryLine(lines: ResultLine[]): ResultPrimary | undefined {
  if (lines.length === 0) return undefined;

  const highlighted = lines.filter((l) => l.highlight);
  const preferred =
    highlighted.find((l) => /net|estimé|total|taux|capacité|rendement|imc|salaire/i.test(l.label)) ??
    highlighted.find((l) => !/brut/i.test(l.label)) ??
    highlighted[0] ??
    lines[0];

  return { label: preferred.label, value: preferred.value };
}

/** Lignes secondaires sans doublon du résultat principal. */
export function secondaryLines(
  lines: ResultLine[],
  primary?: ResultPrimary
): ResultLine[] {
  return lines
    .filter((l) => !primary || l.label !== primary.label)
    .map((l) => ({ ...l, highlight: false }));
}

export function applyBaseNormalization(raw: SimulatorResult): SimulatorResult {
  const primary = raw.primary ?? pickPrimaryLine(raw.lines);
  const narrative =
    raw.narrative ??
    (raw.summary.trim() !== primary?.value ? raw.summary : undefined);
  const lines = secondaryLines(raw.lines, primary);

  return {
    ...raw,
    primary,
    narrative,
    lines,
  };
}
