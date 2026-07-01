import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import type { ResultComparison, ResultInterpretation } from "../../../types";
import {
  calculCarrelage,
  quantitePeinture,
  surfaceParquet,
  maprimerenov,
  estimationConsommationEnergie,
  pompeAChaleurEconomies,
  volumeSurfacePiece,
  quantiteMortier,
  volumeBeton,
  economiesIsolation,
} from "../../../general/travaux";
import {
  buildPatch,
  num,
  primaryFromComputed,
  valueFromComputed,
  type Enricher,
} from "./helpers";

const enrichQuantitePeinture: Enricher = (input, result) => {
  const surface = num(input.surface);
  const couches = num(input.couches);
  const rendement = num(input.rendement);
  const computed = quantitePeinture.calculate(input);
  const brut = valueFromComputed(computed, /brut/i, result);
  const avecMarge = valueFromComputed(computed, /marge/i, result, /marge/i);
  const pots2L = Math.ceil(avecMarge / 2);

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Estimation",
    title: "Quantité à commander",
    message: `${formatNumber(avecMarge, 1)} L avec marge 10 % — prévoyez ${pots2L} pot(s) de 2 L ou l'équivalent en format disponible.`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /marge/i, result, "Quantité avec marge"),
    narrative: `Pour ${formatNumber(surface, 0)} m² en ${couches} couche(s) (rendement ${rendement} m²/L), comptez ${formatNumber(brut, 1)} L brut puis ${formatNumber(avecMarge, 1)} L avec 10 % de marge.`,
    interpretation,
    advice: {
      title: "Conseils achat peinture",
      items: [
        "Surcommandez légèrement : même teinte, même lot pour les retouches",
        "Déduisez ~15 % de surface pour portes et fenêtres sur les murs",
        "Sous-couche obligatoire sur supports poreux ou changement de couleur foncée",
      ],
    },
    callouts: [
      {
        variant: "tip",
        title: "Marge de sécurité",
        text: "10 % couvre les pertes au rouleau et au pinceau. Sur support très absorbant (placo neuf), montez à 15 %.",
      },
    ],
  });
};

const enrichCalculCarrelage: Enricher = (input, result) => {
  const marge = num(input.marge);
  const surface = num(input.surface);
  const computed = calculCarrelage.calculate(input);
  const carreaux = valueFromComputed(computed, /carreaux/i, result, /carreaux/i);
  const colle = valueFromComputed(computed, /colle/i, result);

  const interpretation: ResultInterpretation =
    marge >= 15
      ? {
          level: "favorable",
          badge: "Sécurisé",
          title: "Marge confortable",
          message: `${carreaux} carreaux avec ${formatPercent(marge, 0)} de chutes — adapté au calepinage diagonal ou aux coupes complexes.`,
        }
      : {
          level: "intermediate",
          badge: "Standard",
          title: "Marge standard",
          message: `${carreaux} carreaux (+ ${formatPercent(marge, 0)} chutes) — suffisant pour une pose droite classique.`,
        };

  const marge15 = calculCarrelage.calculate({ ...input, marge: 15 });

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /carreaux/i, result, "Carreaux à acheter"),
    narrative: `${formatNumber(surface, 0)} m² en ${num(input.longueurCarreau)}×${num(input.largeurCarreau)} cm : ${carreaux} carreaux et ~${formatNumber(colle, 0)} kg de colle.`,
    interpretation,
    advice: {
      title: "Avant de poser",
      items: [
        "Achetez tous les carreaux d'un même lot (numéro sur l'emballage)",
        "Prévoyez 1 kg de joint pour ~5 m² (joint 3 mm)",
        "Planifiez le calepinage depuis le centre ou une paroi visible",
      ],
    },
    comparisons: [
      {
        scenario: "Avec 15 % de marge chutes",
        value: `${valueFromComputed(marge15, /carreaux/i, result)} carreaux`,
        detail: "Recommandé en pose diagonale",
      },
    ],
    callouts: [
      {
        variant: "tip",
        title: "Marge chutes",
        text: "10 % en pose droite, 15 % en diagonal ou carreaux grand format. Gardez 2-3 carreaux après travaux pour les remplacements.",
      },
    ],
  });
};

