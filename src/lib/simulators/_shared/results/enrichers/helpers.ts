import type {
  ResultAdvice,
  ResultCallout,
  ResultComparison,
  ResultInterpretation,
  ResultPrimary,
  SimulatorResult,
} from "../../../types";
import { HCSF_TAUX_ENDETTEMENT_MAX } from "@/lib/config/aides";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { parseFormattedNumber, parsePercent } from "../parse";

export { formatCurrency, formatPercent, parseFormattedNumber, parsePercent };
export { HCSF_TAUX_ENDETTEMENT_MAX };

export type EnricherInput = Record<string, number | string>;
export type Enricher = (
  input: EnricherInput,
  result: SimulatorResult
) => SimulatorResult;

export const num = (v: number | string): number =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export function line(result: SimulatorResult, pattern: RegExp) {
  return result.lines.find((l) => pattern.test(l.label));
}

/** Alias — trouve une ligne par motif sur le label. */
export function findLine(
  result: SimulatorResult,
  pattern: RegExp | string
) {
  const re = typeof pattern === "string" ? new RegExp(pattern, "i") : pattern;
  return result.lines.find((l) => re.test(l.label));
}

export function lineValue(result: SimulatorResult, pattern: RegExp): string {
  return line(result, pattern)?.value ?? "";
}

/** Texte d'une ligne trouvée par motif (insensible à la casse). */
export function lineText(result: SimulatorResult, pattern: RegExp | string): string {
  return findLine(result, pattern)?.value ?? "";
}

export function lineAmount(
  result: SimulatorResult,
  pattern: RegExp
): number | null {
  return parseFormattedNumber(lineValue(result, pattern));
}

/** Montant parsé d'une ligne (€ ou %). */
export function findValue(
  result: SimulatorResult,
  pattern: RegExp | string
): number | null {
  const value = lineText(result, pattern);
  if (!value) return null;
  return parsePercent(value) ?? parseFormattedNumber(value);
}

/** Alias de findValue avec motif RegExp. */
export function lineNumber(
  result: SimulatorResult,
  pattern: RegExp | string
): number | null {
  return findValue(result, pattern);
}

/** Alias de findValue — montant numérique d'une ligne. */
export function findNumber(
  result: SimulatorResult,
  pattern: RegExp | string
): number | null {
  return findValue(result, pattern);
}

/** Pourcentage parsé d'une ligne. */
export function findPercent(
  result: SimulatorResult,
  pattern: RegExp | string
): number | null {
  const value = lineText(result, pattern);
  if (!value) return null;
  return parsePercent(value);
}

export function linePercent(
  result: SimulatorResult,
  pattern: RegExp
): number | null {
  return parsePercent(lineValue(result, pattern));
}

export function enrich(
  result: SimulatorResult,
  patch: Partial<SimulatorResult> & { primary?: ResultPrimary }
): SimulatorResult {
  const callouts = patch.callouts?.slice(0, 1);
  return {
    ...result,
    ...patch,
    callouts: callouts?.length ? callouts : undefined,
  };
}

/** Fusionne un enrichissement partiel dans le résultat existant. */
export function mergeResult(
  result: SimulatorResult,
  patch: Partial<SimulatorResult>
): SimulatorResult {
  return {
    ...result,
    ...patch,
    lines: patch.lines ?? result.lines,
    callouts: patch.callouts?.slice(0, 1),
    comparisons: patch.comparisons ?? result.comparisons,
  };
}

export function primaryFromLine(
  result: SimulatorResult,
  pattern: RegExp | string,
  label?: string
): ResultPrimary | undefined {
  const found = findLine(result, pattern);
  if (!found) return undefined;
  return { label: label ?? found.label, value: found.value };
}

type ThresholdRule = {
  max?: number;
  min?: number;
  level: ResultInterpretation["level"];
  badge: string;
  title: string;
  message: string;
};

