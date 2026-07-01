import { mensualiteCreditConsommation } from "../../../general/finance";
import {
  PFU_TAUX_GLOBAL,
  PEA_PS_APRES_5_ANS,
  PEA_DUREE_FISCALITE_MIN,
  getBaremeKilometriqueCoeff,
  BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE,
} from "@/lib/config/fiscalite";
import { LIVRET_A_PLAFOND, RETRAITE_TAUX_RETRAIT_DURABLE } from "@/lib/config/retraite";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  monthlyPaymentFromLoan,
} from "@/lib/utils/format";
import type { ResultComparison, ResultInterpretation } from "../../../types";
import {
  buildPatch,
  findLine,
  findValue,
  interpretThreshold,
  mergeResult,
  num,
  parseFormattedNumber,
  primaryFromLine,
  type Enricher,
} from "./helpers";

function creditConsoTauxInterpretation(taux: number): ResultInterpretation {
  if (taux < 3) {
    return {
      level: "favorable",
      badge: "Attractif",
      title: "Taux attractif",
      message: `À ${formatPercent(taux, 1)}, ce taux se situe dans une fourchette compétitive pour un crédit consommation.`,
    };
  }
  if (taux < 5) {
    return {
      level: "favorable",
      badge: "Correct",
      title: "Taux correct",
      message: `Un taux de ${formatPercent(taux, 1)} reste raisonnable — comparez tout de même le TAEG de plusieurs organismes.`,
    };
  }
  if (taux <= 7) {
    return {
      level: "intermediate",
      badge: "Moyen",
      title: "Taux dans la moyenne",
      message: `Un taux de ${formatPercent(taux, 1)} est courant pour un crédit consommation — comparez le TAEG de plusieurs organismes avant de signer.`,
    };
  }
  return {
    level: "warning",
    badge: "Élevé",
    title: "Taux élevé",
    message: `Au-delà de 7-8 %, le coût du crédit pèse fortement sur le budget — négociez ou réduisez le montant emprunté.`,
  };
}

