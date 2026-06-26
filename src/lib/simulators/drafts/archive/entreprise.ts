import type {
  FormField,
  SimulatorCategory,
  SimulatorDefinition,
  SimulatorIcon,
  SimulatorResult,
} from "../../types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";
import {
  COTISATIONS_PATRONALES_DEFAUT,
  MICRO_ENTREPRENEUR_PLAFONDS,
  PORTAGE_NET_CA_RATIO,
} from "@/data/regulations/urssaf";
import {
  PFU_TAUX_GLOBAL,
  PFU_NET_RATIO,
  TVA_TAUX,
} from "@/data/regulations/fiscalite";

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
    domain: "entreprise",
    category: spec.category,
    icon: spec.icon,
    regulationIds: spec.regulationIds,
    relatedSlugs: spec.relatedSlugs,
    formFields: spec.formFields,
    defaultValues: spec.defaultValues,
    content: buildContent({
      intro: spec.intro,
      howItWorks: [{ title: spec.howTitle, blocks: [p(spec.howDetail), hl("Estimation", "Calcul simplifié — faites valider par votre expert-comptable.")] }],
      conseils: ["Anticipez les échéances fiscales et sociales avec un suivi comptable régulier.", "Comparez les régimes fiscaux avant toute modification de statut."],
      limites: ["Estimation pédagogique — options fiscales et cas particuliers non exhaustifs.", "Barèmes 2025 — révisions possibles."],
    }),
    faq: buildFaq(spec.faqItems),
    calculate: spec.calculate,
  });
}

const creanceCovidEntreprise = createDraft({
  slug: "simulateur-creance-covid-entreprise",
  title: "Créance COVID entreprise",
  shortDescription: "Estimez le montant d'une créance ou aide COVID-19 non encore remboursée.",
  metaTitle: "Simulateur créance COVID entreprise — Aides et PGE",
  metaDescription: "Estimez le solde restant d'aides COVID, PGE ou reports de charges pour votre entreprise.",
  keywords: ["créance COVID entreprise", "PGE remboursement", "aide COVID entreprise"],
  category: "entreprise-gestion",
  icon: "wallet",
  relatedSlugs: ["simulateur-cout-chomage-employeur", "break-even-entreprise"],
  formFields: [
    { key: "montantInitial", label: "Montant initial de l'aide/PGE", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "dejaRembourse", label: "Déjà remboursé", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "tauxInteret", label: "Taux d'intérêt annuel", type: "number", min: 0, max: 5, step: 0.1, suffix: "%" },
  ],
  defaultValues: { montantInitial: 50000, dejaRembourse: 20000, tauxInteret: 1 },
  intro: "Les entreprises peuvent encore avoir des créances ou dettes liées aux dispositifs COVID-19 (PGE, reports, activité partielle).",
  howTitle: "Solde et intérêts",
  howDetail: "Solde restant = montant initial − remboursements + intérêts courus.",
  faqItems: [
    { question: "Le PGE est-il encore en cours ?", answer: "Les PGE souscrits pendant la crise peuvent encore être en phase de remboursement différé ou amortissement." },
    { question: "Les aides activité partielle sont-elles remboursables ?", answer: "Certaines ont fait l'objet de contrôles et de régularisations — consultez votre comptable." },
  ],
  calculate(input) {
    const initial = num(input.montantInitial);
    const remb = num(input.dejaRembourse);
    const taux = num(input.tauxInteret) / 100;
    const solde = Math.max(0, initial - remb);
    const interets = solde * taux;
    return {
      summary: `Solde restant : ${formatCurrency(solde)} — intérêts annuels : ${formatCurrency(interets)}.`,
      lines: [
        { label: "Solde restant", value: formatCurrency(solde), highlight: true },
        { label: "Intérêts annuels estimés", value: formatCurrency(interets) },
        { label: "Montant initial", value: formatCurrency(initial) },
        { label: "Déjà remboursé", value: formatCurrency(remb) },
      ],
    };
  },
});

export const archivedEntrepriseDrafts: SimulatorDefinition[] = [
  creanceCovidEntreprise,
];
