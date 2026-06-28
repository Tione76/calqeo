export function formatCurrency(value: number, decimals = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals = 2): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function parseNumber(value: string): number {
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

/** Autorise les saisies numériques incomplètes (ex. « - », « 3. », « 3,5 »). */
export function isPartialNumericInput(value: string): boolean {
  return /^-?$|^-?\d*[.,]?\d*$/.test(value);
}

/** Supprime les zéros en tête inutiles tout en préservant les décimales partielles. */
export function sanitizeNumericInput(raw: string): string {
  if (raw === "" || raw === "-") return raw;
  if (raw.endsWith(".") || raw.endsWith(",")) return raw;

  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  const sepIndex = Math.max(unsigned.indexOf("."), unsigned.indexOf(","));

  if (sepIndex >= 0) {
    const intPart = unsigned.slice(0, sepIndex);
    const sep = unsigned[sepIndex];
    const fracPart = unsigned.slice(sepIndex + 1);
    const cleanInt = intPart.replace(/^0+(?=\d)/, "") || "0";
    return `${negative ? "-" : ""}${cleanInt}${sep}${fracPart}`;
  }

  const cleanInt = unsigned.replace(/^0+(?=\d)/, "") || "0";
  return `${negative ? "-" : ""}${cleanInt}`;
}

export function clampNumber(value: number, min?: number, max?: number): number {
  let result = value;
  if (min !== undefined && !Number.isNaN(min)) {
    result = Math.max(min, result);
  }
  if (max !== undefined && !Number.isNaN(max)) {
    result = Math.min(max, result);
  }
  return result;
}

export function formatNumericInputValue(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(value);
}

export function monthlyPaymentFromLoan(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const factor = Math.pow(1 + monthlyRate, months);

  return (principal * monthlyRate * factor) / (factor - 1);
}

export function loanFromMonthlyPayment(
  monthlyPayment: number,
  annualRate: number,
  years: number
): number {
  if (monthlyPayment <= 0 || years <= 0) return 0;
  if (annualRate <= 0) return monthlyPayment * years * 12;

  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  const factor = Math.pow(1 + monthlyRate, months);

  return (monthlyPayment * (factor - 1)) / (monthlyRate * factor);
}

export function totalInterest(
  monthlyPayment: number,
  years: number,
  principal: number
): number {
  return Math.max(0, monthlyPayment * years * 12 - principal);
}

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export function buildAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationRow[] {
  if (principal <= 0 || years <= 0) return [];

  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  const payment = monthlyPaymentFromLoan(principal, annualRate, years);
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= months; month++) {
    const interest =
      monthlyRate > 0 ? balance * monthlyRate : 0;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    rows.push({
      month,
      payment,
      interest,
      principal: principalPaid,
      balance,
    });
  }

  return rows;
}