const enrichMensualiteCreditConsommation: Enricher = (input, result) => {
  const montant = num(input.montant);
  const taux = num(input.taux);
  const duree = num(input.duree);

  const computed = mensualiteCreditConsommation.calculate({ montant, taux, duree });

  const readAmount = (pattern: RegExp | string): number => {
    const fromComputed = findValue(computed, pattern);
    if (fromComputed != null) return fromComputed;
    if (result.primary && new RegExp(typeof pattern === "string" ? pattern : pattern.source, "i").test(result.primary.label)) {
      return parseFormattedNumber(result.primary.value.replace(/\/mois$/i, "")) ?? 0;
    }
    return findValue(result, pattern) ?? 0;
  };

  const mensualite = readAmount(/mensualit/i);
  const total = readAmount(/coût total/i);
  const interets = readAmount(/intérêts|interets/i);
  const mensualiteAffichage = `${formatCurrency(mensualite)}/mois`;

  const computedTaux6 = mensualiteCreditConsommation.calculate({
    montant,
    taux: 6,
    duree,
  });
  const mensualiteTaux6 = findValue(computedTaux6, /mensualit/i) ?? 0;

  const dureePlus1 = duree + 1;
  const computedDureeAlt =
    dureePlus1 <= 10
      ? mensualiteCreditConsommation.calculate({ montant, taux, duree: dureePlus1 })
      : null;
  const mensualiteDureeAlt = computedDureeAlt
    ? findValue(computedDureeAlt, /mensualit/i) ?? 0
    : 0;
  const totalDureeAlt = computedDureeAlt
    ? findValue(computedDureeAlt, /coût total/i) ?? 0
    : 0;

  const ecartMensualite = (alt: number) => alt - mensualite;
  const formatEcartMensualite = (alt: number) => {
    const ecart = ecartMensualite(alt);
    return `environ ${ecart >= 0 ? "+" : ""}${formatCurrency(ecart)}/mois`;
  };

  const narrative = `Pour emprunter ${formatCurrency(montant)} sur ${duree} ans à ${formatPercent(taux, 1)}, votre mensualité est d'environ ${mensualiteAffichage}. Le coût total du crédit est estimé à ${formatCurrency(total)}, soit ${formatCurrency(interets)} d'intérêts.`;

  const tauxMensuel = taux / 12;
  const calculMensualiteText = [
    `Montant emprunté : ${formatCurrency(montant)}`,
    `Taux annuel : ${formatPercent(taux, 1)}`,
    `Taux mensuel : ${formatPercent(tauxMensuel, 2)}`,
    `Durée : ${duree * 12} mois`,
    `Mensualité estimée : ${mensualiteAffichage}`,
    `Coût total : ${formatCurrency(total)}`,
    `Intérêts totaux : ${formatCurrency(interets)}`,
  ].join(" · ");

  const comparisons: ResultComparison[] = [
    {
      scenario: "Mensualité actuelle",
      value: mensualiteAffichage,
      detail: `${formatPercent(taux, 1)} sur ${duree} ans`,
    },
    {
      scenario: "Si le taux passait à 6,0 %",
      value: `${formatCurrency(mensualiteTaux6)}/mois`,
      detail: `Écart : ${formatEcartMensualite(mensualiteTaux6)}`,
    },
  ];

  if (computedDureeAlt) {
    comparisons.push({
      scenario: `Si la durée passait à ${dureePlus1} ans`,
      value: `${formatCurrency(mensualiteDureeAlt)}/mois`,
      detail: `Écart : ${formatEcartMensualite(mensualiteDureeAlt)} · coût total ${formatCurrency(totalDureeAlt)}`,
    });
  }

  return mergeResult(result, {
    primary: { label: "Mensualité estimée", value: mensualiteAffichage },
    narrative,
    interpretation: creditConsoTauxInterpretation(taux),
    advice: {
      title: "Optimiser ce crédit consommation",
      items: [
        "Comparez le TAEG, pas seulement le taux nominal, auprès d'au moins 3 organismes",
        "Vérifiez les frais de dossier inclus ou non dans le TAEG",
        "Vérifiez si l'assurance emprunteur est facultative sur ce type de prêt",
        "Testez plusieurs durées pour arbitrer entre mensualité et coût total",
        "Anticipez l'impact sur votre reste à vivre avant de signer",
        "Vérifiez les conditions de remboursement anticipé",
      ],
    },
    lines: [
      { label: "Mensualité estimée", value: mensualiteAffichage },
      ...computed.lines.filter((line) => !line.highlight),
    ],
    comparisons,
    callouts: [
      {
        variant: "note",
        title: "Comment est calculée votre mensualité ?",
        text: calculMensualiteText,
      },
    ],
  });
};

function compoundCapital(
  initial: number,
  mensuel: number,
  rendementPct: number,
  annees: number
): number {
  const r = rendementPct / 100 / 12;
  const mois = annees * 12;
  let capital = initial;
  for (let i = 0; i < mois; i++) {
    capital = capital * (1 + r) + mensuel;
  }
  return capital;
}

