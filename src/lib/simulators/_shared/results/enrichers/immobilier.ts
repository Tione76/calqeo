import { capaciteEmprunt } from "../../../capacite-emprunt";
import type { CapaciteEmpruntInput } from "../../../capacite-emprunt";
import { mensualitePret } from "../../../mensualite-pret";
import type { MensualitePretInput } from "../../../mensualite-pret";
import { coutTotalCredit, tableauAmortissement } from "../../../additional/financement-1";
import { pretRelais, rachatCredit, remboursementAnticipe, pretPtz, fraisAgence } from "../../../additional/financement-2";
import {
  fraisGarantieEmprunt,
  effortEpargneImmobilier,
  simulerEpargneObjectif,
  impactHausseTaux,
  creditTravaux,
} from "../../../additional/financement-3";
import { plusValueImmobiliere } from "../../../additional/investissement";
import { monthlyPaymentFromLoan } from "@/lib/utils/format";
import { IFI_SEUIL } from "@/data/regulations/ifi";
import { estimerPtz } from "@/data/regulations/ptz";
import {
  FRAIS_NOTAIRE_NEUF_POURCENT,
  getFraisNotaireTaux,
} from "@/data/regulations/immobilier";
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

function tauxEndettementRateMessage(taux: number): string {
  if (taux > HCSF_TAUX_ENDETTEMENT_MAX) {
    return "Votre taux dépasse le plafond généralement retenu par le HCSF : le risque de refus est plus élevé, sans qu'un refus soit automatique.";
  }
  if (taux >= 34.5) {
    return "Vous êtes au niveau du plafond généralement retenu par le HCSF. Certaines banques peuvent encore étudier le dossier, mais la marge est limitée si la mensualité augmente ou si les revenus baissent.";
  }
  if (taux >= 30) {
    return "Votre taux d'endettement reste dans une fourchette correcte, mais à surveiller à l'approche du plafond de 35 %.";
  }
  return "Votre taux d'endettement laisse une marge confortable sous le plafond de 35 % — cela facilite généralement l'étude du dossier, sans garantir l'acceptation.";
}

function resteAVivreMessage(reste: number): string {
  if (reste < 800) {
    return "Votre reste à vivre est très faible ou négatif. Le projet semble fragile et une réduction de la mensualité ou des crédits en cours paraît nécessaire.";
  }
  if (reste < 1500) {
    return "Votre reste à vivre paraît limité après remboursement des crédits. Même si le taux d'endettement est acceptable, la banque peut examiner plus strictement votre dossier.";
  }
  if (reste < 2500) {
    return "Votre reste à vivre reste correct, mais il faut conserver une marge suffisante pour les dépenses courantes, imprévus et charges du foyer.";
  }
  return "Votre reste à vivre semble confortable après remboursement des crédits. Le taux d'endettement reste toutefois à surveiller selon les critères de la banque.";
}

function tauxEndettementSimulatorInterpretation(
  taux: number,
  reste: number,
  revenus: number
): ResultInterpretation {
  if (revenus <= 0) {
    return {
      level: "warning",
      badge: "Données manquantes",
      title: "Revenus requis",
      message:
        "Les revenus mensuels nets doivent être supérieurs à 0 pour estimer le taux d'endettement.",
    };
  }

  const message = `${tauxEndettementRateMessage(taux)} ${resteAVivreMessage(reste)}`;

  if (taux > HCSF_TAUX_ENDETTEMENT_MAX || reste < 800) {
    return {
      level: "warning",
      badge: taux > HCSF_TAUX_ENDETTEMENT_MAX ? "Au-dessus du plafond" : "Reste à vivre faible",
      title: taux > HCSF_TAUX_ENDETTEMENT_MAX ? "Endettement élevé" : "Situation fragile",
      message,
    };
  }
  if (taux >= 34.5) {
    return {
      level: "intermediate",
      badge: "Plafond HCSF",
      title: "Plafond atteint",
      message,
    };
  }
  if (taux >= 30 || reste < 1500) {
    return {
      level: "intermediate",
      badge: "À surveiller",
      title: "Situation correcte",
      message,
    };
  }
  return {
    level: "favorable",
    badge: "Confortable",
    title: "Situation favorable",
    message,
  };
}

function buildCapacitePersonalizedAdvice(
  input: CapaciteEmpruntInput,
  tauxReel: number | null,
  budgetAchat: number
): string[] {
  const items: string[] = [];

  if (tauxReel != null && tauxReel >= HCSF_TAUX_ENDETTEMENT_MAX - 2) {
    items.push(
      "Réduire ou solder un crédit en cours peut augmenter votre capacité d'emprunt."
    );
  }

  if (input.dureeAnnees < 25) {
    items.push(
      "Allonger légèrement la durée peut augmenter le montant empruntable, mais augmente aussi le coût total du crédit."
    );
  }

  const apport = Math.max(0, input.apportPersonnel);
  const partApport = budgetAchat > 0 ? (apport / budgetAchat) * 100 : 0;
  if (partApport < 10) {
    items.push(
      "Un apport plus élevé peut faciliter l'acceptation du dossier et augmenter le budget total du projet."
    );
  }

  if (items.length < 4) {
    items.push(
      "Comparer l'assurance emprunteur peut réduire le coût global du crédit."
    );
  }

  return items.slice(0, 4);
}

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
  const budgetAchat =
    parseFormattedNumber(
      full.lines.find((l) => l.label.includes("Budget d'achat"))?.value ?? ""
    ) ?? 0;
  const prixBien = parseFormattedNumber(
    full.lines.find((l) => l.label.includes("Prix du bien"))?.value ?? ""
  );

  const apport = Math.max(0, typed.apportPersonnel);
  const fraisNotaireMin = budgetAchat * (FRAIS_NOTAIRE_NEUF_POURCENT / 100);
  const fraisNotaireMaxHaut = budgetAchat * 0.08;

  const apportLabel =
    apport > 0
      ? ` Votre apport de ${formatCurrency(apport)} porte le budget total estimé à ${budgetAchat ? formatCurrency(budgetAchat) : "—"}.`
      : " Sans apport, seul le montant empruntable limite votre projet.";

  const narrative = `Sur ${typed.dureeAnnees} ans à ${formatPercent(typed.tauxInteret, 2)}, avec ${formatCurrency(typed.revenusMensuels)} de revenus et ${formatCurrency(typed.chargesMensuelles)} de charges, la banque pourrait financer jusqu'à ${formatCurrency(capacite)} — soit un bien d'environ ${prixBien ? formatCurrency(prixBien) : "—"} hors frais de notaire.${apportLabel}`;

  const personalizedAdvice = buildCapacitePersonalizedAdvice(
    typed,
    tauxReel,
    budgetAchat
  );

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
    advice: {
      title: "Recommandations pour votre projet",
      items: personalizedAdvice,
    },
    comparisons: budgetAchat
      ? [
          {
            scenario: "Capacité d'emprunt estimée",
            value: formatCurrency(capacite),
          },
          {
            scenario: "Apport personnel",
            value: formatCurrency(apport),
          },
          {
            scenario: "Budget total estimé",
            value: formatCurrency(budgetAchat),
            detail: "Capacité d'emprunt + apport personnel",
          },
        ]
      : undefined,
    callouts: [
      ...(budgetAchat
        ? [
            {
              variant: "tip" as const,
              title: "Budget total du projet",
              text: `${formatCurrency(capacite)} (capacité d'emprunt) + ${formatCurrency(apport)} (apport personnel) = ${formatCurrency(budgetAchat)} de budget total estimé.`,
            },
          ]
        : []),
      ...(budgetAchat
        ? [
            {
              variant: "note" as const,
              title: "Frais de notaire estimés",
              text: `Environ ${formatCurrency(fraisNotaireMin)} à ${formatCurrency(fraisNotaireMaxHaut)} (neuf : 2 à 3 %, ancien : 7 à 8 % du budget total). Cette estimation est indicative. Les frais réels dépendent notamment du type de bien, de sa localisation et des frais annexes.`,
              link: {
                href: "/simulateurs/frais-de-notaire",
                label: "Simulateur frais de notaire",
              },
            },
          ]
        : []),
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
  const resteAVivre = revenus - chargesActuelles - mensualiteProjet;
  const taux = revenus > 0 ? (charges / revenus) * 100 : 0;
  const marge = revenus > 0 ? Math.max(0, HCSF_TAUX_ENDETTEMENT_MAX - taux) : 0;

  const resteLine =
    lineText(result, "reste à vivre") ||
    (result.lines.find((l) => /reste à vivre/i.test(l.label))?.value ?? "");

  const narrative =
    revenus <= 0
      ? `Sans revenus mensuels renseignés, le taux d'endettement ne peut pas être estimé. Vérifiez vos ${formatCurrency(charges)} de charges mensuelles de crédit.`
      : `Entre vos ${formatCurrency(chargesActuelles)} de crédits en cours et ${formatCurrency(mensualiteProjet)} de mensualité projetée (assurance incluse), ${formatCurrency(charges)} partent chaque mois en remboursements — soit ${formatPercent(taux, 1)} de vos ${formatCurrency(revenus)} de revenus nets, avec ${formatPercent(marge, 1)} de marge avant le plafond HCSF. Reste à vivre estimé : ${resteLine || `${formatCurrency(resteAVivre)}/mois`}.`;

  return mergeResult(result, {
    primary: {
      label: "Votre taux d'endettement",
      value: revenus > 0 ? formatPercent(taux, 1) : "—",
    },
    narrative,
    interpretation: tauxEndettementSimulatorInterpretation(taux, resteAVivre, revenus),
    advice: revenus > 0 ? endettementAdvice : undefined,
    callouts: [
      {
        variant: "info",
        title: "Bon à savoir",
        text: `Le HCSF recommande un maximum de ${HCSF_TAUX_ENDETTEMENT_MAX} % des revenus nets, assurance incluse. Le reste à vivre est aussi examiné par les banques, sans règle unique.`,
      },
    ],
  });
}

