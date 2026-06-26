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

const IS_TAUX_NORMAL = 0.25;

const IS_TAUX_REDUIT = 0.15;

const IS_SEUIL_REDUIT = 42_500;

const CVAE_TAUX = 0.0019;

const CVAE_SEUIL = 500_000;

const JEI_EXONERATION_IS = 1;

const ZFU_EXONERATION_CHARGES = 0.5;

const HOLDING_EXONERATION_QP = 0.95;

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

const eurlIs = createDraft({
  slug: "simulateur-eurl-is",
  title: "EURL à l'IS",
  shortDescription: "Estimez l'impôt sur les sociétés et le revenu net d'une EURL optant pour l'IS.",
  metaTitle: "Simulateur EURL IS — Impôt sociétés et rémunération",
  metaDescription: "Calculez l'impôt sur les sociétés d'une EURL et le revenu net du gérant après IS et rémunération.",
  keywords: ["EURL IS", "impôt sociétés EURL", "EURL fiscalité"],
  category: "independant",
  icon: "building",
  regulationIds: ["fiscalite", "impot"],
  relatedSlugs: ["sasu-remuneration-dividendes", "simulateur-sarl-dividendes"],
  formFields: [
    { key: "resultatAvantImpots", label: "Résultat avant impôt", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "remunerationGerant", label: "Rémunération du gérant", type: "number", min: 0, step: 1000, suffix: "€" },
  ],
  defaultValues: { resultatAvantImpots: 80000, remunerationGerant: 45000 },
  intro: "L'EURL à l'IS paie l'impôt sur les sociétés sur ses bénéfices, le gérant perçoit une rémunération soumise aux cotisations TNS.",
  howTitle: "IS et rémunération",
  howDetail: "IS = 15 % jusqu'à 42 500 € de bénéfice puis 25 %. Rémunération déductible du résultat imposable.",
  faqItems: [
    { question: "EURL à l'IS ou à l'IR ?", answer: "L'IS permet de capitaliser les bénéfices ; l'IR évite la double imposition pour les petits résultats." },
    { question: "Le gérant est-il salarié ?", answer: "Non, il est TNS (travailleur non salarié) avec cotisations URSSAF spécifiques." },
    { question: "Peut-on distribuer des dividendes en EURL ?", answer: "Oui, après IS et constitution de réserves, sous réserve de la trésorerie disponible." },
    { question: "Comptabilité obligatoire ?", answer: "Tenue de comptabilité complète, bilan annuel et liasse fiscale obligatoires à l'IS." },
  ],
  calculate(input) {
    const resultat = num(input.resultatAvantImpots);
    const rem = num(input.remunerationGerant);
    const baseIS = Math.max(0, resultat - rem);
    const is = baseIS <= IS_SEUIL_REDUIT ? baseIS * IS_TAUX_REDUIT : IS_SEUIL_REDUIT * IS_TAUX_REDUIT + (baseIS - IS_SEUIL_REDUIT) * IS_TAUX_NORMAL;
    const beneficeNet = baseIS - is;
    return {
      summary: `IS estimé : ${formatCurrency(is)} — bénéfice distribuable : ${formatCurrency(beneficeNet)}.`,
      lines: [
        { label: "Impôt sur les sociétés", value: formatCurrency(is), highlight: true },
        { label: "Bénéfice après IS", value: formatCurrency(beneficeNet), highlight: true },
        { label: "Base imposable IS", value: formatCurrency(baseIS) },
        { label: "Rémunération gérant", value: formatCurrency(rem) },
      ],
    };
  },
});

const sarlDividendes = createDraft({
  slug: "simulateur-sarl-dividendes",
  title: "SARL — dividendes",
  shortDescription: "Estimez le net perçu après flat tax sur une distribution de dividendes en SARL.",
  metaTitle: "Simulateur SARL dividendes — Flat tax 30 %",
  metaDescription: "Calculez le montant net de dividendes distribués par une SARL après prélèvement forfaitaire unique (PFU 30 %).",
  keywords: ["SARL dividendes", "flat tax dividendes", "distribution dividendes"],
  category: "independant",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["impot-dividendes", "sasu-remuneration-dividendes", "simulateur-eurl-is"],
  formFields: [
    { key: "dividendesBruts", label: "Dividendes bruts distribués", type: "number", min: 0, step: 1000, suffix: "€" },
  ],
  defaultValues: { dividendesBruts: 30000 },
  intro: "Les dividendes versés aux associés de SARL sont soumis au PFU (flat tax) de 30 % par défaut.",
  howTitle: "Flat tax sur dividendes",
  howDetail: "Net = dividendes bruts × (1 − 30 %). Option barème IR possible sous conditions.",
  faqItems: [
    { question: "Peut-on opter pour le barème ?", answer: "Oui, si c'est plus avantageux — comparez les deux options." },
    { question: "Y a-t-il des cotisations sociales ?", answer: "Au-delà de 10 % du capital et des comptes courants, des prélèvements sociaux peuvent s'appliquer." },
    { question: "Quand distribuer les dividendes ?", answer: "Après approbation des comptes en assemblée générale et sous réserve de réserves légales." },
    { question: "Dividendes et trésorerie ?", answer: "La distribution ne doit pas mettre en péril la trésorerie ni les fonds propres de la société." },
  ],
  calculate(input) {
    const brut = num(input.dividendesBruts);
    const net = brut * PFU_NET_RATIO;
    const prelevement = brut * PFU_TAUX_GLOBAL;
    return {
      summary: `Dividendes nets : ${formatCurrency(net)} (PFU : ${formatCurrency(prelevement)}).`,
      lines: [
        { label: "Dividendes nets", value: formatCurrency(net), highlight: true },
        { label: "Flat tax (PFU)", value: formatCurrency(prelevement) },
        { label: "Dividendes bruts", value: formatCurrency(brut) },
        { label: "Taux PFU", value: formatPercent(PFU_TAUX_GLOBAL * 100, 0) },
      ],
    };
  },
});

