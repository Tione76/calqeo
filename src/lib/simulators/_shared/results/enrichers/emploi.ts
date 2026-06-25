import {
  COTISATIONS_PATRONALES_DEFAUT,
  COTISATIONS_SALARIALES_DEFAUT,
  HEURES_LEGALES_SEMAINE,
  HEURES_SUP_MAJORATION_25,
  HEURES_SUP_MAJORATION_50,
  HEURES_SUP_SEUIL_25,
  JOURS_CONGES_PAR_MOIS,
  ARE_TAUX_JOURNALIER,
  SMIC_HORAIRE_BRUT,
  LICENCIEMENT_ANCIENNETE_MIN,
} from "@/lib/config/urssaf";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import {
  brutToNetMensuel,
  netToBrutMensuel,
  coutEmployeurMensuel,
  indemniteLicenciementLegale,
  ijssJournaliere,
  areJournaliere,
} from "../../payroll";
import type { ResultInterpretation } from "../../../types";
import {
  buildPatch,
  findValue,
  interpretThreshold,
  num,
  primaryFromLine,
  type Enricher,
} from "./helpers";

const enrichSalaireBrutNet: Enricher = (input, result) => {
  const brut = num(input.brut);
  const taux = num(input.tauxCotisations);
  const net = findValue(result, /net avant impôt|net/i) ?? brutToNetMensuel(brut, taux);
  const cotisations = brut - net;
  const pctPrelevement = brut > 0 ? (cotisations / brut) * 100 : 0;

  const interpretation = interpretThreshold(pctPrelevement, [
    {
      max: 20,
      level: "favorable",
      badge: "Léger",
      title: "Prélèvements modérés",
      message: `${formatPercent(pctPrelevement, 1)} de prélèvements — taux inférieur à la moyenne (~22 %).`,
    },
    {
      max: 24,
      level: "neutral",
      badge: "Standard",
      title: "Prélèvements habituels",
      message: `Proche du taux moyen de ${formatPercent(COTISATIONS_SALARIALES_DEFAUT, 0)} pour un salarié non cadre.`,
    },
    {
      max: Infinity,
      level: "intermediate",
      badge: "Élevé",
      title: "Prélèvements importants",
      message: "Taux supérieur à la moyenne — vérifiez votre statut cadre ou les cotisations spécifiques.",
    },
  ]);

  const brutPlus200 = brut + 200;
  const netPlus200 = brutToNetMensuel(brutPlus200, taux);

  return buildPatch(result, {
    primary: primaryFromLine(result, /net avant impôt|net/i, "Salaire net estimé"),
    narrative: `Un brut de ${formatCurrency(brut)}/mois avec ${formatPercent(taux, 0)} de cotisations salariales donne environ ${formatCurrency(net)} net avant impôt (${formatCurrency(cotisations)} de prélèvements).`,
    interpretation,
    advice: {
      title: "Affiner votre estimation net",
      items: [
        "Comparez avec votre bulletin de paie — mutuelle et titres-restaurant modifient le net",
        "Intégrez le prélèvement à la source pour connaître le montant réellement versé",
        "Le taux varie selon cadre/non-cadre, rémunération et convention collective",
        "Utilisez le simulateur net → brut pour préparer une négociation salariale",
      ],
    },
    comparisons: [
      {
        scenario: "Si le brut augmentait de 200 €",
        value: formatCurrency(netPlus200),
        detail: `+${formatCurrency(netPlus200 - net)} net/mois`,
      },
    ],
  });
};

