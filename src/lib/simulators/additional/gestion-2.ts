import type { SimulatorDefinition } from "../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const encadrementLoyers: SimulatorDefinition = {
  slug: "encadrement-loyers",
  title: "Encadrement des loyers",
  shortDescription:
    "Vérifiez si votre loyer respecte le plafond légal en zone tendue.",
  metaTitle: "Simulateur encadrement des loyers — Loyer maximum légal",
  metaDescription:
    "Calculez le loyer maximum autorisé en zone d'encadrement : loyer de référence, complément et dépassement.",
  keywords: ["encadrement loyers", "loyer maximum", "zone tendue loyer"],
  category: "gestion",
  icon: "building",
  relatedSlugs: ["revision-loyer-irl", "loyer-charges-comprises", "depot-garantie-locatif"],
  formFields: [
    { key: "loyerReference", label: "Loyer de référence (€/m²)", type: "number", min: 0, step: 0.5, suffix: "€/m²", hint: "Publié en préfecture chaque année" },
    { key: "surface", label: "Surface du logement", type: "number", min: 1, step: 1, suffix: "m²" },
    { key: "complementLoyer", label: "Complément de loyer", type: "number", min: 0, step: 10, suffix: "€", hint: "Justifié par caractéristiques exceptionnelles" },
    { key: "loyerActuel", label: "Loyer actuel (HC)", type: "number", min: 0, step: 50, suffix: "€" },
    {
      key: "zone",
      label: "Majoration autorisée",
      type: "select",
      options: [
        { value: "20", label: "Loyer de référence (+0 %)" },
        { value: "30", label: "Loyer de référence majoré (+20 %)" },
      ],
    },
  ],
  defaultValues: { loyerReference: 32, surface: 45, complementLoyer: 0, loyerActuel: 1550, zone: "30" },
  content: buildContent({
    intro: "En zone tendue (Paris, Lille, Lyon, Montpellier…), le loyer est plafonné par rapport au loyer de référence.",
    howItWorks: [{ title: "Plafonds", blocks: [p("Loyer max = Loyer de référence × Surface (+20 % max) + Complément de loyer justifié."), hl("Sanction", "Un loyer excessif peut être réduit par le juge ou la commission de conciliation.")] }],
    conseils: ["Consultez les loyers de référence publiés par la préfecture.", "Le complément de loyer doit être justifié (vue, prestations…).", "L'encadrement s'applique aux relocations et renouvellements."],
    limites: ["Loyers de référence indicatifs — vérifiez l'arrêté préfectoral local.", "Dispositif absent hors zones tendues."],
  }),
  faq: buildFaq([
    { question: "Quelles villes sont concernées ?", answer: "Paris, Lille, Lyon, Montpellier, Bordeaux, Grenoble, Est Ensemble, Plaine Commune…" },
    { question: "Qu'est-ce que le complément de loyer ?", answer: "Montant additionnel justifié par des caractéristiques de localisation ou de confort exceptionnelles." },
    { question: "Que faire si le loyer est trop élevé ?", answer: "Contacter la commission de conciliation ou saisir le juge pour une réduction." },
    { question: "Lien avec la révision IRL ?", answer: "L'encadrement fixe le plafond initial. L'IRL révise le loyer dans la limite de ce plafond." },
  ]),
  calculate(input) {
    const ref = num(input.loyerReference) * num(input.surface);
    const majoration = String(input.zone) === "30" ? 1.2 : 1;
    const plafond = ref * majoration + num(input.complementLoyer);
    const actuel = num(input.loyerActuel);
    const depassement = Math.max(0, actuel - plafond);
    const conforme = actuel <= plafond;
    return {
      summary: conforme
        ? `Loyer conforme — Plafond : ${formatCurrency(plafond)}/mois.`
        : `Dépassement estimé : ${formatCurrency(depassement)}/mois (plafond : ${formatCurrency(plafond)}).`,
      lines: [
        { label: "Loyer maximum autorisé", value: formatCurrency(plafond), highlight: true },
        { label: "Loyer actuel", value: formatCurrency(actuel) },
        { label: "Dépassement", value: formatCurrency(depassement), highlight: !conforme },
        { label: "Conformité", value: conforme ? "Conforme" : "Non conforme" },
        { label: "Loyer de référence (total)", value: formatCurrency(ref) },
      ],
    };
  },
};

