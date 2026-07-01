/**
 * Association slug → modules réglementaires (src/data/regulations/).
 * Centralisé pour éviter de modifier 100+ fichiers simulateur.
 *
 * Règle : n'associer une source que si le simulateur s'appuie sur un barème,
 * seuil ou texte officiel (pas pour les outils purement mathématiques).
 */
export const SIMULATOR_REGULATION_IDS: Record<string, string[]> = {
  // — Immobilier / crédit / location (barèmes HCSF, notaire, législation locative)
  "capacite-emprunt": ["immobilier"],
  "mensualite-pret-immobilier": ["immobilier"],
  "frais-de-notaire": ["immobilier"],
  "taux-endettement": ["immobilier"],
  "cout-total-credit-immobilier": ["immobilier"],
  "remboursement-anticipe": ["immobilier"],
  "pret-taux-zero-ptz": ["ptz"],
  "assurance-emprunteur": ["immobilier"],
  "revision-loyer-irl": ["immobilier"],
  "encadrement-loyers": ["immobilier"],
  "depot-garantie-locatif": ["immobilier"],
  "charges-recuperables-locataire": ["immobilier"],
  "revision-loyer-commercial": ["immobilier"],
  "loyer-charges-comprises": ["immobilier"],

  // — Fiscalité immobilière
  "rendement-locatif": ["fiscalite"],
  "plus-value-immobiliere": ["fiscalite"],
  "rentabilite-lmnp": ["fiscalite"],
  "impot-revenus-fonciers": ["fiscalite", "impot"],
  "taxe-fonciere": ["fiscalite"],
  "deficit-foncier": ["fiscalite", "impot"],
  "donation-succession-immobiliere": ["donation"],
  "location-meublee-vs-nue": ["fiscalite"],
  "ifi-impot-fortune-immobiliere": ["ifi"],

  // — Finance (produits réglementés ou barèmes fiscaux)
  "simulateur-retraite": ["retraite"],
  "rendement-livret-a": ["retraite"],
  "rendement-pea": ["fiscalite"],
  "frais-kilometriques": ["fiscalite"],

  // — Emploi / cotisations / SMIC
  "salaire-brut-net": ["urssaf", "smic"],
  "salaire-net-brut": ["urssaf", "smic"],
  "cout-total-embauche-salarie": ["urssaf"],
  "indemnites-licenciement": ["urssaf", "smic"],
  "conges-payes-acquis": ["urssaf", "smic"],
  "ijss-arret-maladie": ["urssaf", "smic"],
  "allocation-chomage-are": ["urssaf", "smic"],
  "heures-supplementaires": ["urssaf", "smic"],
  "salaire-temps-partiel": ["urssaf", "smic"],
  "smic-net": ["smic", "urssaf"],

  // — Entreprise / indépendants
  "revenu-net-independant": ["urssaf", "fiscalite"],
  "sasu-remuneration-dividendes": ["fiscalite", "impot"],
  "portage-salarial-vs-freelance": ["urssaf"],
  "seuil-franchise-tva": ["fiscalite"],
  "cout-horaire-charge-tns": ["urssaf"],
  "exoneration-acre": ["urssaf"],
  "facturation-objectif-revenu-net": ["urssaf", "fiscalite"],

  // — Fiscalité générale
  "impot-sur-le-revenu": ["impot"],
  "quotient-familial": ["impot"],
  "prelevement-a-la-source": ["impot"],
  "flat-tax-30-pourcent": ["fiscalite"],
  "micro-entrepreneur-charges": ["urssaf", "fiscalite"],
  "credit-impot-emploi-domicile": ["fiscalite"],
  "impot-dividendes": ["fiscalite", "impot"],
  "taux-marginal-imposition": ["impot"],
  "donation-numeraire": ["donation"],
  "cesu-credit-impot": ["fiscalite"],

  // — Travaux (aide publique à barème officiel)
  "maprimerenov": ["immobilier"],
};

export function getSimulatorRegulationIds(slug: string): string[] | undefined {
  return SIMULATOR_REGULATION_IDS[slug];
}
