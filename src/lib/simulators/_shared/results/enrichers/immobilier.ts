import { capaciteEmprunt } from "../../../capacite-emprunt";
import type { CapaciteEmpruntInput } from "../../../capacite-emprunt";
import { mensualitePret } from "../../../mensualite-pret";
import type { MensualitePretInput } from "../../../mensualite-pret";
import { IFI_SEUIL } from "@/data/regulations/ifi";
import type {
  ResultAdvice,
  ResultComparison,
  ResultInterpretation,
  SimulatorResult,
} from "../../../types";
import {
  type Enricher,
  type EnricherInput,
  findLine,
  findNumber,
  findPercent,
  lineText,
  formatCurrency,
  formatPercent,
  HCSF_TAUX_ENDETTEMENT_MAX,
  mergeResult,
  num,
  parseFormattedNumber,
  parsePercent,
} from "./helpers";

// ─── Shared interpretation helpers ─────────────────────────────────

function endettementInterpretation(taux: number): ResultInterpretation {
  if (taux <= HCSF_TAUX_ENDETTEMENT_MAX - 3) {
    return {
      level: "favorable",
      badge: "Conforme",
      title: "Situation favorable",
      message: `Votre taux d'endettement reste sous le plafond recommandé de ${HCSF_TAUX_ENDETTEMENT_MAX} %.`,
    };
  }
  if (taux <= HCSF_TAUX_ENDETTEMENT_MAX) {
    return {
      level: "intermediate",
      badge: "À surveiller",
      title: "Situation intermédiaire",
      message: `Vous êtes proche du plafond de ${HCSF_TAUX_ENDETTEMENT_MAX} % — une marge limitée pour les banques.`,
    };
  }
  return {
    level: "warning",
    badge: "Attention",
    title: "Situation à améliorer",
    message: `Votre taux dépasse le plafond HCSF de ${HCSF_TAUX_ENDETTEMENT_MAX} % : le dossier risque un refus.`,
  };
}

function rendementNetInterpretation(pct: number): ResultInterpretation {
  if (pct >= 5) {
    return {
      level: "favorable",
      badge: "Excellent",
      title: "Situation favorable",
      message: "Votre rendement net est solide pour un investissement locatif.",
    };
  }
  if (pct >= 3) {
    return {
      level: "intermediate",
      badge: "Moyen",
      title: "Situation intermédiaire",
      message: "Rendement correct — optimisez charges et loyer pour gagner en rentabilité.",
    };
  }
  if (pct > 0) {
    return {
      level: "warning",
      badge: "Faible",
      title: "Situation à améliorer",
      message: "Le rendement net reste modeste : vérifiez le prix d'achat et les charges.",
    };
  }
  return {
    level: "warning",
    badge: "Attention",
    title: "Situation défavorable",
    message: "Le cash-flow net est négatif ou nul : l'opération est risquée.",
  };
}

function cashFlowInterpretation(cf: number): ResultInterpretation {
  if (cf >= 100) {
    return {
      level: "favorable",
      badge: "Excédent",
      title: "Cash-flow positif",
      message: "Le bien génère un surplus mensuel après charges et crédit.",
    };
  }
  if (cf >= 0) {
    return {
      level: "intermediate",
      badge: "Équilibre",
      title: "Autofinancement",
      message: "Le loyer couvre charges et mensualité, sans marge confortable.",
    };
  }
  return {
    level: "warning",
    badge: "Déficit",
    title: "Effort de trésorerie",
    message: "Vous devrez compléter chaque mois — vérifiez la durée du crédit et le loyer.",
  };
}

const endettementAdvice: ResultAdvice = {
  title: "Pour améliorer votre taux d'endettement",
  items: [
    "Solder ou réduire vos crédits en cours",
    "Augmenter votre apport pour baisser la mensualité",
    "Allonger la durée du prêt",
    "Revoir le montant ou le prix du projet",
  ],
};

const capaciteAdvice: ResultAdvice = {
  title: "Pour augmenter votre capacité d'emprunt",
  items: [
    "Augmenter votre apport personnel",
    "Réduire vos charges de crédit actuelles",
    "Allonger la durée du prêt",
    "Améliorer vos revenus pris en compte par la banque",
  ],
};

const rendementAdvice: ResultAdvice = {
  title: "Pour améliorer votre rendement locatif",
  items: [
    "Négocier le prix d'achat ou les frais de notaire",
    "Optimiser le loyer et limiter la vacance locative",
    "Réduire les charges non récupérables",
    "Comparer plusieurs scénarios de travaux",
  ],
};

// ─── Core simulators ───────────────────────────────────────────────

function enrichCapaciteEmprunt(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const typed = input as unknown as CapaciteEmpruntInput;
  const full = capaciteEmprunt.calculate(typed);
  const capacite =
    parseFormattedNumber(
      full.lines.find((l) => l.label.toLowerCase().includes("capacité"))?.value ?? ""
    ) ?? 0;
  const tauxReel = parsePercent(
    full.lines.find((l) => l.label.includes("réel"))?.value ?? ""
  );
  const budgetAchat = parseFormattedNumber(
    full.lines.find((l) => l.label.includes("Budget d'achat"))?.value ?? ""
  );
  const prixBien = parseFormattedNumber(
    full.lines.find((l) => l.label.includes("Prix du bien"))?.value ?? ""
  );

  const apportLabel =
    typed.apportPersonnel > 0
      ? ` Votre apport de ${formatCurrency(typed.apportPersonnel)} porte le budget d'achat total à ${budgetAchat ? formatCurrency(budgetAchat) : "—"}.`
      : " Sans apport, seul le montant empruntable limite votre projet.";

  const narrative = `Sur ${typed.dureeAnnees} ans à ${formatPercent(typed.tauxInteret, 2)}, avec ${formatCurrency(typed.revenusMensuels)} de revenus et ${formatCurrency(typed.chargesMensuelles)} de charges, la banque pourrait financer jusqu'à ${formatCurrency(capacite)} — soit un bien d'environ ${prixBien ? formatCurrency(prixBien) : "—"} hors frais de notaire.${apportLabel}`;

  const comparisons: ResultComparison[] = [];
  if (typed.dureeAnnees < 30) {
    const alt = capaciteEmprunt.calculate({ ...typed, dureeAnnees: typed.dureeAnnees + 5 });
    const altCap =
      parseFormattedNumber(
        alt.lines.find((l) => l.label.toLowerCase().includes("capacité"))?.value ?? ""
      ) ?? 0;
    comparisons.push({
      scenario: `Si la durée passait à ${typed.dureeAnnees + 5} ans`,
      value: formatCurrency(altCap),
      detail: `+${formatCurrency(altCap - capacite)} vs. ${typed.dureeAnnees} ans`,
    });
  }
  if (typed.apportPersonnel > 0) {
    const alt = capaciteEmprunt.calculate({
      ...typed,
      apportPersonnel: typed.apportPersonnel * 2,
    });
    const altBudget = parseFormattedNumber(
      alt.lines.find((l) => l.label.includes("Budget d'achat"))?.value ?? ""
    );
    if (altBudget) {
      comparisons.push({
        scenario: "Si votre apport était doublé",
        value: formatCurrency(altBudget),
        detail: "Budget d'achat total (crédit + apport)",
      });
    }
  }

  return mergeResult(result, {
    lines: full.lines,
    primary: { label: "Capacité d'emprunt estimée", value: formatCurrency(capacite) },
    narrative,
    interpretation:
      tauxReel != null
        ? endettementInterpretation(tauxReel)
        : {
            level: "neutral",
            title: "Estimation réalisée",
            message: "Votre capacité dépend de vos revenus, charges et paramètres de crédit.",
          },
    advice: capaciteAdvice,
    comparisons: comparisons.length ? comparisons : undefined,
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Cette estimation n'inclut pas l'assurance emprunteur. Les banques vérifient aussi votre reste à vivre.",
      },
    ],
  });
}

function enrichTauxEndettement(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const revenus = num(input.revenusMensuels);
  const chargesActuelles = num(input.chargesMensuelles);
  const mensualiteProjet = num(input.mensualiteProjet);
  const charges = chargesActuelles + mensualiteProjet;
  const taux = revenus > 0 ? (charges / revenus) * 100 : 0;
  const marge = Math.max(0, HCSF_TAUX_ENDETTEMENT_MAX - taux);

  const narrative = `Entre vos ${formatCurrency(chargesActuelles)} de crédits en cours et ${formatCurrency(mensualiteProjet)} de mensualité projetée (assurance incluse), ${formatCurrency(charges)} partent chaque mois en remboursements — soit ${formatPercent(taux, 1)} de vos ${formatCurrency(revenus)} de revenus nets, avec ${formatPercent(marge, 1)} de marge avant le plafond HCSF.`;

  return mergeResult(result, {
    primary: { label: "Votre taux d'endettement", value: formatPercent(taux, 1) },
    narrative,
    interpretation: endettementInterpretation(taux),
    advice: endettementAdvice,
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: `Le HCSF recommande un maximum de ${HCSF_TAUX_ENDETTEMENT_MAX} % des revenus nets, assurance incluse.`,
      },
    ],
  });
}

