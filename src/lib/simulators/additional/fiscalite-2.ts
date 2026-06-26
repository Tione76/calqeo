import type { SimulatorDefinition } from "../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";
import { calculerIfi, IFI_ABATTEMENT_RP, IFI_SEUIL } from "@/data/regulations/ifi";
import { calculerDroitsMutation } from "@/data/regulations/donation";
import {
  MICRO_FONCIER_ABATTEMENT,
  MICRO_MEUBLE_ABATTEMENT,
  DONATION_ABATTEMENTS,
} from "@/lib/config/fiscalite";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

export const impotRevenusFonciers: SimulatorDefinition = {
  slug: "impot-revenus-fonciers",
  title: "Impôt sur les revenus fonciers",
  shortDescription:
    "Comparez le micro-foncier (abattement 30 %) et le régime réel pour estimer votre impôt locatif.",
  metaTitle: "Simulateur impôt revenus fonciers — Micro-foncier vs réel",
  metaDescription:
    "Estimez l'impôt sur vos revenus fonciers : régime micro-foncier (abattement 30 %) ou régime réel avec charges déductibles.",
  keywords: [
    "impôt revenus fonciers",
    "micro-foncier",
    "régime réel foncier",
    "location nue fiscalité",
  ],
  category: "fiscalite",
  icon: "percent",
  relatedSlugs: ["deficit-foncier", "location-meublee-vs-nue", "rendement-locatif-net"],
  formFields: [
    { key: "loyersAnnuels", label: "Loyers annuels encaissés", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "charges", label: "Charges déductibles (réel)", type: "number", min: 0, step: 100, suffix: "€", hint: "Taxe foncière, intérêts d'emprunt, travaux…" },
    { key: "tmi", label: "Tranche marginale d'imposition", type: "number", min: 0, max: 45, step: 1, suffix: "%" },
    {
      key: "regime",
      label: "Régime fiscal",
      type: "select",
      options: [
        { value: "micro", label: "Micro-foncier (abattement 30 %)" },
        { value: "reel", label: "Régime réel" },
      ],
    },
  ],
  defaultValues: { loyersAnnuels: 12000, charges: 4500, tmi: 30, regime: "micro" },
  content: buildContent({
    intro: "Les revenus de location nue sont imposés au barème de l'impôt sur le revenu, au régime micro-foncier ou au régime réel.",
    howItWorks: [
      {
        title: "Micro-foncier",
        blocks: [
          p("Applicable si les loyers annuels sont inférieurs à 15 000 €. Abattement forfaitaire de 30 % sur les recettes."),
          hl("Plafond", "Au-delà de 15 000 € de loyers annuels, le régime réel s'applique obligatoirement."),
        ],
      },
      {
        title: "Régime réel",
        blocks: [
          p("Vous déduisez l'ensemble des charges réelles : intérêts d'emprunt, taxe foncière, travaux, assurance, frais de gestion…"),
        ],
      },
    ],
    example: {
      title: "Loyers 12 000 €/an, TMI 30 %",
      blocks: [p("Micro : base imposable 8 400 € → impôt ~2 520 €. Réel avec 4 500 € de charges : base 7 500 € → impôt ~2 250 €.")],
    },
    conseils: [
      "Comparez les deux régimes chaque année avant la déclaration.",
      "Conservez toutes les factures de charges en régime réel.",
      "Les intérêts d'emprunt sont déductibles uniquement au réel.",
    ],
    limites: [
      "Estimation sans prélèvements sociaux (17,2 %) sur certains revenus.",
      "Plafond micro-foncier simplifié à 15 000 €.",
      "Ne remplace pas une liasse fiscale 2044.",
    ],
  }),
  faq: buildFaq([
    { question: "Micro-foncier ou réel : comment choisir ?", answer: "Micro si vos charges réelles sont inférieures à 30 % des loyers. Réel si vos charges (crédit, travaux) dépassent ce seuil." },
    { question: "Quel plafond pour le micro-foncier ?", answer: "15 000 € de loyers annuels hors charges. Au-delà, le régime réel est obligatoire." },
    { question: "Quelles charges déduire au réel ?", answer: "Intérêts d'emprunt, taxe foncière, travaux d'entretien, assurance PNO, frais de gestion, copropriété non récupérable." },
    { question: "Les prélèvements sociaux s'appliquent-ils ?", answer: "Les revenus fonciers sont soumis aux prélèvements sociaux (17,2 %) en plus de l'impôt sur le revenu." },
    { question: "Peut-on changer de régime ?", answer: "Oui, option pour le réel possible chaque année si vous êtes au micro. Au réel, engagement de 3 ans." },
  ]),
  calculate(input) {
    const loyers = num(input.loyersAnnuels);
    const charges = num(input.charges);
    const tmi = num(input.tmi) / 100;
    const regime = String(input.regime);
    const base = regime === "micro" ? loyers * MICRO_FONCIER_ABATTEMENT : Math.max(0, loyers - charges);
    const impot = base * tmi;
    const autreRegime = regime === "micro" ? Math.max(0, loyers - charges) : loyers * MICRO_FONCIER_ABATTEMENT;
    const impotAutre = autreRegime * tmi;
    return {
      summary: `Impôt estimé (${regime === "micro" ? "micro-foncier" : "réel"}) : ${formatCurrency(impot)}/an.`,
      lines: [
        { label: "Impôt estimé", value: formatCurrency(impot), highlight: true },
        { label: "Base imposable", value: formatCurrency(base) },
        { label: "Loyers annuels", value: formatCurrency(loyers) },
        { label: "Régime choisi", value: regime === "micro" ? "Micro-foncier" : "Régime réel" },
        {
          label: "Impôt avec l'autre régime",
          value: formatCurrency(impotAutre),
          description: impotAutre < impot ? "L'autre régime serait plus avantageux" : undefined,
        },
      ],
    };
  },
};

