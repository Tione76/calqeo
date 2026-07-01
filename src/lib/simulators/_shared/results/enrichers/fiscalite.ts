import {
  CREDIT_IMPOT_EMPLOI_DOMICILE,
  DONATION_ABATTEMENTS,
  QF_PART_PARENT_ISOLE,
} from "@/lib/config/fiscalite";
import { IFI_SEUIL } from "@/data/regulations/ifi";
import { formatNumber } from "@/lib/utils/format";
import type { ResultComparison, ResultInterpretation } from "../../../types";
import {
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
} from "../../../general/fiscalite-generale";
import {
  adviceItems,
  enrich,
  fmtEur,
  fmtPct,
  interpretationFavorable,
  interpretationIntermediate,
  interpretationNeutral,
  interpretationTauxEffectif,
  interpretationTmi,
  interpretationWarning,
  lineAmount,
  linePercent,
  lineValue,
  num,
  oneCallout,
  primaryFromComputed,
  textFromComputed,
  valueFromComputed,
  type Enricher,
} from "./helpers";

function partsFromSituation(situation: string, enfants: number): number {
  let parts = situation === "couple" ? 2 : 1;
  if (situation === "parentIsole") parts += QF_PART_PARENT_ISOLE;
  for (let i = 1; i <= enfants; i++) parts += i >= 3 ? 1 : 0.5;
  return parts;
}

const enrichImpotSurLeRevenu: Enricher = (input, result) => {
  const revenu = num(input.revenuNet);
  const parts = num(input.parts);
  const computed = impotSurLeRevenu.calculate(input);
  const impot = valueFromComputed(computed, /impôt estimé/i, result, /impôt/i);
  const taux = valueFromComputed(computed, /taux effectif/i, result);
  const parPart = valueFromComputed(computed, /revenu par part/i, result) || (parts > 0 ? revenu / parts : revenu);

  const comparisons: ResultComparison[] = [];
  if (parts > 1) {
    const sansQf = impotSurLeRevenu.calculate({ revenuNet: revenu, parts: 1 });
    const impotSeul = valueFromComputed(sansQf, /impôt estimé/i, result);
    comparisons.push({
      scenario: "Sans quotient familial (1 part)",
      value: fmtEur(impotSeul),
      detail: `+${fmtEur(impotSeul - impot)} d'impôt`,
    });
  }

  return enrich(result, {
    primary: primaryFromComputed(computed, /impôt estimé/i, result),
    narrative: `Sur ${fmtEur(revenu)} nets imposables répartis en ${formatNumber(parts, 1)} part${parts > 1 ? "s" : ""} (${fmtEur(parPart)}/part), vous payez environ ${fmtEur(impot)} d'impôt — soit ${fmtPct(taux)} de taux effectif.`,
    interpretation: interpretationTauxEffectif(taux, revenu),
    advice: adviceItems("Optimiser votre IR", [
      "Versements PER : déduction immédiate au TMI",
      "Crédits d'impôt (emploi à domicile, dons…) non inclus ici",
      "Décote et plafonnement QF absents de cette estimation",
    ]),
    comparisons: comparisons.length ? comparisons : undefined,
    callouts: oneCallout({
      variant: "note",
      title: "Estimation simplifiée",
      text: "Sans décote, réductions ni crédits d'impôt — comparez avec votre avis d'imposition.",
    }),
  });
};

const enrichQuotientFamilial: Enricher = (input, result) => {
  const parts = partsFromSituation(String(input.situation), num(input.enfants));
  const computed = quotientFamilial.calculate(input);
  const gain = valueFromComputed(computed, /gain fiscal/i, result);
  const parPart = valueFromComputed(computed, /revenu par part/i, result, /revenu par part/i);

  return enrich(result, {
    primary: primaryFromComputed(computed, /revenu par part/i, result),
    narrative: `Votre foyer compte ${formatNumber(parts, 1)} parts — le revenu par part tombe à ${fmtEur(parPart)}, soit un gain fiscal d'environ ${fmtEur(gain)} vs. une imposition sans quotient familial.`,
    interpretation:
      gain >= 2000
        ? interpretationFavorable(
            "QF efficace",
            `Le quotient familial vous fait économiser ${fmtEur(gain)} — vérifiez le plafonnement si vos revenus dépassent ~80 000 €/part.`
          )
        : gain > 0
          ? interpretationIntermediate(
              "Gain modéré",
              `Gain de ${fmtEur(gain)} — le plafonnement du QF limite l'avantage au-delà de certains seuils.`
            )
          : interpretationNeutral("Peu ou pas d'avantage QF sur ce scénario."),
    advice: adviceItems("Tirer parti du QF", [
      "Mettez à jour vos parts à chaque naissance ou changement de situation",
      "Garde alternée : 0,25 ou 0,5 part selon les cas",
      "Parent isolé : +0,25 part supplémentaire",
    ]),
    comparisons: [
      {
        scenario: "Impôt sans quotient familial",
        value: fmtEur(valueFromComputed(computed, /impôt sans qf/i, result)),
        detail: `Gain QF : ${fmtEur(gain)}`,
      },
    ],
    callouts: oneCallout({
      variant: "info",
      title: "Plafonnement",
      text: "L'avantage lié aux demi-parts est plafonné (~1 791 €/demi-part en 2026) — non modélisé ici.",
    }),
  });
};

