import type { ContentRegistry } from "./types";
import { buildRichContent, buildFaq, p, hl } from "../content-builder";

export const fiscaliteContent: ContentRegistry = {
  "impot-sur-le-revenu": {
    content: buildRichContent({
      intro:
        "Estimez votre impôt sur le revenu (IR) à partir du revenu net imposable et du nombre de parts fiscales, selon le barème progressif en vigueur.",
      definition:
        "L'impôt sur le revenu est un impôt direct progressif qui s'applique aux revenus annuels du foyer fiscal. Le revenu net imposable est divisé par le nombre de parts pour obtenir le revenu par part, puis le barème est appliqué tranche par tranche avant d'être multiplié par les parts.",
      objectif:
        "Obtenir une estimation rapide de l'impôt dû et du taux effectif d'imposition, afin d'anticiper votre reste à payer ou votre remboursement après déclaration.",
      variables: [
        "Revenu net imposable annuel (€)",
        "Nombre de parts fiscales (quotient familial simplifié)",
      ],
      formules: [
        p("Revenu par part = Revenu net imposable ÷ Nombre de parts"),
        p("Impôt par part = somme des tranches du barème appliquées au revenu par part"),
        p("Impôt total = Impôt par part × Nombre de parts"),
        p("Taux effectif = Impôt total ÷ Revenu net imposable × 100"),
        hl(
          "Barème 2026 (revenus 2025)",
          "0 % jusqu'à 11 294 €, 11 % de 11 295 € à 28 797 €, 30 % de 28 798 € à 82 341 €, 41 % de 82 342 € à 177 106 €, 45 % au-delà — par part fiscale."
        ),
      ],
      interpretation: [
        p("Le montant affiché correspond à l'impôt brut avant décote, réductions et crédits d'impôt."),
        p("Le taux effectif est toujours inférieur au taux marginal (TMI) : seuls les derniers euros sont taxés à la tranche la plus élevée."),
        hl(
          "À retenir",
          "Un couple avec 2 parts et 45 000 € de revenus nets paie sensiblement moins qu'un célibataire au même revenu global, grâce au quotient familial."
        ),
      ],
      limitesCalcul: [
        "Décote pour les revenus modestes non incluse",
        "Plafonnement du quotient familial non modélisé",
        "Réductions et crédits d'impôt (PER, emploi à domicile, etc.) non pris en compte",
        "Barème 2026 appliqué aux revenus 2025",
      ],
      example: {
        title: "Couple avec 45 000 € nets et 2 parts",
        donnees: [
          "Revenu net imposable : 45 000 €",
          "Nombre de parts : 2",
        ],
        calcul: [
          "Revenu par part = 45 000 ÷ 2 = 22 500 €",
          "Tranche 0 % : 11 294 € → 0 €",
          "Tranche 11 % : (22 500 − 11 294) × 11 % = 1 232,66 € par part",
          "Impôt total = 1 232,66 × 2 ≈ 2 465 €",
        ],
        resultat: "Impôt estimé : environ 2 465 € — taux effectif ~5,5 %.",
        interpretation:
          "Avec 2 parts, le couple reste largement dans la tranche à 11 %. Le taux effectif reste faible car une partie importante du revenu n'est pas imposée.",
      },
      maillage: [
        { slug: "quotient-familial", label: "Quotient familial — impact des parts" },
        { slug: "taux-marginal-imposition", label: "Taux marginal d'imposition (TMI)" },
        { slug: "prelevement-a-la-source", label: "Prélèvement à la source mensuel" },
      ],
      conseils: [
        "Déclarez l'ensemble de vos revenus (salaires, pensions, fonciers, etc.) pour éviter un redressement.",
        "Vérifiez les cases de charges déductibles : pensions alimentaires versées, PER, frais réels…",
        "Croisez ce résultat avec le simulateur officiel sur impots.gouv.fr avant toute décision.",
        "Anticipez l'évolution de votre impôt en cas de changement de situation (mariage, enfant, retraite).",
      ],
      limites: [
        "Estimation indicative, sans valeur juridique.",
        "Ne remplace pas l'avis d'imposition ni un conseil fiscal personnalisé.",
        "Cas particuliers (résidents à l'étranger, micro-entrepreneurs, BNC…) non couverts.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le revenu net imposable ?",
        answer:
          "C'est le total de vos revenus après abattements forfaitaires ou frais réels, moins certaines charges déductibles (pensions alimentaires, cotisations PER, etc.). C'est la base sur laquelle s'applique le barème.",
      },
      {
        question: "Comment sont calculées les parts fiscales ?",
        answer:
          "1 part pour un adulte célibataire, 2 pour un couple marié ou pacsé, +0,5 par enfant (1 part à partir du 3e enfant). Le parent isolé bénéficie d'une demi-part supplémentaire.",
      },
      {
        question: "Quelle est la différence entre taux effectif et TMI ?",
        answer:
          "Le taux effectif est le rapport impôt ÷ revenu (ex. 5,5 %). Le TMI (taux marginal) est la tranche du dernier euro gagné (ex. 11 % ou 30 %). Le TMI sert à évaluer l'intérêt d'une déduction ou d'un placement.",
      },
      {
        question: "La décote est-elle incluse dans le calcul ?",
        answer:
          "Non. La décote réduit l'impôt des foyers modestes (revenu par part inférieur à environ 19 000 €). Notre simulateur calcule l'impôt brut avant cette réduction.",
      },
      {
        question: "Quand dois-je déclarer mes revenus ?",
        answer:
          "La déclaration en ligne s'effectue généralement d'avril à début juin pour les revenus de l'année précédente. Les dates exactes varient selon votre département.",
      },
      {
        question: "Le prélèvement à la source remplace-t-il la déclaration ?",
        answer:
          "Non. L'impôt est prélevé mensuellement sur vos revenus, mais la déclaration annuelle recalcule l'impôt définitif et ajuste le solde (remboursement ou complément).",
      },
      {
        question: "Les réductions d'impôt sont-elles prises en compte ?",
        answer:
          "Non. Les réductions (dons, frais de garde, investissement locatif Pinel…) et crédits d'impôt (emploi à domicile) viennent en déduction après le calcul du barème.",
      },
      {
        question: "Un revenu de 45 000 € pour 2 parts, c'est beaucoup d'impôt ?",
        answer:
          "Avec 2 parts, le revenu par part est de 22 500 €. L'impôt estimé tourne autour de 2 465 €, soit un taux effectif d'environ 5,5 % — bien en deçà du TMI de 11 %.",
      },
      {
        question: "Comment réduire légalement mon impôt sur le revenu ?",
        answer:
          "Versements sur un PER (déduction immédiate), crédit d'impôt emploi à domicile, réductions pour investissements éligibles, optimisation du quotient familial… Chaque levier dépend de votre situation.",
      },
      {
        question: "Ce simulateur utilise-t-il le barème 2024 ?",
        answer:
          "Oui, le barème 2024 s'applique aux revenus 2025 déclarés au printemps 2024. Les seuils de tranches sont indexés chaque année.",
      },
    ]),
  },

  "quotient-familial": {
    content: buildRichContent({
      intro:
        "Mesurez l'impact du quotient familial sur votre impôt : nombre de parts, revenu par part et gain fiscal par rapport à une imposition sans parts supplémentaires.",
      definition:
        "Le quotient familial consiste à diviser le revenu imposable du foyer par un nombre de parts, fonction de la composition familiale. Cette mécanique permet d'adapter l'impôt à la charge du foyer, mais l'avantage est plafonné pour les hauts revenus.",
      objectif:
        "Comprendre combien de parts vous avez droit et estimer le gain fiscal lié à vos enfants ou à votre situation de couple, avant plafonnement.",
      variables: [
        "Revenu net imposable annuel (€)",
        "Situation familiale (célibataire, couple, parent isolé)",
        "Nombre d'enfants à charge",
      ],
      formules: [
        p("Parts de base : 1 (célibataire), 2 (couple), 1 + 0,25 (parent isolé)"),
        p("Parts enfants : +0,5 par enfant (1 part pour le 3e et suivants)"),
        p("Revenu par part = Revenu net ÷ Nombre de parts"),
        p("Gain fiscal QF = Impôt sans parts supplémentaires − Impôt avec quotient familial"),
        hl(
          "Plafonnement",
          "L'avantage lié aux demi-parts enfants et parent isolé est plafonné (environ 1 678 € par demi-part en 2024). Ce plafond n'est pas simulé ici."
        ),
      ],
      interpretation: [
        p("Plus le nombre de parts est élevé, plus le revenu par part diminue et plus l'impôt total baisse."),
        p("Le gain fiscal affiché compare votre situation réelle à celle d'un célibataire sans enfant au même revenu global."),
        hl(
          "Parent isolé",
          "Le statut de parent isolé ajoute 0,25 part, en plus des parts liées aux enfants à charge."
        ),
      ],
      limitesCalcul: [
        "Plafonnement du quotient familial non calculé",
        "Garde alternée (0,25 ou 0,5 part) non détaillée",
        "Demi-parts pour invalidité ou ancienneté non traitées",
        "Décote et crédits d'impôt exclus",
      ],
      example: {
        title: "Couple, 2 enfants, 55 000 € nets",
        donnees: [
          "Revenu net imposable : 55 000 €",
          "Situation : couple marié / pacsé",
          "Enfants à charge : 2",
        ],
        calcul: [
          "Parts = 2 (couple) + 0,5 + 0,5 = 3 parts",
          "Revenu par part = 55 000 ÷ 3 ≈ 18 333 €",
          "Impôt avec QF ≈ 2 323 €",
          "Impôt sans QF (1 part) ≈ 9 775 €",
          "Gain fiscal ≈ 7 452 €",
        ],
        resultat: "3 parts — revenu par part : 18 333 € — gain fiscal estimé : ~7 452 €.",
        interpretation:
          "Les deux demi-parts enfants abaissent fortement le revenu par part et donc l'impôt. En pratique, le gain réel peut être inférieur si le plafonnement s'applique.",
      },
      maillage: [
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu — barème complet" },
        { slug: "taux-marginal-imposition", label: "TMI selon votre revenu par part" },
        { slug: "donation-numeraire", label: "Donation en numéraire aux enfants" },
      ],
      conseils: [
        "Mettez à jour votre situation familiale dès qu'elle change (naissance, séparation, garde alternée).",
        "Vérifiez si le plafonnement réduit votre avantage : consultez la line 2AB de votre avis d'imposition.",
        "Les enfants rattachés au foyer doivent être à charge et déclarés sur le formulaire 2042.",
        "En cas de garde alternée, les parts peuvent être réparties entre les deux parents.",
      ],
      limites: [
        "Simulation sans plafonnement ni cas de demi-part supplémentaire.",
        "Ne tient pas compte des revenus du conjoint si vous êtes imposés séparément.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Combien de parts pour un couple sans enfant ?",
        answer: "Un couple marié ou pacsé bénéficie de 2 parts de base, quel que soit le régime matrimonial.",
      },
      {
        question: "Comment comptent les enfants à charge ?",
        answer:
          "Chaque enfant à charge ajoute 0,5 part. À partir du 3e enfant, chaque enfant compte pour 1 part entière.",
      },
      {
        question: "Qu'est-ce que le plafonnement du quotient familial ?",
        answer:
          "Il limite l'avantage fiscal lié aux demi-parts (enfants, parent isolé). En 2024, le plafond est d'environ 1 678 € par demi-part supplémentaire.",
      },
      {
        question: "Parent isolé : combien de parts ?",
        answer:
          "1 part de base + 0,25 part de parent isolé + 0,5 part par enfant (1 part à partir du 3e). Ce statut nécessite de remplir des conditions précises.",
      },
      {
        question: "La garde alternée modifie-t-elle les parts ?",
        answer:
          "Oui. Chaque parent peut bénéficier de 0,25 part par enfant en garde alternée, ou 0,5 part si l'enfant est principalement à sa charge.",
      },
      {
        question: "Un enfant majeur peut-il compter dans le quotient ?",
        answer:
          "Oui, s'il est rattaché au foyer fiscal (étudiant, situation de dépendance). Les conditions d'âge et de revenus propres s'appliquent.",
      },
      {
        question: "Pourquoi mon gain fiscal semble-t-il très élevé ici ?",
        answer:
          "Le simulateur compare à une imposition sur 1 part sans enfant. Le plafonnement, s'il s'applique, réduit significativement ce gain dans la réalité.",
      },
      {
        question: "Le quotient familial impacte-t-il le prélèvement à la source ?",
        answer:
          "Oui. Le nombre de parts alimente le taux personnalisé de prélèvement à la source calculé par l'administration fiscale.",
      },
      {
        question: "Couple avec 55 000 € et 2 enfants : combien de parts ?",
        answer: "2 parts (couple) + 0,5 + 0,5 = 3 parts. Le revenu par part est d'environ 18 333 €.",
      },
      {
        question: "Puis-je simuler l'effet d'un 3e enfant ?",
        answer:
          "Oui, en saisissant 3 enfants : le 3e enfant ajoute 1 part entière (et non 0,5), ce qui accroît davantage le gain fiscal.",
      },
    ]),
  },

  "prelevement-a-la-source": {
    content: buildRichContent({
      intro:
        "Estimez votre taux de prélèvement à la source (PAS) et le montant mensuel prélevé sur votre salaire net, à partir de votre impôt annuel estimé.",
      definition:
        "Le prélèvement à la source collecte l'impôt sur le revenu au fil de l'année, lors du versement des revenus (salaire, pension, etc.). Le taux appliqué est calculé par l'administration fiscale à partir de votre dernière déclaration.",
      objectif:
        "Anticiper le montant prélevé chaque mois sur votre salaire et comprendre le lien entre votre impôt annuel et votre taux personnalisé.",
      variables: [
        "Revenu net imposable annuel (€)",
        "Nombre de parts fiscales",
        "Salaire net mensuel (€)",
      ],
      formules: [
        p("Impôt annuel estimé = barème appliqué au revenu par part × parts"),
        p("Taux personnalisé = Impôt annuel ÷ Revenu net imposable × 100"),
        p("Prélèvement mensuel = Salaire net mensuel × Taux personnalisé ÷ 100"),
        hl(
          "Ajustement annuel",
          "En avril-juin, la déclaration recalcule l'impôt définitif. Si le PAS a été supérieur, vous êtes remboursé ; sinon, un prélèvement complémentaire est dû."
        ),
      ],
      interpretation: [
        p("Le taux affiché est une approximation du taux personnalisé transmis à votre employeur."),
        p("Le prélèvement mensuel ne concerne que le salaire saisi : si vous avez d'autres revenus, le solde annuel peut différer."),
        hl(
          "Taux neutre vs personnalisé",
          "Le taux neutre ignore votre situation familiale. Le taux personnalisé intègre vos parts et votre revenu global déclaré."
        ),
      ],
      limitesCalcul: [
        "Crédits d'impôt et réductions non intégrés au taux",
        "Revenus multiples (fonciers, BIC…) non ventilés",
        "Taux individualisé au sein du couple non simulé",
        "Indépendants : logique d'acomptes différente",
      ],
      example: {
        title: "42 000 € nets annuels, 2 parts, salaire 2 800 €/mois",
        donnees: [
          "Revenu net imposable : 42 000 €",
          "Parts : 2",
          "Salaire net mensuel : 2 800 €",
        ],
        calcul: [
          "Revenu par part = 42 000 ÷ 2 = 21 000 €",
          "Impôt annuel estimé ≈ 2 135 €",
          "Taux = 2 135 ÷ 42 000 ≈ 5,1 %",
          "Prélèvement mensuel = 2 800 × 5,1 % ≈ 143 €",
        ],
        resultat: "Taux estimé : ~5,1 % — prélèvement : ~143 €/mois.",
        interpretation:
          "Sur un salaire de 2 800 € nets, environ 143 € partent chaque mois au titre de l'impôt sur le revenu. Le solde définitif sera ajusté après la déclaration.",
      },
      maillage: [
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu annuel" },
        { slug: "taux-marginal-imposition", label: "Taux marginal d'imposition" },
        { slug: "flat-tax-30-pourcent", label: "Flat tax 30 % sur les capitaux" },
      ],
      conseils: [
        "Consultez votre taux actuel sur impots.gouv.fr (rubrique « Gérer mon prélèvement à la source »).",
        "Signalez tout changement de situation (mariage, enfant, autre emploi) pour éviter une mauvaise surprise.",
        "Le taux individualisé permet à chaque conjoint d'avoir un taux adapté à ses propres revenus.",
        "En cas de baisse de revenus, vous pouvez demander une baisse de taux provisoire.",
      ],
      limites: [
        "Estimation basée sur un seul salaire et un revenu imposable global.",
        "Ne simule pas les acomptes des indépendants et professions libérales.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le prélèvement à la source ?",
        answer:
          "C'est le prélèvement de l'impôt sur le revenu directement sur vos revenus (salaire, pension, etc.) au moment où ils sont versés, plutôt qu'en une fois l'année suivante.",
      },
      {
        question: "Comment est calculé mon taux personnalisé ?",
        answer:
          "L'administration divise l'impôt estimé sur vos revenus nets imposables. Ce taux est transmis à votre employeur ou payeur de pension.",
      },
      {
        question: "Puis-je modifier mon taux de prélèvement ?",
        answer:
          "Oui, sur impots.gouv.fr ou via votre employeur. Vous pouvez choisir le taux personnalisé, le taux neutre ou un taux individualisé pour les couples.",
      },
      {
        question: "Que se passe-t-il si j'ai trop payé ?",
        answer:
          "Après votre déclaration, si le total prélevé dépasse l'impôt dû, l'administration vous rembourse automatiquement (généralement en été).",
      },
      {
        question: "Le PAS concerne-t-il tous mes revenus ?",
        answer:
          "Les salaires et pensions oui. Les revenus fonciers, BIC/BNC et capitaux suivent des règles spécifiques (acomptes ou retenue à la source).",
      },
      {
        question: "Un salaire de 2 800 € avec 42 000 € annuels : quel prélèvement ?",
        answer:
          "Avec 2 parts et environ 5,1 % de taux, comptez ~143 € prélevés par mois sur votre salaire net.",
      },
      {
        question: "Qu'est-ce que le taux neutre ?",
        answer:
          "C'est un taux standard basé uniquement sur le salaire, sans tenir compte de votre situation familiale. Utile pour préserver la confidentialité vis-à-vis de l'employeur.",
      },
      {
        question: "Les indépendants paient-ils le prélèvement à la source ?",
        answer:
          "Ils versent des acomptes mensuels ou trimestriels calculés sur le revenu N-1 ou N-2, avec régularisation après déclaration.",
      },
      {
        question: "Le prélèvement à la source inclut-il les prélèvements sociaux ?",
        answer:
          "Non. Le PAS ne concerne que l'impôt sur le revenu. Les cotisations sociales (CSG, CRDS…) sont prélevées séparément sur les revenus d'activité et de remplacement.",
      },
      {
        question: "Dois-je quand même faire ma déclaration ?",
        answer:
          "Oui, la déclaration annuelle reste obligatoire. Elle détermine l'impôt définitif et ajuste les prélèvements effectués dans l'année.",
      },
    ]),
  },

  "flat-tax-30-pourcent": {
    content: buildRichContent({
      intro:
        "Calculez la fiscalité au prélèvement forfaitaire unique (PFU, flat tax 30 %) sur vos revenus de capitaux mobiliers, et comparez avec l'option barème progressif.",
      definition:
        "Le PFU, dit flat tax, impose par défaut les revenus de capitaux mobiliers à un taux global de 30 % : 12,8 % d'impôt sur le revenu et 17,2 % de prélèvements sociaux. L'option pour le barème progressif reste possible sur la déclaration.",
      objectif:
        "Estimer l'impôt dû sur vos intérêts, dividendes ou plus-values mobilières et identifier l'option la plus avantageuse selon votre TMI.",
      variables: [
        "Revenus de capitaux mobiliers annuels (€)",
        "Option de comparaison au barème progressif (oui/non)",
        "Revenu global hors capitaux (si option barème)",
        "Nombre de parts (si option barème)",
      ],
      formules: [
        p("PFU = Revenus capitaux × 30 %"),
        p("Dont IR = Revenus × 12,8 % et PS = Revenus × 17,2 %"),
        p("Option barème : impôt marginal sur capitaux + PS 17,2 % (sans abattement 40 % simplifié ici)"),
        hl(
          "Seuil de bascule",
          "Le barème devient intéressant si votre TMI est inférieur à 12,8 %, typiquement pour les foyers modestes."
        ),
      ],
      interpretation: [
        p("Par défaut, la banque ou le payeur applique le PFU à la source. Vous pouvez opter pour le barème sur votre déclaration."),
        p("Si vous activez la comparaison barème, le simulateur indique l'option la plus favorable entre PFU et barème simplifié."),
        hl(
          "PEA et assurance-vie",
          "Le PEA exonère d'IR après 5 ans (PS uniquement). L'assurance-vie offre des abattements après 8 ans — non simulés ici."
        ),
      ],
      limitesCalcul: [
        "Abattement de 40 % sur dividendes au barème non modélisé en détail",
        "CSG déductible (6,8 %) non incluse",
        "Revenus fonciers micro-foncier et plus-values immobilières exclus",
        "Crédits d'impôt sur revenus étrangers non traités",
      ],
      example: {
        title: "8 000 € de revenus de capitaux — PFU par défaut",
        donnees: [
          "Revenus de capitaux mobiliers : 8 000 €",
          "Option barème : non (PFU par défaut)",
        ],
        calcul: [
          "IR = 8 000 × 12,8 % = 1 024 €",
          "PS = 8 000 × 17,2 % = 1 376 €",
          "PFU total = 8 000 × 30 % = 2 400 €",
          "Net après PFU = 8 000 − 2 400 = 5 600 €",
        ],
        resultat: "PFU : 2 400 € — net après impôt : 5 600 €.",
        interpretation:
          "Sur 8 000 € de revenus, le PFU prélève 2 400 €. Si votre TMI est faible (11 % ou moins), l'option barème pourrait être plus intéressante — activez la comparaison pour vérifier.",
      },
      maillage: [
        { slug: "impot-dividendes", label: "Impôt sur les dividendes — PFU vs barème" },
        { slug: "prelevement-a-la-source", label: "Prélèvement à la source" },
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu — barème" },
      ],
      conseils: [
        "Comparez PFU et barème chaque année : la situation change avec vos revenus d'activité.",
        "Privilégiez le PEA pour investir en actions après 5 ans de détention.",
        "L'assurance-vie reste intéressante pour la transmission et la fiscalité après 8 ans.",
        "Conservez les relevés de votre banque ou courtier pour la déclaration (formulaire 2042).",
      ],
      limites: [
        "Comparaison barème simplifiée, sans abattement dividendes ni CSG déductible.",
        "Ne couvre pas les plus-values immobilières ni les revenus professionnels.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quels revenus sont soumis au PFU ?",
        answer:
          "Intérêts, coupons obligataires, dividendes, plus-values sur valeurs mobilières, certains revenus fonciers (micro-foncier). Les gains PEA après 5 ans en sont exonérés.",
      },
      {
        question: "Le PFU est-il appliqué automatiquement ?",
        answer:
          "Oui, par défaut à la source par la banque ou le payeur. Vous pouvez opter pour le barème sur la déclaration annuelle.",
      },
      {
        question: "Quand choisir le barème plutôt que le PFU ?",
        answer:
          "Quand votre TMI est inférieur à 12,8 %, ou si l'abattement de 40 % sur dividendes rend le barème plus favorable.",
      },
      {
        question: "8 000 € de capitaux : combien d'impôt au PFU ?",
        answer: "2 400 € au total (1 024 € d'IR + 1 376 € de PS), soit un net de 5 600 €.",
      },
      {
        question: "Le PEA est-il soumis à la flat tax ?",
        answer:
          "Non, après 5 ans de détente du PEA, les gains sont exonérés d'IR. Seuls les prélèvements sociaux de 17,2 % s'appliquent aux plus-values (pas aux dividendes réinvestis).",
      },
      {
        question: "Les prélèvements sociaux de 17,2 % sont-ils déductibles ?",
        answer:
          "Partiellement : 6,8 % de CSG sont déductibles si vous optez pour le barème. Au PFU, ils ne le sont pas.",
      },
      {
        question: "La flat tax s'applique-t-elle à l'assurance-vie ?",
        answer:
          "Les rachats sont fiscalisés selon des règles spécifiques (abattement après 8 ans, PFU ou barème au choix). Ce simulateur ne couvre pas l'assurance-vie.",
      },
      {
        question: "Puis-je mélanger PFU et barème ?",
        answer:
          "L'option barème est globale pour l'ensemble des revenus de capitaux de l'année. Vous ne pouvez pas choisir au cas par cas.",
      },
      {
        question: "Les plus-values immobilières sont-elles au PFU ?",
        answer:
          "Non. Les plus-values immobilières suivent un régime distinct avec abattements pour durée de détention et surtaxe éventuelle.",
      },
      {
        question: "Comment déclarer mes revenus de capitaux ?",
        answer:
          "Via le formulaire 2042 (cases 2DC pour dividendes, 2TR pour intérêts, etc.) ou le report automatique si vous acceptez le préremplissage.",
      },
    ]),
  },

  "micro-entrepreneur-charges": {
    content: buildRichContent({
      intro:
        "Estimez les charges sociales URSSAF et, le cas échéant, l'impôt libératoire d'un micro-entrepreneur (auto-entrepreneur) selon son chiffre d'affaires et son type d'activité.",
      definition:
        "Le régime micro-entrepreneur permet de payer des cotisations sociales proportionnelles au chiffre d'affaires encaissé, à des taux fixés par type d'activité. L'impôt libératoire est une option pour acquitter l'IR en même temps que les cotisations.",
      objectif:
        "Visualiser le poids des charges sur votre CA et le revenu net disponible après cotisations et impôt libératoire éventuel.",
      variables: [
        "Chiffre d'affaires annuel encaissé (€)",
        "Type d'activité (vente, BIC, BNC)",
        "Impôt libératoire (oui/non)",
      ],
      formules: [
        p("Charges sociales = CA × taux d'activité"),
        p("Taux : vente 12,3 % — BIC 21,2 % — BNC 24,6 %"),
        p("Impôt libératoire (si option) : vente 1 % — BIC 1,7 % — BNC 2,2 % du CA"),
        p("Net = CA − charges sociales − impôt libératoire"),
        hl(
          "Abattement fiscal",
          "En parallèle, un abattement forfaitaire s'applique sur le CA pour calculer l'impôt (71 % BIC, 50 % BNC, 71 % vente) — hors scope de ce simulateur."
        ),
      ],
      interpretation: [
        p("Les charges sont calculées sur le CA encaissé, indépendamment de vos dépenses réelles."),
        p("L'impôt libératoire remplace l'impôt sur le revenu classique : vérifiez qu'il est avantageux selon votre TMI."),
        hl(
          "Plafonds de CA",
          "77 700 € pour la vente, 188 700 € pour les prestations de services (2024). Au-delà, vous basculez vers un autre régime."
        ),
      ],
      limitesCalcul: [
        "CFE, taxe sur les véhicules de société et autres taxes non incluses",
        "ACRE (exonération partielle) non modélisée",
        "Impôt au barème (sans libératoire) non calculé",
        "Taux URSSAF 2024 — susceptibles de révision annuelle",
      ],
      example: {
        title: "35 000 € de CA en prestations BIC, sans impôt libératoire",
        donnees: [
          "Chiffre d'affaires annuel : 35 000 €",
          "Activité : prestations BIC",
          "Impôt libératoire : non",
        ],
        calcul: [
          "Charges sociales = 35 000 × 21,2 % = 7 420 €",
          "Impôt libératoire = 0 €",
          "Net après charges = 35 000 − 7 420 = 27 580 €",
        ],
        resultat: "Charges : 7 420 € — net après charges : 27 580 €.",
        interpretation:
          "En BIC, environ 21 % du CA part en cotisations sociales. L'impôt sur le revenu reste à payer séparément (via déclaration) si vous n'avez pas opté pour le libératoire.",
      },
      maillage: [
        { slug: "taux-marginal-imposition", label: "TMI — utile pour l'impôt libératoire" },
        { slug: "prelevement-a-la-source", label: "Acomptes et prélèvement à la source" },
        { slug: "flat-tax-30-pourcent", label: "Flat tax sur revenus financiers" },
      ],
      conseils: [
        "Versez vos cotisations chaque mois ou trimestre sur autoentrepreneur.urssaf.fr pour éviter les impayés.",
        "Comparez impôt libératoire et barème : le libératoire est intéressant si votre TMI dépasse ~12 %.",
        "Tenez un livre des recettes et conservez vos justificatifs pendant 10 ans.",
        "Surveillez votre CA pour ne pas dépasser les plafonds du régime micro.",
      ],
      limites: [
        "Ne calcule pas l'impôt au barème ni l'abattement forfaitaire micro.",
        "Exonérations (ACRE, ZFU…) non prises en compte.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Sur quoi sont calculées les charges du micro-entrepreneur ?",
        answer:
          "Sur le chiffre d'affaires encaissé, et non sur le bénéfice. Même si vos charges professionnelles sont élevées, le taux s'applique sur le CA total.",
      },
      {
        question: "Quels sont les taux de cotisations en 2024 ?",
        answer: "Vente de marchandises : 12,3 %. Prestations BIC : 21,2 %. Prestations BNC : 24,6 %.",
      },
      {
        question: "Qu'est-ce que l'impôt libératoire ?",
        answer:
          "Une option pour payer l'impôt sur le revenu en même temps que les cotisations URSSAF, à un taux fixe (1 % à 2,2 % du CA selon l'activité).",
      },
      {
        question: "35 000 € de CA BIC : combien de charges ?",
        answer: "Environ 7 420 € de cotisations sociales (21,2 %), soit un net de 27 580 € avant impôt sur le revenu.",
      },
      {
        question: "Quels sont les plafonds de chiffre d'affaires ?",
        answer:
          "77 700 € pour la vente et 188 700 € pour les prestations de services en 2024. Le dépassement entraîne une sortie du régime micro.",
      },
      {
        question: "Dois-je payer la TVA ?",
        answer:
          "En principe non, si vous bénéficiez de la franchise en base de TVA (seuils : 39 100 € vente, 77 700 € services). Au-delà, la TVA devient due.",
      },
      {
        question: "La CFE est-elle incluse ?",
        answer:
          "Non. La cotisation foncière des entreprises (CFE) est due chaque année, avec exonération la première année d'activité.",
      },
      {
        question: "L'ACRE réduit-t-elle mes cotisations ?",
        answer:
          "Oui, l'aide à la création ou reprise d'entreprise exonère partiellement les cotisations la première année. Ce simulateur n'intègre pas cette exonération.",
      },
      {
        question: "Impôt libératoire ou barème : que choisir ?",
        answer:
          "Le libératoire simplifie la gestion et peut être avantageux si votre TMI est élevé. Sinon, le barème avec abattement forfaitaire peut coûter moins cher.",
      },
      {
        question: "Comment déclarer mon CA ?",
        answer:
          "Déclaration mensuelle ou trimestrielle sur autoentrepreneur.urssaf.fr, plus la déclaration de revenus annuelle (formulaire 2042-C-PRO).",
      },
    ]),
  },

  "credit-impot-emploi-domicile": {
    content: buildRichContent({
      intro:
        "Estimez le crédit d'impôt de 50 % sur vos dépenses d'emploi à domicile : ménage, garde d'enfants, soutien scolaire et autres services éligibles.",
      definition:
        "Le crédit d'impôt pour l'emploi d'un salarié à domicile rembourse 50 % des dépenses engagées, dans la limite d'un plafond annuel. Contrairement à une réduction, il est versé même si vous n'êtes pas imposable.",
      objectif:
        "Quantifier l'économie fiscale liée à vos dépenses de services à la personne et comprendre le plafond applicable.",
      variables: [
        "Dépenses annuelles déclarées (€)",
        "Type de service (ménage, garde, soutien scolaire)",
      ],
      formules: [
        p("Dépenses retenues = min(Dépenses déclarées, 12 000 €)"),
        p("Crédit d'impôt = Dépenses retenues × 50 %"),
        hl(
          "Plafond majorable",
          "Le plafond de 12 000 € peut être augmenté (première année, enfant, invalidité…). Ici, seul le plafond standard est appliqué."
        ),
      ],
      interpretation: [
        p("Le crédit d'impôt est remboursé par l'administration, même sans impôt à payer."),
        p("Les dépenses au-delà de 12 000 € ne génèrent pas de crédit supplémentaire dans cette simulation."),
        hl(
          "CESU préfinancés",
          "Les CESU versés par votre employeur réduisent le crédit d'impôt. Utilisez le simulateur CESU pour affiner le calcul."
        ),
      ],
      limitesCalcul: [
        "Majorations de plafond (enfant, invalidité, première embauche) non appliquées",
        "CESU préfinancés non déduits",
        "Services non éligibles (travaux de gros œuvre…) exclus",
        "Condition de recours à un organisme agréé ou salarié déclaré non vérifiée",
      ],
      example: {
        title: "6 000 € de dépenses ménage par an",
        donnees: [
          "Dépenses annuelles déclarées : 6 000 €",
          "Type de service : ménage / repassage",
        ],
        calcul: [
          "Dépenses retenues = min(6 000, 12 000) = 6 000 €",
          "Crédit d'impôt = 6 000 × 50 % = 3 000 €",
        ],
        resultat: "Crédit d'impôt estimé : 3 000 €.",
        interpretation:
          "La moitié de vos dépenses ménage vous est remboursée sous forme de crédit d'impôt. Si vous payez 2 000 € d'impôt, le crédit le réduit à zéro et le surplus (1 000 €) vous est versé.",
      },
      maillage: [
        { slug: "cesu-credit-impot", label: "CESU et crédit d'impôt" },
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu" },
        { slug: "quotient-familial", label: "Quotient familial" },
      ],
      conseils: [
        "Employez un salarié déclaré (CESU, agence agréée) pour être éligible.",
        "Conservez factures et attestations : elles sont exigées en cas de contrôle.",
        "Déclarez vos dépenses sur la case 7DB du formulaire 2042.",
        "Croisez avec le simulateur CESU si vous utilisez des chèques préfinancés.",
      ],
      limites: [
        "Plafond standard uniquement, sans majorations.",
        "Ne vérifie pas l'éligibilité précise de chaque service.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quels services ouvrent droit au crédit d'impôt ?",
        answer:
          "Ménage, repassage, garde d'enfants de plus de 3 ans, soutien scolaire, assistance informatique, petits travaux de jardinage, aide aux personnes âgées…",
      },
      {
        question: "Quel est le taux du crédit d'impôt ?",
        answer: "50 % des dépenses éligibles, dans la limite du plafond annuel de 12 000 € de dépenses (crédit max 6 000 €).",
      },
      {
        question: "Le crédit est-il remboursé si je ne paie pas d'impôt ?",
        answer:
          "Oui. C'est un crédit d'impôt (et non une réduction) : l'administration vous rembourse le montant, même sans impôt dû.",
      },
      {
        question: "6 000 € de ménage : quel crédit ?",
        answer: "3 000 € de crédit d'impôt (50 % de 6 000 €).",
      },
      {
        question: "Le plafond de 12 000 € peut-il augmenter ?",
        answer:
          "Oui : +1 500 € par enfant à charge, +1 500 € en cas d'invalidité, majoration la première année d'emploi… Jusqu'à 15 000 € ou 20 000 € selon les cas.",
      },
      {
        question: "La garde d'enfant de moins de 3 ans est-elle éligible ?",
        answer:
          "Non via ce crédit. Les moins de 3 ans relèvent du crédit d'impôt garde d'enfant (case 7GA) avec des règles différentes.",
      },
      {
        question: "Dois-je utiliser un organisme agréé ?",
        answer:
          "Oui, ou employer directement un salarié à domicile avec déclaration URSSAF. Le travail au black n'ouvre aucun droit.",
      },
      {
        question: "Les CESU préfinancés impactent-ils le crédit ?",
        answer:
          "Oui. La part préfinancée par l'employeur ne génère pas de crédit d'impôt supplémentaire — vous avez déjà bénéficié d'un avantage.",
      },
      {
        question: "Où déclarer ces dépenses ?",
        answer: "Sur le formulaire 2042, case 7DB (services à la personne), avec le montant total des dépenses.",
      },
      {
        question: "Puis-je cumuler ménage et garde d'enfants ?",
        answer:
          "Oui, toutes les dépenses éligibles s'additionnent dans le plafond global de 12 000 € (sous réserve des majorations éventuelles).",
      },
    ]),
  },

  "impot-dividendes": {
    content: buildRichContent({
      intro:
        "Calculez l'impôt sur vos dividendes perçus : prélèvement forfaitaire unique (PFU 30 %) ou option barème progressif avec abattement de 40 %.",
      definition:
        "Les dividendes versés par une société à ses actionnaires sont soumis par défaut au PFU de 30 %. Le contribuable peut opter pour le barème progressif, qui applique un abattement de 40 % sur les dividendes avant imposition, majoré de prélèvements sociaux.",
      objectif:
        "Comparer le net perçu après PFU et après barème pour choisir l'option la plus avantageuse selon votre situation fiscale.",
      variables: [
        "Dividendes bruts annuels (€)",
        "Mode de fiscalité (PFU ou barème + abattement 40 %)",
        "Autres revenus nets imposables (€)",
        "Nombre de parts fiscales",
      ],
      formules: [
        p("PFU = Dividendes × 30 % (12,8 % IR + 17,2 % PS)"),
        p("Barème : base imposable = Dividendes × 60 % (après abattement 40 %)"),
        p("Impôt barème = impôt marginal sur dividendes + PS 17,2 % sur la base imposable"),
        hl(
          "Point de bascule",
          "Le barème est souvent préférable si votre TMI est à 11 % ou 0 %, surtout avec l'abattement de 40 %."
        ),
      ],
      interpretation: [
        p("La banque retient le PFU à la source. L'option barème se fait exclusivement sur la déclaration."),
        p("En mode comparaison, le simulateur recommande l'option la plus favorable entre PFU et barème simplifié."),
        hl(
          "Dividendes PEA",
          "Les dividendes réinvestis dans un PEA ne sont pas imposés tant que le plan n'est pas clôturé avant 5 ans."
        ),
      ],
      limitesCalcul: [
        "CSG déductible (6,8 %) au barème non incluse",
        "Crédit d'impôt étranger sur dividendes non modélisé",
        "Option barème globale (tous capitaux confondus) non rappelée en détail",
        "Dividendes via SCI ou holding : régimes spécifiques exclus",
      ],
      example: {
        title: "5 000 € de dividendes — PFU par défaut",
        donnees: [
          "Dividendes bruts : 5 000 €",
          "Fiscalité : PFU 30 %",
          "Autres revenus : 40 000 €, 2 parts (non utilisés en mode PFU)",
        ],
        calcul: [
          "IR = 5 000 × 12,8 % = 640 €",
          "PS = 5 000 × 17,2 % = 860 €",
          "PFU total = 5 000 × 30 % = 1 500 €",
          "Net = 5 000 − 1 500 = 3 500 €",
        ],
        resultat: "PFU : 1 500 € — net après impôt : 3 500 €.",
        interpretation:
          "Avec 40 000 € d'autres revenus et 2 parts, le barème pourrait être compétitif : activez la comparaison pour vérifier si l'abattement de 40 % vous fait économiser plus que le PFU.",
      },
      maillage: [
        { slug: "flat-tax-30-pourcent", label: "Flat tax 30 % — PFU général" },
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu" },
        { slug: "taux-marginal-imposition", label: "Taux marginal d'imposition" },
      ],
      conseils: [
        "Comparez PFU et barème chaque année sur la déclaration — l'option la plus favorable change selon vos revenus.",
        "Investissez via un PEA pour différer ou réduire la fiscalité sur les dividendes et plus-values.",
        "Vérifiez si des crédits d'impôt s'appliquent sur les dividendes étrangers.",
        "Conservez les avis de dividendes et relevés de compte titre pour la déclaration.",
      ],
      limites: [
        "Simulation simplifiée du barème avec abattement 40 %.",
        "Ne traite pas les dividendes reçus via des structures juridiques (SCI, SAS…).",
      ],
    }),
    faq: buildFaq([
      {
        question: "Les dividendes sont-ils taxés automatiquement au PFU ?",
        answer:
          "Oui, la banque ou la société verseur prélève le PFU de 30 % à la source. Vous pouvez opter pour le barème sur votre déclaration.",
      },
      {
        question: "Qu'est-ce que l'abattement de 40 % ?",
        answer:
          "En optant pour le barème, seuls 60 % des dividendes bruts sont soumis à l'impôt sur le revenu. Il s'ajoute aux prélèvements sociaux de 17,2 %.",
      },
      {
        question: "5 000 € de dividendes : combien au PFU ?",
        answer: "1 500 € d'impôt (30 %), soit 3 500 € nets.",
      },
      {
        question: "Quand le barème est-il plus intéressant ?",
        answer:
          "Quand votre TMI est faible (0 % ou 11 %) et que l'abattement de 40 % réduit suffisamment la base imposable pour compenser le PFU.",
      },
      {
        question: "Les dividendes PEA sont-ils imposés ?",
        answer:
          "Non tant que le PEA n'est pas clôturé avant 5 ans. Après 5 ans, seules les plus-values (pas les dividendes) supportent les PS de 17,2 %.",
      },
      {
        question: "Dois-je déclarer mes dividendes si le PFU a déjà été prélevé ?",
        answer:
          "Oui, sur le formulaire 2042 (case 2DC). Le préremplissage reprend généralement ces montants.",
      },
      {
        question: "La CSG déductible change-t-elle le calcul ?",
        answer:
          "Au barème, 6,8 % de CSG sont déductibles l'année suivante, ce qui améliore légèrement l'option barème. Non simulé ici.",
      },
      {
        question: "Dividendes de sociétés étrangères : même règles ?",
        answer:
          "Le PFU s'applique aussi, avec éventuel crédit d'impôt pour les retenues à la source étrangères. Les règles varient selon les conventions fiscales.",
      },
      {
        question: "Puis-je opter pour le barème sur une partie seulement ?",
        answer:
          "Non. L'option barème s'applique à l'ensemble de vos revenus de capitaux mobiliers de l'année.",
      },
      {
        question: "Quelle différence avec le simulateur flat tax ?",
        answer:
          "Ce simulateur intègre l'abattement de 40 % spécifique aux dividendes au barème, pour une comparaison PFU/barème plus précise.",
      },
    ]),
  },

  "taux-marginal-imposition": {
    content: buildRichContent({
      intro:
        "Identifiez votre taux marginal d'imposition (TMI) — la tranche dans laquelle est taxé votre dernier euro de revenu — et comparez-le à votre taux effectif.",
      definition:
        "Le taux marginal d'imposition (TMI) correspond à la tranche la plus élevée du barème progressif atteinte par votre revenu par part. Il indique le taux auquel serait taxé un euro supplémentaire de revenu imposable.",
      objectif:
        "Connaître votre TMI pour arbitrer entre PER, PFU, impôt libératoire ou autres leviers d'optimisation fiscale.",
      variables: [
        "Revenu net imposable annuel (€)",
        "Nombre de parts fiscales",
      ],
      formules: [
        p("Revenu par part = Revenu net ÷ Parts"),
        p("TMI = tranche du barème correspondant au revenu par part"),
        p("Taux effectif = Impôt total ÷ Revenu net × 100"),
        hl(
          "Tranches 2024",
          "0 % ≤ 11 294 € — 11 % ≤ 28 797 € — 30 % ≤ 82 341 € — 41 % ≤ 177 106 € — 45 % au-delà (par part)."
        ),
      ],
      interpretation: [
        p("Le TMI est toujours supérieur ou égal au taux effectif : les premiers euros sont taxés plus faiblement."),
        p("Un PER ou une déduction de 1 000 € vous fait économiser 1 000 € × TMI (si vous restez dans la même tranche)."),
        hl(
          "Usage pratique",
          "TMI à 30 % : le PFU (12,8 % IR) est moins avantageux que le barème pour les capitaux. TMI à 11 % : l'inverse."
        ),
      ],
      limitesCalcul: [
        "Prélèvements sociaux (CSG, etc.) non inclus dans le TMI",
        "Décote et plafonnement QF non appliqués",
        "Revenus exceptionnels (quotient) non traités",
        "Barème 2026 sur revenus 2025",
      ],
      example: {
        title: "60 000 € nets, 2 parts",
        donnees: [
          "Revenu net imposable : 60 000 €",
          "Nombre de parts : 2",
        ],
        calcul: [
          "Revenu par part = 60 000 ÷ 2 = 30 000 €",
          "30 000 € se situe entre 28 798 € et 82 341 € → TMI = 30 %",
          "Impôt estimé ≈ 4 572 €",
          "Taux effectif ≈ 7,6 %",
        ],
        resultat: "TMI : 30 % — taux effectif : ~7,6 %.",
        interpretation:
          "Votre dernier euro est taxé à 30 %, mais votre impôt moyen reste à 7,6 % grâce au barème progressif. Un versement PER de 3 000 € pourrait vous faire économiser environ 900 € d'impôt.",
      },
      maillage: [
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu — calcul complet" },
        { slug: "quotient-familial", label: "Quotient familial — nombre de parts" },
        { slug: "prelevement-a-la-source", label: "Prélèvement à la source" },
      ],
      conseils: [
        "Utilisez le TMI pour évaluer le gain d'un PER, d'une réduction ou d'un crédit d'impôt.",
        "Anticipez un changement de tranche en cas de hausse de revenus (prime, promotion, retraite).",
        "Croisez avec le simulateur flat tax pour arbitrer PFU vs barème sur vos capitaux.",
        "Consultez la case « Taux marginal d'imposition » sur votre avis d'imposition.",
      ],
      limites: [
        "TMI calculé sur le barème seul, hors prélèvements sociaux.",
        "Ne tient pas compte des revenus taxés à taux spécifiques (plus-values, PFU…).",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce que le taux marginal d'imposition (TMI) ?",
        answer:
          "C'est le taux de la tranche d'imposition dans laquelle se situe votre revenu par part. Il indique comment serait taxé un revenu supplémentaire.",
      },
      {
        question: "Quelle différence entre TMI et taux effectif ?",
        answer:
          "Le TMI concerne le dernier euro (ex. 30 %). Le taux effectif est la moyenne (impôt ÷ revenu, ex. 7,6 %). Le TMI est toujours ≥ au taux effectif.",
      },
      {
        question: "60 000 € pour 2 parts : quel TMI ?",
        answer:
          "Revenu par part = 30 000 €, ce qui place le foyer dans la tranche à 30 %. Le taux effectif reste autour de 7,6 %.",
      },
      {
        question: "Le TMI inclut-il les prélèvements sociaux ?",
        answer:
          "Non. Le TMI ne concerne que l'impôt sur le revenu. La CSG, CRDS et autres prélèvements sociaux s'ajoutent selon la nature des revenus.",
      },
      {
        question: "Comment le PER utilise-t-il le TMI ?",
        answer:
          "Les versements PER réduisent le revenu imposable. L'économie d'impôt ≈ montant versé × TMI (tant que vous restez dans la même tranche).",
      },
      {
        question: "TMI et flat tax : quel lien ?",
        answer:
          "Le PFU impose l'IR à 12,8 %. Si votre TMI est ≥ 30 %, le PFU est avantageux. Si TMI ≤ 11 %, le barème l'emporte souvent.",
      },
      {
        question: "Où trouver mon TMI officiel ?",
        answer:
          "Sur votre avis d'imposition, rubrique « Taux marginal d'imposition » ou « Taux moyen d'imposition ».",
      },
      {
        question: "Le TMI change-t-il en cours d'année ?",
        answer:
          "Il évolue avec vos revenus. Un bonus ou un changement de situation (mariage, enfant) peut vous faire changer de tranche.",
      },
      {
        question: "Un couple a-t-il un seul TMI ?",
        answer:
          "En imposition commune, un seul TMI est calculé sur le revenu par part du foyer. En imposition séparée, chaque conjoint a son propre TMI.",
      },
      {
        question: "Les tranches sont-elles indexées chaque année ?",
        answer:
          "Oui, les seuils du barème sont revalorisés chaque année pour tenir compte de l'inflation. Le simulateur utilise le barème 2024.",
      },
    ]),
  },

  "donation-numeraire": {
    content: buildRichContent({
      intro:
        "Estimez les droits de donation lors d'une transmission d'argent à un enfant, petit-enfant ou conjoint, en tenant compte des abattements renouvelables tous les 15 ans.",
      definition:
        "La donation en numéraire est un transfert gratuit de sommes d'argent. Elle est soumise aux droits de donation sauf si elle entre dans le cadre des abattements légaux, renouvelables tous les 15 ans par bénéficiaire et par donateur.",
      objectif:
        "Anticiper les droits de donation avant une transmission familiale et optimiser l'usage des abattements disponibles.",
      variables: [
        "Montant de la donation (€)",
        "Lien de parenté (enfant, petit-enfant, conjoint)",
        "Donations antérieures reçues du même donateur sur 15 ans (€)",
      ],
      formules: [
        p("Abattement enfant : 100 000 € — petit-enfant : 31 865 € — conjoint : exonération totale"),
        p("Abattement restant = Abattement − Donations antérieures (15 ans)"),
        p("Base taxable = max(0, Montant − Abattement restant)"),
        p("Droits = Base taxable × taux (20 % simplifié ici)"),
        hl(
          "Barème progressif",
          "En réalité, les droits suivent un barème de 5 % à 45 % par tranches. Ce simulateur applique un taux forfaitaire de 20 % sur la base taxable."
        ),
      ],
      interpretation: [
        p("Si la donation est inférieure à l'abattement restant, les droits sont nuls — mais la déclaration reste obligatoire."),
        p("Les donations antérieures du même donateur sur 15 ans consomment l'abattement avant le calcul."),
        hl(
          "Conjoint et partenaire",
          "Les donations entre conjoints ou partenaires de PACS sont totalement exonérées de droits de mutation."
        ),
      ],
      limitesCalcul: [
        "Barème progressif remplacé par un taux forfaitaire de 20 %",
        "Donations antérieures saisies manuellement (pas de lien avec l'administration)",
        "Donation-partage, démembrement et biens immobiliers exclus",
        "Abattements spécifiques (handicap, résidence principale) non traités",
      ],
      example: {
        title: "50 000 € donnés à un enfant, sans donation antérieure",
        donnees: [
          "Montant de la donation : 50 000 €",
          "Lien : parent → enfant",
          "Donations antérieures (15 ans) : 0 €",
        ],
        calcul: [
          "Abattement enfant = 100 000 €",
          "Abattement restant = 100 000 − 0 = 100 000 €",
          "Base taxable = max(0, 50 000 − 100 000) = 0 €",
          "Droits = 0 €",
        ],
        resultat: "Exonération totale — droits estimés : 0 €.",
        interpretation:
          "La donation de 50 000 € est entièrement couverte par l'abattement de 100 000 €. Vous devez néanmoins déclarer l'opération. Il reste 50 000 € d'abattement utilisable dans les 15 ans.",
      },
      maillage: [
        { slug: "quotient-familial", label: "Quotient familial" },
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu" },
        { slug: "cesu-credit-impot", label: "CESU crédit d'impôt" },
      ],
      conseils: [
        "Déclarez toute donation, même exonérée, auprès du service de l'enregistrement.",
        "Planifiez les transmissions pour utiliser les abattements tous les 15 ans.",
        "Pour les montants importants, consultez un notaire (donation-partage, démembrement).",
        "Conservez l'historique des donations pour calculer l'abattement restant.",
      ],
      limites: [
        "Taux forfaitaire simplifié, pas le barème progressif réel.",
        "Ne remplace pas un acte notarié ni un conseil en transmission.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Quel abattement pour une donation à un enfant ?",
        answer:
          "100 000 € par parent et par enfant, renouvelable tous les 15 ans. Chaque parent dispose de son propre abattement.",
      },
      {
        question: "50 000 € à mon enfant : combien de droits ?",
        answer:
          "0 € si vous n'avez fait aucune donation antérieure sur 15 ans. L'abattement de 100 000 € couvre intégralement le montant.",
      },
      {
        question: "La déclaration est-elle obligatoire même sans droits ?",
        answer:
          "Oui. Toute donation doit être déclarée au service de l'enregistrement dans un délai de 30 jours (ou 1 mois si acte notarié).",
      },
      {
        question: "Quel abattement pour un petit-enfant ?",
        answer: "31 865 € par grand-parent et par petit-enfant, renouvelable tous les 15 ans.",
      },
      {
        question: "Les donations entre conjoints sont-elles taxées ?",
        answer:
          "Non. Les donations entre époux ou partenaires de PACS bénéficient d'une exonération totale de droits de mutation.",
      },
      {
        question: "Qu'est-ce qu'une donation-partage ?",
        answer:
          "Un acte notarié qui transmet à plusieurs héritiers de manière définitive, avec abattements individuels. Idéal pour anticiper la succession.",
      },
      {
        question: "Les donations antérieures comptent-elles ?",
        answer:
          "Oui. Toute donation du même donateur au même bénéficiaire sur les 15 dernières années réduit l'abattement disponible.",
      },
      {
        question: "Un don manuel (espèces) est-il possible ?",
        answer:
          "Oui pour des sommes modestes, avec déclaration obligatoire. Au-delà de certains montants, un acte notarié est recommandé.",
      },
      {
        question: "Comment sont calculés les droits au-delà de l'abattement ?",
        answer:
          "Par un barème progressif de 5 % à 45 % selon le montant taxable et le lien de parenté. Ce simulateur applique 20 % par simplification.",
      },
      {
        question: "Donation ou succession : que choisir ?",
        answer:
          "La donation permet d'anticiper la transmission et d'utiliser les abattements de son vivant. La succession applique d'autres abattements (100 000 € par enfant également).",
      },
    ]),
  },

  "cesu-credit-impot": {
    content: buildRichContent({
      intro:
        "Calculez le crédit d'impôt lié à l'utilisation de chèques emploi service universel (CESU) pour des services à la personne à domicile.",
      definition:
        "Le CESU permet de rémunérer un salarié à domicile ou un organisme de services à la personne. Les dépenses payées en CESU ouvrent droit au crédit d'impôt de 50 %, sous réserve de plafonds et de déduction des CESU préfinancés.",
      objectif:
        "Estimer le crédit d'impôt net après prise en compte des CESU préfinancés par l'employeur ou la CAF, et comprendre l'interaction avec le plafond global.",
      variables: [
        "CESU utilisés dans l'année (€)",
        "CESU préfinancés par l'employeur ou la CAF (€)",
        "Dépenses totales en services à la personne (€)",
      ],
      formules: [
        p("Dépenses retenues = min(Dépenses totales, 12 000 €)"),
        p("Dépenses éligibles = max(0, Dépenses retenues − CESU préfinancés)"),
        p("Crédit théorique = Dépenses éligibles × 50 %"),
        p("Crédit retenu = min(Crédit théorique, CESU utilisés × 50 %)"),
        hl(
          "CESU préfinancés",
          "La part prise en charge par l'employeur ou la CAF ne génère pas de crédit d'impôt supplémentaire : l'avantage a déjà été obtenu."
        ),
      ],
      interpretation: [
        p("Le crédit est plafonné par les CESU réellement utilisés et par 50 % des dépenses éligibles."),
        p("Les CESU préfinancés réduisent la base sur laquelle le crédit est calculé."),
        hl(
          "Cumul avec crédit emploi à domicile",
          "Le crédit CESU s'inscrit dans le même dispositif que le crédit d'impôt emploi à domicile (plafond global de 12 000 €)."
        ),
      ],
      limitesCalcul: [
        "Majorations de plafond non appliquées",
        "Attestations et justificatifs non vérifiés",
        "CESU papier vs dématérialisé : même règle, non distingués",
        "Services non éligibles non filtrés automatiquement",
      ],
      example: {
        title: "3 000 € de CESU, 500 € préfinancés, 4 000 € de dépenses",
        donnees: [
          "CESU utilisés : 3 000 €",
          "CESU préfinancés : 500 €",
          "Dépenses totales services : 4 000 €",
        ],
        calcul: [
          "Dépenses retenues = min(4 000, 12 000) = 4 000 €",
          "Dépenses éligibles = 4 000 − 500 = 3 500 €",
          "Crédit théorique = 3 500 × 50 % = 1 750 €",
          "Crédit retenu = min(1 750, 3 000 × 50 %) = 1 500 €",
        ],
        resultat: "Crédit d'impôt CESU estimé : 1 500 €.",
        interpretation:
          "Sur 4 000 € de dépenses dont 500 € préfinancés, le crédit est limité à 1 500 € car vos CESU utilisés (3 000 €) plafonnent le crédit à 50 % de leur montant.",
      },
      maillage: [
        { slug: "credit-impot-emploi-domicile", label: "Crédit d'impôt emploi à domicile" },
        { slug: "impot-sur-le-revenu", label: "Impôt sur le revenu" },
        { slug: "donation-numeraire", label: "Donation en numéraire" },
      ],
      conseils: [
        "Conservez l'attestation annuelle de l'émetteur CESU pour votre déclaration.",
        "Déclarez le montant total des dépenses (case 7DB) et les CESU préfinancés reçus.",
        "Vérifiez que les services sont éligibles (ménage, garde, aide à domicile…).",
        "Croisez avec le simulateur crédit emploi à domicile pour une vue globale.",
      ],
      limites: [
        "Plafond standard sans majorations.",
        "Ne distingue pas les CESU papier des CESU dématérialisés.",
      ],
    }),
    faq: buildFaq([
      {
        question: "Qu'est-ce qu'un CESU ?",
        answer:
          "Le chèque emploi service universel sert à payer des services à la personne (ménage, garde, aide aux seniors) via un salarié ou un organisme agréé.",
      },
      {
        question: "Quel crédit d'impôt avec 3 000 € de CESU ?",
        answer:
          "Jusqu'à 1 500 € (50 % des CESU), selon vos dépenses éligibles et les CESU préfinancés éventuels.",
      },
      {
        question: "Les CESU préfinancés réduisent-ils le crédit ?",
        answer:
          "Oui. La part versée par l'employeur ou la CAF est soustraite des dépenses éligibles au crédit d'impôt.",
      },
      {
        question: "CESU papier ou dématérialisé : même fiscalité ?",
        answer:
          "Oui. Les deux ouvrent droit au crédit d'impôt de 50 % dans les mêmes conditions.",
      },
      {
        question: "Quels services peut-on payer en CESU ?",
        answer:
          "Ménage, repassage, garde d'enfants, soutien scolaire, aide aux personnes âgées, petits travaux de jardinage, assistance informatique…",
      },
      {
        question: "Le crédit est-il remboursé sans impôt à payer ?",
        answer:
          "Oui, comme tout crédit d'impôt : l'administration vous rembourse le montant même si vous n'êtes pas imposable.",
      },
      {
        question: "Quel est le plafond de dépenses ?",
        answer:
          "12 000 € par an (majorations possibles), soit un crédit maximum théorique de 6 000 € avant prise en compte des CESU préfinancés.",
      },
      {
        question: "Où déclarer mes CESU ?",
        answer:
          "Sur le formulaire 2042 : case 7DB pour les dépenses, et report des CESU préfinancés selon les instructions du préremplissage.",
      },
      {
        question: "Puis-je cumuler CESU et paiement direct ?",
        answer:
          "Oui. Toutes les dépenses éligibles (CESU ou paiement direct à un organisme agréé) entrent dans le plafond global.",
      },
      {
        question: "Mon employeur me verse des CESU : dois-je les déclarer ?",
        answer:
          "Oui. Les CESU préfinancés doivent être déclarés et réduisent le crédit d'impôt calculé sur vos dépenses personnelles.",
      },
    ]),
  },
};
