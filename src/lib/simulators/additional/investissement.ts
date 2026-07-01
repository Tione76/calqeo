import type { SimulatorDefinition } from "../types";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { buildContent, buildFaq, hl, p } from "../_shared/content-builder";
import { MICRO_MEUBLE_ABATTEMENT, calculerPlusValueImmobiliere } from "@/lib/config/fiscalite";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

function investissementBase(prix: number, notaire: number, travaux: number) {
  return prix + notaire + travaux;
}

export const plusValueImmobiliere: SimulatorDefinition = {
  slug: "plus-value-immobiliere",
  title: "Plus-value immobilière",
  shortDescription: "Estimez la plus-value brute et l'impôt lors de la revente d'un bien immobilier.",
  metaTitle: "Simulateur plus-value immobilière — Impôt revente",
  metaDescription: "Calculez la plus-value immobilière à la revente : prix d'achat, frais, prix de vente et estimation de l'impôt.",
  keywords: ["plus-value immobilière", "impôt revente", "taxation plus-value"],
  category: "fiscalite",
  icon: "chart",
  relatedSlugs: ["rendement-locatif", "rentabilite-lmnp", "frais-de-notaire"],
  formFields: [
    { key: "prixAchat", label: "Prix d'achat", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "fraisAcquisition", label: "Frais d'acquisition", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "travaux", label: "Travaux déductibles", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "prixVente", label: "Prix de vente", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "anneesDetention", label: "Durée de détention", type: "number", min: 0, max: 50, suffix: "ans" },
  ],
  defaultValues: { prixAchat: 200000, fraisAcquisition: 16000, travaux: 15000, prixVente: 280000, anneesDetention: 12 },
  content: buildContent({
    intro: "La plus-value est la différence entre le prix de vente et le prix d'acquisition corrigé des frais et travaux.",
    howItWorks: [{ title: "Calcul", blocks: [p("Plus-value = prix de vente − (prix d'achat + frais + travaux). Des abattements s'appliquent selon la durée de détention."), hl("Résidence principale", "Exonération totale sous conditions de résidence effective.")] }],
    conseils: ["Conservez tous les justificatifs de travaux.", "Consultez un notaire pour le calcul définitif."],
    limites: ["Estimation pédagogique — le notaire applique le calcul définitif.", "Exonérations particulières (résidence principale, première cession…) non modélisées."],
  }),
  faq: buildFaq([
    { question: "La résidence principale est-elle exonérée ?", answer: "Oui, sous conditions de résidence effective au jour de la vente." },
    { question: "Quel impôt sur la plus-value ?", answer: "IR (19 %) + prélèvements sociaux (17,2 %), avec abattements selon la durée." },
    { question: "Quels travaux sont déductibles ?", answer: "Travaux justifiés ou forfait 15 % si détention > 5 ans." },
    { question: "Plus-value locative ?", answer: "En principe taxable à la revente, sauf exceptions." },
  ]),
  calculate(input) {
    const calc = calculerPlusValueImmobiliere({
      prixAchat: num(input.prixAchat),
      fraisAcquisition: num(input.fraisAcquisition),
      travaux: num(input.travaux),
      prixVente: num(input.prixVente),
      anneesDetention: num(input.anneesDetention),
    });

    return {
      summary: `Plus-value brute : ${formatCurrency(calc.plusValueBrute)} — Impôt total estimé : ${formatCurrency(calc.impotTotal)} (IR ${formatCurrency(calc.impotRevenu)} + PS ${formatCurrency(calc.prelevementsSociaux)}${calc.surtaxe > 0 ? ` + surtaxe ${formatCurrency(calc.surtaxe)}` : ""}).`,
      lines: [
        { label: "Plus-value brute", value: formatCurrency(calc.plusValueBrute), highlight: true },
        { label: "Impôt total", value: formatCurrency(calc.impotTotal), highlight: true },
        { label: "Prix de vente", value: formatCurrency(calc.prixVente) },
        { label: "Prix d'acquisition corrigé", value: formatCurrency(calc.prixAcquisitionCorrige) },
        { label: "Abattement IR", value: formatCurrency(calc.abattementIRMontant) },
        { label: "Abattement prélèvements sociaux", value: formatCurrency(calc.abattementPSMontant) },
        { label: "Plus-value imposable IR", value: formatCurrency(calc.plusValueImposableIR) },
        { label: "Plus-value imposable PS", value: formatCurrency(calc.plusValueImposablePS) },
        { label: "Impôt sur le revenu", value: formatCurrency(calc.impotRevenu) },
        { label: "Prélèvements sociaux", value: formatCurrency(calc.prelevementsSociaux) },
        { label: "Surtaxe éventuelle", value: formatCurrency(calc.surtaxe) },
        { label: "Plus-value nette après fiscalité", value: formatCurrency(calc.plusValueNette) },
        { label: "Durée de détention", value: `${calc.anneesDetention} ans` },
        { label: "Années restantes exonération IR", value: `${calc.anneesRestantesExonerationIR} ans` },
        { label: "Années restantes exonération PS", value: `${calc.anneesRestantesExonerationPS} ans` },
        { label: "Économie fiscale frais et travaux", value: formatCurrency(calc.economieFiscaleFraisTravaux) },
      ],
    };
  },
};

