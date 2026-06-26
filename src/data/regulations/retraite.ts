import type { RegulationModule } from "./types";

export const RETRAITE_REGULATION: RegulationModule = {
  meta: {
    id: "retraite",
    label: "Épargne retraite et produits réglementés",
    lastUpdated: "2025-01-01",
    referencePeriod: "2025",
    sources: [
      { name: "Service-Public.fr — Retraite", url: "https://www.service-public.fr/particuliers/vosdroits/N381" },
      { name: "info-retraite.fr", url: "https://www.info-retraite.fr" },
      { name: "AMF", url: "https://www.amf-france.org" },
    ],
  },
};

export const RETRAITE_TAUX_RETRAIT_DURABLE = 0.04;
export const LIVRET_A_PLAFOND = 22_950;
export const LDDS_PLAFOND = 12_950;
export const PEA_PLAFOND_VERSEMENTS = 150_000;

/** ASPA / minimum vieillesse — montant mensuel plein personne seule (€). */
export const ASPA_MONTANT_PLEIN_ISOLE = 1012.02;

/** ASPA — montant mensuel couple (€). */
export const ASPA_MONTANT_PLEIN_COUPLE = 1573.98;

/** ASPA — taux de prise en compte des revenus du foyer. */
export const ASPA_TAUX_RESSOURCES = 0.5;
