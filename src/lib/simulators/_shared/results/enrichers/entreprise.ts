import {
  FREELANCE_TAUX_CHARGES_DEFAUT,
  TNS_TAUX_CHARGES_DEFAUT,
} from "@/lib/config/aides";
import {
  FRANCHISE_TVA,
  PFU_NET_RATIO,
} from "@/lib/config/fiscalite";
import {
  getMicroEntrepreneurTaux,
  PORTAGE_NET_CA_RATIO,
} from "@/lib/config/urssaf";
import { formatNumber } from "@/lib/utils/format";
import type { ResultComparison } from "../../../types";
import {
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
} from "../../../general/entreprise";
import {
  adviceItems,
  enrich,
  fmtEur,
  fmtPct,
  interpretationFavorable,
  interpretationIntermediate,
  interpretationWarning,
  num,
  oneCallout,
  primaryFromComputed,
  textFromComputed,
  valueFromComputed,
  type Enricher,
} from "./helpers";

const enrichCalculateurTjmFreelance: Enricher = (input, result) => {
  const net = num(input.revenuNetCible);
  const jours = num(input.joursFacturables);
  const taux = num(input.tauxCharges);
  const frais = num(input.fraisAnnuel);
  const computed = calculateurTjmFreelance.calculate(input);
  const tjm = valueFromComputed(computed, /tjm/i, result, /tjm/i);
  const ca = valueFromComputed(computed, /ca annuel/i, result);

  const comparisons: ResultComparison[] = [];
  if (jours < 220) {
    const tjmAlt = ca / (jours + 20);
    comparisons.push({
      scenario: `Avec ${jours + 20} jours facturables/an`,
      value: fmtEur(tjmAlt) + "/jour",
      detail: `−${fmtEur(tjm - tjmAlt)}/jour vs. aujourd'hui`,
    });
  }

  return enrich(result, {
    primary: primaryFromComputed(computed, /tjm/i, result, "TJM minimum"),
    narrative: `Pour ${fmtEur(net)}/an net (${fmtEur(frais)} de frais, ${fmtPct(taux, 0)} de charges+impôts), facturez ${fmtEur(ca)} de CA sur ${jours} jours — soit ${fmtEur(tjm)}/jour minimum.`,
    interpretation:
      tjm <= 400
        ? interpretationFavorable("TJM accessible", `${fmtEur(tjm)}/jour reste compétitif — vérifiez la concurrence sur votre marché.`)
        : tjm <= 700
          ? interpretationIntermediate("TJM élevé", `${fmtEur(tjm)}/jour — assurez-vous que votre marché et votre expertise le supportent.`)
          : interpretationWarning("TJM très élevé", `${fmtEur(tjm)}/jour — risque de vacance commerciale, envisagez d'augmenter les jours facturables.`),
    advice: adviceItems("Calibrer votre TJM", [
      "220 jours ouvrés − congés = base réaliste (~200 jours)",
      "Intégrez impôt sur le revenu dans le taux charges+impôts",
      "Margez 10-15 % pour imprévus et formation",
    ]),
    comparisons: comparisons.length ? comparisons : undefined,
    callouts: oneCallout({
      variant: "note",
      title: "Comment est calculé le TJM ?",
      text: `CA annuel = (revenu net ${fmtEur(net)} + frais ${fmtEur(frais)}) ÷ (1 − ${fmtPct(taux, 0)} charges) = ${fmtEur(ca)}. TJM = ${fmtEur(ca)} ÷ ${jours} jours = ${fmtEur(tjm)}/jour.`,
    }),
  });
};

