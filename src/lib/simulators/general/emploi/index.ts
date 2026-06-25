import type { SimulatorDefinition } from "../../types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, p } from "../../_shared/content-builder";
import {
  brutToNetMensuel,
  netToBrutMensuel,
  coutEmployeurMensuel,
  indemniteLicenciementLegale,
  ijssJournaliere,
  areJournaliere,
  SMIC_HORAIRE_2025,
  HEURES_LEGALES_SEMAINE,
} from "../../_shared/payroll";
import {
  COTISATIONS_SALARIALES_DEFAUT,
  COTISATIONS_PATRONALES_DEFAUT,
  JOURS_CONGES_PAR_MOIS,
  HEURES_SUP_SEUIL_25,
  HEURES_SUP_MAJORATION_25,
  HEURES_SUP_MAJORATION_50,
  ARE_TAUX_JOURNALIER,
} from "@/lib/config/urssaf";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

const placeholderContent = (intro: string) =>
  buildContent({
    intro,
    howItWorks: [{ title: "Calcul", blocks: [p("Contenu détaillé disponible sur la page.")] }],
    conseils: ["Vérifiez vos bulletins de paie pour une estimation exacte."],
    limites: ["Estimation indicative — ne remplace pas un expert-comptable ou la paie officielle."],
  });

const placeholderFaq = buildFaq([
  { question: "Ce simulateur est-il fiable ?", answer: "Il fournit une estimation simplifiée à visée pédagogique." },
]);

export const salaireBrutNet: SimulatorDefinition = {
  slug: "salaire-brut-net",
  title: "Salaire brut net",
  shortDescription:
    "Convertissez un salaire brut mensuel en net avant impôt selon les cotisations sociales salariales.",
  metaTitle: "Simulateur salaire brut net — Calcul gratuit en ligne",
  metaDescription:
    "Calculez votre salaire net à partir du brut mensuel : cotisations sociales, CSG/CRDS. Estimateur gratuit pour salariés.",
  keywords: ["salaire brut net", "calcul brut net", "simulateur salaire", "convertir brut en net"],
  domain: "emploi",
  category: "salaire",
  icon: "briefcase",
  relatedSlugs: ["salaire-net-brut", "cout-total-embauche-salarie", "prelevement-a-la-source", "smic-net"],
  formFields: [
    { key: "brut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxCotisations", label: "Cotisations salariales", type: "number", min: 15, max: 30, step: 0.5, suffix: "%", hint: "Environ 22 % pour un non-cadre" },
  ],
  defaultValues: { brut: 2500, tauxCotisations: COTISATIONS_SALARIALES_DEFAUT },
  content: placeholderContent("Estimez le salaire net perçu sur votre compte avant prélèvement à la source."),
  faq: placeholderFaq,
  calculate(input) {
    const brut = num(input.brut);
    const taux = num(input.tauxCotisations);
    const net = brutToNetMensuel(brut, taux);
    const cotisations = brut - net;
    return {
      summary: `Salaire net estimé : ${formatCurrency(net)}/mois (brut : ${formatCurrency(brut)}).`,
      lines: [
        { label: "Salaire net avant impôt", value: formatCurrency(net), highlight: true },
        { label: "Salaire brut", value: formatCurrency(brut) },
        { label: "Cotisations + CSG/CRDS", value: formatCurrency(cotisations) },
        { label: "Taux de prélèvements", value: formatPercent((cotisations / brut) * 100, 1) },
        { label: "Net annuel estimé", value: formatCurrency(net * 12) },
      ],
    };
  },
};

