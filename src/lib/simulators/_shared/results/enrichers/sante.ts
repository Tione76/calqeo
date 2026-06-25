import { formatCurrency, formatNumber } from "@/lib/utils/format";
import type { ResultCallout, ResultInterpretation } from "../../../types";
import {
  type Enricher,
  lineNumber,
  lineText,
  num,
} from "./helpers";

const medicalCallout = (
  text: string,
  title = "Ne remplace pas un avis médical"
): ResultCallout => ({
  variant: "warning",
  title,
  text,
});

const enrichCalculateurImc: Enricher = (input, result) => {
  const poids = num(input.poids);
  const taille = num(input.taille);
  const imc = lineNumber(result, /imc/i) ?? 0;
  const categorie = lineText(result, /interpr/i) ?? "";

  let interpretation: ResultInterpretation;
  if (imc < 18.5) {
    interpretation = {
      level: "intermediate",
      badge: "Insuffisance",
      title: "IMC sous la norme OMS",
      message:
        "Votre IMC est inférieur à 18,5 — une évaluation médicale peut clarifier vos besoins nutritionnels.",
    };
  } else if (imc < 25) {
    interpretation = {
      level: "favorable",
      badge: "Normal",
      title: "Corpulence dans la norme",
      message: "Votre IMC se situe entre 18,5 et 25, zone considérée comme normale par l'OMS.",
    };
  } else if (imc < 30) {
    interpretation = {
      level: "intermediate",
      badge: "Surpoids",
      title: "Surpoids modéré",
      message:
        "Votre IMC indique un surpoids — l'activité physique et l'alimentation peuvent aider, avec un suivi adapté.",
    };
  } else {
    interpretation = {
      level: "warning",
      badge: "Obésité",
      title: "IMC élevé",
      message:
        "Votre IMC dépasse 30 — un professionnel de santé pourra proposer un bilan personnalisé.",
    };
  }

  const poidsIdeal = lineText(result, /poids id/i);

  return {
    ...result,
    primary: { label: "Votre IMC", value: lineText(result, /^imc$/i) ?? formatNumber(imc, 1) },
    narrative: `Avec ${poids} kg pour ${taille} cm, votre IMC est de ${formatNumber(imc, 1)}${categorie ? ` (${categorie})` : ""}.${poidsIdeal ? ` Un poids correspondant à un IMC de 22 serait d'environ ${poidsIdeal}.` : ""}`,
    interpretation,
    advice: {
      title: "Pour interpréter votre IMC",
      items: [
        "L'IMC ne distingue pas masse musculaire et masse grasse",
        "Sportifs musclés peuvent avoir un IMC élevé sans surpoids",
        "Combinez avec tour de taille et activité physique pour une vision plus complète",
      ],
    },
    callouts: [
      medicalCallout(
        "L'IMC est un indicateur général. Seul un médecin peut diagnostiquer un trouble du poids ou prescrire un suivi."
      ),
    ],
  };
};

const enrichPoidsIdeal: Enricher = (input, result) => {
  const taille = num(input.taille);
  const age = num(input.age);
  const homme = String(input.sexe) === "homme";
  const creff = lineNumber(result, /creff/i) ?? 0;
  const lorentz = lineNumber(result, /lorentz/i) ?? 0;
  const ecart = Math.abs(creff - lorentz);

  const interpretation: ResultInterpretation =
    ecart <= 5
      ? {
          level: "neutral",
          badge: "Cohérent",
          title: "Fourchettes convergentes",
          message:
            "Les formules Creff et Lorentz donnent des résultats proches — une marge de ±5 kg autour de cette zone est courante.",
        }
      : {
          level: "intermediate",
          badge: "Fourchette",
          title: "Écart entre formules",
          message: `Creff et Lorentz diffèrent de ${formatNumber(ecart, 1)} kg — normal compte tenu de l'âge et de la morphologie.`,
        };

  return {
    ...result,
    primary: {
      label: "Poids idéal Creff",
      value: lineText(result, /creff/i) ?? `${formatNumber(creff, 1)} kg`,
    },
    narrative: `Pour ${homme ? "un homme" : "une femme"} de ${taille} cm et ${age} ans, Creff estime ${formatNumber(creff, 1)} kg et Lorentz ${formatNumber(lorentz, 1)} kg.`,
    interpretation,
    advice: {
      title: "Comment utiliser ces chiffres",
      items: [
        "Visez une stabilisation plutôt qu'un chiffre exact au gramme près",
        "La composition corporelle (muscle, graisse) compte plus que le poids seul",
        "Un écart de ±5 kg autour du poids idéal est généralement sans conséquence",
      ],
    },
    callouts: [
      medicalCallout(
        "Ces formules sont indicatives. Un médecin ou diététicien peut fixer un objectif adapté à votre santé."
      ),
    ],
  };
};

