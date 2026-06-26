import type {
  FormField,
  SimulatorCategory,
  SimulatorDefinition,
  SimulatorIcon,
  SimulatorResult,
} from "../../types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import { draftSimulator, num } from "../_shared/helpers";
import {
  brutToNetMensuel,
  coutEmployeurMensuel,
  indemniteLicenciementLegale,
} from "../../_shared/payroll";
import {
  COTISATIONS_SALARIALES_DEFAUT,
  COTISATIONS_PATRONALES_DEFAUT,
} from "@/data/regulations/urssaf";
import { estimerPrimeActivite } from "@/data/regulations/rsa";
import { SMIC_MENSUEL_BRUT_35H, HEURES_LEGALES_SEMAINE } from "@/data/regulations/smic";
import {
  PRIME_PRECARITE_CDD,
  TICKET_RESTAURANT_EXONERATION,
  TICKET_RESTAURANT_PART_EMPLOYEUR,
  CHEQUES_VACANCES_PART_EMPLOYEUR_MIN,
  MUTUELLE_PART_EMPLOYEUR_MIN,
  AGIRC_TAUX_TOTAL,
  FORFAIT_JOURS_ANNUEL,
  TEMPS_PARTIEL_MIN_HEURES,
} from "@/data/regulations/emploi";

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
    domain: "emploi",
    category: spec.category,
    icon: spec.icon,
    regulationIds: spec.regulationIds,
    relatedSlugs: spec.relatedSlugs,
    formFields: spec.formFields,
    defaultValues: spec.defaultValues,
    content: buildContent({
      intro: spec.intro,
      howItWorks: [{ title: spec.howTitle, blocks: [p(spec.howDetail), hl("Estimation", "Calcul simplifié à visée pédagogique — vérifiez votre convention collective.")] }],
      conseils: ["Consultez votre contrat de travail et la convention collective applicable.", "Demandez une simulation à votre service RH ou à l'URSSAF pour valider les montants."],
      limites: ["Estimation indicative — cas particuliers (inaptitude, faute grave, mandataires sociaux) non couverts.", "Barèmes 2025 — révisions annuelles possibles."],
    }),
    faq: buildFaq(spec.faqItems),
    calculate: spec.calculate,
  });
}

const preavisDemission = createDraft({
  slug: "simulateur-preavis-demission",
  title: "Préavis de démission",
  shortDescription: "Estimez la durée légale ou conventionnelle de préavis lors d'une démission.",
  metaTitle: "Simulateur préavis de démission — Durée et coût",
  metaDescription: "Calculez la durée de préavis de démission selon l'ancienneté et le statut cadre/non-cadre, et le salaire correspondant.",
  keywords: ["préavis démission", "durée préavis démission", "démission salarié"],
  category: "salaire",
  icon: "briefcase",
  regulationIds: ["urssaf"],
  relatedSlugs: ["simulateur-preavis-licenciement", "salaire-brut-net"],
  formFields: [
    { key: "ancienneteMois", label: "Ancienneté (mois)", type: "number", min: 0, max: 360, step: 1, suffix: "mois" },
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "cadre", label: "Statut cadre", type: "select", options: [{ value: "non", label: "Non-cadre" }, { value: "oui", label: "Cadre" }] },
  ],
  defaultValues: { ancienneteMois: 18, salaireBrut: 2800, cadre: "non" },
  intro: "La durée de préavis de démission dépend de l'ancienneté et du statut du salarié.",
  howTitle: "Durée légale simplifiée",
  howDetail: "Non-cadre : 1 mois si ancienneté ≥ 6 mois. Cadre : 2 mois si ancienneté ≥ 6 mois. Durée réduite possible en période d'essai.",
  faqItems: [
    { question: "Peut-on négocier un préavis plus court ?", answer: "Oui, par accord avec l'employeur (dispense ou raccourcissement)." },
    { question: "Le préavis est-il payé ?", answer: "Oui, le salarié perçoit son salaire pendant le préavis effectué." },
    { question: "Quelle durée en période d'essai ?", answer: "Le préavis est réduit ou supprimé selon la durée de la période d'essai et la convention collective." },
    { question: "La convention collective peut-elle modifier le préavis ?", answer: "Oui, elle peut prévoir des durées plus favorables que le minimum légal." },
  ],
  calculate(input) {
    const mois = num(input.ancienneteMois);
    const brut = num(input.salaireBrut);
    const cadre = String(input.cadre) === "oui";
    let preavisMois = 0;
    if (mois >= 6) preavisMois = cadre ? 2 : 1;
    else if (mois >= 3) preavisMois = cadre ? 1 : 0.5;
    const cout = brut * preavisMois;
    return {
      summary: `Préavis estimé : ${preavisMois} mois — salaire dû : ${formatCurrency(cout)}.`,
      lines: [
        { label: "Durée de préavis", value: `${preavisMois} mois`, highlight: true },
        { label: "Salaire brut total", value: formatCurrency(cout), highlight: true },
        { label: "Ancienneté", value: `${mois} mois` },
        { label: "Statut", value: cadre ? "Cadre" : "Non-cadre" },
      ],
    };
  },
});

