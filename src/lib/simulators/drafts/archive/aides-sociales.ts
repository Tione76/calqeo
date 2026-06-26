import { draftSimulator, num } from "../_shared/helpers";
import { buildContent, buildFaq, p } from "../../_shared/content-builder";
import { formatCurrency } from "@/lib/utils/format";
import {
  estimerRsaMensuel,
  estimerPrimeActivite,
  RSA_MONTANT_FORFAITAIRE_ISOLE,
  RSA_MAJORATION_COUPLE,
  RSA_MAJORATION_PERSONNE_CHARGE,
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
  estimerPaje,
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

function estimerAspa(revenusMensuels: number, enCouple: boolean): number {
  const forfait = enCouple ? ASPA_MONTANT_PLEIN_COUPLE : ASPA_MONTANT_PLEIN_ISOLE;
  const droit = forfait - ASPA_TAUX_RESSOURCES * revenusMensuels;
  return Math.max(0, Math.round(droit * 100) / 100);
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
    howItWorks: [{ title: "Méthode de calcul", blocks: [p(calcul)] }],
    example: exemple ? { title: exemple.titre, blocks: [p(exemple.texte)] } : undefined,
    conseils,
    limites,
  });
}

const LIMITES_COMMUNES = [
  "Estimation pédagogique — le montant définitif relève de la CAF, MSA ou France Travail.",
  "Les barèmes sont ceux de 2025 ; une révision annuelle peut modifier les montants.",
  "Ne remplace pas une demande officielle ni un conseil social personnalisé.",
];

const simulateurMinimumVieillesse = draftSimulator({
  slug: "simulateur-minimum-vieillesse",
  title: "Simulateur minimum vieillesse",
  shortDescription: "Estimez le minimum vieillesse (ASPA) pour compléter vos revenus après 65 ans.",
  metaTitle: "Simulateur minimum vieillesse 2025 — ASPA",
  metaDescription: "Calculez le minimum vieillesse (ASPA) selon vos revenus. Garantit un revenu minimum aux personnes âgées modestes.",
  keywords: ["minimum vieillesse", "simulateur minimum vieillesse", "aspa montant", "aide personnes âgées"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["retraite"],
  relatedSlugs: ["simulateur-aspa", "simulateur-reversion-retraite", "simulateur-retraite"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels (pensions, rentes)", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "enCouple", label: "Situation", type: "select", options: [
      { value: 0, label: "Personne seule" }, { value: 1, label: "En couple" },
    ]},
  ],
  defaultValues: { revenus: 700, enCouple: 0 },
  content: contentAides(
    "Le minimum vieillesse correspond à l'ASPA, allocation de solidarité pour les personnes âgées.",
    "Complément = max(0, montant plein ASPA − 50 % des revenus du foyer).",
    ["Accessible à partir de 65 ans.", "Complète pensions et rentes.", "Demande auprès de la CAF ou MSA."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Minimum vieillesse = ASPA ?", answer: "Oui, le minimum vieillesse désigne l'ASPA versée par la CAF ou la MSA." },
    { question: "Montant pour une personne seule ?", answer: `Environ ${formatCurrency(ASPA_MONTANT_PLEIN_ISOLE)}/mois en 2025 avant prise en compte des revenus.` },
    { question: "Peut-on cumuler avec une retraite ?", answer: "Oui, l'ASPA complète vos pensions pour atteindre le minimum." },
    { question: "Conditions de résidence ?", answer: "Résider en France de manière stable et régulière." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const enCouple = num(input.enCouple) === 1;
    const montant = estimerAspa(revenus, enCouple);
    return {
      summary: `Minimum vieillesse estimé : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Complément ASPA mensuel", value: formatCurrency(montant), highlight: true },
        { label: "Revenus actuels", value: formatCurrency(revenus) },
        { label: "Situation", value: enCouple ? "Couple" : "Personne seule" },
      ],
    };
  },
});

const simulateurAlf = draftSimulator({
  slug: "simulateur-alf",
  title: "Simulateur ALF",
  shortDescription: "Estimez l'Allocation de logement familiale (ALF) pour les foyers sans personne à charge.",
  metaTitle: "Simulateur ALF 2025 — Allocation logement familiale",
  metaDescription: "Calculez l'ALF pour les ménages sans enfant à charge : loyer, revenus et zone géographique.",
  keywords: ["simulateur alf", "allocation logement familiale", "alf caf", "aide logement sans enfant"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["apl", "caf"],
  relatedSlugs: ["simulateur-apl", "simulateur-als", "simulateur-apl-colocation"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "revenus", label: "Revenus mensuels du couple", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "zone", label: "Zone", type: "select", options: [
      { value: "1", label: "Zone 1" }, { value: "2", label: "Zone 2" },
      { value: "3", label: "Zone 3" }, { value: "4", label: "Zone 4" }, { value: "5", label: "Zone 5" },
    ]},
  ],
  defaultValues: { loyer: 800, revenus: 2_200, zone: "2" },
  content: contentAides(
    "L'ALF aide les ménages sans personne à charge (couples sans enfant, par exemple).",
    "Calcul dérivé de l'APL sans majoration pour personnes à charge, avec participation minimale.",
    ["Réservée aux foyers sans enfant à charge.", "Logement en location principale.", "Non cumulable avec APL pour le même logement."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qui peut toucher l'ALF ?", answer: "Locataires sans personne à charge ne remplissant pas les conditions de l'APL ou de l'ALS." },
    { question: "Couple sans enfant éligible ?", answer: "Oui, c'est le public principal de l'ALF." },
    { question: "ALF vs APL ?", answer: "L'APL est prioritaire si le logement est conventionné ; l'ALF intervient pour les foyers sans charge." },
    { question: "Montant comparable à l'APL ?", answer: "Le calcul est proche mais sans coefficient familial lié aux enfants." },
  ]),
  calculate(input: Record<string, number | string>) {
    const loyer = num(input.loyer);
    const revenus = num(input.revenus);
    const zone = String(input.zone);
    const montant = Math.round(estimerAplMensuelle({ loyer, revenusMensuels: revenus, zone, personnesCharge: 0 }) * 0.85 * 100) / 100;
    return {
      summary: `ALF estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "ALF mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Loyer", value: formatCurrency(loyer) },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
      ],
    };
  },
});