const enrichCaloriesJournalieres: Enricher = (input, result) => {
  const besoins = lineNumber(result, /besoins/i) ?? 0;
  const bmr = lineNumber(result, /métabolisme|metabolisme/i) ?? 0;
  const perte = lineNumber(result, /perdre/i) ?? 0;
  const homme = String(input.sexe) === "homme";
  const plancher = homme ? 1500 : 1200;

  let interpretation: ResultInterpretation;
  if (perte < plancher) {
    interpretation = {
      level: "warning",
      badge: "Seuil bas",
      title: "Déficit trop agressif",
      message: `Un apport sous ${plancher} kcal/jour est déconseillé sans suivi médical — risque de carences.`,
    };
  } else if (besoins >= bmr * 1.55) {
    interpretation = {
      level: "favorable",
      badge: "Actif",
      title: "Besoins adaptés à l'activité",
      message: `Vos besoins (${formatNumber(besoins, 0)} kcal) intègrent un niveau d'activité régulier.`,
    };
  } else {
    interpretation = {
      level: "neutral",
      badge: "Estimation",
      title: "Besoins estimés",
      message: `Métabolisme de base ${formatNumber(bmr, 0)} kcal — besoins totaux ${formatNumber(besoins, 0)} kcal selon votre activité.`,
    };
  }

  return {
    ...result,
    primary: {
      label: "Besoins journaliers",
      value: lineText(result, /besoins/i) ?? `${formatNumber(besoins, 0)} kcal`,
    },
    narrative: `Avec ${num(input.poids)} kg, ${num(input.taille)} cm et ${num(input.age)} ans, vos besoins sont d'environ ${formatNumber(besoins, 0)} kcal/jour. Pour une perte progressive, visez ${formatNumber(perte, 0)} kcal (−400 kcal).`,
    interpretation,
    advice: {
      title: "Ajuster votre apport",
      items: [
        "Déficit de 300 à 500 kcal/jour pour une perte durable (~0,5 kg/semaine)",
        "Ne descendez pas sous 1 200 kcal (F) ou 1 500 kcal (H) sans avis médical",
        "Privilégiez les aliments riches en nutriments plutôt que les calories vides",
      ],
    },
    callouts: [
      medicalCallout(
        "Cette estimation (Mifflin-St Jeor) ne tient pas compte de pathologies, grossesse ou traitements. Consultez un diététicien pour un plan personnalisé."
      ),
    ],
  };
};

const enrichDateAccouchement: Enricher = (input, result) => {
  const joursRestants = lineNumber(result, /jours rest/i) ?? 0;
  const semaines = lineText(result, /semaines/i) ?? "";
  const dpa = lineText(result, /accouchement/i) ?? "";

  let interpretation: ResultInterpretation;
  if (joursRestants > 14) {
    interpretation = {
      level: "neutral",
      badge: "En cours",
      title: "Grossesse en cours",
      message: `${semaines} — la date probable reste une estimation (±2 semaines).`,
    };
  } else if (joursRestants > 0) {
    interpretation = {
      level: "intermediate",
      badge: "Terme proche",
      title: "Accouchement imminent",
      message: `Plus que ${joursRestants} jours estimés — préparez votre valise et vos démarches.`,
    };
  } else {
    interpretation = {
      level: "intermediate",
      badge: "Terme atteint",
      title: "Date dépassée",
      message:
        "La DPA est dépassée — c'est fréquent : seulement 5 % des accouchements ont lieu à la date exacte.",
    };
  }

  return {
    ...result,
    primary: {
      label: "Date probable d'accouchement",
      value: dpa,
    },
    narrative: `Dernières règles le ${lineText(result, /derni/i) ?? "—"}, cycle de ${num(input.dureeCycle)} jours : DPA estimée au ${dpa}.`,
    interpretation,
    advice: {
      title: "Suivi de grossesse",
      items: [
        "Confirmez la DPA par échographie du premier trimestre si possible",
        "Inscrivez-vous en maternité avant le 3e mois",
        "Consultez en urgence si contractions, perte de liquide ou diminution des mouvements",
      ],
    },
    callouts: [
      medicalCallout(
        "La règle de Naegele est une estimation. Seul votre gynécologue ou sage-femme fixe la date médicale de référence.",
        "Suivi médical obligatoire"
      ),
    ],
  };
};

