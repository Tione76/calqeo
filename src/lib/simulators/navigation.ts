import { simulators, type RegisteredSimulator } from "./index";
import {
  DOMAIN_ANCHORS,
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  getSimulatorDomain,
  type SiteDomain,
} from "./types";

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

export interface DomainNavGroup {
  domain: SiteDomain;
  label: string;
  anchor: string;
  count: number;
  featured: RegisteredSimulator[];
  all: RegisteredSimulator[];
}

export function getDomainNavGroups(): DomainNavGroup[] {
  return DOMAIN_ORDER.map((domain) => {
    const all = simulators.filter((s) => getSimulatorDomain(s) === domain);
    const featured = FEATURED_SLUGS[domain]
      .map((slug) => simulators.find((s) => s.slug === slug))
      .filter((s): s is RegisteredSimulator => !!s);

    return {
      domain,
      label: DOMAIN_LABELS[domain],
      anchor: DOMAIN_ANCHORS[domain],
      count: all.length,
      featured: featured.length > 0 ? featured : all.slice(0, 4),
      all,
    };
  });
}

export function getSimulatorsGroupedByDomain(): DomainNavGroup[] {
  return getDomainNavGroups();
}

/** @deprecated Utiliser getDomainNavGroups */
export function getCategoryNavGroups() {
  return getDomainNavGroups();
}

export function getSimulatorsGroupedByCategory() {
  return getSimulatorsGroupedByDomain();
}