function enrichRendementLocatif(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const netPct = findPercent(result, "rendement net") ?? 0;
  const brutPct = findPercent(result, "rendement brut") ?? 0;
  const invest = findNumber(result, "investissement");
  const cashFlow = findNumber(result, "cash-flow");
  const vacance = num(input.vacanceLocative);

  const narrative = `En intégrant ${formatCurrency(num(input.prixAchat))} d'achat, ${formatCurrency(num(input.fraisNotaire))} de notaire, ${formatCurrency(num(input.travaux))} de travaux et ${formatPercent(vacance, 0)} de vacance, un loyer de ${formatCurrency(num(input.loyerMensuel))}/mois donne un brut de ${formatPercent(brutPct, 2)} et un net de ${formatPercent(netPct, 2)}${cashFlow != null ? ` — soit ${formatCurrency(cashFlow)}/mois de cash-flow` : ""}.`;

  return mergeResult(result, {
    primary: { label: "Rendement net", value: formatPercent(netPct, 2) },
    narrative,
    interpretation: rendementNetInterpretation(netPct),
    advice: rendementAdvice,
    callouts: invest
      ? [
          {
            variant: "note",
            title: "À savoir",
            text: "Le rendement brut ignore charges et vacance — utilisez le net pour comparer des projets.",
          },
        ]
      : undefined,
  });
}

function enrichMensualitePret(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const typed = input as unknown as MensualitePretInput;
  const mensualiteTotale = lineText(result, "mensualité totale");
  const interets = findNumber(result, "intérêts") ?? findNumber(result, "Coût total des intérêts");
  const coutTotal = findNumber(result, "Coût total du crédit");

  const narrative = `Emprunter ${formatCurrency(typed.montantEmprunt)} sur ${typed.dureeAnnees} ans à ${formatPercent(typed.tauxInteret, 2)} (assurance ${formatPercent(typed.tauxAssurance, 2)}/an) représente ${mensualiteTotale}/mois — ${interets ? `dont ${formatCurrency(interets)} d'intérêts` : "avec un coût du crédit à estimer"} sur toute la durée${coutTotal ? ` pour un total de ${formatCurrency(coutTotal)} remboursé` : ""}.`;

  const comparisons: ResultComparison[] = [];
  if (typed.dureeAnnees >= 10 && typed.dureeAnnees < 30) {
    const alt = mensualitePret.calculate({ ...typed, dureeAnnees: typed.dureeAnnees - 5 });
    const altMens = findLine(alt, "mensualité totale")?.value ?? "";
    const altInterets = findLine(alt, "intérêts")?.value ?? "";
    comparisons.push({
      scenario: `Si la durée passait à ${typed.dureeAnnees - 5} ans`,
      value: altMens,
      detail: `Intérêts : ${altInterets}`,
    });
  }
  if (typed.tauxInteret >= 0.5) {
    const alt = mensualitePret.calculate({
      ...typed,
      tauxInteret: Math.max(0, typed.tauxInteret - 0.5),
    });
    comparisons.push({
      scenario: "Si le taux baissait de 0,5 point",
      value: findLine(alt, "mensualité totale")?.value ?? "",
      detail: `Taux : ${formatPercent(typed.tauxInteret - 0.5, 2)}`,
    });
  }

  return mergeResult(result, {
    primary: { label: "Mensualité totale", value: mensualiteTotale },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Estimation",
      title: "Échéance mensuelle",
      message: "Comparez plusieurs durées et taux avant de vous engager — la mensualité n'est qu'une facette du coût total.",
    },
    advice: {
      title: "Pour optimiser votre crédit",
      items: [
        "Négociez le taux nominal et l'assurance emprunteur (délégation)",
        "Testez une durée plus courte si votre budget le permet",
        "Anticipez les frais de garantie et de dossier dans le budget global",
        "Simulez l'impact sur votre taux d'endettement avec le simulateur dédié",
      ],
    },
    comparisons: comparisons.length ? comparisons : undefined,
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "En début de prêt, la majorité de la mensualité sert à payer les intérêts — le capital se rembourse progressivement.",
      },
    ],
  });
}

// ─── Financement (part 1) ──────────────────────────────────────────

function enrichFraisNotaire(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const prix = num(input.prixAchat);
  const typeBien = String(input.typeBien) === "neuf" ? "neuf" : "ancien";
  const frais = findNumber(result, "frais de notaire") ?? 0;
  const taux = findPercent(result, "taux") ?? 0;
  const total = prix + frais;

  const narrative = `Pour un bien ${typeBien === "neuf" ? "neuf (VEFA)" : "dans l'ancien"} à ${formatCurrency(prix)}, comptez environ ${formatCurrency(frais)} de frais de notaire (${formatPercent(taux, 1)}) — un budget acquisition réaliste tourne autour de ${formatCurrency(total)}.`;

  return mergeResult(result, {
    primary: { label: "Frais de notaire", value: formatCurrency(frais) },
    narrative,
    interpretation: {
      level: typeBien === "neuf" ? "favorable" : "neutral",
      badge: typeBien === "neuf" ? "Neuf" : "Ancien",
      title: typeBien === "neuf" ? "Frais réduits" : "Frais standard",
      message:
        typeBien === "neuf"
          ? "Le neuf bénéficie de droits de mutation réduits (~2,5 %)."
          : "Dans l'ancien, prévoyez 7 à 8 % du prix en trésorerie ou apport.",
    },
    advice: {
      title: "Pour anticiper les frais de notaire",
      items: [
        "Intégrez les frais dès la recherche de bien, pas seulement le prix affiché",
        "Demandez une proforma au notaire pour une estimation exacte",
        "Vérifiez si la banque accepte de financer une partie des frais",
        "Comparez ancien et neuf sur le coût global, pas le seul prix au m²",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Les émoluments du notaire sont encadrés par la loi — seuls certains actes annexes peuvent varier.",
      },
    ],
  });
}

function enrichCoutTotalCredit(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montant);
  const duree = num(input.duree);
  const taux = num(input.taux);
  const total = findNumber(result, "coût total") ?? 0;
  const interets = findNumber(result, "intérêts") ?? 0;
  const ratioInterets = montant > 0 ? (interets / montant) * 100 : 0;

  const narrative = `Sur ${duree} ans à ${formatPercent(taux, 2)}, emprunter ${formatCurrency(montant)} coûte ${formatCurrency(total)} au total — les intérêts représentent ${formatCurrency(interets)}, soit ${formatPercent(ratioInterets, 0)} du capital emprunté.`;

  return mergeResult(result, {
    primary: { label: "Coût total du crédit", value: formatCurrency(total) },
    narrative,
    interpretation:
      ratioInterets > 40
        ? {
            level: "warning",
            badge: "Coût élevé",
            title: "Intérêts importants",
            message: "Une durée longue ou un taux élevé alourdit fortement le coût global.",
          }
        : ratioInterets > 25
          ? {
              level: "intermediate",
              badge: "Modéré",
              title: "Coût modéré",
              message: "Le coût des intérêts reste significatif — comparez avec une durée plus courte.",
            }
          : {
              level: "favorable",
              badge: "Raisonnable",
              title: "Coût maîtrisé",
              message: "Le ratio intérêts/capital reste contenu pour cette durée.",
            },
    advice: {
      title: "Pour réduire le coût total",
      items: [
        "Raccourcir la durée si la mensualité reste supportable",
        "Négocier le taux et comparer plusieurs établissements",
        "Optimiser l'assurance emprunteur via une délégation",
        "Envisager des remboursements anticipés si votre contrat le permet",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "Le TAEG inclut aussi les frais de dossier et de garantie — ce simulateur se concentre sur intérêts et assurance.",
      },
    ],
  });
}

function enrichTableauAmortissement(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montant);
  const duree = num(input.duree);
  const taux = num(input.taux);
  const mensualite = lineText(result, "mensualité");
  const interets = findNumber(result, "intérêts") ?? 0;

  const narrative = `Pour ${formatCurrency(montant)} empruntés sur ${duree} ans à ${formatPercent(taux, 2)}, chaque échéance est de ${mensualite} — les intérêts cumulés atteignent ${formatCurrency(interets)}, concentrés surtout les premières années du prêt.`;

  return mergeResult(result, {
    primary: { label: "Mensualité constante", value: mensualite },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Échéancier",
      title: "Répartition capital / intérêts",
      message: "Au début, les intérêts dominent la mensualité ; la part de capital augmente progressivement.",
    },
    advice: {
      title: "Pour lire votre tableau d'amortissement",
      items: [
        "Repérez le mois où le capital remboursé dépasse les intérêts",
        "Comparez le capital restant dû à mi-parcours et en fin de prêt",
        "Évaluez l'intérêt d'un remboursement anticipé en début de prêt",
        "Demandez l'échéancier officiel à votre banque avant signature",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Un remboursement anticipé recalcule les échéances futures — le tableau affiché ici est une projection standard.",
      },
    ],
  });
}

// ─── Financement (part 2) ──────────────────────────────────────────

