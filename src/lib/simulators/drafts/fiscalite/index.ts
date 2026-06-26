import type {
  FormField,
  SimulatorCategory,
  SimulatorDefinition,
  SimulatorIcon,
  SimulatorResult,
} from "../../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";
import { calculerImpotBareme } from "@/data/regulations/impot";
import {
  PFU_TAUX_GLOBAL,
  TVA_TAUX,
  FRANCHISE_TVA,
} from "@/data/regulations/fiscalite";
import {
  calculerIfi,
  IFI_SEUIL,
  IFI_ABATTEMENT_RP,
} from "@/data/regulations/ifi";
import {
  calculerDroitsMutation,
  DONATION_ABATTEMENT_ENFANT,
} from "@/data/regulations/donation";
import { MICRO_ENTREPRENEUR_PLAFONDS } from "@/data/regulations/urssaf";

const IS_TAUX_NORMAL = 0.25;

const IS_TAUX_REDUIT = 0.15;

const IS_SEUIL_REDUIT = 42_500;

const PS_TAUX = 0.172;

const REDUCTION_DONS_66 = 0.66;

const REDUCTION_DONS_75 = 0.75;

const IMPOT_MINIMUM_TAUX = 0.2;

const EXPATRIATION_EXONERATION = 0.5;

const PINEL_TAUX = 0.12;

const DENORMANDIE_TAUX = 0.21;

/** Barème fiscal usufruit / nue-propriété selon l'âge de l'usufruitier (CGI art. 669). */

function coeffUsufruit(age: number): number {
  if (age < 21) return 0.9;
  if (age < 31) return 0.8;
  if (age < 41) return 0.7;
  if (age < 51) return 0.6;
  if (age < 61) return 0.5;
  if (age < 71) return 0.4;
  if (age < 81) return 0.3;
  return 0.2;
}

type DraftSpec = {
  slug: string;
  title: string;
  shortDescription: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: SimulatorCategory;
  icon: SimulatorIcon;
  regulationIds?: string[];
  formFields: FormField[];
  defaultValues: Record<string, number | string>;
  intro: string;
  howTitle: string;
  howDetail: string;
  faqItems: { question: string; answer: string }[];
  relatedSlugs?: string[];
  calculate: (input: Record<string, number | string>) => SimulatorResult;
};

function createDraft(spec: DraftSpec): SimulatorDefinition {
  return draftSimulator({
    slug: spec.slug,
    title: spec.title,
    shortDescription: spec.shortDescription,
    metaTitle: spec.metaTitle,
    metaDescription: spec.metaDescription,
    keywords: spec.keywords,
    domain: "fiscalite",
    category: spec.category,
    icon: spec.icon,
    regulationIds: spec.regulationIds,
    relatedSlugs: spec.relatedSlugs,
    formFields: spec.formFields,
    defaultValues: spec.defaultValues,
    content: buildContent({
      intro: spec.intro,
      howItWorks: [{ title: spec.howTitle, blocks: [p(spec.howDetail), hl("Estimation", "Calcul simplifié — consultez impots.gouv.fr ou un fiscaliste.")] }],
      conseils: ["Conservez tous les justificatifs de dépenses et revenus.", "Anticipez les échéances de déclaration et de paiement."],
      limites: ["Estimation pédagogique — ne remplace pas une liasse fiscale.", "Barèmes 2025 — révisions annuelles possibles."],
    }),
    faq: buildFaq(spec.faqItems),
    calculate: spec.calculate,
  });
}

const impotSocietes = createDraft({
  slug: "simulateur-impot-societes",
  title: "Impôt sur les sociétés",
  shortDescription: "Estimez l'IS sur le bénéfice fiscal avec le taux réduit PME (15 % jusqu'à 42 500 €).",
  metaTitle: "Simulateur impôt sur les sociétés — IS 2025",
  metaDescription: "Calculez l'impôt sur les sociétés : taux réduit 15 % et taux normal 25 % sur le bénéfice imposable.",
  keywords: ["impôt sociétés", "IS 2025", "taux IS PME"],
  category: "impots",
  icon: "percent",
  regulationIds: ["fiscalite", "impot"],
  relatedSlugs: ["simulateur-eurl-is", "impot-sur-le-revenu"],
  formFields: [
    { key: "benefice", label: "Bénéfice imposable", type: "number", min: 0, step: 1000, suffix: "€" },
  ],
  defaultValues: { benefice: 100000 },
  intro: "L'impôt sur les sociétés s'applique aux bénéfices des sociétés soumises à l'IS.",
  howTitle: "Taux IS 2025",
  howDetail: "15 % jusqu'à 42 500 € de bénéfice (PME éligible), 25 % au-delà.",
  faqItems: [
    { question: "Qui paie l'IS ?", answer: "SA, SAS, SARL à l'IS, EURL à l'IS et autres personnes morales soumises à l'IS." },
    { question: "Quelles conditions pour le taux réduit ?", answer: "CA < 10 M€, capital détenu à ≥ 75 % par des personnes physiques, détention des titres ≥ 75 %." },
    { question: "Quand payer l'IS ?", answer: "Acomptes trimestriels ou mensuels, solde au plus tard le 15e jour du 4e mois suivant la clôture." },
  ],
  calculate(input) {
    const b = num(input.benefice);
    const is = b <= IS_SEUIL_REDUIT ? b * IS_TAUX_REDUIT : IS_SEUIL_REDUIT * IS_TAUX_REDUIT + (b - IS_SEUIL_REDUIT) * IS_TAUX_NORMAL;
    return {
      summary: `IS estimé : ${formatCurrency(is)} (taux effectif ${formatPercent((is / b) * 100, 1)}).`,
      lines: [
        { label: "Impôt sur les sociétés", value: formatCurrency(is), highlight: true },
        { label: "Bénéfice imposable", value: formatCurrency(b) },
        { label: "Taux effectif", value: formatPercent((is / b) * 100, 1) },
        { label: "Bénéfice après IS", value: formatCurrency(b - is) },
      ],
    };
  },
});

