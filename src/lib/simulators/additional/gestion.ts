import type { SimulatorDefinition } from "../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const revisionLoyerIrl: SimulatorDefinition = {
  slug: "revision-loyer-irl",
  title: "Révision de loyer (IRL)",
  shortDescription:
    "Calculez le nouveau loyer après révision annuelle basée sur l'IRL.",
  metaTitle: "Simulateur révision loyer IRL — Calcul légal",
  metaDescription:
    "Calculez la révision annuelle de loyer selon l'IRL : loyer actuel, indice de référence et nouvel indice INSEE.",
  keywords: ["révision loyer", "IRL", "indice référence loyers"],
  category: "gestion",
  icon: "percent",
  relatedSlugs: ["rendement-locatif-net", "cash-flow-immobilier", "rendement-locatif"],
  formFields: [
    { key: "loyerActuel", label: "Loyer mensuel actuel (hors charges)", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "irlAncien", label: "IRL de référence (bail)", type: "number", min: 100, step: 0.01, hint: "Ex : 142,06" },
    { key: "irlNouveau", label: "Nouvel IRL publié", type: "number", min: 100, step: 0.01 },
  ],
  defaultValues: { loyerActuel: 850, irlAncien: 142.06, irlNouveau: 145.77 },
  content: buildContent({
    intro: "En location vide, le bailleur peut réviser le loyer une fois par an selon l'IRL, si une clause le prévoit.",
    howItWorks: [
      {
        title: "Formule légale",
        blocks: [
          hl("Révision IRL", "Nouveau loyer = Loyer actuel × (Nouvel IRL / IRL de référence du bail)"),
          p("L'IRL est publié trimestriellement par l'INSEE."),
        ],
      },
    ],
    example: {
      title: "Exemple",
      blocks: [p("850 € × 145,77 / 142,06 = 872,24 € (+22,24 €/mois).")],
    },
    conseils: ["Vérifiez la clause de révision dans le bail.", "Informez le locataire par écrit."],
    limites: ["Location vide avec clause IRL.", "Plafonnements zones tendues non détaillés."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que l'IRL ?", answer: "Indice de Référence des Loyers publié par l'INSEE." },
    { question: "Sans clause IRL ?", answer: "Pas de révision possible." },
    { question: "Quand réviser ?", answer: "Une fois par an à la date prévue au bail." },
    { question: "Location meublée ?", answer: "Souvent IRL aussi ; certains baux anciens utilisent l'ICC." },
  ]),
  calculate(input) {
    const loyer = num(input.loyerActuel);
    const irlA = num(input.irlAncien);
    const irlN = num(input.irlNouveau);
    const nouveau = irlA > 0 ? loyer * (irlN / irlA) : loyer;
    const hausse = nouveau - loyer;
    const pct = loyer > 0 ? (hausse / loyer) * 100 : 0;
    return {
      summary: `Nouveau loyer : ${formatCurrency(nouveau)}/mois (+${formatCurrency(hausse)}).`,
      lines: [
        { label: "Nouveau loyer mensuel", value: formatCurrency(nouveau), highlight: true },
        { label: "Augmentation mensuelle", value: formatCurrency(hausse) },
        { label: "Variation", value: formatPercent(pct, 2) },
        { label: "Loyer actuel", value: formatCurrency(loyer) },
      ],
    };
  },
};

export const gestionSimulators = [revisionLoyerIrl];