export const taxeFonciere: SimulatorDefinition = {
  slug: "taxe-fonciere",
  title: "Taxe foncière",
  shortDescription:
    "Estimez le montant annuel de votre taxe foncière à partir de la valeur locative cadastrale.",
  metaTitle: "Simulateur taxe foncière — Estimation annuelle",
  metaDescription:
    "Calculez une estimation de votre taxe foncière : valeur locative cadastrale, abattement 50 % et taux communal.",
  keywords: ["taxe foncière", "calcul taxe foncière", "valeur locative cadastrale"],
  category: "fiscalite",
  icon: "building",
  relatedSlugs: ["impot-revenus-fonciers", "rendement-locatif-net", "charges-recuperables-locataire"],
  formFields: [
    { key: "vlc", label: "Valeur locative cadastrale", type: "number", min: 0, step: 100, suffix: "€", hint: "Indiquée sur l'avis d'imposition ou demande au centre des impôts" },
    { key: "tauxCommune", label: "Taux communal", type: "number", min: 0, max: 60, step: 0.1, suffix: "%", hint: "Taux voté par la commune (souvent 20 à 45 %)" },
    { key: "tauxInterco", label: "Taux intercommunal", type: "number", min: 0, max: 20, step: 0.1, suffix: "%" },
  ],
  defaultValues: { vlc: 8000, tauxCommune: 25, tauxInterco: 5 },
  content: buildContent({
    intro: "La taxe foncière est calculée sur la valeur locative cadastrale réduite de 50 %, multipliée par les taux votés.",
    howItWorks: [{ title: "Formule", blocks: [hl("Calcul", "Taxe foncière ≈ VLC × 50 % × (taux commune + taux intercommunal + taux départemental)"), p("Les taux varient selon la commune. L'estimation utilise les taux que vous indiquez.")] }],
    example: { title: "VLC 8 000 €, taux 30 %", blocks: [p("Base imposable : 4 000 €. Taxe estimée : 4 000 × 30 % = 1 200 €/an.")] },
    conseils: ["Consultez votre avis d'imposition pour la VLC exacte.", "La taxe foncière est due par le propriétaire, pas le locataire.", "Vérifiez les exonérations (neuf, seniors…)."],
    limites: ["Taux départemental non détaillé séparément.", "Exonérations et dégrèvements non modélisés."],
  }),
  faq: buildFaq([
    { question: "Où trouver la valeur locative cadastrale ?", answer: "Sur votre avis de taxe foncière ou en contactant le centre des impôts foncier." },
    { question: "Qui paie la taxe foncière ?", answer: "Le propriétaire du bien au 1er janvier de l'année d'imposition." },
    { question: "Peut-on la déduire en location ?", answer: "Oui, en location nue au régime réel. Non déductible en micro-foncier." },
    { question: "Pourquoi la taxe augmente-t-elle ?", answer: "Révision des valeurs cadastrales, hausse des taux locaux ou revalorisation de la VLC." },
  ]),
  calculate(input) {
    const base = num(input.vlc) * 0.5;
    const taux = (num(input.tauxCommune) + num(input.tauxInterco) + 10) / 100;
    const taxe = base * taux;
    return {
      summary: `Taxe foncière estimée : ${formatCurrency(taxe)}/an.`,
      lines: [
        { label: "Taxe foncière estimée", value: formatCurrency(taxe), highlight: true },
        { label: "Base imposable (VLC × 50 %)", value: formatCurrency(base) },
        { label: "Taux global estimé", value: formatPercent(taux * 100, 1) },
        { label: "Valeur locative cadastrale", value: formatCurrency(num(input.vlc)) },
      ],
    };
  },
};

