import type { SimulatorDefinition } from "../types";

/** Idées écartées lors de la curation SEO (doublon, faible volume, incohérence). */
export interface RejectedDraftIdea {
  slug: string;
  title: string;
  category: string;
  reason: string;
}

/**
 * Catalogue des idées rejetées — traçabilité pour le rapport et futures revues.
 * Mis à jour lors de l'ajout de nouveaux brouillons.
 */
export const REJECTED_DRAFT_IDEAS: RejectedDraftIdea[] = [
  {
    slug: "simulateur-caf-global",
    title: "Simulateur CAF global",
    category: "Aides sociales",
    reason: "Doublon avec les simulateurs dédiés RSA, APL, prime d'activité et allocations.",
  },
  {
    slug: "montant-smic-brut",
    title: "Montant SMIC brut",
    category: "Emploi & salaire",
    reason: "Doublon du simulateur publié smic-net et contenu statique peu recherché.",
  },
  {
    slug: "calcul-impot-locatif-simplifie",
    title: "Calcul impôt locatif simplifié",
    category: "Immobilier",
    reason: "Doublon de impot-revenus-fonciers et rentabilite-lmnp déjà publiés.",
  },
  {
    slug: "aide-logement-etudiant-generique",
    title: "Aide logement étudiant générique",
    category: "Aides sociales",
    reason: "Trop vague — remplacé par simulateurs APL étudiant et bourse CROUS dédiés.",
  },
  {
    slug: "prime-noel",
    title: "Prime de Noël",
    category: "Aides sociales",
    reason: "Prestation ponctuelle, faible volume de recherche hors saison.",
  },
  {
    slug: "allocation-adulte-handicape-simplifiee",
    title: "AAH simplifiée sans ressources",
    category: "Aides sociales",
    reason: "Doublon partiel — couvert par simulateur-aah avec critères ressources.",
  },
  {
    slug: "credit-impot-transition-energetique",
    title: "Crédit d'impôt transition énergétique",
    category: "Travaux & habitat",
    reason: "Dispositif CITE remplacé par MaPrimeRénov' — simulateur maprimerenov déjà publié.",
  },
  {
    slug: "calcul-tva-intra-ue",
    title: "Calcul TVA intra-UE",
    category: "Entreprises",
    reason: "Niche B2B, faible intention de recherche grand public sur Calqeo.",
  },
  {
    slug: "simulation-retraite-agirc-arrco-detaillee",
    title: "Simulation retraite Agirc-Arrco détaillée",
    category: "Finance personnelle",
    reason: "Doublon fonctionnel avec simulateur-retraite — détail nécessite info-retraite.fr.",
  },
  {
    slug: "aide-menage-domicile",
    title: "Aide ménage à domicile",
    category: "Aides sociales",
    reason: "Chevauche crédit-impot-emploi-domicile déjà publié.",
  },
  {
    slug: "calcul-jours-feries",
    title: "Calcul jours fériés",
    category: "Calculs du quotidien",
    reason: "Faible volume SEO, contenu calendaire statique.",
  },
  {
    slug: "prime-activite-sans-revenus",
    title: "Prime d'activité sans revenus",
    category: "Aides sociales",
    reason: "Cas marginal — prime d'activité exige des revenus d'activité.",
  },
];

export function getRejectedDraftCount(): number {
  return REJECTED_DRAFT_IDEAS.length;
}

export function getDraftLibraryStats(drafts: SimulatorDefinition[]) {
  const byDomain = drafts.reduce<Record<string, number>>((acc, d) => {
    const domain = d.domain ?? "immobilier";
    acc[domain] = (acc[domain] ?? 0) + 1;
    return acc;
  }, {});
  return { total: drafts.length, byDomain };
}
