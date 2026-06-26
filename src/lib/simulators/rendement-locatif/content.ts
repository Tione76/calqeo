import type { FAQItem, SimulatorContent } from "../types";

export const rendementLocatifContent: SimulatorContent = {
  sections: [
    {
      id: "comment-fonctionne",
      title: "Comment calculer le rendement locatif d'un bien ?",
      subtitle:
        "Ce simulateur mesure la rentabilité de votre investissement locatif en comparant les loyers perçus au coût total d'acquisition, puis en intégrant les charges et la vacance locative.",
      subsections: [
        {
          id: "indicateur-cle",
          title: "Le rendement locatif, indicateur clé de l'investissement",
          blocks: [
            {
              type: "paragraph",
              text: "Le rendement locatif est l'indicateur de référence pour évaluer un investissement immobilier destiné à la location. Il exprime, en pourcentage, la relation entre les revenus générés par le bien et l'argent investi pour l'acquérir.",
            },
            {
              type: "paragraph",
              text: "Avant de signer un compromis de vente, calculer ce ratio permet de comparer objectivement plusieurs biens, plusieurs villes ou différentes stratégies d'investissement.",
            },
          ],
        },
        {
          id: "brut-vs-net",
          title: "Rendement brut vs rendement net",
          blocks: [
            {
              type: "paragraph",
              text: "Notre simulateur distingue le rendement brut et le rendement net. Le rendement brut est le plus simple : il rapporte les loyers annuels au coût total de l'investissement, sans tenir compte des charges ni des périodes d'inoccupation.",
            },
            {
              type: "list",
              items: [
                "Rendement brut : premier filtre rapide, tend à surestimer la rentabilité",
                "Rendement net : vision réaliste après charges et vacance locative",
                "Cash-flow mensuel : ce qu'il reste chaque mois après déduction des charges",
              ],
            },
          ],
        },
        {
          id: "cout-investissement",
          title: "Qu'inclure dans le coût total d'investissement ?",
          blocks: [
            {
              type: "paragraph",
              text: "Le coût total de l'investissement inclut le prix d'achat, les frais de notaire et les travaux de rénovation éventuels.",
            },
            {
              type: "list",
              title: "Postes souvent sous-estimés :",
              items: [
                "Frais de notaire : environ 7 à 8 % du prix dans l'ancien",
                "Travaux de rénovation : un bien à 150 000 € + 30 000 € de travaux ≠ un bien clé en main à 150 000 €",
                "Frais d'agence si achat via intermédiaire",
              ],
            },
          ],
        },
        {
          id: "charges-recurrentes",
          title: "Les charges qui réduisent le rendement net",
          blocks: [
            {
              type: "paragraph",
              text: "Le rendement net affiné l'analyse en déduisant les charges annuelles récurrentes. Ces postes réduisent significativement le rendement affiché en annonce, parfois de 1 à 2 points de pourcentage.",
            },
            {
              type: "list",
              title: "Charges à intégrer :",
              items: [
                "Taxe foncière",
                "Charges de copropriété non récupérables",
                "Assurance propriétaire non occupant (PNO)",
                "Frais de gestion locative",
                "Entretien courant et petites réparations",
              ],
            },
          ],
        },
        {
          id: "vacance-locative",
          title: "La vacance locative : un paramètre de prudence",
          blocks: [
            {
              type: "paragraph",
              text: "Le simulateur intègre un taux de vacance locative, correspondant aux périodes sans locataire entre deux locations. Ce paramètre réduit le loyer annuel effectif avant déduction des charges.",
            },
            {
              type: "highlight",
              title: "Repères de vacance locative",
              text: "Même dans les marchés tendus, prévoir 3 à 5 % est prudent. Dans certaines zones moins dynamiques, un taux de 8 à 10 % peut être plus réaliste.",
            },
          ],
        },
        {
          id: "formules",
          title: "Les formules utilisées",
          blocks: [
            {
              type: "highlight",
              title: "Rendement brut",
              text: "(Loyer mensuel × 12) / Investissement total × 100",
            },
            {
              type: "highlight",
              title: "Rendement net",
              text: "((Loyer annuel effectif − Charges annuelles) / Investissement total) × 100 — le loyer annuel effectif intègre déjà la vacance locative.",
            },
            {
              type: "paragraph",
              text: "Un rendement brut de 6 % signifie que les loyers annuels représentent 6 % de l'argent investi. En rendement net, ce même bien peut afficher 4 % une fois les charges et la vacance déduites. C'est le rendement net qui se rapproche le plus de ce que vous percevrez réellement en poche, hors fiscalité et hors remboursement de crédit.",
            },
          ],
        },
        {
          id: "limites-indicateur",
          title: "Ce que le rendement locatif ne mesure pas",
          blocks: [
            {
              type: "paragraph",
              text: "Le rendement locatif ne capture pas l'ensemble de la performance d'un investissement immobilier.",
            },
            {
              type: "list",
              items: [
                "Plus-value potentielle à la revente",
                "Optimisation fiscale (régime réel, LMNP, déficit foncier)",
                "Effet de levier du crédit",
                "Impact de l'inflation sur la valeur du bien",
              ],
            },
            {
              type: "paragraph",
              text: "Un bien à faible rendement dans une grande ville peut néanmoins s'avérer intéressant sur le long terme grâce à la valorisation du patrimoine.",
            },
          ],
        },
        {
          id: "comparaison-biens",
          title: "Comment comparer des biens entre eux",
          blocks: [
            {
              type: "paragraph",
              text: "Le rendement locatif sert principalement à comparer des biens similaires entre eux, dans une même zone ou sur des marchés comparables.",
            },
            {
              type: "paragraph",
              text: "Un studio à 5,5 % brut à Toulouse n'est pas directement comparable à un immeuble de rapport à 9 % brut en zone rurale, car le profil de risque, la liquidité et le travail de gestion diffèrent fortement.",
            },
            {
              type: "paragraph",
              text: "Utilisez ce simulateur en amont de vos visites pour écarter les annonces hors critères, puis affinez vos hypothèses avec des chiffres réels : demandez la taxe foncière au vendeur, vérifiez les charges de copropriété, estimez les travaux avec des devis. Un calcul précis vaut mieux qu'une estimation optimiste qui conduirait à un investissement peu rentable.",
            },
          ],
        },
        {
          id: "erreurs-frequentes",
          title: "Erreurs fréquentes dans l'évaluation d'un investissement locatif",
          blocks: [
            {
              type: "list",
              items: [
                "Se fier au rendement brut sans intégrer taxe foncière, copropriété et vacance locative.",
                "Oublier les frais de notaire et de travaux dans le coût total d'acquisition.",
                "Comparer le rendement d'une grande ville à celui d'une zone rurale sans tenir compte du risque et de la liquidité.",
                "Ignorer le crédit : un bon rendement brut peut masquer un cash-flow négatif si la mensualité est élevée.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "exemple-concret",
      title: "Exemple de calcul de rendement locatif",
      subtitle:
        "Cas pratique : Marc investit dans un appartement locatif en province.",
      subsections: [
        {
          id: "exemple-hypotheses",
          title: "Hypothèses de l'investissement",
          blocks: [
            {
              type: "paragraph",
              text: "Marc souhaite acquérir un appartement destiné à la location. Le bien est affiché à 180 000 €. Il prévoit 14 400 € de frais de notaire (8 %) et 10 000 € de travaux de rafraîchissement.",
            },
            {
              type: "list",
              title: "Paramètres locatifs :",
              items: [
                "Loyer mensuel : 850 € charges locatives comprises",
                "Charges annuelles : 2 400 € (taxe foncière, copropriété, assurance PNO)",
                "Vacance locative retenue : 5 %",
              ],
            },
          ],
        },
        {
          id: "exemple-calculs",
          title: "Calculs détaillés",
          blocks: [
            {
              type: "steps",
              items: [
                {
                  label: "Investissement total",
                  value: "204 400 €",
                  detail: "180 000 + 14 400 + 10 000",
                },
                {
                  label: "Rendement brut",
                  value: "4,99 %",
                  detail: "(850 × 12) / 204 400 × 100 — loyers annuels : 10 200 €",
                },
                {
                  label: "Loyer annuel effectif",
                  value: "9 690 €",
                  detail: "10 200 × 95 % (vacance locative de 5 %)",
                },
                {
                  label: "Rendement net",
                  value: "3,57 %",
                  detail: "Revenu net annuel : 7 290 € (9 690 − 2 400)",
                },
              ],
            },
          ],
        },
        {
          id: "exemple-cashflow",
          title: "Cash-flow et financement",
          blocks: [
            {
              type: "highlight",
              title: "Cash-flow mensuel net : 607,50 €",
              text: "7 290 € / 12 mois. Si Marc finance une partie de l'acquisition par un crédit dont la mensualité dépasse ce montant, l'opération sera déficitaire en trésorerie chaque mois, même si le rendement net reste positif.",
            },
            {
              type: "paragraph",
              text: "C'est pourquoi le rendement locatif doit toujours être croisé avec un simulateur de mensualité de prêt.",
            },
          ],
        },
      ],
    },
    {
      id: "conseils-limites",
      title: "Conseils pour améliorer la rentabilité locative",
      subtitle:
        "Optimisez votre analyse et connaissez les limites de l'outil.",
      subsections: [
        {
          id: "conseils-pratiques",
          title: "Que faut-il savoir avant d'investir en locatif ?",
          blocks: [
            {
              type: "list",
              items: [
                "Intégrez systématiquement les frais de notaire et les travaux dans le coût total : ils pèsent souvent plusieurs points de rendement.",
                "Demandez le montant exact de la taxe foncière et le budget prévisionnel de copropriété avant d'acheter.",
                "Prévoyez une vacance locative réaliste, même si le marché locatif local semble tendu.",
                "Comparez le rendement net de plusieurs biens dans la même zone plutôt que le rendement brut des annonces.",
                "Croisez toujours ce résultat avec un calcul de mensualité si vous financez à crédit.",
              ],
            },
          ],
        },
        {
          id: "limites-simulateur",
          title: "Que ne mesure pas ce simulateur de rendement ?",
          blocks: [
            {
              type: "list",
              items: [
                "La fiscalité (impôt sur le revenu, prélèvements sociaux, amortissement LMNP) n'est pas incluse.",
                "La plus-value potentielle à la revente n'est pas prise en compte.",
                "Les travaux imprévus et les impayés de loyer ne sont pas modélisés.",
                "Le simulateur ne distingue pas les régimes fiscaux (micro-foncier, réel, LMNP).",
                "Les loyers meublés, colocation et locations saisonnières nécessitent des calculs spécifiques.",
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const rendementLocatifFaq: FAQItem[] = [
  {
    question: "Quelle est la différence entre rendement brut et net ?",
    blocks: [
      {
        type: "list",
        items: [
          "Rendement brut : loyers annuels / coût total d'acquisition, sans déduction",
          "Rendement net : charges récurrentes et vacance locative déduites",
        ],
      },
      {
        type: "paragraph",
        text: "Le rendement net offre une vision plus réaliste de ce que vous percevrez effectivement.",
      },
    ],
  },
  {
    question: "Quels frais inclure dans le coût total ?",
    blocks: [
      {
        type: "list",
        items: [
          "Prix d'achat du bien",
          "Frais de notaire (environ 7 à 8 % dans l'ancien)",
          "Travaux de rénovation",
          "Frais d'agence si achat via intermédiaire",
        ],
      },
    ],
  },
  {
    question: "Quel rendement locatif viser en 2025 ?",
    blocks: [
      {
        type: "list",
        items: [
          "Province : rendement brut de 5 à 8 % souvent considéré comme intéressant",
          "Zone tendue (Paris, Lyon, Bordeaux) : 2 à 4 % brut, valorisation patrimoniale en compensation",
        ],
      },
    ],
  },
  {
    question: "La vacance locative est-elle prise en compte ?",
    blocks: [
      {
        type: "paragraph",
        text: "Oui, le simulateur applique un taux de vacance locative que vous renseignez pour ajuster le loyer annuel effectif avant le calcul du rendement net.",
      },
    ],
  },
  {
    question: "Dois-je viser un rendement brut ou net ?",
    blocks: [
      {
        type: "paragraph",
        text: "Le rendement net est plus pertinent pour évaluer ce que vous percevrez réellement.",
      },
      {
        type: "paragraph",
        text: "Le rendement brut sert surtout à comparer rapidement des annonces entre elles lors de la phase de recherche.",
      },
    ],
  },
  {
    question: "Les charges de copropriété récupérables sur le locataire sont-elles incluses ?",
    blocks: [
      {
        type: "paragraph",
        text: "Le simulateur part du loyer hors charges locatives que vous percevez.",
      },
      {
        type: "paragraph",
        text: "Les charges non récupérables (taxe foncière, entretien des parties communes non récupérables) doivent figurer dans les charges annuelles.",
      },
    ],
  },
  {
    question: "Comment le crédit immobilier affecte-t-il la rentabilité ?",
    blocks: [
      {
        type: "paragraph",
        text: "Le rendement locatif mesure la performance du bien par rapport à l'investissement total.",
      },
      {
        type: "highlight",
        title: "Point clé",
        text: "Si vous empruntez, comparez le cash-flow net mensuel à votre mensualité de crédit pour vérifier l'équilibre financier de l'opération.",
      },
    ],
  },
  {
    question: "Un rendement net de 3 % est-il suffisant ?",
    blocks: [
      {
        type: "paragraph",
        text: "Cela dépend de vos objectifs, de la localisation et de votre fiscalité.",
      },
      {
        type: "list",
        items: [
          "Zone tendue : 3 % net peut être acceptable si la plus-value espérée est élevée",
          "Province : la plupart des investisseurs visent au minimum 4 à 5 % net",
        ],
      },
    ],
  },
  {
    question: "Faut-il inclure les frais de gestion locative ?",
    blocks: [
      {
        type: "paragraph",
        text: "Oui, si vous passez par une agence (généralement 6 à 8 % des loyers), intégrez ce coût dans les charges annuelles.",
      },
      {
        type: "paragraph",
        text: "Si vous gérez vous-même, vous pouvez l'omettre mais votre temps de gestion a aussi une valeur.",
      },
    ],
  },
  {
    question: "Ce simulateur convient-il à la location meublée (LMNP) ?",
    blocks: [
      {
        type: "paragraph",
        text: "Il fournit une base de calcul du rendement locatif, mais la location meublée implique des charges, des loyers et une fiscalité différents.",
      },
      {
        type: "paragraph",
        text: "Utilisez-le comme point de départ, puis affinez avec un expert-comptable.",
      },
    ],
  },
];
