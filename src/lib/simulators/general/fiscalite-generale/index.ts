import type { SimulatorDefinition } from "../../types";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import {
  calculerImpotBareme,
  PFU_TAUX_GLOBAL,
  PFU_TAUX_IR,
  PFU_TAUX_PS,
  QF_PART_PARENT_ISOLE,
  getImpotLiberatoireTaux,
  getMicroEntrepreneurTaux,
  CREDIT_IMPOT_EMPLOI_DOMICILE,
  DONATION_ABATTEMENTS,
  DONATION_TAUX_SIMPLIFIE,
} from "@/lib/config";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const impotSurLeRevenu: SimulatorDefinition = {
  slug: "impot-sur-le-revenu",
  title: "Impôt sur le revenu",
  shortDescription:
    "Estimez votre impôt sur le revenu selon le barème progressif et le quotient familial.",
  metaTitle: "Simulateur impôt sur le revenu — Barème 2024",
  metaDescription:
    "Calculez une estimation de votre impôt sur le revenu : revenu net imposable, parts et barème progressif.",
  keywords: ["impôt sur le revenu", "barème IR", "simulation impôt"],
  domain: "fiscalite",
  category: "impots",
  icon: "percent",
  relatedSlugs: ["quotient-familial", "taux-marginal-imposition", "prelevement-a-la-source"],
  formFields: [
    { key: "revenuNet", label: "Revenu net imposable", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "parts", label: "Nombre de parts", type: "number", min: 1, max: 10, step: 0.5 },
  ],
  defaultValues: { revenuNet: 45000, parts: 2 },
  content: buildContent({
    intro: "L'impôt sur le revenu est calculé sur le revenu net imposable selon un barème progressif par part.",
    howItWorks: [
      {
        title: "Barème progressif",
        blocks: [
          p("Revenu par part = Revenu net / Parts. L'impôt est calculé sur chaque tranche puis multiplié par les parts."),
          hl("Décote", "Non incluse dans cette estimation simplifiée."),
        ],
      },
    ],
    example: { title: "45 000 € nets, 2 parts", blocks: [p("Impôt estimé : environ 3 500 €.")] },
    conseils: ["Déclarez tous vos revenus et charges déductibles.", "Vérifiez les réductions et crédits d'impôt.", "Anticipez avec le simulateur officiel impots.gouv.fr."],
    limites: ["Estimation sans décote, plafonnement du QF ni crédits d'impôt.", "Barème 2024 sur revenus 2023."],
  }),
  faq: buildFaq([
    { question: "Revenu net imposable ?", answer: "Revenus bruts moins abattements et charges déductibles (pensions, PER, etc.)." },
    { question: "Quand déclarer ?", answer: "Déclaration en avril-juin pour les revenus de l'année précédente." },
    { question: "Parts fiscales ?", answer: "1 part pour un adulte seul, 2 pour un couple, +0,5 par enfant (1 pour 3e et suivants)." },
    { question: "Prélèvement à la source ?", answer: "L'impôt est prélevé mensuellement ; la déclaration ajuste le solde." },
  ]),
  calculate(input) {
    const revenu = num(input.revenuNet);
    const parts = num(input.parts);
    const parPart = parts > 0 ? revenu / parts : revenu;
    const impotParPart = calculerImpotBareme(parPart);
    const impot = impotParPart * parts;
    const tauxEffectif = revenu > 0 ? (impot / revenu) * 100 : 0;
    return {
      summary: `Impôt estimé : ${formatCurrency(impot)} (taux effectif ${formatPercent(tauxEffectif, 1)}).`,
      lines: [
        { label: "Impôt estimé", value: formatCurrency(impot), highlight: true },
        { label: "Taux effectif", value: formatPercent(tauxEffectif, 1) },
        { label: "Revenu par part", value: formatCurrency(parPart) },
        { label: "Revenu net imposable", value: formatCurrency(revenu) },
        { label: "Parts", value: formatNumber(parts, 1) },
      ],
    };
  },
};