const enrichSalaireNetBrut: Enricher = (input, result) => {
  const net = num(input.net);
  const taux = num(input.tauxCotisations);
  const brut = findValue(result, /brut estimé|brut/i) ?? netToBrutMensuel(net, taux);
  const ecart = brut - net;

  return buildPatch(result, {
    primary: primaryFromLine(result, /brut estimé|brut/i, "Salaire brut nécessaire"),
    narrative: `Pour percevoir ${formatCurrency(net)} net/mois, il faut environ ${formatCurrency(brut)} de brut (${formatCurrency(ecart)} de cotisations et CSG/CRDS).`,
    interpretation: {
      level: "neutral",
      badge: "Négociation",
      title: "Estimation pour contrat",
      message: "Utilisez ce brut comme base de discussion — arrondissez à la dizaine supérieure pour une marge.",
    },
    advice: {
      title: "Préparer votre négociation",
      items: [
        "Annoncez toujours le brut en entretien — c'est la référence légale du contrat",
        "Demandez aussi les avantages (mutuelle, tickets restaurant, prime variable)",
        "Vérifiez le net après prélèvement à la source avec le simulateur dédié",
        "Pour un temps partiel, proratisez avec le simulateur salaire temps partiel",
      ],
    },
    comparisons: [
      {
        scenario: `Si les cotisations passaient à ${formatPercent(COTISATIONS_SALARIALES_DEFAUT + 2, 0)}`,
        value: formatCurrency(netToBrutMensuel(net, COTISATIONS_SALARIALES_DEFAUT + 2)),
        detail: "Brut nécessaire recalculé (statut cadre)",
      },
    ],
  });
};

const enrichCoutTotalEmbauche: Enricher = (input, result) => {
  const brut = num(input.brut);
  const taux = num(input.tauxPatronal);
  const cout = findValue(result, /coût mensuel total/i) ?? coutEmployeurMensuel(brut, taux);
  const charges = cout - brut;
  const ratio = brut > 0 ? (charges / brut) * 100 : 0;

  const interpretation = interpretThreshold(ratio, [
    {
      max: 38,
      level: "favorable",
      badge: "Optimisé",
      title: "Charges patronales basses",
      message: `Charges de ${formatPercent(ratio, 0)} — inférieures à la moyenne (~${formatPercent(COTISATIONS_PATRONALES_DEFAUT, 0)}).`,
    },
    {
      max: 45,
      level: "neutral",
      badge: "Standard",
      title: "Coût employeur habituel",
      message: `Comptez environ ${formatPercent(COTISATIONS_PATRONALES_DEFAUT, 0)} de charges en plus du brut.`,
    },
    {
      max: Infinity,
      level: "intermediate",
      badge: "Élevé",
      title: "Charges patronales importantes",
      message: "Au-delà de 45 %, le coût d'embauche pèse — vérifiez les exonérations (apprenti, ZRR…).",
    },
  ]);

  const coutAnnuel = cout * 12;

  return buildPatch(result, {
    primary: primaryFromLine(result, /coût mensuel total/i),
    narrative: `Un salarié à ${formatCurrency(brut)} brut/mois coûte ${formatCurrency(cout)}/mois à l'employeur (${formatCurrency(charges)} de charges, ${formatPercent(taux, 0)}), soit ${formatCurrency(coutAnnuel)}/an.`,
    interpretation,
    advice: {
      title: "Maîtriser le coût d'embauche",
      items: [
        "Intégrez ce coût dans votre seuil de rentabilité ou business plan",
        "Renseignez-vous sur les aides à l'embauche (apprenti, senior, alternance)",
        "Comparez CDI, CDD et portage selon la durée du besoin",
        "N'oubliez pas les coûts indirects : bureau, matériel, formation",
      ],
    },
    comparisons: [
      {
        scenario: "Si le brut augmentait de 200 €",
        value: formatCurrency(coutEmployeurMensuel(brut + 200, taux)),
        detail: `+${formatCurrency(coutEmployeurMensuel(brut + 200, taux) - cout)}/mois pour l'employeur`,
      },
    ],
  });
};

