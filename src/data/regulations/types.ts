/**
 * Métadonnées des jeux de données réglementaires centralisés — Calqeo.
 * Chaque module exporte REGULATION_META + constantes métier.
 */

export interface RegulationSource {
  /** Nom de l'organisme (CAF, URSSAF, impots.gouv.fr…) */
  name: string;
  /** URL de la page ou du barème officiel */
  url: string;
}

/** Préparation future : API / Open Data */
export interface RegulationOpenData {
  available: boolean;
  /** URL du jeu de données ou de l'API si connu */
  endpoint?: string;
  notes?: string;
}

export interface RegulationMeta {
  /** Identifiant stable référencé par les simulateurs (ex. "impot", "rsa") */
  id: string;
  label: string;
  /** Date ISO de dernière mise à jour des constantes dans Calqeo */
  lastUpdated: string;
  /** Date ISO d'entrée en vigueur officielle du barème (si différente) */
  effectiveFrom?: string;
  /** Année ou période de référence affichée (ex. "2025") */
  referencePeriod: string;
  sources: RegulationSource[];
  openData?: RegulationOpenData;
}

export interface RegulationModule {
  meta: RegulationMeta;
}

/** Données agrégées pour l'encadré « sources officielles » des simulateurs. */
export interface RegulatoryNotice {
  lastUpdated: string;
  effectiveFromDates: string[];
  sources: RegulationSource[];
  referencePeriods: string[];
}
