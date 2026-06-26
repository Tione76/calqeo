/**
 * Feuille de route publication — brouillons actifs uniquement (A / B / C).
 * Les priorité D sont archivés dans ./slugs.ts
 */
export const DRAFT_PRIORITY_A: readonly string[] = [
  // Aides sociales
  "simulateur-rsa",
  "simulateur-prime-activite",
  "simulateur-apl",
  "simulateur-aah",
  // Immobilier
  "simulateur-denormandie",
  "simulateur-bareme-plus-value-immobiliere",
  "simulateur-loyer-max-hcsf",
  // Finance
  "simulateur-livret-epargne-populaire",
  "simulateur-per-retraite",
  // Fiscalité
  "simulateur-taxation-crypto-france",
  "simulateur-impot-societes",
  "simulateur-micro-bic-plafond",
  "simulateur-micro-bnc-plafond",
  "simulateur-reduction-impot-dons",
  // Travaux
  "simulateur-isolation-combles",
  "simulateur-pompe-chaleur-air-eau",
  "simulateur-renovation-energetique-globale",
  "simulateur-dpe-apres-travaux",
  // Emploi
  "simulateur-rupture-conventionnelle",
  // Entreprise
  "simulateur-auto-entrepreneur-plafond",
  "simulateur-tjm-portage-salarial",
];

export const DRAFT_PRIORITY_B: readonly string[] = [
  // Aides sociales
  "simulateur-allocation-rentree-scolaire",
  "simulateur-cheque-energie",
  "simulateur-aide-garde-enfant",
  "simulateur-bourse-crous",
  "simulateur-aide-logement-etudiant",
  "simulateur-aspa",
  "simulateur-allocation-familiale",
  "simulateur-chomage-partiel-indemnisation",
  "simulateur-reversion-retraite",
  "simulateur-droit-chomage-duree",
  // Immobilier
  "simulateur-apport-personnel-minimum",
  "simulateur-investissement-locatif-neuf",
  "simulateur-scpi-rendement-net",
  "simulateur-vacance-locative",
  "simulateur-rentabilite-residence-secondaire",
  // Finance
  "simulateur-plan-epargne-logement",
  "simulateur-assurance-vie-rachat",
  "simulateur-credit-renouvelable",
  "simulateur-pret-etudiant",
  "simulateur-taux-endettement-pret-conso",
  // Emploi
  "simulateur-preavis-demission",
  "simulateur-preavis-licenciement",
  "simulateur-prime-precarite-cdd",
  "simulateur-transport-domicile-travail",
  "simulateur-prime-activite-salarie",
  // Entreprise
  "simulateur-eurl-is",
  "simulateur-sarl-dividendes",
  "simulateur-amortissement-lineaire",
  "simulateur-charge-sociale-patronale-detail",
  "simulateur-division-optimale-remuneration",
  // Fiscalité
  "simulateur-tva-deductible",
  "simulateur-tvs-vehicule",
  "simulateur-donation-partage",
  "simulateur-impot-plus-value-mobilier",
  "simulateur-prelevements-sociaux-revenus",
  "simulateur-frais-reels-vs-deductible",
  // Travaux
  "simulateur-fenetres-double-vitrage",
  "simulateur-chaudiere-gaz-condensation",
  "simulateur-panneaux-solaires-autoconsommation",
  "simulateur-eco-ptz-travaux",
  "simulateur-aide-anah-habiter-mieux",
  // Santé
  "simulateur-poids-grossesse",
  "simulateur-besoin-calorique-sport",
  "simulateur-dose-paracetamol-poids",
  // Quotidien
  "simulateur-partage-loyer-colocation",
];

export const DRAFT_PRIORITY_C: readonly string[] = [
  // Aides sociales
  "simulateur-complement-familial",
  "simulateur-prime-naissance",
  "simulateur-apl-colocation",
  "simulateur-aah-complement",
  "simulateur-als",
  "simulateur-fsl",
  "simulateur-aide-perisco",
  "simulateur-aide-exceptionnelle-energie",
  // Immobilier
  "simulateur-credit-in-fine",
  "simulateur-malraux",
  "simulateur-bail-commercial-3-6-9",
  "simulateur-honoraires-gestion-locative",
  "simulateur-assurance-ppd",
  "simulateur-frais-copropriete-budget",
  "simulateur-taxe-habitation-locataire",
  "simulateur-credit-relais-duree",
  // Finance
  "simulateur-compte-epargne-temps",
  "simulateur-perco-entreprise",
  "simulateur-capital-deces",
  "simulateur-rente-viagere",
  "simulateur-dca-investissement",
  "simulateur-allocation-vie",
  "simulateur-objectif-epargne",
  "simulateur-rendement-obligation",
  "simulateur-capacite-epargne-mensuelle",
  // Emploi
  "simulateur-tickets-restaurant",
  "simulateur-cheques-vacances",
  "simulateur-forfait-jours",
  "simulateur-temps-partiel-droit",
  "simulateur-prime-exceptionnelle-net",
  "simulateur-cout-chomage-employeur",
  // Entreprise
  "simulateur-holding-fiscalite",
  "simulateur-tva-intracommunautaire",
  "simulateur-cvae",
  "simulateur-cfe",
  "simulateur-amortissement-degressif",
  "simulateur-provision-conges",
  "simulateur-zfu-crea",
  "simulateur-jei-fiscalite",
  "simulateur-icpe-entreprise",
  "simulateur-bilan-simplifie",
  // Fiscalité
  "simulateur-ifi-abattement-duree",
  "simulateur-nue-propriete-usufruit",
  "simulateur-impot-revenu-fonctionnaire",
  "simulateur-impot-locaux-professionnels",
  "simulateur-impot-minimum",
  "simulateur-avantage-nature-vehicule",
  "simulateur-impot-expatriation",
  "simulateur-defiscalisation-pinel",
  // Santé
  "simulateur-apport-fibre",
  "simulateur-allaitement-calories",
  "simulateur-marche-quotidienne",
  // Quotidien
  "simulateur-cout-kilometrique-voiture",
  "simulateur-calcul-eco-trajet",
];

export type DraftPriority = "A" | "B" | "C";

export function getDraftPriority(slug: string): DraftPriority | undefined {
  if (DRAFT_PRIORITY_A.includes(slug)) return "A";
  if (DRAFT_PRIORITY_B.includes(slug)) return "B";
  if (DRAFT_PRIORITY_C.includes(slug)) return "C";
  return undefined;
}
