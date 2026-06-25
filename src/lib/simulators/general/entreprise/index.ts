import type { SimulatorDefinition } from "../../types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils/format";
import { buildContent, buildFaq, p } from "../../_shared/content-builder";
import {
  getMicroEntrepreneurTaux,
  PORTAGE_NET_CA_RATIO,
} from "@/lib/config/urssaf";
import {
  PFU_TAUX_GLOBAL,
  PFU_NET_RATIO,
  FRANCHISE_TVA,
} from "@/lib/config/fiscalite";
import {
  ACRE_REDUCTION_ANNEE_1,
  FREELANCE_TAUX_CHARGES_DEFAUT,
  TNS_TAUX_CHARGES_DEFAUT,
} from "@/lib/config/aides";

const num = (v: number | string) =>
  typeof v === "number" ? v : parseFloat(String(v)) || 0;

const placeholderContent = (intro: string) =>
  buildContent({
    intro,
    howItWorks: [{ title: "Calcul", blocks: [p("Contenu détaillé disponible sur la page.")] }],
    conseils: ["Consultez un expert-comptable pour valider vos chiffres avant décision."],
    limites: ["Estimation simplifiée — régimes et options réels non exhaustifs."],
  });

const placeholderFaq = buildFaq([
  { question: "Ce simulateur remplace-t-il un expert ?", answer: "Non, il fournit une estimation pédagogique à affiner avec un professionnel." },
]);