const enrichVolumeBeton: Enricher = (input, result) => {
  const computed = volumeBeton.calculate(input);
  const volume = valueFromComputed(computed, /brut/i, result);
  const avecMarge = valueFromComputed(computed, /\+5|5 %/i, result, /\+5|5 %/i);
  const sacs = Math.ceil(avecMarge * 50);
  const type = String(input.type);

  const interpretation: ResultInterpretation =
    avecMarge >= 1
      ? {
          level: "neutral",
          badge: "Toupie",
          title: "Commande toupie conseillée",
          message: `${formatNumber(avecMarge, 2)} m³ (+5 %) — commandez une toupie, minimum généralement 1 m³.`,
        }
      : {
          level: "neutral",
          badge: "Sacs",
          title: "Volume en sacs",
          message: `${formatNumber(avecMarge, 2)} m³ — environ ${sacs} sacs de 35 L prémélangés suffisent.`,
        };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /\+5|5 %/i, result, "Volume béton (+5 %)"),
    narrative: `${type === "poteau" ? "Poteau" : "Dalle"} ${num(input.longueur)}×${num(input.largeur)}×${num(input.hauteur)} m : ${formatNumber(volume, 2)} m³ brut, ${formatNumber(avecMarge, 2)} m³ avec marge de perte.`,
    interpretation,
    advice: {
      title: "Organisation chantier",
      items: [
        "Prévoyez un accès toupie (portillon, bâche de protection)",
        "Coffrage prêt et armatures posées avant la livraison",
        "5-10 % de marge couvre le pompage et les déversements",
      ],
    },
    comparisons:
      volume >= 0.5
        ? [
            {
              scenario: "Sans marge de perte",
              value: `${formatNumber(volume, 2)} m³`,
              detail: "Risque de commande insuffisante",
            },
          ]
        : undefined,
  });
};

const enrichSurfaceParquet: Enricher = (input, result) => {
  const marge = num(input.marge);
  const computed = surfaceParquet.calculate(input);
  const packs = valueFromComputed(computed, /packs/i, result, /packs/i);
  const surfaceTotale = valueFromComputed(computed, /surface totale/i, result);
  const surfacePiece = valueFromComputed(computed, /surface pièce/i, result);
  const packSurface = num(input.surfacePack);

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Commande",
    title: `${packs} pack(s) à prévoir`,
    message: `${formatNumber(surfaceTotale, 1)} m² utiles (pièce ${formatNumber(surfacePiece, 1)} m² + ${formatPercent(marge, 0)} chutes).`,
  };

  const diagonal = surfaceParquet.calculate({ ...input, marge: 12 });

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /packs/i, result, "Packs nécessaires"),
    narrative: `Pièce ${num(input.longueur)}×${num(input.largeur)} m (${formatNumber(surfacePiece, 1)} m²) + ${formatPercent(marge, 0)} chutes = ${formatNumber(surfaceTotale, 1)} m², soit ${packs} pack(s) de ${packSurface} m².`,
    interpretation,
    advice: {
      title: "Pose parquet",
      items: [
        "8 % de marge en pose droite, 12 % en diagonal",
        "Acclimatez les lames 48 h dans la pièce avant pose",
        "Gardez un pack entier pour les réparations futures",
      ],
    },
    comparisons: [
      {
        scenario: "Pose diagonale (12 % chutes)",
        value: `${valueFromComputed(diagonal, /packs/i, result)} packs`,
        detail: `${formatNumber(valueFromComputed(diagonal, /surface totale/i, result), 1)} m² à couvrir`,
      },
    ],
    callouts: [
      {
        variant: "tip",
        title: "Surcommande",
        text: "Les packs s'achètent entiers : la marge inclut les chutes de découpe. Vérifiez le même numéro de lot sur tous les packs.",
      },
    ],
  });
};