const enrichRevenuNetIndependant: Enricher = (input, result) => {
  const ca = num(input.caAnnuel);
  const activite = String(input.activite);
  const taux = getMicroEntrepreneurTaux(activite);
  const frais = num(input.fraisAnnuel);
  const computed = revenuNetIndependant.calculate(input);
  const net = valueFromComputed(computed, /revenu net annuel/i, result, /revenu net/i);
  const netMensuel = valueFromComputed(computed, /revenu net mensuel/i, result) || net / 12;

  const labels: Record<string, string> = {
    vente: "vente",
    bic: "prestations BIC",
    bnc: "prestations BNC",
  };

  return enrich(result, {
    primary: primaryFromComputed(computed, /revenu net mensuel/i, result, "Revenu net mensuel"),
    narrative: `${fmtEur(ca)} de CA en ${labels[activite] ?? activite} → ${fmtEur(ca * (taux / 100))} de cotisations (${fmtPct(taux, 1)}) et ${fmtEur(frais)} de frais — il reste ${fmtEur(net)}/an (${fmtEur(netMensuel)}/mois).`,
    interpretation:
      net / ca >= 0.7
        ? interpretationFavorable("Bon reste à vivre", `${fmtPct((net / ca) * 100, 0)} du CA net après charges et frais.`)
        : interpretationIntermediate("Charges lourdes", `${fmtPct(taux, 1)} sur le CA — comparez avec le régime réel si vos charges dépassent l'abattement forfaitaire.`),
    advice: adviceItems("Après ce net", [
      "IR en plus si pas d'impôt libératoire — prévoyez 0-15 % selon TMI",
      "ACRE : −50 % de cotisations la 1re année si éligible",
      "Provisionnez la TVA si vous dépassez les seuils de franchise",
    ]),
    comparisons: [
      {
        scenario: "Sans frais professionnels",
        value: fmtEur(ca - ca * (taux / 100)),
        detail: "Net annuel estimé",
      },
    ],
  });
};

const enrichSasuRemunerationDividendes: Enricher = (input, result) => {
  const brut = num(input.montantBrut);
  const mode = String(input.mode);
  const tauxSal = num(input.tauxCotisations) / 100;
  const computed = sasuRemunerationDividendes.calculate(input);
  const net = valueFromComputed(computed, /net perçu/i, result, /net perçu/i);
  const netPct = brut > 0 ? (net / brut) * 100 : 0;

  const netSalaire = brut * (1 - tauxSal);
  const netDividendes = brut * PFU_NET_RATIO;
  const meilleur = netSalaire > netDividendes ? "Salaire" : "Dividendes";

  return enrich(result, {
    primary: primaryFromComputed(computed, /net perçu/i, result),
    narrative:
      mode === "salaire"
        ? `${fmtEur(brut)} en salaire dirigeant (${fmtPct(num(input.tauxCotisations), 0)} de cotisations) → ${fmtEur(net)} net (${fmtPct(netPct, 0)} du brut).`
        : `${fmtEur(brut)} en dividendes PFU 30 % → ${fmtEur(net)} net (${fmtPct(netPct, 0)} du brut).`,
    interpretation:
      mode === "salaire"
        ? interpretationIntermediate(
            "Salaire choisi",
            meilleur === "Salaire"
              ? "Le salaire protège vos droits retraite/chômage et reste plus avantageux ici."
              : `Les dividendes rapporteraient ${fmtEur(netDividendes - net)} de plus net — mais sans cotisations retraite.`
          )
        : interpretationIntermediate(
            "Dividendes choisis",
            meilleur === "Dividendes"
              ? "Le PFU simplifie et maximise le net perçu sur ce montant."
              : `Un salaire rapporterait ${fmtEur(netSalaire - net)} de plus net — avec cotisations retraite en plus.`
          ),
    advice: adviceItems("Arbitrage SASU", [
      "Salaire minimum pour cotisations retraite + dividendes pour le surplus",
      "Dividendes soumis au PFU 30 % (12,8 % IR + 17,2 % PS)",
      "Pas de dividendes sans bénéfice distribuable ni PV antérieure",
    ]),
    comparisons: [
      {
        scenario: "En salaire dirigeant",
        value: fmtEur(netSalaire),
        detail: `${fmtPct(tauxSal * 100, 0)} de cotisations`,
      },
      {
        scenario: "En dividendes PFU",
        value: fmtEur(netDividendes),
        detail: "Flat tax 30 %",
      },
    ],
    callouts: oneCallout({
      variant: "warning",
      title: "Minimum social",
      text: "Un salaire (même modeste) est souvent nécessaire pour la protection sociale du dirigeant.",
    }),
  });
};

