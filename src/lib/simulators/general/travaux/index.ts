import type { SimulatorDefinition } from "../../types";
import {
  formatCurrency,
  formatPercent,
  formatNumber,
} from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { getMaPrimeRenovForfait } from "@/lib/config/aides";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const quantitePeinture: SimulatorDefinition = {
  slug: "quantite-peinture",
  title: "Quantité de peinture",
  shortDescription:
    "Estimez la quantité de peinture nécessaire pour vos murs et plafonds.",
  metaTitle: "Calculateur quantité peinture — Murs et plafonds",
  metaDescription:
    "Calculez la quantité de peinture en litres selon la surface à peindre, le nombre de couches et le rendement.",
  keywords: ["quantité peinture", "calcul peinture", "litres peinture"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["volume-surface-piece", "calcul-carrelage", "quantite-mortier"],
  formFields: [
    { key: "surface", label: "Surface à peindre", type: "number", min: 0, step: 5, suffix: "m²" },
    { key: "couches", label: "Nombre de couches", type: "number", min: 1, max: 4, suffix: "" },
    { key: "rendement", label: "Rendement peinture", type: "number", min: 5, max: 20, step: 0.5, suffix: "m²/L" },
  ],
  defaultValues: { surface: 45, couches: 2, rendement: 10 },
  content: buildContent({
    intro: "Le calcul de peinture dépend de la surface, du nombre de couches et du rendement du produit.",
    howItWorks: [
      {
        title: "Formule",
        blocks: [
          p("Litres = (Surface × Couches) / Rendement. Ajoutez 10 % de marge pour les pertes."),
          hl("Rendement", "Généralement 8 à 12 m²/L selon l'absorption du support."),
        ],
      },
    ],
    example: { title: "45 m², 2 couches, 10 m²/L", blocks: [p("Quantité : ~9 L + marge 10 % = ~10 L.")] },
    conseils: ["Préparez le support (lessivage, ponçage).", "Achetez un peu plus pour les retouches.", "Utilisez une sous-couche sur les supports poreux."],
    limites: ["Rendement variable selon le support et la couleur.", "Portes et fenêtres non déduites automatiquement."],
  }),
  faq: buildFaq([
    { question: "Combien de couches ?", answer: "2 couches minimum pour une couverture uniforme. 3 sur supports foncés." },
    { question: "Rendement peinture ?", answer: "Consultez l'emballage : généralement 8-12 m²/L." },
    { question: "Peinture mate ou satinée ?", answer: "Le rendement est similaire ; la préparation du support compte plus." },
    { question: "Déduire les ouvertures ?", answer: "Soustrayez ~15 % pour portes et fenêtres sur les murs." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const couches = num(input.couches);
    const rendement = num(input.rendement);
    const litres = rendement > 0 ? (surface * couches) / rendement : 0;
    const avecMarge = litres * 1.1;
    return {
      summary: `Quantité estimée : ${formatNumber(avecMarge, 1)} L (avec 10 % de marge).`,
      lines: [
        { label: "Quantité avec marge", value: `${formatNumber(avecMarge, 1)} L`, highlight: true },
        { label: "Quantité brute", value: `${formatNumber(litres, 1)} L` },
        { label: "Surface", value: `${formatNumber(surface, 0)} m²` },
        { label: "Couches", value: `${couches}` },
        { label: "Rendement", value: `${rendement} m²/L` },
      ],
    };
  },
};

export const calculCarrelage: SimulatorDefinition = {
  slug: "calcul-carrelage",
  title: "Calcul carrelage",
  shortDescription:
    "Calculez le nombre de carreaux et le mortier nécessaires pour votre sol ou mur.",
  metaTitle: "Calculateur carrelage — Nombre de carreaux",
  metaDescription:
    "Estimez la quantité de carrelage, joints et mortier-colle pour votre projet de revêtement.",
  keywords: ["calcul carrelage", "nombre carreaux", "quantité carrelage"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["quantite-mortier", "surface-parquet", "volume-surface-piece"],
  formFields: [
    { key: "surface", label: "Surface à carreler", type: "number", min: 0, step: 1, suffix: "m²" },
    { key: "longueurCarreau", label: "Longueur carreau", type: "number", min: 5, step: 1, suffix: "cm" },
    { key: "largeurCarreau", label: "Largeur carreau", type: "number", min: 5, step: 1, suffix: "cm" },
    { key: "marge", label: "Marge chutes", type: "number", min: 0, max: 20, step: 1, suffix: "%" },
  ],
  defaultValues: { surface: 20, longueurCarreau: 60, largeurCarreau: 60, marge: 10 },
  content: buildContent({
    intro: "Le calcul de carrelage intègre la surface, le format des carreaux et une marge pour les chutes.",
    howItWorks: [
      {
        title: "Nombre de carreaux",
        blocks: [
          p("Carreaux = Surface / (L × W) × (1 + Marge). Surface carreau en m² = (L cm × W cm) / 10 000."),
          hl("Marge", "10 % recommandé pour les chutes et les coupes."),
        ],
      },
    ],
    example: { title: "20 m², carreaux 60×60 cm", blocks: [p("~62 carreaux + 10 % = ~68 carreaux.")] },
    conseils: ["Achetez tous les carreaux d'un même lot.", "Prévoyez du joint et de la colle en conséquence.", "Planifiez le calepinage avant l'achat."],
    limites: ["Calepinage complexe non modélisé.", "Carreaux irréguliers : marge plus élevée."],
  }),
  faq: buildFaq([
    { question: "Marge de chute ?", answer: "10 % standard. 15 % pour calepinage diagonal ou carreaux irréguliers." },
    { question: "Colle et joint ?", answer: "Comptez ~4 kg de colle/m² et 1 kg de joint pour 5 m² de carrelage." },
    { question: "Carrelage mural ou sol ?", answer: "Même calcul. Le sol nécessite souvent un ragréage préalable." },
    { question: "Grand format ?", answer: "Les grands carreaux réduisent le nombre de joints mais sont plus fragiles à transporter." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const l = num(input.longueurCarreau) / 100;
    const w = num(input.largeurCarreau) / 100;
    const marge = num(input.marge) / 100;
    const surfaceCarreau = l * w;
    const carreaux = surfaceCarreau > 0 ? Math.ceil((surface / surfaceCarreau) * (1 + marge)) : 0;
    const colle = surface * 4;
    return {
      summary: `${carreaux} carreaux nécessaires (~${formatNumber(colle, 0)} kg de colle).`,
      lines: [
        { label: "Nombre de carreaux", value: `${carreaux}`, highlight: true },
        { label: "Colle estimée", value: `${formatNumber(colle, 0)} kg` },
        { label: "Surface", value: `${formatNumber(surface, 0)} m²` },
        { label: "Format", value: `${num(input.longueurCarreau)}×${num(input.largeurCarreau)} cm` },
        { label: "Marge chutes", value: formatPercent(num(input.marge), 0) },
      ],
    };
  },
};

export const volumeBeton: SimulatorDefinition = {
  slug: "volume-beton",
  title: "Volume béton",
  shortDescription:
    "Calculez le volume de béton pour dalle, fondation ou poteau.",
  metaTitle: "Calculateur volume béton — Dalle et fondation",
  metaDescription:
    "Estimez le volume de béton en m³ pour vos travaux : dalle, fondation, poteau ou longrine.",
  keywords: ["volume béton", "calcul béton", "m³ béton"],
  domain: "travaux",
  category: "materiaux",
  icon: "building",
  relatedSlugs: ["quantite-mortier", "volume-surface-piece", "calcul-carrelage"],
  formFields: [
    {
      key: "type",
      label: "Type d'ouvrage",
      type: "select",
      options: [
        { value: "dalle", label: "Dalle (L × W × épaisseur)" },
        { value: "poteau", label: "Poteau (section × hauteur)" },
      ],
    },
    { key: "longueur", label: "Longueur", type: "number", min: 0, step: 0.1, suffix: "m" },
    { key: "largeur", label: "Largeur / section", type: "number", min: 0, step: 0.1, suffix: "m" },
    { key: "hauteur", label: "Épaisseur / hauteur", type: "number", min: 0, step: 0.01, suffix: "m" },
  ],
  defaultValues: { type: "dalle", longueur: 5, largeur: 4, hauteur: 0.15 },
  content: buildContent({
    intro: "Le volume de béton est essentiel pour commander la bonne quantité de toupie ou sacs.",
    howItWorks: [
      {
        title: "Volume",
        blocks: [
          p("Dalle : L × W × épaisseur. Poteau : section × hauteur. Volume en m³."),
          hl("Marge", "Ajoutez 5-10 % pour les pertes et le pompage."),
        ],
      },
    ],
    example: { title: "Dalle 5×4 m, 15 cm", blocks: [p("Volume : 3 m³.")] },
    conseils: ["Commandez la toupie pour > 1 m³.", "Pour petits volumes, utilisez des sacs prémélangés.", "Prévoyez un accès pour la toupie."],
    limites: ["Formes complexes non modélisées.", "Dosage et résistance non calculés."],
  }),
  faq: buildFaq([
    { question: "Toupie ou sacs ?", answer: "Toupie si > 1 m³. Sacs 35 kg pour petits volumes (< 0,5 m³)." },
    { question: "Épaisseur dalle ?", answer: "10-15 cm pour dalle légère, 15-20 cm pour garage ou charges lourdes." },
    { question: "Dosage béton ?", answer: "C25/30 courant pour fondations. C30/37 pour dalles industrielles." },
    { question: "Prix du béton ?", answer: "~100-150 €/m³ en toupie selon la région et le dosage." },
  ]),
  calculate(input) {
    const l = num(input.longueur);
    const w = num(input.largeur);
    const h = num(input.hauteur);
    const volume = l * w * h;
    const avecMarge = volume * 1.05;
    const sacs = Math.ceil(avecMarge * 50);
    return {
      summary: `Volume : ${formatNumber(avecMarge, 2)} m³ (~${sacs} sacs de 35 L).`,
      lines: [
        { label: "Volume (+5 %)", value: `${formatNumber(avecMarge, 2)} m³`, highlight: true },
        { label: "Volume brut", value: `${formatNumber(volume, 2)} m³` },
        { label: "Sacs 35 L estimés", value: `${sacs}` },
        { label: "Dimensions", value: `${l} × ${w} × ${h} m` },
        { label: "Type", value: String(input.type) },
      ],
    };
  },
};

export const surfaceParquet: SimulatorDefinition = {
  slug: "surface-parquet",
  title: "Surface parquet",
  shortDescription:
    "Calculez la surface de parquet ou stratifié nécessaire pour votre pièce.",
  metaTitle: "Calculateur surface parquet — Quantité lames",
  metaDescription:
    "Estimez la surface et le nombre de packs de parquet ou stratifié pour votre sol.",
  keywords: ["surface parquet", "quantité parquet", "packs parquet"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["calcul-carrelage", "volume-surface-piece", "quantite-peinture"],
  formFields: [
    { key: "longueur", label: "Longueur pièce", type: "number", min: 0, step: 0.1, suffix: "m" },
    { key: "largeur", label: "Largeur pièce", type: "number", min: 0, step: 0.1, suffix: "m" },
    { key: "marge", label: "Marge chutes", type: "number", min: 0, max: 15, step: 1, suffix: "%" },
    { key: "surfacePack", label: "Surface par pack", type: "number", min: 1, step: 0.5, suffix: "m²" },
  ],
  defaultValues: { longueur: 5, largeur: 4, marge: 8, surfacePack: 2.2 },
  content: buildContent({
    intro: "Le calcul de parquet intègre la surface de la pièce, les chutes et le format des packs.",
    howItWorks: [
      {
        title: "Surface et packs",
        blocks: [
          p("Surface = L × W × (1 + Marge). Packs = Surface / Surface pack, arrondi au supérieur."),
          hl("Pose", "8 % de marge pour pose droite, 12 % pour pose en diagonale."),
        ],
      },
    ],
    example: { title: "Pièce 5×4 m", blocks: [p("Surface 20 m² + 8 % = ~22 m² — ~10 packs de 2,2 m².")] },
    conseils: ["Vérifiez l'humidité du support.", "Achetez tous les packs du même lot.", "Prévoyez une sous-couche isolante."],
    limites: ["Pièces irrégulières non modélisées.", "Sous-couche non incluse."],
  }),
  faq: buildFaq([
    { question: "Parquet massif ou stratifié ?", answer: "Stratifié : économique et facile. Massif : plus durable, réparable." },
    { question: "Marge de chute ?", answer: "8 % pose droite, 12 % pose diagonale ou pièce complexe." },
    { question: "Sous-couche obligatoire ?", answer: "Recommandée pour isolation phonique et protection humidité." },
    { question: "Pose flottante ou collée ?", answer: "Flottante : plus simple. Collée : plus stable, idéal massif." },
  ]),
  calculate(input) {
    const surface = num(input.longueur) * num(input.largeur);
    const marge = num(input.marge) / 100;
    const surfaceTotale = surface * (1 + marge);
    const packSurface = num(input.surfacePack);
    const packs = packSurface > 0 ? Math.ceil(surfaceTotale / packSurface) : 0;
    return {
      summary: `${formatNumber(surfaceTotale, 1)} m² — ${packs} pack(s) nécessaires.`,
      lines: [
        { label: "Packs nécessaires", value: `${packs}`, highlight: true },
        { label: "Surface totale", value: `${formatNumber(surfaceTotale, 1)} m²`, highlight: true },
        { label: "Surface pièce", value: `${formatNumber(surface, 1)} m²` },
        { label: "Marge chutes", value: formatPercent(num(input.marge), 0) },
        { label: "Surface/pack", value: `${packSurface} m²` },
      ],
    };
  },
};

export const maprimerenov: SimulatorDefinition = {
  slug: "maprimerenov",
  title: "MaPrimeRénov'",
  shortDescription:
    "Estimez le montant de l'aide MaPrimeRénov' pour vos travaux de rénovation énergétique.",
  metaTitle: "Simulateur MaPrimeRénov' — Aide rénovation",
  metaDescription:
    "Calculez l'aide MaPrimeRénov' selon vos revenus, le type de travaux et le gain énergétique.",
  keywords: ["MaPrimeRénov", "aide rénovation", "prime énergie"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["economies-isolation", "pompe-a-chaleur-economies", "estimation-consommation-energie"],
  formFields: [
    { key: "coutTravaux", label: "Coût des travaux", type: "number", min: 0, step: 1000, suffix: "€" },
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
      key: "travaux",
      label: "Type de travaux",
      type: "select",
      options: [
        { value: "isolation", label: "Isolation" },
        { value: "pac", label: "Pompe à chaleur" },
        { value: "chaudiere", label: "Chaudière performante" },
      ],
    },
  ],
  defaultValues: { coutTravaux: 12000, couleur: "jaune", travaux: "isolation" },
  content: buildContent({
    intro: "MaPrimeRénov' aide les ménages à financer les travaux de rénovation énergétique.",
    howItWorks: [
      {
        title: "Barèmes",
        blocks: [
          p("Montant forfaitaire selon catégorie de revenus (couleur) et type de travaux. Plafonné au coût réel."),
          hl("RFR", "Catégorie déterminée par le revenu fiscal de référence et la composition du foyer."),
        ],
      },
    ],
    example: { title: "Isolation 12 000 €, revenus modestes", blocks: [p("Aide estimée : ~4 000 € (forfait isolation jaune).")] },
    conseils: ["Faites un audit énergétique si rénovation globale.", "Cumulable avec éco-PTZ et CEE.", "Travaux par un artisan RGE obligatoire."],
    limites: ["Forfaits simplifiés — barème officiel sur france-renov.gouv.fr.", "Plafonds et conditions non exhaustifs."],
  }),
  faq: buildFaq([
    { question: "Artisan RGE obligatoire ?", answer: "Oui, les travaux doivent être réalisés par un professionnel RGE." },
    { question: "Cumul aides ?", answer: "MaPrimeRénov' cumulable avec CEE, éco-PTZ et aides locales." },
    { question: "Maison ou appartement ?", answer: "Les deux sont éligibles selon les travaux." },
    { question: "Délai de versement ?", answer: "Après réalisation des travaux et envoi des factures." },
  ]),
  calculate(input) {
    const cout = num(input.coutTravaux);
    const couleur = String(input.couleur);
    const travaux = String(input.travaux);
    const aide = Math.min(cout, getMaPrimeRenovForfait(travaux, couleur));
    const reste = cout - aide;
    return {
      summary: `MaPrimeRénov' estimée : ${formatCurrency(aide)} (reste à charge : ${formatCurrency(reste)}).`,
      lines: [
        { label: "Aide MaPrimeRénov'", value: formatCurrency(aide), highlight: true },
        { label: "Reste à charge", value: formatCurrency(reste), highlight: true },
        { label: "Coût travaux", value: formatCurrency(cout) },
        { label: "Catégorie", value: couleur },
        { label: "Type travaux", value: travaux },
      ],
    };
  },
};

export const estimationConsommationEnergie: SimulatorDefinition = {
  slug: "estimation-consommation-energie",
  title: "Estimation consommation énergie",
  shortDescription:
    "Estimez la consommation énergétique annuelle et le coût de votre logement.",
  metaTitle: "Simulateur consommation énergie — DPE simplifié",
  metaDescription:
    "Estimez la consommation énergétique annuelle en kWh et le coût selon la surface, l'isolation et le chauffage.",
  keywords: ["consommation énergie", "DPE", "kWh logement"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["economies-isolation", "maprimerenov", "pompe-a-chaleur-economies"],
  formFields: [
    { key: "surface", label: "Surface habitable", type: "number", min: 10, step: 5, suffix: "m²" },
    {
      key: "isolation",
      label: "Qualité isolation",
      type: "select",
      options: [
        { value: "mauvaise", label: "Mauvaise (DPE F/G)" },
        { value: "moyenne", label: "Moyenne (DPE D/E)" },
        { value: "bonne", label: "Bonne (DPE A/B/C)" },
      ],
    },
    {
      key: "chauffage",
      label: "Mode de chauffage",
      type: "select",
      options: [
        { value: "gaz", label: "Gaz" },
        { value: "elec", label: "Électricité" },
        { value: "fioul", label: "Fioul" },
      ],
    },
    { key: "prixKwh", label: "Prix énergie", type: "number", min: 0, step: 0.01, suffix: "€/kWh" },
  ],
  defaultValues: { surface: 90, isolation: "moyenne", chauffage: "gaz", prixKwh: 0.12 },
  content: buildContent({
    intro: "La consommation énergétique dépend de la surface, l'isolation et le mode de chauffage.",
    howItWorks: [
      {
        title: "Estimation kWh/m²/an",
        blocks: [
          p("Consommation = Surface × kWh/m²/an selon isolation. Gaz ~150, élec ~200, fioul ~180 en moyenne."),
          hl("DPE", "Un audit énergétique donne une estimation précise."),
        ],
      },
    ],
    example: { title: "90 m², isolation moyenne, gaz", blocks: [p("~13 500 kWh/an — ~1 620 €/an.")] },
    conseils: ["Isolez pour réduire la consommation.", "Changez de mode de chauffage si DPE F/G.", "Comparez les offres énergie."],
    limites: ["Estimation très simplifiée.", "Climat et usage non modélisés."],
  }),
  faq: buildFaq([
    { question: "kWh/m²/an moyen ?", answer: "Logement moyen français : ~150-250 kWh/m²/an selon l'âge et l'isolation." },
    { question: "DPE obligatoire ?", answer: "Oui pour vente et location. Valable 10 ans." },
    { question: "Réduire la consommation ?", answer: "Isolation, changement chauffage, thermostat programmable." },
    { question: "Passoire thermique ?", answer: "Logement F ou G — interdiction de location progressive." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const isoMap: Record<string, number> = { mauvaise: 280, moyenne: 180, bonne: 80 };
    const iso = isoMap[String(input.isolation)] ?? 180;
    const chauffage = String(input.chauffage);
    const facteur = chauffage === "elec" ? 1.2 : chauffage === "fioul" ? 1.1 : 1;
    const kwh = surface * iso * facteur;
    const prix = num(input.prixKwh);
    const cout = kwh * prix;
    return {
      summary: `~${formatNumber(kwh, 0)} kWh/an — Coût : ${formatCurrency(cout)}/an.`,
      lines: [
        { label: "Coût annuel", value: formatCurrency(cout), highlight: true },
        { label: "Consommation", value: `${formatNumber(kwh, 0)} kWh/an`, highlight: true },
        { label: "kWh/m²/an", value: `${formatNumber(kwh / surface, 0)}` },
        { label: "Surface", value: `${surface} m²` },
        { label: "Prix kWh", value: `${prix.toFixed(3)} €` },
      ],
    };
  },
};

export const pompeAChaleurEconomies: SimulatorDefinition = {
  slug: "pompe-a-chaleur-economies",
  title: "Pompe à chaleur économies",
  shortDescription:
    "Estimez les économies annuelles en remplaçant votre chauffage par une pompe à chaleur.",
  metaTitle: "Simulateur économies pompe à chaleur",
  metaDescription:
    "Calculez les économies d'énergie et le retour sur investissement d'une pompe à chaleur air/eau.",
  keywords: ["pompe à chaleur", "économies PAC", "chauffage PAC"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["maprimerenov", "estimation-consommation-energie", "economies-isolation"],
  formFields: [
    { key: "coutActuel", label: "Coût chauffage actuel annuel", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "coutPac", label: "Coût installation PAC", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "aide", label: "Aides (MaPrimeRénov' etc.)", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "efficacite", label: "Efficacité PAC (SCOP)", type: "number", min: 2, max: 5, step: 0.1, suffix: "" },
  ],
  defaultValues: { coutActuel: 2200, coutPac: 14000, aide: 4000, efficacite: 3.5 },
  content: buildContent({
    intro: "Une pompe à chaleur peut réduire vos factures de chauffage de 50 à 70 %.",
    howItWorks: [
      {
        title: "Économies",
        blocks: [
          p("Nouveau coût ≈ Coût actuel / SCOP × facteur électricité. Économie = Coût actuel − Nouveau coût."),
          hl("SCOP", "Coefficient de performance saisonnier — viser ≥ 3,5 pour une PAC air/eau."),
        ],
      },
    ],
    example: { title: "2 200 €/an actuel, PAC 14 000 €", blocks: [p("Économie ~1 400 €/an — ROI ~7 ans après aides.")] },
    conseils: ["Combinez avec l'isolation pour maximiser l'efficacité.", "Artisan RGE pour les aides.", "Vérifiez la compatibilité avec vos radiateurs."],
    limites: ["SCOP variable selon climat et installation.", "Coût électricité variable."],
  }),
  faq: buildFaq([
    { question: "PAC air/eau ou géothermique ?", answer: "Air/eau : moins cher, plus courant. Géothermique : plus efficace mais coût élevé." },
    { question: "Radiateurs compatibles ?", answer: "PAC basse température : radiateurs basse T ou plancher chauffant." },
    { question: "Aides PAC ?", answer: "MaPrimeRénov' + CEE — jusqu'à 5 000 € selon revenus." },
    { question: "Durée de vie PAC ?", answer: "15-20 ans avec maintenance régulière." },
  ]),
  calculate(input) {
    const actuel = num(input.coutActuel);
    const scop = num(input.efficacite);
    const nouveau = scop > 0 ? actuel / scop * 1.3 : actuel;
    const economie = actuel - nouveau;
    const investissement = num(input.coutPac) - num(input.aide);
    const roi = economie > 0 ? investissement / economie : 0;
    return {
      summary: `Économie : ${formatCurrency(economie)}/an — ROI : ${formatNumber(roi, 1)} ans.`,
      lines: [
        { label: "Économie annuelle", value: formatCurrency(economie), highlight: true },
        { label: "Retour sur investissement", value: `${formatNumber(roi, 1)} ans`, highlight: true },
        { label: "Nouveau coût chauffage", value: formatCurrency(nouveau) },
        { label: "Investissement net", value: formatCurrency(investissement) },
        { label: "Coût actuel", value: formatCurrency(actuel) },
      ],
    };
  },
};

export const volumeSurfacePiece: SimulatorDefinition = {
  slug: "volume-surface-piece",
  title: "Volume et surface pièce",
  shortDescription:
    "Calculez la surface au sol et le volume d'une pièce pour vos travaux.",
  metaTitle: "Calculateur volume et surface pièce",
  metaDescription:
    "Estimez la surface au sol et le volume d'une pièce selon longueur, largeur et hauteur sous plafond.",
  keywords: ["volume pièce", "surface pièce", "m³ m²"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["quantite-peinture", "surface-parquet", "estimation-consommation-energie"],
  formFields: [
    { key: "longueur", label: "Longueur", type: "number", min: 0, step: 0.1, suffix: "m" },
    { key: "largeur", label: "Largeur", type: "number", min: 0, step: 0.1, suffix: "m" },
    { key: "hauteur", label: "Hauteur sous plafond", type: "number", min: 0, step: 0.05, suffix: "m" },
  ],
  defaultValues: { longueur: 4.5, largeur: 3.5, hauteur: 2.5 },
  content: buildContent({
    intro: "Surface et volume sont indispensables pour estimer peinture, parquet, climatisation et ventilation.",
    howItWorks: [
      {
        title: "Calculs",
        blocks: [
          p("Surface sol = L × W. Volume = L × W × H. Surface murs = 2 × (L + W) × H."),
          hl("Usage", "Volume pour clim/VMC. Surface pour revêtements sol."),
        ],
      },
    ],
    example: { title: "Pièce 4,5×3,5×2,5 m", blocks: [p("Surface : 15,75 m² — Volume : 39,4 m³.")] },
    conseils: ["Mesurez chaque pièce séparément.", "Déduisez les ouvertures pour la peinture.", "Hauteur standard : 2,50 m."],
    limites: ["Pièces rectangulaires uniquement.", "Ouvertures non déduites."],
  }),
  faq: buildFaq([
    { question: "Surface murs ?", answer: "2 × (L + W) × H. Déduire portes (~2 m²) et fenêtres (~1,5 m² chacune)." },
    { question: "Volume pour clim ?", answer: "Puissance clim ≈ Volume × 40 W/m³ (orientation et isolation influencent)." },
    { question: "Hauteur sous plafond standard ?", answer: "2,50 m en France pour les logements neufs." },
    { question: "Pièce en L ?", answer: "Divisez en rectangles et additionnez les surfaces." },
  ]),
  calculate(input) {
    const l = num(input.longueur);
    const w = num(input.largeur);
    const h = num(input.hauteur);
    const surface = l * w;
    const volume = surface * h;
    const surfaceMurs = 2 * (l + w) * h;
    return {
      summary: `Surface : ${formatNumber(surface, 2)} m² — Volume : ${formatNumber(volume, 1)} m³.`,
      lines: [
        { label: "Volume", value: `${formatNumber(volume, 1)} m³`, highlight: true },
        { label: "Surface au sol", value: `${formatNumber(surface, 2)} m²`, highlight: true },
        { label: "Surface murs", value: `${formatNumber(surfaceMurs, 1)} m²` },
        { label: "Dimensions", value: `${l} × ${w} × ${h} m` },
        { label: "Périmètre", value: `${formatNumber(2 * (l + w), 1)} m` },
      ],
    };
  },
};

export const quantiteMortier: SimulatorDefinition = {
  slug: "quantite-mortier",
  title: "Quantité mortier",
  shortDescription:
    "Estimez la quantité de mortier ou mortier-colle pour carrelage ou enduit.",
  metaTitle: "Calculateur quantité mortier — Colle et joint",
  metaDescription:
    "Calculez la quantité de mortier-colle et de joint en kg selon la surface à carreler.",
  keywords: ["quantité mortier", "mortier colle", "joint carrelage"],
  domain: "travaux",
  category: "materiaux",
  icon: "tools",
  relatedSlugs: ["calcul-carrelage", "volume-beton", "quantite-peinture"],
  formFields: [
    { key: "surface", label: "Surface à traiter", type: "number", min: 0, step: 1, suffix: "m²" },
    {
      key: "type",
      label: "Type de mortier",
      type: "select",
      options: [
        { value: "colle", label: "Mortier-colle (4 kg/m²)" },
        { value: "joint", label: "Joint carrelage (0,2 kg/m²)" },
        { value: "enduit", label: "Enduit (15 kg/m²)" },
      ],
    },
    { key: "epaisseur", label: "Épaisseur enduit", type: "number", min: 0.5, max: 3, step: 0.5, suffix: "cm" },
  ],
  defaultValues: { surface: 25, type: "colle", epaisseur: 1 },
  content: buildContent({
    intro: "Le mortier-colle et le joint sont essentiels pour un carrelage durable.",
    howItWorks: [
      {
        title: "Dosages",
        blocks: [
          p("Colle : ~4 kg/m². Joint : ~0,2 kg/m² pour 3 mm. Enduit : ~15 kg/m² pour 1 cm."),
          hl("Sacs", "Sacs standards de 25 kg pour colle et enduit."),
        ],
      },
    ],
    example: { title: "25 m² de colle", blocks: [p("~100 kg — 4 sacs de 25 kg.")] },
    conseils: ["Respectez les temps de séchage.", "Utilisez la colle adaptée au support.", "Préparez le joint après séchage de la colle."],
    limites: ["Dosages moyens — consulter les fiches techniques.", "Supports irréguliers : plus de mortier."],
  }),
  faq: buildFaq([
    { question: "Colle intérieur ou extérieur ?", answer: "Colle C2E pour extérieur et pièces humides. C1 pour intérieur sec." },
    { question: "Épaisseur joint ?", answer: "2-3 mm standard. 5 mm pour carreaux irréguliers." },
    { question: "Temps séchage colle ?", answer: "24-48 h avant passage. Joint après 24 h minimum." },
    { question: "Enduit intérieur ou extérieur ?", answer: "Enduit spécifique selon usage. Épaisseur max selon produit." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const type = String(input.type);
    const ep = num(input.epaisseur);
    let kgPerM2 = 4;
    if (type === "joint") kgPerM2 = 0.2;
    if (type === "enduit") kgPerM2 = 15 * ep;
    const total = surface * kgPerM2;
    const sacs = Math.ceil(total / 25);
    return {
      summary: `${formatNumber(total, 0)} kg — ${sacs} sac(s) de 25 kg.`,
      lines: [
        { label: "Quantité totale", value: `${formatNumber(total, 0)} kg`, highlight: true },
        { label: "Sacs 25 kg", value: `${sacs}`, highlight: true },
        { label: "Surface", value: `${surface} m²` },
        { label: "Dosage", value: `${kgPerM2} kg/m²` },
        { label: "Type", value: type },
      ],
    };
  },
};

export const economiesIsolation: SimulatorDefinition = {
  slug: "economies-isolation",
  title: "Économies isolation",
  shortDescription:
    "Estimez les économies d'énergie après une isolation des combles ou murs.",
  metaTitle: "Simulateur économies isolation — Réduction facture",
  metaDescription:
    "Calculez les économies sur votre facture énergétique après isolation des combles, murs ou fenêtres.",
  keywords: ["économies isolation", "isolation combles", "réduction facture"],
  domain: "travaux",
  category: "energie",
  icon: "building",
  relatedSlugs: ["maprimerenov", "estimation-consommation-energie", "pompe-a-chaleur-economies"],
  formFields: [
    { key: "factureActuelle", label: "Facture chauffage annuelle", type: "number", min: 0, step: 100, suffix: "€" },
    {
      key: "typeIsolation",
      label: "Type d'isolation",
      type: "select",
      options: [
        { value: "combles", label: "Combles perdus (25 % économie)" },
        { value: "murs", label: "Murs (15 % économie)" },
        { value: "fenetres", label: "Fenêtres double vitrage (10 %)" },
        { value: "globale", label: "Rénovation globale (40 %)" },
      ],
    },
    { key: "coutIsolation", label: "Coût isolation", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "aide", label: "Aides publiques", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { factureActuelle: 1800, typeIsolation: "combles", coutIsolation: 3500, aide: 1500 },
  content: buildContent({
    intro: "L'isolation est le premier levier pour réduire les factures et améliorer le DPE.",
    howItWorks: [
      {
        title: "Gains énergétiques",
        blocks: [
          p("Économie = Facture × Taux de réduction selon le type d'isolation. ROI = Investissement net / Économie."),
          hl("Combles", "30 % des déperditions passent par le toit — priorité absolue."),
        ],
      },
    ],
    example: { title: "Isolation combles, 1 800 €/an", blocks: [p("Économie ~450 €/an — ROI ~4 ans après aides.")] },
    conseils: ["Commencez par les combles.", "Artisan RGE pour MaPrimeRénov'.", "Combinez isolation et changement de chauffage."],
    limites: ["Taux moyens — audit énergétique pour précision.", "Aides non exhaustives."],
  }),
  faq: buildFaq([
    { question: "Isolation combles : prix ?", answer: "1 500-4 000 € selon surface et méthode (soufflage, panneaux)." },
    { question: "MaPrimeRénov' isolation ?", answer: "Forfaits de 1 000 à 7 500 € selon revenus." },
    { question: "Isolation intérieure ou extérieure ?", answer: "Extérieure : plus efficace, pas de perte de surface. Intérieure : moins coûteuse." },
    { question: "Gain DPE ?", answer: "Isolation combles : souvent +1 à 2 classes DPE." },
  ]),
  calculate(input) {
    const facture = num(input.factureActuelle);
    const tauxMap: Record<string, number> = {
      combles: 0.25,
      murs: 0.15,
      fenetres: 0.1,
      globale: 0.4,
    };
    const type = String(input.typeIsolation);
    const taux = tauxMap[type] ?? 0.2;
    const economie = facture * taux;
    const invest = num(input.coutIsolation) - num(input.aide);
    const roi = economie > 0 ? invest / economie : 0;
    return {
      summary: `Économie : ${formatCurrency(economie)}/an — ROI : ${formatNumber(roi, 1)} ans.`,
      lines: [
        { label: "Économie annuelle", value: formatCurrency(economie), highlight: true },
        { label: "Retour sur investissement", value: `${formatNumber(roi, 1)} ans`, highlight: true },
        { label: "Investissement net", value: formatCurrency(invest) },
        { label: "Réduction facture", value: formatPercent(taux * 100, 0) },
        { label: "Facture actuelle", value: formatCurrency(facture) },
      ],
    };
  },
};

export const travauxSimulators = [
  quantitePeinture,
  calculCarrelage,
  volumeBeton,
  surfaceParquet,
  maprimerenov,
  estimationConsommationEnergie,
  pompeAChaleurEconomies,
  volumeSurfacePiece,
  quantiteMortier,
  economiesIsolation,
];
