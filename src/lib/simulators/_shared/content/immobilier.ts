import { buildRichContent, buildFaq, p, hl } from "../content-builder";
import type { ContentRegistry } from "./types";

export const immobilierContent: ContentRegistry = {
  "frais-de-notaire": {
    content: buildRichContent({
      intro:
        "Les frais de notaire représentent un poste budgétaire majeur lors d'un achat immobilier. Ce simulateur estime leur montant selon le prix d'achat et la nature du bien (ancien ou neuf).",
      definition:
        "Les frais de notaire, ou droits de mutation, regroupent les taxes perçues par l'État, la rémunération du notaire (émoluments) et les débours (formalités, copies). Dans l'ancien, ils tournent autour de 7 à 8 % du prix ; dans le neuf (VEFA), ils sont nettement plus faibles grâce à des droits réduits.",
      objectif:
        "Anticiper le coût réel de votre acquisition au-delà du prix affiché, pour dimensionner votre apport et votre capacité d'emprunt.",
      variables: [
        "Prix d'achat du bien (€)",
        "Type de bien : ancien (~7,5 %) ou neuf (~2,5 %)",
      ],
      formules: [
        hl("Formule", "Frais de notaire = Prix d'achat × Taux appliqué"),
        p("Le taux est fixé à 7,5 % pour l'ancien et 2,5 % pour le neuf dans ce simulateur. Le budget total d'acquisition correspond au prix d'achat plus les frais de notaire."),
      ],
      interpretation: [
        p("Un montant élevé de frais de notaire augmente le budget global sans augmenter la valeur du bien. Intégrez-le dès la recherche de financement."),
        hl("Ordre de grandeur", "Pour 250 000 € dans l'ancien, comptez environ 18 750 € de frais. Dans le neuf, environ 6 250 €."),
      ],
      limitesCalcul: [
        "Taux moyens nationaux : le montant exact varie selon le département.",
        "Frais de garantie bancaire, dossier et agence non inclus.",
        "Les émoluments du notaire sont encadrés par la loi et ne sont pas négociables.",
      ],
      example: {
        title: "Achat d'un appartement ancien à 250 000 €",
        donnees: ["Prix d'achat : 250 000 €", "Type de bien : ancien"],
        calcul: [
          "Frais = 250 000 × 7,5 % = 18 750 €",
          "Budget total = 250 000 + 18 750 = 268 750 €",
        ],
        resultat: "Frais de notaire estimés : 18 750 € (7,5 % du prix).",
        interpretation:
          "Prévoyez environ 19 000 € supplémentaires dans votre apport ou votre enveloppe de financement. Demandez une proforma au notaire pour affiner ce chiffre.",
      },
      maillage: [
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "frais-agence-immobiliere", label: "Frais d'agence immobilière" },
      ],
      conseils: [
        "Intégrez les frais de notaire dès la phase de recherche de bien.",
        "Dans le neuf, vérifiez si des frais de garantie d'achèvement s'ajoutent.",
        "Demandez une estimation détaillée (proforma) au notaire avant la signature.",
        "Certains prêteurs acceptent de financer une partie des frais, selon votre profil.",
      ],
      limites: [
        "Estimation indicative basée sur des taux moyens.",
        "Ne remplace pas le décompte notarial officiel.",
      ],
    }),
    faq: buildFaq([
      { question: "Combien coûtent les frais de notaire dans l'ancien ?", answer: "En moyenne, entre 7 et 8 % du prix d'achat au niveau national. Notre simulateur applique 7,5 %." },
      { question: "Les frais sont-ils moins élevés dans le neuf ?", answer: "Oui, environ 2 à 3 % en VEFA grâce à des droits de mutation réduits. Ici, le taux neuf est de 2,5 %." },
      { question: "Peut-on financer les frais de notaire par le crédit ?", answer: "Parfois, selon la banque et votre apport. Souvent, ils doivent être payés comptant ou via l'apport personnel." },
      { question: "Les frais de notaire sont-ils négociables ?", answer: "Non pour les émoluments, encadrés par la loi. Seuls certains actes annexes peuvent légèrement varier." },
      { question: "Que comprennent exactement les frais de notaire ?", answer: "Les droits de mutation (taxes), les émoluments du notaire et les débours (formalités, copies, publications)." },
      { question: "Faut-il les payer en une seule fois ?", answer: "Oui, généralement au moment de la signature de l'acte authentique chez le notaire." },
      { question: "Les honoraires d'agence sont-ils inclus ?", answer: "Non, ce simulateur ne couvre que les frais de notaire. Utilisez le simulateur frais d'agence pour les honoraires." },
      { question: "Comment estimer les frais avant d'avoir un notaire ?", answer: "Ce simulateur fournit une estimation rapide. Une proforma notariale affinera le montant selon votre département." },
    ]),
  },

  "taux-endettement": {
    content: buildRichContent({
      intro:
        "Le taux d'endettement mesure la part de vos revenus consacrée au remboursement de vos crédits. C'est un critère central pour l'octroi d'un prêt immobilier en France.",
      definition:
        "Le taux d'endettement exprime le rapport entre l'ensemble de vos charges de crédit mensuelles et vos revenus nets mensuels. Depuis les recommandations du HCSF, la plupart des banques plafonnent ce ratio à 35 %, assurance emprunteur incluse.",
      objectif:
        "Vérifier si votre projet immobilier respecte le plafond bancaire de 35 % et estimer la marge disponible avant d'atteindre ce seuil.",
      variables: [
        "Revenus mensuels nets du foyer (€)",
        "Charges de crédit actuelles (€/mois)",
        "Mensualité du projet incluant assurance (€/mois)",
      ],
      formules: [
        hl("Formule", "Taux d'endettement = (Charges actuelles + Mensualité projet) / Revenus nets × 100"),
        p("La marge disponible correspond à la différence entre 35 % et votre taux calculé, exprimée en points de pourcentage."),
      ],
      interpretation: [
        p("Un taux inférieur ou égal à 35 % est généralement accepté par les banques. Au-delà, le dossier risque un refus sauf exceptions rares."),
        hl("Reste à vivre", "Certaines banques analysent aussi le reste à vivre après charges, au-delà du seul taux d'endettement."),
      ],
      limitesCalcul: [
        "Ne modélise pas le reste à vivre exigé par certaines banques.",
        "Les revenus variables peuvent être lissés différemment selon l'établissement.",
        "L'assurance emprunteur doit être incluse dans la mensualité projet.",
      ],
      example: {
        title: "Couple avec 4 000 € de revenus nets",
        donnees: [
          "Revenus mensuels : 4 000 €",
          "Charges actuelles : 300 €",
          "Mensualité projet : 1 100 €",
        ],
        calcul: [
          "Total charges = 300 + 1 100 = 1 400 €",
          "Taux = 1 400 / 4 000 × 100 = 35 %",
          "Marge disponible = 35 − 35 = 0 point",
        ],
        resultat: "Taux d'endettement : 35,0 % — dans la limite des 35 %.",
        interpretation:
          "Le projet est à la limite du plafond recommandé. Toute hausse de mensualité ou baisse de revenus pourrait faire basculer le dossier. Envisagez d'augmenter l'apport ou d'allonger la durée.",
      },
      maillage: [
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "cout-total-credit-immobilier", label: "Coût total du crédit" },
      ],
      conseils: [
        "Incluez toutes vos mensualités de crédit en cours (auto, conso, autres immobiliers).",
        "Intégrez l'assurance emprunteur dans la mensualité projetée.",
        "Visez une marge sous 35 % pour faciliter l'acceptation bancaire.",
        "Un apport plus important réduit la mensualité et donc le taux d'endettement.",
      ],
      limites: [
        "Critères bancaires complémentaires non modélisés (âge, stabilité professionnelle).",
        "Exceptions HCSF possibles mais rares depuis 2022.",
      ],
    }),
    faq: buildFaq([
      { question: "Quel est le plafond d'endettement en France ?", answer: "Le HCSF recommande un maximum de 35 % des revenus nets, charges de crédit incluses." },
      { question: "L'assurance emprunteur compte-t-elle dans le calcul ?", answer: "Oui, les banques l'intègrent généralement dans la mensualité prise en compte." },
      { question: "Peut-on dépasser 35 % ?", answer: "Exceptionnellement pour certains profils ou opérations, mais c'est devenu rare depuis 2022." },
      { question: "Comment réduire son taux d'endettement ?", answer: "Augmenter les revenus, solder un crédit, allonger la durée ou augmenter l'apport pour réduire la mensualité." },
      { question: "Les loyers perçus comptent-ils comme revenus ?", answer: "Oui, mais les banques n'en retiennent qu'une partie (souvent 70 à 80 %) selon leur politique." },
      { question: "Faut-il inclure les pensions alimentaires versées ?", answer: "Oui, elles sont généralement déduites des revenus ou ajoutées aux charges." },
      { question: "Le taux d'endettement est-il le seul critère bancaire ?", answer: "Non, le reste à vivre, l'apport, l'âge et la stabilité professionnelle sont aussi analysés." },
      { question: "Comment simuler la mensualité de mon projet ?", answer: "Utilisez le simulateur mensualité crédit immobilier pour estimer la mensualité à intégrer ici." },
    ]),
  },

  "cout-total-credit-immobilier": {
    content: buildRichContent({
      intro:
        "Au-delà de la mensualité affichée, un crédit immobilier génère un coût global significatif en intérêts et en assurance. Ce simulateur révèle le montant total que vous rembourserez sur toute la durée.",
      definition:
        "Le coût total du crédit immobilier correspond à la somme du capital emprunté, des intérêts payés sur toute la durée et du coût cumulé de l'assurance emprunteur. C'est le véritable prix de votre financement.",
      objectif:
        "Comparer l'impact de différentes durées, taux ou assurances sur le coût global, au-delà de la seule mensualité.",
      variables: [
        "Montant emprunté (€)",
        "Taux d'intérêt annuel (%)",
        "Durée du prêt (années)",
        "Taux d'assurance emprunteur annuel (% du capital)",
      ],
      formules: [
        hl("Mensualité", "Calculée selon la formule d'amortissement constant (capital + intérêts)"),
        hl("Intérêts totaux", "Total des mensualités × nombre de mois − capital emprunté"),
        hl("Assurance totale", "Capital × taux assurance × durée en années"),
        p("Coût total = Capital + Intérêts + Assurance"),
      ],
      interpretation: [
        p("Une mensualité faible obtenue en allongeant la durée peut masquer un coût total très élevé en intérêts."),
        hl("Attention", "Sur 20 ans à 3,5 %, 250 000 € empruntés coûtent près de 98 000 € d'intérêts seuls."),
      ],
      limitesCalcul: [
        "Frais de dossier et de garantie non inclus.",
        "Taux fixe uniquement, pas de modulation.",
        "Assurance calculée sur capital initial (estimation haute).",
      ],
      example: {
        title: "Crédit de 250 000 € sur 20 ans à 3,5 %",
        donnees: [
          "Montant : 250 000 €",
          "Taux : 3,5 %",
          "Durée : 20 ans",
          "Assurance : 0,30 %/an",
        ],
        calcul: [
          "Mensualité hors assurance ≈ 1 450 €",
          "Intérêts totaux ≈ 97 976 €",
          "Assurance totale = 250 000 × 0,30 % × 20 = 15 000 €",
          "Coût total ≈ 362 976 €",
        ],
        resultat: "Coût total estimé : 362 976 € (dont 97 976 € d'intérêts).",
        interpretation:
          "Vous rembourserez environ 113 000 € au-delà du capital emprunté. Négocier le taux ou réduire la durée de 2 à 3 ans peut économiser plusieurs milliers d'euros.",
      },
      maillage: [
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "tableau-amortissement", label: "Tableau d'amortissement" },
        { slug: "assurance-emprunteur", label: "Assurance emprunteur" },
      ],
      conseils: [
        "Comparez le coût total sur différentes durées, pas seulement la mensualité.",
        "Négociez le taux et l'assurance emprunteur (délégation possible).",
        "Envisagez des remboursements anticipés pour réduire les intérêts.",
        "Un point de taux en moins peut économiser des dizaines de milliers d'euros.",
      ],
      limites: [
        "Ne remplace pas l'offre de prêt bancaire (TAEG).",
        "Remboursements anticipés et modulations non pris en compte.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que le coût total du crédit ?", answer: "La somme de tous les intérêts et assurances payés, plus le capital remboursé." },
      { question: "Comment réduire le coût total ?", answer: "Durée plus courte, taux plus bas, assurance optimisée et remboursements anticipés." },
      { question: "Le coût total inclut-il le capital ?", answer: "Oui : coût global = capital + intérêts + assurance." },
      { question: "Différence avec le TAEG ?", answer: "Le TAEG inclut aussi les frais de dossier et garantie. Ce simulateur se concentre sur intérêts et assurance." },
      { question: "Pourquoi la durée impacte-t-elle autant le coût ?", answer: "Plus la durée est longue, plus les intérêts s'accumulent, même si la mensualité baisse." },
      { question: "L'assurance emprunteur pèse-t-elle lourd ?", answer: "Sur 20 ans, elle peut représenter 10 000 à 20 000 €. La délégation d'assurance permet souvent de réduire ce poste." },
      { question: "Peut-on visualiser mois par mois ?", answer: "Oui, utilisez le simulateur tableau d'amortissement pour voir la répartition capital/intérêts." },
      { question: "Un taux bas garantit-il un bon crédit ?", answer: "Pas seulement : vérifiez aussi les frais, l'assurance et les conditions de remboursement anticipé." },
    ]),
  },

  "tableau-amortissement": {
    content: buildRichContent({
      intro:
        "Le tableau d'amortissement détaille, mois par mois, la répartition de chaque mensualité entre capital remboursé et intérêts. C'est un outil essentiel pour comprendre l'évolution de votre crédit.",
      definition:
        "Un tableau d'amortissement (ou échéancier) liste pour chaque échéance la mensualité, la part d'intérêts, la part de capital remboursé et le capital restant dû (CRD). En début de prêt, les intérêts dominent ; la part de capital augmente progressivement.",
      objectif:
        "Visualiser la structure de remboursement de votre crédit et estimer le coût total en intérêts sur la durée choisie.",
      variables: [
        "Capital emprunté (€)",
        "Taux d'intérêt annuel (%)",
        "Durée du prêt (années)",
      ],
      formules: [
        hl("Mensualité constante", "M = C × (t/12) × (1 + t/12)^n / ((1 + t/12)^n − 1)"),
        p("Pour chaque mois : Intérêts = CRD × taux mensuel ; Capital remboursé = Mensualité − Intérêts ; Nouveau CRD = CRD précédent − Capital remboursé."),
      ],
      interpretation: [
        p("Les premières échéances remboursent surtout des intérêts. C'est en milieu et fin de prêt que le capital diminie le plus vite."),
        hl("Point clé", "Un remboursement anticipé en début de prêt génère plus d'économies d'intérêts qu'en fin de prêt."),
      ],
      limitesCalcul: [
        "Aperçu partiel affiché (premiers et derniers mois).",
        "Ne tient pas compte des remboursements anticipés ou modulations.",
        "Assurance emprunteur non incluse.",
      ],
      example: {
        title: "Prêt de 200 000 € sur 20 ans à 3,5 %",
        donnees: ["Capital : 200 000 €", "Taux : 3,5 %", "Durée : 20 ans"],
        calcul: [
          "Mensualité constante ≈ 1 160 €",
          "Mois 1 : intérêts ≈ 583 €, capital ≈ 577 €",
          "Intérêts totaux sur 240 mois ≈ 78 381 €",
        ],
        resultat: "Mensualité : 1 160 € — Intérêts totaux : 78 381 €.",
        interpretation:
          "Sur 20 ans, vous paierez près de 40 % du capital emprunté en intérêts. Identifiez le moment où la part capital dépasse les intérêts pour optimiser un remboursement anticipé.",
      },
      maillage: [
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "cout-total-credit-immobilier", label: "Coût total du crédit" },
        { slug: "remboursement-anticipe", label: "Remboursement anticipé" },
      ],
      conseils: [
        "Comparez les premières et dernières lignes pour comprendre l'évolution.",
        "Identifiez le moment où le capital remboursé dépasse les intérêts.",
        "Utilisez ce tableau pour planifier un remboursement anticipé.",
        "Demandez l'échéancier officiel à votre banque lors de la signature.",
      ],
      limites: [
        "Affichage partiel pour la lisibilité.",
        "Taux fixe uniquement.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce qu'un tableau d'amortissement ?", answer: "Un échéancier listant pour chaque mois la part de capital, les intérêts et le capital restant dû." },
      { question: "Pourquoi les intérêts sont-ils plus élevés au début ?", answer: "Les intérêts sont calculés sur le capital restant dû, maximal en début de prêt." },
      { question: "Puis-je obtenir le tableau complet ?", answer: "Votre banque vous remettra l'échéancier officiel avec toutes les échéances à la signature." },
      { question: "Le tableau change-t-il en cas de remboursement anticipé ?", answer: "Oui, le capital restant dû et les échéances futures sont recalculés." },
      { question: "Qu'est-ce que le CRD ?", answer: "Le capital restant dû : le montant du prêt encore à rembourser à une date donnée." },
      { question: "Mensualité constante signifie-t-elle des intérêts constants ?", answer: "Non, la mensualité est fixe mais la part d'intérêts diminue et celle du capital augmente." },
      { question: "Comment lire la première ligne du tableau ?", answer: "Elle montre la répartition de votre première mensualité : une grande part d'intérêts, une part moindre de capital." },
      { question: "Le tableau inclut-il l'assurance ?", answer: "Non, l'assurance emprunteur est facturée en supplément de la mensualité de crédit." },
    ]),
  },

  "remboursement-anticipe": {
    content: buildRichContent({
      intro:
        "Rembourser par anticipation une partie ou la totalité de votre crédit immobilier peut générer des économies d'intérêts substantielles, mais des indemnités de remboursement anticipé (IRA) peuvent s'appliquer.",
      definition:
        "Le remboursement anticipé consiste à solder tout ou partie du capital restant dû avant l'échéance contractuelle. La banque recalcule les intérêts futurs évités et peut facturer des IRA, plafonnées par la loi (6 mois d'intérêts ou 3 % du capital remboursé, le montant le plus faible étant retenu).",
      objectif:
        "Estimer le gain net d'un remboursement anticipé partiel ou total, après déduction des IRA, pour décider si l'opération est financièrement intéressante.",
      variables: [
        "Capital restant dû (CRD) au moment du remboursement",
        "Montant remboursé par anticipation (€)",
        "Taux d'intérêt du prêt (%)",
        "Durée restante (mois)",
        "Taux d'IRA appliqué par la banque (%)",
      ],
      formules: [
        hl("Intérêts économisés", "Estimation des intérêts non payés sur le montant remboursé sur la durée restante"),
        hl("IRA", "Indemnités = min(6 mois d'intérêts sur le montant remboursé ; 3 % du montant remboursé) × taux IRA contractuel"),
        p("Gain net = Intérêts économisés − IRA"),
      ],
      interpretation: [
        p("Un gain net positif signifie que le remboursement anticipé est rentable malgré les IRA. Plus le taux du prêt est élevé et plus la durée restante est longue, plus l'économie est importante."),
        hl("Timing", "Un remboursement anticipé en début de prêt génère davantage d'économies qu'en fin de crédit."),
      ],
      limitesCalcul: [
        "Estimation simplifiée des intérêts économisés.",
        "Ne tient pas compte d'une réduction de durée vs réduction de mensualité.",
        "Conditions contractuelles spécifiques (exonération d'IRA) non modélisées.",
      ],
      example: {
        title: "Remboursement anticipé partiel de 30 000 €",
        donnees: [
          "CRD : 150 000 €",
          "Montant remboursé : 30 000 €",
          "Taux : 3,5 %",
          "Durée restante : 180 mois",
          "IRA : 1 %",
        ],
        calcul: [
          "Intérêts économisés estimés ≈ 8 325 €",
          "IRA = 30 000 × 1 % = 300 € (plafonnées)",
          "Gain net ≈ 8 325 − 750 = 7 575 €",
        ],
        resultat: "Gain net estimé après IRA : environ 7 575 €.",
        interpretation:
          "Rembourser 30 000 € dès maintenant permet d'économiser près de 7 600 € d'intérêts nets. Vérifiez auprès de votre banque si des IRA s'appliquent réellement et si votre contrat prévoit une exonération.",
      },
      maillage: [
        { slug: "tableau-amortissement", label: "Tableau d'amortissement" },
        { slug: "cout-total-credit-immobilier", label: "Coût total du crédit" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
      ],
      conseils: [
        "Vérifiez les conditions d'IRA dans votre offre de prêt avant de vous engager.",
        "Privilégiez le remboursement anticipé lorsque le taux du prêt est supérieur au rendement de votre épargne.",
        "Demandez à la banque une simulation officielle avant tout versement.",
        "Un remboursement total peut être exonéré d'IRA en cas de vente ou de décès.",
      ],
      limites: [
        "Simulation indicative, non contractuelle.",
        "Choix réduction de durée vs mensualité non détaillé ici.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce qu'un remboursement anticipé ?", answer: "Le versement d'une somme pour réduire ou solder le capital restant dû avant la fin du prêt." },
      { question: "Quelles sont les IRA ?", answer: "Les indemnités de remboursement anticipé, facturées par la banque pour compenser la perte d'intérêts futurs." },
      { question: "Peut-on être exonéré d'IRA ?", answer: "Oui, notamment en cas de vente du bien, décès, licenciement ou fin de contrat à durée déterminée." },
      { question: "Vaut-il mieux réduire la durée ou la mensualité ?", answer: "Réduire la durée maximise les économies d'intérêts. Réduire la mensualité améliore votre budget mensuel." },
      { question: "Quel montant minimum pour un remboursement anticipé ?", answer: "Variable selon les contrats, souvent à partir de 10 % du capital initial ou un montant minimum fixe." },
      { question: "Le gain net inclut-il l'assurance emprunteur ?", answer: "Non, ce simulateur se concentre sur les intérêts du crédit et les IRA." },
      { question: "Quand rembourser par anticipation est-il intéressant ?", answer: "Quand le taux du prêt dépasse le rendement net de votre épargne disponible et que les IRA restent modérées." },
      { question: "Faut-il conserver une épargne de précaution ?", answer: "Oui, ne videz pas votre épargne au profit d'un remboursement anticipé si cela vous expose financièrement." },
      { question: "Comment la banque recalcule-t-elle l'échéancier ?", answer: "Elle établit un nouvel échéancier sur le CRD réduit, avec durée ou mensualité ajustée selon votre choix." },
    ]),
  },

  "pret-taux-zero-ptz": {
    content: buildRichContent({
      intro:
        "Le Prêt à Taux Zéro (PTZ) est un dispositif d'aide à l'accession à la propriété réservé aux ménages modestes, soumis à des plafonds de revenus et de prix du bien selon la zone géographique.",
      definition:
        "Le PTZ est un prêt sans intérêts accordé par l'État pour financer l'achat d'un logement neuf ou ancien avec travaux, dans le respect de plafonds de ressources (fiscal de référence N-2) et de prix au m² selon la zone (A bis, A, B1, B2, C).",
      objectif:
        "Vérifier rapidement si votre foyer est éligible au PTZ selon vos revenus, la composition du ménage, la zone et le prix du bien envisagé.",
      variables: [
        "Revenu fiscal de référence du foyer (€)",
        "Nombre de personnes dans le ménage",
        "Zone géographique (A bis, A, B1, B2, C)",
        "Prix d'achat du bien (€)",
      ],
      formules: [
        hl("Plafond de revenus", "Comparaison du RFR du foyer au plafond PTZ selon zone et nombre de personnes"),
        hl("Plafond de prix", "Vérification que le prix d'achat ne dépasse pas le plafond au m² × surface"),
        p("Éligibilité = RFR ≤ plafond revenus ET prix ≤ plafond prix"),
      ],
      interpretation: [
        p("Une inéligibilité au PTZ ne signifie pas que votre projet est impossible : d'autres dispositifs (Action Logement, prêt conventionné) peuvent compléter votre financement."),
        hl("Zone B1", "En zone B1 pour 2 personnes, le plafond de revenus est de 42 000 € pour le PTZ 2024."),
      ],
      limitesCalcul: [
        "Plafonds simplifiés, à vérifier selon l'année et la réglementation en vigueur.",
        "Ne calcule pas le montant PTZ octroyé (quotité, différé).",
        "Primo-accédant et résidence principale supposés.",
      ],
      example: {
        title: "Couple en zone B1, revenus 45 000 €",
        donnees: [
          "Revenu fiscal : 45 000 €",
          "Ménage : 2 personnes",
          "Zone : B1",
          "Prix d'achat : 250 000 €",
        ],
        calcul: [
          "Plafond revenus B1 (2 pers.) = 42 000 €",
          "45 000 € > 42 000 € → dépassement du plafond",
        ],
        resultat: "Non éligible au PTZ : revenus supérieurs au plafond de 42 000 €.",
        interpretation:
          "Avec 45 000 € de revenus fiscaux, le foyer dépasse le plafond B1 de 3 000 €. Explorez le prêt Action Logement, le prêt conventionné ou un bien en zone C avec des plafonds plus élevés.",
      },
      maillage: [
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "frais-de-notaire", label: "Frais de notaire" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
      ],
      conseils: [
        "Vérifiez votre RFR sur l'avis d'imposition N-2 (année n-2 par rapport à l'achat).",
        "Le PTZ ne finance qu'une partie du projet : complétez avec un prêt principal.",
        "En cas de travaux dans l'ancien, le PTZ peut être mobilisé sous conditions.",
        "Consultez un courtier ou votre banque pour le montage financier complet.",
      ],
      limites: [
        "Plafonds mis à jour régulièrement par décret.",
        "Montant PTZ et différé de remboursement non calculés ici.",
      ],
    }),
    faq: buildFaq([
      { question: "Qui peut obtenir un PTZ ?", answer: "Les primo-accédants respectant les plafonds de revenus et achetant leur résidence principale." },
      { question: "Le PTZ est-il vraiment sans intérêts ?", answer: "Oui, le PTZ ne porte aucun intérêt. Seul le capital emprunté est remboursé." },
      { question: "Quels revenus sont pris en compte ?", answer: "Le revenu fiscal de référence du foyer, tel qu'indiqué sur l'avis d'imposition." },
      { question: "Peut-on cumuler PTZ et prêt immobilier classique ?", answer: "Oui, le PTZ complète généralement un prêt principal et parfois un prêt Action Logement." },
      { question: "Le PTZ s'applique-t-il à l'ancien ?", answer: "Oui, avec travaux représentant au moins 25 % du coût total de l'opération." },
      { question: "Quelle est la durée de remboursement du PTZ ?", answer: "Variable selon les revenus : différé possible (5, 10 ou 15 ans) puis remboursement sur 10, 12 ou 15 ans." },
      { question: "Que faire si je ne suis pas éligible ?", answer: "Envisagez le prêt Action Logement, le prêt conventionné ou un bien dans une zone à plafonds plus favorables." },
      { question: "Le prix du bien influence-t-il l'éligibilité ?", answer: "Oui, un plafond de prix au m² s'applique selon la zone et la surface du logement." },
      { question: "Faut-il être propriétaire de son logement actuel ?", answer: "Non, le PTZ est réservé aux primo-accédants qui n'ont pas été propriétaires des 2 dernières années." },
    ]),
  },

  "pret-relais": {
    content: buildRichContent({
      intro:
        "Le prêt relais permet de financer l'achat d'un nouveau logement en attendant la vente de votre bien actuel, en avançant une partie de la valeur estimée de ce dernier.",
      definition:
        "Le prêt relais est un crédit à court terme (généralement 12 à 24 mois) accordé sur la base de la valeur de revente estimée du bien à vendre. Il couvre une quotité (souvent 60 à 80 %) de cette valeur, déduction faite du capital restant dû sur l'ancien crédit.",
      objectif:
        "Estimer le montant du prêt relais mobilisable pour financer votre nouvel achat pendant la période de double détention.",
      variables: [
        "Valeur estimée de revente du bien actuel (€)",
        "Capital restant dû sur l'ancien crédit (€)",
        "Quotité accordée par la banque (%)",
      ],
      formules: [
        hl("Formule", "Prêt relais = (Valeur de revente × Quotité) − Capital restant dû"),
        p("Si le résultat est négatif, le prêt relais est nul : la vente ne libère pas assez de capacité d'emprunt."),
      ],
      interpretation: [
        p("Le montant du prêt relais représente la trésorerie que la banque vous avance en attendant la vente. Il doit être remboursé intégralement dès la signature de l'acte de vente de l'ancien bien."),
        hl("Double mensualité", "Pendant la période relais, vous payez les mensualités des deux crédits : prévoyez cette charge temporaire."),
      ],
      limitesCalcul: [
        "Estimation de valeur non garantie (expertise bancaire requise).",
        "Durée et taux du relais non modélisés.",
        "Frais et assurances non inclus.",
      ],
      example: {
        title: "Relais pour un bien estimé à 320 000 €",
        donnees: [
          "Valeur de revente : 320 000 €",
          "CRD ancien crédit : 80 000 €",
          "Quotité : 70 %",
        ],
        calcul: [
          "Avance sur valeur = 320 000 × 70 % = 224 000 €",
          "Prêt relais = 224 000 − 80 000 = 144 000 €",
        ],
        resultat: "Montant du prêt relais estimé : 144 000 €.",
        interpretation:
          "La banque peut vous avancer 144 000 € en attendant la vente. Ce montant sera remboursé à la vente, qui devrait libérer environ 240 000 € nets (320 000 − 80 000).",
      },
      maillage: [
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "frais-de-notaire", label: "Frais de notaire" },
      ],
      conseils: [
        "Faites estimer votre bien par plusieurs agents pour affiner la valeur de revente.",
        "Anticipez la double mensualité pendant la période de transition.",
        "Négociez la quotité et la durée du relais avec votre banque.",
        "Prévoyez une marge si la vente prend plus de temps que prévu.",
      ],
      limites: [
        "Montant dépendant de l'appréciation bancaire du bien.",
        "Conditions de remboursement et pénalités de retard non détaillées.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce qu'un prêt relais ?", answer: "Un crédit temporaire pour acheter un nouveau logement avant d'avoir vendu l'ancien." },
      { question: "Quelle quotité est généralement accordée ?", answer: "Entre 60 et 80 % de la valeur estimée de revente, selon la banque et le profil." },
      { question: "Que se passe-t-il si le bien ne se vend pas ?", answer: "Le relais doit être remboursé à l'échéance. Des prolongations ou renégociations sont parfois possibles." },
      { question: "Peut-on avoir un relais sans crédit en cours ?", answer: "Oui, si vous êtes propriétaire sans dette, le relais correspond à la quotité de la valeur du bien." },
      { question: "Le prêt relais coûte-t-il cher ?", answer: "Les taux sont généralement plus élevés qu'un crédit immobilier classique, sur une durée courte." },
      { question: "Faut-il vendre avant d'acheter ?", answer: "Pas obligatoirement : le relais permet d'acheter d'abord, mais implique une période de double charge." },
      { question: "Comment est estimée la valeur du bien ?", answer: "Par une expertise bancaire ou des estimations d'agents immobiliers retenues par la banque." },
      { question: "Le relais finance-t-il 100 % du nouveau bien ?", answer: "Non, il couvre seulement une partie. Un crédit principal complète le financement." },
    ]),
  },

  "rachat-credit-immobilier": {
    content: buildRichContent({
      intro:
        "Le rachat ou la renégociation de crédit immobilier permet de profiter d'un taux plus bas pour réduire vos mensualités ou le coût total, sous réserve de frais de dossier et d'éventuelles pénalités.",
      definition:
        "Le rachat de crédit consiste à remplacer votre prêt en cours par un nouveau contrat, généralement à taux inférieur. La banque solde l'ancien crédit et établit un nouvel échéancier. Des frais de dossier, de garantie et parfois des IRA peuvent s'appliquer.",
      objectif:
        "Comparer l'ancienne et la nouvelle mensualité pour estimer l'économie mensuelle et le gain global sur la durée restante, après frais.",
      variables: [
        "Capital restant dû (€)",
        "Taux actuel du prêt (%)",
        "Nouveau taux proposé (%)",
        "Durée restante (mois)",
        "Frais de rachat (€)",
      ],
      formules: [
        hl("Mensualité", "Recalculée sur le CRD avec le nouveau taux et la durée restante"),
        p("Économie mensuelle = Mensualité actuelle − Nouvelle mensualité"),
      ],
      interpretation: [
        p("Une économie mensuelle modeste peut représenter plusieurs milliers d'euros sur la durée restante. Comparez toujours le gain total aux frais de rachat."),
        hl("Seuil de rentabilité", "Le rachat est intéressant si les économies dépassent les frais sur la durée envisagée."),
      ],
      limitesCalcul: [
        "Assurance emprunteur non recalculée séparément.",
        "IRA de l'ancien prêteur non toujours incluses.",
        "Acceptation bancaire non garantie.",
      ],
      example: {
        title: "Rachat d'un crédit à 4,2 % vers 3,5 %",
        donnees: [
          "CRD : 180 000 €",
          "Taux actuel : 4,2 %",
          "Nouveau taux : 3,5 %",
          "Durée restante : 180 mois",
          "Frais de rachat : 2 500 €",
        ],
        calcul: [
          "Mensualité actuelle ≈ 1 350 €",
          "Nouvelle mensualité ≈ 1 287 €",
          "Économie mensuelle ≈ 63 €",
        ],
        resultat: "Économie mensuelle estimée : environ 63 €/mois.",
        interpretation:
          "Sur 180 mois, l'économie brute atteint environ 11 340 €, soit un gain net d'environ 8 840 € après frais. Le rachat est rentable si vous conservez le crédit plusieurs années.",
      },
      maillage: [
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "cout-total-credit-immobilier", label: "Coût total du crédit" },
        { slug: "assurance-emprunteur", label: "Assurance emprunteur" },
      ],
      conseils: [
        "Demandez d'abord une renégociation interne à votre banque actuelle.",
        "Comparez plusieurs offres de rachat incluant assurance et frais.",
        "Calculez le délai de retour sur investissement des frais de rachat.",
        "Vérifiez les conditions de votre contrat actuel (IRA, pénalités).",
      ],
      limites: [
        "Estimation sans garantie d'acceptation bancaire.",
        "Assurance et garantie non détaillées.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce qu'un rachat de crédit immobilier ?", answer: "Le remplacement de votre prêt en cours par un nouveau contrat, souvent à taux plus avantageux." },
      { question: "Quand racheter son crédit ?", answer: "Quand les taux du marché sont nettement inférieurs à votre taux actuel et que les frais restent raisonnables." },
      { question: "Quels frais prévoir ?", answer: "Frais de dossier, frais de garantie, frais de mainlevée et éventuelles IRA." },
      { question: "Peut-on racheter chez une autre banque ?", answer: "Oui, c'est le rachat externe. La renégociation interne se fait auprès de votre banque actuelle." },
      { question: "Le rachat allonge-t-il la durée ?", answer: "Pas nécessairement : vous pouvez conserver la durée restante pour maximiser les économies." },
      { question: "L'assurance emprunteur peut-elle être changée ?", answer: "Oui, le rachat est l'occasion de souscrire une délégation d'assurance moins chère." },
      { question: "Combien d'économies espérer ?", answer: "Variable selon l'écart de taux et le CRD. Même 50 €/mois représentent 9 000 € sur 15 ans." },
      { question: "Faut-il un apport pour un rachat ?", answer: "Non, le rachat porte sur le capital restant dû sans apport supplémentaire." },
      { question: "La renégociation interne est-elle moins chère ?", answer: "Souvent oui, car elle évite les frais de mainlevée et de nouveau dossier complet." },
    ]),
  },

  "assurance-emprunteur": {
    content: buildRichContent({
      intro:
        "L'assurance emprunteur est obligatoire pour obtenir un crédit immobilier. Son coût, souvent sous-estimé, peut représenter plusieurs milliers d'euros sur la durée du prêt.",
      definition:
        "L'assurance emprunteur (ou assurance de prêt) garantit le remboursement du crédit en cas de décès, invalidité ou parfois perte d'emploi. Elle est exprimée en pourcentage du capital emprunté, appliqué annuellement.",
      objectif:
        "Estimer le coût mensuel et total de l'assurance emprunteur pour l'intégrer à votre budget et comparer les offres (banque vs délégation).",
      variables: [
        "Capital emprunté (€)",
        "Taux d'assurance annuel (% du capital)",
        "Durée du prêt (années)",
      ],
      formules: [
        hl("Coût annuel", "Assurance annuelle = Capital × Taux assurance / 100"),
        hl("Coût mensuel", "Assurance mensuelle = Coût annuel / 12"),
        p("Coût total = Coût annuel × Durée en années"),
      ],
      interpretation: [
        p("Un taux d'assurance de 0,30 à 0,40 % est courant chez les banques. La délégation d'assurance peut réduire ce taux de 30 à 60 % pour un profil en bonne santé."),
        hl("Impact budget", "Sur 250 000 €, 0,32 % représente environ 67 €/mois, soit près de 16 000 € sur 20 ans."),
      ],
      limitesCalcul: [
        "Taux fixe sur capital initial (estimation haute).",
        "En pratique, l'assurance décroît avec le capital restant dû.",
        "Quotités et garanties (ITT, IPT) non détaillées.",
      ],
      example: {
        title: "Assurance sur un prêt de 250 000 € sur 20 ans",
        donnees: [
          "Capital : 250 000 €",
          "Taux assurance : 0,32 %/an",
          "Durée : 20 ans",
        ],
        calcul: [
          "Coût annuel = 250 000 × 0,32 % = 800 €",
          "Coût mensuel = 800 / 12 = 66,67 €",
          "Coût total = 800 × 20 = 16 000 €",
        ],
        resultat: "Assurance : 66,67 €/mois — coût total : 16 000 € sur 20 ans.",
        interpretation:
          "L'assurance représente 6,4 % du capital emprunté. Comparez les offres de délégation : un taux à 0,15 % diviserait ce coût par deux.",
      },
      maillage: [
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "cout-total-credit-immobilier", label: "Coût total du crédit" },
      ],
      conseils: [
        "Comparez systématiquement l'assurance groupe bancaire et la délégation externe.",
        "Adaptez les garanties à votre situation (ITT, IPT selon votre métier).",
        "Respectez l'équivalence des garanties exigée par la banque (Loi Lemoine).",
        "Révisez votre assurance en cas de changement de situation (non-fumeur, etc.).",
      ],
      limites: [
        "Estimation sur capital initial constant.",
        "Tarification selon âge et état de santé non modélisée.",
      ],
    }),
    faq: buildFaq([
      { question: "L'assurance emprunteur est-elle obligatoire ?", answer: "Oui, les banques l'exigent pour couvrir le risque de non-remboursement." },
      { question: "Peut-on choisir son assurance ?", answer: "Oui, depuis la loi Lagarde puis Lemoine, vous pouvez souscrire une délégation externe." },
      { question: "Comment est calculé le coût ?", answer: "En pourcentage du capital emprunté, appliqué chaque année sur la durée du prêt." },
      { question: "Quelle est la différence groupe vs délégation ?", answer: "L'assurance groupe est celle proposée par la banque. La délégation est souscrite auprès d'un assureur externe, souvent moins cher." },
      { question: "Le taux d'assurance diminue-t-il avec le temps ?", answer: "En délégation, oui souvent (sur CRD). En groupe bancaire, il est fréquemment fixe sur le capital initial." },
      { question: "Quelles garanties minimum ?", answer: "Décès et invalidité permanente totale (IPT) sont généralement exigées." },
      { question: "Peut-on changer d'assurance en cours de prêt ?", answer: "Oui, à chaque date anniversaire (Loi Hamon) ou à tout moment (Loi Lemoine) avec équivalence des garanties." },
      { question: "L'assurance couvre-t-elle le chômage ?", answer: "La garantie perte d'emploi (PE) est facultative et payante en supplément." },
      { question: "Comment réduire le coût de l'assurance ?", answer: "Comparer les délégations, adapter les quotités, cesser de fumer, choisir des garanties proportionnées." },
    ]),
  },

  "frais-agence-immobiliere": {
    content: buildRichContent({
      intro:
        "Les honoraires d'agence immobilière s'ajoutent au prix d'achat lorsque la commission est à la charge de l'acquéreur. Ce poste peut représenter plusieurs milliers d'euros selon le prix du bien et le taux appliqué.",
      definition:
        "Les frais d'agence correspondent à la rémunération de l'agent immobilier pour la mise en vente, la visite et la négociation. Ils sont exprimés en pourcentage du prix de vente (généralement 3 à 8 %) et peuvent être à la charge du vendeur ou de l'acquéreur.",
      objectif:
        "Estimer le montant des honoraires d'agence à intégrer dans votre budget d'acquisition total, selon qui les supporte.",
      variables: [
        "Prix de vente du bien (€)",
        "Taux d'honoraires d'agence (%)",
        "Prise en charge : acquéreur ou vendeur",
      ],
      formules: [
        hl("Formule", "Honoraires = Prix de vente × Taux d'agence / 100"),
        p("Si la charge est à l'acquéreur, les honoraires s'ajoutent au prix affiché pour obtenir le budget total."),
      ],
      interpretation: [
        p("Un bien affiché « FAI » (Frais d'Agence Inclus) inclut déjà les honoraires dans le prix. En « net vendeur », l'acquéreur les paie en supplément."),
        hl("Budget total", "Pour 280 000 € à 5 % acquéreur, prévoyez 14 000 € d'honoraires en plus du prix."),
      ],
      limitesCalcul: [
        "Taux librement négociable entre agence et mandant.",
        "Double agence (co-mandat) non modélisée.",
        "TVA incluse dans le taux saisi.",
      ],
      example: {
        title: "Bien à 280 000 €, honoraires 5 % acquéreur",
        donnees: [
          "Prix de vente : 280 000 €",
          "Taux agence : 5 %",
          "Charge : acquéreur",
        ],
        calcul: [
          "Honoraires = 280 000 × 5 % = 14 000 €",
          "Budget total = 280 000 + 14 000 = 294 000 €",
        ],
        resultat: "Honoraires d'agence : 14 000 € à la charge de l'acquéreur.",
        interpretation:
          "Le prix affiché « net vendeur » masque 14 000 € de frais. Intégrez-les à votre apport et à votre capacité d'emprunt, en plus des frais de notaire.",
      },
      maillage: [
        { slug: "frais-de-notaire", label: "Frais de notaire" },
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "budget-travaux", label: "Budget travaux" },
      ],
      conseils: [
        "Vérifiez si le prix est FAI ou net vendeur avant toute offre.",
        "Les honoraires sont négociables, surtout en mandat exclusif.",
        "Comparez le coût total (prix + agence + notaire) entre plusieurs biens.",
        "Demandez le détail des honoraires dans le compromis de vente.",
      ],
      limites: [
        "Taux variable selon les agences et les zones.",
        "Ne remplace pas le mandat de vente.",
      ],
    }),
    faq: buildFaq([
      { question: "Qui paie les honoraires d'agence ?", answer: "Le vendeur ou l'acquéreur, selon ce qui est indiqué dans l'annonce et le mandat." },
      { question: "Que signifie FAI ?", answer: "Frais d'Agence Inclus : le prix affiché comprend déjà les honoraires." },
      { question: "Quel est le taux moyen des agences ?", answer: "Entre 3 et 8 % du prix de vente, souvent autour de 4 à 5 % en province et 5 à 6 % en zone tendue." },
      { question: "Les honoraires sont-ils négociables ?", answer: "Oui, surtout si le bien est en mandat simple ou si la vente est rapide." },
      { question: "Peut-on financer les honoraires par le crédit ?", answer: "Rarement directement. Ils doivent généralement être payés via l'apport personnel." },
      { question: "Les honoraires incluent-ils la TVA ?", answer: "Oui, les honoraires TTC incluent la TVA à 20 %." },
      { question: "Différence avec les frais de notaire ?", answer: "Les honoraires d'agence rémunèrent l'agent immobilier. Les frais de notaire couvrent les droits de mutation et les émoluments notariaux." },
      { question: "Faut-il payer l'agence si on achète sans intermédiaire ?", answer: "Non, en vente entre particuliers (PAP), il n'y a pas d'honoraires d'agence." },
    ]),
  },

  "frais-garantie-emprunt": {
    content: buildRichContent({
      intro:
        "La garantie de prêt (hypothèque, caution Crédit Logement ou IPPD) protège la banque en cas de défaut de remboursement. Elle représente un coût non négligeable à intégrer dans votre plan de financement.",
      definition:
        "La garantie emprunt est une sûreté exigée par le prêteur : l'hypothèque (inscription au bureau des hypothèques), la caution bancaire (Crédit Logement, Camca) ou le privilège de prêteur de deniers (PPD). Chaque type a un coût et des modalités de mainlevée différents.",
      objectif:
        "Estimer le coût de la garantie selon le montant emprunté et le type choisi, pour compléter le budget global de votre acquisition.",
      variables: [
        "Montant emprunté (€)",
        "Type de garantie : hypothèque, caution ou PPD",
        "Durée du prêt (années)",
      ],
      formules: [
        hl("Hypothèque", "Frais = Montant × ~1,5 % + frais de mainlevée futurs"),
        hl("Caution", "Frais = Montant × ~1,2 à 1,5 % + commission de caution"),
        p("Les taux varient selon l'organisme et le profil emprunteur."),
      ],
      interpretation: [
        p("La caution est souvent moins chère à la souscription que l'hypothèque, mais une commission de mainlevée s'applique au remboursement. L'hypothèque coûte plus cher initialement mais la mainlevée est moins onéreuse."),
        hl("Ordre de grandeur", "Pour 250 000 € en caution sur 20 ans, comptez environ 8 500 €."),
      ],
      limitesCalcul: [
        "Barèmes indicatifs, tarifs réels selon l'organisme.",
        "Frais de mainlevée non détaillés.",
        "Garantie hypothécaire avec frais notariaux non ventilés.",
      ],
      example: {
        title: "Garantie caution pour 250 000 € sur 20 ans",
        donnees: [
          "Montant emprunté : 250 000 €",
          "Type : caution (Crédit Logement)",
          "Durée : 20 ans",
        ],
        calcul: [
          "Frais de caution ≈ 250 000 × 3,4 % = 8 500 €",
          "Dont commission de caution et frais de dossier",
        ],
        resultat: "Frais de garantie estimés : environ 8 500 €.",
        interpretation:
          "Ce montant est généralement financé dans le crédit ou payé à la signature. Comparez avec l'hypothèque : parfois plus chère à la souscription, elle peut être plus économique sur la durée totale.",
      },
      maillage: [
        { slug: "frais-de-notaire", label: "Frais de notaire" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
      ],
      conseils: [
        "Comparez hypothèque et caution sur le coût total (souscription + mainlevée).",
        "La caution est souvent imposée par la banque selon le montant emprunté.",
        "Négociez les frais de dossier de garantie avec votre courtier.",
        "Prévoyez les frais de mainlevée lors de la revente ou du remboursement.",
      ],
      limites: [
        "Tarifs indicatifs selon les barèmes 2024.",
        "Choix de garantie souvent imposé par le prêteur.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce qu'une garantie de prêt ?", answer: "Une sûreté permettant à la banque de récupérer le bien en cas de défaut de remboursement." },
      { question: "Quelle garantie choisir ?", answer: "La caution est souvent moins chère à la souscription. L'hypothèque peut être plus avantageuse sur le long terme." },
      { question: "Peut-on éviter la garantie ?", answer: "Non, toute banque exige une garantie pour un crédit immobilier." },
      { question: "Qu'est-ce que Crédit Logement ?", answer: "Un organisme de cautionnement mutualisé, très utilisé en France pour les prêts immobiliers." },
      { question: "Les frais de garantie sont-ils financés ?", answer: "Souvent oui, intégrés au montant emprunté, ce qui augmente légèrement la mensualité." },
      { question: "Quand payer la mainlevée ?", answer: "Au remboursement total du crédit ou à la revente du bien, pour libérer l'hypothèque ou la caution." },
      { question: "Hypothèque ou caution pour un investisseur ?", answer: "Les deux sont possibles. Comparez le coût total et la facilité de mainlevée en cas de revente." },
      { question: "La garantie couvre-t-elle 100 % du prêt ?", answer: "Généralement oui, ou un pourcentage élevé (70 à 120 % selon le type)." },
    ]),
  },

  "effort-epargne-immobilier": {
    content: buildRichContent({
      intro:
        "Constituer un apport suffisant est souvent la première étape d'un projet immobilier. Ce simulateur estime le délai nécessaire pour atteindre votre objectif d'épargne à partir de votre capacité mensuelle.",
      definition:
        "L'effort d'épargne immobilier mesure le temps et la discipline requis pour accumuler l'apport personnel nécessaire à votre acquisition : apport sur le prix, frais de notaire, frais de garantie et éventuels travaux.",
      objectif:
        "Planifier votre calendrier d'épargne en calculant combien de mois seront nécessaires pour atteindre votre objectif, compte tenu de votre épargne actuelle et de vos versements mensuels.",
      variables: [
        "Objectif d'épargne total (€)",
        "Épargne déjà disponible (€)",
        "Versement mensuel prévu (€/mois)",
      ],
      formules: [
        hl("Reste à épargner", "Reste = Objectif − Épargne actuelle"),
        hl("Durée", "Nombre de mois = Reste à épargner / Versement mensuel (arrondi supérieur)"),
      ],
      interpretation: [
        p("Un délai long peut retarder votre projet immobilier mais garantit un apport confortable, améliorant vos conditions bancaires. Un apport de 10 à 20 % du prix est généralement recommandé."),
        hl("Planification", "64 mois représentent plus de 5 ans : ajustez l'objectif ou augmentez les versements si le délai est trop long."),
      ],
      limitesCalcul: [
        "Rendement de l'épargne non pris en compte.",
        "Inflation et hausse des prix immobiliers non modélisées.",
        "Versements constants supposés.",
      ],
      example: {
        title: "Objectif d'apport de 40 000 €",
        donnees: [
          "Objectif : 40 000 €",
          "Épargne actuelle : 8 000 €",
          "Versement mensuel : 500 €",
        ],
        calcul: [
          "Reste à épargner = 40 000 − 8 000 = 32 000 €",
          "Durée = 32 000 / 500 = 64 mois",
        ],
        resultat: "Durée estimée : 64 mois, soit environ 5 ans et 4 mois.",
        interpretation:
          "À 500 €/mois, il faudra plus de 5 ans pour atteindre 40 000 €. Envisagez d'augmenter les versements à 700 €/mois pour réduire le délai à 46 mois, ou d'ajuster l'objectif.",
      },
      maillage: [
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
        { slug: "frais-de-notaire", label: "Frais de notaire" },
        { slug: "frais-garantie-emprunt", label: "Frais de garantie emprunt" },
      ],
      conseils: [
        "Placez votre épargne sur un livret ou PEL pour la sécuriser.",
        "Intégrez frais de notaire et garantie dans l'objectif total.",
        "Automatisez les virements mensuels pour maintenir la discipline.",
        "Réévaluez l'objectif si les prix immobiliers évoluent fortement.",
      ],
      limites: [
        "Sans rendement financier ni revalorisation.",
        "Ne remplace pas un conseil en gestion de patrimoine.",
      ],
    }),
    faq: buildFaq([
      { question: "Quel apport viser pour un achat immobilier ?", answer: "Au minimum 10 % du prix, idéalement 15 à 20 % pour couvrir aussi les frais annexes." },
      { question: "L'épargne inclut-elle les frais de notaire ?", answer: "Oui, votre objectif devrait couvrir apport + frais de notaire + garantie." },
      { question: "Peut-on acheter sans apport ?", answer: "C'est devenu rare depuis 2022. Certaines banques acceptent 10 % de frais uniquement." },
      { question: "Où placer son épargne immobilière ?", answer: "Livret A, LDDS ou PEL pour la sécurité. Évitez les placements volatils à court terme." },
      { question: "Comment accélérer l'épargne ?", answer: "Augmenter les versements, réduire les dépenses, percevoir des primes ou un héritage." },
      { question: "Faut-il tout épargner avant de chercher ?", answer: "Non, commencez la recherche quand vous avez au moins 70 % de l'objectif, le reste s'accumulant pendant le processus." },
      { question: "Le PEL est-il utile pour l'apport ?", answer: "Oui, il offre un taux de prêt avantageux en plus de l'épargne constituée." },
      { question: "Peut-on utiliser un don familial comme apport ?", answer: "Oui, les dons familiaux sont acceptés par les banques comme apport personnel." },
    ]),
  },

  "impact-hausse-taux": {
    content: buildRichContent({
      intro:
        "Une hausse des taux d'intérêt impacte directement votre mensualité et votre taux d'endettement. Anticiper cet effet est crucial pour sécuriser votre projet ou renégocier votre prêt.",
      definition:
        "L'impact d'une hausse de taux mesure la variation de la mensualité de crédit et du taux d'endettement lorsque le taux nominal augmente, à capital et durée constants.",
      objectif:
        "Quantifier l'augmentation de mensualité et le nouveau taux d'endettement en cas de hausse des taux, pour évaluer la viabilité de votre financement.",
      variables: [
        "Capital emprunté (€)",
        "Taux actuel (%)",
        "Nouveau taux simulé (%)",
        "Durée restante (années)",
        "Revenus mensuels nets (€)",
      ],
      formules: [
        hl("Mensualité", "Recalculée selon la formule d'amortissement constant pour chaque taux"),
        p("Variation mensualité = Mensualité nouveau taux − Mensualité taux actuel"),
        hl("Endettement", "Taux d'endettement = (Mensualité + autres charges) / Revenus × 100"),
      ],
      interpretation: [
        p("Un écart d'un point de taux peut ajouter plus de 100 € à la mensualité sur 200 000 € empruntés. Vérifiez que le nouveau taux d'endettement reste sous 35 %."),
        hl("Alerte", "Une hausse de 3,2 % à 4,2 % peut faire basculer un dossier au-dessus du plafond bancaire."),
      ],
      limitesCalcul: [
        "Autres charges de crédit non incluses dans l'endettement simulé.",
        "Assurance emprunteur non recalculée.",
        "Taux fixe uniquement.",
      ],
      example: {
        title: "Hausse de taux sur 200 000 € sur 18 ans",
        donnees: [
          "Capital : 200 000 €",
          "Taux actuel : 3,2 %",
          "Nouveau taux : 4,2 %",
          "Durée : 18 ans",
          "Revenus : 3 800 €/mois",
        ],
        calcul: [
          "Mensualité à 3,2 % ≈ 1 250 €",
          "Mensualité à 4,2 % ≈ 1 352 €",
          "Variation ≈ +102 €/mois",
          "Endettement = 1 352 / 3 800 × 100 = 43,98 %",
        ],
        resultat: "Hausse de mensualité : +102 €/mois — endettement : 43,98 %.",
        interpretation:
          "Avec ce nouveau taux, le taux d'endettement dépasse largement les 35 % recommandés. Envisagez un apport plus important, une durée plus longue ou un bien moins cher.",
      },
      maillage: [
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "taux-endettement", label: "Taux d'endettement" },
        { slug: "capacite-emprunt", label: "Capacité d'emprunt" },
      ],
      conseils: [
        "Verrouillez votre taux avec une offre de prêt ferme dès que possible.",
        "Simulez plusieurs scénarios de hausse avant de vous engager.",
        "Maintenez une épargne de précaution pour absorber une hausse future.",
        "En cas de hausse, explorez la renégociation ou le rachat de crédit.",
      ],
      limites: [
        "Scénario théorique sans garantie de taux futur.",
        "Autres charges du foyer non intégrées.",
      ],
    }),
    faq: buildFaq([
      { question: "De combien augmente la mensualité si le taux monte d'1 point ?", answer: "Sur 200 000 € sur 20 ans, environ 100 à 110 € par mois." },
      { question: "Comment se protéger d'une hausse des taux ?", answer: "Privilégiez un taux fixe et verrouillez-le avec une offre de prêt à taux fixe." },
      { question: "Le taux variable est-il risqué ?", answer: "Oui, la mensualité fluctue avec les taux du marché, avec un risque de hausse significative." },
      { question: "Peut-on renégocier si les taux baissent après ?", answer: "Oui, via une renégociation interne ou un rachat de crédit." },
      { question: "La hausse de taux affecte-t-elle la capacité d'emprunt ?", answer: "Oui, à revenus constants, une hausse de taux réduit le montant empruntable." },
      { question: "Quel impact sur le coût total du crédit ?", answer: "Chaque point de taux supplémentaire peut coûter des dizaines de milliers d'euros sur la durée." },
      { question: "Les taux vont-ils remonter ?", answer: "Impossible à prédire. Simulez plusieurs scénarios pour vous prémunir." },
      { question: "L'assurance change-t-elle avec le taux ?", answer: "Non, l'assurance est indépendante du taux d'intérêt du crédit." },
    ]),
  },

  "credit-travaux": {
    content: buildRichContent({
      intro:
        "Le crédit travaux finance la rénovation ou l'amélioration de votre logement. Comprendre sa mensualité et son coût total vous aide à dimensionner votre budget rénovation.",
      definition:
        "Le crédit travaux est un prêt amortissable dédié au financement de travaux de rénovation, d'agrandissement ou d'amélioration énergétique. Il peut être souscrit auprès d'une banque, d'un établissement spécialisé ou via un éco-PTZ.",
      objectif:
        "Estimer la mensualité et le coût total d'un crédit travaux selon le montant, le taux, la durée et l'assurance emprunteur.",
      variables: [
        "Montant des travaux financés (€)",
        "Taux d'intérêt annuel (%)",
        "Durée du prêt (années)",
        "Taux d'assurance emprunteur (%/an)",
      ],
      formules: [
        hl("Mensualité", "Calculée selon l'amortissement constant sur la durée choisie"),
        p("Coût total = (Mensualité × durée en mois) + coût assurance cumulé"),
      ],
      interpretation: [
        p("Une durée courte limite le coût des intérêts mais augmente la mensualité. Pour 35 000 € sur 7 ans, comptez environ 495 €/mois hors assurance."),
        hl("Aides", "Vérifiez les aides (MaPrimeRénov', éco-PTZ) qui peuvent réduire le montant à financer."),
      ],
      limitesCalcul: [
        "Frais de dossier non inclus.",
        "Aides publiques non déduites automatiquement.",
        "Taux fixe uniquement.",
      ],
      example: {
        title: "Crédit travaux de 35 000 € sur 7 ans",
        donnees: [
          "Montant : 35 000 €",
          "Taux : 4,5 %",
          "Durée : 7 ans",
          "Assurance : 0,30 %/an",
        ],
        calcul: [
          "Mensualité hors assurance ≈ 495 €",
          "Assurance mensuelle ≈ 8,75 €",
          "Mensualité totale ≈ 504 €",
        ],
        resultat: "Mensualité estimée : environ 495 €/mois (hors assurance).",
        interpretation:
          "Sur 7 ans, ce crédit représente une charge mensuelle modérée. Croisez ce montant avec votre taux d'endettement global si vous avez déjà un crédit immobilier.",
      },
      maillage: [
        { slug: "budget-travaux", label: "Budget travaux" },
        { slug: "rentabilite-apres-travaux", label: "Rentabilité après travaux" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
      ],
      conseils: [
        "Demandez plusieurs devis avant de chiffrer le montant à emprunter.",
        "Explorez l'éco-PTZ à taux zéro pour les travaux énergétiques.",
        "Cumulez avec MaPrimeRénov' pour réduire le financement nécessaire.",
        "Privilégiez une durée compatible avec la durée de vie des travaux.",
      ],
      limites: [
        "Estimation sans devis travaux détaillé.",
        "Conditions d'éligibilité aux aides non vérifiées.",
      ],
    }),
    faq: buildFaq([
      { question: "Quel taux pour un crédit travaux ?", answer: "Entre 3 et 6 % selon le montant, la durée et votre profil bancaire." },
      { question: "Peut-on cumuler crédit travaux et prêt immobilier ?", answer: "Oui, mais la mensualité totale doit respecter le taux d'endettement de 35 %." },
      { question: "Qu'est-ce que l'éco-PTZ ?", answer: "Un prêt à taux zéro pour financer des travaux de rénovation énergétique, sous conditions." },
      { question: "Faut-il justifier les travaux à la banque ?", answer: "Oui, des devis ou factures sont généralement exigés avant le déblocage des fonds." },
      { question: "Quelle durée maximale ?", answer: "Généralement 7 à 10 ans pour un crédit travaux classique, jusqu'à 20 ans pour l'éco-PTZ." },
      { question: "Le crédit travaux est-il déductible ?", answer: "Non pour un logement principal. En location, les intérêts peuvent être déductibles au régime réel." },
      { question: "Peut-on financer des travaux d'agrandissement ?", answer: "Oui, si les travaux améliorent le logement et sont réalisés par des professionnels." },
      { question: "Assurance emprunteur obligatoire ?", answer: "Souvent oui, surtout pour les montants élevés. Elle peut être facultative pour les petits crédits travaux." },
    ]),
  },

  "plus-value-immobiliere": {
    content: buildRichContent({
      intro:
        "Lors de la revente d'un bien immobilier, la plus-value réalisée peut être soumise à l'impôt. Ce simulateur estime le montant de la plus-value imposable et l'impôt correspondant.",
      definition:
        "La plus-value immobilière est la différence entre le prix de vente net et le prix d'acquisition majoré des frais et travaux. Elle est imposable à 19 % (impôt sur le revenu) plus 17,2 % de prélèvements sociaux, avec des abattements pour durée de détention.",
      objectif:
        "Estimer la plus-value brute, les abattements applicables et l'impôt total à payer lors de la cession d'un bien immobilier.",
      variables: [
        "Prix d'achat du bien (€)",
        "Frais d'acquisition (notaire, agence)",
        "Travaux déductibles (€)",
        "Prix de vente net (€)",
        "Durée de détention (années)",
      ],
      formules: [
        hl("Plus-value brute", "PV = Prix de vente − (Prix d'achat + Frais + Travaux)"),
        hl("Abattements", "Abattement IR et PS selon barème de durée de détention (exonération totale IR à 22 ans, PS à 30 ans)"),
        p("Impôt = Plus-value imposable × (19 % + 17,2 % prélèvements sociaux)"),
      ],
      interpretation: [
        p("Plus la durée de détention est longue, plus les abattements réduisent l'impôt. Au-delà de 22 ans, l'impôt sur le revenu est nul ; au-delà de 30 ans, les prélèvements sociaux aussi."),
        hl("Résidence principale", "La vente de la résidence principale est exonérée de plus-value."),
      ],
      limitesCalcul: [
        "Abattements simplifiés selon durée.",
        "Résidence principale supposée non exonérée (investissement locatif).",
        "Surtaxe plus-values élevées non incluse.",
      ],
      example: {
        title: "Revente après 12 ans de détention",
        donnees: [
          "Prix d'achat : 200 000 €",
          "Frais d'acquisition : 16 000 €",
          "Travaux : 15 000 €",
          "Prix de vente : 280 000 €",
          "Détention : 12 ans",
        ],
        calcul: [
          "Prix d'acquisition majoré = 200 000 + 16 000 + 15 000 = 231 000 €",
          "Plus-value brute = 280 000 − 231 000 = 49 000 €",
          "Abattements appliqués → impôt estimé ≈ 7 095 €",
        ],
        resultat: "Plus-value brute : 49 000 € — impôt estimé : environ 7 095 €.",
        interpretation:
          "Après 12 ans, les abattements réduisent l'impôt mais une taxation significative subsiste. Attendre 22 ans exonérerait l'impôt sur le revenu sur cette plus-value.",
      },
      maillage: [
        { slug: "rendement-locatif", label: "Rendement locatif" },
        { slug: "rentabilite-lmnp", label: "Rentabilité LMNP" },
        { slug: "frais-de-notaire", label: "Frais de notaire" },
      ],
      conseils: [
        "Conservez tous les justificatifs de travaux et frais d'acquisition.",
        "La résidence principale est exonérée : vérifiez votre situation.",
        "Envisagez le report d'imposition en cas de réinvestissement.",
        "Planifiez la cession selon les seuils d'exonération (22 et 30 ans).",
      ],
      limites: [
        "Barème d'abattement simplifié.",
        "Cas particuliers (indivision, SCI) non traités.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que la plus-value immobilière ?", answer: "Le gain réalisé lors de la revente d'un bien, égal à la différence entre prix de vente et coût d'acquisition." },
      { question: "La résidence principale est-elle imposable ?", answer: "Non, sa vente est exonérée de plus-value immobilière." },
      { question: "Quels abattements pour durée de détention ?", answer: "6 %/an de la 6e à la 21e année, 4 % la 22e (exonération IR). Prélèvements sociaux : 1,65 %/an de la 6e à la 21e, 1,60 % la 22e à la 30e." },
      { question: "Les travaux sont-ils déductibles ?", answer: "Oui, s'ils sont justifiés par factures ou via un forfait de 15 % si détention > 5 ans." },
      { question: "Quel est le taux d'imposition ?", answer: "19 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux sur la plus-value imposable." },
      { question: "Peut-on reporter l'impôt ?", answer: "Oui, en cas de réinvestissement dans une résidence principale sous conditions." },
      { question: "Y a-t-il une surtaxe pour grosses plus-values ?", answer: "Oui, une surtaxe s'applique au-delà de 50 000 € de plus-value imposable." },
      { question: "Comment calculer le prix de vente net ?", answer: "Prix de vente moins frais de mutation (diagnostics, etc.) supportés par le vendeur." },
    ]),
  },

  "rendement-locatif-brut": {
    content: buildRichContent({
      intro:
        "Le rendement locatif brut mesure le rapport entre les loyers annuels perçus et le coût total d'acquisition du bien. C'est le premier indicateur pour comparer des investissements immobiliers.",
      definition:
        "Le rendement brut est le ratio entre le loyer annuel (loyer mensuel × 12) et l'investissement total (prix d'achat + frais de notaire + frais d'agence + travaux éventuels), exprimé en pourcentage.",
      objectif:
        "Obtenir un premier ordre de grandeur de la rentabilité d'un bien locatif avant d'intégrer charges, vacance locative et fiscalité.",
      variables: [
        "Prix d'achat (€)",
        "Frais de notaire (€)",
        "Frais d'agence et travaux (€)",
        "Loyer mensuel hors charges (€)",
      ],
      formules: [
        hl("Formule", "Rendement brut = (Loyer mensuel × 12) / Investissement total × 100"),
        p("Investissement total = Prix d'achat + Frais de notaire + Frais d'agence + Travaux"),
      ],
      interpretation: [
        p("Un rendement brut de 5 % est considéré comme correct en province. En zone tendue (Paris, Lyon), 3 à 4 % est courant, compensé par un potentiel de plus-value."),
        hl("Limite", "Le rendement brut ignore charges, impôts et vacance : le rendement net sera toujours inférieur."),
      ],
      limitesCalcul: [
        "Ne tient pas compte de la vacance locative.",
        "Charges de copropriété et taxe foncière exclues.",
        "Crédit et fiscalité non intégrés.",
      ],
      example: {
        title: "Appartement loué 850 €/mois",
        donnees: [
          "Prix d'achat : 180 000 €",
          "Frais de notaire : 14 400 €",
          "Frais divers : 8 000 €",
          "Loyer : 850 €/mois",
        ],
        calcul: [
          "Investissement total = 180 000 + 14 400 + 8 000 = 202 400 €",
          "Loyers annuels = 850 × 12 = 10 200 €",
          "Rendement brut = 10 200 / 202 400 × 100 = 5,04 %",
        ],
        resultat: "Rendement locatif brut : 5,04 %.",
        interpretation:
          "Avec 5 % brut, ce bien est au-dessus de la moyenne nationale. Affinez avec le rendement net en intégrant charges et vacance pour une vision réaliste.",
      },
      maillage: [
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "rendement-locatif", label: "Rendement locatif" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
      ],
      conseils: [
        "Comparez toujours le rendement brut avec d'autres biens de la même zone.",
        "Intégrez tous les frais d'acquisition dans l'investissement total.",
        "Un rendement brut élevé peut masquer des charges importantes.",
        "Croisez avec le cash-flow si le bien est financé à crédit.",
      ],
      limites: [
        "Indicateur simplifié, non suffisant seul pour décider.",
        "Ne reflète pas la fiscalité ni le financement.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que le rendement locatif brut ?", answer: "Le rapport entre les loyers annuels et le coût total d'acquisition, avant charges." },
      { question: "Quel rendement brut viser ?", answer: "5 à 7 % en province, 3 à 4 % en zone tendue. Au-delà de 8 %, vérifiez la qualité du bien." },
      { question: "Différence brut et net ?", answer: "Le net déduit charges, vacance, taxe foncière et parfois fiscalité." },
      { question: "Les frais de notaire comptent-ils ?", answer: "Oui, ils font partie de l'investissement total pour un calcul réaliste." },
      { question: "Le loyer charges comprises ou hors charges ?", answer: "Le rendement brut se calcule sur le loyer hors charges locataire." },
      { question: "Peut-on comparer deux villes avec le rendement brut ?", answer: "Oui, c'est un bon outil de comparaison, à condition d'utiliser les mêmes hypothèses." },
      { question: "Un rendement brut de 10 % est-il réaliste ?", answer: "Rare et souvent signe de risque (quartier difficile, travaux importants)." },
      { question: "Faut-il inclure les travaux de rénovation ?", answer: "Oui, tout investissement initial doit être intégré dans le coût total." },
    ]),
  },

  "rendement-locatif-net": {
    content: buildRichContent({
      intro:
        "Le rendement locatif net affîne le rendement brut en déduisant les charges récurrentes et la vacance locative. Il reflète mieux la performance réelle de votre investissement.",
      definition:
        "Le rendement net est le ratio entre les loyers annuels nets (après vacance locative et charges propriétaire) et l'investissement total, exprimé en pourcentage. Il exclut encore la fiscalité et le remboursement du crédit.",
      objectif:
        "Mesurer la rentabilité réelle de votre bien locatif une fois les charges courantes et la vacance locative prises en compte.",
      variables: [
        "Investissement total (prix + frais)",
        "Loyer mensuel hors charges (€)",
        "Taux de vacance locative (%)",
        "Charges annuelles propriétaire (€)",
      ],
      formules: [
        hl("Loyers nets", "Loyers nets = Loyer × 12 × (1 − Vacance/100) − Charges annuelles"),
        hl("Rendement net", "Rendement net = Loyers nets / Investissement total × 100"),
      ],
      interpretation: [
        p("L'écart entre rendement brut et net révèle le poids des charges. Une vacance de 5 % et 2 400 € de charges annuelles peuvent réduire le rendement de 1,5 point."),
        hl("Seuil", "Un rendement net supérieur à 3 % est généralement considéré comme viable en investissement locatif."),
      ],
      limitesCalcul: [
        "Fiscalité non incluse (impôt sur les revenus fonciers).",
        "Remboursement du crédit non intégré.",
        "Charges exceptionnelles (travaux lourds) exclues.",
      ],
      example: {
        title: "Bien avec vacance 5 % et charges 2 400 €/an",
        donnees: [
          "Investissement total : 202 400 €",
          "Loyer : 850 €/mois",
          "Vacance : 5 %",
          "Charges annuelles : 2 400 €",
        ],
        calcul: [
          "Loyers bruts annuels = 850 × 12 = 10 200 €",
          "Loyers après vacance = 10 200 × 95 % = 9 690 €",
          "Loyers nets = 9 690 − 2 400 = 7 290 €",
          "Rendement net = 7 290 / 202 400 × 100 = 3,60 %",
        ],
        resultat: "Rendement locatif net : 3,60 %.",
        interpretation:
          "Le rendement net (3,60 %) est inférieur au brut (5,04 %). Si le bien est financé à crédit, vérifiez le cash-flow pour confirmer l'autofinancement.",
      },
      maillage: [
        { slug: "rendement-locatif-brut", label: "Rendement locatif brut" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
        { slug: "rendement-locatif", label: "Rendement locatif" },
      ],
      conseils: [
        "Prévoyez 5 % de vacance locative en moyenne nationale.",
        "Listez toutes les charges : copropriété, taxe foncière, assurance PNO, gestion.",
        "Un rendement net inférieur à 2 % est souvent insuffisant sans plus-value.",
        "Comparez avec le cash-flow si vous financez à crédit.",
      ],
      limites: [
        "Sans prise en compte fiscale.",
        "Charges estimées, non contractuelles.",
      ],
    }),
    faq: buildFaq([
      { question: "Quelle différence entre rendement brut et net ?", answer: "Le net déduit vacance locative et charges propriétaire du loyer perçu." },
      { question: "Quelles charges inclure ?", answer: "Taxe foncière, charges de copropriété non récupérables, assurance PNO, frais de gestion, entretien." },
      { question: "Quel taux de vacance prévoir ?", answer: "5 % en moyenne nationale, plus en zone rurale ou étudiante selon les périodes." },
      { question: "Le rendement net inclut-il l'impôt ?", answer: "Non, l'impôt sur les revenus fonciers vient en plus. Utilisez le simulateur impôt revenus fonciers." },
      { question: "Un rendement net de 3 % est-il bon ?", answer: "C'est un minimum viable. En zone tendue, la plus-value compense un rendement net plus faible." },
      { question: "Comment améliorer le rendement net ?", answer: "Négocier le prix d'achat, optimiser le loyer, réduire la vacance, minimiser les charges." },
      { question: "Les travaux d'entretien comptent-ils ?", answer: "Les charges courantes oui. Les gros travaux sont des investissements ponctuels, pas des charges récurrentes." },
      { question: "Le rendement net suffit-il pour investir ?", answer: "Non, analysez aussi le cash-flow, la fiscalité et le potentiel de plus-value." },
    ]),
  },

  "cash-flow-immobilier": {
    content: buildRichContent({
      intro:
        "Le cash-flow immobilier mesure ce qu'il reste (ou manque) chaque mois entre les loyers perçus et l'ensemble des charges, y compris la mensualité de crédit. C'est l'indicateur clé de l'autofinancement.",
      definition:
        "Le cash-flow est la différence mensuelle entre les recettes locatives nettes (loyer − vacance − charges) et les dépenses (mensualité de crédit, impôts mensualisés). Un cash-flow positif signifie que le bien s'autofinance avec un surplus.",
      objectif:
        "Déterminer si votre investissement locatif est autofinancé ou si vous devez compléter chaque mois de votre poche.",
      variables: [
        "Loyer mensuel hors charges (€)",
        "Charges mensuelles propriétaire (€)",
        "Taux de vacance locative (%)",
        "Mensualité de crédit incluant assurance (€)",
      ],
      formules: [
        hl("Recettes nettes", "Recettes = Loyer × (1 − Vacance/100) − Charges mensuelles"),
        hl("Cash-flow", "Cash-flow = Recettes nettes − Mensualité crédit"),
      ],
      interpretation: [
        p("Un cash-flow négatif signifie un effort d'épargne mensuel de la part de l'investisseur. Un cash-flow positif génère un revenu net après remboursement du crédit."),
        hl("Effort mensuel", "−42,50 €/mois signifie que vous complétez de votre poche, mais vous constituez un patrimoine."),
      ],
      limitesCalcul: [
        "Impôt sur les revenus fonciers non mensualisé.",
        "Travaux exceptionnels non inclus.",
        "Revalorisation des loyers non projetée.",
      ],
      example: {
        title: "Investissement avec crédit de 650 €/mois",
        donnees: [
          "Loyer : 850 €/mois",
          "Charges : 200 €/mois",
          "Vacance : 5 %",
          "Mensualité crédit : 650 €/mois",
        ],
        calcul: [
          "Recettes après vacance = 850 × 95 % = 807,50 €",
          "Recettes nettes = 807,50 − 200 = 607,50 €",
          "Cash-flow = 607,50 − 650 = −42,50 €/mois",
        ],
        resultat: "Cash-flow mensuel : −42,50 € (effort d'épargne).",
        interpretation:
          "Le bien nécessite un complément de 42,50 € par mois. Cet effort reste modéré et peut être compensé par la plus-value à long terme et les déductions fiscales.",
      },
      maillage: [
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "mensualite-pret-immobilier", label: "Mensualité crédit immobilier" },
        { slug: "rendement-locatif", label: "Rendement locatif" },
      ],
      conseils: [
        "Visez un cash-flow positif ou légèrement négatif selon votre stratégie.",
        "Un cash-flow négatif peut être compensé par des avantages fiscaux (LMNP, déficit foncier).",
        "Simulez plusieurs scénarios de taux et de loyer.",
        "Prévoyez une épargne de précaution pour les mois sans locataire.",
      ],
      limites: [
        "Estimation sans fiscalité mensualisée.",
        "Hypothèses de loyer et vacance simplifiées.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que le cash-flow immobilier ?", answer: "La différence entre les loyers nets perçus et toutes les charges, y compris le crédit." },
      { question: "Cash-flow positif ou négatif ?", answer: "Positif = le bien s'autofinance avec surplus. Négatif = vous complétez chaque mois." },
      { question: "Un cash-flow négatif est-il mauvais ?", answer: "Pas forcément : la plus-value et la fiscalité peuvent compenser un effort mensuel modéré." },
      { question: "Comment améliorer le cash-flow ?", answer: "Augmenter le loyer, réduire les charges, négocier le crédit ou augmenter l'apport." },
      { question: "L'impôt est-il inclus dans le cash-flow ?", answer: "Dans ce simulateur, non. Intégrez-le mentalement ou via le simulateur impôt revenus fonciers." },
      { question: "Cash-flow et rendement locatif : quelle différence ?", answer: "Le rendement est un ratio en %. Le cash-flow est un montant mensuel en euros." },
      { question: "Faut-il viser l'autofinancement total ?", answer: "C'est l'idéal, mais en zone tendue un effort mensuel modéré reste courant." },
      { question: "Le cash-flow inclut-il l'assurance PNO ?", answer: "Oui, si vous l'avez incluse dans les charges mensuelles saisies." },
    ]),
  },

  "rentabilite-lmnp": {
    content: buildRichContent({
      intro:
        "La location meublée non professionnelle (LMNP) offre des avantages fiscaux significatifs via l'amortissement du bien. Ce simulateur estime la rentabilité nette d'un investissement en LMNP.",
      definition:
        "Le LMNP permet de louer un logement meublé et de bénéficier du régime micro-BIC (abattement 50 %) ou du régime réel avec amortissement du bien, du mobilier et des travaux. La rentabilité LMNP intègre ces avantages fiscaux.",
      objectif:
        "Estimer la rentabilité nette d'un investissement locatif meublé, en tenant compte du régime fiscal choisi (micro-BIC ou réel).",
      variables: [
        "Investissement total (€)",
        "Loyer mensuel meublé (€)",
        "Régime fiscal : micro-BIC ou réel",
        "Charges et vacance locative",
      ],
      formules: [
        hl("Micro-BIC", "Revenus imposables = Loyers × 50 % (abattement forfaitaire)"),
        hl("Rentabilité", "Rentabilité = (Loyers nets − charges − impôt estimé) / Investissement × 100"),
      ],
      interpretation: [
        p("Le LMNP en micro-BIC convient aux petits investissements avec peu de charges. Le régime réel avec amortissement est plus avantageux pour les biens neufs ou rénovés."),
        hl("Seuil", "Avec 150 000 € investis et 750 €/mois en micro-BIC, la rentabilité nette tourne autour de 3 %."),
      ],
      limitesCalcul: [
        "Amortissement réel simplifié.",
        "Statut LMP (professionnel) non traité.",
        "Plus-value à la revente (taxation amortissements) non incluse.",
      ],
      example: {
        title: "Studio meublé en micro-BIC",
        donnees: [
          "Investissement : 150 000 €",
          "Loyer meublé : 750 €/mois",
          "Régime : micro-BIC",
        ],
        calcul: [
          "Loyers annuels = 750 × 12 = 9 000 €",
          "Revenus imposables = 9 000 × 50 % = 4 500 €",
          "Rentabilité nette estimée ≈ 3 %",
        ],
        resultat: "Rentabilité LMNP (micro-BIC) : environ 3 %.",
        interpretation:
          "Le micro-BIC simplifie la gestion mais limite les déductions. Pour un bien avec travaux importants, le régime réel avec amortissement pourrait améliorer la rentabilité nette.",
      },
      maillage: [
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
        { slug: "plus-value-immobiliere", label: "Plus-value immobilière" },
      ],
      conseils: [
        "Le meublé permet des loyers 10 à 20 % plus élevés que la location nue.",
        "Respectez la liste des meubles obligatoires (décret LMNP).",
        "Comparez micro-BIC et réel avec un comptable spécialisé.",
        "Attention à la taxation des amortissements lors de la revente.",
      ],
      limites: [
        "Simulation fiscale simplifiée.",
        "Conditions de meublé non vérifiées.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que le LMNP ?", answer: "Location Meublée Non Professionnelle : louer un logement meublé avec un régime fiscal avantageux." },
      { question: "Micro-BIC ou régime réel ?", answer: "Micro-BIC si loyers < 77 700 €/an et charges faibles. Réel si amortissement avantageux." },
      { question: "Quels meubles sont obligatoires ?", answer: "Literie, volets, plaques de cuisson, four, réfrigérateur, vaisselle, etc. (décret en vigueur)." },
      { question: "Le LMNP est-il plus rentable que la location nue ?", answer: "Souvent oui grâce aux loyers plus élevés et à l'amortissement fiscal." },
      { question: "Qu'est-ce que l'amortissement LMNP ?", answer: "Déduction comptable du bien, mobilier et travaux sur plusieurs années au régime réel." },
      { question: "Peut-on passer du nu au meublé ?", answer: "Oui, en équipant le logement et en adaptant le bail meublé." },
      { question: "Quand devient-on LMP ?", answer: "Si les recettes locatives dépassent les autres revenus professionnels pendant plus de 5 ans." },
      { question: "La plus-value LMNP est-elle taxée ?", answer: "Oui, les amortissements déduits sont réintégrés dans le calcul de la plus-value à la revente." },
    ]),
  },

  "budget-travaux": {
    content: buildRichContent({
      intro:
        "Estimer le budget travaux avant un achat ou une rénovation évite les mauvaises surprises. Ce simulateur calcule un ordre de grandeur selon la surface et le niveau de finition visé.",
      definition:
        "Le budget travaux regroupe l'ensemble des dépenses de rénovation, réparation ou amélioration d'un logement : gros œuvre, second œuvre, finitions, cuisine, salle de bain, électricité, plomberie et isolation.",
      objectif:
        "Obtenir une estimation rapide du coût des travaux selon la surface du logement et le niveau de rénovation (léger, moyen, lourd).",
      variables: [
        "Surface du logement (m²)",
        "Niveau de travaux : léger, moyen ou lourd",
        "Coût au m² selon le niveau choisi",
      ],
      formules: [
        hl("Formule", "Budget travaux = Surface × Coût au m² selon niveau"),
        p("Niveau moyen : environ 800 €/m². Léger : 300-500 €/m². Lourd (rénovation complète) : 1 200-1 800 €/m²."),
      ],
      interpretation: [
        p("Un budget travaux sous-estimé est la première cause de dépassement lors d'un achat avec rénovation. Prévoyez une marge de 10 à 15 % pour les imprévus."),
        hl("Ordre de grandeur", "Pour 65 m² en rénovation moyenne, comptez environ 52 000 €."),
      ],
      limitesCalcul: [
        "Estimation forfaitaire au m².",
        "Prix régionaux non différenciés.",
        "Travaux structurels exceptionnels non inclus.",
      ],
      example: {
        title: "Rénovation moyenne d'un 65 m²",
        donnees: [
          "Surface : 65 m²",
          "Niveau : moyen (~800 €/m²)",
        ],
        calcul: [
          "Budget = 65 × 800 = 52 000 €",
        ],
        resultat: "Budget travaux estimé : 52 000 €.",
        interpretation:
          "Ce montant couvre une rénovation complète (électricité, plomberie, sols, peinture, cuisine et SdB standard). Demandez 3 devis pour affiner.",
      },
      maillage: [
        { slug: "rentabilite-apres-travaux", label: "Rentabilité après travaux" },
        { slug: "frais-de-notaire", label: "Frais de notaire" },
        { slug: "rendement-locatif", label: "Rendement locatif" },
      ],
      conseils: [
        "Demandez au minimum 3 devis détaillés par corps de métier.",
        "Prévoyez 10 à 15 % de marge pour les imprévus.",
        "Priorisez les travaux énergétiques éligibles aux aides (MaPrimeRénov').",
        "Intégrez le budget travaux dans votre capacité d'emprunt totale.",
      ],
      limites: [
        "Estimation moyenne nationale.",
        "Ne remplace pas un devis professionnel.",
      ],
    }),
    faq: buildFaq([
      { question: "Combien coûtent des travaux au m² ?", answer: "Léger : 300-500 €/m². Moyen : 700-900 €/m². Lourd : 1 200-1 800 €/m²." },
      { question: "Comment financer les travaux ?", answer: "Épargne, crédit travaux, éco-PTZ ou intégration au prêt immobilier (prêt travaux couplé)." },
      { question: "Faut-il un architecte ?", answer: "Obligatoire si surface > 150 m² après travaux ou modification de structure." },
      { question: "Les travaux augmentent-ils la valeur du bien ?", answer: "Oui, une rénovation de qualité améliore la valeur et le loyer potentiel." },
      { question: "Peut-on déduire les travaux fiscalement ?", answer: "En location nue au régime réel, oui. En LMNP, via amortissement." },
      { question: "Quels travaux pour MaPrimeRénov' ?", answer: "Isolation, chauffage, ventilation, fenêtres — selon conditions de ressources et de gaines énergétiques." },
      { question: "Combien de temps durent les travaux ?", answer: "2 à 6 mois pour une rénovation moyenne de 65 m², selon la complexité." },
      { question: "Comment éviter les dépassements ?", answer: "Devis détaillés, marge de 15 %, suivi de chantier régulier et acomptes échelonnés." },
    ]),
  },

  "rentabilite-apres-travaux": {
    content: buildRichContent({
      intro:
        "Les travaux de rénovation peuvent significativement améliorer la rentabilité locative d'un bien. Ce simulateur compare le rendement avant et après travaux pour mesurer le gain.",
      definition:
        "La rentabilité après travaux intègre le coût des travaux dans l'investissement total et le loyer revalorisé post-rénovation. La comparaison avec le rendement avant travaux mesure l'impact de la rénovation.",
      objectif:
        "Évaluer si les travaux envisagés améliorent suffisamment le rendement locatif pour justifier l'investissement supplémentaire.",
      variables: [
        "Prix d'achat et frais d'acquisition",
        "Coût des travaux (€)",
        "Loyer avant et après travaux (€/mois)",
        "Charges annuelles",
      ],
      formules: [
        hl("Avant travaux", "Rendement = (Loyer avant × 12 − charges) / Investissement initial × 100"),
        hl("Après travaux", "Rendement = (Loyer après × 12 − charges) / (Investissement + Travaux) × 100"),
      ],
      interpretation: [
        p("Si le rendement après travaux dépasse le rendement avant, la rénovation est rentable sur le plan locatif. Sinon, seule la plus-value à la revente peut justifier les travaux."),
        hl("Exemple", "Passer de 3,70 % à 4,37 % confirme un gain de rentabilité significatif."),
      ],
      limitesCalcul: [
        "Revalorisation du loyer estimée, non garantie.",
        "Délai et vacance pendant travaux non inclus.",
        "Plus-value à la revente non calculée.",
      ],
      example: {
        title: "Rénovation améliorant le loyer de 750 à 850 €",
        donnees: [
          "Investissement initial : 202 400 €",
          "Travaux : 52 000 €",
          "Loyer avant : 750 €/mois",
          "Loyer après : 850 €/mois",
        ],
        calcul: [
          "Rendement avant ≈ 3,70 %",
          "Investissement total = 202 400 + 52 000 = 254 400 €",
          "Rendement après ≈ 4,37 %",
        ],
        resultat: "Rendement : 3,70 % avant → 4,37 % après travaux.",
        interpretation:
          "Les travaux améliorent le rendement de 0,67 point. Sur le long terme, le surcoût de 52 000 € est compensé par le loyer supérieur et la valeur du bien revalorisée.",
      },
      maillage: [
        { slug: "budget-travaux", label: "Budget travaux" },
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "rendement-locatif", label: "Rendement locatif" },
      ],
      conseils: [
        "Estimez le loyer post-travaux via des annonces comparables.",
        "Priorisez les travaux à fort impact locatif (cuisine, SdB, isolation).",
        "Calculez le délai de retour sur investissement des travaux.",
        "Vérifiez les aides disponibles pour réduire le coût net.",
      ],
      limites: [
        "Loyer après travaux basé sur estimation.",
        "Délai de retour sur investissement non calculé ici.",
      ],
    }),
    faq: buildFaq([
      { question: "Les travaux améliorent-ils toujours la rentabilité ?", answer: "Pas toujours. Si le surcoût est trop élevé ou le loyer insuffisamment revalorisé, le rendement peut baisser." },
      { question: "Quels travaux ont le plus d'impact ?", answer: "Cuisine, salle de bain, isolation, double vitrage et mise aux normes électriques." },
      { question: "Comment estimer le loyer après travaux ?", answer: "Comparez avec des biens similaires rénovés dans le même quartier sur les sites d'annonces." },
      { question: "Faut-il inclure les travaux dans le crédit ?", answer: "Oui, via un prêt travaux couplé ou un crédit travaux séparé." },
      { question: "Quel délai de retour sur investissement viser ?", answer: "Idéalement moins de 10 à 15 ans via le surplus de loyer généré." },
      { question: "Les travaux créent-ils de la plus-value ?", answer: "Oui, un bien rénové se vend et se loue mieux, générant une plus-value à la revente." },
      { question: "Peut-on déduire les travaux en location ?", answer: "Oui au régime réel foncier ou via amortissement LMNP." },
      { question: "Comment financer travaux et achat simultanément ?", answer: "Prêt immobilier avec travaux couplés, ou crédit travaux complémentaire." },
    ]),
  },

  "rentabilite-scpi": {
    content: buildRichContent({
      intro:
        "Les SCPI (Sociétés Civiles de Placement Immobilier) permettent d'investir dans l'immobilier d'entreprise sans contrainte de gestion. Ce simulateur estime la rentabilité nette après frais de souscription.",
      definition:
        "Une SCPI collecte l'épargne de multiples investisseurs pour acquérir un patrimoine immobilier locatif (bureaux, commerces, entrepôts). Le revenu est distribué sous forme de dividendes (loyers nets de charges).",
      objectif:
        "Calculer la rentabilité nette d'un investissement SCPI en tenant compte des frais de souscription et du taux de distribution.",
      variables: [
        "Montant investi (€)",
        "Taux de distribution annuel (%)",
        "Frais de souscription (%)",
      ],
      formules: [
        hl("Revenu annuel", "Revenu = Montant investi × Taux de distribution / 100"),
        hl("Rentabilité nette", "Rentabilité = Revenu annuel / (Montant + Frais de souscription) × 100"),
      ],
      interpretation: [
        p("Les SCPI affichent historiquement 4 à 5 % de distribution. Les frais de souscription (8 à 12 %) réduisent la rentabilité la première année mais s'amortissent sur la durée de détention."),
        hl("Exemple", "20 000 € à 4,8 % avec 10 % de frais → rentabilité nette de 4,32 %, soit 864 €/an."),
      ],
      limitesCalcul: [
        "Taux de distribution non garanti.",
        "Revalorisation des parts non incluse.",
        "Fiscalité (30 % PFU ou barème) non détaillée.",
      ],
      example: {
        title: "Investissement de 20 000 € en SCPI",
        donnees: [
          "Montant : 20 000 €",
          "Taux de distribution : 4,8 %",
          "Frais de souscription : 10 %",
        ],
        calcul: [
          "Frais = 20 000 × 10 % = 2 000 €",
          "Investissement total = 22 000 €",
          "Revenu annuel = 20 000 × 4,8 % = 960 €",
          "Rentabilité nette = 960 / 22 000 × 100 = 4,36 %",
        ],
        resultat: "Rentabilité nette : 4,32 % — revenu : 864 €/an.",
        interpretation:
          "La SCPI génère un revenu passif de 864 €/an après frais. La liquidité est limitée (délai de revente des parts) : investissez avec un horizon long terme.",
      },
      maillage: [
        { slug: "rendement-locatif", label: "Rendement locatif" },
        { slug: "ifi-impot-fortune-immobiliere", label: "IFI impôt fortune immobilière" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
      ],
      conseils: [
        "Diversifiez entre plusieurs SCPI et secteurs (bureaux, santé, logistique).",
        "Privilégiez les SCPI avec un historique de distribution stable.",
        "Investissez avec un horizon minimum de 8 à 10 ans.",
        "Comparez les frais de souscription et de gestion entre SCPI.",
      ],
      limites: [
        "Performance passée non garantie pour l'avenir.",
        "Liquidité limitée des parts de SCPI.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce qu'une SCPI ?", answer: "Une société qui investit collectivement dans l'immobilier locatif et redistribue les loyers aux associés." },
      { question: "Quel rendement espérer d'une SCPI ?", answer: "Historiquement 4 à 5 % de distribution annuelle, variable selon les SCPI." },
      { question: "Quels sont les frais d'une SCPI ?", answer: "Frais de souscription (8-12 %), frais de gestion (10-12 % des loyers), frais de sortie éventuels." },
      { question: "Peut-on investir en SCPI à crédit ?", answer: "Oui, mais les banques exigent souvent un apport personnel et un taux d'endettement maîtrisé." },
      { question: "La SCPI est-elle liquide ?", answer: "Peu. La revente des parts peut prendre plusieurs mois via le marché secondaire ou le rachat par la SCPI." },
      { question: "SCPI ou immobilier direct ?", answer: "SCPI : gestion déléguée, diversification, ticket d'entrée faible. Direct : contrôle, levier crédit, plus-value." },
      { question: "Comment sont imposés les revenus SCPI ?", answer: "Au PFU (30 %) ou au barème progressif + prélèvements sociaux." },
      { question: "Quel montant minimum pour une SCPI ?", answer: "Souvent à partir de 200 à 1 000 € selon les SCPI, parfois plus via le crédit." },
    ]),
  },

  "rentabilite-location-courte-duree": {
    content: buildRichContent({
      intro:
        "La location courte durée (type Airbnb) peut générer des revenus supérieurs à la location classique, mais avec des charges et une vacance différentes. Ce simulateur estime la rentabilité spécifique à ce modèle.",
      definition:
        "La location meublée de courte durée consiste à louer un logement à la nuitée ou à la semaine. Les revenus dépendent du tarif par nuit, du taux d'occupation et des charges spécifiques (ménage, conciergerie, plateforme).",
      objectif:
        "Estimer le rendement locatif d'un bien en location saisonnière ou courte durée, selon le prix par nuit et le taux d'occupation.",
      variables: [
        "Investissement total (€)",
        "Tarif par nuit (€)",
        "Taux d'occupation annuel (%)",
        "Charges spécifiques (ménage, commission plateforme)",
      ],
      formules: [
        hl("Revenus annuels", "Revenus = Tarif/nuit × 365 × Taux d'occupation / 100"),
        hl("Rentabilité", "Rentabilité = (Revenus − Charges) / Investissement × 100"),
      ],
      interpretation: [
        p("Un taux d'occupation de 65 % avec 85 €/nuit sur un investissement de 200 000 € peut générer un rendement supérieur à la location classique, mais les charges et la réglementation sont plus lourdes."),
        hl("Réglementation", "Vérifiez les limites de nuitées par an dans votre commune (souvent 120 jours en résidence principale)."),
      ],
      limitesCalcul: [
        "Charges de ménage et conciergerie simplifiées.",
        "Réglementation locale non vérifiée.",
        "Saisonnalité non modélisée.",
      ],
      example: {
        title: "Location saisonnière à 85 €/nuit",
        donnees: [
          "Investissement : 200 000 €",
          "Tarif : 85 €/nuit",
          "Occupation : 65 %",
        ],
        calcul: [
          "Nuitées/an = 365 × 65 % = 237 nuits",
          "Revenus bruts = 85 × 237 = 20 145 €",
          "Rentabilité brute ≈ 5,57 %",
        ],
        resultat: "Rentabilité location courte durée : environ 5,57 %.",
        interpretation:
          "Ce rendement dépasse la location classique, mais déduisez ménage, commission (15-20 %), taxe de séjour et charges. La gestion est plus intensive.",
      },
      maillage: [
        { slug: "rentabilite-lmnp", label: "Rentabilité LMNP" },
        { slug: "location-meublee-vs-nue", label: "Location meublée vs nue" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
      ],
      conseils: [
        "Vérifiez la réglementation locale (déclaration, numéro d'enregistrement, limites de nuitées).",
        "Prévoyez 15 à 20 % de commission plateforme et des frais de ménage.",
        "Investissez dans un quartier touristique ou d'affaires.",
        "Envisagez une conciergerie si vous ne pouvez pas gérer vous-même.",
      ],
      limites: [
        "Occupation moyenne lissée sur l'année.",
        "Cadre réglementaire évolutif.",
      ],
    }),
    faq: buildFaq([
      { question: "Location courte durée vs classique ?", answer: "Revenus potentiellement plus élevés mais charges, gestion et réglementation plus lourdes." },
      { question: "Quel taux d'occupation viser ?", answer: "60 à 75 % en zone touristique, 40 à 55 % en zone urbaine hors saison." },
      { question: "Faut-il déclarer son activité ?", answer: "Oui, en mairie (numéro d'enregistrement) et aux impôts (LMNP ou LMP)." },
      { question: "Quelle limite de nuitées à Paris ?", answer: "120 nuitées/an pour la résidence principale. Règles variables selon les communes." },
      { question: "Quels charges spécifiques ?", answer: "Ménage, linge, consommables, commission plateforme (15-20 %), taxe de séjour." },
      { question: "Peut-on gérer à distance ?", answer: "Oui, via une conciergerie (20-25 % des revenus) qui gère accueil, ménage et maintenance." },
      { question: "LMNP pour la courte durée ?", answer: "Oui, le régime LMNP s'applique avec les mêmes avantages fiscaux." },
      { question: "Quel tarif par nuit fixer ?", answer: "Analysez la concurrence locale et ajustez selon saison, événements et taux d'occupation." },
    ]),
  },

  "colocation-rentabilite": {
    content: buildRichContent({
      intro:
        "La colocation multiplie les revenus locatifs en louant chaque chambre individuellement. Ce simulateur estime la rentabilité spécifique de ce modèle d'investissement.",
      definition:
        "La colocation consiste à louer un logement chambre par chambre à plusieurs locataires, avec des parties communes partagées. Les loyers cumulés dépassent souvent de 20 à 40 % le loyer d'un bail unique.",
      objectif:
        "Calculer le rendement locatif d'un bien en colocation selon le nombre de chambres, le loyer par chambre et l'investissement total.",
      variables: [
        "Investissement total (€)",
        "Nombre de chambres",
        "Loyer mensuel par chambre (€)",
        "Charges et vacance locative",
      ],
      formules: [
        hl("Loyers cumulés", "Loyers mensuels = Nombre de chambres × Loyer par chambre"),
        hl("Rentabilité", "Rendement = (Loyers × 12 − charges) / Investissement × 100"),
      ],
      interpretation: [
        p("3 chambres à 450 € génèrent 1 350 €/mois, soit bien plus qu'un bail unique à 850 €. Le rendement en colocation peut dépasser 4,5 % en province."),
        hl("Gestion", "La colocation demande plus de gestion (turnover, entretien des parties communes, baux individuels)."),
      ],
      limitesCalcul: [
        "Turnover et vacance par chambre simplifiés.",
        "Réglementation locale sur la colocation non vérifiée.",
        "Meublé obligatoire non chiffré.",
      ],
      example: {
        title: "T3 aménagé en 3 colocations",
        donnees: [
          "Investissement : 202 400 €",
          "3 chambres à 450 €/mois",
        ],
        calcul: [
          "Loyers mensuels = 3 × 450 = 1 350 €",
          "Loyers annuels = 1 350 × 12 = 16 200 €",
          "Rendement brut ≈ 4,83 % (après charges simplifiées)",
        ],
        resultat: "Rentabilité colocation : environ 4,83 %.",
        interpretation:
          "La colocation génère 59 % de revenus supplémentaires vs un loyer unique à 850 €. Le surcoût d'aménagement et de gestion doit être intégré au calcul.",
      },
      maillage: [
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
        { slug: "charges-recuperables-locataire", label: "Charges récupérables locataire" },
      ],
      conseils: [
        "Privilégiez les biens proches des transports et des universités.",
        "Chaque chambre doit respecter les surfaces minimales (9 m²).",
        "Rédigez un bail colocation ou des baux individuels avec règlement intérieur.",
        "Prévoyez un budget d'aménagement (mobilier, cloisons) dans l'investissement.",
      ],
      limites: [
        "Réglementation locale variable (PLU, autorisation).",
        "Gestion plus intensive non chiffrée.",
      ],
    }),
    faq: buildFaq([
      { question: "La colocation est-elle plus rentable ?", answer: "Généralement oui, les loyers cumulés dépassent de 20 à 40 % un bail unique." },
      { question: "Quelle surface minimale par chambre ?", answer: "9 m² minimum, avec hauteur sous plafond de 2,20 m et fenêtre." },
      { question: "Bail unique ou baux individuels ?", answer: "Les deux existent. Les baux individuels limitent la solidarité entre colocataires." },
      { question: "Meublé obligatoire en colocation ?", answer: "Fortement recommandé et souvent exigé par le marché étudiant." },
      { question: "Quels logements conviennent ?", answer: "T3-T5 proches des universités, transports et zones d'emploi." },
      { question: "La colocation est-elle légale partout ?", answer: "Vérifiez le PLU local. Certaines communes imposent des restrictions." },
      { question: "Comment gérer les parties communes ?", answer: "Via un règlement intérieur et une clause d'entretien dans chaque bail." },
      { question: "Colocation et fiscalité ?", answer: "Revenus fonciers (nu) ou BIC (meublé). Chaque chambre génère un loyer imposable." },
    ]),
  },

  "impot-revenus-fonciers": {
    content: buildRichContent({
      intro:
        "Les revenus locatifs sont imposés au titre des revenus fonciers. Le choix entre micro-foncier et régime réel impacte significativement votre impôt. Ce simulateur compare les deux options.",
      definition:
        "Les revenus fonciers proviennent de la location d'un bien immobilier nu. Deux régimes existent : le micro-foncier (abattement forfaitaire de 30 % si loyers < 15 000 €/an) et le régime réel (déduction des charges réelles).",
      objectif:
        "Comparer l'impôt dû en micro-foncier et en régime réel pour choisir le régime le plus avantageux selon vos charges.",
      variables: [
        "Loyers annuels hors charges (€)",
        "Charges déductibles annuelles (€)",
        "Travaux déductibles (€)",
        "Taux marginal d'imposition (%)",
      ],
      formules: [
        hl("Micro-foncier", "Revenus imposables = Loyers × 70 % (abattement 30 %)"),
        hl("Régime réel", "Revenus imposables = Loyers − Charges − Travaux − Intérêts d'emprunt"),
        p("Impôt = Revenus imposables × Taux marginal + Prélèvements sociaux (17,2 %)"),
      ],
      interpretation: [
        p("Si vos charges dépassent 30 % des loyers, le régime réel est généralement plus avantageux. Sinon, le micro-foncier simplifie la déclaration."),
        hl("Comparaison", "Avec 9 000 € de loyers et 3 500 € de charges, le réel (2 250 € d'impôt) bat le micro (2 520 €)."),
      ],
      limitesCalcul: [
        "Taux marginal simplifié.",
        "Déficit foncier et report non détaillés.",
        "Seuil micro-foncier (15 000 €) non vérifié automatiquement.",
      ],
      example: {
        title: "Loyers 9 000 €/an, charges 3 500 €",
        donnees: [
          "Loyers annuels : 9 000 €",
          "Charges déductibles : 3 500 €",
          "TMI : 30 %",
        ],
        calcul: [
          "Micro : imposable = 9 000 × 70 % = 6 300 € → impôt ≈ 2 520 €",
          "Réel : imposable = 9 000 − 3 500 = 5 500 € → impôt ≈ 2 250 €",
        ],
        resultat: "Micro-foncier : 2 520 € — Régime réel : 2 250 € d'impôt.",
        interpretation:
          "Le régime réel économise 270 € d'impôt. Optez pour le réel si vos charges dépassent 30 % des loyers. Tenez une comptabilité rigoureuse.",
      },
      maillage: [
        { slug: "deficit-foncier", label: "Déficit foncier" },
        { slug: "location-meublee-vs-nue", label: "Location meublée vs nue" },
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
      ],
      conseils: [
        "Conservez toutes les factures de charges et travaux.",
        "Le régime réel est irrévocable pendant 3 ans une fois choisi.",
        "Les intérêts d'emprunt sont déductibles au régime réel.",
        "Consultez un expert-comptable si vos charges sont élevées.",
      ],
      limites: [
        "Simulation sans prise en compte du déficit foncier.",
        "TMI estimé, non personnalisé.",
      ],
    }),
    faq: buildFaq([
      { question: "Micro-foncier ou régime réel ?", answer: "Micro si loyers < 15 000 € et charges < 30 % des loyers. Réel si charges importantes." },
      { question: "Quel abattement en micro-foncier ?", answer: "30 % forfaitaire sur les loyers bruts, sans justificatif de charges." },
      { question: "Quelles charges déduire au réel ?", answer: "Taxe foncière, intérêts d'emprunt, travaux, assurance PNO, frais de gestion, charges copropriété." },
      { question: "Quel est le plafond du micro-foncier ?", answer: "15 000 € de loyers annuels hors charges. Au-delà, le régime réel s'impose." },
      { question: "Les travaux sont-ils déductibles ?", answer: "Oui au régime réel. Les travaux de réparation et d'entretien sont déductibles immédiatement." },
      { question: "Peut-on changer de régime ?", answer: "Oui, mais le réel est irrévocable 3 ans. Le micro-foncier peut être choisi chaque année." },
      { question: "Les prélèvements sociaux s'appliquent-ils ?", answer: "Oui, 17,2 % sur les revenus fonciers imposables, en plus de l'impôt sur le revenu." },
      { question: "Location meublée : même régime ?", answer: "Non, la location meublée relève des BIC (micro-BIC ou réel), pas des revenus fonciers." },
    ]),
  },

  "taxe-fonciere": {
    content: buildRichContent({
      intro:
        "La taxe foncière est un impôt local annuel supporté par le propriétaire. Son montant dépend de la valeur locative cadastrale (VLC) et des taux votés par les collectivités.",
      definition:
        "La taxe foncière sur les propriétés bâties (TFPB) est calculée à partir de la valeur locative cadastrale du bien, revalorisée chaque année, multipliée par le taux d'imposition voté par la commune et le département.",
      objectif:
        "Estimer le montant annuel de la taxe foncière pour l'intégrer dans votre budget locatif ou votre charge de propriétaire.",
      variables: [
        "Valeur locative cadastrale (VLC) en €",
        "Taux d'imposition communal et départemental (%)",
        "Abattement forfaitaire (50 % sur VLC bâti)",
      ],
      formules: [
        hl("Base imposable", "Base = VLC × 50 % (abattement bâti)"),
        hl("Taxe foncière", "Taxe = Base × Taux communal + Base × Taux départemental"),
        p("Des taxes additionnelles (GEMAPI, TS) s'ajoutent selon les communes."),
      ],
      interpretation: [
        p("La taxe foncière varie fortement d'une commune à l'autre. Une VLC de 8 000 € avec un taux global de 40 % génère environ 1 600 € par an."),
        hl("Charge locative", "La taxe foncière est à la charge du propriétaire, non récupérable sur le locataire (sauf taxe ordures ménagères)."),
      ],
      limitesCalcul: [
        "Taux moyen saisi, non spécifique à chaque commune.",
        "Taxe d'enlèvement des ordures ménagères (TEOM) non ventilée.",
        "Exonérations (neuf, seniors) non modélisées.",
      ],
      example: {
        title: "Bien avec VLC de 8 000 €",
        donnees: [
          "Valeur locative cadastrale : 8 000 €",
          "Taux global : 40 %",
        ],
        calcul: [
          "Base imposable = 8 000 × 50 % = 4 000 €",
          "Taxe foncière = 4 000 × 40 % = 1 600 €",
        ],
        resultat: "Taxe foncière estimée : 1 600 €/an.",
        interpretation:
          "Intégrez ce montant dans vos charges propriétaire pour le calcul du rendement net. La VLC figure sur votre avis de taxe foncière.",
      },
      maillage: [
        { slug: "impot-revenus-fonciers", label: "Impôt revenus fonciers" },
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "charges-recuperables-locataire", label: "Charges récupérables locataire" },
      ],
      conseils: [
        "Consultez votre avis de taxe foncière pour connaître la VLC exacte.",
        "La taxe foncière est déductible des revenus fonciers au régime réel.",
        "Certaines communes exonèrent les constructions neuves pendant 2 ans.",
        "Comparez les taux communaux avant d'investir dans une zone.",
      ],
      limites: [
        "Taux indicatif, variable selon la commune.",
        "Revalorisation annuelle de la VLC non projetée.",
      ],
    }),
    faq: buildFaq([
      { question: "Comment est calculée la taxe foncière ?", answer: "VLC × 50 % (abattement) × taux voté par la commune et le département." },
      { question: "Où trouver la VLC de mon bien ?", answer: "Sur votre avis de taxe foncière, rubrique « base imposable » avant abattement." },
      { question: "Le locataire paie-t-il la taxe foncière ?", answer: "Non, sauf la taxe d'enlèvement des ordures ménagères (TEOM) récupérable." },
      { question: "La taxe foncière augmente-t-elle chaque année ?", answer: "Oui, la VLC est revalorisée annuellement et les taux peuvent évoluer." },
      { question: "Existe-t-il des exonérations ?", answer: "Oui : constructions neuves (2 ans), certains seniors, PERP sous conditions." },
      { question: "Taxe foncière et impôt sur le revenu ?", answer: "La taxe foncière est déductible des revenus fonciers au régime réel." },
      { question: "Différence taxe foncière et taxe d'habitation ?", answer: "La taxe d'habitation sur les résidences principales est supprimée. La taxe fonciere reste due par le propriétaire." },
      { question: "Comment contester la taxe foncière ?", answer: "Via une réclamation au centre des finances publiques dans les délais (fin décembre)." },
    ]),
  },

  "deficit-foncier": {
    content: buildRichContent({
      intro:
        "Le déficit foncier permet de déduire les travaux et charges excédentaires de vos revenus immobiliers, voire de votre revenu global. C'est un levier fiscal puissant pour les investisseurs.",
      definition:
        "Lorsque les charges déductibles (travaux, intérêts, taxe foncière) dépassent les loyers perçus, un déficit foncier se crée. Il est imputable sur les revenus fonciers des 10 ans suivants, et sur le revenu global dans la limite de 10 700 €/an.",
      objectif:
        "Estimer le déficit foncier généré et l'économie d'impôt correspondante, notamment l'imputation sur le revenu global.",
      variables: [
        "Loyers annuels (€)",
        "Charges et travaux déductibles (€)",
        "Intérêts d'emprunt (€)",
        "Taux marginal d'imposition (%)",
      ],
      formules: [
        hl("Déficit foncier", "Déficit = Charges + Travaux + Intérêts − Loyers (si positif)"),
        hl("Imputation revenu global", "Maximum 10 700 €/an imputable sur le revenu global"),
        p("Économie d'impôt = Déficit imputé × (TMI + 17,2 % prélèvements sociaux)"),
      ],
      interpretation: [
        p("Un déficit foncier de 10 500 € dont 5 000 € imputables sur le revenu global génère une économie d'impôt significative, surtout pour les TMI élevés."),
        hl("Travaux", "Seuls les travaux de réparation et d'entretien créent un déficit imputable sur le revenu global. Les travaux de construction/agrandissement ne le peuvent pas."),
      ],
      limitesCalcul: [
        "Distinction travaux entretien vs construction simplifiée.",
        "Report du déficit sur 10 ans non détaillé.",
        "Plafond 10 700 €/an sans indexation.",
      ],
      example: {
        title: "Travaux générant un déficit foncier",
        donnees: [
          "Loyers : 9 000 €/an",
          "Travaux + charges : 19 500 €",
          "TMI : 30 %",
        ],
        calcul: [
          "Déficit foncier = 19 500 − 9 000 = 10 500 €",
          "Imputable revenu global = min(10 500, 10 700) = 10 500 €",
          "Imputable revenus fonciers futurs = 0 €",
          "Économie ≈ 10 500 × 30 % = 3 150 € (hors PS sur part globale)",
          "Économie totale estimée ≈ 1 500 € sur l'année (selon répartition)",
        ],
        resultat: "Déficit : 10 500 € — économie d'impôt estimée : environ 1 500 €.",
        interpretation:
          "Les travaux créent un déficit imputable sur votre revenu global. Conservez toutes les factures et optez pour le régime réel foncier.",
      },
      maillage: [
        { slug: "impot-revenus-fonciers", label: "Impôt revenus fonciers" },
        { slug: "budget-travaux", label: "Budget travaux" },
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
      ],
      conseils: [
        "Planifiez les travaux déductibles sur une année à revenus élevés.",
        "Seuls les travaux d'entretien/réparation sont imputables sur le revenu global.",
        "Le déficit non imputé se reporte sur les revenus fonciers des 10 ans suivants.",
        "Tenez une comptabilité rigoureuse et conservez les factures 6 ans.",
      ],
      limites: [
        "Classification travaux simplifiée.",
        "Simulation sans conseil fiscal personnalisé.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que le déficit foncier ?", answer: "Un excédent de charges sur les loyers, déductible des revenus fonciers ou du revenu global." },
      { question: "Quel plafond d'imputation sur le revenu global ?", answer: "10 700 € par an pour les travaux d'entretien et de réparation." },
      { question: "Quels travaux créent un déficit foncier ?", answer: "Travaux de réparation, entretien, amélioration. Pas les travaux de construction ou agrandissement." },
      { question: "Combien de temps dure le report ?", answer: "Le déficit foncier est reportable sur les revenus fonciers des 10 années suivantes." },
      { question: "Faut-il être au régime réel ?", answer: "Oui, le déficit foncier n'existe qu'au régime réel des revenus fonciers." },
      { question: "Les intérêts d'emprunt créent-ils un déficit global ?", answer: "Non, les intérêts ne sont imputables que sur les revenus fonciers, pas sur le revenu global." },
      { question: "Peut-on cumuler déficit foncier et LMNP ?", answer: "Non, ce sont deux régimes distincts. Un bien est soit nu (foncier), soit meublé (BIC)." },
      { question: "Comment optimiser le déficit foncier ?", answer: "Concentrer les travaux déductibles sur une année et viser le plafond de 10 700 € imputable." },
    ]),
  },

  "donation-succession-immobiliere": {
    content: buildRichContent({
      intro:
        "Transmettre un bien immobilier par donation ou succession déclenche des droits de mutation à titre gratuit (DMTG). Anticiper leur montant permet d'optimiser la transmission patrimoniale.",
      definition:
        "Les droits de donation ou de succession sont calculés sur la valeur nette du bien transmis, après abattements selon le lien de parenté. Un barème progressif s'applique par tranche, avec des abattements renouvelables tous les 15 ans.",
      objectif:
        "Estimer les droits de donation ou succession lors de la transmission d'un bien immobilier à un enfant, un conjoint ou un tiers.",
      variables: [
        "Valeur du bien immobilier transmis (€)",
        "Lien de parenté (enfant, conjoint, frère/sœur, tiers)",
        "Abattement applicable (€)",
        "Dettes éventuelles sur le bien",
      ],
      formules: [
        hl("Base taxable", "Base = Valeur du bien − Abattement − Dettes"),
        hl("Droits", "Droits = Application du barème progressif par tranche sur la base taxable"),
        p("Abattement enfant : 100 000 € renouvelable tous les 15 ans. Conjoint : exonération totale."),
      ],
      interpretation: [
        p("Pour une donation de 350 000 € à un enfant, l'abattement de 100 000 € réduit la base, mais les droits restent significatifs (environ 50 000 €)."),
        hl("Anticipation", "Donner de son vivant avec abattement renouvelable tous les 15 ans réduit la base taxable globale."),
      ],
      limitesCalcul: [
        "Barème simplifié en vigueur.",
        "Dons précédents non pris en compte.",
        "Démembrement et assurance-vie non modélisés.",
      ],
      example: {
        title: "Donation d'un bien de 350 000 € à un enfant",
        donnees: [
          "Valeur du bien : 350 000 €",
          "Lien : enfant",
          "Abattement : 100 000 €",
        ],
        calcul: [
          "Base taxable = 350 000 − 100 000 = 250 000 €",
          "Droits progressifs ≈ 50 000 €",
        ],
        resultat: "Droits de donation estimés : environ 50 000 €.",
        interpretation:
          "La donation de son vivant permet d'anticiper la transmission et d'utiliser l'abattement renouvelable. Envisagez le démembrement (nue-propriété/usufruit) pour réduire les droits.",
      },
      maillage: [
        { slug: "ifi-impot-fortune-immobiliere", label: "IFI impôt fortune immobilière" },
        { slug: "plus-value-immobiliere", label: "Plus-value immobilière" },
        { slug: "taxe-fonciere", label: "Taxe foncière" },
      ],
      conseils: [
        "Utilisez l'abattement de 100 000 € renouvelable tous les 15 ans par enfant.",
        "Envisagez le démembrement de propriété pour réduire les droits.",
        "Consultez un notaire pour un plan de transmission optimisé.",
        "L'assurance-vie permet une transmission hors succession avec abattement.",
      ],
      limites: [
        "Simulation sans historique des donations antérieures.",
        "Cas du conjoint survivant non détaillé.",
      ],
    }),
    faq: buildFaq([
      { question: "Quels droits pour une donation à un enfant ?", answer: "Barème progressif de 5 à 45 % après abattement de 100 000 €." },
      { question: "Le conjoint paie-t-il des droits ?", answer: "Non, le conjoint est totalement exonéré de droits de succession." },
      { question: "Quand renouveler l'abattement ?", answer: "Tous les 15 ans pour les donations. Les successions n'ont pas de renouvellement." },
      { question: "Donation ou succession : que choisir ?", answer: "La donation anticipe et utilise les abattements de son vivant. La succession intervient au décès." },
      { question: "Qu'est-ce que le démembrement ?", answer: "Donner la nue-propriété (droits réduits) en conservant l'usufruit (usage du bien)." },
      { question: "Les dettes réduisent-elles les droits ?", answer: "Oui, les dettes sur le bien (crédit en cours) réduisent la valeur transmise." },
      { question: "Faut-il passer par un notaire ?", answer: "Oui, la donation immobilière doit être authentifiée par acte notarié." },
      { question: "L'assurance-vie est-elle une alternative ?", answer: "Oui, les capitaux versés bénéficient d'abattements (152 500 € par bénéficiaire en droits)." },
    ]),
  },

  "location-meublee-vs-nue": {
    content: buildRichContent({
      intro:
        "Le choix entre location meublée et location nue impacte vos revenus locatifs, votre fiscalité et votre gestion. Ce simulateur compare la rentabilité nette des deux options.",
      definition:
        "La location nue est soumise aux revenus fonciers (micro-foncier ou réel). La location meublée relève des BIC (micro-BIC avec 50 % d'abattement ou réel avec amortissement). Les loyers meublés sont généralement 10 à 20 % plus élevés.",
      objectif:
        "Comparer le rendement net d'un même bien en location meublée et en location nue pour orienter votre stratégie d'investissement.",
      variables: [
        "Investissement total (€)",
        "Loyer nu estimé (€/mois)",
        "Loyer meublé estimé (€/mois)",
        "Charges et fiscalité de chaque régime",
      ],
      formules: [
        hl("Location nue", "Rendement = (Loyer nu × 12 − charges − impôt foncier) / Investissement × 100"),
        hl("Location meublée", "Rendement = (Loyer meublé × 12 − charges − impôt BIC) / (Investissement + coût meubles) × 100"),
      ],
      interpretation: [
        p("La location meublée affiche souvent un rendement net supérieur (3,32 % vs 2,39 % dans notre exemple), grâce aux loyers plus élevés et à l'amortissement fiscal."),
        hl("Gestion", "Le meublé implique plus de turnover et d'entretien du mobilier, mais le cadre fiscal est plus avantageux."),
      ],
      limitesCalcul: [
        "Coût du mobilier estimé forfaitairement.",
        "Turnover meublé non chiffré.",
        "Bail meublé (1 an) vs nu (3 ans) non modélisé.",
      ],
      example: {
        title: "Comparaison sur un investissement identique",
        donnees: [
          "Investissement : 202 400 €",
          "Loyer nu : 850 €/mois",
          "Loyer meublé : 950 €/mois",
        ],
        calcul: [
          "Rendement net location nue ≈ 2,39 %",
          "Rendement net location meublée ≈ 3,32 %",
        ],
        resultat: "Location meublée : 3,32 % — Location nue : 2,39 %.",
        interpretation:
          "Le meublé offre un rendement net supérieur de près d'1 point. Toutefois, la gestion est plus exigeante (turnover, mobilier). Le nu convient à une gestion passive.",
      },
      maillage: [
        { slug: "rentabilite-lmnp", label: "Rentabilité LMNP" },
        { slug: "impot-revenus-fonciers", label: "Impôt revenus fonciers" },
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
      ],
      conseils: [
        "Le meublé convient aux zones étudiantes et aux bailleurs actifs.",
        "La location nue est plus simple fiscalement avec le micro-foncier.",
        "Comparez sur la durée : le turnover meublé peut réduire l'avantage.",
        "Consultez un expert-comptable pour le régime réel meublé.",
      ],
      limites: [
        "Hypothèses de loyer simplifiées.",
        "Ne tient pas compte du temps de gestion.",
      ],
    }),
    faq: buildFaq([
      { question: "Meublé ou nu : lequel est plus rentable ?", answer: "Le meublé génère des loyers plus élevés et une fiscalité souvent plus avantageuse." },
      { question: "Quelle fiscalité pour chaque type ?", answer: "Nu : revenus fonciers. Meublé : BIC (micro-BIC ou réel avec amortissement)." },
      { question: "Quelle durée de bail ?", answer: "Meublé : 1 an (9 mois étudiant). Nu : 3 ans (6 ans si personne morale)." },
      { question: "Le meublé demande-t-il plus de gestion ?", answer: "Oui, turnover plus fréquent, entretien du mobilier et conformité au décret meublé." },
      { question: "Peut-on passer du nu au meublé ?", answer: "Oui, en équipant le logement et en signant un bail meublé." },
      { question: "Quels meubles sont obligatoires ?", answer: "Literie, volets, plaques, four, réfrigérateur, vaisselle, étagères, luminaires, etc." },
      { question: "Le dépôt de garantie diffère-t-il ?", answer: "Oui : 2 mois pour le nu, 1 mois pour le meublé." },
      { question: "Quel régime si je loue en meublé de tourisme ?", answer: "LMNP avec régime BIC, soumis à des règles spécifiques de durée et de déclaration." },
    ]),
  },

  "ifi-impot-fortune-immobiliere": {
    content: buildRichContent({
      intro:
        "L'Impôt sur la Fortune Immobilière (IFI) s'applique aux contribuables dont le patrimoine immobilier net taxable dépasse 1,3 million d'euros. Ce simulateur estime le montant dû.",
      definition:
        "L'IFI remplace l'ISF depuis 2018 et cible exclusivement le patrimoine immobilier (résidences, biens locatifs, parts de SCPI). Un abattement de 30 % s'applique sur la résidence principale. Le barème est progressif de 0,5 à 1,5 %.",
      objectif:
        "Estimer l'IFI annuel dû selon la composition et la valeur nette de votre patrimoine immobilier.",
      variables: [
        "Valeur totale du patrimoine immobilier (€)",
        "Dettes immobilières déductibles (€)",
        "Abattement résidence principale (30 %)",
        "Seuil d'imposition (1 300 000 €)",
      ],
      formules: [
        hl("Patrimoine net", "Patrimoine net = Valeur brute − Dettes − Abattement RP 30 %"),
        hl("IFI", "IFI = Application du barème progressif (0,5 % à 1,5 %) sur le patrimoine net > 1,3 M€"),
        p("Décote entre 1,3 et 1,4 M€ pour lisser l'entrée dans l'impôt."),
      ],
      interpretation: [
        p("Un patrimoine net de 1,405 M€ génère un IFI d'environ 7 935 €/an. L'IFI pèse davantage sur les patrimoines très immobiliers sans diversification."),
        hl("Optimisation", "La dette immobilière réduit l'assiette. Les biens professionnels sont exonérés."),
      ],
      limitesCalcul: [
        "Barème simplifié avec décote.",
        "Biens professionnels et exonérations spécifiques non détaillés.",
        "Passif déductible simplifié.",
      ],
      example: {
        title: "Patrimoine immobilier net de 1,405 M€",
        donnees: [
          "Patrimoine brut : 1 800 000 €",
          "Dettes : 200 000 €",
          "Abattement RP 30 % sur 500 000 € = 150 000 €",
          "Patrimoine net taxable : 1 405 000 €",
        ],
        calcul: [
          "Assiette au-dessus du seuil = 1 405 000 − 1 300 000 = 105 000 €",
          "IFI progressif sur l'ensemble du patrimoine net ≈ 7 935 €",
        ],
        resultat: "IFI estimé : environ 7 935 €/an.",
        interpretation:
          "L'IFI représente environ 0,56 % du patrimoine net. Envisagez le démembrement, l'investissement en biens professionnels ou la réduction de dette pour optimiser.",
      },
      maillage: [
        { slug: "donation-succession-immobiliere", label: "Donation succession immobilière" },
        { slug: "plus-value-immobiliere", label: "Plus-value immobilière" },
        { slug: "taxe-fonciere", label: "Taxe foncière" },
      ],
      conseils: [
        "Les dettes immobilières en cours réduisent l'assiette IFI.",
        "Le démembrement (donation de nue-propriété) réduit le patrimoine taxable.",
        "Les parts de SCPI entrent dans l'assiette IFI.",
        "Consultez un conseiller en gestion de patrimoine pour optimiser.",
      ],
      limites: [
        "Simulation sans prise en compte de toutes les exonérations.",
        "Valorisation des biens non actualisée.",
      ],
    }),
    faq: buildFaq([
      { question: "À partir de combien paie-t-on l'IFI ?", answer: "Dès 1,3 million € de patrimoine immobilier net taxable." },
      { question: "La résidence principale est-elle taxée ?", answer: "Oui, avec un abattement de 30 % sur sa valeur." },
      { question: "Quels biens entrent dans l'IFI ?", answer: "Tous les biens immobiliers : RP, locatif, SCPI, terrains. Pas les biens professionnels." },
      { question: "Les crédits immobiliers réduisent-ils l'IFI ?", answer: "Oui, les dettes liées à des biens immobiliers sont déductibles." },
      { question: "Quel barème pour l'IFI ?", answer: "Progressif de 0,5 % (dès 800 000 € net) à 1,5 % (au-delà de 10 M€)." },
      { question: "L'IFI remplace-t-il l'ISF ?", answer: "Oui, depuis 2018. Seul le patrimoine immobilier est taxé." },
      { question: "Comment réduire l'IFI ?", answer: "Dette, démembrement, investissement en biens professionnels, donation de nue-propriété." },
      { question: "Les SCPI sont-elles soumises à l'IFI ?", answer: "Oui, les parts de SCPI entrent dans l'assiette IFI." },
    ]),
  },

  "revision-loyer-irl": {
    content: buildRichContent({
      intro:
        "En location vide, le loyer peut être révisé chaque année selon l'Indice de Référence des Loyers (IRL). Ce simulateur calcule le nouveau loyer applicable.",
      definition:
        "La révision annuelle du loyer est indexée sur l'IRL publié par l'INSEE. Le nouveau loyer = loyer actuel × (IRL du trimestre de révision / IRL du trimestre de référence du bail).",
      objectif:
        "Calculer le loyer révisé selon l'évolution de l'IRL entre la date de signature du bail et la date de révision.",
      variables: [
        "Loyer mensuel actuel hors charges (€)",
        "IRL du trimestre de référence (signature du bail)",
        "IRL du trimestre de révision (année en cours)",
      ],
      formules: [
        hl("Formule", "Nouveau loyer = Loyer actuel × (IRL révision / IRL référence)"),
        p("La révision ne peut intervenir qu'une fois par an, à la date prévue dans le bail."),
      ],
      interpretation: [
        p("Une hausse de l'IRL de 142,06 à 145,77 (+2,6 %) porte un loyer de 850 € à 872,20 €. Le locataire doit en être informé par courrier."),
        hl("Clause", "La clause de révision doit figurer dans le bail. Sans clause, le loyer ne peut pas être révisé."),
      ],
      limitesCalcul: [
        "IRL saisis manuellement (à vérifier sur insee.fr).",
        "Encadrement des loyers en zone tendue non vérifié.",
        "Complément de loyer non modifié par la révision.",
      ],
      example: {
        title: "Révision avec IRL en hausse de 2,6 %",
        donnees: [
          "Loyer actuel : 850 €/mois",
          "IRL référence : 142,06",
          "IRL révision : 145,77",
        ],
        calcul: [
          "Variation IRL = 145,77 / 142,06 = 1,0261",
          "Nouveau loyer = 850 × 1,0261 = 872,20 €",
          "Augmentation = +22,20 €/mois",
        ],
        resultat: "Loyer révisé : 872,20 €/mois (+22,20 €).",
        interpretation:
          "Informez le locataire par courrier recommandé avec le calcul détaillé. L'augmentation ne s'applique qu'à compter de la date de révision prévue au bail.",
      },
      maillage: [
        { slug: "rendement-locatif-net", label: "Rendement locatif net" },
        { slug: "cash-flow-immobilier", label: "Cash-flow immobilier" },
        { slug: "rendement-locatif", label: "Rendement locatif" },
      ],
      conseils: [
        "Vérifiez l'IRL du trimestre exact sur insee.fr.",
        "Envoyez la notification de révision par courrier recommandé.",
        "La révision ne peut pas être rétroactive.",
        "En zone encadrée, vérifiez que le loyer révisé reste sous le plafond.",
      ],
      limites: [
        "IRL à saisir manuellement.",
        "Encadrement des loyers non contrôlé.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que l'IRL ?", answer: "L'Indice de Référence des Loyers, publié trimestriellement par l'INSEE." },
      { question: "Quand réviser le loyer ?", answer: "Une fois par an, à la date prévue dans le bail (souvent date anniversaire)." },
      { question: "Comment notifier le locataire ?", answer: "Par courrier recommandé avec le calcul : loyer × (nouvel IRL / ancien IRL)." },
      { question: "Peut-on réviser sans clause dans le bail ?", answer: "Non, la clause de révision annuelle IRL est obligatoire pour réviser." },
      { question: "Le loyer peut-il baisser avec l'IRL ?", answer: "Oui, si l'IRL baisse, le loyer peut être révisé à la baisse." },
      { question: "La révision s'applique-t-elle rétroactivement ?", answer: "Non, uniquement à compter de la date de révision." },
      { question: "Location meublée : même indice ?", answer: "Oui, l'IRL s'applique aussi aux baux meublés." },
      { question: "Où trouver l'IRL ?", answer: "Sur le site de l'INSEE, rubrique indices et références, IRL trimestriel." },
    ]),
  },

  "encadrement-loyers": {
    content: buildRichContent({
      intro:
        "Dans les zones tendues, l'encadrement des loyers limite le montant du loyer à la signature d'un nouveau bail. Ce simulateur vérifie la conformité d'un loyer par rapport au plafond légal.",
      definition:
        "L'encadrement des loyers, applicable dans certaines communes (Paris, Lille, Lyon, Montpellier, etc.), fixe un loyer de référence majoré (plafond) selon le quartier, la surface, l'époque de construction et le type de location.",
      objectif:
        "Vérifier si le loyer demandé respecte le plafond d'encadrement et calculer l'éventuel complément de loyer justifié.",
      variables: [
        "Loyer mensuel hors charges (€)",
        "Loyer de référence majoré (plafond) au m²",
        "Surface du logement (m²)",
        "Complément de loyer éventuel (€)",
      ],
      formules: [
        hl("Plafond", "Loyer max = Loyer de référence majoré × Surface"),
        p("Conformité = Loyer demandé ≤ Plafond + Complément de loyer (si justifié)"),
      ],
      interpretation: [
        p("Un loyer de 1 550 € pour un logement dont le plafond est 1 728 € est conforme. Au-delà du plafond, le bail est illégal sauf complément de loyer justifié."),
        hl("Observation", "L'encadrement s'applique à la signature et à la relocation, pas à la révision annuelle IRL."),
      ],
      limitesCalcul: [
        "Loyer de référence saisi manuellement (observatoire local).",
        "Communes concernées non vérifiées automatiquement.",
        "Caractéristiques du logement (époque, meublé) simplifiées.",
      ],
      example: {
        title: "Vérification en zone encadrée",
        donnees: [
          "Loyer demandé : 1 550 €/mois",
          "Plafond calculé : 1 728 €/mois",
        ],
        calcul: [
          "1 550 € ≤ 1 728 € → conforme",
          "Marge disponible = 1 728 − 1 550 = 178 €",
        ],
        resultat: "Loyer conforme : 1 550 € est inférieur au plafond de 1 728 €.",
        interpretation:
          "Le loyer est dans les clous. Le bailleur pourrait augmenter le loyer jusqu'à 1 728 € à la relocation, sous réserve du respect des règles d'encadrement.",
      },
      maillage: [
        { slug: "revision-loyer-irl", label: "Révision loyer IRL" },
        { slug: "loyer-charges-comprises", label: "Loyer charges comprises" },
        { slug: "depot-garantie-locatif", label: "Dépôt de garantie locatif" },
      ],
      conseils: [
        "Consultez l'observatoire local des loyers pour le loyer de référence.",
        "Le complément de loyer doit être justifié par des caractéristiques exceptionnelles.",
        "L'encadrement ne s'applique pas à la révision IRL, seulement à la relocation.",
        "En cas de litige, saisissez la commission de conciliation de l'observatoire.",
      ],
      limites: [
        "Plafond saisi manuellement.",
        "Liste des communes encadrées non exhaustive ici.",
      ],
    }),
    faq: buildFaq([
      { question: "Qu'est-ce que l'encadrement des loyers ?", answer: "Un plafond légal de loyer dans les zones tendues, basé sur un loyer de référence par quartier." },
      { question: "Dans quelles villes s'applique-t-il ?", answer: "Paris, Lille, Lyon, Villeurbanne, Montpellier, Bordeaux (partiel), et d'autres selon arrêtés préfectoraux." },
      { question: "Qu'est-ce que le complément de loyer ?", answer: "Un supplément justifié par des caractéristiques de localisation ou de confort exceptionnels." },
      { question: "L'encadrement s'applique-t-il à la révision IRL ?", answer: "Non, seulement à la signature d'un nouveau bail ou à la relocation." },
      { question: "Comment trouver le loyer de référence ?", answer: "Sur le site de l'observatoire local des loyers ou via l'outil en ligne de la préfecture." },
      { question: "Que faire si le loyer dépasse le plafond ?", answer: "Le locataire peut contester. Le bailleur doit prouver le complément de loyer ou baisser le loyer." },
      { question: "L'encadrement concerne-t-il le meublé ?", answer: "Oui, avec des loyers de référence spécifiques au meublé." },
      { question: "Le locataire peut-il vérifier le loyer ?", answer: "Oui, via l'observatoire des loyers ou la commission de conciliation." },
    ]),
  },

  "depot-garantie-locatif": {
    content: buildRichContent({
      intro:
        "Le dépôt de garantie est une somme versée par le locataire au bailleur lors de la signature du bail. Son montant est encadré par la loi et restitué en fin de bail sous conditions.",
      definition:
        "Le dépôt de garantie sert à couvrir d'éventuels impayés de loyer ou dégradations. Il est plafonné à 1 mois de loyer hors charges pour la location nue, et 2 mois pour la location meublée.",
      objectif:
        "Calculer le montant maximal légal du dépôt de garantie selon le loyer et le type de location.",
      variables: [
        "Loyer mensuel hors charges (€)",
        "Type de location : nue ou meublée",
      ],
      formules: [
        hl("Location nue", "Dépôt max = 1 × Loyer hors charges"),
        hl("Location meublée", "Dépôt max = 2 × Loyer hors charges"),
      ],
      interpretation: [
        p("Pour un loyer de 850 € hors charges en location nue, le dépôt maximal est de 850 €. En meublé, il serait de 1 700 €."),
        hl("Restitution", "Le dépôt doit être restitué dans un délai de 1 mois (sans retenue) ou 2 mois (avec retenue pour dégradations)."),
      ],
      limitesCalcul: [
        "Premier loyer uniquement (pas de révision).",
        "Retenues pour dégradations non estimées.",
        "Garantie Visale ou autre caution non incluse.",
      ],
      example: {
        title: "Location nue à 850 € hors charges",
        donnees: [
          "Loyer hors charges : 850 €/mois",
          "Type : location nue",
        ],
        calcul: [
          "Dépôt max = 1 × 850 = 850 €",
          "En meublé : 2 × 850 = 1 700 €",
        ],
        resultat: "Dépôt de garantie maximal : 850 € (nu) ou 1 700 € (meublé).",
        interpretation:
          "Le bailleur ne peut pas exiger plus de 850 € de dépôt pour une location nue. Ce montant doit être restitué en fin de bail, déduction faite des sommes dues.",
      },
      maillage: [
        { slug: "loyer-charges-comprises", label: "Loyer charges comprises" },
        { slug: "encadrement-loyers", label: "Encadrement des loyers" },
        { slug: "revision-loyer-irl", label: "Révision loyer IRL" },
      ],
      conseils: [
        "Le dépôt ne peut pas servir à payer le dernier mois de loyer.",
        "Restituez le dépôt dans les délais légaux (1 ou 2 mois).",
        "Établissez un état des lieux contradictoire pour limiter les litiges.",
        "Envisagez la garantie Visale pour les locataires sans garant.",
      ],
      limites: [
        "Montant légal maximal uniquement.",
        "Retenues et litiges non modélisés.",
      ],
    }),
    faq: buildFaq([
      { question: "Quel montant maximal pour le dépôt de garantie ?", answer: "1 mois de loyer HC pour le nu, 2 mois pour le meublé." },
      { question: "Le dépôt couvre-t-il les charges ?", answer: "Non, il se calcule sur le loyer hors charges uniquement." },
      { question: "Quand restituer le dépôt ?", answer: "1 mois si aucune retenue, 2 mois si retenue pour dégradations ou impayés." },
      { question: "Peut-on retenir le dépôt pour le dernier loyer ?", answer: "Non, sauf accord écrit du locataire. Le dépôt n'est pas un paiement d'avance." },
      { question: "Le dépôt doit-il être placé ?", answer: "Non, le bailleur n'a pas l'obligation de le placer sur un compte séquestre." },
      { question: "Différence dépôt et garantie Visale ?", answer: "Le dépôt est versé au bailleur. Visale est une caution gratuite de l'État pour le locataire." },
      { question: "Que faire en cas de litige sur le dépôt ?", answer: "Saisir la commission de conciliation, puis le tribunal judiciaire si nécessaire." },
      { question: "Le dépôt est-il révisé avec le loyer ?", answer: "Non, il reste fixe sauf renouvellement de bail avec nouveau loyer." },
    ]),
  },

  "charges-recuperables-locataire": {
    content: buildRichContent({
      intro:
        "Certaines charges de copropriété et de propriété sont récupérables auprès du locataire. Ce simulateur estime le montant mensuel de charges locatives à refacturer.",
      definition:
        "Les charges récupérables sont les dépenses de services collectifs et consommations individuelles que le bailleur peut refacturer au locataire : eau, chauffage, entretien des parties communes, taxe d'enlèvement des ordures ménagères, etc.",
      objectif:
        "Calculer le montant annuel et mensuel des charges récupérables à refacturer au locataire, en plus du loyer hors charges.",
      variables: [
        "Charges de copropriété annuelles (€)",
        "Taxe ordures ménagères (€)",
        "Eau, chauffage et autres charges récupérables (€)",
        "Quote-part récupérable (%)",
      ],
      formules: [
        hl("Total annuel", "Charges récupérables = Copropriété récupérable + TEOM + Eau/Chauffage"),
        hl("Mensualisation", "Charges mensuelles = Total annuel / 12"),
      ],
      interpretation: [
        p("Un total de 3 220 €/an de charges récupérables représente 268 €/mois à refacturer. Le bailleur doit fournir un décompte annuel régularisé."),
        hl("Provisions", "Les provisions sur charges sont ajustées chaque année selon le décompte réel."),
      ],
      limitesCalcul: [
        "Quote-part récupérable estimée.",
        "Travaux de copropriété non récupérables exclus.",
        "Régularisation annuelle non détaillée.",
      ],
      example: {
        title: "Charges récupérables annuelles",
        donnees: [
          "Copropriété récupérable : 1 800 €/an",
          "TEOM : 320 €/an",
          "Eau et chauffage : 1 100 €/an",
        ],
        calcul: [
          "Total annuel = 1 800 + 320 + 1 100 = 3 220 €",
          "Charges mensuelles = 3 220 / 12 = 268,33 €",
        ],
        resultat: "Charges récupérables : 3 220 €/an, soit 268 €/mois.",
        interpretation:
          "Ces charges s'ajoutent au loyer hors charges. Le bailleur doit justifier le décompte annuel et régulariser les provisions versées par le locataire.",
      },
      maillage: [
        { slug: "loyer-charges-comprises", label: "Loyer charges comprises" },
        { slug: "revision-loyer-irl", label: "Révision loyer IRL" },
        { slug: "taxe-fonciere", label: "Taxe foncière" },
      ],
      conseils: [
        "Distinguez charges récupérables et non récupérables dans le décompte.",
        "Fournissez le décompte annuel des charges au locataire.",
        "Les travaux de copropriété (toiture, ravalement) ne sont pas récupérables.",
        "Utilisez un forfait de charges pour simplifier (bail avec forfait).",
      ],
      limites: [
        "Liste des charges simplifiée.",
        "Décompte réel non simulé.",
      ],
    }),
    faq: buildFaq([
      { question: "Quelles charges sont récupérables ?", answer: "Entretien courant, eau, chauffage, TEOM, ascenseur, gardien, éclairage des communs." },
      { question: "Quelles charges ne le sont pas ?", answer: "Gros travaux (ravalement, toiture), taxe foncière (sauf TEOM), frais de gestion du bailleur." },
      { question: "Comment facturer les charges au locataire ?", answer: "Par provisions mensuelles avec régularisation annuelle, ou par forfait de charges." },
      { question: "Le forfait de charges est-il autorisé ?", answer: "Oui, en meublé uniquement. Il est fixe et non régularisable." },
      { question: "Quand fournir le décompte des charges ?", answer: "Dans l'année suivant la clôture des comptes de copropriété." },
      { question: "Le locataire peut-il contester les charges ?", answer: "Oui, s'il estime que certaines charges ne sont pas récupérables." },
      { question: "La TEOM est-elle récupérable ?", answer: "Oui, la taxe d'enlèvement des ordures ménagères est récupérable sur le locataire." },
      { question: "Charges en colocation ?", answer: "Elles sont réparties entre colocataires, souvent au prorata des surfaces ou à parts égales." },
    ]),
  },

  "revision-loyer-commercial": {
    content: buildRichContent({
      intro:
        "Les baux commerciaux prévoient une révision triennale ou annuelle du loyer indexée sur un indice spécifique (ILC ou ILAT). Ce simulateur calcule le loyer révisé.",
      definition:
        "La révision du loyer commercial est indexée sur l'Indice des Loyers Commerciaux (ILC) pour les baux 3-6-9 classiques, ou l'Indice des Loyers des Activités Tertiaires (ILAT) pour les bureaux et activités tertiaires.",
      objectif:
        "Calculer le loyer commercial révisé selon l'évolution de l'indice contractuel entre la date de prise d'effet et la date de révision.",
      variables: [
        "Loyer annuel actuel (€)",
        "Indice de référence (ILC ou ILAT)",
        "Indice de révision en cours",
        "Type de bail commercial",
      ],
      formules: [
        hl("Formule", "Nouveau loyer = Loyer actuel × (Indice révision / Indice référence)"),
        p("La révision intervient généralement tous les 3 ans (triennale) ou chaque année selon le bail."),
      ],
      interpretation: [
        p("Un loyer annuel de 24 000 € indexé sur l'ILAT passant de l'indice de référence à l'indice courant (+2,8 %) donne un loyer révisé de 24 670 €."),
        hl("Clause", "L'indice et la périodicité de révision sont fixés dans le bail commercial."),
      ],
      limitesCalcul: [
        "Indices saisis manuellement.",
        "Clause de lissage ou plafonnement non modélisée.",
        "Droit au bail et renouvellement non traités.",
      ],
      example: {
        title: "Révision triennale indexée ILAT",
        donnees: [
          "Loyer annuel : 24 000 €",
          "Indice ILAT référence : 110,5",
          "Indice ILAT révision : 113,6",
        ],
        calcul: [
          "Variation = 113,6 / 110,5 = 1,0281",
          "Nouveau loyer = 24 000 × 1,0281 = 24 674 €",
        ],
        resultat: "Loyer commercial révisé : environ 24 670 €/an (+670 €).",
        interpretation:
          "Le bailleur peut appliquer cette révision à la date triennale prévue au bail. Le locataire doit en être informé par courrier recommandé.",
      },
      maillage: [
        { slug: "revision-loyer-irl", label: "Révision loyer IRL" },
        { slug: "encadrement-loyers", label: "Encadrement des loyers" },
        { slug: "charges-recuperables-locataire", label: "Charges récupérables locataire" },
      ],
      conseils: [
        "Vérifiez l'indice contractuel (ILC ou ILAT) dans le bail.",
        "La révision triennale est la règle pour les baux 3-6-9.",
        "Certains baux prévoient un lissage ou un plafonnement de révision.",
        "Consultez un avocat spécialisé pour les litiges commerciaux.",
      ],
      limites: [
        "Indices à vérifier sur insee.fr.",
        "Clauses spécifiques du bail non analysées.",
      ],
    }),
    faq: buildFaq([
      { question: "Quel indice pour un bail commercial ?", answer: "ILC pour les commerces, ILAT pour les bureaux et activités tertiaires." },
      { question: "Quelle fréquence de révision ?", answer: "Triennale (tous les 3 ans) en principe, ou annuelle si prévu au bail." },
      { question: "Le locataire peut-il refuser la révision ?", answer: "Non, si la clause est valide et l'indice correctement appliqué." },
      { question: "Qu'est-ce que le bail 3-6-9 ?", answer: "Un bail commercial de 9 ans avec résiliation possible aux 3 et 6 ans par le locataire." },
      { question: "Le loyer commercial peut-il baisser ?", answer: "Oui, si l'indice baisse, le loyer est révisé à la baisse." },
      { question: "Différence ILC et ILAT ?", answer: "ILC pour commerces de détail, ILAT pour bureaux, entrepôts et activités tertiaires." },
      { question: "Qu'est-ce que le lissage de révision ?", answer: "Une clause étalant la hausse sur plusieurs périodes pour limiter les chocs." },
      { question: "Où trouver les indices ILC et ILAT ?", answer: "Sur le site de l'INSEE, rubrique indices des loyers commerciaux." },
    ]),
  },

  "loyer-charges-comprises": {
    content: buildRichContent({
      intro:
        "Les annonces immobilières affichent souvent un loyer charges comprises (CC). Pour établir un bail conforme, il faut ventiler le loyer hors charges et le montant des provisions sur charges.",
      definition:
        "Le loyer charges comprises (CC) inclut le loyer de base et une provision pour charges locatives. Le bail doit distinguer le loyer hors charges (HC) et le montant des charges, avec régularisation annuelle.",
      objectif:
        "Calculer le loyer hors charges à partir du loyer CC et du montant mensuel des charges récupérables.",
      variables: [
        "Loyer charges comprises (€/mois)",
        "Provisions mensuelles sur charges (€/mois)",
      ],
      formules: [
        hl("Formule", "Loyer hors charges = Loyer CC − Provisions sur charges"),
        p("Le bail doit mentionner séparément le loyer HC et les provisions sur charges."),
      ],
      interpretation: [
        p("Un loyer CC de 950 € avec 120 € de charges correspond à un loyer HC de 830 €. C'est ce montant qui sert de base pour la révision IRL et le dépôt de garantie."),
        hl("Bail", "Le loyer HC est la référence pour l'encadrement des loyers et la révision annuelle."),
      ],
      limitesCalcul: [
        "Provisions estimées, non le décompte réel.",
        "Forfait de charges (meublé) non distingué.",
        "Complément de loyer non ventilé.",
      ],
      example: {
        title: "Décomposition d'un loyer CC de 950 €",
        donnees: [
          "Loyer charges comprises : 950 €/mois",
          "Provisions sur charges : 120 €/mois",
        ],
        calcul: [
          "Loyer HC = 950 − 120 = 830 €",
        ],
        resultat: "Loyer hors charges : 830 € — charges : 120 € — total CC : 950 €.",
        interpretation:
          "Le bail doit indiquer 830 € de loyer HC + 120 € de provisions sur charges. La révision IRL s'applique uniquement sur les 830 €.",
      },
      maillage: [
        { slug: "depot-garantie-locatif", label: "Dépôt de garantie locatif" },
        { slug: "charges-recuperables-locataire", label: "Charges récupérables locataire" },
        { slug: "revision-loyer-irl", label: "Révision loyer IRL" },
      ],
      conseils: [
        "Mentionnez toujours le loyer HC et les charges séparément dans le bail.",
        "Le dépôt de garantie se calcule sur le loyer HC uniquement.",
        "Régularisez les charges chaque année avec le décompte de copropriété.",
        "En meublé, le forfait de charges ne donne pas lieu à régularisation.",
      ],
      limites: [
        "Ventilation simplifiée.",
        "Ne remplace pas la rédaction du bail.",
      ],
    }),
    faq: buildFaq([
      { question: "CC signifie charges comprises ?", answer: "Oui, le loyer CC inclut une provision pour charges locatives." },
      { question: "Comment calculer le loyer HC ?", answer: "Loyer HC = Loyer CC − Provisions sur charges mensuelles." },
      { question: "Le dépôt se calcule sur le CC ou le HC ?", answer: "Sur le loyer hors charges uniquement." },
      { question: "La révision IRL s'applique au CC ou au HC ?", answer: "Uniquement au loyer hors charges." },
      { question: "Forfait de charges vs provisions ?", answer: "Le forfait (meublé) est fixe et non régularisable. Les provisions (nu) sont régularisées annuellement." },
      { question: "Faut-il indiquer le CC dans l'annonce ?", answer: "Oui, c'est obligatoire. Le loyer HC doit aussi être mentionné dans le bail." },
      { question: "Les charges peuvent-elles augmenter ?", answer: "Oui, via la régularisation annuelle si les charges réelles dépassent les provisions." },
      { question: "Comment fixer le montant des provisions ?", answer: "Sur la base des charges récupérables de l'année précédente ou d'une estimation raisonnable." },
    ]),
  },
};