const holdingFiscalite = createDraft({
  slug: "simulateur-holding-fiscalite",
  title: "Holding — fiscalité mère-fille",
  shortDescription: "Estimez l'exonération des dividendes remontés à une holding (régime mère-fille).",
  metaTitle: "Simulateur holding fiscalité — Régime mère-fille",
  metaDescription: "Calculez l'économie fiscale du régime mère-fille : exonération quasi-totale des dividendes remontés à la holding.",
  keywords: ["holding fiscalité", "régime mère-fille", "exonération dividendes"],
  category: "entreprise-gestion",
  icon: "chart",
  regulationIds: ["fiscalite", "impot"],
  relatedSlugs: ["simulateur-sarl-dividendes", "impot-dividendes"],
  formFields: [
    { key: "dividendesFiliale", label: "Dividendes perçus de la filiale", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "detention", label: "Détention du capital filiale", type: "number", min: 5, max: 100, step: 1, suffix: "%" },
  ],
  defaultValues: { dividendesFiliale: 100000, detention: 100 },
  intro: "Le régime mère-fille exonère quasi-totalement les dividendes perçus par une holding de ses filiales.",
  howTitle: "Conditions mère-fille",
  howDetail: "Détention ≥ 5 % pendant 2 ans. Quasi-exonération (QPFC 5 % réintégrée au résultat imposable).",
  faqItems: [
    { question: "Quelles conditions pour le régime mère-fille ?", answer: "Société soumise à l'IS, détention ≥ 5 % du capital, conservation 2 ans." },
    { question: "La holding paie-t-elle l'IS ?", answer: "Sur la quote-part de frais et charges (5 %) réintégrée, pas sur le dividende exonéré." },
    { question: "Holding animatrice requise ?", answer: "Non pour le régime mère-fille, mais nécessaire pour d'autres avantages (ex. intégration fiscale)." },
    { question: "Plus-value à la revente de titres ?", answer: "Régime mère-fille long terme possible si détention ≥ 2 ans et titres éligibles." },
  ],
  calculate(input) {
    const div = num(input.dividendesFiliale);
    const det = num(input.detention);
    const eligible = det >= 5;
    const qpfc = div * (1 - HOLDING_EXONERATION_QP);
    const is = qpfc * IS_TAUX_NORMAL;
    const economie = eligible ? div * IS_TAUX_NORMAL - is : 0;
    return {
      summary: eligible
        ? `Exonération mère-fille — IS sur QPFC : ${formatCurrency(is)} (économie ~${formatCurrency(economie)}).`
        : "Détention insuffisante pour le régime mère-fille (< 5 %).",
      lines: [
        { label: "IS sur QPFC (5 %)", value: formatCurrency(is), highlight: true },
        { label: "Dividendes reçus", value: formatCurrency(div) },
        { label: "Éligibilité mère-fille", value: eligible ? "Oui" : "Non" },
        { label: "Économie estimée", value: formatCurrency(economie) },
      ],
    };
  },
});

const tvaIntracommunautaire = createDraft({
  slug: "simulateur-tva-intracommunautaire",
  title: "TVA intracommunautaire",
  shortDescription: "Estimez la TVA sur une opération intracommunautaire B2B (autoliquidation).",
  metaTitle: "Simulateur TVA intracommunautaire — Autoliquidation",
  metaDescription: "Calculez le traitement TVA d'une vente ou achat intracommunautaire : autoliquidation et déductibilité.",
  keywords: ["TVA intracommunautaire", "autoliquidation TVA", "TVA UE B2B"],
  category: "entreprise-gestion",
  icon: "percent",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-tva-deductible", "micro-entrepreneur-charges"],
  formFields: [
    { key: "montantHT", label: "Montant HT", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "typeOp", label: "Type d'opération", type: "select", options: [{ value: "vente", label: "Vente B2B UE (export)" }, { value: "achat", label: "Achat B2B UE (import)" }] },
  ],
  defaultValues: { montantHT: 25000, typeOp: "vente" },
  intro: "Les opérations B2B intracommunautaires sont en principe exonérées avec autoliquidation par l'acheteur.",
  howTitle: "Autoliquidation",
  howDetail: "Vente : exonération si client assujetti UE avec n° TVA valide. Achat : autoliquidation TVA 20 % déductible si activité taxable.",
  faqItems: [
    { question: "Faut-il un numéro de TVA intracommunautaire ?", answer: "Oui, pour les opérations B2B avec un client professionnel assujetti dans un autre État membre." },
    { question: "Quelle déclaration ?", answer: "Déclaration européenne de TVA (DEB/EMEBI) et mention sur la déclaration CA3." },
    { question: "Vérification du n° TVA client ?", answer: "Obligatoire via le service VIES de la Commission européenne avant exonération." },
    { question: "Livraison intracommunautaire de biens ?", answer: "Exonération en France si client assujetti UE et n° TVA valide — autoliquidation chez l'acheteur." },
  ],
  calculate(input) {
    const ht = num(input.montantHT);
    const type = String(input.typeOp);
    const tva = ht * (TVA_TAUX.normal / 100);
    const solde = type === "achat" ? 0 : 0;
    return {
      summary: type === "vente"
        ? `Vente exonérée — TVA due en France : 0 € (autoliquidation chez l'acheteur).`
        : `Achat : TVA autoliquidée ${formatCurrency(tva)} — déductible si activité taxable (solde ${formatCurrency(solde)}).`,
      lines: [
        { label: "Montant HT", value: formatCurrency(ht), highlight: true },
        { label: "TVA autoliquidée", value: formatCurrency(type === "achat" ? tva : 0) },
        { label: "TVA déductible", value: formatCurrency(type === "achat" ? tva : 0) },
        { label: "Type", value: type === "vente" ? "Vente UE" : "Achat UE" },
      ],
    };
  },
});

