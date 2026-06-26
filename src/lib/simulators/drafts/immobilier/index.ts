import type { SimulatorDefinition } from "../../types";
import { draftSimulator, num } from "../_shared/helpers";
import { buildContent, buildFaq, hl, p } from "../../_shared/content-builder";
import {
  formatCurrency,
  formatPercent,
} from "@/lib/utils/format";
import {
  HCSF_TAUX_ENDETTEMENT_MAX,
  getFraisNotaireTaux,
} from "@/data/regulations/immobilier";
import { PLUS_VALUE_IMMO_TAUX_SIMPLIFIE } from "@/data/regulations/fiscalite";

const loyerMaxHcsf = draftSimulator({
  slug: "simulateur-loyer-max-hcsf",
  title: "Loyer maximum HCSF",
  shortDescription:
    "Estimez le loyer mensuel maximum compatible avec le plafond d'endettement HCSF de 35 %.",
  metaTitle: "Simulateur loyer maximum HCSF — Règle 35 %",
  metaDescription:
    "Calculez le loyer ou la mensualité maximale selon vos revenus et le taux d'endettement HCSF (35 %).",
  keywords: ["loyer maximum", "HCSF", "taux endettement 35", "capacité locative"],
  domain: "immobilier",
  category: "financement",
  icon: "scale",
  regulationIds: ["immobilier"],
  relatedSlugs: ["capacite-emprunt", "taux-endettement", "mensualite-pret-immobilier"],
  formFields: [
    { key: "revenusMensuels", label: "Revenus mensuels nets", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "chargesMensuelles", label: "Charges de crédits en cours", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxEndettement", label: "Taux d'endettement max", type: "number", min: 0, max: 35, step: 1, suffix: "%", hint: `Plafond HCSF : ${HCSF_TAUX_ENDETTEMENT_MAX} %` },
  ],
  defaultValues: { revenusMensuels: 3500, chargesMensuelles: 200, tauxEndettement: HCSF_TAUX_ENDETTEMENT_MAX },
  content: buildContent({
    intro: "Le HCSF encadre l'endettement des emprunteurs à 35 % des revenus, charges de crédit incluses.",
    howItWorks: [
      {
        title: "Mensualité ou loyer maximum",
        blocks: [
          p("Mensualité max = (Revenus − charges existantes) × taux d'endettement / 100."),
          hl("HCSF", `Le plafond réglementaire est de ${HCSF_TAUX_ENDETTEMENT_MAX} % depuis 2022.`),
        ],
      },
    ],
    example: { title: "3 500 € de revenus, 200 € de charges", blocks: [p("Mensualité max ≈ 1 155 €/mois à 35 %.")] },
    conseils: ["Incluez assurance emprunteur dans la mensualité.", "Les revenus pris en compte varient selon la banque.", "Un apport peut améliorer l'acceptation du dossier."],
    limites: ["Estimation indicative — chaque banque applique sa propre politique.", "Ne remplace pas un accord de financement."],
  }),
  faq: buildFaq([
    { question: "Quel est le plafond HCSF ?", answer: `Le taux d'endettement maximal est de ${HCSF_TAUX_ENDETTEMENT_MAX} % des revenus, hors assurance selon les cas.` },
    { question: "Le loyer est-il pris en compte ?", answer: "Pour un locataire, le loyer actuel entre dans les charges ; pour un propriétaire, c'est la mensualité de prêt." },
    { question: "Peut-on dépasser 35 % ?", answer: "Des dérogations limitées existent pour les opérations vertes ou certains profils, sous conditions strictes." },
    { question: "Revenus pris en compte ?", answer: "Salaires nets, pensions, revenus locatifs pondérés — selon la durée et la stabilité." },
  ]),
  calculate(input: Record<string, number | string>) {
    const revenus = num(input.revenusMensuels);
    const charges = num(input.chargesMensuelles);
    const taux = num(input.tauxEndettement);
    const disponible = Math.max(0, revenus - charges);
    const mensualiteMax = disponible * (taux / 100);
    const tauxReel = revenus > 0 ? ((charges + mensualiteMax) / revenus) * 100 : 0;
    return {
      summary: `Mensualité ou loyer max : ${formatCurrency(mensualiteMax)}/mois (${formatPercent(tauxReel, 1)} d'endettement).`,
      lines: [
        { label: "Mensualité / loyer maximum", value: formatCurrency(mensualiteMax), highlight: true },
        { label: "Revenus disponibles", value: formatCurrency(disponible) },
        { label: "Charges existantes", value: formatCurrency(charges) },
        { label: "Taux d'endettement retenu", value: formatPercent(taux, 0) },
        { label: "Endettement total simulé", value: formatPercent(tauxReel, 1) },
      ],
    };
  },
});

const apportPersonnelMinimum = draftSimulator({
  slug: "simulateur-apport-personnel-minimum",
  title: "Apport personnel minimum",
  shortDescription:
    "Estimez l'apport minimum conseillé pour un achat immobilier selon le prix du bien et les frais de notaire.",
  metaTitle: "Simulateur apport personnel minimum — Achat immobilier",
  metaDescription:
    "Calculez l'apport personnel minimum recommandé : prix du bien, frais de notaire et part d'apport visée.",
  keywords: ["apport personnel", "minimum apport immobilier", "frais notaire apport"],
  domain: "immobilier",
  category: "financement",
  icon: "wallet",
  regulationIds: ["immobilier"],
  relatedSlugs: ["capacite-emprunt", "frais-de-notaire", "mensualite-pret-immobilier"],
  formFields: [
    { key: "prixBien", label: "Prix du bien", type: "number", min: 0, step: 5000, suffix: "€" },
    {
      key: "typeBien",
      label: "Type de bien",
      type: "select",
      options: [
        { value: "ancien", label: "Ancien" },
        { value: "neuf", label: "Neuf (VEFA)" },
      ],
    },
    { key: "tauxApportCible", label: "Apport cible sur le projet", type: "number", min: 0, max: 100, step: 5, suffix: "%", hint: "10 à 20 % couramment exigés" },
  ],
  defaultValues: { prixBien: 250000, typeBien: "ancien", tauxApportCible: 10 },
  content: buildContent({
    intro: "L'apport couvre les frais de notaire et rassure la banque sur votre capacité d'épargne.",
    howItWorks: [
      {
        title: "Calcul de l'apport minimum",
        blocks: [
          p("Coût total ≈ prix + frais de notaire. Apport minimum = coût total × taux d'apport cible."),
          hl("Frais de notaire", `Ancien ~${getFraisNotaireTaux("ancien")} %, neuf ~${getFraisNotaireTaux("neuf")} %.`),
        ],
      },
    ],
    example: { title: "Bien à 250 000 € en ancien, apport 10 %", blocks: [p("Apport minimum estimé : environ 27 000 €.")] },
    conseils: ["Prévoyez aussi les frais de garantie et de dossier.", "Un apport plus élevé améliore le taux proposé.", "PTZ possible sans apport pour certains primo-accédants."],
    limites: ["Seuils bancaires variables selon profil et zone.", "N'inclut pas les frais d'agence éventuels."],
  }),
  faq: buildFaq([
    { question: "Quel apport minimum pour acheter ?", answer: "Souvent 10 % du projet total (bien + frais), parfois plus selon la banque." },
    { question: "L'apport couvre-t-il les frais de notaire ?", answer: "Idéalement oui — emprunter les frais de notaire augmente le taux d'endettement." },
    { question: "Peut-on acheter sans apport ?", answer: "Rarement, sauf dispositifs d'aide (PTZ, prêts action logement) pour primo-accédants." },
    { question: "Don familial et apport ?", answer: "Un don peut constituer l'apport, avec justificatifs et déclaration si seuils dépassés." },
  ]),
  calculate(input: Record<string, number | string>) {
    const prix = num(input.prixBien);
    const typeBien = String(input.typeBien);
    const tauxNotaire = getFraisNotaireTaux(typeBien) / 100;
    const fraisNotaire = prix * tauxNotaire;
    const coutTotal = prix + fraisNotaire;
    const tauxApport = num(input.tauxApportCible) / 100;
    const apportMin = coutTotal * tauxApport;
    const creditEstime = coutTotal - apportMin;
    return {
      summary: `Apport minimum estimé : ${formatCurrency(apportMin)} (${num(input.tauxApportCible)} % du projet).`,
      lines: [
        { label: "Apport minimum", value: formatCurrency(apportMin), highlight: true },
        { label: "Coût total du projet", value: formatCurrency(coutTotal) },
        { label: "Frais de notaire estimés", value: formatCurrency(fraisNotaire) },
        { label: "Montant à emprunter", value: formatCurrency(creditEstime) },
        { label: "Prix du bien", value: formatCurrency(prix) },
      ],
    };
  },
});

const creditInFine = draftSimulator({
  slug: "simulateur-credit-in-fine",
  title: "Crédit in fine",
  shortDescription:
    "Estimez les intérêts mensuels et le remboursement du capital en fin de prêt pour un crédit in fine.",
  metaTitle: "Simulateur crédit in fine — Intérêts et capital",
  metaDescription:
    "Calculez les mensualités d'intérêts et le capital remboursé en une fois à l'échéance d'un prêt in fine.",
  keywords: ["crédit in fine", "prêt in fine", "intérêts seuls"],
  domain: "immobilier",
  category: "financement",
  icon: "percent",
  regulationIds: ["immobilier"],
  relatedSlugs: ["mensualite-pret-immobilier", "rendement-locatif", "simulateur-investissement-locatif-neuf"],
  formFields: [
    { key: "capital", label: "Capital emprunté", type: "number", min: 0, step: 10000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt annuel", type: "number", min: 0, step: 0.05, suffix: "%" },
    { key: "duree", label: "Durée", type: "number", min: 1, max: 25, suffix: "ans" },
  ],
  defaultValues: { capital: 300000, taux: 3.5, duree: 15 },
  content: buildContent({
    intro: "Le crédit in fine ne rembourse le capital qu'à l'échéance : seuls les intérêts sont payés chaque mois.",
    howItWorks: [
      {
        title: "Fonctionnement",
        blocks: [
          p("Mensualité = Capital × taux annuel / 12. Le capital est remboursé in fine (placement, vente, autre crédit…)."),
          hl("Usage", "Fréquent en investissement locatif avec placement parallèle ou revente programmée."),
        ],
      },
    ],
    example: { title: "300 000 € à 3,5 % sur 15 ans", blocks: [p("Intérêts mensuels : 875 € — capital dû à terme : 300 000 €.")] },
    conseils: ["Prévoyez la sortie (vente, refinancement).", "Comparez le coût total avec un crédit amortissable.", "Vérifiez les conditions de garantie exigées."],
    limites: ["Ne modélise pas le rendement du placement de garantie.", "Acceptation bancaire soumise à un dossier solide."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'un crédit in fine ?", answer: "Prêt où seuls les intérêts sont remboursés périodiquement ; le capital est dû à l'échéance." },
    { question: "Pour qui ?", answer: "Investisseurs, résidences secondaires, profils avec capacité de remboursement différé." },
    { question: "Risque principal ?", answer: "Rembourser le capital à terme : vente, refinancement ou épargne mobilisée." },
    { question: "Différence avec l'amortissable ?", answer: "L'amortissable rembourse capital + intérêts ; l'in fine a des mensualités plus faibles mais un capital intact." },
  ]),
  calculate(input: Record<string, number | string>) {
    const capital = num(input.capital);
    const taux = num(input.taux) / 100;
    const duree = num(input.duree);
    const interetsMensuels = (capital * taux) / 12;
    const interetsTotaux = interetsMensuels * duree * 12;
    return {
      summary: `Intérêts mensuels : ${formatCurrency(interetsMensuels)} — capital dû à terme : ${formatCurrency(capital)}.`,
      lines: [
        { label: "Intérêts mensuels", value: formatCurrency(interetsMensuels), highlight: true },
        { label: "Capital remboursé in fine", value: formatCurrency(capital), highlight: true },
        { label: "Intérêts totaux sur la durée", value: formatCurrency(interetsTotaux) },
        { label: "Durée", value: `${duree} ans` },
        { label: "Taux annuel", value: formatPercent(num(input.taux), 2) },
      ],
    };
  },
});

const investissementLocatifNeuf = draftSimulator({
  slug: "simulateur-investissement-locatif-neuf",
  title: "Investissement locatif neuf",
  shortDescription:
    "Estimez le rendement brut et le cash-flow d'un investissement locatif en VEFA ou neuf.",
  metaTitle: "Simulateur investissement locatif neuf",
  metaDescription:
    "Simulez la rentabilité d'un achat locatif neuf : prix, loyer, charges et rendement brut estimé.",
  keywords: ["investissement locatif neuf", "VEFA rendement", "rentabilité neuf"],
  domain: "immobilier",
  category: "investissement",
  icon: "building",
  regulationIds: ["immobilier", "fiscalite"],
  relatedSlugs: ["rendement-locatif", "rendement-locatif-brut", "simulateur-denormandie"],
  formFields: [
    { key: "prix", label: "Prix TTC du bien", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "loyer", label: "Loyer mensuel estimé", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "charges", label: "Charges mensuelles (copro, taxe…)", type: "number", min: 0, step: 20, suffix: "€" },
    { key: "mensualite", label: "Mensualité crédit", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { prix: 220000, loyer: 900, charges: 120, mensualite: 850 },
  content: buildContent({
    intro: "Le neuf offre des frais de notaire réduits et parfois une garantie locative, mais le prix au m² est souvent plus élevé.",
    howItWorks: [
      {
        title: "Rendement et cash-flow",
        blocks: [
          p("Rendement brut = (loyer × 12) / prix. Cash-flow = loyer − charges − mensualité."),
          hl("Neuf", `Frais de notaire réduits (~${getFraisNotaireTaux("neuf")} %).`),
        ],
      },
    ],
    example: { title: "220 000 € loué 900 €/mois", blocks: [p("Rendement brut ≈ 4,9 % — cash-flow selon financement.")] },
    conseils: ["Vérifiez la demande locative sur la zone.", "Intégrez la vacance locative (1 mois/an en moyenne).", "Comparez avec l'ancien rénové."],
    limites: ["Loyer de marché estimé — visite et comparables recommandés.", "Fiscalité (LMNP, nu…) non détaillée ici."],
  }),
  faq: buildFaq([
    { question: "Neuf ou ancien pour investir ?", answer: "Le neuf limite les travaux ; l'ancien peut offrir un meilleur rendement brut en province." },
    { question: "TVA et neuf ?", answer: "La TVA s'applique sur le neuf ; certains dispositifs (Denormandie, Pinel…) modulent la fiscalité." },
    { question: "Garantie loyer impayé ?", answer: "Souvent proposée en VEFA — vérifiez la durée et les conditions." },
    { question: "Frais de notaire neuf ?", answer: `Environ ${getFraisNotaireTaux("neuf")} % contre ~${getFraisNotaireTaux("ancien")} % dans l'ancien.` },
  ]),
  calculate(input: Record<string, number | string>) {
    const prix = num(input.prix);
    const loyer = num(input.loyer);
    const charges = num(input.charges);
    const mensualite = num(input.mensualite);
    const loyerAnnuel = loyer * 12;
    const rendementBrut = prix > 0 ? (loyerAnnuel / prix) * 100 : 0;
    const cashFlow = loyer - charges - mensualite;
    return {
      summary: `Rendement brut : ${formatPercent(rendementBrut, 2)} — cash-flow : ${formatCurrency(cashFlow)}/mois.`,
      lines: [
        { label: "Rendement brut", value: formatPercent(rendementBrut, 2), highlight: true },
        { label: "Cash-flow mensuel", value: formatCurrency(cashFlow), highlight: true },
        { label: "Loyer mensuel", value: formatCurrency(loyer) },
        { label: "Charges mensuelles", value: formatCurrency(charges) },
        { label: "Investissement total", value: formatCurrency(prix) },
      ],
    };
  },
});

const scpiRendementNet = draftSimulator({
  slug: "simulateur-scpi-rendement-net",
  title: "SCPI — rendement net",
  shortDescription:
    "Estimez le rendement net d'une SCPI après frais de souscription et fiscalité simplifiée.",
  metaTitle: "Simulateur SCPI rendement net",
  metaDescription:
    "Calculez le rendement net d'un investissement SCPI : versement, taux de distribution, frais et fiscalité.",
  keywords: ["SCPI rendement net", "simulation SCPI", "pierre papier"],
  domain: "immobilier",
  category: "investissement",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["rendement-locatif", "interets-composes", "simulateur-investissement-locatif-neuf"],
  formFields: [
    { key: "montant", label: "Montant investi", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "fraisSouscription", label: "Frais de souscription", type: "number", min: 0, max: 15, step: 0.5, suffix: "%" },
    { key: "tauxDistribution", label: "Taux de distribution annuel", type: "number", min: 0, max: 10, step: 0.1, suffix: "%" },
    { key: "tauxImposition", label: "Taux d'imposition sur revenus", type: "number", min: 0, max: 50, step: 1, suffix: "%" },
  ],
  defaultValues: { montant: 10000, fraisSouscription: 10, tauxDistribution: 4.5, tauxImposition: 30 },
  content: buildContent({
    intro: "Les SCPI distribuent des revenus fonciers soumis à l'impôt ; les frais de souscription réduisent le capital productif.",
    howItWorks: [
      {
        title: "Rendement net",
        blocks: [
          p("Capital net = montant × (1 − frais). Revenus bruts = capital net × taux de distribution. Net après impôt = revenus × (1 − taux imposition)."),
          hl("Liquidité", "Les SCPI sont peu liquides — détention recommandée 8 à 10 ans minimum."),
        ],
      },
    ],
    example: { title: "10 000 €, 4,5 % brut, 30 % d'impôt", blocks: [p("Revenu net annuel estimé : environ 283 €.")] },
    conseils: ["Diversifiez entre plusieurs SCPI.", "Lisez le DICI (document d'information).", "Anticipez la fiscalité des plus-values à la revente."],
    limites: ["Taux de distribution non garanti.", "Fiscalité réelle selon TMI, PS et abattements."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'une SCPI ?", answer: "Société civile de placement immobilier mutualisant l'achat de locaux professionnels ou résidentiels." },
    { question: "Rendement moyen ?", answer: "Historiquement 4 à 5 % brut selon les SCPI — variable." },
    { question: "Fiscalité des revenus SCPI ?", answer: "Imposés au barème IR + prélèvements sociaux, sauf détention via assurance-vie." },
    { question: "Frais de souscription ?", answer: "Souvent 8 à 12 % — impactent directement le rendement net." },
  ]),
  calculate(input: Record<string, number | string>) {
    const montant = num(input.montant);
    const frais = num(input.fraisSouscription) / 100;
    const tauxDist = num(input.tauxDistribution) / 100;
    const tauxImp = num(input.tauxImposition) / 100;
    const capitalNet = montant * (1 - frais);
    const revenuBrut = capitalNet * tauxDist;
    const revenuNet = revenuBrut * (1 - tauxImp);
    const rendementNet = montant > 0 ? (revenuNet / montant) * 100 : 0;
    return {
      summary: `Rendement net : ${formatPercent(rendementNet, 2)} — revenu net : ${formatCurrency(revenuNet)}/an.`,
      lines: [
        { label: "Rendement net", value: formatPercent(rendementNet, 2), highlight: true },
        { label: "Revenu net annuel", value: formatCurrency(revenuNet), highlight: true },
        { label: "Revenu brut annuel", value: formatCurrency(revenuBrut) },
        { label: "Capital net investi", value: formatCurrency(capitalNet) },
        { label: "Frais de souscription", value: formatCurrency(montant * frais) },
      ],
    };
  },
});

function dispositifDefiscalisationDraft(
  slug: string,
  title: string,
  tauxReduction: number,
  dureeMax: number
): SimulatorDefinition {
  return draftSimulator({
    slug,
    title,
    shortDescription: `Estimez la réduction d'impôt ${title} sur vos travaux ou investissement éligible.`,
    metaTitle: `Simulateur ${title} — Réduction d'impôt`,
    metaDescription: `Calculez la réduction d'impôt estimée avec le dispositif ${title} : montant des travaux et plafonds.`,
    keywords: [title.toLowerCase(), "réduction impôt immobilier", " défiscalisation"],
    domain: "immobilier",
    category: "fiscalite",
    icon: "percent",
    regulationIds: ["fiscalite", "immobilier"],
    relatedSlugs: ["plus-value-immobiliere", "rendement-locatif", "simulateur-investissement-locatif-neuf"],
    formFields: [
      { key: "montantTravaux", label: "Montant des travaux éligibles", type: "number", min: 0, step: 5000, suffix: "€" },
      { key: "impotAnnuel", label: "Impôt sur le revenu annuel", type: "number", min: 0, step: 500, suffix: "€" },
      { key: "duree", label: "Durée de réduction", type: "number", min: 1, max: dureeMax, suffix: "ans" },
    ],
    defaultValues: { montantTravaux: 200000, impotAnnuel: 8000, duree: Math.min(9, dureeMax) },
    content: buildContent({
      intro: `${title} permet une réduction d'impôt liée à des travaux ou acquisitions sous conditions strictes de localisation et d'engagement.`,
      howItWorks: [
        {
          title: "Réduction estimée",
          blocks: [
            p(`Réduction annuelle ≈ min(impôt dû, montant travaux × ${formatPercent(tauxReduction * 100, 0)} / durée).`),
            hl("Engagement", "Location ou conservation du bien requise sur la durée légale."),
          ],
        },
      ],
      conseils: ["Faites valider l'éligibilité par un expert-comptable.", "Conservez les devis et factures certifiés.", "Croisez avec la rentabilité locative nette."],
      limites: ["Plafonds et zonages non détaillés.", "Simulation pédagogique — dossier administratif requis."],
    }),
    faq: buildFaq([
      { question: `Qui peut bénéficier de ${title} ?`, answer: "Investisseurs réalisant des travaux éligibles dans des zones ou bâtiments qualifiés." },
      { question: "Réduction ou crédit d'impôt ?", answer: "Réduction d'impôt sur le revenu, plafonnée par l'impôt dû." },
      { question: "Location obligatoire ?", answer: "Oui, en principe avec loyer plafonné et durée minimale selon le dispositif." },
      { question: "Cumul avec LMNP ?", answer: "Règles spécifiques — vérifiez la compatibilité fiscale." },
    ]),
    calculate(input: Record<string, number | string>) {
      const travaux = num(input.montantTravaux);
      const impot = num(input.impotAnnuel);
      const duree = num(input.duree);
      const reductionTotale = travaux * tauxReduction;
      const reductionAnnuelle = Math.min(impot, reductionTotale / duree);
      const reductionSurDuree = reductionAnnuelle * duree;
      return {
        summary: `Réduction annuelle estimée : ${formatCurrency(reductionAnnuelle)} (${formatCurrency(reductionSurDuree)} sur ${duree} ans).`,
        lines: [
          { label: "Réduction annuelle", value: formatCurrency(reductionAnnuelle), highlight: true },
          { label: "Réduction totale sur la durée", value: formatCurrency(reductionSurDuree), highlight: true },
          { label: "Réduction théorique max", value: formatCurrency(reductionTotale) },
          { label: "Montant travaux", value: formatCurrency(travaux) },
          { label: "Impôt annuel déclaré", value: formatCurrency(impot) },
        ],
      };
    },
  });
}

const baremePlusValue = draftSimulator({
  slug: "simulateur-bareme-plus-value-immobiliere",
  title: "Barème plus-value immobilière",
  shortDescription:
    "Estimez la plus-value imposable et l'impôt selon la durée de détention et le barème simplifié.",
  metaTitle: "Simulateur barème plus-value immobilière",
  metaDescription:
    "Calculez la plus-value immobilière imposable et l'impôt estimé selon la durée de détention du bien.",
  keywords: ["barème plus-value", "impôt plus-value immobilière", "abattement durée détention"],
  domain: "immobilier",
  category: "fiscalite",
  icon: "chart",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["plus-value-immobiliere", "rendement-locatif", "frais-de-notaire"],
  formFields: [
    { key: "prixAchat", label: "Prix d'achat", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "frais", label: "Frais et travaux", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "prixVente", label: "Prix de vente", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "annees", label: "Durée de détention", type: "number", min: 0, max: 40, suffix: "ans" },
  ],
  defaultValues: { prixAchat: 180000, frais: 20000, prixVente: 260000, annees: 15 },
  content: buildContent({
    intro: "La plus-value immobilière est taxée à l'IR et aux prélèvements sociaux, avec abattements progressifs selon la durée de détention.",
    howItWorks: [
      {
        title: "Barème simplifié",
        blocks: [
          p("Plus-value = vente − (achat + frais). Abattement croissant après 6 ans, exonération totale IR après 22 ans (PS après 30 ans en détail)."),
          hl("Taux global simplifié", `Estimation impôt ≈ plus-value imposable × ${formatPercent(PLUS_VALUE_IMMO_TAUX_SIMPLIFIE * 100, 1)}.`),
        ],
      },
    ],
    example: { title: "Détention 15 ans", blocks: [p("Abattement partiel — impôt réduit par rapport à une détention courte.")] },
    conseils: ["Conservez factures de travaux.", "Résidence principale exonérée sous conditions.", "Consultez un notaire pour le calcul définitif."],
    limites: ["Abattements détaillés IR/PS non séparés.", "Surtaxe plus-values élevées non incluse."],
  }),
  faq: buildFaq([
    { question: "Quand suis-je exonéré ?", answer: "Résidence principale, ou après 22 ans pour l'IR (30 ans pour les PS)." },
    { question: "Quels abattements ?", answer: "Progressifs à partir de 6 ans de détention, selon barèmes IR et PS distincts." },
    { question: "Plus-value et SCI ?", answer: "Régime différent — taxation au niveau des associés ou IS selon structure." },
    { question: "Forfait travaux 15 % ?", answer: "Si détention > 5 ans sans justificatifs, forfait possible sur le prix d'achat." },
  ]),
  calculate(input: Record<string, number | string>) {
    const achat = num(input.prixAchat) + num(input.frais);
    const vente = num(input.prixVente);
    const annees = num(input.annees);
    const plusValue = Math.max(0, vente - achat);
    const abattement = annees >= 22 ? 1 : annees >= 6 ? 0.4 + (annees - 6) * 0.04 : 0;
    const plusValueImposable = plusValue * (1 - Math.min(abattement, 1));
    const impot = plusValueImposable * PLUS_VALUE_IMMO_TAUX_SIMPLIFIE;
    return {
      summary: `Plus-value : ${formatCurrency(plusValue)} — impôt estimé : ${formatCurrency(impot)}.`,
      lines: [
        { label: "Plus-value brute", value: formatCurrency(plusValue), highlight: true },
        { label: "Impôt estimé", value: formatCurrency(impot), highlight: true },
        { label: "Plus-value imposable", value: formatCurrency(plusValueImposable) },
        { label: "Abattement estimé", value: formatPercent(Math.min(abattement, 1) * 100, 0) },
        { label: "Durée de détention", value: `${annees} ans` },
      ],
    };
  },
});

const taxeHabitationLocataire = draftSimulator({
  slug: "simulateur-taxe-habitation-locataire",
  title: "Taxe d'habitation locataire",
  shortDescription:
    "Estimez si une taxe d'habitation sur les résidences secondaires ou meublés touche votre logement.",
  metaTitle: "Simulateur taxe d'habitation — Locataire et résidences",
  metaDescription:
    "Comprenez qui paie la taxe d'habitation : locataire, résidence secondaire, exonérations et surtaxes locales.",
  keywords: ["taxe habitation locataire", "taxe résidence secondaire", "exonération taxe habitation"],
  domain: "immobilier",
  category: "impots",
  icon: "home",
  regulationIds: ["fiscalite"],
  relatedSlugs: ["simulateur-rentabilite-residence-secondaire", "rendement-locatif", "simulateur-frais-copropriete-budget"],
  formFields: [
    { key: "valeurLocative", label: "Valeur locative cadastrale", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "tauxCommune", label: "Taux communal", type: "number", min: 0, max: 50, step: 0.5, suffix: "%" },
    {
      key: "typeLogement",
      label: "Type de logement",
      type: "select",
      options: [
        { value: "principale", label: "Résidence principale" },
        { value: "secondaire", label: "Résidence secondaire" },
        { value: "meuble", label: "Meublé locatif" },
      ],
    },
  ],
  defaultValues: { valeurLocative: 8000, tauxCommune: 20, typeLogement: "secondaire" },
  content: buildContent({
    intro: "La taxe d'habitation sur les résidences principales a été supprimée ; elle subsiste pour certaines résidences secondaires et meublés.",
    howItWorks: [
      {
        title: "Calcul simplifié",
        blocks: [
          p("Taxe ≈ valeur locative cadastrale × taux communal × abattements. Résidence principale : exonérée."),
          hl("Surtaxes", "Certaines communes appliquent une surtaxe sur les résidences secondaires."),
        ],
      },
    ],
    conseils: ["Vérifiez l'avis sur impots.gouv.fr.", "Locataire : taxe d'habitation supprimée sur RP.", "Résidence secondaire : budget annuel à prévoir."],
    limites: ["Taux réels multi-collectivités non modélisés.", "Exonérations personnelles non détaillées."],
  }),
  faq: buildFaq([
    { question: "Le locataire paie-t-il la taxe d'habitation ?", answer: "Non pour la résidence principale depuis 2023 ; cas particuliers pour meublés." },
    { question: "Résidence secondaire ?", answer: "Taxe d'habitation due, parfois majorée selon la commune." },
    { question: "Taxe foncière ?", answer: "Distincte — due par le propriétaire, même si le bien est loué." },
    { question: "Exonérations possibles ?", answer: "Selon revenus, situation (veuvage, handicap) — voir impots.gouv.fr." },
  ]),
  calculate(input: Record<string, number | string>) {
    const vlc = num(input.valeurLocative);
    const taux = num(input.tauxCommune) / 100;
    const type = String(input.typeLogement);
    const exonere = type === "principale";
    const surtaxe = type === "secondaire" ? 1.2 : 1;
    const taxe = exonere ? 0 : vlc * taux * surtaxe * 0.5;
    return {
      summary: exonere
        ? "Résidence principale : pas de taxe d'habitation."
        : `Taxe d'habitation estimée : ${formatCurrency(taxe)}/an.`,
      lines: [
        { label: "Taxe estimée", value: exonere ? "Exonéré" : formatCurrency(taxe), highlight: true },
        { label: "Type de logement", value: type },
        { label: "Valeur locative cadastrale", value: formatCurrency(vlc) },
        { label: "Taux communal retenu", value: formatPercent(num(input.tauxCommune), 1) },
        { label: "Coefficient surtaxe", value: surtaxe === 1 ? "×1" : "×1,2 (secondaire)" },
      ],
    };
  },
});

const bailCommercial369 = draftSimulator({
  slug: "simulateur-bail-commercial-3-6-9",
  title: "Bail commercial 3-6-9",
  shortDescription:
    "Estimez les loyers et charges d'un bail commercial 3-6-9 sur la durée des trois périodes triennales.",
  metaTitle: "Simulateur bail commercial 3-6-9",
  metaDescription:
    "Simulez le coût locatif d'un bail commercial 3-6-9 : loyer initial, révisions triennales et durée totale.",
  keywords: ["bail commercial 3-6-9", "loyer commercial", "bail professionnel"],
  domain: "immobilier",
  category: "gestion",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["loyer-charges-comprises", "simulateur-honoraires-gestion-locative", "rendement-locatif"],
  formFields: [
    { key: "loyerInitial", label: "Loyer mensuel initial HT", type: "number", min: 0, step: 100, suffix: "€" },
    { key: "revisionTriennale", label: "Révision triennale", type: "number", min: 0, max: 10, step: 0.5, suffix: "%" },
    { key: "charges", label: "Charges mensuelles", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { loyerInitial: 2500, revisionTriennale: 2, charges: 400 },
  content: buildContent({
    intro: "Le bail 3-6-9 est la forme classique des baux commerciaux : trois périodes de trois ans avec reconduction tacite.",
    howItWorks: [
      {
        title: "Trois périodes triennales",
        blocks: [
          p("Loyer révisé tous les 3 ans selon l'indice des loyers commerciaux (ILC/ILAT) ou clause contractuelle."),
          hl("Durée", "9 ans minimum — le locataire peut résilier à chaque échéance triennale."),
        ],
      },
    ],
    conseils: ["Négociez le loyer initial et les travaux.", "Anticipez les révisions triennales.", "Faites rédiger le bail par un avocat ou notaire."],
    limites: ["Indice ILC/ILAT simplifié en taux fixe.", "Pas de simulation de droit au bail."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'un bail 3-6-9 ?", answer: "Bail commercial de 9 ans en trois périodes de 3 ans, reconductible tacitement." },
    { question: "Peut-on résilier ?", answer: "Le locataire oui à chaque triennal ; le bailleur sous conditions légales." },
    { question: "Révision du loyer ?", answer: "Selon indice (ILC, ILAT) ou clause — tous les 3 ans en principe." },
    { question: "Différence avec bail professionnel ?", answer: "Le bail professionnel (6 ans max) concerne certaines professions libérales." },
  ]),
  calculate(input: Record<string, number | string>) {
    const l0 = num(input.loyerInitial);
    const rev = num(input.revisionTriennale) / 100;
    const charges = num(input.charges);
    const l3 = l0 * Math.pow(1 + rev, 1);
    const l6 = l0 * Math.pow(1 + rev, 2);
    const l9 = l0 * Math.pow(1 + rev, 3);
    const cout9ans = (l0 * 36 + l3 * 36 + l6 * 36 + (charges + l9) * 36) / 3;
    const moyenneM = cout9ans / 108;
    return {
      summary: `Loyer année 9 : ${formatCurrency(l9)}/mois — coût moyen : ${formatCurrency(moyenneM + charges)}/mois charges incl.`,
      lines: [
        { label: "Loyer mois 1-36", value: formatCurrency(l0) },
        { label: "Loyer mois 37-72", value: formatCurrency(l3) },
        { label: "Loyer mois 73-108", value: formatCurrency(l6), highlight: true },
        { label: "Loyer mois 109-108 (an 9)", value: formatCurrency(l9), highlight: true },
        { label: "Charges mensuelles", value: formatCurrency(charges) },
      ],
    };
  },
});

const honorairesGestionLocative = draftSimulator({
  slug: "simulateur-honoraires-gestion-locative",
  title: "Honoraires gestion locative",
  shortDescription:
    "Estimez le coût annuel des honoraires d'une agence de gestion locative selon le loyer et le taux.",
  metaTitle: "Simulateur honoraires gestion locative",
  metaDescription:
    "Calculez les honoraires de gestion locative : loyer mensuel, taux de gestion et services inclus.",
  keywords: ["honoraires gestion locative", "frais agence locative", "gestion locative"],
  domain: "immobilier",
  category: "gestion",
  icon: "wallet",
  regulationIds: ["immobilier"],
  relatedSlugs: ["simulateur-vacance-locative", "rendement-locatif-net", "cash-flow-immobilier"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel HC", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "tauxGestion", label: "Honoraires de gestion", type: "number", min: 0, max: 15, step: 0.5, suffix: "% du loyer" },
    { key: "fraisMiseLoc", label: "Frais mise en location", type: "number", min: 0, step: 50, suffix: "€" },
  ],
  defaultValues: { loyer: 850, tauxGestion: 7, fraisMiseLoc: 850 },
  content: buildContent({
    intro: "La gestion locative facture un pourcentage du loyer plus des frais de mise en location à chaque relocation.",
    howItWorks: [
      {
        title: "Coût annuel",
        blocks: [
          p("Honoraires mensuels = loyer × taux. Coût annuel = honoraires × 12 + frais relocation amortis."),
          hl("Barème", "En moyenne 6 à 8 % du loyer HC pour la gestion courante."),
        ],
      },
    ],
    conseils: ["Comparez plusieurs agences.", "Vérifiez les prestations (EDL, relances, GLI).", "Négociez le taux sur portefeuille multi-biens."],
    limites: ["Honoraires réglementés à la location (locataire) distincts.", "GLI et assurance non incluses."],
  }),
  faq: buildFaq([
    { question: "Combien coûte la gestion locative ?", answer: "Environ 6 à 8 % du loyer hors charges, plus frais de relocation." },
    { question: "Que couvrent les honoraires ?", answer: "Quittances, encaissement, réparations courantes, déclarations basiques." },
    { question: "Frais locataire vs propriétaire ?", answer: "Le locataire paie la mise en location ; le propriétaire la gestion." },
    { question: "Gestion seule ou location ?", answer: "Forfaits distincts — la mise en location est facturée au changement de locataire." },
  ]),
  calculate(input: Record<string, number | string>) {
    const loyer = num(input.loyer);
    const taux = num(input.tauxGestion) / 100;
    const frais = num(input.fraisMiseLoc);
    const honorairesM = loyer * taux;
    const annuel = honorairesM * 12 + frais;
    const rendementImpact = loyer > 0 ? (annuel / (loyer * 12)) * 100 : 0;
    return {
      summary: `Coût gestion : ${formatCurrency(honorairesM)}/mois — ${formatCurrency(annuel)}/an (relocation incl.).`,
      lines: [
        { label: "Honoraires mensuels", value: formatCurrency(honorairesM), highlight: true },
        { label: "Coût annuel total", value: formatCurrency(annuel), highlight: true },
        { label: "Impact sur rendement", value: formatPercent(rendementImpact, 2) },
        { label: "Frais mise en location", value: formatCurrency(frais) },
        { label: "Loyer mensuel", value: formatCurrency(loyer) },
      ],
    };
  },
});

const vacanceLocative = draftSimulator({
  slug: "simulateur-vacance-locative",
  title: "Vacance locative",
  shortDescription:
    "Mesurez l'impact d'une période de vacance locative sur votre rendement et votre cash-flow.",
  metaTitle: "Simulateur vacance locative",
  metaDescription:
    "Calculez la perte de revenus due à la vacance locative : loyer, durée de vacance et charges fixes.",
  keywords: ["vacance locative", "perte loyer vacant", "rendement locatif vacance"],
  domain: "immobilier",
  category: "gestion",
  icon: "chart",
  regulationIds: ["immobilier"],
  relatedSlugs: ["rendement-locatif-net", "simulateur-honoraires-gestion-locative", "cash-flow-immobilier"],
  formFields: [
    { key: "loyer", label: "Loyer mensuel", type: "number", min: 0, step: 50, suffix: "€" },
    { key: "moisVacance", label: "Mois de vacance / an", type: "number", min: 0, max: 12, step: 0.5 },
    { key: "chargesFixes", label: "Charges fixes mensuelles", type: "number", min: 0, step: 20, suffix: "€" },
    { key: "investissement", label: "Investissement total", type: "number", min: 0, step: 5000, suffix: "€" },
  ],
  defaultValues: { loyer: 800, moisVacance: 1, chargesFixes: 150, investissement: 200000 },
  content: buildContent({
    intro: "La vacance locative réduit le rendement effectif : budgetez 3 à 5 % de vacance selon la zone.",
    howItWorks: [
      {
        title: "Impact sur le rendement",
        blocks: [
          p("Revenus effectifs = loyer × (12 − mois vacance) − charges × 12. Rendement = revenus / investissement."),
          hl("Repère", "1 mois de vacance ≈ −8 % de revenus locatifs annuels."),
        ],
      },
    ],
    conseils: ["Choisissez des zones à forte demande.", "Pricez le loyer au marché.", "Anticipez travaux entre deux locataires."],
    limites: ["Vacance variable selon saison et localisation.", "Frais de relocation non inclus."],
  }),
  faq: buildFaq([
    { question: "Quelle vacance prévoir ?", answer: "1 mois/an en moyenne nationale — plus en zone rurale ou saisonnière." },
    { question: "Charges pendant vacance ?", answer: "Taxe foncière, copro, crédit — à la charge du propriétaire." },
    { question: "Assurance vacance ?", answer: "GLI ou assurance loyer impayé ne couvre pas la vacance pure." },
    { question: "Réduire la vacance ?", answer: "Bon état du bien, loyer compétitif, agence réactive." },
  ]),
  calculate(input: Record<string, number | string>) {
    const loyer = num(input.loyer);
    const vacance = num(input.moisVacance);
    const charges = num(input.chargesFixes);
    const invest = num(input.investissement);
    const revenus = loyer * (12 - vacance);
    const chargesAnn = charges * 12;
    const net = revenus - chargesAnn;
    const rendement = invest > 0 ? (net / invest) * 100 : 0;
    const perte = loyer * vacance;
    return {
      summary: `Perte vacance : ${formatCurrency(perte)}/an — rendement net : ${formatPercent(rendement, 2)}.`,
      lines: [
        { label: "Rendement net ajusté", value: formatPercent(rendement, 2), highlight: true },
        { label: "Perte vacance annuelle", value: formatCurrency(perte), highlight: true },
        { label: "Revenus locatifs effectifs", value: formatCurrency(revenus) },
        { label: "Charges fixes annuelles", value: formatCurrency(chargesAnn) },
        { label: "Revenu net annuel", value: formatCurrency(net) },
      ],
    };
  },
});

const creditRelaisDuree = draftSimulator({
  slug: "simulateur-credit-relais-duree",
  title: "Crédit relais — durée",
  shortDescription:
    "Estimez le coût d'un crédit relais selon la durée, le montant avancé et le taux.",
  metaTitle: "Simulateur crédit relais — Durée et coût",
  metaDescription:
    "Simulez un crédit relais immobilier : montant, taux, durée entre achat et vente de l'ancien bien.",
  keywords: ["crédit relais", "prêt relais immobilier", "durée crédit relais"],
  domain: "immobilier",
  category: "financement",
  icon: "calculator",
  regulationIds: ["immobilier"],
  relatedSlugs: ["capacite-emprunt", "mensualite-pret-immobilier", "plus-value-immobiliere"],
  formFields: [
    { key: "montant", label: "Montant du relais", type: "number", min: 0, step: 10000, suffix: "€" },
    { key: "taux", label: "Taux d'intérêt annuel", type: "number", min: 0, step: 0.1, suffix: "%" },
    { key: "dureeMois", label: "Durée estimée", type: "number", min: 1, max: 24, suffix: "mois" },
    { key: "valeurBienVendu", label: "Prix de vente bien actuel", type: "number", min: 0, step: 5000, suffix: "€" },
  ],
  defaultValues: { montant: 150000, taux: 4.5, dureeMois: 12, valeurBienVendu: 280000 },
  content: buildContent({
    intro: "Le crédit relais finance l'achat d'un nouveau bien en attendant la vente de l'ancien, généralement sur 12 à 24 mois.",
    howItWorks: [
      {
        title: "Coût du relais",
        blocks: [
          p("Intérêts ≈ montant × taux × durée / 12. Le capital est soldé à la vente de l'ancien bien."),
          hl("Durée", "Prolongation possible si vente retardée — coût accru."),
        ],
      },
    ],
    conseils: ["Estimez réalistement le délai de vente.", "Prévoyez une marge sur le prix de vente.", "Comparez relais sec et relais adossé."],
    limites: ["Conditions d'octroi bancaires non modélisées.", "Frais de dossier non inclus."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce qu'un crédit relais ?", answer: "Prêt temporaire pour acheter avant d'avoir vendu son logement actuel." },
    { question: "Quelle durée ?", answer: "12 à 24 mois en général, prolongeable selon banque." },
    { question: "Relais sec ou adossé ?", answer: "Adossé : relais + crédit principal ; sec : intérêts seuls sur le relais." },
    { question: "Risque si vente lente ?", answer: "Coût des intérêts prolongé, renégociation ou extension nécessaire." },
  ]),
  calculate(input: Record<string, number | string>) {
    const montant = num(input.montant);
    const taux = num(input.taux) / 100;
    const mois = num(input.dureeMois);
    const vente = num(input.valeurBienVendu);
    const interets = montant * taux * (mois / 12);
    const mensualiteInterets = interets / mois;
    const ltv = vente > 0 ? (montant / vente) * 100 : 0;
    return {
      summary: `Coût relais ${mois} mois : ${formatCurrency(interets)} d'intérêts (${formatCurrency(mensualiteInterets)}/mois).`,
      lines: [
        { label: "Intérêts totaux", value: formatCurrency(interets), highlight: true },
        { label: "Intérêts mensuels moyens", value: formatCurrency(mensualiteInterets) },
        { label: "Montant du relais", value: formatCurrency(montant) },
        { label: "Durée", value: `${mois} mois` },
        { label: "Ratio relais / vente", value: formatPercent(ltv, 0) },
      ],
    };
  },
});

const assurancePpd = draftSimulator({
  slug: "simulateur-assurance-ppd",
  title: "Assurance prêt — quotité PPD",
  shortDescription:
    "Estimez le coût mensuel de l'assurance emprunteur selon la quotité PPD (Décès, PTIA, IPT).",
  metaTitle: "Simulateur assurance emprunteur PPD",
  metaDescription:
    "Calculez le coût de l'assurance de prêt immobilier : capital, taux PPD, quotité assurée et durée.",
  keywords: ["assurance emprunteur", "PPD prêt", "quotité assurance crédit"],
  domain: "immobilier",
  category: "financement",
  icon: "heart",
  regulationIds: ["immobilier"],
  relatedSlugs: ["mensualite-pret-immobilier", "capacite-emprunt", "cout-total-credit-immobilier"],
  formFields: [
    { key: "capital", label: "Capital emprunté", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "tauxAssurance", label: "Taux assurance annuel", type: "number", min: 0, step: 0.01, suffix: "%" },
    { key: "quotite", label: "Quotité assurée", type: "number", min: 0, max: 100, step: 5, suffix: "%" },
    { key: "duree", label: "Durée du prêt", type: "number", min: 1, max: 25, suffix: "ans" },
  ],
  defaultValues: { capital: 200000, tauxAssurance: 0.34, quotite: 100, duree: 20 },
  content: buildContent({
    intro: "L'assurance emprunteur (PPD : Pertes Pécuniaires Diverses) couvre décès, invalidité et incapacité selon le contrat.",
    howItWorks: [
      {
        title: "Coût annuel",
        blocks: [
          p("Prime annuelle ≈ capital × quotité × taux assurance. Répartie en mensualité sur la durée."),
          hl("Quotité", "100 % sur un emprunt seul ; 50 % chacun pour un couple en co-emprunt."),
        ],
      },
    ],
    conseils: ["Comparez délégation et contrat bancaire.", "Adaptez les garanties à votre métier.", "La Lemoine permet de changer d'assurance."],
    limites: ["Tarifs selon âge et santé non modélisés.", "Garanties IPT/ITT variables selon contrat."],
  }),
  faq: buildFaq([
    { question: "Qu'est-ce que le PPD ?", answer: "Garanties pertes pécuniaires : décès, PTIA, IPT selon le contrat groupe ou délégué." },
    { question: "Quotité 100 % ou 50 % ?", answer: "En co-emprunt, 50 % chacun suffit souvent pour couvrir la totalité du capital." },
    { question: "Peut-on changer d'assurance ?", answer: "Oui — loi Lemoine : résiliation à tout moment après la 1re année." },
    { question: "Assurance obligatoire ?", answer: "Exigée par la banque pour débloquer le prêt, mais pas forcément son contrat groupe." },
  ]),
  calculate(input: Record<string, number | string>) {
    const capital = num(input.capital);
    const taux = num(input.tauxAssurance) / 100;
    const quotite = num(input.quotite) / 100;
    const duree = num(input.duree);
    const primeAnnuelle = capital * taux * quotite;
    const primeMensuelle = primeAnnuelle / 12;
    const coutTotal = primeAnnuelle * duree;
    return {
      summary: `Assurance : ${formatCurrency(primeMensuelle)}/mois — ${formatCurrency(coutTotal)} sur ${duree} ans.`,
      lines: [
        { label: "Prime mensuelle", value: formatCurrency(primeMensuelle), highlight: true },
        { label: "Coût total assurance", value: formatCurrency(coutTotal), highlight: true },
        { label: "Prime annuelle", value: formatCurrency(primeAnnuelle) },
        { label: "Capital assuré", value: formatCurrency(capital * quotite) },
        { label: "Quotité", value: formatPercent(num(input.quotite), 0) },
      ],
    };
  },
});

const fraisCoproprieteBudget = draftSimulator({
  slug: "simulateur-frais-copropriete-budget",
  title: "Budget charges copropriété",
  shortDescription:
    "Estimez votre quote-part annuelle de charges de copropriété selon les tantièmes et le budget.",
  metaTitle: "Simulateur budget charges copropriété",
  metaDescription:
    "Calculez votre quote-part de charges de copropriété : budget annuel, tantièmes et surface du lot.",
  keywords: ["charges copropriété", "budget copro", "tantièmes copropriété"],
  domain: "immobilier",
  category: "gestion",
  icon: "building",
  regulationIds: ["immobilier"],
  relatedSlugs: ["simulateur-vacance-locative", "rendement-locatif-net", "charges-recuperables-locataire"],
  formFields: [
    { key: "budgetAnnuel", label: "Budget annuel copropriété", type: "number", min: 0, step: 1000, suffix: "€" },
    { key: "tantiemes", label: "Vos tantièmes", type: "number", min: 0, step: 1 },
    { key: "tantiemesTotal", label: "Total tantièmes immeuble", type: "number", min: 1, step: 10 },
    { key: "surface", label: "Surface du lot", type: "number", min: 0, step: 1, suffix: "m²" },
  ],
  defaultValues: { budgetAnnuel: 45000, tantiemes: 85, tantiemesTotal: 1000, surface: 55 },
  content: buildContent({
    intro: "Les charges de copropriété couvrent entretien, assurance immeuble, chauffage collectif et travaux votés.",
    howItWorks: [
      {
        title: "Quote-part",
        blocks: [
          p("Quote-part = budget annuel × (vos tantièmes / total tantièmes). Charges mensuelles = quote-part / 12."),
          hl("Travaux", "Les travaux exceptionnels viennent en plus du budget courant."),
        ],
      },
    ],
    conseils: ["Consultez les PV d'AG des 3 dernières années.", "Vérifiez le fonds travaux.", "Charges locataire vs propriétaire selon bail."],
    limites: ["Travaux votés non inclus.", "Provision vs charges réelles peut varier."],
  }),
  faq: buildFaq([
    { question: "Que sont les tantièmes ?", answer: "Quote-part de charges répartie selon la taille et l'emplacement du lot." },
    { question: "Charges récupérables ?", answer: "Certaines charges sont refacturables au locataire (entretien, eau froide…)." },
    { question: "Fonds travaux ?", answer: "Réserve obligatoire pour travaux futurs — ligne distincte du budget courant." },
    { question: "Copro défaillante ?", answer: "Vérifiez impayés et contentieux avant achat — diagnostic copro obligatoire." },
  ]),
  calculate(input: Record<string, number | string>) {
    const budget = num(input.budgetAnnuel);
    const t = num(input.tantiemes);
    const total = num(input.tantiemesTotal);
    const surface = num(input.surface);
    const quotePart = total > 0 ? budget * (t / total) : 0;
    const mensuel = quotePart / 12;
    const parM2 = surface > 0 ? quotePart / surface : 0;
    return {
      summary: `Quote-part : ${formatCurrency(quotePart)}/an (${formatCurrency(mensuel)}/mois).`,
      lines: [
        { label: "Quote-part annuelle", value: formatCurrency(quotePart), highlight: true },
        { label: "Charges mensuelles", value: formatCurrency(mensuel), highlight: true },
        { label: "Coût au m²", value: formatCurrency(parM2) },
        { label: "Vos tantièmes", value: `${t} / ${total}` },
        { label: "Budget immeuble", value: formatCurrency(budget) },
      ],
    };
  },
});

const rentabiliteResidenceSecondaire = draftSimulator({
  slug: "simulateur-rentabilite-residence-secondaire",
  title: "Rentabilité résidence secondaire",
  shortDescription:
    "Estimez le coût annuel et la rentabilité locative saisonnière d'une résidence secondaire.",
  metaTitle: "Simulateur rentabilité résidence secondaire",
  metaDescription:
    "Calculez la rentabilité d'une résidence secondaire en location saisonnière : revenus, charges et fiscalité simplifiée.",
  keywords: ["résidence secondaire rentabilité", "location saisonnière", "coût résidence secondaire"],
  domain: "immobilier",
  category: "investissement",
  icon: "home",
  regulationIds: ["immobilier", "fiscalite"],
  relatedSlugs: ["simulateur-taxe-habitation-locataire", "rendement-locatif", "rentabilite-lmnp"],
  formFields: [
    { key: "prixAchat", label: "Prix d'achat", type: "number", min: 0, step: 5000, suffix: "€" },
    { key: "chargesAnnuelles", label: "Charges annuelles", type: "number", min: 0, step: 500, suffix: "€" },
    { key: "nuitsLouees", label: "Nuits louées / an", type: "number", min: 0, max: 365, step: 1 },
    { key: "tarifNuit", label: "Tarif moyen / nuit", type: "number", min: 0, step: 10, suffix: "€" },
    { key: "tauxCommission", label: "Commission plateforme", type: "number", min: 0, max: 25, step: 1, suffix: "%" },
  ],
  defaultValues: { prixAchat: 180000, chargesAnnuelles: 3500, nuitsLouees: 60, tarifNuit: 95, tauxCommission: 15 },
  content: buildContent({
    intro: "Une résidence secondaire peut générer des revenus en location saisonnière, mais les charges et la vacance réduisent la rentabilité.",
    howItWorks: [
      {
        title: "Revenus nets locatifs",
        blocks: [
          p("Revenus bruts = nuits × tarif. Net = revenus × (1 − commission) − charges annuelles."),
          hl("Fiscalité", "Micro-BIC ou réel — régime meublé de tourisme selon classement."),
        ],
      },
    ],
    conseils: ["Vérifiez le règlement de copropriété.", "Anticipez taxe d'habitation résidence secondaire.", "Comparez conciergerie vs gestion directe."],
    limites: ["Réglementation locale location courte durée variable.", "Amortissement et IFI non détaillés."],
  }),
  faq: buildFaq([
    { question: "Peut-on louer sa résidence secondaire ?", answer: "Oui, sous réserve du règlement de copropriété et des règles communales." },
    { question: "Location saisonnière rentable ?", answer: "Dépend de la zone, du taux d'occupation et des charges." },
    { question: "Taxe d'habitation ?", answer: "Due sur résidence secondaire — budget à intégrer." },
    { question: "Statut LMNP ?", answer: "Possible si meublé et activité locative — régime micro ou réel." },
  ]),
  calculate(input: Record<string, number | string>) {
    const prix = num(input.prixAchat);
    const charges = num(input.chargesAnnuelles);
    const nuits = num(input.nuitsLouees);
    const tarif = num(input.tarifNuit);
    const comm = num(input.tauxCommission) / 100;
    const brut = nuits * tarif;
    const net = brut * (1 - comm) - charges;
    const rendement = prix > 0 ? (net / prix) * 100 : 0;
    return {
      summary: `Revenu net : ${formatCurrency(net)}/an — rendement : ${formatPercent(rendement, 2)}.`,
      lines: [
        { label: "Revenu net annuel", value: formatCurrency(net), highlight: true },
        { label: "Rendement net", value: formatPercent(rendement, 2), highlight: true },
        { label: "Revenus bruts location", value: formatCurrency(brut) },
        { label: "Charges annuelles", value: formatCurrency(charges) },
        { label: "Nuits louées", value: `${nuits} nuits` },
      ],
    };
  },
});

export const immobilierDrafts: SimulatorDefinition[] = [
  loyerMaxHcsf,
  apportPersonnelMinimum,
  creditInFine,
  investissementLocatifNeuf,
  scpiRendementNet,
  dispositifDefiscalisationDraft("simulateur-denormandie", "Denormandie", 0.21, 12),
  dispositifDefiscalisationDraft("simulateur-malraux", "Malraux", 0.3, 4),
  baremePlusValue,
  taxeHabitationLocataire,
  bailCommercial369,
  honorairesGestionLocative,
  vacanceLocative,
  creditRelaisDuree,
  assurancePpd,
  fraisCoproprieteBudget,
  rentabiliteResidenceSecondaire,
];