export const rendementLocatifBrut: SimulatorDefinition = {
  slug: "rendement-locatif-brut",
  title: "Rendement locatif brut",
  shortDescription: "Calculez rapidement le rendement locatif brut (loyers / investissement).",
  metaTitle: "Simulateur rendement locatif brut",
  metaDescription: "Calculez le rendement locatif brut : loyers annuels rapportés au coût total d'acquisition.",
  keywords: ["rendement locatif brut", "calcul rendement brut"],
  category: "investissement",
  icon: "chart",
  relatedSlugs: ["rendement-locatif-net", "rendement-locatif", "cash-flow-immobilier"],
  formFields: [
    { key: "prix", label: "Prix d'achat", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "notaire", label: "Frais de notaire", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "travaux", label: "Travaux", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "loyer", label: "Loyer mensuel hors charges", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { prix: 180000, notaire: 14400, travaux: 8000, loyer: 850 },
  content: buildContent({
    intro: "Le rendement brut est le ratio le plus simple pour filtrer une annonce locative.",
    howItWorks: [{ title: "Formule", blocks: [hl("Rendement brut", "(Loyer mensuel × 12) / Investissement total × 100")] }],
    conseils: ["Comparez des biens similaires.", "Complétez avec le rendement net pour une vision réaliste."],
    limites: ["Ne tient pas compte des charges ni de la vacance.", "Le simulateur rendement locatif complet calcule aussi le net."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le rendement brut ?", answer: "Loyers annuels divisés par le coût total d'acquisition." },
    { question: "Quel rendement brut viser ?", answer: "5 à 8 % en province, 2 à 4 % en zone tendue." },
    { question: "Différence avec le net ?", answer: "Le net déduit charges et vacance locative." },
    { question: "Simulateur complet ?", answer: "Voir aussi /simulateurs/rendement-locatif pour brut, net et cash-flow." },
  ]),
  calculate(input) {
    const prix = num(input.prix);
    const notaire = num(input.notaire);
    const travaux = num(input.travaux);
    const loyer = num(input.loyer);
    const total = investissementBase(prix, notaire, travaux);
    const loyerAnnuel = loyer * 12;
    const rendement = total > 0 ? (loyerAnnuel / total) * 100 : 0;
    return {
      summary: `Rendement locatif brut : ${formatPercent(rendement, 2)}.`,
      lines: [
        { label: "Rendement brut", value: formatPercent(rendement, 2), highlight: true },
        { label: "Prix d'achat", value: formatCurrency(prix) },
        { label: "Frais de notaire", value: formatCurrency(notaire) },
        { label: "Travaux", value: formatCurrency(travaux) },
        { label: "Investissement total", value: formatCurrency(total) },
        { label: "Loyer mensuel", value: formatCurrency(loyer) },
        { label: "Loyer annuel", value: formatCurrency(loyerAnnuel) },
      ],
    };
  },
};

export const rendementLocatifNet: SimulatorDefinition = {
  slug: "rendement-locatif-net",
  title: "Rendement locatif net",
  shortDescription: "Calculez le rendement locatif net après charges et vacance locative.",
  metaTitle: "Simulateur rendement locatif net",
  metaDescription: "Estimez le rendement locatif net : charges, vacance locative et coût total d'acquisition.",
  keywords: ["rendement locatif net", "rentabilité nette"],
  category: "investissement",
  icon: "chart",
  relatedSlugs: ["rendement-locatif-brut", "cash-flow-immobilier", "rendement-locatif"],
  formFields: [
    { key: "prix", label: "Prix d'achat", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "notaire", label: "Frais de notaire", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "travaux", label: "Travaux", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "loyer", label: "Loyer mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges annuelles", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "vacance", label: "Vacance locative", type: "number", min: 0, max: 30, step: 1, suffix: "%" },
  ],
  defaultValues: { prix: 180000, notaire: 14400, travaux: 8000, loyer: 850, charges: 2400, vacance: 5 },
  content: buildContent({
    intro: "Le rendement net reflète mieux la rentabilité réelle en intégrant charges et vacance.",
    howItWorks: [{ title: "Formule", blocks: [p("Rendement net = ((Loyer annuel × (1 − vacance)) − Charges) / Investissement total × 100")] }],
    conseils: ["Intégrez taxe foncière, copropriété et assurance PNO.", "Prévoyez 3 à 5 % de vacance minimum."],
    limites: ["Fiscalité non incluse."],
  }),
  faq: buildFaq([
    { question: "Quelles charges déduire ?", answer: "Taxe foncière, copropriété non récupérable, assurance PNO, gestion." },
    { question: "Quel rendement net minimum ?", answer: "Souvent 3 à 5 % en province." },
    { question: "Vacance locative ?", answer: "3 à 5 % en zone tendue, plus ailleurs." },
    { question: "Simulateur complet ?", answer: "/simulateurs/rendement-locatif combine brut, net et cash-flow." },
  ]),
  calculate(input) {
    const prix = num(input.prix);
    const notaire = num(input.notaire);
    const travaux = num(input.travaux);
    const loyer = num(input.loyer);
    const charges = num(input.charges);
    const vacance = num(input.vacance);
    const total = investissementBase(prix, notaire, travaux);
    const loyerAnnuel = loyer * 12;
    const vacanceMontant = loyerAnnuel * (vacance / 100);
    const revenuNet = loyerAnnuel - charges - vacanceMontant;
    const rendement = total > 0 ? (revenuNet / total) * 100 : 0;
    return {
      summary: `Rendement locatif net : ${formatPercent(rendement, 2)}.`,
      lines: [
        { label: "Rendement net", value: formatPercent(rendement, 2), highlight: true },
        { label: "Prix d'achat", value: formatCurrency(prix) },
        { label: "Frais de notaire", value: formatCurrency(notaire) },
        { label: "Travaux", value: formatCurrency(travaux) },
        { label: "Investissement total", value: formatCurrency(total) },
        { label: "Loyer mensuel", value: formatCurrency(loyer) },
        { label: "Loyer annuel", value: formatCurrency(loyerAnnuel) },
        { label: "Charges annuelles", value: formatCurrency(charges) },
        { label: "Vacance locative", value: formatPercent(vacance, 0) },
        { label: "Vacance locative (montant)", value: formatCurrency(vacanceMontant) },
        { label: "Revenu net annuel", value: formatCurrency(revenuNet) },
      ],
    };
  },
};

export const cashFlowImmobilier: SimulatorDefinition = {
  slug: "cash-flow-immobilier",
  title: "Cash-flow immobilier",
  shortDescription: "Calculez le cash-flow mensuel de votre investissement locatif.",
  metaTitle: "Simulateur cash-flow immobilier locatif",
  metaDescription: "Estimez le cash-flow mensuel : loyers, charges, vacance et mensualité de crédit.",
  keywords: ["cash-flow immobilier", "cash flow locatif"],
  category: "investissement",
  icon: "wallet",
  relatedSlugs: ["rendement-locatif-net", "mensualite-pret-immobilier", "rendement-locatif"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges mensuelles", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "vacance", label: "Vacance locative", type: "number", min: 0, max: 30, suffix: "%" },
    { key: "mensualite", label: "Mensualité de crédit", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { loyer: 850, charges: 200, vacance: 5, mensualite: 650 },
  content: buildContent({
    intro: "Le cash-flow mesure l'argent qui reste ou manque chaque mois après loyers, charges et crédit.",
    howItWorks: [{ title: "Formule", blocks: [p("Cash-flow = Loyer effectif − Charges − Mensualité. Positif = autofinancement.")] }],
    conseils: ["Comparez plusieurs scénarios de financement.", "Prévoyez un budget travaux."],
    limites: ["Fiscalité non incluse."],
  }),
  faq: buildFaq([
    { question: "Cash-flow positif : bon signe ?", answer: "Oui pour la trésorerie, mais vérifiez aussi le rendement long terme." },
    { question: "Comment l'améliorer ?", answer: "Négocier le prix, optimiser le loyer ou allonger la durée du crédit." },
    { question: "Différence avec rendement net ?", answer: "Le rendement net ignore le crédit ; le cash-flow l'intègre." },
    { question: "Achat comptant ?", answer: "Mettez mensualité à 0." },
  ]),
  calculate(input) {
    const loyer = num(input.loyer);
    const charges = num(input.charges);
    const vacance = num(input.vacance);
    const mensualite = num(input.mensualite);
    const perteVacance = loyer * (vacance / 100);
    const loyerEff = loyer - perteVacance;
    const cashFlow = loyerEff - charges - mensualite;
    const cashFlowAnnuel = cashFlow * 12;
    return {
      summary: `Cash-flow mensuel : ${formatCurrency(cashFlow)} (${cashFlow >= 0 ? "excédent" : "déficit"}).`,
      lines: [
        { label: "Cash-flow mensuel", value: formatCurrency(cashFlow), highlight: true },
        { label: "Loyer mensuel", value: formatCurrency(loyer) },
        { label: "Vacance locative", value: formatPercent(vacance, 0) },
        { label: "Perte liée à la vacance", value: formatCurrency(perteVacance) },
        { label: "Loyer mensuel effectif", value: formatCurrency(loyerEff) },
        { label: "Charges mensuelles", value: formatCurrency(charges) },
        { label: "Mensualité de crédit", value: formatCurrency(mensualite) },
        { label: "Cash-flow annuel", value: formatCurrency(cashFlowAnnuel) },
      ],
    };
  },
};

export const rentabiliteLmnp: SimulatorDefinition = {
  slug: "rentabilite-lmnp",
  title: "Rentabilité LMNP",
  shortDescription: "Estimez la rentabilité d'un investissement en location meublée (LMNP).",
  metaTitle: "Simulateur rentabilité LMNP — Location meublée",
  metaDescription: "Calculez la rentabilité LMNP : loyers meublés, charges, micro-BIC ou réel simplifié.",
  keywords: ["LMNP", "location meublée", "micro BIC"],
  category: "fiscalite",
  icon: "chart",
  relatedSlugs: ["rendement-locatif-net", "cash-flow-immobilier", "plus-value-immobiliere"],
  formFields: [
    { key: "investissement", label: "Investissement total", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "loyerMensuel", label: "Loyer mensuel meublé", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges annuelles", type: "number", min: 0, step: 100, suffix: "€" },
    {
      key: "regime",
      label: "Régime fiscal estimé",
      type: "select",
      options: [
        { value: "micro", label: "Micro-BIC (abattement 50 %)" },
        { value: "reel", label: "Réel simplifié" },
      ],
    },
  ],
  defaultValues: { investissement: 150000, loyerMensuel: 750, charges: 2000, regime: "micro" },
  content: buildContent({
    intro: "Le LMNP permet de louer meublé avec une fiscalité BIC avantageuse.",
    howItWorks: [{ title: "Micro vs réel", blocks: [p("Micro-BIC : abattement 50 %. Réel : déduction des charges et amortissement possible.")] }],
    conseils: ["Vérifiez la liste des meubles obligatoires.", "Consultez un expert-comptable pour le réel."],
    limites: ["Estimation fiscale simplifiée."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le LMNP ?", answer: "Statut fiscal de location meublée (BIC)." },
    { question: "Micro-BIC ou réel ?", answer: "Micro si peu de charges ; réel si charges importantes." },
    { question: "Meubles obligatoires ?", answer: "Liste fixée par décret (literie, rangements…)." },
    { question: "LMNP vs location nue ?", answer: "LMNP : loyers plus élevés, fiscalité BIC. Nu : fiscalité foncière." },
  ]),
  calculate(input) {
    const invest = num(input.investissement);
    const loyerMensuel = num(input.loyerMensuel);
    const recettes = loyerMensuel * 12;
    const charges = num(input.charges);
    const regime = String(input.regime);
    const revenuNet = regime === "micro" ? recettes * MICRO_MEUBLE_ABATTEMENT : recettes - charges;
    const rendement = invest > 0 ? (revenuNet / invest) * 100 : 0;
    const regimeLabel = regime === "micro" ? "Micro-BIC" : "Réel simplifié";
    const abattementApplique =
      regime === "micro"
        ? `${formatPercent((1 - MICRO_MEUBLE_ABATTEMENT) * 100, 0)} (${formatCurrency(recettes - revenuNet)})`
        : formatCurrency(charges);
    return {
      summary: `Rentabilité LMNP estimée : ${formatPercent(rendement, 2)}.`,
      lines: [
        { label: "Rentabilité estimée", value: formatPercent(rendement, 2), highlight: true },
        { label: "Investissement total", value: formatCurrency(invest) },
        { label: "Loyer mensuel meublé", value: formatCurrency(loyerMensuel) },
        { label: "Recettes annuelles", value: formatCurrency(recettes) },
        { label: "Charges annuelles", value: formatCurrency(charges) },
        { label: "Régime fiscal", value: regimeLabel },
        { label: "Abattement appliqué", value: abattementApplique },
        { label: "Revenu fiscal estimé", value: formatCurrency(revenuNet) },
      ],
    };
  },
};

export const budgetTravaux: SimulatorDefinition = {
  slug: "budget-travaux",
  title: "Budget travaux",
  shortDescription: "Estimez le budget de rénovation selon la surface et le niveau de travaux.",
  metaTitle: "Simulateur budget travaux immobilier",
  metaDescription: "Estimez le coût de rénovation selon la surface et le type de travaux (€/m²).",
  keywords: ["budget travaux", "coût rénovation"],
  category: "investissement",
  icon: "building",
  relatedSlugs: ["rentabilite-apres-travaux", "frais-de-notaire", "rendement-locatif"],
  formFields: [
    { key: "surface", label: "Surface à rénover", type: "number", min: 1, step: 5, suffix: "m²" },
    {
      key: "niveau",
      label: "Niveau de travaux",
      type: "select",
      options: [
        { value: "legere", label: "Légère — ~400 €/m²" },
        { value: "moyenne", label: "Moyenne — ~800 €/m²" },
        { value: "lourde", label: "Lourde — ~1 200 €/m²" },
      ],
    },
  ],
  defaultValues: { surface: 65, niveau: "moyenne" },
  content: buildContent({
    intro: "Estimez un budget travaux pour intégrer la rénovation dans votre projet.",
    howItWorks: [{ title: "Prix au m²", blocks: [p("Rafraîchissement ~400 €/m², rénovation ~800 €/m², lourde ~1 200 €/m² et plus.")] }],
    conseils: ["Demandez 3 devis.", "Prévoyez 10 à 15 % de marge."],
    limites: ["Fourchette moyenne nationale."],
  }),
  faq: buildFaq([
    { question: "Coût au m² ?", answer: "De 400 €/m² (léger) à 1 200 €/m² et plus (lourd)." },
    { question: "Financer les travaux ?", answer: "Crédit travaux intégré ou prêt consommation." },
    { question: "TVA réduite ?", answer: "10 % possible en rénovation énergétique, sous conditions." },
    { question: "Et la rentabilité ?", answer: "Utilisez le simulateur rentabilité après travaux." },
  ]),
  calculate(input) {
    const surface = num(input.surface);
    const prixM2: Record<string, number> = { legere: 400, moyenne: 800, lourde: 1200 };
    const niveauLabels: Record<string, string> = {
      legere: "Légère — ~400 €/m²",
      moyenne: "Moyenne — ~800 €/m²",
      lourde: "Lourde — ~1 200 €/m²",
    };
    const niveau = String(input.niveau);
    const pm2 = prixM2[niveau] ?? 800;
    const budget = surface * pm2;
    const marge10 = budget * 0.1;
    const marge15 = budget * 0.15;
    const budgetMarge10 = budget + marge10;
    const budgetMarge15 = budget + marge15;
    return {
      summary: `Budget travaux estimé : ${formatCurrency(budget)}.`,
      lines: [
        { label: "Budget total", value: formatCurrency(budget), highlight: true },
        { label: "Surface", value: `${surface} m²` },
        { label: "Niveau de travaux", value: niveauLabels[niveau] ?? niveau },
        { label: "Prix moyen au m²", value: formatCurrency(pm2) },
        { label: "Budget estimé", value: formatCurrency(budget) },
        { label: "Marge imprévus 10 %", value: formatCurrency(marge10) },
        { label: "Marge imprévus 15 %", value: formatCurrency(marge15) },
        { label: "Budget avec marge 10 %", value: formatCurrency(budgetMarge10) },
        { label: "Budget avec marge 15 %", value: formatCurrency(budgetMarge15) },
      ],
    };
  },
};

export const rentabiliteApresTravaux: SimulatorDefinition = {
  slug: "rentabilite-apres-travaux",
  title: "Rentabilité après travaux",
  shortDescription: "Calculez le rendement locatif en intégrant le coût des travaux.",
  metaTitle: "Simulateur rentabilité après travaux",
  metaDescription: "Estimez la rentabilité locative après travaux : surloyer et rendement net.",
  keywords: ["rentabilité après travaux", "rendement rénovation"],
  category: "investissement",
  icon: "chart",
  relatedSlugs: ["budget-travaux", "rendement-locatif-net", "rendement-locatif"],
  formFields: [
    { key: "prix", label: "Prix d'achat", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "notaire", label: "Frais de notaire", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "travaux", label: "Coût des travaux", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "loyerApres", label: "Loyer mensuel après travaux", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "loyerAvant", label: "Loyer avant travaux", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges annuelles", type: "number", min: 0, step: 100, suffix: "€" },
  ],
  defaultValues: { prix: 120000, notaire: 9600, travaux: 35000, loyerApres: 750, loyerAvant: 550, charges: 1800 },
  content: buildContent({
    intro: "Mesurez si la rénovation améliore réellement la rentabilité locative.",
    howItWorks: [{ title: "Avant / après", blocks: [p("Compare le rendement net avec le loyer avant et après travaux.")] }],
    conseils: ["Estimez le surloyer réaliste.", "Intégrez tous les travaux au budget."],
    limites: ["Vacance locative non incluse."],
  }),
  faq: buildFaq([
    { question: "Les travaux améliorent-ils toujours le rendement ?", answer: "Pas si le surloyer ne compense pas le surcoût." },
    { question: "Travaux prioritaires ?", answer: "Cuisine, SdB, isolation." },
    { question: "Lien budget travaux ?", answer: "Simulateur budget-travaux pour estimer le coût." },
    { question: "Fiscalité ?", answer: "Certaines charges déductibles en location." },
  ]),
  calculate(input) {
    const prix = num(input.prix);
    const notaire = num(input.notaire);
    const travaux = num(input.travaux);
    const loyerApresMensuel = num(input.loyerApres);
    const loyerAvantMensuel = num(input.loyerAvant);
    const charges = num(input.charges);
    const total = investissementBase(prix, notaire, travaux);
    const loyerApresAnnuel = loyerApresMensuel * 12;
    const loyerAvantAnnuel = loyerAvantMensuel * 12;
    const revenuNetApres = loyerApresAnnuel - charges;
    const revenuNetAvant = loyerAvantAnnuel - charges;
    const netApres = total > 0 ? (revenuNetApres / total) * 100 : 0;
    const totalSansTravaux = prix + notaire;
    const netAvant = totalSansTravaux > 0 ? (revenuNetAvant / totalSansTravaux) * 100 : 0;
    const surloyerMensuel = loyerApresMensuel - loyerAvantMensuel;
    const surloyerAnnuel = surloyerMensuel * 12;
    const gainRendement = netApres - netAvant;
    const gainPointsLabel = `${gainRendement >= 0 ? "+" : ""}${gainRendement.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} point${Math.abs(gainRendement) >= 2 ? "s" : ""}`;
    return {
      summary: `Rendement net après travaux : ${formatPercent(netApres, 2)} (avant : ${formatPercent(netAvant, 2)}).`,
      lines: [
        { label: "Rendement net après travaux", value: formatPercent(netApres, 2), highlight: true },
        { label: "Prix d'achat", value: formatCurrency(prix) },
        { label: "Frais de notaire", value: formatCurrency(notaire) },
        { label: "Coût des travaux", value: formatCurrency(travaux) },
        { label: "Investissement total", value: formatCurrency(total) },
        { label: "Loyer avant travaux", value: formatCurrency(loyerAvantMensuel) },
        { label: "Loyer après travaux", value: formatCurrency(loyerApresMensuel) },
        { label: "Surloyer mensuel", value: formatCurrency(surloyerMensuel) },
        { label: "Surloyer annuel", value: formatCurrency(surloyerAnnuel) },
        { label: "Charges annuelles", value: formatCurrency(charges) },
        { label: "Revenu net annuel avant travaux", value: formatCurrency(revenuNetAvant) },
        { label: "Revenu net annuel après travaux", value: formatCurrency(revenuNetApres) },
        { label: "Rendement net avant travaux", value: formatPercent(netAvant, 2) },
        { label: "Gain de rendement", value: gainPointsLabel },
      ],
    };
  },
};

export const investissementSimulators = [
  plusValueImmobiliere,
  rendementLocatifBrut,
  rendementLocatifNet,
  cashFlowImmobilier,
  rentabiliteLmnp,
  budgetTravaux,
  rentabiliteApresTravaux,
];
