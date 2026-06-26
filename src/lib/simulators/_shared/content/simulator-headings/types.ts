export interface SimulatorHeadings {
  mainSection: string;
  definition: string;
  objectif: string;
  variables: string;
  formules: string;
  interpretation: string;
  limitesCalcul: string;
  maillage: string;
  exempleSection: string;
  exempleDonnees: string;
  exempleCalcul: string;
  exempleResultat: string;
  exempleInterpretation: string;
  conseilsSection: string;
  conseils: string;
  limites: string;
}

export const GENERIC_HEADINGS: SimulatorHeadings = {
  mainSection: "Comment fonctionne ce calcul ?",
  definition: "Définition",
  objectif: "Objectif du simulateur",
  variables: "Variables prises en compte",
  formules: "Formule(s) utilisée(s)",
  interpretation: "Interprétation du résultat",
  limitesCalcul: "Limites du calcul",
  maillage: "Simulateurs complémentaires",
  exempleSection: "Exemple concret",
  exempleDonnees: "Données saisies",
  exempleCalcul: "Calcul effectué",
  exempleResultat: "Résultat obtenu",
  exempleInterpretation: "Interprétation",
  conseilsSection: "Conseils et limites",
  conseils: "Conseils pratiques",
  limites: "Limites du simulateur",
};
