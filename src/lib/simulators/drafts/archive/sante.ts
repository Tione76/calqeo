import type { SimulatorDefinition } from "../../types";
import { formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";

const imcEnfant: SimulatorDefinition = draftSimulator({
  slug: "simulateur-imc-enfant",
  title: "IMC enfant",
  shortDescription:
    "Calculez l'IMC de votre enfant et comparez-le aux courbes de référence OMS.",
  metaTitle: "Calculateur IMC enfant — Courbes de croissance",
  metaDescription:
    "Calculez l'IMC de votre enfant selon son âge, sexe, poids et taille. Interprétation adaptée à la croissance.",
  keywords: ["IMC enfant", "indice masse corporelle enfant", "courbe croissance"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["calculateur-imc", "simulateur-imc-adolescent", "poids-ideal"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 5, max: 100, step: 0.1, suffix: "kg" },
    { key: "taille", label: "Taille", type: "number", min: 50, max: 200, step: 0.5, suffix: "cm" },
    { key: "age", label: "Âge", type: "number", min: 2, max: 17, suffix: "ans" },
    {
      key: "sexe",
      label: "Sexe",
      type: "select",
      options: [
        { value: "garcon", label: "Garçon" },
        { value: "fille", label: "Fille" },
      ],
    },
  ],
  defaultValues: { poids: 32, taille: 130, age: 8, sexe: "garcon" },
  content: buildContent({
    intro: "L'IMC enfant s'interprète avec des courbes spécifiques selon l'âge et le sexe — pas avec les seuils adultes.",
    howItWorks: [
      {
        title: "IMC et courbes",
        blocks: [
          p("IMC = Poids / Taille² (m). Comparaison aux percentiles OMS : insuffisance < P3, normal P3-P85, surpoids P85-P97, obésité > P97."),
          hl("Limites", "Consultez un pédiatre pour une interprétation précise avec courbes officielles."),
        ],
      },
    ],
    conseils: ["Pesez l'enfant le matin à jeun.", "Mesurez la taille debout, pieds nus.", "Suivez l'évolution sur plusieurs mois."],
    limites: ["Percentiles approximatifs — courbes officielles sur carnet de santé.", "Non adapté aux moins de 2 ans."],
  }),
  faq: buildFaq([
    { question: "IMC normal enfant ?", answer: "Variable selon l'âge — utilisez les courbes de corpulence OMS, pas les seuils adultes." },
    { question: "À partir de quel âge ?", answer: "IMC interprétable à partir de 2 ans avec courbes spécifiques." },
    { question: "Différence garçon/fille ?", answer: "Oui, les courbes de référence diffèrent selon le sexe." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const tailleM = num(input.taille) / 100;
    const imc = tailleM > 0 ? poids / (tailleM * tailleM) : 0;
    const age = num(input.age);
    const seuilNormal = age < 6 ? 16 : age < 12 ? 18 : 21;
    let interpretation = "Corpulence normale";
    if (imc < seuilNormal - 2) interpretation = "Insuffisance pondérale possible";
    else if (imc > seuilNormal + 4) interpretation = "Surpoids possible";
    else if (imc > seuilNormal + 6) interpretation = "Obésité possible";
    return {
      summary: `IMC : ${formatNumber(imc, 1)} — ${interpretation}.`,
      lines: [
        { label: "IMC", value: formatNumber(imc, 1), highlight: true },
        { label: "Interprétation", value: interpretation, highlight: true },
        { label: "Poids", value: `${formatNumber(poids, 1)} kg` },
        { label: "Taille", value: `${formatNumber(num(input.taille), 0)} cm` },
        { label: "Âge", value: `${age} ans` },
      ],
    };
  },
});

const imcSenior: SimulatorDefinition = draftSimulator({
  slug: "simulateur-imc-senior",
  title: "IMC senior",
  shortDescription:
    "Calculez l'IMC adapté aux personnes âgées avec des seuils spécifiques.",
  metaTitle: "Calculateur IMC senior — Seuils adaptés",
  metaDescription:
    "Calculez l'IMC pour les seniors (65+) avec des seuils de corpulence adaptés à l'âge.",
  keywords: ["IMC senior", "IMC personne âgée", "poids senior"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["calculateur-imc", "poids-ideal", "simulateur-imc-enfant"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 35, max: 150, step: 0.5, suffix: "kg" },
    { key: "taille", label: "Taille", type: "number", min: 140, max: 200, suffix: "cm" },
    { key: "age", label: "Âge", type: "number", min: 65, max: 100, suffix: "ans" },
  ],
  defaultValues: { poids: 72, taille: 168, age: 75 },
  content: buildContent({
    intro: "Chez les seniors, un IMC légèrement élevé (23-28) peut être protecteur — les seuils OMS adultes sont moins adaptés.",
    howItWorks: [
      {
        title: "Seuils adaptés",
        blocks: [
          p("IMC < 23 : risque dénutrition. 23-28 : fourchette favorable. > 30 : obésité. > 35 : obésité sévère."),
          hl("Sarcopénie", "La masse musculaire diminue — le poids seul ne suffit pas."),
        ],
      },
    ],
    conseils: ["Maintenez l'activité physique et les protéines.", "Surveillez la perte de poids involontaire.", "Consultez pour une évaluation globale."],
    limites: ["IMC seul insuffisant — masse musculaire et albumine importants.", "Pathologies chroniques non prises en compte."],
  }),
  faq: buildFaq([
    { question: "IMC normal senior ?", answer: "23 à 28 souvent considéré favorable — au-dessus de 65 ans." },
    { question: "Maigreur senior ?", answer: "IMC < 23 = risque de fragilité et dénutrition." },
    { question: "Perte de poids chez senior ?", answer: "Perte involontaire > 5 % en 6 mois : consulter." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const tailleM = num(input.taille) / 100;
    const imc = tailleM > 0 ? poids / (tailleM * tailleM) : 0;
    let interpretation = "Fourchette favorable";
    if (imc < 23) interpretation = "Maigreur — risque dénutrition";
    else if (imc > 30) interpretation = "Obésité";
    else if (imc > 28) interpretation = "Surpoids";
    return {
      summary: `IMC : ${formatNumber(imc, 1)} — ${interpretation}.`,
      lines: [
        { label: "IMC", value: formatNumber(imc, 1), highlight: true },
        { label: "Interprétation senior", value: interpretation, highlight: true },
        { label: "Poids", value: `${formatNumber(poids, 1)} kg` },
        { label: "Taille", value: `${num(input.taille)} cm` },
        { label: "Âge", value: `${num(input.age)} ans` },
      ],
    };
  },
});

const imcAdolescent: SimulatorDefinition = draftSimulator({
  slug: "simulateur-imc-adolescent",
  title: "IMC adolescent",
  shortDescription:
    "Calculez l'IMC de l'adolescent avec interprétation adaptée à l'âge.",
  metaTitle: "Calculateur IMC adolescent — 12-17 ans",
  metaDescription:
    "Calculez l'IMC pour adolescent (12-17 ans) et interprétez-le selon les courbes de corpulence.",
  keywords: ["IMC adolescent", "IMC 15 ans", "surpoids adolescent"],
  domain: "sante",
  category: "sante",
  icon: "scale",
  relatedSlugs: ["simulateur-imc-enfant", "calculateur-imc", "calories-journalieres"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 30, max: 120, step: 0.5, suffix: "kg" },
    { key: "taille", label: "Taille", type: "number", min: 130, max: 210, suffix: "cm" },
    { key: "age", label: "Âge", type: "number", min: 12, max: 17, suffix: "ans" },
    {
      key: "sexe",
      label: "Sexe",
      type: "select",
      options: [
        { value: "garcon", label: "Garçon" },
        { value: "fille", label: "Fille" },
      ],
    },
  ],
  defaultValues: { poids: 58, taille: 165, age: 15, sexe: "fille" },
  content: buildContent({
    intro: "À l'adolescence, l'IMC se rapproche des valeurs adultes mais s'interprète encore avec des courbes spécifiques.",
    howItWorks: [
      {
        title: "IMC adolescent",
        blocks: [
          p("IMC = Poids / Taille². Percentiles OMS : surpoids > P85, obésité > P97 pour l'âge et le sexe."),
          hl("Puberté", "Croissance rapide — suivre l'évolution sur courbes, pas une mesure isolée."),
        ],
      },
    ],
    conseils: ["Évitez les régimes restrictifs chez l'ado.", "Activité physique et alimentation équilibrée.", "Consultez pédiatre ou médecin scolaire."],
    limites: ["Percentiles approximatifs.", "IMC ne distingue pas masse grasse et musculaire."],
  }),
  faq: buildFaq([
    { question: "IMC normal 15 ans ?", answer: "Variable — utilisez les courbes percentile selon sexe et âge exact." },
    { question: "Ado sportif IMC élevé ?", answer: "Masse musculaire peut majorer l'IMC — évaluation globale nécessaire." },
    { question: "Régime adolescent ?", answer: "Déconseillé sans suivi médical — risque de troubles alimentaires." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const tailleM = num(input.taille) / 100;
    const imc = tailleM > 0 ? poids / (tailleM * tailleM) : 0;
    const age = num(input.age);
    const seuilNormal = age < 14 ? 20 : 22;
    let interpretation = "Corpulence normale";
    if (imc < seuilNormal - 3) interpretation = "Insuffisance pondérale";
    else if (imc > seuilNormal + 3) interpretation = "Surpoids";
    else if (imc > seuilNormal + 6) interpretation = "Obésité";
    return {
      summary: `IMC : ${formatNumber(imc, 1)} — ${interpretation}.`,
      lines: [
        { label: "IMC", value: formatNumber(imc, 1), highlight: true },
        { label: "Interprétation", value: interpretation, highlight: true },
        { label: "Poids", value: `${formatNumber(poids, 1)} kg` },
        { label: "Taille", value: `${num(input.taille)} cm` },
        { label: "Âge", value: `${age} ans` },
      ],
    };
  },
});

const sommeilCyclesEnfant: SimulatorDefinition = draftSimulator({
  slug: "simulateur-sommeil-cycles-enfant",
  title: "Sommeil et cycles enfant",
  shortDescription:
    "Estimez les heures de sommeil recommandées et les cycles pour votre enfant.",
  metaTitle: "Simulateur sommeil enfant — Heures et cycles",
  metaDescription:
    "Calculez les heures de sommeil recommandées et le nombre de cycles de sommeil selon l'âge de l'enfant.",
  keywords: ["sommeil enfant", "heures sommeil enfant", "cycles sommeil"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["hydratation-quotidienne", "simulateur-imc-enfant", "calories-journalieres"],
  formFields: [
    { key: "age", label: "Âge", type: "number", min: 0, max: 17, suffix: "ans" },
    { key: "ageMois", label: "Mois supplémentaires", type: "number", min: 0, max: 11, suffix: "mois" },
  ],
  defaultValues: { age: 4, ageMois: 0 },
  content: buildContent({
    intro: "Le sommeil est essentiel à la croissance et au développement cognitif — les besoins diminuent avec l'âge.",
    howItWorks: [
      {
        title: "Durées recommandées",
        blocks: [
          p("0-3 mois : 14-17 h. 4-11 mois : 12-15 h. 1-2 ans : 11-14 h. 3-5 ans : 10-13 h. 6-12 ans : 9-12 h. 13-17 ans : 8-10 h."),
          hl("Cycles", "Cycle enfant ~50-60 min (vs 90 min adulte)."),
        ],
      },
    ],
    conseils: ["Routine stable au coucher.", "Pas d'écrans 1 h avant le sommeil.", "Chambre fraîche et obscure."],
    limites: ["Fourchettes indicatives — chaque enfant est différent.", "Troubles du sommeil : consulter un pédiatre."],
  }),
  faq: buildFaq([
    { question: "Heures sommeil 4 ans ?", answer: "10 à 13 heures sur 24 h (sieste incluse)." },
    { question: "Cycles de sommeil ?", answer: "4-6 cycles par nuit chez l'enfant — cycles plus courts qu'adultes." },
    { question: "Sieste jusqu'à quel âge ?", answer: "Variable — souvent jusqu'à 3-4 ans, parfois au-delà." },
  ]),
  calculate(input) {
    const ageTotal = num(input.age) + num(input.ageMois) / 12;
    let minH = 9;
    let maxH = 12;
    if (ageTotal < 1) { minH = 12; maxH = 15; }
    else if (ageTotal < 3) { minH = 11; maxH = 14; }
    else if (ageTotal < 6) { minH = 10; maxH = 13; }
    else if (ageTotal < 13) { minH = 9; maxH = 12; }
    else { minH = 8; maxH = 10; }
    const moyenne = (minH + maxH) / 2;
    const dureeCycle = ageTotal < 6 ? 0.75 : 1;
    const cycles = Math.round(moyenne / dureeCycle);
    return {
      summary: `Sommeil recommandé : ${minH}-${maxH} h (~${formatNumber(moyenne, 1)} h, ${cycles} cycles).`,
      lines: [
        { label: "Heures recommandées", value: `${minH}-${maxH} h`, highlight: true },
        { label: "Moyenne", value: `${formatNumber(moyenne, 1)} h`, highlight: true },
        { label: "Cycles estimés", value: `${cycles}` },
        { label: "Durée cycle", value: `${formatNumber(dureeCycle, 2)} h` },
        { label: "Âge", value: `${formatNumber(ageTotal, 1)} ans` },
      ],
    };
  },
});

const frequenceCardiaqueMax: SimulatorDefinition = draftSimulator({
  slug: "simulateur-frequence-cardiaque-max",
  title: "Fréquence cardiaque max",
  shortDescription:
    "Calculez votre fréquence cardiaque maximale et les zones d'entraînement.",
  metaTitle: "Calculateur fréquence cardiaque max — Zones FC",
  metaDescription:
    "Estimez votre fréquence cardiaque maximale et vos zones d'entraînement (aérobie, seuil, VO2max).",
  keywords: ["fréquence cardiaque max", "FC max", "zones entraînement"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["simulateur-besoin-calorique-sport", "simulateur-marche-quotidienne", "calories-journalieres"],
  formFields: [
    { key: "age", label: "Âge", type: "number", min: 15, max: 80, suffix: "ans" },
    {
      key: "formule",
      label: "Formule",
      type: "select",
      options: [
        { value: "classique", label: "220 − âge" },
        { value: "tanaka", label: "Tanaka : 208 − 0,7 × âge" },
      ],
    },
  ],
  defaultValues: { age: 35, formule: "tanaka" },
  content: buildContent({
    intro: "La fréquence cardiaque maximale sert à calibrer l'intensité de l'entraînement cardio.",
    howItWorks: [
      {
        title: "Formules et zones",
        blocks: [
          p("FC max ≈ 220 − âge (classique) ou 208 − 0,7 × âge (Tanaka). Zone aérobie : 60-70 % FC max. Seuil : 80-90 %."),
          hl("Précision", "Test effort médical pour valeur exacte."),
        ],
      },
    ],
    conseils: ["Échauffement 10 min avant effort intense.", "Montre cardio ou ceinture pour suivre.", "Consultez un médecin avant reprise sport."],
    limites: ["Formules estimatives — ±10 bpm d'écart possible.", "Médicaments et pathologies influencent la FC."],
  }),
  faq: buildFaq([
    { question: "Formule la plus fiable ?", answer: "Tanaka (208 − 0,7 × âge) souvent plus précise que 220 − âge." },
    { question: "Zone brûlage graisses ?", answer: "60-70 % FC max — mais dépense totale compte plus que la zone." },
    { question: "FC repos normale ?", answer: "60-80 bpm adulte — sportifs souvent 40-60 bpm." },
  ]),
  calculate(input) {
    const age = num(input.age);
    const formule = String(input.formule);
    const fcMax = formule === "tanaka" ? 208 - 0.7 * age : 220 - age;
    const zone1 = Math.round(fcMax * 0.6);
    const zone2 = Math.round(fcMax * 0.7);
    const zone3 = Math.round(fcMax * 0.8);
    const zone4 = Math.round(fcMax * 0.9);
    return {
      summary: `FC max : ${Math.round(fcMax)} bpm — zone aérobie ${zone1}-${zone2} bpm.`,
      lines: [
        { label: "FC max", value: `${Math.round(fcMax)} bpm`, highlight: true },
        { label: "Zone aérobie (60-70 %)", value: `${zone1}-${zone2} bpm`, highlight: true },
        { label: "Zone seuil (80-90 %)", value: `${zone3}-${zone4} bpm` },
        { label: "Formule", value: formule === "tanaka" ? "Tanaka" : "220 − âge" },
        { label: "Âge", value: `${age} ans` },
      ],
    };
  },
});

const tensionArterielle: SimulatorDefinition = draftSimulator({
  slug: "simulateur-tension-arterielle",
  title: "Tension artérielle",
  shortDescription:
    "Interprétez votre tension artérielle systolique et diastolique.",
  metaTitle: "Simulateur tension artérielle — Interprétation",
  metaDescription:
    "Interprétez vos chiffres de tension artérielle (systolique/diastolique) selon les recommandations HAS.",
  keywords: ["tension artérielle", "hypertension", "TA normale"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calculateur-imc", "hydratation-quotidienne", "simulateur-imc-senior"],
  formFields: [
    { key: "systolique", label: "Tension systolique", type: "number", min: 80, max: 220, suffix: "mmHg" },
    { key: "diastolique", label: "Tension diastolique", type: "number", min: 40, max: 140, suffix: "mmHg" },
  ],
  defaultValues: { systolique: 128, diastolique: 82 },
  content: buildContent({
    intro: "La tension artérielle mesure la pression du sang dans les artères — un indicateur clé de santé cardiovasculaire.",
    howItWorks: [
      {
        title: "Classification OMS/HAS",
        blocks: [
          p("Optimal : < 120/80. Normal : 120-129/80-84. HTA grade 1 : 140-159/90-99. Grade 2 : ≥ 160/100."),
          hl("Mesure", "Au repos, assis, bras à hauteur du cœur — moyenne sur plusieurs jours."),
        ],
      },
    ],
    conseils: ["Mesurez à domicile sur plusieurs jours.", "Réduisez sel et alcool.", "Activité physique régulière recommandée."],
    limites: ["Une mesure isolée ne suffit pas.", "Consultez un médecin pour diagnostic HTA."],
  }),
  faq: buildFaq([
    { question: "Tension normale ?", answer: "Idéalement < 120/80 mmHg au repos." },
    { question: "Hypertension ?", answer: "≥ 140/90 mmHg confirmée sur plusieurs mesures." },
    { question: "Quand mesurer ?", answer: "Matin au réveil et soir — avant médicaments et repas." },
  ]),
  calculate(input) {
    const sys = num(input.systolique);
    const dia = num(input.diastolique);
    let interpretation = "Normale";
    if (sys < 120 && dia < 80) interpretation = "Optimale";
    else if (sys < 130 && dia < 85) interpretation = "Normale";
    else if (sys < 140 && dia < 90) interpretation = "Normale haute";
    else if (sys < 160 && dia < 100) interpretation = "HTA grade 1";
    else interpretation = "HTA grade 2";
    const alerte = sys >= 180 || dia >= 110;
    return {
      summary: `${sys}/${dia} mmHg — ${interpretation}${alerte ? " — urgence si symptômes" : ""}.`,
      lines: [
        { label: "Interprétation", value: interpretation, highlight: true },
        { label: "Tension", value: `${sys}/${dia} mmHg`, highlight: true },
        { label: "Systolique", value: `${sys} mmHg` },
        { label: "Diastolique", value: `${dia} mmHg` },
        { label: "Urgence hypertensive", value: alerte ? "Possible — consulter" : "Non" },
      ],
    };
  },
});

export const archivedSanteDrafts: SimulatorDefinition[] = [
  imcEnfant,
  imcSenior,
  imcAdolescent,
  sommeilCyclesEnfant,
  frequenceCardiaqueMax,
  tensionArterielle,
];