const enrichIndemnitesLicenciement: Enricher = (input, result) => {
  const salaire = num(input.salaireBrut);
  const anc = num(input.anciennete);
  const indemnite = findValue(result, /indemnité légale/i) ?? indemniteLicenciementLegale(salaire, anc);
  const moisEquiv = salaire > 0 ? indemnite / salaire : 0;

  let interpretation: ResultInterpretation;
  if (anc < LICENCIEMENT_ANCIENNETE_MIN) {
    interpretation = {
      level: "warning",
      badge: "Non éligible",
      title: "Ancienneté insuffisante",
      message: `Moins de 8 mois d'ancienneté — pas d'indemnité légale minimale (sauf convention plus favorable).`,
    };
  } else if (moisEquiv >= 3) {
    interpretation = {
      level: "favorable",
      badge: "Substantiel",
      title: "Indemnité conséquente",
      message: `${formatNumber(moisEquiv, 1)} mois de salaire — vérifiez si la convention collective prévoit plus.`,
    };
  } else if (moisEquiv >= 1) {
    interpretation = {
      level: "intermediate",
      badge: "Standard",
      title: "Indemnité légale",
      message: "Montant minimum légal — votre convention ou un accord d'entreprise peut être plus généreux.",
    };
  } else {
    interpretation = {
      level: "intermediate",
      badge: "Modeste",
      title: "Indemnité faible",
      message: "Ancienneté récente — l'indemnité légale reste proportionnellement limitée.",
    };
  }

  const indemnitePlus2Ans = indemniteLicenciementLegale(salaire, anc + 2);

  return buildPatch(result, {
    primary: primaryFromLine(result, /indemnité légale/i),
    narrative: `Avec ${formatCurrency(salaire)} brut/mois et ${formatNumber(anc, 1)} ans d'ancienneté, l'indemnité légale minimale est d'environ ${formatCurrency(indemnite)} (${formatNumber(moisEquiv, 2)} mois de salaire).`,
    interpretation,
    advice: {
      title: "Après une estimation d'indemnité",
      items: [
        "Consultez votre convention collective — elle prévoit souvent plus que le minimum légal",
        "Vérifiez le salaire de référence (12 ou 3 derniers mois, prorata primes)",
        "Cumulez avec l'ARE et le solde de tout compte (congés, préavis)",
        "Faites valider par un avocat en droit du travail en cas de litige",
      ],
    },
    comparisons: [
      {
        scenario: "Avec 2 ans d'ancienneté supplémentaire",
        value: formatCurrency(indemnitePlus2Ans),
        detail: `+${formatCurrency(indemnitePlus2Ans - indemnite)} vs. scénario actuel`,
      },
    ],
    callouts: [
      {
        variant: "warning",
        title: "Cas particuliers exclus",
        text: "Licenciement fautif, départ retraite, rupture conventionnelle : barèmes et montants différents.",
      },
    ],
  });
};

const enrichCongesPayesAcquis: Enricher = (input, result) => {
  const mois = num(input.moisTravailles);
  const jpm = num(input.joursParMois);
  const jours = findValue(result, /jours ouvrables/i) ?? mois * jpm;
  const semaines = jours / 6;
  const plafondAnnuel = 30;

  const interpretation = interpretThreshold(jours, [
    {
      max: 10,
      level: "intermediate",
      badge: "Partiel",
      title: "Acquisition en cours",
      message: `${formatNumber(jours, 1)} jours acquis — période de référence incomplète ou entrée récente.`,
    },
    {
      max: 25,
      level: "favorable",
      badge: "En bonne voie",
      title: "Acquisition régulière",
      message: "Vous approchez du plafond annuel de 30 jours ouvrables (5 semaines).",
    },
    {
      max: Infinity,
      level: "favorable",
      badge: "Plafond",
      title: "Plafond atteint ou dépassé",
      message: "30 jours ouvrables maximum par période — les jours excédentaires ne s'accumulent pas.",
    },
  ]);

  const joursAnneeComplete = 12 * JOURS_CONGES_PAR_MOIS;

  return buildPatch(result, {
    primary: primaryFromLine(result, /jours ouvrables/i),
    narrative: `Sur ${mois} mois travaillés à ${jpm} jours/mois, vous avez acquis ${formatNumber(jours, 1)} jours ouvrables (≈ ${formatNumber(semaines, 1)} semaines).`,
    interpretation,
    advice: {
      title: "Gérer vos congés payés",
      items: [
        "Posez vos congés avant la fin de la période de référence (31 mai N+1 en droit commun)",
        "Les jours non pris peuvent être perdus — sauf accord entreprise ou report",
        "Vérifiez les jours supplémentaires prévus par votre convention collective",
        "En cas de départ, les congés non pris sont indemnisés (indemnité compensatrice)",
      ],
    },
    comparisons: [
      {
        scenario: "Sur une année complète (12 mois)",
        value: `${formatNumber(joursAnneeComplete, 1)} jours`,
        detail: `Plafond légal : ${plafondAnnuel} jours ouvrables`,
      },
    ],
  });
};

