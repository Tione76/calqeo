import type { SimulatorDefinition } from "../../types";
import { draftSimulator, num } from "../_shared/helpers";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
  totalInterest,
} from "@/lib/utils/format";
import { getFraisNotaireTaux } from "@/data/regulations/immobilier";

function pretDureeDraft(
  slug: string,
  dureeAnnees: number,
  title: string
): SimulatorDefinition {
  return draftSimulator({
    slug,
    title,
    shortDescription: `Calculez la mensualité d'un crédit immobilier sur ${dureeAnnees} ans.`,
    metaTitle: `${title} — Mensualité crédit immobilier`,
    metaDescription: `Simulez la mensualité, le coût total et les intérêts d'un prêt immobilier sur ${dureeAnnees} ans.`,
    keywords: [`prêt ${dureeAnnees} ans`, "mensualité crédit immobilier", "simulation prêt"],
    domain: "immobilier",
    category: "financement",
    icon: "calculator",
    regulationIds: ["immobilier"],
    relatedSlugs: ["mensualite-pret-immobilier", "capacite-emprunt", "cout-total-credit-immobilier"],
    formFields: [
      { key: "montant", label: "Montant emprunté", type: "number", min: 0, step: 5000, suffix: "€" },
      { key: "taux", label: "Taux d'intérêt annuel", type: "number", min: 0, step: 0.05, suffix: "%" },
      { key: "assurance", label: "Assurance emprunteur", type: "number", min: 0, step: 0.01, suffix: "%/an", hint: "Taux sur capital initial" },
    ],
    defaultValues: { montant: 200000, taux: 3.8, assurance: 0.34 },
    content: buildContent({
      intro: `Un crédit sur ${dureeAnnees} ans allonge ou raccourcit la durée de remboursement et modifie le coût total des intérêts.`,
      howItWorks: [
        {
          title: "Mensualité et coût total",
          blocks: [
            p("Mensualité = amortissement du capital + intérêts + assurance selon le contrat."),
            hl("Durée", `${dureeAnnees} ans = ${dureeAnnees * 12} mensualités.`),
          ],
        },
      ],
      example: { title: `200 000 € sur ${dureeAnnees} ans à 3,8 %`, blocks: [p("Comparez avec d'autres durées via les simulateurs dédiés.")] },
      conseils: ["Une durée plus longue réduit la mensualité mais augmente les intérêts.", "Anticipez les variations de taux en cas de renégociation.", "Vérifiez la compatibilité avec votre capacité d'emprunt."],
      limites: ["Taux fixe supposé — hors modulation.", "Assurance calculée de façon simplifiée sur capital initial."],
    }),
    faq: buildFaq([
      { question: `Pourquoi choisir ${dureeAnnees} ans ?`, answer: "Compromis entre mensualité abordable et coût total du crédit selon votre profil." },
      { question: "Assurance incluse ?", answer: "Estimation séparée — le TAEG inclut assurance et frais dans l'offre bancaire." },
      { question: "Peut-on modifier la durée ?", answer: "Renégociation, remboursement anticipé ou report possible selon contrat." },
      { question: "Durée max HCSF ?", answer: "25 ans en principe (27 ans pour opérations vertes ou VEFA selon cas)." },
    ]),
    calculate(input: Record<string, number | string>) {
      const montant = num(input.montant);
      const mensualite = monthlyPaymentFromLoan(montant, num(input.taux), dureeAnnees);
      const assuranceM = (montant * (num(input.assurance) / 100)) / 12;
      const mensualiteTotale = mensualite + assuranceM;
      const interets = totalInterest(mensualite, dureeAnnees, montant);
      const coutTotal = mensualiteTotale * dureeAnnees * 12;
      return {
        summary: `Mensualité sur ${dureeAnnees} ans : ${formatCurrency(mensualiteTotale)}/mois (assurance incl.).`,
        lines: [
          { label: "Mensualité totale", value: formatCurrency(mensualiteTotale), highlight: true },
          { label: "Mensualité crédit seul", value: formatCurrency(mensualite) },
          { label: "Assurance mensuelle", value: formatCurrency(assuranceM) },
          { label: "Intérêts totaux", value: formatCurrency(interets) },
          { label: "Coût total estimé", value: formatCurrency(coutTotal) },
        ],
      };
    },
  });
}