const enrichCalculateurOvulation: Enricher = (input, result) => {
  const cycle = num(input.dureeCycle);
  const jourOvulation = cycle - 14;
  const fenetre = lineText(result, /fenêtre|fenetre/i) ?? "";

  const interpretation: ResultInterpretation =
    cycle >= 21 && cycle <= 35
      ? {
          level: "neutral",
          badge: "Estimation",
          title: "Fenêtre fertile estimée",
          message: `Ovulation probable autour du J${jourOvulation} — fenêtre fertile sur 6 à 7 jours.`,
        }
      : {
          level: "warning",
          badge: "Cycle atypique",
          title: "Prédiction moins fiable",
          message:
            "Cycle hors fourchette 21-35 jours — les tests d'ovulation ou un suivi médical sont recommandés.",
        };

  return {
    ...result,
    primary: {
      label: "Fenêtre fertile",
      value: fenetre,
    },
    narrative: `Sur un cycle de ${cycle} jours, l'ovulation est estimée au J${jourOvulation}. Fenêtre fertile : ${fenetre}.`,
    interpretation,
    advice: {
      title: "Affiner la détection",
      items: [
        "Tests d'ovulation (pic LH) plus fiables que le calendrier seul",
        "La température basale confirme l'ovulation a posteriori",
        "Stress, voyage et maladie peuvent décaler l'ovulation",
      ],
    },
    callouts: [
      {
        variant: "warning",
        title: "Pas une méthode contraceptive",
        text: "Ce calcul ne remplace ni un contraceptif ni un avis médical. Pour une contraception ou un projet de grossesse, consultez un professionnel.",
      },
    ],
  };
};

const enrichHydratationQuotidienne: Enricher = (input, result) => {
  const total = lineNumber(result, /eau recomm/i) ?? 0;
  const verres = lineNumber(result, /verres/i) ?? 0;
  const activite = num(input.activite);
  const climat = num(input.climat);

  let interpretation: ResultInterpretation;
  if (total < 1.5) {
    interpretation = {
      level: "intermediate",
      badge: "Modéré",
      title: "Apport modéré",
      message: `${formatNumber(total, 1)} L/jour — suffisant pour une activité légère, à ajuster selon la soif.`,
    };
  } else if (total <= 3) {
    interpretation = {
      level: "favorable",
      badge: "Adapté",
      title: "Hydratation adaptée",
      message: `Environ ${verres} verres de 25 cl — répartissez sur la journée plutôt qu'en une seule prise.`,
    };
  } else {
    interpretation = {
      level: "intermediate",
      badge: "Élevé",
      title: "Besoins augmentés",
      message:
        "Activité ou chaleur augmentent les besoins — buvez régulièrement, sans forcer au-delà de la soif.",
    };
  }

  const bonus = activite + climat;

  return {
    ...result,
    primary: {
      label: "Eau recommandée",
      value: lineText(result, /eau recomm/i) ?? `${formatNumber(total, 1)} L/jour`,
    },
    narrative: `Pour ${num(input.poids)} kg${bonus > 0 ? `, avec ${activite > 0 ? "activité physique" : ""}${activite > 0 && climat > 0 ? " et " : ""}${climat > 0 ? "climat chaud" : ""}` : ""}, visez ${formatNumber(total, 1)} L par jour (~${verres} verres).`,
    interpretation,
    advice: {
      title: "Bien s'hydrater",
      items: [
        "Urine claire = bonne hydratation ; foncée = buvez davantage",
        "L'eau des fruits et légumes compte dans l'apport total",
        "Augmentez avant, pendant et après l'effort physique",
      ],
    },
    callouts: [
      medicalCallout(
        "Insuffisance cardiaque, rénale ou autres pathologies : les besoins en eau diffèrent. Suivez les recommandations de votre médecin."
      ),
    ],
  };
};