const enrichPrelevementALaSource: Enricher = (input, result) => {
  const revenu = num(input.revenuNet);
  const mensuel = num(input.revenuMensuel);
  const computed = prelevementALaSource.calculate(input);
  const taux = valueFromComputed(computed, /taux personnalisé/i, result, /taux/i);
  const prelevement = valueFromComputed(computed, /prélèvement mensuel/i, result, /prélèvement/i);
  const impot = valueFromComputed(computed, /impôt annuel/i, result);

  return enrich(result, {
    primary: primaryFromComputed(computed, /prélèvement mensuel/i, result),
    narrative: `Avec ${fmtEur(mensuel)}/mois de salaire net et ${fmtEur(revenu)} de revenu imposable annuel, votre taux personnalisé est d'environ ${fmtPct(taux)} — soit ${fmtEur(prelevement)} prélevés chaque mois pour ${fmtEur(impot)}/an d'impôt.`,
    interpretation:
      taux <= 8
        ? interpretationFavorable("Taux bas", `Seulement ${fmtPct(taux)} prélevés — la déclaration ajustera le solde en fin d'année.`)
        : taux <= 15
          ? interpretationIntermediate("Taux moyen", `${fmtPct(taux)} de PAS — pensez à mettre à jour le taux si votre situation change.`)
          : interpretationWarning("Taux élevé", `${fmtPct(taux)} prélevés mensuellement — vérifiez les crédits d'impôt non pris en compte dans le taux.`),
    advice: adviceItems("Ajuster votre PAS", [
      "Modifiez le taux sur impots.gouv.fr en cas de mariage, enfant ou baisse de revenus",
      "Taux individualisé possible au sein du couple",
      "Indépendants : acomptes basés sur N-1 ou N-2",
    ]),
    comparisons: [
      {
        scenario: "Si votre salaire passait à +10 %",
        value: fmtEur(mensuel * 1.1 * (taux / 100)),
        detail: "Prélèvement mensuel estimé (taux inchangé)",
      },
    ],
  });
};

const enrichFlatTax30: Enricher = (input, result) => {
  const capitaux = num(input.revenusCapitaux);
  const optionBareme = String(input.optionBareme) === "oui";
  const computed = flatTax30Pourcent.calculate(input);
  const pfu = valueFromComputed(computed, /impôt pfu/i, result);
  const netPfu = valueFromComputed(computed, /net (après )?pfu/i, result);

  let interpretation: ResultInterpretation;
  let comparisons: ResultComparison[] | undefined;

  if (optionBareme) {
    const recommande = textFromComputed(computed, /option recommandée/i, result, /option/i);
    const impotBareme = valueFromComputed(computed, /impôt barème/i, result);
    const netBareme = capitaux - impotBareme;
    interpretation =
      recommande.includes("Barème")
        ? interpretationFavorable("Barème gagnant", "Votre TMI bas rend l'option barème plus avantageuse que le PFU sur ces capitaux.")
        : interpretationIntermediate("PFU gagnant", "Le PFU reste plus intéressant compte tenu de votre TMI et de vos autres revenus.");
    comparisons = [
      { scenario: "Net au PFU 30 %", value: fmtEur(netPfu), detail: `${fmtEur(pfu)} d'impôt` },
      {
        scenario: "Net au barème (capitaux)",
        value: fmtEur(netBareme),
        detail: `${fmtEur(impotBareme)} d'impôt au barème`,
      },
    ];
    return enrich(result, {
      primary: primaryFromComputed(computed, /option recommandée/i, result),
      narrative: `Sur ${fmtEur(capitaux)} de revenus de capitaux, ${recommande.includes("Barème") ? "le barème progressif" : "le PFU 30 %"} est le plus avantageux — net ${fmtEur(recommande.includes("Barème") ? netBareme : netPfu)}.`,
      interpretation,
      advice: adviceItems("Arbitrer PFU / barème", [
        "Barème avantageux si TMI ≤ 11 % (revenus modestes)",
        "PEA : exonération d'IR après 5 ans (PS 17,2 % seulement)",
        "Assurance-vie : abattements après 8 ans sur les retraits",
      ]),
      comparisons,
      callouts: oneCallout({
        variant: "tip",
        title: "PEA & AV",
        text: "Hors PEA/assurance-vie, le PFU s'applique par défaut — l'option barème se choisit à la déclaration.",
      }),
    });
  }

  interpretation = interpretationNeutral(
    `Le PFU prélève ${fmtEur(pfu)} — net ${fmtEur(netPfu)} sur ${fmtEur(capitaux)} de capitaux.`
  );
  comparisons = [
    {
      scenario: "Si vous optiez pour le barème",
      value: "Comparer",
      detail: "Activez « Comparer au barème » avec vos revenus globaux",
    },
  ];

  return enrich(result, {
    primary: primaryFromComputed(computed, /impôt pfu/i, result),
    narrative: `Sur ${fmtEur(capitaux)} de revenus de capitaux, le PFU à 30 % prélève ${fmtEur(pfu)} — vous conservez ${fmtEur(netPfu)} net.`,
    interpretation,
    advice: adviceItems("Arbitrer PFU / barème", [
      "Barème avantageux si TMI ≤ 11 % (revenus modestes)",
      "PEA : exonération d'IR après 5 ans (PS 17,2 % seulement)",
      "Assurance-vie : abattements après 8 ans sur les retraits",
    ]),
    comparisons,
    callouts: oneCallout({
      variant: "tip",
      title: "PEA & AV",
      text: "Hors PEA/assurance-vie, le PFU s'applique par défaut — l'option barème se choisit à la déclaration.",
    }),
  });
};

