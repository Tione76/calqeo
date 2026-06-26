import type { SimulatorDefinition } from "../../types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";

const calculEcoTrajet: SimulatorDefinition = draftSimulator({
  slug: "simulateur-calcul-eco-trajet",
  title: "Économie trajet domicile-travail",
  shortDescription:
    "Comparez le coût voiture, transports en commun et covoiturage.",
  metaTitle: "Simulateur coût trajet — Voiture vs transports",
  metaDescription:
    "Comparez le coût mensuel du trajet domicile-travail en voiture, transports en commun ou covoiturage.",
  keywords: ["coût trajet", "domicile travail", "économie covoiturage"],
  domain: "quotidien",
  category: "epargne",
  icon: "wallet",
  relatedSlugs: ["simulateur-cout-kilometrique-voiture", "frais-kilometriques", "budget-reste-a-vivre"],
  formFields: [
    { key: "distance", label: "Distance aller", type: "number", min: 1, max: 100, step: 1, suffix: "km" },
    { key: "joursMois", label: "Jours travaillés/mois", type: "number", min: 1, max: 31, suffix: "" },
    { key: "conso", label: "Consommation voiture", type: "number", min: 3, max: 15, step: 0.5, suffix: "L/100" },
    { key: "prixCarburant", label: "Prix carburant", type: "number", min: 1, max: 3, step: 0.01, suffix: "€/L" },
    { key: "abonnementTransport", label: "Abonnement transport/mois", type: "number", min: 0, step: 5, suffix: "€" },
  ],
  defaultValues: { distance: 15, joursMois: 20, conso: 7, prixCarburant: 1.75, abonnementTransport: 75 },
  content: buildContent({
    intro: "Le trajet domicile-travail pèse sur le budget — comparer les modes de transport aide à choisir.",
    howItWorks: [
      {
        title: "Coûts",
        blocks: [
          p("Voiture = Distance × 2 × Jours × Conso/100 × Prix/L. Transport = Abonnement mensuel. Covoiturage ≈ Voiture / 2."),
          hl("Barème fiscal", "Frais kilométriques déductibles si remboursement employeur."),
        ],
      },
    ],
    conseils: ["Covoiturage : BlaBlaCar Daily, Karos.", "Forfait Mobilités Durables employeur : 600 €/an.", "Vélo + transports : combo possible."],
    limites: ["Coût voiture partiel — entretien et assurance non inclus.", "Péages non comptés."],
  }),
  faq: buildFaq([
    { question: "Voiture ou transport ?", answer: "Transport souvent moins cher en ville — voiture gagne en rural." },
    { question: "Forfait Mobilités Durables ?", answer: "Jusqu'à 600 €/an exonérés si pris en charge par l'employeur." },
    { question: "Frais kilométriques ?", answer: "Barème URSSAF si remboursement employeur — simulateur dédié." },
  ]),
  calculate(input) {
    const dist = num(input.distance);
    const jours = num(input.joursMois);
    const conso = num(input.conso);
    const prix = num(input.prixCarburant);
    const kmMois = dist * 2 * jours;
    const coutVoiture = (kmMois * conso / 100) * prix;
    const transport = num(input.abonnementTransport);
    const covoiturage = coutVoiture / 2;
    const economieTransport = coutVoiture - transport;
    return {
      summary: `Voiture ${formatCurrency(coutVoiture)}/mois — transport ${formatCurrency(transport)}/mois.`,
      lines: [
        { label: "Coût voiture/mois", value: formatCurrency(coutVoiture), highlight: true },
        { label: "Abonnement transport", value: formatCurrency(transport), highlight: true },
        { label: "Covoiturage (50 %)", value: formatCurrency(covoiturage) },
        { label: "Économie transport vs voiture", value: formatCurrency(economieTransport) },
        { label: "Km mensuels", value: `${formatNumber(kmMois, 0)} km` },
      ],
    };
  },
});