const enrichIjssArretMaladie: Enricher = (input, result) => {
  const brut = num(input.salaireBrut);
  const jours = num(input.joursArret);
  const ijssJour = findValue(result, /ijss journalière/i) ?? ijssJournaliere(brut);
  const total = ijssJour * jours;
  const netMensuel = brutToNetMensuel(brut, COTISATIONS_SALARIALES_DEFAUT);
  const perteJour = netMensuel / 30 - ijssJour;
  const tauxRemplacement = netMensuel > 0 ? (ijssJour * 30) / netMensuel : 0;

  const interpretation = interpretThreshold(tauxRemplacement * 100, [
    {
      max: 40,
      level: "warning",
      badge: "Faible",
      title: "Remplacement partiel",
      message: `Les IJSS couvrent environ ${formatPercent(tauxRemplacement * 100, 0)} du net — prévoyez une baisse de revenus.`,
    },
    {
      max: 55,
      level: "intermediate",
      badge: "Modéré",
      title: "Remplacement moyen",
      message: "Les IJSS remplacent environ la moitié du salaire net — complément employeur possible.",
    },
    {
      max: Infinity,
      level: "neutral",
      badge: "Standard",
      title: "Indemnisation Sécu",
      message: "50 % du salaire journalier brut plafonné — montant standard de la Sécurité sociale.",
    },
  ]);

  return buildPatch(result, {
    primary: primaryFromLine(result, /ijss journalière/i),
    narrative: `Avec ${formatCurrency(brut)} brut/mois, les IJSS sont d'environ ${formatCurrency(ijssJour)}/jour. Sur ${jours} jours indemnisés (hors carence), vous percevrez ${formatCurrency(total)}.`,
    interpretation,
    advice: {
      title: "Anticiper un arrêt maladie",
      items: [
        "3 jours de carence non indemnisés (sauf accord ou accident du travail)",
        "Vérifiez si votre employeur maintient le salaire (convention collective)",
        "Envisagez une prévoyance complémentaire pour combler l'écart avec le net",
        "Déclarez l'arrêt rapidement à l'Assurance maladie et transmettez l'avis à l'employeur",
      ],
    },
    comparisons: [
      {
        scenario: "Si l'arrêt durait 30 jours",
        value: formatCurrency(ijssJour * 30),
        detail: `Écart estimé vs. net : ${formatCurrency(perteJour * 30)}/mois`,
      },
    ],
  });
};

const enrichAllocationChomageAre: Enricher = (input, result) => {
  const brut = num(input.salaireBrutMensuel);
  const joursMois = num(input.joursIndemnises);
  const journalier = (brut * 12) / 365;
  const areJour = findValue(result, /are journalière/i) ?? areJournaliere(journalier);
  const areMois = areJour * joursMois;
  const netAvant = brutToNetMensuel(brut, COTISATIONS_SALARIALES_DEFAUT);
  const tauxRemplacement = netAvant > 0 ? areMois / netAvant : 0;

  const interpretation = interpretThreshold(tauxRemplacement * 100, [
    {
      max: 50,
      level: "intermediate",
      badge: "Modéré",
      title: "Remplacement partiel",
      message: `L'ARE représente environ ${formatPercent(tauxRemplacement * 100, 0)} de votre ancien net.`,
    },
    {
      max: 75,
      level: "favorable",
      badge: "Correct",
      title: "Indemnisation correcte",
      message: `${formatPercent(ARE_TAUX_JOURNALIER * 100, 0)} du SJBR appliqué — montant proche du plafond pour ce salaire.`,
    },
    {
      max: Infinity,
      level: "neutral",
      badge: "Plafonné",
      title: "ARE plafonnée",
      message: "Le montant est plafonné — France Travail calcule la durée et le montant exacts.",
    },
  ]);

  return buildPatch(result, {
    primary: primaryFromLine(result, /are mensuelle/i),
    narrative: `Avec un dernier salaire de ${formatCurrency(brut)} brut, l'ARE est estimée à ${formatCurrency(areJour)}/jour, soit ${formatCurrency(areMois)}/mois (${joursMois} jours).`,
    interpretation,
    advice: {
      title: "Optimiser votre indemnisation chômage",
      items: [
        "Faites la simulation officielle sur francetravail.fr pour le montant exact",
        "Actualisez votre situation chaque mois (revenus, reprise d'activité)",
        "Les indemnités de licenciement peuvent différer le début de l'ARE",
        "Profitez des formations financées pendant la période d'indemnisation",
      ],
    },
    comparisons: [
      {
        scenario: "Si votre dernier net était de référence",
        value: formatCurrency(netAvant),
        detail: `Écart mensuel estimé : ${formatCurrency(netAvant - areMois)}`,
      },
    ],
  });
};