const cvae = createDraft({
  slug: "simulateur-cvae",
  title: "CVAE",
  shortDescription: "Estimez la Cotisation sur la Valeur Ajoutée des Entreprises (CVAE).",
  metaTitle: "Simulateur CVAE — Cotisation valeur ajoutée",
  metaDescription: "Calculez une estimation de la CVAE selon la valeur ajoutée et le chiffre d'affaires de l'entreprise.",
  keywords: ["CVAE", "cotisation valeur ajoutée", "calcul CVAE"],
  category: "entreprise-gestion",
  icon: "percent",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-cfe", "simulateur-impot-societes"],
  formFields: [
    { key: "valeurAjoutee", label: "Valeur ajoutée", type: "number", min: 0, step: 10000, suffix: "€" },
    { key: "ca", label: "Chiffre d'affaires HT", type: "number", min: 0, step: 10000, suffix: "€" },
  ],
  defaultValues: { valeurAjoutee: 800000, ca: 2500000 },
  intro: "La CVAE est due par les entreprises réalisant plus de 500 000 € de CA et dont la VA excède certains seuils.",
  howTitle: "Calcul simplifié",
  howDetail: "Taux effectif progressif plafonné — estimation : VA × 0,19 % pour les entreprises au-dessus du seuil.",
  faqItems: [
    { question: "Qui paie la CVAE ?", answer: "Entreprises et professions libérales réalisant plus de 500 000 € de CA HT." },
    { question: "CVAE et CFE ?", answer: "La CVAE vient en déduction de la CFE dans certaines limites." },
    { question: "Comment calculer la valeur ajoutée ?", answer: "VA = production − consommations intermédiaires (matières, sous-traitance, loyers…)." },
    { question: "Échéances de paiement ?", answer: "Deux acomptes en juin et septembre, solde en mai de l'année suivante." },
  ],
  calculate(input) {
    const va = num(input.valeurAjoutee);
    const ca = num(input.ca);
    const due = ca >= CVAE_SEUIL ? va * CVAE_TAUX : 0;
    return {
      summary: ca >= CVAE_SEUIL ? `CVAE estimée : ${formatCurrency(due)}/an.` : "CA inférieur au seuil — CVAE non due.",
      lines: [
        { label: "CVAE estimée", value: formatCurrency(due), highlight: true },
        { label: "Valeur ajoutée", value: formatCurrency(va) },
        { label: "Chiffre d'affaires", value: formatCurrency(ca) },
        { label: "Assujettissement", value: ca >= CVAE_SEUIL ? "Oui" : "Non" },
      ],
    };
  },
});

const cfe = createDraft({
  slug: "simulateur-cfe",
  title: "CFE",
  shortDescription: "Estimez la Cotisation Foncière des Entreprises (CFE) annuelle.",
  metaTitle: "Simulateur CFE — Cotisation foncière entreprises",
  metaDescription: "Calculez une estimation de la CFE selon la valeur locative cadastrale des locaux professionnels.",
  keywords: ["CFE", "cotisation foncière entreprises", "calcul CFE"],
  category: "entreprise-gestion",
  icon: "building",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-cvae", "taxe-fonciere"],
  formFields: [
    { key: "valeurLocative", label: "Valeur locative cadastrale", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "tauxCommunal", label: "Taux communal CFE", type: "number", min: 0, max: 5, step: 0.01, suffix: "%" },
    { key: "premiereAnnee", label: "Première année d'activité", type: "select", options: [{ value: "non", label: "Non" }, { value: "oui", label: "Oui (exonération)" }] },
  ],
  defaultValues: { valeurLocative: 5000, tauxCommunal: 0.2, premiereAnnee: "non" },
  intro: "La CFE est due par les entreprises exerçant une activité professionnelle non salariée ou société.",
  howTitle: "Base et exonération",
  howDetail: "CFE = base × taux communal. Exonération totale la première année d'activité.",
  faqItems: [
    { question: "La micro-entreprise paie-t-elle la CFE ?", answer: "Oui, sauf exonération première année ou cas particuliers (CA très faible)." },
    { question: "Quand est-elle payée ?", answer: "En décembre, avis émis fin novembre." },
    { question: "Base minimum de CFE ?", answer: "Un montant minimum est dû même si la valeur locative cadastrale est faible." },
    { question: "CFE et domiciliation ?", answer: "La domiciliation commerciale génère une CFE au domiciliataire et éventuellement au domicilié." },
  ],
  calculate(input) {
    const vl = num(input.valeurLocative);
    const taux = num(input.tauxCommunal) / 100;
    const exon = String(input.premiereAnnee) === "oui";
    const cfe = exon ? 0 : vl * taux;
    return {
      summary: exon ? "Exonération CFE — première année d'activité." : `CFE estimée : ${formatCurrency(cfe)}/an.`,
      lines: [
        { label: "CFE estimée", value: formatCurrency(cfe), highlight: true },
        { label: "Valeur locative", value: formatCurrency(vl) },
        { label: "Taux communal", value: formatPercent(taux * 100, 2) },
        { label: "Exonération", value: exon ? "Oui" : "Non" },
      ],
    };
  },
});