export const salaireNetBrut: SimulatorDefinition = {
  slug: "salaire-net-brut",
  title: "Salaire net brut",
  shortDescription:
    "Calculez le salaire brut à partir du net souhaité pour négocier une augmentation ou une embauche.",
  metaTitle: "Simulateur salaire net en brut — Calcul inverse gratuit",
  metaDescription:
    "Convertissez un salaire net en brut mensuel : utile pour une négociation salariale ou une simulation d'embauche.",
  keywords: ["salaire net en brut", "calcul net brut", "convertir net en brut", "simulateur salaire inverse"],
  domain: "emploi",
  category: "salaire",
  icon: "briefcase",
  relatedSlugs: ["salaire-brut-net", "cout-total-embauche-salarie", "salaire-temps-partiel", "capacite-emprunt"],
  formFields: [
    { key: "net", label: "Salaire net mensuel visé", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxCotisations", label: "Cotisations salariales", type: "number", min: 15, max: 30, step: 0.5, suffix: "%" },
  ],
  defaultValues: { net: 2000, tauxCotisations: COTISATIONS_SALARIALES_DEFAUT },
  content: placeholderContent("Déterminez le brut à afficher sur un contrat pour obtenir le net souhaité."),
  faq: placeholderFaq,
  calculate(input) {
    const net = num(input.net);
    const taux = num(input.tauxCotisations);
    const brut = netToBrutMensuel(net, taux);
    const netVerifie = brutToNetMensuel(brut, taux);
    return {
      summary: `Salaire brut nécessaire : ${formatCurrency(brut)}/mois pour ${formatCurrency(net)} net.`,
      lines: [
        { label: "Salaire brut estimé", value: formatCurrency(brut), highlight: true },
        { label: "Net recalculé", value: formatCurrency(netVerifie), highlight: true },
        { label: "Net visé", value: formatCurrency(net) },
        { label: "Brut annuel", value: formatCurrency(brut * 12) },
        { label: "Cotisations salariales", value: formatPercent(taux, 1) },
      ],
    };
  },
};

export const coutTotalEmbauche: SimulatorDefinition = {
  slug: "cout-total-embauche-salarie",
  title: "Coût total d'embauche",
  shortDescription:
    "Estimez le coût mensuel et annuel total d'un salarié incluant les charges patronales.",
  metaTitle: "Simulateur coût total embauche salarié — Charges patronales",
  metaDescription:
    "Calculez le coût réel d'embauche : salaire brut + charges patronales (~42 %). Outil gratuit pour employeurs et TPE.",
  keywords: ["coût embauche salarié", "charges patronales", "coût employeur", "simulateur masse salariale"],
  domain: "emploi",
  category: "salaire",
  icon: "building",
  relatedSlugs: ["salaire-brut-net", "salaire-net-brut", "micro-entrepreneur-charges", "break-even-entreprise"],
  formFields: [
    { key: "brut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxPatronal", label: "Charges patronales", type: "number", min: 30, max: 50, step: 1, suffix: "%", hint: "Environ 42 % en moyenne" },
  ],
  defaultValues: { brut: 2500, tauxPatronal: COTISATIONS_PATRONALES_DEFAUT },
  content: placeholderContent("Visualisez le coût total supporté par l'employeur au-delà du salaire brut."),
  faq: placeholderFaq,
  calculate(input) {
    const brut = num(input.brut);
    const taux = num(input.tauxPatronal);
    const cout = coutEmployeurMensuel(brut, taux);
    const charges = cout - brut;
    return {
      summary: `Coût employeur : ${formatCurrency(cout)}/mois (${formatCurrency(cout * 12)}/an).`,
      lines: [
        { label: "Coût mensuel total", value: formatCurrency(cout), highlight: true },
        { label: "Coût annuel total", value: formatCurrency(cout * 12), highlight: true },
        { label: "Salaire brut", value: formatCurrency(brut) },
        { label: "Charges patronales", value: formatCurrency(charges) },
        { label: "Taux patronal appliqué", value: formatPercent(taux, 0) },
      ],
    };
  },
};

export const indemnitesLicenciement: SimulatorDefinition = {
  slug: "indemnites-licenciement",
  title: "Indemnités de licenciement",
  shortDescription:
    "Estimez l'indemnité légale minimale de licenciement selon l'ancienneté et le salaire brut.",
  metaTitle: "Simulateur indemnités licenciement — Calcul légal",
  metaDescription:
    "Calculez l'indemnité légale de licenciement : ancienneté, salaire de référence. Estimation gratuite hors cas particuliers.",
  keywords: ["indemnité licenciement", "calcul licenciement", "simulateur licenciement", "indemnité légale"],
  domain: "emploi",
  category: "social",
  icon: "scale",
  relatedSlugs: ["salaire-brut-net", "allocation-chomage-are", "conges-payes-acquis", "budget-reste-a-vivre"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel de référence", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "anciennete", label: "Ancienneté", type: "number", min: 0, max: 40, step: 0.5, suffix: "ans" },
  ],
  defaultValues: { salaireBrut: 2800, anciennete: 5 },
  content: placeholderContent("Estimez le minimum légal dû en cas de licenciement pour insuffisance professionnelle ou motif économique."),
  faq: placeholderFaq,
  calculate(input) {
    const salaire = num(input.salaireBrut);
    const anc = num(input.anciennete);
    const indemnite = indemniteLicenciementLegale(salaire, anc);
    const moisIndemnite = salaire > 0 ? indemnite / salaire : 0;
    return {
      summary: `Indemnité légale estimée : ${formatCurrency(indemnite)} (${formatNumber(moisIndemnite, 1)} mois de salaire).`,
      lines: [
        { label: "Indemnité légale", value: formatCurrency(indemnite), highlight: true },
        { label: "Équivalent en mois", value: `${formatNumber(moisIndemnite, 2)} mois` },
        { label: "Salaire de référence", value: formatCurrency(salaire) },
        { label: "Ancienneté", value: `${anc} ans` },
        { label: "Rappel", value: anc < 0.67 ? "Non éligible (< 8 mois)" : "Minimum légal", description: "Convention collective ou accord d'entreprise peuvent prévoir plus" },
      ],
    };
  },
};

export const congesPayesAcquis: SimulatorDefinition = {
  slug: "conges-payes-acquis",
  title: "Congés payés acquis",
  shortDescription:
    "Calculez le nombre de jours ouvrables de congés payés acquis selon la durée travaillée.",
  metaTitle: "Simulateur congés payés acquis — Calcul jours CP",
  metaDescription:
    "Estimez vos congés payés acquis : 2,5 jours ouvrables par mois travaillé. Calculateur gratuit pour salariés.",
  keywords: ["congés payés acquis", "calcul congés", "simulateur congés", "jours CP"],
  domain: "emploi",
  category: "social",
  icon: "calculator",
  relatedSlugs: ["salaire-brut-net", "salaire-temps-partiel", "ijss-arret-maladie", "heures-supplementaires"],
  formFields: [
    { key: "moisTravailles", label: "Mois travaillés sur la période", type: "number", min: 0, max: 12, step: 0.5, suffix: "mois" },
    { key: "joursParMois", label: "Jours acquis par mois", type: "number", min: 2, max: 2.5, step: 0.1, suffix: "jours", hint: "2,5 jours ouvrables en droit commun" },
  ],
  defaultValues: { moisTravailles: 10, joursParMois: JOURS_CONGES_PAR_MOIS },
  content: placeholderContent("Comprenez combien de jours de congés vous avez acquis sur une période de référence."),
  faq: placeholderFaq,
  calculate(input) {
    const mois = num(input.moisTravailles);
    const jpm = num(input.joursParMois);
    const jours = mois * jpm;
    const semaines = jours / 6;
    return {
      summary: `Congés acquis : ${formatNumber(jours, 1)} jours ouvrables (${formatNumber(semaines, 1)} semaines).`,
      lines: [
        { label: "Jours ouvrables acquis", value: `${formatNumber(jours, 1)} jours`, highlight: true },
        { label: "Équivalent semaines", value: `${formatNumber(semaines, 1)} sem.` },
        { label: "Mois travaillés", value: `${mois} mois` },
        { label: "Taux d'acquisition", value: `${jpm} j/mois` },
        { label: "Plafond annuel courant", value: "30 jours ouvrables (5 sem.)" },
      ],
    };
  },
};

export const ijssArretMaladie: SimulatorDefinition = {
  slug: "ijss-arret-maladie",
  title: "IJSS arrêt maladie",
  shortDescription:
    "Estimez vos indemnités journalières Sécurité sociale en cas d'arrêt maladie.",
  metaTitle: "Simulateur IJSS arrêt maladie — Indemnités journalières",
  metaDescription:
    "Calculez vos IJSS en arrêt maladie : 50 % du salaire journalier, plafonnées. Estimation gratuite hors carence.",
  keywords: ["IJSS arrêt maladie", "indemnités journalières", "simulateur arrêt maladie", "sécurité sociale"],
  domain: "emploi",
  category: "social",
  icon: "heart",
  relatedSlugs: ["salaire-brut-net", "conges-payes-acquis", "allocation-chomage-are", "budget-reste-a-vivre"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "joursArret", label: "Jours d'arrêt (hors carence)", type: "number", min: 0, max: 365, step: 1, suffix: "jours" },
  ],
  defaultValues: { salaireBrut: 2500, joursArret: 15 },
  content: placeholderContent("Anticipez le montant versé par l'Assurance maladie pendant un arrêt de travail."),
  faq: placeholderFaq,
  calculate(input) {
    const brut = num(input.salaireBrut);
    const jours = num(input.joursArret);
    const ijssJour = ijssJournaliere(brut);
    const total = ijssJour * jours;
    const carence = 3;
    return {
      summary: `IJSS estimées : ${formatCurrency(ijssJour)}/jour — total ${formatCurrency(total)} sur ${jours} jours.`,
      lines: [
        { label: "IJSS journalière", value: formatCurrency(ijssJour), highlight: true },
        { label: "Total sur la période", value: formatCurrency(total), highlight: true },
        { label: "Jours indemnisés", value: `${jours} jours` },
        { label: "Carence standard", value: `${carence} jours`, description: "Non indemnisés par la Sécu" },
        { label: "Salaire brut de référence", value: formatCurrency(brut) },
      ],
    };
  },
};