const enrichHeuresSupplementaires: Enricher = (input, result) => {
  const taux = num(input.tauxHoraireBrut);
  const heures = num(input.heuresSup);
  const total = findValue(result, /total heures sup/i) ?? 0;
  const h25 = Math.min(heures, HEURES_SUP_SEUIL_25);
  const h50 = Math.max(0, heures - HEURES_SUP_SEUIL_25);
  const netEstime = brutToNetMensuel(total, COTISATIONS_SALARIALES_DEFAUT);

  const interpretation = interpretThreshold(heures, [
    {
      max: 8,
      level: "favorable",
      badge: "Modéré",
      title: "Heures sup maîtrisées",
      message: `${heures} h ce mois — majoration 25 % sur les ${HEURES_SUP_SEUIL_25} premières heures.`,
    },
    {
      max: 20,
      level: "intermediate",
      badge: "Soutenu",
      title: "Volume significatif",
      message: "Au-delà de 8 h, la majoration passe à 50 % — impact notable sur le bulletin.",
    },
    {
      max: Infinity,
      level: "warning",
      badge: "Intensif",
      title: "Charge de travail élevée",
      message: "Plus de 20 h sup/mois — vérifiez le respect du contingent annuel (220 h en droit commun).",
    },
  ]);

  const totalPlus5 =
    Math.min(heures + 5, HEURES_SUP_SEUIL_25) * taux * HEURES_SUP_MAJORATION_25 +
    Math.max(0, heures + 5 - HEURES_SUP_SEUIL_25) * taux * HEURES_SUP_MAJORATION_50;

  return buildPatch(result, {
    primary: primaryFromLine(result, /total heures sup/i),
    narrative: `${heures} h supplémentaires à ${formatCurrency(taux)}/h brut (${h25} h à +25 %, ${h50} h à +50 %) génèrent ${formatCurrency(total)} brut ce mois (~ ${formatCurrency(netEstime)} net).`,
    interpretation,
    advice: {
      title: "Heures supplémentaires et paie",
      items: [
        "Vérifiez que chaque heure sup est bien déclarée sur votre bulletin",
        "Le contingent annuel est de 220 h (au-delà : autorisation de l'inspection du travail)",
        "Les heures sup peuvent être récupérées en repos selon accord d'entreprise",
        "Cumulez avec le simulateur brut/net pour estimer l'impact sur le mois complet",
      ],
    },
    comparisons: [
      {
        scenario: "Avec 5 heures supplémentaires de plus",
        value: formatCurrency(totalPlus5),
        detail: `+${formatCurrency(totalPlus5 - total)} brut`,
      },
    ],
  });
};

const enrichSalaireTempsPartiel: Enricher = (input, result) => {
  const brutTP = num(input.brutTempsPlein);
  const heures = num(input.heuresHebdo);
  const taux = num(input.tauxCotisations);
  const ratio = heures / HEURES_LEGALES_SEMAINE;
  const brut = findValue(result, /salaire brut/i) ?? brutTP * ratio;
  const net = findValue(result, /net estimé|net/i) ?? brutToNetMensuel(brut, taux);

  const interpretation = interpretThreshold(ratio * 100, [
    {
      max: 50,
      level: "intermediate",
      badge: "Mi-temps",
      title: "Temps partiel significatif",
      message: `${formatPercent(ratio * 100, 0)} du temps plein — vérifiez vos droits (retraite, chômage, CMU).`,
    },
    {
      max: 80,
      level: "neutral",
      badge: "Partiel",
      title: "Temps partiel classique",
      message: "Prorata appliqué sur le brut temps plein — droits sociaux calculés au prorata.",
    },
    {
      max: Infinity,
      level: "favorable",
      badge: "Quasi plein",
      title: "Temps plein ou proche",
      message: "Vous êtes proche du temps plein — droits sociaux quasi équivalents.",
    },
  ]);

  const netTempsPlein = brutToNetMensuel(brutTP, taux);

  return buildPatch(result, {
    primary: primaryFromLine(result, /salaire brut/i),
    narrative: `Un contrat à ${heures} h/semaine (${formatPercent(ratio * 100, 0)} du temps plein) sur une base de ${formatCurrency(brutTP)} brut donne ${formatCurrency(brut)} brut et ${formatCurrency(net)} net/mois.`,
    interpretation,
    advice: {
      title: "Temps partiel : points de vigilance",
      items: [
        "Le temps partiel ne peut pas être imposé sans accord écrit du salarié",
        "Heures complémentaires possibles dans la limite du tiers du contrat",
        "Vérifiez le maintien des avantages (mutuelle, tickets restaurant) au prorata",
        "Comparez avec les aides (RSA activité, prime activité) si revenus modestes",
      ],
    },
    comparisons: [
      {
        scenario: "En temps plein (35 h)",
        value: formatCurrency(netTempsPlein),
        detail: `+${formatCurrency(netTempsPlein - net)} net/mois vs. temps partiel`,
      },
    ],
  });
};