const enrichPortageSalarialVsFreelance: Enricher = (input, result) => {
  const ca = num(input.caMensuel);
  const fraisP = num(input.fraisPortage);
  const computed = portageSalarialVsFreelance.calculate(input);
  const netPortage = valueFromComputed(computed, /net portage/i, result);
  const netFreelance = valueFromComputed(computed, /net freelance/i, result);
  const diff = Math.abs(netPortage - netFreelance);
  const meilleur =
    textFromComputed(computed, /meilleure option/i, result, /meilleure option/i) ||
    (netPortage >= netFreelance ? "Portage salarial" : "Micro-entreprise");

  return enrich(result, {
    primary: primaryFromComputed(computed, /meilleure option/i, result, "Meilleure option"),
    narrative: `Sur ${fmtEur(ca)}/mois HT, le portage (${fmtPct(fraisP, 1)} de frais de gestion) laisse ${fmtEur(netPortage)} net vs ${fmtEur(netFreelance)} en micro-entreprise — écart ${fmtEur(diff)}/mois en faveur du ${meilleur.toLowerCase()}.`,
    interpretation:
      diff < 200
        ? interpretationIntermediate("Écart faible", "Les deux statuts se valent financièrement — le choix dépend du confort administratif et de la protection sociale.")
        : interpretationFavorable(
            meilleur,
            `${fmtEur(diff)}/mois d'écart — ${meilleur.includes("Portage") ? "statut salarié avec chômage et congés" : "simplicité et frais de gestion réduits"}.`
          ),
    advice: adviceItems("Choisir son statut", [
      "Portage : protection chômage, congés payés, mais frais de gestion 5-15 %",
      "Micro : simplicité URSSAF, mais pas de chômage ni congés",
      "Au-delà de ~80 k€/an, comparez EURL/SASU avec un comptable",
    ]),
    comparisons: [
      { scenario: "Portage salarial", value: fmtEur(netPortage), detail: `${fmtPct(PORTAGE_NET_CA_RATIO * 100, 0)} du CA après frais` },
      { scenario: "Micro-entreprise", value: fmtEur(netFreelance), detail: `${fmtPct(getMicroEntrepreneurTaux(String(input.activite)), 1)} de cotisations` },
    ],
  });
};

const enrichSeuilFranchiseTva: Enricher = (input, result) => {
  const ca = num(input.caAnnuel);
  const type = String(input.typeActivite);
  const computed = seuilFranchiseTva.calculate(input);
  const seuil =
    type === "ventes" ? FRANCHISE_TVA.ventes : FRANCHISE_TVA.prestations;
  const seuilMaj = seuil * FRANCHISE_TVA.coefficientSeuilMajore;
  const statutFranchise = textFromComputed(computed, /statut franchise/i, result);
  const ok = statutFranchise.includes("Sous") || ca <= seuil;
  const marge = Math.abs(seuil - ca);

  return enrich(result, {
    primary: { label: "Statut TVA", value: ok ? "Franchise maintenue" : "Seuil dépassé" },
    narrative: ok
      ? `${fmtEur(ca)} de CA HT — vous restez ${fmtEur(marge)} sous le plafond franchise (${fmtEur(seuil)} pour ${type === "ventes" ? "ventes" : "prestations"}).`
      : `${fmtEur(ca)} de CA HT — seuil franchise dépassé de ${fmtEur(ca - seuil)} (tolérance majorée : ${fmtEur(seuilMaj)}).`,
    interpretation: ok
      ? interpretationFavorable("Sans TVA", "Pas de TVA à facturer ni à reverser — prix plus compétitifs côté particuliers.")
      : ca <= seuilMaj
        ? interpretationIntermediate("Zone de tolérance", "1re dépassement possible sans bascule immédiate — préparez la TVA pour l'année suivante.")
        : interpretationWarning("Passage TVA", "Régime réel de TVA obligatoire — facturez HT + TVA et déclarez mensuellement ou trimestriellement."),
    advice: adviceItems("Franchise TVA", [
      "Mention « TVA non applicable, art. 293 B du CGI » sur vos factures",
      "Seuils 2025 : 37 500 € (services) / 85 000 € (ventes)",
      "Franchise perdue dès le 1er dépassement — pas de retour immédiat",
    ]),
    comparisons: [
      {
        scenario: "Seuil majoré (tolérance)",
        value: fmtEur(seuilMaj),
        detail: ok ? `${fmtEur(seuilMaj - ca)} de marge` : "Dépassé",
      },
    ],
  });
};