const enrichMaprimerenov: Enricher = (input, result) => {
  const cout = num(input.coutTravaux);
  const couleur = String(input.couleur);
  const travaux = String(input.travaux);
  const computed = maprimerenov.calculate(input);
  const aide = valueFromComputed(computed, /aide maprime/i, result, /aide/i);
  const reste = valueFromComputed(computed, /reste à charge/i, result);
  const taux = cout > 0 ? (aide / cout) * 100 : 0;

  const couleurLabels: Record<string, string> = {
    bleu: "très modestes",
    jaune: "modestes",
    violet: "intermédiaires",
    rose: "supérieurs",
  };

  const interpretation: ResultInterpretation =
    taux >= 50
      ? {
          level: "favorable",
          badge: "Aide élevée",
          title: "Prise en charge importante",
          message: `${formatCurrency(aide)} d'aide (${formatPercent(taux, 0)} du coût) — reste à charge ${formatCurrency(reste)}.`,
        }
      : {
          level: "neutral",
          badge: "Estimation",
          title: "Aide forfaitaire",
          message: `Forfait ${travaux} pour revenus ${couleurLabels[couleur] ?? couleur} — plafonné au coût réel des travaux.`,
        };

  const modeste = maprimerenov.calculate({ ...input, couleur: "bleu" });

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /aide maprime/i, result, "MaPrimeRénov' estimée"),
    narrative: `Travaux ${travaux} à ${formatCurrency(cout)} (foyer ${couleurLabels[couleur] ?? couleur}) : aide estimée ${formatCurrency(aide)}, reste ${formatCurrency(reste)}.`,
    interpretation,
    advice: {
      title: "Obtenir l'aide",
      items: [
        "Artisan RGE obligatoire — vérifiez le label avant signature",
        "Cumulable avec CEE et éco-PTZ selon conditions",
        "Dossier sur france-renov.gouv.fr ou via un conseiller France Rénov'",
      ],
    },
    comparisons: [
      {
        scenario: "Revenus très modestes (bleu)",
        value: formatCurrency(valueFromComputed(modeste, /aide maprime/i, result)),
        detail: "Forfait maximal pour ce type de travaux",
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Barème simplifié",
        text: "Montants forfaitaires indicatifs. Le montant définitif dépend de votre RFR, du gain énergétique et des plafonds en vigueur.",
      },
    ],
  });
};

const enrichEstimationConsommationEnergie: Enricher = (input, result) => {
  const surface = num(input.surface);
  const isolation = String(input.isolation);
  const computed = estimationConsommationEnergie.calculate(input);
  const kwh = valueFromComputed(computed, /consommation/i, result);
  const cout = valueFromComputed(computed, /coût annuel/i, result, /coût/i);
  const kwhM2 = valueFromComputed(computed, /kwh\/m²/i, result) || (surface > 0 ? kwh / surface : 0);

  let interpretation: ResultInterpretation;
  if (kwhM2 > 250) {
    interpretation = {
      level: "warning",
      badge: "Passoire",
      title: "Consommation élevée",
      message: `${formatNumber(kwhM2, 0)} kWh/m²/an — logement énergivore (type DPE F/G). Isolation prioritaire.`,
    };
  } else if (kwhM2 > 150) {
    interpretation = {
      level: "intermediate",
      badge: "Moyen",
      title: "Consommation modérée",
      message: `${formatNumber(kwhM2, 0)} kWh/m²/an — marge d'amélioration par l'isolation et le chauffage.`,
    };
  } else {
    interpretation = {
      level: "favorable",
      badge: "Performant",
      title: "Bonne performance",
      message: `${formatNumber(kwhM2, 0)} kWh/m²/an — performance proche d'un logement bien isolé.`,
    };
  }

  const isole = estimationConsommationEnergie.calculate({ ...input, isolation: "bonne" });

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /coût annuel/i, result, "Coût annuel estimé"),
    narrative: `${surface} m², isolation ${isolation}, chauffage ${String(input.chauffage)} : ~${formatNumber(kwh, 0)} kWh/an soit ${formatCurrency(cout)}/an à ${num(input.prixKwh).toFixed(3)} €/kWh.`,
    interpretation,
    advice: {
      title: "Réduire la facture",
      items: [
        "Commencez par l'isolation des combles (30 % des déperditions)",
        "Thermostat programmable et entretien annuel du chauffage",
        "Comparez les offres énergie et suivez votre consommation réelle",
      ],
    },
    comparisons: [
      {
        scenario: "Avec une bonne isolation (DPE A/B/C)",
        value: formatCurrency(valueFromComputed(isole, /coût annuel/i, result)),
        detail: `${formatNumber(valueFromComputed(isole, /consommation/i, result), 0)} kWh/an estimés`,
      },
    ],
    callouts: [
      {
        variant: "info",
        title: "Estimation simplifiée",
        text: "Un audit énergétique ou le DPE officiel intègrent le climat, l'orientation et l'usage réel du logement.",
      },
    ],
  });
};

