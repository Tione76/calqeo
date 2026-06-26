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
  brutToNetMensuel,
  coutEmployeurMensuel,
  indemniteLicenciementLegale,
} from "../../_shared/payroll";
import {
  COTISATIONS_SALARIALES_DEFAUT,
  COTISATIONS_PATRONALES_DEFAUT,
} from "@/data/regulations/urssaf";
import { estimerPrimeActivite } from "@/data/regulations/rsa";
import { SMIC_MENSUEL_BRUT_35H, HEURES_LEGALES_SEMAINE } from "@/data/regulations/smic";

const MUTUELLE_PART_EMPLOYEUR_MIN = 0.5;
const AGIRC_TAUX_TOTAL = 0.0787;

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
    domain: "emploi",
    category: spec.category,
    icon: spec.icon,
    regulationIds: spec.regulationIds,
    relatedSlugs: spec.relatedSlugs,
    formFields: spec.formFields,
    defaultValues: spec.defaultValues,
    content: buildContent({
      intro: spec.intro,
      howItWorks: [{ title: spec.howTitle, blocks: [p(spec.howDetail), hl("Estimation", "Calcul simplifié à visée pédagogique — vérifiez votre convention collective.")] }],
      conseils: ["Consultez votre contrat de travail et la convention collective applicable.", "Demandez une simulation à votre service RH ou à l'URSSAF pour valider les montants."],
      limites: ["Estimation indicative — cas particuliers (inaptitude, faute grave, mandataires sociaux) non couverts.", "Barèmes 2025 — révisions annuelles possibles."],
    }),
    faq: buildFaq(spec.faqItems),
    calculate: spec.calculate,
  });
}

const contratProbatoireIndemnites = createDraft({
  slug: "simulateur-contrat-probatoire-indemnites",
  title: "Indemnités période probatoire",
  shortDescription: "Estimez les sommes dues en cas de rupture anticipée de la période d'essai avec préavis.",
  metaTitle: "Simulateur indemnités période probatoire — Rupture essai",
  metaDescription: "Calculez les indemnités ou salaires dus lors d'une rupture de période d'essai avec préavis : durée et rémunération.",
  keywords: ["période probatoire", "indemnités essai", "rupture période essai", "préavis essai"],
  category: "salaire",
  icon: "briefcase",
  regulationIds: ["urssaf"],
  relatedSlugs: ["salaire-brut-net", "simulateur-preavis-demission"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "joursPreavis", label: "Durée du préavis (jours)", type: "number", min: 0, max: 30, step: 1, suffix: "jours" },
  ],
  defaultValues: { salaireBrut: 2500, joursPreavis: 7 },
  intro: "Lors d'une rupture de période d'essai avec préavis, le salarié perçoit son salaire pour la durée du préavis effectuée ou due.",
  howTitle: "Indemnisation du préavis d'essai",
  howDetail: "Montant estimé = (salaire brut mensuel / 30) × nombre de jours de préavis.",
  faqItems: [
    { question: "Y a-t-il une indemnité de licenciement en période d'essai ?", answer: "Non, seul le salaire correspondant au préavis d'essai est dû, sauf faute grave." },
    { question: "Quelle durée de préavis en période d'essai ?", answer: "Fixée par la loi ou la convention collective, souvent de 24 h à 1 mois selon l'ancienneté dans l'essai." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const jours = num(input.joursPreavis);
    const indemnite = (brut / 30) * jours;
    const net = brutToNetMensuel(indemnite);
    return {
      summary: `Indemnité de préavis estimée : ${formatCurrency(indemnite)} brut (${formatCurrency(net)} net).`,
      lines: [
        { label: "Indemnité brute", value: formatCurrency(indemnite), highlight: true },
        { label: "Net estimé", value: formatCurrency(net), highlight: true },
        { label: "Jours de préavis", value: `${jours} jours` },
        { label: "Salaire brut mensuel", value: formatCurrency(brut) },
      ],
    };
  },
});

