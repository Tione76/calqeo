import {
  buildRichContent,
  buildFaq,
  p,
  hl,
} from "../content-builder";
import type { ContentRegistry } from "./types";

export const santeContent: ContentRegistry = {
  "calculateur-imc": {
    content: buildRichContent({
      intro:
        "L'indice de masse corporelle (IMC) est un repère rapide pour évaluer si votre poids est adapté à votre taille, selon les critères de l'OMS.",
      definition:
        "L'IMC (Indice de Masse Corporelle) rapporte le poids (en kg) au carré de la taille (en m). C'est un indicateur statistique de corpulence, pas un diagnostic médical.",
      objectif:
        "Ce simulateur calcule votre IMC et affiche l'interprétation OMS : insuffisance pondérale, normal, surpoids ou obésité.",
      variables: [
        "Poids en kilogrammes",
        "Taille en centimètres",
      ],
      formules: [
        p("IMC = Poids (kg) ÷ Taille² (m)."),
        p("Interprétation OMS : < 18,5 insuffisance — 18,5-24,9 normal — 25-29,9 surpoids — ≥ 30 obésité."),
        hl(
          "Limites de l'IMC",
          "Ne distingue pas masse musculaire et masse grasse. Peu adapté aux sportifs, enfants, seniors et femmes enceintes.",
        ),
      ],
      interpretation: [
        p("Un IMC entre 18,5 et 24,9 est considéré comme une corpulence normale par l'OMS."),
        p("Le simulateur affiche aussi un poids idéal correspondant à un IMC de 22 — un repère central de la fourchette normale."),
        hl(
          "Consultation",
          "Pour une évaluation complète, consultez un professionnel de santé qui tiendra compte de votre morphologie et de votre historique.",
        ),
      ],
      limitesCalcul: [
        "Non adapté aux enfants, adolescents, seniors et femmes enceintes",
        "Ne distingue pas muscle et graisse — sportifs musclés peuvent avoir un IMC élevé",
        "Ne remplace pas un bilan médical ou nutritionnel",
      ],
      example: {
        title: "Adulte de 75 kg, 175 cm",
        donnees: [
          "Poids : 75 kg",
          "Taille : 175 cm (1,75 m)",
        ],
        calcul: [
          "Taille en m = 175 ÷ 100 = 1,75 m",
          "IMC = 75 ÷ (1,75 × 1,75) = 75 ÷ 3,0625 = 24,5",
        ],
        resultat: "IMC : 24,5 — Corpulence normale.",
        interpretation:
          "Avec un IMC de 24,5, vous êtes dans la fourchette normale, proche du seuil de surpoids (25). Un poids idéal (IMC 22) pour cette taille serait d'environ 67 kg.",
      },
      maillage: [
        { slug: "poids-ideal", label: "Poids idéal" },
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
      ],
      conseils: [
        "Combinez l'IMC avec l'activité physique et l'alimentation équilibrée",
        "Les sportifs : privilégiez la composition corporelle (masse grasse) plutôt que l'IMC seul",
        "Consultez un médecin si votre IMC est en dehors de la normale ou si vous avez des symptômes",
        "L'IMC est un outil de repère, pas un objectif en soi",
      ],
      limites: [
        "Indicateur statistique — ne remplace pas un avis médical",
        "Morphologie individuelle non prise en compte",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quel IMC est considéré comme normal ?",
        answer:
          "Entre 18,5 et 24,9 selon l'OMS. En dessous : insuffisance pondérale. Au-dessus de 25 : surpoids.",
      },
      {
        question: "L'IMC est-il fiable pour les sportifs ?",
        answer:
          "Non, les sportifs musclés peuvent avoir un IMC élevé sans surpoids. La masse grasse est un meilleur indicateur.",
      },
      {
        question: "Comment calculer l'IMC d'un enfant ?",
        answer:
          "Utilisez les courbes de croissance pédiatriques, pas la formule adulte. Consultez un pédiatre.",
      },
      {
        question: "Comment améliorer mon IMC ?",
        answer:
          "Équilibre alimentaire, activité physique régulière et suivi médical pour un objectif personnalisé.",
      },
      {
        question: "IMC et obésité : quelle différence ?",
        answer:
          "Surpoids : IMC 25-29,9. Obésité : IMC ≥ 30. L'obésité sévère commence à 35-40 selon les classifications.",
      },
      {
        question: "L'IMC change avec l'âge ?",
        answer:
          "L'IMC adulte ne varie pas avec l'âge, mais l'interprétation peut différer pour les seniors (perte de masse musculaire).",
      },
      {
        question: "Poids idéal et IMC : quel lien ?",
        answer:
          "Un IMC de 22 est souvent utilisé comme repère de poids idéal pour une taille donnée.",
      },
      {
        question: "IMC et risques santé ?",
        answer:
          "IMC élevé associé à risques cardiovasculaires, diabète type 2. IMC très bas : risques de carences.",
      },
      {
        question: "Peut-on avoir un IMC normal et être en mauvaise santé ?",
        answer:
          "Oui — sédentarité, alimentation déséquilibrée ou masse grasse élevée avec IMC normal (sarcopénie).",
      },
      {
        question: "À quelle fréquence recalculer l'IMC ?",
        answer:
          "Lors de changements de poids significatifs. Pas besoin de calcul quotidien — le poids fluctue naturellement.",
      },
    ]),
  },

  "poids-ideal": {
    content: buildRichContent({
      intro:
        "Le poids idéal n'est pas un chiffre unique : plusieurs formules (Creff, Lorentz, IMC 22) donnent des repères selon votre taille, âge et sexe.",
      definition:
        "Le poids idéal est une estimation du poids corporel associé à une bonne santé pour une personne donnée, selon des formules anthropométriques.",
      objectif:
        "Ce simulateur compare trois méthodes de calcul du poids idéal : Creff (intègre l'âge), Lorentz (simple) et IMC cible de 22.",
      variables: [
        "Taille en centimètres",
        "Âge en années",
        "Sexe (homme ou femme)",
      ],
      formules: [
        p("Creff = (Taille − 100 + Âge ÷ 10) × 0,9 × facteur sexe (1 homme, 0,9 femme)."),
        p("Lorentz homme = Taille − 100 − (Taille − 150) ÷ 4."),
        p("Lorentz femme = Taille − 100 − (Taille − 150) ÷ 2."),
        p("IMC 22 = 22 × Taille² (en m)."),
        hl(
          "Fourchette saine",
          "Un écart de ±5 kg autour du poids idéal est généralement sans risque et correspond à une morphologie variée.",
        ),
      ],
      interpretation: [
        p("Creff intègre l'âge : le poids idéal augmente légèrement avec l'âge adulte."),
        p("Lorentz est plus simple mais ne tient pas compte de l'âge."),
        p("IMC 22 est un repère médical central de la fourchette normale."),
        hl(
          "Stabilité",
          "Visez un poids stable et une bonne composition corporelle plutôt qu'un chiffre exact.",
        ),
      ],
      limitesCalcul: [
        "Formules indicatives — morphologie individuelle non prise en compte",
        "Non adapté aux enfants et adolescents",
        "Ne remplace pas une évaluation médicale personnalisée",
      ],
      example: {
        title: "Homme de 170 cm, 35 ans",
        donnees: [
          "Taille : 170 cm",
          "Âge : 35 ans",
          "Sexe : homme",
        ],
        calcul: [
          "Creff = (170 − 100 + 3,5) × 0,9 = 73,5 × 0,9 = 66,2 kg",
          "Lorentz = 170 − 100 − (20 ÷ 4) = 65 kg",
          "IMC 22 = 22 × 1,7² = 63,6 kg",
        ],
        resultat: "Poids idéal Creff : ~66,2 kg — Lorentz : 65 kg — IMC 22 : 63,6 kg.",
        interpretation:
          "Les trois formules convergent vers 63 à 67 kg. Une fourchette de 61 à 71 kg (±5 kg) est raisonnable pour cet homme.",
      },
      maillage: [
        { slug: "calculateur-imc", label: "Calculateur IMC" },
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "proteines-journalieres", label: "Protéines journalières" },
      ],
      conseils: [
        "Privilégiez la composition corporelle (masse musculaire, masse grasse) au poids seul",
        "Un poids stable sur plusieurs mois est un bon signe",
        "Consultez un médecin ou diététicien pour un objectif personnalisé",
        "Ne comparez pas votre poids à celui d'autres personnes de même taille",
      ],
      limites: [
        "Formules statistiques — ne tiennent pas compte de la morphologie fine",
        "Sportifs et personnes très musclées : IMC et poids idéal peu pertinents",
      ],
    }),
    faq: buildFaq([
      {
        question: "Creff ou Lorentz : quelle formule choisir ?",
        answer:
          "Creff intègre l'âge et est souvent plus précise pour les adultes. Lorentz est plus simple mais moins personnalisée.",
      },
      {
        question: "Poids idéal et IMC : quel lien ?",
        answer:
          "Un IMC de 22 correspond souvent au poids idéal pour une taille donnée — repère central de la normale OMS.",
      },
      {
        question: "Quel écart est acceptable ?",
        answer:
          "±5 kg autour du poids idéal est généralement sans risque pour la santé.",
      },
      {
        question: "Poids idéal pour un enfant ?",
        answer:
          "Utilisez les courbes de croissance pédiatriques et consultez un pédiatre, pas les formules adultes.",
      },
      {
        question: "Le poids idéal change avec l'âge ?",
        answer:
          "Creff augmente légèrement avec l'âge. Lorentz et IMC 22 sont indépendants de l'âge.",
      },
      {
        question: "Homme vs femme : quelle différence ?",
        answer:
          "Creff applique un facteur 0,9 pour les femmes. Lorentz utilise un diviseur différent (÷2 vs ÷4).",
      },
      {
        question: "Poids idéal et perte de poids ?",
        answer:
          "Visez une perte progressive (0,5 kg/semaine max). Le simulateur calories journalières aide à planifier.",
      },
      {
        question: "Peut-on viser un poids en dessous du poids idéal ?",
        answer:
          "Un IMC < 18,5 est une insuffisance pondérale. Consultez un professionnel avant toute perte importante.",
      },
      {
        question: "Poids idéal et sport ?",
        answer:
          "Les athlètes peuvent être au-dessus du poids idéal avec une composition corporelle saine.",
      },
      {
        question: "Comment mesurer mon poids correctement ?",
        answer:
          "Même heure, même conditions (matin, avant petit-déjeuner). Utilisez toujours le même balance.",
      },
    ]),
  },

  "calories-journalieres": {
    content: buildRichContent({
      intro:
        "Connaître vos besoins caloriques quotidiens est la base pour maintenir, perdre ou gagner du poids en toute sécurité.",
      definition:
        "Les besoins caloriques quotidiens représentent l'énergie (en kcal) que votre corps utilise chaque jour, au repos et lors de l'activité physique.",
      objectif:
        "Ce simulateur calcule votre métabolisme de base (BMR) et vos besoins totaux selon la formule Mifflin-St Jeor et votre niveau d'activité.",
      variables: [
        "Poids en kg",
        "Taille en cm",
        "Âge en années",
        "Sexe (homme ou femme)",
        "Niveau d'activité physique (sédentaire à très intense)",
      ],
      formules: [
        p("BMR homme = 10 × Poids + 6,25 × Taille − 5 × Âge + 5."),
        p("BMR femme = 10 × Poids + 6,25 × Taille − 5 × Âge − 161."),
        p("Besoins journaliers = BMR × Facteur d'activité (1,2 à 1,9)."),
        p("Pour perdre du poids : Besoins − 400 kcal (repère affiché)."),
        hl(
          "Déficit calorique",
          "Un déficit de 300 à 500 kcal/jour permet une perte progressive et durable, sans risque de carences.",
        ),
      ],
      interpretation: [
        p("Le BMR est l'énergie utilisée au repos complet — respiration, circulation, température corporelle."),
        p("Les besoins journaliers incluent votre activité physique quotidienne et vos exercices."),
        p("La ligne « pour perdre du poids » soustrait 400 kcal — ajustez selon vos objectifs et avis médical."),
        hl(
          "Minimum vital",
          "Ne descendez pas sous 1 200 kcal (femme) ou 1 500 kcal (homme) sans suivi professionnel.",
        ),
      ],
      limitesCalcul: [
        "Estimation — métabolisme individuel variable (génétique, hormones, pathologies)",
        "Pathologies et grossesse non prises en compte",
        "Composition corporelle influence le BMR réel",
      ],
      example: {
        title: "Homme 70 kg, 175 cm, 30 ans, activité légère",
        donnees: [
          "Poids : 70 kg",
          "Taille : 175 cm",
          "Âge : 30 ans",
          "Sexe : homme",
          "Activité : légère (1,375)",
        ],
        calcul: [
          "BMR = 10×70 + 6,25×175 − 5×30 + 5 = 700 + 1 093,75 − 150 + 5 = 1 649 kcal",
          "Besoins = 1 649 × 1,375 ≈ 2 267 kcal/jour",
          "Pour perdre : 2 267 − 400 ≈ 1 867 kcal/jour",
        ],
        resultat: "Besoins : ~2 267 kcal/jour (BMR : ~1 649 kcal).",
        interpretation:
          "Pour maintenir son poids, cet homme peut consommer environ 2 270 kcal par jour. Pour une perte progressive, viser 1 850 à 1 900 kcal.",
      },
      maillage: [
        { slug: "proteines-journalieres", label: "Protéines journalières" },
        { slug: "calculateur-imc", label: "Calculateur IMC" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
      ],
      conseils: [
        "Privilégiez les aliments nutritifs plutôt que les calories vides",
        "Ne descendez pas sous les seuils minimaux sans avis médical",
        "Consultez un diététicien pour un plan personnalisé",
        "Combinez avec un suivi des protéines pour préserver la masse musculaire",
      ],
      limites: [
        "Estimation standard — métabolisme réel variable",
        "Ne remplace pas un bilan nutritionnel professionnel",
      ],
    }),
    faq: buildFaq([
      {
        question: "BMR vs besoins totaux : quelle différence ?",
        answer:
          "Le BMR est le métabolisme au repos. Les besoins totaux incluent l'activité physique quotidienne.",
      },
      {
        question: "Comment perdre du poids efficacement ?",
        answer:
          "Déficit de 300 à 500 kcal/jour pour une perte de 0,3 à 0,5 kg par semaine, durable et saine.",
      },
      {
        question: "Comment gagner de la masse musculaire ?",
        answer:
          "Surplus de 200 à 300 kcal avec entraînement en force et apport protéique suffisant (1,6-2 g/kg).",
      },
      {
        question: "Mifflin-St Jeor ou Harris-Benedict ?",
        answer:
          "Mifflin-St Jeor est plus précise pour la population moderne. Harris-Benedict tend à surestimer.",
      },
      {
        question: "Facteur d'activité : comment choisir ?",
        answer:
          "Sédentaire : bureau sans sport. Légère : 1-3 séances/sem. Modérée : 3-5. Intense : 6-7. Très intense : athlète.",
      },
      {
        question: "Les calories des aliments sont exactes ?",
        answer:
          "Les valeurs nutritionnelles sont des moyennes. La digestion et l'absorption varient individuellement.",
      },
      {
        question: "Compter les calories est-il nécessaire ?",
        answer:
          "Utile pour objectifs précis (perte, prise de masse). Pour le maintien, une alimentation équilibrée peut suffire.",
      },
      {
        question: "Effet de l'âge sur les besoins ?",
        answer:
          "Le BMR diminue avec l'âge (perte de masse musculaire). L'activité physique aide à compenser.",
      },
      {
        question: "Besoins en grossesse ?",
        answer:
          "Augmentation progressive (+300 kcal/jour en fin de grossesse). Consultez un professionnel.",
      },
      {
        question: "Application pour suivre les calories ?",
        answer:
          "MyFitnessPal, Yazio, FatSecret — utiles mais ne remplacent pas un suivi professionnel si besoin.",
      },
    ]),
  },

  "date-accouchement": {
    content: buildRichContent({
      intro:
        "La date probable d'accouchement (DPA) est estimée à partir du premier jour de vos dernières règles, selon la règle de Naegele.",
      definition:
        "La date probable d'accouchement (DPA) est la date à laquelle une grossesse de 40 semaines (280 jours) devrait se terminer, calculée depuis le 1er jour des dernières règles.",
      objectif:
        "Ce simulateur calcule la DPA, le nombre de semaines de grossesse et les jours restants avant le terme.",
      variables: [
        "Jour, mois et année des dernières règles (DDR)",
        "Durée du cycle menstruel en jours (21 à 35, 28 par défaut)",
      ],
      formules: [
        p("DPA = Date des dernières règles + 280 jours + (Durée cycle − 28)."),
        p("Semaines de grossesse comptées depuis le 1er jour des dernières règles."),
        hl(
          "Précision",
          "Seulement 5 % des accouchements surviennent à la date exacte. Fourchette normale : ±2 semaines.",
        ),
      ],
      interpretation: [
        p("La DPA est une estimation — l'échographie du premier trimestre peut ajuster la date si écart > 5 jours."),
        p("Les semaines de grossesse (SA) sont comptées depuis les dernières règles, pas depuis la conception."),
        hl(
          "Échographie",
          "L'échographie de datation du 1er trimestre est la méthode la plus précise pour confirmer la DPA.",
        ),
      ],
      limitesCalcul: [
        "Estimation basée sur cycles réguliers — moins fiable si cycles irréguliers",
        "Ne remplace pas le suivi médical et les échographies",
        "Date du jour utilisée pour calculer les jours restants — variable selon la date de consultation",
      ],
      example: {
        title: "Dernières règles le 15 mars 2025, cycle de 28 jours",
        donnees: [
          "Dernières règles : 15 mars 2025",
          "Durée du cycle : 28 jours",
        ],
        calcul: [
          "Correction cycle = 28 − 28 = 0 jours",
          "DPA = 15 mars 2025 + 280 jours = 20 décembre 2025",
        ],
        resultat: "DPA estimée : 20 décembre 2025.",
        interpretation:
          "La grossesse devrait atteindre le terme vers le 20 décembre 2025. Un accouchement entre le 6 et le 3 janvier est considéré comme normal.",
      },
      maillage: [
        { slug: "calculateur-ovulation", label: "Calculateur ovulation" },
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
      ],
      conseils: [
        "Confirmez la DPA par échographie du premier trimestre",
        "Préparez votre dossier de maternité dès le 4e mois",
        "Suivez les consultations prénatales obligatoires",
        "Signalez tout signe avant terme (contractions, pertes) en urgence",
      ],
      limites: [
        "Estimation — échographie plus précise",
        "Cycles irréguliers : fiabilité réduite",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que la règle de Naegele ?",
        answer:
          "DPA = 1er jour des dernières règles + 7 jours − 3 mois + 1 an (équivalent à +280 jours).",
      },
      {
        question: "Échographie et DPA : quelle priorité ?",
        answer:
          "L'échographie du 1er trimestre peut ajuster la DPA si écart > 5 jours avec la règle de Naegele.",
      },
      {
        question: "Accouchement prématuré : quand s'inquiéter ?",
        answer:
          "Avant 37 semaines. Consultez en urgence si contractions régulières, pertes liquidiennes ou sang.",
      },
      {
        question: "Comment sont comptées les semaines de grossesse ?",
        answer:
          "Depuis le 1er jour des dernières règles (pas depuis la conception, qui survient ~2 semaines plus tard).",
      },
      {
        question: "Cycle de 35 jours : impact sur la DPA ?",
        answer:
          "La correction ajoute 7 jours (35 − 28). La DPA est décalée d'une semaine par rapport à un cycle de 28 jours.",
      },
      {
        question: "DPA et congé maternité ?",
        answer:
          "6 semaines avant et 10 semaines après la DPA pour un 1er enfant (durées variables selon situation).",
      },
      {
        question: "Peut-on accoucher après la DPA ?",
        answer:
          "Oui, jusqu'à 42 semaines. Au-delà, surveillance médicale renforcée et possible induction.",
      },
      {
        question: "Grossesse gémellaire : même calcul ?",
        answer:
          "La DPA est souvent identique mais l'accouchement survient fréquemment avant le terme (36-37 SA).",
      },
      {
        question: "FIV : comment calculer la DPA ?",
        answer:
          "Depuis la date de transfert ou ponction, avec des règles spécifiques. Le gynécologue calcule la DPA.",
      },
      {
        question: "Que préparer avant l'accouchement ?",
        answer:
          "Valise maternité, plan de naissance, cours de préparation, choix du pédiatre, organisation du retour.",
      },
    ]),
  },

  "calculateur-ovulation": {
    content: buildRichContent({
      intro:
        "Identifiez votre date d'ovulation et la fenêtre fertile pour planifier ou éviter une grossesse, selon la durée de votre cycle.",
      definition:
        "L'ovulation est la libération de l'ovule par l'ovaire. La fenêtre fertile est la période où une grossesse est possible, incluant les jours précédant l'ovulation.",
      objectif:
        "Ce simulateur estime la date d'ovulation et la fenêtre fertile (5 jours avant + jour de l'ovulation) selon le début du cycle.",
      variables: [
        "Date du 1er jour du cycle (début des règles)",
        "Durée du cycle en jours (21 à 35)",
      ],
      formules: [
        p("Ovulation ≈ Jour 1 du cycle + (Durée cycle − 14)."),
        p("Fenêtre fertile : 5 jours avant l'ovulation jusqu'au jour suivant l'ovulation."),
        hl(
          "Méthode",
          "Estimation pour cycles réguliers. Tests d'ovulation et température basale sont plus précis.",
        ),
      ],
      interpretation: [
        p("L'ovulation survient généralement 14 jours avant la prochaine règle, pas 14 jours après le début du cycle."),
        p("Les spermatozoïdes survivent 5 jours — la fenêtre fertile commence donc 5 jours avant l'ovulation."),
        hl(
          "Cycles irréguliers",
          "Si vos cycles varient de plus de 4 jours, cette méthode est moins fiable. Utilisez des tests LH.",
        ),
      ],
      limitesCalcul: [
        "Estimation pour cycles réguliers uniquement",
        "Stress, pathologies et médicaments peuvent décaler l'ovulation",
        "Ne constitue pas une méthode contraceptive fiable seule",
      ],
      example: {
        title: "Cycle de 28 jours, règles le 1er juin 2025",
        donnees: [
          "Début cycle : 1er juin 2025",
          "Durée du cycle : 28 jours",
        ],
        calcul: [
          "Jour ovulation = 28 − 14 = 14e jour du cycle",
          "Date ovulation ≈ 15 juin 2025",
          "Fenêtre fertile : 10 juin – 16 juin 2025",
        ],
        resultat: "Ovulation estimée : 15 juin. Fenêtre fertile : 10 – 16 juin.",
        interpretation:
          "Pour maximiser les chances de grossesse, avoir des rapports pendant la fenêtre fertile. Pour éviter une grossesse, des méthodes contraceptives fiables sont recommandées.",
      },
      maillage: [
        { slug: "date-accouchement", label: "Date d'accouchement" },
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "cycles-sommeil", label: "Cycles de sommeil" },
      ],
      conseils: [
        "Suivez la température basale pour confirmer l'ovulation",
        "Les tests d'ovulation détectent le pic de LH 24-48 h avant l'ovulation",
        "Cycles irréguliers : consultez un gynécologue",
        "Ne utilisez pas seul pour la contraception — efficacité limitée",
      ],
      limites: [
        "Méthode indicative — pas un diagnostic médical",
        "Contraception naturelle peu fiable sans suivi complet",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quand est la période fertile ?",
        answer:
          "5 jours avant l'ovulation et le jour de l'ovulation. Les spermatozoïdes survivent jusqu'à 5 jours.",
      },
      {
        question: "Ovulation et cycle de 28 jours ?",
        answer:
          "Ovulation généralement au 14e jour du cycle, environ 14 jours avant la prochaine règle.",
      },
      {
        question: "Cycles irréguliers : que faire ?",
        answer:
          "La prédiction est moins fiable. Utilisez tests d'ovulation, température basale ou suivi médical.",
      },
      {
        question: "Contraception naturelle : efficace ?",
        answer:
          "Méthode peu fiable seule (15-25 % d'échec). Consultez un professionnel pour des options plus sûres.",
      },
      {
        question: "Tests d'ovulation : comment ça marche ?",
        answer:
          "Détectent la hormone LH dans l'urine, qui augmente 24-48 h avant l'ovulation.",
      },
      {
        question: "Température basale : quelle méthode ?",
        answer:
          "Mesurez la température chaque matin au réveil. Une hausse de 0,2-0,5 °C confirme l'ovulation passée.",
      },
      {
        question: "Ovulation sans règles ?",
        answer:
          "Possible en cas d'anovulation ou de cycles irréguliers. Consultez si cycles > 35 jours ou < 21 jours.",
      },
      {
        question: "Glaire cervicale et ovulation ?",
        answer:
          "Glaire claire et filante (comme du blanc d'œuf) indique la période fertile.",
      },
      {
        question: "Peut-on ovuler deux fois dans un cycle ?",
        answer:
          "Rare. Deux ovulations le même jour peuvent produire des jumeaux. Ovulation espacée = grossesses différentes (très rare).",
      },
      {
        question: "Après la pilule : quand ovuler ?",
        answer:
          "L'ovulation peut reprendre dès le 1er cycle sans pilule, ou après plusieurs mois. Variable selon les femmes.",
      },
    ]),
  },

  "hydratation-quotidienne": {
    content: buildRichContent({
      intro:
        "Une hydratation suffisante soutient le métabolisme, la concentration et la performance physique. Estimez vos besoins quotidiens en eau.",
      definition:
        "L'hydratation quotidienne est la quantité d'eau (et de liquides) nécessaire chaque jour pour compenser les pertes et maintenir les fonctions corporelles.",
      objectif:
        "Ce simulateur calcule vos besoins en eau selon le poids, l'activité physique et le climat.",
      variables: [
        "Poids en kg",
        "Niveau d'activité physique (sédentaire, modérée +0,5 L, intense +1 L)",
        "Climat (normal ou chaud +0,5 L)",
      ],
      formules: [
        p("Base = Poids × 0,033 L (33 mL/kg/jour)."),
        p("Total = Base + Bonus activité + Bonus climat."),
        p("Verres (25 cl) = Arrondi supérieur de (Total ÷ 0,25)."),
        hl(
          "Signes d'hydratation",
          "Urine claire ou jaune pâle = bonne hydratation. Urine foncée = besoin d'eau.",
        ),
      ],
      interpretation: [
        p("L'eau des aliments (fruits, légumes, soupes) compte dans l'hydratation totale (~20 % des besoins)."),
        p("Buvez régulièrement dans la journée, pas seulement quand vous avez soif."),
        hl(
          "Sport",
          "Avant, pendant et après l'effort : 500 mL supplémentaires selon intensité et durée.",
        ),
      ],
      limitesCalcul: [
        "Besoins individuels variables (pathologies, médicaments, grossesse)",
        "Insuffisance cardiaque ou rénale : avis médical pour les quantités",
        "Ne distingue pas eau pure et autres liquides",
      ],
      example: {
        title: "Adulte de 70 kg, sédentaire, climat normal",
        donnees: [
          "Poids : 70 kg",
          "Activité : sédentaire",
          "Climat : normal",
        ],
        calcul: [
          "Base = 70 × 0,033 = 2,31 L",
          "Bonus activité = 0 L",
          "Bonus climat = 0 L",
          "Total = 2,31 L (~10 verres de 25 cl)",
        ],
        resultat: "Hydratation recommandée : 2,3 L/jour (~10 verres de 25 cl).",
        interpretation:
          "Pour un adulte sédentaire de 70 kg, viser 2 à 2,5 L par jour, en incluant l'eau des aliments. Augmentez en sport ou en chaleur.",
      },
      maillage: [
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "proteines-journalieres", label: "Protéines journalières" },
        { slug: "calculateur-imc", label: "Calculateur IMC" },
      ],
      conseils: [
        "Buvez un verre d'eau au réveil et avant chaque repas",
        "L'eau des aliments compte — fruits et légumes riches en eau",
        "Augmentez en sport, chaleur et altitude",
        "Limitez caféine et alcool qui augmentent les pertes",
      ],
      limites: [
        "Besoins variables selon pathologies",
        "Ne remplace pas un avis médical en cas de restriction hydrique",
      ],
    }),
    faq: buildFaq([
      {
        question: "Combien d'eau par jour pour un adulte ?",
        answer:
          "Environ 2 L pour un adulte moyen. 30 à 35 mL/kg de poids corporel comme repère.",
      },
      {
        question: "Eau ou autres liquides ?",
        answer:
          "L'eau est idéale. Thé et café comptent mais limitent la caféine. Évitez les sodas sucrés.",
      },
      {
        question: "Peut-on boire trop d'eau ?",
        answer:
          "Rare mais possible (hyponatrémie). Ne forcez pas au-delà des besoins, surtout pendant l'effort intense.",
      },
      {
        question: "Eau et sport : quand boire ?",
        answer:
          "500 mL avant l'effort, pendant (petites quantités) et après selon intensité et sudation.",
      },
      {
        question: "Eau du robinet ou bouteille ?",
        answer:
          "Eau du robinet en France est potable et contrôlée. Bouteille si préférence gustative ou eau locale non potable.",
      },
      {
        question: "Déshydratation : signes ?",
        answer:
          "Soif, urine foncée, fatigue, vertiges, bouche sèche. Consultez si symptômes persistants.",
      },
      {
        question: "Hydratation en grossesse ?",
        answer:
          "Besoins augmentés. Viser 2,5 à 3 L/jour. Consultez en cas de rétention d'eau excessive.",
      },
      {
        question: "Eau chaude ou froide ?",
        answer:
          "Pas de différence significative pour l'hydratation. Température selon préférence.",
      },
      {
        question: "Les fruits hydratent ?",
        answer:
          "Oui — concombre, tomate, melon, orange contiennent 85-95 % d'eau.",
      },
      {
        question: "Bouteille réutilisable : conseils ?",
        answer:
          "Nettoyez régulièrement. Inox ou verre préférables. Évitez plastique chauffé.",
      },
    ]),
  },

  "proteines-journalieres": {
    content: buildRichContent({
      intro:
        "Les protéines sont essentielles pour les muscles, la réparation tissulaire et l'immunité. Calculez vos besoins selon votre poids et vos objectifs.",
      definition:
        "Les protéines sont des macromolécules composées d'acides aminés, indispensables à la construction et la réparation des tissus corporels.",
      objectif:
        "Ce simulateur estime vos besoins quotidiens en grammes de protéines selon le poids et l'objectif (maintien, sport, musculation).",
      variables: [
        "Poids en kg",
        "Objectif : maintien (1,2 g/kg), sportif/perte (1,6 g/kg), musculation (2 g/kg)",
      ],
      formules: [
        p("Protéines/jour = Poids × g/kg selon objectif."),
        p("Par repas (3 repas) = Protéines/jour ÷ 3."),
        p("Équivalent viande = Protéines ÷ 25 (portion de 25 g de protéines)."),
        hl(
          "Sources",
          "Viande, poisson, œufs, légumineuses, tofu, produits laitiers, quinoa.",
        ),
      ],
      interpretation: [
        p("Distribuez les protéines sur les repas plutôt qu'en une seule prise massive."),
        p("En déficit calorique, un apport élevé (1,6-2 g/kg) aide à préserver la masse musculaire."),
        hl(
          "Pathologies rénales",
          "Consultez un médecin avant d'augmenter les protéines si insuffisance rénale connue.",
        ),
      ],
      limitesCalcul: [
        "Besoins individuels variables (âge, pathologies, niveau d'activité)",
        "Insuffisance rénale : restriction protéique possible — avis médical",
        "Qualité des protéines (acides aminés essentiels) non évaluée",
      ],
      example: {
        title: "Adulte de 75 kg, objectif sportif/perte",
        donnees: [
          "Poids : 75 kg",
          "Objectif : sportif / perte (1,6 g/kg)",
        ],
        calcul: [
          "Protéines/jour = 75 × 1,6 = 120 g",
          "Par repas (3) = 120 ÷ 3 = 40 g",
          "Équivalent = 120 ÷ 25 ≈ 5 portions",
        ],
        resultat: "Besoins protéines : 120 g/jour (~40 g/repas).",
        interpretation:
          "Viser 40 g de protéines par repas — équivalent à 150 g de poulet, 200 g de tofu ou 4 œufs. Combinez sources animales et végétales.",
      },
      maillage: [
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "calculateur-imc", label: "Calculateur IMC" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
      ],
      conseils: [
        "Distribuez les protéines sur petit-déjeuner, déjeuner et dîner",
        "Combinez sources animales et végétales pour tous les acides aminés",
        "Hydratez-vous suffisamment avec un apport protéique élevé",
        "Les légumineuses + céréales forment des protéines complètes",
      ],
      limites: [
        "Ne remplace pas un bilan nutritionnel",
        "Suppléments non nécessaires si alimentation suffisante",
      ],
    }),
    faq: buildFaq([
      {
        question: "Combien de protéines par jour ?",
        answer:
          "Minimum 0,8 g/kg. 1,2 à 2 g/kg selon activité et objectif (maintien, sport, musculation).",
      },
      {
        question: "Trop de protéines : danger ?",
        answer:
          "Au-delà de 2,5 g/kg, peu d'avantage supplémentaire. Risque rénal si pathologie préexistante.",
      },
      {
        question: "Protéines végétales : suffisantes ?",
        answer:
          "Légumineuses, tofu, tempeh, quinoa — combiner sources pour tous les acides aminés essentiels.",
      },
      {
        question: "Protéines et perte de poids ?",
        answer:
          "1,6 à 2 g/kg aide à préserver la masse musculaire en déficit calorique.",
      },
      {
        question: "Quand prendre des protéines après le sport ?",
        answer:
          "Dans les 2 h après l'effort, avec glucides, pour optimiser la récupération musculaire.",
      },
      {
        question: "Compléments protéinés : nécessaires ?",
        answer:
          "Non si l'alimentation couvre les besoins. Utiles si difficulté à atteindre les quotas.",
      },
      {
        question: "Protéines au petit-déjeuner ?",
        answer:
          "Recommandées pour la satiété et l'équilibre de la journée. Œufs, yaourt, fromage, légumineuses.",
      },
      {
        question: "Sénior : plus de protéines ?",
        answer:
          "Oui, 1,2 à 1,5 g/kg pour préserver la masse musculaire (sarcopénie).",
      },
      {
        question: "Végétarien : combien de protéines ?",
        answer:
          "Mêmes besoins qu'un omnivore. Varier légumineuses, tofu, tempeh, seitan, produits laitiers, œufs.",
      },
      {
        question: "Protéines et digestion ?",
        answer:
          "Augmentez progressivement. Fibres et hydratation aident à la digestion des apports élevés.",
      },
    ]),
  },

  "economies-arret-tabac": {
    content: buildRichContent({
      intro:
        "Arrêter le tabac améliore votre santé et libère un budget considérable. Calculez les économies réalisées et les cigarettes évitées.",
      definition:
        "L'arrêt du tabac élimine le coût quotidien des cigarettes et réduit progressivement les risques de maladies liées au tabagisme.",
      objectif:
        "Ce simulateur calcule l'économie financière totale et le nombre de cigarettes non fumées sur une période sans tabac.",
      variables: [
        "Nombre de cigarettes par jour",
        "Prix du paquet de 20 cigarettes en euros",
        "Durée sans tabac en jours",
      ],
      formules: [
        p("Coût/jour = (Cigarettes/jour ÷ 20) × Prix du paquet."),
        p("Économie totale = Coût/jour × Durée (jours)."),
        p("Cigarettes évitées = Cigarettes/jour × Durée."),
        hl(
          "Santé",
          "Après 1 an sans tabac : risque cardiovasculaire divisé par 2. Bénéfices respiratoires dès quelques semaines.",
        ),
      ],
      interpretation: [
        p("L'économie cumulée peut financer des projets importants sur plusieurs années."),
        p("Les cigarettes évitées illustrent l'impact sur votre santé respiratoire."),
        hl(
          "Aide",
          "Tabac Info Service (3989) et substituts nicotiniques augmentent les chances de succès.",
        ),
      ],
      limitesCalcul: [
        "Prix variable selon type de tabac et évolution des taxes",
        "Coûts santé futurs (soins, arrêts) non quantifiés",
        "Substituts nicotiniques non inclus dans l'économie",
      ],
      example: {
        title: "15 cigarettes/jour, 11 €/paquet, 1 an sans tabac",
        donnees: [
          "Cigarettes/jour : 15",
          "Prix paquet : 11 €",
          "Durée : 365 jours",
        ],
        calcul: [
          "Coût/jour = (15 ÷ 20) × 11 = 8,25 €",
          "Économie = 8,25 × 365 = 3 011 €",
          "Cigarettes évitées = 15 × 365 = 5 475",
        ],
        resultat: "Économie : ~3 011 € — 5 475 cigarettes évitées.",
        interpretation:
          "En un an, vous économisez plus de 3 000 € et évitez plus de 5 000 cigarettes. Sur 10 ans, l'économie dépasse 30 000 €.",
      },
      maillage: [
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
        { slug: "unites-alcool", label: "Unités d'alcool" },
      ],
      conseils: [
        "Contactez Tabac Info Service au 3989 (appel gratuit)",
        "Les substituts nicotiniques sont partiellement remboursés sur ordonnance",
        "Chaque tentative compte — persévérez après un échec",
        "Identifiez vos triggers et préparez des alternatives",
      ],
      limites: [
        "Estimation financière — ne couvre pas tous les coûts santé",
        "Prix du tabac évolutif selon les taxes",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quelle aide pour arrêter le tabac ?",
        answer:
          "Tabac Info Service (3989), remboursement partiel des substituts nicotiniques sur ordonnance, accompagnement tabacologique.",
      },
      {
        question: "Économies sur 10 ans ?",
        answer:
          "Multipliez l'économie annuelle — souvent plus de 30 000 € pour un fumeur moyen (15 cig/jour).",
      },
      {
        question: "Bénéfices santé après l'arrêt ?",
        answer:
          "Amélioration respiratoire dès quelques semaines. Risque cancer diminue sur long terme. Risque cardiaque ÷2 après 1 an.",
      },
      {
        question: "Substituts nicotiniques : efficaces ?",
        answer:
          "Gommes, patchs, pastilles — doublent les chances de succès. Remboursés en partie sur ordonnance.",
      },
      {
        question: "Arrêt brutal ou progressif ?",
        answer:
          "Les deux approches fonctionnent. L'arrêt brutal avec substituts est souvent recommandé.",
      },
      {
        question: "Reprise du tabac : que faire ?",
        answer:
          "Ne pas abandonner. Analysez les causes et retentez. Chaque période sans tabac compte pour la santé.",
      },
      {
        question: "Tabac et alcool : lien ?",
        answer:
          "Souvent associés. Arrêter l'un facilite l'arrêt de l'autre. Traitez les deux si nécessaire.",
      },
      {
        question: "Vapotage pour arrêter ?",
        answer:
          "Peut aider certains fumeurs. Pas sans risque. Discutez avec un professionnel de santé.",
      },
      {
        question: "Tabagisme passif : impact ?",
        answer:
          "Protéger les proches, surtout enfants. L'arrêt élimine le tabagisme passif pour votre entourage.",
      },
      {
        question: "Délai pour sentir les bienfaits ?",
        answer:
          "24 h : monoxyde de carbone normalisé. 2-12 semaines : circulation améliorée. 1-9 mois : toux et essoufflement réduits.",
      },
    ]),
  },

  "unites-alcool": {
    content: buildRichContent({
      intro:
        "Comprenez votre consommation d'alcool en unités d'alcool et comparez-la aux recommandations de Santé publique France.",
      definition:
        "Une unité d'alcool correspond à 10 g d'alcool pur — approximativement un verre standard de vin, une bière ou un spiritueux.",
      objectif:
        "Ce simulateur convertit vos consommations en unités d'alcool par jour et par semaine, avec un statut par rapport aux recommandations.",
      variables: [
        "Type de boisson : bière (5 %, 25 cl), vin (12 %, 10 cl) ou spiritueux (40 %, 3 cl)",
        "Nombre de verres par jour de consommation",
        "Nombre de jours par semaine",
      ],
      formules: [
        p("Chaque verre standard ≈ 1 unité d'alcool (10 g d'alcool pur)."),
        p("Unités/jour = Verres × 1 unité/verre."),
        p("Unités/semaine = Unités/jour × Jours/semaine."),
        hl(
          "Recommandations",
          "Maximum 10 verres/semaine, pas tous les jours. Pas plus de 2 verres par jour.",
        ),
      ],
      interpretation: [
        p("Au-dessus de 10 unités/semaine, vous dépassez les recommandations de Santé publique France."),
        p("L'alcool est calorique (~80 kcal/verre de vin) sans nutriments essentiels."),
        hl(
          "Zéro risque",
          "Santé publique France rappelle qu'aucune consommation n'est sans risque — moins c'est mieux.",
        ),
      ],
      limitesCalcul: [
        "Verres standard approximatifs — volumes réels variables",
        "Cocktails et bières fortes non modélisés précisément",
        "Recommandations Santé publique France — pas un diagnostic",
      ],
      example: {
        title: "2 verres de vin, 5 jours par semaine",
        donnees: [
          "Type : vin (12 %, 10 cl)",
          "Verres/jour : 2",
          "Jours/semaine : 5",
        ],
        calcul: [
          "Unités/jour = 2 × 1 = 2 unités",
          "Unités/semaine = 2 × 5 = 10 unités",
        ],
        resultat: "10 unités/semaine — Dans les recommandations (limite atteinte).",
        interpretation:
          "Vous êtes à la limite recommandée. Réduire à 4 jours ou 1-2 verres/jour diminuerait le risque. Alternez avec de l'eau.",
      },
      maillage: [
        { slug: "economies-arret-tabac", label: "Économies arrêt tabac" },
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
      ],
      conseils: [
        "Alternez chaque verre d'alcool avec un verre d'eau",
        "Évitez le binge drinking (consommation massive ponctuelle)",
        "Consultez si vous avez du mal à limiter votre consommation",
        "Les jours sans alcool sont bénéfiques pour la santé",
      ],
      limites: [
        "Verres standard simplifiés",
        "Ne remplace pas un accompagnement en cas d'addiction",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce qu'une unité d'alcool ?",
        answer:
          "10 g d'alcool pur — environ 1 verre de vin (10 cl), 1 bière (25 cl à 5 %) ou 1 shot (3 cl à 40 %).",
      },
      {
        question: "Limite recommandée en France ?",
        answer:
          "10 verres/semaine maximum, pas tous les jours. 2 verres maximum par jour.",
      },
      {
        question: "Alcool et calories ?",
        answer:
          "1 verre de vin ~80 kcal. L'alcool est calorique sans nutriments — impact sur le poids.",
      },
      {
        question: "Arrêt complet : recommandé ?",
        answer:
          "Aucune consommation est sans risque. Moins c'est mieux. Arrêt complet élimine les risques liés à l'alcool.",
      },
      {
        question: "Bière forte vs bière classique ?",
        answer:
          "Bière 8-10 % : 1 verre peut = 2 unités. Ce simulateur utilise la bière standard 5 %.",
      },
      {
        question: "Alcool et grossesse ?",
        answer:
          "Zéro alcool recommandé pendant la grossesse — aucun seuil de sécurité établi.",
      },
      {
        question: "Cocktails : combien d'unités ?",
        answer:
          "Variable selon spiritueux et volume. Un cocktail peut contenir 2-4 unités.",
      },
      {
        question: "Alcool et sommeil ?",
        answer:
          "L'alcool perturbe le sommeil même s'il facilite l'endormissement. Qualité de sommeil réduite.",
      },
      {
        question: "Dépendance : signes ?",
        answer:
          "Besoin d'augmenter les quantités, difficulté à s'arrêter, consommation matinale. Consultez un addictologue.",
      },
      {
        question: "Alcool et médicaments ?",
        answer:
          "Interactions nombreuses et dangereuses. Lisez les notices et consultez si vous prenez des médicaments.",
      },
    ]),
  },

  "cycles-sommeil": {
    content: buildRichContent({
      intro:
        "Réveillez-vous entre les cycles de sommeil pour plus de fraîcheur. Calculez l'heure idéale de coucher ou de réveil selon les cycles de 90 minutes.",
      definition:
        "Un cycle de sommeil dure environ 90 minutes et comprend plusieurs phases (léger, profond, REM). Réveil en fin de cycle = moins de somnolence.",
      objectif:
        "Ce simulateur calcule l'heure de coucher ou de réveil idéale en respectant un nombre de cycles complets plus 15 minutes d'endormissement.",
      variables: [
        "Heure de référence (réveil souhaité ou coucher)",
        "Mode : calculer le coucher ou le réveil",
        "Nombre de cycles (4 à 6, 5 recommandé = 7h30)",
      ],
      formules: [
        p("Durée sommeil = Nombre de cycles × 90 min + 15 min (endormissement)."),
        p("Mode réveil : Coucher = Heure réveil − Durée sommeil."),
        p("Mode coucher : Réveil = Heure coucher + Durée sommeil."),
        hl(
          "Cycles",
          "5 cycles = 7h30 de sommeil — optimal pour la plupart des adultes (7-9 h recommandés).",
        ),
      ],
      interpretation: [
        p("Si vous vous réveillez fatigué à 7h, essayez 6h30 ou 7h30 — vous réveillez peut-être en milieu de cycle."),
        p("La durée réelle des cycles varie (80-110 min) — ajustez selon votre expérience."),
        hl(
          "Routine",
          "Heures de coucher et réveil régulières améliorent la qualité du sommeil.",
        ),
      ],
      limitesCalcul: [
        "Durée de cycle variable individuellement",
        "Qualité du sommeil multifactorielle (stress, alimentation, écrans)",
        "15 min d'endormissement est une moyenne — ajustez si besoin",
      ],
      example: {
        title: "Réveil souhaité à 7h00, 5 cycles",
        donnees: [
          "Heure réveil : 7h00",
          "Mode : je veux me réveiller à…",
          "Cycles : 5 (90 min chacun)",
        ],
        calcul: [
          "Durée = 5 × 90 + 15 = 465 min = 7,75 h",
          "Coucher idéal = 7h00 − 7h45 = 23h15",
        ],
        resultat: "Coucher idéal : 23h15 (7,8 h de sommeil).",
        interpretation:
          "Pour se réveiller frais à 7h, couchez-vous vers 23h15. Si vous mettez plus de 15 min à vous endormir, essayez 23h00.",
      },
      maillage: [
        { slug: "calories-journalieres", label: "Calories journalières" },
        { slug: "hydratation-quotidienne", label: "Hydratation quotidienne" },
        { slug: "calculateur-ovulation", label: "Calculateur ovulation" },
      ],
      conseils: [
        "Routine régulière de coucher et réveil, même le week-end",
        "Évitez les écrans 1 h avant le coucher",
        "Chambre fraîche (18-19 °C), obscure et silencieuse",
        "Pas de caféine après 14h-16h",
      ],
      limites: [
        "Cycles de durée variable — expérimentez ±30 min",
        "Ne traite pas les troubles du sommeil (insomnie, apnée)",
      ],
    }),
    faq: buildFaq([
      {
        question: "Combien de cycles de sommeil ?",
        answer:
          "4 à 6 cycles recommandés. 5 cycles = 7h30 — optimal pour la plupart des adultes.",
      },
      {
        question: "Pourquoi 15 min d'endormissement ?",
        answer:
          "Délai moyen pour s'endormir. Ajustez à 20-30 min si vous mettez plus de temps.",
      },
      {
        question: "Réveil fatigué malgré 8 h ?",
        answer:
          "Vous réveillez peut-être en milieu de cycle. Essayez ±30 min ou un nombre de cycles différent.",
      },
      {
        question: "Sommeil et sport ?",
        answer:
          "Le sommeil est crucial pour la récupération musculaire et la performance. Priorisez 7-9 h.",
      },
      {
        question: "Cycles de 90 min : toujours exacts ?",
        answer:
          "Non, ils varient entre 80 et 110 min. La moyenne de 90 min est un repère pratique.",
      },
      {
        question: "Napper en journée ?",
        answer:
          "20-30 min max pour ne pas perturber le sommeil nocturne. Avant 15h idéalement.",
      },
      {
        question: "Écrans et sommeil ?",
        answer:
          "Lumière bleue retarde l'endormissement. Mode nuit ou arrêt 1 h avant le coucher.",
      },
      {
        question: "Insomnie : ce calculateur aide ?",
        answer:
          "Pour optimiser les heures. L'insomnie nécessite un avis médical et des approches spécifiques.",
      },
      {
        question: "Heure de coucher idéale adulte ?",
        answer:
          "Variable selon réveil souhaité. 22h-23h30 pour réveil 6h-7h avec 5 cycles.",
      },
      {
        question: "Sommeil et âge ?",
        answer:
          "Besoins similaires (7-9 h) mais structure change. Seniors : cycles plus courts, réveils nocturnes plus fréquents.",
      },
    ]),
  },
};
