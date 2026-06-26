import type { SimulatorDefinition } from "../../types";
import { draftSimulator, num } from "../_shared/helpers";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
} from "@/lib/utils/format";
import {
  PFU_TAUX_GLOBAL,
  PFU_NET_RATIO,
} from "@/data/regulations/fiscalite";
import {
  LIVRET_A_PLAFOND,
  RETRAITE_TAUX_RETRAIT_DURABLE,
} from "@/data/regulations/retraite";

const capitalisationRetraite = draftSimulator({
  slug: "simulateur-capitalisation-retraite",
  title: "Capitalisation retraite",
  shortDescription: "Projetez le capital retraite nécessaire et la rente mensuelle associée.",
  metaTitle: "Simulateur capitalisation retraite",
  metaDescription: "Calculez le capital retraite cible : dépenses futures, taux de retrait durable et rente mensuelle.",
  keywords: ["capitalisation retraite", "capital retraite", "revenu retraite"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  regulationIds: ["retraite", "fiscalite"],
  relatedSlugs: ["simulateur-retraite", "simulateur-per-retraite", "simulateur-rente-viagere"],
  formFields: [
    { key: "depensesMensuelles", label: "Dépenses mensuelles visées", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "pensionEtat", label: "Pension retraite État", type: "number", min: 0, step: 100, suffix: "€/mois" },
    { key: "tauxRetrait", label: "Taux de retrait durable", type: "number", min: 1, max: 6, step: 0.5, suffix: "%", hint: `Repère : ${RETRAITE_TAUX_RETRAIT_DURABLE * 100} %` },
    { key: "duree", label: "Durée retraite estimée", type: "number", min: 10, max: 40, suffix: "ans" },
  ],
  defaultValues: { depensesMensuelles: 2500, pensionEtat: 1200, tauxRetrait: RETRAITE_TAUX_RETRAIT_DURABLE * 100, duree: 25 },
  content: buildContent({
    intro: "La capitalisation retraite complète les pensions de base pour maintenir votre niveau de vie.",
    howItWorks: [{ title: "Capital cible", blocks: [p("Manque mensuel = dépenses − pension. Capital = manque × 12 / taux retrait."), hl("Règle 4 %", `Retrait durable indicatif : ${formatPercent(RETRAITE_TAUX_RETRAIT_DURABLE * 100, 0)} par an.`)] }],
    conseils: ["Commencez tôt avec PER ou assurance-vie.", "Diversifiez les sources de revenus.", "Actualisez la projection chaque année."],
    limites: ["Pension État estimée grossièrement.", "Inflation et fiscalité non détaillées."],
  }),
  faq: buildFaq([
    { question: "Combien capitaliser pour la retraite ?", answer: "Dépend de l'écart entre dépenses visées et pensions obligatoires." },
    { question: "Règle des 4 % ?", answer: "Retrait annuel de 4 % du capital pour durée longue sans épuiser le capital." },
    { question: "PER ou assurance-vie ?", answer: "PER pour déduction ; AV pour flexibilité avant retraite." },
    { question: "Quand commencer ?", answer: "Plus tôt = moins de versements mensuels nécessaires grâce aux intérêts composés." },
  ]),
  calculate(input: Record<string, number | string>) {
    const dep = num(input.depensesMensuelles);
    const pension = num(input.pensionEtat);
    const manque = Math.max(0, dep - pension);
    const taux = num(input.tauxRetrait) / 100;
    const capital = taux > 0 ? (manque * 12) / taux : 0;
    const duree = num(input.duree);
    return {
      summary: `Capital retraite cible : ${formatCurrency(capital)} (manque : ${formatCurrency(manque)}/mois).`,
      lines: [
        { label: "Capital cible", value: formatCurrency(capital), highlight: true },
        { label: "Manque mensuel", value: formatCurrency(manque), highlight: true },
        { label: "Dépenses visées", value: formatCurrency(dep) },
        { label: "Pension État", value: formatCurrency(pension) },
        { label: "Horizon retraite", value: `${duree} ans` },
      ],
    };
  },
});

const fraisBanqueAnnuels = draftSimulator({
  slug: "simulateur-frais-banque-annuels",
  title: "Frais bancaires annuels",
  shortDescription: "Additionnez vos frais bancaires et estimez l'économie en changeant d'offre ou de banque.",
  metaTitle: "Simulateur frais banque annuels",
  metaDescription: "Calculez le coût total de votre banque : tenue de compte, carte, incidents et options.",
  keywords: ["frais bancaires", "coût banque", "frais tenue compte"],
  domain: "finance",
  category: "epargne",
  icon: "wallet",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-budget-50-30-20", "budget-reste-a-vivre", "simulateur-capacite-epargne-mensuelle"],
  formFields: [
    { key: "tenueCompte", label: "Tenue de compte / an", type: "number", min: 0, step: 5, suffix: "€" },
    { key: "carte", label: "Carte bancaire / an", type: "number", min: 0, step: 5, suffix: "€" },
    { key: "incidents", label: "Incidents et commissions / an", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "options", label: "Options (SMS, assurances…) / an", type: "number", min: 0, step: 10, suffix: "€" },
  ],
  defaultValues: { tenueCompte: 24, carte: 45, incidents: 0, options: 30 },
  content: buildContent({
    intro: "Les frais bancaires grignotent l'épargne : cartes premium, options inutiles et incidents évitables.",
    howItWorks: [{ title: "Total annuel", blocks: [p("Total = somme de tous les postes. Comparez avec les offres en ligne souvent gratuites sous conditions."), hl("Droit", "La banque doit informer des frais — récapitulatif annuel obligatoire.")] }],
    conseils: ["Négociez ou changez de banque.", "Désactivez les options non utilisées.", "Évitez les découverts non autorisés."],
    limites: ["Frais variables selon banque et profil.", "Offres jeunes/pros non modélisées."],
  }),
  faq: buildFaq([
    { question: "Frais moyens en France ?", answer: "Environ 150 à 200 €/an selon l'Observatoire des tarifs bancaires." },
    { question: "Banque en ligne ?", answer: "Souvent gratuite sous conditions de revenus ou d'utilisation carte." },
    { question: "Incident de paiement ?", answer: "Commission + agios — coûteux, à éviter absolument." },
    { question: "Changer de banque ?", answer: "Mobilité bancaire gratuite — la nouvelle banque gère le transfert." },
  ]),
  calculate(input: Record<string, number | string>) {
    const total =
      num(input.tenueCompte) + num(input.carte) + num(input.incidents) + num(input.options);
    const mensuel = total / 12;
    return {
      summary: `Frais bancaires : ${formatCurrency(total)}/an (${formatCurrency(mensuel)}/mois).`,
      lines: [
        { label: "Total annuel", value: formatCurrency(total), highlight: true },
        { label: "Coût mensuel", value: formatCurrency(mensuel), highlight: true },
        { label: "Tenue de compte", value: formatCurrency(num(input.tenueCompte)) },
        { label: "Carte bancaire", value: formatCurrency(num(input.carte)) },
        { label: "Incidents + options", value: formatCurrency(num(input.incidents) + num(input.options)) },
      ],
    };
  },
});

const budget503020 = draftSimulator({
  slug: "simulateur-budget-50-30-20",
  title: "Budget 50/30/20",
  shortDescription: "Appliquez la règle 50/30/20 à vos revenus : besoins, envies et épargne.",
  metaTitle: "Simulateur budget 50/30/20",
  metaDescription: "Répartissez vos revenus selon la règle 50 % besoins, 30 % envies, 20 % épargne.",
  keywords: ["budget 50 30 20", "règle 50 30 20", "gestion budget"],
  domain: "finance",
  category: "epargne",
  icon: "calculator",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-allocation-vie", "budget-reste-a-vivre", "simulateur-capacite-epargne-mensuelle"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "besoins", label: "Besoins actuels (loyer, crédits…)", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "envies", label: "Dépenses loisirs actuelles", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { revenus: 3200, besoins: 1800, envies: 900 },
  content: buildContent({
    intro: "La règle 50/30/20 structure le budget : 50 % besoins essentiels, 30 % envies, 20 % épargne et remboursement dettes.",
    howItWorks: [{ title: "Répartition cible", blocks: [p("Besoins cibles = 50 % revenus. Envies = 30 %. Épargne = 20 %."), hl("Adaptation", "En zone chère, les besoins dépassent 50 % — ajustez les envies.")] }],
    conseils: ["Suivez vos dépenses 1 mois avant d'ajuster.", "Automatisez les 20 % épargne.", "Réduisez les abonnements inutilisés."],
    limites: ["Règle indicative, pas universelle.", "Ne remplace pas un compte détaillé."],
  }),
  faq: buildFaq([
    { question: "Origine du 50/30/20 ?", answer: "Popularisé par Elizabeth Warren — méthode simple de budgeting." },
    { question: "Besoins > 50 % ?", answer: "Courant en grande ville — réduisez les envies ou augmentez les revenus." },
    { question: "Épargne inclut quoi ?", answer: "Épargne, investissements et remboursement anticipé de dettes." },
    { question: "Couple ?", answer: "Appliquez la règle sur les revenus du foyer." },
  ]),
  calculate(input: Record<string, number | string>) {
    const rev = num(input.revenus);
    const cibleBesoins = rev * 0.5;
    const cibleEnvies = rev * 0.3;
    const cibleEpargne = rev * 0.2;
    const besoins = num(input.besoins);
    const envies = num(input.envies);
    const epargneReelle = rev - besoins - envies;
    return {
      summary: `Épargne cible 20 % : ${formatCurrency(cibleEpargne)} — réelle : ${formatCurrency(epargneReelle)}.`,
      lines: [
        { label: "Besoins (cible 50 %)", value: formatCurrency(cibleBesoins), highlight: true },
        { label: "Envies (cible 30 %)", value: formatCurrency(cibleEnvies) },
        { label: "Épargne (cible 20 %)", value: formatCurrency(cibleEpargne), highlight: true },
        { label: "Besoins réels", value: formatCurrency(besoins) },
        { label: "Épargne réelle", value: formatCurrency(epargneReelle) },
      ],
    };
  },
});

const inflationPouvoirAchat = draftSimulator({
  slug: "simulateur-inflation-pouvoir-achat",
  title: "Inflation et pouvoir d'achat",
  shortDescription: "Mesurez l'érosion du pouvoir d'achat de votre épargne ou de vos revenus face à l'inflation.",
  metaTitle: "Simulateur inflation pouvoir d'achat",
  metaDescription: "Calculez la perte de pouvoir d'achat d'un capital ou revenu face à l'inflation sur plusieurs années.",
  keywords: ["inflation pouvoir achat", "érosion épargne", "valeur réelle capital"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-inflation", "interets-composes", "simulateur-capitalisation-retraite"],
  formFields: [
    { key: "montant", label: "Montant nominal", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "inflation", label: "Inflation annuelle", type: "number", min: 0, max: 15, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 40, suffix: "ans" },
    { key: "revalorisation", label: "Revalorisation annuelle (salaire, retraite…)", type: "number", min: 0, max: 10, step: 0.5, suffix: "%" },
  ],
  defaultValues: { montant: 40000, inflation: 2.5, duree: 15, revalorisation: 1 },
  content: buildContent({
    intro: "L'inflation réduit le pouvoir d'achat : un capital nominal stable achète moins de biens chaque année.",
    howItWorks: [{ title: "Valeur réelle", blocks: [p("Valeur réelle = montant × (1 + revalorisation)^n / (1 + inflation)^n."), hl("Double peine", "Épargne non rémunérée perd deux fois : pas d'intérêts et inflation.")] }],
    conseils: ["Placez sur actifs qui battent l'inflation.", "Indexez vos objectifs retraite.", "Diversifiez géographiquement."],
    limites: ["Inflation moyenne estimée — peut varier fortement.", "Inflation sectorielle (alimentation, énergie) non détaillée."],
  }),
  faq: buildFaq([
    { question: "Inflation moyenne France ?", answer: "Environ 2 à 3 % sur longue période — pics passagers possibles." },
    { question: "Comment se protéger ?", answer: "Actions, immobilier, obligations indexées inflation (OATi)." },
    { question: "Livret A suffisant ?", answer: "Indexé sur inflation + 0,5 % — peut être temporairement en dessous." },
    { question: "Différence avec simulateur-inflation ?", answer: "Ce simulateur intègre une revalorisation (salaire, pension) en plus de l'inflation." },
  ]),
  calculate(input: Record<string, number | string>) {
    const montant = num(input.montant);
    const inflation = num(input.inflation) / 100;
    const reval = num(input.revalorisation) / 100;
    const duree = num(input.duree);
    const nominal = montant * Math.pow(1 + reval, duree);
    const reel = nominal / Math.pow(1 + inflation, duree);
    const perte = montant - reel;
    const inflationCum = (Math.pow(1 + inflation, duree) - 1) * 100;
    return {
      summary: `Pouvoir d'achat réel dans ${duree} ans : ${formatCurrency(reel)} (nominal : ${formatCurrency(nominal)}).`,
      lines: [
        { label: "Valeur réelle", value: formatCurrency(reel), highlight: true },
        { label: "Valeur nominale", value: formatCurrency(nominal) },
        { label: "Perte pouvoir d'achat", value: formatCurrency(Math.max(0, perte)), highlight: true },
        { label: "Inflation cumulée", value: formatPercent(inflationCum, 1) },
        { label: "Durée", value: `${duree} ans` },
      ],
    };
  },
});

export const archivedFinanceDrafts: SimulatorDefinition[] = [
  capitalisationRetraite,
  fraisBanqueAnnuels,
  budget503020,
  inflationPouvoirAchat,
];