const enrichBreakEvenEntreprise: Enricher = (input, result) => {
  const computed = breakEvenEntreprise.calculate(input);
  const ca = valueFromComputed(computed, /ca break-even/i, result, /ca break-even/i);
  const units = valueFromComputed(computed, /unités/i, result);
  const fixes = num(input.chargesFixes);
  const margeUnit = num(input.prixVenteUnitaire) - num(input.coutVariableUnitaire);
  const tauxMarge = num(input.prixVenteUnitaire) > 0 ? (margeUnit / num(input.prixVenteUnitaire)) * 100 : 0;

  return enrich(result, {
    primary: primaryFromComputed(computed, /ca break-even/i, result, "CA break-even"),
    narrative: `Avec ${fmtEur(fixes)}/mois de charges fixes et ${fmtEur(margeUnit)} de marge unitaire (${fmtPct(tauxMarge, 1)}), il faut vendre ${formatNumber(units, 0)} unités soit ${fmtEur(ca)}/mois pour être à l'équilibre.`,
    interpretation:
      tauxMarge >= 50
        ? interpretationFavorable("Bonne marge", `${fmtPct(tauxMarge, 1)} de marge unitaire — le point mort est atteignable rapidement.`)
        : tauxMarge >= 25
          ? interpretationIntermediate("Marge moyenne", "Surveillez les coûts variables — chaque point de marge réduit fortement le volume nécessaire.")
          : interpretationWarning("Marge faible", `${fmtPct(tauxMarge, 1)} seulement — le volume à atteindre (${formatNumber(units, 0)} unités) est élevé.`),
    advice: adviceItems("Passer le point mort", [
      "Réduire les charges fixes ou négocier les loyers/abonnements",
      "Augmenter le prix ou réduire le coût variable unitaire",
      "Suivre le CA réel vs break-even chaque mois",
    ]),
    comparisons: [
      {
        scenario: "Si les charges fixes baissaient de 10 %",
        value: fmtEur((fixes * 0.9 / margeUnit) * num(input.prixVenteUnitaire)),
        detail: "CA break-even mensuel",
      },
    ],
    callouts: oneCallout({
      variant: "note",
      title: "Comment est calculé le break-even ?",
      text: `Unités = charges fixes ${fmtEur(fixes)} ÷ marge unitaire ${fmtEur(margeUnit)} = ${formatNumber(units, 0)}. CA = ${formatNumber(units, 0)} × ${fmtEur(num(input.prixVenteUnitaire))} = ${fmtEur(ca)}/mois.`,
    }),
  });
};

const enrichMargeCommercialeTaux: Enricher = (input, result) => {
  const cout = num(input.coutAchat);
  const taux = num(input.tauxMarge);
  const computed = margeCommercialeTaux.calculate(input);
  const pv = valueFromComputed(computed, /prix de vente/i, result, /prix de vente/i);
  const marge = valueFromComputed(computed, /marge commerciale/i, result);

  return enrich(result, {
    primary: primaryFromComputed(computed, /prix de vente/i, result),
    narrative: `Coût d'achat ${fmtEur(cout)} + marge ${fmtPct(taux, 0)} → prix de vente ${fmtEur(pv)} (marge ${fmtEur(marge)}).`,
    interpretation:
      taux >= 40
        ? interpretationFavorable("Marge solide", `${fmtPct(taux, 0)} de marge commerciale — couvre charges fixes et imprévus.`)
        : taux >= 20
          ? interpretationIntermediate("Marge standard", `${fmtPct(taux, 0)} — vérifiez que cela couvre TVA, charges et votre rémunération.`)
          : interpretationWarning("Marge serrée", `${fmtPct(taux, 0)} seulement — risque si les coûts augmentent ou les ventes fléchissent.`),
    advice: adviceItems("Fixer votre prix", [
      "Marge commerciale = (PV − coût) / coût — ne pas confondre avec taux de marque",
      "Intégrez transport, SAV et retours dans le coût d'achat",
      "Comparez avec la concurrence avant de verrouiller le prix",
    ]),
    comparisons: [
      {
        scenario: "Coût d'achat seul (marge 0 %)",
        value: fmtEur(cout),
        detail: "Prix de vente HT minimum",
      },
    ],
    callouts: oneCallout({
      variant: "note",
      title: "Comment est calculée la marge ?",
      text: `Marge = ${fmtEur(cout)} × ${fmtPct(taux, 0)} = ${fmtEur(marge)}. Prix de vente HT = ${fmtEur(cout)} + ${fmtEur(marge)} = ${fmtEur(pv)}.`,
    }),
  });
};

