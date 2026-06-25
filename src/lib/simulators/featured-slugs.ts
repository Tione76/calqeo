import type { SiteDomain } from "./types";

/** Slugs mis en avant par domaine dans la navigation et le footer. */
export const FEATURED_SLUGS: Record<SiteDomain, string[]> = {
  immobilier: [
    "capacite-emprunt",
    "mensualite-pret-immobilier",
    "rendement-locatif",
    "impot-revenus-fonciers",
  ],
  finance: [
    "mensualite-credit-consommation",
    "interets-composes",
    "simulateur-retraite",
    "budget-reste-a-vivre",
  ],
  emploi: [
    "salaire-brut-net",
    "salaire-net-brut",
    "cout-total-embauche-salarie",
    "indemnites-licenciement",
  ],
  entreprise: [
    "calculateur-tjm-freelance",
    "revenu-net-independant",
    "sasu-remuneration-dividendes",
    "break-even-entreprise",
  ],
  fiscalite: [
    "impot-sur-le-revenu",
    "micro-entrepreneur-charges",
    "flat-tax-30-pourcent",
    "quotient-familial",
  ],
  travaux: [
    "quantite-peinture",
    "calcul-carrelage",
    "maprimerenov",
    "volume-surface-piece",
  ],
  sante: [
    "calculateur-imc",
    "calories-journalieres",
    "date-accouchement",
    "poids-ideal",
  ],
  quotidien: [
    "calculateur-tva",
    "calculateur-pourcentage",
    "regle-de-trois",
    "calculateur-age",
  ],
};
