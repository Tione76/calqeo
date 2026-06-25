import type { FAQItem, SimulatorContent } from "../types";

export const capaciteEmpruntContent: SimulatorContent = {
  sections: [
    {
      id: "comment-fonctionne",
      title: "Comment fonctionne ce calcul ?",
      subtitle:
        "Ce simulateur estime le montant maximal que vous pouvez emprunter en croisant vos revenus, vos charges existantes, le taux d'endettement retenu et les conditions du crédit (durée et taux d'intérêt). Il intègre aussi votre apport personnel pour estimer votre budget d'achat total.",
      subsections: [
        {
          id: "pourquoi-capacite",
          title: "Pourquoi calculer sa capacité d'emprunt ?",
          blocks: [
            {
              type: "paragraph",
              text: "La capacité d'emprunt est l'une des premières questions posées lors d'un projet immobilier. Avant même de visiter des biens, il est essentiel de connaître le budget réaliste que les banques sont susceptibles d'accepter.",
            },
            {
              type: "paragraph",
              text: "En France, l'approche dominante repose sur le taux d'endettement : la part de vos revenus consacrée au remboursement de vos crédits ne doit généralement pas dépasser 35 %, assurance emprunteur incluse dans l'analyse bancaire réelle.",
            },
          ],
        },
        {
          id: "etape-revenus",
          title: "Étape 1 — Calculer vos revenus disponibles",
          blocks: [
            {
              type: "paragraph",
              text: "Notre simulateur commence par calculer vos revenus disponibles, c'est-à-dire la différence entre vos revenus mensuels nets et vos charges mensuelles déjà engagées.",
            },
            {
              type: "list",
              title: "Charges à inclure dans le calcul :",
              items: [
                "Mensualités de crédits en cours (auto, consommation, immobilier…)",
                "Pensions alimentaires versées",
                "Autres engagements réguliers retenus par la banque",
              ],
            },
            {
              type: "paragraph",
              text: "Plus vos charges existantes sont élevées, plus votre marge de manœuvre diminue.",
            },
          ],
        },
        {
          id: "etape-endettement",
          title: "Étape 2 — Appliquer le taux d'endettement",
          blocks: [
            {
              type: "paragraph",
              text: "À partir de ces revenus disponibles, le simulateur applique le taux d'endettement que vous renseignez — 35 % par défaut, conformément à la recommandation du Haut Conseil de stabilité financière (HCSF).",
            },
            {
              type: "paragraph",
              text: "Le résultat obtenu correspond à la mensualité maximale théorique que vous pourriez consacrer à un nouveau crédit immobilier, hors assurance emprunteur dans notre calcul.",
            },
            {
              type: "highlight",
              title: "Repère réglementaire",
              text: "Le plafond de 35 % d'endettement s'applique à l'ensemble des charges de crédit du foyer, nouveau prêt inclus. Certaines banques appliquent des règles plus strictes selon le profil emprunteur.",
            },
          ],
        },
        {
          id: "etape-capital",
          title: "Étape 3 — Convertir la mensualité en capital empruntable",
          blocks: [
            {
              type: "paragraph",
              text: "Cette mensualité maximale est ensuite convertie en capital empruntable grâce à la formule standard de l'amortissement d'un crédit à mensualités constantes.",
            },
            {
              type: "list",
              title: "Impact de la durée et du taux :",
              items: [
                "Durée plus longue → capital empruntable plus élevé à mensualité égale",
                "Taux d'intérêt plus élevé → capacité d'emprunt réduite",
                "Deux emprunteurs aux revenus identiques n'obtiendront pas la même capacité selon leurs conditions de crédit",
              ],
            },
            {
              type: "highlight",
              title: "Formule d'amortissement",
              text: "M = C × t × (1 + t)^n / ((1 + t)^n − 1), où M est la mensualité, C le capital, t le taux mensuel et n le nombre de mois. Si le taux est nul, la mensualité se calcule en divisant le capital par le nombre de mois.",
            },
          ],
        },
        {
          id: "etape-apport",
          title: "Étape 4 — Intégrer votre apport personnel",
          blocks: [
            {
              type: "paragraph",
              text: "La capacité d'emprunt ne dépend pas directement de votre apport : elle est calculée uniquement à partir de vos revenus et de votre taux d'endettement. En revanche, l'apport personnel est indispensable pour estimer le budget d'achat réellement accessible.",
            },
            {
              type: "list",
              title: "Ce que le simulateur calcule avec votre apport :",
              items: [
                "Budget d'achat total = capacité d'emprunt + apport personnel",
                "Prix du bien accessible (estimation) = budget total ÷ 1,08 (frais de notaire ~8 % dans l'ancien)",
                "Part de l'apport dans le financement global du projet",
              ],
            },
            {
              type: "highlight",
              title: "Bon à savoir",
              text: "Un apport plus conséquent n'augmente pas la mensualité maximale autorisée, mais il élargit l'enveloppe globale pour viser un bien plus cher ou absorber les frais de notaire sans sur-emprunter.",
            },
          ],
        },
        {
          id: "indicateurs-complementaires",
          title: "Indicateurs complémentaires affichés",
          blocks: [
            {
              type: "paragraph",
              text: "Le simulateur affiche également le coût total des intérêts sur la durée du prêt, le coût global du crédit (capital + intérêts), ainsi que le budget d'achat total et une estimation du prix du bien accessible une fois votre apport renseigné.",
            },
            {
              type: "paragraph",
              text: "Ces indicateurs permettent de comprendre que la capacité d'emprunt n'est pas qu'une question de revenus : les conditions de financement et votre apport influencent fortement le projet final.",
            },
          ],
        },
        {
          id: "analyse-bancaire",
          title: "Ce que la banque regarde au-delà des chiffres",
          blocks: [
            {
              type: "paragraph",
              text: "Il est important de distinguer cette estimation d'une acceptation bancaire automatique. Les établissements de crédit examinent aussi la nature et la stabilité de vos revenus, votre apport personnel, la localisation du bien, votre épargne résiduelle après achat, et votre profil d'emprunteur.",
            },
            {
              type: "paragraph",
              text: "Un salarié en CDI et un travailleur indépendant avec des revenus fluctuants ne seront pas évalués de la même manière, même avec un taux d'endettement identique sur le papier.",
            },
          ],
        },
        {
          id: "capacite-vs-budget",
          title: "Capacité d'emprunt et budget d'achat",
          blocks: [
            {
              type: "paragraph",
              text: "La capacité d'emprunt correspond au montant du crédit que la banque peut accorder selon vos revenus. Le budget d'achat, lui, additionne ce crédit et votre apport personnel pour estimer ce que vous pouvez consacrer à l'acquisition.",
            },
            {
              type: "highlight",
              title: "Formule du budget d'achat",
              text: "Budget d'achat total = capacité d'emprunt + apport personnel. Le prix du bien accessible est ensuite estimé en déduisant les frais de notaire (~8 % dans l'ancien).",
            },
            {
              type: "list",
              title: "Autres frais à anticiper :",
              items: [
                "Frais de garantie (hypothèque ou caution)",
                "Frais de dossier bancaire",
                "Éventuels travaux après acquisition",
              ],
            },
            {
              type: "paragraph",
              text: "Un emprunt de 200 000 € avec un apport de 30 000 € représente un budget d'achat de 230 000 €, soit un prix de bien estimé autour de 213 000 € hors frais de notaire.",
            },
          ],
        },
        {
          id: "assurance-non-incluse",
          title: "Assurance emprunteur : un poste non inclus",
          blocks: [
            {
              type: "highlight",
              title: "Point important",
              text: "Ce simulateur ne prend pas en compte l'assurance emprunteur, qui peut représenter plusieurs centaines d'euros par an selon votre âge, votre état de santé et le capital emprunté. En pratique, les banques intègrent cette charge dans le calcul du taux d'endettement.",
              variant: "warning",
            },
            {
              type: "paragraph",
              text: "C'est pourquoi la capacité affichée ici constitue une estimation optimiste : prévoyez une marge de sécurité de 5 à 10 % par rapport au montant obtenu pour rester dans une zone confortable.",
            },
            {
              type: "paragraph",
              text: "Utilisez ce simulateur comme un outil de préparation : testez plusieurs durées, faites varier le taux d'intérêt pour anticiper une hausse des taux, ajustez votre apport personnel et le taux d'endettement si vous souhaitez simuler un profil plus conservateur. L'objectif est de vous donner une vision chiffrée et pédagogique de votre projet, avant de solliciter un courtier ou votre banque pour une étude personnalisée.",
            },
          ],
        },
      ],
    },
    {
      id: "exemple-concret",
      title: "Exemple concret chiffré",
      subtitle:
        "Cas pratique : Sophie, salariée en CDI, souhaite acheter sa résidence principale.",
      subsections: [
        {
          id: "exemple-profil",
          title: "Profil et hypothèses de Sophie",
          blocks: [
            {
              type: "paragraph",
              text: "Sophie perçoit 3 500 € nets par mois. Elle rembourse encore un crédit auto à hauteur de 250 € par mois. Elle dispose d'un apport personnel de 30 000 €. Elle estime pouvoir obtenir un taux de 3,5 % sur 20 ans et retient le plafond d'endettement de 35 %.",
            },
          ],
        },
        {
          id: "exemple-calcul",
          title: "Déroulement du calcul",
          blocks: [
            {
              type: "steps",
              items: [
                {
                  label: "Étape 1 — Revenus disponibles",
                  value: "3 250 €",
                  detail:
                    "3 500 € − 250 € de charges mensuelles existantes",
                },
                {
                  label: "Étape 2 — Mensualité maximale",
                  value: "1 137,50 €",
                  detail: "3 250 € × 35 % de taux d'endettement",
                },
                {
                  label: "Étape 3 — Capacité d'emprunt",
                  value: "~198 000 €",
                  detail:
                    "À 3,5 % sur 20 ans (240 mois), coût total des intérêts : ~75 000 €",
                },
                {
                  label: "Étape 4 — Apport personnel",
                  value: "30 000 €",
                  detail: "Épargne disponible pour le projet d'achat",
                },
                {
                  label: "Étape 5 — Budget d'achat total",
                  value: "~228 000 €",
                  detail: "198 000 € de crédit + 30 000 € d'apport",
                },
                {
                  label: "Étape 6 — Prix du bien accessible",
                  value: "~211 000 €",
                  detail:
                    "Estimation hors frais de notaire (~17 000 €, soit ~8 %)",
                },
              ],
            },
          ],
        },
        {
          id: "exemple-budget",
          title: "Du crédit au budget d'achat",
          blocks: [
            {
              type: "paragraph",
              text: "Grâce à son apport de 30 000 €, Sophie dispose d'un budget d'achat total d'environ 228 000 €. Le simulateur estime qu'elle peut viser un bien affiché autour de 211 000 €, les frais de notaire (~17 000 €) étant prélevés sur cette enveloppe globale.",
            },
            {
              type: "highlight",
              title: "Comparaison de durées",
              text: "En réduisant la durée à 15 ans, sa capacité d'emprunt tomberait à environ 165 000 € et son budget d'achat à ~195 000 € (avec le même apport). Elle payerait moins d'intérêts au total. Ce type de comparaison illustre l'intérêt de simuler plusieurs scénarios avant de fixer son budget.",
            },
          ],
        },
      ],
    },
    {
      id: "conseils-limites",
      title: "Conseils et limites",
      subtitle:
        "Quelques repères pour interpréter vos résultats et éviter les erreurs courantes.",
      subsections: [
        {
          id: "conseils-pratiques",
          title: "Conseils pratiques",
          blocks: [
            {
              type: "list",
              items: [
                "Retenez uniquement des revenus stables et justifiables : salaire net, pensions, revenus locatifs existants perçus régulièrement.",
                "Renseignez votre apport réellement disponible : épargne liquide, donation, épargne salariale — hors réserve de sécurité.",
                "Simulez un taux d'intérêt légèrement supérieur au taux affiché par votre banque pour intégrer une marge de prudence.",
                "Gardez une épargne de précaution après l'achat : les banques apprécient les profils disposant de 6 à 12 mois de charges en réserve.",
                "Comparez plusieurs durées de prêt : une durée plus courte réduit le coût total du crédit, mais diminue la capacité d'emprunt.",
                "Pensez à ajouter l'assurance emprunteur dans votre réflexion : elle réduit la capacité réelle de 3 à 8 % selon les profils.",
              ],
            },
          ],
        },
        {
          id: "limites-simulateur",
          title: "Limites du simulateur",
          blocks: [
            {
              type: "list",
              items: [
                "L'assurance emprunteur n'est pas incluse dans le calcul de la mensualité maximale.",
                "L'estimation du prix du bien accessible repose sur des frais de notaire moyens (~8 % dans l'ancien) : le montant réel peut varier.",
                "Les revenus variables (primes, commissions, BNC fluctuants) ne sont pas lissés sur plusieurs années.",
                "Les critères spécifiques de chaque banque (reste à vivre, apport minimum, type de bien) ne sont pas modélisés.",
                "Ce simulateur ne remplace pas une étude de faisabilité réalisée par un courtier ou un conseiller bancaire.",
                "Les dispositifs d'aide (PTZ, prêts action logement) et le co-emprunt ne sont pas pris en compte.",
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const capaciteEmpruntFaq: FAQItem[] = [
  {
    question: "Comment est calculée la capacité d'emprunt ?",
    blocks: [
      {
        type: "paragraph",
        text: "La capacité d'emprunt repose sur trois piliers : vos revenus nets mensuels, vos charges existantes et le taux d'endettement maximal autorisé (généralement 35 %).",
      },
      {
        type: "list",
        title: "Les étapes du calcul :",
        ordered: true,
        items: [
          "Revenus disponibles = revenus nets − charges mensuelles",
          "Mensualité max = revenus disponibles × taux d'endettement",
          "Capacité d'emprunt = conversion de la mensualité en capital via la formule d'amortissement",
          "Budget d'achat = capacité d'emprunt + apport personnel",
        ],
      },
    ],
  },
  {
    question: "Quel taux d'endettement utiliser dans le simulateur ?",
    blocks: [
      {
        type: "paragraph",
        text: "En France, les banques appliquent le plus souvent un plafond de 35 % d'endettement, charges de crédit incluses.",
      },
      {
        type: "paragraph",
        text: "Vous pouvez réduire ce taux dans le simulateur pour obtenir une estimation plus prudente, notamment si vous souhaitez conserver une marge de manœuvre confortable.",
      },
    ],
  },
  {
    question: "Les revenus pris en compte incluent-ils les primes ?",
    blocks: [
      {
        type: "paragraph",
        text: "Les banques retiennent généralement les revenus stables et récurrents. Les primes variables ou exceptionnelles ne sont pas toujours intégrées à 100 %.",
      },
      {
        type: "highlight",
        title: "Conseil",
        text: "Pour une estimation prudente, n'indiquez que vos revenus réguliers et vérifiables sur plusieurs mois.",
      },
    ],
  },
  {
    question: "Ce calcul inclut-il l'assurance emprunteur ?",
    blocks: [
      {
        type: "paragraph",
        text: "Non, ce simulateur estime la mensualité de remboursement du capital et des intérêts uniquement.",
      },
      {
        type: "paragraph",
        text: "L'assurance emprunteur (souvent 0,2 à 0,4 % du capital par an) vient s'ajouter et réduit légèrement votre capacité réelle aux yeux de la banque.",
      },
    ],
  },
  {
    question: "Quelle est la différence entre capacité d'emprunt et budget d'achat ?",
    blocks: [
      {
        type: "list",
        items: [
          "Capacité d'emprunt = montant du crédit que vous pouvez obtenir selon vos revenus",
          "Apport personnel = épargne que vous consacrez au projet",
          "Budget d'achat = capacité d'emprunt + apport personnel",
          "Prix du bien accessible = budget d'achat ÷ 1,08 (estimation avec frais de notaire ~8 %)",
        ],
      },
    ],
  },
  {
    question: "Pourquoi la durée du prêt influence-t-elle la capacité d'emprunt ?",
    blocks: [
      {
        type: "paragraph",
        text: "Plus la durée est longue, plus le nombre de mensualités est élevé, ce qui permet d'emprunter un capital plus important à mensualité constante.",
      },
      {
        type: "highlight",
        title: "À retenir",
        text: "En contrepartie, le coût total des intérêts augmente significativement avec la durée.",
        variant: "warning",
      },
    ],
  },
  {
    question: "Un couple peut-il cumuler ses revenus pour le calcul ?",
    blocks: [
      {
        type: "paragraph",
        text: "Oui, en cas de co-emprunt, les banques additionnent les revenus des co-emprunteurs et leurs charges respectives.",
      },
      {
        type: "paragraph",
        text: "Indiquez la somme des revenus nets et la totalité des charges mensuelles du foyer dans le simulateur.",
      },
    ],
  },
  {
    question: "Comment l'apport personnel affecte-t-il mon projet ?",
    blocks: [
      {
        type: "paragraph",
        text: "L'apport personnel n'augmente pas la capacité d'emprunt calculée sur vos revenus, mais il élargit directement votre budget d'achat total dans le simulateur.",
      },
      {
        type: "list",
        items: [
          "Budget d'achat = crédit empruntable + apport personnel",
          "Un apport de 10 à 20 % du projet est souvent attendu par les banques",
          "Un apport conséquent améliore aussi votre profil emprunteur aux yeux de la banque",
        ],
      },
    ],
  },
  {
    question: "Les crédits renouvelables sont-ils pris en compte ?",
    blocks: [
      {
        type: "paragraph",
        text: "Oui, les banques retiennent les mensualités de tous les crédits en cours, y compris les crédits renouvelables, même si le capital restant dû est faible.",
      },
      {
        type: "paragraph",
        text: "Renseignez l'ensemble de vos charges mensuelles pour obtenir une estimation réaliste.",
      },
    ],
  },
  {
    question: "Ce simulateur garantit-il l'accord de ma banque ?",
    blocks: [
      {
        type: "paragraph",
        text: "Non. Il fournit une estimation indicative basée sur les règles de calcul standard.",
      },
      {
        type: "paragraph",
        text: "L'accord final dépend de l'analyse complète de votre dossier par l'établissement prêteur : stabilité professionnelle, épargne résiduelle, localisation du bien, etc.",
      },
    ],
  },
];