function enrichRemboursementAnticipe(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montantRembourse);
  const crd = num(input.capitalRestant);
  const mois = num(input.moisRestants);
  const gain = findNumber(result, "gain net") ?? 0;
  const ira = findNumber(result, "IRA") ?? 0;
  const eco = findNumber(result, "économie") ?? 0;

  const narrative = `En remboursant ${formatCurrency(montant)} par anticipation sur un CRD de ${formatCurrency(crd)} (${mois} mois restants), vous économisez environ ${eco ? formatCurrency(eco) : "—"} d'intérêts, moins ${formatCurrency(ira)} d'IRA — soit un gain net de ${formatCurrency(gain)}.`;

  return mergeResult(result, {
    primary: { label: "Gain net estimé", value: formatCurrency(gain) },
    narrative,
    interpretation:
      gain > 0
        ? {
            level: "favorable",
            badge: "Rentable",
            title: "Opération avantageuse",
            message: "L'économie d'intérêts dépasse les indemnités de remboursement anticipé.",
          }
        : gain === 0
          ? {
              level: "intermediate",
              badge: "Neutre",
              title: "Gain nul",
              message: "Les IRA absorbent l'économie d'intérêts — vérifiez les exemptions possibles.",
            }
          : {
              level: "warning",
              badge: "Défavorable",
              title: "Gain négatif",
              message: "Les IRA dépassent l'économie estimée — le remboursement anticipé n'est pas rentable ici.",
            },
    advice: {
      title: "Avant un remboursement anticipé",
      items: [
        "Vérifiez les IRA dans votre offre de prêt (plafond 3 % ou 6 mois d'intérêts)",
        "Privilégiez un remboursement en début de prêt, quand les intérêts restants sont élevés",
        "Demandez si votre contrat prévoit des exemptions (vente, mutation…)",
        "Comparez avec un placement de la même somme sur la durée restante",
      ],
    },
    callouts: [
      {
        variant: "warning",
        title: "Attention",
        text: "Calcul simplifié — votre banque appliquera le plafond légal le plus favorable entre 3 % du capital et 6 mois d'intérêts.",
      },
    ],
  });
}

function enrichPretPtz(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const revenu = num(input.revenuFiscal);
  const prix = num(input.prixBien);
  const zone = String(input.zone);
  const nb = num(input.nbPersonnes);
  const montant = findNumber(result, "PTZ") ?? 0;
  const eligible = lineText(result, "éligibilité").toLowerCase().includes("oui");

  const narrative = eligible
    ? `En zone ${zone} pour un foyer de ${nb} personne${nb > 1 ? "s" : ""} (revenu fiscal ${formatCurrency(revenu)}), le PTZ pourrait financer jusqu'à ${formatCurrency(montant)} sur un bien à ${formatCurrency(prix)} — sans intérêts, en complément d'un prêt principal.`
    : `Avec ${formatCurrency(revenu)} de revenu fiscal en zone ${zone}, vous dépassez probablement les plafonds PTZ — le dispositif ne semble pas accessible pour ce projet à ${formatCurrency(prix)}.`;

  return mergeResult(result, {
    primary: { label: "Montant PTZ estimé", value: formatCurrency(montant) },
    narrative,
    interpretation: eligible
      ? {
          level: "favorable",
          badge: "Éligible",
          title: "Aide potentielle",
          message: "Le PTZ peut réduire votre effort d'emprunt principal — sous réserve d'instruction.",
        }
      : {
          level: "warning",
          badge: "Non éligible",
          title: "Plafond dépassé",
          message: "Vérifiez les plafonds officiels ou d'autres dispositifs (Action Logement, prêt accession…).",
        },
    advice: {
      title: "Pour optimiser le PTZ",
      items: [
        "Confirmez l'éligibilité primo-accédant et la nature du bien (neuf, ancien avec travaux)",
        "Le PTZ ne finance pas les frais de notaire — prévoyez-les dans l'apport",
        "Combinez-le avec la capacité d'emprunt classique pour dimensionner le projet",
        "Consultez les plafonds à jour sur service-public.fr selon votre zone",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Le PTZ est remboursé sans intérêts, avec un différé possible selon vos revenus.",
      },
    ],
  });
}

function enrichPretRelais(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const valeur = num(input.valeurBien);
  const crd = num(input.crd);
  const pct = num(input.pctAvance);
  const duree = num(input.dureeMois);
  const montant = findNumber(result, "prêt relais") ?? 0;
  const interets = findNumber(result, "intérêts") ?? 0;

  const narrative = `Sur un bien à vendre estimé ${formatCurrency(valeur)}, une avance bancaire de ${formatPercent(pct, 0)} (${formatCurrency(valeur * pct / 100)}) moins ${formatCurrency(crd)} de CRD laisse ${formatCurrency(montant)} finançables en relais sur ${duree} mois — coût des intérêts : ${formatCurrency(interets)}.`;

  return mergeResult(result, {
    primary: { label: "Montant prêt relais", value: formatCurrency(montant) },
    narrative,
    interpretation:
      montant > 0
        ? {
            level: "intermediate",
            badge: "Relais",
            title: "Financement transitoire",
            message: "Le relais comble l'écart entre vente et achat — les taux sont généralement plus élevés qu'un crédit amortissable.",
          }
        : {
            level: "warning",
            badge: "Insuffisant",
            title: "Avance insuffisante",
            message: "Le CRD actuel absorbe l'avance bancaire — revoyez la valeur de revente ou le pourcentage d'avance.",
          },
    advice: {
      title: "Pour sécuriser un prêt relais",
      items: [
        "Obtenez une estimation fiable et réaliste de la valeur de revente",
        "Prévoyez une marge si la vente tarde (6 à 12 mois de plus)",
        "Comparez relais sec et relais adossé à un crédit amortissable",
        "Anticipez le coût des intérêts sur toute la durée du relais",
      ],
    },
    callouts: [
      {
        variant: "warning",
        title: "Attention",
        text: "Si le bien ne se vend pas dans les délais, vous devrez renégocier ou convertir le relais en crédit classique.",
      },
    ],
  });
}

function enrichRachatCredit(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const crd = num(input.crd);
  const tauxActuel = num(input.tauxActuel);
  const tauxNouveau = num(input.tauxNouveau);
  const ecoMensuelle = findNumber(result, "économie mensuelle") ?? 0;
  const ecoPositive = ecoMensuelle > 0;

  const narrative = `Sur ${formatCurrency(crd)} restants dus, passer de ${formatPercent(tauxActuel, 2)} à ${formatPercent(tauxNouveau, 2)} ${ecoPositive ? "libère" : "coûte"} ${formatCurrency(Math.abs(ecoMensuelle))}/mois — intégrez les ${formatCurrency(num(input.fraisRachat))} de frais de rachat pour juger du gain réel.`;

  const comparisons: ResultComparison[] = [
    {
      scenario: "Mensualité actuelle",
      value: lineText(result, "Mensualité actuelle"),
    },
    {
      scenario: "Nouvelle mensualité",
      value: lineText(result, "Nouvelle mensualité"),
      detail: lineText(result, "Coût total avec rachat"),
    },
  ];

  return mergeResult(result, {
    primary: { label: "Économie mensuelle", value: formatCurrency(ecoMensuelle) },
    narrative,
    interpretation: ecoPositive
      ? {
          level: "favorable",
          badge: "Gain",
          title: "Rachat intéressant",
          message: "La baisse de taux compense les frais sur la durée restante.",
        }
      : {
          level: "warning",
          badge: "Surcoût",
          title: "Rachat peu avantageux",
          message: "Les frais et le nouveau taux ne génèrent pas d'économie nette — comparez d'autres offres.",
        },
    advice: {
      title: "Avant un rachat de crédit",
      items: [
        "Calculez le gain net sur toute la durée restante, pas seulement la mensualité",
        "Vérifiez les IRA sur l'ancien prêt et les frais de garantie du nouveau",
        "Comparez renégociation interne et rachat externe",
        "Renégociez aussi l'assurance emprunteur en parallèle",
      ],
    },
    comparisons,
  });
}

function enrichAssuranceEmprunteur(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const capital = num(input.capital);
  const taux = num(input.tauxAssurance);
  const duree = num(input.duree);
  const mensuel = findNumber(result, "mensuelle") ?? 0;
  const total = findNumber(result, "total") ?? 0;

  const narrative = `Assurer ${formatCurrency(capital)} à ${formatPercent(taux, 2)}/an sur ${duree} ans coûte ${formatCurrency(mensuel)}/mois, soit ${formatCurrency(total)} sur la durée — une part non négligeable du coût total du crédit.`;

  return mergeResult(result, {
    primary: { label: "Assurance mensuelle", value: formatCurrency(mensuel) },
    narrative,
    interpretation:
      taux <= 0.25
        ? {
            level: "favorable",
            badge: "Compétitif",
            title: "Taux bas",
            message: "Votre taux d'assurance se situe dans la fourchette basse du marché.",
          }
        : taux <= 0.4
          ? {
              level: "intermediate",
              badge: "Moyen",
              title: "Taux standard",
              message: "Comparez contrat groupe et délégation pour éventuellement baisser la facture.",
            }
          : {
              level: "warning",
              badge: "Élevé",
              title: "Taux élevé",
              message: "Un taux au-dessus de 0,40 % mérite une mise en concurrence (loi Lemoine).",
            },
    advice: {
      title: "Pour réduire l'assurance emprunteur",
      items: [
        "Comparez au moins 3 devis en délégation d'assurance",
        "Adaptez les garanties à votre profil (couple, travail pénible…)",
        "Privilégiez une assurance sur capital restant dû pour un coût dégressif",
        "Résiliez chaque année à la date anniversaire si une offre meilleure existe",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "Ce calcul suppose un taux fixe sur capital initial — sur CRD, le coût réel serait inférieur.",
      },
    ],
  });
}