const enrichPompeAChaleurEconomies: Enricher = (input, result) => {
  const scop = num(input.efficacite);
  const investNet = num(input.coutPac) - num(input.aide);
  const computed = pompeAChaleurEconomies.calculate(input);
  const economie = valueFromComputed(computed, /économie/i, result, /économie/i);
  const roi = valueFromComputed(computed, /retour|roi/i, result);

  let interpretation: ResultInterpretation;
  if (roi <= 8 && economie > 0) {
    interpretation = {
      level: "favorable",
      badge: "Rentable",
      title: "Retour intéressant",
      message: `Économie ${formatCurrency(economie)}/an — investissement amorti en ~${formatNumber(roi, 1)} ans (SCOP ${scop}).`,
    };
  } else if (economie > 0) {
    interpretation = {
      level: "intermediate",
      badge: "Long terme",
      title: "Amortissement lent",
      message: `ROI ~${formatNumber(roi, 1)} ans — la PAC reste intéressante si vous restez longtemps dans le logement.`,
    };
  } else {
    interpretation = {
      level: "warning",
      badge: "À étudier",
      title: "Économie limitée",
      message: "Avec ces paramètres, l'économie est faible — vérifiez l'isolation et la compatibilité des émetteurs.",
    };
  }

  const scop4 = pompeAChaleurEconomies.calculate({ ...input, efficacite: 4 });
  const comparisons: ResultComparison[] = [
    {
      scenario: scop < 4 ? "Avec SCOP 4,0" : "Sans aides publiques",
      value: formatCurrency(
        scop < 4
          ? valueFromComputed(scop4, /économie/i, result)
          : valueFromComputed(pompeAChaleurEconomies.calculate({ ...input, aide: 0 }), /économie/i, result)
      ),
      detail: scop < 4 ? "Économie annuelle estimée plus élevée" : "Investissement net plus élevé",
    },
  ];

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /économie/i, result, "Économie annuelle"),
    narrative: `Chauffage actuel ${formatCurrency(num(input.coutActuel))}/an, PAC ${formatCurrency(num(input.coutPac))} (aides ${formatCurrency(num(input.aide))}, reste à charge ${formatCurrency(investNet)}) : économie ~${formatCurrency(economie)}/an, ROI ${formatNumber(roi, 1)} ans.`,
    interpretation,
    advice: {
      title: "Avant d'installer une PAC",
      items: [
        "Isolez d'abord — une PAC sur logement mal isolé surconsomme",
        "SCOP ≥ 3,5 visé pour une PAC air/eau en climat tempéré",
        "Vérifiez la compatibilité radiateurs basse température ou plancher chauffant",
      ],
    },
    comparisons,
  });
};

const enrichVolumeSurfacePiece: Enricher = (input, result) => {
  const l = num(input.longueur);
  const w = num(input.largeur);
  const h = num(input.hauteur);
  const computed = volumeSurfacePiece.calculate(input);
  const surface = valueFromComputed(computed, /surface au sol/i, result);
  const volume = valueFromComputed(computed, /volume/i, result, /volume/i);
  const murs = valueFromComputed(computed, /surface murs/i, result);
  const mursPeinture = murs * 0.85;

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Dimensions",
    title: "Surfaces calculées",
    message: `${formatNumber(surface, 2)} m² au sol, ${formatNumber(volume, 1)} m³ — murs ~${formatNumber(murs, 1)} m² (${formatNumber(mursPeinture, 1)} m² après ouvertures).`,
  };

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /volume/i, result, "Volume de la pièce"),
    narrative: `Pièce ${l}×${w}×${h} m : sol ${formatNumber(surface, 2)} m², volume ${formatNumber(volume, 1)} m³, murs ${formatNumber(murs, 1)} m².`,
    interpretation,
    advice: {
      title: "Utiliser ces mesures",
      items: [
        "Surface sol → parquet, carrelage (ajoutez marge chutes)",
        "Surface murs −15 % → peinture (portes et fenêtres)",
        "Volume → climatisation (~40 W/m³) ou débit VMC",
      ],
    },
    comparisons: [
      {
        scenario: "Surface murs pour peinture (−15 %)",
        value: `${formatNumber(mursPeinture, 1)} m²`,
        detail: "Après déduction portes et fenêtres",
      },
    ],
    callouts: [
      {
        variant: "tip",
        title: "Pièce en L ou alcôve",
        text: "Divisez en rectangles, calculez chaque zone séparément puis additionnez les surfaces.",
      },
    ],
  });
};

