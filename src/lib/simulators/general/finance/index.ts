import type { SimulatorDefinition } from "../../types";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
  formatNumber,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import {
  RETRAITE_TAUX_RETRAIT_DURABLE,
  LIVRET_A_PLAFOND,
} from "@/lib/config/retraite";
import {
  PFU_TAUX_GLOBAL,
  PEA_PS_APRES_5_ANS,
  PEA_DUREE_FISCALITE_MIN,
  getBaremeKilometriqueCoeff,
  BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE,
} from "@/lib/config/fiscalite";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const mensualiteCreditConsommation: SimulatorDefinition = {
  slug: "mensualite-credit-consommation",
  title: "Mensualité crédit consommation",
  shortDescription:
    "Calculez la mensualité d'un crédit à la consommation selon le montant, le taux et la durée.",
  metaTitle: "Simulateur mensualité crédit consommation",
  metaDescription:
    "Estimez la mensualité de votre crédit à la consommation : montant emprunté, taux d'intérêt et durée du prêt.",
  keywords: ["mensualité crédit consommation", "prêt personnel", "simulateur crédit"],
  domain: "finance",
  category: "credit",
  icon: "wallet",
  relatedSlugs: ["cout-total-credit-consommation", "loa-vs-credit-auto", "budget-reste-a-vivre"],
  formFields: [
    { key: "montant", label: "Montant emprunté", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt annuel", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée du crédit", type: "number", min: 1, max: 10, suffix: "ans" },
  ],
  defaultValues: { montant: 15000, taux: 5.5, duree: 5 },
  content: buildContent({
    intro: "Le crédit à la consommation permet de financer un achat ou un besoin ponctuel sur une durée courte.",
    howItWorks: [
      {
        title: "Formule de mensualité",
        blocks: [
          p("La mensualité est calculée selon la formule d'amortissement classique à taux fixe."),
          hl("Durée", "Les crédits consommation durent généralement entre 12 mois et 7 ans."),
        ],
      },
    ],
    example: { title: "15 000 € sur 5 ans à 5,5 %", blocks: [p("Mensualité estimée : environ 287 €.")] },
    conseils: ["Comparez plusieurs offres avant de signer.", "Vérifiez le TAEG, pas seulement le taux nominal.", "Évitez les crédits pour des dépenses non essentielles."],
    limites: ["Taux indicatif — offre bancaire requise.", "Assurance emprunteur non incluse."],
  }),
  faq: buildFaq([
    { question: "Quelle durée pour un crédit consommation ?", answer: "Entre 1 et 7 ans selon le montant et l'organisme prêteur." },
    { question: "Crédit affecté ou non affecté ?", answer: "Le crédit affecté est lié à un achat précis ; le non affecté est plus souple." },
    { question: "Peut-on rembourser par anticipation ?", answer: "Oui, souvent sans pénalité pour les crédits consommation." },
    { question: "Différence avec le crédit auto ?", answer: "Le crédit auto est un crédit affecté lié au véhicule, souvent avec un taux plus bas." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const taux = num(input.taux);
    const duree = num(input.duree);
    const mois = duree * 12;
    const mensualite = monthlyPaymentFromLoan(montant, taux, duree);
    const total = mensualite * mois;
    const interets = total - montant;
    const coutPctCapital = montant > 0 ? (interets / montant) * 100 : 0;
    return {
      summary: `Mensualité estimée : ${formatCurrency(mensualite)}/mois.`,
      lines: [
        { label: "Mensualité estimée", value: `${formatCurrency(mensualite)}/mois`, highlight: true },
        { label: "Montant emprunté", value: formatCurrency(montant) },
        { label: "Taux annuel", value: formatPercent(taux, 1) },
        { label: "Durée", value: `${duree} ans` },
        { label: "Nombre de mensualités", value: String(mois) },
        { label: "Coût total du crédit", value: formatCurrency(total) },
        { label: "Intérêts totaux", value: formatCurrency(interets) },
        { label: "Coût du crédit (% du capital)", value: formatPercent(coutPctCapital, 1) },
      ],
    };
  },
};

export const interetsComposes: SimulatorDefinition = {
  slug: "interets-composes",
  title: "Intérêts composés",
  shortDescription:
    "Simulez la croissance de votre capital avec les intérêts composés et des versements réguliers.",
  metaTitle: "Simulateur intérêts composés — Capitalisation",
  metaDescription:
    "Calculez le capital final généré par les intérêts composés avec capital initial et versements mensuels.",
  keywords: ["intérêts composés", "capitalisation", "simulateur épargne"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  relatedSlugs: ["rendement-livret-a", "rendement-pea", "simulateur-retraite"],
  formFields: [
    { key: "capitalInitial", label: "Capital initial", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "versementMensuel", label: "Versement mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "rendement", label: "Rendement annuel", type: "number", min: 0, max: 20, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 40, suffix: "ans" },
  ],
  defaultValues: { capitalInitial: 5000, versementMensuel: 200, rendement: 5, duree: 15 },
  content: buildContent({
    intro: "Les intérêts composés permettent à votre capital de croître exponentiellement sur la durée.",
    howItWorks: [
      {
        title: "Capitalisation",
        blocks: [
          p("Chaque année, les intérêts générés sont réinvestis et produisent eux-mêmes des intérêts."),
          hl("Effet temps", "Plus la durée est longue, plus l'effet des intérêts composés est puissant."),
        ],
      },
    ],
    example: { title: "5 000 € + 200 €/mois sur 15 ans à 5 %", blocks: [p("Capital final estimé : environ 62 000 €.")] },
    conseils: ["Commencez tôt pour maximiser l'effet temps.", "Réinvestissez les dividendes et intérêts.", "Diversifiez vos placements."],
    limites: ["Rendement constant — les marchés fluctuent.", "Fiscalité non incluse."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que les intérêts composés ?", answer: "Les intérêts calculés sur le capital initial plus les intérêts accumulés précédemment." },
    { question: "Intérêts simples ou composés ?", answer: "Les intérêts composés offrent une croissance bien supérieure sur longue durée." },
    { question: "Quel rendement utiliser ?", answer: "Livret A : ~3 %. PEA actions : historique ~7-8 % avant fiscalité." },
    { question: "Versements réguliers ou ponctuels ?", answer: "Les versements réguliers lissent le risque et accélèrent la croissance." },
  ]),
  calculate(input) {
    const initial = num(input.capitalInitial);
    const mensuel = num(input.versementMensuel);
    const r = num(input.rendement) / 100 / 12;
    const mois = num(input.duree) * 12;
    let capital = initial;
    for (let i = 0; i < mois; i++) {
      capital = capital * (1 + r) + mensuel;
    }
    const versements = initial + mensuel * mois;
    const gains = capital - versements;
    return {
      summary: `Capital final estimé : ${formatCurrency(capital)} (gains : ${formatCurrency(gains)}).`,
      lines: [
        { label: "Capital final", value: formatCurrency(capital), highlight: true },
        { label: "Gains (intérêts)", value: formatCurrency(gains), highlight: true },
        { label: "Total versé", value: formatCurrency(versements) },
        { label: "Rendement annuel", value: formatPercent(num(input.rendement), 1) },
        { label: "Durée", value: `${num(input.duree)} ans` },
      ],
    };
  },
};

export const simulateurInflation: SimulatorDefinition = {
  slug: "simulateur-inflation",
  title: "Simulateur inflation",
  shortDescription:
    "Estimez l'érosion du pouvoir d'achat de votre capital face à l'inflation.",
  metaTitle: "Simulateur inflation — Pouvoir d'achat",
  metaDescription:
    "Calculez la perte de valeur d'un capital face à l'inflation sur une période donnée.",
  keywords: ["inflation", "pouvoir d'achat", "érosion capital"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  relatedSlugs: ["interets-composes", "budget-reste-a-vivre", "rendement-livret-a"],
  formFields: [
    { key: "capital", label: "Capital actuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "inflation", label: "Taux d'inflation annuel", type: "number", min: 0, max: 15, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 40, suffix: "ans" },
  ],
  defaultValues: { capital: 50000, inflation: 2.5, duree: 10 },
  content: buildContent({
    intro: "L'inflation réduit progressivement le pouvoir d'achat de votre épargne non placée.",
    howItWorks: [
      {
        title: "Érosion du capital",
        blocks: [
          p("Valeur réelle = Capital / (1 + inflation)^durée. Chaque année, le même montant achète moins."),
          hl("Repère", "Une inflation de 2 % divise le pouvoir d'achat en ~37 ans."),
        ],
      },
    ],
    example: { title: "50 000 € sur 10 ans à 2,5 %", blocks: [p("Pouvoir d'achat réel : environ 39 000 €.")] },
    conseils: ["Placez votre épargne sur des actifs qui battent l'inflation.", "Réévaluez régulièrement vos objectifs financiers.", "Diversifiez entre liquidités et placements."],
    limites: ["Inflation moyenne estimée — peut varier fortement.", "Ne tient pas compte des hausses sectorielles (énergie, alimentation)."],
  }),
  faq: buildFaq([
    { question: "Quel taux d'inflation utiliser ?", answer: "L'inflation française moyenne est d'environ 2 à 3 % sur longue période." },
    { question: "Comment protéger mon épargne ?", answer: "Actions, immobilier, obligations indexées ou placements diversifiés." },
    { question: "Livret A et inflation ?", answer: "Le Livret A est indexé sur l'inflation + 0,5 %, mais peut être temporairement en dessous." },
    { question: "Inflation et retraite ?", answer: "Anticipez une inflation de 2 % minimum pour vos projections retraite." },
  ]),
  calculate(input) {
    const capital = num(input.capital);
    const inflation = num(input.inflation) / 100;
    const duree = num(input.duree);
    const valeurReelle = capital / Math.pow(1 + inflation, duree);
    const perte = capital - valeurReelle;
    return {
      summary: `Pouvoir d'achat réel dans ${duree} ans : ${formatCurrency(valeurReelle)} (−${formatCurrency(perte)}).`,
      lines: [
        { label: "Pouvoir d'achat réel", value: formatCurrency(valeurReelle), highlight: true },
        { label: "Perte de valeur", value: formatCurrency(perte), highlight: true },
        { label: "Capital nominal", value: formatCurrency(capital) },
        { label: "Inflation cumulée", value: formatPercent((Math.pow(1 + inflation, duree) - 1) * 100, 1) },
        { label: "Durée", value: `${duree} ans` },
      ],
    };
  },
};

export const budgetResteAVivre: SimulatorDefinition = {
  slug: "budget-reste-a-vivre",
  title: "Budget reste à vivre",
  shortDescription:
    "Calculez votre reste à vivre mensuel après charges fixes et crédits.",
  metaTitle: "Simulateur reste à vivre — Budget mensuel",
  metaDescription:
    "Estimez votre reste à vivre : revenus nets moins charges fixes, crédits et dépenses obligatoires.",
  keywords: ["reste à vivre", "budget mensuel", "charges fixes"],
  domain: "finance",
  category: "epargne",
  icon: "calculator",
  relatedSlugs: ["mensualite-credit-consommation", "simulateur-inflation", "frais-kilometriques"],
  formFields: [
    { key: "revenus", label: "Revenus nets mensuels", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "logement", label: "Logement (loyer/crédit + charges)", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "credits", label: "Autres crédits mensuels", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "chargesFixes", label: "Charges fixes (énergie, assurances…)", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { revenus: 3200, logement: 950, credits: 280, chargesFixes: 350 },
  content: buildContent({
    intro: "Le reste à vivre est le montant disponible pour alimentation, loisirs et épargne après les charges obligatoires.",
    howItWorks: [
      {
        title: "Calcul",
        blocks: [
          p("Reste à vivre = Revenus nets − Logement − Crédits − Charges fixes."),
          hl("Banque", "Les banques exigent un reste à vivre minimum (souvent 800-1 200 € par adulte)."),
        ],
      },
    ],
    example: { title: "3 200 € de revenus, 950 € logement", blocks: [p("Reste à vivre : environ 1 520 € après charges et crédits.")] },
    conseils: ["Listez toutes vos charges récurrentes.", "Gardez une marge pour les imprévus.", "Réévaluez votre budget chaque trimestre."],
    limites: ["Estimation simplifiée — charges variables non incluses.", "Seuils bancaires variables selon la zone géographique."],
  }),
  faq: buildFaq([
    { question: "Quel reste à vivre minimum ?", answer: "Les banques exigent souvent 800 à 1 200 € par adulte selon la composition du foyer." },
    { question: "Reste à vivre et endettement ?", answer: "Un reste à vivre insuffisant peut bloquer un nouveau crédit, même si l'endettement est sous 35 %." },
    { question: "Comment augmenter le reste à vivre ?", answer: "Réduire les charges fixes, renégocier les crédits ou augmenter les revenus." },
    { question: "Charges fixes : quoi inclure ?", answer: "Énergie, assurances, téléphone, transports, cantine, garde d'enfants." },
  ]),
  calculate(input) {
    const revenus = num(input.revenus);
    const total =
      num(input.logement) + num(input.credits) + num(input.chargesFixes);
    const reste = revenus - total;
    const ratio = revenus > 0 ? (reste / revenus) * 100 : 0;
    return {
      summary: `Reste à vivre : ${formatCurrency(reste)}/mois (${formatPercent(ratio, 0)} des revenus).`,
      lines: [
        { label: "Reste à vivre", value: formatCurrency(reste), highlight: true },
        { label: "Charges totales", value: formatCurrency(total) },
        { label: "Part disponible", value: formatPercent(ratio, 0) },
        { label: "Revenus nets", value: formatCurrency(revenus) },
        { label: "Logement", value: formatCurrency(num(input.logement)) },
      ],
    };
  },
};

export const simulateurRetraite: SimulatorDefinition = {
  slug: "simulateur-retraite",
  title: "Simulateur retraite",
  shortDescription:
    "Estimez le capital retraite accumulé avec versements réguliers jusqu'à la retraite.",
  metaTitle: "Simulateur retraite — Capital accumulation",
  metaDescription:
    "Projettez votre capital retraite selon vos versements mensuels, le rendement et l'horizon.",
  keywords: ["simulateur retraite", "épargne retraite", "capital retraite"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  relatedSlugs: ["interets-composes", "rendement-pea", "simulateur-inflation"],
  formFields: [
    { key: "ageActuel", label: "Âge actuel", type: "number", min: 18, max: 65, suffix: "ans" },
    { key: "ageRetraite", label: "Âge de retraite visé", type: "number", min: 55, max: 70, suffix: "ans" },
    { key: "capitalActuel", label: "Capital retraite actuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "versementMensuel", label: "Versement mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "rendement", label: "Rendement annuel estimé", type: "number", min: 0, max: 15, step: 0.1, suffix: "%" },
  ],
  defaultValues: { ageActuel: 35, ageRetraite: 62, capitalActuel: 15000, versementMensuel: 300, rendement: 4 },
  content: buildContent({
    intro: "Compléter vos droits retraite par une épargne personnelle sécurise votre niveau de vie futur.",
    howItWorks: [
      {
        title: "Projection",
        blocks: [
          p("Capitalisation mensuelle du capital actuel et des versements jusqu'à l'âge de retraite."),
          hl("PER", "Le Plan d'Épargne Retraite offre des avantages fiscaux sur les versements."),
        ],
      },
    ],
    example: { title: "35 ans, retraite à 62 ans, 300 €/mois", blocks: [p("Capital estimé : environ 230 000 € à 4 % de rendement.")] },
    conseils: ["Commencez tôt, même avec de petits montants.", "Envisagez un PER pour la réduction d'impôt.", "Réévaluez chaque année vos versements."],
    limites: ["Ne remplace pas une simulation officielle M@rel.", "Rendement non garanti."],
  }),
  faq: buildFaq([
    { question: "PER ou PEA pour la retraite ?", answer: "Le PER offre une réduction d'impôt immédiate ; le PEA est plus souple mais sans avantage fiscal à l'entrée." },
    { question: "Quel rendement viser ?", answer: "4 % est un scénario prudent ; 6-7 % pour un portefeuille actions diversifié." },
    { question: "Capital retraite suffisant ?", answer: "La règle des 4 % : capital × 4 % = retrait annuel durable." },
    { question: "Inflation et retraite ?", answer: "Intégrez 2 % d'inflation dans vos projections de besoins futurs." },
  ]),
  calculate(input) {
    const annees = Math.max(0, num(input.ageRetraite) - num(input.ageActuel));
    const mois = annees * 12;
    const r = num(input.rendement) / 100 / 12;
    let capital = num(input.capitalActuel);
    const mensuel = num(input.versementMensuel);
    for (let i = 0; i < mois; i++) {
      capital = capital * (1 + r) + mensuel;
    }
    const retraitMensuel = (capital * RETRAITE_TAUX_RETRAIT_DURABLE) / 12;
    return {
      summary: `Capital retraite estimé : ${formatCurrency(capital)} (retrait 4 % : ${formatCurrency(retraitMensuel)}/mois).`,
      lines: [
        { label: "Capital estimé", value: formatCurrency(capital), highlight: true },
        { label: "Retrait mensuel (4 %)", value: formatCurrency(retraitMensuel), highlight: true },
        { label: "Horizon", value: `${annees} ans` },
        { label: "Versements totaux", value: formatCurrency(num(input.capitalActuel) + mensuel * mois) },
        { label: "Rendement", value: formatPercent(num(input.rendement), 1) },
      ],
    };
  },
};

export const rendementLivretA: SimulatorDefinition = {
  slug: "rendement-livret-a",
  title: "Rendement Livret A",
  shortDescription:
    "Calculez les intérêts générés par votre Livret A sur une période donnée.",
  metaTitle: "Simulateur rendement Livret A",
  metaDescription:
    "Estimez les intérêts du Livret A selon votre capital, le taux actuel et la durée de placement.",
  keywords: ["livret A", "rendement livret", "intérêts livret A"],
  domain: "finance",
  category: "epargne",
  icon: "percent",
  relatedSlugs: ["interets-composes", "rendement-pea", "simulateur-inflation"],
  formFields: [
    { key: "capital", label: "Capital sur Livret A", type: "number", min: 0, max: LIVRET_A_PLAFOND, step: 500, suffix: "€" },
    { key: "taux", label: "Taux Livret A", type: "number", min: 0, max: 5, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 20, suffix: "ans" },
  ],
  defaultValues: { capital: 15000, taux: 3, duree: 5 },
  content: buildContent({
    intro: "Le Livret A est le placement préféré des Français : exonéré d'impôt et disponible à tout moment.",
    howItWorks: [
      {
        title: "Calcul des intérêts",
        blocks: [
          p("Intérêts calculés par quinzaine sur le solde créditeur. Plafond : 22 950 €."),
          hl("Fiscalité", "Totalement exonéré d'impôt et de prélèvements sociaux."),
        ],
      },
    ],
    example: { title: "15 000 € à 3 % sur 5 ans", blocks: [p("Intérêts estimés : environ 2 400 € (intérêts composés simplifiés).")] },
    conseils: ["Remplissez le plafond avant d'autres placements.", "Le taux est révisé semestriellement.", "Combinez avec le LDDS pour 12 950 € supplémentaires."],
    limites: ["Calcul simplifié (quinzaine non modélisée).", "Taux variable selon les révisions semestrielles."],
  }),
  faq: buildFaq([
    { question: "Plafond Livret A ?", answer: "22 950 € depuis 2013. Les intérêts ne sont pas plafonnés." },
    { question: "Taux actuel du Livret A ?", answer: "Vérifiez le taux en vigueur (révisé chaque semestre par l'État)." },
    { question: "Livret A ou LDDS ?", answer: "Remplissez d'abord le Livret A, puis le LDDS (même taux, plafond 12 950 €)." },
    { question: "Intérêts composés sur Livret A ?", answer: "Oui, les intérêts sont capitalisés et produisent eux-mêmes des intérêts." },
  ]),
  calculate(input) {
    const capital = Math.min(num(input.capital), LIVRET_A_PLAFOND);
    const taux = num(input.taux) / 100;
    const duree = num(input.duree);
    const final = capital * Math.pow(1 + taux, duree);
    const interets = final - capital;
    return {
      summary: `Intérêts estimés : ${formatCurrency(interets)} sur ${duree} ans.`,
      lines: [
        { label: "Intérêts totaux", value: formatCurrency(interets), highlight: true },
        { label: "Capital final", value: formatCurrency(final), highlight: true },
        { label: "Capital initial", value: formatCurrency(capital) },
        { label: "Taux", value: formatPercent(num(input.taux), 1) },
        { label: "Durée", value: `${duree} ans` },
      ],
    };
  },
};

export const rendementPea: SimulatorDefinition = {
  slug: "rendement-pea",
  title: "Rendement PEA",
  shortDescription:
    "Estimez la performance de votre PEA avec fiscalité avant et après 5 ans.",
  metaTitle: "Simulateur rendement PEA — Performance et fiscalité",
  metaDescription:
    "Calculez le rendement net de votre PEA : plus-values, durée de placement et fiscalité après 5 ans.",
  keywords: ["PEA", "rendement PEA", "plus-value PEA"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  relatedSlugs: ["interets-composes", "rendement-livret-a", "simulateur-retraite"],
  formFields: [
    { key: "capitalInitial", label: "Capital investi", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "rendement", label: "Rendement annuel brut", type: "number", min: -20, max: 30, step: 0.5, suffix: "%" },
    { key: "duree", label: "Durée de placement", type: "number", min: 1, max: 30, suffix: "ans" },
    {
      key: "apresCinqAns",
      label: "Placement après 5 ans",
      type: "select",
      options: [
        { value: "oui", label: "Oui — fiscalité PEA (PS uniquement)" },
        { value: "non", label: "Non — flat tax 30 %" },
      ],
    },
  ],
  defaultValues: { capitalInitial: 20000, rendement: 7, duree: 10, apresCinqAns: "oui" },
  content: buildContent({
    intro: "Le PEA permet d'investir en actions européennes avec une fiscalité réduite après 5 ans de détention.",
    howItWorks: [
      {
        title: "Fiscalité PEA",
        blocks: [
          p("Avant 5 ans : flat tax 30 % sur les gains. Après 5 ans : exonération d'IR, prélèvements sociaux 17,2 % uniquement."),
          hl("Plafond", "Versements limités à 150 000 € sur le PEA classique."),
        ],
      },
    ],
    example: { title: "20 000 € à 7 % sur 10 ans", blocks: [p("Gain brut ~27 000 €. Net après PS : ~22 700 €.")] },
    conseils: ["Ne retirez pas avant 5 ans pour optimiser la fiscalité.", "Diversifiez via des ETF européens.", "Versez régulièrement pour lisser le risque."],
    limites: ["Rendement non garanti — marchés volatils.", "Frais de gestion non inclus."],
  }),
  faq: buildFaq([
    { question: "Quand le PEA est-il exonéré ?", answer: "Après 5 ans de détention du compte, les gains sont exonérés d'IR (PS 17,2 % uniquement)." },
    { question: "Plafond du PEA ?", answer: "150 000 € de versements sur le PEA classique. Les gains ne sont pas plafonnés." },
    { question: "PEA ou compte-titres ?", answer: "Le PEA est plus avantageux fiscalement après 5 ans pour les actions européennes." },
    { question: "Retrait partiel possible ?", answer: "Oui, mais un retrait avant 5 ans ferme le PEA (sauf PEA-PME)." },
  ]),
  calculate(input) {
    const initial = num(input.capitalInitial);
    const duree = num(input.duree);
    const brut = initial * Math.pow(1 + num(input.rendement) / 100, duree);
    const gain = brut - initial;
    const apres5 = String(input.apresCinqAns) === "oui" && duree >= PEA_DUREE_FISCALITE_MIN;
    const fiscalite = apres5 ? gain * PEA_PS_APRES_5_ANS : gain * PFU_TAUX_GLOBAL;
    const net = brut - fiscalite;
    return {
      summary: `Capital net estimé : ${formatCurrency(net)} (gain net : ${formatCurrency(gain - fiscalite)}).`,
      lines: [
        { label: "Capital net", value: formatCurrency(net), highlight: true },
        { label: "Gain net", value: formatCurrency(gain - fiscalite), highlight: true },
        { label: "Gain brut", value: formatCurrency(gain) },
        { label: "Fiscalité", value: formatCurrency(fiscalite) },
        { label: "Régime", value: apres5 ? "Après 5 ans (PS 17,2 %)" : "Flat tax 30 %" },
      ],
    };
  },
};

export const coutTotalCreditConsommation: SimulatorDefinition = {
  slug: "cout-total-credit-consommation",
  title: "Coût total crédit consommation",
  shortDescription:
    "Calculez le coût total d'un crédit consommation : intérêts, TAEG et mensualités.",
  metaTitle: "Simulateur coût total crédit consommation",
  metaDescription:
    "Estimez le coût total de votre crédit à la consommation : intérêts, mensualités et TAEG simplifié.",
  keywords: ["coût crédit consommation", "TAEG", "intérêts crédit"],
  domain: "finance",
  category: "credit",
  icon: "calculator",
  relatedSlugs: ["mensualite-credit-consommation", "loa-vs-credit-auto", "budget-reste-a-vivre"],
  formFields: [
    { key: "montant", label: "Montant emprunté", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 10, suffix: "ans" },
    { key: "frais", label: "Frais de dossier", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { montant: 10000, taux: 6, duree: 4, frais: 150 },
  content: buildContent({
    intro: "Le coût total d'un crédit inclut les intérêts, les frais de dossier et l'assurance si souscrite.",
    howItWorks: [
      {
        title: "Coût du crédit",
        blocks: [
          p("Coût total = (Mensualité × Durée) + Frais − Capital emprunté."),
          hl("TAEG", "Le TAEG intègre tous les frais obligatoires — comparez toujours les TAEG, pas les taux seuls."),
        ],
      },
    ],
    example: { title: "10 000 € sur 4 ans à 6 %", blocks: [p("Coût total estimé : environ 1 300 € d'intérêts + frais.")] },
    conseils: ["Négociez les frais de dossier.", "Refusez l'assurance groupée si vous avez une couverture.", "Comparez au moins 3 offres."],
    limites: ["Assurance emprunteur non incluse par défaut.", "TAEG simplifié — offre bancaire pour le TAEG exact."],
  }),
  faq: buildFaq([
    { question: "TAEG ou taux nominal ?", answer: "Toujours le TAEG : il inclut les frais et donne le vrai coût du crédit." },
    { question: "Frais de dossier négociables ?", answer: "Oui, souvent supprimés ou réduits en négociation ou en ligne." },
    { question: "Assurance obligatoire ?", answer: "Non pour le crédit consommation, contrairement au crédit immobilier." },
    { question: "Coût acceptable ?", answer: "Un crédit consommation au-dessus de 8-10 % de TAEG est généralement élevé." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const duree = num(input.duree);
    const frais = num(input.frais);
    const mensualite = monthlyPaymentFromLoan(montant, num(input.taux), duree);
    const totalPaye = mensualite * duree * 12 + frais;
    const cout = totalPaye - montant;
    const taegApprox = montant > 0 ? (cout / montant / duree) * 100 : 0;
    return {
      summary: `Coût total du crédit : ${formatCurrency(cout)} (TAEG approx. ${formatPercent(taegApprox, 1)}).`,
      lines: [
        { label: "Coût total", value: formatCurrency(cout), highlight: true },
        { label: "Total payé", value: formatCurrency(totalPaye) },
        { label: "Intérêts", value: formatCurrency(cout - frais) },
        { label: "Mensualité", value: formatCurrency(mensualite) },
        { label: "Frais de dossier", value: formatCurrency(frais) },
      ],
    };
  },
};

export const loaVsCreditAuto: SimulatorDefinition = {
  slug: "loa-vs-credit-auto",
  title: "LOA vs crédit auto",
  shortDescription:
    "Comparez le coût total d'une LOA (leasing) et d'un crédit auto classique.",
  metaTitle: "Simulateur LOA vs crédit auto — Comparaison",
  metaDescription:
    "Comparez le coût d'une LOA et d'un crédit auto : mensualités, coût total et valeur de reprise.",
  keywords: ["LOA", "crédit auto", "leasing automobile"],
  domain: "finance",
  category: "credit",
  icon: "wallet",
  relatedSlugs: ["mensualite-credit-consommation", "cout-total-credit-consommation", "frais-kilometriques"],
  formFields: [
    { key: "prixVehicule", label: "Prix du véhicule", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "mensualiteLoa", label: "Mensualité LOA", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "dureeLoa", label: "Durée LOA", type: "number", min: 1, max: 5, suffix: "ans" },
    { key: "tauxCredit", label: "Taux crédit auto", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "dureeCredit", label: "Durée crédit", type: "number", min: 1, max: 7, suffix: "ans" },
    { key: "valeurReprise", label: "Valeur de reprise estimée", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { prixVehicule: 28000, mensualiteLoa: 320, dureeLoa: 4, tauxCredit: 4.5, dureeCredit: 5, valeurReprise: 12000 },
  content: buildContent({
    intro: "La LOA (Location avec Option d'Achat) et le crédit auto ont des logiques de coût différentes.",
    howItWorks: [
      {
        title: "LOA vs crédit",
        blocks: [
          p("LOA : mensualités + option d'achat finale. Crédit : vous êtes propriétaire, valeur de reprise possible."),
          hl("LOA", "Idéal si vous changez de véhicule tous les 3-4 ans."),
        ],
      },
    ],
    example: { title: "Véhicule 28 000 €", blocks: [p("Comparez le coût LOA total vs crédit moins valeur de reprise.")] },
    conseils: ["Négociez le prix du véhicule avant le mode de financement.", "Vérifiez les frais de restitution LOA.", "Le crédit est souvent moins cher sur longue durée."],
    limites: ["Valeur de reprise estimée — marché variable.", "Entretien et assurance non inclus."],
  }),
  faq: buildFaq([
    { question: "LOA ou crédit : lequel est moins cher ?", answer: "Le crédit est souvent moins cher si vous gardez le véhicule longtemps." },
    { question: "Option d'achat LOA ?", answer: "Montant à payer en fin de LOA pour devenir propriétaire (souvent 40-60 % du prix initial)." },
    { question: "LOA pour entreprise ?", answer: "La LOA permet de ne pas immobiliser le véhicule dans l'actif et optimise la fiscalité pro." },
    { question: "Kilométrage LOA ?", answer: "Les LOA limitent le kilométrage — pénalités si dépassement." },
  ]),
  calculate(input) {
    const prix = num(input.prixVehicule);
    const dureeLoa = num(input.dureeLoa);
    const mensLoa = num(input.mensualiteLoa);
    const totalLoa = mensLoa * dureeLoa * 12;
    const dureeCredit = num(input.dureeCredit);
    const mensCredit = monthlyPaymentFromLoan(prix, num(input.tauxCredit), dureeCredit);
    const totalCredit = mensCredit * dureeCredit * 12;
    const reprise = num(input.valeurReprise);
    const coutCreditNet = totalCredit - reprise;
    const diff = totalLoa - coutCreditNet;
    const meilleur = diff > 0 ? "Crédit auto" : "LOA";
    return {
      summary: `${meilleur} semble plus avantageux (écart : ${formatCurrency(Math.abs(diff))}).`,
      lines: [
        { label: "Meilleure option", value: meilleur, highlight: true },
        { label: "Coût net crédit", value: formatCurrency(coutCreditNet), highlight: true },
        { label: "Coût total LOA", value: formatCurrency(totalLoa) },
        { label: "Mensualité crédit", value: formatCurrency(mensCredit) },
        { label: "Valeur de reprise", value: formatCurrency(reprise) },
      ],
    };
  },
};

export const fraisKilometriques: SimulatorDefinition = {
  slug: "frais-kilometriques",
  title: "Frais kilométriques",
  shortDescription:
    "Estimez vos frais kilométriques professionnels selon le barème fiscal.",
  metaTitle: "Simulateur frais kilométriques — Barème fiscal",
  metaDescription:
    "Calculez vos frais kilométriques déductibles selon la puissance du véhicule et le nombre de kilomètres.",
  keywords: ["frais kilométriques", "barème fiscal", "indemnités kilométriques"],
  domain: "finance",
  category: "credit",
  icon: "calculator",
  relatedSlugs: ["budget-reste-a-vivre", "loa-vs-credit-auto", "mensualite-credit-consommation"],
  formFields: [
    { key: "kilometres", label: "Kilomètres annuels", type: "number", min: 0, step: 100, suffix: "km" },
    {
      key: "puissance",
      label: "Puissance fiscale",
      type: "select",
      options: [
        { value: "3", label: "3 CV et moins" },
        { value: "4", label: "4 CV" },
        { value: "5", label: "5 CV" },
        { value: "6", label: "6 CV" },
        { value: "7", label: "7 CV et plus" },
      ],
    },
    {
      key: "type",
      label: "Type de véhicule",
      type: "select",
      options: [
        { value: "auto", label: "Automobile" },
        { value: "electrique", label: "Automobile électrique" },
      ],
    },
  ],
  defaultValues: { kilometres: 12000, puissance: "5", type: "auto" },
  content: buildContent({
    intro: "Le barème kilométrique permet aux salariés et indépendants de déduire les frais de trajet professionnel.",
    howItWorks: [
      {
        title: "Barème fiscal",
        blocks: [
          p("Montant = km × coefficient selon puissance fiscale. Barème 2024 simplifié intégré."),
          hl("Électrique", "Bonus de 20 % pour les véhicules électriques."),
        ],
      },
    ],
    example: { title: "12 000 km, 5 CV", blocks: [p("Frais estimés : environ 5 400 €/an.")] },
    conseils: ["Tenir un journal de bord des trajets professionnels.", "Comparer barème et frais réels.", "Vérifiez le barème chaque année (révision fiscale)."],
    limites: ["Barème simplifié — consultez le barème officiel BOFiP.", "Trajets domicile-travail non inclus sauf cas particuliers."],
  }),
  faq: buildFaq([
    { question: "Barème ou frais réels ?", answer: "Choisissez l'option la plus avantageuse. Le barème est souvent plus simple." },
    { question: "Véhicule électrique ?", answer: "Bonus de 20 % sur le barème kilométrique pour les VE." },
    { question: "Salarié ou indépendant ?", answer: "Le barème s'applique dans les deux cas pour les trajets professionnels." },
    { question: "Cumul possible ?", answer: "Non, vous ne pouvez pas cumuler barème et frais réels sur le même véhicule." },
  ]),
  calculate(input) {
    const km = num(input.kilometres);
    const cv = num(input.puissance);
    const coeff = getBaremeKilometriqueCoeff(cv);
    let frais = km * coeff;
    if (String(input.type) === "electrique") frais *= BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE;
    const mensuel = frais / 12;
    return {
      summary: `Frais kilométriques annuels : ${formatCurrency(frais)} (${formatCurrency(mensuel)}/mois).`,
      lines: [
        { label: "Frais annuels", value: formatCurrency(frais), highlight: true },
        { label: "Frais mensuels", value: formatCurrency(mensuel) },
        { label: "Kilomètres", value: `${formatNumber(km, 0)} km` },
        { label: "Coefficient", value: `${coeff.toFixed(3)} €/km` },
        { label: "Puissance", value: `${cv} CV` },
      ],
    };
  },
};

export const financeSimulators = [
  mensualiteCreditConsommation,
  interetsComposes,
  simulateurInflation,
  budgetResteAVivre,
  simulateurRetraite,
  rendementLivretA,
  rendementPea,
  coutTotalCreditConsommation,
  loaVsCreditAuto,
  fraisKilometriques,
];
