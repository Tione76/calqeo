import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import type { ResultInterpretation } from "../../../types";
import { type Enricher, lineNumber, lineText, num } from "./helpers";

const enrichCalculateurTva: Enricher = (input, result) => {
  const ht = lineNumber(result, /^prix ht/i) ?? num(input.montant);
  const tva = lineNumber(result, /montant tva/i) ?? 0;
  const ttc = lineNumber(result, /prix ttc/i) ?? 0;
  const taux = num(input.taux);
  const modeHt = String(input.mode) === "ht";

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

  return {
    ...result,
    primary: {
      label: "Prix TTC",
      value: lineText(result, /prix ttc/i) ?? formatCurrency(ttc, 2),
    },
    narrative: `${formatCurrency(ht, 2)} HT + ${formatCurrency(tva, 2)} de TVA (${formatPercent(taux, 1)}) = ${formatCurrency(ttc, 2)} TTC. ${tauxLabels[taux] ?? ""}`,
    interpretation,
    callouts: [
      {
        variant: "info",
        title: "Contexte France",
        text: "Taux métropolitain indicatif. DOM, intracommunautaire et auto-entrepreneur en franchise : régimes différents.",
      },
    ],
  };
};

const enrichCalculateurPourcentage: Enricher = (input, result) => {
  const v = num(input.valeur);
  const p = num(input.pourcentage);
  const op = String(input.operation);
  const res = lineNumber(result, /résultat|resultat/i) ?? 0;

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

  return {
    ...result,
    primary: {
      label: "Résultat",
      value: lineText(result, /résultat|resultat/i) ?? formatNumber(res, 2),
    },
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
  };
};

const enrichRegleDeTrois: Enricher = (input, result) => {
  const a = num(input.a);
  const b = num(input.b);
  const c = num(input.c);
  const x = lineNumber(result, /résultat|resultat|^x$/i) ?? (a > 0 ? (c * b) / a : 0);

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Proportion",
    title: "Proportion directe",
    message: `Si ${formatNumber(a, 2)} correspond à ${formatNumber(b, 2)}, alors ${formatNumber(c, 2)} correspond à ${formatNumber(x, 2)}.`,
  };

  return {
    ...result,
    primary: {
      label: "Résultat X",
      value: formatNumber(x, 2),
    },
    narrative: `Proportion : ${formatNumber(a, 2)} → ${formatNumber(b, 2)} et ${formatNumber(c, 2)} → ${formatNumber(x, 2)} (X = C × B / A).`,
    interpretation,
    callouts: [
      {
        variant: "note",
        title: "Proportion directe",
        text: "Valable quand les grandeurs évoluent ensemble (prix/kg, recettes). Pour une relation inverse (plus de workers = moins de temps), inversez le calcul.",
      },
    ],
  };
};

const enrichCalculateurAge: Enricher = (input, result) => {
  const annees = lineNumber(result, /années compl|annees compl/i) ?? 0;
  const totalJours = lineNumber(result, /total jours/i) ?? 0;
  const ageLine = lineText(result, /^âge$|^age$/i) ?? result.lines[0]?.value ?? "";

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

  return {
    ...result,
    primary: {
      label: "Âge exact",
      value: ageLine,
    },
    narrative: `Né(e) le ${lineText(result, /naissance/i) ?? "—"}, vous avez ${ageLine} au ${lineText(result, /date cible/i) ?? "—"} (${formatNumber(totalJours, 0)} jours).`,
    interpretation,
    advice: {
      title: "Usages courants",
      items: [
        "Retraite : date variable selon année de naissance (info-retraite.fr)",
        "Permis B : 18 ans (17 ans en conduite accompagnée)",
        "Élections : 18 ans pour voter aux élections nationales",
      ],
    },
  };
};

const enrichCalculateurPourboire: Enricher = (input, result) => {
  const addition = num(input.addition);
  const taux = num(input.pourboire);
  const tip = lineNumber(result, /pourboire/i) ?? addition * (taux / 100);
  const total = lineNumber(result, /total/i) ?? addition + tip;
  const pers = num(input.personnes);
  const parPers = pers > 0 ? total / pers : total;

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Gratification",
    title: "Pourboire facultatif",
    message: `En France le service est inclus par la loi — ${formatPercent(taux, 0)} représente une gratification volontaire de ${formatCurrency(tip, 2)}.`,
  };

  return {
    ...result,
    primary: {
      label: "Total à payer",
      value: lineText(result, /total/i) ?? formatCurrency(total, 2),
    },
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
    callouts: [
      {
        variant: "info",
        title: "France vs étranger",
        text: "Aux États-Unis le pourboire compense le salaire ; en France il s'ajoute à un salaire déjà rémunéré.",
      },
    ],
  };
};

const enrichPartageFacture: Enricher = (input, result) => {
  const pers = num(input.personnes);
  const extra = num(input.payeurExtra);
  const standard = lineNumber(result, /par personne/i) ?? 0;
  const totalTip = lineNumber(result, /total avec/i) ?? 0;

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

  return {
    ...result,
    primary: {
      label: "Par personne",
      value: lineText(result, /par personne/i) ?? formatCurrency(standard, 2),
    },
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
  };
};

