import type { SimulatorDefinition } from "../../types";
import { draftSimulator, num } from "../_shared/helpers";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import {
  formatCurrency,
  formatPercent,
  monthlyPaymentFromLoan,
} from "@/lib/utils/format";
import {
  PFU_TAUX_GLOBAL,
  PFU_NET_RATIO,
} from "@/data/regulations/fiscalite";
import {
  LIVRET_A_PLAFOND,
  RETRAITE_TAUX_RETRAIT_DURABLE,
} from "@/data/regulations/retraite";

const LEP_PLAFOND = 10000;

const LEP_TAUX = 6;

const PEL_PLAFOND = 61200;

const PEL_TAUX = 2.25;

const livretEpargnePopulaire = draftSimulator({
  slug: "simulateur-livret-epargne-populaire",
  title: "Livret d'épargne populaire (LEP)",
  shortDescription: "Estimez les intérêts annuels du LEP selon votre solde et l'éligibilité aux plafonds.",
  metaTitle: "Simulateur LEP — Livret d'épargne populaire",
  metaDescription: "Calculez les intérêts du LEP : solde, plafond et taux réglementé pour revenus modestes.",
  keywords: ["LEP", "livret épargne populaire", "taux LEP", "plafond LEP"],
  domain: "finance",
  category: "epargne",
  icon: "wallet",
  regulationIds: ["retraite", "fiscalite"],
  relatedSlugs: ["rendement-livret-a", "interets-composes", "simulateur-capacite-epargne-mensuelle"],
  formFields: [
    { key: "solde", label: "Solde LEP", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "taux", label: "Taux réglementé", type: "number", min: 0, step: 0.1, suffix: "%", hint: `Taux indicatif : ${LEP_TAUX} %` },
  ],
  defaultValues: { solde: 5000, taux: LEP_TAUX },
  content: buildContent({
    intro: "Le LEP est réservé aux revenus modestes, avec un plafond et un taux supérieur au Livret A.",
    howItWorks: [{ title: "Intérêts", blocks: [p(`Intérêts = solde × taux. Plafond indicatif : ${formatCurrency(LEP_PLAFOND)}.`), hl("Éligibilité", "Plafonds de revenus fiscaux — vérifiez sur service-public.fr.")] }],
    example: { title: "5 000 € à 6 %", blocks: [p("Intérêts annuels : 300 € nets d'impôt.")] },
    conseils: ["Ouvrez le LEP avant le Livret A si éligible.", "Un seul LEP par personne.", "Intérêts exonérés d'impôt."],
    limites: ["Éligibilité revenus non vérifiée ici.", "Taux révisé semestriellement."],
  }),
  faq: buildFaq([
    { question: "Qui peut ouvrir un LEP ?", answer: "Personnes aux revenus inférieurs aux plafonds légaux, résidant en France." },
    { question: "Plafond du LEP ?", answer: `Environ ${formatCurrency(LEP_PLAFOND)} selon la réglementation en vigueur.` },
    { question: "LEP ou Livret A ?", answer: "Le LEP offre un taux plus élevé si vous êtes éligible." },
    { question: "Fiscalité ?", answer: "Exonération totale d'impôt sur les intérêts." },
  ]),
  calculate(input: Record<string, number | string>) {
    const solde = Math.min(num(input.solde), LEP_PLAFOND);
    const taux = num(input.taux) / 100;
    const interets = solde * taux;
    return {
      summary: `Intérêts LEP : ${formatCurrency(interets)}/an sur ${formatCurrency(solde)}.`,
      lines: [
        { label: "Intérêts annuels", value: formatCurrency(interets), highlight: true },
        { label: "Solde productif", value: formatCurrency(solde) },
        { label: "Plafond LEP", value: formatCurrency(LEP_PLAFOND) },
        { label: "Taux appliqué", value: formatPercent(num(input.taux), 2) },
        { label: "Réf. Livret A", value: formatCurrency(LIVRET_A_PLAFOND) },
      ],
    };
  },
});

