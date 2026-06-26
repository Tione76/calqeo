import type { SimulatorDefinition } from "../../types";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";

const pourcentageAugmentationSalaire: SimulatorDefinition = draftSimulator({
  slug: "simulateur-pourcentage-augmentation-salaire",
  title: "Augmentation de salaire",
  shortDescription:
    "Calculez le pourcentage d'augmentation entre deux salaires ou l'impact d'une hausse.",
  metaTitle: "Simulateur augmentation salaire — Pourcentage",
  metaDescription:
    "Calculez le pourcentage d'augmentation de salaire, la différence nette et le nouveau montant après revalorisation.",
  keywords: ["augmentation salaire", "pourcentage augmentation", "hausse salaire"],
  domain: "quotidien",
  category: "salaire",
  icon: "percent",
  relatedSlugs: ["salaire-brut-net", "calculateur-pourcentage", "evolution-pourcentage"],
  formFields: [
    { key: "ancienSalaire", label: "Ancien salaire", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "nouveauSalaire", label: "Nouveau salaire", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { ancienSalaire: 2400, nouveauSalaire: 2520 },
  content: buildContent({
    intro: "Mesurer une augmentation en pourcentage permet de comparer des revalorisations et de négocier.",
    howItWorks: [
      {
        title: "Formule",
        blocks: [
          p("Augmentation % = (Nouveau − Ancien) / Ancien × 100. Différence = Nouveau − Ancien."),
          hl("Annualisé", "Multipliez par 12 pour l'impact annuel sur le net."),
        ],
      },
    ],
    conseils: ["Comparez brut et net — l'augmentation nette dépend des cotisations.", "Inflation : une hausse < inflation = perte de pouvoir d'achat.", "Négociez sur le brut."],
    limites: ["Brut ou net selon saisie — pas de conversion automatique."],
  }),
  faq: buildFaq([
    { question: "Augmentation moyenne France ?", answer: "Variable — 2 à 4 % en moyenne selon secteurs et années." },
    { question: "Inflation et salaire ?", answer: "Comparez l'augmentation % à l'inflation pour le pouvoir d'achat réel." },
    { question: "Prime vs augmentation ?", answer: "Prime = ponctuelle. Augmentation = permanente sur le salaire de base." },
  ]),
  calculate(input) {
    const ancien = num(input.ancienSalaire);
    const nouveau = num(input.nouveauSalaire);
    const diff = nouveau - ancien;
    const pct = ancien > 0 ? (diff / ancien) * 100 : 0;
    return {
      summary: `Augmentation : ${formatPercent(pct, 1)} (${formatCurrency(diff)}/mois).`,
      lines: [
        { label: "Augmentation", value: formatPercent(pct, 1), highlight: true },
        { label: "Différence mensuelle", value: formatCurrency(diff), highlight: true },
        { label: "Nouveau salaire", value: formatCurrency(nouveau) },
        { label: "Ancien salaire", value: formatCurrency(ancien) },
        { label: "Impact annuel", value: formatCurrency(diff * 12) },
      ],
    };
  },
});

const remiseCommerciale: SimulatorDefinition = draftSimulator({
  slug: "simulateur-remise-commerciale",
  title: "Remise commerciale",
  shortDescription:
    "Calculez le prix après remise, le montant économisé ou la remise en pourcentage.",
  metaTitle: "Calculateur remise commerciale — Prix soldé",
  metaDescription:
    "Calculez le prix après remise commerciale, le montant de la réduction et le pourcentage de remise appliqué.",
  keywords: ["remise commerciale", "calcul remise", "prix soldé"],
  domain: "quotidien",
  category: "pratique",
  icon: "percent",
  relatedSlugs: ["calculateur-pourcentage", "calculateur-tva", "simulateur-partage-note-restaurant"],
  formFields: [
    { key: "prixInitial", label: "Prix initial", type: "number", min: 0, step: 0.01, suffix: "€" },
    { key: "remise", label: "Remise", type: "number", min: 0, max: 100, step: 1, suffix: "%" },
  ],
  defaultValues: { prixInitial: 89.99, remise: 20 },
  content: buildContent({
    intro: "Les remises commerciales s'appliquent sur le prix de vente — soldes, promotions, codes promo.",
    howItWorks: [
      {
        title: "Calcul",
        blocks: [
          p("Prix final = Prix initial × (1 − Remise/100). Économie = Prix initial − Prix final."),
          hl("Cumul", "Deux remises successives se multiplient, ne s'additionnent pas."),
        ],
      },
    ],
    conseils: ["Comparez le prix final TTC.", "Vérifiez les conditions (minimum d'achat).", "Remises cumulables : multipliez les facteurs."],
    limites: ["Remise simple — pas de cumul multiple."],
  }),
  faq: buildFaq([
    { question: "Remise 20 % puis 10 % ?", answer: "Prix final = Prix × 0,80 × 0,90 = × 0,72 (28 % total, pas 30 %)." },
    { question: "Remise sur HT ou TTC ?", answer: "En général sur TTC en grande distribution." },
    { question: "Prix barré légal ?", answer: "Le prix de référence doit être le plus bas des 30 derniers jours (soldes)." },
  ]),
  calculate(input) {
    const prix = num(input.prixInitial);
    const remise = num(input.remise);
    const final = prix * (1 - remise / 100);
    const economie = prix - final;
    return {
      summary: `Prix final : ${formatCurrency(final, 2)} — économie ${formatCurrency(economie, 2)}.`,
      lines: [
        { label: "Prix final", value: formatCurrency(final, 2), highlight: true },
        { label: "Économie", value: formatCurrency(economie, 2), highlight: true },
        { label: "Prix initial", value: formatCurrency(prix, 2) },
        { label: "Remise", value: formatPercent(remise, 0) },
        { label: "Taux payé", value: formatPercent(100 - remise, 0) },
      ],
    };
  },
});

const partageNoteRestaurant: SimulatorDefinition = draftSimulator({
  slug: "simulateur-partage-note-restaurant",
  title: "Partage note restaurant",
  shortDescription:
    "Répartissez l'addition entre convives avec pourboire et arrondi.",
  metaTitle: "Calculateur partage note restaurant — Addition",
  metaDescription:
    "Divisez l'addition du restaurant entre plusieurs personnes avec pourboire et part par convive.",
  keywords: ["partage addition", "split bill", "pourboire restaurant"],
  domain: "quotidien",
  category: "pratique",
  icon: "wallet",
  relatedSlugs: ["calculateur-pourboire", "partage-facture", "simulateur-remise-commerciale"],
  formFields: [
    { key: "total", label: "Montant total", type: "number", min: 0, step: 0.5, suffix: "€" },
    { key: "nbPersonnes", label: "Nombre de personnes", type: "number", min: 1, max: 20, suffix: "" },
    { key: "pourboire", label: "Pourboire", type: "number", min: 0, max: 30, step: 1, suffix: "%" },
  ],
  defaultValues: { total: 86, nbPersonnes: 4, pourboire: 10 },
  content: buildContent({
    intro: "Partager l'addition équitablement évite les calculs au moment de payer au restaurant.",
    howItWorks: [
      {
        title: "Répartition",
        blocks: [
          p("Total avec pourboire = Total × (1 + Pourboire/100). Part = Total avec pourboire / Nombre de personnes."),
          hl("Pourboire France", "5 à 10 % courant si service non inclus."),
        ],
      },
    ],
    conseils: ["Vérifiez si service compris (15 %).", "Apps de partage pour gros groupes.", "Arrondissez à l'euro supérieur par convive."],
    limites: ["Partage égal — pas de répartition par plat."],
  }),
  faq: buildFaq([
    { question: "Pourboire obligatoire ?", answer: "Non au France — service compris en théorie. 5-10 % apprécié si bon service." },
    { question: "Service compris ?", answer: "15 % en France — vérifiez l'addition avant d'ajouter un pourboire." },
    { question: "Payer séparément ?", answer: "Demandez au serveur — pas toujours possible selon établissement." },
  ]),
  calculate(input) {
    const total = num(input.total);
    const nb = num(input.nbPersonnes);
    const pourboire = num(input.pourboire);
    const avecPourboire = total * (1 + pourboire / 100);
    const part = nb > 0 ? avecPourboire / nb : 0;
    const partArrondie = Math.ceil(part * 100) / 100;
    return {
      summary: `${formatCurrency(partArrondie, 2)} par personne (${nb} convives).`,
      lines: [
        { label: "Part par personne", value: formatCurrency(partArrondie, 2), highlight: true },
        { label: "Total avec pourboire", value: formatCurrency(avecPourboire, 2), highlight: true },
        { label: "Pourboire total", value: formatCurrency(avecPourboire - total, 2) },
        { label: "Addition initiale", value: formatCurrency(total, 2) },
        { label: "Convives", value: `${nb}` },
      ],
    };
  },
});

const conversionUnitesCuisine: SimulatorDefinition = draftSimulator({
  slug: "simulateur-conversion-unites-cuisine",
  title: "Conversion unités cuisine",
  shortDescription:
    "Convertissez tasses, cuillères et grammes pour vos recettes.",
  metaTitle: "Convertisseur unités cuisine — Cups et grammes",
  metaDescription:
    "Convertissez les unités de cuisine : tasses en ml, cuillères en ml, cups US en ml pour vos recettes.",
  keywords: ["conversion cuisine", "tasse en ml", "cup en gramme"],
  domain: "quotidien",
  category: "conversion",
  icon: "calculator",
  relatedSlugs: ["simulateur-conversion-litre-gallon", "regle-de-trois", "simulateur-conversion-metre-pied"],
  formFields: [
    { key: "quantite", label: "Quantité", type: "number", min: 0, step: 0.25, suffix: "" },
    {
      key: "unite",
      label: "Unité source",
      type: "select",
      options: [
        { value: "tasse", label: "Tasse (250 ml)" },
        { value: "cup_us", label: "Cup US (240 ml)" },
        { value: "c_soupe", label: "Cuillère à soupe (15 ml)" },
        { value: "c_cafe", label: "Cuillère à café (5 ml)" },
        { value: "once_fl", label: "Once liquide (30 ml)" },
      ],
    },
  ],
  defaultValues: { quantite: 2, unite: "tasse" },
  content: buildContent({
    intro: "Les recettes américaines utilisent cups et ounces — ce convertisseur aide à adapter en ml.",
    howItWorks: [
      {
        title: "Équivalences",
        blocks: [
          p("Tasse FR = 250 ml. Cup US = 240 ml. C. soupe = 15 ml. C. café = 5 ml. Once liquide = 29,57 ml."),
          hl("Poids", "Grammes dépendent de l'ingrédient — farine ≠ sucre en volume."),
        ],
      },
    ],
    conseils: ["Pesez en grammes pour la pâtisserie.", "Utilisez des mesures rases pour les poudres.", "1 tasse = 16 c. soupe."],
    limites: ["Conversion volume uniquement.", "Grammes par ingrédient non calculés."],
  }),
  faq: buildFaq([
    { question: "Tasse ou cup ?", answer: "Tasse FR = 250 ml. Cup US = 240 ml — attention aux recettes." },
    { question: "Farine en grammes ?", answer: "1 tasse farine ≈ 125 g — varie selon compactage." },
    { question: "Beurre en tasses ?", answer: "1 tasse beurre = 225 g (2 sticks US)." },
  ]),
  calculate(input) {
    const q = num(input.quantite);
    const mlMap: Record<string, number> = { tasse: 250, cup_us: 240, c_soupe: 15, c_cafe: 5, once_fl: 29.57 };
    const unite = String(input.unite);
    const ml = q * (mlMap[unite] ?? 250);
    const cl = ml / 10;
    const l = ml / 1000;
    return {
      summary: `${formatNumber(q, 2)} ${unite} = ${formatNumber(ml, 0)} ml.`,
      lines: [
        { label: "Millilitres", value: `${formatNumber(ml, 0)} ml`, highlight: true },
        { label: "Centilitres", value: `${formatNumber(cl, 1)} cl` },
        { label: "Litres", value: `${formatNumber(l, 3)} L` },
        { label: "Quantité source", value: formatNumber(q, 2) },
        { label: "Unité", value: unite },
      ],
    };
  },
});

const calculDate: SimulatorDefinition = draftSimulator({
  slug: "simulateur-calcul-date",
  title: "Calcul de date",
  shortDescription:
    "Ajoutez ou soustrayez des jours à une date de référence.",
  metaTitle: "Calculateur date — Ajouter des jours",
  metaDescription:
    "Calculez une date future ou passée en ajoutant ou soustrayant un nombre de jours à une date de départ.",
  keywords: ["calcul date", "ajouter jours date", "date future"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["simulateur-jours-entre-deux-dates", "date-accouchement", "conges-payes-acquis"],
  formFields: [
    { key: "jour", label: "Jour de départ", type: "number", min: 1, max: 31, suffix: "" },
    { key: "mois", label: "Mois", type: "number", min: 1, max: 12, suffix: "" },
    { key: "annee", label: "Année", type: "number", min: 2020, max: 2035, suffix: "" },
    { key: "joursAjouter", label: "Jours à ajouter", type: "number", min: -3650, max: 3650, suffix: "" },
  ],
  defaultValues: { jour: 15, mois: 3, annee: 2025, joursAjouter: 90 },
  content: buildContent({
    intro: "Calculer une échéance (délai de rétractation, date de fin de contrat) en ajoutant des jours à une date.",
    howItWorks: [
      {
        title: "Addition de jours",
        blocks: [
          p("Date résultat = Date départ + N jours calendaires. Prise en compte des mois et années bissextiles."),
          hl("Jours ouvrés", "Ce simulateur compte les jours calendaires — pas les jours ouvrés."),
        ],
      },
    ],
    conseils: ["Délai légal : souvent jours calendaires.", "Jours ouvrés : exclure samedi, dimanche et fériés.", "Vérifiez les échéances contractuelles."],
    limites: ["Jours calendaires uniquement.", "Fériés non exclus."],
  }),
  faq: buildFaq([
    { question: "Jours calendaires ou ouvrés ?", answer: "Délai de rétractation : calendaires. Préavis emploi : souvent ouvrés." },
    { question: "Année bissextile ?", answer: "Prise en compte automatiquement (29 février)." },
    { question: "Date négative ?", answer: "Soustrayez des jours avec une valeur négative." },
  ]),
  calculate(input) {
    const d = new Date(num(input.annee), num(input.mois) - 1, num(input.jour));
    const jours = num(input.joursAjouter);
    d.setDate(d.getDate() + jours);
    const resultat = d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    const jourSemaine = d.toLocaleDateString("fr-FR", { weekday: "long" });
    return {
      summary: `Date résultat : ${resultat} (${jourSemaine}).`,
      lines: [
        { label: "Date résultat", value: resultat, highlight: true },
        { label: "Jour de la semaine", value: jourSemaine, highlight: true },
        { label: "Jours ajoutés", value: `${jours >= 0 ? "+" : ""}${jours}` },
        { label: "Date départ", value: `${num(input.jour)}/${num(input.mois)}/${num(input.annee)}` },
        { label: "Timestamp", value: d.toISOString().slice(0, 10) },
      ],
    };
  },
});

const joursEntreDeuxDates: SimulatorDefinition = draftSimulator({
  slug: "simulateur-jours-entre-deux-dates",
  title: "Jours entre deux dates",
  shortDescription:
    "Calculez le nombre de jours, semaines ou mois entre deux dates.",
  metaTitle: "Calculateur jours entre deux dates",
  metaDescription:
    "Comptez le nombre de jours calendaires entre deux dates : durée de contrat, délai, compte à rebours.",
  keywords: ["jours entre dates", "durée entre dates", "compte jours"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["simulateur-calcul-date", "date-accouchement", "conges-payes-acquis"],
  formFields: [
    { key: "jour1", label: "Jour début", type: "number", min: 1, max: 31, suffix: "" },
    { key: "mois1", label: "Mois début", type: "number", min: 1, max: 12, suffix: "" },
    { key: "annee1", label: "Année début", type: "number", min: 2000, max: 2035, suffix: "" },
    { key: "jour2", label: "Jour fin", type: "number", min: 1, max: 31, suffix: "" },
    { key: "mois2", label: "Mois fin", type: "number", min: 1, max: 12, suffix: "" },
    { key: "annee2", label: "Année fin", type: "number", min: 2000, max: 2035, suffix: "" },
  ],
  defaultValues: { jour1: 1, mois1: 1, annee1: 2025, jour2: 26, mois2: 6, annee2: 2025 },
  content: buildContent({
    intro: "Compter les jours entre deux dates est utile pour les délais légaux, congés et comptes à rebours.",
    howItWorks: [
      {
        title: "Durée",
        blocks: [
          p("Jours = Date fin − Date début (en jours calendaires). Semaines = Jours / 7. Mois ≈ Jours / 30,44."),
          hl("Inclusif", "Le jour de début n'est pas compté — standard délais légaux."),
        ],
      },
    ],
    conseils: ["Précisez si bornes incluses (contrats).", "Jours ouvrés : outil séparé nécessaire.", "Fuseau horaire : dates locales."],
    limites: ["Jours calendaires.", "Fériés non exclus."],
  }),
  faq: buildFaq([
    { question: "Jour de départ inclus ?", answer: "Non — standard pour délais légaux (jour suivant le déclencheur)." },
    { question: "Semaines et mois ?", answer: "Approximations — mois = jours / 30,44 en moyenne." },
    { question: "Dates inversées ?", answer: "Résultat négatif si date fin avant date début." },
  ]),
  calculate(input) {
    const d1 = new Date(num(input.annee1), num(input.mois1) - 1, num(input.jour1));
    const d2 = new Date(num(input.annee2), num(input.mois2) - 1, num(input.jour2));
    const ms = d2.getTime() - d1.getTime();
    const jours = Math.round(ms / (1000 * 60 * 60 * 24));
    const semaines = jours / 7;
    const mois = jours / 30.44;
    return {
      summary: `${jours} jour(s) — ${formatNumber(semaines, 1)} semaine(s) — ~${formatNumber(mois, 1)} mois.`,
      lines: [
        { label: "Jours", value: `${jours}`, highlight: true },
        { label: "Semaines", value: formatNumber(semaines, 1), highlight: true },
        { label: "Mois (approx.)", value: formatNumber(mois, 1) },
        { label: "Date début", value: d1.toLocaleDateString("fr-FR") },
        { label: "Date fin", value: d2.toLocaleDateString("fr-FR") },
      ],
    };
  },
});

const moyenneNotes: SimulatorDefinition = draftSimulator({
  slug: "simulateur-moyenne-notes",
  title: "Moyenne de notes",
  shortDescription:
    "Calculez la moyenne pondérée de plusieurs notes avec coefficients.",
  metaTitle: "Calculateur moyenne notes — Moyenne pondérée",
  metaDescription:
    "Calculez votre moyenne générale ou pondérée à partir de plusieurs notes et coefficients.",
  keywords: ["moyenne notes", "moyenne pondérée", "calcul moyenne"],
  domain: "quotidien",
  category: "pratique",
  icon: "calculator",
  relatedSlugs: ["regle-de-trois", "calculateur-pourcentage", "simulateur-pourcentage-augmentation-salaire"],
  formFields: [
    { key: "note1", label: "Note 1", type: "number", min: 0, max: 20, step: 0.25, suffix: "/20" },
    { key: "coef1", label: "Coef. 1", type: "number", min: 1, max: 10, suffix: "" },
    { key: "note2", label: "Note 2", type: "number", min: 0, max: 20, step: 0.25, suffix: "/20" },
    { key: "coef2", label: "Coef. 2", type: "number", min: 1, max: 10, suffix: "" },
    { key: "note3", label: "Note 3", type: "number", min: 0, max: 20, step: 0.25, suffix: "/20" },
    { key: "coef3", label: "Coef. 3", type: "number", min: 0, max: 10, suffix: "" },
  ],
  defaultValues: { note1: 14, coef1: 3, note2: 12, coef2: 2, note3: 16, coef3: 1 },
  content: buildContent({
    intro: "La moyenne pondérée tient compte de l'importance (coefficient) de chaque note.",
    howItWorks: [
      {
        title: "Formule",
        blocks: [
          p("Moyenne = Σ(Note × Coef) / Σ(Coef). Notes sur 20 — adaptez si autre barème."),
          hl("Mention", "En France : ≥ 16 très bien, ≥ 14 bien, ≥ 12 assez bien, ≥ 10 passable."),
        ],
      },
    ],
    conseils: ["Identifiez les matières à fort coefficient.", "Simulez la note minimale pour valider.", "Arrondi : souvent au 0,01 ou 0,25 près."],
    limites: ["3 notes max — ajoutez manuellement pour plus.", "Barème /20 par défaut."],
  }),
  faq: buildFaq([
    { question: "Moyenne simple vs pondérée ?", answer: "Pondérée : matières à coef 4 comptent double vs coef 2." },
    { question: "Note éliminatoire ?", answer: "Non calculée ici — vérifiez le règlement de l'établissement." },
    { question: "Moyenne sur 20 ?", answer: "Standard lycée/université France — adaptez si barème /100." },
  ]),
  calculate(input) {
    const notes = [
      { n: num(input.note1), c: num(input.coef1) },
      { n: num(input.note2), c: num(input.coef2) },
      { n: num(input.note3), c: num(input.coef3) },
    ].filter((x) => x.c > 0);
    const sumNC = notes.reduce((s, x) => s + x.n * x.c, 0);
    const sumC = notes.reduce((s, x) => s + x.c, 0);
    const moyenne = sumC > 0 ? sumNC / sumC : 0;
    let mention = "Insuffisant";
    if (moyenne >= 16) mention = "Très bien";
    else if (moyenne >= 14) mention = "Bien";
    else if (moyenne >= 12) mention = "Assez bien";
    else if (moyenne >= 10) mention = "Passable";
    return {
      summary: `Moyenne : ${formatNumber(moyenne, 2)}/20 — ${mention}.`,
      lines: [
        { label: "Moyenne", value: `${formatNumber(moyenne, 2)}/20`, highlight: true },
        { label: "Mention", value: mention, highlight: true },
        { label: "Total coefficients", value: `${sumC}` },
        { label: "Notes prises en compte", value: `${notes.length}` },
        { label: "Somme pondérée", value: formatNumber(sumNC, 2) },
      ],
    };
  },
});

const conversionMetrePied: SimulatorDefinition = draftSimulator({
  slug: "simulateur-conversion-metre-pied",
  title: "Conversion mètre pied",
  shortDescription:
    "Convertissez mètres en pieds et pouces (système impérial).",
  metaTitle: "Convertisseur mètre pied — m en ft",
  metaDescription:
    "Convertissez des mètres en pieds (feet) et pouces. 1 m = 3,28084 ft.",
  keywords: ["mètre pied", "conversion m ft", "mètres feet"],
  domain: "quotidien",
  category: "conversion",
  icon: "calculator",
  relatedSlugs: ["simulateur-conversion-litre-gallon", "simulateur-conversion-temperature", "convertisseur-devises"],
  formFields: [
    { key: "metres", label: "Mètres", type: "number", min: 0, step: 0.01, suffix: "m" },
  ],
  defaultValues: { metres: 1.75 },
  content: buildContent({
    intro: "Le pied (foot) est l'unité de longueur courante aux États-Unis et au Royaume-Uni.",
    howItWorks: [
      {
        title: "Conversion",
        blocks: [
          p("1 m = 3,28084 ft. 1 ft = 12 pouces (in). Pieds + pouces = partie entière ft + reste × 12 in."),
          hl("Taille", "1,75 m ≈ 5 ft 9 in."),
        ],
      },
    ],
    conseils: ["Recettes US : convertissez avant de cuisiner.", "Immobilier US : surface en sq ft.", "Double vérification pour travaux."],
    limites: ["Conversion exacte — pas d'arrondi métier."],
  }),
  faq: buildFaq([
    { question: "1 mètre en pieds ?", answer: "3,28084 pieds — arrondi 3,28 ft." },
    { question: "1 pied en cm ?", answer: "30,48 cm exactement." },
    { question: "Taille 6 ft ?", answer: "6 ft = 1,83 m environ." },
  ]),
  calculate(input) {
    const m = num(input.metres);
    const ft = m * 3.28084;
    const ftEntier = Math.floor(ft);
    const inches = (ft - ftEntier) * 12;
    return {
      summary: `${formatNumber(m, 2)} m = ${formatNumber(ft, 2)} ft (${ftEntier} ft ${formatNumber(inches, 1)} in).`,
      lines: [
        { label: "Pieds", value: `${formatNumber(ft, 2)} ft`, highlight: true },
        { label: "Format ft/in", value: `${ftEntier} ft ${formatNumber(inches, 1)} in`, highlight: true },
        { label: "Pouces total", value: `${formatNumber(ft * 12, 1)} in` },
        { label: "Mètres", value: `${formatNumber(m, 2)} m` },
        { label: "Centimètres", value: `${formatNumber(m * 100, 1)} cm` },
      ],
    };
  },
});

const conversionLitreGallon: SimulatorDefinition = draftSimulator({
  slug: "simulateur-conversion-litre-gallon",
  title: "Conversion litre gallon",
  shortDescription:
    "Convertissez litres en gallons US ou UK et inversement.",
  metaTitle: "Convertisseur litre gallon — L en gal",
  metaDescription:
    "Convertissez des litres en gallons américains (US) ou impériaux (UK). 1 L = 0,264 gal US.",
  keywords: ["litre gallon", "conversion L gal", "gallon en litre"],
  domain: "quotidien",
  category: "conversion",
  icon: "calculator",
  relatedSlugs: ["simulateur-conversion-unites-cuisine", "simulateur-conversion-metre-pied", "simulateur-conversion-temperature"],
  formFields: [
    { key: "litres", label: "Litres", type: "number", min: 0, step: 0.1, suffix: "L" },
    {
      key: "type",
      label: "Type gallon",
      type: "select",
      options: [
        { value: "us", label: "Gallon US (3,785 L)" },
        { value: "uk", label: "Gallon UK (4,546 L)" },
      ],
    },
  ],
  defaultValues: { litres: 50, type: "us" },
  content: buildContent({
    intro: "Le gallon US (3,785 L) diffère du gallon impérial UK (4,546 L) — attention aux recettes et consommations.",
    howItWorks: [
      {
        title: "Équivalences",
        blocks: [
          p("Gallon US = 3,78541 L. Gallon UK = 4,54609 L. Consommation voiture US : miles/gallon."),
          hl("Essence", "Prix US souvent en $/gallon — convertissez en €/L pour comparer."),
        ],
      },
    ],
    conseils: ["Vérifiez US vs UK dans la source.", "Carburant : gallon US en Amérique du Nord.", "Piscine : volumes souvent en gallons US."],
    limites: ["Conversion exacte standard."],
  }),
  faq: buildFaq([
    { question: "1 gallon US en litres ?", answer: "3,785 litres." },
    { question: "Gallon US vs UK ?", answer: "UK ≈ 20 % plus grand que US." },
    { question: "50 L en gallons ?", answer: "≈ 13,2 gal US ou 11 gal UK." },
  ]),
  calculate(input) {
    const l = num(input.litres);
    const type = String(input.type);
    const facteur = type === "uk" ? 4.54609 : 3.78541;
    const gal = l / facteur;
    return {
      summary: `${formatNumber(l, 1)} L = ${formatNumber(gal, 2)} gal ${type.toUpperCase()}.`,
      lines: [
        { label: "Gallons", value: `${formatNumber(gal, 2)} gal`, highlight: true },
        { label: "Litres", value: `${formatNumber(l, 1)} L`, highlight: true },
        { label: "Millilitres", value: `${formatNumber(l * 1000, 0)} ml` },
        { label: "Type gallon", value: type === "uk" ? "Impérial UK" : "US" },
        { label: "Facteur", value: `${formatNumber(facteur, 3)} L/gal` },
      ],
    };
  },
});

const conversionTemperature: SimulatorDefinition = draftSimulator({
  slug: "simulateur-conversion-temperature",
  title: "Conversion température",
  shortDescription:
    "Convertissez Celsius, Fahrenheit et Kelvin.",
  metaTitle: "Convertisseur température — °C °F K",
  metaDescription:
    "Convertissez des températures entre Celsius (°C), Fahrenheit (°F) et Kelvin (K).",
  keywords: ["conversion température", "celsius fahrenheit", "°C en °F"],
  domain: "quotidien",
  category: "conversion",
  icon: "calculator",
  relatedSlugs: ["simulateur-conversion-metre-pied", "simulateur-conversion-litre-gallon", "simulateur-conversion-unites-cuisine"],
  formFields: [
    { key: "valeur", label: "Température", type: "number", min: -273, max: 1000, step: 0.1, suffix: "" },
    {
      key: "unite",
      label: "Unité source",
      type: "select",
      options: [
        { value: "C", label: "Celsius (°C)" },
        { value: "F", label: "Fahrenheit (°F)" },
        { value: "K", label: "Kelvin (K)" },
      ],
    },
  ],
  defaultValues: { valeur: 20, unite: "C" },
  content: buildContent({
    intro: "Les recettes américaines et la météo US utilisent Fahrenheit — ce convertisseur facilite la lecture.",
    howItWorks: [
      {
        title: "Formules",
        blocks: [
          p("°F = °C × 9/5 + 32. °C = (°F − 32) × 5/9. K = °C + 273,15."),
          hl("Repères", "0 °C = 32 °F = 273 K. 100 °C = 212 °F. Four : 180 °C ≈ 350 °F."),
        ],
      },
    ],
    conseils: ["Four US : 350 °F ≈ 180 °C (moderate).", "Congélateur : −18 °C = 0 °F approx.", "Météo US : soustraire 30 et diviser par 2 (approximation rapide)."],
    limites: ["Conversion exacte standard."],
  }),
  faq: buildFaq([
    { question: "20 °C en Fahrenheit ?", answer: "68 °F — température ambiante confortable." },
    { question: "350 °F en Celsius ?", answer: "≈ 177 °C — four modéré US." },
    { question: "Zéro absolu ?", answer: "−273,15 °C = 0 K — limite thermodynamique." },
  ]),
  calculate(input) {
    const v = num(input.valeur);
    const unite = String(input.unite);
    let celsius = v;
    if (unite === "F") celsius = (v - 32) * (5 / 9);
    else if (unite === "K") celsius = v - 273.15;
    const fahrenheit = celsius * (9 / 5) + 32;
    const kelvin = celsius + 273.15;
    return {
      summary: `${formatNumber(celsius, 1)} °C = ${formatNumber(fahrenheit, 1)} °F = ${formatNumber(kelvin, 1)} K.`,
      lines: [
        { label: "Celsius", value: `${formatNumber(celsius, 1)} °C`, highlight: true },
        { label: "Fahrenheit", value: `${formatNumber(fahrenheit, 1)} °F`, highlight: true },
        { label: "Kelvin", value: `${formatNumber(kelvin, 1)} K` },
        { label: "Valeur source", value: `${formatNumber(v, 1)} ${unite}` },
        { label: "Four équivalent", value: `${formatNumber(celsius, 0)} °C ≈ ${formatNumber(fahrenheit, 0)} °F` },
      ],
    };
  },
});

const budgetCoursesFamille: SimulatorDefinition = draftSimulator({
  slug: "simulateur-budget-courses-famille",
  title: "Budget courses famille",
  shortDescription:
    "Estimez le budget alimentaire mensuel selon la taille du foyer.",
  metaTitle: "Simulateur budget courses — Alimentation famille",
  metaDescription:
    "Estimez le budget courses mensuel pour votre famille selon le nombre de personnes et le niveau de budget.",
  keywords: ["budget courses", "budget alimentation famille", "courses mensuelles"],
  domain: "quotidien",
  category: "epargne",
  icon: "wallet",
  relatedSlugs: ["budget-reste-a-vivre", "simulateur-partage-loyer-colocation", "simulateur-calcul-eco-trajet"],
  formFields: [
    { key: "nbPersonnes", label: "Personnes au foyer", type: "number", min: 1, max: 10, suffix: "" },
    {
      key: "niveau",
      label: "Niveau budget",
      type: "select",
      options: [
        { value: "economique", label: "Économique (200 €/pers.)" },
        { value: "moyen", label: "Moyen (280 €/pers.)" },
        { value: "confort", label: "Confort (380 €/pers.)" },
      ],
    },
  ],
  defaultValues: { nbPersonnes: 4, niveau: "moyen" },
  content: buildContent({
    intro: "Le budget alimentation varie selon la composition du foyer, les habitudes et la zone géographique.",
    howItWorks: [
      {
        title: "Estimation",
        blocks: [
          p("Budget mensuel = Nb personnes × Coût/personne selon niveau. INSEE : ~300 €/pers./mois en moyenne."),
          hl("Optimisation", "Planifier les repas réduit le gaspillage de 20-30 %."),
        ],
      },
    ],
    conseils: ["Listes de courses et comparateurs.", "Marques distributeur vs MDD.", "Batch cooking le dimanche."],
    limites: ["Moyennes nationales — Paris +15-20 %.", "Restaurants exclus."],
  }),
  faq: buildFaq([
    { question: "Budget alimentation France ?", answer: "~250-350 €/pers./mois selon études et zones." },
    { question: "Famille de 4 ?", answer: "800-1 200 €/mois en moyenne." },
    { question: "Réduire le budget ?", answer: "Planification repas, MDD, anti-gaspillage, marchés." },
  ]),
  calculate(input) {
    const nb = num(input.nbPersonnes);
    const coutMap: Record<string, number> = { economique: 200, moyen: 280, confort: 380 };
    const niveau = String(input.niveau);
    const coutPers = coutMap[niveau] ?? 280;
    const mensuel = nb * coutPers;
    const hebdo = mensuel / 4.33;
    const annuel = mensuel * 12;
    return {
      summary: `Budget ${formatCurrency(mensuel)}/mois (${formatCurrency(hebdo)}/semaine).`,
      lines: [
        { label: "Budget mensuel", value: formatCurrency(mensuel), highlight: true },
        { label: "Budget hebdomadaire", value: formatCurrency(hebdo), highlight: true },
        { label: "Budget annuel", value: formatCurrency(annuel) },
        { label: "Par personne", value: `${formatCurrency(coutPers)}/mois` },
        { label: "Foyer", value: `${nb} personne(s)` },
      ],
    };
  },
});

export const archivedQuotidienDrafts: SimulatorDefinition[] = [
  pourcentageAugmentationSalaire,
  remiseCommerciale,
  partageNoteRestaurant,
  conversionUnitesCuisine,
  calculDate,
  joursEntreDeuxDates,
  moyenneNotes,
  conversionMetrePied,
  conversionLitreGallon,
  conversionTemperature,
  budgetCoursesFamille,
];