export const depotGarantieLocatif: SimulatorDefinition = {
  slug: "depot-garantie-locatif",
  title: "Dépôt de garantie locatif",
  shortDescription:
    "Calculez le montant maximum légal du dépôt de garantie.",
  metaTitle: "Simulateur dépôt de garantie — Plafond légal",
  metaDescription:
    "Calculez le dépôt de garantie maximum pour une location nue (2 mois) ou meublée (1 mois) hors charges.",
  keywords: ["dépôt de garantie", "caution locative", "plafond dépôt garantie"],
  category: "gestion",
  icon: "wallet",
  relatedSlugs: ["loyer-charges-comprises", "encadrement-loyers", "revision-loyer-irl"],
  formFields: [
    { key: "loyerHC", label: "Loyer mensuel hors charges", type: "number", min: 0, step: 50, suffix: "€" },
    {
      key: "typeBail",
      label: "Type de bail",
      type: "select",
      options: [
        { value: "nu", label: "Location nue (2 mois max)" },
        { value: "meuble", label: "Location meublée (1 mois max)" },
      ],
    },
    { key: "depotDemande", label: "Dépôt demandé par le bailleur", type: "number", min: 0, step: 50, suffix: "€", hint: "Optionnel — pour vérifier la conformité" },
  ],
  defaultValues: { loyerHC: 850, typeBail: "nu", depotDemande: 1700 },
  content: buildContent({
    intro: "Le dépôt de garantie est plafonné par la loi et restitué au locataire en fin de bail (déduction éventuelle).",
    howItWorks: [{ title: "Plafonds légaux", blocks: [hl("Location nue", "Maximum 2 mois de loyer hors charges."), hl("Location meublée", "Maximum 1 mois de loyer hors charges.")] }],
    conseils: ["Le dépôt ne couvre pas les charges.", "Restitution sous 1 à 2 mois après l'état des lieux de sortie.", "Conservez les quittances de loyer."],
    limites: ["Retenues pour dégradations non chiffrées ici."],
  }),
  faq: buildFaq([
    { question: "Quel plafond pour une location nue ?", answer: "2 mois de loyer hors charges maximum." },
    { question: "Et pour un meublé ?", answer: "1 mois de loyer hors charges maximum." },
    { question: "Le dépôt couvre-t-il les charges ?", answer: "Non, il est calculé sur le loyer hors charges uniquement." },
    { question: "Délai de restitution ?", answer: "1 mois si l'état des lieux est conforme, 2 mois si des retenues sont effectuées." },
  ]),
  calculate(input) {
    const loyer = num(input.loyerHC);
    const type = String(input.typeBail);
    const plafond = loyer * (type === "meuble" ? 1 : 2);
    const demande = num(input.depotDemande);
    const conforme = demande <= 0 || demande <= plafond;
    return {
      summary: `Dépôt de garantie maximum : ${formatCurrency(plafond)} (${type === "meuble" ? "1 mois" : "2 mois"} HC).`,
      lines: [
        { label: "Dépôt maximum légal", value: formatCurrency(plafond), highlight: true },
        { label: "Type de bail", value: type === "meuble" ? "Meublé" : "Nue" },
        { label: "Loyer hors charges", value: formatCurrency(loyer) },
        ...(demande > 0
          ? [
              { label: "Dépôt demandé", value: formatCurrency(demande) },
              { label: "Conformité", value: conforme ? "Conforme" : "Non conforme" },
            ]
          : []),
      ],
    };
  },
};