function enrichRendementLocatif(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const netPct = findPercent(result, "rendement net") ?? 0;
  const brutPct =
    findPercent(result, "rendement brut") ??
    (result.primary && /rendement brut/i.test(result.primary.label)
      ? parsePercent(result.primary.value)
      : null) ??
    0;
  const invest = findNumber(result, "investissement");
  const revenuMensuel = findNumber(result, "revenu net mensuel");
  const vacance = num(input.vacanceLocative);

  const narrative = `En intégrant ${formatCurrency(num(input.prixAchat))} d'achat, ${formatCurrency(num(input.fraisNotaire))} de notaire, ${formatCurrency(num(input.travaux))} de travaux et ${formatPercent(vacance, 0)} de vacance, un loyer de ${formatCurrency(num(input.loyerMensuel))}/mois donne un brut de ${formatPercent(brutPct, 2)} et un net de ${formatPercent(netPct, 2)}${revenuMensuel != null ? ` — soit ${formatCurrency(revenuMensuel)}/mois de revenu net avant financement` : ""}.`;

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
  const mensualiteTotale =
    lineText(result, "mensualité totale") ||
    (result.primary && /mensualité totale/i.test(result.primary.label)
      ? result.primary.value
      : "");
  const interets = findNumber(result, "intérêts") ?? findNumber(result, "Coût total des intérêts");
  const coutTotal = findNumber(result, "Coût total du crédit");

  const narrative = `Emprunter ${formatCurrency(typed.montantEmprunt)} sur ${typed.dureeAnnees} ans à ${formatPercent(typed.tauxInteret, 2)} (assurance ${formatPercent(typed.tauxAssurance, 2)}/an) représente une mensualité totale de ${mensualiteTotale}/mois${interets ? `, dont ${formatCurrency(interets)} d'intérêts sur toute la durée` : ", avec un coût du crédit à estimer"}${coutTotal ? `, pour un total de ${formatCurrency(coutTotal)} remboursé` : ""}.`;

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
  const tauxApplique = getFraisNotaireTaux(typeBien);
  const frais =
    findNumber(result, "frais de notaire") ??
    (result.primary && /frais de notaire/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    (prix > 0 ? prix * (tauxApplique / 100) : 0);
  const taux = findPercent(result, "taux") ?? tauxApplique;
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
          ? "Dans le neuf, les frais de notaire sont réduits. Cela peut libérer davantage de budget pour l'achat ou les finitions."
          : "Dans l'ancien, les frais sont plus élevés. Il est important de les intégrer dès le départ dans votre plan de financement.",
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
        variant: "tip",
        title: "Budget total à prévoir",
        text: `Prix du bien : ${formatCurrency(prix)}. Frais de notaire estimés : ${formatCurrency(frais)}. Budget total à prévoir : ${formatCurrency(total)} (${formatCurrency(prix)} + ${formatCurrency(frais)}).`,
      },
    ],
  });
}

function enrichCoutTotalCredit(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montant);
  const duree = num(input.duree);
  const taux = num(input.taux);
  const tauxAssurance = num(input.tauxAssurance);

  const computed = coutTotalCredit.calculate({
    montant,
    taux,
    duree,
    tauxAssurance,
  });
  const interets =
    findNumber(computed, "intérêts") ??
    findNumber(result, "intérêts") ??
    0;
  const assurance =
    findNumber(computed, "assurance") ??
    findNumber(result, "assurance") ??
    0;
  const coutCredit =
    findNumber(computed, "coût total du crédit") ??
    (result.primary && /coût total du crédit/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    interets + assurance;
  const totalRembourse =
    findNumber(computed, "montant total remboursé") ??
    (result.primary && /montant total remboursé/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    montant + coutCredit;
  const ratioInterets = montant > 0 ? (interets / montant) * 100 : 0;

  const narrative = `Emprunter ${formatCurrency(montant)} sur ${duree} ans à ${formatPercent(taux, 2)} avec une assurance de ${formatPercent(tauxAssurance, 2)} représente : • ${formatCurrency(interets)} d'intérêts • ${formatCurrency(assurance)} d'assurance • ${formatCurrency(coutCredit)} de coût total du crédit • ${formatCurrency(totalRembourse)} remboursés au total.`;

  return mergeResult(result, {
    primary: {
      label: "Montant total remboursé",
      value: formatCurrency(totalRembourse),
    },
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
        variant: "tip",
        title: "Répartition du coût du crédit",
        text: `Capital emprunté : ${formatCurrency(montant)}. Intérêts : ${formatCurrency(interets)}. Assurance : ${formatCurrency(assurance)}. Total remboursé : ${formatCurrency(totalRembourse)}.`,
      },
    ],
  });
}

function enrichTableauAmortissement(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montant);
  const duree = num(input.duree);
  const taux = num(input.taux);

  const computed = tableauAmortissement.calculate({ montant, taux, duree });
  const mensualiteBrute =
    lineText(result, "mensualité") ||
    (result.primary && /mensualité/i.test(result.primary.label)
      ? result.primary.value
      : "") ||
    findLine(computed, "mensualité")?.value ||
    "";
  const mensualite =
    mensualiteBrute && !mensualiteBrute.includes("/mois")
      ? `${mensualiteBrute}/mois`
      : mensualiteBrute;
  const interets =
    findNumber(computed, "intérêts") ?? findNumber(result, "intérêts") ?? 0;

  const narrative = `Pour ${formatCurrency(montant)} empruntés sur ${duree} ans à ${formatPercent(taux, 2)}, chaque mensualité est de ${mensualite}. Les intérêts cumulés atteignent ${formatCurrency(interets)}, principalement durant les premières années du prêt.`;

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
        title: "Méthode de calcul",
        text: "Calcul basé sur la formule standard d'un prêt amortissable à mensualités constantes utilisée par les établissements bancaires français.",
      },
    ],
  });
}

// ─── Financement (part 2) ──────────────────────────────────────────

function remboursementAnticipeInterpretation(gain: number): ResultInterpretation {
  let message: string;
  let level: ResultInterpretation["level"];
  let badge: string;
  let title: string;

  if (gain <= 0) {
    message =
      "Les indemnités IRA réduisent fortement l'intérêt financier du remboursement anticipé.";
    level = gain < 0 ? "warning" : "intermediate";
    badge = gain < 0 ? "Défavorable" : "Neutre";
    title = gain < 0 ? "Gain négatif" : "Gain nul";
  } else if (gain < 1000) {
    message = "Le remboursement reste rentable mais le gain demeure limité.";
    level = "intermediate";
    badge = "Gain modeste";
    title = "Gain faible";
  } else if (gain < 5000) {
    message = "Les économies d'intérêts compensent largement les indemnités.";
    level = "favorable";
    badge = "Rentable";
    title = "Gain intéressant";
  } else {
    message =
      "Le remboursement anticipé permet une économie significative malgré les indemnités IRA.";
    level = "favorable";
    badge = "Gain important";
    title = "Opération avantageuse";
  }

  const synthesis =
    gain > 0
      ? ` Vous économisez environ ${formatCurrency(gain)} nets grâce à ce remboursement anticipé.`
      : ` Le gain net estimé est de ${formatCurrency(gain)}.`;

  return { level, badge, title, message: message + synthesis };
}

