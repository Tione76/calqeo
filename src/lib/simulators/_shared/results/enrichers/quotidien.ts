import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import type { ResultInterpretation } from "../../../types";
import {
  calculateurTva,
  calculateurPourcentage,
  regleDeTrois,
  calculateurAge,
  calculateurPourboire,
  partageFacture,
  convertisseurDevises,
  convertisseurHeuresMinutes,
  vitesseDistanceTemps,
  evolutionPourcentage,
} from "../../../general/quotidien";
import {
  buildPatch,
  num,
  primaryFromComputed,
  textFromComputed,
  valueFromComputed,
  type Enricher,
} from "./helpers";

const enrichCalculateurTva: Enricher = (input, result) => {
  const taux = num(input.taux);
  const modeHt = String(input.mode) === "ht";
  const computed = calculateurTva.calculate(input);
  const ht = valueFromComputed(computed, /^prix ht/i, result);
  const tva = valueFromComputed(computed, /montant tva/i, result);
  const ttc = valueFromComputed(computed, /prix ttc/i, result, /prix ttc/i);
  const tauxReduit = calculateurTva.calculate({ ...input, taux: "5.5" });

  const tauxLabels: Record<number, string> = {
    20: "taux normal (majorité des biens et services)",
    10: "taux intermédiaire (restauration, travaux sous conditions)",
    5.5: "taux réduit (alimentation, énergie, livres)",
    2.1: "taux super réduit (médicaments remboursables)",
  };

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Calcul",
    title: "Montants HT / TTC",
    message: `TVA ${formatPercent(taux, 1)} : ${formatCurrency(tva, 2)} sur une base ${modeHt ? "HT" : "TTC"} de ${formatCurrency(num(input.montant), 2)}.`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /prix ttc/i, result, "Prix TTC"),
    narrative: `${formatCurrency(ht, 2)} HT + ${formatCurrency(tva, 2)} de TVA (${formatPercent(taux, 1)}) = ${formatCurrency(ttc, 2)} TTC. ${tauxLabels[taux] ?? ""}`,
    interpretation,
    comparisons: [
      {
        scenario: "Taux réduit 5,5 %",
        value: formatCurrency(valueFromComputed(tauxReduit, /prix ttc/i, result), 2),
        detail: "TTC avec le taux alimentation / énergie",
      },
    ],
    callouts: [
      {
        variant: "info",
        title: "Contexte France",
        text: "Taux métropolitain indicatif. DOM, intracommunautaire et auto-entrepreneur en franchise : régimes différents.",
      },
    ],
  });
};

const enrichCalculateurPourcentage: Enricher = (input, result) => {
  const v = num(input.valeur);
  const p = num(input.pourcentage);
  const op = String(input.operation);
  const computed = calculateurPourcentage.calculate(input);
  const res = valueFromComputed(computed, /résultat|resultat/i, result, /résultat|resultat/i);
  const majore = calculateurPourcentage.calculate({ ...input, operation: "plus" });

  const opLabels: Record<string, string> = {
    de: `${formatPercent(p, 1)} de ${formatNumber(v, 2)}`,
    plus: `${formatNumber(v, 2)} majoré de ${formatPercent(p, 1)}`,
    moins: `${formatNumber(v, 2)} réduit de ${formatPercent(p, 1)}`,
  };

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Résultat",
    title: op === "de" ? "Part calculée" : "Valeur ajustée",
    message: `${opLabels[op] ?? ""} = ${formatNumber(res, 2)}.`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /résultat|resultat/i, result, "Résultat"),
    narrative: opLabels[op] ? `${opLabels[op]} donne ${formatNumber(res, 2)}.` : result.summary,
    interpretation,
    advice: {
      title: "À vérifier",
      items: [
        "Remises cumulées : multipliez les coefficients (ex. −20 % puis −10 % = ×0,72)",
        "Précisez si le pourcentage s'applique sur HT ou TTC",
        "Pour une variation entre deux valeurs, utilisez le simulateur d'évolution",
      ],
    },
    comparisons: [
      {
        scenario: "Valeur + X %",
        value: formatNumber(valueFromComputed(majore, /résultat|resultat/i, result), 2),
        detail: "Même base avec majoration",
      },
    ],
  });
};