const enrichInteretsComposes: Enricher = (input, result) => {
  const initial = num(input.capitalInitial);
  const mensuel = num(input.versementMensuel);
  const rendement = num(input.rendement);
  const duree = num(input.duree);
  const capitalFinal = findValue(result, /capital final/i) ?? 0;
  const gains = findValue(result, /gains/i) ?? 0;
  const ratioGains = capitalFinal > 0 ? (gains / capitalFinal) * 100 : 0;

  const interpretation = interpretThreshold(ratioGains, [
    {
      max: 25,
      level: "intermediate",
      badge: "Débutant",
      title: "Effet temps limité",
      message: "Les gains restent modestes — allonger la durée ou augmenter les versements accélérera la capitalisation.",
    },
    {
      max: 45,
      level: "favorable",
      badge: "Solide",
      title: "Capitalisation en bonne voie",
      message: "Les intérêts composés représentent une part significative de votre capital final.",
    },
    {
      max: Infinity,
      level: "favorable",
      badge: "Excellent",
      title: "Effet boule de neige",
      message: "Plus de la moitié de votre capital provient des intérêts — l'effet temps joue pleinement.",
    },
  ]);

  const capDouble = compoundCapital(initial, mensuel * 2, rendement, duree);
  const capPlus5 = compoundCapital(initial, mensuel, rendement, duree + 5);

  return buildPatch(result, {
    primary: primaryFromLine(result, /capital final/i),
    narrative: `Avec ${formatCurrency(initial)} de départ, ${formatCurrency(mensuel)}/mois de versements et ${formatPercent(rendement, 1)} de rendement sur ${duree} ans, votre capital atteindrait ${formatCurrency(capitalFinal)} dont ${formatCurrency(gains)} de gains.`,
    interpretation,
    advice: {
      title: "Maximiser les intérêts composés",
      items: [
        "Automatisez vos versements mensuels pour ne rien oublier",
        "Réinvestissez dividendes et intérêts plutôt que de les retirer",
        "Augmentez les versements à chaque hausse de revenus, même modeste",
        "Diversifiez selon votre horizon (liquidités, actions, immobilier)",
      ],
    },
    comparisons: [
      {
        scenario: "Si vous doubliez le versement mensuel",
        value: formatCurrency(capDouble),
        detail: `+${formatCurrency(capDouble - capitalFinal)} vs. scénario actuel`,
      },
      {
        scenario: `Si la durée passait à ${duree + 5} ans`,
        value: formatCurrency(capPlus5),
        detail: `+${formatCurrency(capPlus5 - capitalFinal)} de capital final`,
      },
    ],
  });
};

