import type { SimulatorDefinition } from "../types";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
  totalInterest,
  buildAmortizationSchedule,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";
import {
  HCSF_TAUX_ENDETTEMENT_MAX,
  getFraisNotaireTaux,
} from "@/lib/config/aides";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

// ─── 1. Frais de notaire ───────────────────────────────────────────
export const fraisNotaire: SimulatorDefinition = {
  slug: "frais-de-notaire",
  title: "Frais de notaire",
  shortDescription:
    "Estimez les frais de notaire lors de l'achat d'un bien immobilier (ancien ou neuf).",
  metaTitle: "Simulateur de frais de notaire — Calcul achat immobilier",
  metaDescription:
    "Calculez gratuitement vos frais de notaire pour un achat dans l'ancien ou le neuf. Estimation du montant total et du taux appliqué.",
  keywords: ["frais de notaire", "calcul frais notaire", "achat immobilier", "notaire ancien neuf"],
  category: "financement",
  icon: "calculator",
  relatedSlugs: ["capacite-emprunt", "mensualite-pret-immobilier", "frais-agence-immobiliere"],
  formFields: [
    { key: "prixAchat", label: "Prix d'achat", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "typeBien",
      label: "Type de bien",
      type: "select",
      hint: "Le neuf bénéficie de frais de notaire réduits",
      options: [
        { value: "ancien", label: "Ancien (~7,5 %)" },
        { value: "neuf", label: "Neuf (~2,5 %)" },
      ],
    },
  ],
  defaultValues: { prixAchat: 250000, typeBien: "ancien" },
  content: buildContent({
    intro: "Estimez le montant des frais de notaire selon le prix d'achat et la nature du bien (ancien ou neuf).",
    howItWorks: [
      { title: "Frais dans l'ancien", blocks: [p("Dans l'ancien, les frais de notaire représentent environ 7 à 8 % du prix d'achat. Ils incluent les droits de mutation, la rémunération du notaire et les débours."), hl("Ordre de grandeur", "Pour 250 000 € dans l'ancien, comptez environ 18 000 à 20 000 € de frais.")] },
      { title: "Frais dans le neuf", blocks: [p("Dans le neuf (VEFA), les frais sont nettement plus faibles : environ 2 à 3 % du prix, car les droits de mutation sont réduits.")] },
    ],
    example: { title: "Achat à 250 000 € dans l'ancien", blocks: [p("Frais estimés : 250 000 × 7,5 % = 18 750 €. Budget total : 268 750 €.")] },
    conseils: ["Intégrez les frais de notaire dans votre budget global dès le départ.", "Demandez une proforma au notaire pour une estimation exacte.", "Dans le neuf, vérifiez si des frais de garantie d'achèvement s'ajoutent."],
    limites: ["Estimation moyenne : le montant exact dépend du département et des droits applicables.", "Frais de garantie et de dossier bancaire non inclus."],
  }),
  faq: buildFaq([
    { question: "Combien coûtent les frais de notaire dans l'ancien ?", answer: "Comptez environ 7 à 8 % du prix d'achat en moyenne nationale." },
    { question: "Les frais sont-ils moins élevés dans le neuf ?", answer: "Oui, environ 2 à 3 % du prix en VEFA grâce à des droits de mutation réduits." },
    { question: "Peut-on financer les frais de notaire ?", answer: "Parfois, selon la banque et votre apport. Souvent ils doivent être payés comptant ou via l'apport." },
    { question: "Les frais de notaire sont-ils négociables ?", answer: "Non, les émoluments sont encadrés par la loi. Seuls certains actes annexes peuvent varier légèrement." },
  ]),
  calculate(input) {
    const prix = num(input.prixAchat);
    const taux = getFraisNotaireTaux(String(input.typeBien));
    const frais = prix * (taux / 100);
    return {
      summary: `Frais de notaire estimés : ${formatCurrency(frais)} (${formatPercent(taux, 1)} du prix).`,
      lines: [
        { label: "Frais de notaire", value: formatCurrency(frais), highlight: true },
        { label: "Prix d'achat", value: formatCurrency(prix) },
        { label: "Taux appliqué", value: formatPercent(taux, 1) },
        { label: "Budget total acquisition", value: formatCurrency(prix + frais), description: "Prix + frais de notaire" },
      ],
    };
  },
};

