import type {
  ResultAdvice,
  ResultInterpretation,
  SimulatorResult,
} from "../../../types";
import { SLUG_ENRICHERS } from "./slugs";
import { getSlugDomain } from "./slug-domains";

type EnricherInput = Record<string, number | string>;

/**
 * Filet de sécurité uniquement — tous les simulateurs ont un enrichisseur dédié.
 * N'ajoute rien si l'enrichisseur slug a déjà fourni interprétation et conseils.
 */
export function applyHeuristicEnrichment(
  slug: string,
  _input: EnricherInput,
  result: SimulatorResult
): SimulatorResult {
  if (SLUG_ENRICHERS[slug] && result.interpretation) {
    return result;
  }

  const domain = getSlugDomain(slug);
  let interpretation = result.interpretation;
  let advice = result.advice;

  if (!interpretation) {
    interpretation = inferFromSummary(result.summary.toLowerCase(), result);
  }

  if (!interpretation && domain === "finance") {
    interpretation = {
      level: "neutral",
      title: "Simulation réalisée",
      message:
        "Comparez ce scénario avec d'autres durées, montants ou taux si besoin.",
    };
  }

  if (!advice && interpretation?.level === "warning") {
    advice = genericAdviceForDomain(domain);
  }

  if (!advice && interpretation?.level === "intermediate") {
    advice = genericAdviceForDomain(domain);
  }

  return {
    ...result,
    interpretation: interpretation ?? undefined,
    advice,
  };
}

function inferFromSummary(
  summary: string,
  result: SimulatorResult
): ResultInterpretation | undefined {
  if (
    summary.includes("dépass") ||
    summary.includes("au-dessus") ||
    summary.includes("refus") ||
    summary.includes("risque")
  ) {
    return {
      level: "warning",
      badge: "Attention",
      title: "Situation à améliorer",
      message: result.summary,
    };
  }
  if (
    summary.includes("favorable") ||
    summary.includes("conforme") ||
    summary.includes("sous le seuil") ||
    summary.includes("dans la limite")
  ) {
    return {
      level: "favorable",
      badge: "Conforme",
      title: "Situation favorable",
      message: result.summary,
    };
  }
  if (summary.includes("intermédiaire") || summary.includes("proche")) {
    return {
      level: "intermediate",
      badge: "À surveiller",
      title: "Situation intermédiaire",
      message: result.summary,
    };
  }

  return undefined;
}

function genericAdviceForDomain(
  domain: string
): ResultAdvice | undefined {
  const map: Record<string, ResultAdvice> = {
    immobilier: {
      title: "Pistes d'optimisation",
      items: [
        "Ajuster l'apport ou la durée du crédit",
        "Comparer plusieurs banques et assurances",
        "Intégrer tous les frais (notaire, agence, travaux)",
      ],
    },
    finance: {
      title: "Conseils",
      items: [
        "Tester plusieurs scénarios de durée ou de taux",
        "Vérifier les frais bancaires et d'assurance",
        "Conserver une épargne de précaution",
      ],
    },
    fiscalite: {
      title: "Conseils",
      items: [
        "Vérifier les barèmes en vigueur sur impots.gouv.fr",
        "Conserver vos justificatifs et factures",
        "Faire valider par un expert-comptable si montants importants",
      ],
    },
    emploi: {
      title: "Conseils",
      items: [
        "Comparez avec votre bulletin de paie officiel",
        "Intégrez prélèvement à la source et avantages",
        "Consultez votre service RH pour le détail des cotisations",
      ],
    },
    entreprise: {
      title: "Conseils",
      items: [
        "Affinez le taux de charges selon votre statut réel",
        "Comparez micro-entreprise, portage et société",
        "Faire valider par un expert-comptable avant décision",
      ],
    },
    travaux: {
      title: "Conseils pratiques",
      items: [
        "Prévoir 10 à 15 % de marge pour chutes et casse",
        "Vérifier les références produit avant commande",
        "Demander plusieurs devis à des artisans qualifiés",
      ],
    },
    sante: {
      title: "À retenir",
      items: [
        "Ces résultats sont indicatifs — consultez un professionnel si besoin",
        "Adaptez selon votre activité et votre état de santé",
        "Un suivi médical reste la référence",
      ],
    },
    quotidien: {
      title: "Conseil",
      items: [
        "Revérifiez les montants saisis avant de décider",
        "Arrondissez prudemment pour les calculs du quotidien",
      ],
    },
  };
  return map[domain];
}
