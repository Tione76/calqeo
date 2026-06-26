import type { SimulatorDefinition } from "../../types";
import { formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";

const poidsGrossesse: SimulatorDefinition = draftSimulator({
  slug: "simulateur-poids-grossesse",
  title: "Prise de poids grossesse",
  shortDescription:
    "Estimez la prise de poids recommandée selon votre IMC avant grossesse.",
  metaTitle: "Simulateur prise de poids grossesse — Recommandations",
  metaDescription:
    "Calculez la prise de poids recommandée pendant la grossesse selon votre IMC pré-grossesse et le trimestre.",
  keywords: ["prise poids grossesse", "poids grossesse", "IMC grossesse"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["date-accouchement", "calculateur-imc", "calories-journalieres"],
  formFields: [
    { key: "poidsAvant", label: "Poids avant grossesse", type: "number", min: 40, max: 150, step: 0.5, suffix: "kg" },
    { key: "taille", label: "Taille", type: "number", min: 140, max: 200, suffix: "cm" },
    { key: "semaine", label: "Semaines d'aménorrhée", type: "number", min: 4, max: 42, suffix: "SA" },
  ],
  defaultValues: { poidsAvant: 62, taille: 165, semaine: 20 },
  content: buildContent({
    intro: "La prise de poids pendant la grossesse dépend de l'IMC avant grossesse — trop ou pas assez impacte la santé.",
    howItWorks: [
      {
        title: "Recommandations IOM",
        blocks: [
          p("IMC < 18,5 : +12,5 à 18 kg. IMC 18,5-24,9 : +11,5 à 16 kg. IMC 25-29,9 : +7 à 11,5 kg. IMC ≥ 30 : +5 à 9 kg."),
          hl("Rythme", "Peu en 1er trimestre (~1 kg), puis 250-500 g/semaine au 2e et 3e trimestre."),
        ],
      },
    ],
    conseils: ["Suivi régulier avec sage-femme ou gynécologue.", "Alimentation variée sans « manger pour deux ».", "Activité physique adaptée recommandée."],
    limites: ["Grossesses multiples : recommandations différentes.", "Cas médicaux particuliers : avis professionnel."],
  }),
  faq: buildFaq([
    { question: "Prise de poids normale ?", answer: "11 à 16 kg pour IMC normal — variable selon IMC initial." },
    { question: "1er trimestre ?", answer: "Peu de prise de poids (~1 kg) — nausées fréquentes." },
    { question: "Surpoids et grossesse ?", answer: "Prise recommandée réduite (5-9 kg si IMC ≥ 30)." },
  ]),
  calculate(input) {
    const poids = num(input.poidsAvant);
    const tailleM = num(input.taille) / 100;
    const imc = tailleM > 0 ? poids / (tailleM * tailleM) : 0;
    let minTotal = 11.5;
    let maxTotal = 16;
    if (imc < 18.5) { minTotal = 12.5; maxTotal = 18; }
    else if (imc >= 25 && imc < 30) { minTotal = 7; maxTotal = 11.5; }
    else if (imc >= 30) { minTotal = 5; maxTotal = 9; }
    const semaine = num(input.semaine);
    const priseAttendue = semaine <= 13 ? 1 : 1 + ((semaine - 13) / 27) * ((minTotal + maxTotal) / 2 - 1);
    const poidsCible = poids + priseAttendue;
    return {
      summary: `Prise recommandée totale : ${formatNumber(minTotal, 1)}-${formatNumber(maxTotal, 1)} kg — attendu SA ${semaine} : ~${formatNumber(priseAttendue, 1)} kg.`,
      lines: [
        { label: "Prise totale recommandée", value: `${formatNumber(minTotal, 1)}-${formatNumber(maxTotal, 1)} kg`, highlight: true },
        { label: "Prise attendue à SA", value: `~${formatNumber(priseAttendue, 1)} kg`, highlight: true },
        { label: "Poids cible estimé", value: `${formatNumber(poidsCible, 1)} kg` },
        { label: "IMC pré-grossesse", value: formatNumber(imc, 1) },
        { label: "Semaines", value: `${semaine} SA` },
      ],
    };
  },
});

const apportFibre: SimulatorDefinition = draftSimulator({
  slug: "simulateur-apport-fibre",
  title: "Apport en fibres",
  shortDescription:
    "Estimez vos besoins quotidiens en fibres alimentaires selon l'âge et le sexe.",
  metaTitle: "Simulateur apport fibres — Besoins quotidiens",
  metaDescription:
    "Calculez vos besoins en fibres alimentaires par jour selon votre âge, sexe et niveau d'activité.",
  keywords: ["apport fibres", "fibres alimentaires", "besoin fibres"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calories-journalieres", "proteines-journalieres", "hydratation-quotidienne"],
  formFields: [
    { key: "age", label: "Âge", type: "number", min: 4, max: 80, suffix: "ans" },
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
      label: "Activité",
      type: "select",
      options: [
        { value: "faible", label: "Sédentaire" },
        { value: "moderee", label: "Modérée" },
        { value: "elevee", label: "Élevée" },
      ],
    },
  ],
  defaultValues: { age: 35, sexe: "femme", activite: "moderee" },
  content: buildContent({
    intro: "Les fibres favorisent le transit, la satiété et la santé digestive — la plupart des adultes en consomment insuffisamment.",
    howItWorks: [
      {
        title: "Besoins ANSES",
        blocks: [
          p("Adultes : 25-30 g/jour. Enfants : ~5 g + âge (ex. 10 g à 5 ans). Augmenter progressivement et boire suffisamment."),
          hl("Sources", "Légumes, fruits, légumineuses, céréales complètes."),
        ],
      },
    ],
    conseils: ["Augmentez progressivement pour éviter les ballonnements.", "Buvez 1,5 L d'eau par jour.", "Variez les sources (solubles et insolubles)."],
    limites: ["Besoins individuels variables.", "Pathologies digestives : avis médical."],
  }),
  faq: buildFaq([
    { question: "Combien de fibres par jour ?", answer: "25 à 30 g pour un adulte — la moyenne française est ~15 g." },
    { question: "Aliments riches en fibres ?", answer: "Lentilles, haricots, avoine, pruneaux, brocoli, pain complet." },
    { question: "Trop de fibres ?", answer: "Excès possible : ballonnements, carences minérales — augmenter progressivement." },
  ]),
  calculate(input) {
    const age = num(input.age);
    const homme = String(input.sexe) === "homme";
    let besoin = age < 15 ? 5 + age : homme ? 30 : 25;
    const activite = String(input.activite);
    if (activite === "elevee") besoin += 3;
    const apportMoyen = 15;
    const deficit = Math.max(0, besoin - apportMoyen);
    return {
      summary: `Besoin recommandé : ${formatNumber(besoin, 0)} g/jour.`,
      lines: [
        { label: "Besoin fibres", value: `${formatNumber(besoin, 0)} g/jour`, highlight: true },
        { label: "Apport moyen FR", value: `${apportMoyen} g/jour` },
        { label: "Déficit estimé", value: deficit > 0 ? `${formatNumber(deficit, 0)} g` : "Couvert" },
        { label: "Âge", value: `${age} ans` },
        { label: "Sexe", value: homme ? "Homme" : "Femme" },
      ],
    };
  },
});

const besoinCaloriqueSport: SimulatorDefinition = draftSimulator({
  slug: "simulateur-besoin-calorique-sport",
  title: "Besoins caloriques sport",
  shortDescription:
    "Estimez les calories brûlées pendant une séance selon l'activité et la durée.",
  metaTitle: "Calculateur calories sport — Dépense énergétique",
  metaDescription:
    "Calculez les calories brûlées selon votre poids, le type d'activité sportive et la durée de l'effort.",
  keywords: ["calories sport", "dépense calorique", "MET activité"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calories-journalieres", "cycles-sommeil", "simulateur-marche-quotidienne"],
  formFields: [
    { key: "poids", label: "Poids", type: "number", min: 40, max: 150, step: 0.5, suffix: "kg" },
    { key: "duree", label: "Durée", type: "number", min: 10, max: 180, suffix: "min" },
    {
      key: "activite",
      label: "Activité",
      type: "select",
      options: [
        { value: "marche", label: "Marche rapide (MET 4)" },
        { value: "course", label: "Course (MET 9)" },
        { value: "velo", label: "Vélo (MET 7)" },
        { value: "natation", label: "Natation (MET 8)" },
        { value: "muscu", label: "Musculation (MET 6)" },
      ],
    },
  ],
  defaultValues: { poids: 70, duree: 45, activite: "course" },
  content: buildContent({
    intro: "La dépense calorique dépend du poids, de l'intensité (MET) et de la durée de l'activité.",
    howItWorks: [
      {
        title: "Formule MET",
        blocks: [
          p("Calories = MET × Poids (kg) × Durée (h). MET mesure l'intensité métabolique relative au repos."),
          hl("Exemple", "Course MET 9, 70 kg, 45 min ≈ 472 kcal."),
        ],
      },
    ],
    conseils: ["Hydratez-vous pendant l'effort.", "Intensité modérée : 150 min/semaine recommandées.", "Combinez cardio et renforcement."],
    limites: ["Estimation moyenne — intensité réelle variable.", "Ne remplace pas un suivi nutritionnel personnalisé."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le MET ?", answer: "Metabolic Equivalent — 1 MET = dépense au repos. Course ≈ 9 MET." },
    { question: "Activité la plus brûle-calories ?", answer: "Course, natation intense, HIIT — selon intensité et durée." },
    { question: "Compenser un repas ?", answer: "La dépense sportive seule ne compense pas une alimentation déséquilibrée." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const dureeH = num(input.duree) / 60;
    const metMap: Record<string, number> = { marche: 4, course: 9, velo: 7, natation: 8, muscu: 6 };
    const activite = String(input.activite);
    const met = metMap[activite] ?? 5;
    const calories = met * poids * dureeH;
    return {
      summary: `Dépense estimée : ${formatNumber(calories, 0)} kcal.`,
      lines: [
        { label: "Calories brûlées", value: `${formatNumber(calories, 0)} kcal`, highlight: true },
        { label: "MET", value: `${met}` },
        { label: "Durée", value: `${num(input.duree)} min` },
        { label: "Poids", value: `${formatNumber(poids, 1)} kg` },
        { label: "Activité", value: activite },
      ],
    };
  },
});

const doseParacetamolPoids: SimulatorDefinition = draftSimulator({
  slug: "simulateur-dose-paracetamol-poids",
  title: "Dose paracétamol enfant",
  shortDescription:
    "Calculez la dose de paracétamol adaptée au poids de l'enfant.",
  metaTitle: "Calculateur dose paracétamol — mg/kg enfant",
  metaDescription:
    "Calculez la dose de paracétamol pour enfant selon le poids : mg/kg, dose par prise et intervalle.",
  keywords: ["dose paracétamol enfant", "doliprane poids", "mg/kg paracétamol"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calculateur-imc", "hydratation-quotidienne", "cycles-sommeil"],
  formFields: [
    { key: "poids", label: "Poids enfant", type: "number", min: 3, max: 80, step: 0.1, suffix: "kg" },
    { key: "concentration", label: "Concentration sirop", type: "number", min: 1, max: 3, step: 0.1, suffix: "g/100 mL" },
  ],
  defaultValues: { poids: 15, concentration: 2.4 },
  content: buildContent({
    intro: "Le paracétamol est le médicament le plus utilisé chez l'enfant — la dose dépend du poids, pas uniquement de l'âge.",
    howItWorks: [
      {
        title: "Dosage",
        blocks: [
          p("Dose = 15 mg/kg par prise, max 60 mg/kg/jour. Intervalle minimum 6 h — max 4 prises/jour."),
          hl("Attention", "Vérifiez la concentration du sirop — 2,4 % ou 3 % courant."),
        ],
      },
    ],
    conseils: ["Lisez l'étiquette du sirop.", "Ne combinez pas plusieurs produits contenant du paracétamol.", "Consultez en cas de doute ou fièvre persistante."],
    limites: ["Indicatif — suivez notice ou avis médical.", "Nourrisson < 3 mois : avis médical obligatoire."],
  }),
  faq: buildFaq([
    { question: "Dose par kg ?", answer: "15 mg/kg par prise, toutes les 6 h minimum." },
    { question: "Dose max journalière ?", answer: "60 mg/kg/jour — ne pas dépasser 4 prises." },
    { question: "Sirop 2,4 % ?", answer: "2,4 g pour 100 mL — adaptez le volume à la dose en mg." },
  ]),
  calculate(input) {
    const poids = num(input.poids);
    const doseMg = 15 * poids;
    const doseMaxJour = Math.min(60 * poids, 4000);
    const conc = num(input.concentration);
    const ml = conc > 0 ? (doseMg / (conc * 10)) : 0;
    return {
      summary: `Dose : ${formatNumber(doseMg, 0)} mg (~${formatNumber(ml, 1)} mL) — max ${formatNumber(doseMaxJour, 0)} mg/jour.`,
      lines: [
        { label: "Dose par prise", value: `${formatNumber(doseMg, 0)} mg`, highlight: true },
        { label: "Volume sirop", value: `${formatNumber(ml, 1)} mL`, highlight: true },
        { label: "Max journalier", value: `${formatNumber(doseMaxJour, 0)} mg` },
        { label: "Intervalle", value: "6 h minimum" },
        { label: "Poids", value: `${formatNumber(poids, 1)} kg` },
      ],
    };
  },
});

const allaitementCalories: SimulatorDefinition = draftSimulator({
  slug: "simulateur-allaitement-calories",
  title: "Calories allaitement",
  shortDescription:
    "Estimez les besoins caloriques supplémentaires pendant l'allaitement.",
  metaTitle: "Simulateur calories allaitement — Besoins maternels",
  metaDescription:
    "Calculez les calories supplémentaires nécessaires pendant l'allaitement selon la fréquence et la durée.",
  keywords: ["calories allaitement", "besoins allaitement", "nutrition maternité"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["calories-journalieres", "simulateur-poids-grossesse", "hydratation-quotidienne"],
  formFields: [
    { key: "besoinBase", label: "Besoin calorique de base", type: "number", min: 1500, max: 2500, step: 50, suffix: "kcal/j" },
    {
      key: "type",
      label: "Type d'allaitement",
      type: "select",
      options: [
        { value: "exclusif", label: "Allaitement exclusif (+500 kcal)" },
        { value: "mixte", label: "Mixte (+300 kcal)" },
        { value: "partiel", label: "Partiel (+200 kcal)" },
      ],
    },
  ],
  defaultValues: { besoinBase: 1900, type: "exclusif" },
  content: buildContent({
    intro: "L'allaitement augmente les besoins énergétiques et hydriques de la mère — une alimentation variée suffit en général.",
    howItWorks: [
      {
        title: "Apport supplémentaire",
        blocks: [
          p("Allaitement exclusif : +500 kcal/jour. Mixte : +300 kcal. Les réserves de grossesse contribuent aussi."),
          hl("Hydratation", "+700 ml de liquides par jour recommandés."),
        ],
      },
    ],
    conseils: ["Mangez à faim sans compter strictement.", "Buvez à chaque tétée.", "Calcium et vitamine D importants."],
    limites: ["Besoins individuels variables.", "Régimes restrictifs déconseillés."],
  }),
  faq: buildFaq([
    { question: "Combien de calories en plus ?", answer: "+500 kcal/jour en allaitement exclusif." },
    { question: "Régime pendant allaitement ?", answer: "Alimentation variée — pas de régime restrictif." },
    { question: "Perte de poids ?", answer: "Progressive (0,5 kg/semaine max) possible sans impact sur le lait." },
  ]),
  calculate(input) {
    const base = num(input.besoinBase);
    const bonusMap: Record<string, number> = { exclusif: 500, mixte: 300, partiel: 200 };
    const type = String(input.type);
    const bonus = bonusMap[type] ?? 300;
    const total = base + bonus;
    const eauExtra = 700;
    return {
      summary: `Besoin total : ${formatNumber(total, 0)} kcal/j (+${bonus} kcal allaitement).`,
      lines: [
        { label: "Besoin total", value: `${formatNumber(total, 0)} kcal/j`, highlight: true },
        { label: "Supplément allaitement", value: `+${bonus} kcal/j`, highlight: true },
        { label: "Besoin de base", value: `${formatNumber(base, 0)} kcal/j` },
        { label: "Eau supplémentaire", value: `+${eauExtra} ml/j` },
        { label: "Type", value: type },
      ],
    };
  },
});

const marcheQuotidienne: SimulatorDefinition = draftSimulator({
  slug: "simulateur-marche-quotidienne",
  title: "Marche quotidienne",
  shortDescription:
    "Convertissez vos pas ou distance en calories brûlées et temps de marche.",
  metaTitle: "Simulateur marche quotidienne — Pas et calories",
  metaDescription:
    "Calculez les calories brûlées, la distance et le temps selon votre nombre de pas ou km parcourus.",
  keywords: ["marche quotidienne", "pas par jour", "10000 pas"],
  domain: "sante",
  category: "sante",
  icon: "heart",
  relatedSlugs: ["simulateur-besoin-calorique-sport", "calories-journalieres", "calculateur-imc"],
  formFields: [
    { key: "pas", label: "Nombre de pas", type: "number", min: 1000, max: 30000, step: 500, suffix: "" },
    { key: "poids", label: "Poids", type: "number", min: 40, max: 150, step: 0.5, suffix: "kg" },
    { key: "longueurPas", label: "Longueur de pas", type: "number", min: 50, max: 90, suffix: "cm" },
  ],
  defaultValues: { pas: 8000, poids: 70, longueurPas: 70 },
  content: buildContent({
    intro: "La marche est l'activité physique la plus accessible — 7 000 à 10 000 pas/jour associés à de meilleurs indicateurs de santé.",
    howItWorks: [
      {
        title: "Pas, distance, calories",
        blocks: [
          p("Distance = Pas × Longueur pas. Calories ≈ 0,04 × Poids × Pas (marche modérée). Temps ≈ Distance / 5 km/h."),
          hl("Objectif", "7 000-10 000 pas/jour selon recommandations OMS."),
        ],
      },
    ],
    conseils: ["Marchez 30 min par jour minimum.", "Utilisez un podomètre ou montre connectée.", "Intégrez des escaliers et trajets à pied."],
    limites: ["Calories estimées — vitesse et terrain influencent.", "Longueur de pas individuelle variable."],
  }),
  faq: buildFaq([
    { question: "10 000 pas obligatoires ?", answer: "Non — 7 000 pas montrent déjà des bénéfices. 10 000 est un repère marketing." },
    { question: "Calories par pas ?", answer: "Environ 0,04 kcal × poids (kg) par pas en marche modérée." },
    { question: "Longueur de pas ?", answer: "~70 cm adulte moyen — mesurez votre propre foulée." },
  ]),
  calculate(input) {
    const pas = num(input.pas);
    const poids = num(input.poids);
    const pasCm = num(input.longueurPas);
    const distanceKm = (pas * pasCm) / 100000;
    const calories = 0.04 * poids * pas;
    const minutes = (distanceKm / 5) * 60;
    const objectif = 10000;
    const pctObjectif = (pas / objectif) * 100;
    return {
      summary: `${formatNumber(pas, 0)} pas — ${formatNumber(distanceKm, 2)} km — ${formatNumber(calories, 0)} kcal.`,
      lines: [
        { label: "Calories brûlées", value: `${formatNumber(calories, 0)} kcal`, highlight: true },
        { label: "Distance", value: `${formatNumber(distanceKm, 2)} km`, highlight: true },
        { label: "Durée estimée", value: `${formatNumber(minutes, 0)} min` },
        { label: "Objectif 10 000 pas", value: `${formatNumber(pctObjectif, 0)} %` },
        { label: "Pas", value: `${formatNumber(pas, 0)}` },
      ],
    };
  },
});

export const santeDrafts: SimulatorDefinition[] = [
  poidsGrossesse,
  apportFibre,
  besoinCaloriqueSport,
  doseParacetamolPoids,
  allaitementCalories,
  marcheQuotidienne,
];