const preavisLicenciement = createDraft({
  slug: "simulateur-preavis-licenciement",
  title: "Préavis de licenciement",
  shortDescription: "Estimez la durée et le coût du préavis en cas de licenciement.",
  metaTitle: "Simulateur préavis licenciement — Durée et indemnités",
  metaDescription: "Calculez la durée de préavis de licenciement selon l'ancienneté et le salaire brut correspondant.",
  keywords: ["préavis licenciement", "durée préavis licenciement", "indemnité licenciement"],
  category: "salaire",
  icon: "briefcase",
  regulationIds: ["urssaf"],
  relatedSlugs: ["indemnites-licenciement", "simulateur-preavis-demission"],
  formFields: [
    { key: "ancienneteAnnees", label: "Ancienneté (années)", type: "number", min: 0, max: 40, step: 0.5, suffix: "ans" },
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "cadre", label: "Statut cadre", type: "select", options: [{ value: "non", label: "Non-cadre" }, { value: "oui", label: "Cadre" }] },
  ],
  defaultValues: { ancienneteAnnees: 5, salaireBrut: 3000, cadre: "non" },
  intro: "Le préavis de licenciement varie selon l'ancienneté et le statut du salarié.",
  howTitle: "Barème légal simplifié",
  howDetail: "Non-cadre : 1 mois (6 mois à 2 ans), 2 mois (2 à 10 ans), 3 mois (10 ans+). Cadre : 2 ou 3 mois selon ancienneté.",
  faqItems: [
    { question: "Le préavis peut-il être dispensé ?", answer: "Oui, l'employeur peut dispenser le salarié tout en le payant." },
    { question: "Différence avec l'indemnité de licenciement ?", answer: "Le préavis est le salaire pendant la période de préavis ; l'indemnité légale est une somme distincte." },
    { question: "Licenciement pour faute grave : préavis dû ?", answer: "Non, la faute grave exclut le préavis et l'indemnité de licenciement." },
    { question: "Le salarié peut-il travailler ailleurs pendant le préavis ?", answer: "Oui, sauf clause de non-concurrence ou accord contraire avec l'employeur." },
  ],
  calculate(input) {
    const ans = num(input.ancienneteAnnees);
    const brut = num(input.salaireBrut);
    const cadre = String(input.cadre) === "oui";
    let preavisMois = 1;
    if (cadre) preavisMois = ans >= 2 ? 3 : 2;
    else if (ans >= 10) preavisMois = 3;
    else if (ans >= 2) preavisMois = 2;
    else if (ans >= 0.5) preavisMois = 1;
    else preavisMois = 0;
    const cout = brut * preavisMois;
    return {
      summary: `Préavis licenciement : ${preavisMois} mois — ${formatCurrency(cout)} brut.`,
      lines: [
        { label: "Durée de préavis", value: `${preavisMois} mois`, highlight: true },
        { label: "Salaire brut total", value: formatCurrency(cout), highlight: true },
        { label: "Ancienneté", value: `${ans} ans` },
        { label: "Statut", value: cadre ? "Cadre" : "Non-cadre" },
      ],
    };
  },
});