export const quotientFamilial: SimulatorDefinition = {
  slug: "quotient-familial",
  title: "Quotient familial",
  shortDescription:
    "Calculez votre quotient familial et son impact sur l'impôt sur le revenu.",
  metaTitle: "Simulateur quotient familial — Parts fiscales",
  metaDescription:
    "Estimez votre quotient familial : nombre de parts, revenu par part et gain fiscal lié à la composition du foyer.",
  keywords: ["quotient familial", "parts fiscales", "impôt foyer"],
  domain: "fiscalite",
  category: "impots",
  icon: "calculator",
  relatedSlugs: ["impot-sur-le-revenu", "taux-marginal-imposition", "donation-numeraire"],
  formFields: [
    { key: "revenuNet", label: "Revenu net imposable", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "situation",
      label: "Situation familiale",
      type: "select",
      options: [
        { value: "celibataire", label: "Célibataire / divorcé" },
        { value: "couple", label: "Couple marié / pacsé" },
        { value: "parentIsole", label: "Parent isolé" },
      ],
    },
    { key: "enfants", label: "Nombre d'enfants à charge", type: "number", min: 0, max: 8, suffix: "" },
  ],
  defaultValues: { revenuNet: 55000, situation: "couple", enfants: 2 },
  content: buildContent({
    intro: "Le quotient familial divise le revenu par le nombre de parts pour appliquer le barème progressif.",
    howItWorks: [
      {
        title: "Calcul des parts",
        blocks: [
          p("Couple : 2 parts. +0,5 par enfant (1 part pour le 3e et suivants). Parent isolé : 1 part + 0,5 par enfant."),
          hl("Plafonnement", "L'avantage QF est plafonné (non modélisé ici)."),
        ],
      },
    ],
    example: { title: "Couple, 2 enfants, 55 000 €", blocks: [p("3 parts — revenu par part : 18 333 €.")] },
    conseils: ["Mettez à jour votre situation à chaque changement familial.", "Les enfants en garde alternée comptent pour 0,25 ou 0,5 part.", "Vérifiez le plafonnement pour les hauts revenus."],
    limites: ["Plafonnement QF non inclus.", "Cas particuliers (invalidité, ancienneté) non traités."],
  }),
  faq: buildFaq([
    { question: "Combien de parts pour un couple ?", answer: "2 parts de base pour un couple marié ou pacsé." },
    { question: "Enfant à charge ?", answer: "0,5 part par enfant (1 part pour le 3e et suivants)." },
    { question: "Parent isolé ?", answer: "1 part + 0,25 part supplémentaire (parent isolé) + parts enfants." },
    { question: "Plafonnement ?", answer: "L'avantage lié au QF est limité à environ 1 678 € par demi-part (2024)." },
  ]),
  calculate(input) {
    const revenu = num(input.revenuNet);
    const enfants = num(input.enfants);
    const situation = String(input.situation);
    let parts = situation === "couple" ? 2 : 1;
    if (situation === "parentIsole") parts += QF_PART_PARENT_ISOLE;
    for (let i = 1; i <= enfants; i++) {
      parts += i >= 3 ? 1 : 0.5;
    }
    const parPart = parts > 0 ? revenu / parts : revenu;
    const impotAvec = calculerImpotBareme(parPart) * parts;
    const impotSans = calculerImpotBareme(revenu);
    const gain = impotSans - impotAvec;
    return {
      summary: `${formatNumber(parts, 1)} parts — Quotient : ${formatCurrency(parPart)}/part (gain fiscal ~${formatCurrency(gain)}).`,
      lines: [
        { label: "Nombre de parts", value: formatNumber(parts, 1), highlight: true },
        { label: "Revenu par part", value: formatCurrency(parPart), highlight: true },
        { label: "Gain fiscal QF", value: formatCurrency(gain) },
        { label: "Impôt avec QF", value: formatCurrency(impotAvec) },
        { label: "Impôt sans QF", value: formatCurrency(impotSans) },
      ],
    };
  },
};