const tvaDeductible = createDraft({
  slug: "simulateur-tva-deductible",
  title: "TVA déductible",
  shortDescription: "Calculez la TVA nette à payer : TVA collectée − TVA déductible.",
  metaTitle: "Simulateur TVA déductible — TVA nette à payer",
  metaDescription: "Estimez la TVA nette à reverser : TVA collectée sur ventes moins TVA déductible sur achats.",
  keywords: ["TVA déductible", "TVA nette", "calcul TVA entreprise"],
  category: "impots",
  icon: "calculator",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-tva-intracommunautaire", "micro-entrepreneur-charges"],
  formFields: [
    { key: "caHT", label: "Chiffre d'affaires HT", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "achatsHT", label: "Achats HT soumis à TVA", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "tauxTVA", label: "Taux de TVA", type: "number", min: 5.5, max: 20, step: 0.5, suffix: "%" },
  ],
  defaultValues: { caHT: 120000, achatsHT: 45000, tauxTVA: TVA_TAUX.normal },
  intro: "Les entreprises assujetties à la TVA collectent la taxe sur leurs ventes et déduisent celle payée sur leurs achats.",
  howTitle: "TVA nette",
  howDetail: "TVA collectée = CA HT × taux. TVA déductible = achats HT × taux. Solde = collectée − déductible.",
  faqItems: [
    { question: "Quand déclarer la TVA ?", answer: "Mensuellement ou trimestriellement selon le régime (réel normal ou simplifié)." },
    { question: "Crédit de TVA ?", answer: "Si déductible > collectée, le crédit est reporté ou remboursé." },
    { question: "TVA sur immobilisations ?", answer: "Déductible immédiatement si bien affecté à une activité taxable." },
  ],
  calculate(input) {
    const ca = num(input.caHT);
    const achats = num(input.achatsHT);
    const taux = num(input.tauxTVA) / 100;
    const collectee = ca * taux;
    const deductible = achats * taux;
    const solde = collectee - deductible;
    return {
      summary: solde >= 0 ? `TVA nette à payer : ${formatCurrency(solde)}.` : `Crédit de TVA : ${formatCurrency(-solde)}.`,
      lines: [
        { label: "TVA nette", value: formatCurrency(solde), highlight: true },
        { label: "TVA collectée", value: formatCurrency(collectee) },
        { label: "TVA déductible", value: formatCurrency(deductible) },
        { label: "Taux appliqué", value: formatPercent(taux * 100, 1) },
      ],
    };
  },
});

const tvsVehicule = createDraft({
  slug: "simulateur-tvs-vehicule",
  title: "TVS véhicule de société",
  shortDescription: "Estimez la Taxe sur les Véhicules de Société (ex-TVS) selon les émissions CO₂.",
  metaTitle: "Simulateur TVS véhicule — Taxe véhicules société",
  metaDescription: "Calculez la taxe annuelle sur les véhicules de société selon les émissions CO₂ et la puissance fiscale.",
  keywords: ["TVS", "taxe véhicule société", "CO2 véhicule entreprise"],
  category: "impots",
  icon: "percent",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-avantage-nature-vehicule", "simulateur-impot-locaux-professionnels"],
  formFields: [
    { key: "emissionCo2", label: "Émissions CO₂", type: "number", min: 0, max: 300, step: 1, suffix: "g/km" },
    { key: "puissanceFiscale", label: "Puissance fiscale", type: "number", min: 1, max: 20, step: 1, suffix: "CV" },
  ],
  defaultValues: { emissionCo2: 130, puissanceFiscale: 6 },
  intro: "La TVS (ex-TVS) taxe les véhicules de tourisme utilisés par les entreprises.",
  howTitle: "Barème CO₂ simplifié",
  howDetail: "Taxe = barème CO₂ + composante polluants selon la puissance fiscale (estimation pédagogique).",
  faqItems: [
    { question: "Tous les véhicules sont-ils concernés ?", answer: "VT et VUL ≤ 3,5 t utilisés par l'entreprise, sauf véhicules utilitaires exclus." },
    { question: "Électriques exonérés ?", answer: "Les véhicules 100 % électriques sont exonérés de la composante CO₂." },
    { question: "Hybrides rechargeables ?", answer: "Exonération partielle selon autonomie électrique et émissions CO₂." },
  ],
  calculate(input) {
    const co2 = num(input.emissionCo2);
    const cv = num(input.puissanceFiscale);
    const taxeCo2 = co2 <= 50 ? 0 : co2 <= 100 ? 200 : co2 <= 130 ? 600 : co2 <= 160 ? 1200 : 2000;
    const taxeCV = cv * 50;
    const total = taxeCo2 + taxeCV;
    return {
      summary: `TVS estimée : ${formatCurrency(total)}/an.`,
      lines: [
        { label: "TVS totale", value: formatCurrency(total), highlight: true },
        { label: "Composante CO₂", value: formatCurrency(taxeCo2) },
        { label: "Composante CV", value: formatCurrency(taxeCV) },
        { label: "Émissions CO₂", value: `${co2} g/km` },
      ],
    };
  },
});

const ifiAbattementDuree = createDraft({
  slug: "simulateur-ifi-abattement-duree",
  title: "IFI — abattement durée détention",
  shortDescription: "Estimez l'IFI avec abattement pour durée de détention des biens immobiliers secondaires.",
  metaTitle: "Simulateur IFI abattement durée — Détention immobilière",
  metaDescription: "Calculez l'IFI avec abattement pour durée de détention : 5 à 30 % selon les années de propriété.",
  keywords: ["IFI abattement", "durée détention IFI", "impôt fortune immobilière"],
  category: "impots",
  icon: "home",
  regulationIds: ["ifi"],
  relatedSlugs: ["ifi-impot-fortune-immobiliere", "simulateur-nue-propriete-usufruit"],
  formFields: [
    { key: "patrimoineImmobilier", label: "Patrimoine immobilier net", type: "number", min: 0, step: 50000, suffix: "€" },
    { key: "residencePrincipale", label: "Dont résidence principale", type: "number", min: 0, step: 50000, suffix: "€" },
    { key: "anneesDetention", label: "Années de détention (biens secondaires)", type: "number", min: 0, max: 30, step: 1, suffix: "ans" },
  ],
  defaultValues: { patrimoineImmobilier: 2000000, residencePrincipale: 800000, anneesDetention: 10 },
  intro: "L'IFI s'applique au-delà de 1,3 M€ de patrimoine net taxable, avec abattement RP et abattement pour durée de détention.",
  howTitle: "Abattements IFI",
  howDetail: "RP : abattement 30 %. Biens secondaires : abattement progressif de 5 à 50 % selon la durée de détention (22 ans max).",
  faqItems: [
    { question: "Quel seuil IFI ?", answer: `${formatCurrency(IFI_SEUIL)} de patrimoine net taxable.` },
    { question: "L'abattement RP s'applique comment ?", answer: `Abattement de ${formatPercent(IFI_ABATTEMENT_RP * 100, 0)} sur la valeur de la résidence principale.` },
    { question: "Biens professionnels exonérés ?", answer: "Les parts de sociétés opérationnelles peuvent être exonérées sous conditions de détention." },
  ],
  calculate(input) {
    const patrimoine = num(input.patrimoineImmobilier);
    const rp = num(input.residencePrincipale);
    const ans = num(input.anneesDetention);
    const secondaire = Math.max(0, patrimoine - rp);
    const abattRP = rp * IFI_ABATTEMENT_RP;
    const abattDuree = Math.min(0.5, ans * 0.05);
    const base = patrimoine - abattRP - secondaire * abattDuree;
    const ifi = calculerIfi(base);
    return {
      summary: base >= IFI_SEUIL ? `IFI estimé : ${formatCurrency(ifi)}/an (base ${formatCurrency(base)}).` : "Patrimoine sous le seuil IFI.",
      lines: [
        { label: "IFI estimé", value: formatCurrency(ifi), highlight: true },
        { label: "Base nette taxable", value: formatCurrency(base) },
        { label: "Abattement durée", value: formatPercent(abattDuree * 100, 0) },
        { label: "Abattement RP", value: formatCurrency(abattRP) },
      ],
    };
  },
});