const enrichRegleDeTrois: Enricher = (input, result) => {
  const a = num(input.a);
  const b = num(input.b);
  const c = num(input.c);
  const computed = regleDeTrois.calculate(input);
  const x = valueFromComputed(computed, /résultat|resultat|^x$/i, result, /résultat|resultat/i);
  const doubleC = regleDeTrois.calculate({ ...input, c: c * 2 });

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Proportion",
    title: "Proportion directe",
    message: `Si ${formatNumber(a, 2)} correspond à ${formatNumber(b, 2)}, alors ${formatNumber(c, 2)} correspond à ${formatNumber(x, 2)}.`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /résultat|resultat|^x$/i, result, "Résultat X"),
    narrative: `Proportion : ${formatNumber(a, 2)} → ${formatNumber(b, 2)} et ${formatNumber(c, 2)} → ${formatNumber(x, 2)} (X = C × B / A).`,
    interpretation,
    comparisons: [
      {
        scenario: `C doublé (${formatNumber(c * 2, 2)})`,
        value: formatNumber(valueFromComputed(doubleC, /résultat|resultat/i, result), 2),
        detail: "Proportion directe conservée",
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Proportion directe",
        text: "Valable quand les grandeurs évoluent ensemble (prix/kg, recettes). Pour une relation inverse (plus de workers = moins de temps), inversez le calcul.",
      },
    ],
  });
};

const enrichCalculateurAge: Enricher = (input, result) => {
  const computed = calculateurAge.calculate(input);
  const annees = valueFromComputed(computed, /années compl|annees compl/i, result);
  const totalJours = valueFromComputed(computed, /total jours/i, result);
  const ageLine = textFromComputed(computed, /^âge$|^age$/i, result, /^âge$|^age$/i);
  const naissance = textFromComputed(computed, /naissance/i, result);
  const dateCible = textFromComputed(computed, /date cible/i, result);
  const anneeSuivante = calculateurAge.calculate({
    ...input,
    anneeCible: num(input.anneeCible) + 1,
  });

  const interpretation: ResultInterpretation =
    annees >= 18
      ? {
          level: "neutral",
          badge: "Majeur",
          title: `${annees} ans révolus`,
          message: "Majorité légale en France à 18 ans — droits et obligations associés.",
        }
      : {
          level: "neutral",
          badge: "Mineur",
          title: `${annees} ans`,
          message: "Certaines démarches nécessitent l'autorisation parentale avant 18 ans.",
        };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /^âge$|^age$/i, result, "Âge exact"),
    narrative: `Né(e) le ${naissance || "—"}, vous avez ${ageLine} au ${dateCible || "—"} (${formatNumber(totalJours, 0)} jours).`,
    interpretation,
    advice: {
      title: "Usages courants",
      items: [
        "Retraite : date variable selon année de naissance (info-retraite.fr)",
        "Permis B : 18 ans (17 ans en conduite accompagnée)",
        "Élections : 18 ans pour voter aux élections nationales",
      ],
    },
    comparisons: [
      {
        scenario: "Un an plus tard",
        value: textFromComputed(anneeSuivante, /^âge$|^age$/i, result),
        detail: `${formatNumber(valueFromComputed(anneeSuivante, /total jours/i, result), 0)} jours au total`,
      },
    ],
  });
};