const mutuelleEntreprise = createDraft({
  slug: "simulateur-mutuelle-entreprise",
  title: "Mutuelle d'entreprise",
  shortDescription: "Estimez la répartition employeur-salarié de la cotisation mutuelle obligatoire.",
  metaTitle: "Simulateur mutuelle entreprise — Part patronale 50 %",
  metaDescription: "Calculez la part employeur (minimum 50 %) et salarié de la cotisation mutuelle collective d'entreprise.",
  keywords: ["mutuelle entreprise", "complémentaire santé collective", "part employeur mutuelle"],
  category: "social",
  icon: "heart",
  regulationIds: ["urssaf"],
  relatedSlugs: ["simulateur-prevoyance-salarie", "salaire-brut-net"],
  formFields: [
    { key: "cotisationMensuelle", label: "Cotisation mensuelle totale", type: "number", min: 0, step: 5, suffix: "€" },
    { key: "partEmployeur", label: "Part employeur", type: "number", min: 50, max: 100, step: 1, suffix: "%" },
  ],
  defaultValues: { cotisationMensuelle: 60, partEmployeur: 50 },
  intro: "L'employeur doit financer au minimum 50 % de la cotisation de base de la mutuelle collective.",
  howTitle: "Obligation patronale",
  howDetail: "Part employeur ≥ 50 % sur le panier de soins minimum (contrat responsable).",
  faqItems: [
    { question: "La mutuelle est-elle obligatoire ?", answer: "Oui, depuis 2016, pour toutes les entreprises du secteur privé." },
    { question: "Peut-on refuser la mutuelle ?", answer: "Non, sauf dispense pour couverture par ailleurs (conjoint, CMU-C…)." },
  ],
  calculate(input) {
    const cotisation = num(input.cotisationMensuelle);
    const taux = Math.max(MUTUELLE_PART_EMPLOYEUR_MIN, num(input.partEmployeur) / 100);
    const employeur = cotisation * taux;
    const salarie = cotisation - employeur;
    return {
      summary: `Employeur : ${formatCurrency(employeur)}/mois — Salarié : ${formatCurrency(salarie)}/mois.`,
      lines: [
        { label: "Part employeur", value: formatCurrency(employeur), highlight: true },
        { label: "Part salarié", value: formatCurrency(salarie), highlight: true },
        { label: "Cotisation totale", value: formatCurrency(cotisation) },
        { label: "Coût employeur annuel", value: formatCurrency(employeur * 12) },
      ],
    };
  },
});

