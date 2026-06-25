import type { SimulatorDefinition } from "../../types";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const calculateurTva: SimulatorDefinition = {
  slug: "calculateur-tva",
  title: "Calculateur TVA",
  shortDescription:
    "Calculez le montant HT, TTC ou la TVA selon le taux applicable.",
  metaTitle: "Calculateur TVA — HT, TTC et montant TVA",
  metaDescription:
    "Calculez la TVA, le prix HT ou TTC selon le taux : 20 %, 10 %, 5,5 % ou 2,1 %.",
  keywords: ["calculateur TVA", "HT TTC", "montant TVA"],
  domain: "quotidien",
  category: "conversion",
  icon: "calculator",
  relatedSlugs: ["calculateur-pourcentage", "partage-facture", "calculateur-pourboire"],
  formFields: [
    { key: "montant", label: "Montant", type: "number", min: 0, step: 0.01, suffix: "€" },
    {
      key: "taux",
      label: "Taux TVA",
      type: "select",
      options: [
        { value: "20", label: "20 % (normal)" },
        { value: "10", label: "10 % (intermédiaire)" },
        { value: "5.5", label: "5,5 % (réduit)" },
        { value: "2.1", label: "2,1 % (super réduit)" },
      ],
    },
    {
      key: "mode",
      label: "Montant saisi",
      type: "select",
      options: [
        { value: "ht", label: "Prix HT" },
        { value: "ttc", label: "Prix TTC" },
      ],
    },
  ],
  defaultValues: { montant: 100, taux: "20", mode: "ht" },
  content: buildContent({
    intro: "La TVA est un impôt indirect sur la consommation, appliqué à la majorité des produits et services.",
    howItWorks: [
      {
        title: "Formules",
        blocks: [
          p("TTC = HT × (1 + Taux). TVA = HT × Taux. HT = TTC / (1 + Taux)."),
          hl("Taux France", "20 % normal, 10 % restauration/hébergement, 5,5 % alimentation, 2,1 % médicaments."),
        ],
      },
    ],
    example: { title: "100 € HT à 20 %", blocks: [p("TVA : 20 € — TTC : 120 €.")] },
    conseils: ["Vérifiez le taux sur la facture.", "Auto-entrepreneurs : franchise en base si CA faible.", "Export hors UE : TVA non applicable."],
    limites: ["Taux France métropolitaine.", "Cas particuliers (DOM, intracommunautaire) non couverts."],
  }),
  faq: buildFaq([
    { question: "Taux TVA 20 % ?", answer: "Taux normal pour la majorité des produits et services." },
    { question: "TVA 10 % ?", answer: "Restauration, transport, hébergement, travaux rénovation (sous conditions)." },
    { question: "TVA 5,5 % ?", answer: "Alimentation, livres, énergie, accessoires handicapés." },
    { question: "Auto-entrepreneur et TVA ?", answer: "Franchise en base si CA < seuils (36 800 € services, 91 900 € vente)." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const taux = num(input.taux) / 100;
    const ht = String(input.mode) === "ttc" ? montant / (1 + taux) : montant;
    const tva = ht * taux;
    const ttc = ht + tva;
    return {
      summary: `HT : ${formatCurrency(ht, 2)} — TVA : ${formatCurrency(tva, 2)} — TTC : ${formatCurrency(ttc, 2)}.`,
      lines: [
        { label: "Prix TTC", value: formatCurrency(ttc, 2), highlight: true },
        { label: "Montant TVA", value: formatCurrency(tva, 2), highlight: true },
        { label: "Prix HT", value: formatCurrency(ht, 2) },
        { label: "Taux TVA", value: formatPercent(num(input.taux), 1) },
        { label: "Mode saisi", value: String(input.mode) === "ht" ? "HT" : "TTC" },
      ],
    };
  },
};

export const calculateurPourcentage: SimulatorDefinition = {
  slug: "calculateur-pourcentage",
  title: "Calculateur pourcentage",
  shortDescription:
    "Calculez un pourcentage, une augmentation ou une réduction en pourcentage.",
  metaTitle: "Calculateur pourcentage — % d'un nombre",
  metaDescription:
    "Calculez X % d'un nombre, l'augmentation ou la réduction en pourcentage entre deux valeurs.",
  keywords: ["calculateur pourcentage", "% calcul", "pourcentage"],
  domain: "quotidien",
  category: "pratique",
  icon: "percent",
  relatedSlugs: ["evolution-pourcentage", "regle-de-trois", "calculateur-tva"],
  formFields: [
    { key: "valeur", label: "Valeur de base", type: "number", min: 0, step: 1, suffix: "" },
    { key: "pourcentage", label: "Pourcentage", type: "number", min: -100, max: 1000, step: 0.1, suffix: "%" },
    {
      key: "operation",
      label: "Opération",
      type: "select",
      options: [
        { value: "de", label: "X % de la valeur" },
        { value: "plus", label: "Valeur + X %" },
        { value: "moins", label: "Valeur − X %" },
      ],
    },
  ],
  defaultValues: { valeur: 200, pourcentage: 15, operation: "de" },
  content: buildContent({
    intro: "Le calcul de pourcentage est omniprésent : remises, augmentations, statistiques.",
    howItWorks: [
      {
        title: "Formules",
        blocks: [
          p("X % de V = V × X/100. V + X % = V × (1 + X/100). V − X % = V × (1 − X/100)."),
          hl("Astuce", "Pour 10 % : divisez par 10. Pour 50 % : divisez par 2."),
        ],
      },
    ],
    example: { title: "15 % de 200", blocks: [p("Résultat : 30.")] },
    conseils: ["Vérifiez si le % s'applique sur HT ou TTC.", "Remise puis remise : cumul multiplicatif, pas additif."],
    limites: ["Calcul simple — pas de cumul de remises multiples."],
  }),
  faq: buildFaq([
    { question: "Comment calculer X % ?", answer: "Multipliez la valeur par X et divisez par 100." },
    { question: "Augmentation de 10 % ?", answer: "Nouvelle valeur = Ancienne × 1,10." },
    { question: "Réduction 20 % puis 10 % ?", answer: "Prix final = Prix × 0,80 × 0,90 = × 0,72 (28 % de réduction totale)." },
    { question: "Pourcentage entre deux valeurs ?", answer: "Utilisez le simulateur évolution pourcentage." },
  ]),
  calculate(input) {
    const v = num(input.valeur);
    const p = num(input.pourcentage);
    const op = String(input.operation);
    let result = 0;
    if (op === "de") result = v * (p / 100);
    else if (op === "plus") result = v * (1 + p / 100);
    else result = v * (1 - p / 100);
    return {
      summary:
        op === "de"
          ? `${p} % de ${formatNumber(v, 2)} = ${formatNumber(result, 2)}.`
          : `Résultat : ${formatNumber(result, 2)}.`,
      lines: [
        { label: "Résultat", value: formatNumber(result, 2), highlight: true },
        { label: "Valeur de base", value: formatNumber(v, 2) },
        { label: "Pourcentage", value: formatPercent(p, 1) },
        { label: "Opération", value: op === "de" ? "X % de" : op === "plus" ? "+ X %" : "− X %" },
        { label: "Variation", value: formatNumber(result - v, 2) },
      ],
    };
  },
};

export const regleDeTrois: SimulatorDefinition = {
  slug: "regle-de-trois",
  title: "Règle de trois",
  shortDescription:
    "Résolvez une proportion : si A correspond à B, que vaut C ?",
  metaTitle: "Calculateur règle de trois — Proportion",
  metaDescription:
    "Appliquez la règle de trois pour résoudre des problèmes de proportion et de mise à l'échelle.",
  keywords: ["règle de trois", "proportion", "calcul proportionnel"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["calculateur-pourcentage", "evolution-pourcentage", "vitesse-distance-temps"],
  formFields: [
    { key: "a", label: "Valeur A", type: "number", min: 0, step: 0.01, suffix: "" },
    { key: "b", label: "Valeur B (correspond à A)", type: "number", min: 0, step: 0.01, suffix: "" },
    { key: "c", label: "Valeur C (à convertir)", type: "number", min: 0, step: 0.01, suffix: "" },
  ],
  defaultValues: { a: 3, b: 150, c: 7 },
  content: buildContent({
    intro: "La règle de trois permet de trouver une valeur proportionnelle à une autre.",
    howItWorks: [
      {
        title: "Proportion",
        blocks: [
          p("Si A → B, alors C → X. X = (C × B) / A."),
          hl("Exemple", "3 kg → 150 €, alors 7 kg → 350 €."),
        ],
      },
    ],
    example: { title: "3 unités = 150 €, 7 unités ?", blocks: [p("Résultat : 350 €.")] },
    conseils: ["Vérifiez que la relation est proportionnelle.", "Unités homogènes obligatoires."],
    limites: ["Proportion directe uniquement.", "Relations non linéaires non couvertes."],
  }),
  faq: buildFaq([
    { question: "Règle de trois directe ?", answer: "Quand A augmente, B augmente proportionnellement (prix/kg, vitesse)." },
    { question: "Règle de trois inverse ?", answer: "Quand A augmente, B diminue (travailleurs/temps pour un travail)." },
    { question: "Erreur fréquente ?", answer: "Mélanger les unités ou appliquer à des grandeurs non proportionnelles." },
    { question: "Usage quotidien ?", answer: "Recettes, devis, conversions d'unités, recettes de cuisine." },
  ]),
  calculate(input) {
    const a = num(input.a);
    const b = num(input.b);
    const c = num(input.c);
    const x = a > 0 ? (c * b) / a : 0;
    return {
      summary: `Si ${formatNumber(a, 2)} → ${formatNumber(b, 2)}, alors ${formatNumber(c, 2)} → ${formatNumber(x, 2)}.`,
      lines: [
        { label: "Résultat X", value: formatNumber(x, 2), highlight: true },
        { label: "A → B", value: `${formatNumber(a, 2)} → ${formatNumber(b, 2)}` },
        { label: "C → X", value: `${formatNumber(c, 2)} → ${formatNumber(x, 2)}` },
        { label: "Ratio", value: formatNumber(b / (a || 1), 4) },
        { label: "Formule", value: "X = (C × B) / A" },
      ],
    };
  },
};

export const calculateurAge: SimulatorDefinition = {
  slug: "calculateur-age",
  title: "Calculateur d'âge",
  shortDescription:
    "Calculez votre âge exact en années, mois et jours à partir de votre date de naissance.",
  metaTitle: "Calculateur d'âge — Date de naissance",
  metaDescription:
    "Calculez votre âge précis en années, mois et jours ou l'âge à une date donnée.",
  keywords: ["calculateur âge", "âge exact", "date naissance"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["evolution-pourcentage", "convertisseur-heures-minutes", "regle-de-trois"],
  formFields: [
    { key: "jourNaissance", label: "Jour naissance", type: "number", min: 1, max: 31, suffix: "" },
    { key: "moisNaissance", label: "Mois", type: "number", min: 1, max: 12, suffix: "" },
    { key: "anneeNaissance", label: "Année", type: "number", min: 1900, max: 2030, suffix: "" },
    { key: "jourCible", label: "Jour cible (optionnel)", type: "number", min: 1, max: 31, suffix: "" },
    { key: "moisCible", label: "Mois cible", type: "number", min: 1, max: 12, suffix: "" },
    { key: "anneeCible", label: "Année cible", type: "number", min: 1900, max: 2030, suffix: "" },
  ],
  defaultValues: { jourNaissance: 15, moisNaissance: 6, anneeNaissance: 1990, jourCible: 24, moisCible: 6, anneeCible: 2025 },
  content: buildContent({
    intro: "Calculer l'âge exact est utile pour les démarches administratives et les échéances légales.",
    howItWorks: [
      {
        title: "Calcul",
        blocks: [
          p("Âge = différence entre date de naissance et date cible (aujourd'hui ou date spécifiée)."),
          hl("Années bissextiles", "Pris en compte automatiquement."),
        ],
      },
    ],
    example: { title: "Né le 15/06/1990", blocks: [p("Âge au 24/06/2025 : 35 ans, 0 mois, 9 jours.")] },
    conseils: ["Vérifiez les dates pour les démarches officielles.", "Âge légal retraite : consultez l'Assurance retraite."],
    limites: ["Dates valides uniquement.", "Pas de fuseau horaire."],
  }),
  faq: buildFaq([
    { question: "Âge légal retraite ?", answer: "Variable selon année de naissance — consultez l'Assurance retraite." },
    { question: "Majorité ?", answer: "18 ans en France." },
    { question: "Âge et permis ?", answer: "Permis B : 18 ans (17 ans conduite accompagnée)." },
    { question: "Anniversaire bissextile ?", answer: "Né 29 février : anniversaire le 28 février ou 1er mars selon les années." },
  ]),
  calculate(input) {
    const naissance = new Date(
      num(input.anneeNaissance),
      num(input.moisNaissance) - 1,
      num(input.jourNaissance)
    );
    const cible = new Date(
      num(input.anneeCible),
      num(input.moisCible) - 1,
      num(input.jourCible)
    );
    let annees = cible.getFullYear() - naissance.getFullYear();
    let mois = cible.getMonth() - naissance.getMonth();
    let jours = cible.getDate() - naissance.getDate();
    if (jours < 0) {
      mois--;
      const prevMonth = new Date(cible.getFullYear(), cible.getMonth(), 0);
      jours += prevMonth.getDate();
    }
    if (mois < 0) {
      annees--;
      mois += 12;
    }
    const totalJours = Math.floor(
      (cible.getTime() - naissance.getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      summary: `${annees} ans, ${mois} mois et ${jours} jours (${formatNumber(totalJours, 0)} jours).`,
      lines: [
        { label: "Âge", value: `${annees} ans, ${mois} mois, ${jours} jours`, highlight: true },
        { label: "Total jours", value: formatNumber(totalJours, 0), highlight: true },
        { label: "Naissance", value: naissance.toLocaleDateString("fr-FR") },
        { label: "Date cible", value: cible.toLocaleDateString("fr-FR") },
        { label: "Années complètes", value: `${annees}` },
      ],
    };
  },
};

export const calculateurPourboire: SimulatorDefinition = {
  slug: "calculateur-pourboire",
  title: "Calculateur pourboire",
  shortDescription:
    "Calculez le pourboire et le total à payer au restaurant.",
  metaTitle: "Calculateur pourboire — Restaurant",
  metaDescription:
    "Calculez le montant du pourboire et le total à payer selon l'addition et le pourcentage souhaité.",
  keywords: ["pourboire", "tip calculator", "restaurant"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["partage-facture", "calculateur-pourcentage", "calculateur-tva"],
  formFields: [
    { key: "addition", label: "Montant de l'addition", type: "number", min: 0, step: 0.5, suffix: "€" },
    { key: "pourboire", label: "Pourboire", type: "number", min: 0, max: 50, step: 1, suffix: "%" },
    { key: "personnes", label: "Nombre de personnes", type: "number", min: 1, max: 20, suffix: "" },
  ],
  defaultValues: { addition: 85, pourboire: 10, personnes: 2 },
  content: buildContent({
    intro: "Le pourboire est une gratification pour le service, courante dans la restauration.",
    howItWorks: [
      {
        title: "Calcul",
        blocks: [
          p("Pourboire = Addition × Taux. Total = Addition + Pourboire. Par personne = Total / Personnes."),
          hl("France", "Le service est inclus par la loi — le pourboire est un bonus volontaire."),
        ],
      },
    ],
    example: { title: "85 €, 10 %, 2 personnes", blocks: [p("Pourboire 8,50 € — Total 93,50 € — 46,75 €/personne.")] },
    conseils: ["10-15 % est courant pour un bon service.", "Vérifiez si le service est déjà inclus.", "Pourboire en espèces directement au serveur."],
    limites: ["Usages variables selon les pays.", "Service inclus en France (obligatoire)."],
  }),
  faq: buildFaq([
    { question: "Pourboire obligatoire en France ?", answer: "Non — le service est inclus par la loi. Le pourboire est facultatif." },
    { question: "Pourboire standard ?", answer: "5-15 % selon satisfaction, ou arrondir l'addition." },
    { question: "Pourboire et TVA ?", answer: "Le pourboire s'ajoute généralement sur le TTC." },
    { question: "Pourboire carte ou espèces ?", answer: "Espèces souvent préférées par le personnel." },
  ]),
  calculate(input) {
    const addition = num(input.addition);
    const taux = num(input.pourboire) / 100;
    const tip = addition * taux;
    const total = addition + tip;
    const pers = num(input.personnes);
    const parPers = pers > 0 ? total / pers : total;
    return {
      summary: `Total : ${formatCurrency(total, 2)} (pourboire ${formatCurrency(tip, 2)}) — ${formatCurrency(parPers, 2)}/pers.`,
      lines: [
        { label: "Total à payer", value: formatCurrency(total, 2), highlight: true },
        { label: "Pourboire", value: formatCurrency(tip, 2), highlight: true },
        { label: "Par personne", value: formatCurrency(parPers, 2) },
        { label: "Addition", value: formatCurrency(addition, 2) },
        { label: "Taux pourboire", value: formatPercent(num(input.pourboire), 0) },
      ],
    };
  },
};

export const partageFacture: SimulatorDefinition = {
  slug: "partage-facture",
  title: "Partage de facture",
  shortDescription:
    "Divisez une facture entre plusieurs personnes, avec ou sans pourboire.",
  metaTitle: "Calculateur partage facture — Diviser l'addition",
  metaDescription:
    "Partagez une facture entre amis : division égale ou personnalisée avec pourboire inclus.",
  keywords: ["partage facture", "diviser addition", "split bill"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["calculateur-pourboire", "calculateur-tva", "calculateur-pourcentage"],
  formFields: [
    { key: "total", label: "Montant total", type: "number", min: 0, step: 0.5, suffix: "€" },
    { key: "personnes", label: "Nombre de personnes", type: "number", min: 1, max: 30, suffix: "" },
    { key: "pourboire", label: "Pourboire", type: "number", min: 0, max: 30, step: 1, suffix: "%" },
    { key: "payeurExtra", label: "Personnes payant plus (×1,5)", type: "number", min: 0, max: 10, suffix: "" },
  ],
  defaultValues: { total: 120, personnes: 4, pourboire: 10, payeurExtra: 0 },
  content: buildContent({
    intro: "Partager une facture équitablement évite les disputes et simplifie les sorties entre amis.",
    howItWorks: [
      {
        title: "Division",
        blocks: [
          p("Total avec pourboire divisé par personnes. Option : certains paient 1,5× (alcool, plat premium)."),
          hl("Apps", "De nombreuses apps facilitent le partage avec montants personnalisés."),
        ],
      },
    ],
    example: { title: "120 €, 4 personnes, 10 %", blocks: [p("~33 €/personne avec pourboire.")] },
    conseils: ["Décidez avant la fin du repas.", "Les apps de paiement permettent le virement instantané."],
    limites: ["Division simplifiée — montants individuels non détaillés."],
  }),
  faq: buildFaq([
    { question: "Division égale ou personnalisée ?", answer: "Égale si repas similaire. Personnalisée si écarts importants (alcool, plats)." },
    { question: "Pourboire inclus ?", answer: "Ajoutez le pourboire au total avant division." },
    { question: "Apps recommandées ?", answer: "Paylib, Lydia, Splitwise pour partager et suivre." },
    { question: "Un personne paie tout ?", answer: "Les autres remboursent via virement — plus simple qu'espèces." },
  ]),
  calculate(input) {
    const total = num(input.total);
    const pers = num(input.personnes);
    const tip = total * (num(input.pourboire) / 100);
    const avecTip = total + tip;
    const extra = num(input.payeurExtra);
    const basePers = pers - extra;
    const parts = basePers + extra * 1.5;
    const parPart = parts > 0 ? avecTip / parts : avecTip;
    const standard = parPart;
    const extraPay = parPart * 1.5;
    return {
      summary: `${formatCurrency(standard, 2)}/personne (×1,5 : ${formatCurrency(extraPay, 2)}).`,
      lines: [
        { label: "Par personne", value: formatCurrency(standard, 2), highlight: true },
        { label: "Total avec pourboire", value: formatCurrency(avecTip, 2), highlight: true },
        { label: "Payeurs ×1,5", value: formatCurrency(extraPay, 2) },
        { label: "Pourboire", value: formatCurrency(tip, 2) },
        { label: "Personnes", value: `${pers}` },
      ],
    };
  },
};

export const convertisseurDevises: SimulatorDefinition = {
  slug: "convertisseur-devises",
  title: "Convertisseur devises",
  shortDescription:
    "Convertissez un montant entre euros et autres devises selon le taux de change.",
  metaTitle: "Convertisseur devises — EUR USD GBP",
  metaDescription:
    "Convertissez des montants entre euros, dollars, livres sterling et autres devises au taux saisi.",
  keywords: ["convertisseur devises", "taux change", "euro dollar"],
  domain: "quotidien",
  category: "conversion",
  icon: "scale",
  relatedSlugs: ["calculateur-tva", "convertisseur-heures-minutes", "regle-de-trois"],
  formFields: [
    { key: "montant", label: "Montant", type: "number", min: 0, step: 1, suffix: "" },
    {
      key: "deviseSource",
      label: "Devise source",
      type: "select",
      options: [
        { value: "EUR", label: "Euro (EUR)" },
        { value: "USD", label: "Dollar (USD)" },
        { value: "GBP", label: "Livre (GBP)" },
        { value: "CHF", label: "Franc suisse (CHF)" },
      ],
    },
    {
      key: "deviseCible",
      label: "Devise cible",
      type: "select",
      options: [
        { value: "EUR", label: "Euro (EUR)" },
        { value: "USD", label: "Dollar (USD)" },
        { value: "GBP", label: "Livre (GBP)" },
        { value: "CHF", label: "Franc suisse (CHF)" },
      ],
    },
    { key: "taux", label: "Taux (1 EUR = X devise cible)", type: "number", min: 0, step: 0.0001, suffix: "" },
  ],
  defaultValues: { montant: 100, deviseSource: "EUR", deviseCible: "USD", taux: 1.08 },
  content: buildContent({
    intro: "Le convertisseur de devises utilise le taux de change que vous saisissez pour la conversion.",
    howItWorks: [
      {
        title: "Conversion",
        blocks: [
          p("Si source EUR : Résultat = Montant × Taux. Si cible EUR : Résultat = Montant / Taux."),
          hl("Taux", "Consultez votre banque ou xe.com pour le taux du jour."),
        ],
      },
    ],
    example: { title: "100 EUR → USD à 1,08", blocks: [p("108 USD.")] },
    conseils: ["Les banques appliquent une marge sur le taux interbancaire.", "Comparez les frais de change.", "Carte bancaire souvent meilleur que bureau de change."],
    limites: ["Taux saisi manuellement — pas de taux en temps réel.", "Frais bancaires non inclus."],
  }),
  faq: buildFaq([
    { question: "Meilleur taux de change ?", answer: "Carte bancaire internationale ou Wise/Revolut — évitez les aéroports." },
    { question: "Taux interbancaire ?", answer: "Taux entre banques — les particuliers paient une marge." },
    { question: "Change espèces ?", answer: "Bureau de change ou retrait ATM local — comparez les frais." },
    { question: "Euro zone ?", answer: "19 pays utilisent l'euro — pas de conversion nécessaire." },
  ]),
  calculate(input) {
    const montant = num(input.montant);
    const taux = num(input.taux);
    const src = String(input.deviseSource);
    const cible = String(input.deviseCible);
    let result = montant;
    if (src === "EUR" && cible !== "EUR") result = montant * taux;
    else if (src !== "EUR" && cible === "EUR") result = taux > 0 ? montant / taux : 0;
    else if (src !== "EUR" && cible !== "EUR") {
      const enEur = taux > 0 ? montant / taux : 0;
      result = enEur * taux;
    }
    return {
      summary: `${formatNumber(montant, 2)} ${src} = ${formatNumber(result, 2)} ${cible}.`,
      lines: [
        { label: "Résultat", value: `${formatNumber(result, 2)} ${cible}`, highlight: true },
        { label: "Montant source", value: `${formatNumber(montant, 2)} ${src}` },
        { label: "Taux", value: `1 EUR = ${taux} ${cible !== "EUR" ? cible : src}` },
        { label: "Devise source", value: src },
        { label: "Devise cible", value: cible },
      ],
    };
  },
};

export const convertisseurHeuresMinutes: SimulatorDefinition = {
  slug: "convertisseur-heures-minutes",
  title: "Convertisseur heures minutes",
  shortDescription:
    "Convertissez des heures en minutes, minutes en heures ou calculez une durée.",
  metaTitle: "Convertisseur heures minutes — Durée",
  metaDescription:
    "Convertissez heures en minutes, minutes en heures décimales ou calculez la durée entre deux temps.",
  keywords: ["convertisseur heures", "minutes heures", "durée"],
  domain: "quotidien",
  category: "conversion",
  icon: "scale",
  relatedSlugs: ["vitesse-distance-temps", "calculateur-age", "convertisseur-devises"],
  formFields: [
    { key: "heures", label: "Heures", type: "number", min: 0, max: 999, suffix: "h" },
    { key: "minutes", label: "Minutes", type: "number", min: 0, max: 59, suffix: "min" },
    {
      key: "mode",
      label: "Conversion",
      type: "select",
      options: [
        { value: "totalMin", label: "→ Total minutes" },
        { value: "decimal", label: "→ Heures décimales" },
        { value: "secondes", label: "→ Secondes" },
      ],
    },
  ],
  defaultValues: { heures: 2, minutes: 45, mode: "totalMin" },
  content: buildContent({
    intro: "Convertir heures et minutes est utile pour le travail, les trajets et la facturation.",
    howItWorks: [
      {
        title: "Conversions",
        blocks: [
          p("Total min = H × 60 + M. Heures décimales = H + M/60. Secondes = Total min × 60."),
          hl("Facturation", "Les heures décimales simplifient la multiplication par un taux horaire."),
        ],
      },
    ],
    example: { title: "2 h 45 min", blocks: [p("165 minutes — 2,75 heures décimales.")] },
    conseils: ["Utilisez les heures décimales pour la paie.", "Arrondissez selon les règles de votre employeur."],
    limites: ["Pas de calcul entre deux horaires (utilisez heure début/fin séparément)."],
  }),
  faq: buildFaq([
    { question: "Heures décimales ?", answer: "2h30 = 2,5 h. 2h45 = 2,75 h. Plus facile pour les calculs." },
    { question: "Conversion paie ?", answer: "Salaire = Heures décimales × Taux horaire." },
    { question: "Minutes en centièmes ?", answer: "Certaines entreprises utilisent les centièmes : 2h30 = 2,50 h." },
    { question: "Durée trajet ?", answer: "Combinez avec le simulateur vitesse-distance-temps." },
  ]),
  calculate(input) {
    const h = num(input.heures);
    const m = num(input.minutes);
    const totalMin = h * 60 + m;
    const decimal = h + m / 60;
    const secondes = totalMin * 60;
    const mode = String(input.mode);
    let highlight = `${totalMin} min`;
    if (mode === "decimal") highlight = `${formatNumber(decimal, 2)} h`;
    if (mode === "secondes") highlight = `${formatNumber(secondes, 0)} s`;
    return {
      summary: `${h} h ${m} min = ${highlight}.`,
      lines: [
        { label: "Total minutes", value: `${totalMin} min`, highlight: true },
        { label: "Heures décimales", value: `${formatNumber(decimal, 2)} h` },
        { label: "Secondes", value: `${formatNumber(secondes, 0)} s` },
        { label: "Saisie", value: `${h} h ${m} min` },
        { label: "Format", value: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}` },
      ],
    };
  },
};

export const vitesseDistanceTemps: SimulatorDefinition = {
  slug: "vitesse-distance-temps",
  title: "Vitesse distance temps",
  shortDescription:
    "Calculez la vitesse, la distance ou le temps selon la formule V = D / T.",
  metaTitle: "Calculateur vitesse distance temps — V = D/T",
  metaDescription:
    "Calculez la vitesse, la distance ou la durée d'un trajet : formule V = D / T.",
  keywords: ["vitesse distance temps", "calcul trajet", "durée route"],
  domain: "quotidien",
  category: "conversion",
  icon: "scale",
  relatedSlugs: ["convertisseur-heures-minutes", "regle-de-trois", "frais-kilometriques"],
  formFields: [
    {
      key: "calcul",
      label: "Calculer",
      type: "select",
      options: [
        { value: "temps", label: "Le temps (distance + vitesse)" },
        { value: "distance", label: "La distance (temps + vitesse)" },
        { value: "vitesse", label: "La vitesse (distance + temps)" },
      ],
    },
    { key: "distance", label: "Distance", type: "number", min: 0, step: 1, suffix: "km" },
    { key: "vitesse", label: "Vitesse", type: "number", min: 0, step: 1, suffix: "km/h" },
    { key: "temps", label: "Temps", type: "number", min: 0, step: 0.1, suffix: "h" },
  ],
  defaultValues: { calcul: "temps", distance: 450, vitesse: 130, temps: 3 },
  content: buildContent({
    intro: "La relation V = D / T permet de calculer vitesse, distance ou temps d'un trajet.",
    howItWorks: [
      {
        title: "Formules",
        blocks: [
          p("Vitesse = Distance / Temps. Distance = Vitesse × Temps. Temps = Distance / Vitesse."),
          hl("Route", "Vitesse moyenne réelle inférieure à la vitesse max (pauses, villes)."),
        ],
      },
    ],
    example: { title: "450 km à 130 km/h", blocks: [p("Durée : ~3h27 (sans pauses).")] },
    conseils: ["Ajoutez 15-20 % pour pauses et ralentissements.", "Vérifiez les péages et restrictions.", "Vitesse moyenne autoroute ~100 km/h avec trafic."],
    limites: ["Vitesse constante supposée.", "Péages et carburant non calculés."],
  }),
  faq: buildFaq([
    { question: "Vitesse moyenne autoroute ?", answer: "130 km/h max — moyenne réelle ~100-110 km/h avec trafic." },
    { question: "Temps avec pauses ?", answer: "Ajoutez 15 min toutes les 2 h pour une pause recommandée." },
    { question: "Distance Paris-Marseille ?", answer: "~775 km — ~7 h sans pause à vitesse moyenne." },
    { question: "km/h en m/s ?", answer: "Divisez par 3,6. 130 km/h = 36,1 m/s." },
  ]),
  calculate(input) {
    const mode = String(input.calcul);
    const d = num(input.distance);
    const v = num(input.vitesse);
    const t = num(input.temps);
    let result = 0;
    let label = "";
    if (mode === "temps" && v > 0) {
      result = d / v;
      label = "Temps";
    } else if (mode === "distance") {
      result = v * t;
      label = "Distance";
    } else if (mode === "vitesse" && t > 0) {
      result = d / t;
      label = "Vitesse";
    }
    const h = Math.floor(result);
    const min = Math.round((result - h) * 60);
    const fmt =
      mode === "temps"
        ? `${h} h ${min} min`
        : mode === "distance"
          ? `${formatNumber(result, 1)} km`
          : `${formatNumber(result, 1)} km/h`;
    return {
      summary: `${label} : ${fmt}.`,
      lines: [
        { label: label, value: fmt, highlight: true },
        { label: "Distance", value: `${d} km` },
        { label: "Vitesse", value: `${v} km/h` },
        { label: "Temps (h)", value: formatNumber(mode === "temps" ? result : t, 2) },
        { label: "Formule", value: "V = D / T" },
      ],
    };
  },
};

export const evolutionPourcentage: SimulatorDefinition = {
  slug: "evolution-pourcentage",
  title: "Évolution en pourcentage",
  shortDescription:
    "Calculez la variation en pourcentage entre une valeur initiale et une valeur finale.",
  metaTitle: "Calculateur évolution pourcentage — Variation",
  metaDescription:
    "Calculez l'évolution en pourcentage entre deux valeurs : hausse, baisse et taux de variation.",
  keywords: ["évolution pourcentage", "variation", "hausse baisse"],
  domain: "quotidien",
  category: "pratique",
  icon: "percent",
  relatedSlugs: ["calculateur-pourcentage", "regle-de-trois", "simulateur-inflation"],
  formFields: [
    { key: "valeurInitiale", label: "Valeur initiale", type: "number", min: 0, step: 0.01, suffix: "" },
    { key: "valeurFinale", label: "Valeur finale", type: "number", min: 0, step: 0.01, suffix: "" },
  ],
  defaultValues: { valeurInitiale: 80, valeurFinale: 100 },
  content: buildContent({
    intro: "L'évolution en pourcentage mesure la variation relative entre deux valeurs.",
    howItWorks: [
      {
        title: "Formule",
        blocks: [
          p("Évolution % = ((Valeur finale − Valeur initiale) / Valeur initiale) × 100."),
          hl("Hausse vs baisse", "Positif = hausse. Négatif = baisse."),
        ],
      },
    ],
    example: { title: "80 → 100", blocks: [p("Évolution : +25 %.")] },
    conseils: ["Toujours utiliser la valeur initiale comme référence.", "Ne cumulez pas les % additivement."],
    limites: ["Une seule période.", "Valeur initiale = 0 : évolution non définie."],
  }),
  faq: buildFaq([
    { question: "Hausse de 50 % puis baisse de 50 % ?", answer: "Vous n'êtes pas à 0 % — vous êtes à −25 % du point de départ." },
    { question: "Points de pourcentage vs % ?", answer: "Taux 5 % → 7 % = +2 points, pas +40 %." },
    { question: "Évolution négative ?", answer: "Baisse de 20 % : valeur finale = initiale × 0,80." },
    { question: "CAGR ?", answer: "Taux de croissance annualisé — pour évolutions sur plusieurs années." },
  ]),
  calculate(input) {
    const init = num(input.valeurInitiale);
    const fin = num(input.valeurFinale);
    const diff = fin - init;
    const evol = init > 0 ? (diff / init) * 100 : 0;
    const type = evol >= 0 ? "Hausse" : "Baisse";
    const facteur = init > 0 ? fin / init : 0;
    return {
      summary: `${type} de ${formatPercent(Math.abs(evol), 1)} (${formatNumber(init, 2)} → ${formatNumber(fin, 2)}).`,
      lines: [
        { label: "Évolution", value: formatPercent(evol, 1), highlight: true },
        { label: "Type", value: type, highlight: true },
        { label: "Variation absolue", value: formatNumber(diff, 2) },
        { label: "Valeur initiale", value: formatNumber(init, 2) },
        { label: "Valeur finale", value: formatNumber(fin, 2) },
        { label: "Coefficient", value: `×${formatNumber(facteur, 3)}` },
      ],
    };
  },
};

export const quotidienSimulators = [
  calculateurTva,
  calculateurPourcentage,
  regleDeTrois,
  calculateurAge,
  calculateurPourboire,
  partageFacture,
  convertisseurDevises,
  convertisseurHeuresMinutes,
  vitesseDistanceTemps,
  evolutionPourcentage,
];
