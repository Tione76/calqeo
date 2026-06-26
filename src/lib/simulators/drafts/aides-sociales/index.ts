import { draftSimulator, num } from "../_shared/helpers";
import type { SimulatorDefinition } from "../../types";
import { buildContent, buildFaq, p } from "../../_shared/content-builder";
import { formatCurrency } from "@/lib/utils/format";
import {
  estimerRsaMensuel,
  estimerPrimeActivite,
  RSA_MONTANT_FORFAITAIRE_ISOLE,
} from "@/data/regulations/rsa";
import {
  estimerAplMensuelle,
  APL_PARTICIPATION_MIN,
  APL_TAUX_MAX,
} from "@/data/regulations/apl";
import {
  AAH_MONTANT_PLEIN,
  AAH_PLAFOND_RESSOURCES_ISOLE,
  ALLOCATIONS_FAMILIALES,
  COMPLEMENT_FAMILIAL_MAX,
  ARS_MONTANTS,
  PRIME_NAISSANCE,
  CHEQUE_ENERGIE_MONTANTS,
  CHEQUE_ENERGIE_PLAFOND_ISOLE,
  estimerAah,
  estimerChequeEnergie,
  estimerPaje,
  estimerBourseCrous,
} from "@/data/regulations/caf";
import {
  ASPA_MONTANT_PLEIN_ISOLE,
  ASPA_MONTANT_PLEIN_COUPLE,
  ASPA_TAUX_RESSOURCES,
} from "@/data/regulations/retraite";
import {
  ARE_TAUX_JOURNALIER,
  ARE_PLAFOND_SMIC_MULTIPLE,
  SMIC_JOURNALIER,
} from "@/data/regulations/urssaf";
import {
  ALS_COEFFICIENT_APL,
  ARE_COEFF_DUREE,
  ARE_DUREE_MIN_JOURS,
  ARE_DUREE_MAX_JOURS,
  ARE_DUREE_PLANCHER_53_55,
  ARE_DUREE_PLANCHER_55_PLUS,
} from "@/data/regulations/emploi";

/* ── Helpers internes ─────────────────────────────────────────────── */

function estimerAspa(revenusMensuels: number, enCouple: boolean): number {
  const forfait = enCouple ? ASPA_MONTANT_PLEIN_COUPLE : ASPA_MONTANT_PLEIN_ISOLE;
  const droit = forfait - ASPA_TAUX_RESSOURCES * revenusMensuels;
  return Math.max(0, Math.round(droit * 100) / 100);
}

function estimerAllocFamiliales(nbEnfants: number): number {
  if (nbEnfants < 2) return 0;
  let m = ALLOCATIONS_FAMILIALES.montant2Enfants;
  for (let i = 3; i <= nbEnfants; i++) {
    m += ALLOCATIONS_FAMILIALES.montantParEnfantSupplementaire;
  }
  return Math.round(m * 100) / 100;
}

function estimerAls(params: Parameters<typeof estimerAplMensuelle>[0]): number {
  return Math.round(estimerAplMensuelle(params) * ALS_COEFFICIENT_APL * 100) / 100;
}

function estimerAreDureeJours(age: number, moisTravail: number): number {
  const joursTravail = moisTravail * 30;
  let duree = Math.round(joursTravail * ARE_COEFF_DUREE);
  if (age >= 55) duree = Math.max(duree, ARE_DUREE_PLANCHER_55_PLUS);
  if (age >= 53 && age < 55) duree = Math.max(duree, ARE_DUREE_PLANCHER_53_55);
  return Math.min(Math.max(duree, ARE_DUREE_MIN_JOURS), ARE_DUREE_MAX_JOURS);
}

function contentAides(
  intro: string,
  calcul: string,
  conseils: string[],
  limites: string[],
  exemple?: { titre: string; texte: string }
) {
  return buildContent({
    intro,
    howItWorks: [
      {
        title: "Méthode de calcul",
        blocks: [p(calcul)],
      },
    ],
    example: exemple
      ? { title: exemple.titre, blocks: [p(exemple.texte)] }
      : undefined,
    conseils,
    limites,
  });
}

const LIMITES_COMMUNES = [
  "Estimation pédagogique — le montant définitif relève de la CAF, MSA ou France Travail.",
  "Les barèmes sont ceux de 2025 ; une révision annuelle peut modifier les montants.",
  "Ne remplace pas une demande officielle ni un conseil social personnalisé.",
];

const simulateurRsa = draftSimulator({
  slug: "simulateur-rsa",
  title: "Simulateur RSA",
  shortDescription:
    "Estimez le Revenu de solidarité active (RSA) mensuel selon vos revenus et votre composition familiale.",
  metaTitle: "Simulateur RSA 2025 — Estimer le Revenu de solidarité active",
  metaDescription:
    "Calculez une estimation de votre RSA mensuel : montant forfaitaire, majorations et déduction des revenus. Outil gratuit et indicatif.",
  keywords: ["simulateur rsa", "calcul rsa", "revenu solidarité active", "montant rsa 2025"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["rsa"],
  relatedSlugs: ["simulateur-prime-activite", "simulateur-aspa", "budget-reste-a-vivre"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "personnesCharge", label: "Personnes à charge", type: "number", min: 0, max: 8, step: 1 },
    { key: "enCouple", label: "Situation", type: "select", options: [
      { value: 0, label: "Personne seule" },
      { value: 1, label: "En couple" },
    ]},
  ],
  defaultValues: { revenus: 400, personnesCharge: 1, enCouple: 0 },
  content: contentAides(
    "Le RSA complète les ressources d'un foyer sans activité ou à faibles revenus jusqu'à un montant forfaitaire.",
    "Formule simplifiée : RSA = max(0, forfait familial − 62 % × revenus). Le forfait inclut la majoration couple et les personnes à charge.",
    [
      "Déclarez l'ensemble des ressources du foyer (salaires, pensions, allocations).",
      "Le RSA peut se cumuler partiellement avec la prime d'activité si vous travaillez.",
      "Faites votre demande sur caf.fr ou auprès de votre MSA.",
    ],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qui peut toucher le RSA ?", answer: "Personnes majeures sans activité ou avec de faibles revenus, résidant en France de manière stable. Des conditions de recherche d'emploi s'appliquent aux actifs." },
    { question: "Le RSA est-il cumulable avec un salaire ?", answer: "Oui partiellement : vos revenus d'activité réduisent le RSA à hauteur de 62 % de leur montant, ce qui laisse une bonification au retour à l'emploi." },
    { question: "Quel est le montant du RSA pour une personne seule ?", answer: `Le forfait de base est d'environ ${formatCurrency(RSA_MONTANT_FORFAITAIRE_ISOLE)}/mois en 2025, avant prise en compte des revenus.` },
    { question: "Faut-il renouveler sa demande ?", answer: "Oui, vous devez déclarer vos revenus trimestriellement et signaler tout changement de situation à la CAF." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const personnesCharge = num(input.personnesCharge);
    const enCouple = num(input.enCouple) === 1;
    const montant = estimerRsaMensuel(revenus, personnesCharge, enCouple);
    return {
      summary: `RSA estimé : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "RSA mensuel estimé", value: formatCurrency(montant), highlight: true },
        { label: "Revenus déclarés", value: formatCurrency(revenus) },
        { label: "Personnes à charge", value: String(personnesCharge) },
        { label: "Situation", value: enCouple ? "Couple" : "Personne seule" },
      ],
    };
  },
});

const simulateurPrimeActivite = draftSimulator({
  slug: "simulateur-prime-activite",
  title: "Simulateur prime d'activité",
  shortDescription:
    "Estimez la prime d'activité versée par la CAF ou la MSA pour récompenser la reprise ou le maintien d'un emploi.",
  metaTitle: "Simulateur prime d'activité 2025 — Calcul du montant",
  metaDescription:
    "Estimez votre prime d'activité selon vos revenus mensuels. Comprendre le montant minimum garanti et les plafonds de ressources.",
  keywords: ["prime d'activité", "simulateur prime activité", "calcul prime activité caf", "montant prime activité"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["rsa"],
  relatedSlugs: ["simulateur-rsa", "simulateur-prime-activite-salarie", "salaire-brut-net"],
  formFields: [
    { key: "revenus", label: "Revenus d'activité mensuels", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "enCouple", label: "Situation", type: "select", options: [
      { value: 0, label: "Personne seule" },
      { value: 1, label: "En couple" },
    ]},
  ],
  defaultValues: { revenus: 1_200, enCouple: 0 },
  content: contentAides(
    "La prime d'activité complète les revenus des travailleurs modestes et peut se cumuler avec d'autres prestations.",
    "Estimation : prime = max(minimum garanti, forfait − 62 % × revenus d'activité), dans la limite des plafonds de ressources.",
    [
      "Seuls les revenus d'activité (salaire, BIC/BNC) entrent dans le calcul.",
      "Vérifiez votre éligibilité sur le simulateur officiel caf.fr.",
      "La prime est versée mensuellement avec un minimum garanti.",
    ],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Quelle différence entre RSA et prime d'activité ?", answer: "La prime d'activité s'adresse aux personnes en emploi ou indépendantes avec des revenus modestes, tandis que le RSA vise les foyers sans activité ou très faiblement rémunérés." },
    { question: "Quel revenu minimum pour la prime d'activité ?", answer: "Il faut percevoir des revenus d'activité strictement positifs et rester sous le plafond de ressources du foyer." },
    { question: "La prime d'activité est-elle imposable ?", answer: "Non, la prime d'activité n'est pas imposable et n'entre pas dans le revenu fiscal de référence." },
    { question: "Quand est versée la prime d'activité ?", answer: "Elle est versée mensuellement, généralement entre le 5 et le 15 du mois, par la CAF ou la MSA." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const enCouple = num(input.enCouple) === 1;
    const montant = estimerPrimeActivite(revenus, enCouple);
    return {
      summary: `Prime d'activité estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Prime d'activité mensuelle", value: formatCurrency(montant), highlight: true },
        { label: "Revenus d'activité", value: formatCurrency(revenus) },
        { label: "Situation", value: enCouple ? "Couple" : "Personne seule" },
      ],
    };
  },
});