const primePrecariteCdd = createDraft({
  slug: "simulateur-prime-precarite-cdd",
  title: "Prime de précarité CDD",
  shortDescription: "Calculez la prime de précarité de 10 % due en fin de CDD (hors cas d'exonération).",
  metaTitle: "Simulateur prime précarité CDD — 10 % brut",
  metaDescription: "Estimez la prime de précarité à verser en fin de contrat CDD : 10 % de la rémunération brute totale perçue.",
  keywords: ["prime précarité CDD", "indemnité fin CDD", "10 % CDD"],
  category: "salaire",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["salaire-brut-net", "simulateur-preavis-licenciement"],
  formFields: [
    { key: "remunerationTotale", label: "Rémunération brute totale perçue", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { remunerationTotale: 15000 },
  intro: "La prime de précarité est égale à 10 % de la rémunération brute totale perçue pendant le CDD.",
  howTitle: "Calcul de la prime",
  howDetail: "Prime = rémunération brute totale × 10 %. Exonérée si embauche en CDI dans les 3 mois ou CDD spécifique (remplacement, saisonnier…).",
  faqItems: [
    { question: "Quand la prime n'est-elle pas due ?", answer: "Si le CDD est suivi d'un CDI sans interruption, ou pour certains CDD d'usage (saison, remplacement)." },
    { question: "La prime est-elle imposable ?", answer: "Oui, elle est soumise à cotisations sociales et à l'impôt sur le revenu." },
    { question: "Sur quelle rémunération calcule-t-on les 10 % ?", answer: "Sur l'ensemble de la rémunération brute perçue pendant le CDD, y compris heures supplémentaires et primes." },
    { question: "Quand l'employeur doit-il verser la prime ?", answer: "À la fin du contrat, en même temps que le solde de tout compte." },
  ],
  calculate(input) {
    const total = num(input.remunerationTotale);
    const prime = total * PRIME_PRECARITE_CDD;
    const net = brutToNetMensuel(prime);
    return {
      summary: `Prime de précarité : ${formatCurrency(prime)} brut (${formatCurrency(net)} net estimé).`,
      lines: [
        { label: "Prime de précarité", value: formatCurrency(prime), highlight: true },
        { label: "Net estimé", value: formatCurrency(net) },
        { label: "Rémunération totale", value: formatCurrency(total) },
        { label: "Taux appliqué", value: formatPercent(PRIME_PRECARITE_CDD * 100, 0) },
      ],
    };
  },
});

const primeActiviteSalarie = createDraft({
  slug: "simulateur-prime-activite-salarie",
  title: "Prime d'activité salarié",
  shortDescription: "Estimez la prime d'activité perçue par un salarié selon ses revenus mensuels.",
  metaTitle: "Simulateur prime d'activité salarié — Estimation CAF",
  metaDescription: "Calculez une estimation de la prime d'activité pour un salarié : revenus d'activité, situation familiale.",
  keywords: ["prime d'activité salarié", "complément revenus travail", "simulateur prime activité"],
  category: "social",
  icon: "users",
  regulationIds: ["rsa", "caf"],
  relatedSlugs: ["simulateur-prime-activite", "salaire-brut-net"],
  formFields: [
    { key: "revenusMensuels", label: "Revenus nets d'activité mensuels", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "enCouple", label: "Situation", type: "select", options: [{ value: "non", label: "Personne seule" }, { value: "oui", label: "En couple" }] },
  ],
  defaultValues: { revenusMensuels: 1200, enCouple: "non" },
  intro: "La prime d'activité complète les revenus modestes des travailleurs salariés ou indépendants.",
  howTitle: "Formule simplifiée CAF",
  howDetail: "Montant estimé selon le barème officiel : forfait − 62 % × revenus + minimum garanti.",
  faqItems: [
    { question: "Qui peut en bénéficier ?", answer: "Travailleurs de 18 ans ou plus avec des revenus d'activité modestes, résidant en France." },
    { question: "Comment faire la demande ?", answer: "Sur caf.fr ou auprès de votre CAF, avec vos revenus trimestriels." },
    { question: "Peut-on cumuler avec le RSA ?", answer: "Non, la prime d'activité se substitue au RSA pour les travailleurs éligibles." },
    { question: "Quels revenus sont pris en compte ?", answer: "Salaires, BIC/BNC, indemnités chômage partielles et certaines pensions d'invalidité." },
  ],
  calculate(input) {
    const revenus = num(input.revenusMensuels);
    const enCouple = String(input.enCouple) === "oui";
    const prime = estimerPrimeActivite(revenus, enCouple);
    return {
      summary: prime > 0 ? `Prime d'activité estimée : ${formatCurrency(prime)}/mois.` : "Revenus hors plafond ou insuffisants pour la prime d'activité.",
      lines: [
        { label: "Prime d'activité", value: formatCurrency(prime), highlight: true },
        { label: "Revenus mensuels", value: formatCurrency(revenus) },
        { label: "Situation", value: enCouple ? "Couple" : "Personne seule" },
      ],
    };
  },
});

const ticketsRestaurant = createDraft({
  slug: "simulateur-tickets-restaurant",
  title: "Tickets restaurant",
  shortDescription: "Estimez le coût employeur et l'économie salarié des tickets restaurant.",
  metaTitle: "Simulateur tickets restaurant — Part employeur et salarié",
  metaDescription: "Calculez le partage tickets restaurant entre employeur et salarié, exonération sociale et coût net.",
  keywords: ["tickets restaurant", "part employeur TR", "titres restaurant"],
  category: "salaire",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["salaire-brut-net", "simulateur-cheques-vacances"],
  formFields: [
    { key: "valeurTicket", label: "Valeur faciale du ticket", type: "number", min: 0, max: 15, step: 0.1, suffix: "€" },
    { key: "joursMois", label: "Jours travaillés par mois", type: "number", min: 1, max: 23, step: 1, suffix: "jours" },
    { key: "partEmployeur", label: "Part employeur", type: "number", min: 50, max: 60, step: 1, suffix: "%" },
  ],
  defaultValues: { valeurTicket: 9, joursMois: 20, partEmployeur: 50 },
  intro: "Les tickets restaurant sont cofinancés par l'employeur (50 à 60 % minimum) et exonérés dans certaines limites.",
  howTitle: "Répartition et exonération",
  howDetail: "Part employeur = valeur × taux × jours. Exonération sociale plafonnée par ticket (barème 2025).",
  faqItems: [
    { question: "Quelle part minimum pour l'employeur ?", answer: "50 % de la valeur faciale, sauf accord collectif plus favorable." },
    { question: "Sont-ils imposables ?", answer: "Exonérés de cotisations dans la limite du plafond légal par ticket." },
    { question: "Obligation pour l'employeur ?", answer: "Non obligatoire sauf accord d'entreprise, convention collective ou usage." },
    { question: "Peut-on les utiliser le week-end ?", answer: "Non, les titres-restaurant sont réservés aux jours travaillés, sauf dérogation spécifique." },
  ],
  calculate(input) {
    const valeur = num(input.valeurTicket);
    const jours = num(input.joursMois);
    const tauxEmp = num(input.partEmployeur) / 100;
    const partEmployeur = valeur * tauxEmp * jours;
    const partSalarie = valeur * (1 - tauxEmp) * jours;
    const exoneration = Math.min(valeur, TICKET_RESTAURANT_EXONERATION) * jours;
    return {
      summary: `Coût employeur : ${formatCurrency(partEmployeur)}/mois — part salarié : ${formatCurrency(partSalarie)}/mois.`,
      lines: [
        { label: "Coût employeur mensuel", value: formatCurrency(partEmployeur), highlight: true },
        { label: "Part salarié mensuelle", value: formatCurrency(partSalarie), highlight: true },
        { label: "Valeur totale tickets", value: formatCurrency(valeur * jours) },
        { label: "Base exonérée estimée", value: formatCurrency(exoneration) },
      ],
    };
  },
});

const chequesVacances = createDraft({
  slug: "simulateur-cheques-vacances",
  title: "Chèques vacances",
  shortDescription: "Estimez le cofinancement employeur-salarié des chèques vacances.",
  metaTitle: "Simulateur chèques vacances — Cofinancement entreprise",
  metaDescription: "Calculez la part employeur (minimum 50 %) et salarié des chèques vacances, avantages sociaux et fiscaux.",
  keywords: ["chèques vacances", "ANCV entreprise", "avantage chèques vacances"],
  category: "salaire",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["simulateur-tickets-restaurant", "salaire-brut-net"],
  formFields: [
    { key: "montantTotal", label: "Montant total chèques vacances", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "partEmployeur", label: "Part employeur", type: "number", min: 50, max: 100, step: 1, suffix: "%" },
  ],
  defaultValues: { montantTotal: 500, partEmployeur: 50 },
  intro: "Les chèques vacances sont cofinancés : l'employeur doit prendre en charge au minimum 50 %.",
  howTitle: "Répartition du montant",
  howDetail: "Part employeur = montant × taux (≥ 50 %). Exonération sociale et fiscale dans les limites ANCV.",
  faqItems: [
    { question: "Tous les salariés y ont-ils droit ?", answer: "Si le comité social l'a institué ou par accord d'entreprise, selon les conditions fixées." },
    { question: "Peut-on cumuler avec les congés payés ?", answer: "Oui, les chèques vacances financent les dépenses de vacances, pas le salaire de congés." },
    { question: "Quelle est la durée de validité ?", answer: "De mars de l'année N à la fin février N+2, selon les règles ANCV." },
    { question: "Exonération sociale et fiscale ?", answer: "Oui, dans la limite de 30 % du SMIC annuel par salarié et selon les plafonds ANCV." },
  ],
  calculate(input) {
    const total = num(input.montantTotal);
    const taux = Math.max(CHEQUES_VACANCES_PART_EMPLOYEUR_MIN, num(input.partEmployeur) / 100);
    const employeur = total * taux;
    const salarie = total - employeur;
    return {
      summary: `Employeur : ${formatCurrency(employeur)} — Salarié : ${formatCurrency(salarie)}.`,
      lines: [
        { label: "Part employeur", value: formatCurrency(employeur), highlight: true },
        { label: "Part salarié", value: formatCurrency(salarie), highlight: true },
        { label: "Montant total", value: formatCurrency(total) },
        { label: "Taux employeur", value: formatPercent(taux * 100, 0) },
      ],
    };
  },
});

const forfaitJours = createDraft({
  slug: "simulateur-forfait-jours",
  title: "Forfait jours",
  shortDescription: "Calculez le nombre de jours travaillés en forfait jours et les jours de repos.",
  metaTitle: "Simulateur forfait jours — 218 jours annuels",
  metaDescription: "Estimez le nombre de jours travaillés et de repos en convention forfait jours pour cadres autonomes.",
  keywords: ["forfait jours", "218 jours", "convention forfait jours", "cadres autonomes"],
  category: "salaire",
  icon: "calculator",
  regulationIds: ["urssaf", "smic"],
  relatedSlugs: ["salaire-brut-net", "simulateur-temps-partiel-droit"],
  formFields: [
    { key: "joursForfait", label: "Jours travaillés annuels (forfait)", type: "number", min: 200, max: 230, step: 1, suffix: "jours" },
    { key: "congesPayes", label: "Congés payés (jours ouvrés)", type: "number", min: 20, max: 30, step: 1, suffix: "jours" },
  ],
  defaultValues: { joursForfait: FORFAIT_JOURS_ANNUEL, congesPayes: 25 },
  intro: "Le forfait jours permet de comptabiliser le temps de travail en jours travaillés par an plutôt qu'en heures.",
  howTitle: "Répartition annuelle",
  howDetail: "Forfait standard : 218 jours travaillés + congés payés + repos hebdomadaires + jours fériés.",
  faqItems: [
    { question: "Qui peut être en forfait jours ?", answer: "Cadres autonomes ou salariés dont la durée du temps de travail ne peut être prédéterminée." },
    { question: "Comment sont comptés les jours fériés ?", answer: "Les jours fériés chômés ne sont pas des jours travaillés au sens du forfait." },
    { question: "Comment poser des jours de repos ?", answer: "Par accord avec l'employeur, en respectant le repos hebdomadaire et la durée maximale annuelle." },
    { question: "Heures supplémentaires en forfait jours ?", answer: "Pas d'heures sup au sens classique, mais contrôle du repos et de la charge de travail obligatoire." },
  ],
  calculate(input) {
    const jours = num(input.joursForfait);
    const cp = num(input.congesPayes);
    const joursRepos = 365 - jours - cp - 104;
    const heuresEquiv = jours * (HEURES_LEGALES_SEMAINE / 5);
    return {
      summary: `${jours} jours travaillés + ${cp} CP — environ ${formatNumber(joursRepos, 0)} jours de repos.`,
      lines: [
        { label: "Jours travaillés (forfait)", value: `${jours} jours`, highlight: true },
        { label: "Congés payés", value: `${cp} jours` },
        { label: "Jours de repos estimés", value: `${formatNumber(joursRepos, 0)} jours` },
        { label: "Heures équivalentes", value: `${formatNumber(heuresEquiv, 0)} h/an` },
      ],
    };
  },
});

const tempsPartielDroit = createDraft({
  slug: "simulateur-temps-partiel-droit",
  title: "Temps partiel — droits",
  shortDescription: "Vérifiez le respect du minimum légal de durée et estimez le salaire au prorata.",
  metaTitle: "Simulateur temps partiel — Durée minimum et salaire",
  metaDescription: "Calculez le salaire au prorata du temps partiel et vérifiez le minimum légal de 24 h/semaine.",
  keywords: ["temps partiel", "durée minimum temps partiel", "salaire temps partiel"],
  category: "salaire",
  icon: "scale",
  regulationIds: ["urssaf", "smic"],
  relatedSlugs: ["salaire-temps-partiel", "salaire-brut-net"],
  formFields: [
    { key: "heuresSemaine", label: "Heures travaillées par semaine", type: "number", min: 1, max: 35, step: 1, suffix: "h" },
    { key: "salairePleinTemps", label: "Salaire brut temps plein (35 h)", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { heuresSemaine: 28, salairePleinTemps: 2500 },
  intro: "Le temps partiel est encadré : durée minimale de 24 h/semaine sauf accord du salarié.",
  howTitle: "Prorata et minimum légal",
  howDetail: "Salaire = salaire temps plein × (heures travaillées / 35). Minimum 24 h/semaine ou 60 % sauf demande écrite.",
  faqItems: [
    { question: "Peut-on travailler moins de 24 h ?", answer: "Oui, uniquement à la demande écrite du salarié ou en CDD ≤ 7 jours." },
    { question: "Les congés payés sont-ils réduits ?", answer: "Non, les congés payés restent identiques au temps plein (2,5 jours/mois)." },
    { question: "Heures complémentaires en temps partiel ?", answer: "Oui, dans la limite du tiers de la durée contractuelle ou de 7 h/semaine selon le cas." },
    { question: "Passage au temps plein possible ?", answer: "Oui, le salarié peut demander un temps plein si un poste est disponible (priorité légale)." },
  ],
  calculate(input) {
    const heures = num(input.heuresSemaine);
    const plein = num(input.salairePleinTemps);
    const prorata = heures / HEURES_LEGALES_SEMAINE;
    const salaire = plein * prorata;
    const conforme = heures >= TEMPS_PARTIEL_MIN_HEURES;
    const smicProrata = SMIC_MENSUEL_BRUT_35H * prorata;
    return {
      summary: `Salaire brut temps partiel : ${formatCurrency(salaire)}/mois (${formatPercent(prorata * 100, 0)} du temps plein).`,
      lines: [
        { label: "Salaire brut mensuel", value: formatCurrency(salaire), highlight: true },
        { label: "Heures hebdomadaires", value: `${heures} h` },
        { label: "Minimum légal respecté", value: conforme ? "Oui (≥ 24 h)" : "Non — accord requis" },
        { label: "SMIC prorata", value: formatCurrency(smicProrata) },
      ],
    };
  },
});

const ruptureConventionnelle = createDraft({
  slug: "simulateur-rupture-conventionnelle",
  title: "Rupture conventionnelle",
  shortDescription: "Estimez l'indemnité minimale et le coût total d'une rupture conventionnelle.",
  metaTitle: "Simulateur rupture conventionnelle — Indemnité minimum",
  metaDescription: "Calculez l'indemnité légale minimum de rupture conventionnelle et le coût employeur total.",
  keywords: ["rupture conventionnelle", "indemnité RC", "simulation rupture conventionnelle"],
  category: "salaire",
  icon: "briefcase",
  regulationIds: ["urssaf"],
  relatedSlugs: ["indemnites-licenciement", "simulateur-preavis-licenciement"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "ancienneteAnnees", label: "Ancienneté (années)", type: "number", min: 0, max: 40, step: 0.5, suffix: "ans" },
    { key: "indemniteNegociee", label: "Indemnité négociée (optionnel)", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { salaireBrut: 3200, ancienneteAnnees: 7, indemniteNegociee: 0 },
  intro: "La rupture conventionnelle ouvre droit à une indemnité au moins égale à l'indemnité légale de licenciement.",
  howTitle: "Indemnité minimum",
  howDetail: "Minimum = indemnité légale de licenciement. Le montant négocié peut être supérieur.",
  faqItems: [
    { question: "La RC ouvre-t-elle droit au chômage ?", answer: "Oui, sous réserve de conditions d'ancienneté et de cotisation." },
    { question: "Quel délai de rétractation ?", answer: "15 jours calendaires pour chaque partie après signature." },
    { question: "Homologation obligatoire ?", answer: "Oui, la Direction régionale de l'économie, de l'emploi, du travail et des solidarités (DREETS) doit homologuer la convention." },
    { question: "Indemnité supérieure au minimum ?", answer: "Oui, les parties peuvent négocier un montant plus élevé que l'indemnité légale de licenciement." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const ans = num(input.ancienneteAnnees);
    const minimum = indemniteLicenciementLegale(brut, ans);
    const negociee = num(input.indemniteNegociee);
    const indemnite = negociee > 0 ? Math.max(negociee, minimum) : minimum;
    const net = brutToNetMensuel(indemnite);
    return {
      summary: `Indemnité RC minimum : ${formatCurrency(minimum)} — retenue : ${formatCurrency(indemnite)}.`,
      lines: [
        { label: "Indemnité retenue", value: formatCurrency(indemnite), highlight: true },
        { label: "Minimum légal", value: formatCurrency(minimum) },
        { label: "Net estimé", value: formatCurrency(net) },
        { label: "Ancienneté", value: `${ans} ans` },
      ],
    };
  },
});

const transportDomicileTravail = createDraft({
  slug: "simulateur-transport-domicile-travail",
  title: "Transport domicile-travail",
  shortDescription: "Estimez la prise en charge employeur des frais de transport domicile-travail.",
  metaTitle: "Simulateur transport domicile-travail — Prise en charge 50 %",
  metaDescription: "Calculez la prise en charge obligatoire de 50 % des abonnements transport public par l'employeur.",
  keywords: ["transport domicile travail", "abonnement Navigo employeur", "frais transport salarié"],
  category: "salaire",
  icon: "wallet",
  regulationIds: ["urssaf", "fiscalite"],
  relatedSlugs: ["frais-kilometriques", "salaire-brut-net"],
  formFields: [
    { key: "abonnementMensuel", label: "Coût abonnement mensuel", type: "number", min: 0, step: 5, suffix: "€" },
    { key: "partEmployeur", label: "Part employeur", type: "number", min: 50, max: 100, step: 1, suffix: "%" },
  ],
  defaultValues: { abonnementMensuel: 88.8, partEmployeur: 50 },
  intro: "L'employeur doit financer au minimum 50 % des abonnements de transport public domicile-travail.",
  howTitle: "Obligation légale",
  howDetail: "Prise en charge ≥ 50 %, exonérée de cotisations sociales dans les limites légales.",
  faqItems: [
    { question: "Et pour la voiture ?", answer: "Pas d'obligation légale, sauf accord ou indemnités kilométriques." },
    { question: "L'employeur peut-il prendre en charge 100 % ?", answer: "Oui, c'est un avantage fréquent exonéré dans certaines limites." },
    { question: "Quels transports sont éligibles ?", answer: "Abonnements de transports publics ou services publics de location de vélos (1re zone)." },
    { question: "Prise en charge et impôt sur le revenu ?", answer: "Exonérée de cotisations et d'impôt dans les limites légales (50 % minimum obligatoire)." },
  ],
  calculate(input) {
    const abo = num(input.abonnementMensuel);
    const taux = Math.max(TICKET_RESTAURANT_PART_EMPLOYEUR, num(input.partEmployeur) / 100);
    const employeur = abo * taux;
    const salarie = abo - employeur;
    return {
      summary: `Employeur : ${formatCurrency(employeur)}/mois — Salarié : ${formatCurrency(salarie)}/mois.`,
      lines: [
        { label: "Prise en charge employeur", value: formatCurrency(employeur), highlight: true },
        { label: "Reste à charge salarié", value: formatCurrency(salarie), highlight: true },
        { label: "Abonnement mensuel", value: formatCurrency(abo) },
        { label: "Coût employeur annuel", value: formatCurrency(employeur * 12) },
      ],
    };
  },
});

const primeExceptionnelleNet = createDraft({
  slug: "simulateur-prime-exceptionnelle-net",
  title: "Prime exceptionnelle nette",
  shortDescription: "Convertissez une prime exceptionnelle brute en montant net perçu.",
  metaTitle: "Simulateur prime exceptionnelle — Brut en net",
  metaDescription: "Estimez le montant net d'une prime exceptionnelle de pouvoir d'achat ou bonus après cotisations.",
  keywords: ["prime exceptionnelle net", "prime pouvoir achat", "bonus net"],
  category: "salaire",
  icon: "wallet",
  regulationIds: ["urssaf"],
  relatedSlugs: ["salaire-brut-net", "simulateur-preavis-licenciement"],
  formFields: [
    { key: "primeBrute", label: "Montant brut de la prime", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "tauxCotisations", label: "Cotisations salariales", type: "number", min: 15, max: 30, step: 0.5, suffix: "%" },
  ],
  defaultValues: { primeBrute: 1000, tauxCotisations: COTISATIONS_SALARIALES_DEFAUT },
  intro: "Une prime exceptionnelle est soumise aux cotisations sociales salariales comme le salaire.",
  howTitle: "Conversion brut-net",
  howDetail: "Net = brut − cotisations salariales − CSG/CRDS (estimation standard).",
  faqItems: [
    { question: "La prime est-elle imposable ?", answer: "Oui, elle entre dans le revenu imposable de l'année." },
    { question: "Existe-t-il des primes exonérées ?", answer: "Certaines primes de partage de la valeur (PPV) bénéficient d'exonérations sous conditions." },
    { question: "Prime versée en cours d'année ou en décembre ?", answer: "Les deux sont possibles ; la date de versement détermine le mois de prélèvement à la source." },
    { question: "Impact sur les congés payés ?", answer: "Une prime exceptionnelle n'entre en principe pas dans l'assiette des congés payés sauf mention au contrat." },
  ],
  calculate(input) {
    const brut = num(input.primeBrute);
    const taux = num(input.tauxCotisations);
    const net = brutToNetMensuel(brut, taux);
    const cotisations = brut - net;
    return {
      summary: `Prime nette estimée : ${formatCurrency(net)} (brut : ${formatCurrency(brut)}).`,
      lines: [
        { label: "Prime nette", value: formatCurrency(net), highlight: true },
        { label: "Prime brute", value: formatCurrency(brut) },
        { label: "Cotisations + CSG/CRDS", value: formatCurrency(cotisations) },
        { label: "Taux de prélèvements", value: formatPercent((cotisations / brut) * 100, 1) },
      ],
    };
  },
});

const coutChomageEmployeur = createDraft({
  slug: "simulateur-cout-chomage-employeur",
  title: "Coût chômage partiel employeur",
  shortDescription: "Estimez le reste à charge employeur en cas d'activité partielle (chômage partiel).",
  metaTitle: "Simulateur coût chômage partiel employeur — Activité partielle",
  metaDescription: "Calculez le coût residual employeur en activité partielle : indemnisation État et charges restantes.",
  keywords: ["chômage partiel employeur", "activité partielle coût", "coût chômage technique"],
  category: "salaire",
  icon: "building",
  regulationIds: ["urssaf"],
  relatedSlugs: ["cout-total-embauche-salarie", "allocation-chomage-are"],
  formFields: [
    { key: "salaireBrut", label: "Salaire brut mensuel habituel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxActivite", label: "Taux d'activité maintenu", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
    { key: "tauxIndemnisation", label: "Taux indemnisation État", type: "number", min: 60, max: 72, step: 1, suffix: "%", hint: "60 % du brut plafonné en général" },
  ],
  defaultValues: { salaireBrut: 2500, tauxActivite: 0, tauxIndemnisation: 60 },
  intro: "En activité partielle, l'État indemnise une partie du salaire et l'employeur complète jusqu'au net habituel.",
  howTitle: "Répartition des coûts",
  howDetail: "Indemnisation État = part non travaillée × taux. Employeur complète le net et paie les charges sur la part travaillée.",
  faqItems: [
    { question: "Qui peut bénéficier de l'activité partielle ?", answer: "Entreprises confrontées à une baisse d'activité ou à des circonstances exceptionnelles." },
    { question: "Le salarié touche-t-il son salaire habituel ?", answer: "Oui, l'employeur doit maintenir au minimum 70 % du salaire brut (sauf accord)." },
    { question: "Qui déclare l'activité partielle ?", answer: "L'employeur dépose la demande d'autorisation ou la notification selon le motif invocable." },
    { question: "Impact sur le solde de congés ?", answer: "Les heures non travaillées en activité partielle n'entraînent pas de réduction des droits à congés payés." },
  ],
  calculate(input) {
    const brut = num(input.salaireBrut);
    const activite = num(input.tauxActivite) / 100;
    const tauxInd = num(input.tauxIndemnisation) / 100;
    const partArret = 1 - activite;
    const indemnisationEtat = brut * partArret * tauxInd;
    const salaireVerse = brut * activite + brut * partArret * 0.7;
    const coutEmployeur = coutEmployeurMensuel(salaireVerse, COTISATIONS_PATRONALES_DEFAUT) - indemnisationEtat;
    return {
      summary: `Coût employeur estimé : ${formatCurrency(Math.max(0, coutEmployeur))}/mois (indemnisation État : ${formatCurrency(indemnisationEtat)}).`,
      lines: [
        { label: "Coût employeur net", value: formatCurrency(Math.max(0, coutEmployeur)), highlight: true },
        { label: "Indemnisation État", value: formatCurrency(indemnisationEtat) },
        { label: "Salaire versé au salarié", value: formatCurrency(salaireVerse) },
        { label: "Taux d'activité", value: formatPercent(activite * 100, 0) },
      ],
    };
  },
});

export const emploiDrafts: SimulatorDefinition[] = [
  preavisDemission,
  preavisLicenciement,
  primePrecariteCdd,
  primeActiviteSalarie,
  ticketsRestaurant,
  chequesVacances,
  forfaitJours,
  tempsPartielDroit,
  ruptureConventionnelle,
  transportDomicileTravail,
  primeExceptionnelleNet,
  coutChomageEmployeur,
];