function enrichRemboursementAnticipe(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montantRembourse);
  const crd = num(input.capitalRestant);
  const mois = num(input.moisRestants);

  const computed = remboursementAnticipe.calculate({
    capitalRestant: crd,
    montantRembourse: montant,
    taux: num(input.taux),
    moisRestants: mois,
    tauxIra: num(input.tauxIra),
  });

  const gain =
    findNumber(computed, "gain net") ??
    (result.primary && /gain net/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    0;
  const ira = findNumber(computed, "IRA") ?? findNumber(result, "IRA") ?? 0;
  const eco = findNumber(computed, "économie") ?? findNumber(result, "économie") ?? 0;
  const nouveauCrd =
    findNumber(computed, "CRD") ??
    findNumber(result, "CRD") ??
    Math.max(0, crd - Math.min(montant, crd));

  const narrative = `En remboursant ${formatCurrency(montant)} par anticipation sur un CRD de ${formatCurrency(crd)} (${mois} mois restants), vous économisez environ ${formatCurrency(eco)} d'intérêts, moins ${formatCurrency(ira)} d'IRA — soit un gain net de ${formatCurrency(gain)}. Votre capital restant dû passe de ${formatCurrency(crd)} à ${formatCurrency(nouveauCrd)}.`;

  return mergeResult(result, {
    primary: { label: "Gain net estimé", value: formatCurrency(gain) },
    narrative,
    interpretation: remboursementAnticipeInterpretation(gain),
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

  const computed = pretPtz.calculate({
    revenuFiscal: revenu,
    prixBien: prix,
    zone,
    nbPersonnes: nb,
  });
  const est = estimerPtz({
    revenuFiscal: revenu,
    prixBien: prix,
    zone,
    nbPersonnes: nb,
  });

  const montant =
    findNumber(computed, "PTZ") ??
    (result.primary && /PTZ/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    est.montant;
  const eligible = est.eligible;
  const plafondRevenuEffectif = est.plafondRevenuEffectif;
  const prixRetenu = est.prixRetenu;
  const quotite = est.quotite;
  const resteAFinancer = Math.max(0, prix - montant);
  const pctCoutRetenu = prixRetenu > 0 ? (montant / prixRetenu) * 100 : 0;

  const narrative = eligible
    ? `Vous êtes éligible à un PTZ estimé de ${formatCurrency(montant)}, soit environ ${formatPercent(pctCoutRetenu, 0)} du coût retenu de votre projet immobilier. Reste à financer : ${formatCurrency(resteAFinancer)} (${formatCurrency(prix)} − ${formatCurrency(montant)}).`
    : `Avec un revenu fiscal de ${formatCurrency(revenu)}, vous dépassez le plafond estimé de ${formatCurrency(plafondRevenuEffectif)} pour votre situation. Aucun PTZ ne peut être accordé sur ce projet.`;

  const calculPtzText = [
    `Prix du logement : ${formatCurrency(prix)}`,
    ...(prix > prixRetenu
      ? [
          `Prix retenu pour le calcul : ${formatCurrency(prixRetenu)} (plafond réglementaire)`,
        ]
      : []),
    `Quotité appliquée : ${formatPercent(quotite * 100, 0)}`,
    `Montant PTZ estimé : ${formatCurrency(montant)}`,
    `Reste à financer : ${formatCurrency(resteAFinancer)}`,
  ].join(". ") + ".";

  const differeMessage =
    "Le PTZ est un prêt sans intérêts et peut bénéficier d'un différé de remboursement selon vos revenus et votre profil.";

  return mergeResult(result, {
    primary: { label: "Montant PTZ estimé", value: formatCurrency(montant) },
    narrative,
    interpretation: eligible
      ? {
          level: "favorable",
          badge: "Éligible",
          title: "Aide potentielle",
          message: `Le PTZ peut réduire votre effort d'emprunt principal — sous réserve d'instruction. ${differeMessage}`,
        }
      : {
          level: "warning",
          badge: "Non éligible",
          title: "Plafond dépassé",
          message:
            "Votre revenu fiscal dépasse le plafond estimé pour votre zone et votre foyer. Explorez d'autres dispositifs (PAS, Action Logement…).",
        },
    advice: eligible
      ? {
          title: "Si vous êtes éligible au PTZ",
          items: [
            "Vérifiez que vous êtes bien primo-accédant",
            "Intégrez le PTZ dans votre plan de financement",
            "Simulez votre mensualité avec et sans PTZ",
            "Vérifiez la durée de différé applicable",
          ],
        }
      : {
          title: "Si vous n'êtes pas éligible au PTZ",
          items: [
            "Vérifiez les plafonds officiels",
            "Contrôlez votre revenu fiscal de référence",
            "Regardez les aides complémentaires (PAS, Action Logement…)",
            "Vérifiez si un autre projet pourrait devenir éligible",
          ],
        },
    callouts: [
      {
        variant: eligible ? "tip" : "note",
        title: "Calcul du PTZ",
        text: eligible
          ? calculPtzText
          : `Revenu fiscal : ${formatCurrency(revenu)} — plafond estimé pour votre situation : ${formatCurrency(plafondRevenuEffectif)}.`,
      },
    ],
  });
}

function pretRelaisInterpretation(
  montant: number,
  duree: number,
  interets: number,
  interetsMensuels: number
): ResultInterpretation {
  const coutPhrase = `Pendant ${duree} mois, le coût estimé du prêt relais est d'environ ${formatCurrency(interets)}, soit environ ${formatCurrency(interetsMensuels)}/mois, hors assurance et frais éventuels.`;

  if (montant > 200_000) {
    return {
      level: "favorable",
      badge: "Relais important",
      title: "Relais important",
      message: `Le prêt relais peut couvrir une part importante de votre nouveau projet. ${coutPhrase}`,
    };
  }
  if (montant >= 100_000) {
    return {
      level: "intermediate",
      badge: "Relais significatif",
      title: "Relais significatif",
      message: `Le prêt relais constitue un apport important, mais il devra probablement être complété par un crédit immobilier. ${coutPhrase}`,
    };
  }
  if (montant >= 20_000) {
    return {
      level: "intermediate",
      badge: "Relais limité",
      title: "Relais limité",
      message: `Le montant mobilisable reste limité. Vérifiez si le projet reste finançable. ${coutPhrase}`,
    };
  }
  return {
    level: "warning",
    badge: "Avance insuffisante",
    title: "Avance insuffisante",
    message: `Le capital restant dû absorbe une grande partie de l'avance bancaire. Une vente préalable ou davantage d'apport peut être préférable.${montant > 0 ? ` ${coutPhrase}` : ""}`,
  };
}

function enrichPretRelais(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const valeur = num(input.valeurBien);
  const crd = num(input.crd);
  const pct = num(input.pctAvance);
  const taux = num(input.taux);
  const duree = num(input.dureeMois);

  const computed = pretRelais.calculate({
    valeurBien: valeur,
    crd,
    pctAvance: pct,
    taux,
    dureeMois: duree,
  });

  const avance =
    findNumber(computed, "avance") ?? valeur * (pct / 100);
  const montant =
    findNumber(computed, "prêt relais") ??
    (result.primary && /prêt relais/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    Math.max(0, avance - crd);
  const interets =
    findNumber(computed, "intérêts") ??
    montant * (taux / 100) * (duree / 12);
  const interetsMensuels = duree > 0 ? interets / duree : 0;
  const valeurNette = Math.max(0, valeur - crd);

  const narrative = `Sur un bien estimé à ${formatCurrency(valeur)}, une avance bancaire de ${formatPercent(pct, 0)} représente ${formatCurrency(avance)}. Après déduction du capital restant dû de ${formatCurrency(crd)}, le montant de prêt relais disponible est estimé à ${formatCurrency(montant)}. Sur ${duree} mois à ${formatPercent(taux, 1)}, le coût des intérêts est d'environ ${formatCurrency(interets)}.`;

  const calculRelaisText = [
    `Valeur estimée du bien : ${formatCurrency(valeur)}`,
    `Avance bancaire retenue : ${formatPercent(pct, 0)}`,
    `Avance sur valeur : ${formatCurrency(avance)}`,
    `Capital restant dû déduit : ${formatCurrency(crd)}`,
    `Montant du prêt relais estimé : ${formatCurrency(montant)}`,
    `Intérêts estimés sur la durée : ${formatCurrency(interets)}`,
    `Coût moyen des intérêts : ${formatCurrency(interetsMensuels)}/mois`,
    `Valeur nette disponible après remboursement du prêt actuel : ${formatCurrency(valeurNette)} (${formatCurrency(valeur)} − ${formatCurrency(crd)})`,
  ].join(" · ");

  return mergeResult(result, {
    primary: { label: "Montant prêt relais estimé", value: formatCurrency(montant) },
    narrative,
    interpretation: pretRelaisInterpretation(montant, duree, interets, interetsMensuels),
    advice: {
      title: "Pour sécuriser un prêt relais",
      items: [
        "Obtenez une estimation fiable et réaliste de la valeur de revente",
        "Prévoyez une marge si la vente tarde (6 à 12 mois de plus)",
        "Comparez relais sec et relais adossé à un crédit amortissable",
        "Anticipez le coût des intérêts sur toute la durée du relais",
      ],
    },
    lines: [
      ...result.lines,
      {
        label: "Valeur nette disponible après remboursement du prêt actuel",
        value: formatCurrency(valeurNette),
        description: `${formatCurrency(valeur)} − ${formatCurrency(crd)}`,
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Comment est calculé votre prêt relais ?",
        text: calculRelaisText,
      },
    ],
  });
}

function rachatCreditInterpretation(
  gainNet: number,
  delaiAmortissement: number | null
): ResultInterpretation {
  const delaiPhrase =
    delaiAmortissement !== null
      ? ` Les frais seraient amortis en environ ${Math.round(delaiAmortissement)} mois.`
      : " Les frais ne sont pas amortissables avec cette offre.";

  if (gainNet > 15_000) {
    return {
      level: "favorable",
      badge: "Rachat très avantageux",
      title: "Rachat très avantageux",
      message: `Le rachat peut générer une économie importante sur la durée restante.${delaiPhrase}`,
    };
  }
  if (gainNet >= 5_000) {
    return {
      level: "favorable",
      badge: "Rachat intéressant",
      title: "Rachat intéressant",
      message: `Le rachat semble rentable, sous réserve de confirmation des frais et conditions bancaires.${delaiPhrase}`,
    };
  }
  if (gainNet >= 1_000) {
    return {
      level: "intermediate",
      badge: "Gain limité",
      title: "Gain limité",
      message: `Le rachat peut être utile mais l'économie reste modérée.${delaiPhrase}`,
    };
  }
  return {
    level: "warning",
    badge: "Rachat peu avantageux",
    title: "Rachat peu avantageux",
    message: `Les frais et le nouveau taux ne génèrent pas d'économie nette.${delaiAmortissement !== null ? delaiPhrase : ""}`,
  };
}

function enrichRachatCredit(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const crd = num(input.crd);
  const tauxActuel = num(input.tauxActuel);
  const tauxNouveau = num(input.tauxNouveau);
  const mois = num(input.moisRestants);
  const frais = num(input.fraisRachat);

  const computed = rachatCredit.calculate({
    crd,
    tauxActuel,
    tauxNouveau,
    moisRestants: mois,
    fraisRachat: frais,
  });

  const ecoMensuelle =
    findNumber(computed, "économie mensuelle") ??
    (result.primary && /économie mensuelle/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    0;
  const mActuel =
    findNumber(computed, "Mensualité actuelle") ??
    findNumber(result, "Mensualité actuelle") ??
    0;
  const mNouveau =
    findNumber(computed, "Nouvelle mensualité") ??
    findNumber(result, "Nouvelle mensualité") ??
    0;
  const totalActuel =
    findNumber(computed, "Coût total restant actuel") ??
    findNumber(result, "Coût total restant actuel") ??
    0;
  const totalNouveau =
    findNumber(computed, "Coût total avec rachat") ??
    findNumber(result, "Coût total avec rachat") ??
    0;
  const gainBrut = totalActuel - totalNouveau;
  const gainNet = gainBrut - frais;
  const delaiAmortissement = ecoMensuelle > 0 ? frais / ecoMensuelle : null;
  const delaiLine =
    delaiAmortissement !== null
      ? `Les frais seraient amortis en environ ${Math.round(delaiAmortissement)} mois.`
      : "Les frais ne sont pas amortissables avec cette offre.";

  const narrative = `Sur ${formatCurrency(crd)} restants dus, passer de ${formatPercent(tauxActuel, 2)} à ${formatPercent(tauxNouveau, 2)} ferait passer votre mensualité d'environ ${formatCurrency(mActuel)} à ${formatCurrency(mNouveau)}, soit une économie de ${formatCurrency(ecoMensuelle)}/mois. Après prise en compte de ${formatCurrency(frais)} de frais, le gain net estimé sur la durée restante est d'environ ${formatCurrency(gainNet)}.`;

  const calculGainText = [
    `Mensualité actuelle : ${formatCurrency(mActuel)}`,
    `Nouvelle mensualité : ${formatCurrency(mNouveau)}`,
    `Économie mensuelle : ${formatCurrency(ecoMensuelle)}`,
    `Coût total restant actuel : ${formatCurrency(totalActuel)}`,
    `Coût total avec rachat : ${formatCurrency(totalNouveau)}`,
    `Gain brut avant frais : ${formatCurrency(gainBrut)}`,
    `Frais de rachat : ${formatCurrency(frais)}`,
    `Gain net estimé : ${formatCurrency(gainNet)}`,
    `Délai d'amortissement : ${delaiAmortissement !== null ? `${Math.round(delaiAmortissement)} mois` : "—"}`,
  ].join(" · ");

  const comparisons: ResultComparison[] = [
    {
      scenario: "Mensualité actuelle",
      value: formatCurrency(mActuel),
    },
    {
      scenario: "Nouvelle mensualité",
      value: formatCurrency(mNouveau),
    },
    {
      scenario: "Gain net estimé",
      value: formatCurrency(gainNet),
      detail: `Gain brut : ${formatCurrency(gainBrut)} · Frais : ${formatCurrency(frais)}`,
    },
  ];

  return mergeResult(result, {
    primary: { label: "Économie mensuelle", value: formatCurrency(ecoMensuelle) },
    narrative,
    interpretation: rachatCreditInterpretation(gainNet, delaiAmortissement),
    advice: {
      title: "Avant un rachat de crédit",
      items: [
        "Calculez le gain net sur toute la durée restante, pas seulement la mensualité",
        "Vérifiez les IRA sur l'ancien prêt et les frais de garantie du nouveau",
        "Comparez renégociation interne et rachat externe",
        "Renégociez aussi l'assurance emprunteur en parallèle",
      ],
    },
    lines: [
      ...result.lines,
      { label: "Gain brut avant frais", value: formatCurrency(gainBrut) },
      { label: "Gain net estimé", value: formatCurrency(gainNet) },
      {
        label: "Délai d'amortissement des frais",
        value:
          delaiAmortissement !== null
            ? `${Math.round(delaiAmortissement)} mois`
            : "Non amortissable",
        description: delaiLine,
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Comment est calculé votre gain ?",
        text: `${calculGainText} · ${delaiLine}`,
      },
    ],
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
  const chargeAcquereur = String(input.charge) === "acquereur";
  const chargeLabel = chargeAcquereur ? "acquéreur" : "vendeur";

  const computed = fraisAgence.calculate({
    prix,
    tauxAgence: taux,
    charge: String(input.charge),
  });

  const honoraires =
    findNumber(computed, "honoraires") ??
    (result.primary && /honoraires/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    prix * (taux / 100);
  const prixNetVendeur = Math.max(0, prix - honoraires);
  const prixFai = prix;
  const baseNotaire = chargeAcquereur ? prixNetVendeur : prixFai;

  const narrative = chargeAcquereur
    ? `Pour un bien affiché à ${formatCurrency(prix)}, les honoraires d'agence représentent ${formatCurrency(honoraires)} à la charge de l'acquéreur. Le prix net vendeur estimé est de ${formatCurrency(prixNetVendeur)} et le prix payé par l'acquéreur reste de ${formatCurrency(prixFai)}, hors frais de notaire. Les frais de notaire sont généralement calculés sur le prix net vendeur, soit ${formatCurrency(baseNotaire)} dans cet exemple.`
    : `Pour un bien affiché à ${formatCurrency(prix)}, les honoraires d'agence représentent ${formatCurrency(honoraires)} à la charge du vendeur. Le prix net vendeur estimé est de ${formatCurrency(prixNetVendeur)} et le prix FAI reste de ${formatCurrency(prixFai)}. Les frais de notaire sont généralement calculés sur le prix total affiché / FAI, soit ${formatCurrency(baseNotaire)}.`;

  const calculHonorairesText = [
    `Prix affiché : ${formatCurrency(prix)}`,
    `Taux d'honoraires : ${formatPercent(taux, 1)}`,
    `Honoraires d'agence : ${formatCurrency(honoraires)}`,
    `Prix net vendeur : ${formatCurrency(prixNetVendeur)}`,
    `Prix FAI / payé acquéreur : ${formatCurrency(prixFai)}`,
    `Honoraires à la charge de : ${chargeLabel}`,
    `Base indicative des frais de notaire : ${formatCurrency(baseNotaire)}`,
  ].join(" · ");

  return mergeResult(result, {
    primary: { label: "Honoraires d'agence", value: formatCurrency(honoraires) },
    narrative,
    interpretation: chargeAcquereur
      ? {
          level: "intermediate",
          badge: "Acquéreur",
          title: "Coût à prévoir côté acquéreur",
          message:
            "Les honoraires sont supportés par l'acquéreur. Vérifiez si le prix affiché est bien FAI et tenez compte de la base de calcul des frais de notaire.",
        }
      : {
          level: "favorable",
          badge: "Vendeur",
          title: "Honoraires déduits du prix vendeur",
          message:
            "Les honoraires sont supportés par le vendeur. Le prix net vendeur correspond au prix affiché diminué de la commission d'agence.",
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
    lines: [
      ...result.lines,
      { label: "Prix net vendeur", value: formatCurrency(prixNetVendeur) },
      { label: "Prix FAI / payé acquéreur", value: formatCurrency(prixFai) },
      {
        label: "Base indicative des frais de notaire",
        value: formatCurrency(baseNotaire),
        description: chargeAcquereur
          ? "Généralement calculés sur le prix net vendeur"
          : "Généralement calculés sur le prix total affiché / FAI",
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Comment sont calculés les honoraires ?",
        text: calculHonorairesText,
      },
    ],
  });
}

// ─── Financement (part 3) ──────────────────────────────────────────

function coutGarantieHypotheque(capital: number): number {
  return capital * 0.015 + capital * 0.005;
}

function coutGarantieCaution(capital: number, duree: number): number {
  return capital * 0.01 + capital * 0.003 * Math.min(duree, 8);
}

function formatEcartGarantie(
  isCaution: boolean,
  coutChoisi: number,
  coutAlt: number
): string {
  const ecart = Math.abs(coutChoisi - coutAlt);
  if (ecart < 1) return "Coûts équivalents";
  const typeLabel = isCaution ? "caution" : "hypothèque";
  if (coutChoisi > coutAlt) {
    return `${typeLabel} plus chère de ${formatCurrency(ecart)}`;
  }
  return `${typeLabel} moins chère de ${formatCurrency(ecart)}`;
}

function fraisGarantieInterpretation(
  pctCapital: number,
  isCaution: boolean,
  coutCaution: number,
  coutHypotheque: number
): ResultInterpretation {
  const baseMessage =
    pctCapital <= 2.5
      ? "Le coût reste raisonnable par rapport au capital emprunté, mais il doit être intégré au budget global du prêt."
      : "Le coût de garantie représente une part importante du budget. Comparez la caution et l'hypothèque avec votre banque.";

  let comparisonNote = "";
  if (Math.abs(coutCaution - coutHypotheque) >= 1) {
    comparisonNote =
      coutCaution < coutHypotheque
        ? " La caution semble moins coûteuse dans cette estimation."
        : " L'hypothèque semble moins coûteuse dans cette estimation, mais elle peut entraîner des frais de mainlevée en cas de revente anticipée.";
  }

  return {
    level: pctCapital <= 2.5 ? "favorable" : "intermediate",
    badge: isCaution ? "Caution" : "Hypothèque",
    title: pctCapital <= 2.5 ? "Garantie maîtrisée" : "Garantie coûteuse",
    message: baseMessage + comparisonNote,
  };
}

function enrichFraisGarantie(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const capital = num(input.capital);
  const duree = num(input.duree);
  const isCaution = String(input.typeGarantie) === "caution";
  const typeGarantie = String(input.typeGarantie);

  const computed = fraisGarantieEmprunt.calculate({
    capital,
    typeGarantie,
    duree,
  });

  const cout =
    findNumber(computed, "coût total") ??
    (result.primary && /coût total/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    (isCaution ? coutGarantieCaution(capital, duree) : coutGarantieHypotheque(capital));
  const pctCapital =
    findPercent(computed, "% du capital") ??
    (capital > 0 ? (cout / capital) * 100 : 0);
  const coutHypotheque = coutGarantieHypotheque(capital);
  const coutCaution = coutGarantieCaution(capital, duree);
  const coutAlt = isCaution ? coutHypotheque : coutCaution;
  const ecartText = formatEcartGarantie(isCaution, cout, coutAlt);
  const typeLabelLong = isCaution ? "caution Crédit Logement" : "hypothèque";
  const typeLabelCourt = isCaution ? "Caution Crédit Logement" : "Hypothèque";

  const narrative = `Pour garantir ${formatCurrency(capital)} sur ${duree} ans avec une ${typeLabelLong}, le coût estimé est d'environ ${formatCurrency(cout)}, soit ${formatPercent(pctCapital, 2)} du capital emprunté. Ce montant est à intégrer dans le budget global du prêt.`;

  const calculGarantieText = isCaution
    ? [
        `Capital emprunté : ${formatCurrency(capital)}`,
        `Type de garantie : ${typeLabelCourt}`,
        `Durée du prêt : ${duree} ans`,
        `Coût en % du capital : ${formatPercent(pctCapital, 2)}`,
        `Coût total estimé : ${formatCurrency(cout)}`,
        `Alternative hypothèque estimée : ${formatCurrency(coutHypotheque)}`,
      ].join(" · ")
    : [
        `Capital emprunté : ${formatCurrency(capital)}`,
        `Type de garantie : ${typeLabelCourt}`,
        `Durée du prêt : ${duree} ans`,
        `Coût en % du capital : ${formatPercent(pctCapital, 2)}`,
        `Coût hypothèque estimé : ${formatCurrency(cout)}`,
        `Alternative caution estimée : ${formatCurrency(coutCaution)}`,
      ].join(" · ");

  const comparisons: ResultComparison[] = [
    {
      scenario: `Garantie choisie : ${isCaution ? "caution" : "hypothèque"}`,
      value: formatCurrency(cout),
    },
    {
      scenario: isCaution ? "Coût hypothèque estimé" : "Coût caution estimé",
      value: formatCurrency(coutAlt),
    },
    {
      scenario: "Écart",
      value: ecartText,
    },
  ];

  return mergeResult(result, {
    primary: { label: "Coût total estimé", value: formatCurrency(cout) },
    narrative,
    interpretation: fraisGarantieInterpretation(pctCapital, isCaution, coutCaution, coutHypotheque),
    advice: {
      title: "Pour choisir votre garantie",
      items: [
        "Comparez hypothèque et caution avec votre banque — le choix est souvent imposé",
        "Intégrez les frais de mainlevée hypothécaire (~500 à 1 500 €) dans le total",
        "Vérifiez si une part de commission caution est restituée en cas de bon dossier",
        "Ces frais peuvent parfois être financés dans le montant emprunté",
      ],
    },
    lines: [
      ...result.lines,
      { label: "Coût total estimé", value: formatCurrency(cout) },
      {
        label: isCaution ? "Alternative hypothèque estimée" : "Alternative caution estimée",
        value: formatCurrency(coutAlt),
      },
      { label: "Écart entre les deux garanties", value: ecartText },
    ],
    comparisons,
    callouts: [
      {
        variant: "note",
        title: "Comment est calculé le coût de garantie ?",
        text: calculGarantieText,
      },
    ],
  });
}

function formatDureeAnneesMois(mois: number): string {
  const annees = Math.floor(mois / 12);
  const resteMois = mois % 12;
  const parts: string[] = [];
  if (annees > 0) parts.push(`${annees} an${annees > 1 ? "s" : ""}`);
  if (resteMois > 0) parts.push(`${resteMois} mois`);
  return parts.length ? parts.join(" et ") : "0 mois";
}

function parseDureeMoisFromResult(
  result: SimulatorResult,
  computed: SimulatorResult
): number | null {
  const fromComputed = findNumber(computed, "durée");
  if (fromComputed !== null) return fromComputed;
  if (result.primary && /durée/i.test(result.primary.label)) {
    const parsed = parseFormattedNumber(result.primary.value);
    if (parsed !== null) return parsed;
  }
  return null;
}

function effortEpargneInterpretation(
  dureeMois: number,
  rendement: number,
  interets: number
): ResultInterpretation {
  const gainPhrase =
    interets > 0
      ? ` Le rendement de ${formatPercent(rendement, 1)} génère environ ${formatCurrency(interets)} d'intérêts sur la période.`
      : rendement > 0
        ? ` Le rendement de ${formatPercent(rendement, 1)} reste modeste sur cette durée.`
        : "";
  const dureePhrase = ` Sur ${dureeMois} mois (${formatDureeAnneesMois(dureeMois)}),`;

  if (dureeMois < 24) {
    return {
      level: "favorable",
      badge: "Horizon court",
      title: "Horizon court",
      message: `Objectif rapidement atteignable.${dureePhrase} vous pouvez projeter un achat proche.${gainPhrase}`,
    };
  }
  if (dureeMois < 72) {
    return {
      level: "intermediate",
      badge: "Horizon moyen",
      title: "Horizon moyen",
      message: `Constitution progressive de l'apport.${dureePhrase} prévoyez un placement régulier adapté.${gainPhrase}`,
    };
  }
  if (dureeMois < 120) {
    return {
      level: "intermediate",
      badge: "Horizon long",
      title: "Horizon long",
      message: `L'objectif demandera plusieurs années d'épargne.${dureePhrase} réévaluez régulièrement votre progression.${gainPhrase}`,
    };
  }
  return {
    level: "warning",
    badge: "Horizon très long",
    title: "Horizon très long",
    message: `Il peut être utile d'augmenter l'épargne mensuelle ou de revoir l'objectif d'apport.${dureePhrase} le rendement peine à raccourcir sensiblement la durée.${gainPhrase}`,
  };
}

function effortEpargneAdvice(dureeMois: number): ResultAdvice {
  if (dureeMois < 24) {
    return {
      title: "Pour un horizon court",
      items: [
        "Conservez l'effort d'épargne actuel",
        "Sécurisez l'épargne sur un support sans risque (livret, compte épargne)",
        "Intégrez les frais de notaire dans l'objectif si non financés",
        "Préparez la simulation de capacité d'emprunt dès que l'apport est réuni",
      ],
    };
  }
  if (dureeMois < 72) {
    return {
      title: "Pour un horizon moyen",
      items: [
        "Automatisez les versements mensuels",
        "Utilisez un PEL ou un livret adapté à votre horizon",
        "Réévaluez votre objectif d'apport une fois par an",
        "Évitez le risque sur un horizon encore court à moyen",
      ],
    };
  }
  if (dureeMois < 120) {
    return {
      title: "Pour un horizon long",
      items: [
        "Augmentez progressivement votre épargne mensuelle si possible",
        "Revoyez votre budget et les postes compressibles",
        "Automatisez les versements pour tenir l'effort dans la durée",
        "Comparez régulièrement les prix du marché pendant la constitution",
      ],
    };
  }
  return {
    title: "Pour un horizon très long",
    items: [
      "Augmentez progressivement l'épargne mensuelle si votre budget le permet",
      "Revoyez le budget global et l'objectif d'apport",
      "Recherchez des aides ou un apport familial si pertinent",
      "Envisagez un bien moins cher ou une zone différente pour réduire l'apport nécessaire",
    ],
  };
}

function enrichEffortEpargne(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const objectif = num(input.objectifApport);
  const actuelle = num(input.epargneActuelle);
  const mensuelle = num(input.epargneMensuelle);
  const rendement = num(input.rendement);
  const reste = Math.max(0, objectif - actuelle);
  const atteint = reste <= 0;

  const computed = effortEpargneImmobilier.calculate({
    objectifApport: objectif,
    epargneActuelle: actuelle,
    epargneMensuelle: mensuelle,
    rendement,
  });

  if (atteint) {
    const narrative = `Votre épargne de ${formatCurrency(actuelle)} couvre déjà l'apport cible de ${formatCurrency(objectif)}. Vous pouvez lancer la simulation de capacité d'emprunt.`;
    return mergeResult(result, {
      primary: { label: "Statut", value: "Objectif atteint" },
      narrative,
      interpretation: {
        level: "favorable",
        badge: "Apport disponible",
        title: "Apport disponible",
        message:
          "L'objectif d'apport est déjà atteint. Vous pouvez avancer sur la recherche de bien et la demande de prêt.",
      },
      advice: {
        title: "Prochaines étapes",
        items: [
          "Simulez votre capacité d'emprunt avec cet apport",
          "Intégrez les frais de notaire dans votre budget global",
          "Comparez les offres bancaires et les assurances emprunteur",
          "Conservez une épargne de précaution en parallèle",
        ],
      },
      lines: [
        ...result.lines,
        { label: "Rendement annuel", value: formatPercent(rendement, 1) },
        { label: "Reste à épargner", value: formatCurrency(0) },
      ],
      callouts: [
        {
          variant: "note",
          title: "Comment est calculée votre durée d'épargne ?",
          text: `Apport cible : ${formatCurrency(objectif)} · Épargne actuelle : ${formatCurrency(actuelle)} · Reste à épargner : ${formatCurrency(0)} · Objectif déjà atteint.`,
        },
      ],
    });
  }

  if (mensuelle <= 0) {
    const narrative = `Il reste ${formatCurrency(reste)} à constituer pour atteindre un apport de ${formatCurrency(objectif)}, avec ${formatCurrency(actuelle)} déjà disponibles. Sans épargne mensuelle, la durée reste indéterminée.`;
    return mergeResult(result, {
      primary: { label: "Reste à épargner", value: formatCurrency(reste) },
      narrative,
      interpretation: {
        level: "warning",
        badge: "Blocage",
        title: "Épargne insuffisante",
        message:
          "Augmentez votre capacité d'épargne mensuelle ou ajustez l'objectif d'apport pour estimer une durée.",
      },
      advice: {
        title: "Pour relancer l'épargne",
        items: [
          "Fixez un versement mensuel, même modeste, pour rendre l'objectif mesurable",
          "Revoyez votre budget pour libérer une épargne régulière",
          "Automatisez un virement dès réception des revenus",
          "Ajustez l'objectif d'apport si nécessaire",
        ],
      },
      lines: [
        ...result.lines,
        { label: "Rendement annuel", value: formatPercent(rendement, 1) },
        { label: "Apport cible", value: formatCurrency(objectif) },
        { label: "Épargne actuelle", value: formatCurrency(actuelle) },
      ],
      callouts: [
        {
          variant: "note",
          title: "Comment est calculée votre durée d'épargne ?",
          text: `Apport cible : ${formatCurrency(objectif)} · Épargne actuelle : ${formatCurrency(actuelle)} · Reste à épargner : ${formatCurrency(reste)} · Épargne mensuelle : ${formatCurrency(mensuelle)} · Durée non calculable sans versement mensuel.`,
        },
      ],
    });
  }

  const simulation = simulerEpargneObjectif(objectif, actuelle, mensuelle, rendement);
  const dureeMois =
    parseDureeMoisFromResult(result, computed) ?? simulation.mois;
  const capitalVerse =
    findNumber(computed, "Capital versé") ?? simulation.capitalVerse;
  const interets =
    findNumber(computed, "Intérêts") ??
    findNumber(computed, "intérêts") ??
    simulation.interets;
  const capitalFinal =
    findNumber(computed, "Capital final") ?? simulation.capitalFinal;
  const dureeTexte = formatDureeAnneesMois(dureeMois);

  const narrative = `Pour constituer un apport de ${formatCurrency(objectif)}, en partant de ${formatCurrency(actuelle)} déjà disponibles et en épargnant ${formatCurrency(mensuelle)}/mois avec un rendement annuel estimé de ${formatPercent(rendement, 1)}, il faudra environ ${dureeMois} mois (${dureeTexte}). Il reste ${formatCurrency(reste)} à épargner${interets > 0 ? ` ; le rendement pourrait générer environ ${formatCurrency(interets)} d'intérêts sur la période` : ""}.`;

  const calculEpargneText = [
    `Apport cible : ${formatCurrency(objectif)}`,
    `Épargne actuelle : ${formatCurrency(actuelle)}`,
    `Reste à épargner : ${formatCurrency(reste)}`,
    `Épargne mensuelle : ${formatCurrency(mensuelle)}`,
    `Rendement annuel utilisé : ${formatPercent(rendement, 1)}`,
    `Capital versé : ${formatCurrency(capitalVerse)}`,
    `Intérêts générés : ${formatCurrency(interets)}`,
    `Capital final estimé : ${formatCurrency(capitalFinal)}`,
    `Durée totale : ${dureeMois} mois (${dureeTexte})`,
  ].join(" · ");

  return mergeResult(result, {
    primary: { label: "Durée estimée", value: `${dureeMois} mois` },
    narrative,
    interpretation: effortEpargneInterpretation(dureeMois, rendement, interets),
    advice: effortEpargneAdvice(dureeMois),
    lines: [
      ...result.lines,
      {
        label: "Gain procuré par le rendement",
        value: formatCurrency(interets),
        description: "Différence entre capital final et épargne sans rendement",
      },
      {
        label: "Durée totale",
        value: `${dureeMois} mois (${dureeTexte})`,
      },
    ],
    callouts: [
      {
        variant: "note",
        title: "Comment est calculée votre durée d'épargne ?",
        text: calculEpargneText,
      },
    ],
  });
}

function impactHausseTauxInterpretation(
  delta: number,
  endNouveau: number
): ResultInterpretation {
  const deltaPhrase = `La hausse de taux ajoute ${formatCurrency(Math.abs(delta))}/mois`;
  const endPhrase = ` et fait passer votre endettement à ${formatPercent(endNouveau, 1)}.`;

  if (delta <= 0) {
    return {
      level: delta < 0 ? "favorable" : "neutral",
      badge: delta < 0 ? "Baisse" : "Stable",
      title: delta < 0 ? "Mensualité en baisse" : "Pas de hausse",
      message:
        delta < 0
          ? `Le nouveau taux réduirait votre mensualité d'environ ${formatCurrency(Math.abs(delta))}/mois. Endettement estimé : ${formatPercent(endNouveau, 1)}.`
          : `Le nouveau taux n'augmente pas votre mensualité. Endettement estimé : ${formatPercent(endNouveau, 1)}.`,
    };
  }

  if (endNouveau > 35) {
    return {
      level: "warning",
      badge: "Plafond dépassé",
      title: "Endettement critique",
      message: `${deltaPhrase}${endPhrase} Le seuil de 35 % est dépassé, ce qui peut fragiliser le financement.`,
    };
  }
  if (endNouveau >= 30) {
    return {
      level: "intermediate",
      badge: "À surveiller",
      title: "Marge limitée",
      message: `${deltaPhrase}${endPhrase} Vérifiez le reste à vivre.`,
    };
  }
  return {
    level: "favorable",
    badge: "Confortable",
    title: "Impact maîtrisé",
    message: `La hausse de taux reste absorbable dans votre budget, avec un endettement estimé à ${formatPercent(endNouveau, 1)}.`,
  };
}

function enrichImpactHausseTaux(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const capital = num(input.capital);
  const tauxActuel = num(input.tauxActuel);
  const tauxNouveau = num(input.tauxNouveau);
  const duree = num(input.dureeAnnees);
  const revenus = num(input.revenus);
  const charges = num(input.charges);

  const computed = impactHausseTaux.calculate({
    capital,
    tauxActuel,
    tauxNouveau,
    dureeAnnees: duree,
    revenus,
    charges,
  });

  const delta =
    findNumber(computed, "hausse mensualité") ??
    findNumber(computed, "Hausse mensualité") ??
    (result.primary && /hausse mensualité/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    0;
  const mActuel =
    findNumber(computed, "Mensualité actuelle") ??
    findNumber(result, "Mensualité actuelle") ??
    0;
  const mNouveau =
    findNumber(computed, "Nouvelle mensualité") ??
    findNumber(result, "Nouvelle mensualité") ??
    0;
  const endNouveau =
    findPercent(computed, "endettement après") ??
    findPercent(result, "endettement après") ??
    0;
  const endActuel =
    findPercent(computed, "endettement actuel") ??
    findPercent(result, "endettement actuel") ??
    0;
  const hausseEndettement = endNouveau - endActuel;
  const surcoutAnnuel = delta * 12;
  const surcoutTotal = delta * duree * 12;
  const hausseEndettementLabel = `${hausseEndettement >= 0 ? "+" : ""}${hausseEndettement.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} points`;

  const narrative =
    delta > 0
      ? `Sur ${formatCurrency(capital)} restants, une hausse de taux de ${formatPercent(tauxActuel, 2)} à ${formatPercent(tauxNouveau, 2)} ferait passer votre mensualité d'environ ${formatCurrency(mActuel)} à ${formatCurrency(mNouveau)}, soit +${formatCurrency(delta)}/mois. Votre taux d'endettement passerait de ${formatPercent(endActuel, 1)} à ${formatPercent(endNouveau, 1)}.`
      : delta < 0
        ? `Sur ${formatCurrency(capital)} restants, le passage de ${formatPercent(tauxActuel, 2)} à ${formatPercent(tauxNouveau, 2)} ferait baisser votre mensualité d'environ ${formatCurrency(mActuel)} à ${formatCurrency(mNouveau)}, soit ${formatCurrency(delta)}/mois. Votre taux d'endettement passerait de ${formatPercent(endActuel, 1)} à ${formatPercent(endNouveau, 1)}.`
        : `Sur ${formatCurrency(capital)} restants, le taux passerait de ${formatPercent(tauxActuel, 2)} à ${formatPercent(tauxNouveau, 2)} sans hausse de mensualité (${formatCurrency(mActuel)}). Votre taux d'endettement resterait à ${formatPercent(endActuel, 1)}.`;

  const calculImpactText = [
    `Capital concerné : ${formatCurrency(capital)}`,
    `Durée restante : ${duree} ans`,
    `Taux actuel : ${formatPercent(tauxActuel, 2)}`,
    `Nouveau taux : ${formatPercent(tauxNouveau, 2)}`,
    `Mensualité actuelle : ${formatCurrency(mActuel)}`,
    `Nouvelle mensualité : ${formatCurrency(mNouveau)}`,
    `Hausse mensuelle : ${formatCurrency(delta)}`,
    delta > 0
      ? `Surcoût annuel : ${formatCurrency(surcoutAnnuel)}`
      : `Surcoût annuel : ${formatCurrency(0)}`,
    delta > 0
      ? `Surcoût total estimé : ${formatCurrency(surcoutTotal)}`
      : `Surcoût total estimé : ${formatCurrency(0)}`,
    `Taux d'endettement actuel : ${formatPercent(endActuel, 1)}`,
    `Taux d'endettement après hausse : ${formatPercent(endNouveau, 1)}`,
    `Hausse d'endettement : ${hausseEndettementLabel}`,
  ].join(" · ");

  return mergeResult(result, {
    primary: { label: "Hausse mensualité", value: formatCurrency(delta) },
    narrative,
    interpretation: impactHausseTauxInterpretation(delta, endNouveau),
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
      { scenario: "Mensualité actuelle", value: formatCurrency(mActuel) },
      { scenario: "Nouvelle mensualité", value: formatCurrency(mNouveau) },
      {
        scenario: "Surcoût total estimé",
        value: delta > 0 ? formatCurrency(surcoutTotal) : formatCurrency(0),
        detail:
          delta > 0
            ? `${formatCurrency(surcoutAnnuel)}/an sur ${duree} ans`
            : "Aucun surcoût mensuel",
      },
    ],
    lines: [
      ...result.lines,
      { label: "Hausse mensuelle", value: formatCurrency(delta) },
      {
        label: "Surcoût annuel",
        value: delta > 0 ? formatCurrency(surcoutAnnuel) : formatCurrency(0),
      },
      {
        label: "Surcoût total",
        value: delta > 0 ? formatCurrency(surcoutTotal) : formatCurrency(0),
        description: delta > 0 ? `${formatCurrency(delta)}/mois × ${duree} ans` : undefined,
      },
      { label: "Hausse d'endettement", value: hausseEndettementLabel },
      { label: "Taux actuel", value: formatPercent(tauxActuel, 2) },
      { label: "Nouveau taux", value: formatPercent(tauxNouveau, 2) },
      { label: "Capital concerné", value: formatCurrency(capital) },
      { label: "Durée restante", value: `${duree} ans` },
    ],
    callouts: [
      {
        variant: "note",
        title: "Comment est calculé l'impact de la hausse ?",
        text: calculImpactText,
      },
    ],
  });
}

function breakdownCreditTravaux(
  montant: number,
  taux: number,
  duree: number,
  tauxAssurance: number
) {
  const mensualiteHorsAss = monthlyPaymentFromLoan(montant, taux, duree);
  const assuranceMensuelle = (montant * (tauxAssurance / 100)) / 12;
  const mensualiteTotale = mensualiteHorsAss + assuranceMensuelle;
  const coutTotal = mensualiteTotale * duree * 12;
  const coutAssuranceTotal = assuranceMensuelle * duree * 12;
  const interets = mensualiteHorsAss * duree * 12 - montant;
  return {
    mensualiteHorsAss,
    assuranceMensuelle,
    mensualiteTotale,
    coutTotal,
    coutAssuranceTotal,
    interets,
  };
}

function creditTravauxInterpretation(
  montant: number,
  coutTotal: number
): ResultInterpretation {
  const surcoutRatio = montant > 0 ? (coutTotal - montant) / montant : 0;
  const aidesPhrase =
    " Comparez les banques, négociez le taux et l'assurance emprunteur, et vérifiez les aides type MaPrimeRénov' ou éco-PTZ.";

  if (surcoutRatio <= 0.15) {
    return {
      level: "favorable",
      badge: "Coût maîtrisé",
      title: "Coût maîtrisé",
      message: `Le coût reste raisonnable par rapport aux ${formatCurrency(montant)} financés.${aidesPhrase}`,
    };
  }
  if (surcoutRatio <= 0.3) {
    return {
      level: "intermediate",
      badge: "Coût modéré",
      title: "Coût modéré",
      message: `Le crédit est utile mais les intérêts et l'assurance doivent être intégrés au budget.${aidesPhrase}`,
    };
  }
  return {
    level: "warning",
    badge: "Coût élevé",
    title: "Coût élevé",
    message: `Comparez plusieurs offres et vérifiez les aides avant de vous engager.${aidesPhrase}`,
  };
}

function enrichCreditTravaux(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const montant = num(input.montantTravaux);
  const duree = num(input.duree);
  const taux = num(input.taux);
  const tauxAssurance = num(input.tauxAssurance);

  const computed = creditTravaux.calculate({
    montantTravaux: montant,
    taux,
    duree,
    tauxAssurance,
  });
  const current = breakdownCreditTravaux(montant, taux, duree, tauxAssurance);

  const mensualiteTotale =
    findNumber(computed, "totale") ??
    (result.primary && /mensualité totale/i.test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    current.mensualiteTotale;
  const mensualiteHorsAss =
    findNumber(computed, "hors assurance") ?? current.mensualiteHorsAss;
  const coutTotal =
    findNumber(computed, "coût total") ?? current.coutTotal;
  const assuranceMensuelle = current.assuranceMensuelle;
  const interets = current.interets;
  const coutAssuranceTotal = current.coutAssuranceTotal;
  const mensualiteTotaleAffichage = `${formatCurrency(mensualiteTotale)}/mois`;

  const narrative = `Pour financer ${formatCurrency(montant)} de travaux sur ${duree} ans à ${formatPercent(taux, 1)}, votre mensualité est estimée à ${mensualiteTotaleAffichage} assurance incluse. Le coût total du crédit est d'environ ${formatCurrency(coutTotal)}, dont ${formatCurrency(interets)} d'intérêts et ${formatCurrency(coutAssuranceTotal)} d'assurance.`;

  const calculMensualiteText = [
    `Montant financé : ${formatCurrency(montant)}`,
    `Taux d'intérêt : ${formatPercent(taux, 1)}`,
    `Durée : ${duree} ans`,
    `Assurance annuelle : ${formatPercent(tauxAssurance, 2)}`,
    `Mensualité hors assurance : ${formatCurrency(mensualiteHorsAss)}`,
    `Assurance mensuelle : ${formatCurrency(assuranceMensuelle)}`,
    `Mensualité totale : ${mensualiteTotaleAffichage}`,
    `Intérêts estimés : ${formatCurrency(interets)}`,
    `Coût total estimé : ${formatCurrency(coutTotal)}`,
  ].join(" · ");

  const altDuree = duree >= 10 ? Math.max(2, duree - 3) : 10;
  const alt = breakdownCreditTravaux(montant, taux, altDuree, tauxAssurance);
  const ecartMensualite = alt.mensualiteTotale - mensualiteTotale;
  const ecartCoutTotal = alt.coutTotal - coutTotal;

  const comparisons: ResultComparison[] = [
    {
      scenario: `Mensualité sur ${duree} ans`,
      value: mensualiteTotaleAffichage,
      detail: `Coût total : ${formatCurrency(coutTotal)}`,
    },
    {
      scenario: `Si vous empruntiez sur ${altDuree} ans`,
      value: `${formatCurrency(alt.mensualiteTotale)}/mois`,
      detail: `Coût total : ${formatCurrency(alt.coutTotal)}`,
    },
    {
      scenario: "Écart estimé",
      value: `${ecartMensualite >= 0 ? "+" : ""}${formatCurrency(ecartMensualite)}/mois`,
      detail: `Écart de coût total : ${formatCurrency(ecartCoutTotal)}`,
    },
  ];

  return mergeResult(result, {
    primary: { label: "Mensualité totale", value: mensualiteTotaleAffichage },
    narrative,
    interpretation: creditTravauxInterpretation(montant, coutTotal),
    advice: {
      title: "Pour financer vos travaux",
      items: [
        "Demandez 3 devis avant d'emprunter — le montant doit correspondre aux factures",
        "Comparez plusieurs banques et négociez le taux proposé",
        "Comparez l'assurance emprunteur via une délégation si possible",
        "Vérifiez les aides publiques (MaPrimeRénov', éco-PTZ) avant un crédit classique",
      ],
    },
    lines: [
      ...result.lines,
      { label: "Assurance mensuelle", value: formatCurrency(assuranceMensuelle) },
      { label: "Intérêts payés", value: formatCurrency(interets) },
      { label: "Coût total de l'assurance", value: formatCurrency(coutAssuranceTotal) },
      { label: "Coût total du crédit", value: formatCurrency(coutTotal) },
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
}

// ─── Investissement ────────────────────────────────────────────────

function plusValueInterpretation(
  plusValueBrute: number,
  impotTotal: number
): ResultInterpretation {
  if (plusValueBrute <= 0) {
    return {
      level: "neutral",
      badge: "Nulle",
      title: "Pas de plus-value",
      message: "Le prix de vente ne dépasse pas le coût d'acquisition corrigé.",
    };
  }
  if (impotTotal <= 0) {
    return {
      level: "favorable",
      badge: "Exonération",
      title: "Exonération",
      message: "Aucune imposition estimée sur cette plus-value.",
    };
  }
  const ratio = impotTotal / plusValueBrute;
  if (ratio <= 0.15) {
    return {
      level: "favorable",
      badge: "Fiscalité faible",
      title: "Fiscalité faible",
      message: "Impôt limité grâce aux abattements liés à la durée de détention.",
    };
  }
  if (ratio <= 0.3) {
    return {
      level: "intermediate",
      badge: "Fiscalité modérée",
      title: "Fiscalité modérée",
      message: "Une partie importante de la plus-value reste imposable.",
    };
  }
  return {
    level: "warning",
    badge: "Fiscalité élevée",
    title: "Fiscalité élevée",
    message: "La plus-value reste largement taxable malgré les abattements.",
  };
}

function plusValueAdvice(
  input: EnricherInput,
  anneesRestantesIR: number,
  anneesRestantesPS: number,
  annees: number
): ResultAdvice {
  const items: string[] = [];
  if (num(input.travaux) > 0) {
    items.push("Conservez les justificatifs des travaux.");
  }
  if (num(input.fraisAcquisition) > 0) {
    items.push("Les frais d'acquisition augmentent votre prix d'achat fiscal.");
  }
  if (anneesRestantesIR > 0 && annees < 22) {
    items.push(
      `Attendre ${anneesRestantesIR} année${anneesRestantesIR > 1 ? "s" : ""} supplémentaire${anneesRestantesIR > 1 ? "s" : ""} peut exonérer l'impôt sur le revenu (22 ans de détention).`
    );
  } else if (anneesRestantesPS > 0) {
    items.push(
      `Attendre ${anneesRestantesPS} année${anneesRestantesPS > 1 ? "s" : ""} supplémentaire${anneesRestantesPS > 1 ? "s" : ""} peut exonérer totalement les prélèvements sociaux (30 ans).`
    );
  }
  items.push(
    "Vérifiez si vous bénéficiez d'une exonération (résidence principale, première cession, etc.)."
  );
  items.push("Consultez un notaire avant la vente.");
  return { title: "Pour optimiser votre sortie", items };
}

function enrichPlusValue(input: EnricherInput, result: SimulatorResult): SimulatorResult {
  const computed = plusValueImmobiliere.calculate({
    prixAchat: num(input.prixAchat),
    fraisAcquisition: num(input.fraisAcquisition),
    travaux: num(input.travaux),
    prixVente: num(input.prixVente),
    anneesDetention: num(input.anneesDetention),
  });

  const readAmount = (pattern: string): number =>
    findNumber(computed, pattern) ??
    (result.primary && new RegExp(pattern, "i").test(result.primary.label)
      ? parseFormattedNumber(result.primary.value)
      : null) ??
    findNumber(result, pattern) ??
    0;

  const prixAchat = num(input.prixAchat);
  const fraisAcquisition = num(input.fraisAcquisition);
  const travaux = num(input.travaux);
  const fraisEtTravaux = fraisAcquisition + travaux;
  const prixVente = num(input.prixVente);
  const annees = num(input.anneesDetention);

  const plusValueBrute = readAmount("plus-value brute");
  const abattementIR = readAmount("abattement ir");
  const abattementPS = readAmount("abattement prélèvements");
  const pvImposableIR = readAmount("imposable ir");
  const pvImposablePS = readAmount("imposable ps");
  const impotRevenu = readAmount("impôt sur le revenu");
  const prelevementsSociaux = readAmount("prélèvements sociaux");
  const surtaxe = readAmount("surtaxe");
  const impotTotal = readAmount("impôt total");
  const plusValueNette = readAmount("plus-value nette");
  const anneesRestantesIR = readAmount("exonération ir");
  const anneesRestantesPS = readAmount("exonération ps");
  const economieFiscale = readAmount("économie fiscale");
  const impactFraisTravaux = fraisEtTravaux > 0 ? fraisEtTravaux : 0;

  const narrative = `Votre bien acheté ${formatCurrency(prixAchat)}${fraisEtTravaux > 0 ? `, majoré de ${formatCurrency(fraisEtTravaux)} de frais et travaux` : ""}, est revendu ${formatCurrency(prixVente)}, soit une plus-value brute de ${formatCurrency(plusValueBrute)}. Après application des abattements liés à une détention de ${annees} ans, l'impôt estimé est de ${formatCurrency(impotTotal)} et la plus-value nette est de ${formatCurrency(plusValueNette)}.`;

  const calculPlusValueText = [
    `Prix de vente : ${formatCurrency(prixVente)}`,
    `− Prix d'achat : ${formatCurrency(prixAchat)}`,
    fraisAcquisition > 0 ? `− Frais d'acquisition : ${formatCurrency(fraisAcquisition)}` : null,
    travaux > 0 ? `− Travaux : ${formatCurrency(travaux)}` : null,
    `→ Plus-value brute : ${formatCurrency(plusValueBrute)}`,
    `→ Abattement IR (${formatPercent((abattementIR / plusValueBrute) * 100 || 0, 0)} sur ${annees} ans) : ${formatCurrency(abattementIR)}`,
    `→ Abattement prélèvements sociaux (${formatPercent((abattementPS / plusValueBrute) * 100 || 0, 0)}) : ${formatCurrency(abattementPS)}`,
    `→ Plus-value imposable IR : ${formatCurrency(pvImposableIR)} · IR 19 % : ${formatCurrency(impotRevenu)}`,
    `→ Plus-value imposable PS : ${formatCurrency(pvImposablePS)} · PS 17,2 % : ${formatCurrency(prelevementsSociaux)}`,
    surtaxe > 0 ? `→ Surtaxe : ${formatCurrency(surtaxe)}` : null,
    `→ Impôt total : ${formatCurrency(impotTotal)}`,
    `→ Plus-value nette : ${formatCurrency(plusValueNette)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const callouts: SimulatorResult["callouts"] = [
    {
      variant: "note",
      title: "Comment est calculée votre plus-value ?",
      text: calculPlusValueText,
    },
    {
      variant: "note",
      title: "À savoir",
      text: "Estimation selon les barèmes IR (19 %) et prélèvements sociaux (17,2 %) avec abattements progressifs — exonérations particulières non modélisées. Le notaire établit le calcul définitif.",
    },
  ];

  if (anneesRestantesIR > 0) {
    callouts.push({
      variant: "info",
      title: "Exonération IR",
      text: `Il reste ${anneesRestantesIR} année${anneesRestantesIR > 1 ? "s" : ""} avant l'exonération totale de l'impôt sur le revenu (22 ans de détention).`,
    });
  }
  if (anneesRestantesPS > 0) {
    callouts.push({
      variant: "info",
      title: "Exonération prélèvements sociaux",
      text: `Il reste ${anneesRestantesPS} année${anneesRestantesPS > 1 ? "s" : ""} avant l'exonération totale des prélèvements sociaux (30 ans de détention).`,
    });
  }
  if (impactFraisTravaux > 0) {
    callouts.push({
      variant: "info",
      title: "Impact des frais et travaux",
      text: `Les frais et travaux réduisent la plus-value brute de ${formatCurrency(impactFraisTravaux)}${economieFiscale > 0 ? ` et l'économie fiscale estimée est de ${formatCurrency(economieFiscale)}` : ""}.`,
    });
  }

  return mergeResult(result, {
    primary: { label: "Plus-value brute", value: formatCurrency(plusValueBrute) },
    narrative,
    interpretation: plusValueInterpretation(plusValueBrute, impotTotal),
    advice: plusValueAdvice(input, anneesRestantesIR, anneesRestantesPS, annees),
    lines: computed.lines.filter((line) => !line.highlight),
    callouts,
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

