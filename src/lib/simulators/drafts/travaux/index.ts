import type { SimulatorDefinition } from "../../types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import { getMaPrimeRenovForfait } from "@/data/regulations";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";

const isolationCombles: SimulatorDefinition = draftSimulator({
  slug: "simulateur-isolation-combles",
  title: "Isolation des combles",
  shortDescription:
    "Estimez le coût et l'aide MaPrimeRénov' pour l'isolation de vos combles perdus ou aménagés.",
  metaTitle: "Simulateur isolation combles — Coût et MaPrimeRénov'",
  metaDescription:
    "Calculez le budget isolation combles, l'aide MaPrimeRénov' et les économies énergétiques estimées.",
  keywords: ["isolation combles", "MaPrimeRénov combles", "coût isolation combles"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["maprimerenov", "economies-isolation", "simulateur-dpe-apres-travaux"],
  formFields: [
    { key: "surface", label: "Surface combles", type: "number", min: 10, step: 5, suffix: "m²" },
    { key: "prixM2", label: "Prix au m²", type: "number", min: 20, step: 5, suffix: "€/m²" },
    {
      key: "couleur",
      label: "Catégorie de revenus",
      type: "select",
      options: [
        { value: "bleu", label: "Très modestes (bleu)" },
        { value: "jaune", label: "Modestes (jaune)" },
        { value: "violet", label: "Intermédiaires (violet)" },
        { value: "rose", label: "Supérieurs (rose)" },
      ],
    },
  ],
  defaultValues: { surface: 80, prixM2: 45, couleur: "jaune" },
  content: buildContent({
    intro: "L'isolation des combles est le premier geste de rénovation énergétique : jusqu'à 30 % des déperditions passent par le toit.",
    howItWorks: [
      {
        title: "Coût et aide",
        blocks: [
          p("Coût = Surface × Prix/m². MaPrimeRénov' forfait isolation selon catégorie de revenus, plafonné au coût réel."),
          hl("Artisan RGE", "Travaux éligibles uniquement avec un professionnel RGE."),
        ],
      },
    ],
    conseils: ["Priorisez les combles perdus (soufflage ou rouleaux).", "Demandez plusieurs devis RGE.", "Combinez avec l'étanchéité à l'air."],
    limites: ["Forfaits MaPrimeRénov' simplifiés.", "Prix régionaux variables."],
  }),
  faq: buildFaq([
    { question: "Prix isolation combles ?", answer: "25 à 70 €/m² selon méthode (soufflage, panneaux) et accessibilité." },
    { question: "MaPrimeRénov' combles ?", answer: "Forfait de 1 000 à 7 500 € selon revenus, plafonné au coût des travaux." },
    { question: "Combles perdus ou aménagés ?", answer: "Combles perdus : soufflage laine. Aménagés : panneaux ou laine en rouleau sous rampants." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const cout = surface * num(input.prixM2);
    const couleur = String(input.couleur);
    const aide = Math.min(cout, getMaPrimeRenovForfait("isolation", couleur));
    const reste = cout - aide;
    const economie = cout * 0.25;
    return {
      summary: `Coût ${formatCurrency(cout)} — MaPrimeRénov' ${formatCurrency(aide)} — reste ${formatCurrency(reste)}.`,
      lines: [
        { label: "Coût total", value: formatCurrency(cout), highlight: true },
        { label: "Aide MaPrimeRénov'", value: formatCurrency(aide), highlight: true },
        { label: "Reste à charge", value: formatCurrency(reste) },
        { label: "Économie chauffage estimée", value: `${formatCurrency(economie)}/an` },
        { label: "Surface", value: `${formatNumber(surface, 0)} m²` },
      ],
    };
  },
});

const fenetresDoubleVitrage: SimulatorDefinition = draftSimulator({
  slug: "simulateur-fenetres-double-vitrage",
  title: "Fenêtres double vitrage",
  shortDescription:
    "Estimez le budget et les économies d'énergie pour le remplacement de vos fenêtres.",
  metaTitle: "Simulateur fenêtres double vitrage — Budget et économies",
  metaDescription:
    "Calculez le coût du remplacement de fenêtres en double vitrage et les économies sur la facture de chauffage.",
  keywords: ["double vitrage", "remplacement fenêtres", "coût fenêtres"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["economies-isolation", "simulateur-dpe-apres-travaux", "maprimerenov"],
  formFields: [
    { key: "nbFenetres", label: "Nombre de fenêtres", type: "number", min: 1, max: 30, suffix: "" },
    { key: "prixUnitaire", label: "Prix unitaire posé", type: "number", min: 200, step: 50, suffix: "€" },
    { key: "factureChauffage", label: "Facture chauffage annuelle", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { nbFenetres: 6, prixUnitaire: 650, factureChauffage: 1600 },
  content: buildContent({
    intro: "Le remplacement de fenêtres simple vitrage par du double vitrage réduit les déperditions et améliore le confort.",
    howItWorks: [
      {
        title: "Budget et gains",
        blocks: [
          p("Coût total = Nombre × Prix unitaire. Économie chauffage estimée à ~10 % de la facture actuelle."),
          hl("Uw", "Privilégiez Uw ≤ 1,3 W/m².K pour une bonne performance."),
        ],
      },
    ],
    conseils: ["Vérifiez l'état des tableaux et des joints.", "Demandez des devis avec pose incluse.", "Pensez aux volets ou occultants."],
    limites: ["Prix très variables selon matériau (PVC, alu, bois).", "Aides CEE non détaillées ici."],
  }),
  faq: buildFaq([
    { question: "Prix fenêtre double vitrage posée ?", answer: "400 à 1 200 € par fenêtre selon dimensions et matériau." },
    { question: "Économie réelle ?", answer: "5 à 15 % sur la facture de chauffage selon l'état initial." },
    { question: "Aides disponibles ?", answer: "CEE et parfois MaPrimeRénov' en rénovation globale — vérifiez sur france-renov.gouv.fr." },
  ]),
  calculate(input) {
    const nb = num(input.nbFenetres);
    const cout = nb * num(input.prixUnitaire);
    const facture = num(input.factureChauffage);
    const economie = facture * 0.1;
    const roi = economie > 0 ? cout / economie : 0;
    return {
      summary: `Budget ${formatCurrency(cout)} — économie ~${formatCurrency(economie)}/an.`,
      lines: [
        { label: "Coût total", value: formatCurrency(cout), highlight: true },
        { label: "Économie annuelle", value: formatCurrency(economie), highlight: true },
        { label: "Retour sur investissement", value: `${formatNumber(roi, 1)} ans` },
        { label: "Nombre de fenêtres", value: `${nb}` },
        { label: "Prix unitaire", value: formatCurrency(num(input.prixUnitaire)) },
      ],
    };
  },
});

const pompeChaleurAirEau: SimulatorDefinition = draftSimulator({
  slug: "simulateur-pompe-chaleur-air-eau",
  title: "Pompe à chaleur air/eau",
  shortDescription:
    "Estimez le coût, l'aide MaPrimeRénov' et les économies d'une pompe à chaleur air/eau.",
  metaTitle: "Simulateur pompe à chaleur air/eau — Coût et aides",
  metaDescription:
    "Calculez le budget PAC air/eau, l'aide MaPrimeRénov', les économies de chauffage et le retour sur investissement.",
  keywords: ["pompe à chaleur air eau", "PAC budget", "MaPrimeRénov PAC"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["pompe-a-chaleur-economies", "maprimerenov", "simulateur-chaudiere-gaz-condensation"],
  formFields: [
    { key: "coutPac", label: "Coût installation PAC", type: "number", min: 5000, step: 500, suffix: "€" },
    { key: "coutChauffage", label: "Coût chauffage actuel", type: "number", min: 0, step: 100, suffix: "€/an" },
    { key: "scop", label: "SCOP estimé", type: "number", min: 2.5, max: 5, step: 0.1, suffix: "" },
    {
      key: "couleur",
      label: "Catégorie de revenus",
      type: "select",
      options: [
        { value: "bleu", label: "Très modestes (bleu)" },
        { value: "jaune", label: "Modestes (jaune)" },
        { value: "violet", label: "Intermédiaires (violet)" },
        { value: "rose", label: "Supérieurs (rose)" },
      ],
    },
  ],
  defaultValues: { coutPac: 14000, coutChauffage: 2200, scop: 3.5, couleur: "jaune" },
  content: buildContent({
    intro: "La pompe à chaleur air/eau remplace chaudière fioul, gaz ou chauffage électrique avec un rendement élevé.",
    howItWorks: [
      {
        title: "Économies et aide",
        blocks: [
          p("Nouveau coût ≈ Coût actuel / SCOP × 1,3 (électricité). Aide = forfait MaPrimeRénov' PAC plafonné au coût."),
          hl("SCOP", "Viser ≥ 3,5 pour une PAC air/eau performante."),
        ],
      },
    ],
    conseils: ["Vérifiez la compatibilité avec vos émetteurs.", "Artisan RGE obligatoire.", "Combinez avec l'isolation."],
    limites: ["SCOP variable selon climat et installation.", "Devis détaillé indispensable."],
  }),
  faq: buildFaq([
    { question: "MaPrimeRénov' PAC ?", answer: "Forfait de 0 à 5 000 € selon revenus, plafonné au coût des travaux." },
    { question: "PAC et radiateurs existants ?", answer: "Radiateurs basse température ou plancher chauffant recommandés." },
    { question: "Durée de vie ?", answer: "15 à 20 ans avec entretien annuel." },
  ]),
  calculate(input) {
    const cout = num(input.coutPac);
    const actuel = num(input.coutChauffage);
    const scop = num(input.scop);
    const couleur = String(input.couleur);
    const aide = Math.min(cout, getMaPrimeRenovForfait("pac", couleur));
    const nouveau = scop > 0 ? (actuel / scop) * 1.3 : actuel;
    const economie = actuel - nouveau;
    const invest = cout - aide;
    const roi = economie > 0 ? invest / economie : 0;
    return {
      summary: `Aide ${formatCurrency(aide)} — économie ${formatCurrency(economie)}/an — ROI ${formatNumber(roi, 1)} ans.`,
      lines: [
        { label: "Aide MaPrimeRénov'", value: formatCurrency(aide), highlight: true },
        { label: "Économie annuelle", value: formatCurrency(economie), highlight: true },
        { label: "Investissement net", value: formatCurrency(invest) },
        { label: "Retour sur investissement", value: `${formatNumber(roi, 1)} ans` },
        { label: "Nouveau coût chauffage", value: formatCurrency(nouveau) },
      ],
    };
  },
});

const chaudiereGazCondensation: SimulatorDefinition = draftSimulator({
  slug: "simulateur-chaudiere-gaz-condensation",
  title: "Chaudière gaz condensation",
  shortDescription:
    "Estimez le coût, l'aide MaPrimeRénov' et les économies d'une chaudière gaz à condensation.",
  metaTitle: "Simulateur chaudière gaz condensation — Coût et aides",
  metaDescription:
    "Calculez le budget chaudière gaz condensation, l'aide MaPrimeRénov' et les économies sur votre facture gaz.",
  keywords: ["chaudière condensation", "chaudière gaz", "MaPrimeRénov chaudière"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["maprimerenov", "simulateur-pompe-chaleur-air-eau", "estimation-consommation-energie"],
  formFields: [
    { key: "coutChaudiere", label: "Coût chaudière posée", type: "number", min: 3000, step: 500, suffix: "€" },
    { key: "factureGaz", label: "Facture gaz annuelle", type: "number", min: 0, step: 100, suffix: "€" },
    {
      key: "couleur",
      label: "Catégorie de revenus",
      type: "select",
      options: [
        { value: "bleu", label: "Très modestes (bleu)" },
        { value: "jaune", label: "Modestes (jaune)" },
        { value: "violet", label: "Intermédiaires (violet)" },
        { value: "rose", label: "Supérieurs (rose)" },
      ],
    },
  ],
  defaultValues: { coutChaudiere: 5500, factureGaz: 1400, couleur: "jaune" },
  content: buildContent({
    intro: "Une chaudière à condensation récupère la chaleur des fumées et réduit la consommation de 15 à 20 %.",
    howItWorks: [
      {
        title: "Budget et aide",
        blocks: [
          p("Économie estimée à 15 % de la facture gaz. Aide MaPrimeRénov' forfait chaudière selon revenus."),
          hl("Rendement", "Rendement ≥ 92 % pour les modèles performants."),
        ],
      },
    ],
    conseils: ["Entretien annuel obligatoire.", "Artisan RGE pour les aides.", "Évaluez le passage au gaz si vous êtes au fioul."],
    limites: ["Interdiction progressive des chaudières très polluantes.", "Aides variables selon zonage."],
  }),
  faq: buildFaq([
    { question: "MaPrimeRénov' chaudière ?", answer: "Forfait de 0 à 4 000 € selon revenus." },
    { question: "Condensation vs classique ?", answer: "15 à 20 % d'économie grâce à la récupération de chaleur latente." },
    { question: "Chaudière gaz encore autorisée ?", answer: "Oui, mais la rénovation globale est privilégiée — vérifiez la réglementation locale." },
  ]),
  calculate(input) {
    const cout = num(input.coutChaudiere);
    const facture = num(input.factureGaz);
    const couleur = String(input.couleur);
    const aide = Math.min(cout, getMaPrimeRenovForfait("chaudiere", couleur));
    const economie = facture * 0.15;
    const invest = cout - aide;
    const roi = economie > 0 ? invest / economie : 0;
    return {
      summary: `Aide ${formatCurrency(aide)} — économie ${formatCurrency(economie)}/an.`,
      lines: [
        { label: "Coût chaudière", value: formatCurrency(cout), highlight: true },
        { label: "Aide MaPrimeRénov'", value: formatCurrency(aide), highlight: true },
        { label: "Économie annuelle", value: formatCurrency(economie) },
        { label: "Investissement net", value: formatCurrency(invest) },
        { label: "Retour sur investissement", value: `${formatNumber(roi, 1)} ans` },
      ],
    };
  },
});

const panneauxSolairesAutoconsommation: SimulatorDefinition = draftSimulator({
  slug: "simulateur-panneaux-solaires-autoconsommation",
  title: "Panneaux solaires autoconsommation",
  shortDescription:
    "Estimez la production, l'autoconsommation et les économies d'une installation photovoltaïque.",
  metaTitle: "Simulateur panneaux solaires — Autoconsommation",
  metaDescription:
    "Calculez la production solaire, le taux d'autoconsommation et les économies sur votre facture d'électricité.",
  keywords: ["panneaux solaires", "autoconsommation", "photovoltaïque"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["estimation-consommation-energie", "simulateur-renovation-energetique-globale", "maprimerenov"],
  formFields: [
    { key: "puissance", label: "Puissance installée", type: "number", min: 1, max: 20, step: 0.5, suffix: "kWc" },
    { key: "consommation", label: "Consommation annuelle", type: "number", min: 1000, step: 500, suffix: "kWh" },
    { key: "prixKwh", label: "Prix électricité", type: "number", min: 0.1, max: 0.5, step: 0.01, suffix: "€/kWh" },
    { key: "tauxAutoconso", label: "Taux autoconsommation", type: "number", min: 20, max: 80, step: 5, suffix: "%" },
  ],
  defaultValues: { puissance: 6, consommation: 4500, prixKwh: 0.25, tauxAutoconso: 45 },
  content: buildContent({
    intro: "L'autoconsommation solaire permet de consommer directement l'électricité produite et de réduire la facture.",
    howItWorks: [
      {
        title: "Production et économies",
        blocks: [
          p("Production ≈ Puissance × 1 000 kWh/an (France métropolitaine). Économie = Production × Taux autoconsommation × Prix kWh."),
          hl("Surplus", "Le surplus peut être revendu (obligation d'achat) ou stocké (batterie)."),
        ],
      },
    ],
    conseils: ["Orientez au sud sans ombrage.", "Dimensionnez selon votre consommation diurne.", "Comparez devis avec garantie de production."],
    limites: ["Production variable selon région et inclinaison.", "Prime autoconsommation non détaillée."],
  }),
  faq: buildFaq([
    { question: "Production moyenne en France ?", answer: "900 à 1 200 kWh par kWc installé et par an." },
    { question: "Autoconsommation sans revente ?", answer: "Possible — le surplus est perdu ou stocké en batterie." },
    { question: "Rentabilité ?", answer: "8 à 12 ans en autoconsommation selon installation et consommation." },
  ]),
  calculate(input) {
    const puissance = num(input.puissance);
    const conso = num(input.consommation);
    const prix = num(input.prixKwh);
    const taux = num(input.tauxAutoconso) / 100;
    const production = puissance * 1000;
    const autoconsomme = production * taux;
    const economie = autoconsomme * prix;
    const couverture = conso > 0 ? (autoconsomme / conso) * 100 : 0;
    return {
      summary: `Production ~${formatNumber(production, 0)} kWh — économie ${formatCurrency(economie)}/an.`,
      lines: [
        { label: "Production annuelle", value: `${formatNumber(production, 0)} kWh`, highlight: true },
        { label: "Économie annuelle", value: formatCurrency(economie), highlight: true },
        { label: "Autoconsommation", value: `${formatNumber(autoconsomme, 0)} kWh` },
        { label: "Couverture conso", value: formatPercent(couverture, 0) },
        { label: "Puissance", value: `${puissance} kWc` },
      ],
    };
  },
});

const renovationEnergetiqueGlobale: SimulatorDefinition = draftSimulator({
  slug: "simulateur-renovation-energetique-globale",
  title: "Rénovation énergétique globale",
  shortDescription:
    "Estimez le budget total et les aides MaPrimeRénov' pour une rénovation globale performante.",
  metaTitle: "Simulateur rénovation énergétique globale — Budget et aides",
  metaDescription:
    "Calculez le coût d'une rénovation globale (isolation, PAC, menuiseries) et le cumul des aides MaPrimeRénov'.",
  keywords: ["rénovation globale", "rénovation énergétique", "MaPrimeRénov' cumul"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["maprimerenov", "simulateur-eco-ptz-travaux", "simulateur-dpe-apres-travaux"],
  formFields: [
    { key: "coutIsolation", label: "Coût isolation", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "coutPac", label: "Coût PAC ou chaudière", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "coutMenuiseries", label: "Coût menuiseries", type: "number", min: 0, step: 500, suffix: "€" },
    {
      key: "couleur",
      label: "Catégorie de revenus",
      type: "select",
      options: [
        { value: "bleu", label: "Très modestes (bleu)" },
        { value: "jaune", label: "Modestes (jaune)" },
        { value: "violet", label: "Intermédiaires (violet)" },
        { value: "rose", label: "Supérieurs (rose)" },
      ],
    },
    {
      key: "travauxChauffage",
      label: "Chauffage installé",
      type: "select",
      options: [
        { value: "pac", label: "Pompe à chaleur" },
        { value: "chaudiere", label: "Chaudière performante" },
      ],
    },
  ],
  defaultValues: { coutIsolation: 8000, coutPac: 14000, coutMenuiseries: 5000, couleur: "jaune", travauxChauffage: "pac" },
  content: buildContent({
    intro: "La rénovation globale combine plusieurs gestes (isolation, chauffage, menuiseries) pour un gain énergétique significatif.",
    howItWorks: [
      {
        title: "Cumul des aides",
        blocks: [
          p("Aide isolation + aide chauffage (PAC ou chaudière), chacune plafonnée au coût réel. Bonus rénovation globale possible selon gain DPE."),
          hl("Audit", "Un audit énergétique est souvent requis pour la rénovation globale."),
        ],
      },
    ],
    conseils: ["Planifiez les travaux dans l'ordre : isolation puis chauffage.", "Un seul dossier MaPrimeRénov' pour le parcours accompagné.", "Accompagnement France Rénov' recommandé."],
    limites: ["Forfaits simplifiés — barème officiel sur france-renov.gouv.fr.", "Menuiseries : aides CEE non incluses."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'une rénovation globale ?", answer: "Au moins deux gestes d'isolation + changement de chauffage pour un gain ≥ 35 % ou 2 classes DPE." },
    { question: "Cumul MaPrimeRénov' ?", answer: "Oui, forfaits cumulables par type de travaux dans la limite du coût réel." },
    { question: "Éco-PTZ cumulable ?", answer: "Oui, le prêt à taux zéro peut financer le reste à charge." },
  ]),
  calculate(input) {
    const iso = num(input.coutIsolation);
    const chauffage = num(input.coutPac);
    const menuiseries = num(input.coutMenuiseries);
    const couleur = String(input.couleur);
    const typeChauffage = String(input.travauxChauffage);
    const aideIso = Math.min(iso, getMaPrimeRenovForfait("isolation", couleur));
    const aideChauffage = Math.min(chauffage, getMaPrimeRenovForfait(typeChauffage, couleur));
    const totalCout = iso + chauffage + menuiseries;
    const totalAide = aideIso + aideChauffage;
    const reste = totalCout - totalAide;
    return {
      summary: `Budget ${formatCurrency(totalCout)} — aides ${formatCurrency(totalAide)} — reste ${formatCurrency(reste)}.`,
      lines: [
        { label: "Coût total travaux", value: formatCurrency(totalCout), highlight: true },
        { label: "Total aides MaPrimeRénov'", value: formatCurrency(totalAide), highlight: true },
        { label: "Reste à charge", value: formatCurrency(reste) },
        { label: "Aide isolation", value: formatCurrency(aideIso) },
        { label: "Aide chauffage", value: formatCurrency(aideChauffage) },
      ],
    };
  },
});

const aideAnahHabiterMieux: SimulatorDefinition = draftSimulator({
  slug: "simulateur-aide-anah-habiter-mieux",
  title: "Aide ANAH Habiter Mieux",
  shortDescription:
    "Estimez l'aide ANAH Habiter Mieux pour vos travaux de rénovation énergétique ou d'adaptation.",
  metaTitle: "Simulateur aide ANAH Habiter Mieux — Subvention travaux",
  metaDescription:
    "Calculez l'aide ANAH Habiter Mieux (ou Habiter Mieux Sérénité) selon vos revenus et le coût des travaux.",
  keywords: ["ANAH", "Habiter Mieux", "aide travaux logement"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["maprimerenov", "simulateur-renovation-energetique-globale", "simulateur-eco-ptz-travaux"],
  formFields: [
    { key: "coutTravaux", label: "Coût des travaux HT", type: "number", min: 1000, step: 500, suffix: "€" },
    {
      key: "profil",
      label: "Profil ménage",
      type: "select",
      options: [
        { value: "tmo", label: "Très modestes (35 %)" },
        { value: "mo", label: "Modestes (25 %)" },
        { value: "inter", label: "Intermédiaires (15 %)" },
        { value: "sup", label: "Supérieurs (0 %)" },
      ],
    },
  ],
  defaultValues: { coutTravaux: 25000, profil: "mo" },
  content: buildContent({
    intro: "L'ANAH finance une part des travaux de rénovation pour les propriétaires occupants ou bailleurs selon les revenus.",
    howItWorks: [
      {
        title: "Taux de subvention",
        blocks: [
          p("Aide = Coût HT × Taux selon profil. Plafonds de dépenses éligibles selon type de travaux."),
          hl("Cumul", "Cumulable avec MaPrimeRénov' dans certaines conditions."),
        ],
      },
    ],
    conseils: ["Déposez le dossier avant le début des travaux.", "Travaux par entreprises qualifiées.", "Conservez factures et attestations."],
    limites: ["Taux indicatifs Habiter Mieux Sérénité.", "Plafonds de dépenses non détaillés."],
  }),
  faq: buildFaq([
    { question: "Qui peut en bénéficier ?", answer: "Propriétaires occupants ou bailleurs, logement de plus de 15 ans en général." },
    { question: "Cumul avec MaPrimeRénov' ?", answer: "Oui, sous conditions — l'aide totale ne dépasse pas le coût des travaux." },
    { question: "Délai de réponse ?", answer: "Accord de principe sous 2 à 3 mois après dossier complet." },
  ]),
  calculate(input) {
    const cout = num(input.coutTravaux);
    const tauxMap: Record<string, number> = { tmo: 0.35, mo: 0.25, inter: 0.15, sup: 0 };
    const profil = String(input.profil);
    const taux = tauxMap[profil] ?? 0;
    const aide = cout * taux;
    const reste = cout - aide;
    return {
      summary: `Aide ANAH estimée : ${formatCurrency(aide)} (${formatPercent(taux * 100, 0)}).`,
      lines: [
        { label: "Aide ANAH", value: formatCurrency(aide), highlight: true },
        { label: "Reste à charge", value: formatCurrency(reste), highlight: true },
        { label: "Coût travaux HT", value: formatCurrency(cout) },
        { label: "Taux appliqué", value: formatPercent(taux * 100, 0) },
        { label: "Profil", value: profil.toUpperCase() },
      ],
    };
  },
});

const ecoPtzTravaux: SimulatorDefinition = draftSimulator({
  slug: "simulateur-eco-ptz-travaux",
  title: "Éco-PTZ travaux",
  shortDescription:
    "Estimez le montant du prêt à taux zéro rénovation (éco-PTZ) pour financer vos travaux.",
  metaTitle: "Simulateur éco-PTZ — Prêt travaux taux zéro",
  metaDescription:
    "Calculez le montant de l'éco-PTZ selon le coût des travaux, vos revenus et la zone géographique.",
  keywords: ["éco-PTZ", "prêt travaux taux zéro", "PTZ rénovation"],
  domain: "travaux",
  category: "energie",
  icon: "wallet",
  regulationIds: ["ptz"],
  relatedSlugs: ["pret-taux-zero-ptz", "maprimerenov", "simulateur-renovation-energetique-globale"],
  formFields: [
    { key: "coutTravaux", label: "Coût des travaux", type: "number", min: 1000, step: 1000, suffix: "€" },
    { key: "revenuFiscal", label: "Revenu fiscal de référence", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "zone",
      label: "Zone géographique",
      type: "select",
      options: [
        { value: "A", label: "Zone A" },
        { value: "Abis", label: "Zone Abis (Paris)" },
        { value: "B1", label: "Zone B1" },
        { value: "B2", label: "Zone B2" },
        { value: "C", label: "Zone C" },
      ],
    },
  ],
  defaultValues: { coutTravaux: 30000, revenuFiscal: 35000, zone: "B1" },
  content: buildContent({
    intro: "L'éco-PTZ permet de financer des travaux de rénovation énergétique sans intérêts, remboursable sur 15 à 20 ans.",
    howItWorks: [
      {
        title: "Montant du prêt",
        blocks: [
          p("Montant = min(Coût travaux, 50 000 €) si travaux éligibles. Pas de plafond de revenus pour l'éco-PTZ classique."),
          hl("Travaux", "Au moins deux gestes d'isolation ou un bouquet performant requis."),
        ],
      },
    ],
    conseils: ["Montez le dossier avec votre banque.", "Cumulez avec MaPrimeRénov' et CEE.", "Travaux par artisan RGE."],
    limites: ["Plafond 50 000 € pour éco-PTZ classique.", "Conditions d'éligibilité des travaux non exhaustives."],
  }),
  faq: buildFaq([
    { question: "Plafond éco-PTZ ?", answer: "50 000 € pour le parcours classique, 30 000 € pour le parcours accompagné." },
    { question: "Conditions de revenus ?", answer: "Pas de plafond de revenus pour l'éco-PTZ rénovation (depuis 2021)." },
    { question: "Durée de remboursement ?", answer: "15 ans (rénovation performante) ou 20 ans (rénovation globale)." },
  ]),
  calculate(input) {
    const cout = num(input.coutTravaux);
    const plafondEcoPtz = 50000;
    const montant = Math.min(cout, plafondEcoPtz);
    const mensualite15 = montant / (15 * 12);
    const mensualite20 = montant / (20 * 12);
    return {
      summary: `Éco-PTZ estimé : ${formatCurrency(montant)} — ${formatCurrency(mensualite15)}/mois sur 15 ans.`,
      lines: [
        { label: "Montant éco-PTZ", value: formatCurrency(montant), highlight: true },
        { label: "Mensualité 15 ans", value: `${formatCurrency(mensualite15)}/mois`, highlight: true },
        { label: "Mensualité 20 ans", value: `${formatCurrency(mensualite20)}/mois` },
        { label: "Coût travaux", value: formatCurrency(cout) },
        { label: "Intérêts", value: "0 € (taux zéro)" },
      ],
    };
  },
});

const dpeApresTravaux: SimulatorDefinition = draftSimulator({
  slug: "simulateur-dpe-apres-travaux",
  title: "DPE après travaux",
  shortDescription:
    "Estimez la classe DPE après vos travaux de rénovation énergétique.",
  metaTitle: "Simulateur DPE après travaux — Gain énergétique",
  metaDescription:
    "Estimez la nouvelle classe DPE et la consommation kWh/m²/an après isolation, changement de chauffage ou menuiseries.",
  keywords: ["DPE après travaux", "gain DPE", "classe énergie"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["estimation-consommation-energie", "economies-isolation", "simulateur-renovation-energetique-globale"],
  formFields: [
    { key: "kwhActuel", label: "Consommation actuelle", type: "number", min: 50, step: 10, suffix: "kWh/m²/an" },
    {
      key: "travaux",
      label: "Travaux réalisés",
      type: "select",
      options: [
        { value: "combles", label: "Isolation combles (−15 %)" },
        { value: "murs", label: "Isolation murs (−10 %)" },
        { value: "pac", label: "PAC (−20 %)" },
        { value: "globale", label: "Rénovation globale (−40 %)" },
      ],
    },
  ],
  defaultValues: { kwhActuel: 280, travaux: "combles" },
  content: buildContent({
    intro: "Les travaux de rénovation améliorent la classe DPE en réduisant les kWh/m²/an consommés.",
    howItWorks: [
      {
        title: "Estimation du gain",
        blocks: [
          p("Nouvelle conso = Conso actuelle × (1 − Réduction). Classe DPE estimée selon seuils réglementaires."),
          hl("Seuils", "A ≤ 70, B ≤ 110, C ≤ 180, D ≤ 250, E ≤ 330, F ≤ 420, G > 420 kWh/m²/an."),
        ],
      },
    ],
    conseils: ["Faites réaliser un DPE officiel après travaux.", "L'audit énergétique précise le gain attendu.", "Conservez les attestations RGE."],
    limites: ["Estimation simplifiée — le DPE officiel intègre plus de paramètres.", "Seuils DPE 2021 réformés."],
  }),
  faq: buildFaq([
    { question: "Gain DPE isolation combles ?", answer: "Souvent +1 à 2 classes selon l'état initial." },
    { question: "DPE obligatoire après travaux ?", answer: "Non, mais recommandé pour valoriser le bien et vérifier le gain." },
    { question: "Passoire thermique ?", answer: "Logements F ou G — interdiction progressive de location depuis 2025." },
  ]),
  calculate(input) {
    const actuel = num(input.kwhActuel);
    const reducMap: Record<string, number> = { combles: 0.15, murs: 0.1, pac: 0.2, globale: 0.4 };
    const travaux = String(input.travaux);
    const reduc = reducMap[travaux] ?? 0.15;
    const nouveau = actuel * (1 - reduc);
    const classe = (kwh: number) => {
      if (kwh <= 70) return "A";
      if (kwh <= 110) return "B";
      if (kwh <= 180) return "C";
      if (kwh <= 250) return "D";
      if (kwh <= 330) return "E";
      if (kwh <= 420) return "F";
      return "G";
    };
    const classeActuelle = classe(actuel);
    const classeNouvelle = classe(nouveau);
    return {
      summary: `DPE estimé : ${classeActuelle} → ${classeNouvelle} (${formatNumber(nouveau, 0)} kWh/m²/an).`,
      lines: [
        { label: "Classe DPE estimée", value: classeNouvelle, highlight: true },
        { label: "Classe actuelle", value: classeActuelle },
        { label: "Consommation estimée", value: `${formatNumber(nouveau, 0)} kWh/m²/an`, highlight: true },
        { label: "Consommation actuelle", value: `${formatNumber(actuel, 0)} kWh/m²/an` },
        { label: "Réduction", value: formatPercent(reduc * 100, 0) },
      ],
    };
  },
});

export const travauxDrafts: SimulatorDefinition[] = [
  isolationCombles,
  fenetresDoubleVitrage,
  pompeChaleurAirEau,
  chaudiereGazCondensation,
  panneauxSolairesAutoconsommation,
  renovationEnergetiqueGlobale,
  aideAnahHabiterMieux,
  ecoPtzTravaux,
  dpeApresTravaux,
];