const enrichCalculateurPourboire: Enricher = (input, result) => {
  const addition = num(input.addition);
  const taux = num(input.pourboire);
  const pers = num(input.personnes);
  const computed = calculateurPourboire.calculate(input);
  const tip = valueFromComputed(computed, /pourboire/i, result);
  const total = valueFromComputed(computed, /total/i, result, /total/i);
  const parPers = valueFromComputed(computed, /par personne/i, result);
  const genereux = calculateurPourboire.calculate({ ...input, pourboire: 15 });

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Gratification",
    title: "Pourboire facultatif",
    message: `En France le service est inclus par la loi — ${formatPercent(taux, 0)} représente une gratification volontaire de ${formatCurrency(tip, 2)}.`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /total/i, result, "Total à payer"),
    narrative: `Addition ${formatCurrency(addition, 2)} + pourboire ${formatPercent(taux, 0)} (${formatCurrency(tip, 2)}) = ${formatCurrency(total, 2)}, soit ${formatCurrency(parPers, 2)}/personne pour ${pers}.`,
    interpretation,
    advice: {
      title: "Usages restaurant",
      items: [
        "5-15 % ou arrondir l'addition selon satisfaction",
        "Vérifiez sur l'addition si « service compris » est mentionné",
        "Espèces remises directement au serveur, souvent préférées",
      ],
    },
    comparisons: [
      {
        scenario: "Pourboire 15 %",
        value: formatCurrency(valueFromComputed(genereux, /total/i, result), 2),
        detail: "Total avec gratification plus généreuse",
      },
    ],
    callouts: [
      {
        variant: "info",
        title: "France vs étranger",
        text: "Aux États-Unis le pourboire compense le salaire ; en France il s'ajoute à un salaire déjà rémunéré.",
      },
    ],
  });
};

const enrichPartageFacture: Enricher = (input, result) => {
  const pers = num(input.personnes);
  const extra = num(input.payeurExtra);
  const computed = partageFacture.calculate(input);
  const standard = valueFromComputed(computed, /par personne/i, result, /par personne/i);
  const totalTip = valueFromComputed(computed, /total avec/i, result);
  const extraPay = valueFromComputed(computed, /payeurs/i, result);
  const avecExtra = partageFacture.calculate({ ...input, payeurExtra: 1 });

  const interpretation: ResultInterpretation =
    extra > 0
      ? {
          level: "neutral",
          badge: "Répartition",
          title: "Parts différenciées",
          message: `${pers - extra} personne(s) à ${formatCurrency(standard, 2)}, ${extra} à 1,5× pour les consommations plus élevées.`,
        }
      : {
          level: "neutral",
          badge: "Égalitaire",
          title: "Part égale",
          message: `${formatCurrency(standard, 2)} par personne sur ${pers} (${formatCurrency(totalTip, 2)} avec pourboire).`,
        };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /par personne/i, result, "Par personne"),
    narrative: `Total ${formatCurrency(num(input.total))} + pourboire ${formatPercent(num(input.pourboire), 0)} = ${formatCurrency(totalTip, 2)} à répartir entre ${pers} personne(s).`,
    interpretation,
    advice: {
      title: "Partager sans friction",
      items: [
        "Décidez du mode de partage avant la fin du repas",
        "Paylib, Lydia ou Splitwise pour rembourser immédiatement",
        "Si écarts importants (alcool, plats premium), utilisez l'option ×1,5",
      ],
    },
    comparisons: [
      {
        scenario: "1 payeur ×1,5",
        value: formatCurrency(valueFromComputed(avecExtra, /par personne/i, result), 2),
        detail: extra > 0 ? `Payeurs premium : ${formatCurrency(extraPay, 2)}` : "Part standard réduite",
      },
    ],
  });
};

const enrichConvertisseurDevises: Enricher = (input, result) => {
  const montant = num(input.montant);
  const src = String(input.deviseSource);
  const cible = String(input.deviseCible);
  const taux = num(input.taux);
  const computed = convertisseurDevises.calculate(input);
  const resLine = textFromComputed(computed, /résultat|resultat/i, result, /résultat|resultat/i);
  const double = convertisseurDevises.calculate({ ...input, montant: montant * 2 });

  const interpretation: ResultInterpretation =
    src === cible
      ? {
          level: "neutral",
          badge: "Identique",
          title: "Même devise",
          message: "Aucune conversion nécessaire — vérifiez les devises source et cible.",
        }
      : {
          level: "neutral",
          badge: "Conversion",
          title: "Montant converti",
          message: `Taux saisi : 1 EUR = ${taux} ${cible !== "EUR" ? cible : src}. Les banques appliquent une marge.`,
        };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /résultat|resultat/i, result, "Montant converti"),
    narrative: `${formatNumber(montant, 2)} ${src} converti en ${cible} au taux indiqué — résultat : ${resLine}.`,
    interpretation,
    comparisons: [
      {
        scenario: "Montant doublé",
        value: textFromComputed(double, /résultat|resultat/i, result),
        detail: "Conversion proportionnelle",
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Taux indicatif",
        text: "Saisissez le taux du jour (banque, xe.com). Frais de change et commissions non inclus — carte bancaire souvent plus avantageuse qu'un bureau de change.",
      },
    ],
  });
};