/* ── 3. APL ───────────────────────────────────────────────────────── */

const simulateurApl = draftSimulator({
  slug: "simulateur-apl",
  title: "Simulateur APL",
  shortDescription:
    "Estimez votre Aide personnalisée au logement (APL) selon votre loyer, vos revenus et votre zone géographique.",
  metaTitle: "Simulateur APL 2025 — Aide personnalisée au logement",
  metaDescription:
    "Calculez une estimation de votre APL mensuelle : loyer retenu, participation minimale et taux de prise en charge. Résultat indicatif.",
  keywords: ["simulateur apl", "calcul apl", "aide logement caf", "montant apl 2025"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["apl"],
  relatedSlugs: ["simulateur-als", "simulateur-apl-colocation", "loyer-charges-comprises"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel charges comprises", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "zone", label: "Zone géographique", type: "select", options: [
      { value: "1", label: "Zone 1 (Paris)" },
      { value: "2", label: "Zone 2 (agglomérations)" },
      { value: "3", label: "Zone 3" },
      { value: "4", label: "Zone 4" },
      { value: "5", label: "Zone 5 (rural)" },
    ]},
    { key: "personnesCharge", label: "Personnes à charge", type: "number", min: 0, max: 6, step: 1 },
  ],
  defaultValues: { loyer: 650, revenus: 1_400, zone: "3", personnesCharge: 0 },
  content: contentAides(
    "L'APL réduit votre reste à charge locatif si vous êtes locataire d'un logement conventionné ou non meublé éligible.",
    "L'APL retenue correspond au loyer plafonné par zone, diminué d'une participation personnelle calculée à partir de vos revenus et du coefficient familial.",
    [
      "Le logement doit être votre résidence principale.",
      "Le bail et l'état des lieux influencent l'éligibilité réelle.",
      "Comparez APL, ALS et ALF selon votre statut (locataire, non conventionné, sans enfant).",
    ],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "APL ou ALS : quelle différence ?", answer: "L'APL concerne les logements conventionnés ou certains meublés ; l'ALS s'applique aux logements non conventionnés. Le calcul est proche mais les démarches diffèrent." },
    { question: "Quelle participation minimale reste à ma charge ?", answer: `La participation minimale du locataire est d'environ ${formatCurrency(APL_PARTICIPATION_MIN)}/mois en 2025.` },
    { question: "L'APL dépend-elle du nombre d'enfants ?", answer: "Oui, le coefficient familial augmente avec les personnes à charge, ce qui peut relever le montant de l'aide." },
    { question: "Peut-on toucher l'APL en colocation ?", answer: "Oui, sous conditions : chaque colocataire peut prétendre à une quote-part selon sa situation et la répartition du loyer." },
  ]),
  calculate(input: Record<string, number | string>) {
    const loyer = num(input.loyer);
    const revenus = num(input.revenus);
    const zone = String(input.zone);
    const personnesCharge = num(input.personnesCharge);
    const montant = estimerAplMensuelle({ loyer, revenusMensuels: revenus, zone, personnesCharge });
    return {
      summary: `APL estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "APL mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Loyer déclaré", value: formatCurrency(loyer) },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
        { label: "Taux max de prise en charge", value: `${APL_TAUX_MAX * 100} %` },
      ],
    };
  },
});

/* ── 4. AAH ───────────────────────────────────────────────────────── */

const simulateurAah = draftSimulator({
  slug: "simulateur-aah",
  title: "Simulateur AAH",
  shortDescription: "Estimez l'Allocation aux adultes handicapés (AAH) selon vos revenus mensuels.",
  metaTitle: "Simulateur AAH 2025 — Allocation adulte handicapé",
  metaDescription: "Calculez une estimation de l'AAH mensuelle : montant plein, plafond de ressources et réduction forfaitaire.",
  keywords: ["simulateur aah", "allocation adulte handicapé", "montant aah 2025", "calcul aah"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aah-complement", "simulateur-rsa", "simulateur-aspa"],
  formFields: [{ key: "revenus", label: "Revenus mensuels", type: "number", min: 0, step: 50, suffix: "€" }],
  defaultValues: { revenus: 600 },
  content: contentAides(
    "L'AAH garantit un revenu minimum aux adultes reconnus handicapés avec des ressources modestes.",
    "Montant plein si revenus ≤ plafond ; au-delà, réduction de 50 % de l'excédent.",
    ["La reconnaissance de handicap (CDAPH) est une condition préalable.", "L'AAH peut se cumuler partiellement avec un salaire.", "Le complément de ressources peut s'ajouter si besoin."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Quel est le montant plein de l'AAH en 2025 ?", answer: `Environ ${formatCurrency(AAH_MONTANT_PLEIN)}/mois.` },
    { question: "L'AAH est-elle soumise à condition de ressources ?", answer: "Oui, vos revenus réduisent le montant au-delà d'un plafond." },
    { question: "Peut-on travailler tout en percevant l'AAH ?", answer: "Oui, avec une réduction partielle selon les revenus d'activité." },
    { question: "AAH ou ASPA ?", answer: "L'AAH concerne les adultes handicapés ; l'ASPA les personnes âgées. Elles ne se cumulent pas." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const montant = estimerAah(revenus);
    return {
      summary: `AAH estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "AAH mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
        { label: "Montant plein", value: formatCurrency(AAH_MONTANT_PLEIN) },
      ],
    };
  },
});

