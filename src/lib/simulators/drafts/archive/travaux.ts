import type { SimulatorDefinition } from "../../types";
import { formatNumber, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";

const surfaceMurPeinture: SimulatorDefinition = draftSimulator({
  slug: "simulateur-surface-mur-peinture",
  title: "Surface murs à peindre",
  shortDescription:
    "Calculez la surface de murs et plafonds à peindre en déduisant portes et fenêtres.",
  metaTitle: "Calculateur surface murs peinture — m² à peindre",
  metaDescription:
    "Estimez la surface totale de murs et plafonds à peindre selon les dimensions de la pièce et les ouvertures.",
  keywords: ["surface murs peinture", "m² peinture", "calcul surface peinture"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["quantite-peinture", "volume-surface-piece", "simulateur-quantite-enduit"],
  formFields: [
    { key: "longueur", label: "Longueur pièce", type: "number", min: 1, step: 0.1, suffix: "m" },
    { key: "largeur", label: "Largeur pièce", type: "number", min: 1, step: 0.1, suffix: "m" },
    { key: "hauteur", label: "Hauteur sous plafond", type: "number", min: 2, step: 0.05, suffix: "m" },
    { key: "nbPortes", label: "Nombre de portes", type: "number", min: 0, max: 10, suffix: "" },
    { key: "nbFenetres", label: "Nombre de fenêtres", type: "number", min: 0, max: 10, suffix: "" },
    { key: "peindrePlafond", label: "Inclure plafond (1=oui)", type: "number", min: 0, max: 1, suffix: "" },
  ],
  defaultValues: { longueur: 5, largeur: 4, hauteur: 2.5, nbPortes: 1, nbFenetres: 2, peindrePlafond: 1 },
  content: buildContent({
    intro: "Calculer la surface exacte à peindre évite le surachat ou le sous-estimation de peinture.",
    howItWorks: [
      {
        title: "Surface murs",
        blocks: [
          p("Murs = 2 × (L + l) × H − (Portes × 2 m²) − (Fenêtres × 1,5 m²). Plafond = L × l si inclus."),
          hl("Ouvertures", "Porte standard ~2 m², fenêtre ~1,5 m²."),
        ],
      },
    ],
    conseils: ["Mesurez chaque pièce séparément.", "Prévoyez 10 % de marge pour les retouches.", "Comptez 2 couches minimum."],
    limites: ["Pièce rectangulaire uniquement.", "Ouvertures de taille standard."],
  }),
  faq: buildFaq([
    { question: "Surface porte standard ?", answer: "Environ 2 m² (0,90 × 2,10 m)." },
    { question: "Inclure le plafond ?", answer: "Oui pour une peinture complète — surface = L × l." },
    { question: "Pièce en L ?", answer: "Divisez en rectangles et additionnez." },
  ]),
  calculate(input) {
    const l = num(input.longueur);
    const w = num(input.largeur);
    const h = num(input.hauteur);
    const murs = 2 * (l + w) * h;
    const ouvertures = num(input.nbPortes) * 2 + num(input.nbFenetres) * 1.5;
    const mursNet = Math.max(0, murs - ouvertures);
    const plafond = num(input.peindrePlafond) >= 1 ? l * w : 0;
    const total = mursNet + plafond;
    return {
      summary: `Surface à peindre : ${formatNumber(total, 1)} m² (murs ${formatNumber(mursNet, 1)} m²).`,
      lines: [
        { label: "Surface totale", value: `${formatNumber(total, 1)} m²`, highlight: true },
        { label: "Surface murs", value: `${formatNumber(mursNet, 1)} m²`, highlight: true },
        { label: "Surface plafond", value: `${formatNumber(plafond, 1)} m²` },
        { label: "Ouvertures déduites", value: `${formatNumber(ouvertures, 1)} m²` },
        { label: "Dimensions", value: `${l} × ${w} × ${h} m` },
      ],
    };
  },
});

const quantiteEnduit: SimulatorDefinition = draftSimulator({
  slug: "simulateur-quantite-enduit",
  title: "Quantité d'enduit",
  shortDescription:
    "Estimez la quantité d'enduit en sacs pour vos murs intérieurs ou extérieurs.",
  metaTitle: "Calculateur quantité enduit — Sac et kg",
  metaDescription:
    "Calculez la quantité d'enduit en kg et en sacs selon la surface à traiter et l'épaisseur souhaitée.",
  keywords: ["quantité enduit", "calcul enduit", "enduit façade"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["quantite-mortier", "simulateur-surface-mur-peinture", "simulateur-cloison-placo"],
  formFields: [
    { key: "surface", label: "Surface à enduire", type: "number", min: 1, step: 5, suffix: "m²" },
    { key: "epaisseur", label: "Épaisseur moyenne", type: "number", min: 0.5, max: 3, step: 0.5, suffix: "cm" },
    { key: "rendement", label: "Rendement produit", type: "number", min: 1, max: 2, step: 0.1, suffix: "kg/m²/cm" },
  ],
  defaultValues: { surface: 40, epaisseur: 1, rendement: 1.5 },
  content: buildContent({
    intro: "L'enduit protège et lisse les murs — le dosage dépend de la surface, de l'épaisseur et du type de produit.",
    howItWorks: [
      {
        title: "Quantité",
        blocks: [
          p("Kg = Surface × Épaisseur (cm) × Rendement. Sacs = Kg / 25, arrondi au supérieur."),
          hl("Rendement", "Comptez 1,5 kg/m²/cm pour enduit traditionnel."),
        ],
      },
    ],
    conseils: ["Préparez le support (propre, sec, dépoussiéré).", "Respectez les temps de séchage entre couches.", "Achetez 10 % de marge."],
    limites: ["Rendement variable selon support et produit.", "Enduit décoratif vs ragréage : dosages différents."],
  }),
  faq: buildFaq([
    { question: "Épaisseur enduit intérieur ?", answer: "0,5 à 1 cm pour lissage, jusqu'à 2 cm pour reprise." },
    { question: "Sacs standard ?", answer: "25 kg pour enduit en poudre." },
    { question: "Enduit prêt à l'emploi ?", answer: "Seaux de 25 kg — rendement similaire, plus pratique pour petites surfaces." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const ep = num(input.epaisseur);
    const rend = num(input.rendement);
    const kg = surface * ep * rend;
    const sacs = Math.ceil(kg / 25);
    const avecMarge = kg * 1.1;
    return {
      summary: `${formatNumber(avecMarge, 0)} kg — ${Math.ceil(avecMarge / 25)} sacs de 25 kg.`,
      lines: [
        { label: "Quantité (+10 %)", value: `${formatNumber(avecMarge, 0)} kg`, highlight: true },
        { label: "Sacs 25 kg", value: `${Math.ceil(avecMarge / 25)}`, highlight: true },
        { label: "Quantité brute", value: `${formatNumber(kg, 0)} kg` },
        { label: "Surface", value: `${formatNumber(surface, 0)} m²` },
        { label: "Épaisseur", value: `${ep} cm` },
      ],
    };
  },
});

const dalleBetonArme: SimulatorDefinition = draftSimulator({
  slug: "simulateur-dalle-beton-arme",
  title: "Dalle béton armé",
  shortDescription:
    "Calculez le volume de béton et la quantité d'acier pour une dalle armée.",
  metaTitle: "Calculateur dalle béton armé — Volume et acier",
  metaDescription:
    "Estimez le volume de béton en m³ et la quantité d'armatures en kg pour votre dalle béton armé.",
  keywords: ["dalle béton armé", "volume béton", "calcul acier dalle"],
  domain: "travaux",
  category: "materiaux",
  icon: "building",
  relatedSlugs: ["volume-beton", "simulateur-quantite-enduit", "calcul-carrelage"],
  formFields: [
    { key: "longueur", label: "Longueur dalle", type: "number", min: 1, step: 0.1, suffix: "m" },
    { key: "largeur", label: "Largeur dalle", type: "number", min: 1, step: 0.1, suffix: "m" },
    { key: "epaisseur", label: "Épaisseur", type: "number", min: 0.1, max: 0.5, step: 0.01, suffix: "m" },
    { key: "kgAcierM3", label: "Dosage acier", type: "number", min: 50, max: 150, step: 10, suffix: "kg/m³" },
  ],
  defaultValues: { longueur: 6, largeur: 4, epaisseur: 0.15, kgAcierM3: 80 },
  content: buildContent({
    intro: "Une dalle béton armé nécessite le bon volume de béton et un ferraillage adapté à la charge.",
    howItWorks: [
      {
        title: "Volume et acier",
        blocks: [
          p("Volume = L × l × épaisseur. Acier ≈ Volume × Dosage (80 kg/m³ courant pour dalle maison)."),
          hl("Treillis", "Treillis ST25 ou ST35 selon portée et charge."),
        ],
      },
    ],
    conseils: ["Prévoyez 5 % de marge béton.", "Respectez l'enrobage (3 cm minimum).", "Vibration ou reglage pour éviter les nids d'abeille."],
    limites: ["Calcul simplifié — étude de structure pour charges lourdes.", "Ferraillage détaillé non calculé."],
  }),
  faq: buildFaq([
    { question: "Épaisseur dalle maison ?", answer: "12 à 15 cm pour dalle sur terre-plein, 15 à 20 cm si charges lourdes." },
    { question: "Treillis ou barres ?", answer: "Treillis soudé courant pour dalles résidentielles." },
    { question: "Dosage acier ?", answer: "60 à 100 kg/m³ selon sollicitations." },
  ]),
  calculate(input) {
    const l = num(input.longueur);
    const w = num(input.largeur);
    const ep = num(input.epaisseur);
    const volume = l * w * ep;
    const volumeMarge = volume * 1.05;
    const acier = volume * num(input.kgAcierM3);
    const sacs = Math.ceil(volumeMarge * 50);
    return {
      summary: `Volume ${formatNumber(volumeMarge, 2)} m³ — acier ~${formatNumber(acier, 0)} kg.`,
      lines: [
        { label: "Volume béton (+5 %)", value: `${formatNumber(volumeMarge, 2)} m³`, highlight: true },
        { label: "Acier estimé", value: `${formatNumber(acier, 0)} kg`, highlight: true },
        { label: "Volume brut", value: `${formatNumber(volume, 2)} m³` },
        { label: "Sacs 35 L estimés", value: `${sacs}` },
        { label: "Dimensions", value: `${l} × ${w} × ${ep} m` },
      ],
    };
  },
});

const escalierDimension: SimulatorDefinition = draftSimulator({
  slug: "simulateur-escalier-dimension",
  title: "Dimensions escalier",
  shortDescription:
    "Calculez la hauteur, profondeur et nombre de marches d'un escalier confortable.",
  metaTitle: "Calculateur dimensions escalier — Marches et giron",
  metaDescription:
    "Dimensionnez un escalier : hauteur de marche (hauteur), profondeur (giron) et nombre de marches selon Blondel.",
  keywords: ["dimensions escalier", "calcul marches", "formule Blondel"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["volume-surface-piece", "simulateur-dalle-beton-arme", "surface-parquet"],
  formFields: [
    { key: "hauteurTotale", label: "Hauteur à monter", type: "number", min: 2, max: 4, step: 0.01, suffix: "m" },
    { key: "longueurDisponible", label: "Longueur disponible", type: "number", min: 2, max: 6, step: 0.1, suffix: "m" },
  ],
  defaultValues: { hauteurTotale: 2.7, longueurDisponible: 4 },
  content: buildContent({
    intro: "Un escalier confortable respecte la formule de Blondel : 2 × hauteur de marche + giron = 62 à 64 cm.",
    howItWorks: [
      {
        title: "Formule de Blondel",
        blocks: [
          p("Nombre de marches = Hauteur totale / Hauteur marche (17 cm standard). Giron = Longueur / (Marches − 1)."),
          hl("Confort", "Hauteur marche 17 cm, giron 28 cm — valeur Blondel ≈ 62 cm."),
        ],
      },
    ],
    conseils: ["Première et dernière marche : attention au palier.", "Largeur mini 80 cm (90 cm confortable).", "Main courante obligatoire."],
    limites: ["Escalier droit uniquement.", "Normes ERP et escape non couvertes."],
  }),
  faq: buildFaq([
    { question: "Hauteur de marche standard ?", answer: "16 à 18 cm — 17 cm le plus courant." },
    { question: "Qu'est-ce que le giron ?", answer: "Profondeur de la marche (partie où on pose le pied)." },
    { question: "Formule de Blondel ?", answer: "2h + g = 62 à 64 cm pour un escalier confortable." },
  ]),
  calculate(input) {
    const hTot = num(input.hauteurTotale);
    const long = num(input.longueurDisponible);
    const hMarche = 0.17;
    const nbMarches = Math.ceil(hTot / hMarche);
    const hMarcheReelle = hTot / nbMarches;
    const nbContremarches = nbMarches - 1;
    const giron = nbContremarches > 0 ? long / nbContremarches : 0;
    const blondel = 2 * hMarcheReelle * 100 + giron * 100;
    const confort = blondel >= 62 && blondel <= 64;
    return {
      summary: `${nbMarches} marches — h ${formatNumber(hMarcheReelle * 100, 1)} cm, giron ${formatNumber(giron * 100, 1)} cm.`,
      lines: [
        { label: "Nombre de marches", value: `${nbMarches}`, highlight: true },
        { label: "Hauteur de marche", value: `${formatNumber(hMarcheReelle * 100, 1)} cm`, highlight: true },
        { label: "Giron", value: `${formatNumber(giron * 100, 1)} cm` },
        { label: "Blondel (2h+g)", value: `${formatNumber(blondel, 1)} cm` },
        { label: "Confort", value: confort ? "Conforme" : "À ajuster" },
      ],
    };
  },
});

const cloisonPlaco: SimulatorDefinition = draftSimulator({
  slug: "simulateur-cloison-placo",
  title: "Cloison placo",
  shortDescription:
    "Estimez le nombre de plaques, montants et vis pour une cloison en placo.",
  metaTitle: "Calculateur cloison placo — Plaques et montants",
  metaDescription:
    "Calculez la quantité de plaques BA13, montants métalliques et vis pour votre cloison placo.",
  keywords: ["cloison placo", "quantité placo", "montants placo"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["volume-surface-piece", "simulateur-surface-mur-peinture", "quantite-peinture"],
  formFields: [
    { key: "longueur", label: "Longueur cloison", type: "number", min: 1, step: 0.1, suffix: "m" },
    { key: "hauteur", label: "Hauteur", type: "number", min: 2, max: 3.5, step: 0.05, suffix: "m" },
    { key: "faces", label: "Nombre de faces", type: "number", min: 1, max: 2, suffix: "" },
  ],
  defaultValues: { longueur: 4, hauteur: 2.5, faces: 2 },
  content: buildContent({
    intro: "Une cloison placo standard utilise des montants M48 tous les 60 cm et des plaques BA13.",
    howItWorks: [
      {
        title: "Quantités",
        blocks: [
          p("Surface = Longueur × Hauteur × Faces. Plaques (2,5×1,2 m) = Surface / 3 m². Montants = Longueur / 0,6 + 2 montants de rive."),
          hl("Isolation", "Laine entre montants si isolation phonique souhaitée."),
        ],
      },
    ],
    conseils: ["Utilisez niveau laser pour l'alignement.", "Vis tous les 25 cm sur montants.", "Jointoiement avant peinture."],
    limites: ["Cloison simple non portante.", "Cloison coupe-feu : specs différentes."],
  }),
  faq: buildFaq([
    { question: "Plaque BA13 ?", answer: "Plaque de plâtre 13 mm — standard cloisons sèches." },
    { question: "Entraxe montants ?", answer: "60 cm en standard, 40 cm pour renfort (porte lourde)." },
    { question: "Isolation phonique ?", answer: "Laine minérale 45 mm entre montants + double plaque possible." },
  ]),
  calculate(input) {
    const l = num(input.longueur);
    const h = num(input.hauteur);
    const faces = num(input.faces);
    const surface = l * h * faces;
    const surfacePlaque = 2.5 * 1.2;
    const plaques = Math.ceil(surface / surfacePlaque);
    const montants = Math.ceil(l / 0.6) + 2;
    const vis = Math.ceil(surface * 12);
    return {
      summary: `${plaques} plaques — ${montants} montants — ${vis} vis.`,
      lines: [
        { label: "Plaques BA13", value: `${plaques}`, highlight: true },
        { label: "Montants M48", value: `${montants}`, highlight: true },
        { label: "Surface totale", value: `${formatNumber(surface, 1)} m²` },
        { label: "Vis estimées", value: `${vis}` },
        { label: "Dimensions", value: `${l} × ${h} m (${faces} face(s))` },
      ],
    };
  },
});

const toitureSurface: SimulatorDefinition = draftSimulator({
  slug: "simulateur-toiture-surface",
  title: "Surface toiture",
  shortDescription:
    "Calculez la surface de toiture inclinée à partir de l'emprise au sol et de la pente.",
  metaTitle: "Calculateur surface toiture — Pente et surface réelle",
  metaDescription:
    "Estimez la surface réelle de toiture selon l'emprise au sol, la pente et le type de couverture.",
  keywords: ["surface toiture", "calcul toiture", "pente toit"],
  domain: "travaux",
  category: "materiaux",
  icon: "building",
  relatedSlugs: ["simulateur-gouttiere-longueur", "economies-isolation", "simulateur-isolation-combles"],
  formFields: [
    { key: "longueur", label: "Longueur au sol", type: "number", min: 3, step: 0.5, suffix: "m" },
    { key: "largeur", label: "Largeur au sol", type: "number", min: 3, step: 0.5, suffix: "m" },
    { key: "pente", label: "Pente toiture", type: "number", min: 15, max: 60, step: 5, suffix: "%" },
  ],
  defaultValues: { longueur: 10, largeur: 8, pente: 35 },
  content: buildContent({
    intro: "La surface de toiture réelle est supérieure à l'emprise au sol à cause de la pente.",
    howItWorks: [
      {
        title: "Surface inclinée",
        blocks: [
          p("Facteur pente = √(1 + (pente/100)²). Surface toit = Emprise × Facteur (toit à 2 pentes simplifié)."),
          hl("Pente", "35 % (~19°) courant en France — tuiles ou ardoises."),
        ],
      },
    ],
    conseils: ["Ajoutez 10 % pour rives et débords.", "Comptez les noues et arêtiers séparément.", "Vérifiez la charge admissible."],
    limites: ["Toit simple à 2 pentes.", "Formes complexes (mansarde, pyramide) non modélisées."],
  }),
  faq: buildFaq([
    { question: "Pente toiture standard ?", answer: "30 à 45 % selon couverture (tuiles, ardoises)." },
    { question: "Surface vs emprise ?", answer: "Surface toit > emprise sol — facteur 1,1 à 1,3 selon pente." },
    { question: "Isolation toiture ?", answer: "Par l'intérieur (sous rampants) ou par l'extérieur (sarking)." },
  ]),
  calculate(input) {
    const emprise = num(input.longueur) * num(input.largeur);
    const pentePct = num(input.pente) / 100;
    const facteur = Math.sqrt(1 + pentePct * pentePct);
    const surface = emprise * facteur;
    const avecMarge = surface * 1.1;
    return {
      summary: `Surface toiture ~${formatNumber(avecMarge, 1)} m² (+10 % rives).`,
      lines: [
        { label: "Surface toiture (+10 %)", value: `${formatNumber(avecMarge, 1)} m²`, highlight: true },
        { label: "Surface brute", value: `${formatNumber(surface, 1)} m²`, highlight: true },
        { label: "Emprise au sol", value: `${formatNumber(emprise, 1)} m²` },
        { label: "Facteur pente", value: formatNumber(facteur, 3) },
        { label: "Pente", value: `${num(input.pente)} %` },
      ],
    };
  },
});

const gouttiereLongueur: SimulatorDefinition = draftSimulator({
  slug: "simulateur-gouttiere-longueur",
  title: "Longueur gouttière",
  shortDescription:
    "Calculez la longueur de gouttières, naissance et descentes pour votre toiture.",
  metaTitle: "Calculateur gouttière — Longueur et descentes",
  metaDescription:
    "Estimez la longueur totale de gouttières, le nombre de descentes et les accessoires pour l'évacuation des eaux pluviales.",
  keywords: ["gouttière longueur", "calcul gouttière", "descente eaux pluviales"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["simulateur-toiture-surface", "volume-surface-piece", "calcul-carrelage"],
  formFields: [
    { key: "perimetre", label: "Périmètre à équiper", type: "number", min: 5, step: 1, suffix: "m" },
    { key: "hauteurDescente", label: "Hauteur descente", type: "number", min: 2, max: 10, step: 0.5, suffix: "m" },
    { key: "nbAngles", label: "Nombre d'angles", type: "number", min: 0, max: 8, suffix: "" },
  ],
  defaultValues: { perimetre: 28, hauteurDescente: 6, nbAngles: 4 },
  content: buildContent({
    intro: "Dimensionner correctement gouttières et descentes évite les débordements et les infiltrations.",
    howItWorks: [
      {
        title: "Longueurs",
        blocks: [
          p("Gouttière = Périmètre équipé. Descentes : 1 tous les 10 m max — Longueur descente = Hauteur × Nb descentes."),
          hl("Pente", "Pente gouttière 2 à 5 mm/m vers naissance."),
        ],
      },
    ],
    conseils: ["Une descente tous les 10 m maximum.", "Pente vers naissance ou descente.", "Nettoyage annuel recommandé."],
    limites: ["Calcul linéaire simplifié.", "Débit pluvial régional non calculé."],
  }),
  faq: buildFaq([
    { question: "Diamètre gouttière ?", answer: "25 cm (250 mm) courant maison — 33 cm si grande surface." },
    { question: "Nombre de descentes ?", answer: "1 descente tous les 10 m de gouttière maximum." },
    { question: "Matériau ?", answer: "Zinc, alu, PVC ou cuivre selon budget et esthétique." },
  ]),
  calculate(input) {
    const perimetre = num(input.perimetre);
    const hDesc = num(input.hauteurDescente);
    const nbDescentes = Math.max(1, Math.ceil(perimetre / 10));
    const longDescentes = hDesc * nbDescentes;
    const total = perimetre + longDescentes;
    const nbAngles = num(input.nbAngles);
    return {
      summary: `Gouttière ${formatNumber(perimetre, 0)} m — ${nbDescentes} descente(s) — total ${formatNumber(total, 0)} m.`,
      lines: [
        { label: "Longueur gouttière", value: `${formatNumber(perimetre, 0)} m`, highlight: true },
        { label: "Longueur descentes", value: `${formatNumber(longDescentes, 0)} m`, highlight: true },
        { label: "Longueur totale", value: `${formatNumber(total, 0)} m` },
        { label: "Nombre descentes", value: `${nbDescentes}` },
        { label: "Angles / raccords", value: `${nbAngles}` },
      ],
    };
  },
});

export const archivedTravauxDrafts: SimulatorDefinition[] = [
  surfaceMurPeinture,
  quantiteEnduit,
  dalleBetonArme,
  escalierDimension,
  cloisonPlaco,
  toitureSurface,
  gouttiereLongueur,
];