const enrichCoutHoraireChargeTns: Enricher = (input, result) => {
  const net = num(input.netMensuel);
  const heures = num(input.heuresFacturables);
  const taux = num(input.tauxCharges);
  const frais = num(input.fraisMensuel);
  const computed = coutHoraireChargeTns.calculate(input);
  const horaire = valueFromComputed(computed, /taux horaire|horaire chargé/i, result, /horaire/i);
  const ca = valueFromComputed(computed, /ca mensuel/i, result);

  return enrich(result, {
    primary: primaryFromComputed(computed, /taux horaire|horaire chargé/i, result, "Tarif horaire chargé"),
    narrative: `Pour ${fmtEur(net)}/mois net (${heures} h facturables, ${fmtPct(taux, 0)} de charges TNS, ${fmtEur(frais)} de frais), facturez ${fmtEur(ca)}/mois — soit ${fmtEur(horaire)}/h minimum.`,
    interpretation:
      horaire <= 50
        ? interpretationFavorable("Tarif compétitif", `${fmtEur(horaire)}/h reste accessible — adaptez selon votre métier et zone.`)
        : horaire <= 100
          ? interpretationIntermediate("Tarif professionnel", `${fmtEur(horaire)}/h cohérent pour un TNS expérimenté.`)
          : interpretationWarning("Tarif élevé", `${fmtEur(horaire)}/h — assurez une charge de travail suffisante (${heures} h/mois).`),
    advice: adviceItems("TNS", [
      "Taux charges TNS ~45 % par défaut — ajustez selon votre caisse",
      "Heures facturables réalistes : 100-130 h/mois pour un indépendant",
      "Provisionnez l'IR en plus des charges sociales",
    ]),
    comparisons: [
      {
        scenario: `Avec ${TNS_TAUX_CHARGES_DEFAUT} % de charges (défaut TNS)`,
        value: fmtEur((net / (1 - TNS_TAUX_CHARGES_DEFAUT / 100) + frais) / heures) + "/h",
        detail: "Tarif horaire recalculé",
      },
    ],
    callouts: oneCallout({
      variant: "note",
      title: "Comment est calculé le tarif horaire ?",
      text: `Brut = ${fmtEur(net)} ÷ (1 − ${fmtPct(taux, 0)}). CA = brut + frais ${fmtEur(frais)} = ${fmtEur(ca)}. Tarif = ${fmtEur(ca)} ÷ ${heures} h = ${fmtEur(horaire)}/h.`,
    }),
  });
};

