import type { SimulatorDefinition } from "../types";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const remboursementAnticipe: SimulatorDefinition = {
  slug: "remboursement-anticipe",
  title: "Remboursement anticipé",
  shortDescription:
    "Estimez les économies d'intérêts et les indemnités (IRA) d'un remboursement anticipé.",
  metaTitle: "Simulateur remboursement anticipé crédit immobilier",
  metaDescription:
    "Calculez l'impact d'un remboursement anticipé : économie d'intérêts, indemnités de remboursement anticipé (IRA) et gain net.",
  keywords: ["remboursement anticipé", "IRA crédit", "solder crédit immobilier"],
  category: "financement",
  icon: "calculator",
  relatedSlugs: ["tableau-amortissement", "cout-total-credit-immobilier", "mensualite-pret-immobilier"],
  formFields: [
    { key: "capitalRestant", label: "Capital restant dû", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "montantRembourse", label: "Montant remboursé par anticipation", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt du prêt", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "moisRestants", label: "Mois restants", type: "number", min: 1, step: 1, suffix: "mois" },
    { key: "tauxIra", label: "Indemnités IRA", type: "number", min: 0, max: 3, step: 0.1, suffix: "%", hint: "Plafonné à 3 % ou 6 mois d'intérêts" },
  ],
  defaultValues: { capitalRestant: 150000, montantRembourse: 30000, taux: 3.5, moisRestants: 180, tauxIra: 1 },
  content: buildContent({
    intro: "Le remboursement anticipé réduit le capital restant dû et génère une économie d'intérêts, parfois contrebalancée par des indemnités (IRA).",
    howItWorks: [{ title: "Calcul simplifié", blocks: [p("L'économie d'intérêts est estimée sur le montant remboursé par anticipation sur la durée restante."), hl("IRA", "Les indemnités sont plafonnées à 3 % du capital remboursé ou 6 mois d'intérêts sur le montant remboursé (le plus faible).")] }],
    conseils: ["Vérifiez les conditions IRA dans votre offre de prêt.", "Un remboursement anticipé est plus rentable en début de prêt.", "Comparez le gain net après IRA."],
    limites: ["Estimation simplifiée des intérêts évités.", "Ne tient pas compte des exemptions d'IRA (vente, mutation…)."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'une IRA ?", answer: "Indemnité de Remboursement Anticipé, pénalité prévue au contrat lors d'un remboursement avant terme." },
    { question: "Peut-on rembourser sans IRA ?", answer: "Oui, dans certains cas (vente, décès, fin de contrat de travail…) selon le contrat." },
    { question: "Remboursement partiel ou total ?", answer: "Les deux sont possibles. Le partiel réduit les mensualités ou la durée selon l'option choisie." },
    { question: "Quand rembourser par anticipation ?", answer: "Quand l'économie d'intérêts dépasse les IRA et que vous disposez de liquidités." },
  ]),
  calculate(input) {
    const crd = num(input.capitalRestant);
    const montant = Math.min(num(input.montantRembourse), crd);
    const mois = num(input.moisRestants);
    const tauxM = num(input.taux) / 100 / 12;
    const economieInterets = montant * tauxM * mois * 0.5;
    const ira = Math.min(montant * (num(input.tauxIra) / 100), montant * tauxM * 6);
    const gainNet = economieInterets - ira;
    return {
      summary: `Gain net estimé après IRA : ${formatCurrency(gainNet)}.`,
      lines: [
        { label: "Gain net estimé", value: formatCurrency(gainNet), highlight: true },
        { label: "Économie d'intérêts estimée", value: formatCurrency(economieInterets) },
        { label: "Indemnités IRA estimées", value: formatCurrency(ira) },
        { label: "Montant remboursé", value: formatCurrency(montant) },
        { label: "Nouveau CRD estimé", value: formatCurrency(crd - montant) },
      ],
    };
  },
};

export const pretPtz: SimulatorDefinition = {
  slug: "pret-taux-zero-ptz",
  title: "Prêt à taux zéro (PTZ)",
  shortDescription:
    "Estimez le montant de PTZ éventuel selon la zone, les revenus et le prix du logement.",
  metaTitle: "Simulateur PTZ — Prêt à taux zéro 2025",
  metaDescription:
    "Estimez votre éligibilité et le montant du Prêt à Taux Zéro (PTZ) selon votre zone, vos revenus et le prix du bien.",
  keywords: ["PTZ", "prêt taux zéro", "primo accédant", "aide achat immobilier"],
  category: "financement",
  icon: "home",
  relatedSlugs: ["capacite-emprunt", "frais-de-notaire", "mensualite-pret-immobilier"],
  formFields: [
    { key: "revenuFiscal", label: "Revenu fiscal de référence", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "nbPersonnes", label: "Personnes dans le foyer", type: "number", min: 1, max: 8, step: 1 },
    {
      key: "zone",
      label: "Zone du bien",
      type: "select",
      options: [
        { value: "A", label: "Zone A (Paris, Côte d'Azur…)" },
        { value: "Abis", label: "Zone A bis" },
        { value: "B1", label: "Zone B1" },
        { value: "B2", label: "Zone B2" },
        { value: "C", label: "Zone C" },
      ],
    },
    { key: "prixBien", label: "Prix du logement", type: "number", min: 0, step: 5000, suffix: "€" },
  ],
  defaultValues: { revenuFiscal: 45000, nbPersonnes: 2, zone: "B1", prixBien: 250000 },
  content: buildContent({
    intro: "Le PTZ est un prêt sans intérts réservé aux primo-accédants sous conditions de ressources et de zone.",
    howItWorks: [{ title: "Critères principaux", blocks: [p("Éligibilité selon revenus, zone géographique, nature du bien (neuf, ancien avec travaux) et primo-accession."), hl("Montant", "Le PTZ complète un prêt principal et peut couvrir jusqu'à 50 % du projet dans certaines zones.")] }],
    conseils: ["Vérifiez les plafonds de ressources officiels sur service-public.fr.", "Le PTZ ne finance pas les frais de notaire.", "Combinez-le avec d'autres dispositifs (Action Logement…)."],
    limites: ["Estimation indicative : les plafonds 2025 sont simplifiés.", "Ne remplace pas l'instruction bancaire ni l'accord de la collectivité."],
  }),
  faq: buildFaq([
    { question: "Qui peut obtenir un PTZ ?", answer: "Primo-accédants respectant les plafonds de revenus selon la zone et la composition du foyer." },
    { question: "Le PTZ couvre-t-il tout l'achat ?", answer: "Non, il complète un prêt principal. Le montant varie selon la zone et la tranche de revenus." },
    { question: "PTZ dans l'ancien ?", answer: "Possible avec travaux représentant au moins 25 % du coût total de l'opération." },
    { question: "Faut-il rembourser le PTZ ?", answer: "Oui, mais sans intérêts, avec un différé de remboursement possible selon les revenus." },
  ]),
  calculate(input) {
    const revenu = num(input.revenuFiscal);
    const prix = num(input.prixBien);
    const zone = String(input.zone);
    const plafonds: Record<string, number> = { A: 49000, Abis: 49000, B1: 42000, B2: 34500, C: 31500 };
    const plafond = plafonds[zone] ?? 42000;
    const eligible = revenu <= plafond * Math.max(1, num(input.nbPersonnes) * 0.5);
    const quotite = zone === "A" || zone === "Abis" ? 0.4 : zone === "B1" ? 0.4 : zone === "B2" ? 0.2 : 0.2;
    const montantPtz = eligible ? Math.min(prix * quotite, 100000) : 0;
    return {
      summary: eligible
        ? `PTZ estimé : ${formatCurrency(montantPtz)} (sous conditions d'éligibilité).`
        : "Revenus au-dessus du plafond estimé — PTZ probablement non éligible.",
      lines: [
        { label: "Montant PTZ estimé", value: formatCurrency(montantPtz), highlight: true },
        { label: "Éligibilité estimée", value: eligible ? "Oui" : "Non" },
        { label: "Plafond revenu (estimation)", value: formatCurrency(plafond) },
        { label: "Quotité appliquée", value: formatPercent(quotite * 100, 0) },
        { label: "Prix du logement", value: formatCurrency(prix) },
      ],
    };
  },
};

export const pretRelais: SimulatorDefinition = {
  slug: "pret-relais",
  title: "Prêt relais",
  shortDescription:
    "Estimez le montant d'un prêt relais pour financer un achat avant la vente de votre bien actuel.",
  metaTitle: "Simulateur prêt relais immobilier",
  metaDescription:
    "Calculez le montant estimé d'un prêt relais : valeur du bien à vendre, crédit restant dû et avance bancaire.",
  keywords: ["prêt relais", "crédit relais", "acheter avant de vendre"],
  category: "financement",
  icon: "home",
  relatedSlugs: ["capacite-emprunt", "mensualite-pret-immobilier", "frais-de-notaire"],
  formFields: [
    { key: "valeurBien", label: "Valeur estimée du bien à vendre", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "crd", label: "Capital restant dû sur le bien actuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "pctAvance", label: "Avance bancaire", type: "number", min: 50, max: 80, step: 5, suffix: "%", hint: "Généralement 60 à 80 % de la valeur" },
    { key: "taux", label: "Taux du prêt relais", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "dureeMois", label: "Durée du relais", type: "number", min: 6, max: 24, step: 1, suffix: "mois" },
  ],
  defaultValues: { valeurBien: 320000, crd: 80000, pctAvance: 70, taux: 4.5, dureeMois: 18 },
  content: buildContent({
    intro: "Le prêt relais permet d'acheter un nouveau bien avant d'avoir vendu l'actuel, sous conditions.",
    howItWorks: [{ title: "Principe", blocks: [p("La banque accorde une avance (souvent 60 à 80 % de la valeur du bien à vendre) pour financer l'achat. Le relais est remboursé à la vente."), hl("Coût", "Les taux de prêt relais sont généralement plus élevés qu'un crédit amortissable classique.")] }],
    conseils: ["Obtenez une estimation fiable de la valeur de revente.", "Prévoyez une marge si la vente tarde.", "Comparez relais sec et relais adossé."],
    limites: ["Estimation : l'accord dépend de la solvabilité globale.", "Frais de dossier et garanties non inclus."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'un prêt relais ?", answer: "Un crédit temporaire remboursé lors de la vente de votre bien actuel." },
    { question: "Quel montant peut-on emprunter ?", answer: "Souvent 60 à 80 % de la valeur estimée du bien à vendre, moins le CRD éventuel." },
    { question: "Prêt relais sec ou adossé ?", answer: "Sec : uniquement le relais. Adossé : relais + crédit amortissable sur le nouveau bien." },
    { question: "Que se passe-t-il si le bien ne se vend pas ?", answer: "Vous devrez renégocier, convertir en crédit classique ou ajuster le prix de vente." },
  ]),
  calculate(input) {
    const valeur = num(input.valeurBien);
    const crd = num(input.crd);
    const avance = valeur * (num(input.pctAvance) / 100);
    const montantRelais = Math.max(0, avance - crd);
    const interets = montantRelais * (num(input.taux) / 100) * (num(input.dureeMois) / 12);
    return {
      summary: `Montant de prêt relais estimé : ${formatCurrency(montantRelais)}.`,
      lines: [
        { label: "Montant prêt relais", value: formatCurrency(montantRelais), highlight: true },
        { label: "Avance sur valeur", value: formatCurrency(avance) },
        { label: "Capital restant dû déduit", value: formatCurrency(crd) },
        { label: "Intérêts estimés sur la durée", value: formatCurrency(interets) },
        { label: "Valeur du bien à vendre", value: formatCurrency(valeur) },
      ],
    };
  },
};

export const rachatCredit: SimulatorDefinition = {
  slug: "rachat-credit-immobilier",
  title: "Rachat de crédit immobilier",
  shortDescription:
    "Comparez votre crédit actuel et un rachat : mensualité et coût total.",
  metaTitle: "Simulateur rachat de crédit immobilier",
  metaDescription:
    "Estimez les économies potentielles d'un rachat ou d'une renégociation de crédit immobilier : mensualité et coût total.",
  keywords: ["rachat crédit immobilier", "renégociation prêt", "restructuration crédit"],
  category: "financement",
  icon: "wallet",
  relatedSlugs: ["mensualite-pret-immobilier", "cout-total-credit-immobilier", "assurance-emprunteur"],
  formFields: [
    { key: "crd", label: "Capital restant dû", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "tauxActuel", label: "Taux actuel", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "tauxNouveau", label: "Nouveau taux proposé", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "moisRestants", label: "Mois restants", type: "number", min: 1, suffix: "mois" },
    { key: "fraisRachat", label: "Frais de rachat / dossier", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { crd: 180000, tauxActuel: 4.2, tauxNouveau: 3.5, moisRestants: 180, fraisRachat: 2500 },
  content: buildContent({
    intro: "Le rachat de crédit consiste à remplacer votre prêt actuel par un nouveau, souvent pour baisser la mensualité ou le taux.",
    howItWorks: [{ title: "Comparaison", blocks: [p("Comparez la mensualité et le coût total restant entre la situation actuelle et le nouveau prêt proposé.")] }],
    conseils: ["Intégrez les frais de rachat dans le calcul.", "Vérifiez les IRA sur l'ancien prêt.", "Comparez aussi la durée restante proposée."],
    limites: ["Estimation sans IRA de l'ancien prêt.", "Nouvelle assurance emprunteur non détaillée."],
  }),
  faq: buildFaq([
    { question: "Rachat ou renégociation ?", answer: "La renégociation se fait avec la même banque. Le rachat implique un nouvel établissement." },
    { question: "Quand le rachat est-il rentable ?", answer: "Quand la baisse de taux ou de mensualité compense les frais sur la durée restante." },
    { question: "Peut-on racheter plusieurs crédits ?", answer: "Oui, le regroupement de crédits inclut parfois immobilier et consommation." },
    { question: "Quels frais prévoir ?", answer: "Frais de dossier, garantie, IRA éventuelles et frais de courtier." },
  ]),
  calculate(input) {
    const crd = num(input.crd);
    const mois = num(input.moisRestants);
    const annees = mois / 12;
    const mActuel = monthlyPaymentFromLoan(crd, num(input.tauxActuel), annees);
    const mNouveau = monthlyPaymentFromLoan(crd, num(input.tauxNouveau), annees);
    const ecoMensuelle = mActuel - mNouveau;
    const totalActuel = mActuel * mois;
    const totalNouveau = mNouveau * mois + num(input.fraisRachat);
    const ecoTotale = totalActuel - totalNouveau;
    return {
      summary: `Économie mensuelle estimée : ${formatCurrency(ecoMensuelle)} (${ecoTotale >= 0 ? "gain" : "surcoût"} total : ${formatCurrency(Math.abs(ecoTotale))}).`,
      lines: [
        { label: "Économie mensuelle", value: formatCurrency(ecoMensuelle), highlight: true },
        { label: "Mensualité actuelle", value: formatCurrency(mActuel) },
        { label: "Nouvelle mensualité", value: formatCurrency(mNouveau) },
        { label: "Coût total restant actuel", value: formatCurrency(totalActuel) },
        { label: "Coût total avec rachat", value: formatCurrency(totalNouveau) },
        { label: "Frais de rachat", value: formatCurrency(num(input.fraisRachat)) },
      ],
    };
  },
};

export const assuranceEmprunteur: SimulatorDefinition = {
  slug: "assurance-emprunteur",
  title: "Assurance emprunteur",
  shortDescription:
    "Estimez le coût mensuel et total de votre assurance emprunteur.",
  metaTitle: "Simulateur assurance emprunteur — Coût mensuel et total",
  metaDescription:
    "Calculez le coût de l'assurance emprunteur sur la durée du prêt : mensualité, coût total et part dans la mensualité globale.",
  keywords: ["assurance emprunteur", "coût assurance crédit", "délégation assurance"],
  category: "financement",
  icon: "wallet",
  relatedSlugs: ["mensualite-pret-immobilier", "capacite-emprunt", "cout-total-credit-immobilier"],
  formFields: [
    { key: "capital", label: "Capital emprunté", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "tauxAssurance", label: "Taux d'assurance annuel", type: "number", min: 0, max: 2, step: 0.01, suffix: "%" },
    { key: "duree", label: "Durée du prêt", type: "number", min: 1, max: 30, suffix: "ans" },
  ],
  defaultValues: { capital: 250000, tauxAssurance: 0.32, duree: 20 },
  content: buildContent({
    intro: "L'assurance emprunteur couvre le remboursement du crédit en cas de décès, invalidité ou incapacité.",
    howItWorks: [{ title: "Calcul du coût", blocks: [p("Coût annuel ≈ capital × taux d'assurance. Le taux varie selon l'âge, la santé et les garanties."), hl("Délégation", "Vous pouvez choisir une assurance externe (délégation) souvent moins chère que le contrat groupe de la banque.")] }],
    conseils: ["Comparez contrat groupe et délégation d'assurance.", "Adaptez les garanties à votre situation (couple, travail pénible…).", "Le taux diminue si le capital est dégressif (sur capital restant dû)."],
    limites: ["Taux fixe sur capital initial : estimation haute.", "Devis médical et surprime non modélisés."],
  }),
  faq: buildFaq([
    { question: "L'assurance emprunteur est-elle obligatoire ?", answer: "Oui pour obtenir le prêt, mais vous pouvez choisir votre assureur (loi Lemoine)." },
    { question: "Quel taux moyen ?", answer: "Entre 0,20 % et 0,45 % du capital par an selon le profil." },
    { question: "Peut-on changer d'assurance en cours de prêt ?", answer: "Oui, chaque année à la date anniversaire (résiliation) ou via la loi Lemoine." },
    { question: "Assurance sur capital initial ou CRD ?", answer: "Sur capital initial : mensualité constante. Sur CRD : coût dégressif." },
  ]),
  calculate(input) {
    const capital = num(input.capital);
    const duree = num(input.duree);
    const taux = num(input.tauxAssurance);
    const annuel = capital * (taux / 100);
    const mensuel = annuel / 12;
    const total = annuel * duree;
    return {
      summary: `Assurance : ${formatCurrency(mensuel)}/mois — ${formatCurrency(total)} sur ${duree} ans.`,
      lines: [
        { label: "Assurance mensuelle", value: formatCurrency(mensuel), highlight: true },
        { label: "Coût total sur la durée", value: formatCurrency(total), highlight: true },
        { label: "Taux appliqué", value: formatPercent(taux, 2) },
        { label: "Capital assuré", value: formatCurrency(capital) },
      ],
    };
  },
};

export const fraisAgence: SimulatorDefinition = {
  slug: "frais-agence-immobiliere",
  title: "Frais d'agence immobilière",
  shortDescription:
    "Calculez les honoraires d'agence immobilière à la charge de l'acquéreur ou du vendeur.",
  metaTitle: "Simulateur frais d'agence immobilière",
  metaDescription:
    "Estimez les honoraires d'agence immobilière selon le prix du bien et le taux appliqué (généralement 3 à 8 %).",
  keywords: ["frais agence immobilière", "honoraires agent immobilier", "commission agence"],
  category: "financement",
  icon: "building",
  relatedSlugs: ["frais-de-notaire", "capacite-emprunt", "budget-travaux"],
  formFields: [
    { key: "prix", label: "Prix du bien (honoraires inclus ou exclus)", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "tauxAgence", label: "Honoraires d'agence", type: "number", min: 0, max: 10, step: 0.1, suffix: "%" },
    {
      key: "charge",
      label: "Honoraires à la charge de",
      type: "select",
      options: [
        { value: "acquereur", label: "L'acquéreur" },
        { value: "vendeur", label: "Le vendeur" },
      ],
    },
  ],
  defaultValues: { prix: 280000, tauxAgence: 5, charge: "acquereur" },
  content: buildContent({
    intro: "Les honoraires d'agence varient selon les mandats et peuvent être à la charge de l'acquéreur ou du vendeur.",
    howItWorks: [{ title: "Calcul", blocks: [p("Honoraires = prix de vente × taux d'agence. En FAI (Frais d'Agence Inclus), le prix affiché intègre déjà les honoraires.")] }],
    conseils: ["Vérifiez si le prix est FAI ou hors honoraires.", "Les taux ne sont pas encadrés : comparez les mandats.", "Intégrez les honoraires dans votre budget acquéreur si à votre charge."],
    limites: ["Ne distingue pas mandat simple / exclusif.", "TVA incluse selon mandat (non détaillée ici)."],
  }),
  faq: buildFaq([
    { question: "Quel taux d'agence moyen ?", answer: "Entre 3 et 8 % du prix de vente selon la zone et le type de bien." },
    { question: "FAI signifie quoi ?", answer: "Frais d'Agence Inclus : le prix affiché comprend les honoraires." },
    { question: "Peut-on négocier les honoraires ?", answer: "Oui, surtout en mandat simple ou si plusieurs agences sont en concurrence." },
    { question: "Les honoraires sont-ils financés par le crédit ?", answer: "Parfois, si la banque l'accepte et que le taux d'endettement le permet." },
  ]),
  calculate(input) {
    const prix = num(input.prix);
    const taux = num(input.tauxAgence);
    const honoraires = prix * (taux / 100);
    const charge = input.charge === "acquereur" ? "acquéreur" : "vendeur";
    return {
      summary: `Honoraires d'agence : ${formatCurrency(honoraires)} (${formatPercent(taux, 1)}), à la charge de l'${charge}.`,
      lines: [
        { label: "Honoraires d'agence", value: formatCurrency(honoraires), highlight: true },
        { label: "Taux appliqué", value: formatPercent(taux, 1) },
        { label: "Prix de référence", value: formatCurrency(prix) },
        { label: "À la charge de", value: charge === "acquéreur" ? "L'acquéreur" : "Le vendeur" },
      ],
    };
  },
};

export const financementSimulatorsPart2 = [
  remboursementAnticipe,
  pretPtz,
  pretRelais,
  rachatCredit,
  assuranceEmprunteur,
  fraisAgence,
];