function enrichFraisAgence(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const prix = num(input.prix);
  const taux = num(input.tauxAgence);
  const charge = String(input.charge) === "acquereur" ? "acquéreur" : "vendeur";
  const honoraires = findNumber(result, "honoraires") ?? 0;

  const narrative =
    charge === "acquéreur"
      ? `Sur un bien affiché à ${formatCurrency(prix)}, ${formatPercent(taux, 1)} d'honoraires (${formatCurrency(honoraires)}) sont à votre charge — à ajouter au prix et aux frais de notaire dans votre budget acquéreur.`
      : `Les honoraires de ${formatCurrency(honoraires)} (${formatPercent(taux, 1)}) sont pris en charge par le vendeur sur ce bien à ${formatCurrency(prix)} — le prix affiché reste votre référence budgétaire.`;

  return mergeResult(result, {
    primary: { label: "Honoraires d'agence", value: formatCurrency(honoraires) },
    narrative,
    interpretation: {
      level: charge === "acquéreur" ? "intermediate" : "favorable",
      badge: charge === "acquéreur" ? "Acquéreur" : "Vendeur",
      title: charge === "acquéreur" ? "Coût additionnel" : "Honoraires vendeur",
      message:
        charge === "acquéreur"
          ? "Vérifiez si le prix est FAI (Frais d'Agence Inclus) ou hors honoraires."
          : "Les honoraires vendeur n'impactent pas directement votre budget d'acquisition.",
    },
    advice: {
      title: "Pour maîtriser les honoraires d'agence",
      items: [
        "Demandez si le prix est FAI ou hors honoraires avant toute visite",
        "Comparez les mandats — les taux ne sont pas encadrés",
        "Négociez les honoraires, surtout en mandat simple",
        "Intégrez-les dans le simulateur de capacité d'emprunt si à votre charge",
      ],
    },
  });
}

// ─── Financement (part 3) ──────────────────────────────────────────

function enrichFraisGarantie(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const capital = num(input.capital);
  const duree = num(input.duree);
  const type = String(input.typeGarantie) === "hypotheque" ? "hypothèque" : "caution";
  const cout = findNumber(result, "coût total") ?? 0;
  const pctCapital = capital > 0 ? (cout / capital) * 100 : 0;

  const narrative = `Pour garantir ${formatCurrency(capital)} sur ${duree} ans via une ${type}, le coût estimé est de ${formatCurrency(cout)} (${formatPercent(pctCapital, 2)} du capital) — à intégrer au budget global dès la simulation de prêt.`;

  const comparisons: ResultComparison[] = [];
  const altType = type === "hypothèque" ? "caution" : "hypotheque";
  const altCout =
    altType === "hypotheque"
      ? capital * 0.015 + capital * 0.005
      : capital * 0.01 + capital * 0.003 * Math.min(duree, 8);
  comparisons.push({
    scenario: `Alternative : ${altType === "hypotheque" ? "hypothèque" : "caution"}`,
    value: formatCurrency(altCout),
    detail:
      altCout < cout
        ? `Économie estimée : ${formatCurrency(cout - altCout)}`
        : `Surcoût estimé : ${formatCurrency(altCout - cout)}`,
  });

  return mergeResult(result, {
    primary: { label: "Coût total estimé", value: formatCurrency(cout) },
    narrative,
    interpretation: {
      level: pctCapital <= 1.5 ? "favorable" : "intermediate",
      badge: type === "caution" ? "Caution" : "Hypothèque",
      title: type === "caution" ? "Garantie légère" : "Garantie lourde",
      message:
        type === "caution"
          ? "La caution est souvent moins chère, sans frais de notaire pour la garantie."
          : "L'hypothèque implique des frais de mainlevée à la fin du prêt.",
    },
    advice: {
      title: "Pour choisir votre garantie",
      items: [
        "Comparez hypothèque et caution avec votre banque — le choix est souvent imposé",
        "Intégrez les frais de mainlevée hypothécaire (~500 à 1 500 €) dans le total",
        "Vérifiez si une part de commission caution est restituée en cas de bon dossier",
        "Ces frais peuvent parfois être financés dans le montant emprunté",
      ],
    },
    comparisons,
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Tarifs moyens — demandez un devis bancaire pour le montant exact avant signature.",
      },
    ],
  });
}

function enrichEffortEpargne(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const objectif = num(input.objectifApport);
  const actuelle = num(input.epargneActuelle);
  const mensuelle = num(input.epargneMensuelle);
  const reste = Math.max(0, objectif - actuelle);
  const dureeMois = findNumber(result, "durée") ?? (mensuelle > 0 ? Math.ceil(reste / mensuelle) : null);
  const atteint = reste <= 0;

  const narrative = atteint
    ? `Votre épargne de ${formatCurrency(actuelle)} couvre déjà l'objectif de ${formatCurrency(objectif)} — vous pouvez lancer la simulation de capacité d'emprunt.`
    : mensuelle <= 0
      ? `Il reste ${formatCurrency(reste)} à constituer pour atteindre ${formatCurrency(objectif)}, mais sans épargne mensuelle le délai est indéterminé.`
      : `Pour passer de ${formatCurrency(actuelle)} à ${formatCurrency(objectif)} en épargnant ${formatCurrency(mensuelle)}/mois, comptez environ ${dureeMois} mois (${Math.floor((dureeMois ?? 0) / 12)} ans et ${(dureeMois ?? 0) % 12} mois).`;

  return mergeResult(result, {
    primary: {
      label: atteint ? "Statut" : "Durée estimée",
      value: atteint ? "Objectif atteint" : dureeMois ? `${dureeMois} mois` : "—",
    },
    narrative,
    interpretation: atteint
      ? {
          level: "favorable",
          badge: "Prêt",
          title: "Apport disponible",
          message: "Vous pouvez avancer sur la recherche de bien et la demande de prêt.",
        }
      : mensuelle <= 0
        ? {
            level: "warning",
            badge: "Blocage",
            title: "Épargne insuffisante",
            message: "Augmentez votre capacité d'épargne mensuelle ou ajustez l'objectif d'apport.",
          }
        : (dureeMois ?? 0) <= 36
          ? {
              level: "favorable",
              badge: "< 3 ans",
              title: "Horizon court",
              message: "Un apport constitué en moins de 3 ans permet de projeter un achat proche.",
            }
          : {
              level: "intermediate",
              badge: "Patience",
              title: "Horizon moyen",
              message: "Constituez l'apport progressivement — réévaluez les prix du marché en parallèle.",
            },
    advice: {
      title: "Pour constituer votre apport",
      items: [
        "Automatisez un virement mensuel vers un livret ou PEL",
        "Intégrez les frais de notaire dans l'objectif si non financés",
        "Évitez le risque sur un horizon court (actions, crypto…)",
        "Envisagez un apport familial ou une donation si pertinent",
      ],
    },
  });
}

function enrichImpactHausseTaux(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const capital = num(input.capital);
  const tauxActuel = num(input.tauxActuel);
  const tauxNouveau = num(input.tauxNouveau);
  const delta = findNumber(result, "hausse mensualité") ?? 0;
  const endNouveau = findPercent(result, "endettement après") ?? 0;
  const endActuel = findPercent(result, "endettement actuel") ?? 0;

  const narrative = `Sur ${formatCurrency(capital)} restants, une hausse de ${formatPercent(tauxActuel, 2)} à ${formatPercent(tauxNouveau, 2)} ajoute ${formatCurrency(delta)}/mois à l'échéance — votre taux d'endettement passerait de ${formatPercent(endActuel, 1)} à ${formatPercent(endNouveau, 1)}.`;

  return mergeResult(result, {
    primary: { label: "Hausse mensualité", value: formatCurrency(delta) },
    narrative,
    interpretation: endNouveau > HCSF_TAUX_ENDETTEMENT_MAX
      ? {
          level: "warning",
          badge: "Plafond dépassé",
          title: "Endettement critique",
          message: `La hausse vous ferait dépasser ${HCSF_TAUX_ENDETTEMENT_MAX} % — risque de refus en cas de renégociation.`,
        }
      : endNouveau > HCSF_TAUX_ENDETTEMENT_MAX - 3
        ? {
            level: "intermediate",
            badge: "Limite",
            title: "Marge réduite",
            message: "Vous approchez du plafond HCSF — anticipez une marge de sécurité de 1 à 2 points.",
          }
        : {
            level: "favorable",
            badge: "Absorbable",
            title: "Impact maîtrisé",
            message: "La hausse reste compatible avec le plafond d'endettement recommandé.",
          },
    advice: {
      title: "Face à une hausse de taux",
      items: [
        "Anticipez 1 à 2 points de marge lors de la souscription initiale",
        "Renégociez l'assurance emprunteur pour compenser partiellement",
        "Envisagez un remboursement anticipé partiel si vous avez de l'épargne",
        "Comparez rachat de crédit si la hausse est durable",
      ],
    },
    comparisons: [
      { scenario: "Mensualité actuelle", value: lineText(result, "Mensualité actuelle") },
      { scenario: "Nouvelle mensualité", value: lineText(result, "Nouvelle mensualité") },
    ],
    callouts: [
      {
        variant: "warning",
        title: "Attention",
        text: "Les emprunteurs en taux variable ou en fin de période fixe sont les plus exposés aux hausses.",
      },
    ],
  });
}

function enrichCreditTravaux(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montantTravaux);
  const duree = num(input.duree);
  const taux = num(input.taux);
  const mensualite = lineText(result, "mensualité totale");
  const total = findNumber(result, "coût total") ?? 0;

  const narrative = `Financer ${formatCurrency(montant)} de travaux sur ${duree} ans à ${formatPercent(taux, 2)} représente ${mensualite}/mois (assurance incluse), pour un coût total estimé de ${formatCurrency(total)} — à comparer avec vos aides (MaPrimeRénov', éco-PTZ).`;

  return mergeResult(result, {
    primary: { label: "Mensualité totale", value: mensualite },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Financement",
      title: "Crédit travaux",
      message: "Comparez ce financement avec un intégration au crédit immobilier ou un prêt à taux bonifié.",
    },
    advice: {
      title: "Pour financer vos travaux",
      items: [
        "Demandez 3 devis avant d'emprunter — le montant doit correspondre aux factures",
        "Vérifiez les aides publiques avant de souscrire un crédit classique",
        "Comparez crédit travaux et crédit consommation (taux et justificatifs)",
        "Intégrez la mensualité dans votre taux d'endettement global",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "Un crédit travaux dédié est souvent moins cher qu'un crédit consommation, mais nécessite des justificatifs.",
      },
    ],
  });
}

