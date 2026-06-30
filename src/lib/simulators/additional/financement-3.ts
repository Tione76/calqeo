import type { SimulatorDefinition } from "../types";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

/** Capitalisation mensuelle jusqu'à l'apport cible. */
export function simulerEpargneObjectif(
  objectif: number,
  actuelle: number,
  mensuelle: number,
  rendementPct: number,
  maxMois = 600
): {
  mois: number;
  capitalFinal: number;
  capitalVerse: number;
  interets: number;
} {
  const r = rendementPct / 100 / 12;
  let capital = actuelle;
  let mois = 0;
  while (capital < objectif && mois < maxMois) {
    capital = capital * (1 + r) + mensuelle;
    mois++;
  }
  const capitalVerse = mensuelle * mois;
  const interets = Math.max(0, capital - actuelle - capitalVerse);
  return { mois, capitalFinal: capital, capitalVerse, interets };
}

function formatDureeSummary(mois: number): string {
  const annees = Math.floor(mois / 12);
  const moisRestants = mois % 12;
  const duree =
    `${annees > 0 ? `${annees} an${annees > 1 ? "s" : ""}` : ""}${moisRestants > 0 ? ` ${moisRestants} mois` : ""}`.trim() ||
    "0 mois";
  return `${duree} (${mois} mois)`;
}

export const fraisGarantieEmprunt: SimulatorDefinition = {
  slug: "frais-garantie-emprunt",
  title: "Frais de garantie emprunt",
  shortDescription:
    "Comparez le coût d'une hypothèque et d'une caution (Crédit Logement) pour garantir votre prêt.",
  metaTitle: "Simulateur frais de garantie emprunt — Hypothèque vs caution",
  metaDescription:
    "Estimez les frais de garantie de crédit immobilier : hypothèque notariale ou caution bancaire (Crédit Logement).",
  keywords: [
    "frais garantie emprunt",
    "hypothèque coût",
    "caution crédit logement",
    "garantie prêt immobilier",
  ],
  category: "financement",
  icon: "wallet",
  relatedSlugs: ["frais-de-notaire", "mensualite-pret-immobilier", "capacite-emprunt"],
  formFields: [
    { key: "capital", label: "Capital emprunté", type: "number", min: 0, step: 10000, suffix: "€" },
    {
      key: "typeGarantie",
      label: "Type de garantie",
      type: "select",
      options: [
        { value: "hypotheque", label: "Hypothèque (~1,5 % + frais notaire)" },
        { value: "caution", label: "Caution Crédit Logement (~1 % + commission)" },
      ],
    },
    { key: "duree", label: "Durée du prêt", type: "number", min: 1, max: 30, suffix: "ans" },
  ],
  defaultValues: { capital: 250000, typeGarantie: "caution", duree: 20 },
  content: buildContent({
    intro: "La garantie protège la banque en cas de défaut. Son coût varie fortement selon le type choisi.",
    howItWorks: [
      {
        title: "Hypothèque",
        blocks: [p("Inscription au bureau des hypothèques : environ 1 à 1,5 % du capital + émoluments de notaire (~0,5 %)."), hl("Inconvénient", "Frais de mainlevée à la fin du prêt (~500 à 1 500 €).")],
      },
      {
        title: "Caution",
        blocks: [p("Commission Crédit Logement : environ 1 % du capital + cotisation (~0,3 %/an sur 8 ans). Souvent moins chère au total."), hl("Avantage", "Pas de frais de notaire pour la garantie.")],
      },
    ],
    example: { title: "Prêt 250 000 € sur 20 ans", blocks: [p("Hypothèque : ~5 000 €. Caution : ~3 500 € estimés sur la durée totale.")] },
    conseils: ["Comparez les deux options avec votre banque.", "La caution est souvent imposée par l'établissement prêteur.", "Intégrez ces frais dans votre budget global d'acquisition."],
    limites: ["Tarifs moyens — devis bancaire requis pour le montant exact.", "Caution mutuelle : restitution partielle si bon dossier."],
  }),
  faq: buildFaq([
    { question: "Hypothèque ou caution : laquelle choisir ?", answer: "La banque impose souvent l'une ou l'autre. La caution est généralement moins chère." },
    { question: "Combien coûte une hypothèque ?", answer: "Environ 1 à 2 % du capital emprunté, frais de notaire inclus." },
    { question: "La caution Crédit Logement est-elle remboursée ?", answer: "Une part de la commission peut être restituée si le prêt est soldé sans incident." },
    { question: "Ces frais sont-ils financés par le crédit ?", answer: "Souvent oui, intégrés au montant emprunté." },
  ]),
  calculate(input) {
    const capital = num(input.capital);
    const duree = num(input.duree);
    const type = String(input.typeGarantie);
    const cout =
      type === "hypotheque"
        ? capital * 0.015 + capital * 0.005
        : capital * 0.01 + capital * 0.003 * Math.min(duree, 8);
    return {
      summary: `Coût garantie ${type === "hypotheque" ? "hypothèque" : "caution"} estimé : ${formatCurrency(cout)}.`,
      lines: [
        { label: "Coût total estimé", value: formatCurrency(cout), highlight: true },
        { label: "Type de garantie", value: type === "hypotheque" ? "Hypothèque" : "Caution" },
        { label: "Capital emprunté", value: formatCurrency(capital) },
        { label: "Durée du prêt", value: `${duree} ans` },
        {
          label: "Coût en % du capital",
          value: formatPercent(capital > 0 ? (cout / capital) * 100 : 0, 2),
        },
      ],
    };
  },
};