const divisionOptimaleRemuneration = createDraft({
  slug: "simulateur-division-optimale-remuneration",
  title: "Division optimale rémunération",
  shortDescription: "Comparez salaire et dividendes pour optimiser la rémunération du dirigeant.",
  metaTitle: "Simulateur division rémunération — Salaire vs dividendes",
  metaDescription: "Comparez le net perçu via salaire ou dividendes pour optimiser la rémunération du dirigeant de société.",
  keywords: ["optimisation rémunération dirigeant", "salaire vs dividendes", "division rémunération"],
  category: "independant",
  icon: "chart",
  regulationIds: ["fiscalite", "urssaf"],
  relatedSlugs: ["sasu-remuneration-dividendes", "simulateur-eurl-is"],
  formFields: [
    { key: "montantTotal", label: "Montant total disponible", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "partSalaire", label: "Part en salaire", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
    { key: "tauxCotisations", label: "Cotisations sur salaire", type: "number", min: 40, max: 80, step: 1, suffix: "%" },
  ],
  defaultValues: { montantTotal: 100000, partSalaire: 60, tauxCotisations: 45 },
  intro: "Le dirigeant peut se rémunérer en salaire (cotisations) ou dividendes (PFU) — l'équilibre dépend de sa situation.",
  howTitle: "Comparatif net",
  howDetail: "Salaire net = brut × (1 − cotisations). Dividendes net = montant × 70 % après PFU.",
  faqItems: [
    { question: "Faut-il se verser un salaire minimum ?", answer: "Recommandé pour cotiser à l'assurance chômage et valider les trimestres retraite." },
    { question: "Les dividendes ouvrent-ils droit au chômage ?", answer: "Non, seule la rémunération en salaire cotise à l'assurance chômage des dirigeants." },
    { question: "Charges sociales sur dividendes ?", answer: "Pas de cotisations sur dividendes dans la limite de 10 % du capital, au-delà prélèvements sociaux." },
    { question: "Arbitrage annuel ou fixe ?", answer: "Réévaluez chaque année selon résultat, besoins personnels et optimisation fiscale globale." },
  ],
  calculate(input) {
    const total = num(input.montantTotal);
    const partSal = num(input.partSalaire) / 100;
    const taux = num(input.tauxCotisations) / 100;
    const salaireBrut = total * partSal;
    const dividendes = total * (1 - partSal);
    const netSalaire = salaireBrut * (1 - taux);
    const netDividendes = dividendes * PFU_NET_RATIO;
    const netTotal = netSalaire + netDividendes;
    return {
      summary: `Net total estimé : ${formatCurrency(netTotal)} (salaire ${formatCurrency(netSalaire)} + dividendes ${formatCurrency(netDividendes)}).`,
      lines: [
        { label: "Net total", value: formatCurrency(netTotal), highlight: true },
        { label: "Net salaire", value: formatCurrency(netSalaire) },
        { label: "Net dividendes", value: formatCurrency(netDividendes) },
        { label: "Part salaire / dividendes", value: `${formatPercent(partSal * 100, 0)} / ${formatPercent((1 - partSal) * 100, 0)}` },
      ],
    };
  },
});

const amortissementLineaire = createDraft({
  slug: "simulateur-amortissement-lineaire",
  title: "Amortissement linéaire",
  shortDescription: "Calculez la dotation annuelle en amortissement linéaire d'un actif.",
  metaTitle: "Simulateur amortissement linéaire — Dotation annuelle",
  metaDescription: "Calculez l'amortissement linéaire d'un bien : valeur d'origine, durée d'utilisation et dotation par exercice.",
  keywords: ["amortissement linéaire", "dotation amortissement", "calcul amortissement"],
  category: "entreprise-gestion",
  icon: "calculator",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-amortissement-degressif", "simulateur-bilan-simplifie"],
  formFields: [
    { key: "valeurOrigine", label: "Valeur d'origine", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "duree", label: "Durée d'amortissement", type: "number", min: 1, max: 30, step: 1, suffix: "ans" },
    { key: "annee", label: "Année de calcul", type: "number", min: 1, max: 30, step: 1, suffix: "e année" },
  ],
  defaultValues: { valeurOrigine: 30000, duree: 5, annee: 1 },
  intro: "L'amortissement linéaire répartit la valeur d'un actif de façon constante sur sa durée d'utilisation.",
  howTitle: "Formule linéaire",
  howDetail: "Dotation annuelle = valeur d'origine / durée. Valeur nette comptable = origine − (dotation × années écoulées).",
  faqItems: [
    { question: "Quand commence l'amortissement ?", answer: "À la mise en service du bien, prorata temporis la première année." },
    { question: "Quelle durée pour un véhicule ?", answer: "En général 4 à 5 ans pour un véhicule utilitaire, plafonné fiscalement pour les VP." },
    { question: "Immobilisation ≤ 500 € HT ?", answer: "Peut être comptabilisée en charge directe si option de minimis ou selon seuil interne." },
    { question: "Différence comptable et fiscale ?", answer: "L'amortissement comptable peut différer du fiscale (amortissements dérogatoires)." },
  ],
  calculate(input) {
    const origine = num(input.valeurOrigine);
    const duree = num(input.duree);
    const annee = num(input.annee);
    const dotation = origine / duree;
    const cumul = dotation * Math.min(annee, duree);
    const vnc = origine - cumul;
    return {
      summary: `Dotation annuelle : ${formatCurrency(dotation)} — VNC après ${annee} an(s) : ${formatCurrency(vnc)}.`,
      lines: [
        { label: "Dotation annuelle", value: formatCurrency(dotation), highlight: true },
        { label: "Valeur nette comptable", value: formatCurrency(vnc), highlight: true },
        { label: "Amortissements cumulés", value: formatCurrency(cumul) },
        { label: "Valeur d'origine", value: formatCurrency(origine) },
      ],
    };
  },
});

const amortissementDegressif = createDraft({
  slug: "simulateur-amortissement-degressif",
  title: "Amortissement dégressif",
  shortDescription: "Calculez la dotation en amortissement dégressif fiscal (coefficient 1,25 à 2,25).",
  metaTitle: "Simulateur amortissement dégressif — Dotation fiscale",
  metaDescription: "Estimez l'amortissement dégressif fiscal : coefficient selon la durée et dotation de la première année.",
  keywords: ["amortissement dégressif", "amortissement fiscal accéléré", "coefficient dégressif"],
  category: "entreprise-gestion",
  icon: "calculator",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-amortissement-lineaire", "simulateur-bilan-simplifie"],
  formFields: [
    { key: "valeurOrigine", label: "Valeur d'origine", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "duree", label: "Durée d'amortissement", type: "number", min: 3, max: 10, step: 1, suffix: "ans" },
  ],
  defaultValues: { valeurOrigine: 50000, duree: 5 },
  intro: "L'amortissement dégressif accélère les dotations en début de cycle de vie du bien (biens éligibles uniquement).",
  howTitle: "Coefficient dégressif",
  howDetail: "Taux dégressif = taux linéaire × coefficient (1,25 à 2,25 selon durée). Passage au linéaire quand dotation dégressive < linéaire.",
  faqItems: [
    { question: "Quels biens sont éligibles ?", answer: "Biens d'équipement neufs à durée ≥ 3 ans, entreprises réalisant des bénéfices imposables." },
    { question: "Dégressif ou linéaire ?", answer: "Le dégressif est avantageux fiscalement en début de période si vous avez des bénéfices à réduire." },
    { question: "Option irrévocable ?", answer: "L'option pour le dégressif est exercée bien par bien à la date d'acquisition." },
    { question: "Plafond véhicule de tourisme ?", answer: "Amortissement fiscal plafonné à 9 900 € (18 300 € véhicule propre) sur 5 ans." },
  ],
  calculate(input) {
    const origine = num(input.valeurOrigine);
    const duree = num(input.duree);
    const tauxLin = 1 / duree;
    const coeff = duree <= 4 ? 1.5 : duree <= 6 ? 1.75 : 2.25;
    const tauxDeg = tauxLin * coeff;
    const dotation1 = origine * tauxDeg;
    const dotationLin = origine / duree;
    return {
      summary: `1re dotation dégressive : ${formatCurrency(dotation1)} (linéaire : ${formatCurrency(dotationLin)}).`,
      lines: [
        { label: "Dotation dégressive (an 1)", value: formatCurrency(dotation1), highlight: true },
        { label: "Dotation linéaire équivalente", value: formatCurrency(dotationLin) },
        { label: "Taux dégressif", value: formatPercent(tauxDeg * 100, 1) },
        { label: "Coefficient", value: formatNumber(coeff, 2) },
      ],
    };
  },
});

const provisionConges = createDraft({
  slug: "simulateur-provision-conges",
  title: "Provision congés payés",
  shortDescription: "Estimez la provision comptable pour congés payés non pris.",
  metaTitle: "Simulateur provision congés payés — Charge sociale",
  metaDescription: "Calculez la provision pour congés payés : salaires, charges patronales et jours de CP restants.",
  keywords: ["provision congés payés", "comptabilisation CP", "charge congés"],
  category: "entreprise-gestion",
  icon: "calculator",
  regulationIds: ["urssaf"],
  relatedSlugs: ["cout-total-embauche-salarie", "simulateur-charge-sociale-patronale-detail"],
  formFields: [
    { key: "salaireBrutMoyen", label: "Salaire brut mensuel moyen", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "joursCPRestants", label: "Jours de CP restants (ensemble salariés)", type: "number", min: 0, step: 1, suffix: "jours" },
    { key: "tauxCharges", label: "Charges patronales", type: "number", min: 30, max: 50, step: 1, suffix: "%" },
  ],
  defaultValues: { salaireBrutMoyen: 2500, joursCPRestants: 120, tauxCharges: COTISATIONS_PATRONALES_DEFAUT },
  intro: "L'employeur doit constituer une provision pour les congés payés acquis et non pris.",
  howTitle: "Calcul de la provision",
  howDetail: "Provision = (salaire brut + charges patronales) × (jours CP / 25 jours ouvrés par mois).",
  faqItems: [
    { question: "Pourquoi provisionner les CP ?", answer: "Obligation comptable (NEC) pour refléter la dette envers les salariés." },
    { question: "Inclut-on les charges sociales ?", answer: "Oui, la provision inclut salaires bruts et charges patronales afférentes." },
    { question: "Quand doter la provision ?", answer: "À chaque clôture comptable, au prorata des CP acquis et non pris." },
    { question: "Provision et paiement des CP ?", answer: "La provision est reprise au moment du paiement effectif des congés au salarié." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrutMoyen);
    const jours = num(input.joursCPRestants);
    const taux = num(input.tauxCharges) / 100;
    const coutJournalier = (brut * (1 + taux)) / 22;
    const provision = coutJournalier * jours;
    return {
      summary: `Provision congés payés : ${formatCurrency(provision)}.`,
      lines: [
        { label: "Provision totale", value: formatCurrency(provision), highlight: true },
        { label: "Jours de CP restants", value: `${jours} jours` },
        { label: "Coût journalier chargé", value: formatCurrency(coutJournalier) },
        { label: "Salaire brut moyen", value: formatCurrency(brut) },
      ],
    };
  },
});

const chargeSocialePatronaleDetail = createDraft({
  slug: "simulateur-charge-sociale-patronale-detail",
  title: "Charges patronales détaillées",
  shortDescription: "Décomposez les charges patronales par grand poste (maladie, retraite, famille…).",
  metaTitle: "Simulateur charges patronales détaillées — Ventilation URSSAF",
  metaDescription: "Ventilez les charges patronales par poste : maladie, vieillesse, famille, chômage, retraite complémentaire.",
  keywords: ["charges patronales détail", "ventilation URSSAF", "coût employeur détaillé"],
  category: "entreprise-gestion",
  icon: "percent",
  regulationIds: ["urssaf"],
  relatedSlugs: ["cout-total-embauche-salarie", "simulateur-provision-conges"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { salaireBrut: 3000 },
  intro: "Les charges patronales regroupent de nombreuses cotisations sociales obligatoires.",
  howTitle: "Ventilation indicative",
  howDetail: "Répartition approximative : maladie ~13 %, vieillesse ~10 %, famille ~5 %, chômage ~4 %, autres ~10 % (sur assiette brute).",
  faqItems: [
    { question: "Pourquoi ~42 % en moyenne ?", answer: "La somme des taux légaux et conventionnels aboutit à environ 42 % du brut pour un non-cadre." },
    { question: "Varie-t-on selon le statut ?", answer: "Oui, les cadres ont des taux de retraite complémentaire plus élevés." },
    { question: "Réduction Fillon ?", answer: "Allège les cotisations patronales sur les bas et moyens salaires — non simulée ici." },
    { question: "Taxe d'apprentissage incluse ?", answer: "Oui, elle fait partie des contributions patronales au titre de la formation." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const postes = [
      { label: "Maladie / maternité / invalidité", taux: 13 },
      { label: "Vieillesse plafonnée + déplafonnée", taux: 10 },
      { label: "Allocations familiales", taux: 5 },
      { label: "Assurance chômage", taux: 4 },
      { label: "Retraite complémentaire + autres", taux: 10 },
    ];
    const total = brut * (COTISATIONS_PATRONALES_DEFAUT / 100);
    const lines = postes.map((poste) => ({
      label: poste.label,
      value: formatCurrency(brut * (poste.taux / 100)),
    }));
    return {
      summary: `Charges patronales totales : ${formatCurrency(total)}/mois (${formatPercent(COTISATIONS_PATRONALES_DEFAUT, 0)}).`,
      lines: [
        { label: "Total charges patronales", value: formatCurrency(total), highlight: true },
        ...lines,
        { label: "Coût employeur total", value: formatCurrency(brut + total), highlight: true },
      ],
    };
  },
});

const tjmPortageSalarial = createDraft({
  slug: "simulateur-tjm-portage-salarial",
  title: "TJM portage salarial",
  shortDescription: "Estimez le TJM minimum en portage salarial pour atteindre un net mensuel cible.",
  metaTitle: "Simulateur TJM portage salarial — Net après frais de gestion",
  metaDescription: "Calculez le TJM en portage salarial pour obtenir un salaire net cible après frais de gestion et charges.",
  keywords: ["TJM portage salarial", "portage salarial simulation", "calcul portage"],
  category: "independant",
  icon: "briefcase",
  regulationIds: ["urssaf"],
  relatedSlugs: ["calculateur-tjm-freelance", "revenu-net-independant"],
  formFields: [
    { key: "netMensuelCible", label: "Net mensuel visé", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "joursMois", label: "Jours facturés par mois", type: "number", min: 1, max: 22, step: 1, suffix: "jours" },
    { key: "fraisGestion", label: "Frais de gestion portage", type: "number", min: 5, max: 15, step: 0.5, suffix: "%" },
  ],
  defaultValues: { netMensuelCible: 4000, joursMois: 18, fraisGestion: 10 },
  intro: "En portage salarial, le consultant facture via une société de portage qui convertit le CA en salaire.",
  howTitle: "Conversion CA → net",
  howDetail: "CA nécessaire = net cible / (ratio net/CA × (1 − frais gestion)). Ratio net/CA indicatif ~75 %.",
  faqItems: [
    { question: "Quels frais de gestion ?", answer: "En général 5 à 10 % du CA, plus les frais professionnels remboursés." },
    { question: "Portage ou micro-entreprise ?", answer: "Le portage offre le statut salarié (chômage, retraite) mais coûte plus cher." },
    { question: "Frais professionnels en portage ?", answer: "Remboursables sur justificatifs : transport, repas, matériel — selon barème de la société." },
    { question: "Congés payés en portage ?", answer: "Oui, le statut salarié ouvre droit aux CP calculés sur le salaire brut porté." },
  ],
  calculate(input) {
    const net = num(input.netMensuelCible);
    const jours = num(input.joursMois);
    const frais = num(input.fraisGestion) / 100;
    const caMensuel = net / (PORTAGE_NET_CA_RATIO * (1 - frais));
    const tjm = caMensuel / jours;
    return {
      summary: `TJM minimum : ${formatCurrency(tjm)}/jour (${formatCurrency(caMensuel)} CA/mois).`,
      lines: [
        { label: "TJM recommandé", value: formatCurrency(tjm), highlight: true },
        { label: "CA mensuel nécessaire", value: formatCurrency(caMensuel), highlight: true },
        { label: "Net mensuel visé", value: formatCurrency(net) },
        { label: "Jours facturés", value: `${jours} jours` },
      ],
    };
  },
});

const autoEntrepreneurPlafond = createDraft({
  slug: "simulateur-auto-entrepreneur-plafond",
  title: "Auto-entrepreneur — plafonds CA",
  shortDescription: "Vérifiez le respect des plafonds de chiffre d'affaires micro-entreprise.",
  metaTitle: "Simulateur plafond auto-entrepreneur — Micro-entreprise 2025",
  metaDescription: "Vérifiez les plafonds de CA auto-entrepreneur : vente 77 700 €, prestations 188 700 € et seuil majoré.",
  keywords: ["plafond auto-entrepreneur", "micro-entreprise plafond CA", "seuil micro-entrepreneur"],
  category: "independant",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["micro-entrepreneur-charges", "revenu-net-independant"],
  formFields: [
    { key: "caAnnuel", label: "Chiffre d'affaires annuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "activite", label: "Type d'activité", type: "select", options: [{ value: "vente", label: "Vente de marchandises" }, { value: "prestations", label: "Prestations de services" }] },
  ],
  defaultValues: { caAnnuel: 65000, activite: "prestations" },
  intro: "La micro-entreprise impose des plafonds de chiffre d'affaires annuel selon le type d'activité.",
  howTitle: "Plafonds 2025",
  howDetail: "Vente : 77 700 €. Prestations : 188 700 €. Dépassement = changement de régime ou franchise majorée temporaire.",
  faqItems: [
    { question: "Que se passe-t-il si je dépasse ?", answer: "Franchise majorée de 25 % la 1re année de dépassement, puis bascule en régime réel l'année suivante." },
    { question: "Peut-on cumuler deux activités ?", answer: "Oui, avec des plafonds distincts par catégorie d'activité." },
    { question: "Franchise TVA micro-entreprise ?", answer: "Exonération de TVA sous plafonds de CA — au-delà, assujettissement obligatoire." },
    { question: "Changer de régime sans dépasser ?", answer: "Option pour le régime réel possible à tout moment, avec effet au 1er janvier suivant." },
  ],
  calculate(input) {
    const ca = num(input.caAnnuel);
    const activite = String(input.activite);
    const plafond = activite === "vente" ? MICRO_ENTREPRENEUR_PLAFONDS.vente : MICRO_ENTREPRENEUR_PLAFONDS.prestations;
    const marge = plafond - ca;
    const pct = (ca / plafond) * 100;
    const conforme = ca <= plafond;
    return {
      summary: conforme
        ? `CA dans les plafonds — marge restante : ${formatCurrency(marge)} (${formatPercent(100 - pct, 0)}).`
        : `Plafond dépassé de ${formatCurrency(-marge)} — changement de régime à prévoir.`,
      lines: [
        { label: "Plafond applicable", value: formatCurrency(plafond), highlight: true },
        { label: "CA annuel", value: formatCurrency(ca) },
        { label: "Taux d'utilisation", value: formatPercent(pct, 0) },
        { label: "Conformité", value: conforme ? "Dans les plafonds" : "Dépassement" },
      ],
    };
  },
});

const zfuCrea = createDraft({
  slug: "simulateur-zfu-crea",
  title: "ZFU — exonération CREA",
  shortDescription: "Estimez l'exonération de charges en Zone Franche Urbaine (ZFU-TE).",
  metaTitle: "Simulateur ZFU CREA — Exonération zone franche",
  metaDescription: "Calculez l'exonération de cotisations patronales en ZFU-TE pour une création ou reprise d'entreprise.",
  keywords: ["ZFU", "zone franche urbaine", "exonération charges ZFU"],
  category: "entreprise-gestion",
  icon: "building",
  regulationIds: ["urssaf", "fiscalite"],
  relatedSlugs: ["exoneration-acre", "simulateur-jei-fiscalite"],
  formFields: [
    { key: "masseSalariale", label: "Masse salariale brute annuelle", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "anneeExoneration", label: "Année d'exonération (1 à 5)", type: "number", min: 1, max: 5, step: 1, suffix: "e année" },
  ],
  defaultValues: { masseSalariale: 120000, anneeExoneration: 1 },
  intro: "Les entreprises créées en ZFU-TE bénéficient d'exonérations de cotisations patronales pendant 5 ans.",
  howTitle: "Exonération ZFU",
  howDetail: "Exonération totale année 1, puis dégressive sur 5 ans pour les embauches de résidents ZFU.",
  faqItems: [
    { question: "Quelles conditions pour la ZFU ?", answer: "Création ou reprise en ZFU-TE, embauche de résidents du quartier, activité éligible." },
    { question: "Cumul avec l'ACRE ?", answer: "Non cumulable avec l'ACRE pour le même salarié." },
    { question: "Durée totale de l'exonération ?", answer: "5 ans au total, avec un taux dégressif après la 1re année d'exonération totale." },
    { question: "Toutes les embauches éligibles ?", answer: "Uniquement les salariés résidant dans la zone et embauchés en CDI ou CDD ≥ 12 mois." },
  ],
  calculate(input) {
    const masse = num(input.masseSalariale);
    const annee = num(input.anneeExoneration);
    const tauxExo = annee === 1 ? 1 : annee === 2 ? 0.8 : annee === 3 ? 0.6 : annee === 4 ? 0.4 : 0.2;
    const charges = masse * (COTISATIONS_PATRONALES_DEFAUT / 100);
    const exoneration = charges * tauxExo * ZFU_EXONERATION_CHARGES;
    return {
      summary: `Exonération ZFU estimée (an ${annee}) : ${formatCurrency(exoneration)}/an.`,
      lines: [
        { label: "Exonération estimée", value: formatCurrency(exoneration), highlight: true },
        { label: "Charges patronales sans ZFU", value: formatCurrency(charges) },
        { label: "Taux d'exonération", value: formatPercent(tauxExo * 100, 0) },
        { label: "Masse salariale", value: formatCurrency(masse) },
      ],
    };
  },
});

const jeiFiscalite = createDraft({
  slug: "simulateur-jei-fiscalite",
  title: "JEI — exonération fiscale",
  shortDescription: "Estimez l'exonération d'impôt sur les sociétés pour une Jeune Entreprise Innovante.",
  metaTitle: "Simulateur JEI fiscalité — Exonération IS et charges",
  metaDescription: "Calculez l'exonération d'IS et de charges patronales pour une Jeune Entreprise Innovante (JEI).",
  keywords: ["JEI", "jeune entreprise innovante", "exonération JEI"],
  category: "entreprise-gestion",
  icon: "chart",
  regulationIds: ["fiscalite", "impot"],
  relatedSlugs: ["simulateur-zfu-crea", "simulateur-eurl-is"],
  formFields: [
    { key: "beneficeImposable", label: "Bénéfice imposable", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "anneeJEI", label: "Année JEI (1 à 8)", type: "number", min: 1, max: 8, step: 1, suffix: "e année" },
  ],
  defaultValues: { beneficeImposable: 150000, anneeJEI: 2 },
  intro: "La JEI bénéficie d'exonérations d'IS et de charges patronales sur les chercheurs pendant 8 ans.",
  howTitle: "Exonération IS JEI",
  howDetail: "Exonération totale d'IS les 2 premières années profitables, puis dégressive sur les 6 suivantes.",
  faqItems: [
    { question: "Comment obtenir le statut JEI ?", answer: "PME < 8 ans, indépendante, dépenses R&D ≥ 15 % des charges, activité innovante." },
    { question: "Exonération sur les salaires ?", answer: "Oui, exonération de charges patronales sur les chercheurs et techniciens de recherche." },
    { question: "Durée maximale du statut JEI ?", answer: "8 ans à compter de la création, sous réserve du maintien des conditions." },
    { question: "Cumul JEI et CIR ?", answer: "Oui, le crédit impôt recherche est cumulable avec les exonérations JEI." },
  ],
  calculate(input) {
    const benefice = num(input.beneficeImposable);
    const annee = num(input.anneeJEI);
    const tauxExoIS = annee <= 2 ? JEI_EXONERATION_IS : annee <= 4 ? 0.75 : annee <= 6 ? 0.5 : annee <= 8 ? 0.25 : 0;
    const isNormal = benefice * IS_TAUX_NORMAL;
    const isDu = isNormal * (1 - tauxExoIS);
    const economie = isNormal - isDu;
    return {
      summary: `IS dû : ${formatCurrency(isDu)} — économie JEI : ${formatCurrency(economie)} (an ${annee}).`,
      lines: [
        { label: "IS après exonération", value: formatCurrency(isDu), highlight: true },
        { label: "Économie d'IS", value: formatCurrency(economie), highlight: true },
        { label: "IS sans JEI", value: formatCurrency(isNormal) },
        { label: "Taux d'exonération IS", value: formatPercent(tauxExoIS * 100, 0) },
      ],
    };
  },
});

const icpeEntreprise = createDraft({
  slug: "simulateur-icpe-entreprise",
  title: "ICPE — coût entreprise",
  shortDescription: "Estimez les coûts de mise en conformité ICPE (Installations Classées).",
  metaTitle: "Simulateur ICPE entreprise — Coût conformité",
  metaDescription: "Estimez les coûts de dossier ICPE, études d'impact et investissements pour une installation classée.",
  keywords: ["ICPE", "installation classée", "coût ICPE entreprise"],
  category: "entreprise-gestion",
  icon: "tools",
  relatedSlugs: ["simulateur-bilan-simplifie", "break-even-entreprise"],
  formFields: [
    { key: "regime", label: "Régime ICPE", type: "select", options: [{ value: "declaration", label: "Déclaration" }, { value: "enregistrement", label: "Enregistrement" }, { value: "autorisation", label: "Autorisation" }] },
    { key: "investissement", label: "Investissement conformité", type: "number", min: 0, step: 5000, suffix: "€" },
  ],
  defaultValues: { regime: "enregistrement", investissement: 50000 },
  intro: "Les ICPE imposent des formalités et investissements selon la dangerosité de l'activité.",
  howTitle: "Coûts par régime",
  howDetail: "Déclaration : faible. Enregistrement : étude ~5-15 k€. Autorisation : étude + investissements lourds.",
  faqItems: [
    { question: "Mon activité est-elle soumise ?", answer: "Consultez la nomenclature ICPE selon vos substances et seuils (rubriques 1000+)." },
    { question: "Qui instruit le dossier ?", answer: "La DREAL ou la DRIEAT selon la région, délais de 2 à 12 mois." },
    { question: "Déclaration vs autorisation ?", answer: "Le régime dépend des seuils de substances et de la dangerosité de l'activité." },
    { question: "Contrôles après ouverture ?", answer: "Inspections régulières par l'administration ; non-conformité = mise en demeure ou fermeture." },
  ],
  calculate(input) {
    const regime = String(input.regime);
    const invest = num(input.investissement);
    const fraisDossier = regime === "declaration" ? 500 : regime === "enregistrement" ? 8000 : 25000;
    const total = fraisDossier + invest;
    return {
      summary: `Coût total ICPE estimé : ${formatCurrency(total)} (dossier : ${formatCurrency(fraisDossier)}).`,
      lines: [
        { label: "Coût total estimé", value: formatCurrency(total), highlight: true },
        { label: "Frais de dossier", value: formatCurrency(fraisDossier) },
        { label: "Investissements", value: formatCurrency(invest) },
        { label: "Régime", value: regime === "declaration" ? "Déclaration" : regime === "enregistrement" ? "Enregistrement" : "Autorisation" },
      ],
    };
  },
});

const bilanSimplifie = createDraft({
  slug: "simulateur-bilan-simplifie",
  title: "Bilan simplifié",
  shortDescription: "Calculez les ratios clés d'un bilan simplifié (liquidité, endettement, rentabilité).",
  metaTitle: "Simulateur bilan simplifié — Ratios financiers",
  metaDescription: "Analysez un bilan simplifié : fonds de roulement, ratio d'endettement et rentabilité nette.",
  keywords: ["bilan simplifié", "ratios financiers", "analyse bilan entreprise"],
  category: "entreprise-gestion",
  icon: "chart",
  relatedSlugs: ["break-even-entreprise", "simulateur-amortissement-lineaire"],
  formFields: [
    { key: "actifCirculant", label: "Actif circulant", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "passifCirculant", label: "Dettes à court terme", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "dettesLT", label: "Dettes à long terme", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "capitauxPropres", label: "Capitaux propres", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "resultatNet", label: "Résultat net", type: "number", min: -100000, step: 1000, suffix: "€" },
  ],
  defaultValues: { actifCirculant: 150000, passifCirculant: 80000, dettesLT: 50000, capitauxPropres: 120000, resultatNet: 25000 },
  intro: "Les ratios financiers permettent d'analyser rapidement la santé d'une entreprise à partir de son bilan.",
  howTitle: "Ratios clés",
  howDetail: "FDR = actif circulant − dettes CT. Endettement = dettes LT / capitaux propres. Rentabilité = résultat / capitaux propres.",
  faqItems: [
    { question: "Qu'est-ce que le fonds de roulement ?", answer: "Excédent d'actif circulant sur dettes court terme — mesure la liquidité." },
    { question: "Un ratio d'endettement élevé est-il mauvais ?", answer: "Au-delà de 100 %, l'endettement dépasse les fonds propres — vigilance des banques." },
    { question: "BFR (besoin en fonds de roulement) ?", answer: "Stock + créances − dettes fournisseurs — complète l'analyse du FDR." },
    { question: "Seuil de liquidité générale ?", answer: "Un ratio actif circulant / dettes CT ≥ 1,5 est généralement considéré sain." },
  ],
  calculate(input) {
    const ac = num(input.actifCirculant);
    const dct = num(input.passifCirculant);
    const dlt = num(input.dettesLT);
    const cp = num(input.capitauxPropres);
    const rn = num(input.resultatNet);
    const fdr = ac - dct;
    const endettement = cp > 0 ? (dlt / cp) * 100 : 0;
    const rentabilite = cp > 0 ? (rn / cp) * 100 : 0;
    return {
      summary: `FDR : ${formatCurrency(fdr)} — endettement : ${formatPercent(endettement, 0)} — rentabilité : ${formatPercent(rentabilite, 1)}.`,
      lines: [
        { label: "Fonds de roulement", value: formatCurrency(fdr), highlight: true },
        { label: "Ratio d'endettement", value: formatPercent(endettement, 0) },
        { label: "Rentabilité des capitaux propres", value: formatPercent(rentabilite, 1) },
        { label: "Résultat net", value: formatCurrency(rn) },
      ],
    };
  },
});

export const entrepriseDrafts: SimulatorDefinition[] = [
  eurlIs,
  sarlDividendes,
  holdingFiscalite,
  tvaIntracommunautaire,
  cvae,
  cfe,
  divisionOptimaleRemuneration,
  amortissementLineaire,
  amortissementDegressif,
  provisionConges,
  chargeSocialePatronaleDetail,
  tjmPortageSalarial,
  autoEntrepreneurPlafond,
  zfuCrea,
  jeiFiscalite,
  icpeEntreprise,
  bilanSimplifie,
];