// ─── Investissement ────────────────────────────────────────────────

function enrichPlusValue(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const plusValue = findNumber(result, "plus-value brute") ?? 0;
  const impot = findNumber(result, "impôt") ?? 0;
  const annees = num(input.anneesDetention);
  const achat =
    num(input.prixAchat) + num(input.fraisAcquisition) + num(input.travaux);
  const vente = num(input.prixVente);

  const narrative = `Acquis pour ${formatCurrency(achat)} et revendu ${formatCurrency(vente)} après ${annees} ans, la plus-value brute est de ${formatCurrency(plusValue)} — l'impôt estimé s'élève à ${formatCurrency(impot)} selon les abattements simplifiés appliqués.`;

  return mergeResult(result, {
    primary: { label: "Plus-value brute", value: formatCurrency(plusValue) },
    narrative,
    interpretation:
      plusValue === 0
        ? {
            level: "neutral",
            badge: "Nulle",
            title: "Pas de plus-value",
            message: "Le prix de vente ne dépasse pas le coût d'acquisition corrigé.",
          }
        : annees >= 22
          ? {
              level: "favorable",
              badge: "Abattement max",
              title: "Fiscalité allégée",
              message: "Après 22 ans de détention, les abattements réduisent fortement l'impôt.",
            }
          : impot / plusValue > 0.25
            ? {
                level: "warning",
                badge: "Imposition",
                title: "Impôt significatif",
                message: "Anticipez l'impôt dans votre stratégie de sortie — consultez un notaire.",
              }
            : {
                level: "intermediate",
                badge: "Modéré",
                title: "Plus-value taxable",
                message: "Des abattements partiels s'appliquent selon la durée de détention.",
              },
    advice: {
      title: "Pour optimiser la plus-value",
      items: [
        "Conservez tous les justificatifs de travaux et frais d'acquisition",
        "La résidence principale est exonérée sous conditions — vérifiez votre situation",
        "Consultez un notaire pour le calcul définitif des abattements",
        "Planifiez la durée de détention pour bénéficier des abattements progressifs",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Estimation simplifiée — le notaire calculera IR (19 %) et prélèvements sociaux (17,2 %) avec les abattements exacts.",
      },
    ],
  });
}

function enrichRendementBrut(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const pct = findPercent(result, "rendement brut") ?? 0;
  const total = num(input.prix) + num(input.notaire) + num(input.travaux);
  const loyer = num(input.loyer);

  const narrative = `Un investissement de ${formatCurrency(total)} loué ${formatCurrency(loyer)}/mois affiche un rendement brut de ${formatPercent(pct, 2)} — indicateur rapide avant de déduire charges et vacance.`;

  return mergeResult(result, {
    primary: { label: "Rendement brut", value: formatPercent(pct, 2) },
    narrative,
    interpretation:
      pct >= 6
        ? {
            level: "favorable",
            badge: "Élevé",
            title: "Bon filtre initial",
            message: "Rendement brut attractif — validez avec le net et le cash-flow.",
          }
        : pct >= 4
          ? {
              level: "intermediate",
              badge: "Standard",
              title: "Fourchette courante",
              message: "Typique en province — le net sera inférieur après charges.",
            }
          : {
              level: "warning",
              badge: "Bas",
              title: "Peu sélectif",
              message: "En zone tendue, un brut faible peut encore se justifier par la plus-value — pas par le rendement.",
            },
    advice: {
      title: "Après le rendement brut",
      items: [
        "Calculez le rendement net avec charges et vacance locative",
        "Comparez le brut de plusieurs annonces sur une base homogène",
        "Un bon brut masque parfois des charges de copropriété élevées",
        "Utilisez le simulateur rendement locatif complet pour le cash-flow",
      ],
    },
  });
}

function enrichRendementNet(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const pct = findPercent(result, "rendement net") ?? 0;
  const charges = num(input.charges);
  const vacance = num(input.vacance);
  const loyer = num(input.loyer);

  const narrative = `Avec ${formatCurrency(loyer)}/mois, ${formatCurrency(charges)}/an de charges et ${formatPercent(vacance, 0)} de vacance, le rendement net atteint ${formatPercent(pct, 2)} — plus proche de la réalité locative que le brut seul.`;

  return mergeResult(result, {
    primary: { label: "Rendement net", value: formatPercent(pct, 2) },
    narrative,
    interpretation: rendementNetInterpretation(pct),
    advice: rendementAdvice,
  });
}

function enrichCashFlow(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const cf = findNumber(result, "cash-flow mensuel") ?? 0;
  const loyer = num(input.loyer);
  const charges = num(input.charges);
  const mensualite = num(input.mensualite);
  const vacance = num(input.vacance);

  const narrative = `Entre un loyer effectif de ${formatCurrency(loyer * (1 - vacance / 100))}/mois (vacance ${formatPercent(vacance, 0)}), ${formatCurrency(charges)} de charges et ${formatCurrency(mensualite)} de crédit, il ${cf >= 0 ? "reste" : "manque"} ${formatCurrency(Math.abs(cf))}/mois en trésorerie.`;

  return mergeResult(result, {
    primary: { label: "Cash-flow mensuel", value: formatCurrency(cf) },
    narrative,
    interpretation: cashFlowInterpretation(cf),
    advice: {
      title: "Pour améliorer le cash-flow",
      items: [
        "Négociez le prix d'achat ou allongez la durée du crédit",
        "Optimisez le loyer (meublé, colocation) sans sous-estimer la vacance",
        "Réduisez les charges non récupérables (taxe foncière, copropriété)",
        "Simulez un apport plus important pour baisser la mensualité",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Un cash-flow positif ne garantit pas un bon rendement long terme — croisez avec le rendement net.",
      },
    ],
  });
}

function enrichRentabiliteLmnp(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const pct = findPercent(result, "rentabilité") ?? 0;
  const regime = String(input.regime) === "micro" ? "Micro-BIC" : "Réel";
  const loyer = num(input.loyerMensuel);
  const invest = num(input.investissement);

  const narrative = `En ${regime} sur ${formatCurrency(invest)} investis et ${formatCurrency(loyer)}/mois de loyer meublé, la rentabilité fiscale estimée est de ${formatPercent(pct, 2)} — le régime ${regime === "Micro-BIC" ? "applique un abattement forfaitaire de 50 %" : "deduit les charges réelles"}.`;

  return mergeResult(result, {
    primary: { label: "Rentabilité estimée", value: formatPercent(pct, 2) },
    narrative,
    interpretation: rendementNetInterpretation(pct),
    advice: {
      title: "Pour optimiser un LMNP",
      items: [
        "Comparez micro-BIC et réel avec un expert-comptable si charges élevées",
        "Respectez la liste des meubles obligatoires pour le statut meublé",
        "L'amortissement au réel peut créer un déficit reportable",
        "Les loyers meublés sont plus élevés mais la rotation locative aussi",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "Estimation fiscale simplifiée — le réel avec amortissement peut différer significativement.",
      },
    ],
  });
}

function enrichBudgetTravaux(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const surface = num(input.surface);
  const niveau = String(input.niveau);
  const labels: Record<string, string> = {
    legere: "légère (~400 €/m²)",
    moyenne: "moyenne (~800 €/m²)",
    lourde: "lourde (~1 200 €/m²)",
  };
  const budget = findNumber(result, "budget") ?? 0;

  const narrative = `Pour ${surface} m² en rénovation ${labels[niveau] ?? niveau}, le budget travaux tourne autour de ${formatCurrency(budget)} — prévoyez 10 à 15 % de marge pour les imprévus.`;

  return mergeResult(result, {
    primary: { label: "Budget total", value: formatCurrency(budget) },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Estimation",
      title: "Ordre de grandeur",
      message: "Fourchette nationale — les devis locaux peuvent varier de ±20 %.",
    },
    advice: {
      title: "Pour cadrer vos travaux",
      items: [
        "Demandez au minimum 3 devis détaillés par corps de métier",
        "Prévoyez 10 à 15 % de marge pour les imprévus",
        "Vérifiez l'éligibilité TVA réduite (10 %) en rénovation énergétique",
        "Croisez avec le simulateur rentabilité après travaux",
      ],
    },
  });
}

function enrichRentabiliteApresTravaux(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const netApres = findPercent(result, "après travaux") ?? 0;
  const netAvant = findPercent(result, "avant travaux") ?? 0;
  const travaux = num(input.travaux);
  const surloyer = num(input.loyerApres) - num(input.loyerAvant);
  const delta = netApres - netAvant;

  const narrative = `En investissant ${formatCurrency(travaux)} de travaux pour un surloyer de ${formatCurrency(surloyer)}/mois, le rendement net passe de ${formatPercent(netAvant, 2)} à ${formatPercent(netApres, 2)} (${delta >= 0 ? "+" : ""}${formatPercent(delta, 2)}).`;

  return mergeResult(result, {
    primary: { label: "Rendement net après travaux", value: formatPercent(netApres, 2) },
    narrative,
    interpretation:
      delta >= 1
        ? {
            level: "favorable",
            badge: "Amélioration",
            title: "Travaux rentables",
            message: "La rénovation améliore nettement la rentabilité locative.",
          }
        : delta >= 0
          ? {
              level: "intermediate",
              badge: "Marginal",
              title: "Gain modeste",
              message: "Le surloyer compense à peine le surcoût — vérifiez le ROI sur la durée.",
            }
          : {
              level: "warning",
              badge: "Dégradation",
              title: "Travaux peu rentables",
              message: "Le surloyer ne compense pas le surinvestissement — revoyez le budget ou le loyer cible.",
            },
    advice: {
      title: "Pour rentabiliser les travaux",
      items: [
        "Priorisez cuisine, salle de bain et isolation — fort impact sur le loyer",
        "Estimez le surloyer avec des annonces comparables, pas à l'optimisme",
        "Intégrez la vacance locative pendant les travaux",
        "Certaines dépenses sont déductibles fiscalement en location nue",
      ],
    },
    comparisons: [
      { scenario: "Rendement net avant travaux", value: formatPercent(netAvant, 2) },
      { scenario: "Rendement net après travaux", value: formatPercent(netApres, 2) },
    ],
  });
}