const enrichConvertisseurHeuresMinutes: Enricher = (input, result) => {
  const h = num(input.heures);
  const m = num(input.minutes);
  const mode = String(input.mode);
  const computed = convertisseurHeuresMinutes.calculate(input);
  const totalMin = valueFromComputed(computed, /total minutes/i, result);
  const decimal = valueFromComputed(computed, /heures décimales|heures decimales/i, result);
  const secondes = valueFromComputed(computed, /secondes/i, result);
  const uneHeure = convertisseurHeuresMinutes.calculate({ ...input, heures: h + 1, minutes: m });

  const modeLabels: Record<string, string> = {
    totalMin: `${totalMin} minutes au total`,
    decimal: `${formatNumber(decimal, 2)} heures décimales`,
    secondes: `${formatNumber(secondes, 0)} secondes`,
  };

  const primaryPattern =
    mode === "decimal"
      ? /heures décimales|heures decimales/i
      : mode === "secondes"
        ? /secondes/i
        : /total minutes/i;

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Durée",
    title: "Conversion effectuée",
    message: `${h} h ${m} min = ${modeLabels[mode] ?? `${totalMin} min`}.`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(
      computed,
      primaryPattern,
      result,
      mode === "decimal" ? "Heures décimales" : mode === "secondes" ? "Secondes" : "Total minutes"
    ),
    narrative: `${h} h ${m} min correspond à ${totalMin} min, ${formatNumber(decimal, 2)} h décimales ou ${formatNumber(secondes, 0)} s.`,
    interpretation,
    advice: {
      title: "Usage pratique",
      items: [
        "Heures décimales : multipliez par le taux horaire pour la facturation",
        "2 h 30 = 2,5 h (certaines entreprises utilisent les centièmes : 2,50 h)",
        "Arrondissez selon la convention de votre employeur ou client",
      ],
    },
    comparisons: [
      {
        scenario: "+1 heure",
        value: textFromComputed(uneHeure, primaryPattern, result),
        detail: `${valueFromComputed(uneHeure, /total minutes/i, result)} min au total`,
      },
    ],
  });
};

const enrichVitesseDistanceTemps: Enricher = (input, result) => {
  const mode = String(input.calcul);
  const d = num(input.distance);
  const v = num(input.vitesse);
  const computed = vitesseDistanceTemps.calculate(input);
  const mainLabel =
    mode === "temps" ? /temps/i : mode === "distance" ? /distance/i : /vitesse/i;
  const mainValue = textFromComputed(computed, mainLabel, result);
  const avecPauses =
    mode === "temps" && v > 0
      ? vitesseDistanceTemps.calculate({ ...input, vitesse: v / 1.15 })
      : null;

  let interpretation: ResultInterpretation;
  if (mode === "temps" && v > 130) {
    interpretation = {
      level: "intermediate",
      badge: "Vitesse élevée",
      title: "Temps théorique",
      message: `${mainValue} à ${v} km/h sans pause — en pratique comptez +15-20 % pour le trafic.`,
    };
  } else if (mode === "temps") {
    interpretation = {
      level: "neutral",
      badge: "Trajet",
      title: "Durée estimée",
      message: `${d} km à ${v} km/h : ${mainValue} (vitesse moyenne constante supposée).`,
    };
  } else {
    interpretation = {
      level: "neutral",
      badge: "Calcul",
      title: mode === "distance" ? "Distance parcourue" : "Vitesse moyenne",
      message: "Formule V = D / T appliquée à vos valeurs.",
    };
  }

  const pauseValue =
    avecPauses != null ? textFromComputed(avecPauses, /temps/i, result) : "";

  return buildPatch(result, {
    primary: primaryFromComputed(
      computed,
      mainLabel,
      result,
      mode === "temps" ? "Temps" : mode === "distance" ? "Distance" : "Vitesse"
    ),
    narrative:
      mode === "temps"
        ? `${d} km à ${v} km/h → ${mainValue}.${pauseValue ? ` Avec pauses (+15 %) : ~${pauseValue}.` : ""}`
        : result.summary,
    interpretation,
    advice: {
      title: "Route réelle",
      items: [
        "Ajoutez 15 min de pause toutes les 2 h de conduite",
        "Vitesse moyenne autoroute ~100-110 km/h malgré 130 km/h max",
        "Consultez un GPS pour le temps réel avec trafic",
      ],
    },
    comparisons:
      avecPauses != null
        ? [
            {
              scenario: "Avec pauses (+15 %)",
              value: pauseValue,
              detail: "Vitesse effective réduite",
            },
          ]
        : [
            {
              scenario: "Autre grandeur",
              value: textFromComputed(
                vitesseDistanceTemps.calculate({
                  ...input,
                  calcul: mode === "distance" ? "temps" : "distance",
                }),
                mode === "distance" ? /temps/i : /distance/i,
                result
              ),
              detail: "Calcul croisé V = D / T",
            },
          ],
  });
};