const enrichMicroEntrepreneurCharges: Enricher = (input, result) => {
  const ca = num(input.caAnnuel);
  const activite = String(input.activite);
  const computed = microEntrepreneurCharges.calculate(input);
  const taux = valueFromComputed(computed, /taux charges/i, result);
  const charges = valueFromComputed(computed, /charges sociales/i, result);
  const net = valueFromComputed(computed, /net après charges/i, result, /net/i);
  const avecLiberatoire = String(input.impotLiberatoire) === "oui";

  const comparisons: ResultComparison[] = [];
  if (!avecLiberatoire) {
    const avecLib = microEntrepreneurCharges.calculate({ ...input, impotLiberatoire: "oui" });
    comparisons.push({
      scenario: "Avec impôt libératoire",
      value: fmtEur(valueFromComputed(avecLib, /net après charges/i, result)),
      detail: `Net après charges + IR (${fmtEur(valueFromComputed(avecLib, /impôt libératoire/i, result))} de libératoire)`,
    });
  }

  const labels: Record<string, string> = {
    vente: "vente (12,3 %)",
    bic: "prestations BIC (21,2 %)",
    bnc: "prestations BNC (24,6 %)",
  };

  return enrich(result, {
    primary: primaryFromComputed(computed, /net après charges/i, result),
    narrative: `Sur ${fmtEur(ca)} de CA en ${labels[activite] ?? activite}, vous payez ${fmtEur(charges)} de cotisations (${fmtPct(taux, 1)}) — il reste ${fmtEur(net)} net${avecLiberatoire ? ", impôt libératoire inclus" : " avant IR"}.`,
    interpretation:
      ca > 0 && net / ca >= 0.75
        ? interpretationFavorable("Bon reste à vivre", `${fmtPct((net / ca) * 100, 0)} du CA vous revient après charges.`)
        : interpretationIntermediate("Charges significatives", `${fmtPct(taux, 1)} prélevés sur le CA — pensez au régime réel si vos charges réelles dépassent l'abattement forfaitaire.`),
    advice: adviceItems("Micro-entreprise", [
      "Impôt libératoire intéressant si TMI ≥ 30 %",
      "Plafonds : 77 700 € (vente) ou 188 700 € (services)",
      "Versement libératoire des cotisations possible chaque mois",
    ]),
    comparisons: comparisons.length ? comparisons : undefined,
    callouts: oneCallout({
      variant: "note",
      title: "Hors périmètre",
      text: "CFE, TVA et régime réel non inclus — au-delà des plafonds, changez de statut.",
    }),
  });
};