const enrichConvertisseurDevises: Enricher = (input, result) => {
  const montant = num(input.montant);
  const src = String(input.deviseSource);
  const cible = String(input.deviseCible);
  const taux = num(input.taux);
  const resLine = lineText(result, /résultat|resultat/i) ?? "";

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

  return {
    ...result,
    primary: {
      label: "Montant converti",
      value: resLine,
    },
    narrative: `${formatNumber(montant, 2)} ${src} converti en ${cible} au taux indiqué — résultat : ${resLine}.`,
    interpretation,
    callouts: [
      {
        variant: "note",
        title: "Taux indicatif",
        text: "Saisissez le taux du jour (banque, xe.com). Frais de change et commissions non inclus — carte bancaire souvent plus avantageuse qu'un bureau de change.",
      },
    ],
  };
};

const enrichConvertisseurHeuresMinutes: Enricher = (input, result) => {
  const h = num(input.heures);
  const m = num(input.minutes);
  const totalMin = h * 60 + m;
  const decimal = h + m / 60;
  const mode = String(input.mode);

  const modeLabels: Record<string, string> = {
    totalMin: `${totalMin} minutes au total`,
    decimal: `${formatNumber(decimal, 2)} heures décimales`,
    secondes: `${formatNumber(totalMin * 60, 0)} secondes`,
  };

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Durée",
    title: "Conversion effectuée",
    message: `${h} h ${m} min = ${modeLabels[mode] ?? `${totalMin} min`}.`,
  };

  return {
    ...result,
    primary: {
      label: "Total minutes",
      value: `${totalMin} min`,
    },
    narrative: `${h} h ${m} min correspond à ${totalMin} min, ${formatNumber(decimal, 2)} h décimales ou ${formatNumber(totalMin * 60, 0)} s.`,
    interpretation,
    advice: {
      title: "Usage pratique",
      items: [
        "Heures décimales : multipliez par le taux horaire pour la facturation",
        "2 h 30 = 2,5 h (certaines entreprises utilisent les centièmes : 2,50 h)",
        "Arrondissez selon la convention de votre employeur ou client",
      ],
    },
  };
};

const enrichVitesseDistanceTemps: Enricher = (input, result) => {
  const mode = String(input.calcul);
  const d = num(input.distance);
  const v = num(input.vitesse);
  const mainLine = result.lines[0];

  let interpretation: ResultInterpretation;
  if (mode === "temps" && v > 130) {
    interpretation = {
      level: "intermediate",
      badge: "Vitesse élevée",
      title: "Temps théorique",
      message: `${mainLine?.value ?? ""} à ${v} km/h sans pause — en pratique comptez +15-20 % pour le trafic.`,
    };
  } else if (mode === "temps") {
    interpretation = {
      level: "neutral",
      badge: "Trajet",
      title: "Durée estimée",
      message: `${d} km à ${v} km/h : ${mainLine?.value ?? ""} (vitesse moyenne constante supposée).`,
    };
  } else {
    interpretation = {
      level: "neutral",
      badge: "Calcul",
      title: mode === "distance" ? "Distance parcourue" : "Vitesse moyenne",
      message: `Formule V = D / T appliquée à vos valeurs.`,
    };
  }

  const avecPauses =
    mode === "temps" && v > 0 ? (d / v) * 1.15 : null;
  const hPause = avecPauses ? Math.floor(avecPauses) : 0;
  const minPause = avecPauses ? Math.round((avecPauses - hPause) * 60) : 0;

  return {
    ...result,
    primary: {
      label: mainLine?.label ?? "Résultat",
      value: mainLine?.value ?? "",
    },
    narrative:
      mode === "temps"
        ? `${d} km à ${v} km/h → ${mainLine?.value ?? ""}.${avecPauses ? ` Avec pauses (+15 %) : ~${hPause} h ${minPause} min.` : ""}`
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
  };
};

const enrichEvolutionPourcentage: Enricher = (input, result) => {
  const init = num(input.valeurInitiale);
  const fin = num(input.valeurFinale);
  const evol = lineNumber(result, /évolution|evolution/i) ?? (init > 0 ? ((fin - init) / init) * 100 : 0);
  const type = fin >= init ? "Hausse" : "Baisse";

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

  return {
    ...result,
    primary: {
      label: "Évolution",
      value: lineText(result, /évolution|evolution/i) ?? formatPercent(evol, 1),
    },
    narrative: `De ${formatNumber(init, 2)} à ${formatNumber(fin, 2)} : ${type.toLowerCase()} de ${formatPercent(Math.abs(evol), 1)} (référence = valeur initiale).`,
    interpretation,
    callouts: [
      {
        variant: "note",
        title: "Ne pas cumuler additivement",
        text: "+50 % puis −50 % ne revient pas au point de départ (−25 % net). Pour plusieurs périodes, utilisez le coefficient multiplicateur.",
      },
    ],
  };
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