const simulateurAspa = draftSimulator({
  slug: "simulateur-aspa",
  title: "Simulateur ASPA",
  shortDescription: "Estimez l'Allocation de solidarité aux personnes âgées (ASPA) selon vos revenus.",
  metaTitle: "Simulateur ASPA 2025 — Allocation solidarité personnes âgées",
  metaDescription: "Calculez une estimation de l'ASPA mensuelle selon vos revenus et votre situation familiale.",
  keywords: ["simulateur aspa", "aspa 2025", "minimum vieillesse", "allocation personnes âgées"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["retraite", "caf"],
  relatedSlugs: ["simulateur-aspa", "simulateur-reversion-retraite", "simulateur-retraite"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "enCouple", label: "Situation", type: "select", options: [
      { value: 0, label: "Personne seule" }, { value: 1, label: "En couple" },
    ]},
  ],
  defaultValues: { revenus: 800, enCouple: 0 },
  content: contentAides(
    "L'ASPA porte le revenu des personnes âgées modestes à un minimum garanti.",
    "ASPA = max(0, montant plein − 50 % × revenus du foyer).",
    ["Condition d'âge : 65 ans ou incapacité reconnue.", "Résidence stable en France requise.", "Récupération sur succession possible."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "À partir de quel âge ?", answer: "À 65 ans, ou avant en cas d'inaptitude au travail reconnue." },
    { question: "Cumul avec une retraite ?", answer: "Oui, l'ASPA complète vos pensions sous condition de ressources." },
    { question: "Récupération sur succession ?", answer: "Oui, dans certaines limites sur la succession du bénéficiaire." },
    { question: "Où faire la demande ?", answer: "Auprès de votre CAF ou MSA, ou via l'espace en ligne caf.fr." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const enCouple = num(input.enCouple) === 1;
    const montant = estimerAspa(revenus, enCouple);
    const plein = enCouple ? ASPA_MONTANT_PLEIN_COUPLE : ASPA_MONTANT_PLEIN_ISOLE;
    return {
      summary: `ASPA estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "ASPA mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
        { label: "Montant plein", value: formatCurrency(plein) },
      ],
    };
  },
});

const simulateurAllocationFamiliale = draftSimulator({
  slug: "simulateur-allocation-familiale",
  title: "Simulateur allocations familiales",
  shortDescription: "Estimez le montant mensuel des allocations familiales selon le nombre d'enfants à charge.",
  metaTitle: "Simulateur allocations familiales 2025 — Montant CAF",
  metaDescription: "Calculez les allocations familiales pour 2 enfants et plus. Estimation gratuite du montant mensuel.",
  keywords: ["allocations familiales", "simulateur allocations familiales", "montant allocation enfant", "caf"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-complement-familial", "simulateur-allocation-rentree-scolaire", "simulateur-prime-naissance"],
  formFields: [{ key: "nbEnfants", label: "Nombre d'enfants à charge", type: "number", min: 0, max: 10, step: 1 }],
  defaultValues: { nbEnfants: 2 },
  content: contentAides(
    "Les allocations familiales sont versées dès le 2e enfant à charge.",
    "Montant = barème 2 enfants + majoration par enfant supplémentaire.",
    ["Enfants à charge : moins de 20 ans (21 ans si étudiant).", "Versées par la CAF ou la MSA.", "Complément familial possible pour les foyers modestes."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "À partir de combien d'enfants ?", answer: "Dès le deuxième enfant à charge." },
    { question: "Plafond de ressources ?", answer: "Le montant de base est universel ; seul le complément familial dépend des revenus." },
    { question: "Jusqu'à quel âge ?", answer: "Généralement 20 ans, ou 21 ans pour un étudiant." },
    { question: "Comment demander ?", answer: "Sur caf.fr avec les justificatifs d'état civil." },
  ]),
  calculate(input: Record<string, number | string>) {
    const nbEnfants = num(input.nbEnfants);
    const montant = estimerAllocFamiliales(nbEnfants);
    return {
      summary: nbEnfants < 2 ? "Pas d'allocations avant le 2e enfant." : `Allocations familiales : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Montant mensuel estimé", value: formatCurrency(montant), highlight: true },
        { label: "Nombre d'enfants", value: String(nbEnfants) },
        { label: "Base 2 enfants", value: formatCurrency(ALLOCATIONS_FAMILIALES.montant2Enfants) },
      ],
    };
  },
});