export const chargesRecuperables: SimulatorDefinition = {
  slug: "charges-recuperables-locataire",
  title: "Charges récupérables locataire",
  shortDescription:
    "Estimez la part de charges locatives récupérables sur le locataire.",
  metaTitle: "Simulateur charges récupérables — Refacturation locataire",
  metaDescription:
    "Calculez les charges locatives récupérables sur le locataire : eau, chauffage collectif, entretien, taxe ordures…",
  keywords: ["charges récupérables", "refacturation charges locataire", "charges locatives"],
  category: "gestion",
  icon: "calculator",
  relatedSlugs: ["loyer-charges-comprises", "revision-loyer-irl", "taxe-fonciere"],
  formFields: [
    { key: "chargesCopro", label: "Charges de copropriété annuelles", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "eau", label: "Eau froide / chaude", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "chauffage", label: "Chauffage collectif", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "ordures", label: "Taxe ordures ménagères (TEOM)", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "entretien", label: "Entretien parties communes", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { chargesCopro: 1800, eau: 240, chauffage: 600, ordures: 180, entretien: 400 },
  content: buildContent({
    intro: "Certaines charges sont récupérables sur le locataire, d'autres restent à la charge du bailleur.",
    howItWorks: [{ title: "Charges récupérables", blocks: [p("Eau, chauffage collectif, ascenseur, entretien parties communes, TEOM… sont en principe récupérables."), hl("Non récupérables", "Taxe foncière, gros travaux (toiture, ravalement), franchise d'assurance immeuble.")] }],
    conseils: ["Régularisez les charges chaque année.", "Fournissez le décompté au locataire.", "Provision sur charges avec régularisation annuelle."],
    limites: ["Liste simplifiée — décret 87-713 pour le détail.", "Quote-part bailleur non calculée ici."],
  }),
  faq: buildFaq([
    { question: "Quelles charges sont récupérables ?", answer: "Eau, chauffage, ascenseur, entretien courant, TEOM, gardien…" },
    { question: "La taxe foncière est-elle récupérable ?", answer: "Non, elle reste à la charge du propriétaire." },
    { question: "Comment facturer les charges ?", answer: "Provision mensuelle avec régularisation annuelle sur décomptes réels." },
    { question: "Charges forfaitaires ?", answer: "Possible en meublé uniquement, plafonnées à 20 % du loyer." },
  ]),
  calculate(input) {
    const total =
      num(input.chargesCopro) +
      num(input.eau) +
      num(input.chauffage) +
      num(input.ordures) +
      num(input.entretien);
    const mensuel = total / 12;
    return {
      summary: `Charges récupérables : ${formatCurrency(total)}/an (${formatCurrency(mensuel)}/mois).`,
      lines: [
        { label: "Total charges récupérables", value: formatCurrency(total), highlight: true },
        { label: "Provision mensuelle", value: formatCurrency(mensuel), highlight: true },
        { label: "Copropriété", value: formatCurrency(num(input.chargesCopro)) },
        { label: "Eau", value: formatCurrency(num(input.eau)) },
        { label: "Chauffage", value: formatCurrency(num(input.chauffage)) },
        { label: "TEOM", value: formatCurrency(num(input.ordures)) },
      ],
    };
  },
};

export const revisionLoyerCommercial: SimulatorDefinition = {
  slug: "revision-loyer-commercial",
  title: "Révision loyer commercial",
  shortDescription:
    "Calculez la révision annuelle d'un loyer commercial (ILAT ou ILC).",
  metaTitle: "Simulateur révision loyer commercial — ILAT / ILC",
  metaDescription:
    "Estimez le nouveau loyer commercial après révision annuelle selon l'indice ILAT ou ILC.",
  keywords: ["révision loyer commercial", "ILAT", "ILC", "bail commercial"],
  category: "gestion",
  icon: "percent",
  relatedSlugs: ["revision-loyer-irl", "encadrement-loyers", "charges-recuperables-locataire"],
  formFields: [
    { key: "loyerActuel", label: "Loyer annuel actuel", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "indiceAncien", label: "Indice de référence (N-1)", type: "number", min: 0, step: 0.01 },
    { key: "indiceNouveau", label: "Indice en vigueur (N)", type: "number", min: 0, step: 0.01 },
    {
      key: "indice",
      label: "Indice utilisé",
      type: "select",
      options: [
        { value: "ILAT", label: "ILAT (activités tertiaires)" },
        { value: "ILC", label: "ILC (commerces)" },
      ],
    },
  ],
  defaultValues: { loyerActuel: 24000, indiceAncien: 132.5, indiceNouveau: 136.2, indice: "ILAT" },
  content: buildContent({
    intro: "Les baux commerciaux prévoient une révision annuelle du loyer selon un indice (ILAT ou ILC).",
    howItWorks: [{ title: "Formule", blocks: [hl("Calcul", "Nouveau loyer = Loyer actuel × (Indice N / Indice N-1)"), p("L'ILAT concerne les baux tertiaires. L'ILC s'applique aux commerces de détail.")] }],
    conseils: ["Vérifiez l'indice mentionné dans le bail.", "La révision est annuelle à la date prévue au contrat.", "Consultez l'INSEE pour les indices officiels."],
    limites: ["Indices indicatifs — vérifiez la publication INSEE.", "Clauses de lissage ou plafonnement non modélisés."],
  }),
  faq: buildFaq([
    { question: "ILAT ou ILC : quelle différence ?", answer: "ILAT pour bureaux et activités tertiaires. ILC pour commerces de détail." },
    { question: "Quand réviser le loyer commercial ?", answer: "À la date anniversaire du bail, selon l'indice du trimestre prévu au contrat." },
    { question: "Le locataire peut-il refuser ?", answer: "Non si la clause de révision est valide et l'indice correctement appliqué." },
    { question: "Différence avec l'IRL ?", answer: "L'IRL concerne les baux d'habitation. ILAT/ILC concernent les baux commerciaux." },
  ]),
  calculate(input) {
    const loyer = num(input.loyerActuel);
    const ancien = num(input.indiceAncien);
    const nouveau = num(input.indiceNouveau);
    const facteur = ancien > 0 ? nouveau / ancien : 1;
    const loyerRevise = loyer * facteur;
    const hausse = loyerRevise - loyer;
    return {
      summary: `Loyer révisé : ${formatCurrency(loyerRevise)}/an (+${formatCurrency(hausse)}).`,
      lines: [
        { label: "Loyer révisé annuel", value: formatCurrency(loyerRevise), highlight: true },
        { label: "Hausse annuelle", value: formatCurrency(hausse) },
        { label: "Loyer mensuel révisé", value: formatCurrency(loyerRevise / 12) },
        { label: "Variation", value: formatPercent((facteur - 1) * 100, 2) },
        { label: "Indice", value: String(input.indice) },
      ],
    };
  },
};

export const loyerChargesComprises: SimulatorDefinition = {
  slug: "loyer-charges-comprises",
  title: "Loyer CC vs hors charges",
  shortDescription:
    "Convertissez un loyer charges comprises en loyer hors charges et inversement.",
  metaTitle: "Simulateur loyer charges comprises — CC vs HC",
  metaDescription:
    "Convertissez un loyer charges comprises (CC) en loyer hors charges (HC) et calculez la provision de charges.",
  keywords: ["loyer charges comprises", "loyer CC HC", "conversion loyer charges"],
  category: "gestion",
  icon: "calculator",
  relatedSlugs: ["depot-garantie-locatif", "charges-recuperables-locataire", "revision-loyer-irl"],
  formFields: [
    {
      key: "mode",
      label: "Conversion",
      type: "select",
      options: [
        { value: "cc_vers_hc", label: "CC → HC (déduire les charges)" },
        { value: "hc_vers_cc", label: "HC → CC (ajouter les charges)" },
      ],
    },
    { key: "loyer", label: "Loyer mensuel (montant connu)", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Provision charges mensuelles", type: "number", min: 0, step: 10, suffix: "€" },
  ],
  defaultValues: { mode: "cc_vers_hc", loyer: 950, charges: 120 },
  content: buildContent({
    intro: "Le loyer hors charges (HC) sert de base au dépôt de garantie et à la révision IRL. Le loyer CC inclut une provision de charges.",
    howItWorks: [{ title: "Conversion", blocks: [p("HC = CC − Charges. CC = HC + Charges."), hl("Important", "Le dépôt de garantie et l'IRL se calculent toujours sur le loyer hors charges.")] }],
    conseils: ["Vérifiez la provision de charges dans le bail.", "Demandez le décompté annuel de charges.", "Comparez les annonces CC et HC sur une base homogène."],
    limites: ["Ne distingue pas charges forfaitaires meublé."],
  }),
  faq: buildFaq([
    { question: "CC ou HC : quelle différence ?", answer: "CC inclut une provision de charges. HC exclut les charges, refacturées séparément." },
    { question: "Sur quelle base calcule-t-on l'IRL ?", answer: "Sur le loyer hors charges uniquement." },
    { question: "Et le dépôt de garantie ?", answer: "Calculé sur le loyer hors charges (1 ou 2 mois selon meublé/nu)." },
    { question: "Charges forfaitaires en meublé ?", answer: "Possible en meublé, plafonnées à 20 % du loyer HC." },
  ]),
  calculate(input) {
    const loyer = num(input.loyer);
    const charges = num(input.charges);
    const mode = String(input.mode);
    const result = mode === "cc_vers_hc" ? loyer - charges : loyer + charges;
    const label = mode === "cc_vers_hc" ? "Loyer hors charges" : "Loyer charges comprises";
    return {
      summary: `${label} : ${formatCurrency(result)}/mois.`,
      lines: [
        { label, value: formatCurrency(result), highlight: true },
        { label: "Loyer initial", value: formatCurrency(loyer) },
        { label: "Provision charges", value: formatCurrency(charges) },
        { label: "Type de conversion", value: mode === "cc_vers_hc" ? "CC → HC" : "HC → CC" },
      ],
    };
  },
};

export const gestionSimulatorsPart2 = [
  encadrementLoyers,
  depotGarantieLocatif,
  chargesRecuperables,
  revisionLoyerCommercial,
  loyerChargesComprises,
];