const prevoyanceSalarie = createDraft({
  slug: "simulateur-prevoyance-salarie",
  title: "Prévoyance salarié",
  shortDescription: "Estimez le coût de la prévoyance collective (décès, invalidité, incapacité).",
  metaTitle: "Simulateur prévoyance salarié — Cotisation collective",
  metaDescription: "Calculez le coût employeur et salarié de la prévoyance d'entreprise selon le salaire brut.",
  keywords: ["prévoyance salarié", "prévoyance entreprise", "cotisation prévoyance"],
  category: "social",
  icon: "heart",
  regulationIds: ["urssaf"],
  relatedSlugs: ["simulateur-mutuelle-entreprise", "indemnites-journalieres-securite-sociale"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxPrevoyance", label: "Taux de cotisation prévoyance", type: "number", min: 0.5, max: 3, step: 0.1, suffix: "%", hint: "Souvent 0,8 à 1,5 % du brut" },
    { key: "partEmployeur", label: "Part employeur", type: "number", min: 50, max: 100, step: 1, suffix: "%" },
  ],
  defaultValues: { salaireBrut: 3000, tauxPrevoyance: 1.2, partEmployeur: 50 },
  intro: "La prévoyance complémentaire couvre les risques décès, incapacité et invalidité au-delà de la Sécurité sociale.",
  howTitle: "Cotisation sur salaire",
  howDetail: "Cotisation = salaire brut × taux. Répartition employeur/salarié selon l'accord collectif (souvent 50/50).",
  faqItems: [
    { question: "La prévoyance est-elle obligatoire ?", answer: "Oui pour les cadres (ANI 1947) et souvent par convention collective pour les non-cadres." },
    { question: "Que couvre-t-elle ?", answer: "Capital décès, rente invalidité, maintien de salaire en cas d'arrêt maladie prolongé." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const taux = num(input.tauxPrevoyance) / 100;
    const cotisation = brut * taux;
    const tauxEmp = num(input.partEmployeur) / 100;
    const employeur = cotisation * tauxEmp;
    const salarie = cotisation - employeur;
    return {
      summary: `Cotisation prévoyance : ${formatCurrency(cotisation)}/mois.`,
      lines: [
        { label: "Cotisation totale", value: formatCurrency(cotisation), highlight: true },
        { label: "Part employeur", value: formatCurrency(employeur) },
        { label: "Part salarié", value: formatCurrency(salarie) },
        { label: "Taux appliqué", value: formatPercent(taux * 100, 1) },
      ],
    };
  },
});

const retraiteComplementaireAgirc = createDraft({
  slug: "simulateur-retraite-complementaire-agirc",
  title: "Retraite complémentaire Agirc-Arrco",
  shortDescription: "Estimez les cotisations retraite complémentaire Agirc-Arrco employeur et salarié.",
  metaTitle: "Simulateur retraite Agirc-Arrco — Cotisations 2025",
  metaDescription: "Calculez les cotisations Agirc-Arrco sur le salaire brut : part salariale et patronale.",
  keywords: ["Agirc-Arrco", "retraite complémentaire", "cotisations retraite cadre"],
  category: "social",
  icon: "wallet",
  regulationIds: ["retraite", "urssaf"],
  relatedSlugs: ["simulateur-retraite", "salaire-brut-net"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "plafondSS", label: "Plafond Sécurité sociale mensuel", type: "number", min: 3000, max: 5000, step: 1, suffix: "€", hint: "3 925 € en 2025" },
  ],
  defaultValues: { salaireBrut: 4000, plafondSS: 3925 },
  intro: "Agirc-Arrco est le régime de retraite complémentaire obligatoire des salariés du privé.",
  howTitle: "Assiette et taux",
  howDetail: "Cotisations calculées sur le salaire dans la limite du plafond SS, taux global ~7,87 % (salarié + employeur).",
  faqItems: [
    { question: "Agirc-Arrco concerne-t-il tous les salariés ?", answer: "Oui, cadres et non-cadres depuis la fusion de 2019." },
    { question: "Comment estimer ma retraite ?", answer: "Consultez info-retraite.fr pour une simulation personnalisée avec vos relevés de carrière." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const plafond = num(input.plafondSS);
    const assiette = Math.min(brut, plafond);
    const cotisation = assiette * AGIRC_TAUX_TOTAL;
    const salarie = cotisation / 2;
    const employeur = cotisation / 2;
    return {
      summary: `Cotisation Agirc-Arrco : ${formatCurrency(cotisation)}/mois (${formatCurrency(salarie)} salarié).`,
      lines: [
        { label: "Cotisation totale", value: formatCurrency(cotisation), highlight: true },
        { label: "Part salariale", value: formatCurrency(salarie) },
        { label: "Part patronale", value: formatCurrency(employeur) },
        { label: "Assiette retenue", value: formatCurrency(assiette) },
      ],
    };
  },
});

const congesParental = createDraft({
  slug: "simulateur-conges-parental",
  title: "Congé parental d'éducation",
  shortDescription: "Estimez la durée et l'impact financier d'un congé parental à temps plein ou partiel.",
  metaTitle: "Simulateur congé parental — Durée et indemnisation",
  metaDescription: "Calculez la durée maximale du congé parental et l'indemnisation AJPP estimée selon votre salaire.",
  keywords: ["congé parental", "AJPP", "congé éducation", "temps partiel parental"],
  category: "social",
  icon: "users",
  regulationIds: ["urssaf"],
  relatedSlugs: ["simulateur-conges-sabbatiques", "indemnites-journalieres-securite-sociale"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel avant congé", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tempsPartiel", label: "Temps de travail", type: "select", options: [{ value: "100", label: "Temps plein (100 %)" }, { value: "80", label: "Temps partiel 80 %" }, { value: "50", label: "Temps partiel 50 %" }] },
    { key: "dureeMois", label: "Durée souhaitée (mois)", type: "number", min: 1, max: 36, step: 1, suffix: "mois" },
  ],
  defaultValues: { salaireBrut: 2500, tempsPartiel: "100", dureeMois: 12 },
  intro: "Le congé parental permet de suspendre ou réduire son activité pour élever un enfant.",
  howTitle: "Durée et indemnisation",
  howDetail: "Durée max 1 an renouvelable jusqu'à 3 ans. Indemnisation AJPP si conditions remplies (simplifiée ici).",
  faqItems: [
    { question: "Le congé parental est-il rémunéré ?", answer: "L'AJPP peut verser une allocation si le salarié réduit ou cesse son activité, sous conditions." },
    { question: "Peut-on travailler à temps partiel ?", answer: "Oui, entre 16 h et 32 h par semaine ou 40 à 80 % du temps plein." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const taux = num(input.tempsPartiel) / 100;
    const mois = num(input.dureeMois);
    const perteMensuelle = brut * (1 - taux);
    const perteTotale = perteMensuelle * mois;
    const ajppEstime = taux < 1 ? 400 * taux : 0;
    return {
      summary: `Perte de salaire estimée : ${formatCurrency(perteMensuelle)}/mois sur ${mois} mois.`,
      lines: [
        { label: "Perte mensuelle estimée", value: formatCurrency(perteMensuelle), highlight: true },
        { label: "Perte totale sur la période", value: formatCurrency(perteTotale), highlight: true },
        { label: "AJPP estimée", value: formatCurrency(ajppEstime) },
        { label: "Temps de travail", value: formatPercent(taux * 100, 0) },
      ],
    };
  },
});

const congesSabbatiques = createDraft({
  slug: "simulateur-conges-sabbatiques",
  title: "Congé sabbatique",
  shortDescription: "Vérifiez votre éligibilité et estimez l'impact financier d'un congé sabbatique.",
  metaTitle: "Simulateur congé sabbatique — Éligibilité et coût",
  metaDescription: "Estimez la durée possible et la perte de salaire d'un congé sabbatique selon votre ancienneté.",
  keywords: ["congé sabbatique", "sabbatical", "congé sans solde"],
  category: "social",
  icon: "briefcase",
  regulationIds: ["urssaf"],
  relatedSlugs: ["simulateur-conges-parental", "salaire-brut-net"],
  formFields: [
    { key: "ancienneteEntreprise", label: "Ancienneté dans l'entreprise (mois)", type: "number", min: 0, max: 360, step: 1, suffix: "mois" },
    { key: "ancienneteCarriere", label: "Ancienneté professionnelle (années)", type: "number", min: 0, max: 40, step: 1, suffix: "ans" },
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "dureeMois", label: "Durée souhaitée (mois)", type: "number", min: 6, max: 11, step: 1, suffix: "mois" },
  ],
  defaultValues: { ancienneteEntreprise: 48, ancienneteCarriere: 8, salaireBrut: 3200, dureeMois: 6 },
  intro: "Le congé sabbatique permet une pause professionnelle non rémunérée pour projet personnel.",
  howTitle: "Conditions d'éligibilité",
  howDetail: "36 mois d'ancienneté dans l'entreprise et 6 ans d'activité professionnelle. Durée : 6 à 11 mois.",
  faqItems: [
    { question: "Le congé sabbatique est-il payé ?", answer: "Non, c'est un congé sans solde. Aucune rémunération de l'employeur." },
    { question: "L'employeur peut-il refuser ?", answer: "Oui, pour des raisons liées à l'organisation ou si trop de salariés sont absents simultanément." },
  ],
  calculate(input) {
    const moisEnt = num(input.ancienneteEntreprise);
    const ansCar = num(input.ancienneteCarriere);
    const brut = num(input.salaireBrut);
    const duree = num(input.dureeMois);
    const eligible = moisEnt >= 36 && ansCar >= 6 && duree >= 6 && duree <= 11;
    const perte = brut * duree;
    return {
      summary: eligible
        ? `Congé sabbatique possible — perte de salaire : ${formatCurrency(perte)}.`
        : "Conditions d'éligibilité non remplies (36 mois entreprise, 6 ans carrière).",
      lines: [
        { label: "Éligibilité", value: eligible ? "Éligible" : "Non éligible", highlight: true },
        { label: "Perte de salaire totale", value: formatCurrency(perte), highlight: eligible },
        { label: "Durée souhaitée", value: `${duree} mois` },
        { label: "Ancienneté entreprise", value: `${moisEnt} mois` },
      ],
    };
  },
});

export const archivedEmploiDrafts: SimulatorDefinition[] = [
  contratProbatoireIndemnites,
  mutuelleEntreprise,
  prevoyanceSalarie,
  retraiteComplementaireAgirc,
  congesParental,
  congesSabbatiques,
];
