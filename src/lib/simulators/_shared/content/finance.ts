import { buildRichContent, buildFaq, p, hl } from "../content-builder";
import type { ContentRegistry } from "./types";

export const financeContent: ContentRegistry = {
  "mensualite-credit-consommation": {
    content: buildRichContent({
      intro:
        "Estimez la mensualité d'un prêt personnel ou crédit à la consommation avant de comparer les offres bancaires.",
      definition:
        "La mensualité est le montant fixe remboursé chaque mois pour un crédit à taux fixe. Elle comprend une part de capital et une part d'intérêts, calculées selon la formule d'amortissement constant.",
      objectif:
        "Anticiper votre charge mensuelle, vérifier la compatibilité avec votre budget et comparer plusieurs durées ou montants avant de souscrire.",
      variables: [
        "Montant emprunté (capital financé)",
        "Taux d'intérêt annuel nominal",
        "Durée du crédit en années (12 à 84 mois en pratique)",
      ],
      formules: [
        p("Mensualité = C × [t × (1 + t)^n] / [(1 + t)^n − 1], où C est le capital, t le taux mensuel (taux annuel / 12) et n le nombre de mois."),
        hl("Coût total", "Coût total = (Mensualité × nombre de mois). Intérêts totaux = Coût total − Capital emprunté."),
      ],
      interpretation: [
        p("Une mensualité élevée réduit la durée et le coût des intérêts, mais augmente la charge mensuelle. À l'inverse, allonger la durée baisse la mensualité mais alourdit le coût global."),
        hl("Endettement", "Vérifiez que la mensualité, ajoutée à vos autres crédits, respecte le taux d'endettement maximal de 35 % et laisse un reste à vivre suffisant."),
      ],
      limitesCalcul: [
        "Taux fixe uniquement — pas de crédit à taux variable.",
        "Assurance emprunteur et frais de dossier non inclus.",
        "Hypothèse de remboursement régulier sans anticipation.",
      ],
      example: {
        title: "Prêt personnel de 15 000 € sur 5 ans à 5,5 %",
        donnees: [
          "Montant emprunté : 15 000 €",
          "Taux d'intérêt annuel : 5,5 %",
          "Durée : 5 ans (60 mois)",
        ],
        calcul: [
          "Taux mensuel : 5,5 % / 12 = 0,4583 %",
          "Mensualité = 15 000 × [0,004583 × (1,004583)^60] / [(1,004583)^60 − 1]",
          "Mensualité ≈ 287 €",
          "Coût total = 287 € × 60 = 17 191 €",
          "Intérêts totaux = 17 191 € − 15 000 € = 2 191 €",
        ],
        resultat: "Mensualité estimée : 287 €/mois — coût total du crédit : 2 191 € d'intérêts.",
        interpretation:
          "Avec 287 € par mois, ce crédit représente environ 9 % de revenus nets de 3 200 €. Croisez ce montant avec votre reste à vivre avant de vous engager.",
      },
      maillage: [
        { slug: "cout-total-credit-consommation", label: "Coût total crédit consommation" },
        { slug: "loa-vs-credit-auto", label: "LOA vs crédit auto" },
        { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
      ],
      conseils: [
        "Comparez le TAEG, pas seulement le taux nominal affiché.",
        "Privilégiez la durée la plus courte compatible avec votre budget.",
        "Demandez plusieurs devis (banque, crédit en ligne, organisme spécialisé).",
        "Évitez d'emprunter pour des dépenses non essentielles ou impulsives.",
      ],
      limites: [
        "Estimation indicative — l'offre bancaire fait foi.",
        "Ne tient pas compte de l'assurance emprunteur facultative.",
        "Les conditions varient selon votre profil et votre historique bancaire.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce qu'une mensualité de crédit consommation ?",
        answer:
          "C'est le montant fixe remboursé chaque mois, incluant capital et intérêts, pour un prêt personnel ou crédit renouvelable amortissable.",
      },
      {
        question: "Comment est calculée la mensualité ?",
        answer:
          "Selon la formule d'amortissement à taux fixe : le capital et les intérêts sont répartis sur toute la durée pour obtenir un montant constant chaque mois.",
      },
      {
        question: "Quelle durée choisir pour un crédit consommation ?",
        answer:
          "Entre 1 et 7 ans selon le montant et l'organisme. Une durée plus courte réduit le coût total mais augmente la mensualité.",
      },
      {
        question: "Quelle est la différence entre taux nominal et TAEG ?",
        answer:
          "Le taux nominal est le taux d'intérêt brut. Le TAEG inclut les frais obligatoires et permet une comparaison fiable entre offres.",
      },
      {
        question: "Comment interpréter le résultat du simulateur ?",
        answer:
          "La mensualité affichée doit être compatible avec votre reste à vivre et votre taux d'endettement global (max. 35 % des revenus).",
      },
      {
        question: "L'assurance emprunteur est-elle incluse ?",
        answer:
          "Non. L'assurance est facultative pour le crédit consommation et peut ajouter 10 à 30 € par mois selon votre âge et le capital.",
      },
      {
        question: "Peut-on rembourser par anticipation ?",
        answer:
          "Oui, généralement sans pénalité pour les crédits consommation depuis la loi Lagarde. Vérifiez les conditions contractuelles.",
      },
      {
        question: "Crédit affecté ou non affecté : quelle différence ?",
        answer:
          "Le crédit affecté est lié à un achat précis (auto, travaux). Le non affecté est plus souple mais parfois plus cher.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Ne pas comparer les TAEG, sous-estimer la durée réelle, ou cumuler plusieurs crédits sans recalculer le reste à vivre.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Taux fixe, pas de frais ni d'assurance. Pour un devis exact, consultez votre banque ou un comparateur agréé.",
      },
    ]),
  },

  "interets-composes": {
    content: buildRichContent({
      intro:
        "Visualisez la croissance de votre épargne lorsque les intérêts générés sont réinvestis et produisent eux-mêmes des intérêts.",
      definition:
        "Les intérêts composés désignent le mécanisme par lequel les gains annuels s'ajoutent au capital et participent à la production de nouveaux gains. C'est le principe de la capitalisation.",
      objectif:
        "Projeter un capital futur à partir d'un placement initial et de versements réguliers, pour mesurer l'effet du temps et du rendement sur votre patrimoine.",
      variables: [
        "Capital initial déjà investi",
        "Versement mensuel (optionnel)",
        "Rendement annuel estimé",
        "Durée de placement en années",
      ],
      formules: [
        p("Chaque mois : Capital = Capital × (1 + taux mensuel) + versement mensuel."),
        hl("Capitalisation", "Le taux mensuel = rendement annuel / 12. Les intérêts sont capitalisés à chaque période."),
        p("Gains = Capital final − (Capital initial + total des versements)."),
      ],
      interpretation: [
        p("Plus la durée est longue, plus la part des gains dans le capital final augmente. Les versements réguliers accélèrent fortement la courbe de croissance."),
        hl("Effet boule de neige", "Sur 15 ans, les intérêts peuvent représenter plus de la moitié du capital final — d'où l'intérêt de commencer tôt."),
      ],
      limitesCalcul: [
        "Rendement constant sur toute la période (pas de volatilité).",
        "Versements effectués en début de mois.",
        "Fiscalité, frais de gestion et inflation non intégrés.",
      ],
      example: {
        title: "5 000 € + 200 €/mois sur 15 ans à 5 %",
        donnees: [
          "Capital initial : 5 000 €",
          "Versement mensuel : 200 €",
          "Rendement annuel : 5 %",
          "Durée : 15 ans (180 mois)",
        ],
        calcul: [
          "Taux mensuel : 5 % / 12 = 0,4167 %",
          "Capitalisation mois par mois : capital × 1,004167 + 200 €",
          "Total versé = 5 000 € + (200 € × 180) = 41 000 €",
          "Capital final après 180 mois ≈ 64 026 €",
          "Gains (intérêts) = 64 026 € − 41 000 € = 23 026 €",
        ],
        resultat: "Capital final estimé : 64 026 € — gains : 23 026 € (56 % du capital final).",
        interpretation:
          "Les intérêts composés ont généré plus de la moitié du patrimoine final. Commencer 5 ans plus tôt avec les mêmes paramètres produirait un capital nettement supérieur.",
      },
      maillage: [
        { slug: "rendement-livret-a", label: "Rendement Livret A" },
        { slug: "rendement-pea", label: "Rendement PEA" },
        { slug: "simulateur-retraite", label: "Simulateur retraite" },
      ],
      conseils: [
        "Commencez le plus tôt possible, même avec de petits montants.",
        "Automatisez vos versements mensuels pour lisser le risque.",
        "Réinvestissez dividendes et intérêts pour maximiser la capitalisation.",
        "Diversifiez vos supports selon votre horizon et votre profil de risque.",
      ],
      limites: [
        "Rendement non garanti — les marchés fluctuent.",
        "Inflation et fiscalité non prises en compte.",
        "Ne remplace pas un conseil en gestion de patrimoine.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que les intérêts composés ?",
        answer:
          "Ce sont des intérêts calculés sur le capital initial plus tous les intérêts déjà accumulés. Chaque période, les gains produisent eux-mêmes des gains.",
      },
      {
        question: "Comment fonctionne le simulateur ?",
        answer:
          "Il capitalise mensuellement le capital existant au taux indiqué, puis ajoute le versement mensuel. Le processus se répète sur toute la durée.",
      },
      {
        question: "Quelle formule est utilisée ?",
        answer:
          "Capitalisation mensuelle : à chaque mois, capital = capital × (1 + taux mensuel) + versement. Pas de formule fermée car les versements mensuels sont intégrés.",
      },
      {
        question: "Intérêts simples ou composés : quelle différence ?",
        answer:
          "Avec les intérêts simples, les gains ne sont jamais réinvestis. Les intérêts composés offrent une croissance exponentielle sur longue durée.",
      },
      {
        question: "Quel rendement annuel utiliser ?",
        answer:
          "Livret A : ~3 %. Assurance-vie en fonds euros : 2-3 %. PEA actions diversifié : 6-8 % historique (non garanti).",
      },
      {
        question: "Comment interpréter le capital final ?",
        answer:
          "Comparez-le au total versé pour mesurer l'effet des intérêts. Un écart important confirme l'intérêt de la capitalisation et de la durée.",
      },
      {
        question: "Versements réguliers ou ponctuels ?",
        answer:
          "Les versements réguliers lissent le risque (DCA) et accélèrent la croissance. Les deux peuvent être combinés dans une stratégie d'épargne.",
      },
      {
        question: "L'inflation est-elle prise en compte ?",
        answer:
          "Non. Utilisez le simulateur inflation pour estimer l'érosion du pouvoir d'achat de votre capital final.",
      },
      {
        question: "Quelles erreurs courantes éviter ?",
        answer:
          "Surestimer le rendement, négliger les frais de gestion, ou retirer les gains au lieu de les réinvestir.",
      },
      {
        question: "Quelles sont les limites du calcul ?",
        answer:
          "Rendement constant, pas de fiscalité ni de frais. Les résultats passés ne préjugent pas des performances futures.",
      },
    ]),
  },

  "simulateur-inflation": {
    content: buildRichContent({
      intro:
        "Mesurez l'érosion progressive du pouvoir d'achat de votre épargne laissée en liquidités face à l'inflation.",
      definition:
        "L'inflation est la hausse générale et durable des prix. Elle réduit le pouvoir d'achat d'une somme nominale : 50 000 € aujourd'hui n'achèteront pas la même chose dans 10 ans.",
      objectif:
        "Estimer la valeur réelle future d'un capital non placé, pour ajuster vos objectifs d'épargne et choisir des placements adaptés.",
      variables: [
        "Capital actuel (montant nominal)",
        "Taux d'inflation annuel estimé",
        "Horizon en années",
      ],
      formules: [
        p("Pouvoir d'achat réel = Capital / (1 + inflation)^durée"),
        hl("Perte de valeur", "Perte = Capital nominal − Pouvoir d'achat réel"),
        p("Inflation cumulée = [(1 + inflation)^durée − 1] × 100"),
      ],
      interpretation: [
        p("Un capital qui ne produit pas de rendement supérieur à l'inflation perd de sa valeur réelle chaque année, même si le montant en euros reste identique."),
        hl("Repère", "À 2,5 % d'inflation sur 10 ans, 50 000 € valent environ 39 060 € en pouvoir d'achat — soit une perte de 10 940 €."),
      ],
      limitesCalcul: [
        "Inflation moyenne constante sur la période.",
        "Ne distingue pas les postes de dépenses (énergie, alimentation, logement).",
        "Capital considéré comme non rémunéré.",
      ],
      example: {
        title: "50 000 € laissés 10 ans avec une inflation de 2,5 %",
        donnees: [
          "Capital actuel : 50 000 €",
          "Taux d'inflation annuel : 2,5 %",
          "Durée : 10 ans",
        ],
        calcul: [
          "Facteur d'érosion = (1 + 0,025)^10 = 1,2801",
          "Pouvoir d'achat réel = 50 000 € / 1,2801 = 39 060 €",
          "Perte de valeur = 50 000 € − 39 060 € = 10 940 €",
          "Inflation cumulée ≈ 28,0 %",
        ],
        resultat: "Pouvoir d'achat réel dans 10 ans : 39 060 € (−10 940 € de perte).",
        interpretation:
          "Sans placement, votre épargne perd plus d'un cinquième de sa valeur réelle. Un Livret A à 3 % compense partiellement cette érosion.",
      },
      maillage: [
        { slug: "interets-composes", label: "Intérêts composés" },
        { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
        { slug: "rendement-livret-a", label: "Rendement Livret A" },
      ],
      conseils: [
        "Placez votre épargne sur des actifs qui battent l'inflation à long terme.",
        "Réévaluez vos objectifs financiers tous les 2-3 ans.",
        "Gardez une part en liquidités pour les imprévus, investissez le surplus.",
        "Intégrez l'inflation dans vos projections retraite (minimum 2 %).",
      ],
      limites: [
        "Inflation variable d'une année à l'autre.",
        "Ne modélise pas les hausses sectorielles (énergie, santé).",
        "Estimation pédagogique, pas une prévision économique.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que l'érosion du pouvoir d'achat ?",
        answer:
          "C'est la perte de valeur réelle d'une somme d'argent lorsque les prix augmentent plus vite que le rendement de votre épargne.",
      },
      {
        question: "Comment le simulateur calcule-t-il la valeur réelle ?",
        answer:
          "Il divise le capital nominal par (1 + taux d'inflation)^nombre d'années pour obtenir l'équivalent en pouvoir d'achat d'aujourd'hui.",
      },
      {
        question: "Quel taux d'inflation utiliser ?",
        answer:
          "L'inflation moyenne en France est d'environ 2 à 3 % sur longue période. Pour les retraites, prévoyez 2 % minimum par prudence.",
      },
      {
        question: "Comment interpréter la perte de valeur ?",
        answer:
          "Elle représente ce que votre capital ne pourra plus acheter dans le futur. Plus l'horizon est long, plus la perte est importante.",
      },
      {
        question: "Le Livret A protège-t-il de l'inflation ?",
        answer:
          "Le taux du Livret A est indexé sur l'inflation + 0,5 %, mais peut temporairement être inférieur à l'inflation réelle.",
      },
      {
        question: "Inflation et retraite : quel lien ?",
        answer:
          "Vos besoins futurs seront plus élevés en euros nominaux. Anticipez une inflation de 2 % minimum dans vos projections.",
      },
      {
        question: "Comment protéger son épargne ?",
        answer:
          "Actions, immobilier, obligations indexées inflation ou placements diversifiés offrent historiquement une meilleure protection que les liquidités.",
      },
      {
        question: "L'inflation est-elle toujours la même ?",
        answer:
          "Non. Elle varie fortement d'une année à l'autre (2022-2023 : pic à 5-6 %, puis retour vers 2-3 %). Le simulateur utilise un taux moyen constant.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Penser que 50 000 € resteront « 50 000 € de pouvoir d'achat », ou négliger l'inflation dans les projections long terme.",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "Taux constant, pas de rémunération du capital. Pour une analyse fine, croisez avec le simulateur intérêts composés.",
      },
    ]),
  },

  "budget-reste-a-vivre": {
    content: buildRichContent({
      intro:
        "Calculez le montant disponible chaque mois pour vos dépenses courantes, loisirs et épargne après déduction des charges obligatoires.",
      definition:
        "Le reste à vivre est la somme qu'il vous reste après paiement du logement, des crédits en cours et des charges fixes incompressibles. C'est un indicateur clé pour les banques et pour votre budget personnel.",
      objectif:
        "Vérifier la soutenabilité de votre budget, préparer une demande de crédit ou identifier des postes de dépenses à optimiser.",
      variables: [
        "Revenus nets mensuels (salaires, pensions, allocations)",
        "Logement (loyer ou mensualité crédit + charges de copropriété)",
        "Autres crédits mensuels (auto, consommation, revolving)",
        "Charges fixes (énergie, assurances, téléphone, transports, cantine…)",
      ],
      formules: [
        p("Reste à vivre = Revenus nets − Logement − Crédits − Charges fixes"),
        hl("Part disponible", "Part disponible (%) = Reste à vivre / Revenus nets × 100"),
      ],
      interpretation: [
        p("Un reste à vivre confortable laisse de la marge pour l'alimentation, les loisirs et l'épargne. Un reste faible signale un budget tendu ou un endettement excessif."),
        hl("Seuil bancaire", "Les banques exigent souvent 800 à 1 200 € de reste à vivre par adulte, variable selon la zone géographique et la composition du foyer."),
      ],
      limitesCalcul: [
        "Charges variables (courses, loisirs) non déduites.",
        "Revenus nets saisis manuellement — pas de calcul automatique.",
        "Seuils bancaires indicatifs, non contractuels.",
      ],
      example: {
        title: "Foyer avec 3 200 € de revenus nets mensuels",
        donnees: [
          "Revenus nets mensuels : 3 200 €",
          "Logement (loyer + charges) : 950 €",
          "Autres crédits mensuels : 280 €",
          "Charges fixes : 350 €",
        ],
        calcul: [
          "Charges totales = 950 € + 280 € + 350 € = 1 580 €",
          "Reste à vivre = 3 200 € − 1 580 € = 1 620 €",
          "Part disponible = 1 620 € / 3 200 € × 100 = 50,6 %",
        ],
        resultat: "Reste à vivre : 1 620 €/mois (51 % des revenus).",
        interpretation:
          "Avec 1 620 € disponibles, le budget est soutenable pour un adulte seul dans la plupart des zones. Ce montant doit couvrir alimentation, santé, loisirs et épargne.",
      },
      maillage: [
        { slug: "mensualite-credit-consommation", label: "Mensualité crédit consommation" },
        { slug: "simulateur-inflation", label: "Simulateur inflation" },
        { slug: "frais-kilometriques", label: "Frais kilométriques" },
      ],
      conseils: [
        "Listez toutes vos charges récurrentes sur 3 mois pour ne rien oublier.",
        "Gardez une réserve d'au moins un mois de reste à vivre pour les imprévus.",
        "Réévaluez votre budget chaque trimestre ou à chaque changement de situation.",
        "Renégociez les contrats (assurance, énergie, mobile) pour libérer du reste à vivre.",
      ],
      limites: [
        "Estimation simplifiée — dépenses variables non incluses.",
        "Seuils bancaires variables selon l'établissement et la région.",
        "Ne remplace pas un bilan budgétaire complet avec un conseiller.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le reste à vivre ?",
        answer:
          "C'est le montant mensuel disponible après déduction du logement, des crédits et des charges fixes obligatoires.",
      },
      {
        question: "Comment le calculer ?",
        answer:
          "Soustrayez de vos revenus nets le loyer ou la mensualité, les autres crédits et les charges fixes (énergie, assurances, etc.).",
      },
      {
        question: "Quel reste à vivre minimum pour obtenir un crédit ?",
        answer:
          "Les banques exigent généralement 800 à 1 200 € par adulte, parfois plus en zone tendue (Île-de-France).",
      },
      {
        question: "Reste à vivre et taux d'endettement : quel lien ?",
        answer:
          "Même avec un endettement sous 35 %, un reste à vivre insuffisant peut faire refuser un nouveau crédit.",
      },
      {
        question: "Quelles charges inclure dans « charges fixes » ?",
        answer:
          "Énergie, assurances, téléphone, internet, transports, cantine, garde d'enfants, abonnements essentiels.",
      },
      {
        question: "Comment interpréter un reste à vivre faible ?",
        answer:
          "Identifiez les postes compressibles, renégociez vos crédits ou reportez les nouveaux emprunts.",
      },
      {
        question: "Comment augmenter son reste à vivre ?",
        answer:
          "Réduire les charges fixes, rembourser les crédits les plus coûteux, ou augmenter les revenus (heures sup, activité complémentaire).",
      },
      {
        question: "Faut-il inclure l'épargne dans le calcul ?",
        answer:
          "Non. Le reste à vivre est ce qui reste avant l'épargne volontaire et les dépenses courantes variables.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Oublier un crédit revolving, sous-estimer les charges de copropriété ou les dépenses annuelles réparties (impôts, entretien auto).",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "Pas de prise en compte des dépenses variables ni des charges exceptionnelles. Complétez avec un suivi budgétaire mensuel.",
      },
    ]),
  },

  "simulateur-retraite": {
    content: buildRichContent({
      intro:
        "Projetez le capital que vous pourrez accumuler d'ici la retraite grâce à une épargne régulière, en complément de vos droits sociaux.",
      definition:
        "L'épargne retraite personnelle est un capital investi progressivement pour compléter les pensions de la Sécurité sociale et des régimes complémentaires. Sa projection dépend du rendement, de la durée et des versements.",
      objectif:
        "Estimer un capital retraite à un âge donné et en déduire un revenu mensuel potentiel selon la règle des 4 %.",
      variables: [
        "Âge actuel et âge de retraite visé",
        "Capital retraite déjà constitué",
        "Versement mensuel prévu",
        "Rendement annuel estimé",
      ],
      formules: [
        p("Capitalisation mensuelle : à chaque mois, capital = capital × (1 + taux mensuel) + versement."),
        hl("Règle des 4 %", "Retrait mensuel durable = Capital × 4 % / 12. Cette règle vise un capital préservé sur 25-30 ans."),
        p("Horizon = (Âge retraite − Âge actuel) × 12 mois."),
      ],
      interpretation: [
        p("Le capital estimé montre le complément possible à vos pensions légales. Le retrait à 4 % donne un ordre de grandeur du revenu mensuel sans épuiser le capital trop vite."),
        hl("PER", "Le Plan d'Épargne Retraite offre une réduction d'impôt sur les versements, mais les fonds sont bloqués jusqu'à la retraite (sauf cas de déblocage anticipé)."),
      ],
      limitesCalcul: [
        "Rendement constant — pas de volatilité des marchés.",
        "Ne remplace pas une simulation officielle (M@rel, Info-retraite).",
        "Retrait à 4 % simplifié — pas de prise en compte de l'inflation future.",
      ],
      example: {
        title: "Épargne retraite à partir de 35 ans, départ à 62 ans",
        donnees: [
          "Âge actuel : 35 ans — retraite visée : 62 ans (27 ans)",
          "Capital actuel : 15 000 €",
          "Versement mensuel : 300 €",
          "Rendement annuel : 4 %",
        ],
        calcul: [
          "Horizon : 27 ans × 12 = 324 mois",
          "Taux mensuel : 4 % / 12 = 0,3333 %",
          "Capitalisation mois par mois sur 324 mois",
          "Versements totaux = 15 000 € + (300 € × 324) = 112 200 €",
          "Capital final estimé ≈ 218 637 €",
          "Retrait mensuel (4 %) = 218 637 € × 4 % / 12 ≈ 729 €",
        ],
        resultat: "Capital retraite estimé : 218 637 € — retrait durable : 729 €/mois.",
        interpretation:
          "Ce complément de 729 €/mois s'ajoute à vos pensions légales. En euros constants d'aujourd'hui, l'inflation réduira ce pouvoir d'achat — prévoyez des versements croissants.",
      },
      maillage: [
        { slug: "interets-composes", label: "Intérêts composés" },
        { slug: "rendement-pea", label: "Rendement PEA" },
        { slug: "simulateur-inflation", label: "Simulateur inflation" },
      ],
      conseils: [
        "Commencez tôt, même avec 50-100 € par mois.",
        "Envisagez un PER pour la réduction d'impôt si vous êtes imposable.",
        "Réévaluez vos versements chaque année à la hausse (indexation sur salaire).",
        "Diversifiez entre PER, assurance-vie et PEA selon votre horizon.",
      ],
      limites: [
        "Ne remplace pas Info-retraite ou M@rel pour les droits sociaux.",
        "Rendement non garanti — scénarios prudents recommandés.",
        "Fiscalité à la sortie non détaillée ici.",
      ],
    }),
    faq: buildFaq([
      {
        question: "À quoi sert le simulateur retraite ?",
        answer:
          "Il projette un capital d'épargne personnelle complémentaire aux pensions de la Sécurité sociale, selon vos versements et un rendement estimé.",
      },
      {
        question: "Comment est calculé le capital final ?",
        answer:
          "Par capitalisation mensuelle du capital existant au rendement indiqué, avec ajout du versement mensuel, sur la durée entre aujourd'hui et l'âge de retraite.",
      },
      {
        question: "Qu'est-ce que la règle des 4 % ?",
        answer:
          "Elle estime qu'un retrait annuel de 4 % du capital permet de le préserver environ 25-30 ans, en supposant un rendement moyen de 5-7 %.",
      },
      {
        question: "PER ou PEA pour la retraite ?",
        answer:
          "Le PER offre une réduction d'impôt à l'entrée mais bloque les fonds. Le PEA est plus souple mais sans avantage fiscal immédiat.",
      },
      {
        question: "Quel rendement utiliser ?",
        answer:
          "4 % est prudent (fonds euros + obligations). 6-7 % pour un portefeuille actions diversifié sur long terme, avec volatilité.",
      },
      {
        question: "Comment interpréter le retrait mensuel ?",
        answer:
          "C'est un ordre de grandeur de complément de revenu, en euros d'aujourd'hui. Corrigez mentalement pour l'inflation future.",
      },
      {
        question: "Ce simulateur remplace-t-il M@rel ?",
        answer:
          "Non. M@rel et Info-retraite calculent vos droits sociaux. Ce simulateur couvre uniquement l'épargne personnelle.",
      },
      {
        question: "Faut-il tenir compte de l'inflation ?",
        answer:
          "Oui. Intégrez 2 % d'inflation minimum dans vos besoins futurs. 729 € dans 27 ans auront un pouvoir d'achat bien inférieur.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Compter uniquement sur l'épargne sans vérifier vos droits sociaux, ou surestimer le rendement (8-10 % de façon systématique).",
      },
      {
        question: "Quelles sont les limites du calcul ?",
        answer:
          "Rendement constant, pas de fiscalité à la sortie, pas de prise en compte des aléas (chômage, baisse de revenus).",
      },
    ]),
  },

  "rendement-livret-a": {
    content: buildRichContent({
      intro:
        "Estimez les intérêts produits par votre Livret A sur une période donnée, dans un cadre fiscal avantageux et sans risque.",
      definition:
        "Le Livret A est un livret d'épargne réglementé, exonéré d'impôt et de prélèvements sociaux, rémunéré semestriellement par un taux fixé par l'État. Son plafond est de 22 950 €.",
      objectif:
        "Comparer le rendement du Livret A à d'autres placements sans risque et planifier le remplissage de votre épargne de précaution.",
      variables: [
        "Capital déposé sur le Livret A (plafonné à 22 950 €)",
        "Taux Livret A en vigueur",
        "Durée de placement en années",
      ],
      formules: [
        p("Capital final = Capital × (1 + taux)^durée — capitalisation annuelle simplifiée."),
        hl("Intérêts", "Intérêts totaux = Capital final − Capital initial"),
        p("En réalité, les intérêts sont calculés par quinzaine sur le solde créditeur, ce qui légèrement modifie le résultat."),
      ],
      interpretation: [
        p("Le Livret A convient à l'épargne de précaution : disponible immédiatement, sans risque et défiscalisé. Son rendement reste souvent proche de l'inflation."),
        hl("Plafond", "Au-delà de 22 950 €, l'excédent ne produit plus d'intérêts — orientez-le vers le LDDS ou d'autres supports."),
      ],
      limitesCalcul: [
        "Calcul simplifié — quinzaine non modélisée.",
        "Taux supposé constant (révisé chaque semestre en réalité).",
        "Versements et retraits intermédiaires non simulés.",
      ],
      example: {
        title: "15 000 € sur Livret A à 3 % pendant 5 ans",
        donnees: [
          "Capital sur Livret A : 15 000 €",
          "Taux annuel : 3 %",
          "Durée : 5 ans",
        ],
        calcul: [
          "Capital final = 15 000 € × (1,03)^5",
          "Capital final = 15 000 € × 1,1593 = 17 389 €",
          "Intérêts totaux = 17 389 € − 15 000 € = 2 389 €",
        ],
        resultat: "Intérêts estimés : 2 389 € sur 5 ans — capital final : 17 389 €.",
        interpretation:
          "Avec 3 % net d'impôt, le Livret A compense l'inflation si celle-ci reste autour de 2-2,5 %. Remplissez le plafond avant d'investir ailleurs.",
      },
      maillage: [
        { slug: "interets-composes", label: "Intérêts composés" },
        { slug: "rendement-pea", label: "Rendement PEA" },
        { slug: "simulateur-inflation", label: "Simulateur inflation" },
      ],
      conseils: [
        "Remplissez le plafond Livret A (22 950 €) en priorité.",
        "Complétez avec le LDDS (12 950 € supplémentaires, même taux).",
        "Vérifiez le taux en vigueur à chaque révision semestrielle.",
        "Ne laissez pas de grosses sommes dormir sur un compte courant non rémunéré.",
      ],
      limites: [
        "Taux variable — consultez le taux officiel en vigueur.",
        "Calcul par quinzaine non modélisé.",
        "Ne compare pas au rendement des placements risqués (PEA, actions).",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le Livret A ?",
        answer:
          "Un livret d'épargne réglementé, disponible sans condition de revenus, exonéré d'impôt et plafonné à 22 950 €.",
      },
      {
        question: "Comment sont calculés les intérêts ?",
        answer:
          "Par quinzaine sur le solde créditeur, au taux en vigueur. Le simulateur utilise une capitalisation annuelle simplifiée.",
      },
      {
        question: "Quel est le plafond du Livret A ?",
        answer:
          "22 950 € depuis 2013. Les intérêts capitalisés ne sont pas soumis au plafond.",
      },
      {
        question: "Le Livret A est-il imposable ?",
        answer:
          "Non. Intérêts totalement exonérés d'impôt sur le revenu et de prélèvements sociaux.",
      },
      {
        question: "Quel taux utiliser dans le simulateur ?",
        answer:
          "Le taux en vigueur, révisé chaque semestre (février et août). Vérifiez sur service-public.fr ou auprès de votre banque.",
      },
      {
        question: "Livret A ou LDDS : lequel remplir en premier ?",
        answer:
          "Le Livret A d'abord (plafond 22 950 €), puis le LDDS (12 950 €, même taux, même fiscalité).",
      },
      {
        question: "Les intérêts sont-ils composés sur le Livret A ?",
        answer:
          "Oui. Les intérêts sont capitalisés et produisent eux-mêmes des intérêts les mois suivants.",
      },
      {
        question: "Comment interpréter le résultat ?",
        answer:
          "Comparez les intérêts à l'inflation estimée. Si le taux est inférieur à l'inflation, le pouvoir d'achat diminue malgré les gains nominaux.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Dépasser le plafond sans le savoir, ou comparer le Livret A au rendement brut d'un PEA sans tenir compte du risque.",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "Pas de modélisation par quinzaine, pas de mouvements (dépôts/retraits) intermédiaires, taux constant.",
      },
    ]),
  },

  "rendement-pea": {
    content: buildRichContent({
      intro:
        "Estimez la performance nette de votre Plan d'Épargne en Actions (PEA) en tenant compte de la fiscalité avant et après 5 ans de détention.",
      definition:
        "Le PEA est un enveloppe fiscale permettant d'investir en actions et ETF européens. Après 5 ans de détention, les plus-values sont exonérées d'impôt sur le revenu — seuls les prélèvements sociaux (17,2 %) s'appliquent.",
      objectif:
        "Comparer le gain net d'un PEA selon la durée de détention et le régime fiscal, pour optimiser votre stratégie d'investissement.",
      variables: [
        "Capital investi (versements cumulés)",
        "Rendement annuel brut estimé",
        "Durée de placement en années",
        "Régime fiscal : après 5 ans (PS 17,2 %) ou flat tax 30 %",
      ],
      formules: [
        p("Capital brut = Capital initial × (1 + rendement)^durée"),
        hl("Avant 5 ans", "Fiscalité = Gain × 30 % (flat tax : 12,8 % IR + 17,2 % PS)"),
        hl("Après 5 ans", "Fiscalité = Gain × 17,2 % (prélèvements sociaux uniquement)"),
        p("Capital net = Capital brut − Fiscalité"),
      ],
      interpretation: [
        p("La fiscalité réduite après 5 ans peut représenter plusieurs milliers d'euros d'économie sur un placement long terme. Ne retirez pas avant ce délai sauf nécessité absolue."),
        hl("Risque", "Le rendement n'est pas garanti. Un PEA investi en actions peut connaître des années négatives — l'horizon long terme est recommandé."),
      ],
      limitesCalcul: [
        "Rendement constant — pas de volatilité ni de scénarios pessimistes.",
        "Frais de gestion et droits de garde non inclus.",
        "Versements progressifs non modélisés (capital unique).",
      ],
      example: {
        title: "20 000 € investis à 7 % sur 10 ans, fiscalité après 5 ans",
        donnees: [
          "Capital investi : 20 000 €",
          "Rendement annuel brut : 7 %",
          "Durée : 10 ans",
          "Régime : après 5 ans (PS 17,2 % uniquement)",
        ],
        calcul: [
          "Capital brut = 20 000 € × (1,07)^10 = 39 343 €",
          "Gain brut = 39 343 € − 20 000 € = 19 343 €",
          "Fiscalité = 19 343 € × 17,2 % = 3 327 €",
          "Capital net = 39 343 € − 3 327 € = 36 016 €",
          "Gain net = 19 343 € − 3 327 € = 16 016 €",
        ],
        resultat: "Capital net estimé : 36 016 € — gain net : 16 016 € (vs 13 540 € en flat tax 30 %).",
        interpretation:
          "Tenir le PEA 5 ans permet d'économiser environ 2 500 € de fiscalité par rapport à la flat tax. Privilégiez des ETF diversifiés et des versements réguliers.",
      },
      maillage: [
        { slug: "interets-composes", label: "Intérêts composés" },
        { slug: "rendement-livret-a", label: "Rendement Livret A" },
        { slug: "simulateur-retraite", label: "Simulateur retraite" },
      ],
      conseils: [
        "Ne retirez pas avant 5 ans pour bénéficier de la fiscalité optimale.",
        "Diversifiez via des ETF européens (MSCI World, Euro Stoxx).",
        "Versez régulièrement pour lisser la volatilité (DCA).",
        "Comparez les frais de gestion entre les établissements (PEA en ligne souvent moins cher).",
      ],
      limites: [
        "Rendement non garanti — marchés volatils.",
        "Frais de gestion et droits de garde non inclus.",
        "Plafond de versements : 150 000 € sur le PEA classique.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le PEA ?",
        answer:
          "Le Plan d'Épargne en Actions est une enveloppe fiscale pour investir en actions et ETF européens, avec des avantages fiscaux après 5 ans.",
      },
      {
        question: "Quand le PEA est-il fiscalement optimisé ?",
        answer:
          "Après 5 ans de détention du compte : les plus-values sont exonérées d'IR, seuls les prélèvements sociaux (17,2 %) s'appliquent.",
      },
      {
        question: "Quelle fiscalité avant 5 ans ?",
        answer:
          "Flat tax de 30 % (12,8 % d'impôt sur le revenu + 17,2 % de prélèvements sociaux) sur l'ensemble des gains.",
      },
      {
        question: "Comment est calculé le capital net ?",
        answer:
          "Capital brut = capital × (1 + rendement)^durée. Gain = capital brut − capital initial. Fiscalité appliquée selon le régime. Net = brut − fiscalité.",
      },
      {
        question: "Quel rendement utiliser ?",
        answer:
          "Historiquement, un portefeuille actions diversifié a rapporté 6-8 % par an sur long terme. Utilisez 5-7 % pour un scénario prudent.",
      },
      {
        question: "PEA ou compte-titres ordinaire ?",
        answer:
          "Le PEA est plus avantageux fiscalement après 5 ans pour les actions européennes. Le compte-titres convient pour les actions non européennes.",
      },
      {
        question: "Quel est le plafond du PEA ?",
        answer:
          "150 000 € de versements sur le PEA classique. Les plus-values ne sont pas plafonnées.",
      },
      {
        question: "Retrait partiel possible ?",
        answer:
          "Oui, mais un retrait avant 5 ans entraîne la clôture du PEA (sauf PEA-PME). Planifiez vos besoins de liquidités en conséquence.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Retirer avant 5 ans, investir sans diversification, ou ignorer les frais de gestion qui grignotent le rendement.",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "Rendement constant, capital unique, pas de frais. Les performances passées ne garantissent pas les résultats futurs.",
      },
    ]),
  },

  "cout-total-credit-consommation": {
    content: buildRichContent({
      intro:
        "Calculez le coût réel d'un crédit à la consommation : intérêts, frais de dossier et TAEG simplifié pour comparer les offres.",
      definition:
        "Le coût total d'un crédit est la différence entre le montant total remboursé (mensualités + frais) et le capital emprunté. Le TAEG (Taux Annuel Effectif Global) intègre tous les frais obligatoires.",
      objectif:
        "Visualiser le surcoût réel d'un emprunt, au-delà de la mensualité seule, et comparer objectivement plusieurs propositions.",
      variables: [
        "Montant emprunté",
        "Taux d'intérêt annuel nominal",
        "Durée en années",
        "Frais de dossier (€)",
      ],
      formules: [
        p("Mensualité = formule d'amortissement à taux fixe (identique au simulateur mensualité)."),
        hl("Coût total", "Coût total = (Mensualité × durée en mois) + Frais − Capital emprunté"),
        p("TAEG approximatif = Coût total / Capital / Durée × 100"),
      ],
      interpretation: [
        p("Le coût total révèle le « prix » réel du crédit. Deux offres avec des mensualités proches peuvent avoir des coûts totaux très différents selon les frais et la durée."),
        hl("TAEG", "Comparez toujours les TAEG entre offres — c'est l'indicateur réglementaire le plus fiable pour choisir un crédit."),
      ],
      limitesCalcul: [
        "TAEG simplifié — l'offre bancaire fournit le TAEG exact.",
        "Assurance emprunteur non incluse.",
        "Taux fixe uniquement.",
      ],
      example: {
        title: "Crédit de 10 000 € sur 4 ans à 6 % avec 150 € de frais",
        donnees: [
          "Montant emprunté : 10 000 €",
          "Taux d'intérêt : 6 %",
          "Durée : 4 ans (48 mois)",
          "Frais de dossier : 150 €",
        ],
        calcul: [
          "Mensualité ≈ 235 €",
          "Total remboursé = 235 € × 48 = 11 273 €",
          "Total payé = 11 273 € + 150 € = 11 423 €",
          "Coût total = 11 423 € − 10 000 € = 1 423 €",
          "Dont intérêts = 1 423 € − 150 € = 1 273 €",
          "TAEG approx. ≈ 3,6 %",
        ],
        resultat: "Coût total du crédit : 1 423 € (dont 150 € de frais) — TAEG approx. 3,6 %.",
        interpretation:
          "Emprunter 10 000 € vous coûte en réalité 11 423 €. Négociez les frais de dossier et comparez avec au moins 3 offres avant de signer.",
      },
      maillage: [
        { slug: "mensualite-credit-consommation", label: "Mensualité crédit consommation" },
        { slug: "loa-vs-credit-auto", label: "LOA vs crédit auto" },
        { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
      ],
      conseils: [
        "Comparez les TAEG, jamais les taux nominaux seuls.",
        "Négociez ou supprimez les frais de dossier (souvent possibles en ligne).",
        "Refusez l'assurance groupée si vous avez déjà une couverture adaptée.",
        "Privilégiez la durée la plus courte compatible avec votre budget.",
      ],
      limites: [
        "TAEG simplifié — consultez l'offre pour le TAEG réglementaire exact.",
        "Assurance emprunteur non incluse par défaut.",
        "Ne tient pas compte des pénalités de remboursement anticipé.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le coût total d'un crédit ?",
        answer:
          "C'est la somme de tous les intérêts et frais payés en plus du capital emprunté, sur toute la durée du prêt.",
      },
      {
        question: "Différence entre taux nominal et TAEG ?",
        answer:
          "Le taux nominal est le taux d'intérêt brut. Le TAEG inclut les frais obligatoires et reflète le coût réel annuel du crédit.",
      },
      {
        question: "Comment le simulateur calcule-t-il le coût ?",
        answer:
          "Mensualité × nombre de mois + frais de dossier − capital emprunté = coût total.",
      },
      {
        question: "Les frais de dossier sont-ils négociables ?",
        answer:
          "Oui, souvent supprimés ou réduits, surtout pour les crédits en ligne ou les bons profils emprunteurs.",
      },
      {
        question: "L'assurance emprunteur est-elle obligatoire ?",
        answer:
          "Non pour le crédit consommation (contrairement au crédit immobilier). Elle reste facultative mais peut être proposée.",
      },
      {
        question: "Comment interpréter le TAEG approximatif ?",
        answer:
          "C'est un ordre de grandeur. Le TAEG exact de l'offre bancaire prime. Un TAEG au-dessus de 8-10 % est généralement élevé.",
      },
      {
        question: "Coût total vs mensualité : lequel regarder ?",
        answer:
          "Les deux. La mensualité pour votre budget mensuel, le coût total pour évaluer le surcoût réel et comparer les durées.",
      },
      {
        question: "Un crédit court ou long : lequel coûte moins ?",
        answer:
          "Un crédit plus court coûte moins en intérêts totaux, mais la mensualité est plus élevée.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Se focaliser sur la mensualité seule, ignorer les frais de dossier, ou ne pas comparer les TAEG entre plusieurs organismes.",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "TAEG simplifié, pas d'assurance ni de frais annexes variables. L'offre contractuelle fait foi.",
      },
    ]),
  },

  "loa-vs-credit-auto": {
    content: buildRichContent({
      intro:
        "Comparez le coût total d'une Location avec Option d'Achat (LOA) et d'un crédit auto classique pour choisir le meilleur financement.",
      definition:
        "La LOA (leasing) consiste à payer des loyers mensuels pour utiliser un véhicule, avec une option d'achat en fin de contrat. Le crédit auto vous rend propriétaire dès le départ, avec des mensualités d'amortissement.",
      objectif:
        "Identifier la formule la moins coûteuse selon votre usage (durée de détention, kilométrage) et la valeur de reprise estimée du véhicule.",
      variables: [
        "Prix du véhicule",
        "Mensualité LOA et durée du contrat",
        "Taux et durée du crédit auto",
        "Valeur de reprise estimée en fin de crédit",
      ],
      formules: [
        p("Coût total LOA = Mensualité LOA × durée LOA en mois"),
        hl("Crédit auto", "Coût net crédit = (Mensualité crédit × durée en mois) − Valeur de reprise"),
        p("Écart = Coût total LOA − Coût net crédit. L'option la moins chère est celle avec le coût le plus bas."),
      ],
      interpretation: [
        p("La LOA est souvent plus avantageuse si vous changez de véhicule tous les 3-4 ans et ne souhaitez pas gérer la revente. Le crédit l'est si vous gardez le véhicule longtemps et bénéficiez de la valeur de reprise."),
        hl("Attention LOA", "Vérifiez les frais de restitution (état du véhicule, kilométrage dépassé) qui peuvent alourdir le coût réel."),
      ],
      limitesCalcul: [
        "Option d'achat LOA non incluse dans le coût LOA affiché.",
        "Valeur de reprise estimée — marché de l'occasion variable.",
        "Assurance, entretien et carburant non comparés.",
      ],
      example: {
        title: "Véhicule à 28 000 € — LOA 4 ans vs crédit 5 ans",
        donnees: [
          "Prix du véhicule : 28 000 €",
          "LOA : 320 €/mois sur 4 ans",
          "Crédit auto : 4,5 % sur 5 ans",
          "Valeur de reprise estimée : 12 000 €",
        ],
        calcul: [
          "Coût total LOA = 320 € × 48 = 15 360 €",
          "Mensualité crédit ≈ 522 €",
          "Total crédit = 522 € × 60 = 31 320 €",
          "Coût net crédit = 31 320 € − 12 000 € = 19 320 €",
          "Écart = 15 360 € − 19 320 € = −3 960 € (LOA moins chère)",
        ],
        resultat: "LOA semble plus avantageuse — écart : 3 960 € en faveur de la LOA.",
        interpretation:
          "Sur 4 ans, la LOA coûte moins cher car vous ne financez pas la propriété. Si vous gardez le véhicule 8-10 ans, le crédit devient généralement plus intéressant grâce à la revente.",
      },
      maillage: [
        { slug: "mensualite-credit-consommation", label: "Mensualité crédit consommation" },
        { slug: "cout-total-credit-consommation", label: "Coût total crédit consommation" },
        { slug: "frais-kilometriques", label: "Frais kilométriques" },
      ],
      conseils: [
        "Négociez le prix du véhicule avant de choisir le mode de financement.",
        "Vérifiez les frais de restitution LOA (rayures, kilométrage, usure).",
        "Le crédit est souvent moins cher si vous gardez le véhicule plus de 5 ans.",
        "Comparez aussi l'assurance : parfois incluse en LOA, à souscrire séparément en crédit.",
      ],
      limites: [
        "Valeur de reprise estimée — consultez Argus ou La Centrale.",
        "Option d'achat LOA non incluse dans le calcul.",
        "Entretien, assurance et carburant non comparés.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que la LOA ?",
        answer:
          "La Location avec Option d'Achat est un leasing automobile : vous payez des loyers pour utiliser le véhicule, avec possibilité de l'acheter en fin de contrat.",
      },
      {
        question: "LOA ou crédit auto : lequel est moins cher ?",
        answer:
          "Cela dépend de la durée de détention. LOA si vous changez tous les 3-4 ans ; crédit si vous gardez le véhicule longtemps.",
      },
      {
        question: "Comment le simulateur compare-t-il les deux ?",
        answer:
          "Coût LOA = loyers totaux. Coût net crédit = mensualités totales − valeur de reprise. L'écart indique l'option la moins chère.",
      },
      {
        question: "Qu'est-ce que l'option d'achat LOA ?",
        answer:
          "Montant à payer en fin de LOA pour devenir propriétaire, souvent 40-60 % du prix initial. Non inclus dans le coût LOA du simulateur.",
      },
      {
        question: "La valeur de reprise est-elle fiable ?",
        answer:
          "C'est une estimation. Consultez l'Argus ou des annonces similaires pour affiner. Le marché de l'occasion fluctue.",
      },
      {
        question: "LOA et kilométrage : quel lien ?",
        answer:
          "Les LOA limitent le kilométrage annuel. Un dépassement entraîne des pénalités au km qui alourdissent le coût réel.",
      },
      {
        question: "LOA pour un professionnel ?",
        answer:
          "La LOA peut optimiser la fiscalité pro (véhicule hors actif). Le crédit convient si vous souhaitez amortir le véhicule.",
      },
      {
        question: "Comment interpréter le résultat ?",
        answer:
          "L'option avec le coût le plus bas est financièrement plus avantageuse, toutes choses égales. Intégrez aussi la flexibilité et vos habitudes.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Négliger les frais de restitution LOA, sous-estimer la valeur de reprise, ou choisir la LOA sans vérifier le plafond kilométrique.",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "Option d'achat LOA, assurance et entretien non inclus. Valeur de reprise indicative.",
      },
    ]),
  },

  "frais-kilometriques": {
    content: buildRichContent({
      intro:
        "Estimez vos frais kilométriques professionnels déductibles selon le barème fiscal officiel simplifié.",
      definition:
        "Les frais kilométriques permettent aux salariés et indépendants de déduire les dépenses liées à l'utilisation d'un véhicule personnel pour des trajets professionnels, selon un barème forfaitaire en euros par kilomètre.",
      objectif:
        "Calculer le montant déductible de vos revenus professionnels ou le remboursement à demander à votre employeur pour vos déplacements pro.",
      variables: [
        "Kilomètres professionnels parcourus par an",
        "Puissance fiscale du véhicule (CV)",
        "Type de véhicule : thermique ou électrique",
      ],
      formules: [
        p("Frais annuels = Kilomètres × Coefficient (€/km) selon la puissance fiscale"),
        hl("Barème simplifié", "3 CV : 0,410 €/km — 4 CV : 0,493 €/km — 5 CV : 0,543 €/km — 6 CV : 0,568 €/km — 7 CV+ : 0,601 €/km"),
        p("Véhicule électrique : frais × 1,20 (bonus de 20 %)"),
      ],
      interpretation: [
        p("Le barème forfaitaire couvre l'essence, l'assurance, l'entretien et l'amortissement. Il est souvent plus avantageux que le suivi des frais réels pour les petits rouleurs."),
        hl("Justificatifs", "Tenez un journal de bord (dates, trajets, kilomètres) pour justifier vos déductions en cas de contrôle fiscal."),
      ],
      limitesCalcul: [
        "Barème simplifié 2024 — consultez le BOFiP pour le barème exact de l'année.",
        "Trajets domicile-travail exclus sauf cas particuliers (double résidence, etc.).",
        "Pas de comparaison automatique barème vs frais réels.",
      ],
      example: {
        title: "12 000 km professionnels avec un véhicule 5 CV thermique",
        donnees: [
          "Kilomètres annuels : 12 000 km",
          "Puissance fiscale : 5 CV",
          "Type : automobile thermique",
        ],
        calcul: [
          "Coefficient 5 CV = 0,543 €/km",
          "Frais annuels = 12 000 km × 0,543 €/km = 6 516 €",
          "Frais mensuels = 6 516 € / 12 = 543 €/mois",
        ],
        resultat: "Frais kilométriques annuels : 6 516 € (543 €/mois).",
        interpretation:
          "Ce montant est déductible de vos revenus professionnels (indépendant) ou remboursable par votre employeur (salarié). Comparez avec vos frais réels pour choisir l'option la plus avantageuse.",
      },
      maillage: [
        { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
        { slug: "loa-vs-credit-auto", label: "LOA vs crédit auto" },
        { slug: "mensualite-credit-consommation", label: "Mensualité crédit consommation" },
      ],
      conseils: [
        "Tenez un carnet de bord des trajets professionnels (date, lieu, km).",
        "Comparez barème kilométrique et frais réels — choisissez le plus avantageux.",
        "Vérifiez le barème chaque année (révision fiscale au BOFiP).",
        "Le bonus électrique (+20 %) rend le barème très intéressant pour les VE.",
      ],
      limites: [
        "Barème simplifié — le barème officiel comporte des tranches selon le km total.",
        "Trajets domicile-travail généralement exclus.",
        "Impossible de cumuler barème et frais réels sur le même véhicule.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le barème kilométrique ?",
        answer:
          "Un forfait en euros par kilomètre, fixé par l'administration fiscale, pour déduire les frais de déplacement professionnel avec un véhicule personnel.",
      },
      {
        question: "Comment sont calculés les frais ?",
        answer:
          "Kilomètres professionnels × coefficient selon la puissance fiscale. Bonus de 20 % pour les véhicules électriques.",
      },
      {
        question: "Barème ou frais réels : lequel choisir ?",
        answer:
          "Celui qui est le plus avantageux. Le barème est souvent plus simple et plus rentable pour les petits et moyens rouleurs.",
      },
      {
        question: "Les trajets domicile-travail sont-ils inclus ?",
        answer:
          "Non, sauf cas particuliers (changements fréquents de lieu de travail, double résidence, etc.). Seuls les déplacements professionnels hors domicile-travail comptent.",
      },
      {
        question: "Quel avantage pour un véhicule électrique ?",
        answer:
          "Bonus de 20 % sur le barème kilométrique, ce qui augmente significativement le montant déductible.",
      },
      {
        question: "Salarié ou indépendant : même barème ?",
        answer:
          "Oui, le barème s'applique dans les deux cas. Le salarié peut demander le remboursement à l'employeur ; l'indépendant le déduit de ses revenus.",
      },
      {
        question: "Peut-on cumuler barème et frais réels ?",
        answer:
          "Non, sur un même véhicule et une même année. Vous devez choisir l'une ou l'autre option.",
      },
      {
        question: "Quels justificatifs conserver ?",
        answer:
          "Un journal de bord (dates, lieux, kilomètres, motif professionnel) et éventuellement les factures si vous optez pour les frais réels.",
      },
      {
        question: "Quelles erreurs éviter ?",
        answer:
          "Inclure les trajets domicile-travail, ne pas tenir de journal de bord, ou utiliser un barème d'une année précédente.",
      },
      {
        question: "Quelles sont les limites du simulateur ?",
        answer:
          "Barème simplifié à coefficient fixe. Le barème officiel prévoit des tranches dégressives selon le kilométrage total annuel.",
      },
    ]),
  },
};