export const calculateurTjmFreelance: SimulatorDefinition = {
  slug: "calculateur-tjm-freelance",
  title: "Calculateur TJM freelance",
  shortDescription:
    "Déterminez votre TJM (taux journalier moyen) pour atteindre un revenu net annuel cible.",
  metaTitle: "Calculateur TJM freelance — Taux journalier moyen",
  metaDescription:
    "Calculez votre TJM pour couvrir charges, impôts et revenu net : jours facturables, frais et cotisations. Outil gratuit indépendants.",
  keywords: ["TJM freelance", "taux journalier moyen", "calcul TJM", "simulateur freelance"],
  domain: "entreprise",
  category: "independant",
  icon: "briefcase",
  relatedSlugs: ["revenu-net-independant", "facturation-objectif-revenu-net", "micro-entrepreneur-charges", "cout-horaire-charge-tns"],
  formFields: [
    { key: "revenuNetCible", label: "Revenu net annuel visé", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "joursFacturables", label: "Jours facturables par an", type: "number", min: 100, max: 240, step: 1, suffix: "jours", hint: "Environ 220 jours ouvrés − congés" },
    { key: "tauxCharges", label: "Charges + impôts (% du CA)", type: "number", min: 20, max: 50, step: 1, suffix: "%" },
    { key: "fraisAnnuel", label: "Frais professionnels annuels", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { revenuNetCible: 40000, joursFacturables: 200, tauxCharges: FREELANCE_TAUX_CHARGES_DEFAUT, fraisAnnuel: 3000 },
  content: placeholderContent("Fixez un TJM cohérent avec votre objectif de revenu et vos jours facturables."),
  faq: placeholderFaq,
  calculate(input) {
    const net = num(input.revenuNetCible);
    const jours = num(input.joursFacturables);
    const taux = num(input.tauxCharges) / 100;
    const frais = num(input.fraisAnnuel);
    const caNeeded = (net + frais) / (1 - taux);
    const tjm = caNeeded / jours;
    return {
      summary: `TJM minimum estimé : ${formatCurrency(tjm)}/jour (${formatCurrency(caNeeded)} de CA annuel).`,
      lines: [
        { label: "TJM recommandé", value: formatCurrency(tjm), highlight: true },
        { label: "CA annuel nécessaire", value: formatCurrency(caNeeded), highlight: true },
        { label: "Revenu net visé", value: formatCurrency(net) },
        { label: "Jours facturables", value: `${jours} jours` },
        { label: "Frais annuels", value: formatCurrency(frais) },
      ],
    };
  },
};

export const revenuNetIndependant: SimulatorDefinition = {
  slug: "revenu-net-independant",
  title: "Revenu net indépendant",
  shortDescription:
    "Estimez le revenu net après charges sociales à partir de votre chiffre d'affaires annuel.",
  metaTitle: "Simulateur revenu net indépendant — Après charges",
  metaDescription:
    "Calculez votre revenu net d'indépendant : CA, charges URSSAF et frais. Complément au simulateur micro-entrepreneur fiscal.",
  keywords: ["revenu net indépendant", "CA net freelance", "simulateur auto-entrepreneur net"],
  domain: "entreprise",
  category: "independant",
  icon: "wallet",
  relatedSlugs: ["calculateur-tjm-freelance", "micro-entrepreneur-charges", "exoneration-acre", "facturation-objectif-revenu-net"],
  formFields: [
    { key: "caAnnuel", label: "Chiffre d'affaires annuel", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "activite",
      label: "Activité micro-entreprise",
      type: "select",
      options: [
        { value: "vente", label: "Vente (12,3 %)" },
        { value: "bic", label: "Prestations BIC (21,2 %)" },
        { value: "bnc", label: "Prestations BNC (24,6 %)" },
      ],
    },
    { key: "fraisAnnuel", label: "Frais professionnels", type: "number", min: 0, step: 500, suffix: "€" },
  ],
  defaultValues: { caAnnuel: 45000, activite: "bic", fraisAnnuel: 2000 },
  content: placeholderContent("Visualisez ce qu'il reste après cotisations sociales micro-entreprise et frais."),
  faq: placeholderFaq,
  calculate(input) {
    const ca = num(input.caAnnuel);
    const taux = getMicroEntrepreneurTaux(String(input.activite));
    const charges = ca * (taux / 100);
    const frais = num(input.fraisAnnuel);
    const net = ca - charges - frais;
    return {
      summary: `Revenu net estimé : ${formatCurrency(net)}/an (${formatCurrency(net / 12)}/mois).`,
      lines: [
        { label: "Revenu net annuel", value: formatCurrency(net), highlight: true },
        { label: "Revenu net mensuel", value: formatCurrency(net / 12), highlight: true },
        { label: "Charges sociales", value: formatCurrency(charges) },
        { label: "Chiffre d'affaires", value: formatCurrency(ca) },
        { label: "Taux charges", value: formatPercent(taux, 1) },
      ],
    };
  },
};

export const sasuRemunerationDividendes: SimulatorDefinition = {
  slug: "sasu-remuneration-dividendes",
  title: "SASU salaire vs dividendes",
  shortDescription:
    "Comparez le net perçu via salaire (assimilé salarié) ou dividendes (flat tax) en SASU.",
  metaTitle: "Simulateur SASU salaire vs dividendes — Comparatif net",
  metaDescription:
    "Comparez rémunération en salaire et distribution de dividendes en SASU : charges et flat tax 30 %. Outil dirigeant.",
  keywords: ["SASU salaire dividendes", "rémunération dirigeant", "simulateur SASU", "dividendes dirigeant"],
  domain: "entreprise",
  category: "independant",
  icon: "chart",
  relatedSlugs: ["impot-dividendes", "flat-tax-30-pourcent", "cout-total-embauche-salarie", "salaire-brut-net"],
  formFields: [
    { key: "montantBrut", label: "Montant brut disponible", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "mode",
      label: "Mode de rémunération",
      type: "select",
      options: [
        { value: "salaire", label: "Salaire de dirigeant" },
        { value: "dividendes", label: "Dividendes (flat tax 30 %)" },
      ],
    },
    { key: "tauxCotisations", label: "Cotisations salariales (si salaire)", type: "number", min: 40, max: 80, step: 1, suffix: "%", hint: "TNS assimilé salarié ~45-75 %" },
  ],
  defaultValues: { montantBrut: 50000, mode: "dividendes", tauxCotisations: 55 },
  content: placeholderContent("Arbitrer entre salaire et dividendes pour optimiser le net perçu en SASU."),
  faq: placeholderFaq,
  calculate(input) {
    const brut = num(input.montantBrut);
    const mode = String(input.mode);
    const tauxSal = num(input.tauxCotisations) / 100;
    let net: number;
    let charges: number;
    if (mode === "salaire") {
      charges = brut * tauxSal;
      net = brut - charges;
    } else {
      charges = brut * PFU_TAUX_GLOBAL;
      net = brut * PFU_NET_RATIO;
    }
    return {
      summary: `Net estimé en ${mode === "salaire" ? "salaire" : "dividendes"} : ${formatCurrency(net)} (${formatPercent((net / brut) * 100, 0)} du brut).`,
      lines: [
        { label: "Net perçu", value: formatCurrency(net), highlight: true },
        { label: "Charges / fiscalité", value: formatCurrency(charges) },
        { label: "Montant brut", value: formatCurrency(brut) },
        { label: "Mode retenu", value: mode === "salaire" ? "Salaire dirigeant" : "Dividendes PFU 30 %" },
        { label: "Alternative", value: mode === "salaire" ? "Tester dividendes" : "Tester salaire", description: "Comparez les deux scénarios" },
      ],
    };
  },
};

export const portageSalarialVsFreelance: SimulatorDefinition = {
  slug: "portage-salarial-vs-freelance",
  title: "Portage salarial vs freelance",
  shortDescription:
    "Comparez le revenu net en portage salarial (~50 % du CA) et en micro-entreprise freelance.",
  metaTitle: "Simulateur portage salarial vs freelance — Comparatif net",
  metaDescription:
    "Comparez portage salarial et freelance : frais de gestion, charges et net perçu. Outil pour consultants indépendants.",
  keywords: ["portage salarial vs freelance", "simulateur portage", "comparatif freelance"],
  domain: "entreprise",
  category: "independant",
  icon: "scale",
  relatedSlugs: ["calculateur-tjm-freelance", "revenu-net-independant", "micro-entrepreneur-charges", "salaire-brut-net"],
  formFields: [
    { key: "caMensuel", label: "Chiffre d'affaires mensuel HT", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "fraisPortage", label: "Frais de gestion portage", type: "number", min: 5, max: 15, step: 0.5, suffix: "%" },
    {
      key: "activite",
      label: "Activité micro-entreprise",
      type: "select",
      options: [
        { value: "bic", label: "Prestations BIC (21,2 %)" },
        { value: "bnc", label: "Prestations BNC (24,6 %)" },
      ],
    },
  ],
  defaultValues: { caMensuel: 8000, fraisPortage: 10, activite: "bnc" },
  content: placeholderContent("Comparez deux statuts fréquents pour les consultants et formateurs indépendants."),
  faq: placeholderFaq,
  calculate(input) {
    const ca = num(input.caMensuel);
    const fraisP = num(input.fraisPortage) / 100;
    const tauxMicro = getMicroEntrepreneurTaux(String(input.activite));
    const netPortage = ca * (1 - fraisP) * PORTAGE_NET_CA_RATIO;
    const netFreelance = ca * (1 - tauxMicro / 100);
    const diff = netPortage - netFreelance;
    const meilleur = diff >= 0 ? "Portage salarial" : "Micro-entreprise";
    return {
      summary: `${meilleur} plus favorable — écart : ${formatCurrency(Math.abs(diff))}/mois.`,
      lines: [
        { label: "Meilleure option", value: meilleur, highlight: true },
        { label: "Net portage estimé", value: formatCurrency(netPortage), highlight: true },
        { label: "Net freelance estimé", value: formatCurrency(netFreelance), highlight: true },
        { label: "CA mensuel", value: formatCurrency(ca) },
        { label: "Écart mensuel", value: formatCurrency(Math.abs(diff)) },
      ],
    };
  },
};

export const seuilFranchiseTva: SimulatorDefinition = {
  slug: "seuil-franchise-tva",
  title: "Seuil franchise TVA",
  shortDescription:
    "Vérifiez si votre CA annuel reste sous les seuils de franchise en base de TVA.",
  metaTitle: "Simulateur seuil franchise TVA — Plafonds 2025",
  metaDescription:
    "Calculez si vous dépassez les seuils de franchise TVA : ventes ou prestations. Outil gratuit auto-entrepreneurs et TPE.",
  keywords: ["seuil franchise TVA", "plafond TVA micro-entreprise", "franchise TVA", "simulateur TVA"],
  domain: "entreprise",
  category: "entreprise-gestion",
  icon: "percent",
  relatedSlugs: ["calculateur-tva", "micro-entrepreneur-charges", "revenu-net-independant", "marge-commerciale-taux"],
  formFields: [
    { key: "caAnnuel", label: "Chiffre d'affaires annuel HT", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "typeActivite",
      label: "Type d'activité",
      type: "select",
      options: [
        { value: "prestations", label: "Prestations de services (37 500 €)" },
        { value: "ventes", label: "Vente de marchandises (85 000 €)" },
      ],
    },
  ],
  defaultValues: { caAnnuel: 32000, typeActivite: "prestations" },
  content: placeholderContent("Anticipez le basculement au régime réel de TVA selon votre chiffre d'affaires."),
  faq: placeholderFaq,
  calculate(input) {
    const ca = num(input.caAnnuel);
    const type = String(input.typeActivite);
    const seuil =
      type === "ventes"
        ? FRANCHISE_TVA.ventes
        : FRANCHISE_TVA.prestations;
    const seuilMaj = seuil * FRANCHISE_TVA.coefficientSeuilMajore;
    const ok = ca <= seuil;
    const marge = seuil - ca;
    return {
      summary: ok
        ? `Franchise TVA maintenue : ${formatCurrency(marge)} sous le plafond.`
        : `Seuil dépassé — passage à la TVA probable (${formatCurrency(ca - seuil)} au-dessus).`,
      lines: [
        { label: "Statut franchise", value: ok ? "Sous le seuil" : "Seuil dépassé", highlight: true },
        { label: "CA annuel HT", value: formatCurrency(ca) },
        { label: "Seuil franchise", value: formatCurrency(seuil) },
        { label: "Seuil majoré (tolérance)", value: formatCurrency(seuilMaj) },
        { label: "Marge / dépassement", value: formatCurrency(Math.abs(marge)) },
      ],
    };
  },
};

export const breakEvenEntreprise: SimulatorDefinition = {
  slug: "break-even-entreprise",
  title: "Seuil de rentabilité",
  shortDescription:
    "Calculez le chiffre d'affaires minimum pour couvrir vos charges fixes et variables.",
  metaTitle: "Simulateur seuil de rentabilité — Break-even",
  metaDescription:
    "Calculez votre point mort (break-even) : charges fixes, marge unitaire et CA minimum rentable. Outil TPE/PME.",
  keywords: ["seuil rentabilité", "break even", "point mort entreprise", "simulateur rentabilité"],
  domain: "entreprise",
  category: "entreprise-gestion",
  icon: "chart",
  relatedSlugs: ["marge-commerciale-taux", "cout-total-embauche-salarie", "facturation-objectif-revenu-net", "budget-travaux"],
  formFields: [
    { key: "chargesFixes", label: "Charges fixes mensuelles", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "prixVenteUnitaire", label: "Prix de vente unitaire HT", type: "number", min: 0, step: 1, suffix: "€" },
    { key: "coutVariableUnitaire", label: "Coût variable unitaire", type: "number", min: 0, step: 1, suffix: "€" },
  ],
  defaultValues: { chargesFixes: 3500, prixVenteUnitaire: 120, coutVariableUnitaire: 45 },
  content: placeholderContent("Déterminez le volume de ventes minimum pour ne plus être déficitaire."),
  faq: placeholderFaq,
  calculate(input) {
    const fixes = num(input.chargesFixes);
    const pv = num(input.prixVenteUnitaire);
    const cv = num(input.coutVariableUnitaire);
    const margeUnit = pv - cv;
    const units = margeUnit > 0 ? fixes / margeUnit : 0;
    const ca = units * pv;
    return {
      summary: `Seuil de rentabilité : ${formatCurrency(ca)}/mois (${formatNumber(units, 0)} unités).`,
      lines: [
        { label: "CA break-even mensuel", value: formatCurrency(ca), highlight: true },
        { label: "Unités à vendre", value: formatNumber(units, 0), highlight: true },
        { label: "Marge unitaire", value: formatCurrency(margeUnit) },
        { label: "Charges fixes", value: formatCurrency(fixes) },
        { label: "Taux marge", value: pv > 0 ? formatPercent((margeUnit / pv) * 100, 1) : "—" },
      ],
    };
  },
};

export const margeCommercialeTaux: SimulatorDefinition = {
  slug: "marge-commerciale-taux",
  title: "Marge commerciale",
  shortDescription:
    "Calculez le prix de vente HT à partir du coût d'achat et du taux de marge souhaité.",
  metaTitle: "Simulateur marge commerciale — Prix de vente et markup",
  metaDescription:
    "Calculez votre marge commerciale, coefficient multiplicateur et prix de vente HT. Outil gratuit commerçants et artisans.",
  keywords: ["marge commerciale", "calcul marge", "coefficient marge", "prix de vente HT"],
  domain: "entreprise",
  category: "entreprise-gestion",
  icon: "calculator",
  relatedSlugs: ["break-even-entreprise", "calculateur-tva", "seuil-franchise-tva", "rentabilite-lmnp"],
  formFields: [
    { key: "coutAchat", label: "Coût d'achat HT", type: "number", min: 0, step: 1, suffix: "€" },
    { key: "tauxMarge", label: "Taux de marge commerciale", type: "number", min: 0, max: 200, step: 1, suffix: "%" },
  ],
  defaultValues: { coutAchat: 50, tauxMarge: 40 },
  content: placeholderContent("Fixez un prix de vente cohérent avec votre marge cible sur coût d'achat."),
  faq: placeholderFaq,
  calculate(input) {
    const cout = num(input.coutAchat);
    const taux = num(input.tauxMarge) / 100;
    const marge = cout * taux;
    const pv = cout + marge;
    const coef = cout > 0 ? pv / cout : 0;
    return {
      summary: `Prix de vente HT : ${formatCurrency(pv)} (marge : ${formatCurrency(marge)}).`,
      lines: [
        { label: "Prix de vente HT", value: formatCurrency(pv), highlight: true },
        { label: "Marge commerciale", value: formatCurrency(marge), highlight: true },
        { label: "Coût d'achat", value: formatCurrency(cout) },
        { label: "Taux de marge", value: formatPercent(num(input.tauxMarge), 0) },
        { label: "Coefficient", value: `× ${formatNumber(coef, 2)}` },
      ],
    };
  },
};

export const coutHoraireChargeTns: SimulatorDefinition = {
  slug: "cout-horaire-charge-tns",
  title: "Coût horaire chargé TNS",
  shortDescription:
    "Estimez le taux horaire facturable pour couvrir charges TNS, frais et rémunération nette.",
  metaTitle: "Simulateur coût horaire chargé TNS — Tarif indépendant",
  metaDescription:
    "Calculez votre coût horaire réel en TNS : cotisations, frais et objectif net. Outil artisans et professions libérales.",
  keywords: ["coût horaire TNS", "tarif horaire indépendant", "taux horaire chargé", "calcul TJM horaire"],
  domain: "entreprise",
  category: "independant",
  icon: "tools",
  relatedSlugs: ["calculateur-tjm-freelance", "revenu-net-independant", "break-even-entreprise", "micro-entrepreneur-charges"],
  formFields: [
    { key: "netMensuel", label: "Rémunération nette mensuelle visée", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "heuresFacturables", label: "Heures facturables par mois", type: "number", min: 1, max: 200, step: 1, suffix: "h" },
    { key: "tauxCharges", label: "Charges sociales (% du brut)", type: "number", min: 30, max: 50, step: 1, suffix: "%" },
    { key: "fraisMensuel", label: "Frais pro mensuels", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { netMensuel: 3500, heuresFacturables: 120, tauxCharges: TNS_TAUX_CHARGES_DEFAUT, fraisMensuel: 400 },
  content: placeholderContent("Convertissez votre objectif de vie en tarif horaire minimum viable."),
  faq: placeholderFaq,
  calculate(input) {
    const net = num(input.netMensuel);
    const heures = num(input.heuresFacturables);
    const taux = num(input.tauxCharges) / 100;
    const frais = num(input.fraisMensuel);
    const brutNeeded = net / (1 - taux);
    const ca = brutNeeded + frais;
    const horaire = ca / heures;
    return {
      summary: `Coût horaire minimum : ${formatCurrency(horaire)}/h (${formatCurrency(ca)} de CA mensuel).`,
      lines: [
        { label: "Taux horaire chargé", value: formatCurrency(horaire), highlight: true },
        { label: "CA mensuel nécessaire", value: formatCurrency(ca), highlight: true },
        { label: "Net visé", value: formatCurrency(net) },
        { label: "Heures facturables", value: `${heures} h/mois` },
        { label: "Charges estimées", value: formatPercent(num(input.tauxCharges), 0) },
      ],
    };
  },
};

export const exonerationAcre: SimulatorDefinition = {
  slug: "exoneration-acre",
  title: "Exonération ACRE",
  shortDescription:
    "Estimez l'économie de charges sociales grâce à l'ACRE la première année d'activité.",
  metaTitle: "Simulateur exonération ACRE — Réduction charges créateur",
  metaDescription:
    "Calculez l'économie ACRE sur vos cotisations URSSAF la 1re année : 50 % de réduction (simplifié). Outil créateurs d'entreprise.",
  keywords: ["ACRE exonération", "simulateur ACRE", "aide créateur entreprise", "charges réduites"],
  domain: "entreprise",
  category: "independant",
  icon: "percent",
  relatedSlugs: ["revenu-net-independant", "micro-entrepreneur-charges", "calculateur-tjm-freelance"],
  formFields: [
    { key: "caAnnuel", label: "Chiffre d'affaires annuel prévisionnel", type: "number", min: 0, step: 1000, suffix: "€" },
    {
      key: "activite",
      label: "Activité",
      type: "select",
      options: [
        { value: "vente", label: "Vente (12,3 %)" },
        { value: "bic", label: "Prestations BIC (21,2 %)" },
        { value: "bnc", label: "Prestations BNC (24,6 %)" },
      ],
    },
    { key: "tauxAcre", label: "Réduction ACRE", type: "number", min: 0, max: 100, step: 5, suffix: "%", hint: "50 % en règle générale la 1re année" },
  ],
  defaultValues: { caAnnuel: 30000, activite: "bic", tauxAcre: ACRE_REDUCTION_ANNEE_1 },
  content: placeholderContent("Mesurez l'impact de l'ACRE sur vos cotisations la première année d'activité."),
  faq: placeholderFaq,
  calculate(input) {
    const ca = num(input.caAnnuel);
    const taux = getMicroEntrepreneurTaux(String(input.activite));
    const chargesNormales = ca * (taux / 100);
    const reduction = num(input.tauxAcre) / 100;
    const chargesAcre = chargesNormales * (1 - reduction);
    const economie = chargesNormales - chargesAcre;
    return {
      summary: `Économie ACRE estimée : ${formatCurrency(economie)}/an (charges : ${formatCurrency(chargesAcre)}).`,
      lines: [
        { label: "Économie annuelle", value: formatCurrency(economie), highlight: true },
        { label: "Charges avec ACRE", value: formatCurrency(chargesAcre), highlight: true },
        { label: "Charges sans ACRE", value: formatCurrency(chargesNormales) },
        { label: "Réduction appliquée", value: formatPercent(num(input.tauxAcre), 0) },
        { label: "CA annuel", value: formatCurrency(ca) },
      ],
    };
  },
};

export const facturationObjectifRevenuNet: SimulatorDefinition = {
  slug: "facturation-objectif-revenu-net",
  title: "Facturation objectif revenu net",
  shortDescription:
    "Calculez le CA mensuel à facturer pour atteindre un revenu net mensuel cible.",
  metaTitle: "Simulateur facturation objectif revenu net — CA mensuel",
  metaDescription:
    "Déterminez combien facturer chaque mois pour atteindre votre revenu net : charges, frais et impôts inclus.",
  keywords: ["objectif revenu net", "CA mensuel freelance", "combien facturer", "simulateur facturation"],
  domain: "entreprise",
  category: "independant",
  icon: "chart",
  relatedSlugs: ["calculateur-tjm-freelance", "revenu-net-independant", "break-even-entreprise", "cout-horaire-charge-tns"],
  formFields: [
    { key: "netMensuel", label: "Revenu net mensuel visé", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "tauxCharges", label: "Charges + impôts (% du CA)", type: "number", min: 20, max: 50, step: 1, suffix: "%" },
    { key: "fraisMensuel", label: "Frais professionnels mensuels", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { netMensuel: 3000, tauxCharges: FREELANCE_TAUX_CHARGES_DEFAUT, fraisMensuel: 250 },
  content: placeholderContent("Traduisez votre objectif de revenu en facturation mensuelle concrète."),
  faq: placeholderFaq,
  calculate(input) {
    const net = num(input.netMensuel);
    const taux = num(input.tauxCharges) / 100;
    const frais = num(input.fraisMensuel);
    const ca = (net + frais) / (1 - taux);
    const caAnnuel = ca * 12;
    return {
      summary: `CA mensuel à facturer : ${formatCurrency(ca)} HT (${formatCurrency(caAnnuel)}/an).`,
      lines: [
        { label: "CA mensuel HT", value: formatCurrency(ca), highlight: true },
        { label: "CA annuel HT", value: formatCurrency(caAnnuel), highlight: true },
        { label: "Revenu net visé", value: formatCurrency(net) },
        { label: "Frais mensuels", value: formatCurrency(frais) },
        { label: "Taux charges + impôts", value: formatPercent(num(input.tauxCharges), 0) },
      ],
    };
  },
};

export const entrepriseSimulators = [
  calculateurTjmFreelance,
  revenuNetIndependant,
  sasuRemunerationDividendes,
  portageSalarialVsFreelance,
  seuilFranchiseTva,
  breakEvenEntreprise,
  margeCommercialeTaux,
  coutHoraireChargeTns,
  exonerationAcre,
  facturationObjectifRevenuNet,
];