const enrichProteinesJournalieres: Enricher = (input, result) => {
  const total = lineNumber(result, /protéines|proteines/i) ?? 0;
  const gPerKg = num(input.objectif);
  const parRepas = lineNumber(result, /repas/i) ?? total / 3;

  let interpretation: ResultInterpretation;
  if (gPerKg <= 1.2) {
    interpretation = {
      level: "neutral",
      badge: "Maintien",
      title: "Apport de maintien",
      message: `${formatNumber(total, 0)} g/jour (${gPerKg} g/kg) — adapté à une activité modérée.`,
    };
  } else if (gPerKg <= 1.6) {
    interpretation = {
      level: "favorable",
      badge: "Sportif",
      title: "Apport renforcé",
      message: `Niveau recommandé pour sportifs ou perte de poids en préservant la masse musculaire.`,
    };
  } else {
    interpretation = {
      level: "intermediate",
      badge: "Élevé",
      title: "Apport musculation",
      message: `${formatNumber(total, 0)} g/jour — au-delà de 2,5 g/kg, le gain musculaire supplémentaire est limité.`,
    };
  }

  return {
    ...result,
    primary: {
      label: "Protéines par jour",
      value: lineText(result, /protéines|proteines/i) ?? `${formatNumber(total, 0)} g`,
    },
    narrative: `Pour ${num(input.poids)} kg à ${gPerKg} g/kg, visez ${formatNumber(total, 0)} g par jour, soit ~${formatNumber(parRepas, 0)} g par repas (3 repas).`,
    interpretation,
    advice: {
      title: "Répartir les protéines",
      items: [
        "20-40 g par repas pour optimiser la synthèse musculaire",
        "Alternez viande, poisson, œufs, légumineuses et tofu",
        "Hydratez-vous suffisamment avec un apport protéique élevé",
      ],
    },
    callouts: [
      medicalCallout(
        "Insuffisance rénale ou autres pathologies : limitez l'apport protéique sur avis médical uniquement."
      ),
    ],
  };
};

const enrichEconomiesArretTabac: Enricher = (input, result) => {
  const economie = lineNumber(result, /économie|economie/i) ?? 0;
  const cigEvitees = lineNumber(result, /cigarettes/i) ?? 0;
  const duree = num(input.duree);
  const coutJour = lineNumber(result, /coût|cout/i) ?? 0;

  const interpretation: ResultInterpretation =
    duree >= 365
      ? {
          level: "favorable",
          badge: "Impact fort",
          title: "Économies significatives",
          message: `${formatCurrency(economie)} économisés et ${formatNumber(cigEvitees, 0)} cigarettes évitées — bénéfices santé dès les premières semaines.`,
        }
      : {
          level: "neutral",
          badge: "Projection",
          title: "Économies en cours",
          message: `À ${formatCurrency(coutJour)}/jour, la motivation financière s'accumule rapidement.`,
        };

  return {
    ...result,
    primary: {
      label: "Économie totale",
      value: lineText(result, /économie|economie/i) ?? formatCurrency(economie),
    },
    narrative: `${num(input.cigarettesJour)} cigarettes/jour à ${formatCurrency(num(input.prixPaquet))}/paquet : sur ${duree} jours sans tabac, vous économisez ${formatCurrency(economie)}.`,
    interpretation,
    advice: {
      title: "Pour arrêter durablement",
      items: [
        "Tabac Info Service : 39 89 (appel gratuit)",
        "Substituts nicotiniques remboursés sur ordonnance",
        "Après 1 an sans tabac, le risque cardiaque est divisé par 2",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bénéfices santé",
        text: "Amélioration respiratoire en quelques semaines. Seul un professionnel de santé peut accompagner un sevrage adapté à votre situation.",
      },
    ],
  };
};