const enrichCreditImpotEmploiDomicile: Enricher = (input, result) => {
  const depenses = num(input.depenses);
  const computed = creditImpotEmploiDomicile.calculate(input);
  const credit = valueFromComputed(computed, /crédit d'impôt/i, result, /crédit/i);
  const prisesEnCompte = valueFromComputed(computed, /dépenses prises en compte/i, result);
  const plafondAtteint = depenses > CREDIT_IMPOT_EMPLOI_DOMICILE.plafondDepenses;

  const services: Record<string, string> = {
    menage: "ménage / repassage",
    garde: "garde d'enfants",
    soutien: "soutien scolaire",
  };

  return enrich(result, {
    primary: primaryFromComputed(computed, /crédit d'impôt/i, result),
    narrative: `Pour ${fmtEur(depenses)} dépensés en ${services[String(input.typeService)] ?? "services à domicile"}, vous récupérez ${fmtEur(credit)} — soit 50 % des ${fmtEur(prisesEnCompte)} pris en compte.`,
    interpretation:
      credit >= 3000
        ? interpretationFavorable("Crédit conséquent", `${fmtEur(credit)} remboursés même sans impôt à payer — crédit d'impôt, pas réduction.`)
        : interpretationIntermediate("Crédit modéré", `50 % remboursés sur vos dépenses éligibles déclarées en case 7DB.`),
    advice: adviceItems("Maximiser le crédit", [
      "Salarié du particulier employeur ou organisme agréé obligatoire",
      "Plafond majorable (+1 500 €/enfant, +750 €/personne âgée)",
      "Les CESU préfinancés réduisent le crédit — voir simulateur CESU",
    ]),
    comparisons: [
      {
        scenario: "Au plafond de dépenses (12 000 €)",
        value: fmtEur(
          valueFromComputed(
            creditImpotEmploiDomicile.calculate({ ...input, depenses: CREDIT_IMPOT_EMPLOI_DOMICILE.plafondDepenses }),
            /crédit d'impôt/i,
            result
          )
        ),
        detail: "Crédit maximal estimé",
      },
    ],
    callouts: plafondAtteint
      ? oneCallout({
          variant: "warning",
          title: "Plafond atteint",
          text: `Seuls ${fmtEur(CREDIT_IMPOT_EMPLOI_DOMICILE.plafondDepenses)} de dépenses entrent dans le calcul (crédit max 6 000 €).`,
        })
      : oneCallout({
          variant: "tip",
          title: "Remboursement garanti",
          text: "Crédit d'impôt remboursé même si vous ne payez pas d'IR.",
        }),
  });
};

const enrichImpotDividendes: Enricher = (input, result) => {
  const div = num(input.dividendes);
  const option = String(input.option);
  const computed = impotDividendes.calculate(input);
  const pfu = valueFromComputed(computed, /impôt pfu/i, result);
  const netPfu = valueFromComputed(computed, /net pfu|net après pfu/i, result);

  if (option === "bareme") {
    const recommande = textFromComputed(computed, /option recommandée/i, result, /option/i);
    const netBareme = valueFromComputed(computed, /net barème/i, result);
    return enrich(result, {
      primary: primaryFromComputed(computed, /option recommandée/i, result, "Meilleure option"),
      narrative: `Sur ${fmtEur(div)} de dividendes bruts, ${recommande.includes("Barème") ? "le barème avec abattement 40 %" : "le PFU 30 %"} est le plus avantageux selon vos ${fmtEur(num(input.revenuAutres))} d'autres revenus.`,
      interpretation: recommande.includes("Barème")
        ? interpretationFavorable("Barème optimal", "L'abattement de 40 % et votre TMI rendent le barème plus intéressant que le PFU.")
        : interpretationIntermediate("PFU optimal", "Le PFU reste plus simple et moins coûteux compte tenu de votre TMI."),
      advice: adviceItems("Dividendes", [
        "Option barème sur la déclaration — PFU appliqué par défaut à la source",
        "PEA : dividendes réinvestis sans fiscalité (hors PS sur plus-values)",
        "CSG déductible (6,8 %) au barème — non modélisé ici",
      ]),
      comparisons: [
        { scenario: "Net PFU 30 %", value: fmtEur(netPfu), detail: `${fmtEur(pfu)} d'impôt` },
        { scenario: "Net barème + abattement 40 %", value: fmtEur(netBareme), detail: "IR + PS 17,2 %" },
      ],
    });
  }

  return enrich(result, {
    primary: primaryFromComputed(computed, /net après pfu/i, result, "Net après PFU"),
    narrative: `${fmtEur(div)} de dividendes → ${fmtEur(pfu)} prélevés au PFU (12,8 % IR + 17,2 % PS) — net ${fmtEur(netPfu)}.`,
    interpretation: interpretationNeutral(
      "Le PFU s'applique par défaut. Comparez avec l'option barème si votre TMI est basse."
    ),
    advice: adviceItems("Avant de choisir", [
      "Testez l'option barème si TMI ≤ 11 %",
      "Dividendes étrangers : crédits d'impôt à intégrer",
      "Conservez les IFU de votre banque pour la déclaration",
    ]),
    comparisons: [
      {
        scenario: "Option barème + abattement 40 %",
        value: "Comparer",
        detail: "Activez l'option barème avec vos autres revenus",
      },
    ],
  });
};

const enrichTauxMarginalImposition: Enricher = (input, result) => {
  const revenu = num(input.revenuNet);
  const parts = num(input.parts);
  const computed = tauxMarginalImposition.calculate(input);
  const tmi = valueFromComputed(computed, /^tmi$/i, result, /tmi/i);
  const effectif = valueFromComputed(computed, /taux effectif/i, result);
  const parPart = valueFromComputed(computed, /revenu par part/i, result) || (parts > 0 ? revenu / parts : revenu);

  return enrich(result, {
    primary: primaryFromComputed(computed, /^tmi$/i, result),
    narrative: `Avec ${fmtEur(revenu)} nets et ${formatNumber(parts, 1)} parts (${fmtEur(parPart)}/part), votre dernier euro est taxé à ${fmtPct(tmi, 0)} (TMI) alors que le taux effectif global est ${fmtPct(effectif, 1)}.`,
    interpretation: interpretationTmi(tmi),
    advice: adviceItems("Agir sur votre TMI", [
      "PER : chaque euro versé réduit le revenu imposable au TMI",
      "TMI guide le choix PFU vs barème sur les capitaux",
      "Anticipez les passages de tranche lors de hausses de revenus",
    ]),
    comparisons: [
      {
        scenario: "Taux effectif vs TMI",
        value: fmtPct(effectif, 1),
        detail: "L'impôt moyen reste inférieur au TMI grâce au barème progressif",
      },
    ],
  });
};

const enrichDonationNumeraire: Enricher = (input, result) => {
  const montant = num(input.montant);
  const lien = String(input.lien);
  const computed = donationNumeraire.calculate(input);
  const droits = valueFromComputed(computed, /droits de donation/i, result, /droits/i);
  const taxable = valueFromComputed(computed, /base taxable/i, result);
  const resteAbattement = valueFromComputed(computed, /abattement restant/i, result);

  const liens: Record<string, string> = {
    enfant: "enfant",
    petitEnfant: "petit-enfant",
    conjoint: "conjoint / partenaire PACS",
  };

  if (lien === "conjoint") {
    return enrich(result, {
      primary: primaryFromComputed(computed, /droits de donation/i, result, "Droits de donation"),
      narrative: `Donation de ${fmtEur(montant)} à votre conjoint ou partenaire PACS : exonération totale de droits.`,
      interpretation: interpretationFavorable("Exonéré", "Transmission entre conjoints/PACS sans droits de mutation."),
      advice: adviceItems("Formalités", [
        "Déclarez quand même la donation (déclaration de manœuvre)",
        "Pour les gros patrimoines, anticipez l'IFI et la succession",
        "Donation-partage possible pour plusieurs bénéficiaires",
      ]),
      comparisons: [
        {
          scenario: "Vers un enfant (même montant)",
          value: fmtEur(
            valueFromComputed(
              donationNumeraire.calculate({ ...input, lien: "enfant" }),
              /droits de donation/i,
              result
            )
          ),
          detail: "Droits estimés avec abattement enfant",
        },
      ],
    });
  }

  return enrich(result, {
    primary: primaryFromComputed(computed, /droits de donation/i, result, "Droits estimés"),
    narrative: `Donation de ${fmtEur(montant)} à un ${liens[lien] ?? lien} : après abattement (${fmtEur(resteAbattement)} restant sur 15 ans), la base taxable est ${fmtEur(taxable)} — droits ~${fmtEur(droits)}.`,
    interpretation:
      droits === 0
        ? interpretationFavorable("Dans l'abattement", "La donation est couverte par l'abattement renouvelable tous les 15 ans.")
        : droits / montant <= 0.1
          ? interpretationIntermediate("Droits modérés", `${fmtPct((droits / montant) * 100, 0)} du montant — planifiez les prochains abattements dans 15 ans.`)
          : interpretationWarning("Droits significatifs", `${fmtEur(droits)} à payer — étalez les donations pour utiliser les abattements.`),
    advice: adviceItems("Transmission", [
      "Abattement enfant : 100 000 €/parent/enfant tous les 15 ans",
      "Déclaration obligatoire même en dessous des abattements",
      "Notaire recommandé au-delà de 15 000 € ou pour l'immobilier",
    ]),
    comparisons: [
      {
        scenario: "Abattement restant disponible",
        value: fmtEur(resteAbattement),
        detail: "Sur la période de 15 ans",
      },
    ],
    callouts: oneCallout({
      variant: "note",
      title: "Barème simplifié",
      text: "Calcul pédagogique — le notaire applique le barème progressif exact (5 % à 45 %).",
    }),
  });
};

const enrichCesuCreditImpot: Enricher = (input, result) => {
  const cesu = num(input.cesuUtilises);
  const prefinance = num(input.cesuPrefinance);
  const depenses = num(input.depensesTotales);
  const computed = cesuCreditImpot.calculate(input);
  const credit = valueFromComputed(computed, /crédit d'impôt/i, result, /crédit/i);
  const eligible = valueFromComputed(computed, /dépenses éligibles/i, result);

  return enrich(result, {
    primary: primaryFromComputed(computed, /crédit d'impôt/i, result, "Crédit d'impôt CESU"),
    narrative: `Sur ${fmtEur(depenses)} de services et ${fmtEur(cesu)} de CESU utilisés (${fmtEur(prefinance)} préfinancés), le crédit d'impôt atteint ${fmtEur(credit)} — base éligible ${fmtEur(eligible)}.`,
    interpretation:
      prefinance > 0
        ? interpretationIntermediate(
            "CESU préfinancés",
            `Les ${fmtEur(prefinance)} préfinancés réduisent le crédit — seules ${fmtEur(eligible)} génèrent du crédit à 50 %.`
          )
        : interpretationFavorable("Crédit maximal", "50 % de vos dépenses éligibles remboursés, plafond 12 000 € de dépenses."),
    advice: adviceItems("CESU", [
      "Déclarez les CESU sur votre déclaration de revenus",
      "CESU dématérialisé = même crédit que le papier",
      "Combine avec le crédit emploi à domicile (même plafond global)",
    ]),
    comparisons: [
      {
        scenario: prefinance > 0 ? "Sans CESU préfinancés" : "Au plafond de dépenses",
        value: fmtEur(
          valueFromComputed(
            cesuCreditImpot.calculate(
              prefinance > 0
                ? { ...input, cesuPrefinance: 0 }
                : { ...input, depensesTotales: CREDIT_IMPOT_EMPLOI_DOMICILE.plafondDepenses }
            ),
            /crédit d'impôt/i,
            result
          )
        ),
        detail: prefinance > 0 ? "Crédit théorique sans préfinancement" : "Crédit maximal estimé",
      },
    ],
  });
};

const enrichImpotRevenusFonciers: Enricher = (input, result) => {
  const loyers = num(input.loyersAnnuels);
  const charges = num(input.charges);
  const tmi = num(input.tmi);
  const regime = String(input.regime);
  const impot = lineAmount(result, /impôt estimé/i) ?? 0;
  const impotAutre = lineAmount(result, /autre régime/i) ?? 0;
  const autreMeilleur = impotAutre < impot;

  return enrich(result, {
    primary: { label: "Impôt locatif", value: fmtEur(impot) },
    narrative: `${fmtEur(loyers)}/an de loyers au ${regime === "micro" ? "micro-foncier (abattement 30 %)" : "régime réel"} avec TMI ${fmtPct(tmi, 0)} → impôt ~${fmtEur(impot)}/an${autreMeilleur ? ` (l'autre régime ferait ${fmtEur(impotAutre)})` : ""}.`,
    interpretation:
      autreMeilleur
        ? interpretationIntermediate(
            "Autre régime plus avantageux",
            regime === "micro"
              ? `Vos charges (${fmtEur(charges)}) dépassent 30 % des loyers — le réel serait plus intéressant.`
              : "Le micro-foncier serait plus simple et moins coûteux sur ce scénario."
          )
        : interpretationFavorable(
            "Bon choix de régime",
            `${regime === "micro" ? "Micro-foncier" : "Régime réel"} optimal pour vos loyers et charges.`
          ),
    advice: adviceItems("Location nue", [
      "Micro-foncier : obligatoire si loyers > 15 000 €/an",
      "Réel : engagement 3 ans, mais option micro possible chaque année si éligible",
      "Ajoutez 17,2 % de prélèvements sociaux sur le revenu foncier net",
    ]),
    comparisons: [
      {
        scenario: regime === "micro" ? "Régime réel" : "Micro-foncier",
        value: fmtEur(impotAutre),
        detail: autreMeilleur ? "Plus avantageux" : "Moins avantageux",
      },
    ],
    callouts: oneCallout({
      variant: "note",
      title: "PS non inclus",
      text: "Prélèvements sociaux (17,2 %) en sus de l'impôt sur le revenu.",
    }),
  });
};

const enrichTaxeFonciere: Enricher = (input, result) => {
  const vlc = num(input.vlc);
  const tauxCommune = num(input.tauxCommune);
  const tauxInterco = num(input.tauxInterco);
  const taxe = lineAmount(result, /taxe foncière/i) ?? 0;
  const tauxGlobal = tauxCommune + tauxInterco + 10;

  return enrich(result, {
    primary: { label: "Taxe foncière / an", value: fmtEur(taxe) },
    narrative: `VLC ${fmtEur(vlc)} × 50 % × ${fmtPct(tauxGlobal, 1)} (commune ${fmtPct(tauxCommune, 1)} + interco ${fmtPct(tauxInterco, 1)} + département ~10 %) → ${fmtEur(taxe)}/an.`,
    interpretation:
      taxe / vlc <= 0.15
        ? interpretationFavorable("Taxe modérée", `${fmtPct((taxe / vlc) * 100, 1)} de la VLC — dans la moyenne basse.`)
        : taxe / vlc <= 0.25
          ? interpretationIntermediate("Taxe moyenne", "Montant courant — vérifiez les exonérations (neuf, seniors).")
          : interpretationWarning("Taxe élevée", "Taux communal élevé — impact direct sur la rentabilité locative au réel."),
    advice: adviceItems("Taxe foncière", [
      "Déductible en location nue au régime réel uniquement",
      "Demandez le détail des taux sur votre avis d'imposition",
      "Exonération possible 2 ans pour construction neuve (conditions)",
    ]),
  });
};

const enrichDeficitFoncier: Enricher = (input, result) => {
  const deficit = lineAmount(result, /déficit foncier total/i) ?? 0;
  const imputable = lineAmount(result, /imputable sur revenu global/i) ?? 0;
  const eco = lineAmount(result, /économie d'impôt/i) ?? 0;
  const tmi = num(input.tmi);
  const travaux = num(input.travaux);

  if (deficit <= 0) {
    return enrich(result, {
      primary: { label: "Déficit foncier", value: fmtEur(0) },
      narrative: `Vos loyers couvrent charges et intérêts — pas de déficit foncier cette année.`,
      interpretation: interpretationNeutral("Résultat foncier positif ou nul — pas d'imputation sur le revenu global."),
      advice: adviceItems("Optimiser", [
        "Planifiez des travaux d'entretien pour créer un déficit imputable",
        "Les intérêts d'emprunt ne s'imputent que sur les revenus fonciers futurs",
        "Plafond d'imputation : 10 700 €/an sur le revenu global",
      ]),
    });
  }

  return enrich(result, {
    primary: { label: "Économie d'impôt", value: fmtEur(eco) },
    narrative: `Déficit foncier de ${fmtEur(deficit)} dont ${fmtEur(imputable)} imputables sur votre revenu global (TMI ${fmtPct(tmi, 0)}) — économie d'impôt ~${fmtEur(eco)}${travaux > 0 ? `, travaux ${fmtEur(travaux)} inclus` : ""}.`,
    interpretation:
      imputable >= 10700
        ? interpretationFavorable("Plafond atteint", "Vous exploitez le maximum d'imputation sur le revenu global — l'excédent se reporte sur 10 ans.")
        : interpretationIntermediate("Déficit exploitable", `${fmtEur(imputable)} imputés cette année — le reste des intérêts se reporte sur les revenus fonciers futurs.`),
    advice: adviceItems("Déficit foncier", [
      "Travaux d'entretien/amélioration : imputables sur le revenu global",
      "Travaux de construction/reconstruction : revenus fonciers uniquement",
      "Conservez devis et factures pour la liasse 2044",
    ]),
    callouts: oneCallout({
      variant: "info",
      title: "Intérêts d'emprunt",
      text: "Imputables uniquement sur les revenus fonciers futurs, sans limite de durée (10 ans de report).",
    }),
  });
};

const enrichDonationSuccession: Enricher = (input, result) => {
  const valeur = num(input.valeurBien);
  const lien = String(input.lien);
  const droits = lineAmount(result, /droits estimés/i) ?? 0;
  const base = lineAmount(result, /base taxable/i) ?? 0;

  if (lien === "conjoint") {
    return enrich(result, {
      primary: { label: "Droits de mutation", value: fmtEur(0) },
      narrative: `Transmission de ${fmtEur(valeur)} entre conjoints ou partenaires PACS : exonération totale.`,
      interpretation: interpretationFavorable("Exonéré", "Aucun droit entre époux/PACS — planifiez la transmission aux enfants."),
      advice: adviceItems("Stratégie patrimoniale", [
        "Démembrement usufruit/nue-propriété pour réduire les droits aux enfants",
        "Donations échelonnées tous les 15 ans",
        "Assurance-vie en complément (hors succession sous conditions)",
      ]),
    });
  }

  const abattement =
    lien === "enfant"
      ? DONATION_ABATTEMENTS.enfant
      : lien === "petitenfant"
        ? DONATION_ABATTEMENTS.petitenfant
        : DONATION_ABATTEMENTS.autre;

  return enrich(result, {
    primary: { label: "Droits estimés", value: fmtEur(droits) },
    narrative: `Bien immobilier de ${fmtEur(valeur)} transmis à un ${lien === "enfant" ? "enfant" : lien === "petitenfant" ? "petit-enfant" : "autre héritier"} : base taxable ${fmtEur(base)} après abattement (${fmtEur(abattement)} tous les 15 ans) — droits ~${fmtEur(droits)}.`,
    interpretation:
      droits / valeur <= 0.05
        ? interpretationFavorable("Droits contenus", "Abattements bien utilisés — pensez au démembrement pour les prochaines transmissions.")
        : interpretationWarning("Droits lourds", `${fmtPct((droits / valeur) * 100, 0)} du bien — fractionnez les donations dans le temps.`),
    advice: adviceItems("Réduire les droits", [
      "Donation-partage : abattement par enfant",
      "Démembrement : transmettre la nue-propriété, conserver l'usufruit",
      "Faire estimer le bien par un notaire (valeur vénale nette)",
    ]),
    callouts: oneCallout({
      variant: "note",
      title: "Calcul indicatif",
      text: "Barème progressif simplifié — le notaire calcule le montant exact avec décote éventuelle.",
    }),
  });
};

const enrichLocationMeubleeVsNue: Enricher = (input, result) => {
  const rendNue = linePercent(result, /rendement net nue/i) ?? 0;
  const rendMeublee = linePercent(result, /rendement net meublée/i) ?? 0;
  const gagnant = rendMeublee > rendNue ? "Meublée" : "Nue";
  const invest = num(input.investissement);

  return enrich(result, {
    primary: { label: "Meilleur rendement net", value: `${gagnant} (${fmtPct(Math.max(rendNue, rendMeublee), 2)})` },
    narrative: `Sur ${fmtEur(invest)} investis, la location ${gagnant.toLowerCase()} l'emporte : ${fmtPct(rendMeublee, 2)} net meublée (micro-BIC 50 %) vs ${fmtPct(rendNue, 2)} net nue (micro-foncier 30 %), charges et impôt inclus.`,
    interpretation:
      Math.abs(rendMeublee - rendNue) < 0.5
        ? interpretationIntermediate("Écart faible", "Les deux options se valent fiscalement — le choix dépend surtout de la gestion locative.")
        : interpretationFavorable(
            `${gagnant} gagnante`,
            `${fmtPct(Math.abs(rendMeublee - rendNue), 2)} d'écart de rendement net — ${gagnant === "Meublée" ? "loyers plus élevés et abattement BIC 50 %" : "simplicité et moindre rotation locative"}.`
          ),
    advice: adviceItems("Arbitrage", [
      "Meublé : bail meublé, inventaire, rotation plus forte",
      "Nu : gestion long terme, moins de charges d'ameublement",
      "LMNP au réel avec amortissement : voir simulateur rentabilité LMNP",
    ]),
    comparisons: [
      {
        scenario: "Location nue",
        value: fmtPct(rendNue, 2),
        detail: `Impôt ${lineValue(result, /impôt nue/i)}`,
      },
      {
        scenario: "Location meublée",
        value: fmtPct(rendMeublee, 2),
        detail: `Impôt ${lineValue(result, /impôt meublée/i)}`,
      },
    ],
  });
};

const enrichIfi: Enricher = (input, result) => {
  const ifi = lineAmount(result, /ifi estimé/i) ?? 0;
  const net = lineAmount(result, /patrimoine net taxable/i) ?? 0;
  const brut = num(input.patrimoineBrut);
  const rp = num(input.valeurRP);

  if (ifi <= 0 || net <= IFI_SEUIL) {
    return enrich(result, {
      primary: { label: "IFI annuel", value: fmtEur(0) },
      narrative: `Patrimoine net taxable ${fmtEur(net)} — sous le seuil de 1,3 M€, aucun IFI dû.`,
      interpretation: interpretationFavorable("Hors IFI", `Marge de ${fmtEur(IFI_SEUIL - net)} avant le seuil — abattement RP 30 % déjà appliqué sur ${fmtEur(rp)}.`),
      advice: adviceItems("Surveiller le seuil", [
        "Le seuil est calculé au 1er janvier — plus-values latentes comptent",
        "Dettes d'acquisition immobilière déductibles",
        "SCPI et biens locatifs entrent dans l'assiette",
      ]),
    });
  }

  const tauxEffectif = (ifi / net) * 100;

  return enrich(result, {
    primary: { label: "IFI annuel", value: fmtEur(ifi) },
    narrative: `Patrimoine net ${fmtEur(net)} (brut ${fmtEur(brut)}, RP ${fmtEur(rp)} avec abattement 30 %) → IFI ~${fmtEur(ifi)}/an (${fmtPct(tauxEffectif, 2)} du patrimoine net).`,
    interpretation:
      tauxEffectif <= 0.7
        ? interpretationIntermediate("IFI modéré", "Juste au-dessus du seuil — dettes et abattements RP limitent l'impôt.")
        : interpretationWarning("IFI significatif", `${fmtEur(ifi)}/an — optimisez la structure de dettes et les biens exonérés.`),
    advice: adviceItems("IFI", [
      "Dettes liées à l'acquisition/maintenance déductibles",
      "Biens ruraux/loués peuvent bénéficier d'exonérations partielles",
      "IFI se déclare avec l'impôt sur le revenu (formulaire 2042-IFI)",
    ]),
    callouts: oneCallout({
      variant: "info",
      title: "Barème progressif",
      text: "Taux de 0,5 % à 1,5 % selon les tranches — calcul simplifié ici.",
    }),
  });
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "impot-sur-le-revenu": enrichImpotSurLeRevenu,
  "quotient-familial": enrichQuotientFamilial,
  "prelevement-a-la-source": enrichPrelevementALaSource,
  "flat-tax-30-pourcent": enrichFlatTax30,
  "micro-entrepreneur-charges": enrichMicroEntrepreneurCharges,
  "credit-impot-emploi-domicile": enrichCreditImpotEmploiDomicile,
  "impot-dividendes": enrichImpotDividendes,
  "taux-marginal-imposition": enrichTauxMarginalImposition,
  "donation-numeraire": enrichDonationNumeraire,
  "cesu-credit-impot": enrichCesuCreditImpot,
  "impot-revenus-fonciers": enrichImpotRevenusFonciers,
  "taxe-fonciere": enrichTaxeFonciere,
  "deficit-foncier": enrichDeficitFoncier,
  "donation-succession-immobiliere": enrichDonationSuccession,
  "location-meublee-vs-nue": enrichLocationMeubleeVsNue,
  "ifi-impot-fortune-immobiliere": enrichIfi,
};