const enrichEvolutionPourcentage: Enricher = (input, result) => {
  const init = num(input.valeurInitiale);
  const fin = num(input.valeurFinale);
  const computed = evolutionPourcentage.calculate(input);
  const evol = valueFromComputed(computed, /évolution|evolution/i, result, /évolution|evolution/i);
  const type = fin >= init ? "Hausse" : "Baisse";
  const inverse = evolutionPourcentage.calculate({
    ...input,
    valeurInitiale: fin,
    valeurFinale: init,
  });

  let interpretation: ResultInterpretation;
  if (Math.abs(evol) < 5) {
    interpretation = {
      level: "neutral",
      badge: "Stable",
      title: "Variation faible",
      message: `${type} de ${formatPercent(Math.abs(evol), 1)} — variation modérée entre les deux valeurs.`,
    };
  } else if (evol > 0) {
    interpretation = {
      level: "neutral",
      badge: "Hausse",
      title: "Augmentation",
      message: `+${formatPercent(evol, 1)} : ${formatNumber(init, 2)} → ${formatNumber(fin, 2)} (+${formatNumber(fin - init, 2)}).`,
    };
  } else {
    interpretation = {
      level: "neutral",
      badge: "Baisse",
      title: "Diminution",
      message: `${formatPercent(evol, 1)} : ${formatNumber(init, 2)} → ${formatNumber(fin, 2)} (${formatNumber(fin - init, 2)}).`,
    };
  }

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /évolution|evolution/i, result, "Évolution"),
    narrative: `De ${formatNumber(init, 2)} à ${formatNumber(fin, 2)} : ${type.toLowerCase()} de ${formatPercent(Math.abs(evol), 1)} (référence = valeur initiale).`,
    interpretation,
    comparisons: [
      {
        scenario: "Sens inverse",
        value: textFromComputed(inverse, /évolution|evolution/i, result),
        detail: `${formatNumber(init, 2)} ↔ ${formatNumber(fin, 2)}`,
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Ne pas cumuler additivement",
        text: "+50 % puis −50 % ne revient pas au point de départ (−25 % net). Pour plusieurs périodes, utilisez le coefficient multiplicateur.",
      },
    ],
  });
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "calculateur-tva": enrichCalculateurTva,
  "calculateur-pourcentage": enrichCalculateurPourcentage,
  "regle-de-trois": enrichRegleDeTrois,
  "calculateur-age": enrichCalculateurAge,
  "calculateur-pourboire": enrichCalculateurPourboire,
  "partage-facture": enrichPartageFacture,
  "convertisseur-devises": enrichConvertisseurDevises,
  "convertisseur-heures-minutes": enrichConvertisseurHeuresMinutes,
  "vitesse-distance-temps": enrichVitesseDistanceTemps,
  "evolution-pourcentage": enrichEvolutionPourcentage,
};