const enrichExonerationAcre: Enricher = (input, result) => {
  const ca = num(input.caAnnuel);
  const tauxAcre = num(input.tauxAcre);
  const activite = String(input.activite);
  const computed = exonerationAcre.calculate(input);
  const economie = valueFromComputed(computed, /économie annuelle/i, result, /économie/i);
  const chargesAcre = valueFromComputed(computed, /charges avec acre/i, result);
  const chargesSans = valueFromComputed(computed, /charges sans acre/i, result);

  return enrich(result, {
    primary: primaryFromComputed(computed, /économie annuelle/i, result, "Économie ACRE"),
    narrative: `Sur ${fmtEur(ca)} de CA (${activite.toUpperCase()}), l'ACRE à ${fmtPct(tauxAcre, 0)} réduit vos cotisations à ${fmtEur(chargesAcre)} — économie ${fmtEur(economie)} la 1re année.`,
    interpretation:
      economie >= 3000
        ? interpretationFavorable("ACRE impactante", `${fmtEur(economie)} économisés — demandez l'ACRE dès la création (pas rétroactive).`)
        : interpretationIntermediate("Gain modéré", `${fmtEur(economie)} la 1re année — l'ACRE s'applique uniquement sur la part URSSAF, pas la retraite complémentaire.`),
    advice: adviceItems("ACRE", [
      "Demande obligatoire à l'URSSAF dans les 45 jours après création",
      "Réduction ~50 % la 1re année, dégressive ensuite",
      "Non cumulable avec certaines aides — vérifiez votre éligibilité",
    ]),
    comparisons: [
      {
        scenario: "Sans ACRE",
        value: fmtEur(chargesSans),
        detail: "Cotisations annuelles estimées",
      },
    ],
    callouts: oneCallout({
      variant: "info",
      title: "Durée limitée",
      text: "L'ACRE dure 12 mois (24 en zone QPV) — prévoyez la hausse de charges ensuite.",
    }),
  });
};

const enrichFacturationObjectifRevenuNet: Enricher = (input, result) => {
  const net = num(input.netMensuel);
  const taux = num(input.tauxCharges) || FREELANCE_TAUX_CHARGES_DEFAUT;
  const frais = num(input.fraisMensuel);
  const computed = facturationObjectifRevenuNet.calculate(input);
  const ca = valueFromComputed(computed, /ca mensuel/i, result, /ca mensuel/i);
  const caAnnuel = valueFromComputed(computed, /ca annuel/i, result) || ca * 12;

  return enrich(result, {
    primary: primaryFromComputed(computed, /ca mensuel/i, result, "CA mensuel à facturer"),
    narrative: `Objectif ${fmtEur(net)}/mois net (${fmtPct(taux, 0)} charges+impôts, ${fmtEur(frais)} de frais) → facturez ${fmtEur(ca)}/mois HT, soit ${fmtEur(caAnnuel)}/an.`,
    interpretation:
      ca <= 5000
        ? interpretationFavorable("Objectif atteignable", `${fmtEur(ca)}/mois HT — environ ${formatNumber(ca / 400, 0)} jours à 400 €/jour.`)
        : ca <= 10000
          ? interpretationIntermediate("Objectif exigeant", `${fmtEur(ca)}/mois — structurez prospection et récurrence client.`)
          : interpretationWarning("Objectif ambitieux", `${fmtEur(ca)}/mois HT — vérifiez marché, TJM et capacité de production.`),
    advice: adviceItems("Atteindre l'objectif", [
      "Taux charges+impôts par défaut 35 % — ajustez selon statut réel",
      "Ajoutez 15-20 % de marge pour congés et impayés",
      "Suivez le CA facturé vs objectif chaque mois",
    ]),
    comparisons: [
      {
        scenario: "Avec 30 % de charges+impôts",
        value: fmtEur((net + frais) / 0.7),
        detail: "CA mensuel si taux réduit",
      },
    ],
    callouts: oneCallout({
      variant: "note",
      title: "Comment est calculé le CA objectif ?",
      text: `CA mensuel = (revenu net ${fmtEur(net)} + frais ${fmtEur(frais)}) ÷ (1 − ${fmtPct(taux, 0)}) = ${fmtEur(ca)} HT.`,
    }),
  });
};

export const SLUG_ENRICHERS: Record<string, Enricher> = {
  "calculateur-tjm-freelance": enrichCalculateurTjmFreelance,
  "revenu-net-independant": enrichRevenuNetIndependant,
  "sasu-remuneration-dividendes": enrichSasuRemunerationDividendes,
  "portage-salarial-vs-freelance": enrichPortageSalarialVsFreelance,
  "seuil-franchise-tva": enrichSeuilFranchiseTva,
  "break-even-entreprise": enrichBreakEvenEntreprise,
  "marge-commerciale-taux": enrichMargeCommercialeTaux,
  "cout-horaire-charge-tns": enrichCoutHoraireChargeTns,
  "exoneration-acre": enrichExonerationAcre,
  "facturation-objectif-revenu-net": enrichFacturationObjectifRevenuNet,
};