export const prelevementALaSource: SimulatorDefinition = {
  slug: "prelevement-a-la-source",
  title: "Prélèvement à la source",
  shortDescription:
    "Estimez votre taux de prélèvement à la source mensuel sur vos revenus.",
  metaTitle: "Simulateur prélèvement à la source — Taux mensuel",
  metaDescription:
    "Calculez votre taux de prélèvement à la source : impôt estimé et montant mensuel prélevé sur le salaire.",
  keywords: ["prélèvement à la source", "PAS", "taux personnalisé"],
  domain: "fiscalite",
  category: "impots",
  icon: "percent",
  relatedSlugs: ["impot-sur-le-revenu", "taux-marginal-imposition", "flat-tax-30-pourcent"],
  formFields: [
    { key: "revenuNet", label: "Revenu net imposable annuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "parts", label: "Nombre de parts", type: "number", min: 1, max: 10, step: 0.5 },
    { key: "revenuMensuel", label: "Salaire net mensuel", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { revenuNet: 42000, parts: 2, revenuMensuel: 2800 },
  content: buildContent({
    intro: "Le prélèvement à la source collecte l'impôt au moment du versement des revenus.",
    howItWorks: [
      {
        title: "Taux personnalisé",
        blocks: [
          p("Taux = Impôt estimé / Revenus nets imposables. Appliqué chaque mois sur le salaire."),
          hl("Ajustement", "La déclaration annuelle recalcule le solde (remboursement ou complément)."),
        ],
      },
    ],
    example: { title: "42 000 € nets, 2 800 €/mois", blocks: [p("Taux personnalisé estimé : ~5,5 % — ~154 €/mois.")] },
    conseils: ["Mettez à jour votre taux en cas de changement de situation.", "Le taux neutre ne tient pas compte de votre foyer.", "Vérifiez sur impots.gouv.fr votre taux actuel."],
    limites: ["Estimation sans crédits d'impôt ni réductions.", "Revenus multiples non ventilés."],
  }),
  faq: buildFaq([
    { question: "Taux neutre ou personnalisé ?", answer: "Le taux personnalisé intègre votre situation familiale — généralement plus précis." },
    { question: "Modifier le taux ?", answer: "Oui, sur impots.gouv.fr ou via votre employeur (taux individualisé possible)." },
    { question: "Remboursement en fin d'année ?", answer: "Si le PAS est supérieur à l'impôt réel, vous êtes remboursé automatiquement." },
    { question: "Indépendants ?", answer: "Acomptes mensuels ou trimestriels basés sur le revenu N-2 ou N-1." },
  ]),
  calculate(input) {
    const revenu = num(input.revenuNet);
    const parts = num(input.parts);
    const mensuel = num(input.revenuMensuel);
    const parPart = parts > 0 ? revenu / parts : revenu;
    const impot = calculerImpotBareme(parPart) * parts;
    const taux = revenu > 0 ? (impot / revenu) * 100 : 0;
    const prelevement = mensuel * (taux / 100);
    return {
      summary: `Taux estimé : ${formatPercent(taux, 1)} — Prélèvement : ${formatCurrency(prelevement)}/mois.`,
      lines: [
        { label: "Prélèvement mensuel", value: formatCurrency(prelevement), highlight: true },
        { label: "Taux personnalisé", value: formatPercent(taux, 1), highlight: true },
        { label: "Impôt annuel estimé", value: formatCurrency(impot) },
        { label: "Salaire net mensuel", value: formatCurrency(mensuel) },
        { label: "Revenu net imposable", value: formatCurrency(revenu) },
      ],
    };
  },
};

export const flatTax30Pourcent: SimulatorDefinition = {
  slug: "flat-tax-30-pourcent",
  title: "Flat tax 30 %",
  shortDescription:
    "Calculez la fiscalité au PFU (flat tax 30 %) sur vos revenus de capitaux mobiliers.",
  metaTitle: "Simulateur flat tax 30 % — PFU",
  metaDescription:
    "Estimez l'impôt au PFU (12,8 % IR + 17,2 % PS) sur dividendes, intérêts et plus-values mobilières.",
  keywords: ["flat tax", "PFU", "prélèvement forfaitaire"],
  domain: "fiscalite",
  category: "impots",
  icon: "percent",
  relatedSlugs: ["impot-dividendes", "prelevement-a-la-source", "impot-sur-le-revenu"],
  formFields: [
    { key: "revenusCapitaux", label: "Revenus de capitaux mobiliers", type: "number", min: 0, step: 500, suffix: "€" },
    {
      key: "optionBareme",
      label: "Comparer au barème",
      type: "select",
      options: [
        { value: "non", label: "PFU 30 % (défaut)" },
        { value: "oui", label: "Option barème progressif" },
      ],
    },
    { key: "revenuGlobal", label: "Revenu global (si option barème)", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "parts", label: "Parts (si option barème)", type: "number", min: 1, max: 10, step: 0.5 },
  ],
  defaultValues: { revenusCapitaux: 8000, optionBareme: "non", revenuGlobal: 50000, parts: 2 },
  content: buildContent({
    intro: "Le PFU (flat tax) à 30 % s'applique par défaut aux intérêts, dividendes et plus-values mobilières.",
    howItWorks: [
      {
        title: "PFU 30 %",
        blocks: [
          p("12,8 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux = 30 % au total."),
          hl("Option barème", "Possible sur la déclaration pour les petits revenus — souvent plus avantageux si TMI faible."),
        ],
      },
    ],
    example: { title: "8 000 € de dividendes", blocks: [p("PFU : 2 400 €. Net : 5 600 €.")] },
    conseils: ["Comparez PFU et barème chaque année.", "Le PEA évite le PFU après 5 ans (PS uniquement).", "L'assurance-vie offre des abattements après 8 ans."],
    limites: ["Option barème simplifiée.", "Abattements assurance-vie non inclus."],
  }),
  faq: buildFaq([
    { question: "Quels revenus au PFU ?", answer: "Intérêts, dividendes, plus-values sur valeurs mobilières, certains revenus fonciers." },
    { question: "PFU ou barème ?", answer: "Le barème est avantageux si votre TMI est inférieur à 12,8 % (revenus modestes)." },
    { question: "PEA et PFU ?", answer: "Les gains PEA après 5 ans ne sont pas soumis au PFU (PS 17,2 % uniquement)." },
    { question: "Prélèvement à la source ?", answer: "Les revenus de capitaux sont prélevés à la source (acompte ou PFU à la distribution)." },
  ]),
  calculate(input) {
    const capitaux = num(input.revenusCapitaux);
    const pfu = capitaux * PFU_TAUX_GLOBAL;
    const netPfu = capitaux - pfu;
    let meilleur = "PFU 30 %";
    let impotBareme = 0;
    if (String(input.optionBareme) === "oui") {
      const revenu = num(input.revenuGlobal) + capitaux;
      const parts = num(input.parts);
      const parPart = parts > 0 ? revenu / parts : revenu;
      impotBareme = calculerImpotBareme(parPart) * parts;
      const impotSans = calculerImpotBareme((num(input.revenuGlobal) / parts)) * parts;
      const impotCapitaux = impotBareme - impotSans + capitaux * PFU_TAUX_PS;
      if (impotCapitaux < pfu) meilleur = "Barème progressif";
      return {
        summary: `${meilleur} plus avantageux — Net : ${formatCurrency(meilleur === "PFU 30 %" ? netPfu : capitaux - impotCapitaux)}.`,
        lines: [
          { label: "Option recommandée", value: meilleur, highlight: true },
          { label: "Impôt PFU", value: formatCurrency(pfu) },
          { label: "Net PFU", value: formatCurrency(netPfu) },
          { label: "Impôt barème (capitaux)", value: formatCurrency(impotCapitaux) },
          { label: "Revenus capitaux", value: formatCurrency(capitaux) },
        ],
      };
    }
    return {
      summary: `PFU : ${formatCurrency(pfu)} — Net : ${formatCurrency(netPfu)}.`,
      lines: [
        { label: "Impôt PFU", value: formatCurrency(pfu), highlight: true },
        { label: "Net après PFU", value: formatCurrency(netPfu), highlight: true },
        { label: "Revenus capitaux", value: formatCurrency(capitaux) },
        { label: "IR (12,8 %)", value: formatCurrency(capitaux * PFU_TAUX_IR) },
        { label: "PS (17,2 %)", value: formatCurrency(capitaux * PFU_TAUX_PS) },
      ],
    };
  },
};

export const microEntrepreneurCharges: SimulatorDefinition = {
  slug: "micro-entrepreneur-charges",
  title: "Micro-entrepreneur charges",
  shortDescription:
    "Estimez les charges sociales et l'impôt d'un auto-entrepreneur selon l'activité.",
  metaTitle: "Simulateur micro-entrepreneur — Charges sociales",
  metaDescription:
    "Calculez les charges URSSAF et l'impôt libératoire d'un micro-entrepreneur selon le CA et l'activité.",
  keywords: ["micro-entrepreneur", "auto-entrepreneur", "charges URSSAF"],
  domain: "fiscalite",
  category: "impots",
  icon: "calculator",
  relatedSlugs: ["flat-tax-30-pourcent", "taux-marginal-imposition", "prelevement-a-la-source"],
  formFields: [
    { key: "caAnnuel", label: "Chiffre d'affaires annuel", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "activite",
      label: "Type d'activité",
      type: "select",
      options: [
        { value: "vente", label: "Vente de marchandises (12,3 %)" },
        { value: "bic", label: "Prestations BIC (21,2 %)" },
        { value: "bnc", label: "Prestations BNC (24,6 %)" },
      ],
    },
    {
      key: "impotLiberatoire",
      label: "Impôt libératoire",
      type: "select",
      options: [
        { value: "non", label: "Non" },
        { value: "oui", label: "Oui (1 % à 2,2 %)" },
      ],
    },
  ],
  defaultValues: { caAnnuel: 35000, activite: "bic", impotLiberatoire: "non" },
  content: buildContent({
    intro: "Le micro-entrepreneur paie des charges sociales proportionnelles au chiffre d'affaires.",
    howItWorks: [
      {
        title: "Taux de charges",
        blocks: [
          p("Vente : 12,3 %. BIC : 21,2 %. BNC : 24,6 %. Calculés sur le CA, pas sur le bénéfice."),
          hl("Plafonds", "CA max : 77 700 € (vente) ou 188 700 € (services)."),
        ],
      },
    ],
    example: { title: "35 000 € CA prestations BIC", blocks: [p("Charges sociales : ~7 420 €. CA net : ~27 580 €.")] },
    conseils: ["Optez pour l'impôt libératoire si votre TMI est élevé.", "Versez les charges chaque mois ou trimestre.", "Surveillez les plafonds de CA."],
    limites: ["Taux 2024 — vérifiez les mises à jour URSSAF.", "CFE et autres taxes non incluses."],
  }),
  faq: buildFaq([
    { question: "Charges sur le CA ou le bénéfice ?", answer: "Sur le chiffre d'affaires encaissé, même sans bénéfice réel." },
    { question: "Impôt libératoire ?", answer: "Option pour payer l'IR en même temps que les charges (1 % à 2,2 % selon CA)." },
    { question: "Plafond micro-entreprise ?", answer: "77 700 € pour la vente, 188 700 € pour les services (2024)." },
    { question: "TVA ?", answer: "Franchise en base si CA < seuils TVA (exonération de TVA)." },
  ]),
  calculate(input) {
    const ca = num(input.caAnnuel);
    const activite = String(input.activite);
    const taux = getMicroEntrepreneurTaux(activite);
    const charges = ca * (taux / 100);
    let impot = 0;
    if (String(input.impotLiberatoire) === "oui") {
      impot = ca * getImpotLiberatoireTaux(activite);
    }
    const net = ca - charges - impot;
    return {
      summary: `Charges : ${formatCurrency(charges)} — Net après charges : ${formatCurrency(net)}.`,
      lines: [
        { label: "Net après charges", value: formatCurrency(net), highlight: true },
        { label: "Charges sociales", value: formatCurrency(charges), highlight: true },
        { label: "Impôt libératoire", value: formatCurrency(impot) },
        { label: "Taux charges", value: formatPercent(taux, 1) },
        { label: "CA annuel", value: formatCurrency(ca) },
      ],
    };
  },
};

export const creditImpotEmploiDomicile: SimulatorDefinition = {
  slug: "credit-impot-emploi-domicile",
  title: "Crédit d'impôt emploi à domicile",
  shortDescription:
    "Estimez le crédit d'impôt pour l'emploi d'un salarié à domicile (ménage, garde…).",
  metaTitle: "Simulateur crédit d'impôt emploi à domicile",
  metaDescription:
    "Calculez le crédit d'impôt de 50 % sur les dépenses d'emploi à domicile : ménage, garde d'enfants, soutien scolaire.",
  keywords: ["crédit impôt", "emploi à domicile", "aide ménage"],
  domain: "fiscalite",
  category: "impots",
  icon: "percent",
  relatedSlugs: ["cesu-credit-impot", "impot-sur-le-revenu", "quotient-familial"],
  formFields: [
    { key: "depenses", label: "Dépenses annuelles déclarées", type: "number", min: 0, step: 500, suffix: "€" },
    {
      key: "typeService",
      label: "Type de service",
      type: "select",
      options: [
        { value: "menage", label: "Ménage / repassage" },
        { value: "garde", label: "Garde d'enfants" },
        { value: "soutien", label: "Soutien scolaire" },
      ],
    },
  ],
  defaultValues: { depenses: 6000, typeService: "menage" },
  content: buildContent({
    intro: "Le crédit d'impôt pour l'emploi à domicile couvre 50 % des dépenses, plafonné à 12 000 € de dépenses.",
    howItWorks: [
      {
        title: "Crédit 50 %",
        blocks: [
          p("Crédit d'impôt = 50 % des dépenses déclarées, dans la limite de 12 000 € (plafond majorable)."),
          hl("CESU", "Les CESU préfinancés réduisent le crédit d'impôt proportionnellement."),
        ],
      },
    ],
    example: { title: "6 000 € de dépenses ménage", blocks: [p("Crédit d'impôt : 3 000 € (50 %).")] },
    conseils: ["Utilisez un organisme agréé ou un salarié déclaré.", "Conservez toutes les factures.", "Déclarez sur la case 7DB de la déclaration."],
    limites: ["Plafond 12 000 € non majoré ici.", "CESU préfinancés non déduits."],
  }),
  faq: buildFaq([
    { question: "Quels services éligibles ?", answer: "Ménage, repassage, garde d'enfants, soutien scolaire, petits travaux, assistance informatique." },
    { question: "Plafond du crédit ?", answer: "12 000 € de dépenses (crédit max 6 000 €), majorable selon situation." },
    { question: "Sans impôt à payer ?", answer: "Le crédit est remboursé même si vous ne payez pas d'impôt (crédit d'impôt, pas réduction)." },
    { question: "CESU et crédit d'impôt ?", answer: "Les CESU préfinancés par l'employeur réduisent le montant du crédit d'impôt." },
  ]),
  calculate(input) {
    const depenses = Math.min(num(input.depenses), CREDIT_IMPOT_EMPLOI_DOMICILE.plafondDepenses);
    const credit = depenses * CREDIT_IMPOT_EMPLOI_DOMICILE.tauxCredit;
    const reste = num(input.depenses) - depenses;
    return {
      summary: `Crédit d'impôt estimé : ${formatCurrency(credit)} (50 % des dépenses).`,
      lines: [
        { label: "Crédit d'impôt", value: formatCurrency(credit), highlight: true },
        { label: "Dépenses prises en compte", value: formatCurrency(depenses) },
        { label: "Dépenses hors plafond", value: formatCurrency(reste) },
        { label: "Taux crédit", value: "50 %" },
        { label: "Service", value: String(input.typeService) },
      ],
    };
  },
};

export const impotDividendes: SimulatorDefinition = {
  slug: "impot-dividendes",
  title: "Impôt sur les dividendes",
  shortDescription:
    "Calculez la fiscalité sur vos dividendes : PFU 30 % ou option barème.",
  metaTitle: "Simulateur impôt dividendes — PFU ou barème",
  metaDescription:
    "Estimez l'impôt sur vos dividendes : prélèvement forfaitaire 30 % ou option pour le barème progressif.",
  keywords: ["impôt dividendes", "fiscalité dividendes", "PFU dividendes"],
  domain: "fiscalite",
  category: "impots",
  icon: "percent",
  relatedSlugs: ["flat-tax-30-pourcent", "impot-sur-le-revenu", "taux-marginal-imposition"],
  formFields: [
    { key: "dividendes", label: "Dividendes bruts annuels", type: "number", min: 0, step: 500, suffix: "€" },
    {
      key: "option",
      label: "Fiscalité",
      type: "select",
      options: [
        { value: "pfu", label: "PFU 30 % (défaut)" },
        { value: "bareme", label: "Option barème + abattement 40 %" },
      ],
    },
    { key: "revenuAutres", label: "Autres revenus nets", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "parts", label: "Parts fiscales", type: "number", min: 1, max: 10, step: 0.5 },
  ],
  defaultValues: { dividendes: 5000, option: "pfu", revenuAutres: 40000, parts: 2 },
  content: buildContent({
    intro: "Les dividendes sont fiscalisés au PFU 30 % par défaut, avec option pour le barème et abattement de 40 %.",
    howItWorks: [
      {
        title: "PFU vs barème",
        blocks: [
          p("PFU : 30 % flat. Barème : abattement 40 % sur dividendes + imposition au TMI + PS 17,2 %."),
          hl("Abattement", "L'abattement de 40 % au barème réduit la base imposable des dividendes."),
        ],
      },
    ],
    example: { title: "5 000 € de dividendes", blocks: [p("PFU : 1 500 €. Barème avantageux si TMI ≤ 11 %.")] },
    conseils: ["Comparez chaque année PFU et barème.", "Les dividendes PEA après 5 ans : PS uniquement.", "Déclarez sur le formulaire 2042."],
    limites: ["Option barème simplifiée.", "Dividendes étrangers : crédits d'impôt non modélisés."],
  }),
  faq: buildFaq([
    { question: "PFU automatique ?", answer: "Oui, appliqué par la banque à la distribution. Option barème sur la déclaration." },
    { question: "Abattement 40 % ?", answer: "Disponible uniquement si vous optez pour le barème progressif." },
    { question: "Dividendes PEA ?", answer: "Exonérés d'IR après 5 ans. PS 17,2 % uniquement sur les gains (pas sur les dividendes en PEA)." },
    { question: "Dividendes et CSG déductible ?", answer: "6,8 % de CSG déductible si option barème (non modélisé ici)." },
  ]),
  calculate(input) {
    const div = num(input.dividendes);
    const pfu = div * PFU_TAUX_GLOBAL;
    const netPfu = div - pfu;
    if (String(input.option) === "bareme") {
      const base = div * 0.6;
      const parts = num(input.parts);
      const revenu = num(input.revenuAutres) + base;
      const parPart = parts > 0 ? revenu / parts : revenu;
      const impotTotal = calculerImpotBareme(parPart) * parts;
      const impotSans = calculerImpotBareme((num(input.revenuAutres) / parts)) * parts;
      const impotDiv = impotTotal - impotSans + base * PFU_TAUX_PS;
      const netBareme = div - impotDiv;
      const meilleur = impotDiv < pfu ? "Barème" : "PFU";
      return {
        summary: `${meilleur} : net ${formatCurrency(meilleur === "PFU" ? netPfu : netBareme)}.`,
        lines: [
          { label: "Option recommandée", value: meilleur, highlight: true },
          { label: "Net PFU", value: formatCurrency(netPfu) },
          { label: "Net barème", value: formatCurrency(netBareme) },
          { label: "Impôt PFU", value: formatCurrency(pfu) },
          { label: "Impôt barème", value: formatCurrency(impotDiv) },
        ],
      };
    }
    return {
      summary: `PFU : ${formatCurrency(pfu)} — Net : ${formatCurrency(netPfu)}.`,
      lines: [
        { label: "Net après PFU", value: formatCurrency(netPfu), highlight: true },
        { label: "Impôt PFU", value: formatCurrency(pfu), highlight: true },
        { label: "Dividendes bruts", value: formatCurrency(div) },
        { label: "IR (12,8 %)", value: formatCurrency(div * PFU_TAUX_IR) },
        { label: "PS (17,2 %)", value: formatCurrency(div * PFU_TAUX_PS) },
      ],
    };
  },
};

export const tauxMarginalImposition: SimulatorDefinition = {
  slug: "taux-marginal-imposition",
  title: "Taux marginal d'imposition",
  shortDescription:
    "Déterminez votre tranche marginale d'imposition (TMI) selon votre revenu par part.",
  metaTitle: "Simulateur taux marginal d'imposition — TMI",
  metaDescription:
    "Calculez votre taux marginal d'imposition (TMI) : 0 %, 11 %, 30 %, 41 % ou 45 % selon le revenu par part.",
  keywords: ["TMI", "taux marginal", "tranche imposition"],
  domain: "fiscalite",
  category: "impots",
  icon: "calculator",
  relatedSlugs: ["impot-sur-le-revenu", "quotient-familial", "prelevement-a-la-source"],
  formFields: [
    { key: "revenuNet", label: "Revenu net imposable", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "parts", label: "Nombre de parts", type: "number", min: 1, max: 10, step: 0.5 },
  ],
  defaultValues: { revenuNet: 60000, parts: 2 },
  content: buildContent({
    intro: "Le TMI indique la tranche d'imposition du dernier euro gagné — crucial pour optimiser vos placements.",
    howItWorks: [
      {
        title: "Tranches 2024",
        blocks: [
          p("0 % jusqu'à 11 294 €, 11 %, 30 %, 41 %, 45 % par part. Le TMI est la tranche du revenu marginal."),
          hl("Taux effectif", "Toujours inférieur au TMI car les premiers euros sont moins taxés."),
        ],
      },
    ],
    example: { title: "60 000 €, 2 parts", blocks: [p("Revenu par part : 30 000 € — TMI : 30 %.")] },
    conseils: ["Réduisez le TMI avec le PER (déduction immédiate).", "Le TMI guide le choix PFU vs barème.", "Anticipez les hausses de revenus."],
    limites: ["Barème 2024 sur revenus 2023.", "Prélèvements sociaux non inclus dans le TMI."],
  }),
  faq: buildFaq([
    { question: "TMI ou taux effectif ?", answer: "Le TMI est la tranche du dernier euro ; le taux effectif est l'impôt total / revenu." },
    { question: "TMI et PER ?", answer: "Les versements PER réduisent le revenu imposable et peuvent baisser votre TMI." },
    { question: "TMI et flat tax ?", answer: "Le PFU (12,8 %) est avantageux si votre TMI est ≥ 30 %." },
    { question: "Comment connaître mon TMI ?", answer: "Consultez votre avis d'imposition ou utilisez ce simulateur." },
  ]),
  calculate(input) {
    const revenu = num(input.revenuNet);
    const parts = num(input.parts);
    const parPart = parts > 0 ? revenu / parts : revenu;
    const tranches = [
      { max: 11294, taux: 0 },
      { max: 28797, taux: 11 },
      { max: 82341, taux: 30 },
      { max: 177106, taux: 41 },
      { max: Infinity, taux: 45 },
    ];
    let tmi = 0;
    for (const { max, taux } of tranches) {
      if (parPart <= max) {
        tmi = taux;
        break;
      }
    }
    const impot = calculerImpotBareme(parPart) * parts;
    const effectif = revenu > 0 ? (impot / revenu) * 100 : 0;
    return {
      summary: `TMI : ${formatPercent(tmi, 0)} — Taux effectif : ${formatPercent(effectif, 1)}.`,
      lines: [
        { label: "TMI", value: formatPercent(tmi, 0), highlight: true },
        { label: "Taux effectif", value: formatPercent(effectif, 1), highlight: true },
        { label: "Revenu par part", value: formatCurrency(parPart) },
        { label: "Impôt estimé", value: formatCurrency(impot) },
        { label: "Parts", value: formatNumber(parts, 1) },
      ],
    };
  },
};

export const donationNumeraire: SimulatorDefinition = {
  slug: "donation-numeraire",
  title: "Donation en numéraire",
  shortDescription:
    "Estimez les droits de donation pour une transmission en numéraire à un enfant ou petit-enfant.",
  metaTitle: "Simulateur donation numéraire — Droits de donation",
  metaDescription:
    "Calculez les droits de donation pour une donation en numéraire : abattements et barème progressif.",
  keywords: ["donation numéraire", "droits donation", "abattement donation"],
  domain: "fiscalite",
  category: "impots",
  icon: "calculator",
  relatedSlugs: ["quotient-familial", "impot-sur-le-revenu", "cesu-credit-impot"],
  formFields: [
    { key: "montant", label: "Montant de la donation", type: "number", min: 0, step: 5000, suffix: "€" },
    {
      key: "lien",
      label: "Lien de parenté",
      type: "select",
      options: [
        { value: "enfant", label: "Parent → Enfant (100 000 € abattement)" },
        { value: "petitEnfant", label: "Grand-parent → Petit-enfant (31 865 €)" },
        { value: "conjoint", label: "Conjoint / partenaire (exonéré)" },
      ],
    },
    { key: "donations15ans", label: "Donations antérieures (15 ans)", type: "number", min: 0, step: 5000, suffix: "€" },
  ],
  defaultValues: { montant: 50000, lien: "enfant", donations15ans: 0 },
  content: buildContent({
    intro: "Les donations en numéraire bénéficient d'abattements renouvelables tous les 15 ans.",
    howItWorks: [
      {
        title: "Abattements",
        blocks: [
          p("Enfant : 100 000 € tous les 15 ans. Petit-enfant : 31 865 €. Conjoint : exonération totale."),
          hl("Barème", "Droits progressifs de 5 % à 45 % sur la part taxable."),
        ],
      },
    ],
    example: { title: "50 000 € à un enfant", blocks: [p("Après abattement 100 000 € : exonération totale.")] },
    conseils: ["Anticipez les transmissions pour utiliser les abattements.", "Déclarez toute donation même exonérée.", "Consultez un notaire pour les montants importants."],
    limites: ["Barème simplifié.", "Donations antérieures estimées manuellement."],
  }),
  faq: buildFaq([
    { question: "Abattement enfant ?", answer: "100 000 € par parent et par enfant, renouvelable tous les 15 ans." },
    { question: "Déclaration obligatoire ?", answer: "Oui, même si la donation est dans l'abattement (déclaration de manœuvre)."},
    { question: "Donation-partage ?", answer: "Permet de transmettre à plusieurs enfants avec abattements individuels." },
    { question: "Don manuel ?", answer: "Possible sans acte notarié pour les sommes modestes, mais déclaration requise." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const lien = String(input.lien);
    const abattements: Record<string, number> = {
      enfant: DONATION_ABATTEMENTS.enfant,
      petitEnfant: DONATION_ABATTEMENTS.petitenfant,
      conjoint: Infinity,
    };
    const abattement = abattements[lien] ?? DONATION_ABATTEMENTS.enfant;
    const precedentes = num(input.donations15ans);
    const resteAbattement = Math.max(0, abattement - precedentes);
    const taxable = lien === "conjoint" ? 0 : Math.max(0, montant - resteAbattement);
    const droits = taxable * DONATION_TAUX_SIMPLIFIE;
    return {
      summary: lien === "conjoint" ? "Exonération totale (conjoint)." : `Droits estimés : ${formatCurrency(droits)}.`,
      lines: [
        { label: "Droits de donation", value: formatCurrency(droits), highlight: true },
        { label: "Base taxable", value: formatCurrency(taxable) },
        { label: "Abattement restant", value: formatCurrency(resteAbattement) },
        { label: "Montant donation", value: formatCurrency(montant) },
        { label: "Lien", value: lien },
      ],
    };
  },
};

export const cesuCreditImpot: SimulatorDefinition = {
  slug: "cesu-credit-impot",
  title: "CESU crédit d'impôt",
  shortDescription:
    "Calculez le crédit d'impôt lié à l'utilisation de CESU pour des services à la personne.",
  metaTitle: "Simulateur CESU crédit d'impôt",
  metaDescription:
    "Estimez le crédit d'impôt pour les CESU utilisés pour l'emploi à domicile et les services à la personne.",
  keywords: ["CESU", "chèque emploi service", "crédit impôt CESU"],
  domain: "fiscalite",
  category: "impots",
  icon: "percent",
  relatedSlugs: ["credit-impot-emploi-domicile", "impot-sur-le-revenu", "donation-numeraire"],
  formFields: [
    { key: "cesuUtilises", label: "CESU utilisés (annuel)", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "cesuPrefinance", label: "CESU préfinancés par employeur", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "depensesTotales", label: "Dépenses totales services", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { cesuUtilises: 3000, cesuPrefinance: 500, depensesTotales: 4000 },
  content: buildContent({
    intro: "Les CESU déclarés pour des services à la personne ouvrent droit à un crédit d'impôt de 50 %.",
    howItWorks: [
      {
        title: "Crédit CESU",
        blocks: [
          p("Crédit = 50 % des dépenses éligibles. Les CESU préfinancés réduisent le crédit d'impôt."),
          hl("Plafond", "12 000 € de dépenses annuelles (crédit max 6 000 €)."),
        ],
      },
    ],
    example: { title: "3 000 € CESU, 500 € préfinancés", blocks: [p("Crédit d'impôt estimé : ~1 250 €.")] },
    conseils: ["Déclarez les CESU sur votre déclaration de revenus.", "Conservez les attestations de l'organisme CESU.", "Combinez avec le crédit emploi à domicile."],
    limites: ["CESU préfinancés estimés manuellement.", "Plafond non majoré."],
  }),
  faq: buildFaq([
    { question: "CESU dématérialisé ?", answer: "Le CESU dématérialisé fonctionne comme le papier pour le crédit d'impôt." },
    { question: "CESU préfinancés ?", answer: "Versés par l'employeur ou la CAF — réduisent le crédit d'impôt proportionnellement." },
    { question: "Services éligibles ?", answer: "Ménage, garde d'enfants, aide aux personnes âgées, petits travaux." },
    { question: "Sans impôt ?", answer: "Le crédit est remboursé même sans impôt à payer." },
  ]),
  calculate(input) {
    const cesu = num(input.cesuUtilises);
    const prefinance = num(input.cesuPrefinance);
    const depenses = Math.min(num(input.depensesTotales), CREDIT_IMPOT_EMPLOI_DOMICILE.plafondDepenses);
    const eligible = Math.max(0, depenses - prefinance);
    const credit = Math.min(
      eligible * CREDIT_IMPOT_EMPLOI_DOMICILE.tauxCredit,
      cesu * CREDIT_IMPOT_EMPLOI_DOMICILE.tauxCredit
    );
    return {
      summary: `Crédit d'impôt CESU estimé : ${formatCurrency(credit)}.`,
      lines: [
        { label: "Crédit d'impôt", value: formatCurrency(credit), highlight: true },
        { label: "Dépenses éligibles", value: formatCurrency(eligible) },
        { label: "CESU utilisés", value: formatCurrency(cesu) },
        { label: "CESU préfinancés", value: formatCurrency(prefinance) },
        { label: "Dépenses totales", value: formatCurrency(depenses) },
      ],
    };
  },
};

export const fiscaliteGeneraleSimulators = [
  impotSurLeRevenu,
  quotientFamilial,
  prelevementALaSource,
  flatTax30Pourcent,
  microEntrepreneurCharges,
  creditImpotEmploiDomicile,
  impotDividendes,
  tauxMarginalImposition,
  donationNumeraire,
  cesuCreditImpot,
];
