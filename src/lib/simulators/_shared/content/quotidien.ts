import {
  buildRichContent,
  buildFaq,
  p,
  hl,
} from "../content-builder";
import type { ContentRegistry } from "./types";

export const quotidienContent: ContentRegistry = {
  "calculateur-tva": {
    content: buildRichContent({
      intro:
        "Calculez instantanément le montant HT, TTC ou la TVA selon le taux applicable — indispensable pour les achats, factures et devis.",
      definition:
        "La TVA (taxe sur la valeur ajoutée) est un impôt indirect sur la consommation, appliqué à la majorité des produits et services en France.",
      objectif:
        "Ce simulateur calcule le prix HT, le montant de TVA et le prix TTC selon le taux et le mode de saisie (HT ou TTC).",
      variables: [
        "Montant saisi en euros",
        "Taux de TVA : 20 %, 10 %, 5,5 % ou 2,1 %",
        "Mode : montant saisi en HT ou en TTC",
      ],
      formules: [
        p("Si montant HT : TVA = HT × Taux — TTC = HT + TVA."),
        p("Si montant TTC : HT = TTC ÷ (1 + Taux) — TVA = TTC − HT."),
        hl(
          "Taux France",
          "20 % normal, 10 % restauration/hébergement, 5,5 % alimentation/énergie, 2,1 % médicaments remboursables.",
        ),
      ],
      interpretation: [
        p("Vérifiez toujours le taux sur la facture — il varie selon le type de produit ou service."),
        p("En mode TTC, le simulateur extrait la TVA incluse dans le prix affiché."),
        hl(
          "Auto-entrepreneur",
          "Franchise en base de TVA si CA < 36 800 € (services) ou 91 900 € (vente) — pas de TVA facturée.",
        ),
      ],
      limitesCalcul: [
        "Taux France métropolitaine — DOM et cas intracommunautaires non couverts",
        "Auto-liquidation et exonérations spécifiques non modélisées",
        "Export hors UE : TVA non applicable (règles spécifiques)",
      ],
      example: {
        title: "Produit à 100 € HT, TVA 20 %",
        donnees: [
          "Montant : 100 €",
          "Taux TVA : 20 %",
          "Mode : prix HT",
        ],
        calcul: [
          "TVA = 100 × 0,20 = 20 €",
          "TTC = 100 + 20 = 120 €",
        ],
        resultat: "HT : 100 € — TVA : 20 € — TTC : 120 €.",
        interpretation:
          "Un produit facturé 100 € HT sera vendu 120 € TTC au client. La TVA collectée de 20 € est reversée à l'État par l'entreprise.",
      },
      maillage: [
        { slug: "calculateur-pourcentage", label: "Calculateur pourcentage" },
        { slug: "partage-facture", label: "Partage de facture" },
        { slug: "calculateur-pourboire", label: "Calculateur pourboire" },
      ],
      conseils: [
        "Vérifiez le taux TVA sur chaque ligne de facture",
        "Auto-entrepreneurs : vérifiez votre éligibilité à la franchise en base",
        "Export hors UE : TVA non applicable selon les règles",
        "Restauration : 10 % sur repas, 20 % sur alcool",
      ],
      limites: [
        "Taux France métropolitaine uniquement",
        "Cas particuliers (DOM, intracommunautaire) non couverts",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quel taux de TVA à 20 % ?",
        answer:
          "Taux normal pour la majorité des produits et services non alimentaires en France.",
      },
      {
        question: "TVA à 10 % : quels produits ?",
        answer:
          "Restauration, transport, hébergement, travaux de rénovation (sous conditions d'ancienneté du logement).",
      },
      {
        question: "TVA à 5,5 % : quels produits ?",
        answer:
          "Alimentation de base, livres, énergie, accessoires pour handicapés, certains travaux d'amélioration énergétique.",
      },
      {
        question: "Auto-entrepreneur et TVA ?",
        answer:
          "Franchise en base si CA < 36 800 € (services) ou 91 900 € (vente/activités mixtes). Au-delà, TVA obligatoire.",
      },
      {
        question: "Comment calculer le HT depuis le TTC ?",
        answer:
          "HT = TTC ÷ (1 + taux). Exemple : 120 € TTC à 20 % → HT = 120 ÷ 1,20 = 100 €.",
      },
      {
        question: "TVA sur les abonnements ?",
        answer:
          "Taux normal 20 % pour la plupart des services numériques et abonnements.",
      },
      {
        question: "TVA et export ?",
        answer:
          "Export hors UE : pas de TVA française. Intracommunautaire : autoliquidation selon règles spécifiques.",
      },
      {
        question: "TVA réduite sur travaux ?",
        answer:
          "5,5 % ou 10 % selon type de travaux et ancienneté du logement. Vérifiez les conditions d'éligibilité.",
      },
      {
        question: "TVA et remises ?",
        answer:
          "La TVA s'applique sur le montant après remise. Remise HT puis calcul TVA.",
      },
      {
        question: "Facture sans TVA : pourquoi ?",
        answer:
          "Franchise en base, export, ou activité exonérée (certaines professions médicales, associations).",
      },
    ]),
  },

  "calculateur-pourcentage": {
    content: buildRichContent({
      intro:
        "Calculez un pourcentage d'une valeur, une augmentation ou une réduction — l'outil universel pour remises, hausses et statistiques.",
      definition:
        "Un pourcentage exprime une proportion sur 100. Calculer X % d'une valeur revient à multiplier cette valeur par X et diviser par 100.",
      objectif:
        "Ce simulateur calcule X % d'une valeur, ou applique une augmentation (+X %) ou une réduction (−X %) à une valeur de base.",
      variables: [
        "Valeur de base",
        "Pourcentage (positif ou négatif)",
        "Opération : X % de la valeur, valeur + X % ou valeur − X %",
      ],
      formules: [
        p("X % de V = V × X ÷ 100."),
        p("V + X % = V × (1 + X ÷ 100)."),
        p("V − X % = V × (1 − X ÷ 100)."),
        hl(
          "Astuce rapide",
          "Pour 10 % : divisez par 10. Pour 50 % : divisez par 2. Pour 25 % : divisez par 4.",
        ),
      ],
      interpretation: [
        p("Pour une remise, utilisez « valeur − X % ». Le résultat est le prix final après réduction."),
        p("Pour une augmentation (salaire, prix), utilisez « valeur + X % »."),
        hl(
          "Remises cumulées",
          "Deux remises de 20 % puis 10 % = × 0,80 × 0,90 = 28 % de réduction totale, pas 30 %.",
        ),
      ],
      limitesCalcul: [
        "Calcul simple sur une seule opération",
        "Cumul de remises multiples non calculé automatiquement",
        "Pourcentage entre deux valeurs : utilisez évolution pourcentage",
      ],
      example: {
        title: "15 % de 200",
        donnees: [
          "Valeur de base : 200",
          "Pourcentage : 15 %",
          "Opération : X % de la valeur",
        ],
        calcul: [
          "Résultat = 200 × 15 ÷ 100 = 30",
        ],
        resultat: "15 % de 200 = 30.",
        interpretation:
          "15 % de 200 est 30. Si c'est une remise de 15 % sur 200 €, le prix final serait 170 € (opération « − 15 % »).",
      },
      maillage: [
        { slug: "evolution-pourcentage", label: "Évolution en pourcentage" },
        { slug: "regle-de-trois", label: "Règle de trois" },
        { slug: "calculateur-tva", label: "Calculateur TVA" },
      ],
      conseils: [
        "Vérifiez si le % s'applique sur HT ou TTC",
        "Remises cumulées : multipliez les coefficients, pas additionnez les %",
        "Pour une évolution entre deux valeurs, utilisez le simulateur évolution",
        "Arrondissez selon les usages (2 décimales pour les prix)",
      ],
      limites: [
        "Une seule opération par calcul",
        "Ne gère pas les pourcentages composés sur plusieurs périodes",
      ],
    }),
    faq: buildFaq([
      {
        question: "Comment calculer X % d'un nombre ?",
        answer:
          "Multipliez le nombre par X et divisez par 100. Exemple : 20 % de 150 = 150 × 0,20 = 30.",
      },
      {
        question: "Augmentation de 10 % : comment ?",
        answer:
          "Nouvelle valeur = Ancienne × 1,10. Ou ajoutez 10 % de l'ancienne valeur.",
      },
      {
        question: "Réduction 20 % puis 10 % : total ?",
        answer:
          "Prix final = Prix × 0,80 × 0,90 = × 0,72. Réduction totale de 28 %, pas 30 %.",
      },
      {
        question: "Pourcentage entre deux valeurs ?",
        answer:
          "Utilisez le simulateur évolution pourcentage : ((finale − initiale) ÷ initiale) × 100.",
      },
      {
        question: "Pourcentage et points de pourcentage ?",
        answer:
          "Taux 5 % → 7 % = +2 points de pourcentage, pas +40 % (qui serait 5 × 1,40 = 7 %).",
      },
      {
        question: "Réduction en magasin : HT ou TTC ?",
        answer:
          "Les remises s'appliquent généralement sur le prix affiché (TTC en France pour les particuliers).",
      },
      {
        question: "Calculer un pourcentage rapidement ?",
        answer:
          "10 % = ÷10. 5 % = la moitié de 10 %. 15 % = 10 % + 5 %. 20 % = ÷5.",
      },
      {
        question: "Pourcentage négatif ?",
        answer:
          "Une baisse de 20 % = coefficient 0,80. Une hausse de 20 % = coefficient 1,20.",
      },
      {
        question: "Pourcentage et proportion ?",
        answer:
          "25 % = 1/4. 33 % ≈ 1/3. 50 % = 1/2. Utile pour les calculs mentaux.",
      },
      {
        question: "Excel ou calculateur : quelle formule ?",
        answer:
          "Excel : =A1*0,15 pour 15 % de A1. Ou =A1*(1+0,10) pour +10 %.",
      },
    ]),
  },

  "regle-de-trois": {
    content: buildRichContent({
      intro:
        "Résolvez les problèmes de proportion en un clic : si A correspond à B, que vaut C ? Idéal pour prix, recettes et conversions.",
      definition:
        "La règle de trois (ou proportion) permet de trouver une valeur quatrième quand trois valeurs d'une relation proportionnelle sont connues.",
      objectif:
        "Ce simulateur applique la règle de trois directe : si A → B, alors C → X, avec X = (C × B) ÷ A.",
      variables: [
        "Valeur A (première grandeur)",
        "Valeur B (correspond à A)",
        "Valeur C (à convertir)",
      ],
      formules: [
        p("Si A correspond à B, alors C correspond à X."),
        p("X = (C × B) ÷ A."),
        hl(
          "Proportion directe",
          "Quand A augmente, B augmente proportionnellement (prix au kg, vitesse constante).",
        ),
      ],
      interpretation: [
        p("Le ratio B/A est le coefficient de proportionnalité — il s'applique à C pour obtenir X."),
        p("Vérifiez que la relation est bien proportionnelle avant d'appliquer la formule."),
        hl(
          "Unités",
          "Utilisez des unités homogènes : kg avec kg, € avec €, heures avec heures.",
        ),
      ],
      limitesCalcul: [
        "Proportion directe uniquement — pas la règle de trois inverse",
        "Relations non linéaires non couvertes (surface, volume)",
        "Grandeurs non proportionnelles : la formule ne s'applique pas",
      ],
      example: {
        title: "3 kg de pommes à 150 €, prix de 7 kg ?",
        donnees: [
          "A = 3 (kg)",
          "B = 150 (€)",
          "C = 7 (kg)",
        ],
        calcul: [
          "X = (7 × 150) ÷ 3 = 1 050 ÷ 3 = 350 €",
        ],
        resultat: "Si 3 → 150, alors 7 → 350.",
        interpretation:
          "7 kg de pommes au même prix unitaire coûtent 350 €. Le prix au kg est de 50 € (150 ÷ 3).",
      },
      maillage: [
        { slug: "calculateur-pourcentage", label: "Calculateur pourcentage" },
        { slug: "evolution-pourcentage", label: "Évolution en pourcentage" },
        { slug: "vitesse-distance-temps", label: "Vitesse distance temps" },
      ],
      conseils: [
        "Vérifiez que la relation est proportionnelle avant de calculer",
        "Unités homogènes obligatoires sur chaque paire de valeurs",
        "Pour des relations inverse (plus de travailleurs = moins de temps), utilisez la règle inverse",
        "Utile en cuisine, devis, conversions d'unités",
      ],
      limites: [
        "Proportion directe seulement",
        "Relations non linéaires (carré, cube) non couvertes",
      ],
    }),
    faq: buildFaq([
      {
        question: "Règle de trois directe : c'est quoi ?",
        answer:
          "Quand A augmente, B augmente proportionnellement. Exemple : plus de kg = plus cher au même prix unitaire.",
      },
      {
        question: "Règle de trois inverse ?",
        answer:
          "Quand A augmente, B diminue. Exemple : plus de travailleurs = moins de temps pour un travail fixe.",
      },
      {
        question: "Erreur fréquente en règle de trois ?",
        answer:
          "Mélanger les unités ou appliquer à des grandeurs non proportionnelles (prix vs surface).",
      },
      {
        question: "Usage quotidien de la règle de trois ?",
        answer:
          "Recettes de cuisine, devis au m², conversions d'unités, calculs de dosage.",
      },
      {
        question: "Comment vérifier la proportionnalité ?",
        answer:
          "B ÷ A doit donner le même ratio pour toutes les paires. Si B/A est constant, c'est proportionnel.",
      },
      {
        question: "Règle de trois et pourcentage ?",
        answer:
          "Calculer 15 % de 200 : A=100, B=15, C=200 → X=30. Ou utilisez le calculateur pourcentage.",
      },
      {
        question: "Trois valeurs connues, une inconnue ?",
        answer:
          "C'est exactement le cas de la règle de trois : trois valeurs connues, la quatrième est X.",
      },
      {
        question: "Règle de trois en cuisine ?",
        answer:
          "Recette pour 4 personnes, vous avez 6 : multipliez chaque ingrédient par 6/4 = 1,5.",
      },
      {
        question: "Proportion et échelle ?",
        answer:
          "Plan à l'échelle 1/100 : 5 cm sur le plan = 500 cm réels (5 × 100).",
      },
      {
        question: "Excel : formule règle de trois ?",
        answer:
          "=C2*B2/A2 où A2, B2, C2 sont les trois valeurs connues et le résultat est X.",
      },
    ]),
  },

  "calculateur-age": {
    content: buildRichContent({
      intro:
        "Calculez votre âge exact en années, mois et jours — utile pour les démarches administratives, échéances légales et anniversaires.",
      definition:
        "L'âge exact est la durée écoulée entre la date de naissance et une date cible (aujourd'hui ou une date spécifiée), exprimée en années, mois et jours.",
      objectif:
        "Ce simulateur calcule l'âge précis et le nombre total de jours entre deux dates, en tenant compte des années bissextiles.",
      variables: [
        "Date de naissance (jour, mois, année)",
        "Date cible optionnelle (par défaut : date du calcul)",
      ],
      formules: [
        p("Âge = différence entre date de naissance et date cible."),
        p("Calcul en années, mois et jours avec correction des mois incomplets."),
        p("Total jours = différence en millisecondes convertie en jours."),
        hl(
          "Années bissextiles",
          "Le 29 février est pris en compte automatiquement dans le calcul des jours.",
        ),
      ],
      interpretation: [
        p("Les années complètes sont le nombre d'anniversaires passés — utile pour la majorité, permis, retraite."),
        p("Le total de jours est utile pour les calculs scientifiques ou les records de longévité."),
        hl(
          "Majorité",
          "18 ans en France. Permis B : 18 ans (17 ans en conduite accompagnée).",
        ),
      ],
      limitesCalcul: [
        "Dates valides uniquement (pas de 31 février)",
        "Pas de fuseau horaire — calcul en date locale",
        "Âge légal retraite : consultez l'Assurance retraite pour les règles actuelles",
      ],
      example: {
        title: "Né le 15/06/1990, âge au 24/06/2025",
        donnees: [
          "Naissance : 15 juin 1990",
          "Date cible : 24 juin 2025",
        ],
        calcul: [
          "Années : 2025 − 1990 = 35 (anniversaire passé le 15 juin)",
          "Mois : 0 (de juin à juin)",
          "Jours : 24 − 15 = 9 jours",
        ],
        resultat: "35 ans, 0 mois et 9 jours.",
        interpretation:
          "La personne a 35 ans révolus plus 9 jours. Pour les démarches officielles, l'âge en années complètes est 35 ans.",
      },
      maillage: [
        { slug: "evolution-pourcentage", label: "Évolution en pourcentage" },
        { slug: "convertisseur-heures-minutes", label: "Convertisseur heures minutes" },
        { slug: "regle-de-trois", label: "Règle de trois" },
      ],
      conseils: [
        "Vérifiez les dates pour les démarches officielles (carte d'identité, passeport)",
        "Âge retraite : variable selon année de naissance — Assurance retraite",
        "Né le 29 février : anniversaire le 28 février ou 1er mars selon les années",
        "Total jours utile pour calculs d'intérêts ou durées contractuelles",
      ],
      limites: [
        "Dates valides uniquement",
        "Pas de fuseau horaire",
      ],
    }),
    faq: buildFaq([
      {
        question: "Âge légal de la retraite en France ?",
        answer:
          "Variable selon année de naissance — consultez l'Assurance retraite pour votre date précise.",
      },
      {
        question: "Majorité en France ?",
        answer:
          "18 ans. Certains droits (vote, contrats) à 18 ans révolus.",
      },
      {
        question: "Âge pour le permis de conduire ?",
        answer:
          "Permis B : 18 ans. Conduite accompagnée dès 15 ans (AAC) ou 17 ans (CS).",
      },
      {
        question: "Né le 29 février : quel anniversaire ?",
        answer:
          "28 février ou 1er mars selon les années et les usages. Légalement, certains textes précisent le 28 février.",
      },
      {
        question: "Âge exact vs âge civil ?",
        answer:
          "Âge civil = années complètes (35 ans). Âge exact inclut mois et jours (35 ans, 3 mois, 12 jours).",
      },
      {
        question: "Calculer l'âge pour un contrat ?",
        answer:
          "Utilisez la date de signature ou la date d'effet du contrat comme date cible.",
      },
      {
        question: "Enfant : quel âge pour la crèche ?",
        answer:
          "Variable selon communes. Souvent dès 2-3 mois. École maternelle à 3 ans.",
      },
      {
        question: "Âge et assurance ?",
        answer:
          "Tarifs auto et santé varient selon l'âge. Vérifiez les tranches de votre assureur.",
      },
      {
        question: "Différence entre deux dates sans âge ?",
        answer:
          "Ce simulateur donne l'âge depuis une naissance. Pour une durée entre deux dates quelconques, calculez deux âges ou utilisez un outil de différence de dates.",
      },
      {
        question: "Années bissextiles : impact ?",
        answer:
          "Le 29 février ajoute un jour tous les 4 ans. Le calcul des jours totaux en tient compte.",
      },
    ]),
  },

  "calculateur-pourboire": {
    content: buildRichContent({
      intro:
        "Calculez le pourboire et le total à payer au restaurant, avec partage par personne — pratique après un repas entre amis.",
      definition:
        "Le pourboire est une gratification volontaire donnée en plus de l'addition pour remercier le service, courante dans la restauration.",
      objectif:
        "Ce simulateur calcule le montant du pourboire, le total à payer et la part par personne selon l'addition et le taux choisi.",
      variables: [
        "Montant de l'addition en euros",
        "Pourboire en pourcentage (0 à 50 %)",
        "Nombre de personnes pour le partage",
      ],
      formules: [
        p("Pourboire = Addition × Taux pourboire."),
        p("Total = Addition + Pourboire."),
        p("Par personne = Total ÷ Nombre de personnes."),
        hl(
          "France",
          "Le service est inclus par la loi (obligatoire) — le pourboire est un bonus volontaire, pas une obligation.",
        ),
      ],
      interpretation: [
        p("En France, « service compris » sur l'addition — le pourboire est facultatif et exprime une satisfaction supplémentaire."),
        p("10 à 15 % est courant pour un bon service. Certains arrondissent simplement l'addition."),
        hl(
          "Espèces",
          "Le pourboire en espèces directement au serveur est souvent préféré par le personnel.",
        ),
      ],
      limitesCalcul: [
        "Usages variables selon les pays (USA : 15-20 % attendu)",
        "Service inclus en France — le pourboire s'ajoute au TTC",
        "Pourboire sur HT ou TTC : ici sur le montant saisi (généralement TTC)",
      ],
      example: {
        title: "Addition 85 €, pourboire 10 %, 2 personnes",
        donnees: [
          "Addition : 85 €",
          "Pourboire : 10 %",
          "Personnes : 2",
        ],
        calcul: [
          "Pourboire = 85 × 0,10 = 8,50 €",
          "Total = 85 + 8,50 = 93,50 €",
          "Par personne = 93,50 ÷ 2 = 46,75 €",
        ],
        resultat: "Total : 93,50 € (pourboire 8,50 €) — 46,75 €/pers.",
        interpretation:
          "Chaque personne paie 46,75 € si le pourboire est partagé équitablement. Le serveur reçoit 8,50 € de gratification en plus du service inclus.",
      },
      maillage: [
        { slug: "partage-facture", label: "Partage de facture" },
        { slug: "calculateur-pourcentage", label: "Calculateur pourcentage" },
        { slug: "calculateur-tva", label: "Calculateur TVA" },
      ],
      conseils: [
        "10-15 % courant pour un bon service en France (en plus du service inclus)",
        "Vérifiez si le service est déjà inclus sur l'addition",
        "Pourboire en espèces directement au serveur si possible",
        "Arrondir l'addition (85 → 90 €) est une forme simple de pourboire",
      ],
      limites: [
        "Usages variables selon les pays",
        "Service inclus obligatoire en France",
      ],
    }),
    faq: buildFaq([
      {
        question: "Pourboire obligatoire en France ?",
        answer:
          "Non — le service est inclus par la loi. Le pourboire est facultatif et volontaire.",
      },
      {
        question: "Pourboire standard en France ?",
        answer:
          "5 à 15 % selon satisfaction, ou arrondir l'addition. Pas d'obligation comme aux USA.",
      },
      {
        question: "Pourboire sur HT ou TTC ?",
        answer:
          "Généralement sur le montant TTC affiché sur l'addition.",
      },
      {
        question: "Pourboire par carte ou espèces ?",
        answer:
          "Espèces souvent préférées par le personnel. Carte : vérifiez si le pourboire va au serveur.",
      },
      {
        question: "Service compris : c'est quoi ?",
        answer:
          "12 à 15 % du HT ajouté obligatoirement en restauration en France. Distribué au personnel.",
      },
      {
        question: "Pourboire aux USA ?",
        answer:
          "15-20 % attendu car pas de service inclus. Calculer sur l'addition avant pourboire.",
      },
      {
        question: "Pas de pourboire si service médiocre ?",
        answer:
          "En France, le service est déjà payé. Le pourboire est un bonus — pas obligatoire même si service moyen.",
      },
      {
        question: "Pourboire et TVA ?",
        answer:
          "Le pourboire n'est pas soumis à TVA s'il est volontaire et non facturé.",
      },
      {
        question: "Pourboire au bar ?",
        answer:
          "Moins courant qu'au restaurant. Arrondir ou 1-2 € pour un bon service.",
      },
      {
        question: "Pourboire et livraison ?",
        answer:
          "Optionnel. 1-2 € ou 5-10 % si service exceptionnel. Vérifiez si la plateforme prend une part.",
      },
    ]),
  },

  "partage-facture": {
    content: buildRichContent({
      intro:
        "Divisez l'addition entre plusieurs personnes, avec pourboire inclus et option pour ceux qui paient plus (alcool, plat premium).",
      definition:
        "Le partage de facture répartit le montant total d'une addition (avec pourboire) entre les participants selon des parts égales ou différenciées.",
      objectif:
        "Ce simulateur calcule la part par personne, avec option pour des payeurs à 1,5× (alcool ou plat plus cher).",
      variables: [
        "Montant total de l'addition en euros",
        "Nombre de personnes",
        "Pourboire en pourcentage",
        "Nombre de personnes payant 1,5× la part standard",
      ],
      formules: [
        p("Total avec pourboire = Addition + (Addition × Pourboire %)."),
        p("Parts totales = (Personnes − Payeurs ×1,5) + (Payeurs ×1,5)."),
        p("Part standard = Total avec pourboire ÷ Parts totales."),
        p("Part payeur ×1,5 = Part standard × 1,5."),
        hl(
          "Équité",
          "La division ×1,5 permet à ceux qui ont pris plus (alcool, entrée premium) de payer proportionnellement plus.",
        ),
      ],
      interpretation: [
        p("Sans payeurs ×1,5, chaque personne paie la même part du total avec pourboire."),
        p("Avec payeurs ×1,5, le total est divisé en parts virtuelles — certains paient 50 % plus."),
        hl(
          "Apps",
          "Paylib, Lydia, Splitwise facilitent le virement instantané après le partage.",
        ),
      ],
      limitesCalcul: [
        "Division simplifiée — montants individuels par plat non détaillés",
        "Ne gère pas des montants personnalisés par personne",
        "Pourboire appliqué uniformément sur le total",
      ],
      example: {
        title: "Addition 120 €, 4 personnes, pourboire 10 %",
        donnees: [
          "Total addition : 120 €",
          "Personnes : 4",
          "Pourboire : 10 %",
          "Payeurs ×1,5 : 0",
        ],
        calcul: [
          "Pourboire = 120 × 0,10 = 12 €",
          "Total avec pourboire = 132 €",
          "Part par personne = 132 ÷ 4 = 33 €",
        ],
        resultat: "33 €/personne (×1,5 : 33 €).",
        interpretation:
          "Chaque personne paie 33 €, incluant le pourboire. Un virement Lydia ou Paylib de 33 € à la personne qui a payé l'addition simplifie le remboursement.",
      },
      maillage: [
        { slug: "calculateur-pourboire", label: "Calculateur pourboire" },
        { slug: "calculateur-tva", label: "Calculateur TVA" },
        { slug: "calculateur-pourcentage", label: "Calculateur pourcentage" },
      ],
      conseils: [
        "Décidez du mode de partage avant la fin du repas",
        "Apps de paiement pour virement instantané (Lydia, Paylib)",
        "Division personnalisée si écarts importants entre les plats",
        "Un personne paie tout : les autres remboursent par virement",
      ],
      limites: [
        "Division simplifiée",
        "Montants individuels non détaillés par plat",
      ],
    }),
    faq: buildFaq([
      {
        question: "Division égale ou personnalisée ?",
        answer:
          "Égale si repas similaire. Personnalisée si écarts importants (alcool, plats premium).",
      },
      {
        question: "Inclure le pourboire avant division ?",
        answer:
          "Oui — ajoutez le pourboire au total avant de diviser pour que chacun contribue au pourboire.",
      },
      {
        question: "Apps recommandées pour partager ?",
        answer:
          "Paylib, Lydia pour virement instantané. Splitwise pour suivre les dettes entre amis.",
      },
      {
        question: "Une personne paie tout : comment rembourser ?",
        answer:
          "Virement instantané Lydia/Paylib — plus simple que les espèces.",
      },
      {
        question: "Partage avec alcool : comment ?",
        answer:
          "Utilisez l'option payeurs ×1,5 pour ceux qui ont pris des boissons alcoolisées.",
      },
      {
        question: "Partage en couple ?",
        answer:
          "Division par 2 du total avec pourboire. Ou chacun paie ses plats si écarts importants.",
      },
      {
        question: "Pourboire non inclus : problème ?",
        answer:
          "Si le pourboire n'est pas inclus dans le partage, la personne qui a payé l'addition assume seule le pourboire.",
      },
      {
        question: "Groupe de 10+ personnes ?",
        answer:
          "Division égale simple. Pour grands groupes, une personne collecte et les autres virent.",
      },
      {
        question: "Partage et TVA ?",
        answer:
          "L'addition est en TTC. Le partage se fait sur le montant total payé.",
      },
      {
        question: "Splitwise : comment ça marche ?",
        answer:
          "Enregistrez qui a payé quoi. L'app calcule qui doit à qui et minimise les virements.",
      },
    ]),
  },

  "convertisseur-devises": {
    content: buildRichContent({
      intro:
        "Convertissez des montants entre euros, dollars, livres et francs suisses au taux de change que vous saisissez — idéal avant un voyage.",
      definition:
        "La conversion de devises transforme un montant d'une monnaie à une autre selon le taux de change du marché ou le taux appliqué par votre banque.",
      objectif:
        "Ce simulateur convertit un montant entre EUR, USD, GBP et CHF selon le taux saisi (1 EUR = X devise cible).",
      variables: [
        "Montant à convertir",
        "Devise source (EUR, USD, GBP, CHF)",
        "Devise cible",
        "Taux de change (1 EUR = X devise cible)",
      ],
      formules: [
        p("Si source EUR et cible ≠ EUR : Résultat = Montant × Taux."),
        p("Si cible EUR et source ≠ EUR : Résultat = Montant ÷ Taux."),
        hl(
          "Taux",
          "Consultez votre banque, xe.com ou Google Finance pour le taux du jour. Les banques appliquent une marge.",
        ),
      ],
      interpretation: [
        p("Le taux saisi est celui que vous obtenez — taux interbancaire ou taux banque avec marge."),
        p("Comparez les frais : carte bancaire internationale souvent meilleur que bureau de change aéroport."),
        hl(
          "Euro zone",
          "19 pays utilisent l'euro — pas de conversion nécessaire dans la zone euro.",
        ),
      ],
      limitesCalcul: [
        "Taux saisi manuellement — pas de taux en temps réel",
        "Frais bancaires et commissions non inclus",
        "Conversion EUR↔non-EUR simplifiée — croisements USD/GBP approximatifs",
      ],
      example: {
        title: "100 EUR convertis en USD à 1,08",
        donnees: [
          "Montant : 100 EUR",
          "Devise source : EUR",
          "Devise cible : USD",
          "Taux : 1 EUR = 1,08 USD",
        ],
        calcul: [
          "Résultat = 100 × 1,08 = 108 USD",
        ],
        resultat: "100 EUR = 108 USD.",
        interpretation:
          "À ce taux, 100 euros vous donnent 108 dollars. Votre banque appliquera peut-être un taux légèrement inférieur (marge de 1-3 %).",
      },
      maillage: [
        { slug: "calculateur-tva", label: "Calculateur TVA" },
        { slug: "convertisseur-heures-minutes", label: "Convertisseur heures minutes" },
        { slug: "regle-de-trois", label: "Règle de trois" },
      ],
      conseils: [
        "Les banques appliquent une marge sur le taux interbancaire",
        "Carte bancaire internationale souvent meilleur que bureau de change",
        "Wise, Revolut : taux compétitifs pour les transferts",
        "Évitez les bureaux de change des aéroports (marges élevées)",
      ],
      limites: [
        "Taux manuel — pas de mise à jour automatique",
        "Frais bancaires non inclus",
      ],
    }),
    faq: buildFaq([
      {
        question: "Meilleur taux de change pour voyager ?",
        answer:
          "Carte bancaire internationale ou Wise/Revolut. Évitez les aéroports et changeurs avec marge élevée.",
      },
      {
        question: "Taux interbancaire : c'est quoi ?",
        answer:
          "Taux entre banques sur le marché des changes. Les particuliers paient une marge (1-3 %).",
      },
      {
        question: "Change espèces ou carte ?",
        answer:
          "Carte souvent meilleur taux. Espèces utiles pour petits commerces sans CB. Retrait ATM local possible.",
      },
      {
        question: "Zone euro : quels pays ?",
        answer:
          "19 pays : France, Allemagne, Italie, Espagne, etc. Pas de conversion entre eux.",
      },
      {
        question: "Frais de change carte bancaire ?",
        answer:
          "Variable : 0 % (certaines cartes premium) à 3 %. Vérifiez les conditions de votre carte.",
      },
      {
        question: "Wise vs banque traditionnelle ?",
        answer:
          "Wise/Revolut : taux proche interbancaire, frais transparents. Banques : marge souvent plus élevée.",
      },
      {
        question: "Convertir de grosses sommes ?",
        answer:
          "Comparez plusieurs options. Virement Wise pour gros montants. Négociez avec votre banque.",
      },
      {
        question: "Taux fixe ou variable ?",
        answer:
          "Les taux flottent en continu. Le taux du moment s'applique au moment de la transaction.",
      },
      {
        question: "Dollar canadien ou australien ?",
        answer:
          "Ce simulateur couvre EUR, USD, GBP, CHF. Pour CAD/AUD, utilisez un taux EUR/CAD saisi manuellement.",
      },
      {
        question: "Change au retour de voyage ?",
        answer:
          "Reconvertir les devises restantes — souvent avec marge. Dépensez ou gardez pour prochain voyage.",
      },
    ]),
  },

  "convertisseur-heures-minutes": {
    content: buildRichContent({
      intro:
        "Convertissez heures en minutes, minutes en heures décimales ou secondes — utile pour le travail, les trajets et la facturation.",
      definition:
        "La conversion heures-minutes transforme une durée exprimée en heures et minutes vers d'autres formats (minutes totales, heures décimales, secondes).",
      objectif:
        "Ce simulateur convertit une durée saisie (heures + minutes) en total minutes, heures décimales ou secondes.",
      variables: [
        "Heures (0 à 999)",
        "Minutes (0 à 59)",
        "Format de conversion souhaité",
      ],
      formules: [
        p("Total minutes = Heures × 60 + Minutes."),
        p("Heures décimales = Heures + Minutes ÷ 60."),
        p("Secondes = Total minutes × 60."),
        hl(
          "Facturation",
          "Les heures décimales simplifient la multiplication par un taux horaire (2h30 = 2,5 h).",
        ),
      ],
      interpretation: [
        p("2 h 30 = 2,5 h décimales — utile pour calculer un salaire ou une facture."),
        p("2 h 45 = 2,75 h — 45 min = 0,75 h (45 ÷ 60)."),
        hl(
          "Paie",
          "Certaines entreprises utilisent les centièmes : 2h30 = 2,50 h (format décimal standard).",
        ),
      ],
      limitesCalcul: [
        "Pas de calcul entre deux horaires (début/fin) — saisissez la durée directement",
        "Pas de gestion des fuseaux horaires",
        "Arrondi selon les règles de l'employeur pour la paie",
      ],
      example: {
        title: "2 heures 45 minutes",
        donnees: [
          "Heures : 2",
          "Minutes : 45",
          "Conversion : total minutes",
        ],
        calcul: [
          "Total minutes = 2 × 60 + 45 = 165 min",
          "Heures décimales = 2 + 45/60 = 2,75 h",
          "Secondes = 165 × 60 = 9 900 s",
        ],
        resultat: "2 h 45 min = 165 min.",
        interpretation:
          "Pour facturer 2h45 à 50 €/h : 2,75 × 50 = 137,50 €. Format 02:45 pour les feuilles de temps.",
      },
      maillage: [
        { slug: "vitesse-distance-temps", label: "Vitesse distance temps" },
        { slug: "calculateur-age", label: "Calculateur d'âge" },
        { slug: "convertisseur-devises", label: "Convertisseur devises" },
      ],
      conseils: [
        "Heures décimales pour la paie et la facturation",
        "Arrondissez selon les règles de votre employeur",
        "Combinez avec vitesse-distance-temps pour les trajets",
        "Format HH:MM pour affichage, décimal pour calculs",
      ],
      limites: [
        "Durée saisie directement — pas calcul entre deux horaires",
      ],
    }),
    faq: buildFaq([
      {
        question: "Heures décimales : comment convertir ?",
        answer:
          "2h30 = 2,5 h. 2h45 = 2,75 h. Minutes ÷ 60 + heures.",
      },
      {
        question: "Conversion pour la paie ?",
        answer:
          "Salaire = Heures décimales × Taux horaire. Exemple : 7,5 h × 15 € = 112,50 €.",
      },
      {
        question: "Minutes en centièmes d'heure ?",
        answer:
          "Certaines entreprises : 2h30 = 2,50 h (centièmes). Même résultat que décimal standard.",
      },
      {
        question: "Durée d'un trajet ?",
        answer:
          "Combinez avec le simulateur vitesse-distance-temps pour calculer la durée d'un trajet.",
      },
      {
        question: "7h30 en minutes ?",
        answer:
          "7 × 60 + 30 = 450 minutes.",
      },
      {
        question: "150 minutes en heures ?",
        answer:
          "150 ÷ 60 = 2,5 h = 2 h 30 min.",
      },
      {
        question: "Arrondi des heures de travail ?",
        answer:
          "Variable selon employeur : quart d'heure, demi-heure ou minute exacte.",
      },
      {
        question: "Excel : convertir heures en décimal ?",
        answer:
          "=A1+B1/60 où A1=heures et B1=minutes. Ou =TEMPS(heures;minutes;0) pour format temps.",
      },
      {
        question: "Secondes : quand utile ?",
        answer:
          "Sport, chronométrage, calculs scientifiques, certaines applications de suivi du temps.",
      },
      {
        question: "Heures et fuseaux horaires ?",
        answer:
          "Ce convertisseur gère des durées, pas des horaires avec fuseaux. Pour fuseaux, outils spécifiques.",
      },
    ]),
  },

  "vitesse-distance-temps": {
    content: buildRichContent({
      intro:
        "Calculez la vitesse, la distance ou la durée d'un trajet avec la formule V = D / T — planifiez vos départs et arrivées.",
      definition:
        "La relation vitesse-distance-temps lie trois grandeurs : Vitesse = Distance ÷ Temps, avec des unités cohérentes (km, km/h, heures).",
      objectif:
        "Ce simulateur calcule la grandeur manquante selon le mode choisi : temps, distance ou vitesse.",
      variables: [
        "Mode de calcul : temps, distance ou vitesse",
        "Distance en km",
        "Vitesse en km/h",
        "Temps en heures (décimal)",
      ],
      formules: [
        p("Vitesse = Distance ÷ Temps."),
        p("Distance = Vitesse × Temps."),
        p("Temps = Distance ÷ Vitesse."),
        hl(
          "Route réelle",
          "Vitesse moyenne réelle inférieure à la vitesse max — pauses, villes, trafic.",
        ),
      ],
      interpretation: [
        p("Le temps affiché suppose une vitesse constante — ajoutez 15-20 % pour pauses et ralentissements."),
        p("Sur autoroute à 130 km/h max, la moyenne réelle est souvent 100-110 km/h avec le trafic."),
        hl(
          "Pauses",
          "Ajoutez 15 min toutes les 2 h pour une pause recommandée sur long trajet.",
        ),
      ],
      limitesCalcul: [
        "Vitesse constante supposée — pas de variations de trafic",
        "Péages et carburant non calculés",
        "km/h en m/s : divisez par 3,6",
      ],
      example: {
        title: "450 km à 130 km/h — quelle durée ?",
        donnees: [
          "Mode : calculer le temps",
          "Distance : 450 km",
          "Vitesse : 130 km/h",
        ],
        calcul: [
          "Temps = 450 ÷ 130 = 3,46 h",
          "3 h + 0,46 × 60 min ≈ 3 h 28 min",
        ],
        resultat: "Temps : 3 h 28 min.",
        interpretation:
          "Sans pauses, 450 km à 130 km/h constant prennent ~3h28. En pratique, comptez 5 à 6 h avec trafic, pauses et sections à vitesse réduite.",
      },
      maillage: [
        { slug: "convertisseur-heures-minutes", label: "Convertisseur heures minutes" },
        { slug: "regle-de-trois", label: "Règle de trois" },
        { slug: "frais-kilometriques", label: "Frais kilométriques" },
      ],
      conseils: [
        "Ajoutez 15-20 % pour pauses et ralentissements",
        "Vérifiez péages et restrictions sur votre itinéraire",
        "Vitesse moyenne autoroute ~100 km/h avec trafic",
        "Pause recommandée toutes les 2 h sur long trajet",
      ],
      limites: [
        "Vitesse constante supposée",
        "Péages et carburant non inclus",
      ],
    }),
    faq: buildFaq([
      {
        question: "Vitesse moyenne sur autoroute ?",
        answer:
          "130 km/h max — moyenne réelle ~100-110 km/h avec trafic et ralentissements.",
      },
      {
        question: "Temps avec pauses : comment estimer ?",
        answer:
          "Ajoutez 15 min toutes les 2 h pour une pause recommandée. +20 % pour villes et trafic.",
      },
      {
        question: "Distance Paris-Marseille ?",
        answer:
          "~775 km — ~7 h sans pause à vitesse moyenne autoroute.",
      },
      {
        question: "km/h en m/s ?",
        answer:
          "Divisez par 3,6. 130 km/h = 36,1 m/s.",
      },
      {
        question: "Formule inversée : distance ?",
        answer:
          "Distance = Vitesse × Temps. 100 km/h × 2 h = 200 km.",
      },
      {
        question: "Vitesse en ville vs autoroute ?",
        answer:
          "Ville : 30-50 km/h moyenne. Autoroute : 100-110 km/h moyenne. Mixte : recalculer par segment.",
      },
      {
        question: "Temps et carburant ?",
        answer:
          "Ce simulateur ne calcule pas le carburant. Distance × consommation L/100 km pour estimer.",
      },
      {
        question: "GPS vs calcul théorique ?",
        answer:
          "Le GPS intègre trafic et itinéraire réel — plus précis que vitesse constante.",
      },
      {
        question: "Vitesse et limitation ?",
        answer:
          "Respectez les limitations. Le calcul théorique utilise la vitesse saisie, pas la limite légale.",
      },
      {
        question: "Temps de trajet en train ?",
        answer:
          "Vitesses moyennes différentes (TGV ~250 km/h). Utilisez la vitesse moyenne du train.",
      },
    ]),
  },

  "evolution-pourcentage": {
    content: buildRichContent({
      intro:
        "Mesurez la variation en pourcentage entre une valeur initiale et une valeur finale — hausse, baisse et coefficient multiplicateur.",
      definition:
        "L'évolution en pourcentage exprime la variation relative entre deux valeurs, en prenant la valeur initiale comme référence (100 %).",
      objectif:
        "Ce simulateur calcule l'évolution en %, le type (hausse/baisse), la variation absolue et le coefficient multiplicateur.",
      variables: [
        "Valeur initiale (référence)",
        "Valeur finale",
      ],
      formules: [
        p("Évolution % = ((Valeur finale − Valeur initiale) ÷ Valeur initiale) × 100."),
        p("Variation absolue = Valeur finale − Valeur initiale."),
        p("Coefficient = Valeur finale ÷ Valeur initiale."),
        hl(
          "Référence",
          "Toujours la valeur initiale comme base — une hausse de 50 % puis baisse de 50 % ne revient pas à 0 %.",
        ),
      ],
      interpretation: [
        p("Évolution positive = hausse. Négative = baisse. Zéro = stabilité."),
        p("Coefficient ×1,25 = hausse de 25 %. ×0,80 = baisse de 20 %."),
        hl(
          "Points vs pourcentage",
          "Taux 5 % → 7 % = +2 points de pourcentage, pas +40 %.",
        ),
      ],
      limitesCalcul: [
        "Une seule période — pas d'évolution sur plusieurs années (CAGR)",
        "Valeur initiale = 0 : évolution non définie (division par zéro)",
        "Ne cumule pas les évolutions sur plusieurs périodes",
      ],
      example: {
        title: "De 80 à 100",
        donnees: [
          "Valeur initiale : 80",
          "Valeur finale : 100",
        ],
        calcul: [
          "Variation = 100 − 80 = 20",
          "Évolution = (20 ÷ 80) × 100 = 25 %",
          "Coefficient = 100 ÷ 80 = 1,25",
        ],
        resultat: "Hausse de 25 % (80 → 100).",
        interpretation:
          "La valeur a augmenté de 25 % par rapport à la base de 80. Pour retrouver 80 depuis 100, il faudrait une baisse de 20 % (pas 25 %).",
      },
      maillage: [
        { slug: "calculateur-pourcentage", label: "Calculateur pourcentage" },
        { slug: "regle-de-trois", label: "Règle de trois" },
        { slug: "simulateur-inflation", label: "Simulateur inflation" },
      ],
      conseils: [
        "Toujours utiliser la valeur initiale comme référence",
        "Ne cumulez pas les % additivement sur plusieurs périodes",
        "Points de pourcentage ≠ pourcentage d'évolution",
        "Pour plusieurs années : taux de croissance annualisé (CAGR)",
      ],
      limites: [
        "Une seule période",
        "Valeur initiale nulle : non calculable",
      ],
    }),
    faq: buildFaq([
      {
        question: "Hausse 50 % puis baisse 50 % : résultat ?",
        answer:
          "Vous n'êtes pas à 0 % — vous êtes à −25 % du point de départ. 100 → 150 → 75.",
      },
      {
        question: "Points de pourcentage vs % ?",
        answer:
          "Taux 5 % → 7 % = +2 points. +40 % serait 5 × 1,40 = 7 % seulement si on part de 5.",
      },
      {
        question: "Évolution négative : calcul ?",
        answer:
          "Baisse de 20 % : valeur finale = initiale × 0,80. Exemple : 100 → 80.",
      },
      {
        question: "CAGR : c'est quoi ?",
        answer:
          "Taux de croissance annualisé — pour mesurer l'évolution sur plusieurs années avec effet composé.",
      },
      {
        question: "Évolution et inflation ?",
        answer:
          "Comparez l'évolution nominale à l'inflation pour l'évolution réelle (pouvoir d'achat).",
      },
      {
        question: "Valeur initiale nulle ?",
        answer:
          "Évolution non définie (division par zéro). De 0 à X : croissance infinie en %.",
      },
      {
        question: "Évolution prix et remise ?",
        answer:
          "Prix 100 → 80 : baisse de 20 %. Pour retrouver 100 : hausse de 25 % (20/80).",
      },
      {
        question: "Évolution salaire ?",
        answer:
          "((Nouveau − Ancien) ÷ Ancien) × 100. Négociation : +3 % sur 2 000 € = +60 €.",
      },
      {
        question: "Évolution boursière ?",
        answer:
          "Même formule. Action 50 € → 65 € = +30 %. Performance relative au marché.",
      },
      {
        question: "Excel : formule évolution ?",
        answer:
          "=(B1-A1)/A1*100 ou =(B1/A1-1)*100 pour le pourcentage d'évolution.",
      },
    ]),
  },
};