export const effortEpargneImmobilier: SimulatorDefinition = {
  slug: "effort-epargne-immobilier",
  title: "Effort d'épargne immobilier",
  shortDescription:
    "Calculez combien de temps épargner pour constituer votre apport personnel.",
  metaTitle: "Simulateur effort d'épargne — Apport immobilier",
  metaDescription:
    "Estimez le délai pour constituer votre apport personnel immobilier selon votre épargne mensuelle et votre objectif.",
  keywords: ["effort épargne immobilier", "apport personnel", "combien épargner achat"],
  category: "financement",
  icon: "wallet",
  relatedSlugs: ["capacite-emprunt", "frais-de-notaire", "frais-garantie-emprunt"],
  formFields: [
    { key: "objectifApport", label: "Apport cible", type: "number", min: 0, step: 1000, suffix: "€", hint: "Apport + frais de notaire si non financés" },
    { key: "epargneActuelle", label: "Épargne déjà disponible", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "epargneMensuelle", label: "Épargne mensuelle", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "rendement", label: "Rendement annuel estimé", type: "number", min: 0, max: 10, step: 0.1, suffix: "%" },
  ],
  defaultValues: { objectifApport: 40000, epargneActuelle: 8000, epargneMensuelle: 500, rendement: 2 },
  content: buildContent({
    intro: "Constituer un apport suffisant est souvent la première étape avant d'emprunter.",
    howItWorks: [{ title: "Calcul", blocks: [p("Durée = (Objectif − Épargne actuelle) / Épargne mensuelle, avec intérêts composés si rendement > 0."), hl("Apport conseillé", "10 à 20 % du prix du bien + frais de notaire si possible.")] }],
    example: { title: "Objectif 40 000 €, 500 €/mois", blocks: [p("Avec 8 000 € déjà épargnés : environ 5 ans et 4 mois sans rendement.")] },
    conseils: ["Automatisez un virement mensuel vers un livret ou PEL.", "Intégrez les frais de notaire dans l'objectif.", "Utilisez le simulateur capacité d'emprunt une fois l'apport atteint."],
    limites: ["Estimation linéaire ou intérêts composés simplifiés.", "Inflation et aléas de revenus non modélisés."],
  }),
  faq: buildFaq([
    { question: "Quel apport viser ?", answer: "Au minimum 10 % du prix. Idéalement 20 % pour couvrir apport et frais de notaire." },
    { question: "Où placer son épargne ?", answer: "Livret A, LDDS ou PEL selon l'horizon. Évitez le risque sur un horizon court." },
    { question: "Peut-on acheter sans apport ?", answer: "Rarement. Certaines banques acceptent 110 % avec garanties, sous conditions strictes." },
    { question: "Lien avec la capacité d'emprunt ?", answer: "Une fois l'apport constitué, simulez votre capacité d'emprunt avec votre apport." },
  ]),
  calculate(input) {
    const objectif = num(input.objectifApport);
    const actuelle = num(input.epargneActuelle);
    const mensuelle = num(input.epargneMensuelle);
    const reste = Math.max(0, objectif - actuelle);
    if (reste <= 0) {
      return {
        summary: "Objectif d'apport déjà atteint.",
        lines: [
          { label: "Statut", value: "Objectif atteint", highlight: true },
          { label: "Apport cible", value: formatCurrency(objectif) },
          { label: "Épargne disponible", value: formatCurrency(actuelle) },
        ],
      };
    }
    if (mensuelle <= 0) {
      return {
        summary: "Épargne mensuelle insuffisante pour atteindre l'objectif.",
        lines: [
          { label: "Reste à épargner", value: formatCurrency(reste), highlight: true },
          { label: "Apport cible", value: formatCurrency(objectif) },
        ],
      };
    }
    const rendement = num(input.rendement);
    const { mois, capitalFinal, capitalVerse, interets } = simulerEpargneObjectif(
      objectif,
      actuelle,
      mensuelle,
      rendement
    );
    return {
      summary: `Délai estimé : ${formatDureeSummary(mois)} avec un rendement annuel de ${formatPercent(rendement, 1)}.`,
      lines: [
        { label: "Durée estimée", value: `${mois} mois`, highlight: true },
        { label: "Reste à épargner", value: formatCurrency(reste) },
        { label: "Épargne mensuelle", value: formatCurrency(mensuelle) },
        { label: "Rendement annuel", value: formatPercent(rendement, 1) },
        { label: "Capital versé", value: formatCurrency(capitalVerse) },
        { label: "Intérêts générés", value: formatCurrency(interets) },
        { label: "Capital final estimé", value: formatCurrency(capitalFinal) },
        { label: "Apport cible", value: formatCurrency(objectif) },
        { label: "Épargne actuelle", value: formatCurrency(actuelle) },
      ],
    };
  },
};

