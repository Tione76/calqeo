import type { SimulatorDefinition } from "../../types";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const calculateurImc: SimulatorDefinition = {
  slug: "calculateur-imc",
  title: "Calculateur IMC",
  shortDescription:
    "Calculez votre indice de masse corporelle (IMC) et interprétez le résultat.",
  metaTitle: "Calculateur IMC — Indice masse corporelle",
  metaDescription:
    "Calculez votre IMC (indice de masse corporelle) selon votre taille et poids. Interprétation OMS.",
  keywords: ["IMC", "indice masse corporelle", "calculateur IMC"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["poids-ideal", "calories-journalieres", "hydratation-quotidienne"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 20, max: 300, step: 0.5, suffix: "kg" },
    { key: "taille", label: "Taille", type: "number", min: 100, max: 250, step: 1, suffix: "cm" },
  ],
  defaultValues: { poids: 75, taille: 175 },
  content: buildContent({
    intro: "L'IMC est un indicateur simple pour évaluer si votre poids est adapté à votre taille.",
    howItWorks: [
      {
        title: "Formule",
        blocks: [
          p("IMC = Poids (kg) / Taille² (m). Interprétation OMS : < 18,5 insuffisance, 18,5-25 normal, 25-30 surpoids, > 30 obésité."),
          hl("Limites", "Ne tient pas compte de la masse musculaire ni de l'âge."),
        ],
      },
    ],
    example: { title: "75 kg, 175 cm", blocks: [p("IMC = 24,5 — corpulence normale.")] },
    conseils: ["Consultez un professionnel pour une évaluation complète.", "L'IMC seul ne suffit pas pour les sportifs.", "Combinez avec l'activité physique régulière."],
    limites: ["Non adapté aux enfants, seniors et femmes enceintes.", "Ne distingue pas muscle et graisse."],
  }),
  faq: buildFaq([
    { question: "IMC normal ?", answer: "Entre 18,5 et 24,9 selon l'OMS." },
    { question: "IMC et sportifs ?", answer: "Les sportifs musclés peuvent avoir un IMC élevé sans surpoids." },
    { question: "IMC enfants ?", answer: "Utilisez les courbes de croissance pédiatriques, pas l'IMC adulte." },
    { question: "Comment améliorer l'IMC ?", answer: "Équilibre alimentaire et activité physique régulière." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const tailleM = num(input.taille) / 100;
    const imc = tailleM > 0 ? poids / (tailleM * tailleM) : 0;
    let interpretation = "Normal";
    if (imc < 18.5) interpretation = "Insuffisance pondérale";
    else if (imc < 25) interpretation = "Corpulence normale";
    else if (imc < 30) interpretation = "Surpoids";
    else interpretation = "Obésité";
    return {
      summary: `IMC : ${formatNumber(imc, 1)} — ${interpretation}.`,
      lines: [
        { label: "IMC", value: formatNumber(imc, 1), highlight: true },
        { label: "Interprétation", value: interpretation, highlight: true },
        { label: "Poids", value: `${poids} kg` },
        { label: "Taille", value: `${num(input.taille)} cm` },
        { label: "Poids idéal (IMC 22)", value: `${formatNumber(22 * tailleM * tailleM, 1)} kg` },
      ],
    };
  },
};

export const poidsIdeal: SimulatorDefinition = {
  slug: "poids-ideal",
  title: "Poids idéal",
  shortDescription:
    "Estimez votre poids idéal selon différentes formules (Creff, Lorentz, IMC cible).",
  metaTitle: "Calculateur poids idéal — Formule Creff",
  metaDescription:
    "Calculez votre poids idéal selon la formule de Creff, Lorentz ou un IMC cible de 22.",
  keywords: ["poids idéal", "formule Creff", "poids santé"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["calculateur-imc", "calories-journalieres", "proteines-journalieres"],
  formFields: [
    { key: "taille", label: "Taille", type: "number", min: 100, max: 250, step: 1, suffix: "cm" },
    { key: "age", label: "Âge", type: "number", min: 15, max: 100, suffix: "ans" },
    {
      key: "sexe",
      label: "Sexe",
      type: "select",
      options: [
        { value: "homme", label: "Homme" },
        { value: "femme", label: "Femme" },
      ],
    },
  ],
  defaultValues: { taille: 170, age: 35, sexe: "homme" },
  content: buildContent({
    intro: "Le poids idéal varie selon la taille, l'âge et le sexe. Plusieurs formules existent.",
    howItWorks: [
      {
        title: "Formules",
        blocks: [
          p("Creff : (Taille − 100 + Âge/10) × 0,9 × facteur sexe. Lorentz : Taille − 100 − (Taille − 150)/4 (H) ou /2 (F)."),
          hl("Fourchette", "Un écart de ±5 kg est normal et sain."),
        ],
      },
    ],
    example: { title: "Homme 170 cm, 35 ans", blocks: [p("Poids idéal Creff : ~68 kg.")] },
    conseils: ["Visez un poids stable plutôt qu'un chiffre exact.", "La composition corporelle compte plus que le poids.", "Consultez un médecin pour un objectif personnalisé."],
    limites: ["Formules indicatives.", "Morphologie individuelle non prise en compte."],
  }),
  faq: buildFaq([
    { question: "Creff ou Lorentz ?", answer: "Creff intègre l'âge. Lorentz est plus simple mais moins précise." },
    { question: "Poids idéal et IMC ?", answer: "IMC 22 correspond souvent au poids idéal pour la taille." },
    { question: "Écart acceptable ?", answer: "±5 kg autour du poids idéal est généralement sans risque." },
    { question: "Poids idéal enfant ?", answer: "Utilisez les courbes de croissance pédiatriques." },
  ]),
  calculate(input) {
    const taille = num(input.taille);
    const age = num(input.age);
    const homme = String(input.sexe) === "homme";
    const creff = (taille - 100 + age / 10) * 0.9 * (homme ? 1 : 0.9);
    const lorentz = homme
      ? taille - 100 - (taille - 150) / 4
      : taille - 100 - (taille - 150) / 2;
    const tailleM = taille / 100;
    const imc22 = 22 * tailleM * tailleM;
    return {
      summary: `Poids idéal Creff : ${formatNumber(creff, 1)} kg — Lorentz : ${formatNumber(lorentz, 1)} kg.`,
      lines: [
        { label: "Creff", value: `${formatNumber(creff, 1)} kg`, highlight: true },
        { label: "Lorentz", value: `${formatNumber(lorentz, 1)} kg` },
        { label: "IMC 22", value: `${formatNumber(imc22, 1)} kg` },
        { label: "Taille", value: `${taille} cm` },
        { label: "Âge", value: `${age} ans` },
      ],
    };
  },
};

export const caloriesJournalieres: SimulatorDefinition = {
  slug: "calories-journalieres",
  title: "Calories journalières",
  shortDescription:
    "Estimez vos besoins caloriques quotidiens selon l'activité physique.",
  metaTitle: "Calculateur calories journalières — BMR et besoins",
  metaDescription:
    "Calculez vos besoins caloriques quotidiens : métabolisme de base et besoins selon l'activité physique.",
  keywords: ["calories journalières", "besoins caloriques", "BMR"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["proteines-journalieres", "calculateur-imc", "hydratation-quotidienne"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 30, max: 200, step: 0.5, suffix: "kg" },
    { key: "taille", label: "Taille", type: "number", min: 100, max: 250, step: 1, suffix: "cm" },
    { key: "age", label: "Âge", type: "number", min: 15, max: 100, suffix: "ans" },
    {
      key: "sexe",
      label: "Sexe",
      type: "select",
      options: [
        { value: "homme", label: "Homme" },
        { value: "femme", label: "Femme" },
      ],
    },
    {
      key: "activite",
      label: "Activité physique",
      type: "select",
      options: [
        { value: "1.2", label: "Sédentaire" },
        { value: "1.375", label: "Légère (1-3×/sem)" },
        { value: "1.55", label: "Modérée (3-5×/sem)" },
        { value: "1.725", label: "Intense (6-7×/sem)" },
        { value: "1.9", label: "Très intense" },
      ],
    },
  ],
  defaultValues: { poids: 70, taille: 175, age: 30, sexe: "homme", activite: "1.375" },
  content: buildContent({
    intro: "Les besoins caloriques dépendent du métabolisme de base et du niveau d'activité physique.",
    howItWorks: [
      {
        title: "Formule Mifflin-St Jeor",
        blocks: [
          p("BMR H = 10×P + 6,25×T − 5×A + 5. BMR F = 10×P + 6,25×T − 5×A − 161. Besoins = BMR × facteur activité."),
          hl("Déficit", "Pour perdre du poids : −300 à 500 kcal/jour sous les besoins."),
        ],
      },
    ],
    example: { title: "Homme 70 kg, 175 cm, 30 ans, activité légère", blocks: [p("BMR ~1 700 kcal — Besoins ~2 300 kcal/jour.")] },
    conseils: ["Ne descendez pas sous 1 200 kcal (F) ou 1 500 kcal (H).", "Privilégiez les aliments nutritifs.", "Consultez un diététicien pour un plan personnalisé."],
    limites: ["Estimation — métabolisme individuel variable.", "Pathologies non prises en compte."],
  }),
  faq: buildFaq([
    { question: "BMR vs besoins totaux ?", answer: "Le BMR est le métabolisme au repos. Les besoins incluent l'activité physique." },
    { question: "Perdre du poids ?", answer: "Déficit de 300-500 kcal/jour pour une perte progressive et durable." },
    { question: "Gagner du muscle ?", answer: "Surplus de 200-300 kcal avec entraînement en force." },
    { question: "Formule Mifflin ou Harris-Benedict ?", answer: "Mifflin-St Jeor est plus précise pour la population moderne." },
  ]),
  calculate(input) {
    const p = num(input.poids);
    const t = num(input.taille);
    const a = num(input.age);
    const homme = String(input.sexe) === "homme";
    const bmr = homme ? 10 * p + 6.25 * t - 5 * a + 5 : 10 * p + 6.25 * t - 5 * a - 161;
    const facteur = num(input.activite);
    const besoins = bmr * facteur;
    const perte = besoins - 400;
    return {
      summary: `Besoins : ${formatNumber(besoins, 0)} kcal/jour (BMR : ${formatNumber(bmr, 0)} kcal).`,
      lines: [
        { label: "Besoins journaliers", value: `${formatNumber(besoins, 0)} kcal`, highlight: true },
        { label: "Métabolisme de base", value: `${formatNumber(bmr, 0)} kcal` },
        { label: "Pour perdre du poids", value: `${formatNumber(perte, 0)} kcal` },
        { label: "Facteur activité", value: `${facteur}` },
        { label: "Poids", value: `${p} kg` },
      ],
    };
  },
};

export const dateAccouchement: SimulatorDefinition = {
  slug: "date-accouchement",
  title: "Date d'accouchement",
  shortDescription:
    "Estimez la date probable d'accouchement selon la règle de Naegele.",
  metaTitle: "Calculateur date d'accouchement — Règle de Naegele",
  metaDescription:
    "Calculez la date probable d'accouchement (DPA) à partir de la date des dernières règles.",
  keywords: ["date accouchement", "DPA", "grossesse"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calculateur-ovulation", "calories-journalieres", "hydratation-quotidienne"],
  formFields: [
    { key: "jour", label: "Jour des dernières règles", type: "number", min: 1, max: 31, suffix: "" },
    { key: "mois", label: "Mois", type: "number", min: 1, max: 12, suffix: "" },
    { key: "annee", label: "Année", type: "number", min: 2020, max: 2030, suffix: "" },
    { key: "dureeCycle", label: "Durée du cycle", type: "number", min: 21, max: 35, suffix: "jours" },
  ],
  defaultValues: { jour: 15, mois: 3, annee: 2025, dureeCycle: 28 },
  content: buildContent({
    intro: "La date d'accouchement est estimée à 280 jours (40 semaines) après le premier jour des dernières règles.",
    howItWorks: [
      {
        title: "Règle de Naegele",
        blocks: [
          p("DPA = Date dernières règles + 280 jours (+ correction si cycle ≠ 28 jours)."),
          hl("Précision", "Seulement 5 % des accouchements sont à la date exacte. Fourchette ±2 semaines."),
        ],
      },
    ],
    example: { title: "Dernières règles 15 mars 2025", blocks: [p("DPA estimée : 20 décembre 2025.")] },
    conseils: ["Confirmez par échographie du premier trimestre.", "Préparez votre dossier de maternité tôt.", "Suivez les consultations prénatales obligatoires."],
    limites: ["Estimation — échographie plus précise.", "Cycles irréguliers : moins fiable."],
  }),
  faq: buildFaq([
    { question: "Règle de Naegele ?", answer: "DPA = 1er jour dernières règles + 7 jours − 3 mois + 1 an." },
    { question: "Échographie et DPA ?", answer: "L'échographie du 1er trimestre peut ajuster la DPA si écart > 5 jours." },
    { question: "Accouchement prématuré ?", answer: "Avant 37 semaines. Consultez en urgence si signes avant terme." },
    { question: "Semaines de grossesse ?", answer: "Comptées depuis le 1er jour des dernières règles (pas depuis la conception)." },
  ]),
  calculate(input) {
    const jour = num(input.jour);
    const mois = num(input.mois);
    const annee = num(input.annee);
    const cycle = num(input.dureeCycle);
    const ddr = new Date(annee, mois - 1, jour);
    const correction = cycle - 28;
    const dpa = new Date(ddr);
    dpa.setDate(dpa.getDate() + 280 + correction);
    const today = new Date();
    const diffMs = dpa.getTime() - today.getTime();
    const joursRestants = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const semaines = Math.floor((280 + correction - joursRestants) / 7);
    const fmt = (d: Date) =>
      d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    return {
      summary: `DPA estimée : ${fmt(dpa)} (${joursRestants > 0 ? `${joursRestants} jours restants` : "terme atteint ou passé"}).`,
      lines: [
        { label: "Date d'accouchement", value: fmt(dpa), highlight: true },
        { label: "Semaines de grossesse", value: `~${semaines} SA`, highlight: true },
        { label: "Jours restants", value: `${joursRestants}` },
        { label: "Dernières règles", value: fmt(ddr) },
        { label: "Cycle", value: `${cycle} jours` },
      ],
    };
  },
};

export const calculateurOvulation: SimulatorDefinition = {
  slug: "calculateur-ovulation",
  title: "Calculateur ovulation",
  shortDescription:
    "Estimez votre date d'ovulation et la période fertile du cycle menstruel.",
  metaTitle: "Calculateur ovulation — Période fertile",
  metaDescription:
    "Calculez votre date d'ovulation et la fenêtre fertile selon la durée de votre cycle menstruel.",
  keywords: ["ovulation", "période fertile", "cycle menstruel"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["date-accouchement", "calories-journalieres", "cycles-sommeil"],
  formFields: [
    { key: "jour", label: "Jour début cycle (1ères règles)", type: "number", min: 1, max: 31, suffix: "" },
    { key: "mois", label: "Mois", type: "number", min: 1, max: 12, suffix: "" },
    { key: "annee", label: "Année", type: "number", min: 2020, max: 2030, suffix: "" },
    { key: "dureeCycle", label: "Durée du cycle", type: "number", min: 21, max: 35, suffix: "jours" },
  ],
  defaultValues: { jour: 1, mois: 6, annee: 2025, dureeCycle: 28 },
  content: buildContent({
    intro: "L'ovulation survient généralement 14 jours avant la prochaine règle.",
    howItWorks: [
      {
        title: "Période fertile",
        blocks: [
          p("Ovulation ≈ Jour 1 du cycle + (Durée cycle − 14). Fenêtre fertile : 5 jours avant et 1 jour après l'ovulation."),
          hl("Méthode", "Estimation — température et tests d'ovulation plus précis."),
        ],
      },
    ],
    example: { title: "Cycle 28 jours, règles 1er juin", blocks: [p("Ovulation ~15 juin. Fenêtre fertile : 10-16 juin.")] },
    conseils: ["Suivez la température basale pour plus de précision.", "Les tests d'ovulation détectent le pic de LH.", "Cycles irréguliers : méthode moins fiable."],
    limites: ["Estimation pour cycles réguliers.", "Stress et pathologies peuvent décaler l'ovulation."],
  }),
  faq: buildFaq([
    { question: "Quand est la période fertile ?", answer: "5 jours avant l'ovulation et le jour de l'ovulation (spermatozoïdes viables 5 jours)." },
    { question: "Ovulation et cycle 28 jours ?", answer: "Ovulation généralement au 14e jour du cycle." },
    { question: "Cycles irréguliers ?", answer: "La prédiction est moins fiable. Utilisez tests d'ovulation ou suivi médical." },
    { question: "Contraception naturelle ?", answer: "Méthode peu fiable seule — consultez un professionnel." },
  ]),
  calculate(input) {
    const jour = num(input.jour);
    const mois = num(input.mois);
    const annee = num(input.annee);
    const cycle = num(input.dureeCycle);
    const debut = new Date(annee, mois - 1, jour);
    const ovulation = new Date(debut);
    ovulation.setDate(ovulation.getDate() + cycle - 14);
    const fertileDebut = new Date(ovulation);
    fertileDebut.setDate(fertileDebut.getDate() - 5);
    const fertileFin = new Date(ovulation);
    fertileFin.setDate(fertileFin.getDate() + 1);
    const fmt = (d: Date) =>
      d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    return {
      summary: `Ovulation estimée : ${fmt(ovulation)}. Fenêtre fertile : ${fmt(fertileDebut)} – ${fmt(fertileFin)}.`,
      lines: [
        { label: "Date ovulation", value: fmt(ovulation), highlight: true },
        { label: "Fenêtre fertile", value: `${fmt(fertileDebut)} – ${fmt(fertileFin)}`, highlight: true },
        { label: "Début cycle", value: fmt(debut) },
        { label: "Durée cycle", value: `${cycle} jours` },
        { label: "Jour ovulation", value: `J${cycle - 14}` },
      ],
    };
  },
};

export const hydratationQuotidienne: SimulatorDefinition = {
  slug: "hydratation-quotidienne",
  title: "Hydratation quotidienne",
  shortDescription:
    "Estimez la quantité d'eau à consommer chaque jour selon votre poids et activité.",
  metaTitle: "Calculateur hydratation quotidienne — Eau par jour",
  metaDescription:
    "Calculez vos besoins en eau quotidiens selon le poids, l'activité physique et le climat.",
  keywords: ["hydratation", "eau quotidienne", "besoins eau"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calories-journalieres", "proteines-journalieres", "calculateur-imc"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 30, max: 200, step: 0.5, suffix: "kg" },
    {
      key: "activite",
      label: "Activité physique",
      type: "select",
      options: [
        { value: "0", label: "Sédentaire" },
        { value: "0.5", label: "Modérée (+0,5 L)" },
        { value: "1", label: "Intense (+1 L)" },
      ],
    },
    {
      key: "climat",
      label: "Climat",
      type: "select",
      options: [
        { value: "0", label: "Normal" },
        { value: "0.5", label: "Chaud (+0,5 L)" },
      ],
    },
  ],
  defaultValues: { poids: 70, activite: "0", climat: "0" },
  content: buildContent({
    intro: "Une hydratation suffisante est essentielle pour le métabolisme et la performance physique.",
    howItWorks: [
      {
        title: "Besoins en eau",
        blocks: [
          p("Base : 30-35 mL/kg/jour. Ajoutez 0,5-1 L pour activité et climat chaud."),
          hl("Signes", "Urine claire = bonne hydratation. Urine foncée = besoin d'eau."),
        ],
      },
    ],
    example: { title: "70 kg, sédentaire", blocks: [p("~2,1 à 2,5 L d'eau par jour.")] },
    conseils: ["Buvez régulièrement, pas seulement quand vous avez soif.", "L'eau des aliments compte (fruits, légumes).", "Augmentez en sport et en chaleur."],
    limites: ["Besoins individuels variables.", "Pathologies (insuffisance cardiaque) : avis médical."],
  }),
  faq: buildFaq([
    { question: "Combien d'eau par jour ?", answer: "Environ 2 L pour un adulte moyen. 30-35 mL/kg de poids." },
    { question: "Eau ou autres liquides ?", answer: "L'eau est idéale. Thé, café comptent mais limitent la caféine." },
    { question: "Trop d'eau ?", answer: "Rare mais possible (hyponatrémie). Ne forcez pas au-delà des besoins." },
    { question: "Eau et sport ?", answer: "500 mL avant, pendant et après l'effort selon intensité et durée." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const base = poids * 0.033;
    const activite = num(input.activite);
    const climat = num(input.climat);
    const total = base + activite + climat;
    const verres = Math.ceil(total / 0.25);
    return {
      summary: `Hydratation recommandée : ${formatNumber(total, 1)} L/jour (~${verres} verres de 25 cl).`,
      lines: [
        { label: "Eau recommandée", value: `${formatNumber(total, 1)} L/jour`, highlight: true },
        { label: "Verres (25 cl)", value: `${verres}`, highlight: true },
        { label: "Base (33 mL/kg)", value: `${formatNumber(base, 1)} L` },
        { label: "Bonus activité", value: `${activite} L` },
        { label: "Poids", value: `${poids} kg` },
      ],
    };
  },
};

export const proteinesJournalieres: SimulatorDefinition = {
  slug: "proteines-journalieres",
  title: "Protéines journalières",
  shortDescription:
    "Calculez vos besoins quotidiens en protéines selon poids et objectif.",
  metaTitle: "Calculateur protéines journalières — Besoins",
  metaDescription:
    "Estimez vos besoins en protéines par jour selon le poids, l'activité et l'objectif (maintien, perte, muscle).",
  keywords: ["protéines journalières", "besoins protéines", "apport protéines"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["calories-journalieres", "calculateur-imc", "hydratation-quotidienne"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 30, max: 200, step: 0.5, suffix: "kg" },
    {
      key: "objectif",
      label: "Objectif",
      type: "select",
      options: [
        { value: "1.2", label: "Maintien (1,2 g/kg)" },
        { value: "1.6", label: "Sportif / perte (1,6 g/kg)" },
        { value: "2", label: "Musculation (2 g/kg)" },
      ],
    },
  ],
  defaultValues: { poids: 75, objectif: "1.6" },
  content: buildContent({
    intro: "Les protéines sont essentielles pour les muscles, la réparation tissulaire et l'immunité.",
    howItWorks: [
      {
        title: "Besoins",
        blocks: [
          p("Besoins = Poids × g/kg selon objectif. Maintien : 1,0-1,2 g/kg. Sportif : 1,4-1,8 g/kg. Musculation : 1,8-2,2 g/kg."),
          hl("Sources", "Viande, poisson, œufs, légumineuses, tofu, produits laitiers."),
        ],
      },
    ],
    example: { title: "75 kg, objectif sportif", blocks: [p("~120 g de protéines par jour.")] },
    conseils: ["Distribuez les protéines sur les repas.", "Combinez sources animales et végétales.", "Hydratez-vous suffisamment avec un apport élevé."],
    limites: ["Besoins individuels variables.", "Pathologies rénales : avis médical."],
  }),
  faq: buildFaq([
    { question: "Combien de protéines par jour ?", answer: "0,8 g/kg minimum. 1,2-2 g/kg selon activité et objectif." },
    { question: "Trop de protéines ?", answer: "Au-delà de 2,5 g/kg, peu d'avantage supplémentaire pour la masse musculaire." },
    { question: "Protéines végétales ?", answer: "Légumineuses, tofu, tempeh, quinoa — combiner pour tous les acides aminés." },
    { question: "Protéines et perte de poids ?", answer: "1,6-2 g/kg aide à préserver la masse musculaire en déficit calorique." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const gPerKg = num(input.objectif);
    const total = poids * gPerKg;
    const parRepas = total / 3;
    return {
      summary: `Besoins protéines : ${formatNumber(total, 0)} g/jour (~${formatNumber(parRepas, 0)} g/repas).`,
      lines: [
        { label: "Protéines/jour", value: `${formatNumber(total, 0)} g`, highlight: true },
        { label: "Par repas (3)", value: `${formatNumber(parRepas, 0)} g`, highlight: true },
        { label: "Ratio g/kg", value: `${gPerKg} g/kg` },
        { label: "Poids", value: `${poids} kg` },
        { label: "Équivalent viande", value: `~${formatNumber(total / 25, 0)} portions (25 g/portion)` },
      ],
    };
  },
};

export const economiesArretTabac: SimulatorDefinition = {
  slug: "economies-arret-tabac",
  title: "Économies arrêt tabac",
  shortDescription:
    "Calculez les économies réalisées en arrêtant le tabac sur une période donnée.",
  metaTitle: "Calculateur économies arrêt tabac",
  metaDescription:
    "Estimez les économies financières et les cigarettes non fumées en arrêtant le tabac.",
  keywords: ["arrêt tabac", "économies tabac", "cigarettes"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calories-journalieres", "hydratation-quotidienne", "unites-alcool"],
  formFields: [
    { key: "cigarettesJour", label: "Cigarettes par jour", type: "number", min: 1, max: 40, suffix: "" },
    { key: "prixPaquet", label: "Prix du paquet (20 cig.)", type: "number", min: 5, max: 15, step: 0.1, suffix: "€" },
    { key: "duree", label: "Durée sans tabac", type: "number", min: 1, max: 3650, suffix: "jours" },
  ],
  defaultValues: { cigarettesJour: 15, prixPaquet: 11, duree: 365 },
  content: buildContent({
    intro: "Arrêter le tabac améliore la santé et génère des économies significatives.",
    howItWorks: [
      {
        title: "Économies",
        blocks: [
          p("Coût/jour = (Cigarettes/jour / 20) × Prix paquet. Économie = Coût/jour × Durée."),
          hl("Santé", "Après 1 an sans tabac : risque cardiaque divisé par 2."),
        ],
      },
    ],
    example: { title: "15 cig/jour, 11 €/paquet, 1 an", blocks: [p("Économie : ~3 000 € et 5 475 cigarettes non fumées.")] },
    conseils: ["Contactez Tabac Info Service (3989).", "Les substituts nicotiniques augmentent les chances de succès.", "Chaque tentative compte — persévérez."],
    limites: ["Prix variable selon le type de tabac.", "Coûts santé futurs non quantifiés ici."],
  }),
  faq: buildFaq([
    { question: "Aide pour arrêter ?", answer: "Tabac Info Service (3989), remboursement partiel des substituts nicotiniques." },
    { question: "Économies 10 ans ?", answer: "Multipliez l'économie annuelle — souvent > 30 000 € pour un fumeur moyen." },
    { question: "Bénéfices santé ?", answer: "Amélioration respiratoire dès quelques semaines. Risque cancer diminue sur long terme." },
    { question: "Substituts nicotiniques ?", answer: "Gommes, patchs — remboursés sur ordonnance en partie." },
  ]),
  calculate(input) {
    const cig = num(input.cigarettesJour);
    const prix = num(input.prixPaquet);
    const duree = num(input.duree);
    const coutJour = (cig / 20) * prix;
    const economie = coutJour * duree;
    const cigarettesEvitees = cig * duree;
    const paquetsEvites = cigarettesEvitees / 20;
    return {
      summary: `Économie : ${formatCurrency(economie)} — ${formatNumber(cigarettesEvitees, 0)} cigarettes évitées.`,
      lines: [
        { label: "Économie totale", value: formatCurrency(economie), highlight: true },
        { label: "Cigarettes évitées", value: formatNumber(cigarettesEvitees, 0), highlight: true },
        { label: "Paquets évités", value: formatNumber(paquetsEvites, 0) },
        { label: "Coût/jour", value: formatCurrency(coutJour) },
        { label: "Durée", value: `${duree} jours` },
      ],
    };
  },
};

export const unitesAlcool: SimulatorDefinition = {
  slug: "unites-alcool",
  title: "Unités d'alcool",
  shortDescription:
    "Convertissez vos consommations en unités d'alcool et comparez aux recommandations.",
  metaTitle: "Calculateur unités d'alcool — Consommation",
  metaDescription:
    "Calculez le nombre d'unités d'alcool consommées selon le type de boisson, volume et teneur en alcool.",
  keywords: ["unités alcool", "consommation alcool", "verres standard"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["economies-arret-tabac", "calories-journalieres", "hydratation-quotidienne"],
  formFields: [
    {
      key: "type",
      label: "Type de boisson",
      type: "select",
      options: [
        { value: "biere", label: "Bière (5 %, 25 cl)" },
        { value: "vin", label: "Vin (12 %, 10 cl)" },
        { value: "spiritueux", label: "Spiritueux (40 %, 3 cl)" },
      ],
    },
    { key: "quantite", label: "Nombre de verres", type: "number", min: 1, max: 20, suffix: "" },
    { key: "frequence", label: "Jours par semaine", type: "number", min: 1, max: 7, suffix: "" },
  ],
  defaultValues: { type: "vin", quantite: 2, frequence: 5 },
  content: buildContent({
    intro: "Une unité d'alcool = 10 g d'alcool pur. Les recommandations limitent à 10 verres/semaine max.",
    howItWorks: [
      {
        title: "Unités",
        blocks: [
          p("Unités = Volume (L) × Teneur (%) × 0,789. 1 verre bière 25 cl 5 % ≈ 1 unité. Vin 10 cl 12 % ≈ 1 unité."),
          hl("Recommandations", "Max 10 verres/semaine, pas tous les jours. Pas plus de 2 verres/jour."),
        ],
      },
    ],
    example: { title: "2 verres de vin, 5 jours/sem", blocks: [p("10 unités/semaine — limite recommandée atteinte.")] },
    conseils: ["Alternez avec de l'eau.", "Évitez le binge drinking.", "Consultez si vous avez du mal à limiter."],
    limites: ["Verres standard approximatifs.", "Recommandations Santé publique France."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'une unité d'alcool ?", answer: "10 g d'alcool pur — environ 1 verre de vin, 1 bière ou 1 shot." },
    { question: "Limite recommandée ?", answer: "10 verres/semaine maximum, pas tous les jours. 2 verres max par jour." },
    { question: "Alcool et calories ?", answer: "1 verre de vin ~80 kcal. L'alcool est calorique sans nutriments." },
    { question: "Arrêt complet ?", answer: "Aucune consommation n'est sans risque — moins c'est mieux." },
  ]),
  calculate(input) {
    const type = String(input.type);
    const qte = num(input.quantite);
    const freq = num(input.frequence);
    const unitesParVerre: Record<string, number> = {
      biere: 1,
      vin: 1,
      spiritueux: 1,
    };
    const parVerre = unitesParVerre[type] ?? 1;
    const parJour = qte * parVerre;
    const parSemaine = parJour * freq;
    const statut =
      parSemaine <= 10 ? "Dans les recommandations" : "Au-dessus des recommandations";
    return {
      summary: `${formatNumber(parSemaine, 0)} unités/semaine — ${statut}.`,
      lines: [
        { label: "Unités/semaine", value: formatNumber(parSemaine, 0), highlight: true },
        { label: "Statut", value: statut, highlight: true },
        { label: "Unités/jour", value: formatNumber(parJour, 0) },
        { label: "Verres/jour", value: `${qte}` },
        { label: "Jours/semaine", value: `${freq}` },
      ],
    };
  },
};

export const cyclesSommeil: SimulatorDefinition = {
  slug: "cycles-sommeil",
  title: "Cycles de sommeil",
  shortDescription:
    "Calculez les heures idéales de réveil ou de coucher selon les cycles de 90 minutes.",
  metaTitle: "Calculateur cycles de sommeil — Heure réveil",
  metaDescription:
    "Trouvez l'heure idéale pour dormir ou se réveiller en respectant les cycles de sommeil de 90 minutes.",
  keywords: ["cycles sommeil", "heure réveil", "qualité sommeil"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calories-journalieres", "hydratation-quotidienne", "calculateur-ovulation"],
  formFields: [
    { key: "heure", label: "Heure (réveil ou coucher)", type: "number", min: 0, max: 23, suffix: "h" },
    { key: "minutes", label: "Minutes", type: "number", min: 0, max: 59, suffix: "min" },
    {
      key: "mode",
      label: "Mode",
      type: "select",
      options: [
        { value: "reveil", label: "Je veux me réveiller à…" },
        { value: "coucher", label: "Je veux me coucher à…" },
      ],
    },
    { key: "cycles", label: "Nombre de cycles (90 min)", type: "number", min: 4, max: 6, suffix: "" },
  ],
  defaultValues: { heure: 7, minutes: 0, mode: "reveil", cycles: 5 },
  content: buildContent({
    intro: "Un cycle de sommeil dure ~90 minutes. Réveil entre cycles = meilleure fraîcheur.",
    howItWorks: [
      {
        title: "Cycles 90 min",
        blocks: [
          p("5 cycles = 7h30 de sommeil. Pour réveil à 7h : coucher à 23h30 (5 cycles + 15 min endormissement)."),
          hl("Endormissement", "Comptez 15 minutes pour s'endormir."),
        ],
      },
    ],
    example: { title: "Réveil 7h00, 5 cycles", blocks: [p("Coucher idéal : 23h15 – 00h45 selon cycles.")] },
    conseils: ["Routine régulière de coucher.", "Évitez les écrans 1 h avant.", "Chambre fraîche et obscure."],
    limites: ["Durée cycle variable (80-110 min).", "Qualité du sommeil multifactorielle."],
  }),
  faq: buildFaq([
    { question: "Combien de cycles ?", answer: "4-6 cycles recommandés. 5 cycles = 7h30 — optimal pour la plupart des adultes." },
    { question: "15 min endormissement ?", answer: "Délai moyen pour s'endormir — ajustez selon votre expérience." },
    { question: "Réveil fatigué ?", answer: "Vous réveillez peut-être en milieu de cycle — essayez ±30 min." },
    { question: "Sommeil et sport ?", answer: "Le sommeil est crucial pour la récupération musculaire." },
  ]),
  calculate(input) {
    const h = num(input.heure);
    const m = num(input.minutes);
    const cycles = num(input.cycles);
    const dureeMin = cycles * 90 + 15;
    const base = new Date();
    base.setHours(h, m, 0, 0);
    const mode = String(input.mode);
    const result = new Date(base);
    if (mode === "reveil") {
      result.setMinutes(result.getMinutes() - dureeMin);
    } else {
      result.setMinutes(result.getMinutes() + dureeMin);
    }
    const fmt = (d: Date) =>
      `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    const heuresSommeil = dureeMin / 60;
    return {
      summary:
        mode === "reveil"
          ? `Coucher idéal : ${fmt(result)} (${formatNumber(heuresSommeil, 1)} h de sommeil).`
          : `Réveil idéal : ${fmt(result)} (${formatNumber(heuresSommeil, 1)} h de sommeil).`,
      lines: [
        {
          label: mode === "reveil" ? "Heure de coucher" : "Heure de réveil",
          value: fmt(result),
          highlight: true,
        },
        { label: "Durée sommeil", value: `${formatNumber(heuresSommeil, 1)} h`, highlight: true },
        { label: "Cycles", value: `${cycles} (90 min)` },
        { label: "Référence", value: fmt(base) },
        { label: "Temps endormissement", value: "15 min" },
      ],
    };
  },
};

export const santeSimulators = [
  calculateurImc,
  poidsIdeal,
  caloriesJournalieres,
  dateAccouchement,
  calculateurOvulation,
  hydratationQuotidienne,
  proteinesJournalieres,
  economiesArretTabac,
  unitesAlcool,
  cyclesSommeil,
];