const simulateurComplementFamilial = draftSimulator({
  slug: "simulateur-complement-familial",
  title: "Simulateur complément familial",
  shortDescription: "Estimez le complément familial pour les familles modestes avec au moins 3 enfants.",
  metaTitle: "Simulateur complément familial 2025 — Montant CAF",
  metaDescription: "Calculez le complément familial selon vos revenus et le nombre d'enfants à charge.",
  keywords: ["complément familial", "simulateur complément familial", "aide famille modeste", "caf"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-allocation-familiale", "simulateur-aide-garde-enfant", "simulateur-aide-garde-enfant"],
  formFields: [
    { key: "nbEnfants", label: "Nombre d'enfants à charge", type: "number", min: 0, max: 10, step: 1 },
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { nbEnfants: 3, revenus: 1_800 },
  content: contentAides(
    "Le complément familial soutient les familles nombreuses aux revenus modestes.",
    "Montant max si revenus faibles et ≥ 3 enfants ; réduction progressive au-delà du plafond.",
    ["3 enfants minimum requis.", "Cumulable avec les allocations familiales.", "Attribué automatiquement si éligible."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Combien d'enfants faut-il ?", answer: "Au minimum 3 enfants à charge." },
    { question: "Montant maximum ?", answer: `Environ ${formatCurrency(COMPLEMENT_FAMILIAL_MAX)}/mois en 2025.` },
    { question: "Dépend des revenus ?", answer: "Oui, le montant diminue avec les revenus du foyer." },
    { question: "Demande séparée ?", answer: "Non, généralement attribué automatiquement par la CAF." },
  ]),
  calculate(input: Record<string, number | string>) {
    const nbEnfants = num(input.nbEnfants);
    const revenus = num(input.revenus);
    if (nbEnfants < 3) return { summary: "3 enfants minimum requis.", lines: [{ label: "Montant estimé", value: formatCurrency(0), highlight: true }] };
    const taux = Math.max(0, 1 - revenus / 3_500);
    const montant = Math.round(COMPLEMENT_FAMILIAL_MAX * taux * 100) / 100;
    return {
      summary: `Complément familial estimé : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Complément mensuel", value: formatCurrency(montant), highlight: true },
        { label: "Enfants à charge", value: String(nbEnfants) },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
      ],
    };
  },
});

const simulateurArs = draftSimulator({
  slug: "simulateur-allocation-rentree-scolaire",
  title: "Simulateur allocation de rentrée scolaire",
  shortDescription: "Estimez le montant de l'allocation de rentrée scolaire (ARS) selon l'âge de l'enfant.",
  metaTitle: "Simulateur ARS 2025 — Allocation rentrée scolaire",
  metaDescription: "Calculez le montant de l'ARS pour la primaire, le collège ou le lycée. Aide versée par la CAF à la rentrée.",
  keywords: ["allocation rentrée scolaire", "ars 2025", "simulateur ars", "aide rentrée scolaire"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-allocation-familiale", "simulateur-bourse-crous", "simulateur-aide-logement-etudiant"],
  formFields: [{ key: "niveau", label: "Niveau scolaire", type: "select", options: [
    { value: "primaire", label: "Primaire (6-10 ans)" },
    { value: "college", label: "Collège (11-14 ans)" },
    { value: "lycee", label: "Lycée (15-18 ans)" },
  ]}],
  defaultValues: { niveau: "college" },
  content: contentAides(
    "L'ARS aide les familles à financer la rentrée scolaire des enfants de 6 à 18 ans.",
    "Montant forfaitaire selon le niveau scolaire (primaire, collège, lycée).",
    ["Versée automatiquement si vous touchez déjà des prestations CAF.", "Un enfant doit avoir entre 6 et 18 ans.", "Montant unique versé en août/septembre."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qui peut toucher l'ARS ?", answer: "Familles avec enfants scolarisés de 6 à 18 ans percevant des prestations CAF ou MSA." },
    { question: "Quand est-elle versée ?", answer: "Généralement fin août ou début septembre, avant la rentrée." },
    { question: "Montant lycée vs primaire ?", answer: `Primaire : ${formatCurrency(ARS_MONTANTS.primaire)}, collège : ${formatCurrency(ARS_MONTANTS.college)}, lycée : ${formatCurrency(ARS_MONTANTS.lycee)} en 2025.` },
    { question: "Faut-il faire une demande ?", answer: "Non si vous êtes déjà allocataire ; sinon, ouvrez un dossier CAF." },
  ]),
  calculate(input: Record<string, number | string>) {
    const niveau = String(input.niveau) as keyof typeof ARS_MONTANTS;
    const montant = ARS_MONTANTS[niveau] ?? ARS_MONTANTS.college;
    return {
      summary: `ARS estimée : ${formatCurrency(montant)} pour la rentrée.`,
      lines: [
        { label: "Montant ARS", value: formatCurrency(montant), highlight: true },
        { label: "Niveau", value: niveau === "primaire" ? "Primaire" : niveau === "lycee" ? "Lycée" : "Collège" },
      ],
    };
  },
});

const simulateurChequeEnergie = draftSimulator({
  slug: "simulateur-cheque-energie",
  title: "Simulateur chèque énergie",
  shortDescription: "Estimez le montant de votre chèque énergie selon votre revenu fiscal de référence.",
  metaTitle: "Simulateur chèque énergie 2025 — Montant et éligibilité",
  metaDescription: "Calculez le montant estimé de votre chèque énergie : 48 € à 277 € selon vos revenus. Aide pour payer les factures.",
  keywords: ["chèque énergie", "simulateur chèque énergie", "montant chèque énergie 2025", "aide facture énergie"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aide-exceptionnelle-energie", "estimation-consommation-energie", "budget-reste-a-vivre"],
  formFields: [{ key: "revenuFiscal", label: "Revenu fiscal de référence", type: "number", min: 0, step: 100, suffix: "€" }],
  defaultValues: { revenuFiscal: 8_000 },
  content: contentAides(
    "Le chèque énergie aide les ménages modestes à payer leurs factures d'énergie et de carburant.",
    "Montant dégressif selon le revenu fiscal : de 277 € (très modestes) à 48 € (modestes).",
    ["Attribué automatiquement sans démarche si éligible.", "Utilisable chez les fournisseurs d'énergie partenaires.", "Non cumulable avec certaines aides locales similaires."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Comment savoir si je suis éligible ?", answer: "L'éligibilité est calculée automatiquement à partir du revenu fiscal et de la composition du foyer." },
    { question: "Quels montants possibles ?", answer: `Fourchettes : ${CHEQUE_ENERGIE_MONTANTS.join(" €, ")} € selon les revenus.` },
    { question: "Faut-il faire une demande ?", answer: "Non, le chèque est envoyé automatiquement par courrier ou e-mail au printemps." },
    { question: "Peut-on l'utiliser pour le fioul ?", answer: "Oui, auprès des professionnels agréés partenaires du dispositif." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenuFiscal = num(input.revenuFiscal);
    const montant = estimerChequeEnergie(revenuFiscal);
    return {
      summary: montant === 0 ? "Revenus au-delà du plafond d'éligibilité." : `Chèque énergie estimé : ${formatCurrency(montant)}.`,
      lines: [
        { label: "Montant estimé", value: formatCurrency(montant), highlight: true },
        { label: "Revenu fiscal", value: formatCurrency(revenuFiscal) },
        { label: "Plafond personne seule", value: formatCurrency(CHEQUE_ENERGIE_PLAFOND_ISOLE) },
      ],
    };
  },
});

const simulateurAideLogementEtudiant = draftSimulator({
  slug: "simulateur-aide-logement-etudiant",
  title: "Simulateur aide logement étudiant",
  shortDescription: "Estimez l'aide au logement pour un étudiant (APL/ALS) selon le loyer et les ressources.",
  metaTitle: "Simulateur aide logement étudiant 2025 — APL étudiant",
  metaDescription: "Calculez l'aide au logement étudiant : APL ou ALS selon votre loyer, vos revenus et votre zone. Estimation gratuite.",
  keywords: ["aide logement étudiant", "apl étudiant", "aide caf étudiant", "simulateur logement étudiant"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["apl", "caf"],
  relatedSlugs: ["simulateur-apl", "simulateur-bourse-crous", "simulateur-als"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "revenus", label: "Ressources mensuelles", type: "number", min: 0, step: 50, suffix: "€", hint: "Bourse, job étudiant, aide familiale" },
    { key: "zone", label: "Zone", type: "select", options: [
      { value: "1", label: "Zone 1" }, { value: "2", label: "Zone 2" },
      { value: "3", label: "Zone 3" }, { value: "4", label: "Zone 4" }, { value: "5", label: "Zone 5" },
    ]},
  ],
  defaultValues: { loyer: 450, revenus: 300, zone: "2" },
  content: contentAides(
    "Les étudiants peuvent prétendre à l'APL ou l'ALS pour leur résidence principale.",
    "Calcul identique à l'APL standard avec ressources étudiantes (bourse non comptée selon conditions).",
    ["Ouvrez un dossier CAF dès l'installation.", "La bourse sur critères sociaux n'est pas toujours comptée.", "Comparez résidence CROUS et logement privé."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Étudiant sans revenus : combien ?", answer: "Avec des ressources faibles et un loyer modéré, l'aide peut couvrir une part significative du loyer." },
    { question: "Bourse CROUS comptée ?", answer: "La bourse sur critères sociaux n'est généralement pas prise en compte dans les ressources." },
    { question: "Colocation étudiante ?", answer: "Chaque colocataire peut ouvrir un dossier pour sa quote-part de loyer." },
    { question: "Logement en résidence CROUS ?", answer: "Les étudiants en résidence universitaire peuvent aussi bénéficier de l'APL." },
  ]),
  calculate(input: Record<string, number | string>) {
    const loyer = num(input.loyer);
    const revenus = num(input.revenus);
    const zone = String(input.zone);
    const montant = estimerAplMensuelle({ loyer, revenusMensuels: revenus, zone, personnesCharge: 0 });
    return {
      summary: `Aide logement étudiant estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Aide mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Loyer", value: formatCurrency(loyer) },
        { label: "Ressources mensuelles", value: formatCurrency(revenus) },
      ],
    };
  },
});

const simulateurBourseCrous = draftSimulator({
  slug: "simulateur-bourse-crous",
  title: "Simulateur bourse CROUS",
  shortDescription: "Estimez le montant annuel d'une bourse sur critères sociaux selon le revenu fiscal par part.",
  metaTitle: "Simulateur bourse CROUS 2025 — Bourse sur critères sociaux",
  metaDescription: "Calculez une estimation de bourse CROUS (échelons 0 bis à 7) selon le revenu fiscal par part du foyer.",
  keywords: ["bourse crous", "simulateur bourse", "bourse critères sociaux", "aide étudiant"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aide-logement-etudiant", "simulateur-allocation-rentree-scolaire", "simulateur-apl"],
  formFields: [{ key: "rfrParPart", label: "Revenu fiscal de référence par part", type: "number", min: 0, step: 500, suffix: "€" }],
  defaultValues: { rfrParPart: 4_000 },
  content: contentAides(
    "La bourse sur critères sociaux aide les étudiants des familles modestes.",
    "Estimation par tranches de RFR/parts : de 5 000 €/an (échelon 0 bis) à 0 € au-delà de 12 000 €/part.",
    ["Demande sur messervices.etudiant.gouv.fr.", "Dossier DSE à renouveler chaque année.", "Cumulable avec l'aide au logement."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Comment faire la demande ?", answer: "Via le DSE (Dossier Social Étudiant) sur messervices.etudiant.gouv.fr entre janvier et mai." },
    { question: "Bourse et logement CROUS ?", answer: "La bourse est indépendante ; vous pouvez cumuler avec APL et logement étudiant." },
    { question: "Quels justificatifs ?", answer: "Avis d'imposition, pièce d'identité, certificat de scolarité." },
    { question: "Échelons de bourse ?", answer: "8 échelons (0 bis à 7) selon le RFR par part ; ce simulateur en donne une approximation." },
  ]),
  calculate(input: Record<string, number | string>) {
    const rfrParPart = num(input.rfrParPart);
    const montantAnnuel = estimerBourseCrous(rfrParPart);
    return {
      summary: montantAnnuel === 0 ? "RFR trop élevé pour une bourse estimée." : `Bourse estimée : ${formatCurrency(montantAnnuel)}/an.`,
      lines: [
        { label: "Bourse annuelle estimée", value: formatCurrency(montantAnnuel), highlight: true },
        { label: "Bourse mensuelle (10 mois)", value: formatCurrency(montantAnnuel / 10) },
        { label: "RFR par part", value: formatCurrency(rfrParPart) },
      ],
    };
  },
});

const simulateurPrimeNaissance = draftSimulator({
  slug: "simulateur-prime-naissance",
  title: "Simulateur prime de naissance",
  shortDescription: "Estimez le montant de la prime à la naissance versée par la CAF pour chaque enfant.",
  metaTitle: "Simulateur prime de naissance 2025 — Montant CAF",
  metaDescription: "Calculez le montant de la prime à la naissance versée par la CAF. Aide forfaitaire à la naissance ou à l'adoption.",
  keywords: ["prime naissance", "prime à la naissance", "montant prime naissance 2025", "caf naissance"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aide-garde-enfant", "simulateur-allocation-familiale", "simulateur-aide-garde-enfant"],
  formFields: [{ key: "nbEnfants", label: "Nombre d'enfants nés/adoptés", type: "number", min: 1, max: 5, step: 1 }],
  defaultValues: { nbEnfants: 1 },
  content: contentAides(
    "La prime à la naissance (ou à l'adoption) aide à couvrir les frais liés à l'arrivée d'un enfant.",
    `Montant forfaitaire de ${formatCurrency(PRIME_NAISSANCE)} par enfant en 2025, versé en une ou deux fois.`,
    ["Demande dans les 12 mois suivant la naissance.", "Versée même pour le premier enfant.", "Cumulable avec la PAJE."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Quel montant en 2025 ?", answer: `${formatCurrency(PRIME_NAISSANCE)} par enfant né ou adopté.` },
    { question: "Premier enfant éligible ?", answer: "Oui, dès le premier enfant, contrairement aux allocations familiales." },
    { question: "Délai de demande ?", answer: "Dans les 12 mois suivant la naissance ou l'adoption." },
    { question: "Comment demander ?", answer: "Via caf.fr avec l'acte de naissance ou le jugement d'adoption." },
  ]),
  calculate(input: Record<string, number | string>) {
    const nbEnfants = num(input.nbEnfants);
    const montant = PRIME_NAISSANCE * nbEnfants;
    return {
      summary: `Prime de naissance estimée : ${formatCurrency(montant)}.`,
      lines: [
        { label: "Prime totale estimée", value: formatCurrency(montant), highlight: true },
        { label: "Montant par enfant", value: formatCurrency(PRIME_NAISSANCE) },
        { label: "Nombre d'enfants", value: String(nbEnfants) },
      ],
    };
  },
});

const simulateurAidePerisco = draftSimulator({
  slug: "simulateur-aide-perisco",
  title: "Simulateur aide périscolaire",
  shortDescription: "Estimez l'aide locale pour les activités périscolaires selon vos revenus.",
  metaTitle: "Simulateur aide périscolaire 2025 — Réduction tarif cantine et garderie",
  metaDescription: "Calculez une estimation de réduction pour la cantine, garderie ou centre de loisirs selon vos revenus.",
  keywords: ["aide périscolaire", "tarif cantine", "aide garderie", "quotient familial cantine"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-allocation-familiale", "simulateur-aide-garde-enfant", "simulateur-aide-garde-enfant"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tarifPlein", label: "Tarif plein mensuel", type: "number", min: 0, step: 5, suffix: "€", hint: "Cantine, garderie ou centre de loisirs" },
  ],
  defaultValues: { revenus: 2_000, tarifPlein: 120 },
  content: contentAides(
    "Les communes proposent des tarifs modulés selon le quotient familial pour la cantine et les activités périscolaires.",
    "Réduction estimée : tarif réduit = tarif plein × (revenus / plafond), avec plancher à 10 % du tarif plein.",
    ["Barèmes variables selon la commune.", "Demandez le formulaire au service scolaire.", "Justificatif de revenus requis."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qui gère les tarifs ?", answer: "La mairie ou l'établissement scolaire, selon des barèmes locaux." },
    { question: "Quels services concernés ?", answer: "Cantine, garderie périscolaire, centre de loisirs, parfois transport scolaire." },
    { question: "Comment obtenir la réduction ?", answer: "Remplissez le formulaire de quotient familial auprès de la mairie." },
    { question: "Cumul avec la PAJE ?", answer: "Oui, ce sont des dispositifs indépendants." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const tarifPlein = num(input.tarifPlein);
    const plafond = 3_500;
    const ratio = Math.min(1, revenus / plafond);
    const tarifReduit = Math.max(tarifPlein * 0.1, Math.round(tarifPlein * ratio * 100) / 100);
    const aide = tarifPlein - tarifReduit;
    return {
      summary: `Aide périscolaire estimée : ${formatCurrency(aide)}/mois de réduction.`,
      lines: [
        { label: "Réduction mensuelle", value: formatCurrency(aide), highlight: true },
        { label: "Tarif réduit estimé", value: formatCurrency(tarifReduit) },
        { label: "Tarif plein", value: formatCurrency(tarifPlein) },
      ],
    };
  },
});

const simulateurAideGardeEnfant = draftSimulator({
  slug: "simulateur-aide-garde-enfant",
  title: "Simulateur aide garde d'enfant",
  shortDescription: "Estimez la PAJE pour la garde d'enfant de moins de 3 ans (crèche, assistante maternelle).",
  metaTitle: "Simulateur aide garde enfant 2025 — PAJE",
  metaDescription: "Calculez une estimation de la PAJE pour la garde de votre enfant selon vos revenus et le nombre d'enfants.",
  keywords: ["aide garde enfant", "paje", "simulateur paje", "aide crèche caf"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aide-garde-enfant", "simulateur-prime-naissance", "simulateur-allocation-familiale"],
  formFields: [
    { key: "nbEnfants", label: "Enfants de moins de 3 ans", type: "number", min: 1, max: 4, step: 1 },
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { nbEnfants: 1, revenus: 2_500 },
  content: contentAides(
    "La PAJE (Prestation d'accueil du jeune enfant) aide à financer la garde des enfants de moins de 3 ans.",
    "Estimation simplifiée de l'allocation de base modulée selon les revenus et le nombre d'enfants.",
    ["Crèche, assistante maternelle ou garde à domicile éligibles.", "Complément de libre choix selon le mode de garde.", "Demande sur caf.fr avant la naissance si possible."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qu'est-ce que la PAJE ?", answer: "Prestation d'accueil du jeune enfant, versée jusqu'aux 3 ans de l'enfant." },
    { question: "Crèche ou assistante maternelle ?", answer: "Les deux modes de garde ouvrent droit à la PAJE avec des compléments différents." },
    { question: "Revenus élevés : aide possible ?", answer: "L'allocation de base diminue avec les revenus mais une partie peut subsister." },
    { question: "Quand faire la demande ?", answer: "Dès le 5e mois de grossesse ou à la naissance/adoption." },
  ]),
  calculate(input: Record<string, number | string>) {
    const nbEnfants = num(input.nbEnfants);
    const revenus = num(input.revenus);
    const montant = estimerPaje(nbEnfants, revenus);
    return {
      summary: `PAJE garde enfant estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "PAJE mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Enfants de moins de 3 ans", value: String(nbEnfants) },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
      ],
    };
  },
});

const simulateurAls = draftSimulator({
  slug: "simulateur-als",
  title: "Simulateur ALS",
  shortDescription: "Estimez l'Allocation de logement sociale (ALS) pour un logement non conventionné.",
  metaTitle: "Simulateur ALS 2025 — Allocation logement sociale",
  metaDescription: "Calculez l'ALS pour un logement non conventionné : loyer, revenus et zone. Alternative à l'APL.",
  keywords: ["simulateur als", "allocation logement sociale", "als caf", "aide logement non conventionné"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["apl"],
  relatedSlugs: ["simulateur-apl", "simulateur-als", "simulateur-apl-colocation"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "revenus", label: "Revenus mensuels", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "zone", label: "Zone", type: "select", options: [
      { value: "1", label: "Zone 1" }, { value: "2", label: "Zone 2" },
      { value: "3", label: "Zone 3" }, { value: "4", label: "Zone 4" }, { value: "5", label: "Zone 5" },
    ]},
    { key: "personnesCharge", label: "Personnes à charge", type: "number", min: 0, max: 6, step: 1 },
  ],
  defaultValues: { loyer: 700, revenus: 1_600, zone: "2", personnesCharge: 0 },
  content: contentAides(
    "L'ALS s'adresse aux locataires de logements non conventionnés ne pouvant pas toucher l'APL.",
    "Calcul proche de l'APL avec un coefficient légèrement inférieur (95 % de l'APL estimée).",
    ["Logement non conventionné requis.", "Résidence principale obligatoire.", "Demande sur caf.fr."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "ALS ou APL ?", answer: "L'APL concerne les logements conventionnés ; l'ALS les logements non conventionnés." },
    { question: "Propriétaire éligible ?", answer: "Non, l'ALS est réservée aux locataires (ou certains cas de colocation)." },
    { question: "Montant identique à l'APL ?", answer: "Le calcul est similaire mais peut différer légèrement selon le statut du logement." },
    { question: "Meublé éligible ?", answer: "Oui, l'ALS peut s'appliquer à certains logements meublés non éligibles à l'APL." },
  ]),
  calculate(input: Record<string, number | string>) {
    const params = {
      loyer: num(input.loyer),
      revenusMensuels: num(input.revenus),
      zone: String(input.zone),
      personnesCharge: num(input.personnesCharge),
    };
    const montant = estimerAls(params);
    return {
      summary: `ALS estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "ALS mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Loyer", value: formatCurrency(params.loyer) },
        { label: "Revenus mensuels", value: formatCurrency(params.revenusMensuels) },
      ],
    };
  },
});

const simulateurFsl = draftSimulator({
  slug: "simulateur-fsl",
  title: "Simulateur FSL",
  shortDescription: "Estimez une aide du Fonds de solidarité logement (FSL) pour impayés ou relogement.",
  metaTitle: "Simulateur FSL 2025 — Fonds solidarité logement",
  metaDescription: "Calculez une estimation d'aide FSL du département pour impayés de loyer, eau ou énergie.",
  keywords: ["fsl", "fonds solidarité logement", "aide impayé loyer", "simulateur fsl"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["apl", "caf"],
  relatedSlugs: ["simulateur-apl", "simulateur-als", "budget-reste-a-vivre"],
  formFields: [
    { key: "impayes", label: "Montant des impayés", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "revenus", label: "Revenus mensuels", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { impayes: 1_500, revenus: 900 },
  content: contentAides(
    "Le FSL aide les personnes en difficulté à payer leur loyer, leurs factures ou à se reloger.",
    "Estimation : prise en charge de 30 à 70 % des impayés selon les revenus, plafonnée au montant dû.",
    ["Demande auprès du département ou du CCAS.", "Justificatifs de difficulté requis.", "Non automatique — instruction au cas par cas."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qui gère le FSL ?", answer: "Chaque département gère son Fonds de solidarité pour le logement." },
    { question: "Quelles dépenses couvertes ?", answer: "Loyers impayés, factures d'eau/énergie, caution, parfois frais de relogement." },
    { question: "Cumulable avec APL ?", answer: "Oui, le FSL intervient en complément en cas de difficulté exceptionnelle." },
    { question: "Comment demander ?", answer: "Contactez le CCAS de votre commune ou la commission FSL du département." },
  ]),
  calculate(input: Record<string, number | string>) {
    const impayes = num(input.impayes);
    const revenus = num(input.revenus);
    const taux = Math.max(0.3, 0.7 - revenus / 3_000);
    const montant = Math.min(impayes, Math.round(impayes * taux * 100) / 100);
    return {
      summary: `Aide FSL estimée : ${formatCurrency(montant)}.`,
      lines: [
        { label: "Aide FSL estimée", value: formatCurrency(montant), highlight: true },
        { label: "Impayés déclarés", value: formatCurrency(impayes) },
        { label: "Taux de prise en charge", value: `${Math.round(taux * 100)} %` },
      ],
    };
  },
});

const simulateurAplColocation = draftSimulator({
  slug: "simulateur-apl-colocation",
  title: "Simulateur APL colocation",
  shortDescription: "Estimez l'APL en colocation selon votre quote-part de loyer et vos revenus personnels.",
  metaTitle: "Simulateur APL colocation 2025 — Quote-part de loyer",
  metaDescription: "Calculez l'APL en colocation : quote-part de loyer, revenus personnels et zone. Estimation par colocataire.",
  keywords: ["apl colocation", "simulateur apl colocation", "aide logement coloc", "caf colocation"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["apl"],
  relatedSlugs: ["simulateur-apl", "simulateur-als", "simulateur-aide-logement-etudiant"],
  formFields: [
    { key: "quotePartLoyer", label: "Votre quote-part de loyer", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "revenus", label: "Vos revenus mensuels", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "zone", label: "Zone", type: "select", options: [
      { value: "1", label: "Zone 1" }, { value: "2", label: "Zone 2" },
      { value: "3", label: "Zone 3" }, { value: "4", label: "Zone 4" }, { value: "5", label: "Zone 5" },
    ]},
    { key: "colocataires", label: "Nombre de colocataires", type: "number", min: 2, max: 6, step: 1 },
  ],
  defaultValues: { quotePartLoyer: 400, revenus: 1_100, zone: "2", colocataires: 3 },
  content: contentAides(
    "En colocation, chaque colocataire peut demander l'APL sur sa quote-part de loyer.",
    "Calcul APL standard appliqué à la quote-part déclarée et aux revenus personnels du colocataire.",
    ["Quote-part de loyer à justifier (bail ou attestation).", "Chaque colocataire ouvre son propre dossier CAF.", "Loyer total réparti entre colocataires."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Chaque colocataire peut-il toucher l'APL ?", answer: "Oui, sur sa quote-part de loyer avec ses propres revenus." },
    { question: "Comment prouver la quote-part ?", answer: "Attestation du bailleur ou répartition indiquée au bail/de colocation." },
    { question: "Étudiant en colocation ?", answer: "Oui, même principe avec ressources étudiantes." },
    { question: "APL ou ALS en colocation ?", answer: "Identique au statut du logement : APL si conventionné, ALS sinon." },
  ]),
  calculate(input: Record<string, number | string>) {
    const quotePartLoyer = num(input.quotePartLoyer);
    const revenus = num(input.revenus);
    const zone = String(input.zone);
    const montant = estimerAplMensuelle({ loyer: quotePartLoyer, revenusMensuels: revenus, zone, personnesCharge: 0 });
    return {
      summary: `APL colocation estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "APL mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Quote-part de loyer", value: formatCurrency(quotePartLoyer) },
        { label: "Vos revenus", value: formatCurrency(revenus) },
        { label: "Colocataires", value: String(num(input.colocataires)) },
      ],
    };
  },
});

const simulateurAahComplement = draftSimulator({
  slug: "simulateur-aah-complement",
  title: "Simulateur AAH complément",
  shortDescription: "Estimez l'AAH avec complément de ressources selon vos revenus mensuels.",
  metaTitle: "Simulateur AAH complément 2025 — Montant avec revenus",
  metaDescription: "Calculez l'AAH après réduction pour revenus : montant plein, plafond et complément de ressources estimé.",
  keywords: ["aah complément", "simulateur aah revenus", "aah montant avec salaire", "complément ressources aah"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aah", "simulateur-rsa", "salaire-brut-net"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels (salaire, pension)", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { revenus: 950 },
  content: contentAides(
    "L'AAH est réduite lorsque les revenus dépassent le plafond ; le complément de ressources peut compenser partiellement.",
    "AAH versée = max(0, montant plein − 50 % × (revenus − plafond)). Complément si revenus d'activité faibles.",
    ["Distinction revenus d'activité et revenus de remplacement.", "Abattements spécifiques non modélisés ici.", "Simulation CAF pour le détail."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qu'est-ce que le complément de ressources AAH ?", answer: "Aide additionnelle si le montant de base réduit ne suffit pas à vivre." },
    { question: "Réduction pour revenus ?", answer: "50 % de l'excédent au-delà du plafond de ressources est déduit du montant plein." },
    { question: "Travail à temps partiel ?", answer: "Des abattements sur les revenus d'activité peuvent s'appliquer (non simulés ici)." },
    { question: "AAH et prime d'activité ?", answer: "Possible sous conditions si revenus d'activité modestes." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const montant = estimerAah(revenus);
    const reduction = revenus > AAH_PLAFOND_RESSOURCES_ISOLE
      ? Math.round((revenus - AAH_PLAFOND_RESSOURCES_ISOLE) * 0.5 * 100) / 100
      : 0;
    return {
      summary: `AAH nette estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "AAH mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Montant plein", value: formatCurrency(AAH_MONTANT_PLEIN) },
        { label: "Réduction pour revenus", value: formatCurrency(reduction) },
        { label: "Revenus déclarés", value: formatCurrency(revenus) },
      ],
    };
  },
});

const simulateurChomagePartiel = draftSimulator({
  slug: "simulateur-chomage-partiel-indemnisation",
  title: "Simulateur chômage partiel",
  shortDescription: "Estimez l'indemnisation en cas d'activité partielle (chômage partiel) de votre employeur.",
  metaTitle: "Simulateur chômage partiel 2025 — Indemnisation activité partielle",
  metaDescription: "Calculez l'indemnité d'activité partielle : 60 % du net ou 70 % du brut plafonné, selon heures non travaillées.",
  keywords: ["chômage partiel", "activité partielle", "indemnisation chômage partiel", "simulateur activité partielle"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["allocation-chomage-are", "salaire-brut-net", "ijss-arret-maladie"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel habituel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "heuresChomees", label: "Heures non travaillées (chômées)", type: "number", min: 0, max: 151, step: 1, suffix: "h" },
    { key: "heuresTotales", label: "Heures mensuelles habituelles", type: "number", min: 1, max: 151, step: 1, suffix: "h" },
  ],
  defaultValues: { salaireBrut: 2_200, heuresChomees: 35, heuresTotales: 151 },
  content: contentAides(
    "L'activité partielle indemnise les heures non travaillées en cas de baisse d'activité.",
    "Indemnité estimée = 70 % du brut × (heures chômées / heures totales), plafonnée à 4,5 × SMIC horaire × heures chômées.",
    ["Demande par l'employeur auprès de l'administration.", "Complété par l'employeur pour atteindre environ 84 % du net.", "Régime distinct de l'ARE."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qui demande l'activité partielle ?", answer: "L'employeur dépose la demande ; le salarié perçoit l'indemnité via l'employeur." },
    { question: "Quel taux d'indemnisation ?", answer: "Environ 60 % du net (employeur complète) ou 70 % du brut dans la limite du plafond." },
    { question: "Différence avec l'ARE ?", answer: "L'activité partielle maintient le contrat ; l'ARE intervient en cas de perte d'emploi." },
    { question: "Plafond d'indemnisation ?", answer: "L'indemnité est plafonnée en fonction du SMIC horaire." },
  ]),
  calculate(input: Record<string, number | string>) {
    const salaireBrut = num(input.salaireBrut);
    const heuresChomees = num(input.heuresChomees);
    const heuresTotales = num(input.heuresTotales);
    const ratio = heuresChomees / heuresTotales;
    const brutIndemnise = salaireBrut * ratio * 0.7;
    const plafond = SMIC_JOURNALIER * 4.5 * (heuresChomees / 7);
    const montant = Math.min(brutIndemnise, plafond);
    return {
      summary: `Indemnité activité partielle estimée : ${formatCurrency(montant)}.`,
      lines: [
        { label: "Indemnité estimée", value: formatCurrency(montant), highlight: true },
        { label: "Heures chômées", value: `${heuresChomees} h` },
        { label: "Taux appliqué", value: "70 % du brut (simplifié)" },
        { label: "Plafond estimé", value: formatCurrency(plafond) },
      ],
    };
  },
});

const simulateurAideExceptionnelleEnergie = draftSimulator({
  slug: "simulateur-aide-exceptionnelle-energie",
  title: "Simulateur aide exceptionnelle énergie",
  shortDescription: "Estimez l'aide exceptionnelle énergie versée aux ménages modestes face à la hausse des prix.",
  metaTitle: "Simulateur aide exceptionnelle énergie 2025",
  metaDescription: "Calculez une estimation de l'aide exceptionnelle énergie selon vos revenus. Complément au chèque énergie.",
  keywords: ["aide exceptionnelle énergie", "aide facture électricité", "aide énergie gouvernement", "bonus énergie"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-cheque-energie", "estimation-consommation-energie", "budget-reste-a-vivre"],
  formFields: [
    { key: "revenuFiscal", label: "Revenu fiscal de référence", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { revenuFiscal: 9_500 },
  content: contentAides(
    "Les aides exceptionnelles énergie complètent le chèque énergie en période de hausse des prix.",
    "Montant estimé : 100 à 200 € selon le revenu fiscal, en plus du chèque énergie éventuel.",
    ["Versement ponctuel selon les dispositifs en vigueur.", "Attribué aux mêmes foyers modestes que le chèque énergie.", "Consultez service-public.fr pour les mesures actuelles."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Différence avec le chèque énergie ?", answer: "L'aide exceptionnelle est ponctuelle ; le chèque énergie est annuel." },
    { question: "Faut-il faire une demande ?", answer: "Souvent automatique pour les foyers déjà identifiés comme modestes." },
    { question: "Quels ménages concernés ?", answer: "Ménages aux revenus modestes et intermédiaires selon les seuils du dispositif." },
    { question: "Cumulable avec le chèque énergie ?", answer: "Oui, il s'agit de dispositifs complémentaires." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenuFiscal = num(input.revenuFiscal);
    let montant = 0;
    if (revenuFiscal <= 6_000) montant = 200;
    else if (revenuFiscal <= 9_000) montant = 150;
    else if (revenuFiscal <= CHEQUE_ENERGIE_PLAFOND_ISOLE) montant = 100;
    return {
      summary: montant === 0 ? "Revenus au-delà du plafond estimé." : `Aide exceptionnelle estimée : ${formatCurrency(montant)}.`,
      lines: [
        { label: "Aide exceptionnelle", value: formatCurrency(montant), highlight: true },
        { label: "Revenu fiscal", value: formatCurrency(revenuFiscal) },
        { label: "Chèque énergie associé", value: formatCurrency(estimerChequeEnergie(revenuFiscal)) },
      ],
    };
  },
});

const simulateurReversionRetraite = draftSimulator({
  slug: "simulateur-reversion-retraite",
  title: "Simulateur réversion retraite",
  shortDescription: "Estimez la pension de réversion après le décès du conjoint (54 % max simplifié).",
  metaTitle: "Simulateur réversion retraite 2025 — Pension de survie",
  metaDescription: "Calculez une estimation de pension de réversion : 54 % de la retraite du défunt, selon revenus et âge.",
  keywords: ["réversion retraite", "pension réversion", "pension survie conjoint", "simulateur réversion"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["retraite"],
  relatedSlugs: ["simulateur-retraite", "simulateur-aspa", "simulateur-reversion-retraite"],
  formFields: [
    { key: "pensionDefunt", label: "Retraite mensuelle du défunt", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "revenusSurvivant", label: "Vos revenus mensuels", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { pensionDefunt: 1_500, revenusSurvivant: 800 },
  content: contentAides(
    "La pension de réversion permet au conjoint survivant de percevoir une part de la retraite du défunt.",
    "Estimation : 54 % de la retraite du défunt, réduite si les revenus propres dépassent un plafond.",
    ["Mariage ou PACS requis (sauf exceptions).", "Condition d'âge ou d'enfants à charge selon les régimes.", "Demande auprès des caisses de retraite."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Quel taux de réversion ?", answer: "Jusqu'à 54 % de la retraite du défunt pour le conjoint survivant (simplifié)." },
    { question: "Cumul avec ma retraite ?", answer: "Oui, mais le montant peut être réduit si vos revenus dépassent un plafond." },
    { question: "Concubin éligible ?", answer: "Non en principe, sauf dispositions spécifiques de certains régimes." },
    { question: "Plusieurs pensions ?", answer: "Le total des réversions est plafonné." },
  ]),
  calculate(input: Record<string, number | string>) {
    const pensionDefunt = num(input.pensionDefunt);
    const revenusSurvivant = num(input.revenusSurvivant);
    const tauxReversion = 0.54;
    let montant = pensionDefunt * tauxReversion;
    if (revenusSurvivant > 1_800) {
      montant = Math.max(0, montant - (revenusSurvivant - 1_800) * 0.5);
    }
    montant = Math.round(montant * 100) / 100;
    return {
      summary: `Pension de réversion estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Réversion mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Retraite du défunt", value: formatCurrency(pensionDefunt) },
        { label: "Taux appliqué", value: "54 %" },
        { label: "Vos revenus", value: formatCurrency(revenusSurvivant) },
      ],
    };
  },
});

const simulateurDroitChomageDuree = draftSimulator({
  slug: "simulateur-droit-chomage-duree",
  title: "Simulateur durée droit chômage",
  shortDescription: "Estimez la durée d'indemnisation ARE selon votre âge et vos mois travaillés.",
  metaTitle: "Simulateur durée chômage 2025 — Droit ARE en mois",
  metaDescription: "Calculez la durée estimée de votre allocation chômage (ARE) selon l'âge et la durée d'activité salariée.",
  keywords: ["durée chômage", "droit are", "combien de mois chômage", "simulateur durée allocation chômage"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["allocation-chomage-are", "indemnites-licenciement", "simulateur-chomage-partiel-indemnisation"],
  formFields: [
    { key: "age", label: "Votre âge", type: "number", min: 18, max: 65, step: 1, suffix: "ans" },
    { key: "moisTravail", label: "Mois travaillés sur les 24 derniers mois", type: "number", min: 4, max: 24, step: 1, suffix: "mois" },
  ],
  defaultValues: { age: 45, moisTravail: 18 },
  content: contentAides(
    "La durée d'indemnisation ARE dépend de l'âge et de la durée d'affiliation à l'assurance chômage.",
    "Estimation : 0,75 jour indemnisé par jour travaillé (min. 122 j, max. 730 j), majorée après 53 ans.",
    [
      "4 mois minimum de travail sur 24 mois requis.",
      "Simulation précise sur francetravail.fr.",
      "Durée allongée pour les seniors selon conditions.",
    ],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Durée minimale d'indemnisation ?", answer: "Environ 122 jours (4 mois) si les conditions d'ouverture des droits sont remplies." },
    { question: "Durée maximale ?", answer: "Jusqu'à 730 jours (24 mois) pour les moins de 53 ans ; plus pour les seniors." },
    { question: "Impact de l'âge ?", answer: "Après 53 ans, la durée peut être allongée jusqu'à 36 mois selon conditions." },
    { question: "Comment calculer les mois travaillés ?", answer: "Périodes salariées des 24 à 36 derniers mois selon la nature du contrat." },
  ]),
  calculate(input: Record<string, number | string>) {
    const age = num(input.age);
    const moisTravail = num(input.moisTravail);
    const jours = estimerAreDureeJours(age, moisTravail);
    const mois = Math.round(jours / 30);
    const areJourPlafond = Math.round(SMIC_JOURNALIER * ARE_PLAFOND_SMIC_MULTIPLE * 100) / 100;
    return {
      summary: `Durée ARE estimée : ${mois} mois (${jours} jours).`,
      lines: [
        { label: "Durée en jours", value: `${jours} jours`, highlight: true },
        { label: "Durée en mois (approx.)", value: `${mois} mois`, highlight: true },
        { label: "Âge", value: `${age} ans` },
        { label: "Mois travaillés (24 mois)", value: `${moisTravail} mois` },
        { label: "ARE journalière max (ref.)", value: formatCurrency(areJourPlafond) },
        { label: "Taux journalier ARE", value: `${ARE_TAUX_JOURNALIER * 100} %` },
      ],
    };
  },
});

export const aidesSocialesDrafts: SimulatorDefinition[] = [
  simulateurRsa,
  simulateurPrimeActivite,
  simulateurApl,
  simulateurAah,
  simulateurAspa,
  simulateurAllocationFamiliale,
  simulateurComplementFamilial,
  simulateurArs,
  simulateurChequeEnergie,
  simulateurAideLogementEtudiant,
  simulateurBourseCrous,
  simulateurPrimeNaissance,
  simulateurAidePerisco,
  simulateurAideGardeEnfant,
  simulateurAls,
  simulateurFsl,
  simulateurAplColocation,
  simulateurAahComplement,
  simulateurChomagePartiel,
  simulateurAideExceptionnelleEnergie,
  simulateurReversionRetraite,
  simulateurDroitChomageDuree,
];