export const impactHausseTaux: SimulatorDefinition = {
  slug: "impact-hausse-taux",
  title: "Impact d'une hausse de taux",
  shortDescription:
    "Mesurez l'effet d'une hausse de taux sur votre mensualité et votre taux d'endettement.",
  metaTitle: "Simulateur impact hausse de taux — Crédit immobilier",
  metaDescription:
    "Calculez l'impact d'une hausse de taux sur votre mensualité de crédit immobilier et votre taux d'endettement.",
  keywords: ["hausse taux crédit", "impact taux immobilier", "mensualité taux variable"],
  category: "financement",
  icon: "percent",
  relatedSlugs: ["mensualite-pret-immobilier", "taux-endettement", "capacite-emprunt"],
  formFields: [
    { key: "capital", label: "Capital restant dû ou emprunté", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "tauxActuel", label: "Taux actuel", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "tauxNouveau", label: "Nouveau taux (après hausse)", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "dureeAnnees", label: "Durée restante", type: "number", min: 1, max: 30, suffix: "ans" },
    { key: "revenus", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "charges", label: "Autres charges mensuelles", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { capital: 200000, tauxActuel: 3.2, tauxNouveau: 4.2, dureeAnnees: 18, revenus: 3800, charges: 350 },
  content: buildContent({
    intro: "Une hausse de taux impacte directement la mensualité et peut faire dépasser le plafond d'endettement de 35 %.",
    howItWorks: [{ title: "Scénario", blocks: [p("Compare la mensualité et le taux d'endettement avant et après la hausse de taux, à capital et durée constants."), hl("Prêt variable", "Les emprunteurs en taux variable ou arrivant en fin de période fixe sont les plus exposés.")] }],
    conseils: ["Anticipez une marge de sécurité de 1 à 2 points de taux.", "Envisagez le remboursement anticipé ou le rachat si la hausse est durable.", "Renégociez votre assurance emprunteur pour compenser."],
    limites: ["Ne modélise pas la renégociation bancaire.", "Assurance emprunteur non incluse."],
  }),
  faq: buildFaq([
    { question: "Comment une hausse de taux affecte-t-elle la mensualité ?", answer: "Chaque point de taux supplémentaire augmente la mensualité d'environ 5 à 7 % sur 20 ans." },
    { question: "Que faire en cas de hausse ?", answer: "Renégocier, rembourser par anticipation, ou allonger la durée si la banque l'accepte." },
    { question: "Taux fixe ou variable ?", answer: "Le taux fixe protège des hausse. Le variable expose aux fluctuations du marché." },
    { question: "Lien avec le taux d'endettement ?", answer: "Utilisez aussi le simulateur taux d'endettement pour vérifier le plafond de 35 %." },
  ]),
  calculate(input) {
    const capital = num(input.capital);
    const duree = num(input.dureeAnnees);
    const mActuel = monthlyPaymentFromLoan(capital, num(input.tauxActuel), duree);
    const mNouveau = monthlyPaymentFromLoan(capital, num(input.tauxNouveau), duree);
    const delta = mNouveau - mActuel;
    const revenus = num(input.revenus);
    const endActuel = revenus > 0 ? ((mActuel + num(input.charges)) / revenus) * 100 : 0;
    const endNouveau = revenus > 0 ? ((mNouveau + num(input.charges)) / revenus) * 100 : 0;
    return {
      summary: `Hausse mensualité : +${formatCurrency(delta)}/mois — Endettement : ${formatPercent(endActuel, 1)} → ${formatPercent(endNouveau, 1)}.`,
      lines: [
        { label: "Hausse mensualité", value: formatCurrency(delta), highlight: true },
        { label: "Nouvelle mensualité", value: formatCurrency(mNouveau), highlight: true },
        { label: "Mensualité actuelle", value: formatCurrency(mActuel) },
        { label: "Taux d'endettement après hausse", value: formatPercent(endNouveau, 1) },
        { label: "Taux d'endettement actuel", value: formatPercent(endActuel, 1) },
        { label: "Hausse de taux", value: formatPercent(num(input.tauxNouveau) - num(input.tauxActuel), 2) },
      ],
    };
  },
};

export const creditTravaux: SimulatorDefinition = {
  slug: "credit-travaux",
  title: "Crédit travaux",
  shortDescription:
    "Simulez la mensualité d'un prêt travaux ou rénovation immobilière.",
  metaTitle: "Simulateur crédit travaux — Mensualité rénovation",
  metaDescription:
    "Calculez la mensualité d'un crédit travaux : montant, taux, durée et coût total du financement de rénovation.",
  keywords: ["crédit travaux", "prêt rénovation", "financement travaux"],
  category: "financement",
  icon: "building",
  relatedSlugs: ["budget-travaux", "rentabilite-apres-travaux", "mensualite-pret-immobilier"],
  formFields: [
    { key: "montantTravaux", label: "Montant des travaux à financer", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "duree", label: "Durée du prêt", type: "number", min: 1, max: 15, suffix: "ans" },
    { key: "tauxAssurance", label: "Assurance emprunteur", type: "number", min: 0, max: 1, step: 0.01, suffix: "%" },
  ],
  defaultValues: { montantTravaux: 35000, taux: 4.5, duree: 7, tauxAssurance: 0.3 },
  content: buildContent({
    intro: "Un crédit travaux permet de financer la rénovation sans puiser dans votre apport d'achat.",
    howItWorks: [{ title: "Types de financement", blocks: [p("Crédit travaux dédié, prêt consommation ou intégration au crédit immobilier (PTZ travaux, eco-PTZ…)."), hl("Budget", "Estimez d'abord le coût des travaux avec le simulateur budget travaux.")] }],
    example: { title: "35 000 € sur 7 ans à 4,5 %", blocks: [p("Mensualité estimée ~490 € hors assurance.")] },
    conseils: ["Demandez plusieurs devis avant d'emprunter.", "Comparez crédit travaux et consommation.", "Vérifiez les aides (MaPrimeRénov', éco-PTZ)."],
    limites: ["Taux indicatif — offre bancaire requise.", "Aides publiques non intégrées."],
  }),
  faq: buildFaq([
    { question: "Crédit travaux ou consommation ?", answer: "Le crédit travaux est souvent moins cher mais nécessite des justificatifs de travaux." },
    { question: "Peut-on financer les travaux dans le crédit immobilier ?", answer: "Oui, si la banque l'accepte et que le taux d'endettement le permet." },
    { question: "Quelle durée pour un crédit travaux ?", answer: "Généralement 2 à 10 ans selon le montant." },
    { question: "Lien avec budget travaux ?", answer: "Utilisez d'abord le simulateur budget travaux pour estimer le montant." },
  ]),
  calculate(input) {
    const montant = num(input.montantTravaux);
    const duree = num(input.duree);
    const mensualite = monthlyPaymentFromLoan(montant, num(input.taux), duree);
    const assurance = (montant * (num(input.tauxAssurance) / 100)) / 12;
    const total = (mensualite + assurance) * duree * 12;
    return {
      summary: `Mensualité crédit travaux : ${formatCurrency(mensualite + assurance)}/mois (assurance incluse).`,
      lines: [
        { label: "Mensualité totale", value: formatCurrency(mensualite + assurance), highlight: true },
        { label: "Mensualité hors assurance", value: formatCurrency(mensualite) },
        { label: "Coût total estimé", value: formatCurrency(total) },
        { label: "Montant financé", value: formatCurrency(montant) },
        { label: "Durée", value: `${duree} ans` },
      ],
    };
  },
};

export const financementSimulatorsPart3 = [
  fraisGarantieEmprunt,
  effortEpargneImmobilier,
  impactHausseTaux,
  creditTravaux,
];
