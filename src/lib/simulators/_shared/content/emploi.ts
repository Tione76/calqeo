import { createRegistry } from "./factory";
import type { ContentRegistry } from "./types";

export const emploiContent: ContentRegistry = createRegistry({
  "salaire-brut-net": {
    intro:
      "Estimez le salaire net perçu sur votre compte avant prélèvement à la source à partir de votre rémunération brute mensuelle.",
    definition:
      "Le salaire net avant impôt correspond au montant versé par l'employeur après déduction des cotisations sociales salariales (retraite, chômage, maladie) et de la CSG/CRDS. Il diffère du net imposable et du net après impôt sur le revenu.",
    objectif:
      "Anticiper votre revenu disponible mensuel, comparer une offre d'emploi ou vérifier la cohérence d'un bulletin de paie sans attendre la fiche de paie officielle.",
    variables: [
      "Salaire brut mensuel (€)",
      "Taux global de cotisations salariales (%)",
    ],
    formule:
      "Net = Brut − Cotisations salariales − CSG/CRDS, avec CSG/CRDS calculée sur une assiette légèrement inférieure au brut (≈ 98,25 % × 9,2 %).",
    formuleDetail:
      "Cotisations salariales = Brut × taux saisi (≈ 22 % pour un non-cadre). CSG/CRDS ≈ Brut × 0,9825 × 0,092. Le net affiché est avant prélèvement à la source.",
    interpretation: [
      "Un taux de cotisations de 22 % est une moyenne pour un salarié non cadre ; les cadres peuvent approcher 25 à 28 %.",
      "Le net calculé ici est celui avant impôt : le prélèvement à la source vient en déduction supplémentaire selon votre taux personnalisé.",
      "Les cotisations patronales ne sont pas déduites du salaire : elles sont payées par l'employeur en plus du brut.",
      "Sur une fiche de paie, repérez la ligne « Net à payer avant impôt sur le revenu » pour comparer directement au résultat du simulateur.",
      "Une prime exceptionnelle ou un 13e mois non lissé fausse l'estimation si vous les intégrez dans le brut mensuel saisi.",
    ],
    limitesCalcul: [
      "Taux de cotisations saisi manuellement — pas de calcul ligne par ligne du bulletin.",
      "Prélèvement à la source et net imposable non calculés.",
      "Cas particuliers (apprenti, stagiaire, expatrié) non couverts.",
    ],
    example: {
      title: "Non-cadre avec 2 500 € brut et 22 % de cotisations",
      donnees: [
        "Salaire brut mensuel : 2 500 €",
        "Cotisations salariales : 22 %",
      ],
      calcul: [
        "Cotisations salariales = 2 500 × 22 % = 550 €",
        "Assiette CSG = 2 500 × 98,25 % = 2 456,25 €",
        "CSG/CRDS = 2 456,25 × 9,2 % ≈ 226 €",
        "Net = 2 500 − 550 − 226 = 1 724 €",
      ],
      resultat: "Salaire net estimé : 1 724 €/mois — soit environ 20 688 €/an avant impôt.",
      interpretation:
        "Sur 2 500 € brut, environ 31 % partent en cotisations et CSG/CRDS. Pour connaître le montant réellement disponible, retranchez encore votre prélèvement à la source.",
    },
    maillage: [
      { slug: "salaire-net-brut", label: "Salaire net en brut (calcul inverse)" },
      { slug: "cout-total-embauche-salarie", label: "Coût total d'embauche" },
      { slug: "smic-net", label: "SMIC net mensuel" },
    ],
    conseils: [
      "Comparez toujours les montants bruts lors d'une négociation salariale.",
      "Vérifiez le taux de prélèvement à la source sur votre dernier avis d'impôt.",
      "Consultez votre bulletin de paie pour le détail des cotisations réelles.",
      "Croisez ce résultat avec un simulateur de reste à vivre pour évaluer votre budget.",
    ],
    limites: [
      "Estimation pédagogique — le bulletin de paie fait foi.",
      "Ne remplace pas un expert-comptable ou le service paie de votre entreprise.",
      "Les avantages en nature et primes exceptionnelles ne sont pas modélisés ici.",
    ],
    faq: [
      {
        question: "Quelle différence entre salaire brut et salaire net ?",
        answer:
          "Le brut est la rémunération contractuelle avant cotisations. Le net est ce qui est versé sur votre compte après déduction des cotisations salariales et de la CSG/CRDS, mais avant l'impôt sur le revenu.",
      },
      {
        question: "Pourquoi utiliser un taux de 22 % de cotisations ?",
        answer:
          "C'est une moyenne courante pour un salarié non cadre en France. Le taux exact varie selon votre statut, votre tranche de rémunération et votre convention collective.",
      },
      {
        question: "Le net calculé inclut-il l'impôt sur le revenu ?",
        answer:
          "Non. Le simulateur affiche le net avant prélèvement à la source. L'impôt est prélevé mensuellement en plus, selon le taux transmis par l'administration fiscale.",
      },
      {
        question: "Comment interpréter le taux de prélèvements affiché ?",
        answer:
          "Il correspond au rapport entre le total des cotisations + CSG/CRDS et le salaire brut. Plus il est élevé, moins le net représente une part importante du brut.",
      },
      {
        question: "Les cadres paient-ils plus de cotisations ?",
        answer:
          "En général oui : le taux global peut atteindre 25 à 28 % pour les cadres, notamment en raison de cotisations retraite complémentaire plus élevées.",
      },
      {
        question: "La CSG est-elle déductible de l'impôt ?",
        answer:
          "Une partie de la CSG (6,8 % sur l'assiette) est déductible du revenu imposable l'année suivante. Le simulateur ne calcule pas ce mécanisme.",
      },
      {
        question: "Comment vérifier si mon bulletin est cohérent ?",
        answer:
          "Repérez le net à payer avant impôt sur votre fiche de paie et comparez-le au résultat du simulateur en ajustant le taux de cotisations si besoin.",
      },
      {
        question: "Les primes sont-elles incluses dans le brut ?",
        answer:
          "Si vous saisissez un brut incluant primes mensuelles, oui. Pour une prime annuelle isolée, calculez-la à part ou répartissez-la sur 12 mois.",
      },
      {
        question: "Quelles erreurs éviter lors du calcul brut/net ?",
        answer:
          "Confondre net avant et net après impôt, oublier la CSG/CRDS, ou appliquer un taux cadre à un poste non cadre.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Calcul simplifié sans détail ligne par ligne. Pour une simulation officielle complète, consultez votre service RH ou un simulateur URSSAF.",
      },
    ],
  },

  "salaire-net-brut": {
    intro:
      "Déterminez le salaire brut à inscrire sur un contrat ou à négocier pour obtenir le net mensuel que vous souhaitez percevoir.",
    definition:
      "Le calcul net vers brut (ou brut inverse) consiste à retrouver la rémunération brute contractuelle correspondant à un net cible, en tenant compte des cotisations sociales salariales et de la CSG/CRDS.",
    objectif:
      "Préparer une négociation salariale, estimer le coût pour l'employeur ou vérifier qu'une promesse de « 2 000 € net » correspond bien à un certain brut.",
    variables: [
      "Salaire net mensuel visé (€)",
      "Taux global de cotisations salariales (%)",
    ],
    formule:
      "Brut recherché tel que : Net = Brut − Cotisations − CSG/CRDS ≈ Net visé. Résolution par itération numérique.",
    formuleDetail:
      "Le simulateur ajuste le brut jusqu'à ce que le net recalculé corresponde au net visé, en appliquant la même formule que le simulateur brut/net.",
    interpretation: [
      "Le brut obtenu est supérieur au net visé : l'écart représente les prélèvements sociaux.",
      "Pour 2 000 € net, comptez environ 2 900 € de brut avec un taux de 22 % — soit près de 45 % de charges sur le net.",
      "Utilisez ce résultat comme base de discussion, pas comme engagement contractuel sans bulletin officiel.",
    ],
    limitesCalcul: [
      "Itération simplifiée — écart résiduel possible de quelques centimes.",
      "Ne tient pas compte du plafond de la Sécurité sociale ni des tranches spécifiques.",
      "Prélèvement à la source non intégré au net visé.",
    ],
    example: {
      title: "Obtenir 2 000 € net avec 22 % de cotisations",
      donnees: [
        "Net mensuel visé : 2 000 €",
        "Cotisations salariales : 22 %",
      ],
      calcul: [
        "Estimation initiale : 2 000 ÷ 0,77 ≈ 2 597 €",
        "Ajustements successifs jusqu'à convergence",
        "Brut trouvé ≈ 2 900 €",
        "Net recalculé ≈ 2 000 € (vérification)",
      ],
      resultat: "Salaire brut nécessaire : environ 2 900 €/mois — soit 34 800 € brut annuel.",
      interpretation:
        "Pour garantir 2 000 € net avant impôt, l'employeur doit afficher environ 2 900 € brut. Pensez à ajouter le coût des charges patronales pour le budget employeur.",
    },
    maillage: [
      { slug: "salaire-brut-net", label: "Salaire brut en net" },
      { slug: "cout-total-embauche-salarie", label: "Coût total d'embauche" },
      { slug: "salaire-temps-partiel", label: "Salaire temps partiel" },
    ],
    conseils: [
      "Lors d'un entretien, parlez d'abord en brut pour éviter les malentendus.",
      "Demandez toujours le détail des cotisations si l'employeur communique en net.",
      "Ajoutez 10 à 15 % au brut trouvé si vous visez un net après impôt moyen.",
      "Croisez avec le simulateur de coût employeur pour une vision complète.",
    ],
    limites: [
      "Estimation indicative pour la négociation.",
      "Le contrat de travail mentionne le brut, pas le net.",
      "Cas atypiques (temps partiel, multiples employeurs) nécessitent un calcul dédié.",
    ],
    faq: [
      {
        question: "Pourquoi convertir un net en brut ?",
        answer:
          "Les contrats de travail et les grilles salariales sont exprimés en brut. Connaître le brut équivalent permet de négocier correctement ou de comparer des offres.",
      },
      {
        question: "Comment le simulateur trouve-t-il le brut ?",
        answer:
          "Par itération : il teste différents montants brut jusqu'à ce que le net calculé corresponde au net visé, en appliquant cotisations et CSG/CRDS.",
      },
      {
        question: "2 000 € net correspond à combien de brut ?",
        answer:
          "Avec environ 22 % de cotisations salariales, comptez aux alentours de 2 900 € brut mensuel. Le montant exact dépend du taux saisi.",
      },
      {
        question: "Le net visé inclut-il l'impôt ?",
        answer:
          "Non, le simulateur cible le net avant prélèvement à la source. Si vous voulez 2 000 € « sur le compte » après impôt, il faudra viser un net avant impôt plus élevé.",
      },
      {
        question: "Puis-je utiliser ce simulateur pour une augmentation ?",
        answer:
          "Oui. Si vous souhaitez gagner 200 € net de plus par mois, calculez le brut correspondant et présentez-le en négociation.",
      },
      {
        question: "Pourquoi le net recalculé diffère-t-il légèrement du net visé ?",
        answer:
          "L'algorithme converge par approximation. L'écart est généralement inférieur à 1 € et n'a pas d'impact pratique.",
      },
      {
        question: "Les cadres doivent-ils modifier le taux de cotisations ?",
        answer:
          "Oui, augmentez le taux à 25-28 % pour une estimation plus réaliste du brut nécessaire pour un cadre.",
      },
      {
        question: "Comment vérifier le résultat ?",
        answer:
          "Utilisez le simulateur brut/net inverse avec le brut trouvé : vous devez retrouver votre net visé.",
      },
      {
        question: "L'employeur paie-t-il le même montant que le brut ?",
        answer:
          "Non. En plus du brut, l'employeur paie des charges patronales (≈ 42 %). Consultez le simulateur de coût d'embauche.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Modèle simplifié sans prise en compte des avantages, tickets restaurant ou mutuelle. Pour un cas complexe, consultez un expert paie.",
      },
    ],
  },

  "cout-total-embauche-salarie": {
    intro:
      "Visualisez le coût réel mensuel et annuel d'un salarié pour l'employeur, au-delà du seul salaire brut affiché sur le contrat.",
    definition:
      "Le coût total employeur (ou super-brut) comprend le salaire brut versé au salarié plus l'ensemble des charges patronales : cotisations sociales, contributions formation, taxe d'apprentissage, etc.",
    objectif:
      "Budgétiser une embauche, dimensionner la masse salariale d'une TPE/PME ou comprendre l'écart entre le salaire perçu et le coût réel pour l'entreprise.",
    variables: [
      "Salaire brut mensuel du salarié (€)",
      "Taux global de charges patronales (%)",
    ],
    formule:
      "Coût employeur mensuel = Salaire brut × (1 + Taux patronal / 100).",
    formuleDetail:
      "Charges patronales = Salaire brut × Taux patronal. En moyenne, comptez environ 42 % de charges pour un non-cadre en France.",
    interpretation: [
      "Un salarié à 2 500 € brut coûte environ 3 550 €/mois à l'employeur avec 42 % de charges.",
      "Le taux patronal varie selon le statut (cadre/non-cadre), la rémunération et les exonérations applicables.",
      "Le coût annuel = coût mensuel × 12, hors primes, indemnités et avantages.",
    ],
    limitesCalcul: [
      "Taux patronal saisi manuellement — pas de décomposition URSSAF ligne par ligne.",
      "Exonérations (apprenti, ZRR, Lodeom…) non modélisées.",
      "Primes, tickets restaurant et mutuelle non inclus.",
    ],
    example: {
      title: "Embauche d'un non-cadre à 2 500 € brut",
      donnees: [
        "Salaire brut mensuel : 2 500 €",
        "Charges patronales : 42 %",
      ],
      calcul: [
        "Charges patronales = 2 500 × 42 % = 1 050 €",
        "Coût mensuel = 2 500 + 1 050 = 3 550 €",
        "Coût annuel = 3 550 × 12 = 42 600 €",
      ],
      resultat: "Coût employeur : 3 550 €/mois — soit 42 600 €/an hors primes.",
      interpretation:
        "Pour chaque euro de brut versé, l'employeur dépense environ 1,42 €. Intégrez cette marge dans votre seuil de rentabilité ou votre business plan.",
    },
    maillage: [
      { slug: "salaire-brut-net", label: "Salaire brut en net" },
      { slug: "salaire-net-brut", label: "Salaire net en brut" },
      { slug: "break-even-entreprise", label: "Seuil de rentabilité entreprise" },
    ],
    conseils: [
      "Prévoyez une marge de 40 à 45 % au-dessus du brut pour estimer le coût employeur.",
      "Vérifiez les éventuelles exonérations avant de budgétiser (apprenti, premier emploi).",
      "Incluez les coûts indirects : recrutement, formation, équipement.",
      "Simulez plusieurs scénarios de rémunération avant de publier une offre.",
    ],
    limites: [
      "Estimation moyenne — le taux exact dépend de votre structure et de la convention collective.",
      "Ne remplace pas une simulation URSSAF ou un audit social.",
      "Cas internationaux et détachements non couverts.",
    ],
    faq: [
      {
        question: "Qu'est-ce que le coût total employeur ?",
        answer:
          "C'est la somme du salaire brut et des charges patronales payées par l'entreprise à l'URSSAF et aux organismes sociaux. C'est le vrai coût d'un salarié.",
      },
      {
        question: "Pourquoi 42 % de charges patronales ?",
        answer:
          "C'est une moyenne courante pour un salarié non cadre. Le taux peut varier de 35 à 50 % selon la rémunération, le statut et les exonérations.",
      },
      {
        question: "Le salarié paie-t-il les charges patronales ?",
        answer:
          "Non. Les charges patronales sont intégralement supportées par l'employeur et ne sont pas déduites du salaire du salarié.",
      },
      {
        question: "Comment calculer le coût annuel d'un salarié ?",
        answer:
          "Multipliez le coût mensuel total par 12. Ajoutez les primes annuelles, avantages et coûts indirects pour une vision complète.",
      },
      {
        question: "Les cadres coûtent-ils plus cher ?",
        answer:
          "Le taux de charges patronales peut être légèrement différent, mais l'impact principal vient du salaire brut plus élevé. Le ratio reste comparable.",
      },
      {
        question: "Les exonérations réduisent-elles le coût ?",
        answer:
          "Oui. Les apprentis, certains contrats aidés et les réductions spécifiques diminuent le taux effectif. Ce simulateur ne les intègre pas.",
      },
      {
        question: "Comment utiliser ce simulateur pour un budget RH ?",
        answer:
          "Multipliez le coût mensuel par le nombre de salariés et par 12 pour estimer la masse salariale annuelle de base.",
      },
      {
        question: "Le coût inclut-il la mutuelle et les tickets restaurant ?",
        answer:
          "Non. Ces avantages s'ajoutent au coût employeur. Comptez 50 à 150 €/mois supplémentaires selon les dispositifs.",
      },
      {
        question: "Quelle différence avec le super-brut ?",
        answer:
          "Le super-brut est synonyme de coût total employeur : brut + charges patronales. Certains y ajoutent les avantages en nature.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Taux moyen saisi manuellement, sans détail URSSAF. Pour une simulation officielle, utilisez le simulateur URSSAF en ligne.",
      },
    ],
  },

  "indemnites-licenciement": {
    intro:
      "Estimez l'indemnité légale minimale de licenciement due par l'employeur selon votre ancienneté et votre salaire brut de référence.",
    definition:
      "L'indemnité légale de licenciement est une somme versée au salarié licencié pour insuffisance professionnelle ou motif économique. Elle est calculée en fonction de l'ancienneté et du salaire de référence (généralement la moyenne des 12 derniers mois).",
    objectif:
      "Anticiper l'indemnité minimale due, préparer votre budget en cas de rupture ou comparer avec une indemnité conventionnelle potentiellement plus favorable.",
    variables: [
      "Salaire brut mensuel de référence (€)",
      "Ancienneté dans l'entreprise (années)",
    ],
    formule:
      "Si ancienneté ≥ 8 mois : 1/4 de mois par année jusqu'à 10 ans, puis 1/3 de mois par année au-delà.",
    formuleDetail:
      "Indemnité = (Salaire / 4) × min(années, 10) + (Salaire / 3) × max(0, années − 10). Si ancienneté < 8 mois : 0 €.",
    interpretation: [
      "Avec 5 ans d'ancienneté et 2 800 € brut, l'indemnité légale est de 3 500 € soit 1,25 mois de salaire.",
      "La convention collective ou un accord d'entreprise peut prévoir une indemnité supérieure au minimum légal.",
      "L'indemnité légale est exonérée d'impôt dans certaines limites ; au-delà, elle peut être imposable.",
    ],
    limitesCalcul: [
      "Cas de faute grave, faute lourde ou départ négocié exclus.",
      "Salaire de référence simplifié (saisie manuelle, pas de moyenne 12 mois automatique).",
      "Indemnité de mise à la retraite et ruptures conventionnelles non couvertes.",
    ],
    example: {
      title: "Licenciement après 5 ans avec 2 800 € brut mensuel",
      donnees: [
        "Salaire brut de référence : 2 800 €",
        "Ancienneté : 5 ans",
      ],
      calcul: [
        "Années ≤ 10 ans → taux 1/4 de mois par année",
        "Indemnité = (2 800 / 4) × 5",
        "Indemnité = 700 × 5 = 3 500 €",
        "Équivalent : 3 500 / 2 800 = 1,25 mois de salaire",
      ],
      resultat: "Indemnité légale estimée : 3 500 € — soit 1,25 mois de salaire brut.",
      interpretation:
        "C'est le minimum légal. Vérifiez votre convention collective : elle peut prévoir 1,5 ou 2 mois par année. Ajoutez le solde de congés payés et l'éventuelle indemnité compensatrice de préavis.",
    },
    maillage: [
      { slug: "allocation-chomage-are", label: "Allocation chômage ARE" },
      { slug: "conges-payes-acquis", label: "Congés payés acquis" },
      { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
    ],
    conseils: [
      "Consultez votre convention collective avant tout — elle fixe souvent des minima supérieurs.",
      "Demandez le détail du salaire de référence retenu par l'employeur (12 ou 3 derniers mois).",
      "L'indemnité légale s'ajoute au solde de tout compte et aux congés non pris.",
      "En cas de litige, saisissez le conseil de prud'hommes dans les délais légaux.",
    ],
    limites: [
      "Estimation du minimum légal uniquement.",
      "Ne remplace pas un avocat en droit du travail.",
      "Cas particuliers (inaptitude, CDD, portage) nécessitent une analyse spécifique.",
    ],
    faq: [
      {
        question: "Qui a droit à une indemnité de licenciement ?",
        answer:
          "Le salarié en CDI licencié pour motif personnel (hors faute grave/lourde) ou économique, avec au moins 8 mois d'ancienneté, sauf dispositions conventionnelles plus favorables.",
      },
      {
        question: "Comment est calculée l'indemnité légale ?",
        answer:
          "1/4 de mois de salaire par année d'ancienneté jusqu'à 10 ans, puis 1/3 de mois par année au-delà de 10 ans, sur la base du salaire de référence.",
      },
      {
        question: "Quel salaire de référence utiliser ?",
        answer:
          "En principe, la moyenne des 12 derniers mois de salaire brut, ou des 3 derniers mois si plus favorable. Le simulateur utilise un montant saisi manuellement.",
      },
      {
        question: "L'indemnité est-elle imposable ?",
        answer:
          "L'indemnité légale ou conventionnelle est exonérée dans la limite légale. La part excédentaire peut être imposable. Consultez un conseiller fiscal.",
      },
      {
        question: "Que se passe-t-il si j'ai moins de 8 mois d'ancienneté ?",
        answer:
          "L'indemnité légale de licenciement est nulle. Vous pouvez toutefois percevoir d'autres sommes (congés, salaire dû) et éventuellement une indemnité conventionnelle.",
      },
      {
        question: "La convention collective peut-elle être plus favorable ?",
        answer:
          "Oui, et c'est fréquent. L'indemnité due est le maximum entre le legal et le conventionnel. Vérifiez votre IDCC.",
      },
      {
        question: "L'indemnité de licenciement ouvre-t-elle droit au chômage ?",
        answer:
          "Le licenciement ouvre droit à l'ARE si vous remplissez les conditions d'affiliation et de recherche d'emploi. L'indemnité n'est pas un critère d'éligibilité.",
      },
      {
        question: "Comment calculer pour plus de 10 ans d'ancienneté ?",
        answer:
          "Appliquez 1/4 de mois pour les 10 premières années, puis 1/3 de mois pour chaque année supplémentaire. Exemple : 12 ans = 2,5 mois + 2/3 mois.",
      },
      {
        question: "La rupture conventionnelle donne-t-elle la même indemnité ?",
        answer:
          "Non. La rupture conventionnelle a sa propre indemnité minimale (légale ou conventionnelle selon le cas). Ce simulateur ne la calcule pas.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Minimum légal simplifié, hors faute grave, inaptitude et cas spécifiques. Pour une estimation précise, consultez un professionnel du droit du travail.",
      },
    ],
  },

  "conges-payes-acquis": {
    intro:
      "Calculez le nombre de jours ouvrables de congés payés acquis sur une période de référence selon la durée effective de travail.",
    definition:
      "Les congés payés sont un droit à repos rémunéré acquis au rythme de 2,5 jours ouvrables par mois travaillé (30 jours ouvrables par an, soit 5 semaines). L'acquisition dépend du temps de travail effectif, pas du temps calendaire.",
    objectif:
      "Vérifier combien de jours de CP vous avez acquis en cours d'année, anticiper vos vacances ou contrôler le solde indiqué sur votre bulletin.",
    variables: [
      "Nombre de mois travaillés sur la période",
      "Jours acquis par mois (2,5 en droit commun)",
    ],
    formule:
      "Jours ouvrables acquis = Mois travaillés × Jours acquis par mois.",
    formuleDetail:
      "Équivalent semaines = Jours acquis ÷ 6 (car 6 jours ouvrables = 1 semaine de congés en comptabilité CP). Plafond annuel : 30 jours ouvrables.",
    interpretation: [
      "10 mois travaillés × 2,5 j/mois = 25 jours ouvrables acquis, soit environ 4,2 semaines.",
      "Un temps partiel acquiert les mêmes droits proportionnellement au temps travaillé.",
      "Les jours acquis doivent être pris dans la période de prise (generally 1er juin au 31 mai).",
    ],
    limitesCalcul: [
      "Pas de gestion du report ni de la fraction de mois (< 1 mois).",
      "Jours ouvrables uniquement — pas de conversion en jours ouvrés.",
      "Dispositions conventionnelles plus favorables non intégrées automatiquement.",
    ],
    example: {
      title: "Salarié ayant travaillé 10 mois sur la période",
      donnees: [
        "Mois travaillés : 10",
        "Taux d'acquisition : 2,5 jours/mois",
      ],
      calcul: [
        "Jours acquis = 10 × 2,5 = 25 jours ouvrables",
        "Équivalent semaines = 25 ÷ 6 ≈ 4,2 semaines",
        "Plafond restant sur l'année = 30 − 25 = 5 jours max. supplémentaires",
      ],
      resultat: "Congés acquis : 25 jours ouvrables — environ 4,2 semaines.",
      interpretation:
        "Vous disposez de 25 jours à poser dans la période de prise. Vérifiez sur votre bulletin le solde CP N et N-1 pour planifier vos vacances.",
    },
    maillage: [
      { slug: "salaire-temps-partiel", label: "Salaire temps partiel" },
      { slug: "ijss-arret-maladie", label: "IJSS arrêt maladie" },
      { slug: "heures-supplementaires", label: "Heures supplémentaires" },
    ],
    conseils: [
      "Consultez régulièrement le compteur CP sur votre bulletin de paie.",
      "Les jours de maladie n'interrompent pas l'acquisition des congés (sous conditions).",
      "Planifiez vos congés en tenant compte de la période de prise (juin-mai).",
      "Certaines conventions prévoient des jours supplémentaires (ancienneté, fractionnement).",
    ],
    limites: [
      "Calcul simplifié du droit commun.",
      "Ne gère pas le report, la supplémentaire de fractionnement ni les jours RTT.",
      "Pour un litige, référez-vous à votre service RH et à la convention collective.",
    ],
    faq: [
      {
        question: "Combien de congés payés acquiert-on par mois ?",
        answer:
          "2,5 jours ouvrables par mois travaillé en droit commun, soit 30 jours ouvrables (5 semaines) sur une année complète.",
      },
      {
        question: "Quelle différence entre jours ouvrables et ouvrés ?",
        answer:
          "Les jours ouvrables incluent le samedi (6 jours/semaine). Les jours ouvrés excluent le samedi (5 jours/semaine). 30 jours ouvrables = 25 jours ouvrés.",
      },
      {
        question: "Le temps partiel acquiert-il autant de congés ?",
        answer:
          "Oui, proportionnellement au temps travaillé. Un mi-temps acquiert aussi 2,5 jours/mois s'il travaille tous les jours ouvrables de la semaine.",
      },
      {
        question: "Un arrêt maladie bloque-t-il l'acquisition ?",
        answer:
          "Non, en principe l'acquisition continue pendant un arrêt maladie non professionnel (sous conditions de durée). Vérifiez votre convention.",
      },
      {
        question: "Peut-on reporter des congés non pris ?",
        answer:
          "Le report est limité : au maximum 6 jours ouvrables (1 semaine) au-delà de la période légale, sous conditions et accord de l'employeur.",
      },
      {
        question: "Qu'est-ce que la période de référence ?",
        answer:
          "Du 1er juin au 31 mai : période pendant laquelle les congés s'acquièrent. La période de prise est généralement la même, avec possibilité de report.",
      },
      {
        question: "Comment lire le solde CP sur mon bulletin ?",
        answer:
          "Repérez les lignes CP N (année en cours) et CP N-1 (année précédente). Le solde indique les jours acquis moins les jours pris.",
      },
      {
        question: "Les jours fériés comptent-ils dans les congés ?",
        answer:
          "Un jour férié sur un jour de CP ne consomme pas de jour de congé supplémentaire s'il tombe un jour habituellement travaillé.",
      },
      {
        question: "Peut-on être payé à la place des congés non pris ?",
        answer:
          "Seule l'indemnité compensatrice de congés payés (à la rupture du contrat) permet un paiement. En cours de contrat, le salarié doit pouvoir prendre ses congés.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Calcul basique sans gestion du report, RTT ou jours conventionnels supplémentaires. Pour le solde exact, consultez votre bulletin.",
      },
    ],
  },

  "ijss-arret-maladie": {
    intro:
      "Anticipez le montant des indemnités journalières versées par l'Assurance maladie (IJSS) pendant un arrêt de travail pour maladie.",
    definition:
      "Les IJSS (Indemnités Journalières de Sécurité Sociale) compensent partiellement la perte de salaire pendant un arrêt maladie. Elles sont calculées à 50 % du salaire journalier de base, dans la limite d'un plafond légal.",
    objectif:
      "Estimer votre revenu de substitution pendant un arrêt, compléter avec la subrogation employeur ou ajuster votre budget en cas d'incapacité temporaire.",
    variables: [
      "Salaire brut mensuel de référence (€)",
      "Nombre de jours d'arrêt indemnisés (hors carence)",
    ],
    formule:
      "IJSS journalière = min(50 % × Salaire journalier brut, 50 % × Plafond journalier), avec Salaire journalier = Brut × 12 / 365.",
    formuleDetail:
      "Plafond journalier ≈ 1,8 × SMIC journalier. Carence standard : 3 jours non indemnisés au début de l'arrêt (non comptés dans le simulateur).",
    interpretation: [
      "Pour 2 500 € brut, l'IJSS est plafonnée à environ 12 €/jour — bien en deçà de 50 % du salaire réel.",
      "L'employeur peut compléter les IJSS (subrogation) selon la convention collective ou l'usage.",
      "Les IJSS sont imposables et soumises aux cotisations sociales.",
    ],
    limitesCalcul: [
      "Carence de 3 jours non déduite automatiquement du total affiché.",
      "Arrêt maladie professionnel ou maternité non couverts.",
      "Plafond SMIC simplifié — pas de prise en compte des 3 derniers salaires.",
    ],
    example: {
      title: "Arrêt de 15 jours avec 2 500 € brut mensuel",
      donnees: [
        "Salaire brut mensuel : 2 500 €",
        "Jours indemnisés (hors carence) : 15",
      ],
      calcul: [
        "Salaire journalier = 2 500 × 12 / 365 ≈ 82,19 €",
        "50 % du journalier = 41,10 € — mais plafonné",
        "Plafond IJSS ≈ 12,06 €/jour",
        "Total = 12,06 × 15 ≈ 181 €",
      ],
      resultat: "IJSS estimées : 12 €/jour — total 181 € sur 15 jours indemnisés.",
      interpretation:
        "Le plafond limite fortement les IJSS pour les salaires moyens. Vérifiez si votre employeur maintient tout ou partie du salaire (subrogation) via la convention collective.",
    },
    maillage: [
      { slug: "allocation-chomage-are", label: "Allocation chômage ARE" },
      { slug: "conges-payes-acquis", label: "Congés payés acquis" },
      { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
    ],
    conseils: [
      "Déclarez votre arrêt à l'Assurance maladie dans les 48 heures.",
      "Vérifiez les droits à subrogation dans votre convention collective.",
      "Les 3 premiers jours sont en carence : prévoyez une réserve budgétaire.",
      "Conservez l'arrêt de travail original et suivez votre espace ameli.fr.",
    ],
    limites: [
      "Estimation simplifiée — l'Assurance maladie calcule le montant exact.",
      "Ne remplace pas l'information de votre CPAM ou de votre employeur.",
      "Cas longue durée, ALD et accident du travail exclus.",
    ],
    faq: [
      {
        question: "Qu'est-ce que les IJSS ?",
        answer:
          "Ce sont les Indemnités Journalières de Sécurité Sociale versées par l'Assurance maladie pour compenser la perte de salaire pendant un arrêt maladie, sous conditions.",
      },
      {
        question: "Comment sont calculées les IJSS maladie ?",
        answer:
          "À 50 % du salaire journalier moyen des 3 derniers mois, plafonné. Notre simulateur utilise une formule simplifiée avec plafond SMIC.",
      },
      {
        question: "Qu'est-ce que la carence de 3 jours ?",
        answer:
          "Les 3 premiers jours d'arrêt ne sont pas indemnisés par la Sécu (sauf exceptions). L'employeur ou la convention peut les couvrir.",
      },
      {
        question: "Pourquoi mon IJSS est-elle si faible ?",
        answer:
          "Le plafond légal limite les IJSS à environ 50 % d'un salaire plafonné proche de 1,8 SMIC journalier. Au-delà, le taux effectif baisse.",
      },
      {
        question: "L'employeur complète-t-il les IJSS ?",
        answer:
          "Souvent oui, via la subrogation ou un maintien de salaire prévu par la convention collective. Vérifiez votre accord d'entreprise.",
      },
      {
        question: "Les IJSS sont-elles imposables ?",
        answer:
          "Oui. Elles entrent dans le revenu imposable et sont soumises aux cotisations sociales (CSG/CRDS notamment).",
      },
      {
        question: "Combien de temps dure le versement des IJSS ?",
        answer:
          "Jusqu'à 360 jours sur 3 ans en arrêt maladie standard, sous réserve de justificatifs médicaux. Au-delà, d'autres dispositifs peuvent s'appliquer.",
      },
      {
        question: "Dois-je envoyer mon arrêt à l'employeur ?",
        answer:
          "Oui, transmettez l'original ou la copie selon les consignes de votre entreprise. L'employeur transmet à la CPAM pour le versement.",
      },
      {
        question: "Quelle différence avec un arrêt maladie professionnel ?",
        answer:
          "L'accident du travail ou la maladie professionnelle ouvre droit à des indemnités à 60 puis 80 % du salaire, sans carence de 3 jours. Ce simulateur ne les couvre pas.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Formule simplifiée avec plafond moyen. Pour le montant exact, consultez ameli.fr ou votre bulletin de salaire en arrêt.",
      },
    ],
  },

  "allocation-chomage-are": {
    intro:
      "Obtenez une estimation de votre Allocation d'Aide au Retour à l'Emploi (ARE) avant de lancer la simulation officielle sur France Travail.",
    definition:
      "L'ARE est l'allocation chômage versée par France Travail (ex-Pôle emploi) aux demandeurs d'emploi indemnisables. Elle est calculée à partir du salaire journalier de référence des 12 derniers mois, avec un taux et un plafond légaux.",
    objectif:
      "Anticiper vos revenus en cas de perte d'emploi, compléter une indemnité de licenciement ou préparer votre budget pendant la recherche d'emploi.",
    variables: [
      "Dernier salaire brut mensuel (€)",
      "Jours indemnisés par mois (≈ 30 jours calendaires)",
    ],
    formule:
      "ARE journalière = min(57 % × Salaire journalier brut, Plafond ARE), avec Salaire journalier = Brut × 12 / 365.",
    formuleDetail:
      "Plafond simplifié ≈ 57 % × SMIC journalier × 4,5. ARE mensuelle = ARE journalière × jours indemnisés par mois.",
    interpretation: [
      "Avec 2 600 € brut, l'ARE est plafonnée à environ 34 €/jour soit ~1 032 €/mois.",
      "La durée d'indemnisation dépend de l'âge, de l'ancienneté et du nombre de jours travaillés sur 24 ou 36 mois.",
      "L'ARE diminue si vous reprenez un emploi ou exercez une activité réduite (règles de cumul).",
    ],
    limitesCalcul: [
      "Taux fixe 57 % simplifié — le taux réel peut être 40,4 % ou 57 % selon le profil.",
      "Durée d'indemnisation et conditions d'affiliation non calculées.",
      "Cumul emploi/chômage et dégressivité non modélisés.",
    ],
    example: {
      title: "Ancien salaire de 2 600 € brut, indemnisation sur 30 jours/mois",
      donnees: [
        "Dernier salaire brut mensuel : 2 600 €",
        "Jours indemnisés par mois : 30",
      ],
      calcul: [
        "Salaire journalier = 2 600 × 12 / 365 ≈ 85,48 €",
        "57 % du journalier = 48,72 € — mais plafonné",
        "ARE journalière plafonnée ≈ 34,39 €",
        "ARE mensuelle = 34,39 × 30 ≈ 1 032 €",
      ],
      resultat: "ARE estimée : 34 €/jour — environ 1 032 €/mois.",
      interpretation:
        "Le plafond réduit l'ARE pour les salaires moyens et élevés. Vérifiez la durée d'indemnisation sur votre espace France Travail et anticipez une baisse après 6 mois si vous avez moins de 53 ans.",
    },
    maillage: [
      { slug: "indemnites-licenciement", label: "Indemnités de licenciement" },
      { slug: "salaire-brut-net", label: "Salaire brut en net" },
      { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
    ],
    conseils: [
      "Inscrivez-vous à France Travail dès le lendemain de la fin de contrat.",
      "Conservez tous vos bulletins de salaire des 12 derniers mois.",
      "Actualisez votre situation chaque mois pour éviter une suspension.",
      "Renseignez-vous sur le cumul ARE + activité si vous reprenez un emploi partiel.",
    ],
    limites: [
      "Estimation grossière — seule la simulation France Travail fait foi.",
      "Conditions d'affiliation (4 mois de travail sur 24 mois) non vérifiées.",
      "ARE dégressive et plancher non intégrés.",
    ],
    faq: [
      {
        question: "Qu'est-ce que l'ARE ?",
        answer:
          "L'Allocation d'Aide au Retour à l'Emploi est le nom officiel de l'allocation chômage versée par France Travail aux demandeurs d'emploi indemnisables.",
      },
      {
        question: "Comment est calculée l'ARE ?",
        answer:
          "À partir du salaire journalier de référence (moyenne des salaires bruts des 12 derniers mois), un taux de 40,4 % ou 57 % est appliqué, dans la limite d'un plafond.",
      },
      {
        question: "Pourquoi mon ARE est-elle plafonnée ?",
        answer:
          "Un plafond légal limite l'ARE même pour les hauts salaires. Au-delà d'un certain niveau, l'allocation ne progresse plus.",
      },
      {
        question: "Combien de temps dure l'ARE ?",
        answer:
          "De 6 à 24 mois selon l'âge et l'ancienneté. Les moins de 53 ans voient souvent une dégressivité après 6 mois si le salaire de référence dépasse 1,4 SMIC.",
      },
      {
        question: "Quelles conditions pour toucher le chômage ?",
        answer:
          "Avoir travaillé au moins 4 mois (130 jours) sur les 24 ou 36 derniers mois, être involontairement privé d'emploi et rechercher activement un emploi.",
      },
      {
        question: "L'ARE est-elle imposable ?",
        answer:
          "Oui, l'ARE est imposable au revenu. Elle est soumise au prélèvement à la source comme un salaire.",
      },
      {
        question: "Peut-on cumuler ARE et emploi ?",
        answer:
          "Oui, partiellement. Si vous reprenez un emploi à temps partiel, l'ARE est réduite mais peut compléter vos revenus selon des règles de cumul.",
      },
      {
        question: "L'indemnité de licenciement impacte-t-elle l'ARE ?",
        answer:
          "L'indemnité légale ou conventionnelle de licenciement n'est en principe pas déduite. D'autres indemnités peuvent l'être (préavis non effectué payé, etc.).",
      },
      {
        question: "Comment obtenir une simulation officielle ?",
        answer:
          "Connectez-vous sur francetravail.fr avec votre identifiant. Le simulateur officiel calcule le montant et la durée exacts.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Taux et plafond simplifiés, sans durée ni conditions d'éligibilité. Utilisez-le comme ordre de grandeur uniquement.",
      },
    ],
  },

  "heures-supplementaires": {
    intro:
      "Estimez la rémunération brute des heures supplémentaires effectuées au-delà de la durée légale du travail, avec les majorations légales.",
    definition:
      "Les heures supplémentaires sont les heures travaillées au-delà de 35 h par semaine (ou de la durée conventionnelle). Elles donnent droit à une majoration de salaire : 25 % pour les 8 premières heures, puis 50 % au-delà.",
    objectif:
      "Anticiper le supplément de paie mensuel, vérifier un bulletin ou évaluer l'intérêt financier d'heures supplémentaires.",
    variables: [
      "Taux horaire brut (€/h)",
      "Nombre d'heures supplémentaires du mois (h)",
    ],
    formule:
      "Rémunération HS = (min(HS, 8) × Taux × 1,25) + (max(0, HS − 8) × Taux × 1,50).",
    formuleDetail:
      "Les 8 premières heures sup du mois sont majorées de 25 %. Au-delà de 8 h sup, la majoration passe à 50 %. Le taux horaire = salaire brut mensuel ÷ heures mensuelles.",
    interpretation: [
      "10 heures sup à 16 €/h brut : 8 h × 16 × 1,25 = 160 € + 2 h × 16 × 1,50 = 48 € → 208 € brut.",
      "Les heures sup sont soumises aux cotisations sociales comme le salaire normal.",
      "Certaines conventions prévoient des majorations plus favorables ou un contingent annuel.",
    ],
    limitesCalcul: [
      "Majorations légales minimales — convention collective non intégrée.",
      "Repos compensateur de remplacement (RCR) non modélisé.",
      "Contingent annuel de 220 h et autorisation préalable non vérifiés.",
    ],
    example: {
      title: "10 heures sup à 16 €/h brut",
      donnees: [
        "Taux horaire brut : 16 €/h",
        "Heures supplémentaires du mois : 10 h",
      ],
      calcul: [
        "Heures à 25 % : min(10, 8) = 8 h",
        "Montant 25 % = 8 × 16 × 1,25 = 160 €",
        "Heures à 50 % : 10 − 8 = 2 h",
        "Montant 50 % = 2 × 16 × 1,50 = 48 €",
        "Total = 160 + 48 = 208 €",
      ],
      resultat: "Rémunération heures sup : 208 € brut pour 10 heures.",
      interpretation:
        "Ce montant s'ajoute à votre salaire de base du mois. Après cotisations (~22 %), le net des heures sup est inférieur au brut affiché.",
    },
    maillage: [
      { slug: "salaire-brut-net", label: "Salaire brut en net" },
      { slug: "salaire-temps-partiel", label: "Salaire temps partiel" },
      { slug: "smic-net", label: "SMIC net mensuel" },
    ],
    conseils: [
      "Vérifiez le taux horaire sur votre bulletin : salaire brut ÷ heures mensuelles.",
      "Consultez votre convention pour des majorations supérieures au minimum légal.",
      "Au-delà du contingent de 220 h/an, les heures sup peuvent être majorées différemment.",
      "Les heures sup ne remplacent pas une bonne gestion du temps de travail sur l'année.",
    ],
    limites: [
      "Calcul du minimum légal uniquement.",
      "Ne tient pas compte du repos compensateur ni des accords d'entreprise.",
      "Heures complémentaires (temps partiel) régies par d'autres règles.",
    ],
    faq: [
      {
        question: "Qu'est-ce qu'une heure supplémentaire ?",
        answer:
          "C'est une heure travaillée au-delà de la durée légale de 35 h par semaine (ou de la durée prévue au contrat), rémunérée avec une majoration.",
      },
      {
        question: "Quelles sont les majorations légales ?",
        answer:
          "+25 % pour les 8 premières heures supplémentaires, puis +50 % à partir de la 9e heure supplémentaire (dans le mois ou selon l'organisation retenue).",
      },
      {
        question: "Comment calculer mon taux horaire brut ?",
        answer:
          "Divisez votre salaire brut mensuel par le nombre d'heures mensuelles (souvent 151,67 h pour 35 h/semaine).",
      },
      {
        question: "Les heures sup sont-elles imposables ?",
        answer:
          "Oui, comme le reste du salaire. Elles sont soumises aux cotisations sociales et au prélèvement à la source.",
      },
      {
        question: "Qu'est-ce que le contingent annuel ?",
        answer:
          "220 heures supplémentaires par an et par salarié au-delà desquelles l'employeur peut refuser ou appliquer d'autres règles (contrepartie, repos).",
      },
      {
        question: "Heures sup ou repos compensateur ?",
        answer:
          "L'employeur peut, dans certains cas, remplacer tout ou partie de la majoration par un repos compensateur (RCR). Ce simulateur calcule la rémunération en argent.",
      },
      {
        question: "Les cadres peuvent-ils faire des heures sup ?",
        answer:
          "Les cadres au forfait jours ne sont en principe pas en heures sup. Les cadres au forfait heures ou non-cadres y sont soumis.",
      },
      {
        question: "Différence heures sup et heures complémentaires ?",
        answer:
          "Les heures complémentaires concernent les temps partiels (au-delà du contrat, dans la limite du temps plein). Les heures sup concernent le dépassement de 35 h.",
      },
      {
        question: "Comment vérifier sur mon bulletin ?",
        answer:
          "Repérez les lignes « heures sup 25 % » et « heures sup 50 % » avec le nombre d'heures et le montant associé.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Majorations légales minimales, sans convention collective ni RCR. Pour le montant exact, consultez votre bulletin de paie.",
      },
    ],
  },

  "salaire-temps-partiel": {
    intro:
      "Estimez le salaire brut et net en temps partiel en appliquant un prorata au salaire temps plein selon votre volume horaire hebdomadaire.",
    definition:
      "Le salaire temps partiel est calculé proportionnellement au temps de travail effectif par rapport à la durée légale (35 h/semaine). Un mi-temps (17,5 h) perçoit environ 50 % du salaire temps plein.",
    objectif:
      "Anticiper votre rémunération en cas de passage au temps partiel, comparer une offre mi-temps ou vérifier la cohérence d'un bulletin.",
    variables: [
      "Salaire brut temps plein 35 h (€)",
      "Heures travaillées par semaine (h)",
      "Taux de cotisations salariales (%)",
    ],
    formule:
      "Salaire brut TP = Salaire brut temps plein × (Heures hebdo / 35). Net = brut TP après cotisations et CSG/CRDS.",
    formuleDetail:
      "Ratio temps partiel = Heures hebdo ÷ 35. Exemple : 24 h/sem. = 68,6 % du temps plein. Le net est calculé avec la même formule que le simulateur brut/net.",
    interpretation: [
      "Avec 2 500 € brut temps plein et 24 h/semaine : brut ≈ 1 714 €, net ≈ 1 182 € (22 % cotisations).",
      "Le temps partiel ne doit pas descendre en dessous de 24 h/semaine sauf accord ou cas particuliers.",
      "Les droits aux congés payés restent identiques en jours acquis par mois travaillé.",
    ],
    limitesCalcul: [
      "Prorata simple — pas de gestion des heures complémentaires.",
      "SMIC horaire et égalité salariale non vérifiés automatiquement.",
      "Compléments conventionnels (heures majorées) non inclus.",
    ],
    example: {
      title: "24 h/semaine pour un poste à 2 500 € brut temps plein",
      donnees: [
        "Salaire brut temps plein (35 h) : 2 500 €",
        "Heures hebdomadaires : 24 h",
        "Cotisations salariales : 22 %",
      ],
      calcul: [
        "Ratio = 24 / 35 = 68,6 %",
        "Brut temps partiel = 2 500 × 68,6 % = 1 714 €",
        "Cotisations ≈ 377 €, CSG/CRDS ≈ 155 €",
        "Net ≈ 1 714 − 377 − 155 = 1 182 €",
      ],
      resultat: "Salaire temps partiel : 1 714 € brut — 1 182 € net estimé.",
      interpretation:
        "Travailler 24 h au lieu de 35 réduit le net d'environ 31 % (pas seulement 31 % du brut, car les cotisations restent proportionnelles). Vérifiez le respect du SMIC horaire.",
    },
    maillage: [
      { slug: "salaire-brut-net", label: "Salaire brut en net" },
      { slug: "heures-supplementaires", label: "Heures supplémentaires" },
      { slug: "smic-net", label: "SMIC net mensuel" },
    ],
    conseils: [
      "Vérifiez que votre rémunération horaire n'est pas inférieure au SMIC.",
      "Un passage au temps partiel nécessite un avenant au contrat de travail.",
      "Certaines conventions imposent un minimum d'heures (24 h/semaine en droit commun).",
      "Croisez avec le simulateur de reste à vivre pour valider la faisabilité budgétaire.",
    ],
    limites: [
      "Prorata linéaire sans heures complémentaires ni primes spécifiques.",
      "Ne vérifie pas le respect du SMIC horaire automatiquement.",
      "Cas de cumul emplois multiples non couverts.",
    ],
    faq: [
      {
        question: "Comment calculer un salaire temps partiel ?",
        answer:
          "Multipliez le salaire brut temps plein par le ratio heures travaillées / 35. Exemple : 20 h sur 35 h = 57,1 % du salaire temps plein.",
      },
      {
        question: "Quel est le minimum d'heures en temps partiel ?",
        answer:
          "En droit commun, 24 h/semaine sauf accord du salarié ou cas particuliers (étudiant, parent d'enfant). Vérifiez votre convention.",
      },
      {
        question: "Le temps partiel impacte-t-il les congés payés ?",
        answer:
          "Non, vous acquiérez toujours 2,5 jours ouvrables par mois travaillé. Seule la rémunération des congés est proratisée.",
      },
      {
        question: "Peut-on cumuler temps partiel et heures sup ?",
        answer:
          "Non au sens strict : on parle d'heures complémentaires pour un temps partiel, avec des majorations spécifiques (10 % ou 25 %).",
      },
      {
        question: "Le SMIC s'applique-t-il au temps partiel ?",
        answer:
          "Oui, le salaire horaire ne peut pas être inférieur au SMIC horaire, même en temps partiel.",
      },
      {
        question: "Comment passer de temps plein à temps partiel ?",
        answer:
          "Par avenant au contrat, sur demande du salarié (droit au temps partiel dans certains cas) ou accord mutuel. L'employeur ne peut pas imposer unilatéralement.",
      },
      {
        question: "Les cotisations sont-elles proportionnelles ?",
        answer:
          "Oui, les cotisations salariales et patronales sont calculées sur le salaire brut effectivement versé, donc proportionnellement réduites.",
      },
      {
        question: "Le temps partiel ouvre-t-il droit au chômage ?",
        answer:
          "Oui si vous perdez involontairement votre emploi et remplissez les conditions. L'ARE sera calculée sur vos salaires partiels.",
      },
      {
        question: "Comment lire mon bulletin en temps partiel ?",
        answer:
          "Vérifiez le nombre d'heures contractuelles, le taux horaire et le salaire de base proratisé. Comparez avec le ratio heures/35.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Prorata simple sans heures complémentaires, SMIC horaire ni primes. Pour un cas précis, consultez votre service RH.",
      },
    ],
  },

  "smic-net": {
    intro:
      "Calculez le salaire net mensuel correspondant au SMIC horaire brut en vigueur pour un temps plein de 35 heures par semaine.",
    definition:
      "Le SMIC (Salaire Minimum Interprofessionnel de Croissance) est le salaire horaire minimum légal. Pour un temps plein 35 h, le brut mensuel se calcule à partir du SMIC horaire × heures × 52/12.",
    objectif:
      "Comparer votre salaire au SMIC, vérifier qu'un temps partiel respecte le minimum légal ou estimer le net perçu au SMIC pour votre budget.",
    variables: [
      "SMIC horaire brut (€/h)",
      "Heures hebdomadaires (h)",
      "Taux de cotisations salariales (%)",
    ],
    formule:
      "SMIC brut mensuel = SMIC horaire × Heures hebdo × (52 / 12). Net = brut après cotisations et CSG/CRDS.",
    formuleDetail:
      "Le coefficient 52/12 convertit les heures hebdomadaires en équivalent mensuel. SMIC horaire 2025 : 11,65 €. Brut mensuel 35 h ≈ 1 767 €.",
    interpretation: [
      "Au SMIC 2025 (11,65 €/h, 35 h) : brut ≈ 1 767 €, net ≈ 1 218 € avant impôt.",
      "Un temps partiel doit respecter le SMIC horaire : le net sera proportionnellement plus bas.",
      "De nombreuses aides sociales utilisent le SMIC comme référence (plafonds, éligibilité).",
    ],
    limitesCalcul: [
      "SMIC horaire saisi manuellement — mettez à jour en cas de revalorisation.",
      "Prime d'activité, aides au logement et impôt non calculés.",
      "SMIC des apprentis et stagiaires non couverts.",
    ],
    example: {
      title: "SMIC 2025 à 11,65 €/h pour 35 h/semaine",
      donnees: [
        "SMIC horaire brut : 11,65 €",
        "Heures hebdomadaires : 35 h",
        "Cotisations salariales : 22 %",
      ],
      calcul: [
        "Heures mensuelles = 35 × 52 / 12 = 151,67 h",
        "Brut mensuel = 11,65 × 151,67 = 1 767 €",
        "Cotisations ≈ 389 €, CSG/CRDS ≈ 160 €",
        "Net = 1 767 − 389 − 160 = 1 218 €",
      ],
      resultat: "SMIC net estimé : 1 218 €/mois — brut 1 767 €.",
      interpretation:
        "Au SMIC temps plein, le net avant impôt tourne autour de 1 218 €. Le prélèvement à la source peut encore réduire le montant versé selon votre situation fiscale.",
    },
    maillage: [
      { slug: "salaire-brut-net", label: "Salaire brut en net" },
      { slug: "salaire-temps-partiel", label: "Salaire temps partiel" },
      { slug: "budget-reste-a-vivre", label: "Budget reste à vivre" },
    ],
    conseils: [
      "Vérifiez chaque janvier la revalorisation du SMIC horaire.",
      "Comparez toujours les salaires horaires, pas seulement les nets mensuels.",
      "Au SMIC, renseignez-vous sur la prime d'activité et les aides au logement.",
      "Un employeur ne peut pas vous rémunérer sous le SMIC horaire.",
    ],
    limites: [
      "Estimation du SMIC net standard — prime d'activité non incluse.",
      "Ne remplace pas un bulletin de paie ni une simulation officielle.",
      "SMIC des Mayotte et cas spécifiques exclus.",
    ],
    faq: [
      {
        question: "Quel est le SMIC horaire en 2025 ?",
        answer:
          "Le SMIC horaire brut est de 11,65 € au 1er janvier 2025 (revalorisation annuelle). Vérifiez la valeur en vigueur sur service-public.fr.",
      },
      {
        question: "Combien net avec le SMIC temps plein ?",
        answer:
          "Environ 1 218 € net mensuel avant impôt pour 35 h/semaine au SMIC 2025, avec 22 % de cotisations salariales.",
      },
      {
        question: "Comment calculer le SMIC brut mensuel ?",
        answer:
          "SMIC horaire × heures hebdomadaires × 52/12. Pour 35 h : 11,65 × 35 × 4,333 ≈ 1 767 € brut/mois.",
      },
      {
        question: "Le SMIC s'applique-t-il au temps partiel ?",
        answer:
          "Oui, le taux horaire ne peut pas être inférieur au SMIC. Le net mensuel sera proportionnel au nombre d'heures.",
      },
      {
        question: "Le SMIC est-il imposable ?",
        answer:
          "Oui, mais au SMIC le prélèvement à la source est souvent faible ou nul selon la situation du foyer fiscal.",
      },
      {
        question: "Qu'est-ce que la prime d'activité ?",
        answer:
          "Une aide versée par la CAF aux travailleurs modestes, cumulable avec le SMIC. Elle peut augmenter significativement le revenu disponible.",
      },
      {
        question: "Le SMIC augmente-t-il chaque année ?",
        answer:
          "Oui, il est revalorisé au 1er janvier (inflation + moitié du gain de pouvoir d'achat du SMIC). Parfois une revalorisation supplémentaire en cours d'année.",
      },
      {
        question: "Peut-on négocier un salaire au SMIC ?",
        answer:
          "L'employeur doit verser au minimum le SMIC horaire. Au-delà, la négociation est libre selon le poste et la convention collective.",
      },
      {
        question: "SMIC brut ou net : que doit afficher l'employeur ?",
        answer:
          "Le contrat mentionne le salaire brut. L'offre d'emploi peut communiquer en brut ou net, mais le brut fait foi juridiquement.",
      },
      {
        question: "Quelles sont les limites de ce simulateur ?",
        answer:
          "Calcul simplifié sans prime d'activité ni aides. Pour le net exact, consultez un bulletin de paie au SMIC.",
      },
    ],
  },
});