function enrichRentabiliteScpi(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const pct = findPercent(result, "rendement") ?? 0;
  const montant = num(input.montantInvesti);
  const frais = num(input.fraisSouscription);
  const distribution = findNumber(result, "revenus annuels") ?? 0;

  const narrative = `En investissant ${formatCurrency(montant)} (${formatPercent(frais, 1)} de frais de souscription), une SCPI distribuant ${formatPercent(num(input.tauxDistribution), 1)} génère environ ${formatCurrency(distribution)}/an — rendement brut ${formatPercent(pct, 2)} sur le montant versé.`;

  return mergeResult(result, {
    primary: { label: "Rendement brut estimé", value: formatPercent(pct, 2) },
    narrative,
    interpretation:
      pct >= 4.5
        ? {
            level: "favorable",
            badge: "Distribution",
            title: "Rendement attractif",
            message: "Proche de la moyenne historique des SCPI — analysez la solidité de la société de gestion.",
          }
        : pct >= 3.5
          ? {
              level: "intermediate",
              badge: "Standard",
              title: "Rendement moyen",
              message: "Comparez avec l'achat direct et intégrez la fiscalité (IR ou IS).",
            }
          : {
              level: "warning",
              badge: "Faible",
              title: "Rendement bas",
              message: "Les frais de souscription pèsent sur le rendement réel — vérifiez l'historique sur 5 à 10 ans.",
            },
    advice: {
      title: "Pour investir en SCPI",
      items: [
        "Analysez l'historique de distribution sur 5 à 10 ans, pas une seule année",
        "Intégrez les 8 à 12 % de frais de souscription dans le rendement réel",
        "Les SCPI entrent dans l'assiette IFI — simulez l'impact patrimonial",
        "Comparez avec un achat locatif direct (effet de levier crédit)",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "La revente des parts peut prendre 3 à 12 mois — liquidité inférieure à un achat direct.",
      },
    ],
  });
}

function enrichLocationCourteDuree(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const pct = findPercent(result, "rendement net") ?? 0;
  const occupation = num(input.occupation);
  const prixNuit = num(input.prixNuit);
  const invest = num(input.investissement);

  const narrative = `Avec ${formatCurrency(prixNuit)}/nuit et ${formatPercent(occupation, 0)} d'occupation sur ${formatCurrency(invest)} investis, la LCD affiche un rendement net de ${formatPercent(pct, 2)} — souvent supérieur au bail classique, mais avec plus de charges et de gestion.`;

  return mergeResult(result, {
    primary: { label: "Rendement net", value: formatPercent(pct, 2) },
    narrative,
    interpretation: rendementNetInterpretation(pct),
    advice: {
      title: "Pour réussir en location courte durée",
      items: [
        "Estimez prudemment l'occupation hors haute saison (50 à 65 % en moyenne)",
        "Intégrez ménage, blanchisserie, conciergerie et taxe de séjour",
        "Vérifiez la réglementation locale (120 jours/an à Paris, autorisation mairie…)",
        "Comparez avec une location meublée classique sur le même bien",
      ],
    },
    callouts: [
      {
        variant: "warning",
        title: "Attention",
        text: "La réglementation varie fortement selon les communes — renseignez-vous avant d'investir.",
      },
    ],
  });
}

function enrichColocation(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const pct = findPercent(result, "rendement net") ?? 0;
  const nb = num(input.nbChambres);
  const loyerChambre = num(input.loyerChambre);
  const loyerTotal = loyerChambre * nb;

  const narrative = `En colocation (${nb} chambres à ${formatCurrency(loyerChambre)}/mois), le loyer total atteint ${formatCurrency(loyerTotal)}/mois — le rendement net est de ${formatPercent(pct, 2)}, souvent supérieur à un bail unique au même loyer global.`;

  return mergeResult(result, {
    primary: { label: "Rendement net", value: formatPercent(pct, 2) },
    narrative,
    interpretation: rendementNetInterpretation(pct),
    advice: {
      title: "Pour investir en colocation",
      items: [
        "Respectez 9 m² minimum par chambre et les normes de décence",
        "Prévoyez plus de rotation locative qu'un bail classique",
        "Comparez bail unique colocation et baux individuels selon votre gestion",
        "Aménagez les espaces communs pour limiter les conflits",
      ],
    },
  });
}

// ─── Fiscalité immobilière ─────────────────────────────────────────

function enrichImpotRevenusFonciers(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const loyers = num(input.loyersAnnuels);
  const charges = num(input.charges);
  const tmi = num(input.tmi);
  const regime = String(input.regime) === "micro" ? "micro-foncier" : "régime réel";
  const impot = findNumber(result, "impôt") ?? 0;
  const impotAutre = findNumber(result, "autre régime") ?? 0;
  const autreMoinsCher = impotAutre < impot;

  const narrative = `Sur ${formatCurrency(loyers)} de loyers annuels, ${formatCurrency(charges)} de charges déductibles en ${regime} (TMI ${formatPercent(tmi, 0)}), l'impôt estimé est de ${formatCurrency(impot)}/an${autreMoinsCher ? ` — l'autre régime serait plus avantageux (${formatCurrency(impotAutre)})` : ""}.`;

  return mergeResult(result, {
    primary: { label: "Impôt estimé", value: formatCurrency(impot) },
    narrative,
    interpretation: autreMoinsCher
      ? {
          level: "intermediate",
          badge: "Optimisable",
          title: "Régime sous-optimal",
          message: "L'autre régime fiscal réduirait votre impôt — comparez avant la déclaration.",
        }
      : {
          level: "favorable",
          badge: "Adapté",
          title: "Régime cohérent",
          message: "Le régime choisi semble adapté à votre niveau de charges.",
        },
    advice: {
      title: "Pour optimiser vos revenus fonciers",
      items: [
        "Comparez micro-foncier et réel chaque année avant la déclaration",
        "Conservez toutes les factures de charges en régime réel",
        "Les intérêts d'emprunt ne sont déductibles qu'au réel",
        "Anticipez les prélèvements sociaux (17,2 %) en plus de l'IR",
      ],
    },
    comparisons: [
      {
        scenario: `Impôt en ${regime}`,
        value: formatCurrency(impot),
      },
      {
        scenario: "Impôt avec l'autre régime",
        value: formatCurrency(impotAutre),
        detail: autreMoinsCher ? "Régime alternatif plus avantageux" : undefined,
      },
    ],
  });
}

function enrichTaxeFonciere(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const vlc = num(input.vlc);
  const taxe = findNumber(result, "taxe foncière") ?? 0;
  const tauxCommune = num(input.tauxCommune);
  const tauxInterco = num(input.tauxInterco);

  const narrative = `Avec une VLC de ${formatCurrency(vlc)} et des taux locaux de ${formatPercent(tauxCommune + tauxInterco + 10, 1)} (commune + interco + département estimé), la taxe foncière tourne autour de ${formatCurrency(taxe)}/an — charge à intégrer en rendement net locatif.`;

  return mergeResult(result, {
    primary: { label: "Taxe foncière estimée", value: formatCurrency(taxe) },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Charge propriétaire",
      title: "Impôt local",
      message: "La taxe foncière est due par le propriétaire — déductible au régime réel, pas au micro-foncier.",
    },
    advice: {
      title: "Pour maîtriser la taxe foncière",
      items: [
        "Consultez votre avis d'imposition pour la VLC exacte",
        "Vérifiez les exonérations possibles (neuf, seniors, rénovation énergétique…)",
        "Intégrez-la dans le calcul du rendement net locatif",
        "Les taux varient fortement selon la commune — comparez avant d'acheter",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "La révision triennale des valeurs cadastrales peut faire augmenter la taxe indépendamment des taux locaux.",
      },
    ],
  });
}