function dispositifDefiscalisationDraft(
  slug: string,
  title: string,
  tauxReduction: number,
  dureeMax: number
): SimulatorDefinition {
  return draftSimulator({
    slug,
    title,
    shortDescription: `Estimez la réduction d'impôt ${title} sur vos travaux ou investissement éligible.`,
    metaTitle: `Simulateur ${title} — Réduction d'impôt`,
    metaDescription: `Calculez la réduction d'impôt estimée avec le dispositif ${title} : montant des travaux et plafonds.`,
    keywords: [title.toLowerCase(), "réduction impôt immobilier", " défiscalisation"],
    domain: "immobilier",
    category: "fiscalite",
    icon: "percent",
    regulationIds: ["fiscalite", "immobilier"],
    relatedSlugs: ["plus-value-immobiliere", "rendement-locatif", "simulateur-investissement-locatif-neuf"],
    formFields: [
      { key: "montantTravaux", label: "Montant des travaux éligibles", type: "number", min: 0, step: 5000, suffix: "€" },
      { key: "impotAnnuel", label: "Impôt sur le revenu annuel", type: "number", min: 0, step: 500, suffix: "€" },
      { key: "duree", label: "Durée de réduction", type: "number", min: 1, max: dureeMax, suffix: "ans" },
    ],
    defaultValues: { montantTravaux: 200000, impotAnnuel: 8000, duree: Math.min(9, dureeMax) },
    content: buildContent({
      intro: `${title} permet une réduction d'impôt liée à des travaux ou acquisitions sous conditions strictes de localisation et d'engagement.`,
      howItWorks: [
        {
          title: "Réduction estimée",
          blocks: [
            p(`Réduction annuelle ≈ min(impôt dû, montant travaux × ${formatPercent(tauxReduction * 100, 0)} / durée).`),
            hl("Engagement", "Location ou conservation du bien requise sur la durée légale."),
          ],
        },
      ],
      conseils: ["Faites valider l'éligibilité par un expert-comptable.", "Conservez les devis et factures certifiés.", "Croisez avec la rentabilité locative nette."],
      limites: ["Plafonds et zonages non détaillés.", "Simulation pédagogique — dossier administratif requis."],
    }),
    faq: buildFaq([
      { question: `Qui peut bénéficier de ${title} ?`, answer: "Investisseurs réalisant des travaux éligibles dans des zones ou bâtiments qualifiés." },
      { question: "Réduction ou crédit d'impôt ?", answer: "Réduction d'impôt sur le revenu, plafonnée par l'impôt dû." },
      { question: "Location obligatoire ?", answer: "Oui, en principe avec loyer plafonné et durée minimale selon le dispositif." },
      { question: "Cumul avec LMNP ?", answer: "Règles spécifiques — vérifiez la compatibilité fiscale." },
    ]),
    calculate(input: Record<string, number | string>) {
      const travaux = num(input.montantTravaux);
      const impot = num(input.impotAnnuel);
      const duree = num(input.duree);
      const reductionTotale = travaux * tauxReduction;
      const reductionAnnuelle = Math.min(impot, reductionTotale / duree);
      const reductionSurDuree = reductionAnnuelle * duree;
      return {
        summary: `Réduction annuelle estimée : ${formatCurrency(reductionAnnuelle)} (${formatCurrency(reductionSurDuree)} sur ${duree} ans).`,
        lines: [
          { label: "Réduction annuelle", value: formatCurrency(reductionAnnuelle), highlight: true },
          { label: "Réduction totale sur la durée", value: formatCurrency(reductionSurDuree), highlight: true },
          { label: "Réduction théorique max", value: formatCurrency(reductionTotale) },
          { label: "Montant travaux", value: formatCurrency(travaux) },
          { label: "Impôt annuel déclaré", value: formatCurrency(impot) },
        ],
      };
    },
  });
}