// ─── 2. Taux d'endettement ─────────────────────────────────────────
export const tauxEndettement: SimulatorDefinition = {
  slug: "taux-endettement",
  title: "Taux d'endettement",
  shortDescription: "Calculez votre taux d'endettement actuel ou projeté par rapport au plafond bancaire de 35 %.",
  metaTitle: "Simulateur de taux d'endettement — Calcul 35 %",
  metaDescription: "Calculez votre taux d'endettement immobilier : revenus, charges de crédit et mensualité projetée. Vérifiez le respect du plafond de 35 %.",
  keywords: ["taux endettement", "calcul endettement", "35 pourcent", "endettement immobilier"],
  category: "financement",
  icon: "percent",
  relatedSlugs: ["capacite-emprunt", "mensualite-pret-immobilier", "cout-total-credit-immobilier"],
  formFields: [
    { key: "revenusMensuels", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "chargesMensuelles", label: "Charges de crédit actuelles", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "mensualiteProjet", label: "Mensualité du projet (crédit + assurance)", type: "number", min: 0, step: 50, suffix: "€", hint: "Nouvelle mensualité immobilière envisagée" },
  ],
  defaultValues: { revenusMensuels: 4000, chargesMensuelles: 300, mensualiteProjet: 1100 },
  content: buildContent({
    intro: "Le taux d'endettement mesure la part de vos revenus consacrée au remboursement de vos crédits.",
    howItWorks: [
      { title: "Formule", blocks: [hl("Calcul", "Taux d'endettement = (charges de crédit + mensualité projet) / revenus nets × 100"), p("En France, le plafond recommandé par le HCSF est de 35 %, assurance emprunteur incluse.")] },
    ],
    example: { title: "Couple avec 4 000 € de revenus", blocks: [p("Charges actuelles 300 € + mensualité projet 1 100 € = 1 400 €. Taux = 1 400 / 4 000 = 35 %.")] },
    conseils: ["Incluez toutes vos mensualités de crédit en cours.", "Intégrez l'assurance emprunteur dans la mensualité projetée.", "Visez une marge sous 35 % pour faciliter l'acceptation bancaire."],
    limites: ["Ne modélise pas le reste à vivre exigé par certaines banques.", "Les revenus non stables peuvent être lissés différemment par la banque."],
  }),
  faq: buildFaq([
    { question: "Quel est le plafond d'endettement en France ?", answer: "Le HCSF recommande un maximum de 35 % des revenus nets, charges de crédit incluses." },
    { question: "L'assurance emprunteur compte-t-elle ?", answer: "Oui, les banques l'intègrent généralement dans le calcul du taux d'endettement." },
    { question: "Peut-on dépasser 35 % ?", answer: "Exceptionnellement pour certains profils ou opérations, mais c'est rare depuis 2022." },
    { question: "Comment réduire son taux d'endettement ?", answer: "Augmenter les revenus, solder un crédit, allonger la durée ou augmenter l'apport pour réduire la mensualité." },
  ]),
  calculate(input) {
    const revenus = num(input.revenusMensuels);
    const charges = num(input.chargesMensuelles) + num(input.mensualiteProjet);
    const taux = revenus > 0 ? (charges / revenus) * 100 : 0;
    const marge = Math.max(0, HCSF_TAUX_ENDETTEMENT_MAX - taux);
    const ok = taux <= HCSF_TAUX_ENDETTEMENT_MAX;
    return {
      summary: `Taux d'endettement : ${formatPercent(taux, 1)} — ${ok ? `dans la limite des ${HCSF_TAUX_ENDETTEMENT_MAX} %` : "au-dessus du plafond recommandé"}.`,
      lines: [
        { label: "Taux d'endettement", value: formatPercent(taux, 1), highlight: true },
        { label: "Plafond recommandé", value: `${HCSF_TAUX_ENDETTEMENT_MAX} %` },
        { label: "Marge disponible", value: formatPercent(marge, 1), description: `Avant d'atteindre ${HCSF_TAUX_ENDETTEMENT_MAX} %` },
        { label: "Total charges mensuelles", value: formatCurrency(charges) },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
      ],
    };
  },
};