const enrichUnitesAlcool: Enricher = (input, result) => {
  const parSemaine = lineNumber(result, /semaine/i) ?? 0;
  const parJour = lineNumber(result, /jour/i) ?? 0;
  const statut = lineText(result, /statut/i) ?? "";
  const conforme = statut.toLowerCase().includes("dans");

  let interpretation: ResultInterpretation;
  if (conforme && parJour <= 2) {
    interpretation = {
      level: "favorable",
      badge: "Conforme",
      title: "Dans les repères",
      message: `${formatNumber(parSemaine, 0)} unités/semaine — dans la limite des 10 verres recommandés par Santé publique France.`,
    };
  } else if (conforme) {
    interpretation = {
      level: "intermediate",
      badge: "Limite",
      title: "Proche du plafond",
      message: "Vous êtes dans la limite hebdomadaire mais dépassez souvent 2 verres/jour — à modérer.",
    };
  } else {
    interpretation = {
      level: "warning",
      badge: "Au-dessus",
      title: "Au-dessus des repères",
      message: `${formatNumber(parSemaine, 0)} unités/semaine dépasse les 10 verres max — risque accru pour la santé.`,
    };
  }

  const typeLabels: Record<string, string> = {
    biere: "bière",
    vin: "vin",
    spiritueux: "spiritueux",
  };

  return {
    ...result,
    primary: {
      label: "Unités par semaine",
      value: lineText(result, /semaine/i) ?? formatNumber(parSemaine, 0),
    },
    narrative: `${num(input.quantite)} verres de ${typeLabels[String(input.type)] ?? "alcool"}, ${num(input.frequence)} jours/semaine : ${formatNumber(parSemaine, 0)} unités/semaine (${statut.toLowerCase()}).`,
    interpretation,
    advice: {
      title: "Réduire les risques",
      items: [
        "Maximum 10 verres/semaine, pas tous les jours",
        "Pas plus de 2 verres par occasion",
        "Alternez chaque verre avec un verre d'eau",
      ],
    },
    callouts: [
      medicalCallout(
        "Aucune consommation d'alcool n'est sans risque. En cas de difficulté à limiter, parlez-en à votre médecin ou appelez Alcool Info Service (0 980 980 930)."
      ),
    ],
  };
};

const enrichCyclesSommeil: Enricher = (input, result) => {
  const cycles = num(input.cycles);
  const mode = String(input.mode);
  const heureCible = lineText(result, mode === "reveil" ? /coucher/i : /réveil|reveil/i) ?? "";
  const duree = lineNumber(result, /durée|duree/i) ?? (cycles * 90 + 15) / 60;

  let interpretation: ResultInterpretation;
  if (cycles >= 5 && duree >= 7) {
    interpretation = {
      level: "favorable",
      badge: "Optimal",
      title: "Durée recommandée",
      message: `${cycles} cycles (${formatNumber(duree, 1)} h) — dans la fourchette 7-9 h pour un adulte.`,
    };
  } else if (cycles >= 4) {
    interpretation = {
      level: "intermediate",
      badge: "Minimum",
      title: "Sommeil un peu court",
      message: `${formatNumber(duree, 1)} h — acceptable ponctuellement, mais visez 5 cycles (7h30) si possible.`,
    };
  } else {
    interpretation = {
      level: "warning",
      badge: "Insuffisant",
      title: "Sommeil insuffisant",
      message: `Moins de 6 h (${formatNumber(duree, 1)} h) — risque de fatigue et baisse de concentration.`,
    };
  }

  return {
    ...result,
    primary: {
      label: mode === "reveil" ? "Heure de coucher idéale" : "Heure de réveil idéale",
      value: heureCible,
    },
    narrative:
      mode === "reveil"
        ? `Pour vous réveiller à ${num(input.heure)}h${String(num(input.minutes)).padStart(2, "0")} après ${cycles} cycles de 90 min (+ 15 min d'endormissement), couchez-vous vers ${heureCible}.`
        : `En vous couchant à ${num(input.heure)}h${String(num(input.minutes)).padStart(2, "0")} pour ${cycles} cycles, réveillez-vous vers ${heureCible}.`,
    interpretation,
    advice: {
      title: "Améliorer la qualité du sommeil",
      items: [
        "Routine de coucher régulière, même le week-end",
        "Écrans coupés 1 h avant le coucher",
        "Chambre fraîche (18-19 °C), obscure et silencieuse",
      ],
    },
    callouts: [
      medicalCallout(
        "Les cycles durent 80 à 110 min selon les personnes. En cas d'insomnie chronique ou d'apnée suspectée, consultez un médecin du sommeil.",
        "Indicateur général"
      ),
    ],
  };
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "calculateur-imc": enrichCalculateurImc,
  "poids-ideal": enrichPoidsIdeal,
  "calories-journalieres": enrichCaloriesJournalieres,
  "date-accouchement": enrichDateAccouchement,
  "calculateur-ovulation": enrichCalculateurOvulation,
  "hydratation-quotidienne": enrichHydratationQuotidienne,
  "proteines-journalieres": enrichProteinesJournalieres,
  "economies-arret-tabac": enrichEconomiesArretTabac,
  "unites-alcool": enrichUnitesAlcool,
  "cycles-sommeil": enrichCyclesSommeil,
};