const donationPartage = createDraft({
  slug: "simulateur-donation-partage",
  title: "Donation-partage",
  shortDescription: "Estimez les droits de donation-partage après abattement enfant (100 000 €).",
  metaTitle: "Simulateur donation-partage — Droits de donation",
  metaDescription: "Calculez les droits de donation-partage : abattement 100 000 € par enfant et barème progressif.",
  keywords: ["donation-partage", "droits donation", "abattement donation enfant"],
  category: "impots",
  icon: "wallet",
  regulationIds: ["donation"],
  relatedSlugs: ["donation-succession-immobiliere", "simulateur-nue-propriete-usufruit"],
  formFields: [
    { key: "valeurBien", label: "Valeur du bien transmis", type: "number", min: 0, step: 10000, suffix: "€" },
    { key: "nombreEnfants", label: "Nombre d'enfants donataires", type: "number", min: 1, max: 10, step: 1 },
  ],
  defaultValues: { valeurBien: 400000, nombreEnfants: 2 },
  intro: "La donation-partage permet de transmettre un patrimoine de son vivant avec abattements renouvelables tous les 15 ans.",
  howTitle: "Abattement et droits",
  howDetail: `Abattement ${formatCurrency(DONATION_ABATTEMENT_ENFANT)} par enfant. Droits sur la base taxable restante.`,
  faqItems: [
    { question: "Donation-partage vs donation simple ?", answer: "La donation-partage fixe définitivement la quote-part de chaque enfant, évitant les conflits post-décès." },
    { question: "L'abattement se renouvelle-t-il ?", answer: "Oui, tous les 15 ans pour chaque enfant." },
    { question: "Donation de biens indivis ?", answer: "Possible — chaque enfant reçoit une quote-part définie dès la donation." },
  ],
  calculate(input) {
    const valeur = num(input.valeurBien);
    const enfants = num(input.nombreEnfants);
    const partParEnfant = valeur / enfants;
    const baseTaxable = Math.max(0, partParEnfant - DONATION_ABATTEMENT_ENFANT);
    const droitsParEnfant = calculerDroitsMutation(baseTaxable);
    const droitsTotal = droitsParEnfant * enfants;
    return {
      summary: `Droits totaux estimés : ${formatCurrency(droitsTotal)} (${formatCurrency(droitsParEnfant)}/enfant).`,
      lines: [
        { label: "Droits totaux", value: formatCurrency(droitsTotal), highlight: true },
        { label: "Droits par enfant", value: formatCurrency(droitsParEnfant) },
        { label: "Part par enfant", value: formatCurrency(partParEnfant) },
        { label: "Base taxable/enfant", value: formatCurrency(baseTaxable) },
      ],
    };
  },
});

const nueProprieteUsufruit = createDraft({
  slug: "simulateur-nue-propriete-usufruit",
  title: "Nue-propriété / usufruit",
  shortDescription: "Calculez la valeur fiscale de la nue-propriété et de l'usufruit selon l'âge.",
  metaTitle: "Simulateur nue-propriété usufruit — Barème fiscal",
  metaDescription: "Estimez la répartition nue-propriété / usufruit selon le barème fiscal (CGI art. 669).",
  keywords: ["nue-propriété", "usufruit", "démembrement fiscal"],
  category: "impots",
  icon: "home",
  regulationIds: ["donation", "fiscalite"],
  relatedSlugs: ["simulateur-donation-partage", "donation-succession-immobiliere"],
  formFields: [
    { key: "valeurPleinePropriete", label: "Valeur en pleine propriété", type: "number", min: 0, step: 10000, suffix: "€" },
    { key: "ageUsufruitier", label: "Âge de l'usufruitier", type: "number", min: 18, max: 100, step: 1, suffix: "ans" },
  ],
  defaultValues: { valeurPleinePropriete: 500000, ageUsufruitier: 65 },
  intro: "Le démembrement de propriété sépare l'usufruit (usage) et la nue-propriété (propriété future).",
  howTitle: "Barème CGI art. 669",
  howDetail: "La valeur de l'usufruit est déterminée par l'âge de l'usufruitier ; la nue-propriété = PP − usufruit.",
  faqItems: [
    { question: "Pourquoi démembrer ?", answer: "Pour réduire les droits de donation ou de succession tout en conservant l'usage du bien." },
    { question: "L'usufruit s'éteint quand ?", answer: "Au décès de l'usufruitier ou à l'arrivée du terme fixé." },
    { question: "Usufruit temporaire ?", answer: "Possible par donation ou testament avec durée fixée (ex. 20 ans)." },
  ],
  calculate(input) {
    const pp = num(input.valeurPleinePropriete);
    const age = num(input.ageUsufruitier);
    const coeffU = coeffUsufruit(age);
    const usufruit = pp * coeffU;
    const nuePropriete = pp - usufruit;
    return {
      summary: `Usufruit : ${formatCurrency(usufruit)} (${formatPercent(coeffU * 100, 0)}) — Nue-propriété : ${formatCurrency(nuePropriete)}.`,
      lines: [
        { label: "Valeur usufruit", value: formatCurrency(usufruit), highlight: true },
        { label: "Valeur nue-propriété", value: formatCurrency(nuePropriete), highlight: true },
        { label: "Pleine propriété", value: formatCurrency(pp) },
        { label: "Âge usufruitier", value: `${age} ans` },
      ],
    };
  },
});