/** Interprétation par seuils (première règle correspondante). */
export function interpretThreshold(
  value: number,
  rules: ThresholdRule[],
  mode: "ascending" | "descending" = "ascending"
): ResultInterpretation {
  const sorted =
    mode === "ascending"
      ? [...rules].sort((a, b) => (a.max ?? Infinity) - (b.max ?? Infinity))
      : [...rules].sort((a, b) => (b.min ?? -Infinity) - (a.min ?? -Infinity));

  for (const rule of sorted) {
    if (mode === "ascending" && rule.max != null && value <= rule.max) {
      return {
        level: rule.level,
        badge: rule.badge,
        title: rule.title,
        message: rule.message,
      };
    }
    if (mode === "descending" && rule.min != null && value >= rule.min) {
      return {
        level: rule.level,
        badge: rule.badge,
        title: rule.title,
        message: rule.message,
      };
    }
  }

  const fallback = rules[rules.length - 1];
  return {
    level: fallback.level,
    badge: fallback.badge,
    title: fallback.title,
    message: fallback.message,
  };
}

/** Raccourci enrich() avec primary, narrative, advice, comparisons, callout (max 1). */
export function buildPatch(
  result: SimulatorResult,
  opts: {
    primary?: ResultPrimary;
    narrative?: string;
    interpretation?: ResultInterpretation;
    advice?: ResultAdvice;
    comparisons?: ResultComparison[];
    callouts?: ResultCallout[];
  }
): SimulatorResult {
  return enrich(result, {
    primary: opts.primary,
    narrative: opts.narrative,
    interpretation: opts.interpretation,
    advice: opts.advice,
    comparisons: opts.comparisons?.length ? opts.comparisons : undefined,
    callouts: opts.callouts,
  });
}

export function oneCallout(callout: ResultCallout): ResultCallout[] {
  return [callout];
}

export function interpretationNeutral(message: string): ResultInterpretation {
  return { level: "neutral", title: "Estimation réalisée", message };
}

export function interpretationFavorable(
  badge: string,
  message: string
): ResultInterpretation {
  return { level: "favorable", badge, title: "Situation favorable", message };
}

export function interpretationWarning(
  badge: string,
  message: string
): ResultInterpretation {
  return { level: "warning", badge, title: "Point d'attention", message };
}

export function interpretationIntermediate(
  badge: string,
  message: string
): ResultInterpretation {
  return { level: "intermediate", badge, title: "À affiner", message };
}

export function interpretationTmi(tmi: number): ResultInterpretation {
  if (tmi <= 11) {
    return interpretationFavorable(
      "TMI basse",
      `Votre TMI de ${formatPercent(tmi, 0)} laisse de la marge pour l'option barème sur les revenus du capital.`
    );
  }
  if (tmi <= 30) {
    return interpretationIntermediate(
      "TMI moyenne",
      `Avec un TMI de ${formatPercent(tmi, 0)}, le PFU (12,8 % d'IR) devient souvent plus intéressant que le barème sur les capitaux.`
    );
  }
  return interpretationWarning(
    "TMI élevée",
    `TMI à ${formatPercent(tmi, 0)} : privilégiez le PFU, le PER et les leviers de réduction d'impôt.`
  );
}

export function interpretationTauxEffectif(
  taux: number,
  revenu: number
): ResultInterpretation {
  if (revenu <= 0) return interpretationNeutral("Aucun revenu imposable saisi.");
  if (taux <= 5) {
    return interpretationFavorable(
      "Faible pression",
      `Taux effectif de ${formatPercent(taux, 1)} — votre impôt reste modeste au regard de vos revenus.`
    );
  }
  if (taux <= 15) {
    return interpretationIntermediate(
      "Pression modérée",
      `Taux effectif de ${formatPercent(taux, 1)} — cohérent avec un revenu intermédiaire après quotient familial.`
    );
  }
  return interpretationWarning(
    "Pression forte",
    `Taux effectif de ${formatPercent(taux, 1)} — chaque euro gagné coûte cher en impôt marginal.`
  );
}

export function adviceItems(
  title: string,
  items: string[]
): ResultAdvice {
  return { title, items };
}

export function fmtEur(amount: number): string {
  return formatCurrency(amount);
}

export function fmtPct(value: number, decimals = 1): string {
  return formatPercent(value, decimals);
}
