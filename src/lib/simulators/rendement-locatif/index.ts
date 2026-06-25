import type { SimulatorDefinition } from "../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { rendementLocatifContent, rendementLocatifFaq } from "./content";

export interface RendementLocatifInput {
  prixAchat: number;
  fraisNotaire: number;
  travaux: number;
  loyerMensuel: number;
  chargesAnnuelles: number;
  vacanceLocative: number;
}

export const rendementLocatif: SimulatorDefinition<RendementLocatifInput> = {
  slug: "rendement-locatif",
  title: "Rendement locatif",
  shortDescription:
    "Calculez le rendement brut et net de votre investissement locatif en quelques secondes.",
  metaTitle:
    "Simulateur de rendement locatif — Calcul brut et net gratuit",
  metaDescription:
    "Estimez le rendement locatif brut et net de votre bien immobilier. Intégrez prix d'achat, frais de notaire, travaux, loyer et charges pour évaluer votre investissement.",
  keywords: [
    "rendement locatif",
    "calcul rendement immobilier",
    "investissement locatif",
    "rentabilité locative",
    "rendement brut net",
  ],
  category: "investissement",
  icon: "chart",
  content: rendementLocatifContent,
  faq: rendementLocatifFaq,
  calculate(input) {
    const investissementTotal =
      input.prixAchat + input.fraisNotaire + input.travaux;
    const loyerAnnuelBrut = input.loyerMensuel * 12;
    const loyerAnnuelEffectif =
      loyerAnnuelBrut * (1 - input.vacanceLocative / 100);
    const chargesAnnuelles = input.chargesAnnuelles;
    const revenuNetAnnuel = loyerAnnuelEffectif - chargesAnnuelles;

    const rendementBrut =
      investissementTotal > 0
        ? (loyerAnnuelBrut / investissementTotal) * 100
        : 0;
    const rendementNet =
      investissementTotal > 0
        ? (revenuNetAnnuel / investissementTotal) * 100
        : 0;
    const cashFlowMensuel = revenuNetAnnuel / 12;

    return {
      summary: `Rendement net estimé : ${formatPercent(rendementNet, 2)} (brut : ${formatPercent(rendementBrut, 2)}).`,
      lines: [
        {
          label: "Rendement brut",
          value: formatPercent(rendementBrut, 2),
          highlight: true,
          description: "Loyers annuels / investissement total",
        },
        {
          label: "Rendement net",
          value: formatPercent(rendementNet, 2),
          highlight: true,
          description: "Après charges et vacance locative",
        },
        {
          label: "Investissement total",
          value: formatCurrency(investissementTotal),
          description: "Achat + notaire + travaux",
        },
        {
          label: "Loyer mensuel",
          value: formatCurrency(input.loyerMensuel),
        },
        {
          label: "Loyer annuel effectif",
          value: formatCurrency(loyerAnnuelEffectif),
          description: `Vacance locative : ${formatPercent(input.vacanceLocative, 0)}`,
        },
        {
          label: "Charges annuelles",
          value: formatCurrency(chargesAnnuelles),
        },
        {
          label: "Revenu net annuel",
          value: formatCurrency(revenuNetAnnuel),
        },
        {
          label: "Cash-flow mensuel net",
          value: formatCurrency(cashFlowMensuel),
          description: "Revenus locatifs − charges, par mois",
        },
      ],
    };
  },
};