const enrichQuantiteMortier: Enricher = (input, result) => {
  const computed = quantiteMortier.calculate(input);
  const total = valueFromComputed(computed, /quantité totale|totale/i, result, /total/i);
  const sacs = valueFromComputed(computed, /sacs/i, result, /sacs/i);
  const type = String(input.type);
  const surface = num(input.surface);

  const typeLabels: Record<string, string> = {
    colle: "mortier-colle",
    joint: "joint carrelage",
    enduit: "enduit",
  };

  const interpretation: ResultInterpretation = {
    level: "neutral",
    badge: "Commande",
    title: `${sacs} sac(s) de 25 kg`,
    message: `${formatNumber(total, 0)} kg de ${typeLabels[type] ?? type} pour ${surface} m² — arrondi au sac entier.`,
  };

  const joint = quantiteMortier.calculate({ ...input, type: "joint" });

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /sacs 25/i, result, "Sacs de 25 kg"),
    narrative: `${surface} m² en ${typeLabels[type] ?? type} : ${formatNumber(total, 0)} kg, soit ${sacs} sac(s) de 25 kg (surcommande au supérieur).`,
    interpretation,
    advice: {
      title: "Chantier carrelage",
      items: [
        "Colle C2E pour extérieur et pièces humides, C1 pour intérieur sec",
        "Joint après 24-48 h de séchage de la colle",
        "Préparez 10 % de colle en plus sur surfaces irrégulières",
      ],
    },
    comparisons: [
      {
        scenario: "Joint carrelage (même surface)",
        value: `${valueFromComputed(joint, /sacs/i, result)} sac(s)`,
        detail: `${formatNumber(valueFromComputed(joint, /quantité totale/i, result), 0)} kg de joint`,
      },
    ],
    callouts: [
      {
        variant: "tip",
        title: "Quantités nettes",
        text: "Les sacs s'achètent entiers : le calcul arrondit au supérieur. Conservez un sac ouvert pour les retouches.",
      },
    ],
  });
};

const enrichEconomiesIsolation: Enricher = (input, result) => {
  const type = String(input.typeIsolation);
  const computed = economiesIsolation.calculate(input);
  const economie = valueFromComputed(computed, /économie/i, result, /économie/i);
  const roi = valueFromComputed(computed, /retour|roi/i, result);
  const tauxPct = valueFromComputed(computed, /réduction/i, result);

  const typeLabels: Record<string, string> = {
    combles: "combles perdus",
    murs: "murs",
    fenetres: "fenêtres double vitrage",
    globale: "rénovation globale",
  };

  let interpretation: ResultInterpretation;
  if (type === "combles" || type === "globale") {
    interpretation = {
      level: "favorable",
      badge: "Prioritaire",
      title: "Levier efficace",
      message: `${formatCurrency(economie)}/an économisés — ${type === "combles" ? "les combles perdent 30 % de la chaleur" : "rénovation globale : gain maximal"}.`,
    };
  } else {
    interpretation = {
      level: "neutral",
      badge: "Gain modéré",
      title: "Économie estimée",
      message: `Isolation ${typeLabels[type]} : ${formatPercent(tauxPct, 0)} de réduction, ROI ~${formatNumber(roi, 1)} ans.`,
    };
  }

  const globale = economiesIsolation.calculate({ ...input, typeIsolation: "globale" });

  return buildPatch(result, {
    primary: primaryFromComputed(computed, /économie/i, result, "Économie annuelle"),
    narrative: `Facture ${formatCurrency(num(input.factureActuelle))}/an, isolation ${typeLabels[type]} (${formatCurrency(num(input.coutIsolation))}, aides ${formatCurrency(num(input.aide))}) : économie ${formatCurrency(economie)}/an, ROI ${formatNumber(roi, 1)} ans.`,
    interpretation,
    advice: {
      title: "Prioriser l'isolation",
      items: [
        "Combles en premier — meilleur rapport coût/économie",
        "Artisan RGE pour MaPrimeRénov' et CEE",
        "Combinez avec changement de chauffage pour maximiser le gain DPE",
      ],
    },
    comparisons: [
      {
        scenario: "Rénovation globale (40 % d'économie)",
        value: formatCurrency(valueFromComputed(globale, /économie/i, result)),
        detail: `ROI ~${formatNumber(valueFromComputed(globale, /retour|roi/i, result), 1)} ans`,
      },
    ],
    callouts: [
      {
        variant: "info",
        title: "Ordre des travaux",
        text: "Isolez avant d'installer une PAC ou une chaudière performante — sinon l'équipement sera surdimensionné et moins rentable.",
      },
    ],
  });
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "quantite-peinture": enrichQuantitePeinture,
  "calcul-carrelage": enrichCalculCarrelage,
  "volume-beton": enrichVolumeBeton,
  "surface-parquet": enrichSurfaceParquet,
  "maprimerenov": enrichMaprimerenov,
  "estimation-consommation-energie": enrichEstimationConsommationEnergie,
  "pompe-a-chaleur-economies": enrichPompeAChaleurEconomies,
  "volume-surface-piece": enrichVolumeSurfacePiece,
  "quantite-mortier": enrichQuantiteMortier,
  "economies-isolation": enrichEconomiesIsolation,
};
