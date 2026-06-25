import type { FAQItem, SimulatorContent } from "../types";

export const mensualitePretContent: SimulatorContent = {
  sections: [
    {
      id: "comment-fonctionne",
      title: "Comment fonctionne ce calcul ?",
      subtitle:
        "Ce simulateur calcule la mensualité de votre crédit immobilier à partir du capital emprunté, du taux d'intérêt, de la durée de remboursement et, en option, du taux d'assurance emprunteur.",
      subsections: [
        {
          id: "role-mensualite",
          title: "La mensualité, chiffre central de votre projet",
          blocks: [
            {
              type: "paragraph",
              text: "La mensualité de crédit immobilier est le montant que vous rembourserez chaque mois à votre banque pendant toute la durée du prêt.",
            },
            {
              type: "list",
              title: "Elle influence directement :",
              items: [
                "Votre budget de vie une fois propriétaire",
                "Votre taux d'endettement (plafond de 35 %)",
                "Le montant total que vous pourrez emprunter",
              ],
            },
            {
              type: "paragraph",
              text: "Comprendre comment elle est calculée vous permet de comparer les offres bancaires et d'anticiper l'impact de chaque paramètre.",
            },
          ],
        },
        {
          id: "amortissement-constant",
          title: "L'amortissement à mensualités constantes",
          blocks: [
            {
              type: "paragraph",
              text: "Notre simulateur repose sur la formule de l'amortissement à mensualités constantes, la modalité la plus répandue en France pour les crédits immobiliers.",
            },
            {
              type: "paragraph",
              text: "Chaque mois, vous payez la même somme, mais la répartition entre capital et intérêts évolue : au début du prêt, une part importante sert à payer les intérêts ; progressivement, la part de capital remboursé augmente.",
            },
            {
              type: "paragraph",
              text: "C'est pourquoi le simulateur affiche aussi le capital remboursé dès le premier mois.",
            },
          ],
        },
        {
          id: "formule-calcul",
          title: "La formule de calcul",
          blocks: [
            {
              type: "paragraph",
              text: "Le calcul commence par la conversion du taux annuel en taux mensuel (taux annuel ÷ 12) et de la durée en nombre de mois (années × 12).",
            },
            {
              type: "highlight",
              title: "Formule de la mensualité",
              text: "M = C × t × (1 + t)^n / ((1 + t)^n − 1), où M est la mensualité, C le capital emprunté, t le taux mensuel et n le nombre de mois. Si le taux est nul, la mensualité = capital / nombre de mois.",
            },
          ],
        },
        {
          id: "assurance-emprunteur",
          title: "Mensualité hors assurance vs mensualité totale",
          blocks: [
            {
              type: "paragraph",
              text: "Le simulateur affiche d'abord la mensualité hors assurance, correspondant strictement au remboursement du capital et des intérêts.",
            },
            {
              type: "paragraph",
              text: "Ensuite, il ajoute une estimation de l'assurance emprunteur si vous renseignez un taux. L'assurance est calculée en appliquant un taux annuel sur le capital emprunté, puis en divisant par 12.",
            },
            {
              type: "paragraph",
              text: "En pratique, le coût de l'assurance varie selon l'âge, la santé et les garanties choisies.",
            },
          ],
        },
        {
          id: "impact-duree",
          title: "L'impact de la durée du prêt",
          blocks: [
            {
              type: "paragraph",
              text: "La durée du prêt est le levier le plus puissant sur la mensualité. Allonger de 20 à 25 ans réduit sensiblement l'échéance mensuelle, mais alourdit considérablement le coût total des intérêts.",
            },
            {
              type: "highlight",
              title: "Arbitrage central",
              text: "Réduire la durée augmente la mensualité mais diminue le surcoût du crédit. C'est un choix stratégique, particulièrement pour les primo-accédants disposant de revenus modestes.",
            },
          ],
        },
        {
          id: "impact-taux",
          title: "L'impact du taux d'intérêt",
          blocks: [
            {
              type: "paragraph",
              text: "Le taux d'intérêt a un impact direct et parfois sous-estimé. Une différence de 0,5 point sur un prêt de 250 000 € sur 20 ans peut représenter plusieurs milliers d'euros d'intérêts supplémentaires sur la durée totale.",
            },
            {
              type: "paragraph",
              text: "C'est pourquoi il est essentiel de comparer les offres de plusieurs banques et de négocier le taux, voire de faire appel à un courtier pour optimiser votre financement.",
            },
          ],
        },
        {
          id: "cout-total",
          title: "Visualiser le coût total du crédit",
          blocks: [
            {
              type: "paragraph",
              text: "Le simulateur calcule le coût total des intérêts sur la durée du prêt, le coût total de l'assurance et le coût global du crédit (capital + intérêts + assurance).",
            },
            {
              type: "highlight",
              title: "Exemple illustratif",
              text: "Un crédit immobilier de 250 000 € sur 25 ans à 3,5 % peut coûter plus de 125 000 € d'intérêts au total — un montant que la mensualité seule ne reflète pas.",
            },
          ],
        },
        {
          id: "taeg-vs-nominal",
          title: "Taux nominal vs TAEG",
          blocks: [
            {
              type: "paragraph",
              text: "Il est important de distinguer le taux nominal saisi dans le simulateur du TAEG (Taux Annuel Effectif Global).",
            },
            {
              type: "list",
              title: "Le TAEG inclut en plus :",
              items: [
                "Frais de dossier bancaire",
                "Garantie (hypothèque ou caution)",
                "Assurance obligatoire",
                "Éventuels frais de courtage",
              ],
            },
            {
              type: "paragraph",
              text: "Deux prêts au même taux nominal peuvent avoir des TAEG différents. Pour comparer des offres, demandez toujours le TAEG : c'est l'indicateur réglementaire de référence.",
            },
          ],
        },
        {
          id: "perimetre-simulateur",
          title: "Périmètre et utilisation du simulateur",
          blocks: [
            {
              type: "paragraph",
              text: "Ce simulateur ne prend pas en compte les variations de taux pour les prêts à taux variable ou les prêts relais. Il est conçu pour les crédits amortissables à taux fixe, qui représentent la grande majorité des financements immobiliers en France depuis la hausse des taux en 2022-2023.",
            },
            {
              type: "paragraph",
              text: "Si vous envisagez un prêt in fine ou un prêt avec différé de remboursement, les résultats ne s'appliqueront pas directement.",
            },
            {
              type: "paragraph",
              text: "Utilisez ce simulateur pour tester plusieurs combinaisons montant / durée / taux avant votre rendez-vous bancaire. Arrivez avec des chiffres précis, comparez l'impact d'un apport plus conséquent sur la mensualité, et vérifiez que l'échéance totale (crédit + assurance) reste compatible avec votre budget et le plafond d'endettement de 35 %.",
            },
          ],
        },
      ],
    },
    {
      id: "exemple-concret",
      title: "Exemple concret chiffré",
      subtitle:
        "Cas pratique : Thomas et Julie financent leur résidence principale.",
      subsections: [
        {
          id: "exemple-hypotheses",
          title: "Hypothèses du couple",
          blocks: [
            {
              type: "paragraph",
              text: "Thomas et Julie empruntent 250 000 € pour acquérir leur résidence principale. Leur banque leur propose un taux fixe de 3,5 % sur 20 ans. Ils estiment leur assurance emprunteur à 0,30 % du capital par an.",
            },
          ],
        },
        {
          id: "exemple-resultats",
          title: "Résultats du calcul",
          blocks: [
            {
              type: "steps",
              items: [
                {
                  label: "Mensualité hors assurance",
                  value: "~1 449 €",
                  detail:
                    "250 000 € à 3,5 % sur 240 mois — intérêts totaux : ~97 760 €",
                },
                {
                  label: "Assurance mensuelle",
                  value: "62,50 €",
                  detail:
                    "250 000 × 0,30 % / 12 — coût total assurance sur 20 ans : ~15 000 €",
                },
                {
                  label: "Mensualité totale",
                  value: "~1 511,50 €",
                  detail:
                    "Montant à comparer à vos revenus pour le taux d'endettement",
                },
                {
                  label: "Capital remboursé (1er mois)",
                  value: "~719 €",
                  detail: "Intérêts du 1er mois : ~729 € — la part capital augmente avec le temps",
                },
              ],
            },
          ],
        },
        {
          id: "exemple-comparaison",
          title: "Comparaison de durées",
          blocks: [
            {
              type: "highlight",
              title: "Durée 25 ans vs 20 ans",
              text: "En allongeant à 25 ans, la mensualité hors assurance tomberait à environ 1 252 €, mais le coût total des intérêts dépasserait 125 000 €. Ce type de comparaison aide à choisir la durée la plus adaptée à votre situation.",
            },
          ],
        },
      ],
    },
    {
      id: "conseils-limites",
      title: "Conseils et limites",
      subtitle:
        "Optimisez votre financement et connaissez les limites de l'outil.",
      subsections: [
        {
          id: "conseils-pratiques",
          title: "Conseils pratiques",
          blocks: [
            {
              type: "list",
              items: [
                "Comparez toujours le TAEG des offres bancaires, pas seulement le taux nominal.",
                "Testez plusieurs durées pour trouver le bon équilibre entre mensualité et coût total du crédit.",
                "Négociez l'assurance emprunteur : la délégation d'assurance peut réduire significativement le coût mensuel.",
                "Prévoyez une marge par rapport à votre budget : garder un reste à vivre confortable est aussi important que le taux d'endettement.",
                "Utilisez ce simulateur conjointement avec le calculateur de capacité d'emprunt pour valider la cohérence de votre projet.",
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
                "Les frais de dossier, de garantie (hypothèque ou caution) et de courtage ne sont pas inclus.",
                "Les prêts à taux variable, les prêts relais et les prêts in fine ne sont pas modélisés.",
                "Le taux d'assurance est une moyenne : votre tarif réel dépend de votre profil santé et de votre âge.",
                "Les modulations de mensualité et les remboursements anticipés ne sont pas simulés.",
                "Ce simulateur ne remplace pas une offre de prêt officielle émise par un établissement bancaire.",
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const mensualitePretFaq: FAQItem[] = [
  {
    question: "Comment est calculée la mensualité d'un crédit immobilier ?",
    blocks: [
      {
        type: "paragraph",
        text: "La mensualité est calculée selon la formule d'amortissement constant.",
      },
      {
        type: "highlight",
        title: "Formule",
        text: "Capital × taux mensuel × (1 + taux)^n / ((1 + taux)^n − 1), où n est le nombre de mois de remboursement.",
      },
    ],
  },
  {
    question: "Quelle durée de prêt choisir ?",
    blocks: [
      {
        type: "list",
        items: [
          "Durée plus longue → mensualité réduite, coût total des intérêts augmenté",
          "20 à 25 ans : durée la plus courante en France",
          "Au-delà de 25 ans : acceptation bancaire plus rare",
        ],
      },
    ],
  },
  {
    question: "Le taux affiché est-il le TAEG ?",
    blocks: [
      {
        type: "paragraph",
        text: "Non, ce simulateur utilise le taux d'intérêt nominal que vous renseignez.",
      },
      {
        type: "paragraph",
        text: "Le TAEG inclut en plus les frais de dossier, garanties et assurance obligatoire. Demandez toujours le TAEG à votre banque pour comparer les offres.",
      },
    ],
  },
  {
    question: "L'assurance emprunteur est-elle incluse ?",
    blocks: [
      {
        type: "paragraph",
        text: "Vous pouvez renseigner un taux d'assurance optionnel pour estimer la mensualité totale.",
      },
      {
        type: "paragraph",
        text: "L'assurance représente en moyenne 0,2 à 0,4 % du capital emprunté par an.",
      },
    ],
  },
  {
    question: "Pourquoi la mensualité est-elle identique chaque mois ?",
    blocks: [
      {
        type: "paragraph",
        text: "Le simulateur modélise un crédit à amortissement constant (mensualités fixes). C'est le type de crédit immobilier le plus courant en France.",
      },
      {
        type: "paragraph",
        text: "Seule la répartition capital/intérêts change au fil du temps.",
      },
    ],
  },
  {
    question: "Comment réduire ma mensualité de crédit immobilier ?",
    blocks: [
      {
        type: "list",
        items: [
          "Augmenter votre apport personnel",
          "Allonger la durée du prêt",
          "Négocier un taux d'intérêt plus bas",
          "Optimiser l'assurance emprunteur via une délégation d'assurance",
        ],
      },
    ],
  },
  {
    question: "Quelle part de la mensualité rembourse le capital ?",
    blocks: [
      {
        type: "paragraph",
        text: "Au début du prêt, les intérêts représentent la majorité de la mensualité.",
      },
      {
        type: "paragraph",
        text: "Le simulateur affiche le capital remboursé dès le premier mois. Cette part augmente progressivement au fil des années.",
      },
    ],
  },
  {
    question: "Puis-je simuler un remboursement anticipé ?",
    blocks: [
      {
        type: "paragraph",
        text: "Non, ce simulateur ne modélise pas les remboursements anticipés partiels ou totaux.",
      },
      {
        type: "paragraph",
        text: "Il calcule un échéancier standard sur toute la durée du prêt sans modification.",
      },
    ],
  },
  {
    question: "La mensualité inclut-elle les charges de copropriété ?",
    blocks: [
      {
        type: "paragraph",
        text: "Non. La mensualité affichée concerne uniquement le crédit immobilier (capital, intérêts et assurance emprunteur).",
      },
      {
        type: "list",
        title: "Budget mensuel complémentaire :",
        items: [
          "Charges de copropriété",
          "Taxe foncière",
          "Entretien et maintenance du logement",
        ],
      },
    ],
  },
  {
    question: "Ce simulateur est-il fiable pour comparer les offres bancaires ?",
    blocks: [
      {
        type: "paragraph",
        text: "Il fournit une estimation très proche pour les crédits à taux fixe amortissables.",
      },
      {
        type: "paragraph",
        text: "Pour une comparaison définitive, utilisez le TAEG et le tableau d'amortissement officiel remis par chaque banque.",
      },
    ],
  },
];
