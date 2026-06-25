import { createRegistry } from "./factory";
import type { ContentRegistry } from "./types";

export const entrepriseContent: ContentRegistry = createRegistry({
  "calculateur-tjm-freelance": {
    intro:
      "Déterminez le taux journalier moyen (TJM) minimum à facturer pour atteindre un revenu net annuel cible, en intégrant charges sociales, impôts et frais professionnels.",
    definition:
      "Le TJM (taux journalier moyen) est le montant HT facturé par jour travaillé et facturable. Il se calcule en partant de l'objectif de revenu net, en remontant au chiffre d'affaires nécessaire via un taux global de prélèvements, puis en divisant par le nombre de jours réellement facturables dans l'année.",
    objectif:
      "Fixer un tarif journalier cohérent avec votre niveau de vie visé, vos jours disponibles et la réalité fiscale de votre statut (micro-entreprise, EURL, SASU…).",
    variables: [
      "Revenu net annuel visé (€)",
      "Jours facturables par an (hors congés, prospection, admin)",
      "Taux global charges + impôts (% du CA)",
      "Frais professionnels annuels (€)",
    ],
    formule:
      "CA annuel = (Revenu net + Frais) ÷ (1 − Taux charges). TJM = CA annuel ÷ Jours facturables.",
    formuleDetail:
      "Le taux global regroupe cotisations URSSAF, impôt sur le revenu et autres prélèvements. Les frais s'ajoutent au CA car ils ne sont pas couverts par le revenu net visé.",
    interpretation: [
      "Un TJM trop bas ne couvre pas les jours non facturés (congés, maladie, prospection) : prévoyez une marge de sécurité de 10 à 15 %.",
      "Le taux de 35 % utilisé par défaut correspond à une estimation micro-entreprise BIC/BNC avec impôt au barème modéré.",
      "Comparez votre TJM au marché de votre secteur : un TJM viable n'est pas forcément un TJM compétitif.",
    ],
    limitesCalcul: [
      "Taux global unique — pas de détail URSSAF / IR séparé",
      "Pas de prise en compte de l'ACRE ou d'exonérations spécifiques",
      "Jours facturables saisis manuellement, sans calendrier réel",
      "Hypothèse de CA régulier sur l'année",
    ],
    example: {
      title: "Objectif 40 000 € net, 200 jours facturables",
      donnees: [
        "Revenu net visé : 40 000 €",
        "Jours facturables : 200",
        "Taux charges + impôts : 35 %",
        "Frais professionnels : 3 000 €",
      ],
      calcul: [
        "CA nécessaire = (40 000 + 3 000) ÷ (1 − 0,35) = 66 154 €",
        "TJM = 66 154 ÷ 200 = 331 €/jour",
      ],
      resultat: "TJM minimum estimé : 331 €/jour — CA annuel : 66 154 €.",
      interpretation:
        "Pour toucher 40 000 € net après prélèvements et 3 000 € de frais, il faut facturer environ 331 € HT par jour sur 200 jours. Augmenter les jours facturables ou baisser le taux de charges abaisse le TJM requis.",
    },
    maillage: [
      { slug: "facturation-objectif-revenu-net", label: "Facturation objectif revenu net mensuel" },
      { slug: "revenu-net-independant", label: "Revenu net indépendant après charges" },
      { slug: "micro-entrepreneur-charges", label: "Charges micro-entrepreneur détaillées" },
      { slug: "cout-horaire-charge-tns", label: "Coût horaire chargé TNS" },
    ],
    conseils: [
      "Comptez 180 à 220 jours facturables selon vos congés et votre activité commerciale.",
      "Actualisez le taux de charges après votre première déclaration fiscale réelle.",
      "Intégrez les frais récurrents : logiciels, assurance RC Pro, comptable, déplacements.",
      "Revoyez votre TJM chaque année à la hausse pour compenser l'inflation et l'expérience.",
    ],
    limites: [
      "Estimation pédagogique — ne remplace pas un business plan ni un expert-comptable.",
      "Le TJM marché peut différer du TJM minimum viable selon votre secteur.",
    ],
    faq: [
      {
        question: "Qu'est-ce que le TJM freelance ?",
        answer:
          "Le taux journalier moyen (TJM) est le montant HT facturé par jour travaillé pour un client. C'est l'indicateur de référence des consultants, formateurs et indépendants en prestation intellectuelle.",
      },
      {
        question: "Combien de jours facturables prévoir par an ?",
        answer:
          "En pratique, entre 180 et 220 jours sur 365 : il faut déduire congés, jours fériés, prospection, formation et tâches administratives. Le simulateur propose 200 jours par défaut.",
      },
      {
        question: "Comment calculer le TJM pour 40 000 € net ?",
        answer:
          "Avec 40 000 € net, 3 000 € de frais, 35 % de charges et 200 jours : CA = 66 154 €, soit un TJM d'environ 331 €/jour. Le simulateur fait ce calcul automatiquement.",
      },
      {
        question: "Quel taux de charges utiliser pour un freelance ?",
        answer:
          "Comptez 30 à 45 % selon le statut : micro-entreprise BNC (~25 % URSSAF + IR), EIRL/EURL TNS (~45 %), ou SASU (~50 à 75 % sur salaire). Le défaut de 35 % est une moyenne prudente.",
      },
      {
        question: "Le TJM inclut-il la TVA ?",
        answer:
          "Non, le TJM s'exprime en HT. Si vous êtes assujetti à la TVA, c'est le client qui la paie en sus. En franchise de TVA, votre facture est HT sans TVA.",
      },
      {
        question: "Faut-il facturer tous les jours ouvrés ?",
        answer:
          "Non. Même à plein régime, vous ne facturez pas 220 jours : intercontrat, prospection et congés réduisent le volume. Mieux vaut un TJM plus élevé sur moins de jours.",
      },
      {
        question: "Comment le TJM se compare-t-il au taux horaire ?",
        answer:
          "TJM × 1 jour ≈ 7 à 8 heures facturables selon votre métier. Pour un tarif horaire, divisez le TJM par vos heures productives quotidiennes ou utilisez le simulateur coût horaire TNS.",
      },
      {
        question: "Les frais professionnels impactent-ils le TJM ?",
        answer:
          "Oui. Chaque euro de frais (loyer bureau, matériel, abonnements) augmente le CA nécessaire et donc le TJM, car ces dépenses ne sont pas couvertes par le revenu net visé.",
      },
      {
        question: "Un TJM de 500 € est-il réaliste ?",
        answer:
          "Dans l'IT, le conseil stratégique ou l'expertise rare, oui. Pour d'autres secteurs, le marché impose des plafonds. Croisez toujours TJM viable (simulateur) et TJM marché (enquêtes sectorielles).",
      },
      {
        question: "Ce simulateur remplace-t-il un expert-comptable ?",
        answer:
          "Non. Il fournit une base de calcul rapide. Validez votre taux de charges réel avec un expert-comptable, surtout si vous hésitez entre micro-entreprise et société.",
      },
    ],
  },

  "revenu-net-independant": {
    intro:
      "Estimez le revenu net disponible après cotisations sociales micro-entreprise et frais professionnels, à partir de votre chiffre d'affaires annuel.",
    definition:
      "Le revenu net indépendant correspond ici au CA encaissé, diminué des cotisations URSSAF proportionnelles au CA (régime micro) et de vos frais professionnels déclarés. L'impôt sur le revenu n'est pas déduit dans ce simulateur.",
    objectif:
      "Visualiser rapidement ce qu'il reste après charges sociales micro-entreprise, avant impôt sur le revenu, pour piloter votre activité au quotidien.",
    variables: [
      "Chiffre d'affaires annuel encaissé (€)",
      "Type d'activité micro-entreprise (vente, BIC, BNC)",
      "Frais professionnels annuels (€)",
    ],
    formule:
      "Charges sociales = CA × Taux URSSAF. Revenu net = CA − Charges − Frais.",
    formuleDetail:
      "Taux 2024 : vente 12,3 % — prestations BIC 21,2 % — prestations BNC 24,6 %. Pour le détail complet (impôt libératoire, plafonds), voir le simulateur micro-entrepreneur-charges.",
    interpretation: [
      "Les cotisations micro sont calculées sur le CA encaissé, pas sur le bénéfice : vos frais réels n'abaissent pas le taux URSSAF.",
      "Le net affiché est avant impôt sur le revenu (sauf si vous avez opté pour l'impôt libératoire — voir simulateur dédié).",
      "Un CA en forte croissance augmente mécaniquement les cotisations, même si la marge réelle stagne.",
    ],
    limitesCalcul: [
      "Régime micro-entrepreneur uniquement",
      "Impôt sur le revenu (barème ou libératoire) non déduit",
      "ACRE et exonérations non intégrées",
      "CFE et autres taxes locales exclues",
    ],
    example: {
      title: "45 000 € de CA en prestations BIC",
      donnees: [
        "Chiffre d'affaires annuel : 45 000 €",
        "Activité : prestations BIC (21,2 %)",
        "Frais professionnels : 2 000 €",
      ],
      calcul: [
        "Charges sociales = 45 000 × 21,2 % = 9 540 €",
        "Revenu net = 45 000 − 9 540 − 2 000 = 33 460 €",
        "Revenu net mensuel = 33 460 ÷ 12 ≈ 2 788 €",
      ],
      resultat: "Revenu net estimé : 33 460 €/an (2 788 €/mois) avant impôt sur le revenu.",
      interpretation:
        "Sur 45 000 € de CA BIC, environ 21 % part en cotisations URSSAF. Il reste 33 460 € avant IR — l'impôt au barème s'appliquera sur une base abattue de 34 % du CA.",
    },
    maillage: [
      { slug: "micro-entrepreneur-charges", label: "Charges micro-entrepreneur — détail URSSAF et libératoire" },
      { slug: "exoneration-acre", label: "Exonération ACRE première année" },
      { slug: "calculateur-tjm-freelance", label: "Calculateur TJM freelance" },
      { slug: "facturation-objectif-revenu-net", label: "Objectif revenu net → CA mensuel" },
    ],
    conseils: [
      "Croisez ce résultat avec le simulateur micro-entrepreneur-charges pour intégrer l'impôt libératoire.",
      "Provisionnez 10 à 30 % du net pour l'impôt sur le revenu si vous n'avez pas opté pour le libératoire.",
      "Suivez votre CA mensuel pour anticiper le dépassement des plafonds micro (188 700 € prestations).",
      "Déclarez vos cotisations chaque mois ou trimestre sur autoentrepreneur.urssaf.fr.",
    ],
    limites: [
      "Ne calcule pas l'impôt sur le revenu au barème ni l'abattement forfaitaire.",
      "Pour les taux détaillés et l'option libératoire, utilisez micro-entrepreneur-charges.",
    ],
    faq: [
      {
        question: "Comment calculer le revenu net d'un indépendant ?",
        answer:
          "Revenu net = CA − cotisations sociales − frais professionnels. En micro-entreprise, les cotisations sont un pourcentage fixe du CA selon l'activité (12,3 % à 24,6 %).",
      },
      {
        question: "45 000 € de CA BIC : combien me reste-t-il ?",
        answer:
          "Charges URSSAF : 9 540 € (21,2 %). Après 2 000 € de frais : 33 460 € net avant impôt sur le revenu, soit environ 2 788 €/mois.",
      },
      {
        question: "Quelle différence avec le simulateur micro-entrepreneur-charges ?",
        answer:
          "Ce simulateur estime le net après cotisations et frais. Le simulateur micro-entrepreneur-charges détaille les cotisations URSSAF, l'impôt libératoire et les plafonds de CA — complémentaire, pas redondant.",
      },
      {
        question: "L'impôt sur le revenu est-il inclus ?",
        answer:
          "Non. L'impôt au barème s'applique sur le CA après abattement forfaitaire (34 % BIC, 50 % BNC). L'option impôt libératoire peut le remplacer — voir micro-entrepreneur-charges.",
      },
      {
        question: "Pourquoi les frais ne réduisent-ils pas les cotisations ?",
        answer:
          "En micro-entreprise, les cotisations sont proportionnelles au CA encaissé, indépendamment des dépenses réelles. Seul un changement de régime (réel) permet de déduire les charges.",
      },
      {
        question: "Quels taux URSSAF en 2024 ?",
        answer:
          "Vente : 12,3 %. Prestations BIC : 21,2 %. Prestations BNC : 24,6 %. Ces taux sont identiques à ceux du simulateur micro-entrepreneur-charges.",
      },
      {
        question: "L'ACRE réduit-elle mon revenu net calculé ?",
        answer:
          "L'ACRE diminue les cotisations la 1re année (environ 50 %). Ce simulateur ne l'intègre pas : utilisez le simulateur exonération ACRE pour estimer l'économie.",
      },
      {
        question: "Quels plafonds de CA pour rester micro-entrepreneur ?",
        answer:
          "77 700 € (vente) et 188 700 € (prestations) en 2024. Au-delà, vous basculez vers le régime réel. Vérifiez aussi les seuils de franchise TVA.",
      },
      {
        question: "BNC ou BIC : quel impact sur le net ?",
        answer:
          "Le BNC (24,6 %) prélève plus que le BIC (21,2 %) à CA égal. Sur 45 000 €, la différence est de 1 530 € de cotisations supplémentaires en BNC.",
      },
      {
        question: "Comment augmenter mon revenu net en micro-entreprise ?",
        answer:
          "Augmenter le CA, optimiser le statut BIC vs BNC, bénéficier de l'ACRE la 1re année, ou comparer avec un passage en EURL/SASU si le CA dépasse les plafonds.",
      },
    ],
  },

  "sasu-remuneration-dividendes": {
    intro:
      "Comparez le montant net perçu par un dirigeant de SASU selon qu'il se rémunère en salaire (assimilé salarié) ou en dividendes soumis à la flat tax.",
    definition:
      "En SASU, le dirigeant peut percevoir une rémunération en salaire (soumise à cotisations sociales assimilées salarié) ou distribuer des dividendes (soumis au prélèvement forfaitaire unique de 30 %). Le choix impacte le net perçu, la protection sociale et la fiscalité globale.",
    objectif:
      "Arbitrer entre salaire et dividendes pour maximiser le net perçu à montant brut disponible égal, en comprenant le coût des cotisations ou de la flat tax.",
    variables: [
      "Montant brut disponible dans la société (€)",
      "Mode de rémunération (salaire ou dividendes)",
      "Taux de cotisations salariales si salaire (%)",
    ],
    formule:
      "Salaire : Net = Brut × (1 − Taux cotisations). Dividendes : Net = Brut × 70 % (flat tax 30 %).",
    formuleDetail:
      "La flat tax (PFU) de 30 % comprend 12,8 % d'IR et 17,2 % de prélèvements sociaux. Le taux de cotisations salaire varie selon la rémunération (environ 45 à 75 % pour un dirigeant assimilé salarié).",
    interpretation: [
      "À 50 000 € brut, les dividendes laissent 35 000 € net (30 % de prélèvement) contre environ 22 500 € en salaire à 55 % de cotisations.",
      "Le salaire ouvre des droits retraite, chômage et prévoyance ; les dividendes n'y contribuent pas.",
      "La rémunération optimale combine souvent un salaire modeste et des dividendes, au-delà de ce comparatif simplifié.",
    ],
    limitesCalcul: [
      "Flat tax 30 % simplifiée — option barème non simulée",
      "Pas de prise en compte de l'IS payé en amont",
      "Cotisations salariales saisies manuellement",
      "Abattement de 40 % sur dividendes (option barème) non calculé",
    ],
    example: {
      title: "50 000 € distribués en dividendes",
      donnees: [
        "Montant brut disponible : 50 000 €",
        "Mode : dividendes (flat tax 30 %)",
        "Taux cotisations salaire (référence) : 55 %",
      ],
      calcul: [
        "Charges / fiscalité = 50 000 × 30 % = 15 000 €",
        "Net perçu = 50 000 × 70 % = 35 000 €",
        "En salaire à 55 % : net = 50 000 × 45 % = 22 500 €",
      ],
      resultat: "Net en dividendes : 35 000 € (70 % du brut) — net en salaire comparable : 22 500 €.",
      interpretation:
        "À montant égal, les dividendes laissent plus de net immédiat, mais sans cotisations retraite. L'arbitrage dépend de vos besoins de protection sociale et de trésorerie société.",
    },
    maillage: [
      { slug: "flat-tax-30-pourcent", label: "Flat tax 30 % — PFU détaillé" },
      { slug: "impot-dividendes", label: "Impôt sur les dividendes" },
      { slug: "salaire-brut-net", label: "Salaire brut net salarié" },
      { slug: "cout-total-embauche-salarie", label: "Coût total embauche salarié" },
    ],
    conseils: [
      "Fixez un salaire minimum pour valider l'activité et ouvrir des droits sociaux.",
      "Comparez l'option barème (abattement 40 % sur dividendes) si votre TMI est faible.",
      "Anticipez la trésorerie : les dividendes ne peuvent être distribués que sur bénéfices réalisés.",
      "Consultez un expert-comptable pour un mix salaire/dividendes adapté à votre situation.",
    ],
    limites: [
      "Comparatif simplifié — ne remplace pas une optimisation fiscale personnalisée.",
      "Ne tient pas compte de la réforme des cotisations TNS dirigeants.",
    ],
    faq: [
      {
        question: "Salaire ou dividendes en SASU : que choisir ?",
        answer:
          "Les dividendes laissent généralement plus de net (flat tax 30 %), le salaire ouvre des droits sociaux (retraite, chômage). L'optimum est souvent un mix des deux.",
      },
      {
        question: "Combien net avec 50 000 € de dividendes ?",
        answer:
          "Avec la flat tax de 30 % : 35 000 € net (15 000 € de prélèvements). C'est le scénario par défaut du simulateur.",
      },
      {
        question: "Quel taux de cotisations pour un dirigeant SASU salarié ?",
        answer:
          "Entre 45 et 75 % selon la rémunération et les options. Le simulateur utilise 55 % par défaut — ajustez selon votre fiche de paie réelle.",
      },
      {
        question: "Qu'est-ce que la flat tax de 30 % ?",
        answer:
          "Le prélèvement forfaitaire unique (PFU) applique 12,8 % d'IR et 17,2 % de prélèvements sociaux sur les dividendes, soit 30 % au total.",
      },
      {
        question: "Peut-on opter pour le barème sur les dividendes ?",
        answer:
          "Oui, avec un abattement de 40 % puis imposition au barème progressif. Intéressant si votre TMI est faible (11 % ou 0 %). Ce simulateur ne calcule pas cette option.",
      },
      {
        question: "Les dividendes ouvrent-ils des droits à la retraite ?",
        answer:
          "Non. Seule la rémunération en salaire cotise à l'Assurance retraite et à la Sécurité sociale. C'est l'un des principaux inconvénients des dividendes seuls.",
      },
      {
        question: "Faut-il de la trésorerie pour verser des dividendes ?",
        answer:
          "Oui. Les dividendes se prennent sur les bénéfices distribuables après IS. Vous ne pouvez pas distribuer plus que la trésorerie et les réserves disponibles.",
      },
      {
        question: "L'impôt sur les sociétés est-il inclus ?",
        answer:
          "Non. Le simulateur part d'un montant brut déjà disponible dans la société (après IS). Il compare uniquement le mode de sortie vers le dirigeant.",
      },
      {
        question: "Un dirigeant SASU est-il salarié ou TNS ?",
        answer:
          "Assimilé salarié s'il a un contrat de travail et une rémunération. Les cotisations sont alors proches du salariat classique, d'où le taux élevé.",
      },
      {
        question: "Ce simulateur suffit-il pour décider ?",
        answer:
          "Non. Il éclaire le comparatif net immédiat. Pour une stratégie durable (retraite, prévoyance, investissements), faites valider par un expert-comptable.",
      },
    ],
  },

  "portage-salarial-vs-freelance": {
    intro:
      "Comparez le revenu net mensuel perçu en portage salarial et en micro-entreprise freelance, à chiffre d'affaires mensuel égal.",
    definition:
      "Le portage salarial transforme votre CA en salaire via une société de portage (frais de gestion + cotisations salariales). En micro-entreprise, vous facturez directement et payez des cotisations proportionnelles au CA. Les deux modèles diffèrent en net perçu et en statut social.",
    objectif:
      "Choisir entre portage et freelance en connaissant l'écart de revenu net mensuel pour un même CA HT, avant de vous engager dans un statut.",
    variables: [
      "Chiffre d'affaires mensuel HT (€)",
      "Frais de gestion portage (% du CA)",
      "Type d'activité micro-entreprise (BIC ou BNC)",
    ],
    formule:
      "Net portage = CA × (1 − Frais portage) × 75 %. Net freelance = CA × (1 − Taux URSSAF micro).",
    formuleDetail:
      "Le coefficient 75 % du portage est une estimation du net après frais de gestion et charges salariales/patronales. Le taux micro : BIC 21,2 % — BNC 24,6 %.",
    interpretation: [
      "À 8 000 €/mois en BNC, le freelance laisse environ 6 032 € net contre 5 400 € en portage (frais 10 %) : écart d'environ 632 €.",
      "Le portage offre le statut salarié (chômage, congés payés) que le freelance n'a pas en micro-entreprise.",
      "Les frais de portage varient de 5 à 15 % selon la société : ajustez le simulateur en conséquence.",
    ],
    limitesCalcul: [
      "Coefficient net portage (75 %) simplifié",
      "Pas de prise en compte de l'impôt sur le revenu",
      "Micro-entreprise uniquement pour le volet freelance",
      "Avantages sociaux du portage non chiffrés",
    ],
    example: {
      title: "8 000 €/mois HT, portage 10 %, activité BNC",
      donnees: [
        "CA mensuel HT : 8 000 €",
        "Frais de gestion portage : 10 %",
        "Activité micro : prestations BNC (24,6 %)",
      ],
      calcul: [
        "Net portage = 8 000 × 90 % × 75 % = 5 400 €",
        "Net freelance = 8 000 × (1 − 24,6 %) = 6 032 €",
        "Écart = 6 032 − 5 400 = 632 € en faveur du freelance",
      ],
      resultat: "Micro-entreprise plus favorable — écart : 632 €/mois.",
      interpretation:
        "À CA égal, la micro-entreprise laisse plus de net immédiat. Le portage compense partiellement par la protection sociale salariée — intégrez cet avantage dans votre décision.",
    },
    maillage: [
      { slug: "micro-entrepreneur-charges", label: "Charges micro-entreprise — taux URSSAF détaillés" },
      { slug: "revenu-net-independant", label: "Revenu net indépendant" },
      { slug: "calculateur-tjm-freelance", label: "Calculateur TJM freelance" },
      { slug: "salaire-brut-net", label: "Salaire brut net" },
    ],
    conseils: [
      "Demandez le détail des frais de gestion et du net réel à 2 ou 3 sociétés de portage.",
      "Comparez les cotisations micro via micro-entrepreneur-charges pour affiner le volet freelance.",
      "Évaluez la valeur des congés payés et de l'assurance chômage du portage.",
      "En début d'activité, le portage simplifie la gestion ; en CA stable, le freelance peut être plus rentable.",
    ],
    limites: [
      "Estimation du net portage — demandez une simulation à votre société de portage.",
      "Ne remplace pas un conseil juridique sur le choix de statut.",
    ],
    faq: [
      {
        question: "Portage salarial ou freelance : lequel paie le plus ?",
        answer:
          "En général, la micro-entreprise laisse plus de net à CA égal (moins de frais intermédiaires). Exemple : 632 €/mois de plus à 8 000 € CA en BNC avec 10 % de frais portage.",
      },
      {
        question: "Comment est calculé le net en portage salarial ?",
        answer:
          "CA − frais de gestion (5 à 15 %) − cotisations salariales et patronales ≈ 75 % du CA net de frais. Le simulateur applique cette estimation.",
      },
      {
        question: "Comment est calculé le net en micro-entreprise ?",
        answer:
          "Net = CA × (1 − taux URSSAF). En BNC : 24,6 % de cotisations, soit 75,4 % restant avant frais et IR. Voir micro-entrepreneur-charges pour le détail.",
      },
      {
        question: "Quels avantages du portage malgré un net plus bas ?",
        answer:
          "Statut salarié : congés payés, assurance chômage, retraite complémentaire, gestion administrative déléguée. Utile en transition ou pour les consultants occasionnels.",
      },
      {
        question: "Quels frais de gestion en portage ?",
        answer:
          "Entre 5 et 15 % du CA HT selon la société et les services (facturation, RC Pro, accompagnement). Le défaut du simulateur est 10 %.",
      },
      {
        question: "8 000 €/mois : combien en portage vs freelance ?",
        answer:
          "Portage (10 %) : ~5 400 € net. Freelance BNC : ~6 032 € net. Écart : 632 €/mois en faveur de la micro-entreprise dans notre exemple.",
      },
      {
        question: "L'impôt sur le revenu est-il inclus ?",
        answer:
          "Non. Les deux montants sont avant IR. Le freelance paiera l'IR au barème (ou libératoire) ; le portage prélève déjà l'impôt à la source sur le salaire.",
      },
      {
        question: "Peut-on cumuler portage et micro-entreprise ?",
        answer:
          "En principe non sur la même activité. Le portage impose l'exclusivité du contrat de travail avec la société de portage pour les missions portées.",
      },
      {
        question: "BNC ou BIC : quel impact sur le comparatif ?",
        answer:
          "Le BNC (24,6 %) prélève plus que le BIC (21,2 %), réduisant le net freelance. Le portage n'est pas impacté par ce choix puisqu'il n'est pas en micro-entreprise.",
      },
      {
        question: "Quand choisir le portage salarial ?",
        answer:
          "Début d'activité, missions courtes, besoin de statut salarié (prêt immobilier, chômage) ou réduction de la charge administrative.",
      },
    ],
  },

  "seuil-franchise-tva": {
    intro:
      "Vérifiez si votre chiffre d'affaires annuel HT reste sous les plafonds de la franchise en base de TVA pour les prestations de services ou la vente de marchandises.",
    definition:
      "La franchise en base de TVA exempte les très petites entreprises de collecter et reverser la TVA, tant que leur CA annuel ne dépasse pas un seuil légal. Un seuil majoré (tolérance) existe pour le premier dépassement.",
    objectif:
      "Anticiper le basculement au régime réel de TVA et mesurer la marge restante avant dépassement du plafond.",
    variables: [
      "Chiffre d'affaires annuel HT (€)",
      "Type d'activité (prestations de services ou ventes)",
    ],
    formule:
      "Seuil prestations = 37 500 € — Seuil ventes = 85 000 €. Seuil majoré = Seuil × 1,25.",
    formuleDetail:
      "En cas de dépassement du seuil de base mais sous le seuil majoré, la franchise peut être maintenue une année supplémentaire sous conditions. Au-delà du majoré, assujettissement à la TVA.",
    interpretation: [
      "Avec 32 000 € de CA prestations, vous restez 5 500 € sous le plafond de 37 500 €.",
      "Le passage à la TVA oblige à facturer TTC et à déclarer la TVA collectée — impactez vos prix clients.",
      "Les seuils micro-entreprise CA (188 700 €) et franchise TVA (37 500 € prestations) sont distincts.",
    ],
    limitesCalcul: [
      "Seuils 2025 simplifiés — vérifier les montants légaux en vigueur",
      "Régime de tolérance (seuil majoré) non simulé en détail",
      "Activités mixtes (vente + services) non ventilées",
      "Franchise TVA et plafonds micro-entreprise sont des régimes différents",
    ],
    example: {
      title: "32 000 € de CA prestations de services",
      donnees: [
        "Chiffre d'affaires annuel HT : 32 000 €",
        "Type d'activité : prestations de services",
        "Seuil franchise : 37 500 €",
      ],
      calcul: [
        "32 000 € ≤ 37 500 € → franchise maintenue",
        "Marge sous le plafond = 37 500 − 32 000 = 5 500 €",
        "Seuil majoré (tolérance) = 37 500 × 1,25 = 46 875 €",
      ],
      resultat: "Franchise TVA maintenue — 5 500 € sous le plafond.",
      interpretation:
        "Vous pouvez encore facturer 5 500 € HT sans dépasser le seuil de base. Surveillez votre CA en fin d'année pour anticiper un éventuel basculement.",
    },
    maillage: [
      { slug: "calculateur-tva", label: "Calculateur TVA HT/TTC" },
      { slug: "micro-entrepreneur-charges", label: "Plafonds micro-entreprise et cotisations" },
      { slug: "revenu-net-independant", label: "Revenu net indépendant" },
      { slug: "marge-commerciale-taux", label: "Marge commerciale et prix de vente" },
    ],
    conseils: [
      "Suivez votre CA mensuel cumulé pour anticiper le dépassement avant fin d'année.",
      "Au passage à la TVA, répercutez-la sur vos tarifs ou absorbez-la sur votre marge.",
      "Vérifiez les seuils exacts sur impots.gouv.fr — ils évoluent régulièrement.",
      "Activité mixte : appliquez le seuil le plus bas ou ventilez selon les règles fiscales.",
    ],
    limites: [
      "Seuils indicatifs — consultez la réglementation en vigueur pour votre activité.",
      "Cas des activités artisanales, libérales réglementées ou e-commerce non détaillés.",
    ],
    faq: [
      {
        question: "Quels sont les seuils de franchise TVA en 2025 ?",
        answer:
          "Prestations de services : 37 500 € HT. Vente de marchandises : 85 000 € HT. Seuil majoré (tolérance) : × 1,25 soit 46 875 € et 106 250 €.",
      },
      {
        question: "32 000 € de CA prestations : suis-je en franchise TVA ?",
        answer:
          "Oui, 32 000 € est inférieur au seuil de 37 500 €. Il reste 5 500 € de marge avant dépassement du plafond de base.",
      },
      {
        question: "Que se passe-t-il si je dépasse le seuil ?",
        answer:
          "Vous basculez au régime réel de TVA : collecte sur vos factures, déclarations CA3 ou CA12, droit à déduction sur vos achats.",
      },
      {
        question: "Qu'est-ce que le seuil majoré ?",
        answer:
          "C'est une tolérance à 125 % du seuil de base. Si vous dépassez le seuil normal mais restez sous le majoré, la franchise peut être conservée une année de plus.",
      },
      {
        question: "Franchise TVA et micro-entreprise : même chose ?",
        answer:
          "Non. La micro-entreprise est un régime social/fiscal avec plafonds CA plus élevés (188 700 € prestations). La franchise TVA est une option fiscale avec des seuils plus bas.",
      },
      {
        question: "Dois-je facturer la TVA en micro-entreprise ?",
        answer:
          "Seulement si vous dépassez les seuils de franchise TVA ou si vous avez renoncé à la franchise. Sinon, vos factures sont HT sans TVA.",
      },
      {
        question: "85 000 € : quel seuil pour la vente ?",
        answer:
          "85 000 € HT est le plafond franchise pour la vente de marchandises. Le seuil majoré est de 106 250 €.",
      },
      {
        question: "Comment anticiper le basculement TVA ?",
        answer:
          "Suivez le CA cumulé mensuellement. Si vous approchez 80 % du seuil en octobre, ajustez vos tarifs ou provisionnez pour la TVA l'année suivante.",
      },
      {
        question: "Puis-je renoncer à la franchise volontairement ?",
        answer:
          "Oui, pour récupérer la TVA sur vos achats si vous avez beaucoup de dépenses imposables. Intéressant surtout en BTP ou commerce.",
      },
      {
        question: "Ce simulateur couvre-t-il les DOM-TOM ?",
        answer:
          "Non. Les seuils et taux diffèrent en Guyane, Martinique, Guadeloupe et Réunion. Consultez la réglementation locale.",
      },
    ],
  },

  "break-even-entreprise": {
    intro:
      "Calculez le seuil de rentabilité (break-even) : le chiffre d'affaires ou le volume de ventes minimum pour couvrir vos charges fixes et variables.",
    definition:
      "Le point mort (seuil de rentabilité) est le niveau d'activité où le résultat est nul : les recettes couvrent exactement les charges fixes et les coûts variables. En dessous, l'entreprise est déficitaire ; au-dessus, elle dégage une marge.",
    objectif:
      "Déterminer combien vendre (en euros ou en unités) pour ne plus perdre d'argent, et piloter la rentabilité de votre activité commerciale ou artisanale.",
    variables: [
      "Charges fixes mensuelles (€)",
      "Prix de vente unitaire HT (€)",
      "Coût variable unitaire (€)",
    ],
    formule:
      "Marge unitaire = Prix de vente − Coût variable. Unités break-even = Charges fixes ÷ Marge unitaire. CA break-even = Unités × Prix de vente.",
    formuleDetail:
      "Les charges fixes (loyer, salaires, abonnements) ne varient pas avec le volume. Les coûts variables (matières, commissions) augmentent avec chaque vente.",
    interpretation: [
      "Avec 3 500 € de fixes, un produit à 120 € (coût variable 45 €), il faut vendre 47 unités soit 5 600 € de CA mensuel.",
      "Plus la marge unitaire est élevée, moins d'unités suffisent pour couvrir les fixes.",
      "Le break-even mensuel doit être comparé à votre capacité de production et de commercialisation réelle.",
    ],
    limitesCalcul: [
      "Modèle linéaire — pas de effet d'échelle ni de saisonnalité",
      "Un seul produit ou panier moyen simplifié",
      "Charges fixes et prix supposés stables",
      "TVA et impôts non intégrés",
    ],
    example: {
      title: "Charges fixes 3 500 €, produit à 120 € (CV 45 €)",
      donnees: [
        "Charges fixes mensuelles : 3 500 €",
        "Prix de vente unitaire HT : 120 €",
        "Coût variable unitaire : 45 €",
      ],
      calcul: [
        "Marge unitaire = 120 − 45 = 75 €",
        "Unités break-even = 3 500 ÷ 75 ≈ 47 unités",
        "CA break-even = 47 × 120 = 5 600 €",
        "Taux de marge = 75 ÷ 120 = 62,5 %",
      ],
      resultat: "Seuil de rentabilité : 5 600 €/mois (47 unités).",
      interpretation:
        "Tant que vous vendez moins de 47 unités par mois, vous êtes en perte. Chaque vente au-delà contribue 75 € à la marge nette.",
    },
    maillage: [
      { slug: "marge-commerciale-taux", label: "Marge commerciale et prix de vente" },
      { slug: "facturation-objectif-revenu-net", label: "Objectif revenu net et facturation" },
      { slug: "cout-total-embauche-salarie", label: "Coût total embauche salarié" },
      { slug: "budget-travaux", label: "Budget travaux et devis" },
    ],
    conseils: [
      "Identifiez précisément fixes vs variables — une erreur fausse le seuil.",
      "Réduire les charges fixes (télétravail, mutualisation) abaisse le break-even.",
      "Augmenter le prix ou réduire le coût variable améliore la marge unitaire.",
      "Recalculez le seuil après chaque embauche ou hausse de loyer.",
    ],
    limites: [
      "Modèle simplifié pour TPE — les PME multi-produits nécessitent une analyse plus fine.",
      "Ne remplace pas un compte de résultat prévisionnel complet.",
    ],
    faq: [
      {
        question: "Qu'est-ce que le seuil de rentabilité ?",
        answer:
          "C'est le niveau de CA (ou d'unités vendues) où l'entreprise ne gagne ni ne perd d'argent. Au-delà, chaque vente génère du profit.",
      },
      {
        question: "Comment calculer le break-even ?",
        answer:
          "Unités = Charges fixes ÷ (Prix de vente − Coût variable). CA break-even = Unités × Prix de vente. Exemple : 3 500 ÷ 75 = 47 unités.",
      },
      {
        question: "Charges fixes vs variables : quelle différence ?",
        answer:
          "Fixes : loyer, assurances, salaires de structure — indépendantes du volume. Variables : matières premières, commissions — proportionnelles aux ventes.",
      },
      {
        question: "47 unités à 120 € : combien de CA break-even ?",
        answer:
          "47 × 120 = 5 600 € de CA mensuel minimum pour couvrir les 3 500 € de charges fixes.",
      },
      {
        question: "Comment réduire mon seuil de rentabilité ?",
        answer:
          "Baisser les charges fixes, augmenter le prix de vente, ou réduire le coût variable par unité. Chaque levier diminue le volume minimum requis.",
      },
      {
        question: "Le break-even inclut-il les impôts ?",
        answer:
          "Non. Le simulateur calcule le point mort opérationnel avant IS ou IR. Provisionnez une marge au-delà du break-even pour les impôts.",
      },
      {
        question: "Plusieurs produits : comment faire ?",
        answer:
          "Calculez un panier moyen (prix et coût variable moyens) ou faites une analyse par produit. Ce simulateur suppose un produit unique.",
      },
      {
        question: "Break-even mensuel ou annuel ?",
        answer:
          "Ici, le calcul est mensuel (charges fixes mensuelles). Multipliez par 12 pour une vision annuelle : 5 600 × 12 = 67 200 €.",
      },
      {
        question: "Que signifie un taux de marge de 62,5 % ?",
        answer:
          "Sur chaque euro vendu (120 €), 75 € (62,5 %) couvrent les coûts variables et contribuent aux fixes puis au profit.",
      },
      {
        question: "Ce simulateur convient-il aux indépendants ?",
        answer:
          "Oui, pour estimer un volume minimum de missions ou de ventes. Croisez avec facturation-objectif-revenu-net pour un objectif de revenu personnel.",
      },
    ],
  },

  "marge-commerciale-taux": {
    intro:
      "Calculez le prix de vente HT à partir de votre coût d'achat et du taux de marge commerciale souhaité, avec le montant de marge et le coefficient multiplicateur.",
    definition:
      "La marge commerciale est la différence entre le prix de vente HT et le coût d'achat HT. Le taux de marge s'exprime en pourcentage du coût d'achat (markup), distinct du taux de marque (marge ÷ prix de vente).",
    objectif:
      "Fixer un prix de vente rentable en commerçant, artisan ou e-commerçant, en garantissant la marge nécessaire à la couverture des charges et au profit.",
    variables: [
      "Coût d'achat HT (€)",
      "Taux de marge commerciale (% du coût d'achat)",
    ],
    formule:
      "Marge = Coût d'achat × Taux de marge. Prix de vente HT = Coût d'achat + Marge. Coefficient = Prix de vente ÷ Coût d'achat.",
    formuleDetail:
      "Un taux de marge de 40 % sur coût d'achat signifie que la marge représente 40 % du prix d'achat, pas 40 % du prix de vente (taux de marque).",
    interpretation: [
      "Coût 50 €, marge 40 % → marge de 20 €, prix de vente 70 €, coefficient × 1,40.",
      "Ne confondez pas taux de marge (sur achat) et taux de marque (sur vente) : 40 % de marge = 28,6 % de marque.",
      "Intégrez charges fixes et TVA dans votre politique tarifaire globale.",
    ],
    limitesCalcul: [
      "Un seul produit — pas de panier multi-références",
      "Coût d'achat HT uniquement",
      "Pas de remises, promotions ni frais de livraison",
      "Concurrence et élasticité-prix non modélisées",
    ],
    example: {
      title: "Achat 50 € HT, marge commerciale 40 %",
      donnees: [
        "Coût d'achat HT : 50 €",
        "Taux de marge commerciale : 40 %",
      ],
      calcul: [
        "Marge = 50 × 40 % = 20 €",
        "Prix de vente HT = 50 + 20 = 70 €",
        "Coefficient = 70 ÷ 50 = × 1,40",
      ],
      resultat: "Prix de vente HT : 70 € — marge : 20 € — coefficient × 1,40.",
      interpretation:
        "Chaque produit acheté 50 € se revend 70 € HT, dégageant 20 € de marge brute avant charges fixes et impôts.",
    },
    maillage: [
      { slug: "break-even-entreprise", label: "Seuil de rentabilité break-even" },
      { slug: "calculateur-tva", label: "Calculateur TVA HT/TTC" },
      { slug: "seuil-franchise-tva", label: "Seuil franchise TVA" },
      { slug: "rentabilite-lmnp", label: "Rentabilité LMNP" },
    ],
    conseils: [
      "Vérifiez le taux de marque (marge ÷ prix de vente) pour comparer avec votre secteur.",
      "Ajoutez une marge de sécurité pour les invendus, retours et frais de payment.",
      "Revoyez vos prix d'achat régulièrement — une hausse fournisseur érode la marge.",
      "Utilisez le coefficient multiplicateur pour tarifer rapidement toute votre gamme.",
    ],
    limites: [
      "Marge commerciale brute — charges fixes et fiscales non déduites.",
      "Prix psychologiques et stratégie commerciale non pris en compte.",
    ],
    faq: [
      {
        question: "Qu'est-ce que la marge commerciale ?",
        answer:
          "C'est la différence entre le prix de vente HT et le coût d'achat HT. Elle rémunère vos charges et votre profit.",
      },
      {
        question: "Comment calculer le prix de vente avec 40 % de marge ?",
        answer:
          "Prix = Coût × (1 + Taux). Exemple : 50 × 1,40 = 70 € HT. La marge est de 20 € (40 % de 50 €).",
      },
      {
        question: "Marge commerciale ou taux de marque ?",
        answer:
          "Marge commerciale = Marge ÷ Coût d'achat (markup). Taux de marque = Marge ÷ Prix de vente. 40 % de marge = 28,6 % de marque sur un produit à 70 €.",
      },
      {
        question: "Qu'est-ce que le coefficient multiplicateur ?",
        answer:
          "C'est le rapport Prix de vente ÷ Coût d'achat. Ici × 1,40 : multipliez tout coût d'achat par 1,40 pour obtenir le prix de vente.",
      },
      {
        question: "50 € d'achat, 40 % de marge : quel prix ?",
        answer:
          "70 € HT. Marge de 20 €. C'est l'exemple par défaut du simulateur.",
      },
      {
        question: "Dois-je ajouter la TVA au prix calculé ?",
        answer:
          "Le simulateur donne un prix HT. Ajoutez la TVA (20 %, 10 %, 5,5 %) si vous êtes assujetti. En franchise TVA, le prix affiché est le prix client.",
      },
      {
        question: "Quelle marge viser en commerce ?",
        answer:
          "Variable selon le secteur : 25 à 50 % sur coût d'achat en retail, plus en restauration ou services. Comparez avec vos concurrents.",
      },
      {
        question: "La marge couvre-t-elle tous mes frais ?",
        answer:
          "Non. La marge commerciale est brute. Il faut encore couvrir loyer, salaires, marketing — d'où l'intérêt du simulateur break-even.",
      },
      {
        question: "Comment baisser mes prix sans perdre de marge ?",
        answer:
          "Négociez les coûts d'achat, réduisez les pertes, ou augmentez le volume. Baisser le taux de marge impacte directement la rentabilité.",
      },
      {
        question: "Ce simulateur gère-t-il les remises ?",
        answer:
          "Non. Appliquez le taux sur le coût d'achat net de remise, ou recalculez après remise client sur le prix de vente.",
      },
    ],
  },

  "cout-horaire-charge-tns": {
    intro:
      "Estimez le taux horaire facturable minimum pour couvrir vos cotisations TNS, frais professionnels et rémunération nette mensuelle visée.",
    definition:
      "Le coût horaire chargé TNS est le tarif HT à appliquer à chaque heure facturable pour financer votre rémunération nette, les cotisations sociales de travailleur non salarié et vos frais d'exploitation.",
    objectif:
      "Traduire un objectif de revenu net mensuel en tarif horaire viable pour artisans, consultants et professions libérales en régime TNS (EURL, EI, professions libérales).",
    variables: [
      "Rémunération nette mensuelle visée (€)",
      "Heures facturables par mois",
      "Taux de charges sociales (% du brut)",
      "Frais professionnels mensuels (€)",
    ],
    formule:
      "Brut nécessaire = Net ÷ (1 − Taux charges). CA mensuel = Brut + Frais. Taux horaire = CA mensuel ÷ Heures facturables.",
    formuleDetail:
      "Les charges TNS (URSSAF, retraite, CSG…) représentent environ 40 à 50 % du brut. Les frais s'ajoutent car ils ne sont pas couverts par le net visé.",
    interpretation: [
      "Pour 3 500 € net, 120 h/mois, 45 % de charges et 400 € de frais : tarif minimum ≈ 56 €/h.",
      "Moins d'heures facturables implique un tarif horaire plus élevé à revenu égal.",
      "Comparez avec le simulateur TJM (journée) ou micro-entrepreneur-charges si vous êtes en micro.",
    ],
    limitesCalcul: [
      "Taux de charges unique — pas de détail URSSAF",
      "Régime TNS générique — pas de détail par profession",
      "Heures facturables saisies manuellement",
      "Impôt sur le revenu non intégré au taux de charges",
    ],
    example: {
      title: "3 500 € net, 120 h/mois, charges 45 %",
      donnees: [
        "Rémunération nette mensuelle visée : 3 500 €",
        "Heures facturables : 120 h/mois",
        "Taux charges sociales : 45 %",
        "Frais professionnels : 400 €/mois",
      ],
      calcul: [
        "Brut nécessaire = 3 500 ÷ (1 − 0,45) = 6 364 €",
        "CA mensuel = 6 364 + 400 = 6 764 €",
        "Taux horaire = 6 764 ÷ 120 ≈ 56 €/h",
      ],
      resultat: "Coût horaire minimum : 56 €/h — CA mensuel : 6 764 €.",
      interpretation:
        "Pour toucher 3 500 € net après cotisations TNS et 400 € de frais, facturez au minimum 56 € HT par heure sur 120 heures productives.",
    },
    maillage: [
      { slug: "calculateur-tjm-freelance", label: "Calculateur TJM freelance" },
      { slug: "facturation-objectif-revenu-net", label: "Facturation objectif revenu net" },
      { slug: "micro-entrepreneur-charges", label: "Charges micro-entreprise (alternative au TNS)" },
      { slug: "break-even-entreprise", label: "Seuil de rentabilité" },
    ],
    conseils: [
      "Comptez 100 à 130 h facturables par mois selon votre métier et votre prospection.",
      "En micro-entreprise, les taux URSSAF sont plus bas — comparez via micro-entrepreneur-charges.",
      "Majorer votre tarif de 15 à 20 % pour couvrir les heures non facturables.",
      "Revoyez votre taux horaire à chaque changement de régime ou de CA.",
    ],
    limites: [
      "Estimation TNS générique — les professions libérales réglementées ont des cotisations spécifiques.",
      "Ne remplace pas un prévisionnel comptable.",
    ],
    faq: [
      {
        question: "Qu'est-ce que le coût horaire chargé TNS ?",
        answer:
          "C'est le tarif HT minimum par heure facturable pour couvrir cotisations TNS, frais et rémunération nette visée. Il inclut tous les prélèvements sociaux.",
      },
      {
        question: "Comment calculer mon tarif horaire en indépendant ?",
        answer:
          "Brut = Net ÷ (1 − taux charges). CA = Brut + frais. Tarif = CA ÷ heures. Exemple : 56 €/h pour 3 500 € net sur 120 h.",
      },
      {
        question: "3 500 € net : quel tarif horaire ?",
        answer:
          "Avec 120 h facturables, 45 % de charges et 400 € de frais : environ 56 €/h HT. Le simulateur affiche 6 764 € de CA mensuel nécessaire.",
      },
      {
        question: "Quel taux de charges pour un TNS ?",
        answer:
          "Entre 40 et 50 % du brut selon la profession et le revenu. Le défaut de 45 % est une estimation prudente pour un indépendant classique.",
      },
      {
        question: "Différence avec le TJM ?",
        answer:
          "Le TJM est journalier (200 jours/an). Le coût horaire est mensuel (heures facturables/mois). TJM ≈ taux horaire × heures par jour.",
      },
      {
        question: "Micro-entreprise ou TNS : quel tarif ?",
        answer:
          "En micro, les cotisations sont plus basses (21 à 25 % du CA) — votre tarif horaire viable sera inférieur. Comparez via micro-entrepreneur-charges.",
      },
      {
        question: "Combien d'heures facturables par mois ?",
        answer:
          "120 h par défaut (≈ 30 h/semaine × 4 semaines). Ajustez selon votre temps admin, prospection et congés.",
      },
      {
        question: "Les frais professionnels impactent-ils le tarif ?",
        answer:
          "Oui. Chaque euro de frais mensuel (loyer, assurance, logiciels) augmente le CA nécessaire et donc le taux horaire.",
      },
      {
        question: "L'impôt sur le revenu est-il inclus ?",
        answer:
          "Non, sauf si vous l'intégrez manuellement dans le taux de charges. Provisionnez 10 à 30 % supplémentaires selon votre TMI.",
      },
      {
        question: "Ce tarif est-il compétitif sur le marché ?",
        answer:
          "Le simulateur donne le minimum viable, pas le tarif marché. Croisez avec les grilles sectorielles et votre expérience.",
      },
    ],
  },

  "exoneration-acre": {
    intro:
      "Estimez l'économie de cotisations sociales grâce à l'ACRE (Aide à la Création ou Reprise d'Entreprise) la première année d'activité en micro-entreprise.",
    definition:
      "L'ACRE (ex-ACRE) accorde une exonération partielle des cotisations sociales aux créateurs et repreneurs d'entreprise éligibles, généralement 50 % de réduction la première année. Elle s'applique sur les cotisations URSSAF proportionnelles au CA.",
    objectif:
      "Quantifier l'économie réalisée sur vos cotisations la 1re année et comparer charges normales vs charges avec ACRE.",
    variables: [
      "Chiffre d'affaires annuel prévisionnel (€)",
      "Type d'activité (vente, BIC, BNC)",
      "Taux de réduction ACRE (%)",
    ],
    formule:
      "Charges normales = CA × Taux URSSAF. Charges ACRE = Charges normales × (1 − Taux ACRE). Économie = Charges normales − Charges ACRE.",
    formuleDetail:
      "Taux URSSAF micro : vente 12,3 % — BIC 21,2 % — BNC 24,6 %. ACRE standard : 50 % la 1re année. Pour le détail des cotisations sans ACRE, voir micro-entrepreneur-charges.",
    interpretation: [
      "30 000 € de CA BIC avec ACRE 50 % : charges passent de 6 360 € à 3 180 €, économie de 3 180 €.",
      "L'ACRE ne réduit pas l'impôt sur le revenu — seulement les cotisations URSSAF.",
      "L'éligibilité et la durée exacte dépendent de votre situation (demandeur d'emploi, -26 ans, etc.).",
    ],
    limitesCalcul: [
      "Taux ACRE saisi manuellement — conditions d'éligibilité non vérifiées",
      "Durée pluriannuelle (2e et 3e année réduite) non simulée",
      "Plafonds de CA ACRE non contrôlés",
      "TNS et sociétés : règles ACRE différentes",
    ],
    example: {
      title: "30 000 € de CA BIC, ACRE 50 %",
      donnees: [
        "Chiffre d'affaires annuel : 30 000 €",
        "Activité : prestations BIC (21,2 %)",
        "Réduction ACRE : 50 %",
      ],
      calcul: [
        "Charges sans ACRE = 30 000 × 21,2 % = 6 360 €",
        "Charges avec ACRE = 6 360 × 50 % = 3 180 €",
        "Économie = 6 360 − 3 180 = 3 180 €",
      ],
      resultat: "Économie ACRE estimée : 3 180 €/an — charges réduites à 3 180 €.",
      interpretation:
        "La première année, l'ACRE divise par deux vos cotisations URSSAF en BIC. L'économie diminue les années suivantes (25 % puis 12,5 % selon les cas).",
    },
    maillage: [
      { slug: "micro-entrepreneur-charges", label: "Charges micro-entrepreneur sans ACRE" },
      { slug: "revenu-net-independant", label: "Revenu net indépendant" },
      { slug: "calculateur-tjm-freelance", label: "Calculateur TJM freelance" },
      { slug: "seuil-franchise-tva", label: "Seuil franchise TVA" },
    ],
    conseils: [
      "Demandez l'ACRE dès l'immatriculation — délai de 45 jours après création.",
      "Croisez avec micro-entrepreneur-charges pour voir le net sans puis avec ACRE.",
      "L'ACRE est automatique pour certains profils (demandeurs d'emploi) — vérifiez sur urssaf.fr.",
      "Anticipez la hausse des cotisations la 2e année dans votre trésorerie.",
    ],
    limites: [
      "Éligibilité non vérifiée — consultez l'URSSAF ou France Travail.",
      "Ne simule pas l'ACRE pour les sociétés (SASU, SARL) dont les règles diffèrent.",
    ],
    faq: [
      {
        question: "Qu'est-ce que l'ACRE ?",
        answer:
          "L'Aide à la Création ou Reprise d'Entreprise exonère partiellement les cotisations sociales la 1re année d'activité. En micro-entreprise, environ 50 % de réduction sur les cotisations URSSAF.",
      },
      {
        question: "Combien économise-t-on avec l'ACRE ?",
        answer:
          "Exemple : 30 000 € CA BIC → charges normales 6 360 €, avec ACRE 50 % → 3 180 €. Économie : 3 180 € la 1re année.",
      },
      {
        question: "Qui peut bénéficier de l'ACRE ?",
        answer:
          "Demandeurs d'emploi, -26 ans, bénéficiaires du RSA/ASS, personnes en QPV… sous conditions. Demande à faire dans les 45 jours après création pour certains profils.",
      },
      {
        question: "L'ACRE s'applique-t-elle sur l'impôt sur le revenu ?",
        answer:
          "Non. Seules les cotisations URSSAF sont réduites. L'impôt sur le revenu reste dû selon le barème ou l'option libératoire.",
      },
      {
        question: "Quels taux URSSAF pour calculer l'ACRE ?",
        answer:
          "Les mêmes qu'en micro-entreprise : 12,3 % vente, 21,2 % BIC, 24,6 % BNC. Voir micro-entrepreneur-charges pour le détail complet.",
      },
      {
        question: "L'ACRE dure combien de temps ?",
        answer:
          "En micro-entreprise : 50 % la 1re année, 25 % la 2e, 12,5 % la 3e (simplifié). Ce simulateur ne modélise qu'une année.",
      },
      {
        question: "30 000 € CA BIC : charges avec ACRE ?",
        answer:
          "3 180 € au lieu de 6 360 € (économie 3 180 €). C'est le calcul par défaut du simulateur.",
      },
      {
        question: "ACRE et plafonds de CA : compatibles ?",
        answer:
          "Oui, tant que vous restez sous les plafonds micro-entreprise. L'ACRE ne dispense pas du respect des seuils de franchise TVA ou de CA micro.",
      },
      {
        question: "Différence avec micro-entrepreneur-charges ?",
        answer:
          "micro-entrepreneur-charges calcule les cotisations normales (et l'impôt libératoire). Ce simulateur isole l'économie liée à l'ACRE — les deux sont complémentaires.",
      },
      {
        question: "Comment demander l'ACRE ?",
        answer:
          "Automatique pour certains profils à l'immatriculation. Sinon, formulaire URSSAF dans les 45 jours. Conservez la notification d'attribution.",
      },
    ],
  },

  "facturation-objectif-revenu-net": {
    intro:
      "Calculez le chiffre d'affaires mensuel HT à facturer pour atteindre un revenu net mensuel cible, en intégrant charges, impôts et frais professionnels.",
    definition:
      "Ce simulateur traduit un objectif de revenu net en facturation mensuelle en remontant du net au CA via un taux global de prélèvements (cotisations + impôts) et en ajoutant les frais professionnels non couverts par le net.",
    objectif:
      "Piloter votre activité freelance ou TPE avec un objectif de facturation mensuel concret, aligné sur votre revenu personnel visé.",
    variables: [
      "Revenu net mensuel visé (€)",
      "Taux global charges + impôts (% du CA)",
      "Frais professionnels mensuels (€)",
    ],
    formule:
      "CA mensuel = (Revenu net + Frais mensuels) ÷ (1 − Taux charges). CA annuel = CA mensuel × 12.",
    formuleDetail:
      "Le taux global de 35 % par défaut est une estimation pour un indépendant en micro-entreprise BIC/BNC avec impôt modéré. Ajustez selon votre statut réel.",
    interpretation: [
      "Pour 3 000 € net, 250 € de frais et 35 % de charges : facturez 5 000 € HT/mois soit 60 000 €/an.",
      "Chaque hausse de frais ou du taux de charges augmente le CA nécessaire à revenu net constant.",
      "Comparez avec calculateur-tjm-freelance pour une vision journalière.",
    ],
    limitesCalcul: [
      "Taux global unique — pas de détail URSSAF / IR",
      "CA régulier supposé chaque mois",
      "ACRE et exonérations non intégrées",
      "Trésorerie et délais de paiement non modélisés",
    ],
    example: {
      title: "Objectif 3 000 € net/mois, charges 35 %",
      donnees: [
        "Revenu net mensuel visé : 3 000 €",
        "Taux charges + impôts : 35 %",
        "Frais professionnels : 250 €/mois",
      ],
      calcul: [
        "CA mensuel = (3 000 + 250) ÷ (1 − 0,35) = 5 000 €",
        "CA annuel = 5 000 × 12 = 60 000 €",
      ],
      resultat: "CA mensuel à facturer : 5 000 € HT — CA annuel : 60 000 €.",
      interpretation:
        "Pour toucher 3 000 € net après prélèvements et 250 € de frais, visez 5 000 € de facturation HT chaque mois. Sur 200 jours, cela correspond à un TJM d'environ 300 €.",
    },
    maillage: [
      { slug: "calculateur-tjm-freelance", label: "Calculateur TJM freelance" },
      { slug: "revenu-net-independant", label: "Revenu net indépendant" },
      { slug: "cout-horaire-charge-tns", label: "Coût horaire chargé TNS" },
      { slug: "break-even-entreprise", label: "Seuil de rentabilité entreprise" },
    ],
    conseils: [
      "Actualisez le taux de charges après votre première liasse fiscale ou avis d'imposition.",
      "Provisionnez un mois de trésorerie pour compenser les délais de paiement clients.",
      "En micro-entreprise, affinez le taux via micro-entrepreneur-charges plutôt que 35 % générique.",
      "Suivez votre CA cumulé mensuellement pour vérifier que vous atteignez l'objectif.",
    ],
    limites: [
      "Estimation simplifiée — validez avec un expert-comptable selon votre statut.",
      "Ne tient pas compte de la saisonnalité de l'activité.",
    ],
    faq: [
      {
        question: "Combien facturer pour 3 000 € net par mois ?",
        answer:
          "Avec 35 % de charges et 250 € de frais : 5 000 € HT/mois, soit 60 000 €/an. Le simulateur calcule automatiquement ce montant.",
      },
      {
        question: "Comment calculer le CA pour un revenu net cible ?",
        answer:
          "CA = (Net + Frais) ÷ (1 − Taux charges). Exemple : (3 000 + 250) ÷ 0,65 = 5 000 € mensuels.",
      },
      {
        question: "Quel taux de charges utiliser ?",
        answer:
          "30 à 45 % selon statut et impôt. Micro BNC (~25 % URSSAF + IR) : plutôt 30-35 %. SASU salaire : plutôt 50-60 %. Ajustez dans le simulateur.",
      },
      {
        question: "Les frais mensuels augmentent-ils le CA à facturer ?",
        answer:
          "Oui. Les 250 € de frais par défaut s'ajoutent au numérateur : ils doivent être couverts par le CA en plus du net visé.",
      },
      {
        question: "Différence avec le calculateur TJM ?",
        answer:
          "Ce simulateur donne un CA mensuel. Le TJM divise le CA annuel par les jours facturables pour obtenir un tarif journalier.",
      },
      {
        question: "3 000 € net : quel CA annuel ?",
        answer:
          "5 000 € × 12 = 60 000 € HT/an avec les valeurs par défaut (35 % charges, 250 € frais).",
      },
      {
        question: "L'ACRE réduit-elle le CA à facturer ?",
        answer:
          "Oui, la 1re année. L'ACRE baisse vos cotisations, donc le taux de charges effectif — recalculez avec un taux plus bas ou utilisez exoneration-acre.",
      },
      {
        question: "Dois-je viser exactement ce CA chaque mois ?",
        answer:
          "C'est un objectif moyen. En activité saisonnière, lissez sur l'année : l'important est le CA annuel de 60 000 € dans notre exemple.",
      },
      {
        question: "CA HT ou TTC ?",
        answer:
          "Le simulateur travaille en HT. En franchise TVA, HT = montant client. Si assujetti TVA, le client paie le TTC en sus.",
      },
      {
        question: "Comment vérifier que j'atteins mon objectif ?",
        answer:
          "Comparez votre CA encaissé mensuel au simulateur. Utilisez revenu-net-independant pour vérifier le net réel à partir du CA constaté.",
      },
    ],
  },
});