const coutKilometriqueVoiture: SimulatorDefinition = draftSimulator({
  slug: "simulateur-cout-kilometrique-voiture",
  title: "Coût kilométrique voiture",
  shortDescription:
    "Estimez le coût réel au km de votre voiture (carburant, entretien, assurance).",
  metaTitle: "Calculateur coût kilométrique voiture — €/km",
  metaDescription:
    "Calculez le coût au kilomètre de votre voiture : carburant, entretien, assurance, amortissement.",
  keywords: ["coût kilométrique", "prix au km", "coût voiture km"],
  domain: "quotidien",
  category: "epargne",
  icon: "wallet",
  relatedSlugs: ["frais-kilometriques", "simulateur-calcul-eco-trajet", "loa-vs-credit-auto"],
  formFields: [
    { key: "kmAn", label: "Kilométrage annuel", type: "number", min: 1000, max: 50000, step: 500, suffix: "km" },
    { key: "carburantAn", label: "Dépense carburant/an", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "assuranceAn", label: "Assurance/an", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "entretienAn", label: "Entretien/an", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "amortissementAn", label: "Amortissement/an", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { kmAn: 12000, carburantAn: 1800, assuranceAn: 800, entretienAn: 600, amortissementAn: 2000 },
  content: buildContent({
    intro: "Le coût au km réel dépasse le carburant — assurance, entretien et dépréciation comptent.",
    howItWorks: [
      {
        title: "Coût total",
        blocks: [
          p("Coût/km = (Carburant + Assurance + Entretien + Amortissement) / Km annuels."),
          hl("Barème fiscal", "Barème URSSAF 2024 : 0,636 €/km pour 5 CV (véhicule thermique)."),
        ],
      },
    ],
    conseils: ["Km faibles : coût/km élevé (charges fixes).", "Entretien préventif réduit les pannes.", "Comparez au leasing tout inclus."],
    limites: ["Estimation — parking et péages exclus.", "Amortissement subjectif."],
  }),
  faq: buildFaq([
    { question: "Coût moyen au km ?", answer: "0,30 à 0,50 €/km tout compris pour voiture thermique." },
    { question: "Électrique moins cher ?", answer: "Carburant réduit — amortissement batterie à considérer." },
    { question: "Frais kilométriques déductibles ?", answer: "Barème fiscal si remboursement employeur — simulateur dédié." },
  ]),
  calculate(input) {
    const km = num(input.kmAn);
    const total =
      num(input.carburantAn) +
      num(input.assuranceAn) +
      num(input.entretienAn) +
      num(input.amortissementAn);
    const coutKm = km > 0 ? total / km : 0;
    const carburantKm = km > 0 ? num(input.carburantAn) / km : 0;
    return {
      summary: `Coût total : ${formatCurrency(coutKm, 2)}/km (${formatCurrency(total)}/an).`,
      lines: [
        { label: "Coût au km", value: `${formatCurrency(coutKm, 2)}/km`, highlight: true },
        { label: "Coût annuel total", value: formatCurrency(total), highlight: true },
        { label: "Carburant/km", value: `${formatCurrency(carburantKm, 2)}/km` },
        { label: "Kilométrage annuel", value: `${formatNumber(km, 0)} km` },
        { label: "Part carburant", value: formatPercent((num(input.carburantAn) / total) * 100, 0) },
      ],
    };
  },
});

const partageLoyerColocation: SimulatorDefinition = draftSimulator({
  slug: "simulateur-partage-loyer-colocation",
  title: "Partage loyer colocation",
  shortDescription:
    "Répartissez le loyer et les charges entre colocataires au prorata.",
  metaTitle: "Calculateur partage loyer colocation",
  metaDescription:
    "Répartissez le loyer et les charges entre colocataires : parts égales ou au prorata des chambres.",
  keywords: ["partage loyer", "colocation loyer", "répartition loyer"],
  domain: "quotidien",
  category: "pratique",
  icon: "home",
  relatedSlugs: ["loyer-charges-comprises", "budget-reste-a-vivre", "calculateur-pourboire"],
  formFields: [
    { key: "loyer", label: "Loyer HC", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges mensuelles", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "nbColoc", label: "Nombre de colocataires", type: "number", min: 2, max: 8, suffix: "" },
    {
      key: "mode",
      label: "Mode répartition",
      type: "select",
      options: [
        { value: "egal", label: "Parts égales" },
        { value: "chambres", label: "Prorata chambres (ex. 1-1-1,2)" },
      ],
    },
  ],
  defaultValues: { loyer: 1200, charges: 150, nbColoc: 3, mode: "egal" },
  content: buildContent({
    intro: "En colocation, la répartition du loyer doit être claire et formalisée dans le bail ou une convention.",
    howItWorks: [
      {
        title: "Répartition",
        blocks: [
          p("Total = Loyer + Charges. Part égale = Total / Nb coloc. Prorata chambres : selon surface ou valeur relative."),
          hl("Bail", "Un seul bail solidaire ou baux individuels — implications différentes."),
        ],
      },
    ],
    conseils: ["Convention de colocation écrite.", "Compte commun pour charges.", "Indexation IRL : répartir proportionnellement."],
    limites: ["Prorata chambres simplifié (parts égales par défaut).", "Caution et dépôt non calculés."],
  }),
  faq: buildFaq([
    { question: "Loyer égal ou prorata ?", answer: "Égal si chambres similaires. Prorata si tailles très différentes." },
    { question: "Charges récupérables ?", answer: "Eau, chauffage, TEOM — réparties entre colocataires." },
    { question: "Bail colocation ?", answer: "Bail unique solidaire (tous signent) ou baux individuels (chambres)." },
  ]),
  calculate(input) {
    const loyer = num(input.loyer);
    const charges = num(input.charges);
    const nb = num(input.nbColoc);
    const total = loyer + charges;
    const part = nb > 0 ? total / nb : 0;
    const partLoyer = nb > 0 ? loyer / nb : 0;
    const partCharges = nb > 0 ? charges / nb : 0;
    return {
      summary: `${formatCurrency(part)}/mois par colocataire (${nb} personnes).`,
      lines: [
        { label: "Part totale/coloc", value: formatCurrency(part), highlight: true },
        { label: "Part loyer", value: formatCurrency(partLoyer), highlight: true },
        { label: "Part charges", value: formatCurrency(partCharges) },
        { label: "Total mensuel", value: formatCurrency(total) },
        { label: "Colocataires", value: `${nb}` },
      ],
    };
  },
});

export const quotidienDrafts: SimulatorDefinition[] = [
  calculEcoTrajet,
  coutKilometriqueVoiture,
  partageLoyerColocation,
];
