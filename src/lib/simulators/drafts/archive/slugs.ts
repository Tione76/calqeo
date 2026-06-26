/**
 * Brouillons archivés (priorité D) — hors bibliothèque active.
 * Conservés pour réutilisation éventuelle.
 */
export const ARCHIVED_DRAFT_SLUGS: ReadonlySet<string> = new Set([
  // Aides sociales (6)
  "simulateur-minimum-vieillesse",
  "simulateur-revenu-solidarite-active-couple",
  "simulateur-prime-activite-couple",
  "simulateur-aide-jeune-enfant",
  "simulateur-alf",
  "simulateur-aide-mobilite",
  // Immobilier (6)
  "simulateur-pret-10-ans",
  "simulateur-pret-15-ans",
  "simulateur-pret-20-ans",
  "simulateur-pret-25-ans",
  "simulateur-monument-historique",
  "simulateur-indice-irl-loyer",
  // Finance (4)
  "simulateur-capitalisation-retraite",
  "simulateur-frais-banque-annuels",
  "simulateur-budget-50-30-20",
  "simulateur-inflation-pouvoir-achat",
  // Emploi (6)
  "simulateur-contrat-probatoire-indemnites",
  "simulateur-mutuelle-entreprise",
  "simulateur-prevoyance-salarie",
  "simulateur-retraite-complementaire-agirc",
  "simulateur-conges-parental",
  "simulateur-conges-sabbatiques",
  // Entreprise (1)
  "simulateur-creance-covid-entreprise",
  // Fiscalité (1)
  "simulateur-defiscalisation-denormandie",
  // Travaux (7)
  "simulateur-surface-mur-peinture",
  "simulateur-quantite-enduit",
  "simulateur-dalle-beton-arme",
  "simulateur-escalier-dimension",
  "simulateur-cloison-placo",
  "simulateur-toiture-surface",
  "simulateur-gouttiere-longueur",
  // Santé (6)
  "simulateur-imc-enfant",
  "simulateur-imc-senior",
  "simulateur-imc-adolescent",
  "simulateur-sommeil-cycles-enfant",
  "simulateur-frequence-cardiaque-max",
  "simulateur-tension-arterielle",
  // Quotidien (11)
  "simulateur-pourcentage-augmentation-salaire",
  "simulateur-remise-commerciale",
  "simulateur-partage-note-restaurant",
  "simulateur-conversion-unites-cuisine",
  "simulateur-calcul-date",
  "simulateur-jours-entre-deux-dates",
  "simulateur-moyenne-notes",
  "simulateur-conversion-metre-pied",
  "simulateur-conversion-litre-gallon",
  "simulateur-conversion-temperature",
  "simulateur-budget-courses-famille",
]);

export function isArchivedDraftSlug(slug: string): boolean {
  return ARCHIVED_DRAFT_SLUGS.has(slug);
}

export const ARCHIVED_DRAFT_COUNT = ARCHIVED_DRAFT_SLUGS.size;
