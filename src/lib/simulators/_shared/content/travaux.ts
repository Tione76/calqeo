import {
  buildRichContent,
  buildFaq,
  p,
  hl,
} from "../content-builder";
import type { ContentRegistry } from "./types";

export const travauxContent: ContentRegistry = {
  "quantite-peinture": {
    content: buildRichContent({
      intro:
        "Avant d'acheter vos pots de peinture, estimez précisément la quantité nécessaire pour couvrir murs et plafonds sans gaspillage ni rupture de stock.",
      definition:
        "La quantité de peinture correspond au volume de produit (en litres) requis pour recouvrir une surface donnée, en tenant compte du nombre de couches et du rendement du produit choisi.",
      objectif:
        "Ce simulateur calcule les litres de peinture à commander pour votre projet, avec une marge de sécurité intégrée pour les pertes et retouches.",
      variables: [
        "Surface à peindre en m² (murs et plafonds)",
        "Nombre de couches (généralement 2 pour une finition uniforme)",
        "Rendement du produit en m²/L (indiqué sur l'emballage, souvent 8 à 12)",
      ],
      formules: [
        p("Litres bruts = (Surface × Nombre de couches) ÷ Rendement (m²/L)."),
        p("Litres avec marge = Litres bruts × 1,10 (10 % de sécurité pour pertes, rouleau et retouches)."),
        hl(
          "Rendement",
          "Le rendement varie selon l'absorption du support : plâtre brut absorbe plus qu'un mur déjà peint. Consultez toujours la fiche technique du produit."
        ),
      ],
      interpretation: [
        p("Le résultat principal inclut 10 % de marge : c'est la quantité recommandée à l'achat."),
        p("La quantité brute correspond au strict calcul théorique, sans marge — utile pour comparer plusieurs produits."),
        hl(
          "Bon repère",
          "Pour une pièce standard, comptez 2 couches sur murs et plafond. Sur un support foncé ou poreux, prévoyez une sous-couche et une troisième couche de finition."
        ),
      ],
      limitesCalcul: [
        "Les portes, fenêtres et ouvertures ne sont pas déduites automatiquement",
        "Le rendement réel dépend du support, de la couleur et de l'application (rouleau vs pistolet)",
        "Les peintures spéciales (anti-humidité, magnétique) ont des rendements différents",
      ],
      example: {
        title: "Rénovation d'un salon de 45 m²",
        donnees: [
          "Surface à peindre : 45 m²",
          "Nombre de couches : 2",
          "Rendement peinture : 10 m²/L",
        ],
        calcul: [
          "Litres bruts = (45 × 2) ÷ 10 = 9 L",
          "Avec marge 10 % : 9 × 1,10 = 9,9 L",
        ],
        resultat: "Quantité estimée : 9,9 L (avec 10 % de marge).",
        interpretation:
          "Pour ce salon, commandez 10 L de peinture (ou deux pots de 5 L). Si vous peignez aussi les portes et les radiateurs, la marge intégrée couvre généralement ces petites surfaces supplémentaires.",
      },
      maillage: [
        { slug: "volume-surface-piece", label: "Volume et surface pièce" },
        { slug: "calcul-carrelage", label: "Calcul carrelage" },
        { slug: "quantite-mortier", label: "Quantité mortier" },
      ],
      conseils: [
        "Préparez le support : lessivage, rebouchage des fissures et ponçage léger améliorent le rendement",
        "Achetez tous les pots du même lot de fabrication pour éviter des nuances de couleur",
        "Appliquez une sous-couche sur supports poreux, bois ou couleurs foncées",
        "Déduisez manuellement ~15 % de la surface murale pour portes et fenêtres",
      ],
      limites: [
        "Estimation indicative — le rendement sur l'emballage est mesuré en conditions idéales",
        "Ne remplace pas le conseil d'un peintre professionnel pour des surfaces complexes",
      ],
    }),
    faq: buildFaq([
      {
        question: "Combien de couches de peinture appliquer ?",
        answer:
          "Deux couches minimum pour une couverture uniforme. Trois couches sur supports foncés, après une sous-couche adaptée.",
      },
      {
        question: "Comment trouver le rendement de ma peinture ?",
        answer:
          "Le rendement en m²/L est indiqué sur l'emballage ou la fiche technique. Comptez 8 à 12 m²/L pour une peinture acrylique standard.",
      },
      {
        question: "Peinture mate ou satinée : même quantité ?",
        answer:
          "Le rendement est similaire. La préparation du support et le nombre de couches comptent plus que la finition.",
      },
      {
        question: "Dois-je déduire les portes et fenêtres ?",
        answer:
          "Oui, soustrayez environ 15 % de la surface murale totale. La marge de 10 % intégrée ne couvre pas toujours cet écart.",
      },
      {
        question: "Quelle peinture pour une pièce humide ?",
        answer:
          "Utilisez une peinture spéciale salle de bains ou cuisine, résistante à l'humidité et aux projections.",
      },
      {
        question: "Peut-on mélanger des pots de peinture différents ?",
        answer:
          "Mélangez uniquement des pots de la même référence et du même lot pour éviter des différences de teinte.",
      },
      {
        question: "Combien de temps entre deux couches ?",
        answer:
          "Respectez le temps de séchage indiqué sur le pot, généralement 4 à 6 heures pour une peinture acrylique.",
      },
      {
        question: "Peinture au rouleau ou au pistolet ?",
        answer:
          "Le pistolet couvre plus vite mais consomme souvent plus de peinture. Le rouleau est plus économique pour les particuliers.",
      },
      {
        question: "La sous-couche est-elle obligatoire ?",
        answer:
          "Recommandée sur plâtre brut, bois, supports foncés ou changement radical de couleur. Elle améliore l'adhérence et le rendement.",
      },
      {
        question: "Comment stocker le surplus de peinture ?",
        answer:
          "Fermez hermétiquement le pot, stockez à température ambiante et notez la référence couleur pour les retouches futures.",
      },
    ]),
  },

  "calcul-carrelage": {
    content: buildRichContent({
      intro:
        "Pour un sol ou un mur carrelé sans mauvaise surprise, calculez le nombre exact de carreaux et la colle nécessaire avant le passage en magasin.",
      definition:
        "Le calcul de carrelage détermine le nombre de carreaux à acheter selon la surface à couvrir, le format des carreaux et une marge pour les chutes de coupe.",
      objectif:
        "Ce simulateur estime le nombre de carreaux et la quantité de colle (kg) pour votre projet de revêtement céramique.",
      variables: [
        "Surface à carreler en m²",
        "Longueur et largeur du carreau en cm",
        "Marge de chutes en % (10 % standard, 15 % pour pose diagonale)",
      ],
      formules: [
        p("Surface d'un carreau (m²) = (Longueur en cm × Largeur en cm) ÷ 10 000."),
        p("Nombre de carreaux = Arrondi supérieur de (Surface ÷ Surface carreau) × (1 + Marge %)."),
        p("Colle estimée = Surface × 4 kg/m² (dosage moyen mortier-colle standard)."),
        hl(
          "Marge de chutes",
          "10 % suffit pour une pose droite. Prévoyez 15 % pour une pose en diagonale ou des carreaux de grand format difficiles à manier."
        ),
      ],
      interpretation: [
        p("Le nombre de carreaux est arrondi au supérieur : vous ne pouvez pas acheter une fraction de carreau."),
        p("La colle estimée est un repère moyen — vérifiez le dosage sur la fiche technique de votre colle."),
        hl(
          "Calepinage",
          "Planifiez le calepinage avant l'achat pour optimiser les coupes et réduire les chutes réelles.",
        ),
      ],
      limitesCalcul: [
        "Calepinage complexe (pièces en L, niches) non modélisé",
        "Carreaux irréguliers ou mosaïques : marge plus élevée recommandée",
        "Le joint n'est pas calculé ici — utilisez le simulateur quantité mortier",
      ],
      example: {
        title: "Carrelage d'une salle de bain de 20 m²",
        donnees: [
          "Surface à carreler : 20 m²",
          "Format carreau : 60 × 60 cm",
          "Marge chutes : 10 %",
        ],
        calcul: [
          "Surface carreau = (60 × 60) ÷ 10 000 = 0,36 m²",
          "Carreaux bruts = 20 ÷ 0,36 = 55,6 → avec 10 % : 61,1",
          "Nombre de carreaux = 62 (arrondi supérieur)",
          "Colle = 20 × 4 = 80 kg",
        ],
        resultat: "62 carreaux nécessaires (~80 kg de colle).",
        interpretation:
          "Commandez 62 carreaux 60×60 et environ 3 sacs de colle de 25 kg. Achetez tous les carreaux d'un même lot pour garantir une teinte uniforme.",
      },
      maillage: [
        { slug: "quantite-mortier", label: "Quantité mortier" },
        { slug: "surface-parquet", label: "Surface parquet" },
        { slug: "volume-surface-piece", label: "Volume et surface pièce" },
      ],
      conseils: [
        "Achetez tous les carreaux d'un même lot de fabrication",
        "Prévoyez du joint (0,2 kg/m² pour 3 mm) en complément",
        "Sur sol, vérifiez le ragréage et la planéité avant la pose",
        "Gardez 2 à 3 carreaux de réserve pour les réparations futures",
      ],
      limites: [
        "Estimation simplifiée — les formes de pièce complexes augmentent les chutes",
        "Dosage de colle variable selon le type de carreau et le support",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quelle marge de chutes prévoir ?",
        answer:
          "10 % pour une pose droite. 15 % pour une pose diagonale, des angles nombreux ou des carreaux de grand format.",
      },
      {
        question: "Combien de colle et de joint acheter ?",
        answer:
          "Comptez ~4 kg de colle/m² et ~0,2 kg de joint pour 5 m² de carrelage (joint 3 mm).",
      },
      {
        question: "Carrelage mural ou sol : même calcul ?",
        answer:
          "La formule est identique. Le sol nécessite souvent un ragréage et une colle plus performante.",
      },
      {
        question: "Les grands formats changent le calcul ?",
        answer:
          "Moins de joints visibles, mais plus de chutes en cas de casse. Prévoyez une marge plus élevée.",
      },
      {
        question: "Comment calculer la surface à carreler ?",
        answer:
          "Mesurez longueur × largeur de la pièce. Utilisez le simulateur volume et surface pièce pour les dimensions exactes.",
      },
      {
        question: "Pose droite ou diagonale ?",
        answer:
          "La diagonale est plus esthétique mais génère plus de chutes et demande plus de colle.",
      },
      {
        question: "Quel type de colle choisir ?",
        answer:
          "Colle C1 pour intérieur sec, C2E pour extérieur et pièces humides. Vérifiez la compatibilité avec votre carreau.",
      },
      {
        question: "Peut-on carreler sur du carrelage existant ?",
        answer:
          "Oui si l'ancien carrelage est sain et adhérent. Utilisez une colle renforcée et vérifiez la hauteur sous plafond.",
      },
      {
        question: "Carreaux rectifiés ou non rectifiés ?",
        answer:
          "Les rectifiés permettent des joints fins (2 mm). Les non rectifiés nécessitent des joints plus larges (5 à 8 mm).",
      },
      {
        question: "Délai entre colle et joint ?",
        answer:
          "Attendez 24 à 48 h après la pose avant d'appliquer le joint, selon la colle utilisée.",
      },
    ]),
  },

  "volume-beton": {
    content: buildRichContent({
      intro:
        "Commander la bonne quantité de béton évite les retards de chantier et les surcoûts liés à une toupie partiellement vide ou à des sacs insuffisants.",
      definition:
        "Le volume de béton est la quantité de matériau (en m³) nécessaire pour remplir un ouvrage : dalle, fondation, poteau ou longrine.",
      objectif:
        "Ce simulateur calcule le volume en m³ pour votre ouvrage, avec une marge de 5 % et une conversion en sacs prémélangés de 35 L.",
      variables: [
        "Type d'ouvrage : dalle (L × W × épaisseur) ou poteau (section × hauteur)",
        "Longueur en mètres",
        "Largeur ou section en mètres",
        "Épaisseur ou hauteur en mètres",
      ],
      formules: [
        p("Volume brut (m³) = Longueur × Largeur × Hauteur (ou épaisseur)."),
        p("Volume avec marge = Volume brut × 1,05 (5 % pour pertes et pompage)."),
        p("Sacs 35 L estimés = Arrondi supérieur de (Volume avec marge × 50)."),
        hl(
          "Toupie vs sacs",
          "Au-delà de 1 m³, la toupie est généralement plus économique. En dessous, les sacs prémélangés sont pratiques.",
        ),
      ],
      interpretation: [
        p("Le volume avec marge est la quantité à commander pour couvrir les pertes lors du coulage et du pompage."),
        p("Le nombre de sacs est une approximation pour les petits volumes — un sac de 35 L ≈ 0,02 m³ de béton prêt."),
        hl(
          "Épaisseur dalle",
          "10 à 15 cm pour une dalle légère, 15 à 20 cm pour un garage ou des charges lourdes.",
        ),
      ],
      limitesCalcul: [
        "Formes complexes (courbes, marches) non modélisées",
        "Dosage et résistance du béton (C25/30, C30/37) non calculés",
        "Le nombre de sacs est indicatif — vérifiez le volume réel du sac choisi",
      ],
      example: {
        title: "Dalle de garage 5 × 4 m, 15 cm d'épaisseur",
        donnees: [
          "Type : dalle",
          "Longueur : 5 m",
          "Largeur : 4 m",
          "Épaisseur : 0,15 m",
        ],
        calcul: [
          "Volume brut = 5 × 4 × 0,15 = 3 m³",
          "Avec marge 5 % : 3 × 1,05 = 3,15 m³",
          "Sacs 35 L : arrondi supérieur de (3,15 × 50) = 158 sacs",
        ],
        resultat: "Volume : 3,15 m³ (~158 sacs de 35 L).",
        interpretation:
          "Pour 3 m³, commandez une toupie de béton prêt à l'emploi plutôt que des sacs. Prévoyez un accès pour le camion toupie et des personnes pour le coulage.",
      },
      maillage: [
        { slug: "quantite-mortier", label: "Quantité mortier" },
        { slug: "volume-surface-piece", label: "Volume et surface pièce" },
        { slug: "calcul-carrelage", label: "Calcul carrelage" },
      ],
      conseils: [
        "Commandez la toupie pour des volumes supérieurs à 1 m³",
        "Pour petits volumes, les sacs prémélangés 35 kg sont plus pratiques",
        "Prévoyez un accès et un espace de manœuvre pour la toupie",
        "Protégez le béton des intempéries pendant le séchage (bâche)",
      ],
      limites: [
        "Estimation géométrique simple — ouvrages irréguliers nécessitent un calcul manuel",
        "Prix et disponibilité du béton variable selon la région",
      ],
    }),
    faq: buildFaq([
      {
        question: "Toupie ou sacs prémélangés ?",
        answer:
          "Toupie si volume > 1 m³. Sacs de 35 kg pour petits volumes (< 0,5 m³) ou travaux ponctuels.",
      },
      {
        question: "Quelle épaisseur pour une dalle ?",
        answer:
          "10 à 15 cm pour dalle légère (terrasse). 15 à 20 cm pour garage ou charges lourdes.",
      },
      {
        question: "Quel dosage de béton choisir ?",
        answer:
          "C25/30 courant pour fondations et dalles. C30/37 pour dalles industrielles ou charges élevées.",
      },
      {
        question: "Quel est le prix du béton en toupie ?",
        answer:
          "Comptez 100 à 150 €/m³ en toupie selon la région, le dosage et les options (fibres, retardateur).",
      },
      {
        question: "Combien de temps pour couler une dalle ?",
        answer:
          "Prévoyez une journée pour une dalle de 20 à 30 m² avec préparation, coulage et lissage.",
      },
      {
        question: "Faut-il un treillis soudé ?",
        answer:
          "Recommandé pour les dalles porteuses. Placez le treillis au milieu de l'épaisseur, sur des cales.",
      },
      {
        question: "Délai de séchage avant charge ?",
        answer:
          "Marche légère après 48 h. Charge normale après 7 jours. Résistance maximale à 28 jours.",
      },
      {
        question: "Béton coulé en hiver ?",
        answer:
          "Utilisez un béton avec retardateur ou antifreeze. Protégez du gel pendant au moins 48 h.",
      },
      {
        question: "Comment éviter les fissures ?",
        answer:
          "Treillis soudé, joints de dilatation, cure humide et respect des temps de séchage.",
      },
      {
        question: "Volume d'un poteau rectangulaire ?",
        answer:
          "Section (largeur × épaisseur) × hauteur. Exemple : 0,20 × 0,20 × 2,50 m = 0,10 m³.",
      },
    ]),
  },

  "surface-parquet": {
    content: buildRichContent({
      intro:
        "Estimez la surface de parquet ou stratifié à acheter, en intégrant les chutes de coupe et le format des packs vendus en magasin.",
      definition:
        "La surface de parquet est la quantité de lames nécessaire pour couvrir le sol d'une pièce, incluant une marge pour les chutes liées à la pose.",
      objectif:
        "Ce simulateur calcule la surface totale à commander et le nombre de packs nécessaires selon les dimensions de la pièce et le contenu des packs.",
      variables: [
        "Longueur et largeur de la pièce en mètres",
        "Marge de chutes en % (8 % pose droite, 12 % pose diagonale)",
        "Surface couverte par un pack en m² (indiquée sur l'emballage)",
      ],
      formules: [
        p("Surface pièce = Longueur × Largeur."),
        p("Surface totale = Surface pièce × (1 + Marge %)."),
        p("Nombre de packs = Arrondi supérieur de (Surface totale ÷ Surface par pack)."),
        hl(
          "Pose",
          "8 % de marge pour pose droite. 12 % pour pose en diagonale ou pièce avec obstacles nombreux.",
        ),
      ],
      interpretation: [
        p("Le nombre de packs est toujours arrondi au supérieur — vous ne pouvez pas acheter un demi-pack."),
        p("La surface totale inclut la marge de chutes : c'est la surface réelle à couvrir avec les lames achetées."),
        hl(
          "Humidité",
          "Vérifiez l'humidité du support et du parquet avant la pose — un écart trop grand cause des déformations.",
        ),
      ],
      limitesCalcul: [
        "Pièces irrégulières (L, alcôves) non modélisées — divisez en rectangles",
        "Sous-couche isolante non incluse dans le calcul",
        "Parquet massif vs stratifié : mêmes formules, mais besoins d'outillage différents",
      ],
      example: {
        title: "Chambre 5 × 4 m avec packs de 2,2 m²",
        donnees: [
          "Longueur pièce : 5 m",
          "Largeur pièce : 4 m",
          "Marge chutes : 8 %",
          "Surface par pack : 2,2 m²",
        ],
        calcul: [
          "Surface pièce = 5 × 4 = 20 m²",
          "Surface totale = 20 × 1,08 = 21,6 m²",
          "Packs = arrondi supérieur de (21,6 ÷ 2,2) = 10 packs",
        ],
        resultat: "21,6 m² — 10 pack(s) nécessaires.",
        interpretation:
          "Commandez 10 packs de 2,2 m² (22 m² au total). La petite surplus couvre les chutes et permet de garder quelques lames pour les réparations.",
      },
      maillage: [
        { slug: "calcul-carrelage", label: "Calcul carrelage" },
        { slug: "volume-surface-piece", label: "Volume et surface pièce" },
        { slug: "quantite-peinture", label: "Quantité de peinture" },
      ],
      conseils: [
        "Achetez tous les packs du même lot pour une teinte uniforme",
        "Prévoyez une sous-couche isolante phonique et anti-humidité",
        "Stockez le parquet 48 h dans la pièce avant la pose (acclimatation)",
        "Vérifiez la planéité du support (max 3 mm d'écart sur 2 m)",
      ],
      limites: [
        "Estimation pour pièce rectangulaire simple",
        "Ne couvre pas le coût ni le choix entre massif, contrecollé et stratifié",
      ],
    }),
    faq: buildFaq([
      {
        question: "Parquet massif ou stratifié ?",
        answer:
          "Stratifié : économique et facile à poser. Massif : plus durable, réparable par ponçage, idéal long terme.",
      },
      {
        question: "Quelle marge de chutes prévoir ?",
        answer:
          "8 % pour pose droite. 12 % pour pose diagonale ou pièce avec obstacles (colonnes, escaliers).",
      },
      {
        question: "La sous-couche est-elle obligatoire ?",
        answer:
          "Fortement recommandée pour l'isolation phonique, la protection contre l'humidité et le confort de marche.",
      },
      {
        question: "Pose flottante ou collée ?",
        answer:
          "Flottante : plus simple, réversible. Collée : plus stable, idéale pour parquet massif en pièces humides.",
      },
      {
        question: "Peut-on poser du parquet sur du carrelage ?",
        answer:
          "Oui avec une sous-couche adaptée si le carrelage est plan et sain. Vérifiez la hauteur sous plafond.",
      },
      {
        question: "Quelle sens de pose choisir ?",
        answer:
          "Perpendiculaire à la fenêtre principale pour un effet visuel harmonieux. Diagonale pour pièces carrées.",
      },
      {
        question: "Parquet et chauffage au sol ?",
        answer:
          "Vérifiez la compatibilité du parquet avec le chauffage. Certains stratifiés ne sont pas adaptés.",
      },
      {
        question: "Combien de temps dure une pose ?",
        answer:
          "1 à 2 jours pour une chambre standard en pose flottante. Plus long pour collage et finitions.",
      },
      {
        question: "Comment entretenir le parquet ?",
        answer:
          "Nettoyage à l'eau légèrement savonneuse. Évitez l'eau stagnante. Cire ou huile selon le type de parquet.",
      },
      {
        question: "Quelle différence entre contrecollé et massif ?",
        answer:
          "Contrecollé : couche noble sur support, bon rapport qualité-prix. Massif : lame entière, réparable plusieurs fois.",
      },
    ]),
  },

  "maprimerenov": {
    content: buildRichContent({
      intro:
        "MaPrimeRénov' finance une partie de vos travaux de rénovation énergétique. Estimez le montant de l'aide selon vos revenus et le type de travaux envisagés.",
      definition:
        "MaPrimeRénov' est une aide de l'État pour financer les travaux de rénovation énergétique des logements, versée selon des forfaits liés aux revenus du ménage et au type d'intervention.",
      objectif:
        "Ce simulateur estime le montant de MaPrimeRénov' que vous pourriez obtenir, plafonné au coût réel des travaux déclarés.",
      variables: [
        "Coût total des travaux en euros",
        "Catégorie de revenus (couleur : bleu, jaune, violet, rose)",
        "Type de travaux : isolation, pompe à chaleur ou chaudière performante",
      ],
      formules: [
        p("Aide = Minimum entre (Coût des travaux) et (Forfait selon couleur et type de travaux)."),
        p("Reste à charge = Coût des travaux − Aide MaPrimeRénov'."),
        hl(
          "Catégorie de revenus",
          "Déterminée par le revenu fiscal de référence (RFR) et la composition du foyer. Consultez france-renov.gouv.fr pour votre couleur.",
        ),
      ],
      interpretation: [
        p("L'aide affichée est un forfait simplifié — le barème officiel peut évoluer chaque année."),
        p("Le reste à charge est ce que vous devrez payer après déduction de MaPrimeRénov'."),
        hl(
          "Artisan RGE",
          "Les travaux doivent être réalisés par un professionnel RGE (Reconnu Garant de l'Environnement) pour être éligibles.",
        ),
      ],
      limitesCalcul: [
        "Forfaits simplifiés — le barème complet sur france-renov.gouv.fr est plus précis",
        "Plafonds, conditions d'éligibilité et cumuls d'aides non exhaustifs",
        "Ne remplace pas une demande officielle sur maprimerenov.gouv.fr",
      ],
      example: {
        title: "Isolation des combles pour 12 000 €, revenus modestes",
        donnees: [
          "Coût des travaux : 12 000 €",
          "Catégorie de revenus : jaune (modestes)",
          "Type de travaux : isolation",
        ],
        calcul: [
          "Forfait isolation jaune = 4 000 €",
          "Aide = min(12 000 ; 4 000) = 4 000 €",
          "Reste à charge = 12 000 − 4 000 = 8 000 €",
        ],
        resultat: "MaPrimeRénov' estimée : 4 000 € (reste à charge : 8 000 €).",
        interpretation:
          "Vous pouvez cumuler cette aide avec les CEE (certificats d'économies d'énergie) et l'éco-PTZ pour réduire davantage le reste à charge. Faites appel à un artisan RGE.",
      },
      maillage: [
        { slug: "economies-isolation", label: "Économies isolation" },
        { slug: "pompe-a-chaleur-economies", label: "Pompe à chaleur économies" },
        { slug: "estimation-consommation-energie", label: "Estimation consommation énergie" },
      ],
      conseils: [
        "Faites un audit énergétique si vous envisagez une rénovation globale",
        "Cumulez MaPrimeRénov' avec les CEE et l'éco-PTZ",
        "Choisissez un artisan RGE — obligatoire pour l'éligibilité",
        "Conservez toutes les factures et attestations pour le dossier",
      ],
      limites: [
        "Barème indicatif — vérifiez les montants actualisés sur france-renov.gouv.fr",
        "Conditions d'éligibilité du logement (âge, résidence principale) non vérifiées ici",
      ],
    }),
    faq: buildFaq([
      {
        question: "L'artisan RGE est-il obligatoire ?",
        answer:
          "Oui, les travaux doivent être réalisés par un professionnel RGE pour bénéficier de MaPrimeRénov'.",
      },
      {
        question: "Peut-on cumuler les aides ?",
        answer:
          "MaPrimeRénov' est cumulable avec les CEE, l'éco-PTZ et certaines aides locales selon les plafonds.",
      },
      {
        question: "Maison ou appartement : les deux sont éligibles ?",
        answer:
          "Oui, selon le type de travaux et les conditions du logement (résidence principale, ancienneté).",
      },
      {
        question: "Quand est versée l'aide ?",
        answer:
          "Après réalisation des travaux et envoi des factures et attestations sur maprimerenov.gouv.fr.",
      },
      {
        question: "Comment connaître ma couleur (catégorie de revenus) ?",
        answer:
          "Selon votre RFR et la composition du foyer. Un simulateur officiel est disponible sur france-renov.gouv.fr.",
      },
      {
        question: "MaPrimeRénov' pour une pompe à chaleur ?",
        answer:
          "Oui, forfaits de 0 à 5 000 € selon vos revenus. Les ménages les plus modestes (bleu) touchent le plus.",
      },
      {
        question: "Travaux en copropriété : possible ?",
        answer:
          "Oui pour les travaux individuels dans votre lot. Les travaux collectifs peuvent bénéficier d'autres dispositifs.",
      },
      {
        question: "Délai de traitement du dossier ?",
        answer:
          "Comptez plusieurs semaines entre la demande et le versement. Anticipez dans votre planification financière.",
      },
      {
        question: "Peut-on faire les travaux soi-même ?",
        answer:
          "Non pour MaPrimeRénov' classique — un professionnel RGE est requis. Exception possible pour MaPrimeRénov' Parcours accompagné.",
      },
      {
        question: "Quelle différence avec les CEE ?",
        answer:
          "MaPrimeRénov' est une aide publique. Les CEE sont des primes versées par les fournisseurs d'énergie, cumulables.",
      },
    ]),
  },

  "estimation-consommation-energie": {
    content: buildRichContent({
      intro:
        "Anticipez votre facture énergétique annuelle et comparez l'impact de l'isolation et du mode de chauffage sur votre budget.",
      definition:
        "La consommation énergétique d'un logement est la quantité d'énergie (en kWh) nécessaire chaque année pour le chauffer et assurer le confort thermique.",
      objectif:
        "Ce simulateur estime la consommation annuelle en kWh et le coût en euros selon la surface, la qualité d'isolation et le mode de chauffage.",
      variables: [
        "Surface habitable en m²",
        "Qualité d'isolation (mauvaise, moyenne, bonne — repère DPE)",
        "Mode de chauffage : gaz, électricité ou fioul",
        "Prix de l'énergie en €/kWh",
      ],
      formules: [
        p("kWh/m²/an selon isolation : mauvaise = 280, moyenne = 180, bonne = 80."),
        p("Facteur chauffage : gaz = 1, fioul = 1,1, électricité = 1,2."),
        p("Consommation (kWh/an) = Surface × kWh/m²/an × Facteur chauffage."),
        p("Coût annuel = Consommation × Prix €/kWh."),
        hl(
          "DPE",
          "Un diagnostic de performance énergétique (DPE) ou un audit énergétique donne une estimation bien plus précise.",
        ),
      ],
      interpretation: [
        p("Le kWh/m²/an affiché permet de comparer votre logement aux standards (objectif rénovation : < 100 kWh/m²/an)."),
        p("Un logement classé F ou G au DPE est une « passoire thermique » — rénovation fortement recommandée."),
        hl(
          "Passoire thermique",
          "Les logements F et G sont progressivement interdits à la location. L'isolation est le premier levier d'amélioration.",
        ),
      ],
      limitesCalcul: [
        "Estimation très simplifiée — climat, orientation et usage non modélisés",
        "Eau chaude sanitaire et éclairage non inclus",
        "Prix de l'énergie variable selon les contrats et les marchés",
      ],
      example: {
        title: "Appartement 90 m², isolation moyenne, chauffage gaz",
        donnees: [
          "Surface habitable : 90 m²",
          "Isolation : moyenne (DPE D/E)",
          "Chauffage : gaz",
          "Prix énergie : 0,12 €/kWh",
        ],
        calcul: [
          "kWh/m²/an = 180 (isolation moyenne)",
          "Consommation = 90 × 180 × 1 = 16 200 kWh/an",
          "Coût = 16 200 × 0,12 = 1 944 €/an",
        ],
        resultat: "~16 200 kWh/an — Coût : 1 944 €/an.",
        interpretation:
          "Avec une isolation moyenne et le gaz, la facture de chauffage tourne autour de 1 900 € par an. Une isolation des combles pourrait réduire significativement cette consommation.",
      },
      maillage: [
        { slug: "economies-isolation", label: "Économies isolation" },
        { slug: "maprimerenov", label: "MaPrimeRénov'" },
        { slug: "pompe-a-chaleur-economies", label: "Pompe à chaleur économies" },
      ],
      conseils: [
        "Isolez en priorité les combles — 30 % des déperditions passent par le toit",
        "Comparez les offres d'énergie chaque année",
        "Installez un thermostat programmable pour réduire la consommation",
        "Demandez un DPE ou un audit pour une vision précise",
      ],
      limites: [
        "Modèle simplifié — ne remplace pas un DPE officiel",
        "Ne tient pas compte des aides à la rénovation",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quel kWh/m²/an pour un logement moyen ?",
        answer:
          "Le logement moyen français consomme 150 à 250 kWh/m²/an selon l'âge et l'isolation.",
      },
      {
        question: "Le DPE est-il obligatoire ?",
        answer:
          "Oui pour la vente et la location. Valable 10 ans. Obligatoire aussi pour MaPrimeRénov' dans certains cas.",
      },
      {
        question: "Comment réduire la consommation ?",
        answer:
          "Isolation, changement de mode de chauffage, thermostat programmable et baisse des températures de consigne.",
      },
      {
        question: "Qu'est-ce qu'une passoire thermique ?",
        answer:
          "Logement classé F ou G au DPE. Interdiction progressive de mise en location pour ces logements.",
      },
      {
        question: "Gaz, fioul ou électricité : lequel coûte le moins ?",
        answer:
          "Le gaz est souvent le moins cher au kWh utile. L'électricité directe est plus coûteuse sauf avec une PAC.",
      },
      {
        question: "La consommation inclut l'eau chaude ?",
        answer:
          "Non, ce simulateur couvre principalement le chauffage. L'eau chaude ajoute 15 à 25 % en général.",
      },
      {
        question: "Impact d'une rénovation globale ?",
        answer:
          "Une rénovation performante peut diviser la consommation par 3 ou 4 et améliorer le DPE de plusieurs classes.",
      },
      {
        question: "Comment lire mon DPE ?",
        answer:
          "Les classes A (excellent) à G (très mauvais). La consommation en kWh/m²/an est indiquée sur le document.",
      },
      {
        question: "Le prix du kWh : comment le trouver ?",
        answer:
          "Sur votre facture d'énergie : divisez le montant TTC par le nombre de kWh consommés sur la période.",
      },
      {
        question: "Consommation en location : qui paie ?",
        answer:
          "Le bailleur fournit le DPE. Le locataire paie les factures d'énergie selon le contrat de location.",
      },
    ]),
  },

  "pompe-a-chaleur-economies": {
    content: buildRichContent({
      intro:
        "Une pompe à chaleur (PAC) air/eau peut diviser vos factures de chauffage. Estimez les économies annuelles et le temps de retour sur investissement.",
      definition:
        "Une pompe à chaleur capte l'énergie de l'air extérieur pour chauffer l'eau du circuit de chauffage, avec un rendement bien supérieur à un chauffage direct électrique.",
      objectif:
        "Ce simulateur compare votre coût de chauffage actuel au coût estimé avec une PAC, en intégrant l'investissement, les aides et le SCOP.",
      variables: [
        "Coût annuel du chauffage actuel en euros",
        "Coût d'installation de la PAC en euros",
        "Aides publiques (MaPrimeRénov', CEE) en euros",
        "Efficacité PAC (SCOP) — coefficient de performance saisonnier",
      ],
      formules: [
        p("Nouveau coût ≈ (Coût actuel ÷ SCOP) × 1,3 (facteur électricité)."),
        p("Économie annuelle = Coût actuel − Nouveau coût."),
        p("Investissement net = Coût PAC − Aides."),
        p("ROI (retour sur investissement) = Investissement net ÷ Économie annuelle."),
        hl(
          "SCOP",
          "Viser un SCOP ≥ 3,5 pour une PAC air/eau performante. Plus le SCOP est élevé, plus les économies sont importantes.",
        ),
      ],
      interpretation: [
        p("Le ROI indique en combien d'années l'économie annuelle rembourse l'investissement net."),
        p("Une économie positive signifie que la PAC réduit votre facture par rapport au chauffage actuel."),
        hl(
          "Radiateurs",
          "Vérifiez la compatibilité de vos radiateurs avec une PAC basse température (40-55 °C).",
        ),
      ],
      limitesCalcul: [
        "SCOP variable selon climat, installation et entretien",
        "Coût de l'électricité variable — le facteur 1,3 est une approximation",
        "Maintenance et durée de vie (15-20 ans) non intégrées au ROI",
      ],
      example: {
        title: "Remplacement d'un chauffage fioul par une PAC air/eau",
        donnees: [
          "Coût chauffage actuel : 2 200 €/an",
          "Coût installation PAC : 14 000 €",
          "Aides : 4 000 €",
          "SCOP : 3,5",
        ],
        calcul: [
          "Nouveau coût = (2 200 ÷ 3,5) × 1,3 ≈ 817 €/an",
          "Économie = 2 200 − 817 ≈ 1 383 €/an",
          "Investissement net = 14 000 − 4 000 = 10 000 €",
          "ROI = 10 000 ÷ 1 383 ≈ 7,2 ans",
        ],
        resultat: "Économie : ~1 383 €/an — ROI : ~7,2 ans.",
        interpretation:
          "Après aides, la PAC se rembourse en environ 7 ans. Les économies continuent ensuite pendant 10 à 15 ans de durée de vie restante.",
      },
      maillage: [
        { slug: "maprimerenov", label: "MaPrimeRénov'" },
        { slug: "estimation-consommation-energie", label: "Estimation consommation énergie" },
        { slug: "economies-isolation", label: "Économies isolation" },
      ],
      conseils: [
        "Combinez la PAC avec une bonne isolation pour maximiser le SCOP réel",
        "Choisissez un artisan RGE pour bénéficier des aides",
        "Vérifiez la compatibilité radiateurs / plancher chauffant",
        "Prévoyez une maintenance annuelle pour maintenir l'efficacité",
      ],
      limites: [
        "Estimation basée sur un SCOP moyen — le rendement réel dépend de votre installation",
        "Ne remplace pas une étude thermique personnalisée",
      ],
    }),
    faq: buildFaq([
      {
        question: "PAC air/eau ou géothermique ?",
        answer:
          "Air/eau : moins cher, installation plus simple. Géothermique : plus efficace mais investissement initial élevé.",
      },
      {
        question: "Mes radiateurs sont-ils compatibles ?",
        answer:
          "PAC basse température : radiateurs basse T ou plancher chauffant recommandés. Radiateurs haute T : PAC haute température nécessaire.",
      },
      {
        question: "Quelles aides pour une PAC ?",
        answer:
          "MaPrimeRénov' (jusqu'à 5 000 €) + CEE. Montants selon revenus et type de logement.",
      },
      {
        question: "Quelle durée de vie pour une PAC ?",
        answer:
          "15 à 20 ans avec maintenance régulière. Contrat de maintenance recommandé.",
      },
      {
        question: "La PAC fonctionne en hiver rigoureux ?",
        answer:
          "Les PAC modernes fonctionnent jusqu'à −15 °C ou −25 °C selon les modèles. Vérifiez la fiche technique.",
      },
      {
        question: "PAC et climatisation ?",
        answer:
          "Certaines PAC réversible offrent aussi la climatisation en été — un double avantage.",
      },
      {
        question: "Bruit d'une PAC extérieure ?",
        answer:
          "Choisissez un modèle silencieux et respectez les distances réglementaires avec les voisins.",
      },
      {
        question: "Entretien obligatoire ?",
        answer:
          "Contrôle tous les 2 ans pour les PAC de plus de 4 kW. Maintenance annuelle recommandée.",
      },
      {
        question: "PAC en remplacement de chaudière gaz ?",
        answer:
          "Oui, souvent rentable si le gaz coûte plus que l'électricité au kWh utile. Comparez les coûts sur 15 ans.",
      },
      {
        question: "Quel SCOP viser ?",
        answer:
          "Minimum 3,5 pour une PAC air/eau. Les meilleurs modèles atteignent 4,5 à 5 en conditions optimales.",
      },
    ]),
  },

  "volume-surface-piece": {
    content: buildRichContent({
      intro:
        "Surface au sol et volume d'une pièce sont les bases de tous vos calculs de matériaux : peinture, parquet, climatisation, ventilation.",
      definition:
        "La surface au sol est l'aire du plan de la pièce (m²). Le volume est l'espace intérieur en trois dimensions (m³), utile pour le confort thermique et la ventilation.",
      objectif:
        "Ce simulateur calcule la surface au sol, le volume et la surface des murs d'une pièce rectangulaire.",
      variables: [
        "Longueur de la pièce en mètres",
        "Largeur de la pièce en mètres",
        "Hauteur sous plafond en mètres",
      ],
      formules: [
        p("Surface au sol = Longueur × Largeur."),
        p("Volume = Longueur × Largeur × Hauteur."),
        p("Surface murs = 2 × (Longueur + Largeur) × Hauteur."),
        p("Périmètre = 2 × (Longueur + Largeur)."),
        hl(
          "Usage",
          "Surface sol pour parquet et carrelage. Volume pour climatisation et VMC. Surface murs pour peinture et papier peint.",
        ),
      ],
      interpretation: [
        p("La surface murs inclut toutes les parois verticales — déduisez manuellement portes (~2 m²) et fenêtres (~1,5 m² chacune) pour la peinture."),
        p("Le volume sert à dimensionner une climatisation (≈ 40 W/m³) ou une VMC."),
        hl(
          "Hauteur standard",
          "2,50 m est la hauteur sous plafond standard des logements neufs en France.",
        ),
      ],
      limitesCalcul: [
        "Pièces rectangulaires uniquement",
        "Ouvertures (portes, fenêtres) non déduites automatiquement",
        "Cloisons intérieures et pièces en L non modélisées",
      ],
      example: {
        title: "Chambre 4,5 × 3,5 m, hauteur 2,5 m",
        donnees: [
          "Longueur : 4,5 m",
          "Largeur : 3,5 m",
          "Hauteur sous plafond : 2,5 m",
        ],
        calcul: [
          "Surface sol = 4,5 × 3,5 = 15,75 m²",
          "Volume = 15,75 × 2,5 = 39,4 m³",
          "Surface murs = 2 × (4,5 + 3,5) × 2,5 = 40 m²",
          "Périmètre = 2 × (4,5 + 3,5) = 16 m",
        ],
        resultat: "Surface : 15,75 m² — Volume : 39,4 m³.",
        interpretation:
          "Pour peindre les murs, comptez ~40 m² moins les ouvertures. Pour le parquet, utilisez la surface au sol de 15,75 m² avec une marge de chutes.",
      },
      maillage: [
        { slug: "quantite-peinture", label: "Quantité de peinture" },
        { slug: "surface-parquet", label: "Surface parquet" },
        { slug: "estimation-consommation-energie", label: "Estimation consommation énergie" },
      ],
      conseils: [
        "Mesurez chaque pièce séparément pour un total précis",
        "Pour une pièce en L, divisez en rectangles et additionnez",
        "Déduisez les ouvertures pour les calculs de peinture",
        "La hauteur sous plafond peut varier (mezzanine, combles aménagés)",
      ],
      limites: [
        "Géométrie rectangulaire simple",
        "Ne calcule pas la surface du plafond séparément (égale à la surface sol)",
      ],
    }),
    faq: buildFaq([
      {
        question: "Comment calculer la surface des murs ?",
        answer:
          "2 × (Longueur + Largeur) × Hauteur. Déduire portes (~2 m²) et fenêtres (~1,5 m² chacune).",
      },
      {
        question: "Volume pour dimensionner une climatisation ?",
        answer:
          "Puissance clim ≈ Volume × 40 W/m³. L'orientation, l'isolation et les occupants influencent le besoin réel.",
      },
      {
        question: "Hauteur sous plafond standard en France ?",
        answer:
          "2,50 m minimum pour les logements neufs. Ancien : souvent 2,70 à 3,00 m.",
      },
      {
        question: "Pièce en L : comment calculer ?",
        answer:
          "Divisez en deux rectangles, calculez chaque surface et additionnez les résultats.",
      },
      {
        question: "Surface utile vs surface habitable ?",
        answer:
          "Surface habitable = surface au sol des pièces closes, hors combles non aménagés, caves et garages.",
      },
      {
        question: "Comment mesurer avec précision ?",
        answer:
          "Mètre laser recommandé. Mesurez au sol, au milieu des murs, en tenant compte des irrégularités.",
      },
      {
        question: "Volume et ventilation ?",
        answer:
          "La VMC est dimensionnée selon le volume et le nombre de pièces. Consultez les normes DTU.",
      },
      {
        question: "Périmètre : quel usage ?",
        answer:
          "Plinthes, corniches, bandes LED, calcul de frises décoratives le long des murs.",
      },
      {
        question: "Surface plafond pour peinture ?",
        answer:
          "Égale à la surface au sol dans une pièce rectangulaire. Ajoutez-la à la surface murs pour un total peinture.",
      },
      {
        question: "Différence volume et surface ?",
        answer:
          "Surface en m² (2D) pour revêtements. Volume en m³ (3D) pour chauffage, climatisation et acoustique.",
      },
    ]),
  },

  "quantite-mortier": {
    content: buildRichContent({
      intro:
        "Mortier-colle, joint ou enduit : estimez la quantité en kilogrammes et le nombre de sacs à acheter pour votre surface à traiter.",
      definition:
        "Le mortier-colle fixe le carrelage au support. Le joint remplit les espaces entre carreaux. L'enduit lisse et prépare les murs avant peinture ou carrelage.",
      objectif:
        "Ce simulateur calcule la quantité totale en kg et le nombre de sacs de 25 kg selon le type de mortier et la surface.",
      variables: [
        "Surface à traiter en m²",
        "Type : mortier-colle (4 kg/m²), joint (0,2 kg/m²) ou enduit (15 kg/m² × épaisseur en cm)",
        "Épaisseur d'enduit en cm (pour le type enduit)",
      ],
      formules: [
        p("Colle : 4 kg/m² (dosage moyen standard)."),
        p("Joint : 0,2 kg/m² (pour joint de 3 mm)."),
        p("Enduit : 15 kg/m² × Épaisseur en cm (pour 1 cm d'épaisseur de référence)."),
        p("Sacs 25 kg = Arrondi supérieur de (Total kg ÷ 25)."),
        hl(
          "Fiches techniques",
          "Les dosages varient selon les produits — consultez toujours la fiche technique du fabricant.",
        ),
      ],
      interpretation: [
        p("Le nombre de sacs est arrondi au supérieur : mieux vaut un sac en plus qu'une rupture en cours de chantier."),
        p("Pour l'enduit, l'épaisseur influence fortement la quantité — 2 cm double la consommation par rapport à 1 cm."),
        hl(
          "Séchage",
          "Respectez les temps de séchage entre colle, joint et enduit pour une pose durable.",
        ),
      ],
      limitesCalcul: [
        "Dosages moyens — supports irréguliers nécessitent plus de mortier",
        "Largeur de joint et format de carreau influencent le joint réel",
        "Enduit extérieur vs intérieur : produits et dosages différents",
      ],
      example: {
        title: "Colle pour 25 m² de carrelage",
        donnees: [
          "Surface à traiter : 25 m²",
          "Type : mortier-colle",
          "Dosage : 4 kg/m²",
        ],
        calcul: [
          "Total = 25 × 4 = 100 kg",
          "Sacs 25 kg = arrondi supérieur de (100 ÷ 25) = 4 sacs",
        ],
        resultat: "100 kg — 4 sac(s) de 25 kg.",
        interpretation:
          "Pour 25 m², achetez 4 sacs de colle de 25 kg. Prévoyez en complément ~5 kg de joint (0,2 kg/m² × 25 m² = 5 kg).",
      },
      maillage: [
        { slug: "calcul-carrelage", label: "Calcul carrelage" },
        { slug: "volume-beton", label: "Volume béton" },
        { slug: "quantite-peinture", label: "Quantité de peinture" },
      ],
      conseils: [
        "Respectez les temps de séchage indiqués sur les produits",
        "Utilisez la colle adaptée au support (plâtre, béton, ancien carrelage)",
        "Appliquez le joint après séchage complet de la colle (24-48 h)",
        "Pour l'enduit, appliquez en deux passes fines plutôt qu'une couche épaisse",
      ],
      limites: [
        "Dosages indicatifs — vérifier sur chaque produit",
        "Ne calcule pas le primaire d'accrochage ni les additifs",
      ],
    }),
    faq: buildFaq([
      {
        question: "Colle intérieur ou extérieur ?",
        answer:
          "Colle C2E pour extérieur et pièces humides. C1 pour intérieur sec. Vérifiez la classification.",
      },
      {
        question: "Quelle épaisseur de joint ?",
        answer:
          "2 à 3 mm standard. 5 mm pour carreaux irréguliers ou non rectifiés.",
      },
      {
        question: "Temps de séchage de la colle ?",
        answer:
          "24 à 48 h avant de marcher sur le carrelage. Joint après 24 h minimum.",
      },
      {
        question: "Enduit intérieur ou extérieur ?",
        answer:
          "Produits spécifiques selon l'usage. Épaisseur maximale selon la fiche technique du produit.",
      },
      {
        question: "Peut-on coller sur de l'ancien carrelage ?",
        answer:
          "Oui avec une colle renforcée (C2) et un primaire d'accrochage si le support est lisse.",
      },
      {
        question: "Combien de joint pour 20 m² ?",
        answer:
          "À 0,2 kg/m² pour joint 3 mm : 20 × 0,2 = 4 kg, soit un sac de 5 kg en général.",
      },
      {
        question: "Mortier-colle en poudre ou prêt à l'emploi ?",
        answer:
          "Poudre : économique, stockage long. Prêt à l'emploi : pratique pour petites surfaces.",
      },
      {
        question: "Enduit de lissage ou de rebouchage ?",
        answer:
          "Rebouchage pour fissures et trous. Lissage pour préparer avant peinture ou papier peint.",
      },
      {
        question: "Température de application ?",
        answer:
          "Généralement entre 5 °C et 30 °C. Ne pas appliquer sur support gelé ou en plein soleil.",
      },
      {
        question: "Comment éviter les bulles d'air sous le carrelage ?",
        answer:
          "Technique du double encollage pour grands formats. Utilisez une cloche à traire adaptée.",
      },
    ]),
  },

  "economies-isolation": {
    content: buildRichContent({
      intro:
        "L'isolation est le levier le plus efficace pour réduire vos factures et améliorer votre DPE. Estimez les économies et le retour sur investissement.",
      definition:
        "L'isolation thermique limite les déperditions de chaleur par les parois (combles, murs, fenêtres) et réduit la consommation énergétique du logement.",
      objectif:
        "Ce simulateur estime l'économie annuelle sur la facture de chauffage et le ROI après isolation, en tenant compte des aides.",
      variables: [
        "Facture de chauffage annuelle actuelle en euros",
        "Type d'isolation : combles (25 %), murs (15 %), fenêtres (10 %), globale (40 %)",
        "Coût de l'isolation en euros",
        "Aides publiques en euros (MaPrimeRénov', CEE)",
      ],
      formules: [
        p("Économie annuelle = Facture actuelle × Taux de réduction selon le type d'isolation."),
        p("Investissement net = Coût isolation − Aides."),
        p("ROI = Investissement net ÷ Économie annuelle."),
        hl(
          "Combles en priorité",
          "30 % des déperditions passent par le toit. L'isolation des combles perdus est souvent le premier travail à réaliser.",
        ),
      ],
      interpretation: [
        p("Le taux de réduction est une moyenne — un audit énergétique donne une estimation plus précise."),
        p("Un ROI inférieur à 10 ans est généralement considéré comme rentable pour l'isolation."),
        hl(
          "Gain DPE",
          "L'isolation des combles peut améliorer le DPE de 1 à 2 classes, facilitant la vente ou la location.",
        ),
      ],
      limitesCalcul: [
        "Taux moyens — résultats variables selon l'état initial du logement",
        "Aides non exhaustives — cumuls et plafonds à vérifier sur france-renov.gouv.fr",
        "Coût de l'énergie futur non modélisé (hausse = ROI plus rapide)",
      ],
      example: {
        title: "Isolation des combles perdus",
        donnees: [
          "Facture chauffage : 1 800 €/an",
          "Type : combles perdus (25 % d'économie)",
          "Coût isolation : 3 500 €",
          "Aides : 1 500 €",
        ],
        calcul: [
          "Économie = 1 800 × 0,25 = 450 €/an",
          "Investissement net = 3 500 − 1 500 = 2 000 €",
          "ROI = 2 000 ÷ 450 ≈ 4,4 ans",
        ],
        resultat: "Économie : 450 €/an — ROI : ~4,4 ans.",
        interpretation:
          "L'isolation des combles est rentable en moins de 5 ans après aides. C'est le travail le plus impactant et souvent le moins coûteux.",
      },
      maillage: [
        { slug: "maprimerenov", label: "MaPrimeRénov'" },
        { slug: "estimation-consommation-energie", label: "Estimation consommation énergie" },
        { slug: "pompe-a-chaleur-economies", label: "Pompe à chaleur économies" },
      ],
      conseils: [
        "Commencez par les combles — travail rapide, impact maximal",
        "Artisan RGE obligatoire pour MaPrimeRénov'",
        "Combinez isolation et changement de chauffage pour un gain global",
        "Demandez un audit énergétique pour prioriser les travaux",
      ],
      limites: [
        "Taux indicatifs — audit énergétique recommandé pour précision",
        "Ne couvre pas l'isolation phonique",
      ],
    }),
    faq: buildFaq([
      {
        question: "Prix d'une isolation de combles ?",
        answer:
          "1 500 à 4 000 € selon surface et méthode (soufflage laine de verre, panneaux).",
      },
      {
        question: "MaPrimeRénov' pour l'isolation ?",
        answer:
          "Forfaits de 1 000 à 7 500 € selon revenus et type d'isolation (combles, murs, planchers).",
      },
      {
        question: "Isolation intérieure ou extérieure ?",
        answer:
          "Extérieure (ITE) : plus efficace, pas de perte de surface. Intérieure (ITI) : moins coûteuse, réduit légèrement la surface habitable.",
      },
      {
        question: "Gain sur le DPE ?",
        answer:
          "Isolation combles : souvent +1 à 2 classes. Rénovation globale : jusqu'à +3 classes.",
      },
      {
        question: "Combles perdus ou aménagés ?",
        answer:
          "Perdus : soufflage sous rampants. Aménagés : isolation sous toiture ou entre chevrons.",
      },
      {
        question: "Isolation et humidité ?",
        answer:
          "Traitez les problèmes d'humidité avant d'isoler. Une VMC efficace est indispensable.",
      },
      {
        question: "Matériaux : laine de verre ou ouate ?",
        answer:
          "Laine de verre : courant, bon rapport prix/performance. Ouate de cellulose : bonne performance, écologique.",
      },
      {
        question: "Isolation des murs : par l'intérieur ?",
        answer:
          "ITI : doublage avec plaques de plâtre + isolant. ITE : bardage ou enduit isolant sur l'extérieur.",
      },
      {
        question: "Fenêtres double vitrage : suffisant ?",
        answer:
          "Double vitrage performant (Ug ≤ 1,1) est un bon premier pas. Triple vitrage pour performances maximales.",
      },
      {
        question: "Délai de réalisation ?",
        answer:
          "Combles perdus : 1 journée. ITE complète : plusieurs semaines selon la surface.",
      },
    ]),
  },
};
