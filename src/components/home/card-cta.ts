/**
 * Libellé d'action contextuel pour les cartes homepage (desktop).
 * Reste des verbes courts et cohérents avec l'intention de l'outil.
 */
export function getHomeCardCta(slug: string, title: string): string {
  const text = `${slug} ${title}`.toLowerCase();

  if (/compar|vs-|versus|contre/.test(text)) return "Comparer";
  if (/estim|budget|frais|cout|coût|prix|volume|quantit|surface|maprimerenov|consommation/.test(text))
    return "Estimer";
  if (
    /simul|calcul|capacite|capacité|mensualite|mensualité|rendement|cash-flow|taux|impot|impôt|salaire|imc|tva|pourcentage/.test(
      text
    )
  )
    return "Calculer";
  if (/convert|evolution|partage|regle|règle|age|âge|ovulation|date/.test(text)) return "Tester";

  return "Commencer";
}