const indiceIrlLoyer = draftSimulator({
  slug: "simulateur-indice-irl-loyer",
  title: "Indice IRL — révision de loyer",
  shortDescription:
    "Calculez la révision annuelle du loyer selon l'évolution de l'Indice de Référence des Loyers (IRL).",
  metaTitle: "Simulateur IRL — Révision de loyer",
  metaDescription:
    "Estimez le nouveau loyer après révision IRL : loyer actuel, indice ancien et nouvel indice.",
  keywords: ["IRL loyer", "révision loyer", "indice référence loyers"],
  domain: "immobilier",
  category: "gestion",
  icon: "chart",
  regulationIds: ["immobilier"],
  relatedSlugs: ["simulateur-honoraires-gestion-locative", "simulateur-vacance-locative", "rendement-locatif"],
  formFields: [
    { key: "loyerActuel", label: "Loyer mensuel actuel", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "irlAncien", label: "IRL au bail initial", type: "number", min: 100, step: 0.01 },
    { key: "irlNouveau", label: "IRL à la révision", type: "number", min: 100, step: 0.01 },
  ],
  defaultValues: { loyerActuel: 750, irlAncien: 142.06, irlNouveau: 145.47 },
  content: buildContent({
    intro: "L'IRL permet d'ajuster le loyer des baux vides et meublés une fois par an, à la date prévue au bail.",
    howItWorks: [
      {
        title: "Formule IRL",
        blocks: [
          p("Nouveau loyer = loyer actuel × (IRL nouveau / IRL ancien)."),
          hl("Publication", "L'IRL est publié trimestriellement par l'INSEE."),
        ],
      },
    ],
    example: { title: "750 € révisé avec IRL +2,4 %", blocks: [p("Nouveau loyer ≈ 768 €/mois.")] },
    conseils: ["Vérifiez la clause de révision dans le bail.", "La révision doit être demandée par écrit.", "Plafonnement possible en zone tendue (encadrement)."],
    limites: ["Encadrements locatifs locaux non modélisés.", "Date anniversaire du bail à respecter."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que l'IRL ?", answer: "Indice de Référence des Loyers publié par l'INSEE, base des révisions de loyer." },
    { question: "Révision obligatoire ?", answer: "Non — le bailleur doit la demander ; sans clause IRL, pas de révision automatique." },
    { question: "Meublé et nu ?", answer: "L'IRL s'applique aux deux, sauf bail mobilité ou exceptions." },
    { question: "Plafond en zone tendue ?", answer: "Certaines zones plafonnent la hausse — vérifiez la réglementation locale." },
  ]),
  calculate(input: Record<string, number | string>) {
    const loyer = num(input.loyerActuel);
    const irl0 = num(input.irlAncien);
    const irl1 = num(input.irlNouveau);
    const nouveauLoyer = irl0 > 0 ? loyer * (irl1 / irl0) : loyer;
    const hausse = nouveauLoyer - loyer;
    const pct = loyer > 0 ? (hausse / loyer) * 100 : 0;
    return {
      summary: `Nouveau loyer : ${formatCurrency(nouveauLoyer)}/mois (+${formatCurrency(hausse)}).`,
      lines: [
        { label: "Nouveau loyer", value: formatCurrency(nouveauLoyer), highlight: true },
        { label: "Hausse mensuelle", value: formatCurrency(hausse), highlight: true },
        { label: "Variation", value: formatPercent(pct, 2) },
        { label: "Loyer actuel", value: formatCurrency(loyer) },
        { label: "Ratio IRL", value: `${irl1} / ${irl0}` },
      ],
    };
  },
});

export const archivedImmobilierDrafts: SimulatorDefinition[] = [
  pretDureeDraft("simulateur-pret-10-ans", 10, "Prêt immobilier 10 ans"),
  pretDureeDraft("simulateur-pret-15-ans", 15, "Prêt immobilier 15 ans"),
  pretDureeDraft("simulateur-pret-20-ans", 20, "Prêt immobilier 20 ans"),
  pretDureeDraft("simulateur-pret-25-ans", 25, "Prêt immobilier 25 ans"),
  dispositifDefiscalisationDraft("simulateur-monument-historique", "Monument historique", 0.5, 1),
  indiceIrlLoyer,
];
