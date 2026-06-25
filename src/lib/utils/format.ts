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
