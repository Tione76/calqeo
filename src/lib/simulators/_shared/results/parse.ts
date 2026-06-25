/** Extrait un nombre d'une chaîne formatée (ex. "31,8 %", "285 000 €"). */
export function parseFormattedNumber(value: string): number | null {
  const cleaned = value
    .replace(/\s/g, "")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function parsePercent(value: string): number | null {
  if (!value.includes("%")) return null;
  return parseFormattedNumber(value);
}