const enrichSimulateurInflation: Enricher = (input, result) => {
  const capital = num(input.capital);
  const inflation = num(input.inflation);
  const duree = num(input.duree);
  const valeurReelle = findValue(result, /pouvoir d'achat/i) ?? 0;
  const perte = capital - valeurReelle;
  const pctPerte = capital > 0 ? (perte / capital) * 100 : 0;

  const interpretation = interpretThreshold(pctPerte, [
    {
      max: 15,
      level: "intermediate",
      badge: "Modéré",
      title: "Érosion limitée",
      message: `Sur ${duree} ans, votre capital perd environ ${formatPercent(pctPerte, 0)} de pouvoir d'achat.`,
    },
    {
      max: 30,
      level: "warning",
      badge: "Attention",
      title: "Érosion significative",
      message: `${formatCurrency(perte)} de valeur réelle — l'épargne non placée s'érode rapidement.`,
    },
    {
      max: Infinity,
      level: "warning",
      badge: "Critique",
      title: "Perte d'achat importante",
      message: "Plus d'un tiers de votre pouvoir d'achat disparaît — un placement indexé sur l'inflation s'impose.",
    },
  ]);

  const inflationAlt = inflation + 1;
  const valeurAlt = capital / Math.pow(1 + inflationAlt / 100, duree);

  return buildPatch(result, {
    primary: primaryFromLine(result, /pouvoir d'achat/i),
    narrative: `Vos ${formatCurrency(capital)} aujourd'hui vaudront l'équivalent de ${formatCurrency(valeurReelle)} dans ${duree} ans avec une inflation de ${formatPercent(inflation, 1)}/an.`,
    interpretation,
    advice: {
      title: "Protéger votre pouvoir d'achat",
      items: [
        "Ne laissez pas de grosses sommes dormir sur un compte courant",
        "Orientez-vous vers des actifs qui battent l'inflation (actions, immobilier)",
        "Réévaluez vos objectifs d'épargne tous les 2-3 ans",
        "Combinez liquidités (Livret A) et placements long terme selon vos besoins",
      ],
    },
    comparisons: [
      {
        scenario: `Si l'inflation passait à ${formatPercent(inflationAlt, 1)}/an`,
        value: formatCurrency(valeurAlt),
        detail: `${formatCurrency(valeurReelle - valeurAlt)} de moins qu'au scénario actuel`,
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "L'inflation n'est pas uniforme",
        text: "L'énergie et l'alimentation peuvent augmenter plus vite que la moyenne — adaptez votre budget réel.",
      },
    ],
  });
};

const enrichBudgetResteAVivre: Enricher = (input, result) => {
  const revenus = num(input.revenus);
  const logement = num(input.logement);
  const credits = num(input.credits);
  const chargesFixes = num(input.chargesFixes);
  const reste = findValue(result, /reste à vivre/i) ?? revenus - logement - credits - chargesFixes;
  const ratio = revenus > 0 ? (reste / revenus) * 100 : 0;

  const interpretation = interpretThreshold(reste, [
    {
      max: 800,
      level: "warning",
      badge: "Insuffisant",
      title: "Reste à vivre tendu",
      message: `${formatCurrency(reste)}/mois est en dessous du seuil bancaire courant (800-1 200 €/adulte).`,
    },
    {
      max: 1200,
      level: "intermediate",
      badge: "Limite",
      title: "Marge réduite",
      message: "Votre reste à vivre reste acceptable mais limite pour un nouveau crédit.",
    },
    {
      max: Infinity,
      level: "favorable",
      badge: "Confortable",
      title: "Budget équilibré",
      message: `${formatCurrency(reste)}/mois laisse une marge confortable pour loisirs et épargne.`,
    },
  ]);

  const resteLogementReduit = revenus - (logement - 100) - credits - chargesFixes;

  return buildPatch(result, {
    primary: primaryFromLine(result, /reste à vivre/i),
    narrative: `Sur ${formatCurrency(revenus)} nets, après ${formatCurrency(logement)} de logement, ${formatCurrency(credits)} de crédits et ${formatCurrency(chargesFixes)} de charges fixes, il vous reste ${formatCurrency(reste)}/mois (${formatPercent(ratio, 0)} des revenus).`,
    interpretation,
    advice: {
      title: "Améliorer votre reste à vivre",
      items: [
        "Renégociez assurance habitation, mobile et énergie (comparateurs en ligne)",
        "Regroupez ou remboursez par anticipation les crédits les plus chers",
        "Listez les abonnements inutilisés à résilier",
        "Visez un reste à vivre d'au moins 1 000 € par adulte avant un nouvel emprunt",
      ],
    },
    comparisons: [
      {
        scenario: "Si le logement baissait de 100 €/mois",
        value: formatCurrency(resteLogementReduit),
        detail: `+${formatCurrency(100)}/mois de reste à vivre`,
      },
    ],
  });
};

const enrichSimulateurRetraite: Enricher = (input, result) => {
  const ageActuel = num(input.ageActuel);
  const ageRetraite = num(input.ageRetraite);
  const capitalActuel = num(input.capitalActuel);
  const mensuel = num(input.versementMensuel);
  const rendement = num(input.rendement);
  const annees = Math.max(0, ageRetraite - ageActuel);
  const capital = findValue(result, /capital estimé/i) ?? 0;
  const retrait = findValue(result, /retrait mensuel/i) ?? (capital * RETRAITE_TAUX_RETRAIT_DURABLE) / 12;

  const interpretation = interpretThreshold(retrait, [
    {
      max: 1000,
      level: "warning",
      badge: "Insuffisant",
      title: "Complément limité",
      message: `Un retrait de ${formatCurrency(retrait)}/mois complète peu les pensions — augmentez les versements.`,
    },
    {
      max: 2000,
      level: "intermediate",
      badge: "Correct",
      title: "Complément utile",
      message: "Ce capital apporte un revenu complémentaire notable à vos pensions légales.",
    },
    {
      max: Infinity,
      level: "favorable",
      badge: "Solide",
      title: "Épargne retraite confortable",
      message: `La règle des ${formatPercent(RETRAITE_TAUX_RETRAIT_DURABLE * 100, 0)} permet un retrait durable de ${formatCurrency(retrait)}/mois.`,
    },
  ]);

  const mois = annees * 12;
  const r = rendement / 100 / 12;
  let capPlus50 = capitalActuel;
  for (let i = 0; i < mois; i++) {
    capPlus50 = capPlus50 * (1 + r) + mensuel + 50;
  }
  const retraitPlus50 = (capPlus50 * RETRAITE_TAUX_RETRAIT_DURABLE) / 12;

  return buildPatch(result, {
    primary: primaryFromLine(result, /capital estimé/i),
    narrative: `À ${ageActuel} ans avec ${formatCurrency(capitalActuel)} déjà épargnés et ${formatCurrency(mensuel)}/mois jusqu'à ${ageRetraite} ans (${annees} ans, ${formatPercent(rendement, 1)}), vous accumuleriez ${formatCurrency(capital)} — soit ${formatCurrency(retrait)}/mois de retrait durable.`,
    interpretation,
    advice: {
      title: "Renforcer votre épargne retraite",
      items: [
        "Envisagez un PER pour déduire les versements de votre revenu imposable",
        "Augmentez les versements à chaque promotion ou prime",
        "Réallouez progressivement vers des actifs moins risqués à l'approche de la retraite",
        "Croisez cette projection avec votre simulation M@rel officielle",
      ],
    },
    comparisons: [
      {
        scenario: "Si vous versiez 50 € de plus par mois",
        value: formatCurrency(retraitPlus50),
        detail: `Retrait mensuel (+${formatCurrency(retraitPlus50 - retrait)})`,
      },
    ],
    callouts: [
      {
        variant: "info",
        title: "Règle des 4 %",
        text: `Un retrait annuel de ${formatPercent(RETRAITE_TAUX_RETRAIT_DURABLE * 100, 0)} vise à préserver le capital sur 25-30 ans — ajustez selon votre profil de risque.`,
      },
    ],
  });
};

const enrichRendementLivretA: Enricher = (input, result) => {
  const capital = Math.min(num(input.capital), LIVRET_A_PLAFOND);
  const taux = num(input.taux);
  const duree = num(input.duree);
  const interets = findValue(result, /intérêts|interets/i) ?? 0;
  const plafondAtteint = num(input.capital) >= LIVRET_A_PLAFOND;
  const margePlafond = LIVRET_A_PLAFOND - capital;

  const interpretation: ResultInterpretation = plafondAtteint
    ? {
        level: "favorable",
        badge: "Plafonné",
        title: "Livret A saturé",
        message: `Votre Livret A est au plafond (${formatCurrency(LIVRET_A_PLAFOND)}) — orientez l'excédent vers le LDDS ou d'autres supports.`,
      }
    : margePlafond <= 5000
      ? {
          level: "intermediate",
          badge: "Presque plein",
          title: "Proche du plafond",
          message: `Il reste ${formatCurrency(margePlafond)} avant le plafond — remplissez-le avant d'autres placements réglementés.`,
        }
      : {
          level: "neutral",
          badge: "Disponible",
          title: "Capacité restante",
          message: `Vous pouvez encore verser ${formatCurrency(margePlafond)} sur votre Livret A.`,
        };

  const interetsPlafond = LIVRET_A_PLAFOND * Math.pow(1 + taux / 100, duree) - LIVRET_A_PLAFOND;

  return buildPatch(result, {
    primary: primaryFromLine(result, /intérêts|interets/i),
    narrative: `${formatCurrency(capital)} placés à ${formatPercent(taux, 1)} pendant ${duree} ans génèrent ${formatCurrency(interets)} d'intérêts exonérés d'impôt.`,
    interpretation,
    advice: {
      title: "Optimiser votre Livret A",
      items: [
        "Versez régulièrement jusqu'au plafond avant d'ouvrir d'autres supports",
        "Complétez avec le LDDS (12 950 € supplémentaires, même taux)",
        "Surveillez les révisions semestrielles du taux",
        "Ne retirez pas inutilement — les intérêts continuent de capitaliser",
      ],
    },
    comparisons: plafondAtteint
      ? undefined
      : [
          {
            scenario: "Si le Livret A était au plafond",
            value: formatCurrency(interetsPlafond),
            detail: `Intérêts sur ${formatCurrency(LIVRET_A_PLAFOND)} à ${formatPercent(taux, 1)}`,
          },
        ],
  });
};

const enrichRendementPea: Enricher = (input, result) => {
  const initial = num(input.capitalInitial);
  const rendement = num(input.rendement);
  const duree = num(input.duree);
  const apres5 = String(input.apresCinqAns) === "oui";
  const capitalNet = findValue(result, /capital net/i) ?? 0;
  const gainNet = findValue(result, /gain net/i) ?? 0;
  const eligibleFiscal = apres5 && duree >= PEA_DUREE_FISCALITE_MIN;

  const brut = initial * Math.pow(1 + rendement / 100, duree);
  const gain = brut - initial;
  const fiscalFlat = gain * PFU_TAUX_GLOBAL;
  const fiscalPea = gain * PEA_PS_APRES_5_ANS;
  const economie = fiscalFlat - fiscalPea;

  const interpretation: ResultInterpretation = eligibleFiscal
    ? {
        level: "favorable",
        badge: "Optimisé",
        title: "Fiscalité PEA avantageuse",
        message: `Après ${PEA_DUREE_FISCALITE_MIN} ans, vous ne payez que ${formatPercent(PEA_PS_APRES_5_ANS * 100, 1)} de PS — économie d'environ ${formatCurrency(economie)} vs. flat tax.`,
      }
    : duree < PEA_DUREE_FISCALITE_MIN
      ? {
          level: "warning",
          badge: "Attention",
          title: "Avant 5 ans de détention",
          message: `Un retrait avant ${PEA_DUREE_FISCALITE_MIN} ans déclenche la flat tax ${formatPercent(PFU_TAUX_GLOBAL * 100, 0)} et ferme le PEA.`,
        }
      : {
          level: "intermediate",
          badge: "Flat tax",
          title: "Fiscalité standard",
          message: "Sans l'option « après 5 ans », les gains sont soumis à la flat tax de 30 %.",
        };

  return buildPatch(result, {
    primary: primaryFromLine(result, /capital net/i),
    narrative: `${formatCurrency(initial)} investis à ${formatPercent(rendement, 1)} sur ${duree} ans donnent ${formatCurrency(capitalNet)} net (gain net : ${formatCurrency(gainNet)}).`,
    interpretation,
    advice: {
      title: "Tirer parti du PEA",
      items: [
        `Conservez le compte ouvert ${PEA_DUREE_FISCALITE_MIN} ans minimum avant tout retrait`,
        "Privilégiez ETF actions europe pour diversifier à faible coût",
        "Versez régulièrement pour lisser la volatilité des marchés",
        "Ne confondez pas performance brute et gain net après fiscalité",
      ],
    },
    comparisons: eligibleFiscal
      ? [
          {
            scenario: "Si vous étiez soumis à la flat tax 30 %",
            value: formatCurrency(brut - fiscalFlat),
            detail: `${formatCurrency(economie)} de moins qu'avec la fiscalité PEA`,
          },
        ]
      : undefined,
  });
};

const enrichCoutTotalCreditConsommation: Enricher = (input, result) => {
  const montant = num(input.montant);
  const taux = num(input.taux);
  const duree = num(input.duree);
  const frais = num(input.frais);
  const cout = findValue(result, /coût total/i) ?? 0;
  const taegApprox = montant > 0 ? (cout / montant / duree) * 100 : 0;
  const mensualite = findValue(result, /mensualit/i) ?? monthlyPaymentFromLoan(montant, taux, duree);

  const interpretation = interpretThreshold(taegApprox, [
    {
      max: 5,
      level: "favorable",
      badge: "Compétitif",
      title: "Coût maîtrisé",
      message: `TAEG approximatif de ${formatPercent(taegApprox, 1)} — crédit relativement peu coûteux.`,
    },
    {
      max: 8,
      level: "intermediate",
      badge: "Moyen",
      title: "Coût dans la norme",
      message: "Le coût total reste acceptable — comparez quand même plusieurs offres.",
    },
    {
      max: Infinity,
      level: "warning",
      badge: "Élevé",
      title: "Coût total important",
      message: `Au-delà de 8-10 % de TAEG, le crédit coûte cher — réduisez le montant ou la durée si possible.`,
    },
  ]);

  const dureeMoins1 = Math.max(1, duree - 1);
  const mCourt = monthlyPaymentFromLoan(montant, taux, dureeMoins1);
  const coutCourt = mCourt * dureeMoins1 * 12 + frais - montant;

  return buildPatch(result, {
    primary: primaryFromLine(result, /coût total/i),
    narrative: `Emprunter ${formatCurrency(montant)} sur ${duree} ans à ${formatPercent(taux, 1)} (+ ${formatCurrency(frais)} de frais) coûte ${formatCurrency(cout)} au total, soit ${formatCurrency(mensualite)}/mois.`,
    interpretation,
    advice: {
      title: "Réduire le coût total",
      items: [
        "Négociez la suppression des frais de dossier (souvent possible en ligne)",
        "Raccourcissez la durée si la mensualité reste viable",
        "Comparez systématiquement les TAEG, pas les taux affichés",
        "Évitez les assurances emprunteur groupées si vous êtes déjà couvert",
      ],
    },
    comparisons: [
      {
        scenario: `Si la durée passait à ${dureeMoins1} an${dureeMoins1 > 1 ? "s" : ""}`,
        value: formatCurrency(coutCourt),
        detail: `${formatCurrency(cout - coutCourt)} d'économie sur le coût total`,
      },
    ],
  });
};

const enrichLoaVsCreditAuto: Enricher = (input, result) => {
  const prix = num(input.prixVehicule);
  const dureeLoa = num(input.dureeLoa);
  const mensLoa = num(input.mensualiteLoa);
  const dureeCredit = num(input.dureeCredit);
  const tauxCredit = num(input.tauxCredit);
  const reprise = num(input.valeurReprise);
  const meilleur = findLine(result, /meilleure option/i)?.value ?? "";
  const totalLoa = findValue(result, /coût total loa/i) ?? mensLoa * dureeLoa * 12;

  const interpretation: ResultInterpretation =
    meilleur === "Crédit auto"
      ? {
          level: "favorable",
          badge: "Crédit gagnant",
          title: "Le crédit est plus avantageux",
          message: "En tenant compte de la reprise, le crédit auto coûte moins cher que la LOA sur cette durée.",
        }
      : {
          level: "intermediate",
          badge: "LOA gagnante",
          title: "La LOA est plus avantageuse",
          message: "La LOA ressort moins chère — pertinent si vous changez de véhicule régulièrement.",
        };

  const reprisePlus = reprise + 2000;
  const mensCredit = monthlyPaymentFromLoan(prix, tauxCredit, dureeCredit);
  const coutCreditReprisePlus = mensCredit * dureeCredit * 12 - reprisePlus;

  return buildPatch(result, {
    primary: primaryFromLine(result, /meilleure option/i, "Option la plus avantageuse"),
    narrative: `Pour un véhicule à ${formatCurrency(prix)}, la LOA (${formatCurrency(mensLoa)}/mois × ${dureeLoa} ans = ${formatCurrency(totalLoa)}) est comparée au crédit (${formatPercent(tauxCredit, 1)}, ${dureeCredit} ans, reprise ${formatCurrency(reprise)}).`,
    interpretation,
    advice: {
      title: "Choisir entre LOA et crédit auto",
      items: [
        "Négociez d'abord le prix du véhicule, indépendamment du financement",
        "LOA : idéal si vous changez tous les 3-4 ans et respectez le kilométrage",
        "Crédit : préférable si vous gardez le véhicule longtemps et revendez",
        "Vérifiez les frais de restitution LOA (état, km, usure)",
      ],
    },
    comparisons: [
      {
        scenario: "Si la reprise valait 2 000 € de plus",
        value: formatCurrency(coutCreditReprisePlus),
        detail: "Coût net crédit recalculé",
      },
    ],
  });
};

const enrichFraisKilometriques: Enricher = (input, result) => {
  const km = num(input.kilometres);
  const cv = num(input.puissance);
  const electrique = String(input.type) === "electrique";
  const frais = findValue(result, /frais annuels/i) ?? 0;
  const coeff = getBaremeKilometriqueCoeff(cv);

  const fraisThermique = km * coeff;
  const fraisElectrique = fraisThermique * BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE;
  const economie = fraisThermique - fraisElectrique;

  const interpretation: ResultInterpretation = electrique
    ? {
        level: "favorable",
        badge: "Bonus VE",
        title: "Barème électrique appliqué",
        message: `Le bonus de ${formatPercent((BAREME_KILOMETRIQUE_BONUS_ELECTRIQUE - 1) * 100, 0)} sur le barème vous fait économiser ${formatCurrency(economie)}/an vs. thermique.`,
      }
    : km >= 15000
      ? {
          level: "intermediate",
          badge: "Usage intensif",
          title: "Forte utilisation pro",
          message: `${formatNumber(km, 0)} km/an — comparez impérativement barème et frais réels.`,
        }
      : {
          level: "neutral",
          badge: "Estimation",
          title: "Barème appliqué",
          message: `Coefficient ${coeff.toFixed(3)} €/km pour ${cv} CV — montant déductible selon votre situation.`,
        };

  return buildPatch(result, {
    primary: primaryFromLine(result, /frais annuels/i),
    narrative: `Pour ${formatNumber(km, 0)} km/an avec un véhicule ${electrique ? "électrique" : "thermique"} de ${cv} CV, le barème fiscal donne ${formatCurrency(frais)}/an (${formatCurrency(frais / 12)}/mois).`,
    interpretation,
    advice: {
      title: "Optimiser vos frais kilométriques",
      items: [
        "Tenez un carnet de bord (dates, trajets, km) en cas de contrôle",
        "Comparez le barème avec vos frais réels (carburant, entretien, assurance pro-rata)",
        "Choisissez barème ou frais réels une fois par an — pas de cumul sur le même véhicule",
        "Vérifiez le barème en vigueur sur impots.gouv.fr chaque janvier",
      ],
    },
    comparisons: electrique
      ? undefined
      : [
          {
            scenario: "Avec un véhicule électrique (bonus 20 %)",
            value: formatCurrency(fraisElectrique),
            detail: `${formatCurrency(economie)}/an de moins qu'en thermique`,
          },
        ],
  });
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "mensualite-credit-consommation": enrichMensualiteCreditConsommation,
  "interets-composes": enrichInteretsComposes,
  "simulateur-inflation": enrichSimulateurInflation,
  "budget-reste-a-vivre": enrichBudgetResteAVivre,
  "simulateur-retraite": enrichSimulateurRetraite,
  "rendement-livret-a": enrichRendementLivretA,
  "rendement-pea": enrichRendementPea,
  "cout-total-credit-consommation": enrichCoutTotalCreditConsommation,
  "loa-vs-credit-auto": enrichLoaVsCreditAuto,
  "frais-kilometriques": enrichFraisKilometriques,
};