function enrichDeficitFoncier(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const deficit = findNumber(result, "déficit foncier") ?? 0;
  const imputable = findNumber(result, "imputable") ?? 0;
  const eco = findNumber(result, "économie") ?? 0;
  const travaux = num(input.travaux);
  const tmi = num(input.tmi);

  const narrative =
    deficit > 0
      ? `Vos ${formatCurrency(travaux)} de travaux (TMI ${formatPercent(tmi, 0)}) génèrent un déficit de ${formatCurrency(deficit)} — ${formatCurrency(imputable)} imputables sur le revenu global, soit ${formatCurrency(eco)} d'économie d'impôt estimée.`
      : `Vos loyers couvrent les charges cette année — pas de déficit foncier imputable sur le revenu global.`;

  return mergeResult(result, {
    primary: {
      label: deficit > 0 ? "Imputable sur revenu global" : "Déficit foncier total",
      value: deficit > 0 ? formatCurrency(imputable) : formatCurrency(0),
    },
    narrative,
    interpretation:
      deficit > 0
        ? {
            level: "favorable",
            badge: "Optimisation",
            title: "Déficit exploitable",
            message: `Jusqu'à 10 700 €/an imputables sur le revenu global (hors intérêts d'emprunt).`,
          }
        : {
            level: "neutral",
            badge: "Équilibre",
            title: "Pas de déficit",
            message: "Les loyers couvrent les charges — le déficit foncier n'est pas activé cette année.",
          },
    advice: {
      title: "Pour optimiser le déficit foncier",
      items: [
        "Planifiez les travaux déductibles pour maximiser l'imputation sur le revenu global",
        "Les intérêts d'emprunt ne sont imputables que sur les revenus fonciers futurs",
        "Conservez devis et factures — seuls certains travaux ouvrent droit à imputation",
        "L'excédent au-delà de 10 700 € est reportable 10 ans sur les revenus fonciers",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Seuls les travaux d'entretien et d'amélioration sont éligibles — pas la construction ou reconstruction.",
      },
    ],
  });
}

function enrichDonationSuccession(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const valeur = num(input.valeurBien);
  const lien = String(input.lien);
  const droits = findNumber(result, "droits") ?? 0;
  const base = findNumber(result, "base taxable") ?? 0;
  const exonere = lien === "conjoint";

  const liensLabel: Record<string, string> = {
    enfant: "parent → enfant",
    petitenfant: "grand-parent → petit-enfant",
    conjoint: "conjoint / PACS",
    autre: "autre lien",
  };

  const narrative = exonere
    ? `La transmission de ${formatCurrency(valeur)} entre conjoints ou partenaires PACS est exonérée de droits de mutation.`
    : `Transmettre un bien de ${formatCurrency(valeur)} (${liensLabel[lien] ?? lien}) génère ${formatCurrency(droits)} de droits estimés sur une base taxable de ${formatCurrency(base)} après abattements.`;

  return mergeResult(result, {
    primary: { label: "Droits estimés", value: formatCurrency(droits) },
    narrative,
    interpretation: exonere
      ? {
          level: "favorable",
          badge: "Exonéré",
          title: "Transmission protégée",
          message: "Exonération totale entre époux et partenaires PACS.",
        }
      : droits / valeur > 0.15
        ? {
            level: "warning",
            badge: "Coût élevé",
            title: "Droits significatifs",
            message: "Envisagez des donations échelonnées ou le démembrement pour optimiser.",
          }
        : {
            level: "intermediate",
            badge: "Modéré",
            title: "Droits modérés",
            message: "Les abattements réduisent la base — planifiez les transmissions par étapes.",
          },
    advice: {
      title: "Pour optimiser la transmission",
      items: [
        "Planifiez des donations par étapes pour utiliser les abattements tous les 15 ans",
        "Le démembrement (usufruit/nue-propriété) peut réduire les droits",
        "Faites estimer le bien par un notaire pour un calcul exact",
        "Complétez avec l'assurance-vie pour transmettre hors immobilier",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Barème simplifié — le notaire appliquera le barème progressif exact avec toutes les tranches.",
      },
    ],
  });
}

function enrichLocationMeubleeVsNue(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const rendNue = findPercent(result, "nue") ?? 0;
  const rendMeublee = findPercent(result, "meublée") ?? 0;
  const loyerNue = num(input.loyerNue);
  const loyerMeublee = num(input.loyerMeublee);
  const gagnant = rendMeublee > rendNue ? "meublée" : "nue";

  const narrative = `À ${formatCurrency(loyerNue)}/mois en nu vs ${formatCurrency(loyerMeublee)}/mois en meublé, le rendement net après impôt est de ${formatPercent(rendNue, 2)} (nu) et ${formatPercent(rendMeublee, 2)} (meublé) — la location ${gagnant} ressort plus performante sur ce scénario.`;

  return mergeResult(result, {
    primary: {
      label: `Meilleur rendement : ${gagnant === "meublée" ? "Meublée" : "Nue"}`,
      value: formatPercent(Math.max(rendNue, rendMeublee), 2),
    },
    narrative,
    interpretation: {
      level: rendMeublee > rendNue ? "favorable" : "intermediate",
      badge: gagnant === "meublée" ? "LMNP" : "Nu",
      title: `${gagnant === "meublée" ? "Meublé" : "Location nue"} plus rentable`,
      message:
        gagnant === "meublée"
          ? "Le surloyer meublé compense la fiscalité BIC — mais la gestion est plus active."
          : "La simplicité de la location nue l'emporte fiscalement sur ce scénario.",
    },
    advice: {
      title: "Pour choisir entre meublé et nu",
      items: [
        "Comparez le rendement net après impôt, pas seulement le loyer",
        "Le meublé implique inventaire, meubles obligatoires et plus de rotation",
        "Consultez un expert-comptable pour le LMNP au régime réel",
        "Vérifiez la demande locative meublée vs nue dans votre secteur",
      ],
    },
    comparisons: [
      { scenario: "Rendement net nue (après impôt)", value: formatPercent(rendNue, 2) },
      { scenario: "Rendement net meublée (après impôt)", value: formatPercent(rendMeublee, 2) },
    ],
  });
}

function enrichIfi(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const brut = num(input.patrimoineBrut);
  const dettes = num(input.dettes);
  const rp = num(input.valeurRP);
  const ifi = findNumber(result, "IFI") ?? 0;
  const net = findNumber(result, "net taxable") ?? 0;
  const sousSeuil = net <= IFI_SEUIL;

  const narrative = sousSeuil
    ? `Avec ${formatCurrency(brut)} de patrimoine brut, ${formatCurrency(dettes)} de dettes et ${formatCurrency(rp)} de résidence principale (abattement 30 %), le patrimoine net taxable (${formatCurrency(net)}) reste sous le seuil de 1,3 M€ — pas d'IFI.`
    : `Patrimoine net taxable de ${formatCurrency(net)} (après abattement RP et dettes) — l'IFI estimé est de ${formatCurrency(ifi)}/an sur ${formatCurrency(brut)} de patrimoine immobilier brut.`;

  return mergeResult(result, {
    primary: { label: "IFI estimé", value: formatCurrency(ifi) },
    narrative,
    interpretation: sousSeuil
      ? {
          level: "favorable",
          badge: "Sous seuil",
          title: "IFI non dû",
          message: "Votre patrimoine net taxable reste sous 1,3 M€.",
        }
      : ifi / net > 0.008
        ? {
            level: "warning",
            badge: "IFI élevé",
            title: "Imposition patrimoniale",
            message: "L'IFI pèse significativement — explorez les optimisations légales.",
          }
        : {
            level: "intermediate",
            badge: "IFI dû",
            title: "Above seuil",
            message: "Barème progressif de 0,5 % à 1,5 % selon les tranches.",
          },
    advice: {
      title: "Pour optimiser l'IFI",
      items: [
        "Les dettes liées à l'acquisition immobilière sont déductibles",
        "Certaines biens ruraux ou forestiers bénéficient d'exonérations",
        "Les parts de SCPI entrent dans l'assiette IFI",
        "Consultez un conseiller patrimonial pour une stratégie globale",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "L'IFI se déclare avec l'impôt sur le revenu au 1er janvier de l'année d'imposition.",
      },
    ],
  });
}

// ─── Gestion locative ──────────────────────────────────────────────

function enrichRevisionIrl(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const loyer = num(input.loyerActuel);
  const irlA = num(input.irlAncien);
  const irlN = num(input.irlNouveau);
  const nouveau = findNumber(result, "nouveau loyer") ?? loyer;
  const hausse = nouveau - loyer;
  const pct = loyer > 0 ? (hausse / loyer) * 100 : 0;

  const narrative = `En appliquant l'IRL ${irlN} vs ${irlA} (référence du bail), le loyer passe de ${formatCurrency(loyer)} à ${formatCurrency(nouveau)}/mois — soit +${formatCurrency(hausse)} (+${formatPercent(pct, 2)}).`;

  return mergeResult(result, {
    primary: { label: "Nouveau loyer mensuel", value: formatCurrency(nouveau) },
    narrative,
    interpretation: {
      level: pct <= 3 ? "neutral" : "intermediate",
      badge: "IRL",
      title: "Révision annuelle",
      message: "La révision IRL est légale si une clause le prévoit dans le bail — informez le locataire par écrit.",
    },
    advice: {
      title: "Pour une révision IRL conforme",
      items: [
        "Vérifiez la clause de révision dans le bail avant d'appliquer",
        "Utilisez l'IRL du trimestre prévu au contrat",
        "Informez le locataire par écrit à la date anniversaire",
        "En zone tendue, l'encadrement peut limiter le loyer initial — pas la révision",
      ],
    },
    callouts: [
      {
        variant: "note",
        title: "À savoir",
        text: "Sans clause IRL dans le bail, aucune révision n'est possible en location vide.",
      },
    ],
  });
}