export const allocationChomageAre: SimulatorDefinition = {
  slug: "allocation-chomage-are",
  title: "Allocation chômage ARE",
  shortDescription:
    "Estimez votre allocation chômage journalière (ARE) à partir de votre salaire de référence.",
  metaTitle: "Simulateur allocation chômage ARE — Estimation Pôle emploi",
  metaDescription:
    "Calculez une estimation de votre ARE (allocation chômage) : 57 % du salaire journalier de référence, plafonnée.",
  keywords: ["allocation chômage", "simulateur ARE", "Pôle emploi", "indemnisation chômage"],
  domain: "emploi",
  category: "social",
  icon: "wallet",
  relatedSlugs: ["indemnites-licenciement", "salaire-brut-net", "budget-reste-a-vivre", "ijss-arret-maladie"],
  formFields: [
    { key: "salaireBrutMensuel", label: "Dernier salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "joursIndemnises", label: "Jours indemnisés par mois", type: "number", min: 0, max: 31, step: 1, suffix: "jours", hint: "Environ 30 jours calendaires en pratique" },
  ],
  defaultValues: { salaireBrutMensuel: 2600, joursIndemnises: 30 },
  content: placeholderContent("Obtenez un ordre de grandeur de votre allocation France Travail avant la simulation officielle."),
  faq: placeholderFaq,
  calculate(input) {
    const brut = num(input.salaireBrutMensuel);
    const joursMois = num(input.joursIndemnises);
    const journalier = (brut * 12) / 365;
    const areJour = areJournaliere(journalier);
    const areMois = areJour * joursMois;
    return {
      summary: `ARE estimée : ${formatCurrency(areJour)}/jour — environ ${formatCurrency(areMois)}/mois.`,
      lines: [
        { label: "ARE journalière", value: formatCurrency(areJour), highlight: true },
        { label: "ARE mensuelle estimée", value: formatCurrency(areMois), highlight: true },
        { label: "Salaire journalier brut", value: formatCurrency(journalier) },
        { label: "Taux appliqué", value: `${formatPercent(ARE_TAUX_JOURNALIER * 100, 0)} (simplifié)` },
        { label: "Durée d'indemnisation", value: "Variable selon l'ancienneté", description: "Consultez France Travail pour le détail" },
      ],
    };
  },
};

export const heuresSupplementaires: SimulatorDefinition = {
  slug: "heures-supplementaires",
  title: "Heures supplémentaires",
  shortDescription:
    "Calculez la rémunération des heures supplémentaires avec majorations 25 % et 50 %.",
  metaTitle: "Simulateur heures supplémentaires — Calcul majorations",
  metaDescription:
    "Estimez le montant de vos heures sup : majoration 25 % (8 premières heures) puis 50 %. Calculateur paie gratuit.",
  keywords: ["heures supplémentaires calcul", "majoration 25 50", "simulateur heures sup", "salaire heures sup"],
  domain: "emploi",
  category: "salaire",
  icon: "percent",
  relatedSlugs: ["salaire-brut-net", "salaire-temps-partiel", "smic-net", "conges-payes-acquis"],
  formFields: [
    { key: "tauxHoraireBrut", label: "Taux horaire brut", type: "number", min: 0, step: 0.1, suffix: "€/h" },
    { key: "heuresSup", label: "Heures supplémentaires du mois", type: "number", min: 0, max: 80, step: 0.5, suffix: "h" },
  ],
  defaultValues: { tauxHoraireBrut: 16, heuresSup: 10 },
  content: placeholderContent("Estimez le supplément de salaire lié aux heures travaillées au-delà de la durée légale."),
  faq: placeholderFaq,
  calculate(input) {
    const taux = num(input.tauxHoraireBrut);
    const heures = num(input.heuresSup);
    const h25 = Math.min(heures, HEURES_SUP_SEUIL_25);
    const h50 = Math.max(0, heures - HEURES_SUP_SEUIL_25);
    const montant25 = h25 * taux * HEURES_SUP_MAJORATION_25;
    const montant50 = h50 * taux * HEURES_SUP_MAJORATION_50;
    const total = montant25 + montant50;
    return {
      summary: `Rémunération heures sup : ${formatCurrency(total)} (${heures} h).`,
      lines: [
        { label: "Total heures sup", value: formatCurrency(total), highlight: true },
        { label: "Heures à 25 %", value: `${h25} h → ${formatCurrency(montant25)}` },
        { label: "Heures à 50 %", value: `${h50} h → ${formatCurrency(montant50)}` },
        { label: "Taux horaire brut", value: formatCurrency(taux) },
        { label: "Heures du mois", value: `${heures} h` },
      ],
    };
  },
};

export const salaireTempsPartiel: SimulatorDefinition = {
  slug: "salaire-temps-partiel",
  title: "Salaire temps partiel",
  shortDescription:
    "Estimez le salaire brut et net en temps partiel selon le nombre d'heures travaillées.",
  metaTitle: "Simulateur salaire temps partiel — Calcul prorata",
  metaDescription:
    "Calculez votre salaire en temps partiel : prorata des heures sur 35 h. Estimation brut et net gratuite.",
  keywords: ["salaire temps partiel", "calcul temps partiel", "simulateur mi-temps", "prorata salaire"],
  domain: "emploi",
  category: "salaire",
  icon: "calculator",
  relatedSlugs: ["salaire-brut-net", "heures-supplementaires", "smic-net", "budget-reste-a-vivre"],
  formFields: [
    { key: "brutTempsPlein", label: "Salaire brut temps plein (35 h)", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "heuresHebdo", label: "Heures travaillées par semaine", type: "number", min: 1, max: 35, step: 0.5, suffix: "h" },
    { key: "tauxCotisations", label: "Cotisations salariales", type: "number", min: 15, max: 30, step: 0.5, suffix: "%" },
  ],
  defaultValues: { brutTempsPlein: 2500, heuresHebdo: 24, tauxCotisations: COTISATIONS_SALARIALES_DEFAUT },
  content: placeholderContent("Proratisez un salaire temps plein selon votre volume horaire hebdomadaire."),
  faq: placeholderFaq,
  calculate(input) {
    const brutTP = num(input.brutTempsPlein);
    const heures = num(input.heuresHebdo);
    const taux = num(input.tauxCotisations);
    const ratio = heures / HEURES_LEGALES_SEMAINE;
    const brut = brutTP * ratio;
    const net = brutToNetMensuel(brut, taux);
    return {
      summary: `Salaire temps partiel : ${formatCurrency(brut)} brut — ${formatCurrency(net)} net (${heures} h/sem.).`,
      lines: [
        { label: "Salaire brut", value: formatCurrency(brut), highlight: true },
        { label: "Salaire net estimé", value: formatCurrency(net), highlight: true },
        { label: "Temps de travail", value: `${formatPercent(ratio * 100, 0)} du temps plein` },
        { label: "Heures hebdomadaires", value: `${heures} h / ${HEURES_LEGALES_SEMAINE} h` },
        { label: "Brut temps plein", value: formatCurrency(brutTP) },
      ],
    };
  },
};

export const smicNet: SimulatorDefinition = {
  slug: "smic-net",
  title: "SMIC net",
  shortDescription:
    "Calculez le salaire net mensuel correspondant au SMIC horaire en vigueur (35 h).",
  metaTitle: "Simulateur SMIC net — Salaire net au SMIC 2025",
  metaDescription:
    "Estimez le SMIC net mensuel à partir du SMIC horaire brut : cotisations sociales incluses. Calcul gratuit.",
  keywords: ["SMIC net", "salaire net SMIC", "SMIC 2025", "calcul SMIC net"],
  domain: "emploi",
  category: "salaire",
  icon: "percent",
  relatedSlugs: ["salaire-brut-net", "salaire-temps-partiel", "capacite-emprunt", "budget-reste-a-vivre"],
  formFields: [
    { key: "smicHoraire", label: "SMIC horaire brut", type: "number", min: 0, step: 0.01, suffix: "€/h" },
    { key: "heuresHebdo", label: "Heures hebdomadaires", type: "number", min: 1, max: 35, step: 1, suffix: "h" },
    { key: "tauxCotisations", label: "Cotisations salariales", type: "number", min: 15, max: 30, step: 0.5, suffix: "%" },
  ],
  defaultValues: { smicHoraire: SMIC_HORAIRE_2025, heuresHebdo: HEURES_LEGALES_SEMAINE, tauxCotisations: COTISATIONS_SALARIALES_DEFAUT },
  content: placeholderContent("Obtenez le net mensuel au SMIC pour comparer avec votre salaire ou vos aides."),
  faq: placeholderFaq,
  calculate(input) {
    const horaire = num(input.smicHoraire);
    const heures = num(input.heuresHebdo);
    const taux = num(input.tauxCotisations);
    const brut = horaire * heures * (52 / 12);
    const net = brutToNetMensuel(brut, taux);
    return {
      summary: `SMIC net estimé : ${formatCurrency(net)}/mois (brut : ${formatCurrency(brut)}).`,
      lines: [
        { label: "SMIC net mensuel", value: formatCurrency(net), highlight: true },
        { label: "SMIC brut mensuel", value: formatCurrency(brut), highlight: true },
        { label: "SMIC horaire brut", value: formatCurrency(horaire) },
        { label: "Heures hebdomadaires", value: `${heures} h` },
        { label: "SMIC net horaire", value: formatCurrency(net / (heures * (52 / 12))) },
      ],
    };
  },
};

export const emploiSimulators = [
  salaireBrutNet,
  salaireNetBrut,
  coutTotalEmbauche,
  indemnitesLicenciement,
  congesPayesAcquis,
  ijssArretMaladie,
  allocationChomageAre,
  heuresSupplementaires,
  salaireTempsPartiel,
  smicNet,
];
