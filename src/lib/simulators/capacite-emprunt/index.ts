import type { SimulatorDefinition } from "../types";
import {
  loanFromMonthlyPayment,
  monthlyPaymentFromLoan,
  totalInterest,
  formatCurrency,
  formatPercent,
} from "@/lib/utils/format";
import { capaciteEmpruntContent, capaciteEmpruntFaq } from "./content";
import { FRAIS_NOTAIRE_FACTEUR_BUDGET } from "@/lib/config/aides";

export interface CapaciteEmpruntInput {
  revenusMensuels: number;
  chargesMensuelles: number;
  tauxEndettement: number;
  dureeAnnees: number;
  tauxInteret: number;
  apportPersonnel: number;
}

export const capaciteEmprunt: SimulatorDefinition<CapaciteEmpruntInput> = {
  slug: "capacite-emprunt",
  title: "Capacité d'emprunt",
  shortDescription:
    "Estimez le montant maximum que vous pouvez emprunter et votre budget d'achat selon vos revenus, votre apport et votre taux d'endettement.",
  metaTitle:
    "Simulateur de capacité d'emprunt immobilier — Calcul gratuit 2025",
  metaDescription:
    "Calculez votre capacité d'emprunt et votre budget d'achat immobilier en fonction de vos revenus, apport personnel, charges et taux d'endettement. Estimation gratuite et instantanée.",
  keywords: [
    "capacité emprunt",
    "calcul capacité emprunt",
    "simulation prêt immobilier",
    "taux endettement",
    "combien emprunter",
    "apport personnel",
    "budget achat immobilier",
  ],
  category: "financement",
  icon: "wallet",
  content: capaciteEmpruntContent,
  faq: capaciteEmpruntFaq,
  calculate(input) {
    const revenusDisponibles = Math.max(
      0,
      input.revenusMensuels - input.chargesMensuelles
    );
    const mensualiteMax =
      revenusDisponibles * (input.tauxEndettement / 100);
    const capaciteEmprunt = loanFromMonthlyPayment(
      mensualiteMax,
      input.tauxInteret,
      input.dureeAnnees
    );
    const mensualiteReelle = monthlyPaymentFromLoan(
      capaciteEmprunt,
      input.tauxInteret,
      input.dureeAnnees
    );
    const interets = totalInterest(
      mensualiteReelle,
      input.dureeAnnees,
      capaciteEmprunt
    );
    const tauxEndettementReel =
      input.revenusMensuels > 0
        ? (mensualiteReelle / input.revenusMensuels) * 100
        : 0;
    const apportPersonnel = Math.max(0, input.apportPersonnel);
    const budgetAchatTotal = capaciteEmprunt + apportPersonnel;
    const prixBienEstime = budgetAchatTotal / FRAIS_NOTAIRE_FACTEUR_BUDGET;
    const fraisNotaireEstimes = budgetAchatTotal - prixBienEstime;
    const tauxApport =
      budgetAchatTotal > 0 ? (apportPersonnel / budgetAchatTotal) * 100 : 0;

    const summaryApport =
      apportPersonnel > 0
        ? ` Budget d'achat estimé : ${formatCurrency(budgetAchatTotal)} (crédit + apport).`
        : "";

    return {
      summary: `Vous pouvez emprunter environ ${formatCurrency(capaciteEmprunt)} sur ${input.dureeAnnees} ans.${summaryApport}`,
      lines: [
        {
          label: "Capacité d'emprunt estimée",
          value: formatCurrency(capaciteEmprunt),
          highlight: true,
          description: "Montant maximum du capital empruntable",
        },
        {
          label: "Apport personnel",
          value: formatCurrency(apportPersonnel),
          description: "Épargne consacrée au projet d'achat",
        },
        {
          label: "Budget d'achat total",
          value: formatCurrency(budgetAchatTotal),
          highlight: true,
          description: "Capacité d'emprunt + apport personnel",
        },
        {
          label: "Prix du bien accessible (estimation)",
          value: formatCurrency(prixBienEstime),
          description:
            "Hors frais de notaire, estimés à ~8 % (≈ " +
            formatCurrency(fraisNotaireEstimes) +
            ")",
        },
        {
          label: "Part de l'apport dans le budget",
          value: formatPercent(tauxApport, 1),
          description: "Apport / (crédit + apport)",
        },
        {
          label: "Mensualité maximale",
          value: formatCurrency(mensualiteReelle),
          description: "Hors assurance emprunteur",
        },
        {
          label: "Revenus disponibles",
          value: formatCurrency(revenusDisponibles),
          description: "Revenus − charges mensuelles",
        },
        {
          label: "Taux d'endettement appliqué",
          value: formatPercent(input.tauxEndettement, 0),
        },
        {
          label: "Taux d'endettement réel",
          value: formatPercent(tauxEndettementReel, 1),
        },
        {
          label: "Coût total des intérêts",
          value: formatCurrency(interets),
          description: `Sur ${input.dureeAnnees} ans à ${formatPercent(input.tauxInteret, 2)}`,
        },
        {
          label: "Coût total du crédit",
          value: formatCurrency(capaciteEmprunt + interets),
          description: "Capital + intérêts",
        },
      ],
    };
  },
};