const enrichSmicNet: Enricher = (input, result) => {
  const horaire = num(input.smicHoraire);
  const heures = num(input.heuresHebdo);
  const taux = num(input.tauxCotisations);
  const net = findValue(result, /smic net mensuel|net mensuel/i) ?? 0;
  const brut = findValue(result, /smic brut mensuel|brut mensuel/i) ?? horaire * heures * (52 / 12);
  const ecartSmic = horaire - SMIC_HORAIRE_BRUT;

  let interpretation: ResultInterpretation;
  if (Math.abs(ecartSmic) < 0.01 && heures === HEURES_LEGALES_SEMAINE) {
    interpretation = {
      level: "neutral",
      badge: "SMIC légal",
      title: "Salaire minimum",
      message: `${formatCurrency(net)}/mois net au SMIC ${formatCurrency(SMIC_HORAIRE_BRUT)}/h — référence pour aides et barèmes.`,
    };
  } else if (ecartSmic > 0) {
    interpretation = {
      level: "favorable",
      badge: "Au-dessus SMIC",
      title: "Au-dessus du minimum",
      message: `Taux horaire supérieur au SMIC légal (${formatCurrency(SMIC_HORAIRE_BRUT)}/h).`,
    };
  } else {
    interpretation = {
      level: "warning",
      badge: "Sous SMIC",
      title: "Vérification requise",
      message: "Le taux horaire est inférieur au SMIC — situation illégale sauf cas particuliers (apprenti).",
    };
  }

  return buildPatch(result, {
    primary: primaryFromLine(result, /smic net mensuel|net mensuel/i, "SMIC net mensuel"),
    narrative: `À ${formatCurrency(horaire)}/h brut pour ${heures} h/semaine, le net mensuel est d'environ ${formatCurrency(net)} (brut : ${formatCurrency(brut)}).`,
    interpretation,
    advice: {
      title: "Utiliser le SMIC net comme repère",
      items: [
        "Comparez votre salaire au SMIC net pour évaluer éligibilité aux aides (APL, prime activité)",
        "Le SMIC est réévalué au 1er janvier — mettez à jour le taux horaire",
        "Intégrez le prélèvement à la source pour le montant réellement versé",
        "Heures sup et primes s'ajoutent au SMIC de base",
      ],
    },
    comparisons: heures !== HEURES_LEGALES_SEMAINE
      ? [
          {
            scenario: `Au SMIC temps plein (${HEURES_LEGALES_SEMAINE} h)`,
            value: formatCurrency(
              brutToNetMensuel(SMIC_HORAIRE_BRUT * HEURES_LEGALES_SEMAINE * (52 / 12), taux)
            ),
            detail: "Net mensuel au SMIC légal 35 h",
          },
        ]
      : undefined,
  });
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "salaire-brut-net": enrichSalaireBrutNet,
  "salaire-net-brut": enrichSalaireNetBrut,
  "cout-total-embauche-salarie": enrichCoutTotalEmbauche,
  "indemnites-licenciement": enrichIndemnitesLicenciement,
  "conges-payes-acquis": enrichCongesPayesAcquis,
  "ijss-arret-maladie": enrichIjssArretMaladie,
  "allocation-chomage-are": enrichAllocationChomageAre,
  "heures-supplementaires": enrichHeuresSupplementaires,
  "salaire-temps-partiel": enrichSalaireTempsPartiel,
  "smic-net": enrichSmicNet,
};
