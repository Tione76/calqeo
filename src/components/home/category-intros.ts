import type { SiteDomain } from "@/lib/simulators/types";

/** Phrase d'introduction par univers — homepage desktop, sous les sous-catégories. */
export const HOME_CATEGORY_INTROS: Record<SiteDomain, string> = {
  immobilier:
    "Comparez vos projets, estimez votre budget et prenez vos décisions immobilières en toute confiance.",
  finance:
    "Pilotez votre budget, vos crédits et votre épargne avec des estimations fiables.",
  emploi:
    "Comprenez votre rémunération et estimez rapidement votre salaire ou votre coût d'embauche.",
  entreprise:
    "Anticipez vos revenus, vos charges et le développement de votre activité.",
  fiscalite:
    "Estimez vos impôts et comprenez simplement les principaux calculs fiscaux.",
  travaux:
    "Préparez vos travaux, estimez vos coûts et comparez plusieurs scénarios.",
  sante:
    "Obtenez rapidement des estimations utiles pour votre santé et votre bien-être.",
  quotidien:
    "Retrouvez les calculs pratiques du quotidien en quelques secondes.",
  "aides-sociales":
    "Retrouvez les calculs pratiques du quotidien en quelques secondes.",
};