// ─── 3. Coût total du crédit ───────────────────────────────────────
export const coutTotalCredit: SimulatorDefinition = {
  slug: "cout-total-credit-immobilier",
  title: "Coût total du crédit immobilier",
  shortDescription: "Estimez le coût global de votre crédit : intérêts, assurance et montant total remboursé.",
  metaTitle: "Simulateur coût total crédit immobilier — Intérêts et assurance",
  metaDescription: "Calculez le coût total de votre crédit immobilier : intérêts, assurance emprunteur et montant global remboursé sur la durée du prêt.",
  keywords: ["coût total crédit", "intérêts crédit immobilier", "prix crédit immo"],
  category: "financement",
  icon: "wallet",
  relatedSlugs: ["mensualite-pret-immobilier", "tableau-amortissement", "assurance-emprunteur"],
  formFields: [
    { key: "montant", label: "Montant emprunté", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt", type: "number", min: 0, max: 15, step: 0.05, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 30, step: 1, suffix: "ans" },
    { key: "tauxAssurance", label: "Taux assurance emprunteur", type: "number", min: 0, max: 2, step: 0.01, suffix: "%/an" },
  ],
  defaultValues: { montant: 250000, taux: 3.5, duree: 20, tauxAssurance: 0.3 },
  content: buildContent({
    intro: "Visualisez le coût réel de votre financement au-delà de la mensualité affichée.",
    howItWorks: [{ title: "Composantes du coût", blocks: [p("Le coût total comprend le capital emprunté, les intérêts et l'assurance emprunteur sur toute la durée."), hl("Attention", "Une mensualité faible sur une longue durée peut générer des intérêts très élevés.")] }],
    conseils: ["Comparez le coût total sur différentes durées.", "Négociez le taux et l'assurance emprunteur.", "Envisagez des remboursements anticipés si possible."],
    limites: ["Frais de dossier et garantie non inclus.", "Taux fixe uniquement."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le coût total du crédit ?", answer: "La somme de tous les intérêts et assurances payés plus le capital remboursé." },
    { question: "Comment réduire le coût total ?", answer: "Durée plus courte, taux plus bas, assurance optimisée et remboursements anticipés." },
    { question: "Le coût total inclut-il le capital ?", answer: "Oui, le coût global = capital + intérêts + assurance." },
    { question: "Différence avec le TAEG ?", answer: "Le TAEG inclut aussi les frais de dossier et garantie. Ce simulateur se concentre sur intérêts et assurance." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const duree = num(input.duree);
    const mensualite = monthlyPaymentFromLoan(montant, num(input.taux), duree);
    const interets = totalInterest(mensualite, duree, montant);
    const assurance = (montant * (num(input.tauxAssurance) / 100)) * duree;
    const total = montant + interets + assurance;
    return {
      summary: `Coût total estimé : ${formatCurrency(total)} (dont ${formatCurrency(interets)} d'intérêts).`,
      lines: [
        { label: "Coût total du crédit", value: formatCurrency(total), highlight: true },
        { label: "Capital emprunté", value: formatCurrency(montant) },
        { label: "Total des intérêts", value: formatCurrency(interets) },
        { label: "Total assurance", value: formatCurrency(assurance) },
        { label: "Mensualité hors assurance", value: formatCurrency(mensualite) },
      ],
    };
  },
};

// ─── 4. Tableau d'amortissement ────────────────────────────────────
export const tableauAmortissement: SimulatorDefinition = {
  slug: "tableau-amortissement",
  title: "Tableau d'amortissement",
  shortDescription: "Générez un aperçu du tableau d'amortissement de votre crédit immobilier.",
  metaTitle: "Simulateur tableau d'amortissement crédit immobilier",
  metaDescription: "Visualisez votre tableau d'amortissement : capital remboursé, intérêts et capital restant dû mois par mois.",
  keywords: ["tableau amortissement", "échéancier crédit", "amortissement prêt immobilier"],
  category: "financement",
  icon: "calculator",
  relatedSlugs: ["mensualite-pret-immobilier", "cout-total-credit-immobilier", "remboursement-anticipe"],
  formFields: [
    { key: "montant", label: "Capital emprunté", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 30, suffix: "ans" },
  ],
  defaultValues: { montant: 200000, taux: 3.5, duree: 20 },
  content: buildContent({
    intro: "Le tableau d'amortissement détaille la répartition capital / intérêts de chaque mensualité.",
    howItWorks: [{ title: "Lecture du tableau", blocks: [p("Au début du prêt, les intérêts représentent la majorité de la mensualité. La part de capital augmente progressivement.")] }],
    conseils: ["Comparez plusieurs lignes pour comprendre l'évolution.", "Identifiez le moment où le capital remboursé dépasse les intérêts."],
    limites: ["Aperçu partiel affiché (début et fin de prêt).", "Ne tient pas compte des modulations ou remboursements anticipés."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'un tableau d'amortissement ?", answer: "Un échéancier listant pour chaque mois la part de capital, les intérêts et le capital restant dû." },
    { question: "Pourquoi les intérêts sont-ils plus élevés au début ?", answer: "Les intérêts sont calculés sur le capital restant dû, qui est maximal en début de prêt." },
    { question: "Puis-je obtenir le tableau complet ?", answer: "Votre banque vous remettra l'échéancier officiel avec toutes les échéances." },
    { question: "Le tableau change-t-il en cas de remboursement anticipé ?", answer: "Oui, le capital restant dû et les échéances futures sont recalculés." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const duree = num(input.duree);
    const schedule = buildAmortizationSchedule(montant, num(input.taux), duree);
    const mensualite = schedule[0]?.payment ?? 0;
    const totalInterets = schedule.reduce((s, r) => s + r.interest, 0);
    const preview = [
      ...schedule.slice(0, 3),
      ...(schedule.length > 6 ? schedule.slice(-3) : schedule.slice(3)),
    ];
    return {
      summary: `Mensualité : ${formatCurrency(mensualite)} — Intérêts totaux : ${formatCurrency(totalInterets)}.`,
      lines: [
        { label: "Mensualité constante", value: formatCurrency(mensualite), highlight: true },
        { label: "Total intérêts", value: formatCurrency(totalInterets) },
        { label: "Nombre d'échéances", value: String(duree * 12) },
      ],
      table: {
        caption: "Aperçu du tableau d'amortissement (premiers et derniers mois)",
        headers: ["Mois", "Mensualité", "Intérêts", "Capital", "CRD"],
        rows: preview.map((r) => [
          String(r.month),
          formatCurrency(r.payment),
          formatCurrency(r.interest),
          formatCurrency(r.principal),
          formatCurrency(r.balance),
        ]),
      },
    };
  },
};

export const financementSimulatorsPart1 = [
  fraisNotaire,
  tauxEndettement,
  coutTotalCredit,
  tableauAmortissement,
];