function enrichEncadrementLoyers(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const plafond = findNumber(result, "maximum") ?? 0;
  const actuel = num(input.loyerActuel);
  const depassement = findNumber(result, "dépassement") ?? 0;
  const conforme = actuel <= plafond;
  const surface = num(input.surface);
  const ref = num(input.loyerReference);

  const narrative = conforme
    ? `Pour ${surface} m² à ${formatCurrency(ref)}/m² de référence, votre loyer de ${formatCurrency(actuel)}/mois reste sous le plafond de ${formatCurrency(plafond)}.`
    : `Avec un loyer de référence de ${formatCurrency(ref)}/m² sur ${surface} m², le plafond est ${formatCurrency(plafond)}/mois — votre loyer de ${formatCurrency(actuel)} le dépasse de ${formatCurrency(depassement)}.`;

  return mergeResult(result, {
    primary: { label: "Loyer maximum autorisé", value: formatCurrency(plafond) },
    narrative,
    interpretation: conforme
      ? {
          level: "favorable",
          badge: "Conforme",
          title: "Loyer encadré",
          message: "Votre loyer respecte le plafond légal en zone tendue.",
        }
      : {
          level: "warning",
          badge: "Dépassement",
          title: "Loyer excessif",
          message: "Un loyer au-dessus du plafond peut être réduit par le juge ou la commission de conciliation.",
        },
    advice: {
      title: "En zone d'encadrement",
      items: [
        "Consultez les loyers de référence publiés par la préfecture chaque année",
        "Le complément de loyer doit être justifié (vue, prestations…)",
        "L'encadrement s'applique aux relocations et renouvellements",
        "En cas de doute, contactez la commission de conciliation locale",
      ],
    },
  });
}

function enrichDepotGarantie(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const plafond = findNumber(result, "maximum") ?? 0;
  const loyer = num(input.loyerHC);
  const type = String(input.typeBail) === "meuble" ? "meublé" : "nu";
  const demande = num(input.depotDemande);
  const conforme = demande <= 0 || demande <= plafond;

  const narrative =
    demande > 0
      ? `En location ${type}, le plafond légal est ${formatCurrency(plafond)} (${type === "meublé" ? "1 mois" : "2 mois"} HC sur ${formatCurrency(loyer)}/mois) — le dépôt demandé de ${formatCurrency(demande)} est ${conforme ? "conforme" : "non conforme"}.`
      : `Pour un loyer de ${formatCurrency(loyer)}/mois en location ${type}, le dépôt de garantie ne peut excéder ${formatCurrency(plafond)} (${type === "meublé" ? "1 mois" : "2 mois"} hors charges).`;

  return mergeResult(result, {
    primary: { label: "Dépôt maximum légal", value: formatCurrency(plafond) },
    narrative,
    interpretation: demande > 0 && !conforme
      ? {
          level: "warning",
          badge: "Non conforme",
          title: "Dépôt excessif",
          message: "Le bailleur ne peut exiger plus que le plafond légal — le surplus est illégal.",
        }
      : {
          level: "favorable",
          badge: "Conforme",
          title: "Plafond respecté",
          message: "Le dépôt se calcule toujours sur le loyer hors charges.",
        },
    advice: {
      title: "Pour le dépôt de garantie",
      items: [
        "Le dépôt ne couvre jamais les charges locatives",
        "Restitution sous 1 mois si état des lieux conforme, 2 mois sinon",
        "Conservez les quittances de loyer et l'état des lieux d'entrée",
        "Les retenues pour dégradations doivent être justifiées",
      ],
    },
  });
}

function enrichChargesRecuperables(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const total = findNumber(result, "total") ?? 0;
  const mensuel = findNumber(result, "mensuelle") ?? total / 12;

  const narrative = `Entre copropriété (${formatCurrency(num(input.chargesCopro))}), eau (${formatCurrency(num(input.eau))}), chauffage (${formatCurrency(num(input.chauffage))}), TEOM (${formatCurrency(num(input.ordures))}) et entretien (${formatCurrency(num(input.entretien))}), ${formatCurrency(total)}/an sont récupérables — soit ${formatCurrency(mensuel)}/mois de provision.`;

  return mergeResult(result, {
    primary: { label: "Total charges récupérables", value: formatCurrency(total) },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Refacturation",
      title: "Charges locatives",
      message: "La taxe foncière et les gros travaux restent à la charge du bailleur.",
    },
    advice: {
      title: "Pour la refacturation des charges",
      items: [
        "Régularisez les charges chaque année avec un décompté détaillé",
        "Provision mensuelle avec régularisation — pas de forfait en location nue",
        "En meublé, le forfait de charges est plafonné à 20 % du loyer HC",
        "Conservez les factures et répartitions de copropriété",
      ],
    },
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: "La taxe foncière n'est pas récupérable sur le locataire — seule la TEOM l'est.",
      },
    ],
  });
}

function enrichRevisionLoyerCommercial(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const loyer = num(input.loyerActuel);
  const indice = String(input.indice);
  const revise = findNumber(result, "révisé") ?? loyer;
  const hausse = revise - loyer;

  const narrative = `Avec l'indice ${indice} (${num(input.indiceNouveau)} vs ${num(input.indiceAncien)}), le loyer annuel passe de ${formatCurrency(loyer)} à ${formatCurrency(revise)} — soit +${formatCurrency(hausse)}/an (+${formatCurrency(hausse / 12)}/mois).`;

  return mergeResult(result, {
    primary: { label: "Loyer révisé annuel", value: formatCurrency(revise) },
    narrative,
    interpretation: {
      level: "neutral",
      badge: indice,
      title: "Révision commerciale",
      message: "La révision est annuelle à la date prévue au bail — vérifiez l'indice et le trimestre de référence.",
    },
    advice: {
      title: "Pour la révision d'un bail commercial",
      items: [
        "Vérifiez l'indice (ILAT ou ILC) mentionné dans le bail",
        "Utilisez l'indice du trimestre prévu au contrat",
        "Certaines clauses prévoient un lissage ou un plafonnement",
        "Consultez l'INSEE pour les indices officiels publiés",
      ],
    },
  });
}

function enrichLoyerChargesComprises(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const loyer = num(input.loyer);
  const charges = num(input.charges);
  const mode = String(input.mode) === "cc_vers_hc" ? "CC → HC" : "HC → CC";
  const resultat = findNumber(result, mode.includes("HC") ? "hors charges" : "charges comprises") ?? 0;

  const narrative =
    mode === "CC → HC"
      ? `Un loyer CC de ${formatCurrency(loyer)}/mois moins ${formatCurrency(charges)} de provision charges donne ${formatCurrency(resultat)}/mois HC — base pour l'IRL et le dépôt de garantie.`
      : `Un loyer HC de ${formatCurrency(loyer)}/mois plus ${formatCurrency(charges)} de charges donne ${formatCurrency(resultat)}/mois CC — montant affiché en annonce locative.`;

  return mergeResult(result, {
    primary: {
      label: mode === "CC → HC" ? "Loyer hors charges" : "Loyer charges comprises",
      value: formatCurrency(resultat),
    },
    narrative,
    interpretation: {
      level: "neutral",
      badge: "Conversion",
      title: "Base de calcul",
      message: "L'IRL et le dépôt de garantie se calculent toujours sur le loyer hors charges.",
    },
    advice: {
      title: "Pour comparer les loyers",
      items: [
        "Homogénéisez CC et HC avant de comparer des annonces",
        "Vérifiez la provision de charges dans le bail",
        "Demandez le décompté annuel de charges au locataire",
        "En meublé, les charges forfaitaires sont plafonnées à 20 % du HC",
      ],
    },
  });
}

// ─── Export map ────────────────────────────────────────────────────

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "capacite-emprunt": enrichCapaciteEmprunt,
  "taux-endettement": enrichTauxEndettement,
  "rendement-locatif": enrichRendementLocatif,
  "mensualite-pret-immobilier": enrichMensualitePret,
  "frais-de-notaire": enrichFraisNotaire,
  "cout-total-credit-immobilier": enrichCoutTotalCredit,
  "tableau-amortissement": enrichTableauAmortissement,
  "remboursement-anticipe": enrichRemboursementAnticipe,
  "pret-taux-zero-ptz": enrichPretPtz,
  "pret-relais": enrichPretRelais,
  "rachat-credit-immobilier": enrichRachatCredit,
  "assurance-emprunteur": enrichAssuranceEmprunteur,
  "frais-agence-immobiliere": enrichFraisAgence,
  "frais-garantie-emprunt": enrichFraisGarantie,
  "effort-epargne-immobilier": enrichEffortEpargne,
  "impact-hausse-taux": enrichImpactHausseTaux,
  "credit-travaux": enrichCreditTravaux,
  "plus-value-immobiliere": enrichPlusValue,
  "rendement-locatif-brut": enrichRendementBrut,
  "rendement-locatif-net": enrichRendementNet,
  "cash-flow-immobilier": enrichCashFlow,
  "rentabilite-lmnp": enrichRentabiliteLmnp,
  "budget-travaux": enrichBudgetTravaux,
  "rentabilite-apres-travaux": enrichRentabiliteApresTravaux,
  "rentabilite-scpi": enrichRentabiliteScpi,
  "rentabilite-location-courte-duree": enrichLocationCourteDuree,
  "colocation-rentabilite": enrichColocation,
  "impot-revenus-fonciers": enrichImpotRevenusFonciers,
  "taxe-fonciere": enrichTaxeFonciere,
  "deficit-foncier": enrichDeficitFoncier,
  "donation-succession-immobiliere": enrichDonationSuccession,
  "location-meublee-vs-nue": enrichLocationMeubleeVsNue,
  "ifi-impot-fortune-immobiliere": enrichIfi,
  "revision-loyer-irl": enrichRevisionIrl,
  "encadrement-loyers": enrichEncadrementLoyers,
  "depot-garantie-locatif": enrichDepotGarantie,
  "charges-recuperables-locataire": enrichChargesRecuperables,
  "revision-loyer-commercial": enrichRevisionLoyerCommercial,
  "loyer-charges-comprises": enrichLoyerChargesComprises,
};