export const deficitFoncier: SimulatorDefinition = {
  slug: "deficit-foncier",
  title: "Déficit foncier",
  shortDescription:
    "Estimez votre déficit foncier et l'économie d'impôt sur le revenu global (plafond 10 700 €).",
  metaTitle: "Simulateur déficit foncier — Calcul et imputation",
  metaDescription:
    "Calculez le déficit foncier de votre location nue et estimez l'économie d'impôt sur le revenu global.",
  keywords: ["déficit foncier", "imputation revenu global", "location nue travaux"],
  category: "fiscalite",
  icon: "percent",
  relatedSlugs: ["impot-revenus-fonciers", "budget-travaux", "rendement-locatif-net"],
  formFields: [
    { key: "loyers", label: "Loyers annuels", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "charges", label: "Charges hors intérêts", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "interets", label: "Intérêts d'emprunt", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "travaux", label: "Travaux déductibles", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "tmi", label: "Tranche marginale d'imposition", type: "number", min: 0, max: 45, step: 1, suffix: "%" },
  ],
  defaultValues: { loyers: 9000, charges: 2000, interets: 5500, travaux: 12000, tmi: 30 },
  content: buildContent({
    intro: "Un déficit foncier survient quand les charges déductibles dépassent les loyers perçus.",
    howItWorks: [{ title: "Imputation", blocks: [p("Le déficit hors intérêts est imputable sur le revenu global dans la limite de 10 700 €/an. L'excédent est reportable 10 ans sur les revenus fonciers."), hl("Travaux", "Seuls certains travaux (entretien, amélioration) ouvrent droit à imputation sur le revenu global.")] }],
    conseils: ["Planifiez les travaux pour optimiser l'imputation.", "Les intérêts d'emprunt ne sont imputables que sur les revenus fonciers.", "Conservez les devis et factures."],
    limites: ["Distinction travaux déductibles / non déductibles simplifiée.", "Reports pluriannuels non détaillés."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'un déficit foncier ?", answer: "Excédent des charges (hors intérêts) sur les loyers perçus en location nue au régime réel." },
    { question: "Quel plafond d'imputation ?", answer: "10 700 €/an sur le revenu global pour la part hors intérêts." },
    { question: "Les intérêts d'emprunt ?", answer: "Imputables uniquement sur les revenus fonciers futurs, sans limite de durée (10 ans)." },
    { question: "Travaux de rénovation éligibles ?", answer: "Travaux d'entretien et d'amélioration oui. Travaux de construction/reconstruction non." },
  ]),
  calculate(input) {
    const loyers = num(input.loyers);
    const totalCharges = num(input.charges) + num(input.travaux) + num(input.interets);
    const resultat = loyers - totalCharges;
    const deficit = Math.max(0, -resultat);
    const horsInterets = Math.max(0, num(input.charges) + num(input.travaux) - loyers);
    const imputable = Math.min(horsInterets, 10700);
    const ecoImpot = imputable * (num(input.tmi) / 100);
    return {
      summary: deficit > 0 ? `Déficit foncier : ${formatCurrency(deficit)} — Économie d'impôt estimée : ${formatCurrency(ecoImpot)}.` : "Pas de déficit foncier sur cette période.",
      lines: [
        { label: "Déficit foncier total", value: formatCurrency(deficit), highlight: true },
        { label: "Imputable sur revenu global", value: formatCurrency(imputable), highlight: true },
        { label: "Économie d'impôt estimée", value: formatCurrency(ecoImpot) },
        { label: "Résultat foncier", value: formatCurrency(resultat) },
        { label: "Loyers annuels", value: formatCurrency(loyers) },
      ],
    };
  },
};

export const donationSuccession: SimulatorDefinition = {
  slug: "donation-succession-immobiliere",
  title: "Donation / succession immobilière",
  shortDescription:
    "Estimez les droits de mutation à titre gratuit sur la transmission d'un bien immobilier.",
  metaTitle: "Simulateur donation succession immobilière — Droits de mutation",
  metaDescription:
    "Estimez les droits de donation ou succession sur un bien immobilier : abattements et barème progressif simplifié.",
  keywords: ["donation immobilière", "droits succession", "transmission patrimoine"],
  category: "fiscalite",
  icon: "building",
  relatedSlugs: ["ifi-impot-fortune-immobiliere", "plus-value-immobiliere", "taxe-fonciere"],
  formFields: [
    { key: "valeurBien", label: "Valeur du bien transmis", type: "number", min: 0, step: 10000, suffix: "€" },
    {
      key: "lien",
      label: "Lien de parenté",
      type: "select",
      options: [
        { value: "enfant", label: "Parent → enfant" },
        { value: "petitenfant", label: "Grand-parent → petit-enfant" },
        { value: "conjoint", label: "Conjoint / partenaire PACS" },
        { value: "autre", label: "Autre lien" },
      ],
    },
    { key: "abattementUtilise", label: "Abattement déjà utilisé (15 ans)", type: "number", min: 0, step: 5000, suffix: "€" },
  ],
  defaultValues: { valeurBien: 350000, lien: "enfant", abattementUtilise: 0 },
  content: buildContent({
    intro: "La donation ou succession d'un bien immobilier entraîne des droits de mutation calculés sur la valeur vénale nette du bien.",
    howItWorks: [{ title: "Abattements", blocks: [p("Abattement enfant : 100 000 € tous les 15 ans. Petit-enfant : 31 865 €. Conjoint/PACS : exonération totale."), hl("Barème", "Droits progressifs de 5 % à 45 % selon les tranches.")] }],
    example: { title: "Donation 350 000 € à un enfant", blocks: [p("Abattement 100 000 € → base 250 000 €. Droits estimés selon le barème progressif.")] },
    conseils: ["Planifiez les donations par étapes pour optimiser les abattements.", "Faites estimer le bien par un notaire.", "Le démembrement (usufruit/nue-propriété) peut réduire les droits."],
    limites: ["Barème simplifié — calcul notarial requis pour le montant exact.", "Démembrement et pacte Dutreil non modélisés."],
  }),
  faq: buildFaq([
    { question: "Donation ou succession : même calcul ?", answer: "Les barèmes sont similaires mais les abattements et délais diffèrent selon le mode de transmission." },
    { question: "Quel abattement enfant ?", answer: "100 000 € par parent et par enfant, renouvelable tous les 15 ans." },
    { question: "Le conjoint paie-t-il des droits ?", answer: "Non, exonération totale entre époux et partenaires PACS." },
    { question: "Comment réduire les droits ?", answer: "Donations échelonnées, démembrement de propriété, assurance-vie en complément." },
  ]),
  calculate(input) {
    const valeur = num(input.valeurBien);
    const lien = String(input.lien);
    const abattements: Record<string, number> = {
      enfant: DONATION_ABATTEMENTS.enfant,
      petitenfant: DONATION_ABATTEMENTS.petitenfant,
      conjoint: valeur,
      autre: DONATION_ABATTEMENTS.autre,
    };
    const abattement = Math.max(0, (abattements[lien] ?? DONATION_ABATTEMENTS.autre) - num(input.abattementUtilise));
    if (lien === "conjoint") {
      return {
        summary: "Exonération totale entre conjoints ou partenaires PACS.",
        lines: [
          { label: "Droits estimés", value: formatCurrency(0), highlight: true },
          { label: "Valeur transmise", value: formatCurrency(valeur) },
          { label: "Lien", value: "Conjoint / PACS" },
        ],
      };
    }
    const base = Math.max(0, valeur - abattement);
    const droits = calculerDroitsMutation(base);
    return {
      summary: `Droits estimés : ${formatCurrency(droits)} (base taxable : ${formatCurrency(base)}).`,
      lines: [
        { label: "Droits estimés", value: formatCurrency(droits), highlight: true },
        { label: "Base taxable", value: formatCurrency(base) },
        { label: "Abattement appliqué", value: formatCurrency(Math.min(abattement, valeur)) },
        { label: "Valeur du bien", value: formatCurrency(valeur) },
      ],
    };
  },
};

export const locationMeubleeVsNue: SimulatorDefinition = {
  slug: "location-meublee-vs-nue",
  title: "Location meublée vs location nue",
  shortDescription:
    "Comparez la fiscalité et la rentabilité d'une location meublée (LMNP) et d'une location nue.",
  metaTitle: "Simulateur location meublée vs nue — Comparatif fiscal",
  metaDescription:
    "Comparez location meublée (LMNP/micro-BIC) et location nue (micro-foncier/réel) : impôt et rentabilité nette.",
  keywords: ["location meublée vs nue", "LMNP comparatif", "location nue fiscalité"],
  category: "fiscalite",
  icon: "chart",
  relatedSlugs: ["rentabilite-lmnp", "impot-revenus-fonciers", "rendement-locatif-net"],
  formFields: [
    { key: "investissement", label: "Investissement total", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "loyerNue", label: "Loyer mensuel location nue", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "loyerMeublee", label: "Loyer mensuel meublé", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "chargesNue", label: "Charges annuelles (nue)", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "chargesMeublee", label: "Charges annuelles (meublé)", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "tmi", label: "Tranche marginale d'imposition", type: "number", min: 0, max: 45, step: 1, suffix: "%" },
  ],
  defaultValues: { investissement: 180000, loyerNue: 750, loyerMeublee: 900, chargesNue: 2800, chargesMeublee: 3200, tmi: 30 },
  content: buildContent({
    intro: "Le choix entre location meublée et nue impacte loyers perçus, fiscalité et gestion locative.",
    howItWorks: [{ title: "Comparatif", blocks: [p("Location nue : revenus fonciers (micro 30 % ou réel). Meublée : BIC (micro 50 % ou réel avec amortissement)."), hl("Loyers", "La location meublée permet en général 15 à 25 % de loyer en plus, avec plus de rotation locative.")] }],
    conseils: ["Comparez le rendement net après impôt, pas seulement le loyer.", "Le meublé implique des obligations (inventaire, meubles).", "Consultez un expert-comptable pour le LMNP au réel."],
    limites: ["Micro-foncier et micro-BIC uniquement.", "Amortissement LMNP réel non détaillé."],
  }),
  faq: buildFaq([
    { question: "Meublé ou nu : lequel choisir ?", answer: "Meublé si loyers plus élevés et rotation acceptée. Nu si gestion long terme et charges faibles." },
    { question: "Quelle fiscalité plus avantageuse ?", answer: "Dépend de vos charges et TMI. Le micro-BIC (50 %) est souvent compétitif à faibles charges." },
    { question: "Peut-on passer de l'un à l'autre ?", answer: "Oui, en changeant le statut du bail et les meubles, avec des implications fiscales." },
    { question: "Lien avec le simulateur LMNP ?", answer: "Voir aussi /simulateurs/rentabilite-lmnp pour le détail LMNP." },
  ]),
  calculate(input) {
    const invest = num(input.investissement);
    const tmi = num(input.tmi) / 100;
    const recettesNue = num(input.loyerNue) * 12;
    const recettesMeublee = num(input.loyerMeublee) * 12;
    const impotNue = Math.max(0, recettesNue * MICRO_FONCIER_ABATTEMENT) * tmi;
    const impotMeublee = Math.max(0, recettesMeublee * MICRO_MEUBLE_ABATTEMENT) * tmi;
    const rendNue = invest > 0 ? ((recettesNue - num(input.chargesNue) - impotNue) / invest) * 100 : 0;
    const rendMeublee = invest > 0 ? ((recettesMeublee - num(input.chargesMeublee) - impotMeublee) / invest) * 100 : 0;
    const gagnant = rendMeublee > rendNue ? "Meublée" : "Nue";
    return {
      summary: `Meilleur rendement net après impôt : ${gagnant} (${formatPercent(Math.max(rendNue, rendMeublee), 2)}).`,
      lines: [
        { label: "Rendement net meublée (après impôt)", value: formatPercent(rendMeublee, 2), highlight: rendMeublee >= rendNue },
        { label: "Rendement net nue (après impôt)", value: formatPercent(rendNue, 2), highlight: rendNue > rendMeublee },
        { label: "Impôt meublée estimé", value: formatCurrency(impotMeublee) },
        { label: "Impôt nue estimé", value: formatCurrency(impotNue) },
        { label: "Loyers annuels meublée", value: formatCurrency(recettesMeublee) },
        { label: "Loyers annuels nue", value: formatCurrency(recettesNue) },
      ],
    };
  },
};

export const ifiFortuneImmobiliere: SimulatorDefinition = {
  slug: "ifi-impot-fortune-immobiliere",
  title: "IFI — Impôt Fortune Immobilière",
  shortDescription:
    "Estimez l'IFI sur votre patrimoine immobilier net taxable.",
  metaTitle: "Simulateur IFI — Impôt sur la Fortune Immobilière 2025",
  metaDescription:
    "Calculez une estimation de l'IFI : patrimoine immobilier net, abattement résidence principale et barème progressif.",
  keywords: ["IFI", "impôt fortune immobilière", "calcul IFI"],
  category: "fiscalite",
  icon: "percent",
  relatedSlugs: ["donation-succession-immobiliere", "plus-value-immobiliere", "taxe-fonciere"],
  formFields: [
    { key: "patrimoineBrut", label: "Patrimoine immobilier brut", type: "number", min: 0, step: 50000, suffix: "€" },
    { key: "dettes", label: "Dettes immobilières déductibles", type: "number", min: 0, step: 10000, suffix: "€" },
    { key: "valeurRP", label: "Valeur résidence principale", type: "number", min: 0, step: 10000, suffix: "€", hint: "Abattement 30 % sur la RP" },
  ],
  defaultValues: { patrimoineBrut: 1800000, dettes: 200000, valeurRP: 650000 },
  content: buildContent({
    intro: "L'IFI s'applique aux contribuables dont le patrimoine immobilier net taxable dépasse 1,3 million d'euros.",
    howItWorks: [{ title: "Barème IFI", blocks: [p("Barème progressif de 0,5 % à 1,5 % selon les tranches. Abattement de 30 % sur la valeur de la résidence principale."), hl("Seuil", "Patrimoine net taxable > 1 300 000 €.")] }],
    conseils: ["Les dettes liées à l'acquisition sont déductibles.", "L'IFI se déclare avec l'impôt sur le revenu.", "Certaines biens ruraux ou forestiers bénéficient d'exonérations."],
    limites: ["Barème simplifié.", "Exonérations spécifiques non détaillées."],
  }),
  faq: buildFaq([
    { question: "Qui paie l'IFI ?", answer: "Les foyers dont le patrimoine immobilier net taxable dépasse 1,3 M€ au 1er janvier." },
    { question: "Quel abattement sur la RP ?", answer: "30 % sur la valeur de la résidence principale, sous conditions d'occupation." },
    { question: "Les SCPI sont-elles concernées ?", answer: "Oui, les parts de SCPI entrent dans l'assiette IFI." },
    { question: "IFI et plus-value ?", answer: "L'IFI et l'impôt sur la plus-value sont distincts." },
  ]),
  calculate(input) {
    const brut = num(input.patrimoineBrut);
    const rp = num(input.valeurRP);
    const abattementRP = rp * IFI_ABATTEMENT_RP;
    const net = brut - abattementRP - num(input.dettes);
    if (net <= IFI_SEUIL) {
      return {
        summary: "Patrimoine net sous le seuil de 1,3 M€ — IFI non dû.",
        lines: [
          { label: "IFI estimé", value: formatCurrency(0), highlight: true },
          { label: "Patrimoine net taxable", value: formatCurrency(Math.max(0, net)) },
          { label: "Seuil IFI", value: formatCurrency(IFI_SEUIL) },
        ],
      };
    }
    const ifi = calculerIfi(net);
    return {
      summary: `IFI estimé : ${formatCurrency(ifi)}/an.`,
      lines: [
        { label: "IFI estimé", value: formatCurrency(ifi), highlight: true },
        { label: "Patrimoine net taxable", value: formatCurrency(net) },
        { label: "Abattement RP (30 %)", value: formatCurrency(abattementRP) },
        { label: "Patrimoine brut", value: formatCurrency(brut) },
        { label: "Dettes déductibles", value: formatCurrency(num(input.dettes)) },
      ],
    };
  },
};

export const fiscaliteSimulatorsPart2 = [
  impotRevenusFonciers,
  taxeFonciere,
  deficitFoncier,
  donationSuccession,
  locationMeubleeVsNue,
  ifiFortuneImmobiliere,
];
