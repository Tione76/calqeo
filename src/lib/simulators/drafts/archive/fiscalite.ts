import type {
  FormField,
  SimulatorCategory,
  SimulatorDefinition,
  SimulatorIcon,
  SimulatorResult,
} from "../../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";
import { calculerImpotBareme } from "@/data/regulations/impot";
import {
  PFU_TAUX_GLOBAL,
  TVA_TAUX,
  FRANCHISE_TVA,
} from "@/data/regulations/fiscalite";
import {
  calculerIfi,
  IFI_SEUIL,
  IFI_ABATTEMENT_RP,
} from "@/data/regulations/ifi";
import {
  calculerDroitsMutation,
  DONATION_ABATTEMENT_ENFANT,
} from "@/data/regulations/donation";
import { MICRO_ENTREPRENEUR_PLAFONDS } from "@/data/regulations/urssaf";

const DENORMANDIE_TAUX = 0.21;

type DraftSpec = {
  slug: string;
  title: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: SimulatorCategory;
  icon: SimulatorIcon;
  regulationIds?: string[];
  formFields: FormField[];
  defaultValues: Record<string, number | string>;
  intro: string;
  howTitle: string;
  howDetail: string;
  faqItems: { question: string; answer: string }[];
  relatedSlugs?: string[];
  calculate: (input: Record<string, number | string>) => SimulatorResult;
};

function createDraft(spec: DraftSpec): SimulatorDefinition {
  return draftSimulator({
    slug: spec.slug,
    title: spec.title,
    shortDescription: spec.shortDescription,
    metaTitle: spec.metaTitle,
    metaDescription: spec.metaDescription,
    keywords: spec.keywords,
    domain: "fiscalite",
    category: spec.category,
    icon: spec.icon,
    regulationIds: spec.regulationIds,
    relatedSlugs: spec.relatedSlugs,
    formFields: spec.formFields,
    defaultValues: spec.defaultValues,
    content: buildContent({
      intro: spec.intro,
      howItWorks: [{ title: spec.howTitle, blocks: [p(spec.howDetail), hl("Estimation", "Calcul simplifié — consultez impots.gouv.fr ou un fiscaliste.")] }],
      conseils: ["Conservez tous les justificatifs de dépenses et revenus.", "Anticipez les échéances de déclaration et de paiement."],
      limites: ["Estimation pédagogique — ne remplace pas une liasse fiscale.", "Barèmes 2025 — révisions annuelles possibles."],
    }),
    faq: buildFaq(spec.faqItems),
    calculate: spec.calculate,
  });
}

const defiscalisationDenormandie = createDraft({
  slug: "simulateur-defiscalisation-denormandie",
  title: "Défiscalisation Denormandie",
  shortDescription: "Estimez la réduction d'impôt Denormandie pour rénovation locative en zone éligible.",
  metaTitle: "Simulateur Denormandie — Réduction impôt rénovation",
  metaDescription: "Calculez la réduction Denormandie : 12 à 21 % des travaux en zone Action cœur de ville.",
  keywords: ["Denormandie", "défiscalisation rénovation", "Action cœur de ville"],
  category: "fiscalite",
  icon: "home",
  regulationIds: ["fiscalite", "immobilier"],
  relatedSlugs: ["simulateur-defiscalisation-pinel", "budget-travaux"],
  formFields: [
    { key: "coutTravaux", label: "Coût total travaux + acquisition", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "dureeEngagement", label: "Durée engagement locatif", type: "select", options: [{ value: "6", label: "6 ans (12 %)" }, { value: "9", label: "9 ans (18 %)" }, { value: "12", label: "12 ans (21 %)" }] },
  ],
  defaultValues: { coutTravaux: 200000, dureeEngagement: "9" },
  intro: "Denormandie encourage la rénovation de l'habitat ancien en centre-ville avec réduction d'impôt.",
  howTitle: "Réduction Denormandie",
  howDetail: "Mêmes taux que Pinel (12/18/21 %) sur le coût total plafonné 300 000 €.",
  faqItems: [
    { question: "Quelles communes ?", answer: "Communes éligibles Action cœur de ville ou opération de revitalisation." },
    { question: "Quels travaux ?", answer: "Rénovation lourde représentant au moins 25 % du coût total de l'opération." },
  ],
  calculate(input) {
    const cout = Math.min(num(input.coutTravaux), 300000);
    const duree = String(input.dureeEngagement);
    const taux = duree === "12" ? DENORMANDIE_TAUX : duree === "9" ? 0.18 : 0.12;
    const reduction = cout * taux;
    return {
      summary: `Réduction Denormandie : ${formatCurrency(reduction)} (${formatPercent(taux * 100, 0)}).`,
      lines: [
        { label: "Réduction d'impôt", value: formatCurrency(reduction), highlight: true },
        { label: "Coût retenu", value: formatCurrency(cout) },
        { label: "Durée engagement", value: `${duree} ans` },
        { label: "Taux", value: formatPercent(taux * 100, 0) },
      ],
    };
  },
});

export const archivedFiscaliteDrafts: SimulatorDefinition[] = [
  defiscalisationDenormandie,
];
