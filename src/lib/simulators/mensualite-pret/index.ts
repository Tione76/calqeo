import type { SimulatorDefinition } from "../types";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
  totalInterest,
} from "@/lib/utils/format";
import { mensualitePretContent, mensualitePretFaq } from "./content";

export interface MensualitePretInput {
  montantEmprunt: number;
  tauxInteret: number;
  dureeAnnees: number;
  tauxAssurance: number;
}

export const mensualitePret: SimulatorDefinition<MensualitePretInput> = {
  slug: "mensualite-pret-immobilier",
  title: "Mensualité de prêt immobilier",
  shortDescription:
    "Calculez la mensualité de votre crédit immobilier selon le montant, la durée et le taux d'intérêt.",
  metaTitle:
    "Simulateur de mensualité de prêt immobilier — Calcul gratuit",
  metaDescription:
    "Estimez votre mensualité de crédit immobilier en fonction du montant emprunté, du taux d'intérêt et de la durée. Simulation gratuite avec coût total des intérêts.",
  keywords: [
    "mensualité crédit immobilier",
    "calcul mensualité prêt",
    "simulation crédit immo",
    "échéance mensuelle",
    "simulateur prêt immobilier",
  ],
  category: "financement",
  icon: "home",
  relatedSlugs: [
    "capacite-emprunt",
    "tableau-amortissement",
    "cout-total-credit-immobilier",
  ],
  content: mensualitePretContent,
  faq: mensualitePretFaq,
  calculate(input) {
    const mensualiteHorsAssurance = monthlyPaymentFromLoan(
      input.montantEmprunt,
      input.tauxInteret,
      input.dureeAnnees
    );
    const assuranceMensuelle =
      (input.montantEmprunt * (input.tauxAssurance / 100)) / 12;
    const mensualiteTotale = mensualiteHorsAssurance + assuranceMensuelle;
    const interets = totalInterest(
      mensualiteHorsAssurance,
      input.dureeAnnees,
      input.montantEmprunt
    );
    const coutAssurance = assuranceMensuelle * input.dureeAnnees * 12;
    const coutTotal = input.montantEmprunt + interets + coutAssurance;
    const capitalRemboursePremierMois =
      mensualiteHorsAssurance -
      (input.montantEmprunt * (input.tauxInteret / 100)) / 12;

    return {
      summary: `Mensualité estimée : ${formatCurrency(mensualiteTotale)} (hors assurance : ${formatCurrency(mensualiteHorsAssurance)}).`,
      lines: [
        {
          label: "Mensualité totale",
          value: formatCurrency(mensualiteTotale),
          highlight: true,
          description: "Crédit + assurance emprunteur",
        },
        {
          label: "Mensualité hors assurance",
          value: formatCurrency(mensualiteHorsAssurance),
          description: "Capital + intérêts uniquement",
        },
        {
          label: "Assurance mensuelle",
          value: formatCurrency(assuranceMensuelle),
          description: `Taux assurance : ${formatPercent(input.tauxAssurance, 2)} / an`,
        },
        {
          label: "Montant emprunté",
          value: formatCurrency(input.montantEmprunt),
        },
        {
          label: "Durée du prêt",
          value: `${input.dureeAnnees} ans (${input.dureeAnnees * 12} mois)`,
        },
        {
          label: "Taux d'intérêt",
          value: formatPercent(input.tauxInteret, 2),
        },
        {
          label: "Coût total des intérêts",
          value: formatCurrency(interets),
        },
        {
          label: "Coût total de l'assurance",
          value: formatCurrency(coutAssurance),
        },
        {
          label: "Coût total du crédit",
          value: formatCurrency(coutTotal),
          description: "Capital + intérêts + assurance",
        },
        {
          label: "Capital remboursé (1er mois)",
          value: formatCurrency(Math.max(0, capitalRemboursePremierMois)),
          description: "Part amortissement de la 1ère échéance",
        },
      ],
    };
  },
};