const impotRevenuFonctionnaire = createDraft({
  slug: "simulateur-impot-revenu-fonctionnaire",
  title: "Impôt revenu fonctionnaire",
  shortDescription: "Estimez l'impôt sur le revenu d'un fonctionnaire avec abattement 10 % sur traitements.",
  metaTitle: "Simulateur impôt revenu fonctionnaire — Traitements publics",
  metaDescription: "Calculez l'impôt sur le revenu d'un fonctionnaire : traitement indiciaire, abattement 10 % et barème progressif.",
  keywords: ["impôt fonctionnaire", "traitement indiciaire impôt", "IR fonction publique"],
  category: "impots",
  icon: "percent",
  regulationIds: ["impot"],
  relatedSlugs: ["impot-sur-le-revenu", "quotient-familial"],
  formFields: [
    { key: "traitementBrut", label: "Traitement brut annuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "parts", label: "Nombre de parts fiscales", type: "number", min: 1, max: 6, step: 0.5 },
    { key: "autresRevenus", label: "Autres revenus imposables", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { traitementBrut: 42000, parts: 2, autresRevenus: 0 },
  intro: "Les fonctionnaires sont imposés à l'IR sur leurs traitements et salaires, avec un abattement forfaitaire de 10 %.",
  howTitle: "Abattement 10 %",
  howDetail: "Revenu net catégoriel = traitement brut × 90 % (min 504 €, max 14 426 € d'abattement). Impôt = barème / parts.",
  faqItems: [
    { question: "Indemnités exonérées ?", answer: "Certaines indemnités de résidence ou de sujétions ne sont pas imposables — liste spécifique." },
    { question: "Prélèvement à la source ?", answer: "Appliqué mensuellement sur la base du taux personnalisé ou neutre." },
    { question: "Quotient familial fonction publique ?", answer: "Même barème IR que les salariés du privé, avec abattement 10 % sur traitements." },
  ],
  calculate(input) {
    const traitement = num(input.traitementBrut);
    const parts = num(input.parts);
    const autres = num(input.autresRevenus);
    const abattement = Math.min(14426, Math.max(504, traitement * 0.1));
    const net = traitement - abattement + autres;
    const impot = calculerImpotBareme(net / parts) * parts;
    return {
      summary: `Impôt estimé : ${formatCurrency(impot)}/an (revenu net ${formatCurrency(net)}).`,
      lines: [
        { label: "Impôt sur le revenu", value: formatCurrency(impot), highlight: true },
        { label: "Revenu net imposable", value: formatCurrency(net) },
        { label: "Abattement 10 %", value: formatCurrency(abattement) },
        { label: "Parts fiscales", value: `${parts}` },
      ],
    };
  },
});

const reductionImpotDons = createDraft({
  slug: "simulateur-reduction-impot-dons",
  title: "Réduction d'impôt — dons",
  shortDescription: "Estimez la réduction d'impôt pour dons aux organismes d'intérêt général (66 % ou 75 %).",
  metaTitle: "Simulateur réduction impôt dons — 66 % et 75 %",
  metaDescription: "Calculez la réduction d'impôt pour vos dons : 66 % aux associations, 75 % aux organismes d'aide aux personnes.",
  keywords: ["réduction impôt dons", "dons associations", "66 % dons"],
  category: "impots",
  icon: "wallet",
  regulationIds: ["fiscalite", "impot"],
  relatedSlugs: ["impot-sur-le-revenu", "credit-impot-emploi-domicile"],
  formFields: [
    { key: "montantDon", label: "Montant du don", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "typeOrganisme", label: "Type d'organisme", type: "select", options: [{ value: "66", label: "Intérêt général (66 %)" }, { value: "75", label: "Aide personnes en difficulté (75 %)" }] },
  ],
  defaultValues: { montantDon: 500, typeOrganisme: "66" },
  intro: "Les dons aux organismes d'intérêt général ouvrent droit à une réduction d'impôt sur le revenu.",
  howTitle: "Taux de réduction",
  howDetail: "66 % pour les OIG classiques, 75 % pour les organismes d'aide aux personnes en difficulté (plafond 1 000 €).",
  faqItems: [
    { question: "Plafond de réduction ?", answer: "20 % du revenu imposable global pour les dons 66 %. 1 000 € pour les dons 75 %." },
    { question: "Reçu fiscal nécessaire ?", answer: "Oui, l'organisme doit être habilité et délivrer un reçu fiscal." },
    { question: "Dons en nature ?", answer: "Possibles (mécénat de compétences) — évaluation et reçu fiscal spécifique." },
  ],
  calculate(input) {
    const don = num(input.montantDon);
    const type = String(input.typeOrganisme);
    const taux = type === "75" ? REDUCTION_DONS_75 : REDUCTION_DONS_66;
    const plafond = type === "75" ? 1000 : Infinity;
    const base = Math.min(don, plafond);
    const reduction = base * taux;
    return {
      summary: `Réduction d'impôt : ${formatCurrency(reduction)} (${formatPercent(taux * 100, 0)} du don).`,
      lines: [
        { label: "Réduction d'impôt", value: formatCurrency(reduction), highlight: true },
        { label: "Montant du don", value: formatCurrency(don) },
        { label: "Taux appliqué", value: formatPercent(taux * 100, 0) },
        { label: "Coût réel après réduction", value: formatCurrency(don - reduction) },
      ],
    };
  },
});

const impotLocauxProfessionnels = createDraft({
  slug: "simulateur-impot-locaux-professionnels",
  title: "Impôts locaux professionnels",
  shortDescription: "Estimez CFE et taxe foncière sur les locaux professionnels.",
  metaTitle: "Simulateur impôts locaux professionnels — CFE et foncière",
  metaDescription: "Calculez une estimation des impôts locaux sur locaux professionnels : CFE et taxe foncière.",
  keywords: ["impôts locaux professionnels", "CFE locaux pro", "taxe foncière entreprise"],
  category: "impots",
  icon: "building",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-cfe", "taxe-fonciere"],
  formFields: [
    { key: "valeurLocative", label: "Valeur locative cadastrale", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "tauxCommunal", label: "Taux communal global", type: "number", min: 0, max: 50, step: 0.5, suffix: "%" },
  ],
  defaultValues: { valeurLocative: 8000, tauxCommunal: 25 },
  intro: "Les locaux professionnels sont soumis à la taxe foncière (propriétaire) et à la CFE (occupant).",
  howTitle: "Taxes cumulées",
  howDetail: "Taxe foncière ≈ VLC × 50 % × taux. CFE ≈ VLC × taux CFE communal.",
  faqItems: [
    { question: "Propriétaire ou locataire ?", answer: "Taxe foncière : propriétaire. CFE : occupant (locataire ou propriétaire)." },
    { question: "Exonérations ?", answer: "Première année CFE exonérée ; exonérations artisanales sous conditions." },
    { question: "Taxe foncière sur locaux pro ?", answer: "Due par le propriétaire sur la valeur locative cadastrale des locaux." },
  ],
  calculate(input) {
    const vlc = num(input.valeurLocative);
    const taux = num(input.tauxCommunal) / 100;
    const fonciere = vlc * 0.5 * taux;
    const cfe = vlc * 0.003;
    const total = fonciere + cfe;
    return {
      summary: `Impôts locaux estimés : ${formatCurrency(total)}/an.`,
      lines: [
        { label: "Total impôts locaux", value: formatCurrency(total), highlight: true },
        { label: "Taxe foncière", value: formatCurrency(fonciere) },
        { label: "CFE estimée", value: formatCurrency(cfe) },
        { label: "Valeur locative", value: formatCurrency(vlc) },
      ],
    };
  },
});

const microBicPlafond = createDraft({
  slug: "simulateur-micro-bic-plafond",
  title: "Micro-BIC — plafond CA",
  shortDescription: "Vérifiez le respect du plafond de chiffre d'affaires du régime micro-BIC.",
  metaTitle: "Simulateur micro-BIC plafond — Franchise 2025",
  metaDescription: "Vérifiez les plafonds micro-BIC : 77 700 € vente, 188 700 € prestations et franchise TVA.",
  keywords: ["micro-BIC plafond", "franchise BIC", "plafond auto-entrepreneur"],
  category: "impots",
  icon: "calculator",
  regulationIds: ["urssaf", "fiscalite"],
  relatedSlugs: ["simulateur-micro-bnc-plafond", "micro-entrepreneur-charges"],
  formFields: [
    { key: "caAnnuel", label: "Chiffre d'affaires annuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "typeActivite", label: "Activité", type: "select", options: [{ value: "vente", label: "Vente / hébergement" }, { value: "prestations", label: "Prestations de services" }] },
  ],
  defaultValues: { caAnnuel: 70000, typeActivite: "prestations" },
  intro: "Le régime micro-BIC impose des plafonds de CA et un abattement forfaitaire pour frais.",
  howTitle: "Plafonds micro-BIC",
  howDetail: `Vente : ${formatCurrency(MICRO_ENTREPRENEUR_PLAFONDS.vente)}. Prestations : ${formatCurrency(MICRO_ENTREPRENEUR_PLAFONDS.prestations)}. Abattement 50 % (BIC services) ou 71 % (vente).`,
  faqItems: [
    { question: "Franchise TVA ?", answer: `Prestations < ${formatCurrency(FRANCHISE_TVA.prestations)}, ventes < ${formatCurrency(FRANCHISE_TVA.ventes)}.` },
    { question: "Dépassement ?", answer: "Sortie du micro au 1er janvier suivant le dépassement (franchise majorée 25 % la 1re année)." },
    { question: "Abattement forfaitaire BIC ?", answer: "71 % pour ventes, 50 % pour prestations de services — base imposable réduite." },
  ],
  calculate(input) {
    const ca = num(input.caAnnuel);
    const type = String(input.typeActivite);
    const plafond = type === "vente" ? MICRO_ENTREPRENEUR_PLAFONDS.vente : MICRO_ENTREPRENEUR_PLAFONDS.prestations;
    const abattement = type === "vente" ? 0.29 : 0.5;
    const baseImposable = ca * (1 - abattement);
    const conforme = ca <= plafond;
    return {
      summary: conforme ? `Dans les plafonds — base imposable : ${formatCurrency(baseImposable)}.` : `Plafond dépassé — bascule régime réel à prévoir.`,
      lines: [
        { label: "Plafond applicable", value: formatCurrency(plafond), highlight: true },
        { label: "CA annuel", value: formatCurrency(ca) },
        { label: "Base imposable estimée", value: formatCurrency(baseImposable) },
        { label: "Conformité", value: conforme ? "OK" : "Dépassement" },
      ],
    };
  },
});

const microBncPlafond = createDraft({
  slug: "simulateur-micro-bnc-plafond",
  title: "Micro-BNC — plafond CA",
  shortDescription: "Vérifiez le plafond micro-BNC pour les professions libérales (188 700 €).",
  metaTitle: "Simulateur micro-BNC plafond — Professions libérales",
  metaDescription: "Vérifiez le plafond micro-BNC : 188 700 € de CA et abattement forfaitaire 34 %.",
  keywords: ["micro-BNC plafond", "profession libérale micro", "BNC plafond"],
  category: "impots",
  icon: "calculator",
  regulationIds: ["urssaf", "fiscalite"],
  relatedSlugs: ["simulateur-micro-bic-plafond", "revenu-net-independant"],
  formFields: [
    { key: "caAnnuel", label: "Recettes annuelles BNC", type: "number", min: 0, step: 1000, suffix: "€" },
  ],
  defaultValues: { caAnnuel: 90000 },
  intro: "Le micro-BNC s'adresse aux professions libérales avec un abattement forfaitaire de 34 %.",
  howTitle: "Plafond et abattement",
  howDetail: `Plafond ${formatCurrency(MICRO_ENTREPRENEUR_PLAFONDS.prestations)}. Base imposable = recettes × 66 %.`,
  faqItems: [
    { question: "Professions concernées ?", answer: "Professions libérales non commerciales : consultants, médecins, avocats (sous conditions)." },
    { question: "Cotisations sociales ?", answer: "Taux URSSAF micro-BNC ~24,6 % sur le CA." },
    { question: "Option régime réel BNC ?", answer: "Possible si avantageuse — déduction des charges réelles au lieu de l'abattement 34 %." },
  ],
  calculate(input) {
    const ca = num(input.caAnnuel);
    const plafond = MICRO_ENTREPRENEUR_PLAFONDS.prestations;
    const base = ca * 0.66;
    const conforme = ca <= plafond;
    return {
      summary: conforme ? `Base imposable BNC : ${formatCurrency(base)}/an.` : "Plafond micro-BNC dépassé.",
      lines: [
        { label: "Base imposable", value: formatCurrency(base), highlight: true },
        { label: "Recettes annuelles", value: formatCurrency(ca) },
        { label: "Plafond", value: formatCurrency(plafond) },
        { label: "Conformité", value: conforme ? "OK" : "Dépassement" },
      ],
    };
  },
});

const defiscalisationPinel = createDraft({
  slug: "simulateur-defiscalisation-pinel",
  title: "Défiscalisation Pinel",
  shortDescription: "Estimez la réduction d'impôt Pinel pour un investissement locatif neuf.",
  metaTitle: "Simulateur Pinel — Réduction d'impôt immobilier",
  metaDescription: "Calculez la réduction d'impôt Pinel : 12 à 21 % du prix selon la durée d'engagement locatif.",
  keywords: ["Pinel", "défiscalisation Pinel", "investissement locatif neuf"],
  category: "fiscalite",
  icon: "home",
  regulationIds: ["fiscalite", "immobilier"],
  relatedSlugs: ["simulateur-denormandie", "rendement-locatif"],
  formFields: [
    { key: "prixAchat", label: "Prix d'achat (plafonné 300 000 €)", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "dureeEngagement", label: "Durée d'engagement", type: "select", options: [{ value: "6", label: "6 ans (12 %)" }, { value: "9", label: "9 ans (18 %)" }, { value: "12", label: "12 ans (21 %)" }] },
  ],
  defaultValues: { prixAchat: 250000, dureeEngagement: "6" },
  intro: "Le dispositif Pinel (remplacé progressivement) permet une réduction d'impôt pour investissement locatif neuf.",
  howTitle: "Taux de réduction",
  howDetail: "6 ans : 12 %, 9 ans : 18 %, 12 ans : 21 % du prix d'achat (plafonné 300 000 €, 5 500 €/m²).",
  faqItems: [
    { question: "Pinel est-il encore ouvert ?", answer: "Le Pinel+ a remplacé le Pinel classique — vérifiez les conditions en vigueur." },
    { question: "Plafonds de loyer et ressources ?", answer: "Oui, loyers et ressources des locataires sont plafonnés selon la zone." },
    { question: "Engagement locatif Pinel ?", answer: "Location nue à usage de résidence principale pendant 6, 9 ou 12 ans selon option." },
  ],
  calculate(input) {
    const prix = Math.min(num(input.prixAchat), 300000);
    const duree = String(input.dureeEngagement);
    const taux = duree === "12" ? 0.21 : duree === "9" ? 0.18 : PINEL_TAUX;
    const reduction = prix * taux;
    return {
      summary: `Réduction Pinel estimée : ${formatCurrency(reduction)} sur ${duree} ans.`,
      lines: [
        { label: "Réduction totale", value: formatCurrency(reduction), highlight: true },
        { label: "Prix retenu", value: formatCurrency(prix) },
        { label: "Taux appliqué", value: formatPercent(taux * 100, 0) },
        { label: "Durée engagement", value: `${duree} ans` },
      ],
    };
  },
});

const impotPlusValueMobilier = createDraft({
  slug: "simulateur-impot-plus-value-mobilier",
  title: "Impôt plus-value mobilière",
  shortDescription: "Estimez l'impôt sur une plus-value de cession de valeurs mobilières (PFU 30 %).",
  metaTitle: "Simulateur plus-value mobilière — Flat tax 30 %",
  metaDescription: "Calculez l'impôt sur une plus-value mobilière : prélèvement forfaitaire unique 30 % ou barème.",
  keywords: ["plus-value mobilière", "flat tax plus-value", "PFU cession valeurs"],
  category: "impots",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["flat-tax-30-pourcent", "impot-dividendes", "simulateur-prelevements-sociaux-revenus"],
  formFields: [
    { key: "prixCession", label: "Prix de cession", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "prixAcquisition", label: "Prix d'acquisition", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "frais", label: "Frais de cession", type: "number", min: 0, step: 10, suffix: "€" },
  ],
  defaultValues: { prixCession: 15000, prixAcquisition: 10000, frais: 50 },
  intro: "Les plus-values mobilières sont en principe soumises au PFU de 30 % (12,8 % IR + 17,2 % PS).",
  howTitle: "PFU sur plus-value",
  howDetail: "Plus-value = cession − acquisition − frais. Impôt = plus-value × 30 %.",
  faqItems: [
    { question: "Option barème possible ?", answer: "Oui, si plus avantageux — comparez PFU et barème progressif + PS." },
    { question: "PEA exonéré ?", answer: "Plus-values exonérées après 5 ans de détention (hors PS avant 2017)." },
    { question: "Pertes en capital ?", answer: "Les moins-values peuvent s'imputer sur les plus-values de l'année ou des 10 suivantes." },
  ],
  calculate(input) {
    const pv = Math.max(0, num(input.prixCession) - num(input.prixAcquisition) - num(input.frais));
    const impot = pv * PFU_TAUX_GLOBAL;
    const net = pv - impot;
    return {
      summary: `Plus-value : ${formatCurrency(pv)} — impôt PFU : ${formatCurrency(impot)} — net : ${formatCurrency(net)}.`,
      lines: [
        { label: "Plus-value nette", value: formatCurrency(pv), highlight: true },
        { label: "Impôt PFU (30 %)", value: formatCurrency(impot) },
        { label: "Gain net après impôt", value: formatCurrency(net), highlight: true },
        { label: "Prix de cession", value: formatCurrency(num(input.prixCession)) },
      ],
    };
  },
});

const prelevementsSociauxRevenus = createDraft({
  slug: "simulateur-prelevements-sociaux-revenus",
  title: "Prélèvements sociaux revenus",
  shortDescription: "Estimez les prélèvements sociaux (17,2 %) sur revenus du patrimoine et capitaux.",
  metaTitle: "Simulateur prélèvements sociaux — 17,2 % CSG CRDS",
  metaDescription: "Calculez les prélèvements sociaux de 17,2 % sur revenus fonciers, capitaux mobiliers et plus-values.",
  keywords: ["prélèvements sociaux", "17,2 % CSG CRDS", "PS revenus patrimoine"],
  category: "impots",
  icon: "percent",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-impot-plus-value-mobilier", "impot-revenus-fonciers"],
  formFields: [
    { key: "revenus", label: "Revenus soumis aux PS", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { revenus: 10000 },
  intro: "Les revenus du patrimoine (fonciers, capitaux, plus-values) supportent 17,2 % de prélèvements sociaux.",
  howTitle: "Taux global 17,2 %",
  howDetail: "CSG (9,2 %) + CRDS (0,5 %) + prélèvement solidarité (7,5 %) = 17,2 % sur la base imposable.",
  faqItems: [
    { question: "Quels revenus sont concernés ?", answer: "Revenus fonciers, revenus de capitaux mobiliers, plus-values, revenus de locations meublées." },
    { question: "Cumul avec l'IR ?", answer: "Oui, les PS s'ajoutent à l'impôt sur le revenu ou au PFU." },
    { question: "CSG déductible ?", answer: "6,8 % de CSG déductible du revenu imposable l'année suivante pour certains revenus." },
  ],
  calculate(input) {
    const rev = num(input.revenus);
    const ps = rev * PS_TAUX;
    return {
      summary: `Prélèvements sociaux : ${formatCurrency(ps)} (${formatPercent(PS_TAUX * 100, 1)}).`,
      lines: [
        { label: "Prélèvements sociaux", value: formatCurrency(ps), highlight: true },
        { label: "Revenus concernés", value: formatCurrency(rev) },
        { label: "Taux PS", value: formatPercent(PS_TAUX * 100, 1) },
        { label: "Net après PS", value: formatCurrency(rev - ps) },
      ],
    };
  },
});

const impotMinimum = createDraft({
  slug: "simulateur-impot-minimum",
  title: "Impôt minimum",
  shortDescription: "Estimez si l'impôt minimum de 20 % s'applique sur les revenus à faible imposition.",
  metaTitle: "Simulateur impôt minimum — Contribution minimum",
  metaDescription: "Vérifiez si la contribution minimum d'impôt (20 % des revenus élevés) s'applique à votre situation.",
  keywords: ["impôt minimum", "contribution minimum impôt", "CEHR"],
  category: "impots",
  icon: "scale",
  regulationIds: ["impot"],
  relatedSlugs: ["impot-sur-le-revenu", "simulateur-impot-revenu-fonctionnaire"],
  formFields: [
    { key: "revenuImposable", label: "Revenu imposable", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "impotCalcule", label: "Impôt calculé (barème)", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { revenuImposable: 150000, impotCalcule: 35000 },
  intro: "La contribution minimum vise les hauts revenus dont l'impôt effectif serait trop faible grâce à des niches fiscales.",
  howTitle: "Mécanisme simplifié",
  howDetail: "Si impôt < 20 % × revenu imposable (au-delà de seuils), complément dû pour atteindre ce minimum.",
  faqItems: [
    { question: "Qui est concerné ?", answer: "Contribuables avec revenus > 250 000 € (célibataire) dont le taux effectif d'imposition est faible." },
    { question: "CEHR distincte ?", answer: "La CEHR (hauts revenus) est une contribution additionnelle distincte." },
    { question: "Quels revenus pour le minimum ?", answer: "Revenus nets imposables après abattements, hors plus-values exonérées." },
  ],
  calculate(input) {
    const rev = num(input.revenuImposable);
    const impot = num(input.impotCalcule);
    const minimum = rev * IMPOT_MINIMUM_TAUX;
    const complement = Math.max(0, minimum - impot);
    const tauxEffectif = rev > 0 ? (impot / rev) * 100 : 0;
    return {
      summary: complement > 0 ? `Complément impôt minimum : ${formatCurrency(complement)}.` : "Impôt supérieur au minimum — pas de complément.",
      lines: [
        { label: "Complément éventuel", value: formatCurrency(complement), highlight: true },
        { label: "Impôt calculé", value: formatCurrency(impot) },
        { label: "Impôt minimum (20 %)", value: formatCurrency(minimum) },
        { label: "Taux effectif actuel", value: formatPercent(tauxEffectif, 1) },
      ],
    };
  },
});

const avantageNatureVehicule = createDraft({
  slug: "simulateur-avantage-nature-vehicule",
  title: "Avantage en nature véhicule",
  shortDescription: "Estimez l'avantage en nature d'un véhicule de fonction ou de service.",
  metaTitle: "Simulateur avantage nature véhicule — Véhicule de fonction",
  metaDescription: "Calculez l'avantage en nature d'un véhicule de société : forfait ou réel selon cartes carburant.",
  keywords: ["avantage nature véhicule", "véhicule de fonction", "AEN voiture entreprise"],
  category: "impots",
  icon: "calculator",
  regulationIds: ["fiscalite", "urssaf"],
  relatedSlugs: ["simulateur-tvs-vehicule", "frais-kilometriques"],
  formFields: [
    { key: "coutAnnuel", label: "Coût annuel total véhicule", type: "number", min: 0, step: 500, suffix: "€", hint: "Amortissement + carburant + entretien + assurance" },
    { key: "usagePro", label: "Usage professionnel", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
    { key: "carteCarburant", label: "Carte carburant entreprise", type: "select", options: [{ value: "oui", label: "Oui (forfait)" }, { value: "non", label: "Non (méthode réelle)" }] },
  ],
  defaultValues: { coutAnnuel: 12000, usagePro: 60, carteCarburant: "oui" },
  intro: "Le véhicule de fonction constitue un avantage en nature imposable et soumis aux cotisations sociales.",
  howTitle: "Forfait ou réel",
  howDetail: "Avec carte carburant : forfait 9 ou 12 % du coût d'achat + carburant personnel. Sans : quote-part usage privé du coût total.",
  faqItems: [
    { question: "Véhicule électrique ?", answer: "Abattement de 50 % sur l'AEN pour les véhicules électriques (2025)." },
    { question: "Impact sur le bulletin ?", answer: "L'AEN augmente le brut imposable sans verser de salaire supplémentaire." },
    { question: "Véhicule personnel et remboursement km ?", answer: "Alternative à l'AEN : indemnités kilométriques sur justificatifs de déplacements pro." },
  ],
  calculate(input) {
    const cout = num(input.coutAnnuel);
    const usagePro = num(input.usagePro) / 100;
    const carte = String(input.carteCarburant) === "oui";
    const aen = carte ? cout * 0.12 : cout * (1 - usagePro);
    const aenMensuel = aen / 12;
    return {
      summary: `Avantage en nature : ${formatCurrency(aen)}/an (${formatCurrency(aenMensuel)}/mois).`,
      lines: [
        { label: "AEN annuel", value: formatCurrency(aen), highlight: true },
        { label: "AEN mensuel", value: formatCurrency(aenMensuel), highlight: true },
        { label: "Méthode", value: carte ? "Forfait 12 %" : "Quote-part privée" },
        { label: "Coût annuel véhicule", value: formatCurrency(cout) },
      ],
    };
  },
});

const fraisReelsVsDeductible = createDraft({
  slug: "simulateur-frais-reels-vs-deductible",
  title: "Frais réels vs déduction 10 %",
  shortDescription: "Comparez frais professionnels réels et abattement forfaitaire de 10 % sur salaires.",
  metaTitle: "Simulateur frais réels vs 10 % — Déduction salaires",
  metaDescription: "Comparez l'abattement forfaitaire 10 % et les frais professionnels réels pour optimiser votre déclaration.",
  keywords: ["frais réels", "déduction 10 %", "frais professionnels salarié"],
  category: "impots",
  icon: "scale",
  regulationIds: ["fiscalite", "impot"],
  relatedSlugs: ["frais-kilometriques", "impot-sur-le-revenu"],
  formFields: [
    { key: "salaireBrut", label: "Salaires bruts annuels", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "fraisReels", label: "Frais professionnels réels", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { salaireBrut: 45000, fraisReels: 6000 },
  intro: "Les salariés peuvent opter pour les frais réels au lieu de l'abattement forfaitaire de 10 %.",
  howTitle: "Comparaison",
  howDetail: "Abattement 10 % plafonné à 14 426 €. Frais réels : transport, repas, téléphone, matériel… justifiés.",
  faqItems: [
    { question: "Comment opter pour les frais réels ?", answer: "Cocher la case 7GA ou 7GB sur la déclaration 2042, formulaire 2042-PRO obligatoire." },
    { question: "Peut-on revenir au 10 % ?", answer: "Oui, chaque année — choisissez l'option la plus avantageuse." },
    { question: "Frais de télétravail déductibles ?", answer: "Oui, quote-part loyer, électricité, internet — au prorata de l'usage professionnel." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const reels = num(input.fraisReels);
    const forfait = Math.min(14426, Math.max(504, brut * 0.1));
    const optimal = reels > forfait ? "Frais réels" : "Abattement 10 %";
    const economie = Math.abs(reels - forfait) * 0.3;
    return {
      summary: `${optimal} plus avantageux — économie d'impôt estimée : ${formatCurrency(economie)} (TMI 30 %).`,
      lines: [
        { label: "Option recommandée", value: optimal, highlight: true },
        { label: "Abattement 10 %", value: formatCurrency(forfait) },
        { label: "Frais réels déclarés", value: formatCurrency(reels) },
        { label: "Économie d'impôt (TMI 30 %)", value: formatCurrency(economie) },
      ],
    };
  },
});

const impotExpatriation = createDraft({
  slug: "simulateur-impot-expatriation",
  title: "Impôt expatriation (impatriés)",
  shortDescription: "Estimez l'exonération de 50 % des revenus d'activité pour salariés impatriés.",
  metaTitle: "Simulateur impôt expatriation — Régime impatriés",
  metaDescription: "Calculez l'exonération fiscale pour salariés impatriés : 50 % des revenus d'activité exonérés pendant 8 ans.",
  keywords: ["impatriés", "exonération impatriés", "expatriation fiscalité France"],
  category: "impots",
  icon: "briefcase",
  regulationIds: ["impot", "fiscalite"],
  relatedSlugs: ["impot-sur-le-revenu", "salaire-brut-net"],
  formFields: [
    { key: "revenuActivite", label: "Revenus d'activité annuels", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "anneeImpatriation", label: "Année depuis impatriation", type: "number", min: 1, max: 10, step: 1, suffix: "e année" },
  ],
  defaultValues: { revenuActivite: 120000, anneeImpatriation: 2 },
  intro: "Le régime des impatriés exonère partiellement les revenus d'activité et les plus-values mobilières.",
  howTitle: "Exonération 50 %",
  howDetail: "50 % des revenus d'activité exonérés pendant 8 ans si résidence fiscale étrangère les 5 années précédentes.",
  faqItems: [
    { question: "Qui peut en bénéficier ?", answer: "Salariés ou dirigeants n'ayant pas été résidents fiscaux français les 5 ans précédents." },
    { question: "Plafond d'exonération ?", answer: "Exonération plafonnée à 50 % des revenus, sans plafond en montant absolu pour l'activité." },
    { question: "Exonération plus-values mobilières ?", answer: "Oui, exonération totale des PV sur titres et droits sociaux pendant 8 ans (sous conditions)." },
  ],
  calculate(input) {
    const rev = num(input.revenuActivite);
    const annee = num(input.anneeImpatriation);
    const eligible = annee <= 8;
    const exoneration = eligible ? rev * EXPATRIATION_EXONERATION : 0;
    const imposable = rev - exoneration;
    const impot = calculerImpotBareme(imposable);
    return {
      summary: eligible
        ? `Exonération : ${formatCurrency(exoneration)} — IR estimé : ${formatCurrency(impot)}.`
        : "Régime impatriés expiré (8 ans écoulés).",
      lines: [
        { label: "Revenu exonéré", value: formatCurrency(exoneration), highlight: true },
        { label: "Revenu imposable", value: formatCurrency(imposable) },
        { label: "Impôt estimé", value: formatCurrency(impot) },
        { label: "Année impatriation", value: `${annee}e` },
      ],
    };
  },
});

const taxationCryptoFrance = createDraft({
  slug: "simulateur-taxation-crypto-france",
  title: "Taxation crypto France",
  shortDescription: "Estimez l'impôt sur une plus-value de cession de crypto-actifs (PFU 30 %).",
  metaTitle: "Simulateur taxation crypto France — Flat tax 30 %",
  metaDescription: "Calculez l'impôt sur une plus-value crypto en France : prélèvement forfaitaire unique 30 % depuis 2023.",
  keywords: ["taxation crypto France", "impôt bitcoin", "plus-value crypto PFU"],
  category: "impots",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-impot-plus-value-mobilier", "flat-tax-30-pourcent"],
  formFields: [
    { key: "montantCession", label: "Montant total cessions annuelles", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "prixRevient", label: "Prix de revient global", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { montantCession: 20000, prixRevient: 8000 },
  intro: "Les plus-values de cession de crypto-actifs sont soumises au PFU de 30 % (depuis la loi de finances 2023).",
  howTitle: "PFU crypto",
  howDetail: "Plus-value = cessions − prix de revient (comptabilité globale annuelle). Impôt = PV × 30 %.",
  faqItems: [
    { question: "Comptabilité par cession ou globale ?", answer: "Depuis 2023, comptabilité globale des portefeuilles de crypto-actifs." },
    { question: "Conversion crypto-crypto imposable ?", answer: "Oui, chaque échange crypto contre crypto ou fiat est une cession imposable." },
    { question: "Déclaration annuelle obligatoire ?", answer: "Oui, case 3AN du formulaire 2086 pour les comptes ouverts à l'étranger." },
  ],
  calculate(input) {
    const cession = num(input.montantCession);
    const revient = num(input.prixRevient);
    const pv = Math.max(0, cession - revient);
    const impot = pv * PFU_TAUX_GLOBAL;
    const net = pv - impot;
    return {
      summary: `Plus-value crypto : ${formatCurrency(pv)} — impôt PFU : ${formatCurrency(impot)}.`,
      lines: [
        { label: "Plus-value imposable", value: formatCurrency(pv), highlight: true },
        { label: "Impôt PFU (30 %)", value: formatCurrency(impot) },
        { label: "Gain net après impôt", value: formatCurrency(net), highlight: true },
        { label: "Cessions annuelles", value: formatCurrency(cession) },
      ],
    };
  },
});

export const fiscaliteDrafts: SimulatorDefinition[] = [
  impotSocietes,
  tvaDeductible,
  tvsVehicule,
  ifiAbattementDuree,
  donationPartage,
  nueProprieteUsufruit,
  impotRevenuFonctionnaire,
  reductionImpotDons,
  impotLocauxProfessionnels,
  microBicPlafond,
  microBncPlafond,
  defiscalisationPinel,
  impotPlusValueMobilier,
  prelevementsSociauxRevenus,
  impotMinimum,
  avantageNatureVehicule,
  fraisReelsVsDeductible,
  impotExpatriation,
  taxationCryptoFrance,
];