const simulateurAideMobilite = draftSimulator({
  slug: "simulateur-aide-mobilite",
  title: "Simulateur aide à la mobilité",
  shortDescription: "Estimez l'aide à la mobilité professionnelle pour vos frais de transport ou de déménagement.",
  metaTitle: "Simulateur aide mobilité 2025 — Transport et déménagement",
  metaDescription: "Calculez une estimation d'aide à la mobilité : frais de transport, permis ou déménagement pour reprendre un emploi.",
  keywords: ["aide mobilité", "aide transport emploi", "mobili pass", "aide déménagement emploi"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["caf", "urssaf"],
  relatedSlugs: ["simulateur-rsa", "simulateur-prime-activite", "frais-kilometriques"],
  formFields: [
    { key: "fraisTransport", label: "Frais de transport mensuels", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "revenus", label: "Revenus mensuels", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { fraisTransport: 150, revenus: 1_100 },
  content: contentAides(
    "Les aides à la mobilité (Mobili-Pass, aides locales) financent transport et déménagement pour l'emploi.",
    "Estimation : 50 % des frais de transport, plafonnée à 200 €/mois si revenus modestes.",
    ["Contactez France Travail ou le CCAS.", "Justifier la reprise d'emploi ou la formation.", "Dispositifs variables selon les régions."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Qu'est-ce que Mobili-Pass ?", answer: "Aide de Action Logement pour financer déménagement et transport liés à une reprise d'emploi." },
    { question: "Qui peut en bénéficier ?", answer: "Salariés ou demandeurs d'emploi reprenant une activité éloignée de leur domicile." },
    { question: "Montant maximum ?", answer: "Variable selon le dispositif ; ce simulateur estime une aide transport mensuelle." },
    { question: "Cumulable avec APL ?", answer: "Oui, ce sont des aides à des fins différentes." },
  ]),
  calculate(input: Record<string, number | string>) {
    const frais = num(input.fraisTransport);
    const revenus = num(input.revenus);
    const plafond = revenus < 1_500 ? 200 : 100;
    const montant = Math.min(plafond, Math.round(frais * 0.5 * 100) / 100);
    return {
      summary: `Aide mobilité estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Aide mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Frais de transport", value: formatCurrency(frais) },
        { label: "Plafond applicable", value: formatCurrency(plafond) },
      ],
    };
  },
});

const simulateurRsaCouple = draftSimulator({
  slug: "simulateur-revenu-solidarite-active-couple",
  title: "Simulateur RSA couple",
  shortDescription: "Estimez le RSA pour un couple avec ou sans personnes à charge.",
  metaTitle: "Simulateur RSA couple 2025 — Montant pour deux personnes",
  metaDescription: "Calculez le RSA mensuel pour un couple : majoration couple, personnes à charge et déduction des revenus.",
  keywords: ["rsa couple", "simulateur rsa couple", "montant rsa deux personnes", "rsa conjoint"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["rsa"],
  relatedSlugs: ["simulateur-rsa", "simulateur-prime-activite-couple", "budget-reste-a-vivre"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels du couple", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "personnesCharge", label: "Personnes à charge", type: "number", min: 0, max: 8, step: 1 },
  ],
  defaultValues: { revenus: 800, personnesCharge: 1 },
  content: contentAides(
    "Le RSA couple inclut une majoration par rapport au montant isolé.",
    "Forfait couple = base isolée + majoration couple + majorations par personne à charge − 62 % × revenus.",
    ["Les deux membres du couple doivent être déclarés.", "Revenus du conjoint pris en compte intégralement.", "Demande sur caf.fr."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Majoration couple ?", answer: `Environ ${formatCurrency(RSA_MAJORATION_COUPLE)}/mois s'ajoutent au forfait isolé.` },
    { question: "Un seul conjoint sans emploi ?", answer: "Les revenus du conjoint actif réduisent le RSA du foyer." },
    { question: "Enfants à charge ?", answer: `Chaque personne à charge ajoute environ ${formatCurrency(RSA_MAJORATION_PERSONNE_CHARGE)}/mois.` },
    { question: "RSA couple et prime d'activité ?", answer: "Un conjoint en emploi peut ouvrir droit à la prime d'activité en parallèle." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const personnesCharge = num(input.personnesCharge);
    const montant = estimerRsaMensuel(revenus, personnesCharge, true);
    return {
      summary: `RSA couple estimé : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "RSA mensuel estimé", value: formatCurrency(montant), highlight: true },
        { label: "Revenus du couple", value: formatCurrency(revenus) },
        { label: "Personnes à charge", value: String(personnesCharge) },
      ],
    };
  },
});

const simulateurPrimeActiviteCouple = draftSimulator({
  slug: "simulateur-prime-activite-couple",
  title: "Simulateur prime d'activité couple",
  shortDescription: "Estimez la prime d'activité pour un couple avec revenus d'activité modestes.",
  metaTitle: "Simulateur prime d'activité couple 2025",
  metaDescription: "Calculez la prime d'activité pour un couple selon les revenus d'activité et le plafond couple.",
  keywords: ["prime activité couple", "simulateur prime activité couple", "prime activité conjoint"],
  domain: "aides-sociales",
  category: "social",
  icon: "wallet",
  regulationIds: ["rsa"],
  relatedSlugs: ["simulateur-prime-activite", "simulateur-revenu-solidarite-active-couple", "salaire-brut-net"],
  formFields: [
    { key: "revenus", label: "Revenus d'activité mensuels du couple", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { revenus: 2_400 },
  content: contentAides(
    "La prime d'activité couple utilise un plafond de ressources plus élevé qu'une personne seule.",
    "Calcul identique à la prime d'activité isolée avec le plafond couple appliqué.",
    ["Au moins un membre du couple doit avoir des revenus d'activité.", "Plafond couple plus élevé.", "Simulation sur caf.fr recommandée."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Plafond couple ?", answer: "Le plafond de ressources est plus élevé qu'en personne seule (environ 3 500 €/mois)." },
    { question: "Un seul conjoint travaille ?", answer: "Oui, les revenus d'activité du couple ouvrent droit à la prime." },
    { question: "Cumul avec RSA ?", answer: "Non, on ne cumule pas RSA et prime d'activité au sens strict ; la prime remplace le RSA si vous travaillez." },
    { question: "Auto-entrepreneur éligible ?", answer: "Oui, les revenus BIC/BNC sont des revenus d'activité éligibles." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenus);
    const montant = estimerPrimeActivite(revenus, true);
    return {
      summary: `Prime d'activité couple estimée : ${formatCurrency(montant)}/mois.`,
      lines: [
        { label: "Prime mensuelle estimée", value: formatCurrency(montant), highlight: true },
        { label: "Revenus d'activité du couple", value: formatCurrency(revenus) },
      ],
    };
  },
});

const simulateurAideJeuneEnfant = draftSimulator({
  slug: "simulateur-aide-jeune-enfant",
  title: "Simulateur aide jeune enfant",
  shortDescription: "Estimez la PAJE (Prestation d'accueil du jeune enfant) avant les 3 ans de l'enfant.",
  metaTitle: "Simulateur PAJE 2025 — Aide jeune enfant",
  metaDescription: "Calculez la PAJE : allocation de base, prime de naissance et compléments selon vos revenus.",
  keywords: ["paje", "aide jeune enfant", "prestation accueil jeune enfant", "simulateur paje 2025"],
  domain: "aides-sociales",
  category: "social",
  icon: "users",
  regulationIds: ["caf"],
  relatedSlugs: ["simulateur-aide-garde-enfant", "simulateur-prime-naissance", "simulateur-allocation-familiale"],
  formFields: [
    { key: "nbEnfants", label: "Enfants de moins de 3 ans", type: "number", min: 1, max: 4, step: 1 },
    { key: "revenus", label: "Revenus mensuels du foyer", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { nbEnfants: 1, revenus: 2_000 },
  content: contentAides(
    "La PAJE regroupe la prime à la naissance, l'allocation de base et les compléments de garde.",
    "Estimation mensuelle de l'allocation de base selon revenus et nombre d'enfants de moins de 3 ans.",
    ["Prime à la naissance versée à la naissance.", "Allocation de base jusqu'aux 3 ans.", "Complément libre choix selon mode de garde."],
    LIMITES_COMMUNES
  ),
  faq: buildFaq([
    { question: "Que comprend la PAJE ?", answer: "Prime à la naissance, allocation de base mensuelle et compléments de garde." },
    { question: "Jusqu'à quel âge ?", answer: "Jusqu'au 3e anniversaire de l'enfant (inclus)." },
    { question: "Premier enfant ?", answer: "Oui, la PAJE est versée dès le premier enfant." },
    { question: "Adoption ?", answer: "Oui, les adoptants bénéficient des mêmes prestations." },
  ]),
  calculate(input: Record<string, number | string>) {
    const nbEnfants = num(input.nbEnfants);
    const revenus = num(input.revenus);
    const paje = estimerPaje(nbEnfants, revenus);
    return {
      summary: `PAJE estimée : ${formatCurrency(paje)}/mois (+ prime naissance ${formatCurrency(PRIME_NAISSANCE)}).`,
      lines: [
        { label: "Allocation de base mensuelle", value: formatCurrency(paje), highlight: true },
        { label: "Prime naissance (one-shot)", value: formatCurrency(PRIME_NAISSANCE) },
        { label: "Enfants de moins de 3 ans", value: String(nbEnfants) },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
      ],
    };
  },
});

import type { SimulatorDefinition } from "../../types";

export const archivedAidesSocialesDrafts: SimulatorDefinition[] = [
  simulateurMinimumVieillesse,
  simulateurAlf,
  simulateurAideMobilite,
  simulateurRsaCouple,
  simulateurPrimeActiviteCouple,
  simulateurAideJeuneEnfant,
];
