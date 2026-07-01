import type { SimulatorDefinition } from "../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const rentabiliteScpi: SimulatorDefinition = {
  slug: "rentabilite-scpi",
  title: "Rentabilité SCPI",
  shortDescription:
    "Calculez le rendement d'une SCPI : taux de distribution et valeur de retrait.",
  metaTitle: "Simulateur rentabilité SCPI — Rendement et distribution",
  metaDescription:
    "Estimez la rentabilité d'une SCPI : prix de part, taux de distribution annuel et rendement net simplifié.",
  keywords: ["rentabilité SCPI", "rendement SCPI", "taux distribution SCPI"],
  category: "investissement",
  icon: "chart",
  relatedSlugs: ["rendement-locatif", "ifi-impot-fortune-immobiliere", "cash-flow-immobilier"],
  formFields: [
    { key: "montantInvesti", label: "Montant investi", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "prixPart", label: "Prix de souscription / part", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxDistribution", label: "Taux de distribution annuel", type: "number", min: 0, max: 10, step: 0.1, suffix: "%", hint: "Historique souvent 4 à 5,5 %" },
    { key: "fraisSouscription", label: "Frais de souscription", type: "number", min: 0, max: 15, step: 0.5, suffix: "%" },
  ],
  defaultValues: { montantInvesti: 20000, prixPart: 1050, tauxDistribution: 4.8, fraisSouscription: 10 },
  content: buildContent({
    intro: "Les SCPI permettent d'investir dans l'immobilier locatif sans gestion directe, via des parts de sociétés civiles.",
    howItWorks: [{ title: "Rendement", blocks: [hl("Formule", "Rendement ≈ Taux de distribution annuel (dividendes / capital investi)"), p("Les revenus sont versés trimestriellement ou mensuellement selon la SCPI. La plus-value se réalise à la revente des parts.")] }],
    example: { title: "20 000 € investis, distribution 4,8 %", blocks: [p("Revenus annuels estimés : 960 €, soit 80 €/mois avant fiscalité.")] },
    conseils: ["Analysez l'historique de distribution sur 5 à 10 ans.", "Intégrez les frais de souscription (8 à 12 %) dans le rendement réel.", "Les SCPI entrent dans l'assiette IFI."],
    limites: ["Fiscalité (IR ou IS selon support) simplifiée.", "Valeur de retrait variable selon le marché secondaire."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'une SCPI ?", answer: "Société Civile de Placement Immobilier : vous achetez des parts d'un patrimoine locatif géré par une société de gestion." },
    { question: "Quel rendement moyen ?", answer: "Historiquement 4 à 5,5 % de distribution annuelle, variable selon les SCPI." },
    { question: "SCPI ou achat direct ?", answer: "SCPI : ticket d'entrée faible, diversification, pas de gestion. Achat direct : contrôle et effet de levier crédit." },
    { question: "Les SCPI sont-elles liquides ?", answer: "Revente possible mais délai variable (3 à 12 mois). Pas aussi liquide qu'une action." },
  ]),
  calculate(input) {
    const montant = num(input.montantInvesti);
    const prixPart = num(input.prixPart);
    const tauxDistribution = num(input.tauxDistribution);
    const fraisPct = num(input.fraisSouscription);
    const frais = montant * (fraisPct / 100);
    const capitalNet = montant - frais;
    const distribution = capitalNet * (tauxDistribution / 100);
    const rendement = montant > 0 ? (distribution / montant) * 100 : 0;
    const nbParts = prixPart > 0 ? Math.floor(montant / prixPart) : 0;
    return {
      summary: `Rendement SCPI estimé : ${formatPercent(rendement, 2)} — ${formatCurrency(distribution)}/an.`,
      lines: [
        { label: "Rendement brut estimé", value: formatPercent(rendement, 2), highlight: true },
        { label: "Montant investi", value: formatCurrency(montant) },
        { label: "Frais de souscription", value: formatCurrency(frais) },
        { label: "Capital net investi", value: formatCurrency(capitalNet) },
        { label: "Prix de souscription / part", value: formatCurrency(prixPart) },
        { label: "Nombre de parts estimé", value: String(nbParts) },
        { label: "Taux de distribution annuel", value: formatPercent(tauxDistribution, 1) },
        { label: "Revenus annuels estimés", value: formatCurrency(distribution) },
        { label: "Revenus mensuels estimés", value: formatCurrency(distribution / 12) },
      ],
    };
  },
};

export const rentabiliteLocationCourteDuree: SimulatorDefinition = {
  slug: "rentabilite-location-courte-duree",
  title: "Rentabilité location courte durée",
  shortDescription:
    "Estimez la rentabilité d'une location meublée de courte durée (Airbnb, saisonnière).",
  metaTitle: "Simulateur rentabilité Airbnb / location courte durée",
  metaDescription:
    "Calculez la rentabilité d'une location courte durée : prix par nuit, taux d'occupation, charges et rendement net.",
  keywords: ["rentabilité Airbnb", "location courte durée", "LCD rentabilité"],
  category: "investissement",
  icon: "chart",
  relatedSlugs: ["rentabilite-lmnp", "location-meublee-vs-nue", "cash-flow-immobilier"],
  formFields: [
    { key: "investissement", label: "Investissement total", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "prixNuit", label: "Prix moyen par nuit", type: "number", min: 0, step: 5, suffix: "€" },
    { key: "occupation", label: "Taux d'occupation", type: "number", min: 0, max: 100, step: 1, suffix: "%", hint: "50 à 75 % en zone touristique" },
    { key: "chargesAnnuelles", label: "Charges annuelles", type: "number", min: 0, step: 100, suffix: "€", hint: "Ménage, conciergerie, charges, taxe de séjour…" },
    { key: "commissionPlateforme", label: "Commission plateforme", type: "number", min: 0, max: 25, step: 1, suffix: "%" },
  ],
  defaultValues: { investissement: 200000, prixNuit: 85, occupation: 65, chargesAnnuelles: 6000, commissionPlateforme: 15 },
  content: buildContent({
    intro: "La location courte durée (LCD) peut générer des revenus supérieurs à la location classique, avec plus de charges et de gestion.",
    howItWorks: [{ title: "Calcul", blocks: [p("Revenus = Prix/nuit × Nuits louées (365 × taux d'occupation) × (1 − commission plateforme) − Charges."), hl("Réglementation", "Vérifiez les règles locales (120 jours/an à Paris, autorisation mairie…).")] }],
    conseils: ["Estimez prudemment le taux d'occupation hors haute saison.", "Intégrez ménage, blanchisserie et conciergerie.", "Comparez avec une location meublée classique."],
    limites: ["Réglementation locale non détaillée.", "Fiscalité BIC / micro-BIC simplifiée."],
  }),
  faq: buildFaq([
    { question: "Airbnb est-il plus rentable qu'un bail classique ?", answer: "Souvent oui en zone touristique, mais charges et vacance plus élevées." },
    { question: "Quel taux d'occupation viser ?", answer: "50 à 65 % en moyenne annuelle en zone touristique. 70 %+ en station très demandée." },
    { question: "Quelle fiscalité pour la LCD ?", answer: "BIC (micro-BIC ou réel). Statut LMNP possible si meublé." },
    { question: "Réglementation à Paris ?", answer: "Location de résidence principale limitée à 120 nuits/an. Meublé tourisme : règles spécifiques." },
  ]),
  calculate(input) {
    const invest = num(input.investissement);
    const prixNuit = num(input.prixNuit);
    const occupation = num(input.occupation);
    const charges = num(input.chargesAnnuelles);
    const commissionPct = num(input.commissionPlateforme);
    const nuits = 365 * (occupation / 100);
    const brut = nuits * prixNuit;
    const commissionMontant = brut * (commissionPct / 100);
    const apresCommission = brut - commissionMontant;
    const net = apresCommission - charges;
    const rendement = invest > 0 ? (net / invest) * 100 : 0;
    return {
      summary: `Rendement net LCD : ${formatPercent(rendement, 2)} — ${formatCurrency(net)}/an.`,
      lines: [
        { label: "Rendement net", value: formatPercent(rendement, 2), highlight: true },
        { label: "Investissement total", value: formatCurrency(invest) },
        { label: "Prix moyen par nuit", value: formatCurrency(prixNuit) },
        { label: "Taux d'occupation", value: formatPercent(occupation, 0) },
        { label: "Nuits louées par an", value: `${Math.round(nuits)} nuits` },
        { label: "Revenus bruts annuels", value: formatCurrency(brut) },
        { label: "Commission plateforme", value: formatPercent(commissionPct, 0) },
        { label: "Commission annuelle estimée", value: formatCurrency(commissionMontant) },
        { label: "Charges annuelles", value: formatCurrency(charges) },
        { label: "Revenus nets annuels", value: formatCurrency(net) },
      ],
    };
  },
};

export const colocationRentabilite: SimulatorDefinition = {
  slug: "colocation-rentabilite",
  title: "Colocation — rentabilité par chambre",
  shortDescription:
    "Calculez la rentabilité d'un bien en colocation (loyer par chambre).",
  metaTitle: "Simulateur rentabilité colocation — Loyer par chambre",
  metaDescription:
    "Estimez la rentabilité d'un investissement en colocation : loyer par chambre, charges et rendement net.",
  keywords: ["rentabilité colocation", "investissement colocation", "loyer par chambre"],
  category: "investissement",
  icon: "chart",
  relatedSlugs: ["rendement-locatif-net", "cash-flow-immobilier", "charges-recuperables-locataire"],
  formFields: [
    { key: "prix", label: "Prix d'achat", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "notaire", label: "Frais de notaire", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "travaux", label: "Travaux", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "nbChambres", label: "Nombre de chambres louées", type: "number", min: 1, max: 10, step: 1 },
    { key: "loyerChambre", label: "Loyer mensuel par chambre", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges annuelles", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "vacance", label: "Vacance locative", type: "number", min: 0, max: 30, step: 1, suffix: "%" },
  ],
  defaultValues: { prix: 220000, notaire: 17600, travaux: 15000, nbChambres: 3, loyerChambre: 450, charges: 3200, vacance: 5 },
  content: buildContent({
    intro: "La colocation permet de multiplier les loyers par chambre, avec une gestion plus active.",
    howItWorks: [{ title: "Formule", blocks: [p("Loyer total = Loyer/chambre × Nombre de chambres. Rendement net = (Loyers effectifs − Charges) / Investissement total."), hl("Colocation", "Bail unique ou baux individuels selon la structure choisie.")] }],
    conseils: ["Vérifiez la réglementation locale (surface minimum par chambre).", "Prévoyez plus de rotation locative qu'un bail classique.", "Comparez avec un bail unique au même loyer total."],
    limites: ["Fiscalité non détaillée.", "Gestion locative non incluse."],
  }),
  faq: buildFaq([
    { question: "Colocation : bail unique ou individuel ?", answer: "Bail unique (colocation) : un contrat pour tous. Baux individuels : plus de flexibilité, plus de gestion." },
    { question: "Quel rendement en colocation ?", answer: "Souvent 0,5 à 1,5 point de plus qu'un bail unique, grâce au surloyer par chambre." },
    { question: "Surface minimum par chambre ?", answer: "9 m² minimum en colocation, 20 m² de surface totale pour 2 personnes (décret)." },
    { question: "Colocation ou location classique ?", answer: "Colocation si vous acceptez plus de gestion. Classique si vous visez la simplicité." },
  ]),
  calculate(input) {
    const prix = num(input.prix);
    const notaire = num(input.notaire);
    const travaux = num(input.travaux);
    const nbChambres = num(input.nbChambres);
    const loyerChambre = num(input.loyerChambre);
    const charges = num(input.charges);
    const vacance = num(input.vacance);
    const total = prix + notaire + travaux;
    const loyerMensuelTotal = loyerChambre * nbChambres;
    const loyerTotal = loyerMensuelTotal * 12;
    const loyerEffectif = loyerTotal * (1 - vacance / 100);
    const perteVacance = loyerTotal - loyerEffectif;
    const net = loyerEffectif - charges;
    const rendement = total > 0 ? (net / total) * 100 : 0;
    return {
      summary: `Rendement net colocation : ${formatPercent(rendement, 2)} (${nbChambres} chambres × ${formatCurrency(loyerChambre)}/mois).`,
      lines: [
        { label: "Rendement net", value: formatPercent(rendement, 2), highlight: true },
        { label: "Investissement total", value: formatCurrency(total) },
        { label: "Prix d'achat", value: formatCurrency(prix) },
        { label: "Frais de notaire", value: formatCurrency(notaire) },
        { label: "Travaux", value: formatCurrency(travaux) },
        { label: "Nombre de chambres", value: String(nbChambres) },
        { label: "Loyer par chambre", value: formatCurrency(loyerChambre) },
        { label: "Loyer mensuel total", value: formatCurrency(loyerMensuelTotal) },
        { label: "Loyers bruts annuels", value: formatCurrency(loyerTotal) },
        { label: "Vacance locative", value: formatPercent(vacance, 0) },
        { label: "Perte liée à la vacance", value: formatCurrency(perteVacance) },
        { label: "Charges annuelles", value: formatCurrency(charges) },
        { label: "Revenu net annuel", value: formatCurrency(net) },
      ],
    };
  },
};

export const investissementSimulatorsPart2 = [
  rentabiliteScpi,
  rentabiliteLocationCourteDuree,
  colocationRentabilite,
];