const planEpargneLogement = draftSimulator({
  slug: "simulateur-plan-epargne-logement",
  title: "Plan d'épargne logement (PEL)",
  shortDescription: "Estimez les intérêts et le prêt épargne logement associé à un PEL.",
  metaTitle: "Simulateur PEL — Plan épargne logement",
  metaDescription: "Simulez un PEL : versements, intérêts, plafond et droit au prêt épargne logement.",
  keywords: ["PEL", "plan épargne logement", "prêt épargne logement"],
  domain: "finance",
  category: "epargne",
  icon: "home",
  regulationIds: ["retraite", "fiscalite"],
  relatedSlugs: ["capacite-emprunt", "interets-composes", "simulateur-livret-epargne-populaire"],
  formFields: [
    { key: "solde", label: "Solde PEL", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "versementMensuel", label: "Versement mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "duree", label: "Durée restante", type: "number", min: 1, max: 15, suffix: "ans" },
    { key: "taux", label: "Taux PEL", type: "number", min: 0, step: 0.05, suffix: "%" },
  ],
  defaultValues: { solde: 15000, versementMensuel: 200, duree: 4, taux: PEL_TAUX },
  content: buildContent({
    intro: "Le PEL permet d'épargner à taux fixe et d'obtenir un prêt immobilier à taux avantageux après 4 ans minimum.",
    howItWorks: [{ title: "Capitalisation", blocks: [p("Intérêts capitalisés sur le solde + versements. Prêt PEL possible après 4 ans d'ancienneté."), hl("Plafond", `Versements plafonnés à ${formatCurrency(PEL_PLAFOND)}.`)] }],
    conseils: ["4 ans minimum pour le prêt PEL.", "Prélèvements sociaux sur intérêts depuis 2018.", "Comparez avec Livret A et assurance-vie."],
    limites: ["Taux du prêt PEL non simulé.", "Fiscalité PS simplifiée."],
  }),
  faq: buildFaq([
    { question: "Durée minimum PEL ?", answer: "4 ans pour bénéficier du prêt épargne logement." },
    { question: "Plafond PEL ?", answer: `Versements limités à ${formatCurrency(PEL_PLAFOND)}.` },
    { question: "PEL encore ouvert ?", answer: "Nouveaux PEL limités — vérifiez les offres bancaires actuelles." },
    { question: "Fiscalité intérêts PEL ?", answer: "Soumis aux prélèvements sociaux (17,2 %) et IR selon option." },
  ]),
  calculate(input: Record<string, number | string>) {
    const r = num(input.taux) / 100 / 12;
    const mois = num(input.duree) * 12;
    let capital = num(input.solde);
    const mensuel = num(input.versementMensuel);
    for (let i = 0; i < mois; i++) capital = capital * (1 + r) + mensuel;
    const versements = num(input.solde) + mensuel * mois;
    const interets = capital - versements;
    return {
      summary: `Capital PEL estimé : ${formatCurrency(capital)} (intérêts : ${formatCurrency(interets)}).`,
      lines: [
        { label: "Capital final", value: formatCurrency(capital), highlight: true },
        { label: "Intérêts générés", value: formatCurrency(interets), highlight: true },
        { label: "Total versé", value: formatCurrency(versements) },
        { label: "Durée simulée", value: `${num(input.duree)} ans` },
        { label: "Plafond versements", value: formatCurrency(PEL_PLAFOND) },
      ],
    };
  },
});

const compteEpargneTemps = draftSimulator({
  slug: "simulateur-compte-epargne-temps",
  title: "Compte épargne temps (CET)",
  shortDescription: "Estimez l'épargne salariale sur un CET alimenté par RTT, primes ou congés.",
  metaTitle: "Simulateur CET — Compte épargne temps",
  metaDescription: "Calculez le solde d'un compte épargne temps : alimentation annuelle, taux et durée.",
  keywords: ["CET", "compte épargne temps", "épargne salariale RTT"],
  domain: "finance",
  category: "epargne",
  icon: "briefcase",
  regulationIds: ["retraite"],
  relatedSlugs: ["interets-composes", "simulateur-perco-entreprise", "simulateur-per-retraite"],
  formFields: [
    { key: "solde", label: "Solde CET actuel", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "alimentationAnnuelle", label: "Alimentation annuelle", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "taux", label: "Rémunération annuelle", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "duree", label: "Horizon", type: "number", min: 1, max: 20, suffix: "ans" },
  ],
  defaultValues: { solde: 3000, alimentationAnnuelle: 2500, taux: 1.5, duree: 5 },
  content: buildContent({
    intro: "Le CET permet de capitaliser RTT, primes ou repos convertis en épargne, rémunérée par l'employeur.",
    howItWorks: [{ title: "Capitalisation", blocks: [p("Solde futur = capitalisation du solde + alimentations annuelles au taux CET."), hl("Sortie", "Monétisation, congé ou complément retraite selon accord d'entreprise.")] }],
    conseils: ["Vérifiez l'accord d'entreprise.", "Plafond d'alimentation annuel.", "Comparez avec PERCO/PER."],
    limites: ["Règles propres à chaque entreprise.", "Fiscalité sortie non détaillée."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le CET ?", answer: "Compte alimenté par conversion de RTT, primes ou repos en épargne." },
    { question: "Qui peut l'ouvrir ?", answer: "Salariés d'entreprises ayant signé un accord CET." },
    { question: "Comment sortir ?", answer: "Monétisation, congé ou retraite — selon accord." },
    { question: "CET et PERCO ?", answer: "Dispositifs complémentaires d'épargne salariale." },
  ]),
  calculate(input: Record<string, number | string>) {
    const r = num(input.taux) / 100;
    const duree = num(input.duree);
    let capital = num(input.solde);
    const alim = num(input.alimentationAnnuelle);
    for (let i = 0; i < duree; i++) capital = capital * (1 + r) + alim;
    const verse = num(input.solde) + alim * duree;
    return {
      summary: `Solde CET dans ${duree} ans : ${formatCurrency(capital)}.`,
      lines: [
        { label: "Solde futur", value: formatCurrency(capital), highlight: true },
        { label: "Gains", value: formatCurrency(capital - verse) },
        { label: "Alimentation totale", value: formatCurrency(alim * duree) },
        { label: "Solde initial", value: formatCurrency(num(input.solde)) },
        { label: "Horizon", value: `${duree} ans` },
      ],
    };
  },
});

const assuranceVieRachat = draftSimulator({
  slug: "simulateur-assurance-vie-rachat",
  title: "Assurance-vie — rachat",
  shortDescription: "Estimez le montant net après rachat partiel ou total et la fiscalité PFU.",
  metaTitle: "Simulateur rachat assurance-vie",
  metaDescription: "Calculez le net après rachat assurance-vie : plus-value, PFU et abattements après 8 ans.",
  keywords: ["rachat assurance-vie", "PFU assurance-vie", "fiscalité assurance-vie"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["interets-composes", "simulateur-per-retraite", "rendement-pea"],
  formFields: [
    { key: "valeurContrat", label: "Valeur du contrat", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "versements", label: "Versements nets", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "montantRachat", label: "Montant du rachat", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "duree", label: "Ancienneté du contrat", type: "number", min: 0, max: 30, suffix: "ans" },
  ],
  defaultValues: { valeurContrat: 50000, versements: 40000, montantRachat: 10000, duree: 10 },
  content: buildContent({
    intro: "Le rachat sur assurance-vie déclenche une fiscalité sur la part de plus-value incluse dans le retrait.",
    howItWorks: [{ title: "PFU sur plus-value", blocks: [p(`Plus-value totale = valeur − versements. Part imposable au prorata du rachat. PFU : ${formatPercent(PFU_TAUX_GLOBAL * 100, 1)}.`), hl("Après 8 ans", "Abattement annuel sur les gains (4 600 € ou 9 200 € couple).")] }],
    conseils: ["Privilégiez les arbitrages internes sans rachat.", "Planifiez les rachats après 8 ans.", "Option barème possible selon TMI."],
    limites: ["Abattement 8 ans simplifié.", "Contrats multi-supports non détaillés."],
  }),
  faq: buildFaq([
    { question: "Fiscalité rachat assurance-vie ?", answer: `PFU ${formatPercent(PFU_TAUX_GLOBAL * 100, 1)} sur la part de plus-value, ou option barème.` },
    { question: "Rachat partiel ou total ?", answer: "Partiel : contrat maintenu ; total : clôture du contrat." },
    { question: "Abattement après 8 ans ?", answer: "4 600 € (9 200 € couple) sur les gains par an." },
    { question: "Versements après 70 ans ?", answer: "Règles spécifiques de prélèvements — consultez impots.gouv.fr." },
  ]),
  calculate(input: Record<string, number | string>) {
    const valeur = num(input.valeurContrat);
    const versements = num(input.versements);
    const rachat = Math.min(num(input.montantRachat), valeur);
    const pvTotale = Math.max(0, valeur - versements);
    const partPv = valeur > 0 ? (pvTotale * rachat) / valeur : 0;
    const abatt = num(input.duree) >= 8 ? 4600 : 0;
    const pvImposable = Math.max(0, partPv - abatt);
    const impot = pvImposable * PFU_TAUX_GLOBAL;
    const net = rachat - impot;
    return {
      summary: `Rachat net : ${formatCurrency(net)} (impôt estimé : ${formatCurrency(impot)}).`,
      lines: [
        { label: "Montant net reçu", value: formatCurrency(net), highlight: true },
        { label: "Impôt PFU estimé", value: formatCurrency(impot), highlight: true },
        { label: "Montant racheté", value: formatCurrency(rachat) },
        { label: "Plus-value imposable", value: formatCurrency(pvImposable) },
        { label: "Part capital (non imposée)", value: formatCurrency(rachat - partPv) },
      ],
    };
  },
});

const perRetraite = draftSimulator({
  slug: "simulateur-per-retraite",
  title: "PER — Plan d'épargne retraite",
  shortDescription: "Estimez le capital retraite PER et l'économie d'impôt sur les versements déductibles.",
  metaTitle: "Simulateur PER — Plan épargne retraite",
  metaDescription: "Simulez un PER : versements, déduction fiscale, capitalisation et sortie en rente ou capital.",
  keywords: ["PER", "plan épargne retraite", "déduction PER"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  regulationIds: ["retraite", "fiscalite"],
  relatedSlugs: ["simulateur-per-retraite", "simulateur-retraite", "simulateur-perco-entreprise"],
  formFields: [
    { key: "capitalInitial", label: "Capital PER actuel", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "versementAnnuel", label: "Versement annuel", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "tmi", label: "Tranche marginale d'impôt", type: "number", min: 0, max: 45, step: 1, suffix: "%" },
    { key: "rendement", label: "Rendement annuel", type: "number", min: 0, max: 10, step: 0.5, suffix: "%" },
    { key: "duree", label: "Horizon retraite", type: "number", min: 1, max: 40, suffix: "ans" },
  ],
  defaultValues: { capitalInitial: 10000, versementAnnuel: 3000, tmi: 30, rendement: 4, duree: 20 },
  content: buildContent({
    intro: "Le PER permet une déduction fiscale immédiate sur les versements, capital bloqué jusqu'à la retraite.",
    howItWorks: [{ title: "Capitalisation et déduction", blocks: [p("Économie d'impôt annuelle = versement × TMI. Capital futur capitalisé au rendement choisi."), hl("Sortie", "Capital ou rente imposés à la liquidation selon choix.")] }],
    conseils: ["Versez avant fin d'année pour la déduction.", "Diversifiez les supports.", "Comparez PER individuel et PERCO."],
    limites: ["Plafonds de déduction non détaillés.", "Rendement non garanti."],
  }),
  faq: buildFaq([
    { question: "PER déductible ?", answer: "Versements déductibles du revenu imposable dans la limite des plafonds." },
    { question: "Quand récupérer ?", answer: "À la retraite, ou cas de déblocage anticipé (acquisition, fin de droits…)." },
    { question: "PER ou assurance-vie ?", answer: "PER : avantage fiscal immédiat mais blocage ; AV : disponible." },
    { question: "Sortie en capital ou rente ?", answer: "Au choix — fiscalité différente selon option." },
  ]),
  calculate(input: Record<string, number | string>) {
    const r = num(input.rendement) / 100;
    const duree = num(input.duree);
    const versement = num(input.versementAnnuel);
    const tmi = num(input.tmi) / 100;
    let capital = num(input.capitalInitial);
    const economieAnnuelle = versement * tmi;
    for (let i = 0; i < duree; i++) capital = capital * (1 + r) + versement;
    const totalVerse = num(input.capitalInitial) + versement * duree;
    return {
      summary: `Capital PER estimé : ${formatCurrency(capital)} — économie impôt ${formatCurrency(economieAnnuelle)}/an.`,
      lines: [
        { label: "Capital à la retraite", value: formatCurrency(capital), highlight: true },
        { label: "Économie d'impôt annuelle", value: formatCurrency(economieAnnuelle), highlight: true },
        { label: "Total versé", value: formatCurrency(totalVerse) },
        { label: "Gains estimés", value: formatCurrency(capital - totalVerse) },
        { label: "Horizon", value: `${duree} ans` },
      ],
    };
  },
});

const percoEntreprise = draftSimulator({
  slug: "simulateur-perco-entreprise",
  title: "PERCO — Épargne salariale retraite",
  shortDescription: "Estimez le capital PERCO avec abondement employeur et capitalisation long terme.",
  metaTitle: "Simulateur PERCO entreprise",
  metaDescription: "Calculez l'épargne PERCO : versements salarié, abondement employeur et projection retraite.",
  keywords: ["PERCO", "épargne salariale retraite", "abondement employeur"],
  domain: "finance",
  category: "epargne",
  icon: "briefcase",
  regulationIds: ["retraite", "fiscalite"],
  relatedSlugs: ["simulateur-per-retraite", "simulateur-compte-epargne-temps", "simulateur-per-retraite"],
  formFields: [
    { key: "solde", label: "Solde PERCO actuel", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "versementAnnuel", label: "Versement salarié / an", type: "number", min: 0, step: 200, suffix: "€" },
    { key: "abondement", label: "Abondement employeur", type: "number", min: 0, max: 300, step: 10, suffix: "%" },
    { key: "rendement", label: "Rendement annuel", type: "number", min: 0, max: 10, step: 0.5, suffix: "%" },
    { key: "duree", label: "Horizon", type: "number", min: 1, max: 30, suffix: "ans" },
  ],
  defaultValues: { solde: 8000, versementAnnuel: 2000, abondement: 100, rendement: 3.5, duree: 15 },
  content: buildContent({
    intro: "Le PERCO est alimenté par l'intéressement, la participation et les versements volontaires, souvent abondés par l'employeur.",
    howItWorks: [{ title: "Abondement", blocks: [p("Versement total = salarié + salarié × taux abondement. Capitalisation jusqu'à la retraite."), hl("Blocage", "Sortie en principe à la retraite ou cas de déblocage anticipé.")] }],
    conseils: ["Maximisez l'abondement employeur.", "Diversifiez les supports.", "Cumulez avec PER individuel."],
    limites: ["Plafonds d'abondement non détaillés.", "Rendement variable selon supports."],
  }),
  faq: buildFaq([
    { question: "PERCO obligatoire ?", answer: "Non — mis en place par accord ou décision unilatérale de l'employeur." },
    { question: "Abondement moyen ?", answer: "Souvent 50 à 150 % des versements salarié selon accord." },
    { question: "PERCO vs PER ?", answer: "PERCO via entreprise ; PER individuel ouvert à tous." },
    { question: "Sortie anticipée ?", answer: "Cas limités : acquisition, expiration droits chômage…" },
  ]),
  calculate(input: Record<string, number | string>) {
    const r = num(input.rendement) / 100;
    const duree = num(input.duree);
    const sal = num(input.versementAnnuel);
    const abond = num(input.abondement) / 100;
    const annuel = sal * (1 + abond);
    let capital = num(input.solde);
    for (let i = 0; i < duree; i++) capital = capital * (1 + r) + annuel;
    const totalVerse = num(input.solde) + annuel * duree;
    return {
      summary: `Capital PERCO : ${formatCurrency(capital)} (abondement inclus).`,
      lines: [
        { label: "Capital projeté", value: formatCurrency(capital), highlight: true },
        { label: "Versement annuel total", value: formatCurrency(annuel), highlight: true },
        { label: "Part abondement / an", value: formatCurrency(sal * abond) },
        { label: "Total versé", value: formatCurrency(totalVerse) },
        { label: "Horizon", value: `${duree} ans` },
      ],
    };
  },
});

const creditRenouvelable = draftSimulator({
  slug: "simulateur-credit-renouvelable",
  title: "Crédit renouvelable",
  shortDescription: "Estimez le coût d'un crédit revolving selon le capital utilisé et le taux.",
  metaTitle: "Simulateur crédit renouvelable",
  metaDescription: "Calculez les intérêts d'un crédit renouvelable : réserve, montant utilisé, taux et remboursement.",
  keywords: ["crédit renouvelable", "crédit revolving", "réserve crédit"],
  domain: "finance",
  category: "credit",
  icon: "wallet",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["mensualite-credit-consommation", "simulateur-taux-endettement-pret-conso", "budget-reste-a-vivre"],
  formFields: [
    { key: "montantUtilise", label: "Capital utilisé", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "taux", label: "Taux annuel (TAEG indicatif)", type: "number", min: 0, step: 0.5, suffix: "%" },
    { key: "mensualite", label: "Remboursement mensuel", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { montantUtilise: 3000, taux: 18, mensualite: 150 },
  content: buildContent({
    intro: "Le crédit renouvelable permet de disposer d'une réserve reconstituée au fur et à mesure des remboursements, souvent à taux élevé.",
    howItWorks: [{ title: "Coût des intérêts", blocks: [p("Intérêts mensuels ≈ capital × taux / 12. Durée de remboursement dépend du montant et de la mensualité."), hl("Attention", "Taux souvent supérieur aux crédits amortissables classiques.")] }],
    conseils: ["Privilégiez un prêt amortissable si possible.", "Évitez le crédit revolving pour des achats importants.", "Remboursez rapidement pour limiter les intérêts."],
    limites: ["TAEG réel selon contrat.", "Assurance et frais non inclus."],
  }),
  faq: buildFaq([
    { question: "Crédit renouvelable ou revolving ?", answer: "Même produit : réserve de crédit reconstituée au remboursement." },
    { question: "Taux moyen ?", answer: "Souvent 15 à 20 % TAEG — parmi les crédits les plus chers." },
    { question: "Réglementation ?", answer: "Encadrement renforcé depuis 2023 — durée max et règles de commercialisation." },
    { question: "Alternative ?", answer: "Prêt personnel amortissable ou découvert autorisé temporaire." },
  ]),
  calculate(input: Record<string, number | string>) {
    const capital = num(input.montantUtilise);
    const taux = num(input.taux) / 100 / 12;
    const mens = num(input.mensualite);
    let restant = capital;
    let mois = 0;
    let interets = 0;
    while (restant > 0 && mois < 600) {
      const i = restant * taux;
      interets += i;
      restant = restant + i - mens;
      mois++;
    }
    return {
      summary: mois >= 600
        ? "Mensualité insuffisante pour rembourser le capital."
        : `Remboursement en ${mois} mois — intérêts : ${formatCurrency(interets)}.`,
      lines: [
        { label: "Intérêts totaux", value: formatCurrency(interets), highlight: true },
        { label: "Durée remboursement", value: mois >= 600 ? "> 50 ans" : `${mois} mois` },
        { label: "Capital initial", value: formatCurrency(capital) },
        { label: "Mensualité", value: formatCurrency(mens) },
        { label: "Taux annuel", value: formatPercent(num(input.taux), 1) },
      ],
    };
  },
});

const pretEtudiant = draftSimulator({
  slug: "simulateur-pret-etudiant",
  title: "Prêt étudiant",
  shortDescription: "Estimez la mensualité et le coût total d'un prêt étudiant garanti par l'État.",
  metaTitle: "Simulateur prêt étudiant",
  metaDescription: "Calculez la mensualité d'un prêt étudiant : montant, taux, différé et durée de remboursement.",
  keywords: ["prêt étudiant", "prêt garanti État", "remboursement prêt étudiant"],
  domain: "finance",
  category: "credit",
  icon: "calculator",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["mensualite-credit-consommation", "simulateur-taux-endettement-pret-conso", "simulateur-capacite-epargne-mensuelle"],
  formFields: [
    { key: "montant", label: "Montant emprunté", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "differe", label: "Différé (études)", type: "number", min: 0, max: 7, suffix: "ans" },
    { key: "duree", label: "Durée remboursement", type: "number", min: 1, max: 15, suffix: "ans" },
  ],
  defaultValues: { montant: 20000, taux: 1, differe: 5, duree: 10 },
  content: buildContent({
    intro: "Le prêt étudiant garanti par l'État offre un taux modéré avec différé de remboursement pendant les études.",
    howItWorks: [{ title: "Différé puis amortissement", blocks: [p("Pendant le différé, intérêts capitalisés ou payés selon contrat. Puis mensualités sur la durée choisie."), hl("Garantie", "Prêt garanti à 70 % par l'État — conditions bancaires variables.")] }],
    conseils: ["Empruntez le strict nécessaire.", "Anticipez votre premier salaire.", "Comparez banques partenaires."],
    limites: ["Conditions d'octroi non vérifiées.", "Capitalisation différé simplifiée."],
  }),
  faq: buildFaq([
    { question: "Prêt garanti par l'État ?", answer: "Facilite l'accès au crédit pour les étudiants sans revenus stables." },
    { question: "Quand rembourser ?", answer: "Après les études, souvent avec 2 à 5 ans de différé." },
    { question: "Montant maximum ?", answer: "Variable selon banque — souvent 15 000 à 45 000 € sur la scolarité." },
    { question: "Caution parentale ?", answer: "Souvent requise en complément de la garantie État." },
  ]),
  calculate(input: Record<string, number | string>) {
    const montant = num(input.montant);
    const taux = num(input.taux) / 100;
    const differe = num(input.differe);
    const duree = num(input.duree);
    const capitalDiffere = montant * Math.pow(1 + taux, differe);
    const mensualite = monthlyPaymentFromLoan(capitalDiffere, num(input.taux), duree);
    const total = mensualite * duree * 12;
    return {
      summary: `Mensualité après différé : ${formatCurrency(mensualite)}/mois sur ${duree} ans.`,
      lines: [
        { label: "Mensualité", value: formatCurrency(mensualite), highlight: true },
        { label: "Capital après différé", value: formatCurrency(capitalDiffere) },
        { label: "Coût total remboursement", value: formatCurrency(total) },
        { label: "Montant initial", value: formatCurrency(montant) },
        { label: "Différé", value: `${differe} ans` },
      ],
    };
  },
});

const capitalDeces = draftSimulator({
  slug: "simulateur-capital-deces",
  title: "Capital décès — assurance",
  shortDescription: "Estimez le capital décès nécessaire pour couvrir les charges du foyer.",
  metaTitle: "Simulateur capital décès",
  metaDescription: "Calculez le capital décès recommandé : revenus à remplacer, dettes et frais de succession.",
  keywords: ["capital décès", "assurance décès", "prévoyance capital"],
  domain: "finance",
  category: "epargne",
  icon: "heart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-rente-viagere", "simulateur-allocation-vie", "simulateur-per-retraite"],
  formFields: [
    { key: "revenusAnnuels", label: "Revenus annuels à remplacer", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "anneesCouverture", label: "Années de couverture", type: "number", min: 1, max: 25, suffix: "ans" },
    { key: "dettes", label: "Dettes à solder", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "frais", label: "Frais divers (obsèques, scolarité…)", type: "number", min: 0, step: 1000, suffix: "€" },
  ],
  defaultValues: { revenusAnnuels: 45000, anneesCouverture: 10, dettes: 150000, frais: 15000 },
  content: buildContent({
    intro: "Le capital décès compense la perte de revenus et règle les dettes en cas de décès de l'assuré.",
    howItWorks: [{ title: "Besoin de couverture", blocks: [p("Capital = revenus × années + dettes + frais. Ajustez selon prestations conjoint et rente éducation."), hl("Fiscalité", "Contrats de prévoyance souvent exonérés selon bénéficiaires.")] }],
    conseils: ["Revoyez la couverture à chaque changement de vie.", "Désignez clairement les bénéficiaires.", "Croisez avec assurance emprunteur."],
    limites: ["Besoin réel variable selon situation familiale.", "Prestations sociales non déduites."],
  }),
  faq: buildFaq([
    { question: "Combien de capital décès ?", answer: "Souvent 5 à 10 ans de revenus + solde des dettes." },
    { question: "Assurance groupe ou individuelle ?", answer: "Individuelle plus flexible ; groupe via employeur souvent insuffisante." },
    { question: "Capital ou rente ?", answer: "Capital versé une fois ; rente éducation pour les enfants." },
    { question: "Fiscalité bénéficiaires ?", answer: "Exonération sous conditions pour conjoint et enfants." },
  ]),
  calculate(input: Record<string, number | string>) {
    const rev = num(input.revenusAnnuels);
    const ans = num(input.anneesCouverture);
    const dettes = num(input.dettes);
    const frais = num(input.frais);
    const capital = rev * ans + dettes + frais;
    return {
      summary: `Capital décès recommandé : ${formatCurrency(capital)}.`,
      lines: [
        { label: "Capital recommandé", value: formatCurrency(capital), highlight: true },
        { label: "Part revenus", value: formatCurrency(rev * ans) },
        { label: "Dettes à couvrir", value: formatCurrency(dettes) },
        { label: "Frais divers", value: formatCurrency(frais) },
        { label: "Horizon revenus", value: `${ans} ans` },
      ],
    };
  },
});

const renteViagere = draftSimulator({
  slug: "simulateur-rente-viagere",
  title: "Rente viagère",
  shortDescription: "Estimez la rente mensuelle en échange d'un capital versé à une compagnie d'assurance.",
  metaTitle: "Simulateur rente viagère",
  metaDescription: "Calculez une rente viagère : capital versé, âge, taux technique et rente mensuelle estimée.",
  keywords: ["rente viagère", "conversion capital rente", "retraite rente"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  regulationIds: ["retraite", "fiscalite"],
  relatedSlugs: ["simulateur-capital-deces", "simulateur-per-retraite", "simulateur-per-retraite"],
  formFields: [
    { key: "capital", label: "Capital à convertir", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "age", label: "Âge au départ", type: "number", min: 50, max: 85, step: 1, suffix: "ans" },
    { key: "tauxConversion", label: "Taux de conversion annuel", type: "number", min: 1, max: 8, step: 0.1, suffix: "%", hint: "Indicatif selon âge et contrat" },
  ],
  defaultValues: { capital: 200000, age: 65, tauxConversion: 4.5 },
  content: buildContent({
    intro: "La rente viagère transforme un capital en revenus réguliers jusqu'au décès, avec aléa longévité mutualisé.",
    howItWorks: [{ title: "Conversion", blocks: [p("Rente annuelle ≈ capital × taux de conversion. Le taux augmente avec l'âge au départ."), hl("Réversion", "Option rente réversible pour le conjoint possible.")] }],
    conseils: ["Comparez plusieurs assureurs.", "Vérifiez les options de réversion.", "Croisez avec PER et retraite de base."],
    limites: ["Taux réel selon table mortalité et contrat.", "Inflation non indexée sauf option."],
  }),
  faq: buildFaq([
    { question: "Rente viagère ou capital ?", answer: "Rente : sécurité de revenus ; capital : flexibilité et transmission." },
    { question: "Rente réversible ?", answer: "Le conjoint continue de percevoir une part après le décès de l'assuré." },
    { question: "Fiscalité rente ?", answer: "Partie rente imposable selon l'âge au versement (barème spécifique)." },
    { question: "À quel âge convertir ?", answer: "Plus tard = rente mensuelle plus élevée mais moins de versements." },
  ]),
  calculate(input: Record<string, number | string>) {
    const capital = num(input.capital);
    const taux = num(input.tauxConversion) / 100;
    const renteAnnuelle = capital * taux;
    const renteMensuelle = renteAnnuelle / 12;
    return {
      summary: `Rente viagère estimée : ${formatCurrency(renteMensuelle)}/mois.`,
      lines: [
        { label: "Rente mensuelle", value: formatCurrency(renteMensuelle), highlight: true },
        { label: "Rente annuelle", value: formatCurrency(renteAnnuelle), highlight: true },
        { label: "Capital converti", value: formatCurrency(capital) },
        { label: "Taux de conversion", value: formatPercent(num(input.tauxConversion), 2) },
        { label: "Âge au départ", value: `${num(input.age)} ans` },
      ],
    };
  },
});

const dcaInvestissement = draftSimulator({
  slug: "simulateur-dca-investissement",
  title: "DCA — investissement régulier",
  shortDescription: "Comparez l'investissement programmé (DCA) à un versement unique sur la durée.",
  metaTitle: "Simulateur DCA — Dollar Cost Averaging",
  metaDescription: "Simulez un investissement régulier (DCA) : versements mensuels, rendement et capital final.",
  keywords: ["DCA", "investissement régulier", "versements programmés"],
  domain: "finance",
  category: "epargne",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["interets-composes", "rendement-pea", "simulateur-objectif-epargne"],
  formFields: [
    { key: "versementMensuel", label: "Versement mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "rendement", label: "Rendement annuel moyen", type: "number", min: -10, max: 15, step: 0.5, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 40, suffix: "ans" },
    { key: "capitalInitial", label: "Capital initial (optionnel)", type: "number", min: 0, step: 1000, suffix: "€" },
  ],
  defaultValues: { versementMensuel: 300, rendement: 6, duree: 15, capitalInitial: 0 },
  content: buildContent({
    intro: "Le DCA consiste à investir régulièrement la même somme, lissant les achats sur les hauts et les bas du marché.",
    howItWorks: [{ title: "Capitalisation mensuelle", blocks: [p("Chaque mois, le versement est capitalisé au rendement moyen. Lisse le risque de timing."), hl("Avantage", "Réduit le risque d'investir tout au plus haut.")] }],
    conseils: ["Automatisez les versements.", "Diversifiez (ETF, PEA).", "Gardez un horizon long terme."],
    limites: ["Rendement moyen — volatilité réelle importante.", "Fiscalité non incluse."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le DCA ?", answer: "Investir régulièrement une somme fixe, quelle que soit la conjoncture." },
    { question: "DCA ou lump sum ?", answer: "Historiquement, investir d'un bloc performe souvent, mais le DCA réduit le stress." },
    { question: "Quel support ?", answer: "ETF diversifiés en PEA ou compte-titres selon horizon." },
    { question: "Fréquence idéale ?", answer: "Mensuelle ou trimestrielle — l'essentiel est la régularité." },
  ]),
  calculate(input: Record<string, number | string>) {
    const r = num(input.rendement) / 100 / 12;
    const mois = num(input.duree) * 12;
    const mensuel = num(input.versementMensuel);
    let capital = num(input.capitalInitial);
    for (let i = 0; i < mois; i++) capital = capital * (1 + r) + mensuel;
    const verse = num(input.capitalInitial) + mensuel * mois;
    return {
      summary: `Capital DCA : ${formatCurrency(capital)} (versé : ${formatCurrency(verse)}).`,
      lines: [
        { label: "Capital final", value: formatCurrency(capital), highlight: true },
        { label: "Gains estimés", value: formatCurrency(capital - verse), highlight: true },
        { label: "Total versé", value: formatCurrency(verse) },
        { label: "Versement mensuel", value: formatCurrency(mensuel) },
        { label: "Durée", value: `${num(input.duree)} ans` },
      ],
    };
  },
});

const allocationVie = draftSimulator({
  slug: "simulateur-allocation-vie",
  title: "Allocation de vie — budget",
  shortDescription: "Répartissez votre budget selon la règle des enveloppes : besoins, loisirs, épargne.",
  metaTitle: "Simulateur allocation de vie — Budget",
  metaDescription: "Organisez votre budget mensuel : charges fixes, variables et épargne selon vos revenus.",
  keywords: ["allocation budget", "enveloppes budget", "répartition revenus"],
  domain: "finance",
  category: "epargne",
  icon: "wallet",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-allocation-vie", "budget-reste-a-vivre", "simulateur-capacite-epargne-mensuelle"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "partFixes", label: "Part charges fixes", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
    { key: "partVariables", label: "Part dépenses variables", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
    { key: "partEpargne", label: "Part épargne", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
  ],
  defaultValues: { revenus: 2800, partFixes: 50, partVariables: 30, partEpargne: 20 },
  content: buildContent({
    intro: "L'allocation de budget repartit vos revenus entre charges obligatoires, consommation libre et épargne.",
    howItWorks: [{ title: "Trois enveloppes", blocks: [p("Montant = revenus × part / 100 pour chaque enveloppe. Total des parts = 100 %."), hl("50/30/20", "Règle courante : 50 % fixes, 30 % plaisir, 20 % épargne.")] }],
    conseils: ["Automatisez l'épargne en début de mois.", "Revoyez l'allocation trimestriellement.", "Réduisez les fixes si l'épargne est insuffisante."],
    limites: ["Parts indicatives — adaptez à votre situation.", "Ne remplace pas un suivi budgétaire détaillé."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que l'allocation de vie ?", answer: "Répartition structurée du budget entre postes essentiels et discrétionnaires." },
    { question: "Règle 50/30/20 ?", answer: "50 % besoins, 30 % envies, 20 % épargne — point de départ adaptable." },
    { question: "Charges fixes ?", answer: "Loyer, crédits, assurances, abonnements — difficiles à réduire à court terme." },
    { question: "Épargne minimum ?", answer: "Viser 10 à 20 % des revenus selon objectifs et endettement." },
  ]),
  calculate(input: Record<string, number | string>) {
    const rev = num(input.revenus);
    const fixes = rev * (num(input.partFixes) / 100);
    const variables = rev * (num(input.partVariables) / 100);
    const epargne = rev * (num(input.partEpargne) / 100);
    const total = num(input.partFixes) + num(input.partVariables) + num(input.partEpargne);
    return {
      summary: `Épargne allouée : ${formatCurrency(epargne)}/mois (${formatPercent(num(input.partEpargne), 0)}).`,
      lines: [
        { label: "Charges fixes", value: formatCurrency(fixes), highlight: true },
        { label: "Dépenses variables", value: formatCurrency(variables) },
        { label: "Épargne", value: formatCurrency(epargne), highlight: true },
        { label: "Revenus mensuels", value: formatCurrency(rev) },
        { label: "Total parts", value: formatPercent(total, 0) },
      ],
    };
  },
});

const tauxEndettementPretConso = draftSimulator({
  slug: "simulateur-taux-endettement-pret-conso",
  title: "Taux d'endettement — prêt conso",
  shortDescription: "Vérifiez si un nouveau crédit consommation respecte le plafond d'endettement de 35 %.",
  metaTitle: "Simulateur taux endettement prêt consommation",
  metaDescription: "Calculez votre taux d'endettement avec un prêt consommation : revenus, charges et nouvelle mensualité.",
  keywords: ["taux endettement crédit conso", "endettement 35", "capacité emprunt conso"],
  domain: "finance",
  category: "credit",
  icon: "scale",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["mensualite-credit-consommation", "budget-reste-a-vivre", "capacite-emprunt"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "charges", label: "Charges de crédits actuelles", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "nouvelleMensualite", label: "Nouvelle mensualité conso", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { revenus: 3000, charges: 400, nouvelleMensualite: 250 },
  content: buildContent({
    intro: "Les organismes de crédit appliquent un taux d'endettement maximal, souvent aligné sur 35 % des revenus.",
    howItWorks: [{ title: "Formule", blocks: [p("Endettement = (charges + nouvelle mensualité) / revenus × 100."), hl("Reste à vivre", "Vérifiez aussi le reste à vivre minimum exigé par l'organisme.")] }],
    conseils: ["Consolidez vos crédits si endettement élevé.", "Allongez la durée pour réduire la mensualité.", "Comparez TAEG, pas seulement le taux."],
    limites: ["Seuils variables selon organisme.", "Revenus pris en compte selon nature des ressources."],
  }),
  faq: buildFaq([
    { question: "Plafond endettement conso ?", answer: "Souvent 33 à 35 % des revenus, charges incluses." },
    { question: "Loyer pris en compte ?", answer: "Oui pour les locataires — réduit la capacité d'emprunt conso." },
    { question: "Rachat de crédit ?", answer: "Peut regrouper plusieurs mensualités pour respecter le plafond." },
    { question: "Différence avec immobilier ?", answer: "Même plafond HCSF pour l'immobilier ; conso souvent plus strict sur le reste à vivre." },
  ]),
  calculate(input: Record<string, number | string>) {
    const rev = num(input.revenus);
    const charges = num(input.charges);
    const nouvelle = num(input.nouvelleMensualite);
    const total = charges + nouvelle;
    const taux = rev > 0 ? (total / rev) * 100 : 0;
    const reste = rev - total;
    const ok = taux <= 35;
    return {
      summary: ok
        ? `Endettement : ${formatPercent(taux, 1)} — dans la limite des 35 %.`
        : `Endettement : ${formatPercent(taux, 1)} — au-dessus du plafond.`,
      lines: [
        { label: "Taux d'endettement", value: formatPercent(taux, 1), highlight: true },
        { label: "Reste à vivre", value: formatCurrency(reste), highlight: true },
        { label: "Total mensualités", value: formatCurrency(total) },
        { label: "Revenus mensuels", value: formatCurrency(rev) },
        { label: "Statut", value: ok ? "Acceptable" : "Trop endetté" },
      ],
    };
  },
});

const objectifEpargne = draftSimulator({
  slug: "simulateur-objectif-epargne",
  title: "Objectif d'épargne",
  shortDescription: "Calculez le versement mensuel nécessaire pour atteindre un capital cible à une date fixée.",
  metaTitle: "Simulateur objectif d'épargne",
  metaDescription: "Déterminez combien épargner chaque mois pour atteindre votre objectif financier à horizon donné.",
  keywords: ["objectif épargne", "versement mensuel épargne", "simulation épargne"],
  domain: "finance",
  category: "epargne",
  icon: "wallet",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["interets-composes", "simulateur-dca-investissement", "simulateur-capacite-epargne-mensuelle"],
  formFields: [
    { key: "objectif", label: "Capital cible", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "capitalActuel", label: "Épargne actuelle", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "rendement", label: "Rendement annuel", type: "number", min: 0, max: 15, step: 0.5, suffix: "%" },
    { key: "duree", label: "Horizon", type: "number", min: 1, max: 40, suffix: "ans" },
  ],
  defaultValues: { objectif: 50000, capitalActuel: 5000, rendement: 3, duree: 10 },
  content: buildContent({
    intro: "Fixer un objectif chiffré permet de calculer l'effort d'épargne mensuel nécessaire.",
    howItWorks: [{ title: "Versement mensuel", blocks: [p("Estimation par capitalisation inverse : combien verser chaque mois pour atteindre l'objectif."), hl("Effet temps", "Un rendement modeste accélère l'atteinte de l'objectif.")] }],
    conseils: ["Automatisez les virements.", "Placez sur supports adaptés à l'horizon.", "Réévaluez l'objectif chaque année."],
    limites: ["Rendement non garanti.", "Inflation non intégrée."],
  }),
  faq: buildFaq([
    { question: "Comment fixer un objectif ?", answer: "Apport immobilier, projet, matelas de sécurité (3-6 mois de charges)." },
    { question: "Quel rendement utiliser ?", answer: "Livret A ~3 %, mix actions/obligations 4-6 % sur long terme." },
    { question: "Objectif inaccessible ?", answer: "Allongez l'horizon ou réduisez le montant cible." },
    { question: "Épargne de précaution d'abord ?", answer: "Oui — constituez 3 à 6 mois de charges avant projets long terme." },
  ]),
  calculate(input: Record<string, number | string>) {
    const objectif = num(input.objectif);
    const actuel = num(input.capitalActuel);
    const r = num(input.rendement) / 100 / 12;
    const mois = num(input.duree) * 12;
    const futurActuel = actuel * Math.pow(1 + r, mois);
    const reste = Math.max(0, objectif - futurActuel);
    const versement = r > 0 ? (reste * r) / (Math.pow(1 + r, mois) - 1) : reste / mois;
    return {
      summary: `Versement mensuel nécessaire : ${formatCurrency(versement)} sur ${num(input.duree)} ans.`,
      lines: [
        { label: "Versement mensuel", value: formatCurrency(versement), highlight: true },
        { label: "Capital cible", value: formatCurrency(objectif), highlight: true },
        { label: "Épargne actuelle projetée", value: formatCurrency(futurActuel) },
        { label: "Reste à constituer", value: formatCurrency(reste) },
        { label: "Horizon", value: `${num(input.duree)} ans` },
      ],
    };
  },
});

const rendementObligation = draftSimulator({
  slug: "simulateur-rendement-obligation",
  title: "Rendement obligation",
  shortDescription: "Estimez le rendement à l'échéance (YTM) simplifié d'une obligation ou d'un fonds obligataire.",
  metaTitle: "Simulateur rendement obligation",
  metaDescription: "Calculez le rendement d'une obligation : prix, coupon, nominal et durée jusqu'à l'échéance.",
  keywords: ["rendement obligation", "YTM", "coupon obligataire"],
  domain: "finance",
  category: "epargne",
  icon: "percent",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["interets-composes", "simulateur-dca-investissement", "rendement-pea"],
  formFields: [
    { key: "nominal", label: "Valeur nominale", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "prixAchat", label: "Prix d'achat", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "coupon", label: "Coupon annuel", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "duree", label: "Durée jusqu'à échéance", type: "number", min: 0.5, max: 30, step: 0.5, suffix: "ans" },
  ],
  defaultValues: { nominal: 1000, prixAchat: 980, coupon: 3, duree: 5 },
  content: buildContent({
    intro: "Le rendement obligataire combine les coupons perçus et le gain ou la perte en capital à l'échéance.",
    howItWorks: [{ title: "YTM simplifié", blocks: [p("Rendement ≈ (coupons annuels + (nominal − prix) / durée) / prix × 100."), hl("Risque", "Taux montent = prix baisse. Risque de défaut pour obligations corporate.")] }],
    conseils: ["Diversifiez via ETF obligataires.", "Attention au risque de taux sur longue durée.", "Préférez investment grade pour la prudence."],
    limites: ["YTM exact nécessite calcul actuariel.", "Fiscalité PFU non incluse."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le YTM ?", answer: "Rendement total si l'obligation est conservée jusqu'à l'échéance." },
    { question: "Obligation premium ou discount ?", answer: "Premium : prix > nominal ; discount : prix < nominal." },
    { question: "Obligations d'État ou entreprises ?", answer: "État : moindre risque ; entreprises : coupons plus élevés." },
    { question: "Fiscalité coupons ?", answer: `Soumis au PFU ${formatPercent(PFU_TAUX_GLOBAL * 100, 1)} ou barème + PS.` },
  ]),
  calculate(input: Record<string, number | string>) {
    const nominal = num(input.nominal);
    const prix = num(input.prixAchat);
    const coupon = num(input.coupon) / 100;
    const duree = num(input.duree);
    const couponsAnnuels = nominal * coupon;
    const gainCapital = (nominal - prix) / duree;
    const rendement = prix > 0 ? ((couponsAnnuels + gainCapital) / prix) * 100 : 0;
    const revenuNet = couponsAnnuels * PFU_NET_RATIO;
    return {
      summary: `Rendement estimé : ${formatPercent(rendement, 2)} — coupon net ≈ ${formatCurrency(revenuNet)}/an.`,
      lines: [
        { label: "Rendement à l'échéance", value: formatPercent(rendement, 2), highlight: true },
        { label: "Coupons annuels bruts", value: formatCurrency(couponsAnnuels) },
        { label: "Coupons nets (PFU)", value: formatCurrency(revenuNet), highlight: true },
        { label: "Prix d'achat", value: formatCurrency(prix) },
        { label: "Durée", value: `${duree} ans` },
      ],
    };
  },
});

const capaciteEpargneMensuelle = draftSimulator({
  slug: "simulateur-capacite-epargne-mensuelle",
  title: "Capacité d'épargne mensuelle",
  shortDescription: "Estimez combien vous pouvez épargner chaque mois après charges fixes et variables.",
  metaTitle: "Simulateur capacité épargne mensuelle",
  metaDescription: "Calculez votre capacité d'épargne : revenus, charges fixes, dépenses courantes et reste disponible.",
  keywords: ["capacité épargne", "reste à vivre épargne", "combien épargner par mois"],
  domain: "finance",
  category: "epargne",
  icon: "wallet",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["budget-reste-a-vivre", "simulateur-objectif-epargne", "simulateur-allocation-vie"],
  formFields: [
    { key: "revenus", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "chargesFixes", label: "Charges fixes", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "depensesVariables", label: "Dépenses variables estimées", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "margeSecurite", label: "Marge de sécurité", type: "number", min: 0, max: 30, step: 5, suffix: "%" },
  ],
  defaultValues: { revenus: 3000, chargesFixes: 1500, depensesVariables: 900, margeSecurite: 10 },
  content: buildContent({
    intro: "La capacité d'épargne est ce qui reste après avoir couvert vos charges et une marge de sécurité.",
    howItWorks: [{ title: "Calcul", blocks: [p("Capacité = revenus − fixes − variables − marge sécurité."), hl("Matelas", "Constituez 3 à 6 mois de charges en épargne de précaution d'abord.")] }],
    conseils: ["Payez-vous en premier (virement épargne auto).", "Réduisez les charges fixes négociables.", "Suivez vos dépenses variables."],
    limites: ["Dépenses variables estimées — suivi réel recommandé.", "Événements imprévus non inclus."],
  }),
  faq: buildFaq([
    { question: "Combien épargner par mois ?", answer: "10 à 20 % des revenus si possible, après matelas de sécurité." },
    { question: "Capacité négative ?", answer: "Réduisez les variables ou augmentez les revenus — endettement à traiter." },
    { question: "Épargne de précaution ?", answer: "3 à 6 mois de charges sur livret disponible." },
    { question: "Où placer l'épargne ?", answer: "Livret pour le court terme ; PEA/AV pour le long terme." },
  ]),
  calculate(input: Record<string, number | string>) {
    const rev = num(input.revenus);
    const fixes = num(input.chargesFixes);
    const variables = num(input.depensesVariables);
    const marge = rev * (num(input.margeSecurite) / 100);
    const capacite = rev - fixes - variables - marge;
    const tauxEpargne = rev > 0 ? (Math.max(0, capacite) / rev) * 100 : 0;
    return {
      summary: `Capacité d'épargne : ${formatCurrency(Math.max(0, capacite))}/mois (${formatPercent(tauxEpargne, 1)} des revenus).`,
      lines: [
        { label: "Capacité d'épargne", value: formatCurrency(Math.max(0, capacite)), highlight: true },
        { label: "Taux d'épargne", value: formatPercent(tauxEpargne, 1), highlight: true },
        { label: "Reste avant marge", value: formatCurrency(rev - fixes - variables) },
        { label: "Marge de sécurité", value: formatCurrency(marge) },
        { label: "Revenus mensuels", value: formatCurrency(rev) },
      ],
    };
  },
});

export const financeDrafts: SimulatorDefinition[] = [
  livretEpargnePopulaire,
  planEpargneLogement,
  compteEpargneTemps,
  assuranceVieRachat,
  perRetraite,
  percoEntreprise,
  creditRenouvelable,
  pretEtudiant,
  capitalDeces,
  renteViagere,
  dcaInvestissement,
  allocationVie,
  tauxEndettementPretConso,
  objectifEpargne,
  rendementObligation,
  capaciteEpargneMensuelle,
];
